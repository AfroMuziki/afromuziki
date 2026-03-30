// backend/src/lib/brevo.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
  port: parseInt(process.env.BREVO_SMTP_PORT || "587"),
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

const FROM = `"${process.env.BREVO_FROM_NAME || "AfroMuziki"}" <${process.env.BREVO_FROM_EMAIL || "info.afromuziki@gmail.com"}>`;

/**
 * Send a welcome email after registration
 */
export async function sendWelcomeEmail(to, displayName) {
  return transporter.sendMail({
    from: FROM,
    to,
    subject: "Welcome to AfroMuziki",
    html: `
      <div style="font-family:'Plus Jakarta Sans',sans-serif;background:#070F1E;color:#F0EAD6;padding:40px;border-radius:12px;">
        <h1 style="color:#D4A843;margin-bottom:8px;">AfroMuziki</h1>
        <p style="font-size:16px;">Hey ${displayName},</p>
        <p>Welcome to AfroMuziki — your home for African music and video.</p>
        <p>Start exploring and discovering incredible artists from across the continent.</p>
        <br/>
        <p style="color:#D4A843;font-weight:700;">The AfroMuziki Team</p>
        <p style="font-size:11px;color:rgba(240,234,214,0.4);">AfroMuziki | info.afromuziki@gmail.com | WhatsApp: 0775109046</p>
      </div>
    `,
  });
}

/**
 * Send a password reset email
 */
export async function sendPasswordResetEmail(to, resetLink) {
  return transporter.sendMail({
    from: FROM,
    to,
    subject: "Reset your AfroMuziki password",
    html: `
      <div style="font-family:'Plus Jakarta Sans',sans-serif;background:#070F1E;color:#F0EAD6;padding:40px;border-radius:12px;">
        <h1 style="color:#D4A843;">AfroMuziki</h1>
        <p>You requested a password reset. Click the button below:</p>
        <a href="${resetLink}" style="display:inline-block;background:#D4A843;color:#0A1628;padding:12px 24px;border-radius:8px;font-weight:700;text-decoration:none;margin:16px 0;">
          Reset Password
        </a>
        <p style="font-size:12px;color:rgba(240,234,214,0.5);">This link expires in 1 hour. If you did not request this, ignore this email.</p>
      </div>
    `,
  });
}
