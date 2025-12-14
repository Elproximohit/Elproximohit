import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});
const webhookSecret = process.env.STRIPE_SIGNING_SECRET!;
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  const buf = await req.arrayBuffer();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(Buffer.from(buf), sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_email;
    const productName = session.metadata?.productName || "Producto";

    try {
      await resend.emails.send({
        from: "El Próximo Hit <ventas@elproximohit.com>",
        to: [customerEmail!],
        subject: `Tu compra de ${productName}`,
        html: `
          <h1>Gracias por tu compra</h1>
          <p>Tu PDF y template están listos.</p>
          <p><a href="\${process.env.PDF_URL}">Descargar PDF</a></p>
        `,
      });
      console.log(\`Email enviado a \${customerEmail}\`);
    } catch (err) {
      console.error("Error enviando email:", err);
    }
  }

  return NextResponse.json({ received: true });
}
