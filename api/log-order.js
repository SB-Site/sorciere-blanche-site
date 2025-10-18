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

  // Supabase client : Priorité service_role (bypass RLS), fallback anon
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cskhhttnmjfmieqkayzg.supabase.co';
  const serviceRoleKey = process.env.SERVICE_ROLE_KEY;
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNza2hodHRubWpmbWllcWtheXpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMTk1NDgsImV4cCI6MjA2OTg5NTU0OH0.or26KhHzKJ7oPYu0tQrXLIMwpBxZmHqGwC5rfGKrADI';
  let supabase;
  if (serviceRoleKey) {
    supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
    console.log('Using service_role client');
  } else {
    supabase = createClient(supabaseUrl, anonKey);
    console.log('Fallback to anon client (RLS may block)');
  }

  try {
    console.log('Starting insert for userId:', userId, 'orderId:', orderId, 'total:', total); // Debug step 1
    // Insert order as single object (fix batch issues)
    const { data, error: insertError } = await supabase
      .from('orders')
      .insert({ user_id: userId, order_id: orderId, total })  // Single {} vs [{...}]
      .select();

    if (insertError) {
      console.error('Insert error details:', insertError.message, 'Code:', insertError.code, 'Hint:', insertError.hint); // Detailed log
      throw insertError;
    }

    console.log('Order inserted ID:', data.id); // Debug step 2 (single = data.id)

    // Skip welcome pour isoler (ajoute si insert OK)

    return res.status(200).json({ success: true, orderId: data.id });

  } catch (error) {
    console.error('API log-order full error:', error.message || error, { userId, orderId });
    return res.status(500).json({ error: 'Internal server error: ' + (error.message || 'Unknown') });
  }
}