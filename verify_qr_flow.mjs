import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf-8');

const checks = [
  { name: 'QR Registration Banner in P2', test: html.includes('id="p2-qr-registration-banner"') },
  { name: 'Personalized QR Badge Container in Paso 5', test: html.includes('id="p2-personalized-qr-badge"') },
  { name: 'Modal Escanear QR Login', test: html.includes('id="modal-escanear-qr-login"') },
  { name: 'Button Entrar con QR in P1', test: html.includes('id="p1-btn-qr-login"') },
  { name: 'Function generarCredencialQRPersonalizada', test: html.includes('function generarCredencialQRPersonalizada(') },
  { name: 'Function compartirPaseWhatsApp', test: html.includes('function compartirPaseWhatsApp()') },
  { name: 'Function abrirModalEscanearQRLogin', test: html.includes('function abrirModalEscanearQRLogin()') },
  { name: 'Function autenticarConTokenQR', test: html.includes('function autenticarConTokenQR(') },
  { name: 'Magic Link URL Parameter Listener', test: html.includes("params.get('qr_auth')") },
  { name: 'Connected in confirmarYVerificarCuentaP2', test: html.includes('generarCredencialQRPersonalizada(currentUserSession);') }
];

let failed = 0;
for (const c of checks) {
  if (c.test) {
    console.log(`[PASS] ${c.name}`);
  } else {
    console.error(`[FAIL] ${c.name}`);
    failed++;
  }
}

if (failed === 0) {
  console.log('\n>>> ALL 10 QR FLOW CHECKS PASSED PERFECTLY! <<<');
} else {
  console.error(`\n>>> FAILED ${failed} CHECKS! <<<`);
  process.exit(1);
}
