const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

function printSnippet(name, startPattern, length = 1500) {
  const idx = html.indexOf(startPattern);
  console.log(`========================================`);
  console.log(`📌 ${name} (Index: ${idx})`);
  console.log(`========================================`);
  if (idx !== -1) {
    console.log(html.substring(idx, idx + length));
  } else {
    console.log('Pattern not found');
  }
}

printSnippet('PÁGINA 1 HEADER', 'id="diamax-page-1"', 1000);
printSnippet('PÁGINA 2 HEADER', 'id="diamax-page-2"', 1200);
printSnippet('PÁGINA 3 HEADER / DUGOUT HEADER', 'id="pantalla-anotador"', 1200);
printSnippet('AUTH MODAL HEADER', 'id="auth-modal"', 1000);
printSnippet('CLAVE CEO MODAL HEADER', 'id="modal-acceso-clave-ceo"', 1000);
