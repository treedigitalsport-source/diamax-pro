const fs = require('fs');
const files = ['v_original_aprobada.html', 'v6_hace_1_hora_49505bc.html', 'v1_actual_logo_photoroom_y_planes.html'];

files.forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  let idx = 0;
  while ((idx = html.indexOf('toggleBaseManual', idx + 1)) !== -1) {
    console.log(`In ${f} at char ${idx}:`);
    console.log(html.substring(idx - 200, idx + 400));
    break;
  }
});
