import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import { z } from 'zod';

export const contactRouter = Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Trop de requêtes. Réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  message: z.string().min(10).max(2000),
});

function createTransport() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

contactRouter.post('/contact', limiter, async (req, res) => {
  const result = contactSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten().fieldErrors });
  }

  const { name, email, message } = result.data;
  const transport = createTransport();

  if (transport && process.env.CONTACT_TO) {
    try {
      await transport.sendMail({
        from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_TO,
        replyTo: email,
        subject: `[Portfolio] Message de ${name}`,
        text: `De : ${name} <${email}>\n\n${message}`,
        html: `<p><strong>De :</strong> ${name} &lt;${email}&gt;</p><p>${message.replace(/\n/g, '<br>')}</p>`,
      });
    } catch (err) {
      console.error('Email send error:', err);
      return res.status(500).json({ error: 'Erreur lors de l\'envoi du mail.' });
    }
  } else {
    console.log('[contact]', { name, email, message });
  }

  res.json({ success: true });
});
