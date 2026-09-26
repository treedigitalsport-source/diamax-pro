const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const pricingIdx = html.indexOf('id="modal-tab-pricing"');
const registerIdx = html.indexOf('id="modal-tab-register"');
const loginIdx = html.indexOf('id="modal-tab-login"');

console.log('--- MODAL PRICING HTML ---');
console.log(html.substring(pricingIdx, registerIdx));

console.log('--- MODAL REGISTER HTML ---');
console.log(html.substring(registerIdx, loginIdx));
