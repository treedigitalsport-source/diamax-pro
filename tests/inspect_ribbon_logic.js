const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log(lines.slice(9430, 9530).map((l, i) => `${9431 + i}: ${l}`).join('\n'));
