const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const sections = [
  { name: 'PÁGINA 1 - HEADER SUPERIOR', regex: /<!-- 1\. Header Superior[\s\S]*?<!-- 2\. Hero Center/ },
  { name: 'PÁGINA 1 - HERO CENTER', regex: /<!-- 2\. Hero Center[\s\S]*?<!-- 3\. Botones/ },
  { name: 'PÁGINA 2 - HEADER', regex: /<!-- 📋 PÁGINA 2[\s\S]*?(?:<!-- Modal|<!-- Tarjetas|id="planes-grid")/ },
  { name: 'PÁGINA 3 - HEADER PRINCIPAL DUGOUT', regex: /<!-- 🏟️ PÁGINA 3[\s\S]*?(?:<!-- Marcador|id="scoreboard")/ },
  { name: 'AUTH MODAL - HEADER', regex: /id="auth-modal"[\s\S]*?(?:id="auth-form"|<form)/ },
  { name: 'MASTER KEY MODAL - HEADER', regex: /id="modal-acceso-clave-ceo"[\s\S]*?(?:<input|<form)/ },
  { name: 'TAB 2 - LINEUP BUILDER HEADER', regex: /id="tab-lineup"[\s\S]*?(?:<table|<div class="lineup)/ },
  { name: 'TAB 3 - VER CAMPO SPRAY CHART HEADER', regex: /id="tab-campo"[\s\S]*?(?:<svg|<canvas)/ },
  { name: 'TAB 4 - MANUAL DE USO HEADER', regex: /id="tab-manual"[\s\S]*?(?:<div class="manual|<p)/ },
  { name: 'TAB 5 - TARJETA OFICIAL HEADER', regex: /id="tab-tarjeta-oficial"[\s\S]*?(?:<table|<div)/ },
  { name: 'TAB 6 - DASHBOARD ESTADÍSTICAS HEADER', regex: /id="tab-dashboard"[\s\S]*?(?:<div class="dash|<table)/ },
  { name: 'TAB 7 - AGENTE IA SABERMÉTRICO HEADER', regex: /id="tab-skills"[\s\S]*?(?:<div class="ai|<div class="chat)/ },
  { name: 'TAB 8 - PERFIL Y SEDE HEADER', regex: /id="tab-perfil"[\s\S]*?(?:<form|<div)/ }
];

console.log('========================================================================');
console.log('🔍 AUDITORÍA INTEGRAL DE LOGOS, ISOTIPOS Y NOMBRES EN TODA LA APP');
console.log('========================================================================\n');

sections.forEach(sec => {
  const match = html.match(sec.regex);
  console.log(`📌 [${sec.name}]`);
  if (match) {
    const text = match[0];
    // extract logos, svgs, images and titles
    const imgs = (text.match(/<img[^>]+>/g) || []).join(' | ');
    const svgs = (text.match(/<svg[^>]*>[\s\S]*?<\/svg>/g) || []).map(s => s.replace(/\s+/g, ' ').substring(0, 100)).join(' | ');
    const titles = (text.match(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/g) || []).map(t => t.replace(/<[^>]+>/g, '').trim()).join(' | ');
    const brandTexts = (text.match(/DIAMAX[^\n<]*/g) || []).join(' | ');
    
    console.log(`  - Imágenes: ${imgs || 'Ninguna'}`);
    console.log(`  - Isotipos SVG: ${svgs ? svgs.substring(0, 150) + '...' : 'Ninguno'}`);
    console.log(`  - Textos de Marca: ${brandTexts || 'Ninguno'}`);
    console.log(`  - Titulares: ${titles || 'Ninguno'}`);
    console.log('------------------------------------------------------------------------');
  } else {
    console.log('  ⚠️ Sección no detectada con la expresión regular.');
    console.log('------------------------------------------------------------------------');
  }
});
