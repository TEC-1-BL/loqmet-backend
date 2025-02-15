import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  secure: true,
  host: 'smtp.gmail.com',
  port: 465, // default to 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter configuration
function sendMail(to, sub, msg) {
  const baseUrl = process.env.BASE_URL || 'http://localhost:5173/';
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to:to,
    subject:sub,
    html: `
    <h1>Welcome!</h1>
    <p>Thank you for registering with us.</p>
    <p>Click <a href="${baseUrl}">here</a> to return to our site.</p> 
`,
  });
  console.log('Email sent successfully');
}

export { transporter, sendMail };