const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const fnRegIdx = html.indexOf('function ejecutarRegistro');
console.log('--- FUNCTION ejecutarRegistro ---');
console.log(html.substring(fnRegIdx, fnRegIdx + 1500));
