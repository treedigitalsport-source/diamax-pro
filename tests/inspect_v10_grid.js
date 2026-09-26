const fs = require('fs');
const html = fs.readFileSync('v10_iconos_vectoriales_4b5addd.html', 'utf8');

const tEnvivo = html.indexOf('id="tab-envivo"');
const gridIdx = html.indexOf('class="responsive-grid-split"', tEnvivo);
const tLineup = html.indexOf('id="tab-lineup"');

console.log('--- v10 split grid content ---');
console.log(html.substring(gridIdx, tLineup));
