const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const modalSec2Idx = html.indexOf('2. Sección Equipo y Liga');
console.log('--- MODAL SECTION 2 ---');
console.log(html.substring(modalSec2Idx - 100, modalSec2Idx + 1500));

const p2Sec2Idx = html.indexOf('id="p2-wizard-paso-2"');
console.log('--- PAGE 2 PASO 2 / EQUIPO ---');
if (p2Sec2Idx !== -1) {
  console.log(html.substring(p2Sec2Idx, p2Sec2Idx + 1500));
}
