const fs = require('fs');

const idx = fs.readFileSync('index.html', 'utf8');
const p1Start = idx.indexOf('id="diamax-page-1"');
const p2Start = idx.indexOf('id="diamax-page-2"');
console.log(idx.substring(p1Start, p2Start));
