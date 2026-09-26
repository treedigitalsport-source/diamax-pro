const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const tEnvivo = html.indexOf('id="tab-envivo"');
const tManual = html.indexOf('id="tab-manual"');
const sub = html.substring(tEnvivo + 20000, tManual);
console.log('--- End of tab-envivo ---');
console.log(sub);
