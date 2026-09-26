const fs = require('fs');

const html = fs.readFileSync('v6_hace_1_hora_49505bc.html', 'utf8');
const svgEnd = html.indexOf('</svg>');
console.log(html.substring(svgEnd + 6, svgEnd + 4000));
