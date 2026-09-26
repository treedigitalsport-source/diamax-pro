const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const pModalLoginIdx = html.indexOf('id="auth-panel-login"');
console.log('--- MODAL LOGIN PANEL FOOTER ---');
console.log(html.substring(pModalLoginIdx, pModalLoginIdx + 1600));

const p2LoginIdx = html.indexOf('id="p2-sub-login"');
console.log('--- PAGE 2 LOGIN PANEL FOOTER ---');
console.log(html.substring(p2LoginIdx, p2LoginIdx + 1600));
