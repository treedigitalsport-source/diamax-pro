const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Function to generate the exact self-contained logo HTML with custom prefix for unique IDs
function getSelfContainedLogo(prefix, boxSize = 44, svgSize = 28, fontMain = 24, fontSub = 19) {
  return `<div onclick="irAPagina(1)" style="display:inline-flex; align-items:center; gap:10px; cursor:pointer; text-decoration:none;" title="DIAMAX PRO — Sports Operating System">
  <div style="display:inline-flex; align-items:center; justify-content:center; width:${boxSize}px; height:${boxSize}px; border-radius:12px; background:linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%); border:1px solid rgba(255,255,255,0.18); box-shadow:0 4px 14px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.35); backdrop-filter:blur(10px); flex-shrink:0;">
    <svg width="${svgSize}" height="${svgSize}" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 2px 10px rgba(24,216,255,0.7));">
      <defs>
        <linearGradient id="${prefix}-base" x1="18" y1="4" x2="18" y2="33" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="35%" stop-color="#E2E8F0"/>
          <stop offset="70%" stop-color="#64748B"/>
          <stop offset="100%" stop-color="#0F172A"/>
        </linearGradient>
        <linearGradient id="${prefix}-rim" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#18D8FF"/>
          <stop offset="45%" stop-color="#FFFFFF"/>
          <stop offset="100%" stop-color="#0284C7"/>
        </linearGradient>
        <linearGradient id="${prefix}-inner" x1="18" y1="8" x2="18" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#0F243E"/>
          <stop offset="50%" stop-color="#081426"/>
          <stop offset="100%" stop-color="#020814"/>
        </linearGradient>
      </defs>
      <polygon points="18,33 5,20 5,5 31,5 31,20" fill="url(#${prefix}-base)" stroke="url(#${prefix}-rim)" stroke-width="1.8" stroke-linejoin="round"/>
      <polygon points="18,28 8,18 8,8 28,8 28,18" fill="url(#${prefix}-inner)" stroke="rgba(255,255,255,0.35)" stroke-width="1" stroke-linejoin="round"/>
      <polygon points="18,23 11,16 11,11 25,11 25,16" fill="url(#${prefix}-base)" opacity="0.95"/>
      <polygon points="18,19 13,14 13,12 23,12 23,14" fill="url(#${prefix}-rim)"/>
      <line x1="5" y1="5" x2="18" y2="18" stroke="rgba(255,255,255,0.8)" stroke-width="0.8"/>
      <line x1="31" y1="5" x2="18" y2="18" stroke="rgba(255,255,255,0.8)" stroke-width="0.8"/>
      <line x1="18" y1="18" x2="18" y2="33" stroke="rgba(255,255,255,0.9)" stroke-width="1"/>
    </svg>
  </div>
  <div style="display:inline-flex; align-items:baseline; gap:5px; font-family:'Montserrat', sans-serif; font-weight:900; font-size:${fontMain}px; letter-spacing:1px; line-height:1; text-transform:uppercase;">
    <span style="color:#FFFFFF; background:linear-gradient(180deg, #FFFFFF 0%, #B8C2CC 35%, #FFFFFF 55%, #737F8C 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; -webkit-text-stroke:0.5px rgba(216,226,234,0.8); filter:drop-shadow(0 2px 0 #475569) drop-shadow(0 4px 10px rgba(0,0,0,0.8));">DIAMAX</span>
    <span style="color:#FFB300; background:linear-gradient(180deg, #FFF2A6 0%, #FFB300 40%, #F57C00 70%, #FFD75A 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; -webkit-text-stroke:0.5px #FFCC55; filter:drop-shadow(0 2px 0 #92400E) drop-shadow(0 4px 10px rgba(255,179,0,0.5)); font-size:${fontSub}px;">PRO</span>
  </div>
</div>`;
}

// 1. Page 1
const p1Logo = getSelfContainedLogo('hp3d-p1-hdr', 48, 30, 26, 21);
html = html.replace(/<!-- Logo DIAMAX PRO[\s\S]*?<!-- Badges/i, `<!-- Logo DIAMAX PRO (Home Plate Diamond 3D) -->\n    ${p1Logo}\n    \n    <!-- Badges`);

// 2. Page 2
const p2Logo = getSelfContainedLogo('hp3d-p2-hdr', 40, 26, 20, 16);
html = html.replace(/<!-- Logo Oficial DIAMAX PRO[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<div style="display:flex; align-items:center; gap:10px;">/i, `<!-- Logo Oficial DIAMAX PRO (Pág 2) -->\n        ${p2Logo}\n        </div>\n      </div>\n      <div style="display:flex; align-items:center; gap:10px;">`);

// 3. Page 3 (Dugout)
const p3Logo = getSelfContainedLogo('hp3d-p3-hdr', 44, 28, 22, 18);
html = html.replace(/<!-- 💎 LOGO OFICIAL DIAMAX PRO[\s\S]*?<\/div>\s*<\/div>\s*<!-- 🏟️ INFORMACIÓN DEL EQUIPO ACTIVO -->/i, `<!-- 💎 LOGO OFICIAL DIAMAX PRO (100% IDÉNTICO Y AUTÓNOMO) -->\n        <div style="padding-right:14px; border-right:1px solid rgba(255,255,255,0.12); display:inline-flex; align-items:center;">\n          ${p3Logo}\n        </div>\n\n        <!-- 🏟️ INFORMACIÓN DEL EQUIPO ACTIVO -->`);

fs.writeFileSync('index.html', html, 'utf8');
fs.writeFileSync('v_original_aprobada.html', html, 'utf8');
fs.writeFileSync('v6_hace_1_hora_49505bc.html', html, 'utf8');
fs.writeFileSync('v1_actual_logo_photoroom_y_planes.html', html, 'utf8');
console.log('Successfully embedded self-contained, independent 3D logos into Page 1, Page 2, and Page 3!');
