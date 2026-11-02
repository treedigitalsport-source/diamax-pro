import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.resolve(__dirname, '..', 'index.html');
const html = fs.readFileSync(indexPath, 'utf8');

const report = {
  timestamp: new Date().toISOString(),
  metrics: {
    totalLines: html.split('\n').length,
    totalBytes: Buffer.byteLength(html, 'utf8'),
    scriptsCount: 0,
    stylesCount: 0,
    buttonsCount: 0,
    inputsCount: 0,
    modalsCount: 0,
    tabsCount: 0
  },
  tabsAnalysis: {},
  functionalAudits: {},
  designAudits: {},
  potentialIssues: []
};

// 1. Script & Style Blocks
report.metrics.scriptsCount = (html.match(/<script\b/gi) || []).length;
report.metrics.stylesCount = (html.match(/<style\b/gi) || []).length;
report.metrics.buttonsCount = (html.match(/<button\b/gi) || []).length;
report.metrics.inputsCount = (html.match(/<input\b/gi) || []).length;
report.metrics.modalsCount = (html.match(/class="modal-overlay"/gi) || []).length;

// 2. Tabs Analysis
const mainNavMatch = html.match(/<div\s+class="nav"\s+id="main-nav"[^>]*>([\s\S]*?)<\/div>/i);
if (mainNavMatch) {
  const btns = [...mainNavMatch[1].matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)];
  report.tabsAnalysis.mainNav = btns.map((b, idx) => {
    const attrs = b[1];
    const id = (attrs.match(/id="([^"]+)"/) || [])[1] || '';
    const dataTab = (attrs.match(/data-tab="([^"]+)"/) || [])[1] || '';
    const onclick = (attrs.match(/onclick="([^"]+)"/) || [])[1] || '';
    const label = b[2].replace(/<[^>]*>/g, '').trim();
    const hasIcon = b[2].includes('<svg');
    return { order: idx + 1, id, dataTab, onclick, label, hasIcon };
  });
}

// Mobile bottom nav tabs
const mobNavMatch = html.match(/<nav\s+id="mobile-bottom-nav"[^>]*>([\s\S]*?)<\/nav>/i);
if (mobNavMatch) {
  const btns = [...mobNavMatch[1].matchAll(/<button[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/button>/gi)];
  report.tabsAnalysis.mobileBottomNav = btns.map((b, idx) => ({
    order: idx + 1,
    id: b[1],
    label: b[2].replace(/<[^>]*>/g, '').trim(),
    onclick: (b[0].match(/onclick="([^"]+)"/) || [])[1] || ''
  }));
}

// Second mobile nav (diamax-bottom-nav)
const dBottomMatch = html.match(/<nav\s+class="diamax-bottom-nav"[^>]*>([\s\S]*?)<\/nav>/i);
if (dBottomMatch) {
  const btns = [...dBottomMatch[1].matchAll(/<button[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/button>/gi)];
  report.tabsAnalysis.diamaxBottomNav = btns.map((b, idx) => ({
    order: idx + 1,
    id: b[1],
    label: b[2].replace(/<[^>]*>/g, '').trim(),
    onclick: (b[0].match(/onclick="([^"]+)"/) || [])[1] || ''
  }));
}

// Content sections
const tabSections = [...html.matchAll(/<div\s+id="(tab-[a-z0-9-]+)"/gi)].map(m => m[1]);
report.tabsAnalysis.contentSections = tabSections;

// Check for orphaned tabs (button points to non-existent tab or tab has no button)
const declaredTabs = report.tabsAnalysis.mainNav ? report.tabsAnalysis.mainNav.map(t => t.dataTab) : [];
report.tabsAnalysis.orphanedSections = tabSections.filter(s => !declaredTabs.includes(s));

// 3. Functional Health Check
const coreFunctions = [
  'registrarJugadaLive',
  'deshacerJugadaLive',
  'cambiarInningManual',
  'ajustarCarrerasManual',
  'toggleBaseManual',
  'registrarPitcheoRapido',
  'activarModoRol',
  'toggleDrawer',
  'exportarReportePDF',
  'exportarSpottingBoardPDF',
  'toggleDaylightMode',
  'toggleModoLuzSolar',
  'switchTab',
  'applyLanguage',
  'abrirModalNuevoJuego',
  'abrirModalHotDugoutSub',
  'abrirModalSheetsSync'
];

report.functionalAudits.functionsPresent = {};
coreFunctions.forEach(fn => {
  report.functionalAudits.functionsPresent[fn] = html.includes(`function ${fn}`);
});

// 4. Checking for Duplicate IDs
const idMatches = [...html.matchAll(/\bid="([^"]+)"/gi)].map(m => m[1]);
const idFreq = {};
idMatches.forEach(id => {
  idFreq[id] = (idFreq[id] || 0) + 1;
});
const duplicates = Object.entries(idFreq).filter(([id, count]) => count > 1);
report.potentialIssues.push({
  type: 'DUPLICATE_IDS',
  count: duplicates.length,
  items: duplicates
});

// Output summary
console.log('=== AUDITORÍA FORENSE EJECUTADA ===');
console.log('Líneas:', report.metrics.totalLines, 'Bytes:', report.metrics.totalBytes);
console.log('Pestañas en #main-nav:', report.tabsAnalysis.mainNav.length);
console.log('Pestañas huérfanas o independientes:', report.tabsAnalysis.orphanedSections);
console.log('IDs duplicados encontrados:', duplicates.length);
if (duplicates.length > 0) {
  console.log('Primeros duplicados:', duplicates.slice(0, 10));
}

fs.writeFileSync(path.resolve(__dirname, '..', 'audit_deep_results.json'), JSON.stringify(report, null, 2), 'utf8');
