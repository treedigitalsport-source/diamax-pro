const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const p1Idx = html.indexOf('id="diamax-page-1"');
const p2Idx = html.indexOf('id="diamax-page-2"');
const sub = html.substring(p1Idx, p2Idx);
const btnSectionIdx = sub.indexOf('p1-btn-plans');

console.log('--- Buttons Section in Page 1 ---');
console.log(sub.substring(btnSectionIdx - 300, btnSectionIdx + 1500));
