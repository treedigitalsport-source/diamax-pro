// ═══════════════════════════════════════════════════════════════════════════
// 💎 DIAMAX PRO — UNIFIED LIQUID GLASS THEME & COMPREHENSIVE BUTTON ENGINE
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

// Unified Liquid Glass CSS block to inject/update
const UNIFIED_LIQUID_GLASS_CSS = `
/* ========================================================================== */
/* 💎 DIAMAX PRO — MASTER UNIFIED LIQUID GLASS & LOW-NOISE SYSTEM v5.0       */
/* ========================================================================== */

:root {
  --lg-bg: linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%), rgba(7, 14, 30, 0.78);
  --lg-border: 1px solid rgba(255, 255, 255, 0.14);
  --lg-border-cyan: 1px solid rgba(0, 210, 255, 0.35);
  --lg-border-gold: 1px solid rgba(255, 199, 44, 0.35);
  --lg-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.28), inset 0 -1px 0 rgba(0, 0, 0, 0.4), 0 16px 40px rgba(0, 0, 0, 0.55);
  --lg-blur: blur(24px) saturate(190%);
}

/* Master Liquid Glass Surface Containers */
.header,
.game-ribbon,
.game-live-header-bar,
.live-action-banner,
.ai-tactical-card,
.pitch-tracker-card,
.panel,
.scoreboard,
.modal-card,
#main-nav.nav,
#auth-modal-overlay > div,
#p2-stepper-container,
#p2-wizard-paso-1 > div,
#p2-wizard-paso-2 > div,
#p2-wizard-paso-3 > div,
#p2-wizard-paso-4 > div,
#p2-wizard-paso-5 > div {
  background: var(--lg-bg) !important;
  backdrop-filter: var(--lg-blur) !important;
  -webkit-backdrop-filter: var(--lg-blur) !important;
  border: var(--lg-border) !important;
  box-shadow: var(--lg-shadow) !important;
  border-radius: 18px !important;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

/* Header & Ribbon Unified Controls */
.btn-lang,
.btn-settings,
.btn-new-game,
#btn-daylight,
#btn-ai-agent,
#btn-refresh-db,
#btn-header-exit,
#btn-ribbon-home,
#btn-ribbon-away,
#btn-config-game-header,
.btn-finish-game,
.btn-ai-quick,
.pitch-type-btn,
.lineup-chip {
  backdrop-filter: blur(16px) !important;
  -webkit-backdrop-filter: blur(16px) !important;
  border-radius: 12px !important;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2) !important;
  cursor: pointer !important;
}

.btn-lang:hover,
.btn-settings:hover,
.btn-new-game:hover,
#btn-daylight:hover,
#btn-ai-agent:hover,
#btn-config-game-header:hover,
.btn-ai-quick:hover,
.pitch-type-btn:hover {
  transform: translateY(-2px) scale(1.02) !important;
  border-color: #00D2FF !important;
  box-shadow: 0 0 20px rgba(0, 210, 255, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.4) !important;
}

/* Bullpen Reliever Row Liquid Glass */
.bullpen-reliever-row {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  background: rgba(10, 18, 38, 0.72) !important;
  backdrop-filter: blur(14px) !important;
  -webkit-backdrop-filter: blur(14px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 10px !important;
  padding: 10px 14px !important;
  margin-bottom: 8px !important;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.3) !important;
  transition: all 0.2s ease !important;
}

.bullpen-reliever-row:hover {
  border-color: rgba(0, 210, 255, 0.4) !important;
  background: rgba(14, 26, 54, 0.85) !important;
  transform: translateX(2px) !important;
}

.bullpen-reliever-row button {
  background: linear-gradient(135deg, #00D2FF 0%, #0077FF 100%) !important;
  color: #020617 !important;
  border: none !important;
  padding: 6px 12px !important;
  border-radius: 8px !important;
  font-size: 11px !important;
  font-weight: 900 !important;
  letter-spacing: 0.4px !important;
  cursor: pointer !important;
  box-shadow: 0 0 12px rgba(0, 210, 255, 0.35) !important;
  transition: all 0.2s ease !important;
}

.bullpen-reliever-row button:hover {
  transform: scale(1.05) !important;
  box-shadow: 0 0 18px rgba(0, 210, 255, 0.6) !important;
}

/* Nav Tabs Liquid Glass (Matching Manual de Uso & Tarjeta Oficial) */
#main-nav.nav button,
.nav button {
  background: rgba(255, 255, 255, 0.03) !important;
  backdrop-filter: blur(14px) !important;
  -webkit-backdrop-filter: blur(14px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px !important;
  color: #CBD5E1 !important;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
  font-weight: 800 !important;
  font-size: 12px !important;
  padding: 10px 16px !important;
  letter-spacing: 0.4px !important;
  cursor: pointer !important;
  white-space: nowrap !important;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
}

#main-nav.nav button:hover:not(.active),
.nav button:hover:not(.active) {
  background: rgba(0, 210, 255, 0.12) !important;
  color: #00D2FF !important;
  border-color: #00D2FF !important;
  transform: translateY(-2px) scale(1.02) !important;
  box-shadow: 0 0 18px rgba(0, 210, 255, 0.35) !important;
}

#main-nav.nav button.active,
.nav button.active {
  background: linear-gradient(135deg, rgba(0, 210, 255, 0.28), rgba(2, 132, 199, 0.38)) !important;
  border: 1.5px solid #00D2FF !important;
  color: #FFFFFF !important;
  font-weight: 900 !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 0 25px rgba(0, 210, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.35) !important;
}
`;

function processFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('Skipping (not found):', filePath);
    return;
  }

  let code = fs.readFileSync(filePath, 'utf8');
  console.log(`Processing: ${path.basename(filePath)} (${code.length} bytes)...`);

  // 1. Inject or update Master Unified Liquid Glass CSS
  if (code.includes('/* 💎 DIAMAX PRO — MASTER UNIFIED LIQUID GLASS')) {
    const startIdx = code.indexOf('/* 💎 DIAMAX PRO — MASTER UNIFIED LIQUID GLASS');
    const endIdx = code.indexOf('/* End Scoreboard CSS */', startIdx);
    if (endIdx !== -1) {
      code = code.substring(0, startIdx) + UNIFIED_LIQUID_GLASS_CSS + '\n' + code.substring(endIdx);
    }
  } else if (code.includes('/* End Scoreboard CSS */')) {
    code = code.replace('/* End Scoreboard CSS */', UNIFIED_LIQUID_GLASS_CSS + '\n/* End Scoreboard CSS */');
  } else if (code.includes('</style>')) {
    code = code.replace('</style>', UNIFIED_LIQUID_GLASS_CSS + '\n</style>');
  }

  // 2. Fix variable references in confirmarYVerificarCuentaP2
  code = code.replace(
    /actualizarNombreEquipo\(teamNameInput\)/g,
    'actualizarNombreEquipo(datosUsuarioTempP2.teamName || teamName)'
  );
  code = code.replace(
    /actualizarManager\(fullName\)/g,
    'actualizarManager(datosUsuarioTempP2.fullName || teamManager)'
  );
  code = code.replace(
    /actualizarDireccion\(location\)/g,
    'actualizarDireccion(datosUsuarioTempP2.location || "Sede Oficial")'
  );

  // 3. Ensure ejecutarRegistroOficial navigates smoothly to Page 3
  if (code.includes('function ejecutarRegistroOficial()')) {
    code = code.replace(
      /setTimeout\(\(\) => \{\s*cerrarAuthModal\(\);\s*\}, 2400\);/g,
      'setTimeout(() => { cerrarAuthModal(); irAPagina(3); }, 1200);'
    );
  }

  // 4. Ensure ejecutarLogin navigates smoothly to Page 3
  if (code.includes('function ejecutarLogin()')) {
    code = code.replace(
      /setTimeout\(\(\) => cerrarAuthModal\(\), 700\);/g,
      'setTimeout(() => { cerrarAuthModal(); irAPagina(3); }, 500);'
    );
  }

  // 5. Ensure validarPinDugout navigates smoothly to Page 3
  if (code.includes('function validarPinDugout()')) {
    code = code.replace(
      /setTimeout\(\(\) => cerrarAuthModal\(\), 400\);/g,
      'setTimeout(() => { cerrarAuthModal(); irAPagina(3); }, 300);'
    );
  }

  // 6. Ensure renderBullpenList renders sleek Liquid Glass structure with real status badges
  const enhancedBullpenFunc = `function renderBullpenList() {
  const container = document.getElementById('bullpen-relievers-container');
  if (!container) return;

  if (!bullpenRoster || bullpenRoster.length === 0) {
    bullpenRoster = [
      { id: 101, num: 24, name: "Manuel Quintero", throws: "R", status: "Calentando", pitchesToday: 14 },
      { id: 102, num: 33, name: "Carlos Mendoza", throws: "L", status: "Listo", pitchesToday: 22 },
      { id: 103, num: 45, name: "Luis Hernandez", throws: "R", status: "Descansando", pitchesToday: 0 }
    ];
  }

  container.innerHTML = bullpenRoster.map(r => {
    let badgeColor = '#94A3B8';
    let badgeBg = 'rgba(255, 255, 255, 0.08)';
    let badgeBorder = 'rgba(255, 255, 255, 0.15)';
    let statusIcon = '💤';
    
    if (r.status === 'Calentando') {
      badgeColor = '#FFC72C';
      badgeBg = 'rgba(255, 199, 44, 0.18)';
      badgeBorder = 'rgba(255, 199, 44, 0.45)';
      statusIcon = '🔥';
    } else if (r.status === 'Listo') {
      badgeColor = '#10B981';
      badgeBg = 'rgba(16, 185, 129, 0.18)';
      badgeBorder = 'rgba(16, 185, 129, 0.45)';
      statusIcon = '⚡';
    } else if (r.status === 'Lanzando') {
      badgeColor = '#00D2FF';
      badgeBg = 'rgba(0, 210, 255, 0.2)';
      badgeBorder = '#00D2FF';
      statusIcon = '⚾';
    }

    return \`
      <div class="bullpen-reliever-row">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:14px;">\${statusIcon}</span>
          <div>
            <strong style="color:#FFF; font-size:12px;">#\${r.num} \${r.name}</strong>
            <span style="color:#00D2FF; font-size:10.5px; font-weight:700; margin-left:4px;">(\${r.throws}HP)</span>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="background:\${badgeBg}; color:\${badgeColor}; border:1px solid \${badgeBorder}; font-size:10px; padding:3px 8px; border-radius:6px; font-weight:800; letter-spacing:0.4px;">\${r.status}</span>
          <button type="button" onclick="traerRelevista(\${r.id})" style="background:linear-gradient(135deg, #00D2FF, #0077FF); color:#020617; border:none; padding:5px 10px; border-radius:6px; font-size:10.5px; font-weight:900; cursor:pointer; box-shadow:0 0 10px rgba(0,210,255,0.3);">Traer a Lanzar</button>
        </div>
      </div>
    \`;
  }).join('');
}`;

  if (code.includes('function renderBullpenList()')) {
    const bStart = code.indexOf('function renderBullpenList()');
    const bEnd = code.indexOf('function traerRelevista(', bStart);
    if (bEnd !== -1) {
      code = code.substring(0, bStart) + enhancedBullpenFunc + '\n\n' + code.substring(bEnd);
    }
  }

  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Saved: ${path.basename(filePath)} (${code.length} bytes)`);
}

targetFiles.forEach(processFile);
console.log('✨ All files successfully updated with Unified Liquid Glass & Robust Button Handlers!');
