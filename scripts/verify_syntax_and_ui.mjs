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

console.log('3. Validando elementos clave de Fase 7...');
const checks = [
  'id="nav-cabina"',
  'id="section-commentators-db"',
  'id="form-nuevo-narrador"',
  'id="form-nuevo-patrocinio"',
  'id="prompter-active-box"',
  'id="commentators-cards-grid"',
  'DIAMAX_BROADCAST',
  'comm_pedro_chavez',
  'comm_ali_zapata',
  'comm_beto_mendez',
  'spons_titan',
  'spons_diamante',
  'spons_ferreteria',
  'spons_medica_55'
];

checks.forEach(c => {
  const found = html.includes(c);
  console.log(`${found ? '✓' : '❌'} Check: ${c}`);
});
