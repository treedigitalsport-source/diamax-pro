const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const p2Idx = html.indexOf('id="diamax-page-2"');
console.log(html.substring(p2Idx + 1000, p2Idx + 3000));
