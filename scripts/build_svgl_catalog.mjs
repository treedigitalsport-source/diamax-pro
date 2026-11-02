import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseDir = path.resolve(__dirname, '..');
const assetsDir = path.join(baseDir, 'assets', 'icons', 'auth');

const iconData = [
  { id: 'clerk', name: 'Clerk', category: 'Authentication / Identity', desc: 'Gestión moderna de usuarios, Passkeys y sesiones seguras en Next.js/React.' },
  { id: 'auth0', name: 'Auth0 by Okta', category: 'Enterprise SSO', desc: 'Estándar mundial para autenticación corporativa, multi-tenant y RBAC.' },
  { id: 'supabase', name: 'Supabase Auth', category: 'Postgres Database / Auth', desc: 'Autenticación con Row-Level Security, Magic Links y OAuth integrado.' },
  { id: 'better-auth', name: 'Better Auth', category: 'TypeScript Auth', desc: 'Framework de autenticación ultraligero y modular de alto rendimiento.' },
  { id: 'workos', name: 'WorkOS', category: 'Enterprise SAML / SCIM', desc: 'Conexión SSO con proveedores empresariales corporativos y auditoría.' },
  { id: 'jwt', name: 'JWT (JSON Web Tokens)', category: 'Criptografía & Claims', desc: 'Tokens firmados criptográficamente para validación de sesiones seguras.' },
  { id: 'keycloak', name: 'Keycloak', category: 'IAM Open Source', desc: 'Servidor de identidades open-source con control de acceso por roles.' },
  { id: 'bitwarden', name: 'Bitwarden', category: 'Gestión de Credenciales', desc: 'Bóveda de alta seguridad para llaves maestras y contraseñas cifradas.' },
  { id: 'authy', name: 'Authy (Twilio)', category: '2FA / Doble Factor', desc: 'Verificación de dos factores por tokens TOTP y protección contra suplantación.' },
  { id: 'google', name: 'Google Workspace', category: 'OAuth 2.0 Federado', desc: 'Inicio de sesión con cuentas corporativas y personales de Google.' },
  { id: 'apple', name: 'Apple ID', category: 'Sign in with Apple', desc: 'Inicio de sesión nativo en ecosistemas Apple (iOS, iPadOS, macOS).' },
  { id: 'github', name: 'GitHub', category: 'Developer OAuth', desc: 'Acceso táctico para analistas, ingenieros de datos y desarrolladores.' },
  { id: 'firebase', name: 'Firebase Auth', category: 'Google Cloud Identity', desc: 'Gestor de identidades y despliegue distribuido en CDN global.' }
];

let cardsHtml = '';
iconData.forEach(item => {
  const filePath = path.join(assetsDir, `${item.id}.svg`);
  let svg = '';
  if (fs.existsSync(filePath)) {
    svg = fs.readFileSync(filePath, 'utf8')
      .replace(/width=["'][^"']+["']/i, 'width="32"')
      .replace(/height=["'][^"']+["']/i, 'height="32"');
    if (!svg.includes('width=')) {
      svg = svg.replace('<svg', '<svg width="32" height="32"');
    }
  }
  cardsHtml += `
    <div class="icon-card" id="card-${item.id}" onclick="toggleSelect('${item.id}')">
      <div class="icon-card-header">
        <div class="svg-wrapper">${svg}</div>
        <span class="badge-status">OFICIAL SVGL</span>
      </div>
      <div class="icon-info">
        <h4 class="icon-title">${item.name}</h4>
        <div class="icon-category">${item.category}</div>
        <p class="icon-desc">${item.desc}</p>
      </div>
      <div class="icon-action">
        <button class="btn-approve" id="btn-${item.id}">
          <span class="check-mark">✓</span> <span class="btn-text">Seleccionar</span>
        </button>
      </div>
    </div>
  `;
});

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DIAMAX PRO — Catálogo de Iconos Oficiales SVGL</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #0D0D11;
      --glass-bg: rgba(255, 255, 255, 0.04);
      --glass-border: rgba(255, 255, 255, 0.1);
      --ice-cyan: #00D2FF;
      --apple-blue: #007AFF;
      --gold-primary: #FFC72C;
      --text-muted: #8E8E93;
      --text-silver: #A1A1AA;
      --squircle: 14px;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg-dark);
      background-image: 
        radial-gradient(circle at 15% 20%, rgba(0, 122, 255, 0.08) 0%, transparent 45%),
        radial-gradient(circle at 85% 80%, rgba(0, 210, 255, 0.08) 0%, transparent 45%);
      color: #FFFFFF;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      padding: 32px 20px;
    }
    .header-bar {
      max-width: 1240px;
      margin: 0 auto 36px;
      background: var(--glass-bg);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--glass-border);
      border-radius: var(--squircle);
      padding: 24px 30px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.4);
    }
    .brand-title {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .brand-title h1 {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #FFF 40%, var(--ice-cyan) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .badge-source {
      background: rgba(0, 210, 255, 0.12);
      border: 1px solid rgba(0, 210, 255, 0.3);
      color: var(--ice-cyan);
      font-size: 11px;
      font-weight: 800;
      padding: 4px 12px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .container {
      max-width: 1240px;
      margin: 0 auto;
    }
    .section-title {
      font-size: 18px;
      font-weight: 800;
      color: #FFF;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .section-desc {
      font-size: 13px;
      color: var(--text-silver);
      margin-bottom: 24px;
    }
    .grid-icons {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 48px;
    }
    .icon-card {
      background: var(--glass-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--glass-border);
      border-radius: var(--squircle);
      padding: 22px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
      position: relative;
    }
    .icon-card:hover {
      transform: translateY(-4px);
      border-color: rgba(0, 210, 255, 0.4);
      box-shadow: 0 12px 30px rgba(0, 210, 255, 0.12);
    }
    .icon-card.selected {
      border-color: var(--ice-cyan);
      background: rgba(0, 210, 255, 0.06);
      box-shadow: 0 0 0 2px var(--ice-cyan), 0 12px 30px rgba(0, 210, 255, 0.18);
    }
    .icon-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .svg-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .badge-status {
      font-size: 10px;
      font-weight: 800;
      color: var(--text-muted);
      background: rgba(255, 255, 255, 0.05);
      padding: 3px 8px;
      border-radius: 6px;
      letter-spacing: 0.5px;
    }
    .icon-title {
      font-size: 16px;
      font-weight: 800;
      color: #FFF;
      margin-bottom: 4px;
    }
    .icon-category {
      font-size: 11px;
      font-weight: 700;
      color: var(--ice-cyan);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .icon-desc {
      font-size: 12px;
      color: var(--text-silver);
      line-height: 1.5;
      margin-bottom: 20px;
    }
    .btn-approve {
      width: 100%;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #FFF;
      padding: 10px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .icon-card.selected .btn-approve {
      background: var(--ice-cyan);
      border-color: var(--ice-cyan);
      color: #040914;
      font-weight: 900;
    }
    .preview-section {
      background: var(--glass-bg);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--glass-border);
      border-radius: var(--squircle);
      padding: 32px;
      margin-top: 36px;
    }
    .preview-modal-mock {
      max-width: 480px;
      margin: 24px auto 0;
      background: #090B10;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 18px;
      padding: 28px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.6);
    }
    .social-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      padding: 12px 16px;
      color: #FFF;
      font-size: 13.5px;
      font-weight: 700;
      margin-bottom: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .social-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.3);
    }
    .divider {
      display: flex;
      align-items: center;
      text-align: center;
      color: var(--text-muted);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 20px 0;
    }
    .divider::before, .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .divider::before { margin-right: 12px; }
    .divider::after { margin-left: 12px; }
  </style>
</head>
<body>

  <header class="header-bar">
    <div class="brand-title">
      <svg width="36" height="36" viewBox="0 0 100 100">
        <polygon points="50,5 95,35 78,92 22,92 5,35" fill="#00D2FF" opacity="0.2" stroke="#00D2FF" stroke-width="4"/>
        <polygon points="50,15 85,40 70,85 30,85 15,40" fill="#FFC72C" opacity="0.8"/>
      </svg>
      <div>
        <h1>DIAMAX PRO — Catálogo de Iconos Oficiales</h1>
        <p style="font-size:12px; color:var(--text-silver);">Directorio SVGL Oficial • Eliminación de Iconos Genéricos &amp; Emojis</p>
      </div>
    </div>
    <div style="display:flex; align-items:center; gap:12px;">
      <span class="badge-source">Fuente: svgl.app/directory/authentication</span>
      <button onclick="window.location.href='/'" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#FFF; padding:8px 16px; border-radius:10px; font-size:12px; font-weight:700; cursor:pointer;">Volver a DIAMAX PRO</button>
    </div>
  </header>

  <main class="container">
    <div class="section-title">
      <span>🛡️</span>
      <h2>1. Iconos Oficiales de Autenticación &amp; Proveedores de Identidad (SVGL)</h2>
    </div>
    <p class="section-desc">
      Todos los iconos vectoriales de grado empresarial obtenidos del catálogo oficial <strong>svgl.app</strong>. Cero emojis, cero artefactos genéricos, formato SVG nativo optimizado con paleta Apple HIG.
    </p>

    <div class="grid-icons">
      ${cardsHtml}
    </div>

    <!-- PREVIEW INTERACTIVO DEL MODAL DE ACCESO DIAMAX PRO CON LOS NUEVOS ICONOS -->
    <section class="preview-section">
      <div class="section-title">
        <span>✨</span>
        <h2>2. Demostración en Vivo: Portal de Acceso DIAMAX PRO con Iconos Oficiales</h2>
      </div>
      <p class="section-desc">
        Así se renderiza el modal de inicio de sesión eliminando cualquier texto o icono genérico y utilizando la simbología oficial de SVGL:
      </p>

      <div class="preview-modal-mock">
        <div style="text-align:center; margin-bottom:20px;">
          <div style="display:inline-flex; align-items:center; justify-content:center; width:48px; height:48px; border-radius:14px; background:rgba(0,210,255,0.1); border:1px solid rgba(0,210,255,0.3); margin-bottom:10px;">
            <img src="assets/icons/auth/clerk.svg" width="24" height="24" alt="Auth">
          </div>
          <h3 style="font-size:18px; font-weight:900; color:#FFF; margin-bottom:4px;">Portal de Acceso DIAMAX PRO</h3>
          <p style="font-size:12px; color:var(--text-silver);">Inicia sesión con tu proveedor oficial o credenciales tácticas</p>
        </div>

        <button class="social-btn" onclick="alert('Autenticación federada con Google Workspace')">
          <img src="assets/icons/auth/google.svg" width="18" height="18" alt="Google">
          <span>Continuar con Google Workspace</span>
        </button>

        <button class="social-btn" onclick="alert('Autenticación nativa con Apple ID')">
          <img src="assets/icons/auth/apple.svg" width="18" height="18" alt="Apple">
          <span>Continuar con Apple ID</span>
        </button>

        <button class="social-btn" onclick="alert('Autenticación con Supabase Auth')">
          <img src="assets/icons/auth/supabase.svg" width="18" height="18" alt="Supabase">
          <span>Conectar con Supabase Auth</span>
        </button>

        <div class="divider">o ingresa con tu correo táctico</div>

        <div style="margin-bottom:12px;">
          <label style="display:block; font-size:11px; font-weight:700; color:var(--text-silver); margin-bottom:6px; text-transform:uppercase;">Correo Táctico</label>
          <input type="email" placeholder="manager@diamax.pro" style="width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.15); border-radius:10px; padding:12px; color:#FFF; font-size:13px; outline:none;">
        </div>

        <div style="margin-bottom:18px;">
          <label style="display:block; font-size:11px; font-weight:700; color:var(--text-silver); margin-bottom:6px; text-transform:uppercase;">Clave de Acceso</label>
          <input type="password" placeholder="••••••••••••" style="width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.15); border-radius:10px; padding:12px; color:#FFF; font-size:13px; outline:none;">
        </div>

        <button style="width:100%; background:var(--ice-cyan); color:#040914; border:none; border-radius:10px; padding:13px; font-weight:900; font-size:13.5px; cursor:pointer; text-transform:uppercase; letter-spacing:0.8px; box-shadow:0 0 20px rgba(0,210,255,0.3); display:flex; align-items:center; justify-content:center; gap:8px;">
          <img src="assets/icons/auth/jwt.svg" width="18" height="18" alt="JWT">
          <span>Entrar al Sistema</span>
        </button>

        <div style="margin-top:16px; text-align:center;">
          <a href="#" style="color:var(--text-silver); font-size:11.5px; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
            <img src="assets/icons/auth/bitwarden.svg" width="14" height="14" alt="Bitwarden">
            <span>¿Olvidaste tu contraseña o usuario?</span>
          </a>
        </div>
      </div>
    </section>
  </main>

  <script>
    const selectedIcons = new Set(['clerk', 'google', 'apple', 'supabase', 'jwt', 'bitwarden', 'auth0']);

    function updateUi() {
      document.querySelectorAll('.icon-card').forEach(card => {
        const id = card.id.replace('card-', '');
        const btn = document.getElementById('btn-' + id);
        if (selectedIcons.has(id)) {
          card.classList.add('selected');
          btn.innerHTML = '<span class="check-mark">✓</span> <span>Aprobado</span>';
        } else {
          card.classList.remove('selected');
          btn.innerHTML = '<span>+</span> <span>Seleccionar</span>';
        }
      });
    }

    function toggleSelect(id) {
      if (selectedIcons.has(id)) {
        selectedIcons.delete(id);
      } else {
        selectedIcons.add(id);
      }
      updateUi();
    }

    updateUi();
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(baseDir, 'catalogo_iconos_svgl.html'), html, 'utf8');
console.log('✅ Catálogo interactivo generado exitosamente en catalogo_iconos_svgl.html');
