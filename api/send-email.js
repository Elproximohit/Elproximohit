/**
 * Vercel serverless function:
 * - Envía correos automáticos usando Resend con template premium
 * - Adjunta PDFs directamente al email
 * 
 * Variables de entorno requeridas (configurar en Vercel):
 * - RESEND_API_KEY
 * - PDF_DOWNLOAD_LINK (URL pública del PDF)
 * - TEMPLATE_DOWNLOAD_LINK (URL pública de la plantilla)
 */

import { PurchaseConfirmationEmail } from './email-template.js';

async function fetchFileAsBase64(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer.toString('base64');
  } catch (error) {
    console.error('Error fetching file:', error);
    return null;
  }
}

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

  // Fetch attachments in parallel
  const [pdfBase64, templateBase64] = await Promise.all([
    fetchFileAsBase64(pdfUrl),
    fetchFileAsBase64(templateUrl)
  ]);

  const attachments = [];

  if (pdfBase64) {
    attachments.push({
      filename: 'El-Proximo-Hit-Guia.pdf',
      content: pdfBase64
    });
  }

  if (templateBase64) {
    attachments.push({
      filename: 'Pro-Tools-Template.ptx',
      content: templateBase64
    });
  }

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
    }),
    attachments: attachments.length > 0 ? attachments : undefined
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
      emailId: data.id,
      attachmentsIncluded: attachments.length
    });
  } catch (err) {
    console.error('Error sending email:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
