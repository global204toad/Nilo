/**
 * Email Configuration Test Script
 * Run this to verify your email settings work correctly
 * 
 * Usage: node test-email.js
 */

import dotenv from 'dotenv';
import { sendOTPEmail, sendContactEmail } from './services/emailService.js';

dotenv.config();

console.log('\n🧪 Testing Email Configuration...\n');
console.log('='.repeat(50));

// Check environment variables
console.log('\n📋 Environment Variables:');
console.log('   EMAIL_HOST:', process.env.EMAIL_HOST || '❌ NOT SET');
console.log('   EMAIL_PORT:', process.env.EMAIL_PORT || '587 (default)');
console.log('   EMAIL_USER:', process.env.EMAIL_USER || '❌ NOT SET');
console.log('   EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ SET' : '❌ NOT SET');
console.log('   EMAIL_FROM:', process.env.EMAIL_FROM || 'NOT SET (will use EMAIL_USER)');

console.log('\n' + '='.repeat(50));

// Test OTP Email
async function testOTPEmail() {
  console.log('\n📧 Test 1: OTP Email');
  console.log('-'.repeat(50));
  
  // Use full email address - if EMAIL_USER doesn't have @, assume it's Gmail
  let testEmail = process.env.EMAIL_USER || 'test@example.com';
  if (!testEmail.includes('@')) {
    testEmail = `${testEmail}@gmail.com`;
    console.log(`   ⚠️  EMAIL_USER missing domain, assuming Gmail: ${testEmail}`);
  }
  
  const testOTP = '123456';
  
  try {
    console.log(`   Sending test OTP email to: ${testEmail}`);
    await sendOTPEmail(testEmail, testOTP);
    console.log('   ✅ OTP Email sent successfully!');
    console.log('   📬 Please check your inbox and spam folder.');
    return true;
  } catch (error) {
    console.error('   ❌ Failed to send OTP email:');
    console.error('   Error:', error.message);
    if (error.code) console.error('   Code:', error.code);
    return false;
  }
}

// Test Contact Email
async function testContactEmail() {
  console.log('\n📧 Test 2: Contact Form Email');
  console.log('-'.repeat(50));
  
  // Use full email address - if EMAIL_USER doesn't have @, assume it's Gmail
  let testEmail = process.env.EMAIL_USER || 'test@example.com';
  if (!testEmail.includes('@')) {
    testEmail = `${testEmail}@gmail.com`;
  }
  
  const testData = {
    customerName: 'Test User',
    customerEmail: testEmail,
    subject: 'Test Contact Form',
    message: 'This is a test message to verify email configuration is working correctly.'
  };
  
  try {
    console.log(`   Sending test contact email...`);
    await sendContactEmail(testData);
    console.log('   ✅ Contact Email sent successfully!');
    console.log('   📬 Please check customerservice.nilo@gmail.com inbox.');
    return true;
  } catch (error) {
    console.error('   ❌ Failed to send contact email:');
    console.error('   Error:', error.message);
    if (error.code) console.error('   Code:', error.code);
    return false;
  }
}

// Run tests
async function runTests() {
  const results = {
    otp: false,
    contact: false
  };
  
  results.otp = await testOTPEmail();
  results.contact = await testContactEmail();
  
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Test Results Summary:');
  console.log('-'.repeat(50));
  console.log('   OTP Email:        ', results.otp ? '✅ PASS' : '❌ FAIL');
  console.log('   Contact Email:    ', results.contact ? '✅ PASS' : '❌ FAIL');
  
  if (results.otp && results.contact) {
    console.log('\n   🎉 All tests passed! Your email configuration is working correctly.');
  } else {
    console.log('\n   ⚠️  Some tests failed. Please check:');
    console.log('   1. Your .env file has all required variables');
    console.log('   2. EMAIL_USER and EMAIL_PASS are correct');
    console.log('   3. Your email service allows SMTP connections');
    console.log('   4. Firewall/antivirus is not blocking the connection');
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
}

// Run the tests
runTests().catch(console.error);

