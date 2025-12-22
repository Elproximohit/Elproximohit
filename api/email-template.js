/**
 * Template de Email Premium para Resend
 * Estética: Dark theme con gradientes #FF0000 y #FF00FF
 * Fuentes: Space Grotesk (body) y Syncopate (headings)
 * 
 * Para usar en Resend:
 * 1. Copia este código completo
 * 2. Ve a resend.com → Emails → Create Template
 * 3. Pega el código en el editor
 * 4. Guarda como "purchase-confirmation"
 */

export const PurchaseConfirmationEmail = ({
    customerName = "Artista",
    customerEmail = "cliente@ejemplo.com",
    transactionId = "TXN_XXXXXX",
    purchaseDate = new Date().toLocaleDateString('es-PR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }),
    amount = "$10.00",
    pdfDownloadLink = "https://drive.google.com/uc?export=download&id=16FriG8rNgc-tRi-ff1w2rY0CDv2nZnUi",
    templateDownloadLink = "https://drive.google.com/uc?export=download&id=13V0yhcbtHBQLW2bGJ7cj1omzXbsScDaX"
}) => {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syncopate:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #000000;
      color: #ffffff;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    .email-wrapper {
      background: #000000;
      padding: 40px 20px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(255, 0, 255, 0.15);
    }
    .header {
      background: linear-gradient(135deg, #FF0000 0%, #FF00FF 100%);
      padding: 40px 30px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      animation: pulse 4s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }
    .logo {
      font-family: 'Syncopate', sans-serif;
      font-size: 32px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin: 0;
      position: relative;
      z-index: 1;
      text-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }
    .tagline {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 4px;
      margin-top: 8px;
      opacity: 0.9;
      position: relative;
      z-index: 1;
    }
    .content {
      padding: 40px 30px;
    }
    h2 {
      font-family: 'Syncopate', sans-serif;
      font-size: 24px;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 20px;
      background: linear-gradient(90deg, #FF00FF 0%, #FF0000 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
      color: #ffffff;
    }
    .message {
      color: #cccccc;
      margin-bottom: 30px;
      font-size: 15px;
    }
    .divider {
      height: 2px;
      background: linear-gradient(90deg, transparent 0%, #FF00FF 50%, transparent 100%);
      margin: 30px 0;
      opacity: 0.3;
    }
    .download-section {
      background: rgba(255, 0, 255, 0.05);
      border: 1px solid rgba(255, 0, 255, 0.2);
      border-radius: 12px;
      padding: 30px;
      margin: 30px 0;
    }
    .download-title {
      font-family: 'Syncopate', sans-serif;
      font-size: 16px;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 20px;
      color: #FF00FF;
    }
    .download-button {
      display: inline-block;
      background: linear-gradient(135deg, #FF0000 0%, #DC143C 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 10px 10px 10px 0;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(255, 0, 0, 0.3);
    }
    .download-button:hover {
      background: linear-gradient(135deg, #DC143C 0%, #FF0000 100%);
      box-shadow: 0 6px 25px rgba(255, 0, 0, 0.5);
      transform: translateY(-2px);
    }
    .giveaway-box {
      background: linear-gradient(135deg, rgba(255, 0, 0, 0.1) 0%, rgba(255, 0, 255, 0.1) 100%);
      border: 2px solid rgba(255, 0, 255, 0.3);
      border-radius: 12px;
      padding: 25px;
      margin: 30px 0;
      text-align: center;
    }
    .giveaway-title {
      font-family: 'Syncopate', sans-serif;
      font-size: 18px;
      color: #FF00FF;
      margin-bottom: 10px;
      text-transform: uppercase;
    }
    .giveaway-text {
      color: #cccccc;
      font-size: 14px;
    }
    .purchase-details {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 20px;
      margin: 30px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 14px;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      color: #999999;
      font-weight: 500;
    }
    .detail-value {
      color: #ffffff;
      font-weight: 600;
    }
    .footer {
      background: #0a0a0a;
      padding: 30px;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .footer-text {
      font-size: 12px;
      color: #666666;
      line-height: 1.8;
    }
    .footer-link {
      color: #FF00FF;
      text-decoration: none;
    }
    .footer-link:hover {
      text-decoration: underline;
    }
    .social-links {
      margin-top: 20px;
    }
    .social-link {
      display: inline-block;
      margin: 0 10px;
      color: #999999;
      text-decoration: none;
      font-size: 12px;
      transition: color 0.3s ease;
    }
    .social-link:hover {
      color: #FF00FF;
    }
    @media only screen and (max-width: 600px) {
      .email-wrapper { padding: 20px 10px; }
      .content { padding: 30px 20px; }
      .logo { font-size: 24px; }
      h2 { font-size: 20px; }
      .download-button { display: block; margin: 10px 0; text-align: center; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <!-- Header -->
      <div class="header">
        <h1 class="logo">🎵 EL PRÓXIMO HIT</h1>
        <p class="tagline">Crea Tu Legado</p>
      </div>

      <!-- Content -->
      <div class="content">
        <h2>¡Gracias por tu compra!</h2>
        
        <p class="greeting">Hola <strong>${customerName}</strong>,</p>
        
        <p class="message">
          Tu inversión en tu carrera musical acaba de comenzar. Estamos emocionados de que formes parte de la comunidad de <strong>El Próximo Hit</strong>.
        </p>

        <div class="divider"></div>

        <!-- Download Section -->
        <div class="download-section">
          <h3 class="download-title">📥 Descarga tus recursos</h3>
          <p style="color: #cccccc; margin-bottom: 20px; font-size: 14px;">
            Haz clic en los botones para descargar tu guía y plantilla. Guarda estos links en un lugar seguro.
          </p>
          <a href="${pdfDownloadLink}" class="download-button">
            📄 Descargar Guía PDF
          </a>
          <a href="${templateDownloadLink}" class="download-button">
            🎚️ Plantilla Pro Tools
          </a>
        </div>

        <!-- Giveaway Box -->
        <div class="giveaway-box">
          <h3 class="giveaway-title">🎁 Estás en el Giveaway</h3>
          <p class="giveaway-text">
            Tu compra te da entrada automática para ganar una <strong>producción completa</strong> valorada en <strong>$2,500 USD</strong>. Incluye beat, mezcla y masterización profesional.
          </p>
        </div>

        <div class="divider"></div>

        <!-- Purchase Details -->
        <div class="purchase-details">
          <div class="detail-row">
            <span class="detail-label">Producto:</span>
            <span class="detail-value">Guía El Próximo Hit + Bonus</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Monto:</span>
            <span class="detail-value">${amount} USD</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Fecha:</span>
            <span class="detail-value">${purchaseDate}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value">${customerEmail}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">ID de Transacción:</span>
            <span class="detail-value" style="font-family: monospace; font-size: 11px;">${transactionId}</span>
          </div>
        </div>

        <p class="message" style="text-align: center; margin-top: 30px;">
          <strong>¿Tienes preguntas o necesitas ayuda?</strong><br>
          Responde a este correo y te asistiremos lo antes posible.
        </p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p class="footer-text">
          © 2025 <strong>El Próximo Hit</strong>. Todos los derechos reservados.<br>
          Este correo fue enviado porque completaste una compra en <a href="https://elproximohit.com" class="footer-link">elproximohit.com</a>
        </p>
        
        <div class="social-links">
          <a href="https://instagram.com/elproximohit" class="social-link">Instagram</a>
          <a href="https://tiktok.com/@elproximohit" class="social-link">TikTok</a>
          <a href="https://elproximohit.com" class="social-link">Web</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};
