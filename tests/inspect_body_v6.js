const fs = require('fs');

const html = fs.readFileSync('v6_hace_1_hora_49505bc.html', 'utf8');
const bodyIdx = html.indexOf('<body');
console.log(html.substring(bodyIdx, bodyIdx + 3500));
