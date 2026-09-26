const fs = require('fs');

const targetFiles = [
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/index.html',
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/v_original_aprobada.html',
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/v6_hace_1_hora_49505bc.html',
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/v1_actual_logo_photoroom_y_planes.html'
];

targetFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');

  // 1. Optimize Container Width & Padding for optimal spatial utilization
  const containerCSS = `
  /* High-Efficiency Luxury Layout */
  .container {
    max-width: 1440px !important;
    margin: 0 auto !important;
    padding: 0 16px !important;
    box-sizing: border-box !important;
  }

  .dugout-main-grid {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 16px !important;
    width: 100% !important;
    margin-top: 14px !important;
    margin-bottom: 20px !important;
    align-items: stretch !important;
    box-sizing: border-box !important;
  }

  .panel {
    background: rgba(10, 20, 42, 0.82) !important;
    border: 1px solid rgba(0, 210, 255, 0.22) !important;
    border-radius: 14px !important;
    padding: 14px !important;
    margin-bottom: 12px !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(0, 210, 255, 0.03) !important;
    backdrop-filter: blur(14px) !important;
    box-sizing: border-box !important;
  }

  .ai-tactical-card {
    background: rgba(8, 16, 36, 0.88) !important;
    border: 1px solid rgba(0, 210, 255, 0.25) !important;
    border-radius: 14px !important;
    padding: 14px !important;
    margin-bottom: 12px !important;
    box-sizing: border-box !important;
  }

  /* Compact 36 Plays Grid Optimization */
  #panel-36-plays .play-section-group {
    margin-bottom: 8px !important;
  }

  #panel-36-plays .btn-section-title {
    font-size: 11px !important;
    margin-bottom: 4px !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
  }

  #panel-36-plays .btn-action,
  #panel-36-plays .btn-fly-pos {
    min-height: 36px !important;
    padding: 4px 6px !important;
    font-size: 11.5px !important;
    font-weight: 800 !important;
    border-radius: 7px !important;
    transition: all 0.15s ease !important;
  }

  #panel-36-plays .btn-action:hover,
  #panel-36-plays .btn-fly-pos:hover {
    transform: translateY(-2px) !important;
    filter: brightness(1.2) !important;
  }

  @media (max-width: 980px) {
    .dugout-main-grid {
      grid-template-columns: 1fr !important;
      gap: 14px !important;
    }
  }
  `;

  if (!html.includes('/* High-Efficiency Luxury Layout */')) {
    html = html.replace('</style>', containerCSS + '\n</style>');
    fs.writeFileSync(file, html, 'utf8');
    console.log(`Applied High-Efficiency spatial optimization to ${file}`);
  }
});
