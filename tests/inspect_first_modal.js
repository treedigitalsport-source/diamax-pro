const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Lines 15990 to 16050 ---');
console.log(lines.slice(15990, 16050).map((l, i) => `${15991 + i}: ${l}`).join('\n'));
