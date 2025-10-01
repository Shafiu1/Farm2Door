import transporter from '../config/email.js';

// Helper function to check if email is configured
const isEmailConfigured = () => {
    return transporter !== null;
};

// Send welcome email
export const sendWelcomeEmail = async (user) => {
    if (!isEmailConfigured()) {
        console.log('📧 Email not configured - skipping welcome email');
        return;
    }

    const mailOptions = {
        from: process.env.EMAIL_FROM || 'Freshmart <noreply@freshmart.com>',
        to: user.email,
        subject: 'Welcome to Freshmart! 🎉',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Freshmart!</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.name},</h2>
            <p>Thank you for joining Freshmart, Bangladesh's most trusted online grocery platform!</p>
            <p>We're excited to have you on board. Here's what you can do:</p>
            <ul>
              <li>Browse thousands of fresh products</li>
              <li>Get free delivery on orders over ৳500</li>
              <li>Track your orders in real-time</li>
              <li>Enjoy exclusive deals and offers</li>
            </ul>
            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">Start Shopping</a>
            </center>
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>Happy Shopping!<br>The Freshmart Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Freshmart. All rights reserved.</p>
            <p>Made with ❤️ in Bangladesh</p>
          </div>
        </div>
      </body>
      </html>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✉️  Welcome email sent to ${user.email}`);
    } catch (error) {
        console.error('Email sending failed:', error.message);
    }
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (order, user) => {
    if (!isEmailConfigured()) {
        console.log('📧 Email not configured - skipping order confirmation email');
        return;
    }

    const mailOptions = {
        from: process.env.EMAIL_FROM || 'Freshmart <noreply@freshmart.com>',
        to: user.email,
        subject: `Order Confirmed - ${order.orderNumber || order._id}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; }
          .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .order-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .total { font-size: 18px; font-weight: bold; margin-top: 20px; padding-top: 20px; border-top: 2px solid #22c55e; }
          .button { display: inline-block; background: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Order Confirmed!</h1>
          </div>
          <div class="content">
            <h2>Thank you, ${user.name}!</h2>
            <p>Your order has been confirmed and is being prepared.</p>
            
            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> ${order.orderNumber || order._id}</p>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
              <p><strong>Payment Method:</strong> ${order.paymentInfo.method.toUpperCase()}</p>
              
              <h4 style="margin-top: 20px;">Items:</h4>
              ${order.orderItems.map(item => `
                <div class="order-item">
                  <span>${item.name} x ${item.quantity}</span>
                  <span>৳${item.price * item.quantity}</span>
                </div>
              `).join('')}
              
              <div class="total">
                <div style="display: flex; justify-content: space-between;">
                  <span>Total Amount:</span>
                  <span>৳${order.totalPrice}</span>
                </div>
              </div>
              
              <h4 style="margin-top: 20px;">Delivery Address:</h4>
              <p>
                ${order.shippingInfo.fullName}<br>
                ${order.shippingInfo.address}<br>
                ${order.shippingInfo.area}, ${order.shippingInfo.city}<br>
                Phone: ${order.shippingInfo.phone}
              </p>
            </div>
            
            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${order._id}" class="button">Track Order</a>
            </center>
            
            <p>Your order will be delivered within 30-60 minutes.</p>
            <p>Best regards,<br>The Freshmart Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Freshmart. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✉️  Order confirmation email sent to ${user.email}`);
    } catch (error) {
        console.error('Email sending failed:', error.message);
    }
};

// Send order status update email
export const sendOrderStatusEmail = async (order, user, status) => {
    if (!isEmailConfigured()) {
        console.log('📧 Email not configured - skipping status update email');
        return;
    }

    const statusMessages = {
        processing: 'Your order is being processed',
        shipping: 'Your order is out for delivery',
        delivered: 'Your order has been delivered',
        cancelled: 'Your order has been cancelled',
    };

    const statusEmojis = {
        processing: '⏳',
        shipping: '🚚',
        delivered: '✅',
        cancelled: '❌',
    };

    const mailOptions = {
        from: process.env.EMAIL_FROM || 'Freshmart <noreply@freshmart.com>',
        to: user.email,
        subject: `${statusEmojis[status]} Order Update - ${order.orderNumber || order._id}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .status-badge { display: inline-block; padding: 10px 20px; background: #22c55e; color: white; border-radius: 20px; font-weight: bold; margin: 20px 0; }
          .button { display: inline-block; background: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${statusEmojis[status]} Order Status Update</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.name},</h2>
            <p>Your order status has been updated:</p>
            
            <center>
              <div class="status-badge">${statusMessages[status]}</div>
            </center>
            
            <p><strong>Order ID:</strong> ${order.orderNumber || order._id}</p>
            <p><strong>Total Amount:</strong> ৳${order.totalPrice}</p>
            
            ${status === 'delivered' ? `
              <p>Thank you for shopping with Freshmart! We hope you enjoy your products.</p>
              <p>Please rate your experience and help us serve you better.</p>
            ` : ''}
            
            ${status === 'cancelled' ? `
              <p>We're sorry your order was cancelled. If you have any questions, please contact our support team.</p>
            ` : ''}
            
            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${order._id}" class="button">View Order Details</a>
            </center>
            
            <p>Best regards,<br>The Freshmart Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Freshmart. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✉️  Status update email sent to ${user.email}`);
    } catch (error) {
        console.error('Email sending failed:', error.message);
    }
};