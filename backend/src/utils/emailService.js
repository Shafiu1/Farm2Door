import nodemailer from 'nodemailer';
import transporter from '../config/email.js';

// Base sendEmail function
export const sendEmail = async (options) => {
  try {
    // Check if transporter is configured
    if (!transporter) {
      console.log('⚠️ Email not sent - transporter not configured');
      return;
    }

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || 'FreshMart'} <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message.replace(/\n/g, '<br>'),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

// Send verification email
export const sendVerificationEmail = async (user, verificationCode) => {
  const message = `
# Email Verification

Hello ${user.name},

Thank you for registering with FreshMart!

Your verification code is:

## ${verificationCode}

This code will expire in 15 minutes.

Please enter this code on the verification page to complete your registration.

If you didn't create an account, please ignore this email.

Best regards,
The FreshMart Team
    `;

  const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .code-box { background: white; border: 2px dashed #16a34a; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                .code { font-size: 32px; font-weight: bold; color: #16a34a; letter-spacing: 5px; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                .button { display: inline-block; padding: 12px 30px; background: #16a34a; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to FreshMart!</h1>
                </div>
                <div class="content">
                    <h2>Hello ${user.name},</h2>
                    <p>Thank you for registering with FreshMart, Bangladesh's most trusted online grocery platform!</p>
                    
                    <p>To complete your registration, please verify your email address using the code below:</p>
                    
                    <div class="code-box">
                        <div class="code">${verificationCode}</div>
                    </div>
                    
                    <p><strong>⏰ This code will expire in 15 minutes.</strong></p>
                    
                    <p>If you didn't create an account with FreshMart, please ignore this email.</p>
                    
                    <p>Happy Shopping!<br>The FreshMart Team</p>
                </div>
                <div class="footer">
                    <p>© 2025 FreshMart. All rights reserved.</p>
                    <p>This is an automated email. Please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
    `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Email Verification - FreshMart',
      message,
      html,
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Email could not be sent');
  }
};

// Send welcome email
export const sendWelcomeEmail = async (user) => {
  const message = `
# Welcome to FreshMart!

Hello ${user.name},

Thank you for joining FreshMart, Bangladesh's most trusted online grocery platform!

We're excited to have you on board. Here's what you can do:

- Browse thousands of fresh products
- Get free delivery on orders over ৳500
- Track your orders in real-time
- Enjoy exclusive deals and offers

If you have any questions, feel free to contact our support team.

Happy Shopping!

The FreshMart Team
    `;

  const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #16a34a; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                .button { display: inline-block; padding: 12px 30px; background: #16a34a; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Welcome to FreshMart!</h1>
                </div>
                <div class="content">
                    <h2>Hello ${user.name},</h2>
                    <p>Congratulations! Your email has been verified successfully.</p>
                    
                    <p>We're thrilled to have you join FreshMart, Bangladesh's most trusted online grocery platform!</p>
                    
                    <h3>Here's what you can do now:</h3>
                    
                    <div class="feature">
                        🛒 <strong>Browse Fresh Products</strong><br>
                        Thousands of fresh groceries at your fingertips
                    </div>
                    
                    <div class="feature">
                        🚚 <strong>Free Delivery</strong><br>
                        On orders over ৳500
                    </div>
                    
                    <div class="feature">
                        📱 <strong>Track Orders</strong><br>
                        Real-time order tracking
                    </div>
                    
                    <div class="feature">
                        💰 <strong>Exclusive Deals</strong><br>
                        Special offers and discounts
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">Start Shopping Now</a>
                    </div>
                    
                    <p>If you have any questions, our support team is always here to help!</p>
                    
                    <p>Happy Shopping!<br>The FreshMart Team</p>
                </div>
                <div class="footer">
                    <p>© 2025 FreshMart. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Welcome to FreshMart - Your Account is Ready!',
      message,
      html,
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (order, user) => {
  const message = `
# Order Confirmation

Hello ${user.name},

Thank you for your order! Your order has been confirmed.

Order Details:
- Order Number: ${order.orderNumber}
- Total Amount: ৳${order.totalPrice}
- Payment Method: ${order.paymentInfo.method}

We'll notify you when your order is on the way.

Track your order: ${process.env.FRONTEND_URL}/orders/${order._id}

Best regards,
The FreshMart Team
    `;

  const itemsList = order.orderItems
    .map(item => `<li>${item.name} - Qty: ${item.quantity} - ৳${item.price * item.quantity}</li>`)
    .join('');

  const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .order-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #e5e7eb; }
                .total { background: #16a34a; color: white; padding: 15px; text-align: center; font-size: 20px; font-weight: bold; border-radius: 5px; margin-top: 20px; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                ul { list-style: none; padding: 0; }
                li { padding: 10px; border-bottom: 1px solid #e5e7eb; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✅ Order Confirmed!</h1>
                </div>
                <div class="content">
                    <h2>Hello ${user.name},</h2>
                    <p>Thank you for your order! We've received it and will process it shortly.</p>
                    
                    <div class="order-box">
                        <h3>Order #${order.orderNumber}</h3>
                        <p><strong>Payment Method:</strong> ${order.paymentInfo.method.toUpperCase()}</p>
                        
                        <h4>Order Items:</h4>
                        <ul>${itemsList}</ul>
                        
                        <div class="total">Total: ৳${order.totalPrice}</div>
                    </div>
                    
                    <p>We'll send you another email when your order is on the way!</p>
                    
                    <p>Best regards,<br>The FreshMart Team</p>
                </div>
                <div class="footer">
                    <p>© 2025 FreshMart. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

  try {
    await sendEmail({
      email: user.email,
      subject: `Order Confirmation - ${order.orderNumber}`,
      message,
      html,
    });
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
};

// Send order status update email
export const sendOrderStatusEmail = async (order, user, status) => {
  const statusMessages = {
    processing: 'is being processed',
    shipping: 'is on the way',
    delivered: 'has been delivered',
    cancelled: 'has been cancelled',
  };

  const message = `
# Order Status Update

Hello ${user.name},

Your order ${order.orderNumber} ${statusMessages[status]}.

${status === 'shipping' ? `Track your order: ${process.env.FRONTEND_URL}/orders/${order._id}` : ''}

Best regards,
The FreshMart Team
    `;

  const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .status-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; border: 2px solid #16a34a; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📦 Order Update</h1>
                </div>
                <div class="content">
                    <h2>Hello ${user.name},</h2>
                    <p>Your order status has been updated!</p>
                    
                    <div class="status-box">
                        <h3>Order #${order.orderNumber}</h3>
                        <p style="font-size: 20px; color: #16a34a; font-weight: bold;">
                            ${statusMessages[status].toUpperCase()}
                        </p>
                    </div>
                    
                    ${status === 'delivered' ? '<p>We hope you enjoy your fresh groceries! 🎉</p>' : ''}
                    
                    <p>Best regards,<br>The FreshMart Team</p>
                </div>
                <div class="footer">
                    <p>© 2025 FreshMart. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

  try {
    await sendEmail({
      email: user.email,
      subject: `Order Update - ${order.orderNumber}`,
      message,
      html,
    });
  } catch (error) {
    console.error('Error sending order status email:', error);
  }
};
