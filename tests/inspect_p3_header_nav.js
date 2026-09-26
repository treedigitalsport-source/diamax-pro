const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Page 3 Header and Navigation (lines 3730 - 3900) ---');
console.log(lines.slice(3730, 3900).map((l, i) => `${3731 + i}: ${l}`).join('\n'));
