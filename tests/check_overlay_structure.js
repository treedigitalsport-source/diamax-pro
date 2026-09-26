const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const idx = html.indexOf('id="auth-modal-overlay"');
console.log('Index:', idx);
if (idx !== -1) {
  console.log(html.substring(idx - 150, idx + 800));
}
