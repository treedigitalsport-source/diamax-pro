const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log(lines.slice(10325, 10430).map((l, i) => `${10326 + i}: ${l}`).join('\n'));
