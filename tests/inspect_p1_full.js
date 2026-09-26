const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const p1Idx = html.indexOf('id="diamax-page-1"');
const sub = html.substring(p1Idx, p1Idx + 15000);
const start = sub.indexOf('id="p1-btn-plans"');
console.log(sub.substring(start - 200, start + 3500));
