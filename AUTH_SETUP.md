# Email + OTP Authentication Setup Guide

## Overview
This authentication system allows users to sign up or sign in using only their email address. After entering their email, users receive a one-time verification code (OTP) via email to complete authentication.

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

This will install:
- `bcryptjs` - For hashing OTPs securely
- `nodemailer` - For sending emails

### 2. Configure Environment Variables
Create a `.env` file in the `backend` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/nilo

# Server Port
PORT=5000

# Email Configuration
# Option 1: Gmail (for development/testing)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-gmail-app-password

# Option 2: SMTP (for production - SendGrid, Mailgun, etc.)
# EMAIL_SERVICE=smtp
# SMTP_HOST=smtp.sendgrid.net
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=apikey
# SMTP_PASSWORD=your-sendgrid-api-key

# Email From Address
EMAIL_FROM=NILO <noreply@nilo.com>
```

### 3. Gmail Setup (For Development)
If using Gmail:
1. Enable 2-Step Verification on your Google account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Create a new app password for "Mail"
   - Use this password in `EMAIL_APP_PASSWORD`

### 4. Production Email Service (Recommended)
For production, use a service like:
- **SendGrid**: Free tier available, easy setup
- **Mailgun**: Good for transactional emails
- **AWS SES**: Cost-effective for high volume

## Frontend Setup

### 1. Access the Login Page
Navigate to: `http://localhost:3000/login`

### 2. User Flow
1. **Email Step**: User enters their email address
2. **OTP Step**: User receives a 6-digit code via email and enters it
3. **Success**: User is logged in and redirected to home page

## API Endpoints

### POST `/api/auth/send-otp`
Sends a verification code to the provided email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification code sent to your email",
  "expiresIn": 600
}
```

### POST `/api/auth/verify-otp`
Verifies the OTP code and logs in/creates the user.

**Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification successful",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

## Features

✅ **Security**
- OTPs are hashed before storage
- OTPs expire after 10 minutes
- Rate limiting (max 5 requests per hour per email)
- Maximum 5 verification attempts per OTP

✅ **User Experience**
- Clean, responsive UI
- Real-time countdown timer
- Resend OTP functionality
- Clear error messages
- Auto-focus on input fields

✅ **Email Template**
- Professional NILO-branded email
- Clear code display
- Expiration time shown
- Mobile-friendly design

## Testing

### Development Mode
If no email service is configured, the system will log emails to the console instead of sending them. Check your backend console for the OTP code.

### Production Mode
Ensure your email service is properly configured in `.env` before deploying.

## Troubleshooting

**Email not sending?**
- Check your email service configuration in `.env`
- Verify SMTP credentials are correct
- Check backend console for error messages

**OTP not working?**
- Ensure MongoDB is running
- Check that OTP hasn't expired (10 minutes)
- Verify you're using the correct email address

**Rate limiting?**
- Wait 1 hour before requesting a new OTP
- Maximum 5 requests per email per hour

## Next Steps

1. Add JWT token generation for session management
2. Add protected routes
3. Add user profile page
4. Add logout functionality
5. Add "Remember me" option

