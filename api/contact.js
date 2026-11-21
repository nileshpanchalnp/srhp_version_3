// api/contact.js
//
// Serverless function that sends the Contact form on the site using
// Resend (https://resend.com). No database, no admin dashboard — just
// one endpoint that emails you when someone submits the form.
//
// This file uses the Vercel serverless function signature
// (`export default function handler(req, res)`) and will work
// automatically if this project is deployed on Vercel. If you deploy
// elsewhere (Netlify, Cloudflare Pages, a VPS, etc.) you'll need to
// adapt this handler to that platform's function format — the Resend
// call itself (the `resend.emails.send(...)` part) stays the same.
//
// ── Setup ──────────────────────────────────────────────────────────
// 1. npm install resend   (already listed in package.json)
// 2. Create an account at https://resend.com and grab an API key.
// 3. Set the RESEND_API_KEY environment variable on your hosting
//    platform (Vercel → Project Settings → Environment Variables).
// 4. Verify a sending domain in Resend and update FROM_EMAIL below.
//    Until you verify a domain, Resend only lets you send from
//    "onboarding@resend.dev" and only *to* the email address on your
//    own Resend account — fine for testing, not for production.

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL   = 'sandip@srhpfilms.com';
const FROM_EMAIL = 'SRHP Films Website <onboarding@resend.dev>'; // ← replace once your domain is verified in Resend

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, email, phone, subject, message } = req.body || {};

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `New website inquiry: ${subject}`,
      html: `
        <h2>New message from srhpfilms.com</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || '\u2014')}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
  }
}

// Minimal HTML-escaping so form input can't inject markup into the email.
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
