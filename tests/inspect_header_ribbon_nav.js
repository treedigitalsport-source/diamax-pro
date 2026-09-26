const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log(lines.slice(3770, 3875).map((l, i) => `${3771 + i}: ${l}`).join('\n'));
