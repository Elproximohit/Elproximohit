import { Resend } from "resend";
import type { IncomingMessage, ServerResponse } from "http";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  try {
    const data = await resend.emails.send({
      from: "El Próximo Hit <noreply@elproximohit.com>",
      to: ["lapbrian@gmail.com"], // pon tu email real
      subject: "✅ Prueba Resend desde Codespaces",
      html: `
        <h1>Funciona 🔥</h1>
        <p>Resend está enviando correctamente desde Codespaces.</p>
      `,
    });

    res.statusCode = 200;
    res.end(JSON.stringify({ success: true, data }));
  } catch (error: any) {
    console.error(error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message }));
  }
}
