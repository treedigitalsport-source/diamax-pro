const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Lines 16460 to 16510 ---');
console.log(lines.slice(16460, 16510).map((l, i) => `${16461 + i}: ${l}`).join('\n'));
