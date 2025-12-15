import Stripe from "stripe";
import { VercelRequest, VercelResponse } from "@vercel/node";
import emailjs from "@emailjs/nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sig = req.headers["stripe-signature"];

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      process.env.WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;

    if (customerEmail) {
      try {
        await emailjs.send(
          process.env.EMAILJS_SERVICE_ID!,
          process.env.EMAILJS_TEMPLATE_ID!,
          {
            to_email: customerEmail,
            pdf_url: process.env.PDF_URL,
            template_url: process.env.PROTOOLS_TEMPLATE_URL,
          },
          {
            publicKey: process.env.EMAILJS_USER_ID!,
          }
        );

        console.log("Email sent to:", customerEmail);
      } catch (emailError) {
        console.error("EmailJS error:", emailError);
      }
    }
  }

  res.status(200).json({ received: true });
}