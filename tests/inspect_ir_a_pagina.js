const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const fnIdx = html.indexOf('function irAPagina');
console.log('--- FUNCTION irAPagina ---');
console.log(html.substring(fnIdx, fnIdx + 2000));
