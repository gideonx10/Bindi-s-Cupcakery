import nodemailer from 'nodemailer';

// Create transporter outside the function to reuse it
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD, // Use app-specific password
  },
});

interface EmailContent {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailContent) {
  try {
    const info = await transporter.sendMail({
      from: `"Bindi's Cupcakery" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

interface OrderStatusEmailProps {
  customerName: string;
  orderId: string;
  newStatus: string;
  products: Array<{ name: string; quantity: number }>;
  totalAmount: number;
}

export function getOrderStatusEmailContent({
  customerName,
  orderId,
  newStatus,
  products,
  totalAmount,
}: OrderStatusEmailProps): EmailContent {
  const statusMessages = {
    'pending': 'Your order is currently pending.',
    'ready to take-away': 'Your order is now ready for pick-up! Please visit our store to collect your delicious treats.',
    'delivered': 'Your order has been delivered. Thank you for choosing Bindi\'s Cupcakery!',
    'cancelled': 'Your order has been cancelled. If you have any questions, please contact us.',
  };

  const productsList = products
    .map(item => `<li>${item.name} x${item.quantity}</li>`)
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d946ef;">Order Status Update</h2>
      <p>Dear ${customerName},</p>
      <p>Your order (ID: ${orderId}) status has been updated to: <strong>${newStatus}</strong></p>
      
      <p>${statusMessages[newStatus as keyof typeof statusMessages]}</p>
      
      <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
        <h3 style="margin-top: 0;">Order Details:</h3>
        <ul style="list-style-type: none; padding-left: 0;">
          ${productsList}
        </ul>
        <p style="margin-top: 15px; font-weight: bold;">Total Amount: $${totalAmount.toFixed(2)}</p>
      </div>
      
      <p>If you have any questions about your order, please don't hesitate to contact us.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666;">Best regards,<br>Bindi's Cupcakery Team</p>
      </div>
    </div>
  `;

  return {
    to: '', // Will be filled in when sending
    subject: `Order Status Update - ${newStatus.toUpperCase()}`,
    html,
  };
}