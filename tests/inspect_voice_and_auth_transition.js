const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const overlayIdx = html.indexOf('id="auth-modal-overlay"');
console.log('--- 600 chars before auth-modal-overlay ---');
console.log(html.substring(overlayIdx - 600, overlayIdx));
