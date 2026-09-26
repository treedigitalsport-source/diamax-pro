const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const p1BtnPlansIdx = html.indexOf('id="p1-btn-plans"');
const barSecIdx = html.indexOf('id="p1-btn-ceo-key"');
console.log(html.substring(p1BtnPlansIdx - 200, barSecIdx + 1200));
