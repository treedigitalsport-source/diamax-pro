const fs = require('fs');

const html = fs.readFileSync('v6_hace_1_hora_49505bc.html', 'utf8');
const p1Start = html.indexOf('id="diamax-page-1"');
const titleMatch = html.indexOf('<h1', p1Start);
console.log(html.substring(titleMatch - 100, titleMatch + 600));
