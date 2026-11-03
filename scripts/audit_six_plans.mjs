import fs from 'fs';
import path from 'path';

const basePath = 'C:\\Users\\fitne\\Documents\\3Tree_Codebase\\DIAMAX';
const content = fs.readFileSync(path.join(basePath, 'index.html'), 'utf8');
const lines = content.split(/\r?\n/);

console.log('=== AUDITORÍA EXHAUSTIVA DE PLANES COMERCIALES EN DIAMAX PRO ===');

// Buscar bloques de planes en el DOM y en JavaScript
console.log('\n--- 1. BUSCANDO SELECTORES Y DEFINICIONES DE PLANES EN JS ---');
lines.forEach((l, i) => {
  if (l.includes('planSuscripcion') || l.includes('nombresPlanes') || l.includes('seleccionarPlan') || l.includes('TIERS') || l.includes('CATALOGO_PLANES') || l.includes('PLAN_') || l.includes('diamax-icon-tier-')) {
    if (l.length < 150) {
      console.log(`L${i+1}: ${l.trim()}`);
    }
  }
});

console.log('\n--- 2. BUSCANDO TODAS LAS TARJETAS DE PLANES CON SU PRECIO EN HTML ---');
lines.forEach((l, i) => {
  if (l.includes('p2-plan-card') || (l.includes('seleccionarPlanSuscripcion') && l.includes('<div')) || l.includes('PLAN 1:') || l.includes('PLAN 2:') || l.includes('PLAN 3:') || l.includes('PLAN 4:') || l.includes('PLAN 5:') || l.includes('PLAN 6:')) {
    console.log(`L${i+1}: ${l.trim().slice(0, 120)}`);
  }
});
