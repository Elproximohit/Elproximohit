export default function handler(request, response) {
    // En el futuro, aquí conectaríamos con Google Sheets o una base de datos real
    // para obtener el número exacto de filas/ventas.

    // Por ahora, devolvemos un número estático alto para mantener la urgencia,
    // pero ya NO se incrementará falsamente en el cliente.
    const currentCount = 17;

    return response.status(200).json({ count: currentCount });
}
