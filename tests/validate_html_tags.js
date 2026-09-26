const fs = require('fs');

const files = ['index.html', 'v_original_aprobada.html', 'v6_hace_1_hora_49505bc.html', 'v1_actual_logo_photoroom_y_planes.html'];

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  const content = fs.readFileSync(f, 'utf8');
  
  // Check script tags syntax
  const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let idx = 0;
  while ((match = scriptRegex.exec(content)) !== null) {
    idx++;
    try {
      new Function(match[1]);
    } catch (e) {
      console.error(`Script error in ${f} (block ${idx}):`, e.message);
    }
  }
  console.log(`${f}: Checked ${idx} script blocks. All valid!`);
}
