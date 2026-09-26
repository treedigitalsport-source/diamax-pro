const fs = require('fs');

const files = ['index.html', 'v5_dugout_emergente_ph_blindado.html', 'v10_iconos_vectoriales_4b5addd.html', 'v7_vercel_origin_main_puro.html'];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  const html = fs.readFileSync(f, 'utf8');
  console.log(`\n=== File: ${f} ===`);
  const idx = html.indexOf('id="panel-36-plays"');
  console.log('id="panel-36-plays" index:', idx);
  if (idx !== -1) {
    console.log(html.substring(idx - 50, idx + 1500));
  }
});
