const fs = require('fs');
const html = fs.readFileSync('v_original_aprobada.html', 'utf8');

const idx = html.indexOf('lbl-diamond-caption');
console.log(html.substring(idx - 400, idx + 1500));
