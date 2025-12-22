/**
 * Vercel serverless function:
 * - Envía correos automáticos usando Resend con template premium
 * - Links de descarga (attachments exceden 40MB limit de Resend)
 * 
 * Variables de entorno requeridas (configurar en Vercel):
 * - RESEND_API_KEY
 */

import { PurchaseConfirmationEmail } from './email-template.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  const { email, name, transactionId, amount = '$10.00' } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const purchaseDate = new Date().toLocaleDateString('es-PR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const pdfUrl = process.env.PDF_DOWNLOAD_LINK || 'https://drive.google.com/uc?export=download&id=16FriG8rNgc-tRi-ff1w2rY0CDv2nZnUi';
  const templateUrl = process.env.TEMPLATE_DOWNLOAD_LINK || 'https://drive.google.com/uc?export=download&id=13V0yhcbtHBQLW2bGJ7cj1omzXbsScDaX';

  const emailPayload = {
    from: 'El Próximo Hit <noreply@send.elproximohit.com>',
    to: [email],
    subject: '🎵 Tu Guía "El Próximo Hit" está lista',
    html: PurchaseConfirmationEmail({
      customerName: name || 'Artista',
      customerEmail: email,
      transactionId: transactionId || 'N/A',
      purchaseDate: purchaseDate,
      amount: amount,
      pdfDownloadLink: pdfUrl,
      templateDownloadLink: templateUrl
    })
  };

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API Error:', data);
      return res.status(response.status).json({ error: 'Failed to send email', details: data });
    }

    return res.status(200).json({
      success: true,
      emailId: data.id
    });
  } catch (err) {
    console.error('Error sending email:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
