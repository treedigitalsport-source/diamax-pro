import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = path.resolve(__dirname, '..');
const iconsDir = path.join(base, 'assets', 'icons', 'diamax');
const indexPath = path.join(base, 'index.html');

const map = {
  'btn-go-scorer': 'dugout',
  'nav-lineup': 'lineup',
  'btn-view-field': 'campo',
  'nav-manual': 'manual',
  'nav-card': 'tarjeta-oficial',
  'nav-skills': 'ia-tactica',
  'nav-profile': 'perfil'
};

let html = fs.readFileSync(indexPath, 'utf8');
if (html.includes('diamax-nav-ico')) {
  console.log('Ya integrado; nada que hacer.');
  process.exit(0);
}

for (const [id, icon] of Object.entries(map)) {
  const svgRaw = fs.readFileSync(path.join(iconsDir, icon + '.svg'), 'utf8').trim();
  const svg = svgRaw.replace('<svg ', '<svg class="diamax-nav-ico" aria-hidden="true" focusable="false" ').replace(/\s*\r?\n\s*/g, '');
  const re = new RegExp('(id="' + id + '"[^>]*>\\s*)(<span>)');
  if (!re.test(html)) throw new Error('No se encontró botón ' + id);
  html = html.replace(re, '$1' + svg + '$2');
}

const css = `
/* ICONOS PROPIOS DIAMAX — Apple HIG: gris secundario #8E8E93, activo #007AFF */
#main-nav .diamax-nav-ico { width:18px; height:18px; flex:none; color:#8E8E93; transition:color .22s ease, filter .22s ease; }
#main-nav button:hover:not(.active) .diamax-nav-ico { color:#FFFFFF; }
#main-nav button.active .diamax-nav-ico { color:#007AFF; filter:drop-shadow(0 0 6px rgba(0,122,255,.55)); }
body.daylight-mode #main-nav .diamax-nav-ico { color:#475569; }
body.daylight-mode #main-nav button.active .diamax-nav-ico { color:#0F172A; filter:none; }
`;
const marker = '/* Header & Ribbon Interactive Buttons */';
if (!html.includes(marker)) throw new Error('Marcador CSS no encontrado');
html = html.replace(marker, css + '\n' + marker);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✅ Iconos propios integrados en #main-nav (7 pestañas).');
