const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log(lines.slice(9390, 9430).map((l, i) => `${9391 + i}: ${l}`).join('\n'));
