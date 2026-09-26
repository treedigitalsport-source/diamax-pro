const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log(lines.slice(760, 795).map((l, i) => `${761 + i}: ${l}`).join('\n'));
