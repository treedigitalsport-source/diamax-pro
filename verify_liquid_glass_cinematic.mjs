import fs from 'fs';

console.log('🧪 VERIFICACIÓN DEL SISTEMA DE VIDRIO LÍQUIDO ESMERILADO Y TIPOGRAFÍA CINEMATOGRÁFICA\n');

const html = fs.readFileSync('index.html', 'utf8');

const tests = [
  {
    name: 'Fondos oscuros profundos (#0A0D14 / #030712)',
    test: html.includes('#0A0D14') && html.includes('#030712')
  },
  {
    name: 'Tarjetas traslúcidas de Vidrio Líquido Esmerilado (rgba(18, 24, 38, 0.7) + blur(20px))',
    test: html.includes('rgba(18, 24, 38, 0.7)') && html.includes('backdrop-filter: blur(20px)') && html.includes('border: 1px solid rgba(255, 255, 255, 0.08)')
  },
  {
    name: 'Tipografía cinematográfica moderna (Plus Jakarta Sans / SF Pro Display)',
    test: html.includes('Plus Jakarta Sans') && html.includes('SF Pro Display')
  },
  {
    name: 'Alineación de números monoespaciados (tabular-nums / tnum)',
    test: html.includes('tabular-nums') && html.includes('"tnum"')
  },
  {
    name: 'Etiquetas cinematográficas (10px, 800, tracking 1.5px, uppercase, #64748B)',
    test: html.includes('letter-spacing: 1.5px') && html.includes('text-transform: uppercase') && html.includes('#64748B')
  },
  {
    name: 'Bloques de Dugout adaptados a Vidrio Líquido Esmerilado',
    test: html.includes('.dugout-block-scoreboard') && html.includes('.dugout-block-duel') && html.includes('.dugout-block-actions')
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
  console.log('\n🏆 SISTEMA DE VIDRIO LÍQUIDO ESMERILADO Y TIPOGRAFÍA CINEMATOGRÁFICA 100% VERIFICADO!');
} else {
  console.error(`\n❌ FALLARON ${failed} VERIFICACIONES`);
  process.exit(1);
}
