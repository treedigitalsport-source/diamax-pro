const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log('--- PAGE 2 LOGIN (LINES 3670 - 3730) ---');
console.log(lines.slice(3670, 3730).map((l, i) => `${3671 + i}: ${l}`).join('\n'));
