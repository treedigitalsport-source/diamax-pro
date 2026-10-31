import fs from 'fs';

const html = fs.readFileSync('C:\\Users\\fitne\\Documents\\3Tree_Codebase\\DIAMAX\\index.html', 'utf-8');

const checks = [
  'getNombreNarradorCabina',
  'cambiarNombreNarradorCabina',
  'actualizarNombreNarradorEnUI',
  'id="cockpit-narrator-name"',
  'NARRADOR OFICIAL:'
];

let allOk = true;
for (const c of checks) {
  const found = html.includes(c);
  console.log(`[${found ? 'OK' : 'FAIL'}] ${c}`);
  if (!found) allOk = false;
}

if (allOk) {
  console.log('NARRATOR NAME CHECKS PASSED 100%!');
} else {
  console.error('CHECKS FAILED!');
  process.exit(1);
}
