# Apps Script — Integración Google Sheets / Formulario

Contenido:
- `Code.gs` — Backend de Apps Script (doGet, doPost, lógica de guardado en Google Sheets y Drive).
- `index.html` — Formulario servido por Apps Script (usa `google.script.run`).

Antes de subir:
1. Asegúrate de que `file.setSharing(...)` permanezca comentada si NO quieres que los archivos en Drive sean públicos.
2. NO incluyas la API_KEY en este repo. Usa Script Properties en Apps Script.

Cómo añadir al repo (local)
```bash
git checkout -b feature/add-apps-script-secure
mkdir -p apps-script
# Copia aquí Code.gs e index.html
git add apps-script/Code.gs apps-script/index.html apps-script/README.md
git commit -m "Add secure Apps Script integration (Code.gs + index.html)"
git push -u origin feature/add-apps-script-secure
