const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const pPricingIdx = html.indexOf('id="auth-panel-pricing"');
const pRegisterIdx = html.indexOf('id="auth-panel-register"');
const pLoginIdx = html.indexOf('id="auth-panel-login"');

console.log('--- AUTH PANEL PRICING ---');
console.log(html.substring(pPricingIdx, pRegisterIdx));

console.log('--- AUTH PANEL REGISTER ---');
console.log(html.substring(pRegisterIdx, pLoginIdx));
