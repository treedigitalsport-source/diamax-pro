const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const tPerfil = html.indexOf('id="tab-perfil"');
const sub = html.substring(tPerfil, tPerfil + 4000);
console.log('--- Substring from tab-perfil ---');
console.log(sub);
