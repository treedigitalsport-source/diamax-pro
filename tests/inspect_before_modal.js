const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Lines 15890 to 15935 ---');
console.log(lines.slice(15890, 15935).map((l, i) => `${15891 + i}: ${l}`).join('\n'));
