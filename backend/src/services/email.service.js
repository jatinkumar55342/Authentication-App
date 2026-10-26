const nodemailer = require("nodemailer");

const isEthereal = process.env.EMAIL_USER?.includes("@ethereal.email");

const transporter = nodemailer.createTransport(
  isEthereal
    ? {
        host: "smtp.ethereal.email",
        port: 587,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      }
    : {
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      }
);

async function sendMail(to, subject, html) {
  const info = await transporter.sendMail({
    from: `"AuthApp" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  const preview = nodemailer.getTestMessageUrl(info);
  if (preview) console.log(`Preview: ${preview}`);

  return info;
}

async function sendVerificationEmail(email, username, token) {
  const link = `${process.env.CLIENT_URL}/verify-email/${token}`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 500px;">
      <h2>Welcome, ${username}!</h2>
      <p>Thank you for signing up. Please verify your email by clicking the button below:</p>
      <p>
        <a href="${link}" style="display: inline-block; padding: 12px 24px; background: #6366f1; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Verify Email
        </a>
      </p>
      <p>Or copy this link: <br/><a href="${link}">${link}</a></p>
      <p><small>This link expires in 30 minutes.</small></p>
    </div>
  `;
  return sendMail(email, "Verify Your Email - AuthApp", html);
}

async function sendPasswordResetEmail(email, username, token) {
  const link = `${process.env.CLIENT_URL}/reset-password/${token}`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 500px;">
      <h2>Password Reset Request</h2>
      <p>Hi ${username}, click the button below to reset your password:</p>
      <p>
        <a href="${link}" style="display: inline-block; padding: 12px 24px; background: #ef4444; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Reset Password
        </a>
      </p>
      <p>Or copy this link: <br/><a href="${link}">${link}</a></p>
      <p><small>This link expires in 15 minutes. If you did not request this, please ignore this email.</small></p>
    </div>
  `;
  return sendMail(email, "Reset Your Password - AuthApp", html);
}

async function sendLoginNotificationEmail(email, username) {
  const time = new Date().toLocaleString();
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 500px;">
      <h2>New Login Detected</h2>
      <p>Hi ${username}, a new login was detected on your account at <strong>${time}</strong>.</p>
      <p>If this was not you, please reset your password immediately.</p>
    </div>
  `;
  return sendMail(email, "New Login Detected - AuthApp", html);
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendLoginNotificationEmail,
};
