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

  // Construye el payload que quieres enviar al Apps Script.
  // Ajusta los campos según lo que tu Apps Script espera.
  const forwardPayload = {
    apiKey: process.env.APPS_API_KEY,
    name: event.data?.object?.billing_details?.name || 'Stripe Customer',
    email: event.data?.object?.billing_details?.email || '',
    transactionId: event.id,      // identificador del evento (puedes cambiar)
    tipo: event.type || 'stripe_event',
    event: event,                 // opcional: enviar todo el objeto del evento
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

    // Responder OK a Stripe
    return res.status(200).json({ ok: true, forwarded: true, appsScriptStatus: r.status, appsScriptResponse: text });
  } catch (err) {
    console.error('Error forwarding to Apps Script:', err);
    return res.status(500).send('Error forwarding to Apps Script');
  }
}
