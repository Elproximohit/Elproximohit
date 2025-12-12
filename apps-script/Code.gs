// Code.gs - Apps Script (standalone)
// CONFIGURA: SHEET_ID, SHEET_NAME, FOLDER_ID (opcional).
// La API_KEY se lee desde Script Properties (no en el repo).

const SHEET_ID = "1_BlOfeRWqy1TEnKGwE87JldieNvoh4NI6MCVqm7_mTA";
const SHEET_NAME = "Base de Datos - Clientes";
const FOLDER_ID = ""; // opcional: ID de carpeta en Drive (vacío => raíz)

// Obtiene API key desde Script Properties
function getApiKey() {
  return PropertiesService.getScriptProperties().getProperty('API_KEY') || null;
}

// doGet sirve el formulario (index.html)
function doGet(e) {
  const tpl = HtmlService.createTemplateFromFile('index');
  return tpl.evaluate()
    .setTitle('Formulario - Enviar cliente / compra')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Llamada desde el formulario servido (google.script.run)
function submitFromClient(payload) {
  payload = payload || {};
  payload.name = String(payload.name || "").trim();
  payload.email = String(payload.email || "").trim();
  payload.phone = String(payload.phone || "").trim();
  payload.transactionId = payload.transactionId || "";
  payload.tipo = (payload.tipo || "lead").toString().toLowerCase();
  payload.nota = payload.nota || payload.note || "";

  // Revalidar tamaño aproximado de evidencia
  if (payload.evidence_b64) {
    var approxBytes = Math.ceil((payload.evidence_b64.length * 3) / 4);
    var maxBytes = 6 * 1024 * 1024; // 6 MB
    if (approxBytes > maxBytes) return { result: "error", error: "EVIDENCE_TOO_LARGE" };
  }

  try {
    var result = saveRow(payload, false);
    return { result: "success", transactionId: result.transactionId || "" };
  } catch (err) {
    return { result: "error", error: String(err) };
  }
}

// doPost para integraciones externas (webhooks). Requiere apiKey en el JSON.
function doPost(e) {
  var body = {};
  try { body = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {}; }
  catch (parseErr) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: "JSON inválido", details: String(parseErr) }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var API_KEY = getApiKey();
  if (!API_KEY) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: "Server misconfiguration: API_KEY not set" }))
      .setMimeType(ContentService.MimeType.JSON).setResponseCode(500);
  }
  if (!body.apiKey || body.apiKey !== API_KEY) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: "Unauthorized - invalid apiKey" }))
      .setMimeType(ContentService.MimeType.JSON).setResponseCode(401);
  }

  try {
    var result = saveRow(body, true);
    return ContentService.createTextOutput(JSON.stringify({ result: "success", transactionId: result.transactionId || "" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * saveRow(payload, isExternal) -> { transactionId, evidenciaUrl }
 */
function saveRow(payload, isExternal) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  // Encabezados mínimos (si no existen)
  var headersRange = sheet.getRange(1, 1, 1, Math.max(5, sheet.getLastColumn()));
  var headers = headersRange.getValues()[0].map(function(h){ return String(h || "").trim(); });
  if (headers[0] !== "Fecha") {
    sheet.getRange(1, 1, 1, 7).setValues([["Fecha", "Nombre", "Email", "Teléfono", "ID Transacción", "Tipo", "Evidencia URL"]]);
    headers = ["Fecha", "Nombre", "Email", "Teléfono", "ID Transacción", "Tipo", "Evidencia URL"];
  }

  // Guardar evidencia
  var evidenciaUrl = "";
  if (payload.evidence_b64 && payload.evidence_name) {
    evidenciaUrl = saveFileFromBase64(payload.evidence_b64, payload.evidence_name);
  }

  // transactionId: si no viene y tipo == 'compra' generamos UUID
  var txId = payload.transactionId || payload.transaction_id || "";
  var tipoVal = (payload.tipo || payload.type || "lead").toString().toLowerCase();
  if (!txId && tipoVal === "compra") txId = Utilities.getUuid();

  // Construcción de la fila
  var rowObj = {};
  for (var i = 0; i < headers.length; i++) rowObj[headers[i]] = "";
  setIfHeaderExists(rowObj, headers, "Fecha", new Date());
  setIfHeaderExists(rowObj, headers, "Nombre", payload.name || payload.nombre || "");
  setIfHeaderExists(rowObj, headers, "Email", payload.email || "");
  setIfHeaderExists(rowObj, headers, "Teléfono", payload.phone || payload.telefono || "");
  setIfHeaderExists(rowObj, headers, "ID Transacción", txId);
  setIfHeaderExists(rowObj, headers, "Tipo", tipoVal);
  if (evidenciaUrl) setIfHeaderExists(rowObj, headers, "Evidencia URL", evidenciaUrl);

  var rowArray = headers.map(function(h) {
    var v = rowObj[h];
    return v instanceof Date ? v : (v === null ? "" : String(v));
  });
  sheet.appendRow(rowArray);

  return { transactionId: txId, evidenciaUrl: evidenciaUrl };
}

/**
 * Guarda archivo en Drive desde base64. Devuelve URL privada (no compartida).
 */
function saveFileFromBase64(base64Data, filename) {
  var b64 = base64Data;
  var contentType = "application/octet-stream";
  var match = /^data:(.+);base64,(.+)$/.exec(base64Data);
  if (match) { contentType = match[1]; b64 = match[2]; }
  var bytes = Utilities.base64Decode(b64);
  var blob = Utilities.newBlob(bytes, contentType, filename);
  var folder = FOLDER_ID ? DriveApp.getFolderById(FOLDER_ID) : DriveApp.getRootFolder();
  var file = folder.createFile(blob);
  // Seguridad: por defecto NO hacemos público el archivo.
  // Si en un futuro quieres que sea accesible por link, descomenta la siguiente línea:
  // file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

function setIfHeaderExists(rowObj, headers, headerName, value) {
  for (var i = 0; i < headers.length; i++) {
    if (headers[i] === headerName) { rowObj[headerName] = value; return; }
  }
  var target = normalize(headerName);
  for (var j = 0; j < headers.length; j++) {
    if (normalize(headers[j]) === target) { rowObj[headers[j]] = value; return; }
  }
}

function normalize(s) {
  return String(s || "").toLowerCase().replace(/\s+/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
