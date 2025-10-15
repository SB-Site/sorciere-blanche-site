import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    await resend.emails.send({
      from: 'Contact <contact@sorciereblancheeditions.com>', // Verified domain (pending OK for test)
      to: 'contact@sorciereblancheeditions.com',
      subject: `Nouveau message: ${subject}`,
      text: `Nom: ${name}\nEmail: ${email}\nMessage: ${message}`,
      reply_to: { email: email }
    });
    return res.status(200).json({ message: 'Email envoyé' });
  } catch (error) {
    console.error('Resend error full:', error);
    return res.status(500).json({ error: 'Erreur envoi email', details: error.message });
  }
}