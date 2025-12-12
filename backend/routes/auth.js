import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import { sendOTPEmail } from '../services/emailService.js';

const router = express.Router();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hash OTP for secure storage
const hashOTP = async (otp) => {
  return await bcrypt.hash(otp, 10);
};

// Verify OTP
const verifyOTP = async (otp, hashedOTP) => {
  return await bcrypt.compare(otp, hashedOTP);
};

// Send OTP endpoint
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid email address' 
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Rate limiting: Check if too many requests in last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentOTPs = await OTP.countDocuments({
      email: normalizedEmail,
      createdAt: { $gte: oneHourAgo }
    });

    if (recentOTPs >= 5) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    }

    // Generate OTP
    const otpCode = generateOTP();
    const hashedOTP = await hashOTP(otpCode);

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email: normalizedEmail });

    // Create new OTP
    const otp = new OTP({
      email: normalizedEmail,
      code: otpCode, // Store plain text temporarily for email (will be deleted after sending)
      hashedCode: hashedOTP,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    await otp.save();

    // Send OTP via email
    try {
      await sendOTPEmail(normalizedEmail, otpCode);
      console.log('✅ OTP email sent successfully to:', normalizedEmail);
    } catch (emailError) {
      console.error('❌ Email sending error in auth route:');
      console.error('   Error code:', emailError.code);
      console.error('   Error message:', emailError.message);
      console.error('   Full error:', emailError);
      await OTP.deleteOne({ _id: otp._id });
      return res.status(500).json({
        success: false,
        message: `Failed to send email: ${emailError.message || 'Please check your email configuration and try again.'}`
      });
    }

    // Remove plain text OTP from database (security)
    await OTP.updateOne(
      { _id: otp._id },
      { $unset: { code: '' } }
    );

    res.json({
      success: true,
      message: 'Verification code sent to your email',
      expiresIn: 600 // 10 minutes in seconds
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, name } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otpCode = otp.toString().trim();

    // Find OTP record
    const otpRecord = await OTP.findOne({ email: normalizedEmail });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }

    // Check if expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new one.'
      });
    }

    // Check attempts
    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new code.'
      });
    }

    // Verify OTP
    const isValid = await verifyOTP(otpCode, otpRecord.hashedCode);

    if (!isValid) {
      // Increment attempts
      await OTP.updateOne(
        { _id: otpRecord._id },
        { $inc: { attempts: 1 } }
      );

      return res.status(400).json({
        success: false,
        message: 'Invalid verification code',
        attemptsLeft: 5 - (otpRecord.attempts + 1)
      });
    }

    // OTP is valid - delete it
    await OTP.deleteOne({ _id: otpRecord._id });

    // Check if user exists
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Create new user with name
      user = new User({
        email: normalizedEmail,
        name: name.trim(),
        lastLogin: new Date()
      });
      await user.save();
    } else {
      // Update existing user's name if provided and last login
      if (name && name.trim()) {
        user.name = name.trim();
      }
      user.lastLogin = new Date();
      await user.save();
    }

    // In production, you'd generate a JWT token here
    // For now, we'll return user data
    res.json({
      success: true,
      message: 'Verification successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

export default router;

