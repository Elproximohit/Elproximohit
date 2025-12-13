// api/stripe-webhook.ts
import Stripe from "stripe";
import { buffer } from "micro";
import type { IncomingMessage, ServerResponse } from "http";
import emailjs from "emailjs-com";

export const config = {
  api: {
    bodyParser: false, // Stripe requires raw body
  },
};

// Inicializa Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

const webhookSecret = process.env.WEBHOOK_SECRET!;

export default async function handler(
  req: IncomingMessage & { headers: any; body?: any },
  res: ServerResponse
) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end("Method Not Allowed");
    return;
  }

  const buf = await buffer(req as any); // micro buffer
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    res.statusCode = 400;
    res.end(`Webhook Error: ${err.message}`);
    return;
  }

  // Solo manejamos checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_email;
    const productName = session.metadata?.productName || "Producto";

    // Enviar Email con EmailJS
    try {
      await emailjs.send(
        process.env.EMAILJS_SERVICE_ID!,
        process.env.EMAILJS_TEMPLATE_ID!,
        {
          to_email: customerEmail,
          product_name: productName,
          pdf_url: process.env.PDF_URL,
          protools_template_url: process.env.PROTOOLS_TEMPLATE_URL,
        },
        process.env.EMAILJS_USER_ID!
      );
      console.log(`Email enviado a ${customerEmail}`);
    } catch (err) {
      console.error("Error enviando email:", err);
    }
  }

  res.statusCode = 200;
  res.end(JSON.stringify({ received: true }));
}