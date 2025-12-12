import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const createTransporter = () => {
  // Use SMTP configuration from .env
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    console.log('📧 Email transporter configured:', {
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      user: process.env.EMAIL_USER
    });
    
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  // Fallback: Development - Console only (no actual email sent)
  console.warn('⚠️ EMAIL CONFIG NOT FOUND - Emails will not be sent!');
  console.warn('Please set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS in .env file');
  return {
    sendMail: async (options) => {
      console.log('📧 EMAIL (Development Mode - No EMAIL config found):');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('Body:', options.text);
      return { messageId: 'dev-mode-' + Date.now() };
    }
  };
};

const transporter = createTransporter();

export const sendOTPEmail = async (email, otpCode) => {
  // Ensure EMAIL_USER is full email address
  let fromEmail = process.env.EMAIL_USER || 'aliashrafosman777@gmail.com';
  if (!fromEmail.includes('@')) {
    fromEmail = `${fromEmail}@gmail.com`;
  }
  
  const mailOptions = {
    from: `NILO <${fromEmail}>`,
    to: email,
    subject: 'Your NILO Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NILO Verification Code</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F5F3EF;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 40px 20px; text-align: center;">
              <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 40px 30px; text-align: center; background-color: #1a2820;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 2px;">NILO</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #2D2D2D; font-size: 24px; font-weight: bold;">Verification Code</h2>
                    <p style="margin: 0 0 30px 0; color: #6B7E6F; font-size: 16px; line-height: 1.6;">
                      Your verification code for NILO is:
                    </p>
                    <div style="background-color: #F5F3EF; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
                      <div style="font-size: 36px; font-weight: bold; color: #2D2D2D; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                        ${otpCode}
                      </div>
                    </div>
                    <p style="margin: 20px 0 0 0; color: #6B7E6F; font-size: 14px; line-height: 1.6;">
                      This code will expire in <strong>10 minutes</strong>.
                    </p>
                    <p style="margin: 30px 0 0 0; color: #6B7E6F; font-size: 14px; line-height: 1.6;">
                      If you didn't request this code, please ignore this email.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 30px; text-align: center; background-color: #F5F3EF; border-top: 1px solid #E8E6E3;">
                    <p style="margin: 0; color: #6B7E6F; font-size: 12px;">
                      © 2025 NILO. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `
      NILO Verification Code

      Your verification code is: ${otpCode}

      This code will expire in 10 minutes.

      If you didn't request this code, please ignore this email.

      © 2025 NILO. All rights reserved.
    `
  };

  try {
    console.log('📧 Attempting to send OTP email to:', email);
    console.log('📧 From:', mailOptions.from);
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP Email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);
    return info;
  } catch (error) {
    console.error('❌ Error sending OTP email:');
    console.error('   Error code:', error.code);
    console.error('   Error message:', error.message);
    console.error('   Full error:', error);
    throw error;
  }
};

export const sendContactEmail = async ({ customerName, customerEmail, subject, message }) => {
  const recipientEmail = 'customerservice.nilo@gmail.com';
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'NILO Contact Form <noreply@nilo.com>',
    to: recipientEmail,
    replyTo: customerEmail,
    subject: `NILO Contact Form: ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NILO Contact Form Submission</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F5F3EF;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 40px 20px; text-align: center;">
              <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 40px 30px; text-align: center; background-color: #1a2820;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 2px;">NILO</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #2D2D2D; font-size: 24px; font-weight: bold;">New Contact Form Submission</h2>
                    <div style="background-color: #F5F3EF; border-radius: 8px; padding: 20px; margin: 20px 0;">
                      <p style="margin: 0 0 10px 0; color: #6B7E6F; font-size: 14px;"><strong style="color: #2D2D2D;">Name:</strong> ${customerName}</p>
                      <p style="margin: 0 0 10px 0; color: #6B7E6F; font-size: 14px;"><strong style="color: #2D2D2D;">Email:</strong> <a href="mailto:${customerEmail}" style="color: #4A5D4F; text-decoration: none;">${customerEmail}</a></p>
                      <p style="margin: 0 0 10px 0; color: #6B7E6F; font-size: 14px;"><strong style="color: #2D2D2D;">Subject:</strong> ${subject}</p>
                    </div>
                    <div style="margin: 20px 0;">
                      <h3 style="margin: 0 0 10px 0; color: #2D2D2D; font-size: 18px; font-weight: bold;">Message:</h3>
                      <p style="margin: 0; color: #6B7E6F; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 30px; text-align: center; background-color: #F5F3EF; border-top: 1px solid #E8E6E3;">
                    <p style="margin: 0; color: #6B7E6F; font-size: 12px;">
                      © 2025 NILO. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `
      NILO Contact Form Submission

      Name: ${customerName}
      Email: ${customerEmail}
      Subject: ${subject}

      Message:
      ${message}

      © 2025 NILO. All rights reserved.
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Contact form email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw error;
  }
};

export const sendOrderConfirmationEmail = async (order, customerEmail) => {
  const itemsHtml = order.items.map(item => {
    const product = item.productId;
    const productName = product?.name || 'Product';
    const productPrice = item.price || 0;
    const itemTotal = productPrice * item.quantity;
    return `
      <tr>
        <td style="padding: 15px; border-bottom: 1px solid #E8E6E3;">
          <div style="display: flex; align-items: center; gap: 15px;">
            ${product?.image ? `<img src="${product.image}" alt="${productName}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">` : ''}
            <div>
              <p style="margin: 0 0 5px 0; color: #2D2D2D; font-size: 16px; font-weight: bold;">${productName}</p>
              <p style="margin: 0; color: #6B7E6F; font-size: 14px;">Quantity: ${item.quantity}</p>
            </div>
          </div>
        </td>
        <td style="padding: 15px; border-bottom: 1px solid #E8E6E3; text-align: right; color: #2D2D2D; font-weight: bold;">
          $${itemTotal.toFixed(2)}
        </td>
      </tr>
    `;
  }).join('');

  // Ensure EMAIL_USER is full email address for from field
  let fromEmail = process.env.EMAIL_USER || 'aliashrafosman777@gmail.com';
  if (!fromEmail.includes('@')) {
    fromEmail = `${fromEmail}@gmail.com`;
  }

  const mailOptions = {
    from: `NILO <${fromEmail}>`,
    to: customerEmail,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - NILO</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F5F3EF;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 40px 20px; text-align: center;">
              <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 40px 30px; text-align: center; background-color: #1a2820;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 2px;">NILO</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 10px 0; color: #2D2D2D; font-size: 24px; font-weight: bold;">Order Confirmation</h2>
                    <p style="margin: 0 0 30px 0; color: #6B7E6F; font-size: 16px;">Thank you for your order! We've received your order and will begin processing it shortly.</p>
                    
                    <div style="background-color: #F5F3EF; border-radius: 8px; padding: 20px; margin: 20px 0;">
                      <p style="margin: 0 0 10px 0; color: #2D2D2D; font-size: 16px; font-weight: bold;">Order Number: <span style="color: #4A5D4F;">${order.orderNumber}</span></p>
                      <p style="margin: 0; color: #6B7E6F; font-size: 14px;">Order Date: ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>

                    <h3 style="margin: 30px 0 15px 0; color: #2D2D2D; font-size: 18px; font-weight: bold;">Shipping Information</h3>
                    <div style="background-color: #F5F3EF; border-radius: 8px; padding: 20px; margin: 0 0 30px 0;">
                      <p style="margin: 0 0 8px 0; color: #6B7E6F; font-size: 14px;"><strong style="color: #2D2D2D;">Name:</strong> ${order.shippingInfo.firstName} ${order.shippingInfo.lastName}</p>
                      <p style="margin: 0 0 8px 0; color: #6B7E6F; font-size: 14px;"><strong style="color: #2D2D2D;">Email:</strong> ${order.shippingInfo.email}</p>
                      <p style="margin: 0 0 8px 0; color: #6B7E6F; font-size: 14px;"><strong style="color: #2D2D2D;">Phone:</strong> ${order.shippingInfo.phone}</p>
                      <p style="margin: 0 0 8px 0; color: #6B7E6F; font-size: 14px;"><strong style="color: #2D2D2D;">Address:</strong> ${order.shippingInfo.address}</p>
                      <p style="margin: 0 0 8px 0; color: #6B7E6F; font-size: 14px;"><strong style="color: #2D2D2D;">City:</strong> ${order.shippingInfo.city}</p>
                      <p style="margin: 0 0 8px 0; color: #6B7E6F; font-size: 14px;"><strong style="color: #2D2D2D;">ZIP Code:</strong> ${order.shippingInfo.zipCode}</p>
                      <p style="margin: 0; color: #6B7E6F; font-size: 14px;"><strong style="color: #2D2D2D;">Country:</strong> ${order.shippingInfo.country}</p>
                    </div>

                    <h3 style="margin: 30px 0 15px 0; color: #2D2D2D; font-size: 18px; font-weight: bold;">Order Items</h3>
                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px 0;">
                      <thead>
                        <tr style="background-color: #F5F3EF;">
                          <th style="padding: 15px; text-align: left; color: #2D2D2D; font-size: 14px; font-weight: bold; border-bottom: 2px solid #E8E6E3;">Product</th>
                          <th style="padding: 15px; text-align: right; color: #2D2D2D; font-size: 14px; font-weight: bold; border-bottom: 2px solid #E8E6E3;">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemsHtml}
                      </tbody>
                    </table>

                    <div style="border-top: 2px solid #E8E6E3; padding-top: 20px; margin-top: 20px;">
                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: #6B7E6F; font-size: 16px;">Subtotal:</span>
                        <span style="color: #2D2D2D; font-size: 16px; font-weight: bold;">$${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: #6B7E6F; font-size: 16px;">Shipping:</span>
                        <span style="color: #2D2D2D; font-size: 16px; font-weight: bold;">${order.shipping === 0 ? 'Free' : '$' + order.shipping.toFixed(2)}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; padding-top: 15px; border-top: 2px solid #E8E6E3; margin-top: 15px;">
                        <span style="color: #2D2D2D; font-size: 20px; font-weight: bold;">Total:</span>
                        <span style="color: #2D2D2D; font-size: 20px; font-weight: bold;">$${order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div style="background-color: #F5F3EF; border-radius: 8px; padding: 20px; margin: 30px 0;">
                      <p style="margin: 0 0 10px 0; color: #2D2D2D; font-size: 16px; font-weight: bold;">Payment Method:</p>
                      <p style="margin: 0; color: #6B7E6F; font-size: 14px; text-transform: capitalize;">${order.paymentMethod.replace('_', ' ')}</p>
                    </div>

                    <p style="margin: 30px 0 0 0; color: #6B7E6F; font-size: 14px; line-height: 1.6;">
                      We'll send you another email when your order ships. If you have any questions, please contact us.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 30px; text-align: center; background-color: #F5F3EF; border-top: 1px solid #E8E6E3;">
                    <p style="margin: 0; color: #6B7E6F; font-size: 12px;">
                      © 2025 NILO. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `
      Order Confirmation - ${order.orderNumber}

      Thank you for your order! We've received your order and will begin processing it shortly.

      Order Number: ${order.orderNumber}
      Order Date: ${new Date(order.createdAt).toLocaleDateString()}

      Shipping Information:
      Name: ${order.shippingInfo.firstName} ${order.shippingInfo.lastName}
      Email: ${order.shippingInfo.email}
      Phone: ${order.shippingInfo.phone}
      Address: ${order.shippingInfo.address}
      City: ${order.shippingInfo.city}
      ZIP Code: ${order.shippingInfo.zipCode}
      Country: ${order.shippingInfo.country}

      Order Items:
      ${order.items.map(item => {
        const product = item.productId;
        return `${product?.name || 'Product'} - Quantity: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
      }).join('\n')}

      Subtotal: $${order.subtotal.toFixed(2)}
      Shipping: ${order.shipping === 0 ? 'Free' : '$' + order.shipping.toFixed(2)}
      Total: $${order.total.toFixed(2)}

      Payment Method: ${order.paymentMethod.replace('_', ' ')}

      We'll send you another email when your order ships. If you have any questions, please contact us.

      © 2025 NILO. All rights reserved.
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};

