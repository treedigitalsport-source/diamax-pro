const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const p1Idx = html.indexOf('id="diamax-page-1"');
const p2Idx = html.indexOf('id="diamax-page-2"');
const sub = html.substring(p1Idx, p2Idx);
const startIdx = sub.indexOf('<!-- Botonera de Entrada Principal a DIAMAX');
const endIdx = sub.indexOf('<!-- Barra de Seguridad');

console.log('--- Current Page 1 Buttons Block ---');
console.log(sub.substring(startIdx, endIdx));
