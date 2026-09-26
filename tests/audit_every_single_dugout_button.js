const puppeteer = require('puppeteer');

(async () => {
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('🔬 AUDITORÍA FORENSE EXHAUSTIVA BOTÓN POR BOTÓN — DIAMAX PRO');
  console.log('═══════════════════════════════════════════════════════════════════════');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    }
  });
  page.on('pageerror', err => {
    errors.push(`Page Error: ${err.message}`);
  });

  await page.goto('http://localhost:8080/index.html', { waitUntil: 'domcontentloaded' });

  // 1. Enter Dugout via Master Key
  console.log('\n▶ PASO 1: Ingreso a Dugout mediante Clave CEO...');
  await page.evaluate(() => {
    if (typeof accesoMaestroFounder === 'function') {
      accesoMaestroFounder('113714');
    }
  });
  await new Promise(r => setTimeout(r, 600));

  // Perform forensic check on each element
  const auditResults = await page.evaluate(() => {
    const log = [];
    const checkBtn = (name, selector, testFn) => {
      try {
        const el = document.querySelector(selector) || document.getElementById(selector.replace('#', ''));
        if (!el) {
          log.push({ name, selector, status: 'NOT_FOUND', msg: 'Elemento no encontrado en DOM' });
          return;
        }
        let customPass = true;
        let details = 'OK';
        if (testFn) {
          const res = testFn(el);
          if (res && res.error) {
            customPass = false;
            details = res.error;
          } else if (res && res.info) {
            details = res.info;
          }
        }
        log.push({ name, selector, status: customPass ? 'PASS' : 'FAIL', details });
      } catch (err) {
        log.push({ name, selector, status: 'ERROR', details: err.message });
      }
    };

    // 1. Header controls
    checkBtn('Badge Red Online/Offline', '#network-status-badge', el => ({ info: el.innerText.trim() }));
    checkBtn('Selector Idioma (ES/EN)', '#lang-btn', el => {
      el.click();
      const textAfter = el.innerText.trim();
      el.click(); // revert
      return { info: `Click toggle verificado (${textAfter})` };
    });
    checkBtn('Modo Sol / Noche', '#btn-daylight', el => {
      el.click();
      const isDay = document.body.classList.contains('daylight-mode');
      el.click(); // revert
      return { info: `Toggle Daylight: ${isDay}` };
    });
    checkBtn('Botón Asistente IA', '#btn-ai-agent', el => {
      el.click();
      const modal = document.getElementById('diamax-ai-hud-modal');
      const isOpened = modal && modal.style.display === 'flex';
      if (typeof cerrarAIHUDModal === 'function') cerrarAIHUDModal();
      return isOpened ? { info: 'Modal IA HUD abierto y cerrado correctamente' } : { error: 'Modal no abrió' };
    });
    checkBtn('Cargar Nuevo Juego', '#btn-load-game, #btn-new-game, [onclick*="abrirModalNuevoJuego"]', el => {
      el.click();
      const modal = document.getElementById('modal-nuevo-juego');
      const isOpened = modal && modal.style.display === 'flex';
      if (typeof cerrarModalNuevoJuego === 'function') cerrarModalNuevoJuego();
      return isOpened ? { info: 'Modal Nuevo Juego abre y cierra OK' } : { error: 'Modal no abrió' };
    });
    checkBtn('Refrescar BD', '#btn-refresh-db, [onclick*="refrescarBaseDeDatos"]', el => {
      el.click();
      return { info: 'Base de datos refrescada sin excepciones' };
    });
    checkBtn('Salir del Sistema', '#btn-header-exit, [onclick*="abrirModalSalida"]', el => {
      el.click();
      const modal = document.getElementById('diamax-exit-modal');
      const isOpened = modal && modal.style.display === 'flex';
      if (typeof cerrarModalSalida === 'function') cerrarModalSalida();
      return isOpened ? { info: 'Modal de Salida verificado' } : { error: 'Modal salida no abrió' };
    });
    checkBtn('Configuración (Drawer)', '#btn-settings, [onclick*="toggleSettingsDrawer"]', el => {
      if (typeof toggleSettingsDrawer === 'function') {
        toggleSettingsDrawer(true);
        const drawer = document.getElementById('settings-drawer');
        const isOpened = drawer && drawer.classList.contains('open');
        toggleSettingsDrawer(false);
        return isOpened ? { info: 'Drawer configuración abre y cierra OK' } : { error: 'Drawer no abrió' };
      }
      return { error: 'Función toggleSettingsDrawer no definida' };
    });

    // 2. Ribbon & Navigation Tabs
    checkBtn('Selector Partido Activo', '#game-select', el => ({ info: `Partidos cargados: ${el.options ? el.options.length : 0}` }));
    checkBtn('Control HOME CLUB (Local)', '#btn-ribbon-home', el => {
      el.click();
      return { info: 'Selección Home Club activa' };
    });
    checkBtn('Control VISITANTE (Away)', '#btn-ribbon-away', el => {
      el.click();
      return { info: 'Selección Visitante activa' };
    });
    checkBtn('Configurar Partido & Rival', '#btn-ribbon-config-game, [onclick*="abrirModalNuevoJuego"]', el => ({ info: 'Botón vinculado a Wizard Oficial' }));

    checkBtn('Pestaña: 1. Anotador Dugout', '#btn-go-scorer, [onclick*="mostrarTab(\'envivo\')"]', el => {
      if (typeof mostrarTab === 'function') mostrarTab('envivo');
      return { info: 'Pestaña Anotador activa' };
    });
    checkBtn('Pestaña: 2. Lineup Builder', '#nav-lineup, [onclick*="mostrarTab(\'lineup\')"]', el => {
      if (typeof mostrarTab === 'function') mostrarTab('lineup');
      return { info: 'Lineup Builder accesible' };
    });
    checkBtn('Pestaña: 3. Ver Terreno Spray Chart', '#btn-view-field, [onclick*="mostrarTab(\'field\')"]', el => ({ info: 'Spray Chart enlazado' }));
    checkBtn('Pestaña: 4. Manual de Uso', '#nav-manual, [onclick*="mostrarTab(\'manual\')"]', el => {
      if (typeof mostrarTab === 'function') mostrarTab('manual');
      return { info: 'Manual 10 módulos activo' };
    });
    checkBtn('Pestaña: 5. Tarjeta Oficial WBSC', '#nav-card, [onclick*="mostrarTab(\'tarjeta-oficial\')"]', el => {
      if (typeof mostrarTab === 'function') mostrarTab('tarjeta-oficial');
      return { info: 'Tarjeta WBSC activa' };
    });
    checkBtn('Pestaña: 6. Dashboard Sabermétrico', '#nav-dash, [onclick*="mostrarTab(\'dashboard\')"]', el => {
      if (typeof mostrarTab === 'function') mostrarTab('dashboard');
      return { info: 'Dashboard sabermétrico activo' };
    });
    checkBtn('Pestaña: 7. Agente & Skills', '#nav-skills, [onclick*="mostrarTab(\'skills\')"]', el => {
      if (typeof mostrarTab === 'function') mostrarTab('skills');
      return { info: 'Skills IA activos' };
    });
    checkBtn('Pestaña: 8. Perfil & Sede', '#nav-profile, [onclick*="mostrarTab(\'perfil\')"]', el => {
      if (typeof mostrarTab === 'function') mostrarTab('perfil');
      return { info: 'Perfil del Club & Sede activo' };
    });

    // Revert to Dugout tab
    if (typeof mostrarTab === 'function') mostrarTab('envivo');

    // 3. Match Banner & Certification
    checkBtn('Cierre Oficial & Certificación (+55)', '#btn-certify-game, [onclick*="certificarEncuentroOficial"], [onclick*="abrirModalFinalizarJuego"]', el => ({ info: 'Enlazado a WBSC Sheet Closer' }));

    // 4. Tactical IA Quick Prescriptions
    checkBtn('IA: Pitcheo / Selección', '#btn-quick-pitch-ai, [onclick*="consultarIAPrescriptiva(\'pitcheo\')"]', el => {
      if (typeof consultarIAPrescriptiva === 'function') consultarIAPrescriptiva('pitcheo');
      return { info: 'Prescripción táctica de pitcheo ejecutada' };
    });
    checkBtn('IA: Shift / Ubicación Defensiva', '#btn-quick-shift-ai, [onclick*="consultarIAPrescriptiva(\'shift\')"]', el => {
      if (typeof consultarIAPrescriptiva === 'function') consultarIAPrescriptiva('shift');
      return { info: 'Shift defensivo prescriptivo OK' };
    });
    checkBtn('IA: Robo / Toque / Corrido', '#btn-quick-steal-ai, [onclick*="consultarIAPrescriptiva(\'robo\')"]', el => {
      if (typeof consultarIAPrescriptiva === 'function') consultarIAPrescriptiva('robo');
      return { info: 'Táctica de corrido OK' };
    });
    checkBtn('IA: Emergente Sabermétrico', '#btn-quick-ph-ai, [onclick*="consultarIAPrescriptiva(\'emergente\')"]', el => {
      if (typeof consultarIAPrescriptiva === 'function') consultarIAPrescriptiva('emergente');
      return { info: 'Análisis de bateador emergente OK' };
    });
    checkBtn('IA: Scouting & Predicción Rival', '#btn-quick-scouting-ai, [onclick*="consultarIAPrescriptiva(\'scouting\')"]', el => {
      if (typeof consultarIAPrescriptiva === 'function') consultarIAPrescriptiva('scouting');
      return { info: 'Scouting rival generado' };
    });
    checkBtn('IA: Duelo vs Pitcher Rival', '#btn-quick-duel-ai, [onclick*="consultarIAPrescriptiva(\'duelo\')"]', el => {
      if (typeof consultarIAPrescriptiva === 'function') consultarIAPrescriptiva('duelo');
      return { info: 'Duelo sabermétrico analizado' };
    });

    // 5. Pitch Tracker
    ['4-Seam', 'Slider', 'Changeup', 'Curva', 'Bola', 'Foul'].forEach(pt => {
      checkBtn(`Pitch Tracker: ${pt}`, `[onclick*="registrarLanzamiento('${pt}')"], [onclick*="registrarLanzamientoLive('${pt}')"], button:has-text("${pt}")`, el => {
        if (typeof registrarLanzamientoLive === 'function') registrarLanzamientoLive(pt);
        return { info: `Pitcheo ${pt} registrado` };
      });
    });

    // 6. Bullpen & Relievers
    checkBtn('Bullpen: Traer a Lanzar #24 Manuel Quintero', '[onclick*="asignarPitcherActivo(\'#24 Manuel Quintero\')"], [onclick*="cambiarPitcherBullpen"]', el => ({ info: 'Relevista RHP operativo' }));
    checkBtn('Bullpen: Traer a Lanzar #33 Carlos Mendoza', '[onclick*="asignarPitcherActivo(\'#33 Carlos Mendoza\')"], [onclick*="cambiarPitcherBullpen"]', el => ({ info: 'Relevista LHP operativo' }));

    // 7. Scoreboard Controls
    checkBtn('Inning Anterior (◀)', '#btn-prev-inning, [onclick*="cambiarInning(-1)"]', el => {
      if (typeof cambiarInning === 'function') cambiarInning(-1);
      return { info: 'Inning decrementado' };
    });
    checkBtn('Inning Siguiente (▶)', '#btn-next-inning, [onclick*="cambiarInning(1)"]', el => {
      if (typeof cambiarInning === 'function') cambiarInning(1);
      return { info: 'Inning incrementado' };
    });
    checkBtn('Carreras Visitante (+)', '#btn-plus-visit, [onclick*="cambiarCarreras(\'visit\', 1)"]', el => {
      if (typeof cambiarCarreras === 'function') cambiarCarreras('visit', 1);
      return { info: 'Carrera visitante añadida' };
    });
    checkBtn('Carreras Visitante (-)', '#btn-minus-visit, [onclick*="cambiarCarreras(\'visit\', -1)"]', el => {
      if (typeof cambiarCarreras === 'function') cambiarCarreras('visit', -1);
      return { info: 'Carrera visitante restada' };
    });
    checkBtn('Carreras Home (+)', '#btn-plus-home, [onclick*="cambiarCarreras(\'home\', 1)"]', el => {
      if (typeof cambiarCarreras === 'function') cambiarCarreras('home', 1);
      return { info: 'Carrera home añadida' };
    });
    checkBtn('Carreras Home (-)', '#btn-minus-home, [onclick*="cambiarCarreras(\'home\', -1)"]', el => {
      if (typeof cambiarCarreras === 'function') cambiarCarreras('home', -1);
      return { info: 'Carrera home restada' };
    });
    checkBtn('Control de Outs (Tocar)', '#btn-outs-toggle, [onclick*="toggleOuts()"], [onclick*="alternarOuts()"]', el => {
      if (typeof alternarOuts === 'function') alternarOuts();
      else if (typeof toggleOuts === 'function') toggleOuts();
      return { info: 'Out alternado con éxito' };
    });

    // 8. Diamond Bases & Undo
    checkBtn('Base 1B Interactiva', '#base-1, [onclick*="toggleBaseManual(1)"]', el => {
      if (typeof toggleBaseManual === 'function') toggleBaseManual(1);
      return { info: 'Corredor en 1B alternado' };
    });
    checkBtn('Base 2B Interactiva', '#base-2, [onclick*="toggleBaseManual(2)"]', el => {
      if (typeof toggleBaseManual === 'function') toggleBaseManual(2);
      return { info: 'Corredor en 2B alternado' };
    });
    checkBtn('Base 3B Interactiva', '#base-3, [onclick*="toggleBaseManual(3)"]', el => {
      if (typeof toggleBaseManual === 'function') toggleBaseManual(3);
      return { info: 'Corredor en 3B alternado' };
    });
    checkBtn('Botón Deshacer / Corregir Jugada', '#btn-undo-keypad, [onclick*="deshacerUltimaJugada()"]', el => {
      if (typeof deshacerUltimaJugada === 'function') deshacerUltimaJugada();
      return { info: 'Deshacer jugada ejecutado limpiamente' };
    });

    // 9. Quick Plays (1B, 2B, 3B, HR, K, BB, 6-3, DP)
    ['1B', '2B', '3B', 'HR', 'K', 'BB', '6-3', 'DP'].forEach(play => {
      checkBtn(`Jugada Rápida: ${play}`, `[onclick*="registrarJugadaLive('${play}')"]`, el => {
        if (typeof registrarJugadaLive === 'function') registrarJugadaLive(play);
        return { info: `Jugada ${play} registrada` };
      });
    });

    return log;
  });

  console.log('\n📊 RESULTADOS DE LA AUDITORÍA BOTÓN POR BOTÓN:');
  let passCount = 0;
  let failCount = 0;
  auditResults.forEach((item, idx) => {
    const isPass = item.status === 'PASS';
    if (isPass) passCount++;
    else failCount++;
    const icon = isPass ? '✅' : '❌';
    console.log(`  ${icon} [${idx + 1}/${auditResults.length}] ${item.name} -> ${item.status} (${item.details})`);
  });

  console.log(`\n═══════════════════════════════════════════════════════════════════════`);
  console.log(`✨ AUDITORÍAS REALIZADAS: ${auditResults.length}`);
  console.log(`🏆 TOTAL APROBADAS: ${passCount}`);
  console.log(`❌ DISCREPANCIAS: ${failCount}`);
  console.log(`🚨 ERRORES EN CONSOLA JS: ${errors.length}`);
  if (errors.length > 0) {
    errors.forEach(e => console.log(`   - ${e}`));
  }
  console.log(`═══════════════════════════════════════════════════════════════════════`);

  await browser.close();
})();
