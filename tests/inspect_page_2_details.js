const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const p2Start = html.indexOf('id="diamax-page-2"');
const p3Start = html.indexOf('id="diamax-page-3"');
const p2Content = html.substring(p2Start, p3Start);

console.log('Page 2 content length:', p2Content.length);
console.log('--- First 1500 chars of Page 2 ---');
console.log(p2Content.substring(0, 1500));
console.log('--- Last 1500 chars of Page 2 ---');
console.log(p2Content.substring(p2Content.length - 1500));
