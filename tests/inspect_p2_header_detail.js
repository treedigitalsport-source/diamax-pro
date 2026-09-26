const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const p2Idx = html.indexOf('id="diamax-page-2"');
console.log(html.substring(p2Idx, p2Idx + 2000));
