const fs = require('fs');

const targetFiles = [
  'index.html',
  'v_original_aprobada.html',
  'v6_hace_1_hora_49505bc.html',
  'v1_actual_logo_photoroom_y_planes.html'
];

targetFiles.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/irAPagina\(3\);\s*\}, 700\);\s*\}/g, 'irAPagina(3);\n}');
  fs.writeFileSync(f, content, 'utf8');
  console.log(`Cleaned syntax in ${f}`);
});
