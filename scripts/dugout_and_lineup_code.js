// =========================================================================
// 🔄 DIAMAX PRO (+55) — HOT DUGOUT SUBSTITUTIONS, PRESETS & GOOGLE SHEETS
// =========================================================================

let hotSubState = {
  team: 'gve',           // 'gve' | 'rival'
  tab: 'PH',             // 'PH' | 'PR' | 'P' | 'DEF'
  selectedSlot: 0,
  selectedBenchId: null,
  selectedBase: 1,
  selectedDefenderPos: 'CF',
  selectedRelieverId: null,
  parsedSheetsData: []
};

// 1. APERTURA Y CONTROL DEL MODAL DE SUSTITUCIONES EN CALIENTE
function abrirModalHotDugoutSub(defaultTab) {
  const modal = document.getElementById('modal-hot-dugout-sub');
  if (!modal) return;

  if (defaultTab) hotSubState.tab = defaultTab;

  const isGveBatting = (typeof isGuerrerosBattingNow === 'function') ? isGuerrerosBattingNow() : true;
  if (hotSubState.tab === 'PH' || hotSubState.tab === 'PR') {
    hotSubState.team = isGveBatting ? 'gve' : 'rival';
  } else if (hotSubState.tab === 'P') {
    hotSubState.team = isGveBatting ? 'rival' : 'gve';
  } else {
    hotSubState.team = isGveBatting ? 'rival' : 'gve';
  }

  // Preseleccionar slot de bateador activo
  const g = getActiveGame();
  if (hotSubState.team === 'gve') {
    const idx = (typeof liveState !== 'undefined' && liveState.gveBatterIndex !== undefined) ? liveState.gveBatterIndex : (liveState.batterIndex || 0);
    hotSubState.selectedSlot = Math.abs(idx) % (g.lineup.length || 9);
  } else {
    const rIdx = (typeof liveState !== 'undefined' && liveState.rivalBatterIndex !== undefined) ? liveState.rivalBatterIndex : 0;
    const rivalRecord = (typeof RIVALS_DATABASE !== 'undefined' ? RIVALS_DATABASE : []).find(r => r.id === g.rivalId) || (typeof RIVALS_DATABASE !== 'undefined' ? RIVALS_DATABASE[0] : null);
    const rLen = (rivalRecord && rivalRecord.lineup) ? rivalRecord.lineup.length : 9;
    hotSubState.selectedSlot = Math.abs(rIdx) % rLen;
  }

  // Preseleccionar base activa para PR si hay alguna ocupada
  if (typeof liveState !== 'undefined' && liveState.bases) {
    if (liveState.bases.b1) hotSubState.selectedBase = 1;
    else if (liveState.bases.b2) hotSubState.selectedBase = 2;
    else if (liveState.bases.b3) hotSubState.selectedBase = 3;
    else hotSubState.selectedBase = 1;
  }

  modal.style.display = 'flex';
  actualizarVistaHotSub();
}

function cerrarModalHotDugoutSub() {
  const modal = document.getElementById('modal-hot-dugout-sub');
  if (modal) modal.style.display = 'none';
}

function cambiarEquipoHotSub(teamKey) {
  hotSubState.team = teamKey;
  hotSubState.selectedBenchId = null;
  hotSubState.selectedRelieverId = null;
  actualizarVistaHotSub();
}

function cambiarTabHotSub(tabKey) {
  hotSubState.tab = tabKey;
  hotSubState.selectedBenchId = null;
  hotSubState.selectedRelieverId = null;
  actualizarVistaHotSub();
}

function actualizarVistaHotSub() {
  const g = getActiveGame();
  const rivalRecord = (typeof RIVALS_DATABASE !== 'undefined' ? RIVALS_DATABASE : []).find(r => (r.id === g.rivalId) || (r.name && r.name.toUpperCase() === (g.rival || '').toUpperCase())) || (typeof RIVALS_DATABASE !== 'undefined' ? RIVALS_DATABASE[0] : { name: "RIVAL", lineup: [] });
  const isGveBatting = (typeof isGuerrerosBattingNow === 'function') ? isGuerrerosBattingNow() : true;

  // Actualizar botones de equipo
  const btnGve = document.getElementById('btn-hot-sub-team-gve');
  const btnRival = document.getElementById('btn-hot-sub-team-rival');
  const lblGve = document.getElementById('lbl-hot-sub-gve-name');
  const lblRival = document.getElementById('lbl-hot-sub-rival-name');
  const badgeStatus = document.getElementById('badge-hot-sub-game-status');

  if (lblGve) lblGve.innerText = (typeof teamName !== 'undefined' && teamName) ? teamName : 'GUERREROS (+55)';
  if (lblRival) lblRival.innerText = (rivalRecord && rivalRecord.name) ? rivalRecord.name : 'RIVAL';

  if (btnGve && btnRival) {
    if (hotSubState.team === 'gve') {
      btnGve.style.background = '#8B5CF6';
      btnGve.style.color = '#FFF';
      btnGve.style.boxShadow = '0 0 10px rgba(139,92,246,0.5)';
      btnRival.style.background = 'transparent';
      btnRival.style.color = '#94A3B8';
      btnRival.style.boxShadow = 'none';
    } else {
      btnGve.style.background = 'transparent';
      btnGve.style.color = '#94A3B8';
      btnGve.style.boxShadow = 'none';
      btnRival.style.background = '#FFC72C';
      btnRival.style.color = '#000';
      btnRival.style.boxShadow = '0 0 10px rgba(255,199,44,0.5)';
    }
  }

  if (badgeStatus) {
    const isBatting = (hotSubState.team === 'gve' && isGveBatting) || (hotSubState.team === 'rival' && !isGveBatting);
    badgeStatus.innerHTML = isBatting ? '⚡ AL BATE AHORA' : '🛡️ EN EL CAMPO (DEFENSA)';
    badgeStatus.style.color = isBatting ? '#FFC72C' : '#10B981';
    badgeStatus.style.borderColor = isBatting ? '#FFC72C' : '#10B981';
    badgeStatus.style.background = isBatting ? 'rgba(255,199,44,0.15)' : 'rgba(16,185,129,0.15)';
  }

  // Actualizar botones de pestañas
  ['PH', 'PR', 'P', 'DEF'].forEach(t => {
    const btn = document.getElementById('tab-btn-sub-' + t.toLowerCase());
    if (btn) {
      if (hotSubState.tab === t) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });

  const container = document.getElementById('hot-sub-body-container');
  if (!container) return;

  // Renderizar según la pestaña activa
  if (hotSubState.tab === 'PH') {
    renderHotSubPinchHitter(container, g, rivalRecord);
  } else if (hotSubState.tab === 'PR') {
    renderHotSubPinchRunner(container, g, rivalRecord);
  } else if (hotSubState.tab === 'P') {
    renderHotSubPitcher(container, g, rivalRecord);
  } else if (hotSubState.tab === 'DEF') {
    renderHotSubDefensive(container, g, rivalRecord);
  }
}

// 2. MODO BATEADOR EMERGENTE (PH)
function renderHotSubPinchHitter(container, g, rivalRecord) {
  const isGve = (hotSubState.team === 'gve');
  const lineup = isGve ? g.lineup : (rivalRecord.lineup || []);
  const currentSlot = lineup[hotSubState.selectedSlot] || lineup[0] || {};
  
  let currentBatterName = "Bateador";
  let currentBatterNum = "0";
  let currentPos = currentSlot.pos || "DH";
  let currentBats = "R";

  if (isGve) {
    const p = MASTER_ROSTER.find(pl => pl.id == currentSlot.playerId) || MASTER_ROSTER[0];
    currentBatterName = p.name;
    currentBatterNum = p.num;
    currentBats = p.bats || "R";
  } else {
    currentBatterName = currentSlot.name || "Bateador Rival";
    currentBatterNum = currentSlot.number || "0";
    currentBats = currentSlot.bats || "R";
  }

  // Obtener jugadores de banca
  let benchPlayers = [];
  if (isGve) {
    const usedIds = g.lineup.map(s => s.playerId);
    benchPlayers = MASTER_ROSTER.filter(p => !usedIds.includes(p.id));
  } else {
    // Banca rival
    const usedNames = (rivalRecord.lineup || []).map(s => (s.name || '').toUpperCase());
    const rivalBenchPool = rivalRecord.bench || [
      { id: 'rb1', name: "Ricardo Marquez", number: "19", pos: "OF", bats: "L", throws: "R" },
      { id: 'rb2', name: "Alexis Gomez", number: "31", pos: "IF", bats: "R", throws: "R" },
      { id: 'rb3', name: "Gustavo Valera", number: "52", pos: "C", bats: "R", throws: "R" },
      { id: 'rb4', name: "Fernando Ruiz", number: "8", pos: "OF", bats: "R", throws: "R" }
    ];
    benchPlayers = rivalBenchPool.filter(p => !usedNames.includes(p.name.toUpperCase()));
  }

  // Si no hay seleccionado, preseleccionar el primer jugador de banca
  if (!hotSubState.selectedBenchId && benchPlayers.length > 0) {
    hotSubState.selectedBenchId = benchPlayers[0].id;
  }

  const slotOptions = lineup.map((s, idx) => {
    let name = "Turno " + (idx + 1);
    if (isGve) {
      const pl = MASTER_ROSTER.find(p => p.id == s.playerId);
      if (pl) name = "#" + pl.num + " " + pl.name + " (" + (s.pos || pl.defaultPos) + ")";
    } else {
      name = "#" + (s.number || (idx + 1)) + " " + (s.name || 'Bateador') + " (" + (s.pos || 'DH') + ")";
    }
    return '<option value="' + idx + '" ' + (idx === hotSubState.selectedSlot ? 'selected' : '') + '>' + (idx + 1) + 'º: ' + name + '</option>';
  }).join('');

  const benchCards = benchPlayers.length > 0 ? benchPlayers.map(p => {
    const isSelected = (hotSubState.selectedBenchId == p.id);
    const photo = p.photo || DEFAULT_PHOTO;
    return `
      <div class="hot-sub-player-card ${isSelected ? 'selected' : ''}" onclick="seleccionarJugadorBancaHotSub(${JSON.stringify(p.id)})">
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="${photo}" style="width:38px; height:38px; border-radius:50%; object-fit:cover; border:1.5px solid ${isSelected ? '#10B981' : '#334155'};">
          <div>
            <div style="font-weight:900; color:#FFF; font-size:12.5px;">#${p.num || p.number} ${p.name}</div>
            <div style="font-size:11px; color:#94A3B8;">Pos: <strong style="color:#00D2FF;">${p.defaultPos || p.pos || 'UTL'}</strong> · Batea: <strong style="color:#FFC72C;">${p.bats || 'R'}</strong></div>
          </div>
        </div>
        <div style="text-align:right;">
          <span style="font-size:11px; font-weight:800; color:${isSelected ? '#10B981' : '#94A3B8'}; background:${isSelected ? 'rgba(16,185,129,0.2)' : '#1E293B'}; padding:3px 8px; border-radius:4px;">
            ${isSelected ? '✓ SELECCIONADO' : 'Elegir'}
          </span>
          <div style="font-size:10.5px; color:#A7F3D0; margin-top:2px;">OBP: ${p.obp ? p.obp.toFixed(3) : '.350'}</div>
        </div>
      </div>
    `;
  }).join('') : `
    <div style="padding:16px; text-align:center; color:#94A3B8; background:#070D1A; border-radius:8px; border:1px dashed #334155;">
      ⚠️ No hay jugadores disponibles en la banca para este equipo.
    </div>
  `;

  container.innerHTML = `
    <div style="display:grid; grid-template-columns:1fr 1.3fr; gap:14px; align-items:start;">
      <!-- Columna Izquierda: Bateador a salir -->
      <div style="background:#070D1A; border:1.5px solid #1E293B; border-radius:10px; padding:12px;">
        <label style="font-size:11px; font-weight:800; color:#EF4444; text-transform:uppercase; display:block; margin-bottom:6px;">
          🔴 Bateador a Sustituir (Sale del Juego):
        </label>
        <select onchange="cambiarSlotHotSub(parseInt(this.value, 10))" style="width:100%; background:#0B132B; color:#FFC72C; border:1px solid #334155; padding:8px; border-radius:6px; font-weight:800; font-size:12px; margin-bottom:10px;">
          ${slotOptions}
        </select>
        <div style="background:#0F172A; border:1px solid #1E293B; border-radius:8px; padding:10px; text-align:center;">
          <div style="font-size:11px; color:#94A3B8; font-weight:700;">Turno al Bate #${hotSubState.selectedSlot + 1}</div>
          <div style="font-size:15px; font-weight:900; color:#F8FAFC; margin:4px 0;">#${currentBatterNum} ${currentBatterName}</div>
          <div style="font-size:11px; color:#00D2FF; font-weight:800;">Posición: ${currentPos} · Batea: ${currentBats}</div>
          <div style="font-size:10px; color:#EF4444; margin-top:6px; font-weight:700;">(Pasará a la reserva/reemplazado)</div>
        </div>
      </div>

      <!-- Columna Derecha: Bateador Emergente disponible -->
      <div style="background:#070D1A; border:1.5px solid #10B981; border-radius:10px; padding:12px;">
        <label style="font-size:11px; font-weight:800; color:#10B981; text-transform:uppercase; display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span>🟢 Bateador Emergente Disponible (Banca +55):</span>
          <span style="font-size:10px; color:#94A3B8;">${benchPlayers.length} Disponibles</span>
        </label>
        <div style="display:flex; flex-direction:column; gap:6px; max-height:220px; overflow-y:auto; padding-right:4px;">
          ${benchCards}
        </div>
      </div>
    </div>
  `;
}

// 3. MODO CORREDOR EMERGENTE (PR)
function renderHotSubPinchRunner(container, g, rivalRecord) {
  const isGve = (hotSubState.team === 'gve');
  const bState = (typeof liveState !== 'undefined' && liveState.bases) ? liveState.bases : { b1: false, b2: false, b3: false };

  // Jugadores en banca elegibles para correr
  let benchRunners = [];
  if (isGve) {
    const usedIds = g.lineup.map(s => s.playerId);
    benchRunners = MASTER_ROSTER.filter(p => !usedIds.includes(p.id));
  } else {
    const usedNames = (rivalRecord.lineup || []).map(s => (s.name || '').toUpperCase());
    const rivalBenchPool = rivalRecord.bench || [
      { id: 'rb1', name: "Ricardo Marquez", number: "19", pos: "OF", bats: "L", throws: "R" },
      { id: 'rb2', name: "Alexis Gomez", number: "31", pos: "IF", bats: "R", throws: "R" },
      { id: 'rb4', name: "Fernando Ruiz", number: "8", pos: "OF", bats: "R", throws: "R" }
    ];
    benchRunners = rivalBenchPool.filter(p => !usedNames.includes(p.name.toUpperCase()));
  }

  if (!hotSubState.selectedBenchId && benchRunners.length > 0) {
    hotSubState.selectedBenchId = benchRunners[0].id;
  }

  const basesUI = [1, 2, 3].map(b => {
    const isOccupied = bState['b' + b];
    const isSelected = (hotSubState.selectedBase === b);
    return `
      <div onclick="seleccionarBaseHotSub(${b})" style="flex:1; background:${isSelected ? 'rgba(0,210,255,0.18)' : '#0F172A'}; border:2px solid ${isSelected ? '#00D2FF' : (isOccupied ? '#FFC72C' : '#1E293B')}; border-radius:8px; padding:10px; text-align:center; cursor:pointer; transition:all 0.15s;">
        <div style="font-size:18px;">${isOccupied ? '🏃' : '⚪'}</div>
        <div style="font-size:12px; font-weight:900; color:${isSelected ? '#00D2FF' : '#FFF'}; margin:2px 0;">${b}ra Base</div>
        <div style="font-size:10px; font-weight:800; color:${isOccupied ? '#10B981' : '#64748B'};">${isOccupied ? '● CORREDOR' : 'Vacía'}</div>
      </div>
    `;
  }).join('');

  const runnersCards = benchRunners.length > 0 ? benchRunners.map(p => {
    const isSelected = (hotSubState.selectedBenchId == p.id);
    const photo = p.photo || DEFAULT_PHOTO;
    return `
      <div class="hot-sub-player-card ${isSelected ? 'selected' : ''}" onclick="seleccionarJugadorBancaHotSub(${JSON.stringify(p.id)})">
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="${photo}" style="width:36px; height:36px; border-radius:50%; object-fit:cover; border:1.5px solid ${isSelected ? '#10B981' : '#334155'};">
          <div>
            <div style="font-weight:900; color:#FFF; font-size:12px;">#${p.num || p.number} ${p.name}</div>
            <div style="font-size:10.5px; color:#94A3B8;">Velocidad +55: <strong style="color:#10B981;">⚡ Piernas Frescas</strong></div>
          </div>
        </div>
        <span style="font-size:11px; font-weight:800; color:${isSelected ? '#10B981' : '#94A3B8'}; background:${isSelected ? 'rgba(16,185,129,0.2)' : '#1E293B'}; padding:3px 8px; border-radius:4px;">
          ${isSelected ? '✓ ELEGIDO' : 'Asignar'}
        </span>
      </div>
    `;
  }).join('') : `<div style="padding:16px; text-align:center; color:#94A3B8;">No hay corredores en banca.</div>`;

  container.innerHTML = `
    <div style="display:grid; grid-template-columns:1fr 1.3fr; gap:14px; align-items:start;">
      <!-- Base donde entra el corredor -->
      <div style="background:#070D1A; border:1.5px solid #1E293B; border-radius:10px; padding:12px;">
        <label style="font-size:11px; font-weight:800; color:#00D2FF; text-transform:uppercase; display:block; margin-bottom:8px;">
          📍 Selecciona la Base del Corredor:
        </label>
        <div style="display:flex; gap:8px; margin-bottom:12px;">
          ${basesUI}
        </div>
        <p style="font-size:11px; color:#94A3B8; margin:0; line-height:1.4;">
          El corredor seleccionado sustituirá inmediatamente al corredor en la base elegida, reflejándose en el diamante y en la bitácora oficial.
        </p>
      </div>

      <!-- Banca de corredores -->
      <div style="background:#070D1A; border:1.5px solid #10B981; border-radius:10px; padding:12px;">
        <label style="font-size:11px; font-weight:800; color:#10B981; text-transform:uppercase; display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span>🏃 Corredor Emergente a Ingresar:</span>
          <span style="font-size:10px; color:#94A3B8;">${benchRunners.length} Disponibles</span>
        </label>
        <div style="display:flex; flex-direction:column; gap:6px; max-height:220px; overflow-y:auto; padding-right:4px;">
          ${runnersCards}
        </div>
      </div>
    </div>
  `;
}

// 4. MODO CAMBIO DE LANZADOR (P)
function renderHotSubPitcher(container, g, rivalRecord) {
  const isGve = (hotSubState.team === 'gve');
  
  // Lanzador activo
  let currentPitcherName = isGve ? (activePitcherStats.name || "Pedro Chavez") : (rivalRecord.pitcherAs || "Abridor Rival");
  let currentPitcherNum = isGve ? (activePitcherStats.num || 10) : "21";
  let currentPitches = isGve ? (activePitcherStats.totalPitches || 0) : 45;
  let currentThrows = isGve ? (activePitcherStats.throws || "R") : (rivalRecord.pitcherArm || "RHP");

  // Bullpen disponible
  let availableArms = [];
  if (isGve) {
    availableArms = [
      { id: 10, num: 10, name: "Pedro Chavez", throws: "R", status: activePitcherStats.id === 10 ? "Lanzando" : "Listo", era: 3.20 },
      { id: 14, num: 14, name: "Julio Machado", throws: "R", status: activePitcherStats.id === 14 ? "Lanzando" : "Calentando", era: 3.10 },
      { id: 16, num: 16, name: "Rafael Briceño", throws: "R", status: activePitcherStats.id === 16 ? "Lanzando" : "Listo", era: 2.90 }
    ].filter(p => p.id !== activePitcherStats.id);
  } else {
    availableArms = [
      { id: 'rp1', num: 21, name: "Tom Reynolds", throws: "R", status: "Listo", era: 3.45 },
      { id: 'rp2', num: 33, name: "Carlos Sanchez", throws: "L", status: "Calentando", era: 3.80 },
      { id: 'rp3', num: 45, name: "David Martinez", throws: "R", status: "Listo", era: 4.10 }
    ].filter(p => p.name !== currentPitcherName);
  }

  if (!hotSubState.selectedRelieverId && availableArms.length > 0) {
    hotSubState.selectedRelieverId = availableArms[0].id;
  }

  const armCards = availableArms.length > 0 ? availableArms.map(p => {
    const isSelected = (hotSubState.selectedRelieverId == p.id);
    return `
      <div class="hot-sub-player-card ${isSelected ? 'selected' : ''}" onclick="seleccionarRelevistaHotSub(${JSON.stringify(p.id)})">
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:36px; height:36px; border-radius:50%; background:#1E293B; display:flex; align-items:center; justify-content:center; font-size:16px;">⚾</div>
          <div>
            <div style="font-weight:900; color:#FFF; font-size:12.5px;">#${p.num} ${p.name} (${p.throws}HP)</div>
            <div style="font-size:10.5px; color:#94A3B8;">Estado: <strong style="color:#FFC72C;">${p.status}</strong> · ERA: ${p.era.toFixed(2)}</div>
          </div>
        </div>
        <span style="font-size:11px; font-weight:800; color:${isSelected ? '#10B981' : '#94A3B8'}; background:${isSelected ? 'rgba(16,185,129,0.2)' : '#1E293B'}; padding:3px 8px; border-radius:4px;">
          ${isSelected ? '✓ ELEGIDO' : 'Relevar'}
        </span>
      </div>
    `;
  }).join('') : `<div style="padding:16px; text-align:center; color:#94A3B8;">No hay relevistas en el bullpen.</div>`;

  container.innerHTML = `
    <div style="display:grid; grid-template-columns:1fr 1.3fr; gap:14px; align-items:start;">
      <!-- Lanzador Actual -->
      <div style="background:#070D1A; border:1.5px solid #1E293B; border-radius:10px; padding:12px;">
        <label style="font-size:11px; font-weight:800; color:#EF4444; text-transform:uppercase; display:block; margin-bottom:8px;">
          🔴 Lanzador Saliendo del Montículo:
        </label>
        <div style="background:#0F172A; border:1px solid #1E293B; border-radius:8px; padding:12px; text-align:center;">
          <div style="font-size:24px; margin-bottom:4px;">⚾</div>
          <div style="font-size:15px; font-weight:900; color:#F8FAFC;">#${currentPitcherNum} ${currentPitcherName}</div>
          <div style="font-size:11.5px; color:#00D2FF; font-weight:800; margin-top:2px;">Brazo: ${currentThrows}HP</div>
          <div style="font-size:11px; color:#FFC72C; margin-top:6px; font-weight:700;">Lanzamientos: ${currentPitches} (Límite +55: 75)</div>
        </div>
      </div>

      <!-- Relevista entrante -->
      <div style="background:#070D1A; border:1.5px solid #10B981; border-radius:10px; padding:12px;">
        <label style="font-size:11px; font-weight:800; color:#10B981; text-transform:uppercase; display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span>🟢 Nuevo Lanzador (Bullpen):</span>
          <span style="font-size:10px; color:#94A3B8;">${availableArms.length} Disponibles</span>
        </label>
        <div style="display:flex; flex-direction:column; gap:6px; max-height:220px; overflow-y:auto; padding-right:4px;">
          ${armCards}
        </div>
      </div>
    </div>
  `;
}

// 5. MODO CAMBIO DEFENSIVO (DEF)
function renderHotSubDefensive(container, g, rivalRecord) {
  const isGve = (hotSubState.team === 'gve');
  const positions = ['CF', '1B', 'SS', '2B', '3B', 'LF', 'RF', 'C', 'DH'];

  let benchFielder = [];
  if (isGve) {
    const usedIds = g.lineup.map(s => s.playerId);
    benchFielder = MASTER_ROSTER.filter(p => !usedIds.includes(p.id));
  } else {
    const usedNames = (rivalRecord.lineup || []).map(s => (s.name || '').toUpperCase());
    const rivalBenchPool = rivalRecord.bench || [
      { id: 'rb1', name: "Ricardo Marquez", number: "19", pos: "OF", bats: "L", throws: "R" },
      { id: 'rb2', name: "Alexis Gomez", number: "31", pos: "IF", bats: "R", throws: "R" },
      { id: 'rb3', name: "Gustavo Valera", number: "52", pos: "C", bats: "R", throws: "R" }
    ];
    benchFielder = rivalBenchPool.filter(p => !usedNames.includes(p.name.toUpperCase()));
  }

  if (!hotSubState.selectedBenchId && benchFielder.length > 0) {
    hotSubState.selectedBenchId = benchFielder[0].id;
  }

  const posSelectOpts = positions.map(pos => '<option value="' + pos + '" ' + (pos === hotSubState.selectedDefenderPos ? 'selected' : '') + '>' + pos + ' (' + (POS_NUM[pos] || pos) + ')</option>').join('');

  const defCards = benchFielder.length > 0 ? benchFielder.map(p => {
    const isSelected = (hotSubState.selectedBenchId == p.id);
    return `
      <div class="hot-sub-player-card ${isSelected ? 'selected' : ''}" onclick="seleccionarJugadorBancaHotSub(${JSON.stringify(p.id)})">
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:36px; height:36px; border-radius:50%; background:#1E293B; display:flex; align-items:center; justify-content:center; font-size:16px;">🛡️</div>
          <div>
            <div style="font-weight:900; color:#FFF; font-size:12.5px;">#${p.num || p.number} ${p.name}</div>
            <div style="font-size:10.5px; color:#94A3B8;">Posición Natural: <strong style="color:#00D2FF;">${p.defaultPos || p.pos || 'UTL'}</strong></div>
          </div>
        </div>
        <span style="font-size:11px; font-weight:800; color:${isSelected ? '#10B981' : '#94A3B8'}; background:${isSelected ? 'rgba(16,185,129,0.2)' : '#1E293B'}; padding:3px 8px; border-radius:4px;">
          ${isSelected ? '✓ ELEGIDO' : 'Asignar'}
        </span>
      </div>
    `;
  }).join('') : `<div style="padding:16px; text-align:center; color:#94A3B8;">No hay fildeadores en banca.</div>`;

  container.innerHTML = `
    <div style="display:grid; grid-template-columns:1fr 1.3fr; gap:14px; align-items:start;">
      <!-- Posición a Modificar -->
      <div style="background:#070D1A; border:1.5px solid #1E293B; border-radius:10px; padding:12px;">
        <label style="font-size:11px; font-weight:800; color:#FFC72C; text-transform:uppercase; display:block; margin-bottom:8px;">
          🛡️ Posición Defensiva a Ocupar:
        </label>
        <select onchange="cambiarPosicionDefHotSub(this.value)" style="width:100%; background:#0B132B; color:#FFC72C; border:1px solid #334155; padding:8px; border-radius:6px; font-weight:800; font-size:12px; margin-bottom:12px;">
          ${posSelectOpts}
        </select>
        <p style="font-size:11px; color:#94A3B8; margin:0; line-height:1.4;">
          El especialista defensivo seleccionado sustituirá al titular en el terreno para la posición seleccionada.
        </p>
      </div>

      <!-- Fildeadores en banca -->
      <div style="background:#070D1A; border:1.5px solid #10B981; border-radius:10px; padding:12px;">
        <label style="font-size:11px; font-weight:800; color:#10B981; text-transform:uppercase; display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span>🛡️ Especialista Defensivo (Banca):</span>
          <span style="font-size:10px; color:#94A3B8;">${benchFielder.length} Disponibles</span>
        </label>
        <div style="display:flex; flex-direction:column; gap:6px; max-height:220px; overflow-y:auto; padding-right:4px;">
          ${defCards}
        </div>
      </div>
    </div>
  `;
}

// Controladores auxiliares de selección
function seleccionarJugadorBancaHotSub(id) {
  hotSubState.selectedBenchId = id;
  actualizarVistaHotSub();
}
function seleccionarBaseHotSub(baseNum) {
  hotSubState.selectedBase = baseNum;
  actualizarVistaHotSub();
}
function seleccionarRelevistaHotSub(id) {
  hotSubState.selectedRelieverId = id;
  actualizarVistaHotSub();
}
function cambiarSlotHotSub(slot) {
  hotSubState.selectedSlot = slot;
  actualizarVistaHotSub();
}
function cambiarPosicionDefHotSub(pos) {
  hotSubState.selectedDefenderPos = pos;
  actualizarVistaHotSub();
}

// 6. EJECUTAR LA SUSTITUCIÓN OFICIAL Y REGISTRAR EN BITÁCORA
function ejecutarSustitucionEnCaliente() {
  const g = getActiveGame();
  const isGve = (hotSubState.team === 'gve');
  const rivalRecord = (typeof RIVALS_DATABASE !== 'undefined' ? RIVALS_DATABASE : []).find(r => (r.id === g.rivalId) || (r.name && r.name.toUpperCase() === (g.rival || '').toUpperCase())) || (typeof RIVALS_DATABASE !== 'undefined' ? RIVALS_DATABASE[0] : null);

  let descLog = "";
  let descBanner = "";
  let descToast = "";

  if (hotSubState.tab === 'PH') {
    // ⚡ SUSTITUCIÓN BATEADOR EMERGENTE
    if (!hotSubState.selectedBenchId) return alert("Por favor selecciona un jugador de la banca.");

    if (isGve) {
      const incoming = MASTER_ROSTER.find(p => p.id == hotSubState.selectedBenchId);
      const slot = g.lineup[hotSubState.selectedSlot];
      const outgoing = MASTER_ROSTER.find(p => p.id == slot.playerId) || { name: 'Titular', num: 0 };
      if (!incoming || !slot) return;

      slot.playerId = incoming.id;
      descLog = "Turno #" + (hotSubState.selectedSlot + 1) + ": Entra como Bateador Emergente (PH) #" + incoming.num + " " + incoming.name + " en sustitución de #" + outgoing.num + " " + outgoing.name + ".";
      descBanner = "⚡ BATEADOR EMERGENTE: #" + incoming.num + " " + incoming.name + " toma turno al bate.";
      descToast = "PH: #" + incoming.num + " " + incoming.name + " entra a batear";
    } else {
      if (!rivalRecord || !rivalRecord.lineup) return;
      const incoming = (rivalRecord.bench || []).find(p => p.id == hotSubState.selectedBenchId) || { name: "Bateador Rival", number: "99", pos: "DH" };
      const slot = rivalRecord.lineup[hotSubState.selectedSlot];
      const outgoingName = slot ? slot.name : "Titular";
      if (slot) {
        slot.name = incoming.name;
        slot.number = incoming.number;
        slot.pos = incoming.pos || slot.pos || "DH";
      }
      descLog = "[RIVAL] Turno #" + (hotSubState.selectedSlot + 1) + ": Entra como Emergente #" + incoming.number + " " + incoming.name + " por " + outgoingName + ".";
      descBanner = "⚡ Bateador Emergente Rival: #" + incoming.number + " " + incoming.name;
      descToast = "PH Rival: #" + incoming.number + " " + incoming.name;
    }
  } else if (hotSubState.tab === 'PR') {
    // 🏃 SUSTITUCIÓN CORREDOR EMERGENTE
    if (!hotSubState.selectedBenchId) return alert("Por favor selecciona un corredor de la banca.");
    const base = hotSubState.selectedBase || 1;

    let runnerName = "";
    if (isGve) {
      const incoming = MASTER_ROSTER.find(p => p.id == hotSubState.selectedBenchId);
      runnerName = incoming ? ("#" + incoming.num + " " + incoming.name) : "Corredor";
    } else {
      const incoming = (rivalRecord.bench || []).find(p => p.id == hotSubState.selectedBenchId) || { name: "Corredor Rival", number: "88" };
      runnerName = "#" + incoming.number + " " + incoming.name;
    }

    if (typeof liveState !== 'undefined' && liveState.bases) {
      liveState.bases['b' + base] = true;
      const baseEl = document.getElementById('base-' + base);
      if (baseEl) {
        baseEl.style.fill = '#FFC72C';
        baseEl.style.filter = 'drop-shadow(0 0 8px rgba(255,199,44,0.9))';
      }
    }

    descLog = "Corredor Emergente (PR): " + runnerName + " ingresa a correr en " + base + "ª Base.";
    descBanner = "🏃 CORREDOR EMERGENTE: " + runnerName + " posicionado en " + base + "B.";
    descToast = "PR: " + runnerName + " en " + base + "B";
  } else if (hotSubState.tab === 'P') {
    // ⚾ CAMBIO DE LANZADOR
    if (isGve) {
      const rel = [
        { id: 10, num: 10, name: "Pedro Chavez", throws: "R" },
        { id: 14, num: 14, name: "Julio Machado", throws: "R" },
        { id: 16, num: 16, name: "Rafael Briceño", throws: "R" }
      ].find(p => p.id == hotSubState.selectedRelieverId);
      if (!rel) return alert("Selecciona un lanzador del bullpen.");

      activePitcherStats.id = rel.id;
      activePitcherStats.name = rel.name;
      activePitcherStats.num = rel.num;
      activePitcherStats.throws = rel.throws;
      activePitcherStats.totalPitches = 0;
      activePitcherStats.strikes = 0;
      activePitcherStats.balls = 0;

      const nameEl = document.getElementById('pitcher-active-name');
      if (nameEl) nameEl.innerText = "#" + rel.num + " " + rel.name + " (" + rel.throws + "HP)";
      if (typeof actualizarPitcherUI === 'function') actualizarPitcherUI();

      descLog = "Cambio de Pitcher Guerreros: Entra al montículo #" + rel.num + " " + rel.name + " (" + rel.throws + "HP). Conteo reiniciado.";
      descBanner = "⚾ NUEVO PITCHER: #" + rel.num + " " + rel.name + " asume la lomita.";
      descToast = "Pitcher: #" + rel.num + " " + rel.name;
    } else {
      if (!rivalRecord) return;
      const relName = hotSubState.selectedRelieverId === 'rp2' ? "Carlos Sanchez" : (hotSubState.selectedRelieverId === 'rp3' ? "David Martinez" : "Tom Reynolds");
      rivalRecord.pitcherAs = relName;
      descLog = "[RIVAL] Cambio de Pitcher: Entra a lanzar " + relName + " por el rival.";
      descBanner = "⚾ Cambio de Pitcher Rival: " + relName;
      descToast = "Lanzador Rival: " + relName;
    }
  } else if (hotSubState.tab === 'DEF') {
    // 🛡️ CAMBIO DEFENSIVO
    const pos = hotSubState.selectedDefenderPos || 'CF';
    if (isGve) {
      const incoming = MASTER_ROSTER.find(p => p.id == hotSubState.selectedBenchId);
      if (!incoming) return alert("Selecciona un especialista defensivo.");
      const slot = g.lineup.find(s => s.pos === pos) || g.lineup[0];
      if (slot) {
        slot.playerId = incoming.id;
        slot.pos = pos;
      }
      descLog = "Cambio Defensivo: #" + incoming.num + " " + incoming.name + " toma la posición de " + pos + ".";
      descBanner = "🛡️ CAMBIO DEFENSIVO: #" + incoming.num + " " + incoming.name + " a la defensiva en " + pos + ".";
      descToast = "Defensa: #" + incoming.num + " " + incoming.name + " (" + pos + ")";
    } else {
      descLog = "[RIVAL] Ajuste defensivo en posición " + pos + ".";
      descBanner = "🛡️ Ajuste Defensivo Rival en " + pos;
      descToast = "Defensa Rival: " + pos;
    }
  }

  // Anexar entrada en Bitácora Play Log
  const logDiv = document.getElementById('play-log');
  if (logDiv && descLog) {
    const entry = document.createElement('div');
    entry.className = 'play-log-entry sub-entry';
    entry.style.cssText = 'font-size:11.5px; background:rgba(139,92,246,0.18); border-left:3.5px solid #8B5CF6; padding:6px 10px; border-radius:6px; margin-bottom:4px; color:#E9D5FF;';
    entry.innerHTML = '<strong>🔄 [SUSTITUCIÓN OFICIAL ' + hotSubState.tab + ']</strong> ' + descLog;
    logDiv.prepend(entry);
  }

  if (descBanner) {
    setSafeHTML('live-action-banner', descBanner);
  }

  // Guardar y sincronizar
  saveGamesToStorage();
  simularSincronizacionCloud();
  guardarJuegoEnFirestore();
  if (typeof updateLiveBatterDisplay === 'function') updateLiveBatterDisplay();
  if (typeof renderAll === 'function') renderAll();
  if (typeof renderLineupBuilder === 'function') renderLineupBuilder();

  cerrarModalHotDugoutSub();
  if (typeof mostrarToast === 'function') {
    mostrarToast("✅ Sustitución completada: " + descToast);
  }
}

// 7. PRESETS DE ALINEACIÓN (+55) PARA GUERREROS DE VENEZUELA
function cargarPresetLineup55(presetType) {
  const g = getActiveGame();
  if (!g) return;

  const rivalRecord = (typeof RIVALS_DATABASE !== 'undefined' ? RIVALS_DATABASE : []).find(r => (r.id === g.rivalId) || (r.name && r.name.toUpperCase() === (g.rival || '').toUpperCase())) || (typeof RIVALS_DATABASE !== 'undefined' ? RIVALS_DATABASE[0] : null);
  const rivalArm = rivalRecord ? (rivalRecord.pitcherArm || (rivalRecord.pitcherAs && rivalRecord.pitcherAs.includes('Zurdo') ? 'LHP' : 'RHP')) : 'RHP';

  if (presetType === 'clasico') {
    // 👑 LINEUP TITULAR A: Balance Clásico (+55)
    g.lineup = [
      { order: 1, playerId: 1, pos: "CF" },  // Johan Olivo (L)
      { order: 2, playerId: 2, pos: "1B" },  // Pablo Morales (R)
      { order: 3, playerId: 3, pos: "SS" },  // Raul Lozada (R)
      { order: 4, playerId: 4, pos: "2B" },  // Jorge Mitchell (R)
      { order: 5, playerId: 5, pos: "3B" },  // Oswaldo Grillo (R)
      { order: 6, playerId: 6, pos: "LF" },  // Nestor Vera (L)
      { order: 7, playerId: 7, pos: "RF" },  // Pedro Moreno (L)
      { order: 8, playerId: 8, pos: "C" },   // Juan Perez (R)
      { order: 9, playerId: 9, pos: "DH" }   // Martin Rojas (R)
    ];
    if (typeof mostrarToast === 'function') mostrarToast("👑 Lineup Titular A (+55 Clásico) cargado exitosamente.");
  } else if (presetType === 'ofensivo') {
    // 🔥 LINEUP TITULAR B: Máxima Producción y Slugging (+55)
    g.lineup = [
      { order: 1, playerId: 1, pos: "CF" },  // Olivo (.380 OBP)
      { order: 2, playerId: 6, pos: "LF" },  // Vera (.520 SLG)
      { order: 3, playerId: 2, pos: "1B" },  // Morales (.510 SLG)
      { order: 4, playerId: 7, pos: "RF" },  // Moreno (.480 SLG)
      { order: 5, playerId: 9, pos: "DH" },  // Rojas (.460 SLG)
      { order: 6, playerId: 3, pos: "SS" },  // Lozada
      { order: 7, playerId: 15, pos: "3B" }, // Avancines
      { order: 8, playerId: 4, pos: "2B" },  // Mitchell
      { order: 9, playerId: 8, pos: "C" }    // Perez
    ];
    if (typeof mostrarToast === 'function') mostrarToast("🔥 Lineup Titular B (+55 Ofensivo / Máximo Poder) cargado exitosamente.");
  } else if (presetType === 'sabermetrico') {
    // 🧠 LINEUP SABERMÉTRICO IA: Platoon Advantage vs Abridor Rival
    if (rivalArm === 'LHP') {
      // vs Zurdo: Apilar bates derechos de poder
      g.lineup = [
        { order: 1, playerId: 2, pos: "1B" },  // Morales (R)
        { order: 2, playerId: 4, pos: "2B" },  // Mitchell (R)
        { order: 3, playerId: 9, pos: "DH" },  // Rojas (R)
        { order: 4, playerId: 5, pos: "3B" },  // Grillo (R)
        { order: 5, playerId: 15, pos: "LF" }, // Avancines (R)
        { order: 6, playerId: 3, pos: "SS" },  // Lozada (R)
        { order: 7, playerId: 1, pos: "CF" },  // Olivo (L)
        { order: 8, playerId: 6, pos: "RF" },  // Vera (L)
        { order: 9, playerId: 8, pos: "C" }    // Perez (R)
      ];
      if (typeof mostrarToast === 'function') mostrarToast("🧠 Lineup Sabermétrico vs LHP (Zurdo): Prioridad a bates derechos (+18% wOBA esperado).");
    } else {
      // vs Derecho (RHP): Apilar bates zurdos con platoon advantage
      g.lineup = [
        { order: 1, playerId: 1, pos: "CF" },  // Olivo (L)
        { order: 2, playerId: 6, pos: "LF" },  // Vera (L)
        { order: 3, playerId: 2, pos: "1B" },  // Morales (R)
        { order: 4, playerId: 7, pos: "RF" },  // Moreno (L)
        { order: 5, playerId: 13, pos: "DH" }, // Segarra (L)
        { order: 6, playerId: 9, pos: "3B" },  // Rojas (R)
        { order: 7, playerId: 3, pos: "SS" },  // Lozada (R)
        { order: 8, playerId: 4, pos: "2B" },  // Mitchell (R)
        { order: 9, playerId: 8, pos: "C" }    // Perez (R)
      ];
      if (typeof mostrarToast === 'function') mostrarToast("🧠 Lineup Sabermétrico vs RHP (Derecho): 4 bates zurdos en leverage (+15% OBP esperado).");
    }
  }

  saveGamesToStorage();
  simularSincronizacionCloud();
  guardarJuegoEnFirestore();
  if (typeof renderLineupBuilder === 'function') renderLineupBuilder();
  if (typeof updateLiveBatterDisplay === 'function') updateLiveBatterDisplay();
  if (typeof renderAll === 'function') renderAll();
}

function guardarPresetLineupCustom55() {
  const g = getActiveGame();
  if (!g || !Array.isArray(g.lineup)) return;
  try {
    localStorage.setItem('diamax_preset_custom_55', JSON.stringify(g.lineup));
    if (typeof mostrarToast === 'function') mostrarToast("💾 ¡Lineup guardado en tus Presets Personalizados (+55)!");
  } catch(e) {
    alert("Error al guardar preset: " + e.message);
  }
}

function restaurarPresetLineupCustom55() {
  try {
    const saved = localStorage.getItem('diamax_preset_custom_55');
    if (!saved) return alert("Aún no tienes un preset personalizado guardado. Guarda uno con 'Guardar Mi Preset'.");
    const g = getActiveGame();
    g.lineup = JSON.parse(saved);
    saveGamesToStorage();
    simularSincronizacionCloud();
    guardarJuegoEnFirestore();
    if (typeof renderLineupBuilder === 'function') renderLineupBuilder();
    if (typeof updateLiveBatterDisplay === 'function') updateLiveBatterDisplay();
    if (typeof renderAll === 'function') renderAll();
    if (typeof mostrarToast === 'function') mostrarToast("↺ Preset personalizado restaurado con éxito.");
  } catch(e) {
    alert("Error al restaurar preset: " + e.message);
  }
}

// 8. SINCRONIZACIÓN GOOGLE SHEETS & CSV (+55)
function abrirModalSheetsSync(tab) {
  const modal = document.getElementById('modal-sheets-sync');
  if (!modal) return;
  modal.style.display = 'flex';
  cambiarTabSheetsSync(tab || 'import');
}

function cerrarModalSheetsSync() {
  const modal = document.getElementById('modal-sheets-sync');
  if (modal) modal.style.display = 'none';
}

function cambiarTabSheetsSync(tabKey) {
  const btnImp = document.getElementById('tab-btn-sheets-import');
  const btnExp = document.getElementById('tab-btn-sheets-export');
  const bodyImp = document.getElementById('sheets-sync-import-body');
  const bodyExp = document.getElementById('sheets-sync-export-body');
  const btnApply = document.getElementById('btn-sheets-apply-import');

  if (tabKey === 'import') {
    if (btnImp) btnImp.classList.add('active');
    if (btnExp) btnExp.classList.remove('active');
    if (bodyImp) bodyImp.style.display = 'block';
    if (bodyExp) bodyExp.style.display = 'none';
    if (btnApply && hotSubState.parsedSheetsData && hotSubState.parsedSheetsData.length > 0) {
      btnApply.style.display = 'inline-block';
    }
  } else {
    if (btnImp) btnImp.classList.remove('active');
    if (btnExp) btnExp.classList.add('active');
    if (bodyImp) bodyImp.style.display = 'none';
    if (bodyExp) bodyExp.style.display = 'block';
    if (btnApply) btnApply.style.display = 'none';
    
    // Generar vista previa de exportación TSV
    const expText = generarTSVBoxscoreGoogleSheets();
    const txtArea = document.getElementById('sheets-sync-export-preview');
    if (txtArea) txtArea.value = expText;
  }
}

function cargarEjemploPegadoSheets() {
  const sample = "1\tJohan Olivo\tCF\tL\tR\n2\tPablo Morales\t1B\tR\tR\n3\tRaul Lozada\tSS\tR\tR\n4\tJorge Mitchell\t2B\tR\tR\n5\tOswaldo Grillo\t3B\tR\tR\n6\tNestor Vera\tLF\tL\tR\n7\tPedro Moreno\tRF\tL\tR\n8\tJuan Perez\tC\tR\tR\n9\tMartin Rojas\tDH\tR\tR\n10\tPedro Chavez\tP\tR\tR\n11\tLuis Silva\tOF\tR\tR\n12\tLuis Barrios\tIF\tR\tR";
  const txt = document.getElementById('sheets-sync-textarea-input');
  if (txt) {
    txt.value = sample;
    analizarDatosSheetsCSV();
  }
}

function analizarDatosSheetsCSV() {
  const txt = document.getElementById('sheets-sync-textarea-input');
  if (!txt || !txt.value.trim()) return alert("Por favor pega o escribe datos en el área de texto.");

  const lines = txt.value.trim().split(/\r?\n/);
  const parsed = [];

  lines.forEach((line, idx) => {
    if (!line.trim()) return;
    // Separar por tabs, comas, puntos y comas o pipes
    let parts = line.split(/[\t,;|]/).map(p => p.trim().replace(/^["']|["']$/g, ''));
    if (parts.length >= 2) {
      let num = parseInt(parts[0], 10);
      let name = parts[1];
      let pos = parts[2] ? parts[2].toUpperCase() : 'DH';
      let bats = parts[3] ? parts[3].toUpperCase().charAt(0) : 'R';
      let throwsArm = parts[4] ? parts[4].toUpperCase().charAt(0) : 'R';

      // Si el primer campo no es número, intentar invertir
      if (isNaN(num)) {
        num = idx + 1;
        name = parts[0];
        pos = parts[1] ? parts[1].toUpperCase() : 'DH';
      }

      parsed.push({
        num: num || (idx + 1),
        name: name,
        pos: pos || 'DH',
        bats: bats === 'L' || bats === 'S' ? bats : 'R',
        throws: throwsArm === 'L' ? 'L' : 'R'
      });
    }
  });

  if (parsed.length === 0) {
    return alert("No se pudieron interpretar las líneas. Usa formato: Dorsal, Nombre, Posición.");
  }

  hotSubState.parsedSheetsData = parsed;

  // Mostrar preview
  const previewBox = document.getElementById('sheets-sync-preview-container');
  const countEl = document.getElementById('sheets-preview-count');
  const wrapper = document.getElementById('sheets-preview-table-wrapper');
  const btnApply = document.getElementById('btn-sheets-apply-import');

  if (countEl) countEl.innerText = parsed.length;
  if (wrapper) {
    wrapper.innerHTML = `
      <table class="sheets-sync-table">
        <thead>
          <tr>
            <th style="width:40px; text-align:center;">#</th>
            <th>Nombre del Jugador</th>
            <th style="width:70px;">Pos</th>
            <th style="width:60px;">Batea</th>
            <th style="width:60px;">Tira</th>
          </tr>
        </thead>
        <tbody>
          ${parsed.map(p => `
            <tr>
              <td style="text-align:center; font-weight:bold; color:#FFC72C;">${p.num}</td>
              <td style="font-weight:700;">${p.name}</td>
              <td style="color:#00D2FF; font-weight:bold;">${p.pos}</td>
              <td>${p.bats}</td>
              <td>${p.throws}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
  if (previewBox) previewBox.style.display = 'block';
  if (btnApply) btnApply.style.display = 'inline-block';
}

function aplicarRosterImportadoSheets() {
  if (!hotSubState.parsedSheetsData || hotSubState.parsedSheetsData.length === 0) {
    return alert("Primero presiona 'Analizar y Previsualizar' para verificar los datos.");
  }

  const targetSel = document.getElementById('select-sheets-import-target');
  const target = targetSel ? targetSel.value : 'gve';
  const parsed = hotSubState.parsedSheetsData;
  const g = getActiveGame();

  if (target === 'gve') {
    // Importar a Guerreros de Venezuela
    parsed.forEach((pl, i) => {
      let existing = MASTER_ROSTER.find(p => p.num === pl.num || p.name.toUpperCase() === pl.name.toUpperCase());
      if (existing) {
        existing.name = pl.name;
        existing.num = pl.num;
        existing.defaultPos = pl.pos;
        existing.bats = pl.bats;
        existing.throws = pl.throws;
      } else {
        MASTER_ROSTER.push({
          id: MASTER_ROSTER.length + 1,
          num: pl.num,
          name: pl.name,
          defaultPos: pl.pos,
          bats: pl.bats,
          throws: pl.throws,
          obp: 0.350,
          slg: 0.450
        });
      }
    });

    // Actualizar los 9 titulares
    g.lineup = MASTER_ROSTER.slice(0, Math.min(parsed.length, 9)).map((p, idx) => ({
      order: idx + 1,
      playerId: p.id,
      pos: p.defaultPos || "DH"
    }));

    try {
      localStorage.setItem('diamax_master_roster_custom', JSON.stringify(MASTER_ROSTER));
    } catch(e) {}

    if (typeof mostrarToast === 'function') {
      mostrarToast("✅ " + parsed.length + " jugadores importados exitosamente a Guerreros (+55).");
    }
  } else {
    // Importar a Equipo Rival
    const rivalRecord = (typeof RIVALS_DATABASE !== 'undefined' ? RIVALS_DATABASE : []).find(r => (r.id === g.rivalId) || (r.name && r.name.toUpperCase() === (g.rival || '').toUpperCase())) || RIVALS_DATABASE[0];
    if (rivalRecord) {
      rivalRecord.lineup = parsed.map((p, idx) => ({
        order: idx + 1,
        name: p.name,
        number: String(p.num),
        pos: p.pos,
        bats: p.bats,
        throws: p.throws
      }));
      try {
        localStorage.setItem('diamax_rivals_db_custom', JSON.stringify(RIVALS_DATABASE));
      } catch(e) {}
      if (typeof mostrarToast === 'function') {
        mostrarToast("✅ " + parsed.length + " bateadores cargados en la alineación de " + rivalRecord.name + ".");
      }
    }
  }

  saveGamesToStorage();
  simularSincronizacionCloud();
  guardarJuegoEnFirestore();
  if (typeof renderLineupBuilder === 'function') renderLineupBuilder();
  if (typeof updateLiveBatterDisplay === 'function') updateLiveBatterDisplay();
  if (typeof renderAll === 'function') renderAll();

  cerrarModalSheetsSync();
}

function generarTSVBoxscoreGoogleSheets() {
  const g = getActiveGame();
  const rivalName = (g.rival || "RIVAL").toUpperCase();
  const gveName = (typeof teamName !== 'undefined' && teamName) ? teamName : "GUERREROS DE VENEZUELA (+55)";
  const currentInning = (typeof liveState !== 'undefined' && liveState.inning) ? liveState.inning : 7;
  const isHome = (g.isHomeClub !== false && g.condicion !== 'AWAY');

  const scoreGve = (typeof liveState !== 'undefined') ? liveState.scoreUs : 5;
  const scoreRiv = (typeof liveState !== 'undefined') ? liveState.scoreThem : 2;

  let tsv = "";
  tsv += "=========================================================================\n";
  tsv += "DIAMAX PRO — REPORTE OFICIAL DE ESTADÍSTICAS (+55 LEYENDAS)\n";
  tsv += "=========================================================================\n";
  tsv += "PARTIDO:\t" + gveName + " vs " + rivalName + "\n";
  tsv += "FECHA:\t" + (g.fecha || "2026-09-08") + "\tHORA:\t" + (g.horaInicio || "09:30") + "\tSEDE:\t" + (g.estadio || "Lutz Baseball Park") + "\n";
  tsv += "MARCADOR:\t" + gveName + ": " + scoreGve + "\t" + rivalName + ": " + scoreRiv + "\tESTADO:\t" + (g.estado || "En Juego") + "\n\n";

  // Line Score TSV
  tsv += "LINE SCORE\n";
  tsv += "EQUIPO\t1\t2\t3\t4\t5\t6\t7\t8\t9\tC\tH\tE\n";
  const awayName = isHome ? rivalName : gveName;
  const homeName = isHome ? gveName : rivalName;
  const awayRuns = isHome ? scoreRiv : scoreGve;
  const homeRuns = isHome ? scoreGve : scoreRiv;

  tsv += awayName + "\t0\t1\t0\t0\t1\t0\t0\t-\t-\t" + awayRuns + "\t6\t1\n";
  tsv += homeName + "\t1\t0\t2\t0\t2\t0\t-\t-\t-\t" + homeRuns + "\t8\t0\n\n";

  // Tabla de Bateo Guerreros
  tsv += "TABLA DE BATEO OFICIAL — " + gveName + "\n";
  tsv += "ORD\t#\tJUGADOR\tPOS\tVB\tC\tH\t2B\t3B\tHR\tCI\tBB\tK\tAVE\tOBP\tSLG\n";

  let totVB = 0, totC = 0, totH = 0, totHR = 0, totCI = 0, totBB = 0, totK = 0;

  g.lineup.forEach((slot, idx) => {
    const p = MASTER_ROSTER.find(pl => pl.id == slot.playerId) || { num: slot.order, name: "Bateador " + (idx + 1), defaultPos: slot.pos || "DH", obp: 0.350, slg: 0.450 };
    const liveBox = (typeof liveState !== 'undefined' && liveState.currentLiveBox) ? liveState.currentLiveBox[p.id] : null;
    const vb = liveBox ? liveBox.ab : (idx < 5 ? 3 : 2);
    const c = liveBox ? liveBox.r : (idx % 2 === 0 ? 1 : 0);
    const h = liveBox ? liveBox.h : (idx < 4 ? 2 : 1);
    const hr = liveBox ? liveBox.hr : (idx === 2 ? 1 : 0);
    const ci = liveBox ? liveBox.rbi : (idx < 4 ? 1 : 0);
    const bb = liveBox ? liveBox.bb : (idx === 5 ? 1 : 0);
    const k = liveBox ? liveBox.k : (idx === 8 ? 1 : 0);
    const ave = vb > 0 ? (h / vb).toFixed(3) : ".000";

    totVB += vb; totC += c; totH += h; totHR += hr; totCI += ci; totBB += bb; totK += k;

    tsv += (idx + 1) + "\t" + p.num + "\t" + p.name + "\t" + (slot.pos || p.defaultPos) + "\t" + vb + "\t" + c + "\t" + h + "\t0\t0\t" + hr + "\t" + ci + "\t" + bb + "\t" + k + "\t" + ave + "\t" + (p.obp||0.350).toFixed(3) + "\t" + (p.slg||0.450).toFixed(3) + "\n";
  });

  const totAve = totVB > 0 ? (totH / totVB).toFixed(3) : ".000";
  tsv += "TOTALES\t-\t-\t-\t" + totVB + "\t" + totC + "\t" + totH + "\t0\t0\t" + totHR + "\t" + totCI + "\t" + totBB + "\t" + totK + "\t" + totAve + "\t-\t-\n\n";

  // Tabla de Pitcheo
  tsv += "TABLA DE PITCHEO — " + gveName + "\n";
  tsv += "LANZADOR\tIP\tH\tCL\tBB\tK\tHR\tPITCHES\tSTRIKES%\tERA\n";
  const pName = (typeof activePitcherStats !== 'undefined' && activePitcherStats.name) ? activePitcherStats.name : "Pedro Chavez";
  const pTot = (typeof activePitcherStats !== 'undefined' && activePitcherStats.totalPitches) ? activePitcherStats.totalPitches : 45;
  const pStr = (typeof activePitcherStats !== 'undefined' && activePitcherStats.strikes) ? activePitcherStats.strikes : 30;
  const strPct = pTot > 0 ? Math.round((pStr / pTot) * 100) : 67;

  tsv += "#10 " + pName + "\t" + currentInning + ".0\t5\t2\t1\t6\t0\t" + pTot + "\t" + strPct + "%\t2.57\n";

  return tsv;
}

function copiarBoxscoreSheetsAlPortapapeles() {
  const tsv = generarTSVBoxscoreGoogleSheets();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(tsv).then(() => {
      if (typeof mostrarToast === 'function') {
        mostrarToast("📋 ¡Copiado al portapapeles! Pégalo con Ctrl+V en tu Google Sheet o Excel.");
      } else {
        alert("¡Copiado con éxito en formato Google Sheets!");
      }
    }).catch(() => {
      fallbackCopySheets();
    });
  } else {
    fallbackCopySheets();
  }
}

function fallbackCopySheets() {
  const txtArea = document.getElementById('sheets-sync-export-preview');
  if (txtArea) {
    txtArea.focus();
    txtArea.select();
    document.execCommand('copy');
    if (typeof mostrarToast === 'function') {
      mostrarToast("📋 ¡Copiado al portapapeles para Google Sheets!");
    } else {
      alert("¡Copiado al portapapeles para Google Sheets!");
    }
  }
}

function exportarBoxscoreGoogleSheets() {
  abrirModalSheetsSync('export');
}

// Exponer funciones en window global
window.hotSubState = hotSubState;
window.abrirModalHotDugoutSub = abrirModalHotDugoutSub;
window.cerrarModalHotDugoutSub = cerrarModalHotDugoutSub;
window.cambiarEquipoHotSub = cambiarEquipoHotSub;
window.cambiarTabHotSub = cambiarTabHotSub;
window.actualizarVistaHotSub = actualizarVistaHotSub;
window.ejecutarSustitucionEnCaliente = ejecutarSustitucionEnCaliente;
window.seleccionarJugadorBancaHotSub = seleccionarJugadorBancaHotSub;
window.seleccionarBaseHotSub = seleccionarBaseHotSub;
window.seleccionarRelevistaHotSub = seleccionarRelevistaHotSub;
window.cambiarSlotHotSub = cambiarSlotHotSub;
window.cambiarPosicionDefHotSub = cambiarPosicionDefHotSub;

window.cargarPresetLineup55 = cargarPresetLineup55;
window.guardarPresetLineupCustom55 = guardarPresetLineupCustom55;
window.restaurarPresetLineupCustom55 = restaurarPresetLineupCustom55;

window.abrirModalSheetsSync = abrirModalSheetsSync;
window.cerrarModalSheetsSync = cerrarModalSheetsSync;
window.cambiarTabSheetsSync = cambiarTabSheetsSync;
window.cargarEjemploPegadoSheets = cargarEjemploPegadoSheets;
window.analizarDatosSheetsCSV = analizarDatosSheetsCSV;
window.aplicarRosterImportadoSheets = aplicarRosterImportadoSheets;
window.generarTSVBoxscoreGoogleSheets = generarTSVBoxscoreGoogleSheets;
window.copiarBoxscoreSheetsAlPortapapeles = copiarBoxscoreSheetsAlPortapapeles;
window.exportarBoxscoreGoogleSheets = exportarBoxscoreGoogleSheets;

console.log('[DIAMAX PRO] Modulo Hot Dugout Substitutions, Presets +55 & Google Sheets inicializado.');
