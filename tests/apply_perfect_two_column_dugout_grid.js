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

  // Replace any auto-fit grid in tab-envivo with symmetric 1fr 1fr grid
  const oldGridSearch = `<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:14px;">`;
  const oldGridSearch2 = `<div class="responsive-grid-split">`;
  const oldGridSearch3 = `<div class="responsive-grid-split" style="margin-top:20px; margin-bottom:24px; gap:20px;">`;

  const perfectGrid = `<div class="dugout-main-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:20px; width:100%; margin-top:20px; margin-bottom:24px; align-items:start; box-sizing:border-box;">`;

  if (html.includes(oldGridSearch)) {
    html = html.replace(oldGridSearch, perfectGrid);
  }
  if (html.includes(oldGridSearch2)) {
    html = html.replace(oldGridSearch2, perfectGrid);
  }
  if (html.includes(oldGridSearch3)) {
    html = html.replace(oldGridSearch3, perfectGrid);
  }

  // Also add responsive CSS rule for @media (max-width: 960px) { .dugout-main-grid { grid-template-columns: 1fr !important; } }
  const cssRule = `
  /* Dugout Main Grid 50/50 Perfect Balance */
  .dugout-main-grid {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 20px !important;
    width: 100% !important;
  }
  @media (max-width: 980px) {
    .dugout-main-grid {
      grid-template-columns: 1fr !important;
    }
  }
  `;

  if (!html.includes('.dugout-main-grid {')) {
    html = html.replace('</style>', cssRule + '\n</style>');
  }

  fs.writeFileSync(file, html, 'utf8');
  console.log(`Applied perfect 50/50 symmetric grid to ${file}`);
});
