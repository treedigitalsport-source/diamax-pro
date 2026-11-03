import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

// =========================================================================
// 1. PARTE 1: La Botonera Completa de 36 Jugadas Canónicas (HTML)
// =========================================================================
const p36Idx = html.indexOf('id="panel-36-plays"');
if (p36Idx === -1) {
  console.error('Could not find id="panel-36-plays"');
  process.exit(1);
}

// Locate the action-grid inside panel-36-plays
const gridStart = html.indexOf('<div class="action-grid"', p36Idx);
// Find the end of panel-36-plays or its closing tag
const panelCloseIdx = html.indexOf('</section>', p36Idx) !== -1 ? html.indexOf('</section>', p36Idx) : html.indexOf('</div>', p36Idx + 5000);

// Find the closing </div> of action-grid
// Let's inspect from gridStart to the next major block
const oldGridEnd = html.indexOf('<!-- BOTÓN DESHACER VISIBLE', gridStart);
let oldBotoneraBlock = '';

if (oldGridEnd !== -1) {
  // It already had some undo button comment, find after that div
  const undoClose = html.indexOf('</div>', oldGridEnd + 40) + 6;
  oldBotoneraBlock = html.slice(gridStart, undoClose);
} else {
  // Find closing </div> of action-grid
  let count = 0;
  let idx = gridStart;
  let end = -1;
  while (idx < html.length) {
    if (html.startsWith('<div', idx)) {
      count++;
      idx += 4;
    } else if (html.startsWith('</div>', idx)) {
      count--;
      idx += 6;
      if (count === 0) {
        end = idx;
        break;
      }
    } else {
      idx++;
    }
  }
  oldBotoneraBlock = html.slice(gridStart, end);
}

const newBotoneraBlock = `<!-- BOTONERA OFICIAL COMPLETA DE 36 JUGADAS CANÓNICAS WBSC -->
<div class="action-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(82px, 1fr)); gap:6px;">
  <!-- BATAZOS Y HITS (1 a 5) -->
  <button type="button" id="act-1b" class="btn-action btn-hit" onclick="registrarJugadaLive('1B')">1B Sencillo</button>
  <button type="button" id="act-2b" class="btn-action btn-hit" onclick="registrarJugadaLive('2B')">2B Doble</button>
  <button type="button" id="act-grd" class="btn-action btn-hit" onclick="registrarJugadaLive('GRD')">GRD Regla</button>
  <button type="button" id="act-3b" class="btn-action btn-hit" onclick="registrarJugadaLive('3B')">3B Triple</button>
  <button type="button" id="act-hr" class="btn-action btn-hr" onclick="registrarJugadaLive('HR')">HR Jonrón</button>

  <!-- PONCHES Y BOLETOS (6 a 11) -->
  <button type="button" id="act-k" class="btn-action btn-out" onclick="registrarJugadaLive('K')">K Tirando</button>
  <button type="button" id="act-kl" class="btn-action btn-out" onclick="registrarJugadaLive('K_LOOKING')">ꓘ Cantado</button>
  <button type="button" id="act-bb" class="btn-action btn-tactical" onclick="registrarJugadaLive('BB')">BB Boleto</button>
  <button type="button" id="act-ibb" class="btn-action btn-tactical" onclick="registrarJugadaLive('IBB')">IBB Intenc.</button>
  <button type="button" id="act-hbp" class="btn-action btn-tactical" onclick="registrarJugadaLive('HBP')">HBP Golpe</button>
  <button type="button" id="act-ci" class="btn-action btn-tactical" onclick="registrarJugadaLive('CI')">CI Interf.</button>

  <!-- SACRIFICIOS (12 y 13) -->
  <button type="button" id="act-sf" class="btn-action btn-tactical" onclick="registrarJugadaLive('SF')">SF Fly Sac.</button>
  <button type="button" id="act-sh" class="btn-action btn-tactical" onclick="registrarJugadaLive('SAC_BUNT')">SH Toque</button>

  <!-- ROLATAS AL CUADRO (14 a 18) -->
  <button type="button" id="act-63" class="btn-action btn-out" onclick="registrarJugadaLive('6-3')">6-3 Rolata</button>
  <button type="button" id="act-43" class="btn-action btn-out" onclick="registrarJugadaLive('4-3')">4-3 Rolata</button>
  <button type="button" id="act-53" class="btn-action btn-out" onclick="registrarJugadaLive('5-3')">5-3 Rolata</button>
  <button type="button" id="act-13" class="btn-action btn-out" onclick="registrarJugadaLive('1-3')">1-3 Rolata</button>
  <button type="button" id="act-31" class="btn-action btn-out" onclick="registrarJugadaLive('3-1')">3-1 Rolata</button>

  <!-- ELEVADOS, LÍNEAS Y POP-UPS (19 a 24) -->
  <button type="button" id="act-f7" class="btn-action btn-out" onclick="registrarJugadaLive('F7')">F7 Jardín Izq.</button>
  <button type="button" id="act-f8" class="btn-action btn-out" onclick="registrarJugadaLive('F8')">F8 Central</button>
  <button type="button" id="act-f9" class="btn-action btn-out" onclick="registrarJugadaLive('F9')">F9 Jardín Der.</button>
  <button type="button" id="act-line" class="btn-action btn-out" onclick="registrarJugadaLive('LINE_OUT')">L Línea Out</button>
  <button type="button" id="act-p2" class="btn-action btn-out" onclick="registrarJugadaLive('P2')">P2 Foul Pop</button>
  <button type="button" id="act-ifr" class="btn-action btn-out" onclick="registrarJugadaLive('IFR')">IFR Infield Fly</button>

  <!-- JUGADAS MÚLTIPLES (25 a 28) -->
  <button type="button" id="act-dp-643" class="btn-action btn-out" onclick="registrarJugadaLive('6-4-3 DP')">6-4-3 DP</button>
  <button type="button" id="act-dp-463" class="btn-action btn-out" onclick="registrarJugadaLive('4-6-3 DP')">4-6-3 DP</button>
  <button type="button" id="act-dp-543" class="btn-action btn-out" onclick="registrarJugadaLive('5-4-3 DP')">5-4-3 DP</button>
  <button type="button" id="act-tp" class="btn-action btn-out" style="background:#581c87; border:1px solid #c084fc; color:#f3e8ff; font-weight:900;" onclick="registrarJugadaLive('TRIPLE_PLAY')">⚡ TRIPLE PLAY</button>

  <!-- ERRORES Y SELECCIÓN (29 y 30) -->
  <button type="button" id="act-roe" class="btn-action btn-tactical" onclick="registrarJugadaLive('ROE')">ROE Error</button>
  <button type="button" id="act-fc" class="btn-action btn-tactical" onclick="registrarJugadaLive('FC')">FC Bola Ocup.</button>

  <!-- CORREDORES Y PITCHEO (31 a 36) -->
  <button type="button" id="act-sb" class="btn-action btn-tactical" onclick="registrarJugadaLive('SB')">SB Robo</button>
  <button type="button" id="act-cs" class="btn-action btn-out" onclick="registrarJugadaLive('CS')">CS Out Rob.</button>
  <button type="button" id="act-pk" class="btn-action btn-out" onclick="registrarJugadaLive('PK')">PK Pickoff</button>
  <button type="button" id="act-wp" class="btn-action btn-tactical" onclick="registrarJugadaLive('WP')">WP Wild</button>
  <button type="button" id="act-pb" class="btn-action btn-tactical" onclick="registrarJugadaLive('PB')">PB Passed</button>
  <button type="button" id="act-bk" class="btn-action btn-tactical" onclick="registrarJugadaLive('BK')">BK Balk</button>
</div>

<!-- BOTÓN DESHACER VISIBLE EN EL KEYPAD -->
<div style="margin-top:10px; display:flex; justify-content:flex-end;">
  <button type="button" id="btn-undo-keypad" onclick="deshacerJugadaLive()" style="background:#334155; border:1px solid #475569; color:#f8fafc; padding:8px 16px; border-radius:8px; font-weight:800; font-size:12px; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
    ↩ Deshacer Última Jugada
  </button>
</div>`;

html = html.replace(oldBotoneraBlock, newBotoneraBlock);
console.log('✓ PARTE 1: Botonera Oficial Completa de 36 Jugadas Canónicas y botón Deshacer visible integrados.');

// =========================================================================
// 2. PARTE 2: Lógica de las 36 Jugadas en registrarJugadaLive (JavaScript)
// =========================================================================
const regFnStart = html.indexOf('function registrarJugadaLive');
const cmdChainStart = html.indexOf("let cmdType = 'RECORD_HIT';", regFnStart);
const cmdChainEnd = html.indexOf("payload.inning =", cmdChainStart);

if (cmdChainStart !== -1 && cmdChainEnd !== -1) {
  const oldCmdChain = html.slice(cmdChainStart, cmdChainEnd);
  
  const newCmdChain = `// Soporte canónico completo para las 36 jugadas WBSC
  let cmdType = 'RECORD_HIT';
  let payload = { resultCode: action, batterId: pId, description: action, pitcherName: pitcherName };

  if (action === '1B' || action === '2B' || action === '3B' || action === 'HR' || action === 'GRD') {
    cmdType = 'RECORD_HIT';
    const hitCode = action === 'GRD' ? '2B' : action;
    payload = { resultCode: hitCode, isGroundRule: action === 'GRD', batterId: pId, description: action === 'GRD' ? \`Doble por Regla de Terreno (GRD) de \${pName}\` : \`Hit \${action} de \${pName}\`, pitcherName };
  } else if (action === 'K' || action === 'K_SWINGING' || action === 'K_LOOKING') {
    cmdType = 'RECORD_OUT';
    payload = { resultCode: action === 'K_LOOKING' ? 'K_LOOKING' : 'K_SWINGING', batterId: pId, description: \`Ponche (\${action === 'K_LOOKING' ? 'ꓘ' : 'K'}) de \${pName}\`, pitcherName };
  } else if (action === 'BB' || action === 'IBB' || action === 'HBP') {
    cmdType = 'RECORD_WALK';
    payload = { resultCode: action, batterId: pId, description: \`Boleto (\${action}) para \${pName}\`, pitcherName };
  } else if (action === 'CI') {
    // Interferencia del Receptor (WBSC 6.01c: avanza a 1B, no cuenta como AB)
    cmdType = 'RECORD_ERROR';
    payload = { resultCode: 'CI', batterId: pId, description: \`Interferencia del Receptor (CI) para \${pName}\`, errors: [{ fielderId: 'C', errorType: 'INTERFERENCE', baseReached: 'b1' }], pitcherName };
  } else if (action === 'SF' || action === 'SAC_FLY' || action === 'SAC_BUNT') {
    cmdType = 'RECORD_SACRIFICE';
    payload = { resultCode: action === 'SAC_BUNT' ? 'SAC_BUNT' : 'SAC_FLY', batterId: pId, description: \`Sacrificio (\${action === 'SAC_BUNT' ? 'SH' : 'SF'}) de \${pName}\`, pitcherName };
  } else if (action === '6-4-3 DP' || action === '4-6-3 DP' || action === '5-4-3 DP' || action === 'DP') {
    cmdType = 'RECORD_DOUBLE_PLAY';
    const dpMap = { '6-4-3 DP': ['SS', '2B', '1B'], '4-6-3 DP': ['2B', 'SS', '1B'], '5-4-3 DP': ['3B', '2B', '1B'] };
    payload = { resultCode: 'DP_GROUND', batterId: pId, description: \`Doble Play (\${action})\`, fielderIds: dpMap[action] || ['SS', '2B', '1B'], pitcherName };
  } else if (action === 'TRIPLE_PLAY') {
    cmdType = 'RECORD_OUT';
    payload = { resultCode: 'TP', outsRecorded: 3, batterId: pId, description: \`¡TRIPLE PLAY! Entrada Finalizada\`, pitcherName };
  } else if (action === '6-3' || action === '4-3' || action === '5-3' || action === '1-3' || action === '3-1') {
    cmdType = 'RECORD_OUT';
    const fMap = { '6-3': ['SS', '1B'], '4-3': ['2B', '1B'], '5-3': ['3B', '1B'], '1-3': ['P', '1B'], '3-1': ['1B', 'P'] };
    payload = { resultCode: 'GO', batterId: pId, description: \`Rolata (\${action}) de \${pName}\`, fielderIds: fMap[action] || ['SS', '1B'], pitcherName };
  } else if (action === 'F7' || action === 'F8' || action === 'F9' || action === 'FO' || action === 'PO' || action === 'IFR' || action === 'LINE_OUT' || action === 'P2') {
    cmdType = 'RECORD_OUT';
    const zoneNames = { 'F7': 'Jardín Izquierdo (F7)', 'F8': 'Jardín Central (F8)', 'F9': 'Jardín Derecho (F9)', 'P2': 'Foul Pop Receptor (P2)', 'LINE_OUT': 'Línea Quemante (L)', 'IFR': 'Infield Fly (IFR)' };
    payload = { resultCode: 'FO', batterId: pId, description: \`Out de Aire: \${zoneNames[action] || action} (\${pName})\`, pitcherName };
  } else if (action === 'ROE' || action === 'ERROR') {
    cmdType = 'RECORD_ERROR';
    payload = { resultCode: 'ROE', batterId: pId, description: \`Llegó a base por error defensivo (\${pName})\`, pitcherName };
  } else if (action === 'FC' || action === 'FIELDER_CHOICE') {
    cmdType = 'RECORD_OUT';
    payload = { resultCode: 'FC', batterId: pId, description: \`Bola Ocupada (FC) de \${pName}\`, pitcherName };
  } else if (action === 'SB' || action === 'WP' || action === 'PB' || action === 'BK') {
    cmdType = 'RECORD_RUNNER_EVENT';
    const descMap = { 'SB': 'Base Robada (SB)', 'WP': 'Wild Pitch (WP)', 'PB': 'Passed Ball (PB)', 'BK': 'Balk (BK)' };
    payload = { resultCode: action, action, description: descMap[action] || action, pitcherName };
  } else if (action === 'CS' || action === 'PK') {
    cmdType = 'RECORD_RUNNER_EVENT';
    payload = { resultCode: action, action: 'CS', description: action === 'PK' ? \`Pickoff en las bases (PK Out)\` : \`Out Robando (CS)\`, pitcherName };
  }

  `;
  html = html.slice(0, cmdChainStart) + newCmdChain + html.slice(cmdChainEnd);
  console.log('✓ PARTE 2: Lógica completa de las 36 jugadas WBSC en registrarJugadaLive integrada.');
} else {
  console.error('Could not locate cmdType chain in registrarJugadaLive');
}

// =========================================================================
// 3. PARTE 3: Reemplazo de los Stubs de DIAMAX_RT con Firestore Real
// =========================================================================
const rtStart = html.indexOf('const DIAMAX_RT = {');
if (rtStart !== -1) {
  // Find closing };
  let count = 0;
  let idx = rtStart;
  let end = -1;
  while (idx < html.length) {
    if (html[idx] === '{') count++;
    else if (html[idx] === '}') {
      count--;
      if (count === 0) {
        end = html.indexOf(';', idx) + 1;
        break;
      }
    }
    idx++;
  }

  const oldRT = html.slice(rtStart, end);
  const newRT = `// PERSISTENCIA REAL FIRESTORE v2.0 (diamax-pro-f6f16)
  const DIAMAX_RT = {
    isConnected: () => !!window.firestoreDb,
    init: () => initDiamaxFirebase(),
    configure: () => true,
    getClient: () => null,
    getGameId: () => localStorage.getItem('diamax_active_game_id') || 'game_master',

    // 1. Guardar Partido General
    saveGame: async (gameData) => {
      if (!window.firestoreDb) return false;
      const gid = gameData.id || DIAMAX_RT.getGameId();
      try {
        await window.firestoreDb.collection('games').doc(gid).set({
          ...gameData,
          updatedAt: (typeof firebase !== 'undefined' && firebase.firestore) ? firebase.firestore.FieldValue.serverTimestamp() : Date.now()
        }, { merge: true });
        return true;
      } catch(e) {
        console.warn('[DIAMAX FIREBASE] Error guardando juego:', e);
        return false;
      }
    },

    // 2. Guardar Cada Pitcheo Real (Soluciona el stub vacío)
    savePitch: async (tipo, esStrike, velocity = null) => {
      if (!window.firestoreDb) return false;
      const gid = DIAMAX_RT.getGameId();
      try {
        await window.firestoreDb.collection('games').doc(gid).collection('pitches').add({
          tipo: tipo || '4-Seam',
          esStrike: !!esStrike,
          velocity: velocity || 0,
          timestamp: Date.now()
        });
        return true;
      } catch(e) {
        console.warn('[DIAMAX FIREBASE] Error en savePitch:', e);
        return false;
      }
    },

    // 3. Guardar Turno al Bate (Soluciona el stub vacío)
    saveAtBat: async (abData) => {
      if (!window.firestoreDb) return false;
      const gid = DIAMAX_RT.getGameId();
      try {
        await window.firestoreDb.collection('games').doc(gid).collection('atbats').add({
          ...abData,
          createdAt: (typeof firebase !== 'undefined' && firebase.firestore) ? firebase.firestore.FieldValue.serverTimestamp() : Date.now()
        });
        return true;
      } catch(e) {
        console.warn('[DIAMAX FIREBASE] Error en saveAtBat:', e);
        return false;
      }
    },

    // 4. Guardar Evento Canónico
    saveCanonicalEvent: async (ev) => {
      if (!window.firestoreDb) return;
      try {
        const gid = DIAMAX_RT.getGameId();
        await window.firestoreDb.collection('games').doc(gid).collection('events').add({
          ...ev,
          syncedAt: new Date().toISOString()
        });
      } catch(e) {
        console.warn('[DIAMAX FIREBASE] Evento encolado offline:', e);
      }
    },

    // 5. Transmitir Marcador en Vivo (Soluciona el stub vacío)
    syncScore: async (scoreUs, scoreThem, inning, half, outs) => {
      if (!window.firestoreDb) return false;
      const gid = DIAMAX_RT.getGameId();
      try {
        await window.firestoreDb.collection('games').doc(gid).set({
          currentScore: { us: scoreUs, them: scoreThem, inning, half, outs },
          lastSync: (typeof firebase !== 'undefined' && firebase.firestore) ? firebase.firestore.FieldValue.serverTimestamp() : Date.now()
        }, { merge: true });
        return true;
      } catch(e) {
        console.warn('[DIAMAX FIREBASE] Error en syncScore:', e);
        return false;
      }
    },

    // 6. Suscripción en Tiempo Real para Fanáticos y Cabina (Soluciona el stub vacío)
    subscribeToGame: (gid, callback) => {
      if (!window.firestoreDb || !gid) return () => {};
      return window.firestoreDb.collection('games').doc(gid)
        .onSnapshot((doc) => {
          if (doc.exists && typeof callback === 'function') {
            callback(doc.data());
          }
        }, (err) => {
          console.warn('[DIAMAX FIREBASE] Error en subscripción reactiva:', err);
        });
    }
  };`;

  html = html.replace(oldRT, newRT);
  console.log('✓ PARTE 3: DIAMAX_RT actualizado con persistencia real Firestore v2.0.');
} else {
  console.error('Could not find const DIAMAX_RT =');
}

// =========================================================================
// 4. AJUSTES SOLICITADOS POR EL USUARIO:
// - Eliminar botón de registro gratuito de la página principal (conservando los 3 botones oficiales)
// - Reubicar "Prueba Diamax Gratis" al modal de pestañas
// =========================================================================

// En Hero de Page 1:
const regBtnStart = html.indexOf('<!-- Botón 2: REGISTRO OFICIAL -->');
const regBtnEnd = html.indexOf('<!-- Botón 3: INICIAR SESIÓN -->');
if (regBtnStart !== -1 && regBtnEnd !== -1) {
  html = html.slice(0, regBtnStart) + html.slice(regBtnEnd);
  console.log('✓ Botón Registro Gratuito retirado del Hero (quedan los 3 botones oficiales autorizados).');
}

// En el Header de Page 1: retirar el botón "Prueba Diamax Pro gratis" flotante
const headerPruebaMatch = html.match(/<button\s+onclick="showAuthModal\('register'\)"[\s\S]*?>[\s\S]*?Prueba Diamax Pro gratis[\s\S]*?<\/button>/);
if (headerPruebaMatch) {
  html = html.replace(headerPruebaMatch[0], '');
  console.log('✓ Botón "Prueba Diamax Pro gratis" reubicado fuera del header.');
}

// En el Modal: renombrar la pestaña de Registro a "Prueba Diamax Gratis"
const modalRegTextRegex = /<span\s+id="auth-tab-reg-text">[\s\S]*?<\/span>/;
const modalRegMatch = html.match(modalRegTextRegex);
if (modalRegMatch) {
  html = html.replace(modalRegMatch[0], '<span id="auth-tab-reg-text">Prueba Diamax Gratis</span>');
  console.log('✓ Pestaña en el Modal reubicada y nombrada "Prueba Diamax Gratis".');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('✓ index.html successfully updated with all Phase 6 requirements!');
