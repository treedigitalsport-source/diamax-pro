const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const p1Start = html.indexOf('id="diamax-page-1"');
const p1ButtonsIdx = html.indexOf('<!-- 3. Botones de Acción', p1Start);
const p1ButtonsEnd = html.indexOf('<!-- Micro Footer', p1ButtonsIdx);

console.log('--- CURRENT PAGE 1 BUTTONS ---');
console.log(html.substring(p1ButtonsIdx, p1ButtonsEnd));
