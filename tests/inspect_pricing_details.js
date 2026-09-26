const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log('--- LINES 7155 to 7180 ---');
console.log(lines.slice(7155, 7180).join('\n'));
console.log('--- LINES 15950 to 16260 ---');
console.log(lines.slice(15950, 16180).join('\n'));
