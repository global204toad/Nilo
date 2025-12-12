import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import itemRoutes from './routes/items.js';
import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import checkoutRoutes from './routes/checkout.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test email endpoint (for debugging)
app.get('/api/test-email', async (req, res) => {
  try {
    const { sendOTPEmail } = await import('./services/emailService.js');
    const testEmail = req.query.email || 'aliashrafosman777@gmail.com';
    const testOTP = '123456';
    
    console.log('🧪 Testing email configuration...');
    console.log('   EMAIL_HOST:', process.env.EMAIL_HOST);
    console.log('   EMAIL_PORT:', process.env.EMAIL_PORT);
    console.log('   EMAIL_USER:', process.env.EMAIL_USER);
    console.log('   EMAIL_PASS:', process.env.EMAIL_PASS ? '***' : 'NOT SET');
    
    await sendOTPEmail(testEmail, testOTP);
    
    res.json({
      success: true,
      message: `Test email sent to ${testEmail}. Please check your inbox and spam folder.`,
      config: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
        passSet: !!process.env.EMAIL_PASS
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message,
      details: {
        code: error.code,
        command: error.command,
        response: error.response
      }
    });
  }
});

// Routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Welcome to Nilo API' });
});

app.use('/api/items', itemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nilo');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

