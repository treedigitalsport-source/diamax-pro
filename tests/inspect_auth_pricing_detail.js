const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const pPricingIdx = html.indexOf('id="auth-panel-pricing"');
console.log(html.substring(pPricingIdx, pPricingIdx + 3500));
