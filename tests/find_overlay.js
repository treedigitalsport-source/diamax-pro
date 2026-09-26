const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const overlayIdx = html.indexOf('id="auth-modal-overlay"');
console.log('auth-modal-overlay at:', overlayIdx);
if (overlayIdx !== -1) {
  console.log(html.substring(overlayIdx - 100, overlayIdx + 3000));
}
