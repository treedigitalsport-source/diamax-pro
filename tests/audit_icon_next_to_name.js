const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

console.log('========================================================================');
console.log('🔍 AUDITORÍA DEL ICONO QUE ESTÁ AL LADO DEL NOMBRE "DIAMAX PRO"');
console.log('========================================================================\n');

// 1. In Page 1 Header
const p1Start = html.indexOf('id="diamax-page-1"');
const p1LogoIdx = html.indexOf('<!-- Logo DIAMAX PRO', p1Start);
console.log('📌 1. EN PÁGINA 1 (HEADER SUPERIOR IZQUIERDO):');
console.log(html.substring(p1LogoIdx, p1LogoIdx + 800));
console.log('------------------------------------------------------------------------\n');

// 2. In Page 2 Header
const p2Start = html.indexOf('id="diamax-page-2"');
const p2LogoIdx = html.indexOf('irAPagina(1)', p2Start);
console.log('📌 2. EN PÁGINA 2 (BARRA SUPERIOR LUXURY):');
console.log(html.substring(p2LogoIdx, p2LogoIdx + 800));
console.log('------------------------------------------------------------------------\n');

// 3. In Page 3 Header (Dugout)
const p3Start = html.indexOf('id="diamax-page-3"');
const p3LogoIdx = html.indexOf('header-logo-container', p3Start);
console.log('📌 3. EN PÁGINA 3 (DUGOUT HEADER):');
console.log(html.substring(p3LogoIdx, p3LogoIdx + 800));
console.log('------------------------------------------------------------------------\n');

// 4. In Auth Modal Header
const authStart = html.indexOf('id="auth-modal-overlay"');
const authLogoIdx = html.indexOf('<!-- 3D Baseball Home Plate Base Icon Oficial -->', authStart);
console.log('📌 4. EN MODAL DE AUTENTICACIÓN & PLANES:');
console.log(html.substring(authLogoIdx, authLogoIdx + 800));
console.log('------------------------------------------------------------------------\n');
