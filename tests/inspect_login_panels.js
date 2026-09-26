const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const pLoginModalIdx = html.indexOf('id="auth-panel-login"');
const pLoginP2Idx = html.indexOf('id="p2-sub-login"');

console.log('--- MODAL LOGIN PANEL ---');
console.log(html.substring(pLoginModalIdx, pLoginModalIdx + 2000));

console.log('--- PAGE 2 LOGIN PANEL ---');
console.log(html.substring(pLoginP2Idx, pLoginP2Idx + 1500));
