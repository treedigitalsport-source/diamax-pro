const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// The master unified logo component from the Plans modal:
const unifiedLogoP1 = `<!-- Logo DIAMAX PRO (Home Plate Diamond 3D Oficial de Planes) -->
    <div onclick="irAPagina(1)" style="display:inline-flex; align-items:center; gap:12px; cursor:pointer; text-decoration:none; transition:transform 0.25s cubic-bezier(0.16,1,0.3,1);" onmouseover="this.style.transform='scale(1.04)';" onmouseout="this.style.transform='scale(1)';" title="DIAMAX PRO — Sports Operating System">
      <div style="display:inline-flex; align-items:center; justify-content:center; width:46px; height:46px; border-radius:12px; background:linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%); border:1px solid rgba(255,255,255,0.18); box-shadow:0 4px 16px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.35); backdrop-filter:blur(10px); flex-shrink:0;">
        <svg width="30" height="30" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 2px 10px rgba(24,216,255,0.7));">
          <defs>
            <linearGradient id="hp3d-master-base" x1="18" y1="4" x2="18" y2="33" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#FFFFFF"/>
              <stop offset="35%" stop-color="#E2E8F0"/>
              <stop offset="70%" stop-color="#64748B"/>
              <stop offset="100%" stop-color="#0F172A"/>
            </linearGradient>
            <linearGradient id="hp3d-master-rim" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#18D8FF"/>
              <stop offset="45%" stop-color="#FFFFFF"/>
              <stop offset="100%" stop-color="#0284C7"/>
            </linearGradient>
            <linearGradient id="hp3d-master-inner" x1="18" y1="8" x2="18" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#0F243E"/>
              <stop offset="50%" stop-color="#081426"/>
              <stop offset="100%" stop-color="#020814"/>
            </linearGradient>
          </defs>
          <polygon points="18,33 5,20 5,5 31,5 31,20" fill="url(#hp3d-master-base)" stroke="url(#hp3d-master-rim)" stroke-width="1.8" stroke-linejoin="round"/>
          <polygon points="18,28 8,18 8,8 28,8 28,18" fill="url(#hp3d-master-inner)" stroke="rgba(255,255,255,0.35)" stroke-width="1" stroke-linejoin="round"/>
          <polygon points="18,23 11,16 11,11 25,11 25,16" fill="url(#hp3d-master-base)" opacity="0.95"/>
          <polygon points="18,19 13,14 13,12 23,12 23,14" fill="url(#hp3d-master-rim)"/>
          <line x1="5" y1="5" x2="18" y2="18" stroke="rgba(255,255,255,0.8)" stroke-width="0.8"/>
          <line x1="31" y1="5" x2="18" y2="18" stroke="rgba(255,255,255,0.8)" stroke-width="0.8"/>
          <line x1="18" y1="18" x2="18" y2="33" stroke="rgba(255,255,255,0.9)" stroke-width="1"/>
        </svg>
      </div>
      <div style="display:inline-flex; align-items:baseline; gap:6px; font-family:'Montserrat', sans-serif; font-weight:900; font-size:26px; letter-spacing:1.2px; line-height:1; text-transform:uppercase;">
        <span style="color:#FFFFFF; background:linear-gradient(180deg, #FFFFFF 0%, #B8C2CC 35%, #FFFFFF 55%, #737F8C 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; -webkit-text-stroke:0.5px rgba(216,226,234,0.8); filter:drop-shadow(0 2px 0 #475569) drop-shadow(0 4px 10px rgba(0,0,0,0.8));">DIAMAX</span>
        <span style="color:#FFB300; background:linear-gradient(180deg, #FFF2A6 0%, #FFB300 40%, #F57C00 70%, #FFD75A 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; -webkit-text-stroke:0.5px #FFCC55; filter:drop-shadow(0 2px 0 #92400E) drop-shadow(0 4px 10px rgba(255,179,0,0.5)); font-size:21px;">PRO</span>
      </div>
    </div>`;

const unifiedLogoP2 = `<!-- Logo Oficial DIAMAX PRO (Home Plate Diamond 3D Idéntico) -->
        <div onclick="irAPagina(1)" style="display:inline-flex; align-items:center; gap:10px; cursor:pointer;" title="DIAMAX PRO">
          <div style="display:inline-flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:10px; background:linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%); border:1px solid rgba(255,255,255,0.18); box-shadow:0 4px 12px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.35); backdrop-filter:blur(10px); flex-shrink:0;">
            <svg width="26" height="26" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 2px 8px rgba(24,216,255,0.7));">
              <polygon points="18,33 5,20 5,5 31,5 31,20" fill="url(#hp3d-master-base)" stroke="url(#hp3d-master-rim)" stroke-width="1.8" stroke-linejoin="round"/>
              <polygon points="18,28 8,18 8,8 28,8 28,18" fill="url(#hp3d-master-inner)" stroke="rgba(255,255,255,0.35)" stroke-width="1" stroke-linejoin="round"/>
              <polygon points="18,23 11,16 11,11 25,11 25,16" fill="url(#hp3d-master-base)" opacity="0.95"/>
              <polygon points="18,19 13,14 13,12 23,12 23,14" fill="url(#hp3d-master-rim)"/>
              <line x1="5" y1="5" x2="18" y2="18" stroke="rgba(255,255,255,0.8)" stroke-width="0.8"/>
              <line x1="31" y1="5" x2="18" y2="18" stroke="rgba(255,255,255,0.8)" stroke-width="0.8"/>
              <line x1="18" y1="18" x2="18" y2="33" stroke="rgba(255,255,255,0.9)" stroke-width="1"/>
            </svg>
          </div>
          <div style="display:inline-flex; align-items:baseline; gap:5px; font-family:'Montserrat', sans-serif; font-weight:900; font-size:20px; letter-spacing:0.8px; line-height:1; text-transform:uppercase;">
            <span style="color:#FFFFFF; background:linear-gradient(180deg, #FFFFFF 0%, #B8C2CC 35%, #FFFFFF 55%, #737F8C 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">DIAMAX</span>
            <span style="color:#FFB300; background:linear-gradient(180deg, #FFF2A6 0%, #FFB300 40%, #F57C00 70%, #FFD75A 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; font-size:16px;">PRO</span>
          </div>
        </div>`;

const unifiedLogoP3 = `<!-- Logo Oficial DIAMAX PRO (Home Plate Diamond 3D Idéntico) -->
        <div onclick="irAPagina(1)" style="display:inline-flex; align-items:center; gap:10px; cursor:pointer; text-decoration:none;" title="DIAMAX PRO — Ir a Portada">
          <div style="display:inline-flex; align-items:center; justify-content:center; width:42px; height:42px; border-radius:10px; background:linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%); border:1px solid rgba(255,255,255,0.18); box-shadow:0 4px 12px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.35); backdrop-filter:blur(10px); flex-shrink:0;">
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 2px 10px rgba(24,216,255,0.7));">
              <polygon points="18,33 5,20 5,5 31,5 31,20" fill="url(#hp3d-master-base)" stroke="url(#hp3d-master-rim)" stroke-width="1.8" stroke-linejoin="round"/>
              <polygon points="18,28 8,18 8,8 28,8 28,18" fill="url(#hp3d-master-inner)" stroke="rgba(255,255,255,0.35)" stroke-width="1" stroke-linejoin="round"/>
              <polygon points="18,23 11,16 11,11 25,11 25,16" fill="url(#hp3d-master-base)" opacity="0.95"/>
              <polygon points="18,19 13,14 13,12 23,12 23,14" fill="url(#hp3d-master-rim)"/>
              <line x1="5" y1="5" x2="18" y2="18" stroke="rgba(255,255,255,0.8)" stroke-width="0.8"/>
              <line x1="31" y1="5" x2="18" y2="18" stroke="rgba(255,255,255,0.8)" stroke-width="0.8"/>
              <line x1="18" y1="18" x2="18" y2="33" stroke="rgba(255,255,255,0.9)" stroke-width="1"/>
            </svg>
          </div>
          <div style="display:inline-flex; align-items:baseline; gap:5px; font-family:'Montserrat', sans-serif; font-weight:900; font-size:22px; letter-spacing:1px; line-height:1; text-transform:uppercase;">
            <span style="color:#FFFFFF; background:linear-gradient(180deg, #FFFFFF 0%, #B8C2CC 35%, #FFFFFF 55%, #737F8C 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; -webkit-text-stroke:0.5px rgba(216,226,234,0.8); filter:drop-shadow(0 2px 0 #475569) drop-shadow(0 4px 10px rgba(0,0,0,0.8));">DIAMAX</span>
            <span style="color:#FFB300; background:linear-gradient(180deg, #FFF2A6 0%, #FFB300 40%, #F57C00 70%, #FFD75A 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; -webkit-text-stroke:0.5px #FFCC55; filter:drop-shadow(0 2px 0 #92400E) drop-shadow(0 4px 10px rgba(255,179,0,0.5)); font-size:18px;">PRO</span>
          </div>
        </div>`;

// Replace in Page 1
const p1LogoRegex = /<!-- Logo DIAMAX PRO[\s\S]*?<\/div>\s*<\/div>\s*<!-- Badges/i;
html = html.replace(p1LogoRegex, `${unifiedLogoP1}\n    \n    <!-- Badges`);

// Replace in Page 2
const p2LogoRegex = /<div onclick="irAPagina\(1\)" style="display:inline-flex; align-items:center; gap:8px; cursor:pointer;" title="DIAMAX PRO">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<div style="display:flex; align-items:center; gap:10px;">/i;
if (p2LogoRegex.test(html)) {
  html = html.replace(p2LogoRegex, `${unifiedLogoP2}\n        </div>\n      </div>\n      <div style="display:flex; align-items:center; gap:10px;">`);
}

// Replace in Page 3
const p3LogoRegex = /<!-- Logo Oficial DIAMAX PRO[\s\S]*?<\/div>\s*<\/div>\s*<img src="https:\/\/images\.unsplash/i;
html = html.replace(p3LogoRegex, `${unifiedLogoP3}\n        <img src="https://images.unsplash`);

fs.writeFileSync('index.html', html, 'utf8');
fs.writeFileSync('v_original_aprobada.html', html, 'utf8');
fs.writeFileSync('v6_hace_1_hora_49505bc.html', html, 'utf8');
console.log('Successfully unified logo across Page 1, Page 2, Page 3, and Plans modal!');
