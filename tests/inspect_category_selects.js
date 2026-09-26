const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log('--- Page 2 Category Select (lines 3415 - 3445) ---');
console.log(lines.slice(3415, 3445).map((l, i) => `${3416 + i}: ${l}`).join('\n'));
console.log('--- Modal Category Select (lines 16230 - 16260) ---');
console.log(lines.slice(16230, 16260).map((l, i) => `${16231 + i}: ${l}`).join('\n'));
