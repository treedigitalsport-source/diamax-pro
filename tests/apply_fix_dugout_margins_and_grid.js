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

  // 1. Fix CSS for .responsive-grid-split
  const oldGridCSS = `.responsive-grid-split {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 16px;
    width: 100%;
  }`;

  const newGridCSS = `.responsive-grid-split {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
    gap: 20px;
    width: 100%;
    margin-top: 18px;
    margin-bottom: 24px;
    align-items: start;
  }`;

  if (html.includes(oldGridCSS)) {
    html = html.replace(oldGridCSS, newGridCSS);
  }

  // 2. Ensure the pitch tracker / bullpen card has clean bottom margin
  const oldBullpenEnd = `<!-- Estado de Relevistas en Bullpen -->
      <div style="background:#070D1A; border:1px solid #1E293B; border-radius:8px; padding:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <span id="lbl-bullpen" style="font-size:11px; font-weight:800; color:#FFC72C; text-transform:uppercase;">🔥 Bullpen Activo:</span>
          <button onclick="cambiarEstadoBullpenModal()" style="background:transparent; border:none; color:#00D2FF; font-size:11px; font-weight:700; cursor:pointer; text-decoration:underline;" id="btn-manage-bullpen">+ Gestionar Relevo</button>
        </div>
        <div id="bullpen-relievers-container">
          <!-- Renderizado dinámicamente -->
        </div>
      </div>

    </div>`;

  const newBullpenEnd = `<!-- Estado de Relevistas en Bullpen -->
      <div style="background:#070D1A; border:1px solid #1E293B; border-radius:8px; padding:12px; margin-bottom:6px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span id="lbl-bullpen" style="font-size:11px; font-weight:800; color:#FFC72C; text-transform:uppercase;">🔥 Bullpen Activo:</span>
          <button onclick="cambiarEstadoBullpenModal()" style="background:transparent; border:none; color:#00D2FF; font-size:11px; font-weight:700; cursor:pointer; text-decoration:underline;" id="btn-manage-bullpen">+ Gestionar Relevo</button>
        </div>
        <div id="bullpen-relievers-container">
          <!-- Renderizado dinámicamente -->
        </div>
      </div>

    </div>`;

  if (html.includes(oldBullpenEnd)) {
    html = html.replace(oldBullpenEnd, newBullpenEnd);
  }

  // 3. Ensure the responsive grid split starts with clean top margin
  const oldGridOpen = `<div class="responsive-grid-split">`;
  const newGridOpen = `<div class="responsive-grid-split" style="margin-top:20px; margin-bottom:24px; gap:20px;">`;
  if (html.includes(oldGridOpen) && !html.includes(newGridOpen)) {
    html = html.replace(oldGridOpen, newGridOpen);
  }

  fs.writeFileSync(file, html, 'utf8');
  console.log(`Successfully updated layout margins and grid alignment for ${file}`);
});
