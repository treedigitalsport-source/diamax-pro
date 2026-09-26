const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const tEnvivo = html.indexOf('id="tab-envivo"');
const sub = html.substring(tEnvivo + 12900, tEnvivo + 13300);
console.log('--- Around offset 12960 in tab-envivo ---');
console.log(sub);
