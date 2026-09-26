const fs = require('fs');

const targetFiles = [
  'index.html',
  'v_original_aprobada.html',
  'v6_hace_1_hora_49505bc.html',
  'v1_actual_logo_photoroom_y_planes.html'
];

// Unified Master Cyber-Glass Interactive Styling for Navigation, Header and Ribbon
const unifiedMasterCSS = `
/* ========================================================================== */
/* 💎 DIAMAX PRO — UNIFIED EXECUTIVE CYBER-GLASS THEME & INTERACTIVE DOCK    */
/* ========================================================================== */

/* Top Navigation Dock */
#main-nav.nav, .nav {
  background: rgba(5, 10, 22, 0.94) !important;
  backdrop-filter: blur(28px) !important;
  -webkit-backdrop-filter: blur(28px) !important;
  border: 1px solid rgba(0, 210, 255, 0.25) !important;
  border-radius: 18px !important;
  padding: 8px !important;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.75), 0 0 20px rgba(0, 210, 255, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 8px !important;
  margin-bottom: 16px !important;
}

#main-nav.nav button, .nav button {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px !important;
  color: #CBD5E1 !important;
  font-family: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif !important;
  font-weight: 800 !important;
  font-size: 12px !important;
  padding: 10px 18px !important;
  letter-spacing: 0.4px !important;
  cursor: pointer !important;
  white-space: nowrap !important;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
}

#main-nav.nav button:hover:not(.active), .nav button:hover:not(.active) {
  background: rgba(0, 210, 255, 0.12) !important;
  color: #00D2FF !important;
  border-color: #00D2FF !important;
  transform: translateY(-2px) scale(1.02) !important;
  box-shadow: 0 0 18px rgba(0, 210, 255, 0.35) !important;
}

#main-nav.nav button:active, .nav button:active {
  transform: scale(0.97) !important;
}

#main-nav.nav button.active, .nav button.active {
  background: linear-gradient(135deg, rgba(0, 210, 255, 0.28), rgba(2, 132, 199, 0.38)) !important;
  border: 1.5px solid #00D2FF !important;
  color: #FFFFFF !important;
  font-weight: 900 !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 0 25px rgba(0, 210, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.35) !important;
}

/* Header & Ribbon Interactive Buttons */
.btn-settings, .btn-new-game, #btn-ribbon-home, #btn-ribbon-away, .btn-finish-game {
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;
  cursor: pointer !important;
}

.btn-settings:hover {
  transform: translateY(-2px) scale(1.02) !important;
  border-color: #00D2FF !important;
  box-shadow: 0 0 16px rgba(0, 210, 255, 0.35) !important;
}

.btn-settings:active, .btn-new-game:active {
  transform: scale(0.97) !important;
}

.btn-new-game:hover {
  transform: translateY(-2px) scale(1.02) !important;
  box-shadow: 0 0 22px rgba(0, 210, 255, 0.55) !important;
}

/* Game Badges in Live Header */
.game-live-header-bar .game-badge {
  transition: all 0.2s ease !important;
}
.game-live-header-bar .game-badge:hover {
  border-color: #00D2FF !important;
  box-shadow: 0 0 12px rgba(0, 210, 255, 0.25) !important;
  transform: translateY(-1px) !important;
}
`;

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Insert or update Unified Master CSS before </style>
  if (content.includes('/* 💎 DIAMAX PRO — UNIFIED EXECUTIVE CYBER-GLASS THEME')) {
    content = content.replace(
      /\/\* 💎 DIAMAX PRO — UNIFIED EXECUTIVE CYBER-GLASS THEME[\s\S]*?\/\* End Cyber-Glass \*\//,
      `${unifiedMasterCSS.trim()}\n/* End Cyber-Glass */`
    );
  } else if (content.includes('</style>')) {
    content = content.replace('</style>', `${unifiedMasterCSS.trim()}\n/* End Cyber-Glass */\n</style>`);
  }

  // Ensure all 8 navigation buttons have identical icons and structure
  const navTargetRegex = /<div class="nav" id="main-nav">[\s\S]*?<\/div>/;
  const standardNavHTML = `<div class="nav" id="main-nav">
    <button class="active" onclick="switchTab('envivo')" id="btn-go-scorer">
      <svg viewBox="0 0 24 24" width="15" height="15" style="vertical-align:middle;"><use href="#diamax-icon-tactical-crosshair"/></svg> 1. Anotador Dugout
    </button>
    <button onclick="switchTab('lineup')" id="nav-lineup">
      <svg viewBox="0 0 24 24" width="15" height="15" style="vertical-align:middle;"><use href="#diamax-icon-lineup-dictate"/></svg> 2. Lineup Builder
    </button>
    <button onclick="switchTab('campo')" id="btn-view-field">
      <svg viewBox="0 0 24 24" width="15" height="15" style="vertical-align:middle;"><use href="#diamax-icon-nav-field"/></svg> 3. Ver Terreno
    </button>
    <button onclick="switchTab('manual')" id="nav-manual" class="nav-manual-btn">
      <svg viewBox="0 0 24 24" width="15" height="15" style="vertical-align:middle;"><use href="#diamax-icon-roster-sheet"/></svg> 📖 Manual de Uso
    </button>
    <button onclick="switchTab('tarjeta-oficial')" id="nav-card">
      <svg viewBox="0 0 24 24" width="15" height="15" style="vertical-align:middle;"><use href="#diamax-icon-boxscore-matrix"/></svg> 4. Tarjeta Oficial
    </button>
    <button onclick="switchTab('dashboard')" id="nav-dash">
      <svg viewBox="0 0 24 24" width="15" height="15" style="vertical-align:middle;"><use href="#diamax-icon-sabermetric-brain"/></svg> 5. Dashboard
    </button>
    <button onclick="switchTab('skills')" id="nav-skills">
      <svg viewBox="0 0 24 24" width="15" height="15" style="vertical-align:middle;"><use href="#diamax-icon-ai-core"/></svg> 6. Agente &amp; Skills
    </button>
    <button onclick="switchTab('perfil')" id="nav-profile">
      <svg viewBox="0 0 24 24" width="15" height="15" style="vertical-align:middle;"><use href="#diamax-icon-manager-badge"/></svg> 7. Perfil &amp; Sede
    </button>
  </div>`;

  if (navTargetRegex.test(content)) {
    content = content.replace(navTargetRegex, standardNavHTML);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Applied unified Cyber-Glass styling & navigation to ${filePath}`);
}

targetFiles.forEach(f => processFile(f));
