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
      port: parseInt(process.env.PROTONMAIL_SMTP_PORT),
      secure: true, // FIX : true pour port 465 SSL (au lieu false STARTTLS 587)
      auth: {
        type: 'login', // FIX : Explicit for Proton
        user: process.env.PROTONMAIL_SMTP_USERNAME,
        pass: process.env.PROTONMAIL_SMTP_PASSWORD
      },
      logger: true, // Debug full SMTP
      debug: true
    });

    // FIX : Verify connection (log if fail)
    await transporter.verify();
    console.log('SMTP verified OK');

    await transporter.sendMail({
      from: 'contact@sorciereblancheeditions.com',
      to: 'contact@sorciereblancheeditions.com',
      subject: `Nouveau message: ${subject}`,
      text: `Nom: ${name}\nEmail: ${email}\nMessage: ${message}`,
      replyTo: email
    });

    return res.status(200).json({ message: 'Email envoyé' });
  } catch (error) {
    console.error('Erreur envoi email full:', error); // Full trace
    const details = error.response ? error.response.data : error.message || error.code;
    return res.status(500).json({ error: 'Erreur serveur lors de l’envoi de l’email', details });
  }
}