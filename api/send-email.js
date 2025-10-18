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
  // Flexible : Support contact form {name, email, subject, message} OU order confirmation {to, subject, body}
  const { name, email, subject, message, to, body } = req.body;
  if ((!name || !email || !subject || !message) && (!to || !subject || !body)) {
    return res.status(400).json({ error: 'Champs requis manquants (contact: name/email/subject/message OU order: to/subject/body)' });
  }
  try {
    let sendOptions;
    if (to && body) {
      // Mode order confirmation (to = buyer, body = order details)
      sendOptions = {
        from: 'Contact <contact@sorciereblancheeditions.com>',
        to: [to],
        subject,
        html: `<div>${body.replace(/\n/g, '<br>')}</div>`, // Simple HTML pour body order
        reply_to: { email: to }
      };
    } else {
      // Mode contact form (fallback original)
      sendOptions = {
        from: 'Contact <contact@sorciereblancheeditions.com>',
        to: 'contact@sorciereblancheeditions.com',
        subject: `Nouveau message: ${subject}`,
        text: `Nom: ${name}\nEmail: ${email}\nMessage: ${message}`,
        reply_to: { email: email }
      };
    }
    await resend.emails.send(sendOptions);
    console.log('Email envoyé:', { to: sendOptions.to, subject: sendOptions.subject }); // Debug
    return res.status(200).json({ message: 'Email envoyé' });
  } catch (error) {
    console.error('Resend error full:', error);
    return res.status(500).json({ error: 'Erreur envoi email', details: error.message });
  }
}