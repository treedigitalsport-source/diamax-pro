const fs = require('fs');
const html = fs.readFileSync('v10_iconos_vectoriales_4b5addd.html', 'utf8');

const tEnvivo = html.indexOf('id="tab-envivo"');
const tLineup = html.indexOf('id="tab-lineup"');

console.log('v10 tab-envivo length:', tLineup - tEnvivo);
console.log('--- v10 tab-envivo snippet (first 4000 chars) ---');
console.log(html.substring(tEnvivo, tEnvivo + 4000));
