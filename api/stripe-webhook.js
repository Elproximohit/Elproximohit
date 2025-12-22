/**
 * Vercel serverless function:
 * - Valida la firma del webhook de Stripe (STRIPE_SIGNING_SECRET)
 * - Reconstruye el evento
 * - Reenvía un payload seguro al Apps Script (APPS_URL) incluyendo APPS_API_KEY
 *
 * Variables de entorno requeridas (configurar en Vercel):
 * - STRIPE_SIGNING_SECRET
 * - APPS_URL
 * - APPS_API_KEY
 * - (opcional) STRIPE_SECRET_KEY si necesitas usar la SDK aparte
 *
 * Guardar como: api/stripe-webhook.js
 */

import Stripe from 'stripe';

export const config = {
  api: {
    bodyParser: false, // importante: necesitamos el body raw para verificar la firma
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15',
});

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  const signature = req.headers['stripe-signature'];
  if (!signature) return res.status(400).send('Missing stripe-signature header');

  let rawBody;
  try {
    rawBody = await getRawBody(req);
  } catch (err) {
    console.error('Error reading raw body:', err);
    return res.status(500).send('Error reading request body');
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_SIGNING_SECRET);
  } catch (err) {
    console.error('Signature verification failed:', err.message);
    return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
  }

  const session = event.data.object;

  // Construye el payload que coincide exactamente con los campos del code.gs
  const forwardPayload = {
    apiKey: process.env.APPS_API_KEY,
    name: session?.customer_details?.name || session?.billing_details?.name || 'Stripe Customer',
    email: session?.customer_details?.email || session?.billing_details?.email || '',
    phone: session?.customer_details?.phone || '',
    transactionId: session.id, // Checkout Session ID
    tipo: 'STRIPE_CHECKOUT_OK', // Para la columna MetodoPago
    amount: session.amount_total ? (session.amount_total / 100).toFixed(2) : '0',
    currency: session.currency?.toUpperCase() || 'USD',
    productos: 'Guía El Próximo Hit + Bonus', // Valor por defecto o extraer de line_items si es posible
    timestamp: new Date().toISOString()
  };

  try {
    const r = await fetch(process.env.APPS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(forwardPayload),
    });

    const text = await r.text();
    if (!r.ok) {
      console.error('Apps Script responded with status', r.status, text);
      return res.status(502).json({ ok: false, forwarded: true, appsScriptStatus: r.status, appsScriptResponse: text });
    }

    // NUEVO: Enviar email automático con Resend
    try {
      const emailPayload = {
        email: forwardPayload.email,
        name: forwardPayload.name,
        transactionId: forwardPayload.transactionId
      };

      const emailResponse = await fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailPayload)
      });

      if (!emailResponse.ok) {
        console.error('Email sending failed, but payment was processed');
      } else {
        console.log('Email sent successfully to', forwardPayload.email);
      }
    } catch (emailErr) {
      console.error('Error sending email (non-critical):', emailErr);
      // No bloqueamos la respuesta a Stripe por un error de email
    }

    // Responder OK a Stripe
    return res.status(200).json({ ok: true, forwarded: true, appsScriptStatus: r.status, appsScriptResponse: text });
  } catch (err) {
    console.error('Error forwarding to Apps Script:', err);
    return res.status(500).send('Error forwarding to Apps Script');
  }
}
