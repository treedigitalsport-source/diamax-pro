import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf-8');

const checks = [
  { name: 'No Entrada Cabina button in Página 3 header', test: !html.includes('id="btn-entrada-cabina-broadcast"') },
  { name: 'No Pase Militar button in Página 3 header', test: !html.includes('id="btn-toggle-milspec-header"') },
  { name: 'Nav-cabina hidden by default for scorer', test: html.includes('id="nav-cabina" style="display:none;') },
  { name: 'All Security Portals on Página 1 & Master Access', test: html.includes('MilitaryCyberDefense4Layers') && html.includes('abrirAccesoClaveCEO') },
  { name: 'No Cabina in mobile bottom nav of Scorer', test: !html.includes('id="mob-nav-cabina"') },
  { name: 'Function aplicarSeparacionRolesUI', test: html.includes('function aplicarSeparacionRolesUI()') }
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
  console.log('\n>>> ALL 6 DOMAIN ISOLATION CHECKS PASSED PERFECTLY! <<<');
} else {
  console.error(`\n>>> FAILED ${failed} CHECKS! <<<`);
  process.exit(1);
}
