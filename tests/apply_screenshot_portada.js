const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replace diamax-page-1 with the pixel-perfect exact code matching the CEO screenshot
const page1Replacement = `<!-- ======================================================================== -->
<!-- 🎬 PÁGINA 1: PANTALLA INICIAL (DISEÑO OFICIAL APROBADO · SCREENSHOT CEO) -->
<!-- ======================================================================== -->
<div id="diamax-page-1" style="display:flex; position:fixed; top:0; left:0; width:100%; height:100%; z-index:99990; background:#020617; overflow:hidden; font-family:'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; flex-direction:column; justify-content:space-between; align-items:center; padding:20px 20px 24px 20px; box-sizing:border-box;">
  
  <!-- Video de Fondo Cinemático 1080p — MÁXIMA NITIDEZ SIN DISTORSIÓN -->
  <video autoplay muted loop playsinline preload="auto" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; filter:brightness(0.85) contrast(1.08); z-index:1;">
    <source src="./Baseball_bat_striking_ball_1080p_20260913144643.mp4" type="video/mp4">
  </video>

  <!-- Gradiente Cinemático Sutil (Protección de legibilidad en bordes sin tapar el centro) -->
  <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(2,6,23,0.65) 0%, rgba(2,6,23,0) 30%, rgba(2,6,23,0) 55%, rgba(2,6,23,0.85) 100%); z-index:2; pointer-events:none;"></div>

  <!-- 1. Header Superior Apple Sports Minimalista -->
  <div style="position:relative; z-index:10; width:100%; max-width:1100px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
    
    <!-- Logo DIAMAX PRO (Home Plate Diamond + Tipografía Metálica Unificada - ALTA DEFINICIÓN) -->
    <div onclick="irAPagina(1)" style="display:inline-flex; align-items:center; gap:14px; cursor:pointer; text-decoration:none; transition:transform 0.25s cubic-bezier(0.16,1,0.3,1);" onmouseover="this.style.transform='scale(1.04)';" onmouseout="this.style.transform='scale(1)';" title="DIAMAX PRO — Sports Operating System">
      <div style="position:relative; width:54px; height:54px; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0;">
        <svg viewBox="0 0 100 100" width="52" height="52" style="overflow:visible; filter:drop-shadow(0 0 18px rgba(255,199,44,0.65)) drop-shadow(0 4px 14px rgba(0,0,0,0.9));">
          <use href="#diamax-home-plate-symbol"/>
        </svg>
      </div>
      <div style="display:inline-flex; align-items:baseline; gap:6px; font-family:'Montserrat', sans-serif; font-weight:900; font-size:28px; letter-spacing:1.2px; line-height:1; text-transform:uppercase;">
        <span style="color:#FFFFFF; background:linear-gradient(180deg, #FFFFFF 0%, #B8C2CC 35%, #FFFFFF 55%, #737F8C 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; -webkit-text-stroke:0.5px rgba(216,226,234,0.8); filter:drop-shadow(0 2px 0 #475569) drop-shadow(0 4px 10px rgba(0,0,0,0.8));">DIAMAX</span>
        <span style="color:#FFB300; background:linear-gradient(180deg, #FFF2A6 0%, #FFB300 40%, #F57C00 70%, #FFD75A 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; -webkit-text-stroke:0.5px #FFCC55; filter:drop-shadow(0 2px 0 #92400E) drop-shadow(0 4px 10px rgba(255,179,0,0.5)); font-size:23px;">PRO</span>
      </div>
    </div>
    
    <!-- Badges y Selector de Idioma -->
    <div style="display:flex; align-items:center; gap:10px;">
      <span style="background:rgba(24,201,149,0.15); border:1px solid rgba(24,201,149,0.4); color:#A7F3D0; font-family:'Rajdhani', sans-serif; font-size:12px; font-weight:700; letter-spacing:0.8px; padding:6px 14px; border-radius:20px; backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); display:inline-flex; align-items:center; gap:6px;">
        <span style="width:7px; height:7px; border-radius:50%; background:#18C995; box-shadow:0 0 8px #18C995;"></span> Zero Trust v3.5
      </span>
      <span id="p1-badge-month-free" style="background:linear-gradient(135deg, rgba(255,184,46,0.25), rgba(242,101,34,0.25)); border:1px solid #FFB82E; color:#FFF; font-family:'Rajdhani', sans-serif; font-size:12px; font-weight:700; letter-spacing:0.8px; padding:6px 14px; border-radius:20px; backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); box-shadow:0 0 15px rgba(255,184,46,0.3); display:inline-flex; align-items:center; gap:6px;">
        🎁 <span id="p1-badge-month-free-text">1 Month Free</span>
      </span>
      <div style="position:relative; display:inline-block;">
        <button id="p1-lang-btn" onclick="toggleIdiomaDiamax()" style="background:rgba(15,23,42,0.75); border:1px solid rgba(255,255,255,0.2); color:#FFF; font-family:'Montserrat', sans-serif; font-size:12px; font-weight:800; padding:6px 12px; border-radius:20px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; backdrop-filter:blur(12px); transition:all 0.2s ease;">
          <span id="p1-lang-flag">🇺🇸</span> <span id="p1-lang-code">EN</span> <span style="font-size:9px; opacity:0.7;">▼</span>
        </button>
      </div>
    </div>

  </div>

  <!-- 2. Hero Center - Títulos Cinemáticos con Tipografía Metálica (EXACTO SCREENSHOT CEO) -->
  <div style="position:relative; z-index:10; text-align:center; max-width:850px; width:100%; margin:auto 0;">
    
    <!-- Tagline Deportes con Píldora de Cristal -->
    <div style="display:inline-flex; align-items:center; justify-content:center; margin-bottom:12px;">
      <span style="background:rgba(2,132,199,0.18); border:1px solid rgba(24,216,255,0.45); color:#7DD3FC; font-family:'Rajdhani', sans-serif; font-size:13px; font-weight:800; letter-spacing:2px; text-transform:uppercase; padding:6px 18px; border-radius:30px; box-shadow:0 0 20px rgba(24,216,255,0.25); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); display:inline-flex; align-items:center; gap:8px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="filter:drop-shadow(0 0 6px #18D8FF);"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-10z" fill="url(#p1-bolt-grad)"/><defs><linearGradient id="p1-bolt-grad" x1="3" y1="2" x2="21" y2="22"><stop stop-color="#18D8FF"/><stop offset="1" stop-color="#0284C7"/></linearGradient></defs></svg> <span id="p1-sub-pill-text">SPORTS OPERATING SYSTEM · BASEBALL &amp; SOFTBALL</span>
      </span>
    </div>

    <!-- Título Principal de Alto Impacto Cinemático (EXACTO SCREENSHOT: WELCOME TO / DIAMAX PRO) -->
    <div id="p1-title-welcome-block" style="margin:0 0 16px 0;">
      
      <!-- 1. TEXTO SUPERIOR: «WELCOME TO» / «BIENVENIDO A» -->
      <div class="diamax-cinema-welcome" id="p1-title-welcome" style="font-family:'Montserrat', sans-serif; font-weight:800; font-size:clamp(28px, 4.2vw, 48px); text-transform:uppercase; letter-spacing:2px; line-height:1.15; margin:0 0 6px 0; color:#FFFFFF; text-shadow:0 4px 20px rgba(0,0,0,0.95), 0 0 25px rgba(24,216,255,0.45);">
        WELCOME TO
      </div>

      <!-- 2. MARCA CINEMÁTICA: DIAMAX PRO (CROMO Y ORO - SIN ICONO EN EL MEDIO) -->
      <div class="diamax-cinema-brand-title" style="display:inline-flex; align-items:center; justify-content:center; flex-wrap:nowrap; gap:10px; margin:0 auto; line-height:1;">
        <span class="diamax-cinema-word-diamax" style="display:inline-block; font-family:'Montserrat', sans-serif; font-weight:900; font-size:clamp(46px, 7vw, 84px); letter-spacing:3px; line-height:1; text-transform:uppercase; color:#FFFFFF; background:linear-gradient(180deg, #FFFFFF 0%, #B8C2CC 35%, #FFFFFF 55%, #737F8C 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; -webkit-text-stroke:1px rgba(216,226,234,0.85); filter:drop-shadow(0 4px 0 #475569) drop-shadow(0 12px 28px rgba(0,0,0,0.9)) drop-shadow(0 0 25px rgba(0,175,255,0.28));">DIAMAX</span>
        <span class="diamax-cinema-word-pro" style="display:inline-block; font-family:'Montserrat', sans-serif; font-weight:900; font-size:clamp(46px, 7vw, 84px); letter-spacing:2px; line-height:1; text-transform:uppercase; color:#FFB300; background:linear-gradient(180deg, #FFF2A6 0%, #FFB300 40%, #F57C00 70%, #FFD75A 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; -webkit-text-stroke:1px #FFCC55; filter:drop-shadow(0 4px 0 #92400E) drop-shadow(0 10px 22px rgba(0,0,0,0.8)) drop-shadow(0 0 35px rgba(255,179,0,0.55)); margin-left:8px;">PRO</span>
      </div>

    </div>

    <!-- Descripción Sabermétrica con Sombra Nítida -->
    <p id="p1-desc-text" style="margin:0 auto 24px auto; max-width:640px; font-family:'Plus Jakarta Sans', sans-serif; font-size:14.5px; font-weight:500; color:#F1F5F9; line-height:1.6; text-shadow:0 2px 12px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.9);">
      Franchise management, official rosters, pitch-by-pitch dugout scorer &amp; advanced sabermetrics.
    </p>

    <!-- 3. Botones de Acción Cinemáticos Flotantes (4 BOTONES EXACTOS DEL SCREENSHOT) -->
    <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:14px; margin-bottom:20px;">
      
      <!-- Botón 1: 6 OFFICIAL PLANS / 6 PLANES OFICIALES -->
      <button type="button" id="p1-btn-plans" onclick="showAuthModal('pricing')" style="padding:16px 26px; background:linear-gradient(135deg, #00D2FF 0%, #0072FF 100%); color:#FFFFFF; border:1px solid rgba(255,255,255,0.4); border-radius:14px; font-family:'Montserrat', sans-serif; font-weight:900; font-size:13px; cursor:pointer; text-transform:uppercase; letter-spacing:0.8px; box-shadow:0 8px 30px rgba(0,210,255,0.45), 0 0 25px rgba(0,114,255,0.35); display:inline-flex; align-items:center; gap:10px; transition:all 0.25s ease;" onmouseover="this.style.transform='translateY(-3px) scale(1.02)'; this.style.boxShadow='0 12px 40px rgba(0,210,255,0.75)';" onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 8px 30px rgba(0,210,255,0.45), 0 0 25px rgba(0,114,255,0.35)';">
        <span style="font-size:18px; filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6));">💎</span>
        <span id="p1-btn-plans-text">6 OFFICIAL PLANS</span>
      </button>

      <!-- Botón 2: FREE SIGN UP / REGISTRO GRATUITO -->
      <button type="button" id="p1-btn-register" onclick="showAuthModal('register')" style="padding:16px 26px; background:linear-gradient(135deg, #FFB82E 0%, #EA580C 100%); color:#040814; border:none; border-radius:14px; font-family:'Montserrat', sans-serif; font-weight:900; font-size:13px; cursor:pointer; text-transform:uppercase; letter-spacing:0.8px; box-shadow:0 8px 30px rgba(255,184,46,0.45), 0 0 20px rgba(234,88,12,0.4); display:inline-flex; align-items:center; gap:10px; transition:all 0.25s ease;" onmouseover="this.style.transform='translateY(-3px) scale(1.02)'; this.style.boxShadow='0 12px 40px rgba(255,184,46,0.65)';" onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 8px 30px rgba(255,184,46,0.45), 0 0 20px rgba(234,88,12,0.4)';">
        <span style="font-size:18px; filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6));">📝</span>
        <span id="p1-btn-register-text">FREE SIGN UP</span>
      </button>

      <!-- Botón 3: SIGN IN / INICIAR SESIÓN -->
      <button type="button" id="p1-btn-login" onclick="showAuthModal('login')" style="padding:16px 24px; background:rgba(4,8,20,0.75); color:#18D8FF; border:1.8px solid #18D8FF; border-radius:14px; font-family:'Montserrat', sans-serif; font-weight:900; font-size:13px; cursor:pointer; text-transform:uppercase; letter-spacing:0.8px; box-shadow:0 8px 30px rgba(24,216,255,0.25), inset 0 0 15px rgba(24,216,255,0.1); display:inline-flex; align-items:center; gap:10px; transition:all 0.25s ease;" onmouseover="this.style.background='rgba(24,216,255,0.18)'; this.style.transform='translateY(-3px) scale(1.02)'; this.style.boxShadow='0 12px 40px rgba(24,216,255,0.45)';" onmouseout="this.style.background='rgba(4,8,20,0.75)'; this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 8px 30px rgba(24,216,255,0.25), inset 0 0 15px rgba(24,216,255,0.1)';">
        <span style="font-size:18px; filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6));">🔑</span>
        <span id="p1-btn-login-text">SIGN IN</span>
      </button>

      <!-- Botón 4: 3TREE MASTER ACCESS (Acceso CEO Alí Zapata / Clave 113714) -->
      <button type="button" id="p1-btn-master" onclick="abrirAccesoClaveCEO()" style="padding:16px 24px; background:rgba(255,199,44,0.12); color:#FFC72C; border:1.8px solid #FFC72C; border-radius:14px; font-family:'Montserrat', sans-serif; font-weight:900; font-size:13px; cursor:pointer; text-transform:uppercase; letter-spacing:0.8px; box-shadow:0 8px 30px rgba(255,199,44,0.25); display:inline-flex; align-items:center; gap:10px; transition:all 0.25s ease;" onmouseover="this.style.background='rgba(255,199,44,0.25)'; this.style.transform='translateY(-3px) scale(1.02)'; this.style.boxShadow='0 12px 40px rgba(255,199,44,0.5)';" onmouseout="this.style.background='rgba(255,199,44,0.12)'; this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 8px 30px rgba(255,199,44,0.25)';">
        <span style="font-size:18px; filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6));">👑</span>
        <span id="p1-btn-master-text">3TREE MASTER ACCESS</span>
      </button>

    </div>

    <!-- Micro Footer de Certificación y Seguridad Flotante -->
    <div style="display:flex; justify-content:center; align-items:center; gap:20px; font-family:'Rajdhani', sans-serif; font-size:13px; font-weight:700; letter-spacing:1px; color:#E2E8F0; text-shadow:0 2px 10px rgba(0,0,0,0.95); flex-wrap:wrap;">
      <span style="display:inline-flex; align-items:center;"><svg style="display:inline-block;vertical-align:-2px;margin-right:5px;filter:drop-shadow(0 0 6px rgba(24,201,149,0.7))" width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="4" y="10" width="16" height="11" rx="3" fill="rgba(24,201,149,0.2)" stroke="#18C995" stroke-width="1.8"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="#18C995" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="15.5" r="1.5" fill="#18C995"/></svg> <span id="p1-footer-sec">SHA-256</span></span>
      <span style="color:#18D8FF; opacity:0.6;">·</span>
      <span style="display:inline-flex; align-items:center;"><svg style="display:inline-block;vertical-align:-2px;margin-right:5px;filter:drop-shadow(0 0 6px rgba(24,216,255,0.6))" width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="16" width="3.5" height="5" rx="1" fill="#18D8FF" opacity="0.4"/><rect x="8" y="11" width="3.5" height="10" rx="1" fill="#18D8FF" opacity="0.7"/><rect x="14" y="6" width="3.5" height="15" rx="1" fill="#18D8FF" opacity="0.9"/><rect x="20" y="2" width="3.5" height="19" rx="1" fill="#18D8FF"/></svg> <span id="p1-footer-pwa">PWA Offline</span></span>
      <span style="color:#18D8FF; opacity:0.6;">·</span>
      <span style="display:inline-flex; align-items:center;"><svg style="display:inline-block;vertical-align:-2px;margin-right:5px;filter:drop-shadow(0 0 6px rgba(255,255,255,0.6))" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9.5" fill="rgba(255,255,255,0.15)" stroke="#FFFFFF" stroke-width="1.8"/><path d="M7 4.5c2 2.8 2 12.2 0 15" stroke="#EA580C" stroke-width="1.4" stroke-linecap="round"/><path d="M17 4.5c-2 2.8-2 12.2 0 15" stroke="#EA580C" stroke-width="1.4" stroke-linecap="round"/><path d="M5.5 8.5l2.2.8m-2.2 6.2l2.2-.8m8.6-6.2l2.2-.8m-2.2 6.2l2.2.8" stroke="#EA580C" stroke-width="1.1" stroke-linecap="round"/></svg> <span id="p1-sports-text">Baseball &amp; Softball</span></span>
    </div>

  </div>

  <!-- 4. Copyright Footer Fijo y Discreto -->
  <div style="position:relative; z-index:10; font-family:'Plus Jakarta Sans', sans-serif; font-size:11px; color:#94A3B8; text-align:center; text-shadow:0 2px 8px rgba(0,0,0,0.9); margin-top:8px;">
    DIAMAX PRO © 2026 · Diseñado &amp; Desarrollado por <strong style="color:#FFF;">3Tree Digital Sport IA</strong> · CEO Alí Zapata
  </div>

</div>
`;

const p1Start = html.indexOf('id="diamax-page-1"');
const p2Start = html.indexOf('id="diamax-page-2"');

// find the start of the whole comment or div before diamax-page-1
const commentBeforeP1 = html.lastIndexOf('<!-- ===', p1Start);
const actualStart = commentBeforeP1 !== -1 ? commentBeforeP1 : p1Start;

// find the comment before diamax-page-2
const commentBeforeP2 = html.lastIndexOf('<!-- ===', p2Start);
const actualEnd = commentBeforeP2 !== -1 ? commentBeforeP2 : p2Start;

html = html.substring(0, actualStart) + page1Replacement + '\n\n' + html.substring(actualEnd);

fs.writeFileSync('index.html', html, 'utf8');
fs.writeFileSync('v_original_aprobada.html', html, 'utf8');
console.log('Successfully updated index.html and created v_original_aprobada.html matching CEO screenshot 100%!');
