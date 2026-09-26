const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log(lines.slice(12700, 12760).map((l, i) => `${12701 + i}: ${l}`).join('\n'));
