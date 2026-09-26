const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Lines 16390 to 16580 ---');
console.log(lines.slice(16390, 16580).map((l, i) => `${16391 + i}: ${l}`).join('\n'));
