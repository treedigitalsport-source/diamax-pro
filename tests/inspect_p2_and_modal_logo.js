const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// Check the exact logo markup in Page 2 and in the Plans section/modal
const p2Start = html.indexOf('id="diamax-page-2"');
console.log('--- PAGE 2 LOGO MARKUP ---');
console.log(html.substring(p2Start, p2Start + 1800));

const authModalStart = html.indexOf('id="auth-modal-overlay"');
console.log('--- AUTH / PLANS MODAL LOGO MARKUP ---');
console.log(html.substring(authModalStart, authModalStart + 1800));
