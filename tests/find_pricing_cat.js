const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('id="reg-category"') || l.includes('name="category"') || l.includes('Super Máster Leyendas') || l.includes('nombresPlanes') || l.includes('DIAMAX TEAM ($')) {
    console.log(`${i + 1}: ${l.trim().substring(0, 100)}`);
  }
});
