const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const p3Idx = html.indexOf('id="diamax-page-3"');
console.log(html.substring(p3Idx, p3Idx + 1600));
