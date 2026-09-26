const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Lines 15930 to 15980 ---');
console.log(lines.slice(15930, 15980).map((l, i) => `${15931 + i}: ${l}`).join('\n'));
