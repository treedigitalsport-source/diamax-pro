const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Lines 240 to 290 ---');
console.log(lines.slice(240, 290).map((l, i) => `${241 + i}: ${l}`).join('\n'));
console.log('--- Lines 2135 to 2190 ---');
console.log(lines.slice(2135, 2190).map((l, i) => `${2136 + i}: ${l}`).join('\n'));
