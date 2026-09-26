const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const navLineupIdx = html.indexOf('id="nav-lineup"');
const btnViewFieldIdx = html.indexOf('id="btn-view-field"');

console.log('nav-lineup snippet:');
if (navLineupIdx !== -1) {
  console.log(html.substring(navLineupIdx - 150, navLineupIdx + 350));
}

console.log('\nbtn-view-field snippet:');
if (btnViewFieldIdx !== -1) {
  console.log(html.substring(btnViewFieldIdx - 150, btnViewFieldIdx + 350));
}

// Let's also check function mostrarTab and irAPagina
const mostrarTabIdx = html.indexOf('function mostrarTab(');
if (mostrarTabIdx !== -1) {
  console.log('\nmostrarTab function snippet:');
  console.log(html.substring(mostrarTabIdx, mostrarTabIdx + 1200));
}

// Check if there is switchTab
const switchTabIdx = html.indexOf('function switchTab(');
if (switchTabIdx !== -1) {
  console.log('\nswitchTab function snippet:');
  console.log(html.substring(switchTabIdx, switchTabIdx + 1200));
}
