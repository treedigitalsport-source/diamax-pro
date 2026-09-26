const { execSync } = require('child_process');
const fs = require('fs');

const keyCommits = [
  {
    filename: 'v1_actual_logo_photoroom_y_planes.html',
    hash: '478a5dc',
    title: 'Versión 1: Actual (Logo Oficial Photoroom + 6 Planes + Acceso Clave CEO)',
    time: 'Hace unos minutos',
    desc: 'Portada con tipografía 3D Cromo/Oro, botón 6 Planes, Registro, Login y Acceso con Clave 113714. Dugout limpio con logo oficial PNG transparente.'
  },
  {
    filename: 'v2_planes_y_acceso_clave_ceo.html',
    hash: '516eac0',
    title: 'Versión 2: Portada 4 Botones con Acceso Maestro Dorado',
    time: 'Hace 20 minutos',
    desc: 'Portada con 6 Planes Oficiales, Registro, Login y botón dorado "Acceso con Clave". Isotipo Home Plate en cabecera Dugout.'
  },
  {
    filename: 'v3_vercel_original_con_fix_manual.html',
    hash: '2d83643',
    title: 'Versión 3: Vercel Original con Manual Oculto por Defecto',
    time: 'Hace 22 minutos',
    desc: 'Diseño idéntico a Vercel con los 3 botones clásicos (Entrar al Anotador, Registro & Planes, Iniciar Sesión) y manual de operaciones aislado.'
  },
  {
    filename: 'v4_portada_3_botones_clasicos.html',
    hash: 'b1e3a3a',
    title: 'Versión 4: Portada con "Entrar al Anotador" (3 Botones Clásicos)',
    time: 'Hace 30 minutos',
    desc: 'Botones: Entrar al Anotador (azul neón), Registro & Planes (naranja), Iniciar Sesión (cian).'
  },
  {
    filename: 'v5_dugout_emergente_ph_blindado.html',
    hash: 'ade81d1',
    title: 'Versión 5: Dugout con Ficha Bateador y Botón PH Encuadrado',
    time: 'Hace 40 minutos',
    desc: 'Ajuste de flex-wrap en la ficha del bateador activo y botón Emergente (PH) protegido sin desbordamiento.'
  },
  {
    filename: 'v6_hace_1_hora_49505bc.html',
    hash: '49505bc',
    title: 'Versión 6: Hace 1 Hora (Commit 49505bc)',
    time: 'Hace 70 minutos (1 hora)',
    desc: 'Diseño original aprobado con tipografía BIENVENIDO A DIAMAX PRO en cromo multi-stop y 4 botones.'
  },
  {
    filename: 'v7_vercel_origin_main_puro.html',
    hash: '7c4c1b3',
    title: 'Versión 7: Producción Vercel Exacta (origin/main)',
    time: 'Producción Vercel',
    desc: 'Archivo index.html original de producción desplegado en Vercel con emblema central Home Plate 114px.'
  },
  {
    filename: 'v8_hace_5_dias_b11a759.html',
    hash: 'b11a759',
    title: 'Versión 8: Hace 5 Días (Commit b11a759 - Cache Buster 6.4)',
    time: 'Hace 5 días',
    desc: 'Versión estable con isotipo The Diamond Vault y 3 botones clásicos.'
  },
  {
    filename: 'v9_clasica_logo_photoroom_ec497e5.html',
    hash: 'ec497e5',
    title: 'Versión 9: Clásica con Logo Photoroom Transparente (Commit ec497e5)',
    time: 'Hace 8 días',
    desc: 'Versión con logo oficial PNG transparente logo-Photoroom.png en portada y cabecera de Dugout.'
  },
  {
    filename: 'v10_iconos_vectoriales_4b5addd.html',
    hash: '4b5addd',
    title: 'Versión 10: Suite de 15 Iconos Vectoriales SVG (Commit 4b5addd)',
    time: 'Hace 8 días',
    desc: 'Versión con la suite completa de 15 iconos SVG personalizados en cabecera y ribbon.'
  }
];

// Extract files from git
keyCommits.forEach(v => {
  try {
    const html = execSync(`git show ${v.hash}:index.html`, { maxBuffer: 50 * 1024 * 1024 }).toString('utf8');
    fs.writeFileSync(v.filename, html, 'utf8');
    console.log(`Extracted: ${v.filename} (${html.length} bytes)`);
  } catch (err) {
    console.error(`Error extracting ${v.hash}:`, err.message);
  }
});

// Generate Visual Comparison Hub
const hubHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DIAMAX PRO — Centro de Comparación y Aprobación de Diseños (CEO Alí Zapata)</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #020617;
      color: #F8FAFC;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      padding: 24px 16px;
      line-height: 1.5;
    }
    .header {
      text-align: center;
      max-width: 960px;
      margin: 0 auto 30px auto;
      padding: 24px;
      background: linear-gradient(145deg, #091329, #050b18);
      border: 2px solid #FFC72C;
      border-radius: 20px;
      box-shadow: 0 0 40px rgba(255, 199, 44, 0.25);
    }
    .badge-ceo {
      background: rgba(255, 199, 44, 0.15);
      border: 1px solid #FFC72C;
      color: #FFC72C;
      font-size: 12px;
      font-weight: 900;
      padding: 4px 14px;
      border-radius: 20px;
      display: inline-block;
      margin-bottom: 10px;
      letter-spacing: 1px;
    }
    h1 { font-size: 26px; font-weight: 900; margin-bottom: 6px; color: #FFF; }
    p.sub { font-size: 14px; color: #94A3B8; max-width: 760px; margin: 0 auto; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 18px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .card {
      background: #070e1c;
      border: 1.5px solid rgba(255,255,255,0.12);
      border-radius: 16px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.25s ease;
    }
    .card:hover {
      border-color: #00D2FF;
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(0, 210, 255, 0.2);
    }
    .card.highlight {
      border-color: #FFC72C;
      background: linear-gradient(145deg, #121829, #070e1c);
      box-shadow: 0 0 25px rgba(255, 199, 44, 0.2);
    }
    .card-top { margin-bottom: 14px; }
    .card-title {
      font-size: 16px;
      font-weight: 900;
      color: #00D2FF;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .card.highlight .card-title { color: #FFC72C; }
    .time-badge {
      font-size: 11px;
      background: rgba(255,255,255,0.08);
      color: #94A3B8;
      padding: 2px 8px;
      border-radius: 6px;
      font-weight: 700;
    }
    .card-desc { font-size: 13px; color: #CBD5E1; margin-bottom: 16px; line-height: 1.5; }
    .btn-open {
      display: block;
      width: 100%;
      text-align: center;
      padding: 13px;
      background: linear-gradient(135deg, #00D2FF, #0072FF);
      color: #FFF;
      text-decoration: none;
      font-weight: 900;
      font-size: 13px;
      border-radius: 10px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      transition: all 0.2s;
      box-shadow: 0 4px 15px rgba(0,210,255,0.3);
    }
    .btn-open:hover {
      filter: brightness(1.15);
      box-shadow: 0 6px 22px rgba(0,210,255,0.5);
    }
    .btn-open.gold {
      background: linear-gradient(135deg, #FFC72C, #F59E0B);
      color: #040814;
      box-shadow: 0 4px 15px rgba(255,199,44,0.4);
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      font-size: 12px;
      color: #64748B;
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="badge-ceo">👑 3Tree Digital Sport IA Corp. · Panel de Revisión del CEO</div>
    <h1>Centro de Verificación y Selección de Diseños Históricos</h1>
    <p class="sub">
      Estimado <strong>Lic. Alí Zapata</strong>: Aquí tiene cada versión exacta generada desde hace más de 2 horas y de los últimos días.
      Haga clic en cualquiera de los botones para abrir esa versión exacta en una pestaña nueva y elegir cuál es la que queda aprobada definitivamente.
    </p>
  </div>

  <div class="grid">
` + keyCommits.map((v, i) => `
    <div class="card ${i === 0 || i === 5 || i === 6 ? 'highlight' : ''}">
      <div class="card-top">
        <div class="card-title">
          <span>${v.title}</span>
          <span class="time-badge">${v.time}</span>
        </div>
        <p class="card-desc">${v.desc}</p>
      </div>
      <a href="./${v.filename}" target="_blank" class="btn-open ${i === 0 ? 'gold' : ''}">
        Abrir y Ver Esta Versión →
      </a>
    </div>
`).join('') + `
  </div>

  <div class="footer">
    DIAMAX PRO © 2026 · Diseñado &amp; Desarrollado por <strong>3Tree Digital Sport IA Corp.</strong> · Florida, USA · Fundador y CEO: Lic. Alí Zapata
  </div>

</body>
</html>`;

fs.writeFileSync('hub_comparativo.html', hubHtml, 'utf8');
console.log('Successfully generated hub_comparativo.html!');
