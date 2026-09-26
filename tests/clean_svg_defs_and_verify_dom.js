// ═══════════════════════════════════════════════════════════════════════════
// 💎 DIAMAX PRO — COMPLETE SVG SANITIZER & DOM RESTORATION
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

function sanitizeFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  console.log(`Sanitizing SVG in: ${path.basename(filePath)}...`);

  // Target the leftover unclosed symbol paths
  const leftoverBlock = `  </defs>
  </defs>
      <!-- Shield Outer Contour -->
      <path d="M12 2.5L4 6.2V11.5C4 16.5 7.4 21.1 12 22.3C16.6 21.1 20 16.5 20 11.5V6.2L12 2.5Z" stroke="url(#diamax-grad-key-shield)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="rgba(0, 210, 255, 0.05)"/>
      <!-- Inner Security Key Vector -->
      <circle cx="10" cy="10" r="3" stroke="url(#diamax-grad-key-gold)" stroke-width="1.8" fill="rgba(255, 199, 44, 0.12)"/>
      <circle cx="10" cy="10" r="1.1" fill="url(#diamax-grad-key-gold)"/>
      <path d="M12.2 12.2L16.8 16.8M15 15L16.2 13.8M16.5 16.5L17.7 15.3" stroke="url(#diamax-grad-key-gold)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="17.2" cy="7.2" r="0.9" fill="#00D2FF"/>
    </symbol>
  </defs>`;

  if (code.includes(leftoverBlock)) {
    code = code.replace(leftoverBlock, '  </defs>');
    console.log('✅ Cleaned leftover SVG block');
  }

  // Double check any nested defs near skeuo
  code = code.replace(
    '<!-- ══════════════════════════════════════════════════════════════════════ -->\n  <!-- 💎 SKEUOMORPHIC 3D METALLIC & LIQUID GLASS ICON SUITE (DIAMAX PRO)    -->\n  <!-- ══════════════════════════════════════════════════════════════════════ -->\n  <defs>',
    '<!-- ══════════════════════════════════════════════════════════════════════ -->\n  <!-- 💎 SKEUOMORPHIC 3D METALLIC & LIQUID GLASS ICON SUITE (DIAMAX PRO)    -->\n  <!-- ══════════════════════════════════════════════════════════════════════ -->'
  );

  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Saved: ${path.basename(filePath)} (${code.length} bytes)`);
}

targetFiles.forEach(sanitizeFile);
console.log('✨ All files sanitized!');
