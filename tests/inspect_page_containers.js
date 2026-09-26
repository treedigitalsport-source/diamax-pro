const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const pages = ['diamax-page-1', 'diamax-page-2', 'diamax-page-3'];
pages.forEach(p => {
  const idx = html.indexOf(`id="${p}"`);
  console.log(`Page ${p} found at character index:`, idx);
});

const overlayIdx = html.indexOf('id="auth-modal-overlay"');
console.log('auth-modal-overlay found at character index:', overlayIdx);
