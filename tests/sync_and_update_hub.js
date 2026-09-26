const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
fs.writeFileSync('v6_hace_1_hora_49505bc.html', content, 'utf8');
fs.writeFileSync('v1_actual_logo_photoroom_y_planes.html', content, 'utf8');

// Update hub_comparativo.html to highlight the official approved screenshot design
const hubHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DIAMAX PRO — Hub Oficial de Aprobación de Diseño (CEO Alí Zapata)</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;600;700&family=Rajdhani:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #020617; color: #F8FAFC; font-family: 'Plus Jakarta Sans', sans-serif; padding: 24px; }
    .container { max-width: 1200px; margin: 0 auto; }
    header { text-align: center; margin-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; }
    h1 { font-family: 'Montserrat', sans-serif; font-size: 28px; font-weight: 900; color: #18D8FF; letter-spacing: 1px; margin-bottom: 8px; }
    .subtitle { color: #94A3B8; font-size: 14px; }
    .card-approved {
      background: linear-gradient(135deg, rgba(24,216,255,0.15), rgba(255,199,44,0.1));
      border: 2px solid #18D8FF;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 30px;
      box-shadow: 0 0 30px rgba(24,216,255,0.25);
    }
    .badge { background: #18D8FF; color: #020617; font-weight: 800; font-size: 12px; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; }
    .card { background: #0B132B; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 18px; transition: all 0.2s ease; }
    .card:hover { transform: translateY(-3px); border-color: #18D8FF; box-shadow: 0 8px 24px rgba(0,0,0,0.5); }
    .card h3 { font-family: 'Montserrat', sans-serif; font-size: 16px; margin-bottom: 8px; color: #FFF; }
    .card p { font-size: 13px; color: #94A3B8; line-height: 1.4; margin-bottom: 14px; }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 18px; border-radius: 8px; font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 12px; text-decoration: none; cursor: pointer; text-transform: uppercase; width: 100%; }
    .btn-cyan { background: linear-gradient(135deg, #00D2FF 0%, #0072FF 100%); color: #FFF; box-shadow: 0 4px 15px rgba(0,210,255,0.4); }
    .btn-gold { background: linear-gradient(135deg, #FFC72C 0%, #EA580C 100%); color: #040814; box-shadow: 0 4px 15px rgba(255,199,44,0.4); }
    .btn-dark { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.2); color: #FFF; }
    .btn-dark:hover { background: rgba(24,216,255,0.15); border-color: #18D8FF; color: #18D8FF; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>DIAMAX PRO — 3Tree Digital Sport IA Corp.</h1>
      <p class="subtitle">Portal Oficial de Selección y Auditoría de Diseño · CEO Lic. Alí Zapata</p>
    </header>

    <div class="card-approved">
      <span class="badge">DISEÑO OFICIAL APROBADO (SCREENSHOT AUDITADO)</span>
      <h2 style="font-family:'Montserrat',sans-serif; margin:12px 0 8px 0; font-size:22px; color:#FFFFFF;">Versión Original Aprobada (Pixel-Perfect con su Captura)</h2>
      <p style="color:#CBD5E1; font-size:14px; margin-bottom:18px;">
        Contiene la jerarquía exacta de su captura: Logo Superior Home Plate + DIAMAX PRO, Badges Zero Trust v3.5, 1 Month Free y Selector de Idioma. Titular central: <strong>WELCOME TO / DIAMAX PRO</strong> (Cromo &amp; Oro sin icono en el medio), los 4 botones oficiales y acceso con su Clave CEO <code>113714</code>.
      </p>
      <div style="display:flex; gap:12px; flex-wrap:wrap;">
        <a href="./v_original_aprobada.html" class="btn btn-gold" style="width:auto; padding:12px 24px; font-size:14px;">🚀 ABRIR DISEÑO OFICIAL APROBADO (v_original_aprobada.html)</a>
        <a href="./index.html" class="btn btn-cyan" style="width:auto; padding:12px 24px; font-size:14px;">🌐 ABRIR APLICACIÓN PRINCIPAL (index.html)</a>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>Versión Original Aprobada</h3>
        <p>100% idéntica a su captura de pantalla auditada.</p>
        <a href="./v_original_aprobada.html" class="btn btn-gold">Abrir Versión Oficial</a>
      </div>
      <div class="card">
        <h3>Versión 6 (49505bc)</h3>
        <p>Actualizada con el diseño aprobado sin icono intermedio.</p>
        <a href="./v6_hace_1_hora_49505bc.html" class="btn btn-dark">Abrir V6</a>
      </div>
      <div class="card">
        <h3>Versión 1 (Actualizada)</h3>
        <p>Porta de entrada con 6 planes comerciales y clave CEO.</p>
        <a href="./v1_actual_logo_photoroom_y_planes.html" class="btn btn-dark">Abrir V1</a>
      </div>
      <div class="card">
        <h3>Versión 4 (3 Botones Clásicos)</h3>
        <p>Histórico con los 3 botones estándar originales.</p>
        <a href="./v4_portada_3_botones_clasicos.html" class="btn btn-dark">Abrir V4</a>
      </div>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync('hub_comparativo.html', hubHtml, 'utf8');
console.log('Successfully updated hub_comparativo.html!');
