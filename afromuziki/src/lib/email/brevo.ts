/**
 * Brevo (Sendinblue) transactional email helper.
 * API key is SERVER-ONLY.
 */

type EmailPayload = {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  textContent?: string;
};

export async function sendEmail(payload: EmailPayload) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[Brevo] BREVO_API_KEY not set — email skipped");
    return { skipped: true };
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL || "info.afromuziki@gmail.com";
  const senderName = process.env.BREVO_SENDER_NAME || "AfroMuziki";

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
      to: payload.to,
      subject: payload.subject,
      htmlContent: payload.htmlContent,
      textContent: payload.textContent,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[Brevo] send failed:", err);
    throw new Error(`Brevo error: ${res.status}`);
  }

  return res.json();
}

export async function sendWelcomeEmail(to: string, stageName: string) {
  return sendEmail({
    to: [{ email: to, name: stageName }],
    subject: "Welcome to AfroMuziki 🎵",
    htmlContent: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h1 style="color: #3b82f6;">Welcome, ${stageName}!</h1>
        <p>Your artist account on <strong>AfroMuziki</strong> is ready.</p>
        <p>You can now upload your music. Every song goes through a quick review to keep the platform high-quality.</p>
        <p style="margin-top: 24px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/artist/upload"
             style="background: linear-gradient(135deg,#3b82f6,#8b5cf6); color: white; padding: 12px 24px; border-radius: 999px; text-decoration: none;">
            Upload your first song
          </a>
        </p>
        <p style="color: #64748b; font-size: 13px; margin-top: 32px;">
          Questions? Reply to this email or write to info.afromuziki@gmail.com
        </p>
      </div>
    `,
  });
}

export async function sendSongApprovedEmail(
  to: string,
  stageName: string,
  songTitle: string
) {
  return sendEmail({
    to: [{ email: to, name: stageName }],
    subject: `Your song "${songTitle}" is now live on AfroMuziki`,
    htmlContent: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h1 style="color: #10b981;">Approved 🎉</h1>
        <p>Hi ${stageName},</p>
        <p>Your song <strong>"${songTitle}"</strong> has been approved and is now available for streaming and download on AfroMuziki.</p>
        <p style="margin-top: 24px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/discover"
             style="background: linear-gradient(135deg,#3b82f6,#8b5cf6); color: white; padding: 12px 24px; border-radius: 999px; text-decoration: none;">
            See it live
          </a>
        </p>
      </div>
    `,
  });
}

export async function sendSongRejectedEmail(
  to: string,
  stageName: string,
  songTitle: string,
  reason?: string
) {
  return sendEmail({
    to: [{ email: to, name: stageName }],
    subject: `Update on your song "${songTitle}"`,
    htmlContent: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h1 style="color: #ef4444;">Not approved</h1>
        <p>Hi ${stageName},</p>
        <p>Unfortunately your song <strong>"${songTitle}"</strong> was not approved.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
        <p>You can update the track and re-upload, or contact us at info.afromuziki@gmail.com if you believe this was a mistake.</p>
      </div>
    `,
  });
}
