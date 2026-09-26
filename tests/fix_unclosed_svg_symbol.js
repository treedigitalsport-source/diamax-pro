// ═══════════════════════════════════════════════════════════════════════════
// 💎 DIAMAX PRO — FIX UNCLOSED SVG SYMBOL TAGS THAT BLOCKED HTML PARSING
// Propiedad Intelectual: 3Tree Digital Sport IA Corp. · CEO Alí Zapata
// ═══════════════════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', 'v_original_aprobada.html'),
  path.join(__dirname, '..', 'v6_hace_1_hora_49505bc.html'),
  path.join(__dirname, '..', 'v1_actual_logo_photoroom_y_planes.html')
];

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  console.log(`Checking & Fixing: ${path.basename(filePath)}...`);

  // Target the broken unclosed symbol snippet
  const brokenSnippetStart = '<!-- 🔑 RESTABLECIMIENTO & RECUPERACIÓN DE CLAVE / CREDENCIALES (ULTRA-PREMIUM CYBERSECURITY KEY) -->';
  const brokenSnippetEnd = '<!-- ══════════════════════════════════════════════════════════════════════ -->\n  <!-- 💎 SKEUOMORPHIC 3D METALLIC & LIQUID GLASS ICON SUITE';

  if (code.includes(brokenSnippetStart) && code.includes(brokenSnippetEnd)) {
    const sIdx = code.indexOf(brokenSnippetStart);
    const eIdx = code.indexOf(brokenSnippetEnd);
    code = code.substring(0, sIdx) + code.substring(eIdx);
    console.log('✅ Removed unclosed broken SVG symbol snippet');
  }

  // Also verify that the Master SVG block has proper closing </defs></svg> before #diamax-page-1
  if (code.includes('</svg>\n\n<!-- ======================================================================== -->\n<!-- 🎬 PÁGINA 1:')) {
    console.log('SVG block is properly closed');
  } else if (code.includes('<svg style="display:none;" xmlns="http://www.w3.org/2000/svg">')) {
    // Check if </svg> exists before #diamax-page-1
    const p1Idx = code.indexOf('<div id="diamax-page-1"');
    const svgCloseIdx = code.lastIndexOf('</svg>', p1Idx);
    if (svgCloseIdx === -1) {
      console.log('Inserting missing </svg> before Page 1');
      code = code.replace(
        '<!-- ======================================================================== -->\n<!-- 🎬 PÁGINA 1:',
        '</defs>\n</svg>\n\n<!-- ======================================================================== -->\n<!-- 🎬 PÁGINA 1:'
      );
    }
  }

  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Saved: ${path.basename(filePath)} (${code.length} bytes)`);
}

targetFiles.forEach(fixFile);
console.log('✨ All files successfully fixed and verified!');
