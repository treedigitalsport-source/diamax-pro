const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const fn1Idx = html.indexOf('function seleccionarPlanSuscripcion');
const fn2Idx = html.indexOf('function seleccionarPlanP2');

console.log('--- seleccionarPlanSuscripcion ---');
console.log(html.substring(fn1Idx, fn1Idx + 1200));

console.log('--- seleccionarPlanP2 ---');
console.log(html.substring(fn2Idx, fn2Idx + 1200));
