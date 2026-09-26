const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log(lines.slice(14150, 14350).map((l, i) => `${14151 + i}: ${l}`).join('\n'));
