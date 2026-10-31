import fs from 'fs';

console.log('🧪 VERIFICACIÓN DEL PLAN QUIRÚRGICO DE DESINTOXICACIÓN DIAMAX PRO\n');

const html = fs.readFileSync('index.html', 'utf8');

const tests = [
  // Paso 1: Regla de los 3 Bloques
  {
    name: 'Paso 1: Bloque 1 (Marcador Limpio) presente',
    test: html.includes('id="dugout-block-scoreboard"') && html.includes('id="scoreboard-inn"') && html.includes('id="score-away"') && html.includes('id="score-home"') && html.includes('id="count-balls-val"') && html.includes('id="count-strikes-val"')
  },
  {
    name: 'Paso 1: Bloque 2 (Duelo Activo) presente con Bateador vs Lanzador y conteo de pitcheos',
    test: html.includes('id="dugout-block-duel"') && html.includes('id="current-batter-name"') && html.includes('id="current-batter-photo"') && html.includes('id="pitcher-active-name"') && html.includes('id="pitcher-total-count"')
  },
  {
    name: 'Paso 1: Bloque 3 (Botonera Inmediata) con 5 botones grandes (Strike, Bola, Hit, Out, Deshacer)',
    test: html.includes('id="dugout-block-actions"') && html.includes('id="btn-action-strike"') && html.includes('id="btn-action-ball"') && html.includes('id="btn-action-hit"') && html.includes('id="btn-action-out"') && html.includes('id="btn-undo-scoreboard"')
  },
  // Paso 2: Cajones colapsables (Drawers)
  {
    name: 'Paso 2: IA Táctica en cajón colapsable (drawer-ai-tactical)',
    test: html.includes('id="drawer-ai-tactical"') && html.includes('id="body-drawer-ai-tactical"') && html.includes('function toggleDrawer')
  },
  {
    name: 'Paso 2: Bullpen y tipos de pitcheo en cajón colapsable (drawer-bullpen-tracker)',
    test: html.includes('id="drawer-bullpen-tracker"') && html.includes('id="body-drawer-bullpen-tracker"')
  },
  // Paso 3: Paleta sobria
  {
    name: 'Paso 3: Fondo pizarra sobrio #0B0F19 y acento azul #2563EB / #0284C7',
    test: html.includes('background:#0B0F19') && (html.includes('#2563EB') || html.includes('#0284C7'))
  },
  // Paso 4: Separación de Vistas por Rol
  {
    name: 'Paso 4: Selector Maestro de Modos por Rol (Anotador vs Mánager vs Narrador)',
    test: html.includes('id="diamax-role-mode-selector"') && html.includes('id="role-mode-anotador"') && html.includes('id="role-mode-manager"') && html.includes('id="role-mode-narrador"') && html.includes('function activarModoRol')
  }
];

let failed = 0;
tests.forEach((t, i) => {
  if (t.test) {
    console.log(`[CHECK ${i + 1}] PASS ✅ : ${t.name}`);
  } else {
    console.error(`[CHECK ${i + 1}] FAIL ❌ : ${t.name}`);
    failed++;
  }
});

if (failed === 0) {
  console.log('\n🏆 TODOS LOS PUNTOS DEL PLAN QUIRÚRGICO DE DESINTOXICACIÓN VERIFICADOS AL 100%!');
} else {
  console.error(`\n❌ FALLARON ${failed} VERIFICACIONES`);
  process.exit(1);
}
