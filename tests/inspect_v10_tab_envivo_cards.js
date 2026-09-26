const fs = require('fs');
const html = fs.readFileSync('v10_iconos_vectoriales_4b5addd.html', 'utf8');

const tEnvivo = html.indexOf('id="tab-envivo"');
const tLineup = html.indexOf('id="tab-lineup"');

console.log('--- Full v10 tab-envivo markup ---');
console.log(html.substring(tEnvivo, tLineup));
