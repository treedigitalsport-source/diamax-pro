import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.resolve(__dirname, '..', 'index.html');
const APPLY = process.argv.includes('--apply');
let html = fs.readFileSync(indexPath, 'utf8');

// Iconos que SÍ se conservan (regla aprobada): logo, controles de cabecera, planes/precios, check de planes, voz
const KEEP_IDS = new Set([
  'diamax-home-plate-symbol', 'diamax-icon-sun-moon', 'diamax-icon-stadium-gate', 'diamax-icon-radio-tower',
  'diamax-icon-voice-mic', 'diamax-icon-voice-speaker', 'diamax-icon-check-circle',
  'diamax-icon-tier-team', 'diamax-icon-tier-club', 'diamax-icon-tier-academy', 'diamax-icon-tier-league',
  'diamax-icon-tier-organization', 'diamax-icon-tier-enterprise'
]);

const re = /<svg\b[^>]*>\s*<use\s+href="#([^"]+)"\s*\/>\s*<\/svg>(?:[ \t]?)/g;
const removed = {};
html = html.replace(re, (m, id) => {
  if (KEEP_IDS.has(id)) return m;
  removed[id] = (removed[id] || 0) + 1;
  return '';
});
const total = Object.values(removed).reduce((a, b) => a + b, 0);
console.log('SVG decorativos retirados:', total);
console.log(JSON.stringify(removed));
const left = (html.match(/<use href="#/g) || []).length;
console.log('SVG <use> restantes:', left);
if (APPLY) { fs.writeFileSync(indexPath, html, 'utf8'); console.log('✅ aplicado'); } else console.log('(dry-run)');
