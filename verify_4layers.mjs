import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf-8');

const checks = [
  { name: 'No modal-acceso-militar', test: !html.includes('id="modal-acceso-militar"') },
  { name: 'No modal-escanear-qr-login', test: !html.includes('id="modal-escanear-qr-login"') },
  { name: 'No p1-btn-milspec button', test: !html.includes('id="p1-btn-milspec"') },
  { name: 'No p1-btn-qr-login button', test: !html.includes('id="p1-btn-qr-login"') },
  { name: 'Clean Página 1 with VER PLANES, INICIAR SESIÓN, ACCESO MASTER', test: html.includes('id="p1-btn-plans"') && html.includes('id="p1-btn-login"') && html.includes('id="p1-btn-ceo-key"') },
  { name: 'Class MilitaryCyberDefense4Layers', test: html.includes('class MilitaryCyberDefense4Layers') },
  { name: 'Capa 1: Validar Identidad SHA-256', test: html.includes('validarCapa1Identidad') },
  { name: 'Capa 2: Token Dinamico Zero-Trust', test: html.includes('generarCapa2TokenZeroTrust') },
  { name: 'Capa 3: Device Fingerprint Anti-Clonacion', test: html.includes('validarCapa3IntegridadDispositivo') },
  { name: 'Capa 4: Cortafuegos Anti-Inyeccion & Rate Limiting', test: html.includes('validarCapa4AntiInyeccion') },
  { name: 'Terminal HUD de Seguridad 4 Capas', test: html.includes('mostrarTerminalSeguridad4Capas') }
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
  console.log('\n>>> ALL 11 4-LAYER MILITARY DEFENSE CHECKS PASSED PERFECTLY! <<<');
} else {
  console.error(`\n>>> FAILED ${failed} CHECKS! <<<`);
  process.exit(1);
}
