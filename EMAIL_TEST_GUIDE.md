# Email Configuration Test Guide

After changing your email in the `.env` file, use this guide to verify everything works correctly.

## Required Environment Variables

Make sure your `backend/.env` file has these variables:

```env
EMAIL_HOST=smtp.gmail.com          # Your email provider's SMTP host
EMAIL_PORT=587                     # Usually 587 for TLS, 465 for SSL
EMAIL_USER=your-new-email@gmail.com  # Your email address
EMAIL_PASS=your-app-password       # App password (not regular password)
EMAIL_FROM=NILO <your-email@gmail.com>  # Optional: Display name
```

## Testing Methods

### Method 1: Using the Test Script (Recommended)

1. **Run the test script:**
   ```bash
   cd backend
   node test-email.js
   ```

2. **What it tests:**
   - ✅ Checks all environment variables are set
   - ✅ Sends a test OTP email to your EMAIL_USER
   - ✅ Sends a test contact form email
   - ✅ Shows detailed error messages if something fails

### Method 2: Using the API Endpoint

1. **Start your backend server:**
   ```bash
   cd backend
   npm start
   ```

2. **Test via browser or curl:**
   - Browser: `http://localhost:5000/api/test-email?email=your-email@gmail.com`
   - Or use curl:
     ```bash
     curl http://localhost:5000/api/test-email?email=your-email@gmail.com
     ```

### Method 3: Test Real Features

#### Test 1: OTP Email (Login/Signup)
1. Go to `http://localhost:3000/login`
2. Enter your email address
3. Click "Continue"
4. Check your inbox for the verification code

#### Test 2: Contact Form Email
1. Go to `http://localhost:3000/contact`
2. Fill out the contact form
3. Submit the form
4. Check `customerservice.nilo@gmail.com` inbox for the message

#### Test 3: Order Confirmation Email
1. Add items to cart
2. Complete checkout
3. Check the customer's email inbox for order confirmation

## Common Issues & Solutions

### Issue 1: "EMAIL CONFIG NOT FOUND"
**Solution:** Make sure your `.env` file is in the `backend/` directory and has all required variables.

### Issue 2: "Authentication failed"
**Solution:** 
- For Gmail: Use an App Password, not your regular password
- Enable 2-Step Verification first
- Generate App Password: Google Account → Security → 2-Step Verification → App passwords

### Issue 3: "Connection timeout"
**Solution:**
- Check firewall settings
- Verify EMAIL_HOST and EMAIL_PORT are correct
- Try port 465 with `secure: true` if 587 doesn't work

### Issue 4: "Emails go to spam"
**Solution:**
- This is normal for new email configurations
- Check spam/junk folder
- Mark as "Not Spam" to improve deliverability

## Verification Checklist

After running tests, verify:

- [ ] Test script runs without errors
- [ ] OTP email received in inbox
- [ ] Contact form email received at customerservice.nilo@gmail.com
- [ ] Order confirmation emails work
- [ ] No console errors in backend logs
- [ ] Email appears in inbox (not just spam)

## Gmail Setup (If Using Gmail)

1. **Enable 2-Step Verification:**
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "NILO Backend"
   - Copy the 16-character password
   - Use this in `EMAIL_PASS` in your `.env`

3. **Your .env should look like:**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx  # The 16-char app password
   ```

## Other Email Providers

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

### SendGrid
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

## Need Help?

If tests fail:
1. Check backend console for detailed error messages
2. Verify `.env` file is in `backend/` directory
3. Restart the backend server after changing `.env`
4. Check email provider's SMTP settings documentation

