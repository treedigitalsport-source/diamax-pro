const fs = require('fs');

const files = ['index.html', 'v5_dugout_emergente_ph_blindado.html', 'v10_iconos_vectoriales_4b5addd.html', 'v_original_aprobada.html'];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  const html = fs.readFileSync(f, 'utf8');
  console.log(`\n=== File: ${f} ===`);
  const idx = html.indexOf('panel-36-plays');
  console.log('Contains panel-36-plays:', idx !== -1, 'at index:', idx);
  const hits36 = html.indexOf('36 jugadas');
  console.log('Contains text 36 jugadas:', hits36 !== -1, 'at index:', hits36);
  if (idx !== -1) {
    console.log('Snippet around panel-36-plays:');
    console.log(html.substring(idx - 100, idx + 800));
  }
});
