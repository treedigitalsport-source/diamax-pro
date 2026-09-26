const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Lines 16450 to 16485 ---');
console.log(lines.slice(16450, 16485).map((l, i) => `${16451 + i}: ${l}`).join('\n'));
console.log('--- Lines 16990 to 17020 ---');
console.log(lines.slice(16990, 17020).map((l, i) => `${16991 + i}: ${l}`).join('\n'));
