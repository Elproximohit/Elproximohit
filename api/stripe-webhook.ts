import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET as string, { apiVersion: "2022-11-15" });

// get raw body (works in Vercel serverless)
async function getRawBody(req: any) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks).toString();
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const sig = (req.headers["stripe-signature"] || req.headers["Stripe-Signature"]) as string | undefined;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!endpointSecret) return res.status(500).send("Server misconfiguration: STRIPE_WEBHOOK_SECRET missing");

  let event: Stripe.Event;
  try {
    const raw = await getRawBody(req);
    event = stripe.webhooks.constructEvent(raw, sig || "", endpointSecret);
  } catch (err: any) {
    console.error("Stripe webhook signature verification failed:", err && err.message);
    return res.status(400).send(\`Webhook Error: \${err && err.message}\`);
  }

  try {
    // Manejar eventos relevantes
    if (event.type === "checkout.session.completed" || event.type === "payment_intent.succeeded") {
      let email = "";
      let name = "";
      let transactionId = "";

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        email = session.customer_details?.email || "";
        name = session.customer_details?.name || "";
        transactionId = session.id;
      } else {
        const pi = event.data.object as Stripe.PaymentIntent;
        transactionId = pi.id;
        email = (pi.receipt_email || "") as string;
      }

      const payload = {
        apiKey: process.env.APPS_API_KEY,
        name,
        email,
        transactionId,
        tipo: "compra",
        estado_pago: "completado",
        nota: JSON.stringify({ stripeEvent: event.type })
      };

      // Llamada a tu Apps Script doPost
      const resp = await fetch(process.env.APPS_SCRIPT_URL as string, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const text = await resp.text();
      console.log("AppsScript response:", text);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Error processing webhook:", err);
    res.status(500).send("Internal error");
  }
}
