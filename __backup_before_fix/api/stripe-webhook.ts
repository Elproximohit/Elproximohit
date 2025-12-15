// api/stripe-webhook.ts
import Stripe from "stripe";
import { buffer } from "micro";
import type { IncomingMessage, ServerResponse } from "http";
import { Resend } from "resend";

export const config = {
  api: {
    bodyParser: false, // Stripe requiere raw body
  },
};

// Inicializa Stripe con versión estable
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// Inicializa Resend
const resend = new Resend(process.env.RESEND_API_KEY!);

// Secret del webhook de Stripe
const webhookSecret = process.env.WEBHOOK_SECRET!;

export default async function handler(
  req: IncomingMessage & { headers: any },
  res: ServerResponse
) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end("Method Not Allowed");
    return;
  }

  // Buffer de la request (Stripe requiere raw body)
  const buf = await buffer(req as any);
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

    try {
      // Envío de email con Resend
      await resend.emails.send({
        from: "tucorreo@elproximohit.com",
        to: customerEmail!,
        subject: `Tu PDF: ${productName}`,
        html: `
          <p>Hola!</p>
          <p>Gracias por tu compra de <strong>${productName}</strong>.</p>
          <p>Descarga tu PDF <a href="${process.env.PDF_URL}">aquí</a></p>
          <p>Si tienes problemas contacta a elproximohits@gmail.com</p>
        `,
      });

      console.log(`Email enviado a ${customerEmail}`);
    } catch (err) {
      console.error("Error enviando email:", err);
    }
  }

  res.statusCode = 200;
  res.end(JSON.stringify({ received: true }));
}
