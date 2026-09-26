const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const tEnvivo = html.indexOf('id="tab-envivo"');
const sub = html.substring(tEnvivo + 6000, tEnvivo + 18000);

console.log('--- tab-envivo snippet 6k to 18k ---');
console.log(sub);
