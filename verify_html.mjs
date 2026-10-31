import fs from 'fs';

const html = fs.readFileSync('C:\\Users\\fitne\\Documents\\3Tree_Codebase\\DIAMAX\\index.html', 'utf-8');

console.log('HTML size:', (html.length / 1024 / 1024).toFixed(2), 'MB');

// Check key elements
const checks = [
  'id="tab-cabina"',
  'id="nav-cabina"',
  'id="diamax-bottom-nav"',
  'toggleWakeLockCabina',
  'seleccionarPatrocinioCabina',
  'generarNuggetsCabina',
  'dispararSalidaComercialesManual',
  'activarAlertaSustitucionCabina',
  'actualizarRadarDefensaCabina',
  'cockpit-alert-blink',
  'cockpit-sub-alert-bar',
  'cockpit-batter-line-today',
  'cockpit-runner-1b-name',
  'cockpit-sponsor-card',
  'cockpit-commercial-script',
  'svg-def-cf',
  'roster-def-cf'
];

let allPassed = true;
for (const check of checks) {
  const exists = html.includes(check);
  console.log('Check [' + check + ']: ' + (exists ? 'OK' : 'MISSING'));
  if (!exists) allPassed = false;
}

if (allPassed) {
  console.log('ALL CHECKS PASSED PERFECTLY!');
} else {
  console.error('SOME CHECKS FAILED!');
  process.exit(1);
}
