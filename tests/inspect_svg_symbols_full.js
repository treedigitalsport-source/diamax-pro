const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log('--- SVG Symbols (lines 2800 - 3020) ---');
console.log(lines.slice(2800, 3020).map((l, i) => `${2801 + i}: ${l}`).join('\n'));
