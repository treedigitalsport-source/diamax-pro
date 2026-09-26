const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log('--- SCOREBOARD HTML (lines 4425 - 4510) ---');
console.log(lines.slice(4425, 4510).map((l, i) => `${4426 + i}: ${l}`).join('\n'));
