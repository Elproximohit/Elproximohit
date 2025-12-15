import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

export const config = {
  runtime: "edge",
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const resend = new Resend(process.env.RESEND_API_KEY!);
const webhookSecret = process.env.WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const buf = await req.arrayBuffer();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(Buffer.from(buf), sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_email;
    const productName = session.metadata?.productName || "Producto";

    try {
      await resend.emails.send({
        from: "tucorreo@elproximohit.com",
        to: customerEmail!,
        subject: `Tu PDF: ${productName}`,
        html: `<p>Hola!</p>
               <p>Gracias por tu compra de <strong>${productName}</strong>.</p>
               <p>Descarga tu PDF <a href="${process.env.PDF_URL}">aquí</a></p>
               <p>Si tienes problemas contacta a elproximohits@gmail.com</p>`,
      });
      console.log(`Email enviado a ${customerEmail}`);
    } catch (err) {
      console.error("Error enviando email:", err);
    }
  }

  return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
}
