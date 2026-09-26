const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const tabs = ['tab-envivo', 'tab-manual', 'tab-tarjeta-oficial', 'tab-dashboard', 'tab-skills', 'tab-perfil'];
tabs.forEach(t => {
  const idx = html.indexOf(`id="${t}"`);
  console.log(`Tab ${t} opens at:`, idx);
});
