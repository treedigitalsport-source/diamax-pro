import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

const regIdx = html.indexOf('function registrarJugadaLive');
const sub = html.slice(regIdx, regIdx + 4500);

const startIdx = sub.indexOf("let cmdType = 'RECORD_HIT';");
const endIdx = sub.indexOf("try {", startIdx);

console.log(sub.slice(endIdx - 500, endIdx + 200));
