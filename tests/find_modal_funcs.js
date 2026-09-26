const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('function abrirModalNuevoJuego') || l.includes('function cerrarModalNuevoJuego') || l.includes('modal-nuevo-juego')) {
    console.log(`${i + 1}: ${l.trim().substring(0, 100)}`);
  }
});
