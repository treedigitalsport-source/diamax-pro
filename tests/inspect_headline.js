const fs = require('fs');

const html = fs.readFileSync('v6_hace_1_hora_49505bc.html', 'utf8');
const hIdx = html.indexOf('BIENVENIDO A');
console.log(html.substring(hIdx - 600, hIdx + 400));
