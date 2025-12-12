/**
 * saveRow(payload, isExternal) -> { transactionId, evidenciaUrl }
 * Versión con deduplicación por ID Transacción: si transactionId existe actualiza fila.
 */
function saveRow(payload, isExternal) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  // Encabezados mínimos
  var headersRange = sheet.getRange(1, 1, 1, Math.max(5, sheet.getLastColumn()));
  var headers = headersRange.getValues()[0].map(function(h){ return String(h || "").trim(); });
  if (headers[0] !== "Fecha") {
    sheet.getRange(1, 1, 1, 7).setValues([["Fecha", "Nombre", "Email", "Teléfono", "ID Transacción", "Tipo", "Evidencia URL"]]);
    headers = ["Fecha", "Nombre", "Email", "Teléfono", "ID Transacción", "Tipo", "Evidencia URL"];
  }

  // Guardar evidencia (si viene)
  var evidenciaUrl = "";
  if (payload.evidence_b64 && payload.evidence_name) {
    evidenciaUrl = saveFileFromBase64(payload.evidence_b64, payload.evidence_name);
  }

  // transactionId: si no viene y tipo == 'compra' generamos UUID
  var txId = payload.transactionId || payload.transaction_id || "";
  var tipoVal = (payload.tipo || payload.type || "lead").toString().toLowerCase();
  if (!txId && tipoVal === "compra") txId = Utilities.getUuid();

  // Construir mapping de la fila
  var rowObj = {};
  for (var i = 0; i < headers.length; i++) rowObj[headers[i]] = "";
  setIfHeaderExists(rowObj, headers, "Fecha", new Date());
  setIfHeaderExists(rowObj, headers, "Nombre", payload.name || payload.nombre || "");
  setIfHeaderExists(rowObj, headers, "Email", payload.email || "");
  setIfHeaderExists(rowObj, headers, "Teléfono", payload.phone || payload.telefono || "");
  setIfHeaderExists(rowObj, headers, "ID Transacción", txId);
  setIfHeaderExists(rowObj, headers, "Tipo", tipoVal);
  if (evidenciaUrl) setIfHeaderExists(rowObj, headers, "Evidencia URL", evidenciaUrl);

  // Si viene txId, buscar fila existente y actualizar en vez de append
  if (txId) {
    var colIndex = headers.indexOf("ID Transacción");
    if (colIndex !== -1) {
      var values = sheet.getRange(2, colIndex + 1, Math.max(0, sheet.getLastRow() - 1), 1).getValues();
      for (var r = 0; r < values.length; r++) {
        if (String(values[r][0]) === String(txId)) {
          // fila encontrada: actualizar todas las columnas con rowObj
          var updateRow = [];
          for (var j = 0; j < headers.length; j++) {
            var v = rowObj[headers[j]];
            updateRow.push(v instanceof Date ? v : (v === null ? "" : String(v)));
          }
          sheet.getRange(r + 2, 1, 1, updateRow.length).setValues([updateRow]);
          return { transactionId: txId, evidenciaUrl: evidenciaUrl };
        }
      }
    }
  }

  // Si no se encontró o no hay txId: appendRow
  var rowArray = headers.map(function(h) {
    var v = rowObj[h];
    return v instanceof Date ? v : (v === null ? "" : String(v));
  });
  sheet.appendRow(rowArray);

  return { transactionId: txId, evidenciaUrl: evidenciaUrl };
}
