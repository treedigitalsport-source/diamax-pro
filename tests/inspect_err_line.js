const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log(lines.slice(7120, 7200).map((l, i) => `${7121 + i}: ${l}`).join('\n'));
