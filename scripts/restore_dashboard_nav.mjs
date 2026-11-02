import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = path.resolve(__dirname, '..');
const indexPath = path.join(base, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

if (html.includes('id="nav-dash"')) { console.log('nav-dash ya existe'); process.exit(0); }

const svg = fs.readFileSync(path.join(base, 'assets', 'icons', 'diamax', 'dashboard.svg'), 'utf8').trim()
  .replace('<svg ', '<svg class="diamax-nav-ico" aria-hidden="true" focusable="false" ');
const btn = `<button class="nav-tab" data-tab="tab-dashboard" onclick="switchTab('dashboard')" id="nav-dash">${svg}<span>Tablero Sabermétrico</span></button>\r\n\r\n      `;

// Insertar entre Tarjeta Oficial e IA Táctica
const anchor = /(<button class="nav-tab" data-tab="tab-skills")/;
if (!anchor.test(html)) throw new Error('No se encontró botón de IA Táctica');
html = html.replace(anchor, btn + '$1');

// i18n: mantener icono y actualizar solo el texto
const langAnchor = "  const tabSkills = document.getElementById('nav-skills');";
if (!html.includes(langAnchor)) throw new Error('No se encontró bloque applyLanguage');
const langBlock = "  const tabDash = document.getElementById('nav-dash');\r\n  if (tabDash) { let _sp = tabDash.querySelector('span'); if (!_sp) { _sp = document.createElement('span'); tabDash.appendChild(_sp); } _sp.textContent = (isEsLocale ? 'Tablero Sabermétrico' : 'Sabermetric Dashboard'); }\r\n\r\n";
html = html.replace(langAnchor, langBlock + langAnchor);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✅ Pestaña Tablero Sabermétrico restaurada en #main-nav');
