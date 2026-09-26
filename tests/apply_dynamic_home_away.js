const fs = require('fs');

const targetFiles = [
  'index.html',
  'v_original_aprobada.html',
  'v6_hace_1_hora_49505bc.html',
  'v1_actual_logo_photoroom_y_planes.html'
];

function updateFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. In renderLineupBuilder(): Make team name dynamic
  content = content.replace(
    /const gveName = 'GUERREROS';/g,
    `const gveName = (typeof teamName !== 'undefined' && teamName) ? teamName.split(' ')[0] : 'MI EQUIPO';`
  );
  content = content.replace(
    /const activeTeamName = isEditingGVE \? 'GUERREROS \(\+55\)' : rivalName;/g,
    `const activeTeamName = isEditingGVE ? (typeof teamName !== 'undefined' ? teamName : 'MI EQUIPO') : rivalName;`
  );

  // 2. In poblarSelectorPartidos(): Make team name dynamic
  content = content.replace(
    /const matchupStr = isHome \s*\?\s*`🏠 \[HOME\] GUERREROS vs ✈️ \[VISIT\] \${rivalName}\${rivalAbbr}`\s*:\s*`🏠 \[HOME\] \${rivalName}\${rivalAbbr} vs ✈️ \[VISIT\] GUERREROS`;/g,
    `const myShort = (typeof teamName !== 'undefined' && teamName) ? teamName.split(' ')[0] : 'MI EQUIPO';
    const matchupStr = isHome 
      ? \`🏠 [HOME] \${myShort} vs ✈️ [VISIT] \${rivalName}\${rivalAbbr}\` 
      : \`🏠 [HOME] \${rivalName}\${rivalAbbr} vs ✈️ [VISIT] \${myShort}\`;`
  );

  content = content.replace(
    /if \(isHome\) \{\s*ribbonHomeTeam\.innerText = 'GUERREROS';\s*ribbonAwayTeam\.innerText = rDisplayName;\s*\} else \{\s*ribbonHomeTeam\.innerText = rDisplayName;\s*ribbonAwayTeam\.innerText = 'GUERREROS';\s*\}/g,
    `const myShort = (typeof teamName !== 'undefined' && teamName) ? teamName.split(' ')[0] : 'MI EQUIPO';
    if (isHome) {
      ribbonHomeTeam.innerText = myShort;
      ribbonAwayTeam.innerText = rDisplayName;
    } else {
      ribbonHomeTeam.innerText = rDisplayName;
      ribbonAwayTeam.innerText = myShort;
    }`
  );

  // 3. In actualizarGameHeaderUI(): Make team name dynamic
  content = content.replace(
    /bRival\.innerHTML = isHome\s*\?\s*`🏠 <strong>HOME:<\/strong> <span style="color:#00D2FF; font-weight:900;">GUERREROS<\/span> vs ✈️ <strong>VISIT:<\/strong> <span style="color:#FFC72C; font-weight:900;">\${rName}<\/span> <span style="background:\${rColor}; color:#000; padding:1px 5px; border-radius:3px; font-size:9\.5px; font-weight:900;">\${rAbbr}<\/span>`\s*:\s*`🏠 <strong>HOME:<\/strong> <span style="color:#00D2FF; font-weight:900;">\${rName}<\/span> <span style="background:\${rColor}; color:#000; padding:1px 5px; border-radius:3px; font-size:9\.5px; font-weight:900;">\${rAbbr}<\/span> vs ✈️ <strong>VISIT:<\/strong> <span style="color:#FFC72C; font-weight:900;">GUERREROS<\/span>`;/g,
    `const myShort = (typeof teamName !== 'undefined' && teamName) ? teamName.split(' ')[0] : 'MI EQUIPO';
    bRival.innerHTML = isHome
      ? \`🏠 <strong>HOME:</strong> <span style="color:#00D2FF; font-weight:900;">\${myShort}</span> vs ✈️ <strong>VISIT:</strong> <span style="color:#FFC72C; font-weight:900;">\${rName}</span> <span style="background:\${rColor}; color:#000; padding:1px 5px; border-radius:3px; font-size:9.5px; font-weight:900;">\${rAbbr}</span>\`
      : \`🏠 <strong>HOME:</strong> <span style="color:#00D2FF; font-weight:900;">\${rName}</span> <span style="background:\${rColor}; color:#000; padding:1px 5px; border-radius:3px; font-size:9.5px; font-weight:900;">\${rAbbr}</span> vs ✈️ <strong>VISIT:</strong> <span style="color:#FFC72C; font-weight:900;">\${myShort}</span>\`;`
  );

  // 4. In ejecutarRegistroOficial(): Make sure all Dugout and Header elements update with new user's team
  if (content.includes('localStorage.setItem(\'diamax_auth_session\', JSON.stringify(currentUserSession));')) {
    const sessionSyncCode = `localStorage.setItem('diamax_auth_session', JSON.stringify(currentUserSession));
  
  // Sincronizar UI de Página 3 y Selectores con los datos dinámicos del nuevo usuario
  if (typeof actualizarNombreEquipo === 'function') actualizarNombreEquipo(teamNameInput);
  if (typeof actualizarManager === 'function') actualizarManager(fullName);
  if (typeof actualizarDireccion === 'function') actualizarDireccion(location);
  if (typeof poblarSelectorPartidos === 'function') poblarSelectorPartidos();
  if (typeof actualizarGameHeaderUI === 'function') actualizarGameHeaderUI();
  if (typeof renderLineupBuilder === 'function') renderLineupBuilder();`;

    content = content.replace('localStorage.setItem(\'diamax_auth_session\', JSON.stringify(currentUserSession));', sessionSyncCode);
  }

  // 5. In procesarLoginP2(): Make sure it also refreshes the dynamic UI
  if (content.includes('function procesarLoginP2() {')) {
    const loginP2Sync = `function procesarLoginP2() {
  const user = document.getElementById('p2-login-user')?.value.trim();
  const pass = document.getElementById('p2-login-pass')?.value.trim();
  if (!user || !pass) {
    const alertBox = document.getElementById('p2-login-alert');
    if (alertBox) {
      alertBox.style.display = 'block';
      alertBox.style.background = 'rgba(239,68,68,0.15)';
      alertBox.style.border = '1px solid #EF4444';
      alertBox.style.color = '#FCA5A5';
      alertBox.innerHTML = '⚠️ Ingresa tu usuario y contraseña de acceso.';
    }
    return;
  }
  // Cargar usuario registrado si coincide
  let registeredUsers = [];
  try { registeredUsers = JSON.parse(localStorage.getItem('diamax_registered_users') || '[]'); } catch(e){}
  const matched = registeredUsers.find(u => u.email === user.toLowerCase());
  if (matched) {
    if (typeof actualizarNombreEquipo === 'function') actualizarNombreEquipo(matched.teamName);
    if (typeof actualizarManager === 'function') actualizarManager(matched.fullName);
    if (typeof actualizarDireccion === 'function') actualizarDireccion(matched.location);
    if (typeof poblarSelectorPartidos === 'function') poblarSelectorPartidos();
    if (typeof actualizarGameHeaderUI === 'function') actualizarGameHeaderUI();
    if (typeof renderLineupBuilder === 'function') renderLineupBuilder();
  }
  irAPagina(3);
}`;
    content = content.replace(/function procesarLoginP2\(\) \{[\s\S]*?irAPagina\(3\);\s*\}/, loginP2Sync);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully updated ${filePath} for Home & Away dynamic symmetry.`);
}

targetFiles.forEach(f => updateFile(f));
