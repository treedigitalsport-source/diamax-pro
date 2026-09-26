const fs = require('fs');
const v5 = fs.readFileSync('v5_dugout_emergente_ph_blindado.html', 'utf8');

const p36Idx = v5.indexOf('id="panel-36-plays"');
console.log('--- 800 chars before panel-36-plays in v5 ---');
console.log(v5.substring(p36Idx - 800, p36Idx));
