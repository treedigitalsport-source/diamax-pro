const fs = require('fs');
const v5 = fs.readFileSync('v5_dugout_emergente_ph_blindado.html', 'utf8');

const tEnvivo = v5.indexOf('id="tab-envivo"');
const tLineup = v5.indexOf('id="tab-lineup"');
const tCampo = v5.indexOf('id="tab-campo"');
const tManual = v5.indexOf('id="tab-manual"');

console.log('v5 tab positions:', { tEnvivo, tLineup, tCampo, tManual });

const envivoSection = v5.substring(tEnvivo - 5, tLineup);
const lineupSection = v5.substring(tLineup - 5, tCampo);
const campoSection = v5.substring(tCampo - 5, tManual);

console.log('envivoSection includes panel-36-plays:', envivoSection.includes('id="panel-36-plays"'));
console.log('lineupSection length:', lineupSection.length);
console.log('campoSection length:', campoSection.length);
