const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const funcs = [
  'abrirModalNuevoJuego',
  'iniciarJuegoOficialPreJuego',
  'iniciarJuegoDesdeModal',
  'guardarPreJuego',
  'iniciarPartido',
  'ejecutarRegistroOficial',
  'procesarLoginP2',
  'DIAMAX_LINEUP_STATE',
  'GAME_STATE'
];

funcs.forEach(fn => {
  const idx = html.indexOf(fn);
  if (idx !== -1) {
    console.log(`Found ${fn} at line ~${html.substring(0, idx).split('\n').length}`);
  } else {
    console.log(`Not found: ${fn}`);
  }
});
