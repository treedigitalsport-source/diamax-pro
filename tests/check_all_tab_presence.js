const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const tabs = ['tab-envivo', 'tab-lineup', 'tab-campo', 'tab-manual', 'tab-tarjeta-oficial', 'tab-dashboard', 'tab-skills', 'tab-perfil'];
tabs.forEach(t => {
  console.log(`Tab ${t}: exists = ${html.includes(`id="${t}"`)}`);
});

const p36 = html.includes('id="panel-36-plays"');
console.log(`id="panel-36-plays": exists = ${p36}`);
