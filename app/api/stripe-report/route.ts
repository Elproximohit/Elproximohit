// route.ts
import Stripe from "stripe";
import type { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

const webhookSecret = process.env.STRIPE_SIGNING_SECRET_REPORT!;

export const POST = async (req: NextRequest) => {
  const buf = await req.arrayBuffer();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(Buffer.from(buf), sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse(\`Webhook Error: \${err.message}\`, { status: 401 });
  }

  // Manejar eventos específicos de report
  if (event.type.startsWith("report.")) {
    console.log("Evento report recibido:", event.type);
  }

  return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
};
