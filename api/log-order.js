// /api/log-order.js - Vercel API Route (POST: log order DB + optional welcome email)
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, orderId, total } = req.body;

  if (!userId || !orderId || total === undefined) {
    console.error('Missing fields:', { userId, orderId, total });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Supabase client avec service_role (bypass RLS pour insert)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing Supabase env vars');
    return res.status(500).json({ error: 'Server config error' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  try {
    // Insert order
    const { data, error: insertError } = await supabase
      .from('orders')
      .insert([{ user_id: userId, order_id: orderId, total }])
      .select();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw insertError;
    }

    console.log('Order inserted:', data[0].id);

    // Fetch user email pour welcome/confirmation
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    if (userError) {
      console.error('User fetch error:', userError);
      return res.status(500).json({ error: 'User fetch failed' });
    }
    const userEmail = userData.user.email;

    // Check si premier order → Send welcome Resend
    const { count: existingOrders, error: countError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) {
      console.error('Count error:', countError);
      throw countError;
    }

    if (existingOrders === 1) { // ===1 car insert précédent
      const resend = new Resend(process.env.RESEND_API_KEY);
      if (!process.env.RESEND_API_KEY) {
        console.error('Missing RESEND_API_KEY');
        return res.status(500).json({ error: 'Resend config error' });
      }
      const { error: emailError } = await resend.emails.send({
        from: 'contact@sorciereblancheeditions.com',
        to: [userEmail],
        subject: 'Bienvenue chez Sorcière Blanche – Votre Portail est Activé !',
        html: `<h1>Enchanté, Initié !</h1><p>Votre premier achat active votre portail. Suivez vos mystères ici : <a href="https://sorciereblancheeditions.com/portail.html">Mon Portail</a></p><p>✨ La Magie Commence</p>`
      });
      if (emailError) {
        console.error('Welcome email error:', emailError);
      } else {
        console.log('Welcome email sent to:', userEmail);
      }
    }

    return res.status(200).json({ success: true, orderId: data[0].id });

  } catch (error) {
    console.error('API log-order error:', error.message || error);
    return res.status(500).json({ error: 'Internal server error: ' + (error.message || 'Unknown') });
  }
}