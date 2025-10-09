import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ message: 'OK' });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
  }

  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.PROTONMAIL_SMTP_SERVER,
      port: process.env.PROTONMAIL_SMTP_PORT,
      secure: false, // STARTTLS
      auth: {
        user: process.env.PROTONMAIL_SMTP_USERNAME,
        pass: process.env.PROTONMAIL_SMTP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: 'contact@sorciereblancheeditions.com',
      to: 'contact@sorciereblancheeditions.com',
      subject: `Nouveau message: ${subject}`,
      text: `Nom: ${name}\nEmail: ${email}\nMessage: ${message}`,
      replyTo: email
    });

    return res.status(200).json({ message: 'Email envoyé' });
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return res.status(500).json({ error: 'Erreur serveur lors de l’envoi de l’email', details: error.message });
  }
}