const fs = require('fs');

let code = fs.readFileSync('tests/forensic_audit_all_devices_and_buttons.js', 'utf8');

// Update audit check for buttons
code = code.replace(
  `testPass('Botón Registro & Franquicia (#p1-btn-register)', html.includes('id="p1-btn-register"'));`,
  `// Registro Gratuito eliminado de Portada por orden expresa del CEO Alí Zapata\n  testPass('Botón 6 Planes Oficiales (#p1-btn-plans)', html.includes('id="p1-btn-plans"'));`
);

fs.writeFileSync('tests/forensic_audit_all_devices_and_buttons.js', code, 'utf8');
console.log('Successfully updated forensic test suite!');
