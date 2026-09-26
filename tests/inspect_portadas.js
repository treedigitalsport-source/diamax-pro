const fs = require('fs');

const files = [
  'v6_hace_1_hora_49505bc.html',
  'v1_actual_logo_photoroom_y_planes.html',
  'v4_portada_3_botones_clasicos.html',
  'v8_hace_5_dias_b11a759.html',
  'v9_clasica_logo_photoroom_ec497e5.html'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    const html = fs.readFileSync(file, 'utf8');
    const p1Idx = html.indexOf('id="pagina-1"');
    const p2Idx = html.indexOf('id="pagina-2"');
    console.log(`==================== ${file} ====================`);
    if (p1Idx !== -1 && p2Idx !== -1) {
      console.log(html.substring(p1Idx - 50, p2Idx));
    } else {
      console.log('Not found between pagina-1 and pagina-2');
    }
  }
}
