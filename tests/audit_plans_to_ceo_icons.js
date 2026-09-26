const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

console.log('========================================================================');
console.log('🔍 AUDITORÍA DE ICONOS: DESDE 6 PLANES OFICIALES HASTA ACCESO CEO');
console.log('========================================================================\n');

// 1. Botones de Página 1
const p1Start = html.indexOf('id="diamax-page-1"');
const p1ButtonsIdx = html.indexOf('<!-- 3. Botones de Acción', p1Start);
const p1ButtonsEnd = html.indexOf('<!-- Micro Footer', p1ButtonsIdx);
console.log('📌 1. BOTONES DE PORTADA (PÁGINA 1):');
console.log(html.substring(p1ButtonsIdx, p1ButtonsEnd));

// 2. Modales correspondientes
console.log('\n📌 2. CABECERAS DE MODALES / PÁGINAS CORRESPONDIENTES:');

// Modal Planes (Pricing)
const pricingMatch = html.match(/id="modal-tab-pricing"[\s\S]*?(?:id="modal-tab|<div class="plans)/);
console.log('--- A. MODAL / PÁGINA 6 PLANES OFICIALES ---');
if (pricingMatch) console.log(pricingMatch[0].substring(0, 500));

// Modal Registro
const registerMatch = html.match(/id="modal-tab-register"[\s\S]*?(?:<form|<input)/);
console.log('--- B. MODAL / PÁGINA REGISTRO ---');
if (registerMatch) console.log(registerMatch[0].substring(0, 500));

// Modal Iniciar Sesión
const loginMatch = html.match(/id="modal-tab-login"[\s\S]*?(?:<form|<input)/);
console.log('--- C. MODAL / PÁGINA INICIAR SESIÓN ---');
if (loginMatch) console.log(loginMatch[0].substring(0, 500));

// Modal Acceso CEO (Master Key)
const masterMatch = html.match(/id="modal-tab-master"[\s\S]*?(?:<form|<input)/) || html.match(/id="modal-acceso-clave-ceo"[\s\S]*?(?:<form|<input)/);
console.log('--- D. MODAL ACCESO CLAVE MAESTRA CEO ---');
if (masterMatch) console.log(masterMatch[0].substring(0, 500));
