const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('<!-- Outs LED Stadium Indicator -->');
console.log(html.substring(idx, idx + 2000));
