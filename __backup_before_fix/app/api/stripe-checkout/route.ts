// route.ts
import Stripe from "stripe";
import type { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "edge";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

const webhookSecret = process.env.STRIPE_SIGNING_SECRET_CHECKOUT!;
const resend = new Resend(process.env.RESEND_API_KEY!);

export const POST = async (req: NextRequest) => {
  const buf = await req.arrayBuffer();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(Buffer.from(buf), sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 401 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_email;
    const productName = session.metadata?.productName || "Producto";

    try {
      await resend.emails.send({
        from: "elproximohits@gmail.com",
        to: customerEmail!,
        subject: `Tu compra de ${productName}`,
        html: `
          <p>Gracias por tu compra de <strong>${productName}</strong>.</p>
          <p>Puedes descargar tu PDF aquí: <a href="${process.env.PDF_URL}">Descargar PDF</a></p>
        `,
      });
      console.log(`Email enviado a ${customerEmail}`);
    } catch (err) {
      console.error("Error enviando email:", err);
    }
  }

  return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
};
