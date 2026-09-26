const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('id="tab-manual"');
console.log('--- 600 chars before tab-manual ---');
console.log(html.substring(idx - 600, idx));
