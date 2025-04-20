import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.APP_URL || 'http://localhost:3000'}/verify-email/${token}`;
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@meditrack.com',
    to: email,
    subject: 'Verify your MediTrack account',
    html: `
      <h1>Welcome to MediTrack!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not create a MediTrack account, please ignore this email.</p>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password/${token}`;
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@meditrack.com',
    to: email,
    subject: 'Reset your MediTrack password',
    html: `
      <h1>Password Reset Request</h1>
      <p>You have requested to reset your password. Click the link below to proceed:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request a password reset, please ignore this email.</p>
    `,
  });
} 