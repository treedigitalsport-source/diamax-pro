import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf-8');

const checks = [
  { name: 'Sunlight Mode CSS class', test: html.includes('body.sunlight-mode') },
  { name: 'Touch Target 48px CSS', test: html.includes('min-height: 48px !important;') },
  { name: 'Mobile Bottom Nav CSS', test: html.includes('#mobile-bottom-nav') },
  { name: 'Print Cheat Sheet CSS', test: html.includes('#dugout-cheat-sheet') },
  { name: 'Free Press Key Input P2', test: html.includes('id="input-key-media-p2"') },
  { name: 'Free Press Key Input P3', test: html.includes('id="input-key-media-p3"') },
  { name: 'Sunlight Button in Header', test: html.includes('id="btn-toggle-sunlight-header"') },
  { name: 'Sunlight Button in Dugout Scoreboard', test: html.includes('id="btn-sunlight-dugout"') },
  { name: 'Dugout 2-Step Keypad Container', test: html.includes('id="dugout-2step-keypad"') },
  { name: 'Macro-buttons 48px in 2-step keypad', test: html.includes('id="btn-step1-hits"') && html.includes('id="btn-step1-outs"') },
  { name: 'Mobile Bottom Nav HTML', test: html.includes('id="mobile-bottom-nav"') },
  { name: 'No PIN 1234 in tab-manual', test: !html.includes('PIN canónico predeterminado es <strong><code>1234</code></strong>') },
  { name: 'Module 11 in tab-manual', test: html.includes('11. Operación de Cabina y Transmisión: Radio, TV & Streaming OBS') },
  { name: 'Module 12 in tab-manual', test: html.includes('12. Comandos y Dictado de Notas por Voz: Glosario & Filtro de Ruido') },
  { name: 'Module 13 in tab-manual', test: html.includes('13. Sincronización Nube / Local & Reglas de Anotación Concurrente') },
  { name: 'Dugout Cheat Sheet 60s', test: html.includes('Tarjeta de Emergencia de 60 Segundos (Dugout Cheat Sheet)') },
  { name: 'Infield Fly Rule in Cheat Sheet', test: html.includes('Regla de Infield Fly (Regla 2.00 / 6.05e)') },
  { name: 'Balk Rule in Cheat Sheet', test: html.includes('Balk del Lanzador (Regla 8.05)') },
  { name: 'WP vs PB Rule in Cheat Sheet', test: html.includes('Wild Pitch (WP) vs. Passed Ball (PB)') },
  { name: 'FC vs Hit Rule in Cheat Sheet', test: html.includes("Fielder's Choice (FC) vs. Hit (1B)") },
  { name: 'JavaScript toggleModoLuzSolar', test: html.includes('function toggleModoLuzSolar()') },
  { name: 'JavaScript validarClavePrensaGratis', test: html.includes('window.validarClavePrensaGratis') },
  { name: 'JavaScript seleccionarCategoria2Paso', test: html.includes('function seleccionarCategoria2Paso(') },
  { name: 'JavaScript toggleVistaTecladoDugout', test: html.includes('function toggleVistaTecladoDugout()') }
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
  console.log('\n>>> ALL 24 VERIFICATION CHECKS PASSED PERFECTLY! <<<');
} else {
  console.error(`\n>>> FAILED ${failed} CHECKS! <<<`);
  process.exit(1);
}
