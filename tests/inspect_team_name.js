const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log(lines.slice(5565, 5625).map((l, i) => `${5566 + i}: ${l}`).join('\n'));
