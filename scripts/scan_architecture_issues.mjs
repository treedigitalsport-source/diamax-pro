import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.resolve(__dirname, '..', 'index.html');
const html = fs.readFileSync(indexPath, 'utf8');

console.log('=== AUDITORÍA PROFUNDA DE ARQUITECTURA, DISEÑO Y OPERATIVIDAD ===\n');

// 1. Análisis de Pestañas y Navegación
console.log('1. AUDITORÍA DE PESTAÑAS Y SISTEMAS DE NAVEGACIÓN:');
const navMatch = html.match(/<div\s+class="nav"\s+id="main-nav"[^>]*>([\s\S]*?)<\/div>/i);
if (navMatch) {
  const btns = [...navMatch[1].matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)];
  console.log(`  - Pestañas en barra principal (#main-nav): ${btns.length}`);
  btns.forEach((b, i) => {
    const id = (b[1].match(/id="([^"]+)"/) || [])[1];
    const dataTab = (b[1].match(/data-tab="([^"]+)"/) || [])[1];
    const label = b[2].replace(/<[^>]*>/g, '').trim();
    console.log(`    [${i+1}] ${label} -> id: ${id}, target: ${dataTab}`);
  });
}

// Comprobación de todas las secciones de contenido de pestañas
const tabContents = [...html.matchAll(/<div\s+id="(tab-[a-z0-9-]+)"[^>]*class="([^"]*)"/gi)];
console.log(`\n  - Contenedores de contenido de pestaña encontrados: ${tabContents.length}`);
tabContents.forEach(tc => {
  console.log(`    * Contenedor: id="${tc[1]}" (clases: "${tc[2]}")`);
});

// Comprobación de barras de navegación móviles
console.log('\n2. AUDITORÍA DE NAVEGACIÓN MÓVIL (BOTTOM NAV):');
const bnav1 = html.match(/<nav\s+class="diamax-bottom-nav"[^>]*>([\s\S]*?)<\/nav>/i);
const bnav2 = html.match(/<nav\s+id="mobile-bottom-nav"[^>]*>([\s\S]*?)<\/nav>/i);
if (bnav1) {
  const count = (bnav1[1].match(/<button/gi) || []).length;
  console.log(`  - Barra 1 (.diamax-bottom-nav): ${count} botones`);
}
if (bnav2) {
  const count = (bnav2[1].match(/<button/gi) || []).length;
  console.log(`  - Barra 2 (#mobile-bottom-nav): ${count} botones`);
}

// 3. Detección de IDs Duplicados
console.log('\n3. AUDITORÍA DE UNICIDAD DE IDs EN EL DOM:');
const idMatches = [...html.matchAll(/\bid="([^"]+)"/gi)].map(m => m[1]);
const idFreq = {};
idMatches.forEach(id => { idFreq[id] = (idFreq[id] || 0) + 1; });
const dups = Object.entries(idFreq).filter(([_, count]) => count > 1);
console.log(`  - Total de IDs únicos: ${Object.keys(idFreq).length}`);
console.log(`  - Total de IDs duplicados: ${dups.length}`);
dups.forEach(([id, count]) => {
  console.log(`    ⚠️ ID duplicado: "${id}" (${count} apariciones)`);
});

// 4. Verificación de Funciones de Render y Carga
console.log('\n4. VERIFICACIÓN DE FUNCIONES DE INTERFAZ Y EVENTOS:');
const funcsToCheck = [
  'switchTab',
  'activarModoRol',
  'registrarJugadaLive',
  'deshacerJugadaLive',
  'updateLiveBatterDisplay',
  'updateOutsLEDs',
  'toggleDaylightMode',
  'toggleModoLuzSolar',
  'renderAll',
  'exportarReportePDF',
  'exportarSpottingBoardPDF',
  'abrirModalNuevoJuego',
  'cerrarModalNuevoJuego',
  'abrirModalHotDugoutSub',
  'cerrarModalHotDugoutSub',
  'abrirModalSheetsSync',
  'cerrarModalSheetsSync',
  'abrirModalSalida',
  'cerrarModalSalida'
];

funcsToCheck.forEach(fn => {
  const present = html.includes(`function ${fn}`);
  console.log(`  ${present ? '✅' : '❌'} function ${fn}: ${present ? 'Presente' : 'FALTANTE'}`);
});

// 5. Verificación de Modales
console.log('\n5. AUDITORÍA DE MODALES DEL SISTEMA:');
const modals = [...html.matchAll(/<div\s+class="modal-overlay"\s+id="([^"]+)"/gi)].map(m => m[1]);
console.log(`  - Total de modales de superposición: ${modals.length}`);
modals.forEach(m => console.log(`    * Modal: id="${m}"`));

console.log('\n=== FIN DEL ESCANEO ESTRUCTURAL ===');
