const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const tEnvivo = html.indexOf('id="tab-envivo"');
const sub = html.substring(tEnvivo, tEnvivo + 8000);

console.log('--- tab-envivo from start to 8000 chars ---');
console.log(sub);
