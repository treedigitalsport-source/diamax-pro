import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf-8');

const checks = [
  { name: 'Modal Acceso Militar Element', test: html.includes('id="modal-acceso-militar"') },
  { name: 'Button Pase Militar in P1', test: html.includes('id="p1-btn-milspec"') },
  { name: 'Button Pase Militar in Header', test: html.includes('id="btn-toggle-milspec-header"') },
  { name: 'Code Input Field', test: html.includes('id="input-milspec-code"') },
  { name: 'Brute Force Attempts Indicator', test: html.includes('id="milspec-attempts-label"') },
  { name: 'Military Hash Ledger', test: html.includes('const MILSPEC_HASH_LEDGER') },
  { name: 'Salted SHA-256 Constant', test: html.includes('const MILSPEC_SALT = "::3TREE_MILSPEC_SECURE_VAULT_2026"') },
  { name: 'Function abrirModalAccesoMilitar', test: html.includes('function abrirModalAccesoMilitar()') },
  { name: 'Function ejecutarValidacionMilitar', test: html.includes('async function ejecutarValidacionMilitar()') },
  { name: 'Function mostrarBadgeQR', test: html.includes('function mostrarBadgeQR(') },
  { name: 'QR Badge Viewer Element', test: html.includes('id="milspec-qr-badge-viewer"') },
  { name: 'Video Scanner Camera Element', test: html.includes('id="milspec-video-scanner"') }
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
  console.log('\n>>> ALL 12 MILSPEC CHECKS PASSED PERFECTLY! <<<');
} else {
  console.error(`\n>>> FAILED ${failed} CHECKS! <<<`);
  process.exit(1);
}
