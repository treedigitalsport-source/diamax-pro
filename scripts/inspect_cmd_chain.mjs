import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

const regIdx = html.indexOf('function registrarJugadaLive');
const sub = html.slice(regIdx, regIdx + 4000);

const startIdx = sub.indexOf("let cmdType = 'RECORD_HIT';");
const endIdx = sub.indexOf("try {", startIdx);

console.log('--- Current cmdType / payload chain ---');
console.log(sub.slice(startIdx, endIdx));
