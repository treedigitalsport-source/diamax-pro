const fs = require('fs');

const v6 = fs.readFileSync('v6_hace_1_hora_49505bc.html', 'utf8');
const idx = fs.readFileSync('index.html', 'utf8');

console.log('v6 has diamax-home-plate-symbol:', v6.includes('id="diamax-home-plate-symbol"'));
console.log('index.html has diamax-home-plate-symbol:', idx.includes('id="diamax-home-plate-symbol"'));
console.log('v6 has diamax-cinema-brand-title:', v6.includes('diamax-cinema-brand-title'));
console.log('index.html has diamax-cinema-brand-title:', idx.includes('diamax-cinema-brand-title'));
