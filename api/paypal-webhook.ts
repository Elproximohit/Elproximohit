// PayPal webhook handler (verifica firma via API call 'verify-webhook-signature')
/*
  REQUISITOS:
  - Configura en Vercel:
    PAYPAL_CLIENT_ID, PAYPAL_SECRET, PAYPAL_WEBHOOK_ID, APPS_SCRIPT_URL, APPS_API_KEY
*/

async function getRawBody(req: any) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks).toString();
}

async function getPaypalAccessToken(clientId: string, secret: string) {
  const tokenResp = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: { Authorization: "Basic " + Buffer.from(`${clientId}:${secret}`).toString("base64"), "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials"
  });
  if (!tokenResp.ok) throw new Error("Failed to get PayPal access token");
  const json = await tokenResp.json();
  return json.access_token;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const raw = await getRawBody(req);
  let eventBody;
  try { eventBody = JSON.parse(raw); } catch (e) { return res.status(400).send("Invalid JSON"); }

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!clientId || !secret || !webhookId) return res.status(500).send("Server misconfiguration: PayPal env missing");

  try {
    const accessToken = await getPaypalAccessToken(clientId, secret);

    const verifyPayload = {
      auth_algo: req.headers["paypal-auth-algo"],
      cert_url: req.headers["paypal-cert-url"],
      transmission_id: req.headers["paypal-transmission-id"],
      transmission_sig: req.headers["paypal-transmission-sig"],
      transmission_time: req.headers["paypal-transmission-time"],
      webhook_id: webhookId,
      webhook_event: eventBody
    };

    const verifyResp = await fetch("https://api-m.paypal.com/v1/notifications/verify-webhook-signature", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(verifyPayload)
    });
    const verifyJson = await verifyResp.json();
    if (verifyJson.verification_status !== "SUCCESS") {
      console.error("PayPal webhook verification failed:", verifyJson);
      return res.status(400).send("Invalid webhook signature");
    }

    const eventType = eventBody.event_type || "";
    if (eventType === "PAYMENT.CAPTURE.COMPLETED" || eventType === "CHECKOUT.ORDER.APPROVED") {
      let email = "";
      let name = "";
      let transactionId = "";

      if (eventBody.resource) {
        transactionId = eventBody.resource.id || "";
        if (eventBody.resource.payer && eventBody.resource.payer.email_address) {
          email = eventBody.resource.payer.email_address;
        }
        if (eventBody.resource.payer && eventBody.resource.payer.name) {
          name = (eventBody.resource.payer.name.given_name || "") + " " + (eventBody.resource.payer.name.surname || "");
        }
      }

      const payload = {
        apiKey: process.env.APPS_API_KEY,
        name,
        email,
        transactionId,
        tipo: "compra",
        estado_pago: "completado",
        nota: JSON.stringify({ paypalEvent: eventType })
      };

      const resp = await fetch(process.env.APPS_SCRIPT_URL as string, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const text = await resp.text();
      console.log("AppsScript response (paypal):", text);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Error in PayPal webhook handler:", err);
    res.status(500).send("Internal error");
  }
}
