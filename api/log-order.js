// /api/log-order.js - Vercel API Route (POST: log order DB + optional welcome email)
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, orderId, total } = req.body;

  if (!userId || !orderId || total === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Supabase client (RLS auto-check user_id)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SERVICE_ROLE_KEY // Use service role for insert (bypass RLS if needed, or anon pour check)
  );

  try {
    // Insert order
    const { data, error } = await supabase
      .from('orders')
      .insert([{ user_id: userId, order_id: orderId, total }])
      .select();

    if (error) throw error;

    console.log('Order inserted:', data[0].id);

    // Bonus : Check si premier order (pas d'order existant pour user) → Send welcome Resend
    const { count: existingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (existingOrders === 0) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'contact@sorciereblancheeditions.com', // Ton verified sender
        to: [/* Récup email user depuis Supabase si besoin, ou passe en body */ 'user@example.com'], // TODO: Fetch user.email via supabase.auth.admin.getUserById(userId)
        subject: 'Bienvenue chez Sorcière Blanche – Votre Portail est Activé !',
        html: `<h1>Enchanté, Initié !</h1><p>Votre premier achat active votre portail. Suivez vos mystères ici : <a href="https://sorciereblancheeditions.com/portail.html">Mon Portail</a></p><p>✨ La Magie Commence</p>`
      });
      console.log('Welcome email sent');
    }

    return res.status(200).json({ success: true, orderId: data[0].id });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}