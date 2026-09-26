const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const tEnvivo = html.indexOf('id="tab-envivo"');
const tLineup = html.indexOf('id="tab-lineup"');

console.log('--- Current index.html tab-envivo snippet (last 3000 chars) ---');
console.log(html.substring(tLineup - 3000, tLineup));
