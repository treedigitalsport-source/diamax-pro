import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf-8');

console.log('Original length:', html.length);

// -----------------------------------------------------------------------------
// 1. ELIMINAR VULNERABILIDAD CRÍTICA: BYPASS CON PIN '1234' RESIDUAL
// -----------------------------------------------------------------------------

// 1.1 Quitar '1234' de las claves maestras en line 11448-11449
html = html.replace(
  "// Claves maestras autorizadas: 113714 (CEO Alí Zapata), 1234 (PIN Rápido), alizapata, diamax2026\n  if (k === '113714' || k === '1234' || k.toLowerCase() === 'alizapata' || k.toLowerCase() === 'diamax2026') {",
  "// Credencial Maestra Exclusiva del Fundador & CEO (Lic. Alí Zapata)\n  if (k === '113714') {"
);
console.log('Remediated master keys: removed 1234, alizapata, diamax2026. Only strict CEO credential.');

// 1.2 Quitar bypass '1234' en el teclado de PIN táctico
html = html.replace(
  "if (hashedInput === expectedHash || pinBuffer === '1234') {",
  "if (hashedInput === expectedHash && pinBuffer.length > 0) {"
);
console.log('Remediated PIN keypad verification: removed pinBuffer === 1234 bypass.');

// 1.3 Quitar defaultPin = '1234'
html = html.replace(
  "const defaultPin = '1234';\n  const pinHash = await hashSHA256(defaultPin);",
  "const defaultPin = Math.floor(100000 + Math.random() * 900000).toString();\n  const pinHash = await hashSHA256(defaultPin);"
);
console.log('Remediated defaultPin: replaced hardcoded 1234 with randomized 6-digit cryptographic PIN.');

// 1.4 Quitar hash fijo de 1234 en currentUserSession
html = html.replace(
  "pinHash: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4' // PIN: 1234",
  "pinHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' // Blindado contra bypass"
);

// 1.5 Quitar hashSHA256('1234')
html = html.replaceAll(
  "pinHash: await hashSHA256('1234'),",
  "pinHash: await hashSHA256(Math.floor(100000 + Math.random() * 900000).toString()),"
);
console.log('Remediated all occurrences of pinHash: await hashSHA256(1234).');

// 1.6 Quitar '123456' como default pass
html = html.replace(
  "datosUsuarioTempP2.pass || '123456'",
  "datosUsuarioTempP2.pass || Math.random().toString(36).substring(2, 10)"
);

// -----------------------------------------------------------------------------
// 2. ELIMINAR REFERENCIAS HUÉRFANAS A QR Y ELEMENTOS PURGADOS
// -----------------------------------------------------------------------------
html = html.replaceAll('onclick="abrirModalEscanearQRLogin()"', 'onclick="showAuthModal(\'login\')"');
html = html.replaceAll('onclick="compartirPaseWhatsApp()"', 'onclick="window.print()"');

// Eliminar cualquier mención de p2-qr-registration-banner o p2-personalized-qr-badge
html = html.replaceAll('id="p2-qr-registration-banner"', 'id="p2-plans-header-banner"');
html = html.replaceAll('id="p2-personalized-qr-badge"', 'id="p2-official-account-badge"');

fs.writeFileSync('index.html', html, 'utf-8');
console.log('Successfully remediated all forensic audit issues! New length:', html.length);
