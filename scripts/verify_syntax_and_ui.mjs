import fs from 'fs';
import vm from 'vm';

const html = fs.readFileSync('index.html', 'utf-8');

console.log('1. Validando balance de divs...');
const openDivs = (html.match(/<div(\s|>)/gi) || []).length;
const closeDivs = (html.match(/<\/div>/gi) || []).length;
console.log(`Open divs: ${openDivs}, Close divs: ${closeDivs}, Diff: ${openDivs - closeDivs}`);

console.log('2. Validando sintaxis JavaScript en bloques <script>...');
const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;
let errors = 0;

while ((match = scriptRegex.exec(html)) !== null) {
  count++;
  const code = match[1];
  try {
    new vm.Script(code);
  } catch (err) {
    console.error(`❌ Error en bloque de script #${count}:`, err.message);
    errors++;
  }
}

console.log(`Validación completada: ${count} bloques analizados, ${errors} errores.`);

console.log('3. Validando elementos clave...');
const checks = [
  { id: 'id="main-nav"', expected: true },
  { id: 'id="diamax-page-3"', expected: true },
  { id: 'id="diamax-page-cabina"', expected: true }, // Plantilla independiente de cabina
  { id: 'id="nav-cabina"', expected: false }, // NO debe existir en el navbar del dugout
  { id: 'id="submodule-narradores"', expected: true }, // Submódulo 5 de Cabina
  { id: 'id="submodule-graficos"', expected: true }, // Submódulo 1 de Gráficos
  { id: 'id="submodule-auditoria"', expected: true }, // Submódulo 2 de Auditoría
  { id: 'id="submodule-cockpit"', expected: true }, // Submódulo 3 de Cockpit
  { id: 'id="submodule-dugout"', expected: true }, // Submódulo 4 de Dugout
  { id: 'id="submodule-codigo"', expected: true }, // Submódulo 6 de Código
  { id: 'id="form-nuevo-narrador"', expected: true },
  { id: 'id="form-nuevo-patrocinio"', expected: true },
  { id: 'id="prompter-active-box"', expected: true },
  { id: 'id="commentators-cards-grid"', expected: true },
  { id: 'DIAMAX_BROADCAST', expected: true },
  { id: 'DIAMAX_GRAPHICS', expected: true },
  { id: 'comm_pedro_chavez', expected: true },
  { id: 'comm_ali_zapata', expected: false }, // CEO Alí Zapata NO debe ser narrador
  { id: 'comm_beto_mendez', expected: true },
  { id: 'spons_titan', expected: true },
  { id: 'spons_diamante', expected: true },
  { id: 'spons_ferreteria', expected: true },
  { id: 'spons_medica_55', expected: true }
];

let allOk = true;
checks.forEach(c => {
  const found = html.includes(c.id);
  const ok = found === c.expected;
  if (!ok) allOk = false;
  console.log(`${ok ? '✓' : '❌'} Check: ${c.id} (esperado: ${c.expected}, obtenido: ${found})`);
});

if (allOk) {
  console.log('✓ Todos los checks pasaron al 100%.');
}
