const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const overlayIdx = html.indexOf('id="auth-modal-overlay"');
const tabsIdx = html.indexOf('switchAuthTab', overlayIdx);
console.log(html.substring(tabsIdx - 200, tabsIdx + 2000));
