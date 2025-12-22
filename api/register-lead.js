/**
 * Vercel serverless function:
 * - Recibe datos de un Lead (email, nombre) desde el frontend.
 * - Reenvía un payload al Apps Script (APPS_URL) incluyendo APPS_API_KEY.
 * - Tipo: 'lead'
 */

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).send('Method Not Allowed');
    }

    const { email, name, newsletter } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Construye el payload para el Apps Script siguiendo el orden de code.gs
    const forwardPayload = {
        apiKey: process.env.APPS_API_KEY,
        name: name || 'Anonymous',
        email: email,
        phone: '', // No phone for leads usually
        transactionId: 'LEAD_' + Date.now(),
        tipo: 'LEAD_REGISTRATION', // MetodoPago column in script
        amount: '0',
        currency: 'USD',
        productos: newsletter ? 'Newsletter Opt-in' : 'Lead Only',
        timestamp: new Date().toISOString(),
    };

    try {
        // Enviamos 'no-cors' desde el cliente no funciona para leer respuesta, pero aquí en servidor sí.
        // Sin embargo, Google Apps Script a veces requiere redirecciones (follow redirects).
        const r = await fetch(process.env.APPS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(forwardPayload),
        });

        const text = await r.text();

        // Apps Script a veces devuelve 302 a una página de confirmación, fetch lo sigue automáticamente.
        // Si llegamos aquí, asumimos que se envió.

        return res.status(200).json({ ok: true, googleResponse: text });
    } catch (err) {
        console.error('Error forwarding lead to Apps Script:', err);
        // No queremos romper el flujo del usuario si esto falla, así que devolvemos 200 pero con error logueado?
        // Mejor avisar al frontend que falló "silenciosamente" o simplemente loguear.
        return res.status(500).json({ error: 'Failed to save lead' });
    }
}
