import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

const regIdx = html.indexOf('function registrarJugadaLive');
const sub = html.slice(regIdx, regIdx + 4500);

const csIdx = sub.indexOf("action === 'CS'");
console.log(sub.slice(csIdx, csIdx + 500));
