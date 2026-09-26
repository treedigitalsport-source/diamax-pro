const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const patterns = [
  'diamax-page-1',
  'diamax-page-2',
  'network-status-badge',
  'btn-ai-agent',
  'auth-modal',
  'modal-master-pin',
  'acceso-clave-ceo'
];

patterns.forEach(p => {
  const idx = html.indexOf(p);
  console.log(`Pattern '${p}' at index: ${idx}`);
  if (idx !== -1) {
    console.log(html.substring(Math.max(0, idx - 100), Math.min(html.length, idx + 600)));
    console.log('----------------------------------------------------');
  }
});
