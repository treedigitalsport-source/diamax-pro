import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

// 1. Locate panel-36-plays
const p36Idx = html.indexOf('id="panel-36-plays"');
console.log('panel-36-plays index:', p36Idx);
if (p36Idx !== -1) {
  const gridStart = html.indexOf('<div class="action-grid"', p36Idx);
  const gridEnd = html.indexOf('</div>', gridStart + 20);
  console.log('gridStart:', gridStart, 'gridEnd:', gridEnd);
  console.log('panel-36-plays snippet (first 1000 chars):');
  console.log(html.slice(p36Idx, p36Idx + 1200));
}

// 2. Locate registrarJugadaLive
const regIdx = html.indexOf('function registrarJugadaLive');
console.log('\nregistrarJugadaLive index:', regIdx);
if (regIdx !== -1) {
  console.log('registrarJugadaLive snippet:');
  console.log(html.slice(regIdx, regIdx + 1200));
}

// 3. Locate DIAMAX_RT
const rtIdx = html.indexOf('const DIAMAX_RT =');
console.log('\nDIAMAX_RT index:', rtIdx);
if (rtIdx !== -1) {
  console.log('DIAMAX_RT snippet:');
  console.log(html.slice(rtIdx, rtIdx + 1200));
}

// 4. Locate p1-btn-register and Prueba Diamax Pro gratis
const p1RegIdx = html.indexOf('id="p1-btn-register"');
console.log('\np1-btn-register index:', p1RegIdx);
const pruebaIdx = html.indexOf('Prueba Diamax Pro gratis');
console.log('Prueba Diamax Pro gratis index:', pruebaIdx);
