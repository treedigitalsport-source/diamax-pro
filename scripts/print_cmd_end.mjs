import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

const regIdx = html.indexOf('function registrarJugadaLive');
const sub = html.slice(regIdx, regIdx + 8000);

const cmdIdx = sub.indexOf("let cmdType = 'RECORD_HIT';");
console.log(sub.slice(cmdIdx + 1500, cmdIdx + 3000));
