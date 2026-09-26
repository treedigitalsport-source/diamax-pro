const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

console.log('--- Page 2 Title & Purpose ---');
const p2Idx = html.indexOf('id="diamax-page-2"');
console.log(html.substring(p2Idx, p2Idx + 1200));

console.log('\n--- Spray Chart at 339897 ---');
console.log(html.substring(339800, 341500));

console.log('\n--- Terreno at 420077 ---');
console.log(html.substring(419900, 421200));
