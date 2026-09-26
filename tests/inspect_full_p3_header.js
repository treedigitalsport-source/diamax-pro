const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const p3Idx = html.indexOf('id="diamax-page-3"');
const headerEnd = html.indexOf('id="scoreboard"', p3Idx);
console.log(html.substring(p3Idx, headerEnd));
