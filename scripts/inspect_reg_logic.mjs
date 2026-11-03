import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

const regIdx = html.indexOf('function registrarJugadaLive');
const sub = html.slice(regIdx, regIdx + 4500);

// Find where if (action === '1B' starts
const ifIdx = sub.indexOf("if (action === '1B'");
console.log('if block in registrarJugadaLive:');
console.log(sub.slice(ifIdx, ifIdx + 2500));
