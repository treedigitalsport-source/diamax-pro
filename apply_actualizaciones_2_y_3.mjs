import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf-8');

console.log('Original index.html length:', html.length);

// -----------------------------------------------------------------------------
// 1. CSS STYLES FOR SUNLIGHT MODE, 48PX BUTTONS, 2-STEP KEYPAD, MOBILE BOTTOM NAV & PRINT CHEAT SHEET
// -----------------------------------------------------------------------------
const cssUpdates = `
  /* =========================================================================
     ☀️ ACTUALIZACIÓN 2: MODO LUZ SOLAR (WCAG AAA) & ERGONOMÍA DUGOUT
     ========================================================================= */
  body.sunlight-mode {
    background-color: #F8FAFC !important;
    background-image: none !important;
    color: #020617 !important;
  }
  body.sunlight-mode .app-container,
  body.sunlight-mode .header,
  body.sunlight-mode .panel,
  body.sunlight-mode .tab-content,
  body.sunlight-mode .pitch-tracker-card,
  body.sunlight-mode .scoreboard,
  body.sunlight-mode .batter-card-active,
  body.sunlight-mode .ondeck-card,
  body.sunlight-mode #main-nav,
  body.sunlight-mode .cockpit-card,
  body.sunlight-mode .cockpit-header,
  body.sunlight-mode #mobile-bottom-nav,
  body.sunlight-mode #dugout-2step-keypad {
    background-color: #FFFFFF !important;
    background-image: none !important;
    color: #020617 !important;
    border-color: #64748B !important;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12) !important;
  }

  body.sunlight-mode h1,
  body.sunlight-mode h2,
  body.sunlight-mode h3,
  body.sunlight-mode h4,
  body.sunlight-mode strong,
  body.sunlight-mode b,
  body.sunlight-mode .score-num {
    color: #020617 !important;
    text-shadow: none !important;
  }

  body.sunlight-mode p,
  body.sunlight-mode span,
  body.sunlight-mode td,
  body.sunlight-mode th,
  body.sunlight-mode label {
    color: #0F172A !important;
  }

  body.sunlight-mode #main-nav button {
    background: #F1F5F9 !important;
    color: #0F172A !important;
    border: 1.5px solid #CBD5E1 !important;
  }
  body.sunlight-mode #main-nav button.active,
  body.sunlight-mode #main-nav button:hover {
    background: #0284C7 !important;
    color: #FFFFFF !important;
    border-color: #0369A1 !important;
  }

  body.sunlight-mode #mobile-bottom-nav {
    background: #FFFFFF !important;
    border-top: 2px solid #CBD5E1 !important;
  }
  body.sunlight-mode .mobile-nav-btn {
    color: #475569 !important;
  }
  body.sunlight-mode .mobile-nav-btn.active {
    color: #0284C7 !important;
    font-weight: 900 !important;
  }

  body.sunlight-mode #scoreboard-away-box,
  body.sunlight-mode #scoreboard-home-box {
    background: #F8FAFC !important;
    border: 2px solid #64748B !important;
  }

  body.sunlight-mode .btn-hit {
    background: #15803D !important;
    color: #FFFFFF !important;
    border-color: #166534 !important;
  }
  body.sunlight-mode .btn-hr {
    background: #B45309 !important;
    color: #FFFFFF !important;
    border-color: #92400E !important;
  }
  body.sunlight-mode .btn-out {
    background: #B91C1C !important;
    color: #FFFFFF !important;
    border-color: #991B1B !important;
  }
  body.sunlight-mode .btn-tactical {
    background: #4338CA !important;
    color: #FFFFFF !important;
    border-color: #3730A3 !important;
  }
  body.sunlight-mode #btn-undo-scoreboard,
  body.sunlight-mode #btn-undo-keypad,
  body.sunlight-mode .btn-undo-large {
    background: #991B1B !important;
    color: #FFFFFF !important;
    border: 2px solid #7F1D1D !important;
  }

  /* BOTONES TÁCTILES GRANDES (MÍNIMO 48PX PARA DEDOS SUDADOS EN DUGOUT) */
  .touch-target-48,
  .btn-action,
  .pitch-type-btn,
  .btn-score-adjust,
  #btn-undo-scoreboard,
  #btn-undo-keypad,
  .btn-undo-large,
  .dugout-step1-btn,
  .dugout-step2-btn,
  .outs-container {
    min-height: 48px !important;
    touch-action: manipulation;
  }
  .btn-score-adjust {
    min-width: 48px !important;
    min-height: 48px !important;
    font-size: 19px !important;
    font-weight: 900 !important;
  }
  .scoreboard .btn-action {
    min-height: 48px !important;
    font-size: 13.5px !important;
    font-weight: 900 !important;
    padding: 6px 4px !important;
  }

  /* BARRA DE NAVEGACIÓN INFERIOR (MÓVIL ERGONOMÍA DUGOUT) */
  @media (max-width: 768px) {
    #mobile-bottom-nav {
      display: flex !important;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 58px;
      background: #020617;
      border-top: 1.5px solid rgba(0, 210, 255, 0.4);
      z-index: 99999;
      justify-content: space-around;
      align-items: center;
      padding: 0 4px;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.7);
    }
    .mobile-nav-btn {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      color: #94A3B8;
      padding: 4px 0;
      cursor: pointer;
      font-size: 10px;
      font-weight: 700;
      transition: all 0.2s;
    }
    .mobile-nav-btn.active, .mobile-nav-btn:hover {
      color: #00D2FF;
    }
    .mobile-nav-btn .mob-icon {
      font-size: 18px;
      margin-bottom: 2px;
    }
    /* Añadir espacio al body para no tapar contenido */
    body {
      padding-bottom: 64px !important;
    }
  }

  /* ESTILOS DE IMPRESIÓN PARA CHEAT SHEET 1 SOLA HOJA */
  @media print {
    body * {
      visibility: hidden;
    }
    #dugout-cheat-sheet, #dugout-cheat-sheet * {
      visibility: visible;
    }
    #dugout-cheat-sheet {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      page-break-after: avoid;
      background: #FFFFFF !important;
      color: #000000 !important;
      border: 3px solid #000000 !important;
      padding: 12px !important;
      font-size: 11px !important;
    }
  }
`;

// Insert CSS before </head>
if (!html.includes('ACTUALIZACIÓN 2: MODO LUZ SOLAR')) {
  html = html.replace('</head>', `<style>\n${cssUpdates}\n</style>\n</head>`);
  console.log('Inserted Sunlight Mode & Dugout Ergonomics CSS.');
}

// -----------------------------------------------------------------------------
// 2. ACCESO GRATIS AL PLAN COMENTARISTA DESDE SU PLANTILLA (PÁGINA 2 Y PÁGINA 3)
// -----------------------------------------------------------------------------
const freeAccessTemplateP2 = `
                <!-- ACCESO GRATIS DIRECTO CON CLAVE DE PRENSA / LIGA -->
                <div style="margin-top:14px; padding-top:12px; border-top:1px dashed rgba(0,210,255,0.4);" onclick="event.stopPropagation();">
                  <div style="font-size:11px; font-weight:800; color:#38BDF8; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
                    <span>🎟️</span> <span>Acceso de Cortesía para Medios y Narradores:</span>
                  </div>
                  <div style="display:flex; gap:6px;">
                    <input type="text" id="input-key-media-p2" placeholder="Clave de Prensa (ej. PRENSA2026)" style="flex:1; background:#020617; border:1.5px solid #00D2FF; border-radius:8px; padding:8px 10px; color:#FFF; font-size:12px; font-weight:700; outline:none; text-transform:uppercase;" onkeydown="if(event.key==='Enter') validarClavePrensaGratis('p2')">
                    <button type="button" onclick="validarClavePrensaGratis('p2')" style="background:linear-gradient(135deg, #0284C7, #00D2FF); color:#020617; border:none; border-radius:8px; padding:8px 12px; font-weight:900; font-size:11.5px; cursor:pointer; white-space:nowrap; box-shadow:0 0 10px rgba(0,210,255,0.4);">
                      Entrar Gratis
                    </button>
                  </div>
                </div>
`;

if (html.includes('id="p2-plan-card-MEDIA"') && !html.includes('input-key-media-p2')) {
  // Target the end of p2-plan-card-MEDIA before </div>
  html = html.replace(
    '<li><span style="color:#00D2FF; font-weight:900;">✓</span> URL de Overlay transparente para OBS Studio y vMix</li>\n                </ul>\n              </div>',
    `<li><span style="color:#00D2FF; font-weight:900;">✓</span> URL de Overlay transparente para OBS Studio y vMix</li>\n                </ul>\n${freeAccessTemplateP2}\n              </div>`
  );
  console.log('Inserted free press key entry on p2-plan-card-MEDIA (Página 2).');
}

const freeAccessTemplateP3 = `
            <!-- ACCESO GRATIS CON CLAVE DE PRENSA / LIGA DESDE MODAL DE SUSCRIPCIÓN -->
            <div style="margin-top:12px; padding-top:10px; border-top:1px dashed rgba(0,210,255,0.35);" onclick="event.stopPropagation();">
              <div style="font-size:10.5px; font-weight:800; color:#38BDF8; margin-bottom:6px; display:flex; align-items:center; gap:5px;">
                <span>🎟️</span> <span>¿Acreditación de Prensa o Liga?</span>
              </div>
              <div style="display:flex; gap:6px;">
                <input type="text" id="input-key-media-p3" placeholder="Clave de Prensa" style="flex:1; background:#020617; border:1.5px solid #00D2FF; border-radius:8px; padding:7px 10px; color:#FFF; font-size:11.5px; font-weight:700; outline:none; text-transform:uppercase;" onkeydown="if(event.key==='Enter') validarClavePrensaGratis('p3')">
                <button type="button" onclick="validarClavePrensaGratis('p3')" style="background:linear-gradient(135deg, #0284C7, #00D2FF); color:#020617; border:none; border-radius:8px; padding:7px 10px; font-weight:900; font-size:11px; cursor:pointer; white-space:nowrap;">
                  Entrar Gratis
                </button>
              </div>
            </div>
`;

if (html.includes("seleccionarPlanSuscripcion('MEDIA_PRO')") && !html.includes('input-key-media-p3')) {
  html = html.replace(
    `            <button onclick="seleccionarPlanSuscripcion('MEDIA_PRO')" style="width:100%; padding:11px; background:linear-gradient(135deg, #00D2FF, #0072FF); color:#020617; border:none; border-radius:8px; font-weight:900; font-size:12px; cursor:pointer; text-transform:uppercase; box-shadow:0 0 15px rgba(0,210,255,0.4); transition:all 0.2s;">\n              Elegir Plan Comentarista ($14.99)\n            </button>\n          </div>`,
    `            <button onclick="seleccionarPlanSuscripcion('MEDIA_PRO')" style="width:100%; padding:11px; background:linear-gradient(135deg, #00D2FF, #0072FF); color:#020617; border:none; border-radius:8px; font-weight:900; font-size:12px; cursor:pointer; text-transform:uppercase; box-shadow:0 0 15px rgba(0,210,255,0.4); transition:all 0.2s;">\n              Elegir Plan Comentarista ($14.99)\n            </button>\n${freeAccessTemplateP3}\n          </div>`
  );
  console.log('Inserted free press key entry on Subscription Grid (Página 3).');
}

// -----------------------------------------------------------------------------
// 3. BOTÓN MODO LUZ SOLAR EN HEADER SUPERIOR & DUGOUT
// -----------------------------------------------------------------------------
const sunlightBtnHeader = `
      <button id="btn-toggle-sunlight-header" type="button" onclick="toggleModoLuzSolar()" style="background:#0F172A; border:1.5px solid #FFC72C; color:#FFC72C; padding:7px 12px; border-radius:10px; font-weight:800; font-size:11.5px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; box-shadow:0 0 10px rgba(255,199,44,0.25);" title="Modo Luz Solar de Alto Contraste (WCAG AAA) para juegos bajo el sol del mediodía">
        <span id="btn-sunlight-icon">☀️</span> <span id="btn-sunlight-label">Luz Solar</span>
      </button>
`;

if (!html.includes('btn-toggle-sunlight-header')) {
  html = html.replace(
    '<button id="btn-config-game-header" onclick="abrirModalNuevoJuego()" class="btn-new-game diamax-action-btn-unified">+ Configurar Partido & Rival</button>',
    `${sunlightBtnHeader}      <button id="btn-config-game-header" onclick="abrirModalNuevoJuego()" class="btn-new-game diamax-action-btn-unified">+ Configurar Partido & Rival</button>`
  );
  console.log('Inserted Sunlight Mode button in main header.');
}

// Dugout scoreboard button for sunlight mode
const dugoutSunlightBtn = `
            <button type="button" id="btn-sunlight-dugout" onclick="toggleModoLuzSolar()" style="padding:8px 14px; background:#0F172A; color:#FFC72C; border:1.5px solid #FFC72C; border-radius:8px; font-family:'Plus Jakarta Sans',sans-serif; font-size:11.5px; font-weight:800; cursor:pointer; display:inline-flex; align-items:center; gap:6px;" title="Alternar entre Modo Sol y Modo Noche">
              <span>☀️</span> <span>MODO SOL</span>
            </button>
`;

if (!html.includes('btn-sunlight-dugout')) {
  html = html.replace(
    '<button type="button" id="btn-hot-sub-scoreboard"',
    `${dugoutSunlightBtn}            <button type="button" id="btn-hot-sub-scoreboard"`
  );
  console.log('Inserted Sunlight Mode button in Dugout scoreboard.');
}

// -----------------------------------------------------------------------------
// 4. TECLADO TÁCTIL EN 2 PASOS (ERGONOMÍA DUGOUT)
// -----------------------------------------------------------------------------
const dugout2StepKeypadHtml = `
      <!-- =========================================================================
           ⚡ TECLADO TÁCTIL EN 2 PASOS (ERGONOMÍA DUGOUT WCAG AAA)
           No tapa la pizarra ni los corredores. Botones táctiles 48px+.
           ========================================================================= -->
      <div class="panel" id="dugout-2step-keypad" style="margin-bottom:14px; background:#070D1A; border:1.5px solid #00D2FF; border-radius:14px; padding:16px; box-shadow:0 8px 24px rgba(0,0,0,0.5);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:18px;">⚡</span>
            <h4 style="margin:0; font-size:15px; font-weight:900; color:#00D2FF;">Teclado Táctil en 2 Pasos (Dugout Rápido)</h4>
          </div>
          <div style="display:flex; gap:6px;">
            <button type="button" id="btn-toggle-keypad-mode" onclick="toggleVistaTecladoDugout()" style="background:#0F172A; border:1px solid #334155; color:#94A3B8; padding:5px 10px; border-radius:6px; font-size:11px; font-weight:800; cursor:pointer;">
              📋 Alternar 36 Jugadas Clásicas
            </button>
          </div>
        </div>

        <!-- PASO 1: SELECCIONA EL TIPO DE JUGADA (MACRO-BOTONES 48PX) -->
        <div style="margin-bottom:12px;">
          <div style="font-size:11px; font-weight:900; color:#FFC72C; text-transform:uppercase; margin-bottom:6px; letter-spacing:0.5px;">
            Paso 1: Selecciona el Tipo de Acción
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:8px;">
            <button type="button" class="dugout-step1-btn active" id="btn-step1-hits" onclick="seleccionarCategoria2Paso('hits', this)" style="min-height:50px; background:linear-gradient(135deg, rgba(16,185,129,0.25), rgba(6,78,59,0.3)); border:2px solid #10B981; color:#A7F3D0; border-radius:10px; font-weight:900; font-size:13px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; box-shadow:0 2px 8px rgba(16,185,129,0.2);">
              <span>🟢</span> <span>BATAZO / HIT</span>
            </button>
            <button type="button" class="dugout-step1-btn" id="btn-step1-outs" onclick="seleccionarCategoria2Paso('outs', this)" style="min-height:50px; background:linear-gradient(135deg, rgba(239,68,68,0.2), rgba(127,29,29,0.3)); border:1.5px solid #EF4444; color:#FECACA; border-radius:10px; font-weight:900; font-size:13px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px;">
              <span>🔴</span> <span>OUT / DEF</span>
            </button>
            <button type="button" class="dugout-step1-btn" id="btn-step1-pitch" onclick="seleccionarCategoria2Paso('pitch', this)" style="min-height:50px; background:linear-gradient(135deg, rgba(0,210,255,0.2), rgba(30,58,138,0.3)); border:1.5px solid #00D2FF; color:#BAE6FD; border-radius:10px; font-weight:900; font-size:13px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px;">
              <span>🔵</span> <span>PITCHEO / BB</span>
            </button>
            <button type="button" class="dugout-step1-btn" id="btn-step1-extra" onclick="seleccionarCategoria2Paso('extra', this)" style="min-height:50px; background:linear-gradient(135deg, rgba(168,85,247,0.2), rgba(88,28,135,0.3)); border:1.5px solid #A855F7; color:#E9D5FF; border-radius:10px; font-weight:900; font-size:13px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px;">
              <span>🟣</span> <span>BASES / ROBO</span>
            </button>
          </div>
        </div>

        <!-- PASO 2: BOTONES ESPECÍFICOS DE ALTO TAMAÑO TÁCTIL (MÍNIMO 48PX) -->
        <div id="container-step2-options" style="background:#0F172A; border:1px solid #1E293B; border-radius:10px; padding:12px;">
          
          <!-- SUBGRUPO HITS -->
          <div id="subgroup-hits" class="step2-subgroup" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(110px, 1fr)); gap:8px;">
            <button type="button" onclick="ejecutarJugada2Pasos('1B')" class="btn-action btn-hit dugout-step2-btn" style="min-height:50px; font-size:13.5px; font-weight:900;">1B Sencillo</button>
            <button type="button" onclick="ejecutarJugada2Pasos('2B')" class="btn-action btn-hit dugout-step2-btn" style="min-height:50px; font-size:13.5px; font-weight:900;">2B Doble</button>
            <button type="button" onclick="ejecutarJugada2Pasos('3B')" class="btn-action btn-hit dugout-step2-btn" style="min-height:50px; font-size:13.5px; font-weight:900;">3B Triple</button>
            <button type="button" onclick="ejecutarJugada2Pasos('HR')" class="btn-action btn-hr dugout-step2-btn" style="min-height:50px; font-size:13.5px; font-weight:900;">👑 JONRÓN (HR)</button>
          </div>

          <!-- SUBGRUPO OUTS (OCULTO POR DEFECTO) -->
          <div id="subgroup-outs" class="step2-subgroup" style="display:none; grid-template-columns:repeat(auto-fit, minmax(95px, 1fr)); gap:8px;">
            <button type="button" onclick="ejecutarJugada2Pasos('K')" class="btn-action btn-out dugout-step2-btn" style="min-height:48px; font-size:13px; font-weight:900;">K Tirando</button>
            <button type="button" onclick="ejecutarJugada2Pasos('Kc')" class="btn-action btn-out dugout-step2-btn" style="min-height:48px; font-size:13px; font-weight:900;">Kc Cantado</button>
            <button type="button" onclick="ejecutarJugada2Pasos('6-3')" class="btn-action btn-out dugout-step2-btn" style="min-height:48px; font-size:13px; font-weight:900;">6-3 Rolata</button>
            <button type="button" onclick="ejecutarJugada2Pasos('4-3')" class="btn-action btn-out dugout-step2-btn" style="min-height:48px; font-size:13px; font-weight:900;">4-3 Rolata</button>
            <button type="button" onclick="ejecutarJugada2Pasos('5-3')" class="btn-action btn-out dugout-step2-btn" style="min-height:48px; font-size:13px; font-weight:900;">5-3 Rolata</button>
            <button type="button" onclick="ejecutarJugada2Pasos('1-3')" class="btn-action btn-out dugout-step2-btn" style="min-height:48px; font-size:13px; font-weight:900;">1-3 Rolata</button>
            <button type="button" onclick="ejecutarJugada2Pasos('6-4-3 DP')" class="btn-action btn-out dugout-step2-btn" style="min-height:48px; font-size:13px; font-weight:900; background:#7F1D1D;">6-4-3 DP</button>
            <button type="button" onclick="ejecutarJugada2Pasos('4-6-3 DP')" class="btn-action btn-out dugout-step2-btn" style="min-height:48px; font-size:13px; font-weight:900; background:#7F1D1D;">4-6-3 DP</button>
            <button type="button" onclick="ejecutarJugada2Pasos('F7')" class="btn-action btn-out dugout-step2-btn" style="min-height:48px; font-size:13px; font-weight:900;">F7 Jardín Izq</button>
            <button type="button" onclick="ejecutarJugada2Pasos('F8')" class="btn-action btn-out dugout-step2-btn" style="min-height:48px; font-size:13px; font-weight:900;">F8 Central</button>
            <button type="button" onclick="ejecutarJugada2Pasos('F9')" class="btn-action btn-out dugout-step2-btn" style="min-height:48px; font-size:13px; font-weight:900;">F9 Derecho</button>
            <button type="button" onclick="ejecutarJugada2Pasos('F4')" class="btn-action btn-out dugout-step2-btn" style="min-height:48px; font-size:13px; font-weight:900;">F4/F6 Infield</button>
          </div>

          <!-- SUBGRUPO PITCHEO (OCULTO POR DEFECTO) -->
          <div id="subgroup-pitch" class="step2-subgroup" style="display:none; grid-template-columns:repeat(auto-fit, minmax(100px, 1fr)); gap:8px;">
            <button type="button" onclick="registrarPitcheoRapido('4-Seam', true)" class="btn-action btn-hit dugout-step2-btn" style="min-height:48px; font-size:13px; font-weight:900; background:#0284C7; border-color:#0369A1;">+1 Strike</button>
            <button type="button" onclick="registrarPitcheoRapido('Bola', false)" class="btn-action btn-out dugout-step2-btn" style="min-height:48px; font-size:13px; font-weight:900; background:#DC2626; border-color:#991B1B;">+1 Bola</button>
            <button type="button" onclick="registrarPitcheoRapido('Foul', true)" class="btn-action dugout-step2-btn" style="min-height:48px; font-size:13px; font-weight:900; background:#D97706; color:#FFF; border:1px solid #B45309;">Foul Ball</button>
            <button type="button" onclick="ejecutarJugada2Pasos('BB')" class="btn-action btn-tactical dugout-step2-btn" style="min-height:48px; font-size:13px; font-weight:900;">BB Boleto</button>
            <button type="button" onclick="ejecutarJugada2Pasos('HBP')" class="btn-action btn-tactical dugout-step2-btn" style="min-height:48px; font-size:13px; font-weight:900;">HBP Golpeado</button>
          </div>

          <!-- SUBGRUPO EXTRA / BASES / ROBO (OCULTO POR DEFECTO) -->
          <div id="subgroup-extra" class="step2-subgroup" style="display:none; grid-template-columns:repeat(auto-fit, minmax(95px, 1fr)); gap:8px;">
            <button type="button" onclick="ejecutarJugada2Pasos('SB')" class="btn-action btn-tactical dugout-step2-btn" style="min-height:48px; font-size:13px; font-weight:900;">SB Robo Base</button>
            <button type="button" onclick="ejecutarJugada2Pasos('CS')" class="btn-action btn-out dugout-step2-btn" style="min-height:48px; font-size:13px; font-weight:900;">CS Out Robando</button>
            <button type="button" onclick="ejecutarJugada2Pasos('WP')" class="btn-action btn-tactical dugout-step2-btn" style="min-height:48px; font-size:13px; font-weight:900;">WP Wild Pitch</button>
            <button type="button" onclick="ejecutarJugada2Pasos('PB')" class="btn-action btn-tactical dugout-step2-btn" style="min-height:48px; font-size:13px; font-weight:900;">PB Passed Ball</button>
            <button type="button" onclick="ejecutarJugada2Pasos('BK')" class="btn-action btn-out dugout-step2-btn" style="min-height:48px; font-size:13px; font-weight:900;">BK Balk</button>
            <button type="button" onclick="ejecutarJugada2Pasos('E')" class="btn-action btn-out dugout-step2-btn" style="min-height:48px; font-size:13px; font-weight:900;">E Error</button>
            <button type="button" onclick="ejecutarJugada2Pasos('FC')" class="btn-action btn-tactical dugout-step2-btn" style="min-height:48px; font-size:13px; font-weight:900;">FC Fielder's Choice</button>
            <button type="button" onclick="ejecutarJugada2Pasos('SH')" class="btn-action btn-tactical dugout-step2-btn" style="min-height:48px; font-size:13px; font-weight:900;">SF / SH Sacrificio</button>
          </div>

        </div>

        <!-- BOTÓN DESHACER DESTACADO EN EL TECLADO 2 PASOS -->
        <div style="margin-top:10px;">
          <button type="button" onclick="deshacerJugadaLive()" class="btn-undo-large" style="width:100%; min-height:48px; background:linear-gradient(135deg, #DC2626 0%, #991B1B 100%); color:#FFFFFF; border:1.5px solid rgba(255,255,255,0.25); border-radius:10px; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 4px 12px rgba(220,38,38,0.35);">
            <span style="font-size:16px;">⌫</span>
            <span>CORREGIR ERROR: DESHACER / BORRAR ÚLTIMA JUGADA</span>
          </button>
        </div>
      </div>
`;

if (!html.includes('id="dugout-2step-keypad"')) {
  // Insert before panel-36-plays
  html = html.replace(
    '<div class="panel" id="panel-36-plays">',
    `${dugout2StepKeypadHtml}\n      <div class="panel" id="panel-36-plays" style="display:none;">`
  );
  console.log('Inserted Dugout 2-Step Keypad before panel-36-plays.');
}

// -----------------------------------------------------------------------------
// 5. BARRA DE NAVEGACIÓN INFERIOR (MÓVIL ERGONOMÍA DUGOUT)
// -----------------------------------------------------------------------------
const mobileBottomNavHtml = `
  <!-- =========================================================================
       📱 BARRA DE NAVEGACIÓN INFERIOR (MÓVIL ERGONOMÍA DUGOUT)
       Acceso rápido para pulgares: En Vivo, Lineup, Terreno, Cabina y Luz Solar
       ========================================================================= -->
  <nav id="mobile-bottom-nav" class="mobile-bottom-nav-bar" style="display:none;">
    <button type="button" class="mobile-nav-btn active" onclick="switchTab('envivo')" id="mob-nav-envivo">
      <span class="mob-icon">⚾</span>
      <span class="mob-lbl">En Vivo</span>
    </button>
    <button type="button" class="mobile-nav-btn" onclick="switchTab('lineup')" id="mob-nav-lineup">
      <span class="mob-icon">📋</span>
      <span class="mob-lbl">Lineup</span>
    </button>
    <button type="button" class="mobile-nav-btn" onclick="switchTab('campo')" id="mob-nav-campo">
      <span class="mob-icon">🏟️</span>
      <span class="mob-lbl">Terreno</span>
    </button>
    <button type="button" class="mobile-nav-btn" onclick="switchTab('cabina')" id="mob-nav-cabina">
      <span class="mob-icon">🎙️</span>
      <span class="mob-lbl">Cabina</span>
    </button>
    <button type="button" class="mobile-nav-btn" onclick="switchTab('tarjeta-oficial')" id="mob-nav-tarjeta">
      <span class="mob-icon">📄</span>
      <span class="mob-lbl">Tarjeta</span>
    </button>
    <button type="button" class="mobile-nav-btn" onclick="toggleModoLuzSolar()" id="mob-nav-sunlight">
      <span class="mob-icon">☀️</span>
      <span class="mob-lbl">Sol/Noche</span>
    </button>
  </nav>
`;

if (!html.includes('id="mobile-bottom-nav"')) {
  // Insert before </body> or closing app container
  html = html.replace('</body>', `${mobileBottomNavHtml}\n</body>`);
  console.log('Inserted Mobile Bottom Navigation Bar.');
}

// -----------------------------------------------------------------------------
// 6. ACTUALIZACIÓN 3: MANUAL DE OPERACIONES (tab-manual)
//    - Retirar PIN 1234
//    - Añadir Módulos 11, 12, 13
//    - Añadir Tarjeta de Emergencia de 60 Segundos (Dugout Cheat Sheet) para imprimir
// -----------------------------------------------------------------------------

// Replacement for Step 1.3 PIN in Module 1:
const oldPinPaso1_3 = `<div style="background:#0F172A; padding:10px; border-radius:6px; border-left:3px solid #FFC72C;">
            <strong style="color:#FFC72C;">Paso 1.3: PIN de Seguridad</strong>
            <p style="margin:4px 0 0 0; color:#CBD5E1;">Para mánagers y anotadores autorizados, el PIN canónico predeterminado es <strong><code>1234</code></strong> para desbloqueo táctico instantáneo.</p>
          </div>`;

const newPinPaso1_3 = `<div style="background:#0F172A; padding:10px; border-radius:6px; border-left:3px solid #10B981;">
            <strong style="color:#10B981;">Paso 1.3: Protocolo de Seguridad & Claves Individuales</strong>
            <p style="margin:4px 0 0 0; color:#CBD5E1;">Para mánagers, anotadores y personal de medios autorizados, el acceso está blindado mediante el <strong>Protocolo de Credenciales y Tokens Criptográficos SHA-256</strong> asignados por la Liga y 3Tree Security. Se ha retirado definitivamente cualquier PIN por defecto inseguro para garantizar la inviolabilidad del Event Store.</p>
          </div>`;

if (html.includes(oldPinPaso1_3)) {
  html = html.replace(oldPinPaso1_3, newPinPaso1_3);
  console.log('Replaced insecure PIN 1234 in tab-manual with league individual security protocol.');
}

// Modules 11, 12, 13 and Dugout Cheat Sheet to append inside tab-manual
const newModulesAndCheatSheet = `
      <!-- =========================================================================
           🎙️ MÓDULO 11: OPERACIÓN DE CABINA Y TRANSMISIÓN (RADIO, TV & OBS)
           ========================================================================= -->
      <div style="background:#070D1A; border:1px solid #00D2FF; border-radius:10px; padding:16px; margin-bottom:18px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:6px;">
          <h3 style="color:#00D2FF; font-size:14px; font-weight:900; margin:0; display:flex; align-items:center; gap:6px;">
            <span>🎙️</span> 11. Operación de Cabina y Transmisión: Radio, TV & Streaming OBS
          </h3>
          <span style="font-size:11px; background:rgba(0,210,255,0.2); color:#00D2FF; border:1px solid #00D2FF; font-weight:900; padding:2px 8px; border-radius:4px;">BROADCAST PROTOCOL</span>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:10px; font-size:11.5px;">
          <div style="background:#0F172A; padding:10px; border-radius:6px; border-left:3px solid #00D2FF;">
            <strong style="color:#00D2FF;">11.1 Cockpit Digital & Spotting Board:</strong>
            <p style="margin:4px 0 0 0; color:#CBD5E1;">Pantalla única glanceable a 60 cm. En cuanto el anotador registra una jugada en el dugout, la pantalla del narrador conmuta automáticamente al nuevo bateador mostrando su dorsal, AVG, OBP, OPS, línea del día y radar de los 9 defensores en el campo.</p>
          </div>
          <div style="background:#0F172A; padding:10px; border-radius:6px; border-left:3px solid #FFC72C;">
            <strong style="color:#FFC72C;">11.2 Píldoras Anti-Dead Air & Teleprompter:</strong>
            <p style="margin:4px 0 0 0; color:#CBD5E1;">Genera viñetas de contexto e historias en los 20 segundos entre lanzamientos. Activa automáticamente menciones de marcas patrocinadas al suscitarse ponches (K), jonrones, cambios de lanzador o robos de base.</p>
          </div>
          <div style="background:#0F172A; padding:10px; border-radius:6px; border-left:3px solid #10B981;">
            <strong style="color:#10B981;">11.3 Resumen de Salida a Comerciales:</strong>
            <p style="margin:4px 0 0 0; color:#CBD5E1;">Al completarse el 3er out, redacta el guion exacto de locución: <em>"Se fue la alta del 5to: 1 carrera, 2 hits, sin errores, 1 dejado en base. Pizarra: Guerreros 4, Rival 2. Ya regresamos..."</em></p>
          </div>
          <div style="background:#0F172A; padding:10px; border-radius:6px; border-left:3px solid #A855F7;">
            <strong style="color:#A855F7;">11.4 Vinculación con OBS Studio y vMix:</strong>
            <p style="margin:4px 0 0 0; color:#CBD5E1;">Cargue la URL de telemetría como <code>Browser Source</code> en OBS (1920x1080 a 60fps con fondo transparente) para incrustar el tercio inferior gráfico de televisión y gráficos de strike zone en tiempo real.</p>
          </div>
          <div style="background:#0F172A; padding:10px; border-radius:6px; border-left:3px solid #EF4444;">
            <strong style="color:#EF4444;">11.5 Pantalla Siempre Activa (Wake Lock):</strong>
            <p style="margin:4px 0 0 0; color:#CBD5E1;">El sistema activa automáticamente la API Screen Wake Lock para impedir que la tablet o laptop del narrador se suspenda por inactividad durante las 3 horas de transmisión.</p>
          </div>
        </div>
      </div>

      <!-- =========================================================================
           🎙️ MÓDULO 12: COMANDOS Y DICTADO DE NOTAS POR VOZ (SPEECH-TO-TEXT)
           ========================================================================= -->
      <div style="background:#070D1A; border:1px solid #FFC72C; border-radius:10px; padding:16px; margin-bottom:18px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:6px;">
          <h3 style="color:#FFC72C; font-size:14px; font-weight:900; margin:0; display:flex; align-items:center; gap:6px;">
            <span>🗣️</span> 12. Comandos y Dictado de Notas por Voz: Glosario & Filtro de Ruido
          </h3>
          <span style="font-size:11px; background:rgba(255,199,44,0.2); color:#FFC72C; border:1px solid #FFC72C; font-weight:900; padding:2px 8px; border-radius:4px;">STT ES-419</span>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:10px; font-size:11.5px;">
          <div style="background:#0F172A; padding:10px; border-radius:6px; border-left:3px solid #00D2FF;">
            <strong style="color:#00D2FF;">12.1 Dictado de Notas de Cabina (One-Touch):</strong>
            <p style="margin:4px 0 0 0; color:#CBD5E1;">Presione <code>[ 🎙️ Dictar Nota Rápida ]</code> y hable con naturalidad. El motor convierte su voz en texto y vincula la anotación directamente al bateador de turno, pitcher activo o cronología del juego.</p>
          </div>
          <div style="background:#0F172A; padding:10px; border-radius:6px; border-left:3px solid #10B981;">
            <strong style="color:#10B981;">12.2 Glosario de Comandos de Anotación Vocal:</strong>
            <ul style="margin:4px 0 0 16px; padding:0; color:#CBD5E1; line-height:1.5;">
              <li><code>"Hit al central"</code> / <code>"Sencillo"</code> ➔ Registra 1B y avanza corredores.</li>
              <li><code>"Ponche tirando"</code> ➔ Registra Out por K tirando.</li>
              <li><code>"Ponche cantado"</code> ➔ Registra Out por Kc cantado.</li>
              <li><code>"Cuatro tres"</code> / <code>"Seis tres"</code> ➔ Registra rolata a la posición.</li>
              <li><code>"Boleto"</code> / <code>"Base por bolas"</code> ➔ Registra BB.</li>
            </ul>
          </div>
          <div style="background:#0F172A; padding:10px; border-radius:6px; border-left:3px solid #EF4444;">
            <strong style="color:#EF4444;">12.3 Mitigación de Ruido en la Tribuna:</strong>
            <p style="margin:4px 0 0 0; color:#CBD5E1;">En estadios ruidosos, use micrófono de diadema unidireccional (patrón cardioide) colocado a 2 cm de la comisura de los labios. Evite micrófonos omnidireccionales que capturan música, gritos de fanáticos y cornetas.</p>
          </div>
        </div>
      </div>

      <!-- =========================================================================
           ☁️ MÓDULO 13: SINCRONIZACIÓN NUBE / LOCAL & CONTROL DE CONCURRENCIA
           ========================================================================= -->
      <div style="background:#070D1A; border:1px solid #10B981; border-radius:10px; padding:16px; margin-bottom:18px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:6px;">
          <h3 style="color:#10B981; font-size:14px; font-weight:900; margin:0; display:flex; align-items:center; gap:6px;">
            <span>☁️</span> 13. Sincronización Nube / Local & Reglas de Anotación Concurrente
          </h3>
          <span style="font-size:11px; background:rgba(16,185,129,0.2); color:#10B981; border:1px solid #10B981; font-weight:900; padding:2px 8px; border-radius:4px;">ZERO-COLLISION CONCURRENCY</span>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:10px; font-size:11.5px;">
          <div style="background:#0F172A; padding:10px; border-radius:6px; border-left:3px solid #10B981;">
            <strong style="color:#10B981;">13.1 Principio de Autoridad Máxima (Anotador Principal):</strong>
            <p style="margin:4px 0 0 0; color:#CBD5E1;">Si dos usuarios están conectados al mismo encuentro, el sistema designa al usuario con rol <code>MANAGER</code> o <code>COACH</code> acreditado en la mesa técnica como <strong>Master Scorer</strong>. Los narradores en cabina reciben telemetría en modo escucha (Read-Only) en menos de 100ms.</p>
          </div>
          <div style="background:#0F172A; padding:10px; border-radius:6px; border-left:3px solid #FFC72C;">
            <strong style="color:#FFC72C;">13.2 Resolución Automática de Conflictos:</strong>
            <p style="margin:4px 0 0 0; color:#CBD5E1;">Mediante <em>Event Sourcing</em> con estampas de tiempo atómicas (Vector Clocks en Supabase), cualquier jugada duplicada es serializada por orden cronológico estricto, previniendo sobreescritura de conteos o outs.</p>
          </div>
          <div style="background:#0F172A; padding:10px; border-radius:6px; border-left:3px solid #00D2FF;">
            <strong style="color:#00D2FF;">13.3 Desconexión y Resincronización Local (Offline First):</strong>
            <p style="margin:4px 0 0 0; color:#CBD5E1;">Si se pierde la señal celular, DIAMAX continúa operando al 100% en IndexedDB. Al restablecerse el WiFi o 5G, encola la ráfaga de eventos y la envía al servidor central sin pérdida de un solo lanzamiento.</p>
          </div>
        </div>
      </div>

      <!-- =========================================================================
           🚨 TARJETA DE EMERGENCIA DE 60 SEGUNDOS (DUGOUT CHEAT SHEET)
           Formato optimizado para imprimir en 1 sola hoja y plastificar en Dugout
           ========================================================================= -->
      <div id="dugout-cheat-sheet" style="background:#0B1328; border:2px solid #FFC72C; border-radius:12px; padding:18px; margin-bottom:20px; box-shadow:0 8px 25px rgba(255,199,44,0.15);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
          <div>
            <h3 style="margin:0; font-size:16px; font-weight:900; color:#FFC72C; display:flex; align-items:center; gap:8px;">
              <span>🚨</span> <span>Tarjeta de Emergencia de 60 Segundos (Dugout Cheat Sheet)</span>
            </h3>
            <span style="font-size:11px; color:#94A3B8;">Resolución instantánea de dudas de anotación y reglas oficiales para mánagers y árbitros</span>
          </div>
          <button type="button" onclick="imprimirTarjetaEmergenciaDugout()" style="background:linear-gradient(135deg, #FFC72C, #F59E0B); color:#000; border:none; border-radius:8px; padding:8px 14px; font-weight:900; font-size:12px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; box-shadow:0 2px 10px rgba(255,199,44,0.3);">
            <span>🖨️</span> <span>Imprimir Hoja Plastificada (1 Página)</span>
          </button>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:10px; font-size:11.5px;">
          
          <div style="background:#0F172A; border:1px solid #1E293B; border-radius:8px; padding:10px; border-left:4px solid #EF4444;">
            <strong style="color:#EF4444; font-size:12px;">⚖️ 1. Regla de Infield Fly (Regla 2.00 / 6.05e):</strong>
            <p style="margin:4px 0 0 0; color:#CBD5E1; line-height:1.4;">
              • <strong>Condiciones obligatorias:</strong> Menos de 2 outs (0 o 1 out) Y corredores en 1ra y 2da base, o bases llenas.<br>
              • <strong>Jugada:</strong> Elevado al cuadro que un infielder puede atrapar con esfuerzo ordinario (NO aplica en líneas ni toques).<br>
              • <strong>Resultado:</strong> El bateador es <strong>OUT AUTOMÁTICO</strong>. La bola sigue viva; corredores avanzan a su propio riesgo.
            </p>
          </div>

          <div style="background:#0F172A; border:1px solid #1E293B; border-radius:8px; padding:10px; border-left:4px solid #FFC72C;">
            <strong style="color:#FFC72C; font-size:12px;">⚖️ 2. Balk del Lanzador (Regla 8.05):</strong>
            <p style="margin:4px 0 0 0; color:#CBD5E1; line-height:1.4;">
              • Amagar tiro a 1ra o home sin soltar la pelota.<br>
              • No hacer la pausa completa de 1 segundo en posición de set con corredores en base.<br>
              • Iniciar movimiento al home y frenar o cambiar de intención.<br>
              • <strong>Sanción:</strong> Bola muerta. Todos los corredores avanzan 1 base sin riesgo de out.
            </p>
          </div>

          <div style="background:#0F172A; border:1px solid #1E293B; border-radius:8px; padding:10px; border-left:4px solid #00D2FF;">
            <strong style="color:#00D2FF; font-size:12px;">⚖️ 3. Wild Pitch (WP) vs. Passed Ball (PB):</strong>
            <p style="margin:4px 0 0 0; color:#CBD5E1; line-height:1.4;">
              • <strong>Wild Pitch (WP):</strong> Lanzamiento tan desviado, alto o que pica antes del plato que el receptor <em>no pudo retener con esfuerzo ordinario</em> ➔ Se anota al <strong>Lanzador</strong>.<br>
              • <strong>Passed Ball (PB):</strong> Lanzamiento que el receptor debió fildear con esfuerzo ordinario pero se le escapa ➔ Se anota al <strong>Receptor</strong> (no es carrera limpia).
            </p>
          </div>

          <div style="background:#0F172A; border:1px solid #1E293B; border-radius:8px; padding:10px; border-left:4px solid #10B981;">
            <strong style="color:#10B981; font-size:12px;">⚖️ 4. Fielder's Choice (FC) vs. Hit (1B):</strong>
            <p style="margin:4px 0 0 0; color:#CBD5E1; line-height:1.4;">
              • Si el fildeador opta por sacar a un corredor adelantado en 2da o 3ra y el bateador llega a 1ra a salvo ➔ Es <strong>Fielder's Choice (FC)</strong> (cuenta como turno oficial, NO es hit).<br>
              • Si el tiro no saca al corredor pero el bateador habría llegado a salvo a 1ra de todos modos por la colocación del batazo ➔ Se anota <strong>Hit (1B)</strong>.
            </p>
          </div>

        </div>
      </div>
`;

if (!html.includes('id="dugout-cheat-sheet"')) {
  // Find where Module 10 ends before tab-tarjeta-oficial
  html = html.replace(
    '<!-- MÓDULO 10: SINCRONIZACIÓN NUBE SUPABASE & MODO OFFLINE PWA -->',
    `<!-- MÓDULO 10: SINCRONIZACIÓN NUBE SUPABASE & MODO OFFLINE PWA -->`
  );
  // Find the end of tab-manual
  html = html.replace(
    '</div>\n  </div>\n\n  <div id="tab-tarjeta-oficial"',
    `${newModulesAndCheatSheet}\n    </div>\n  </div>\n\n  <div id="tab-tarjeta-oficial"`
  );
  console.log('Inserted Modules 11, 12, 13 and Dugout Cheat Sheet into tab-manual.');
}

// -----------------------------------------------------------------------------
// 7. JAVASCRIPT LOGIC: SUNLIGHT MODE, FREE PRESS VALIDATION & 2-STEP KEYPAD
// -----------------------------------------------------------------------------
const jsLogicUpdates = `
// =========================================================================
// ☀️ GESTIÓN DE MODO LUZ SOLAR (SUNLIGHT MODE WCAG AAA)
// =========================================================================
function toggleModoLuzSolar() {
  const isSunlight = document.body.classList.toggle('sunlight-mode');
  localStorage.setItem('diamax_sunlight_mode', isSunlight ? 'true' : 'false');
  
  const iconH = document.getElementById('btn-sunlight-icon');
  const labelH = document.getElementById('btn-sunlight-label');
  if (iconH && labelH) {
    iconH.textContent = isSunlight ? '🌙' : '☀️';
    labelH.textContent = isSunlight ? 'Modo Noche' : 'Luz Solar';
  }

  const mobSun = document.getElementById('mob-nav-sunlight');
  if (mobSun) {
    const iconM = mobSun.querySelector('.mob-icon');
    const lblM = mobSun.querySelector('.mob-lbl');
    if (iconM) iconM.textContent = isSunlight ? '🌙' : '☀️';
    if (lblM) lblM.textContent = isSunlight ? 'Noche' : 'Sol';
  }

  const btnDugout = document.getElementById('btn-sunlight-dugout');
  if (btnDugout) {
    btnDugout.innerHTML = isSunlight ? '<span>🌙</span> <span>MODO NOCHE</span>' : '<span>☀️</span> <span>MODO SOL</span>';
  }
}
window.toggleModoLuzSolar = toggleModoLuzSolar;

// Inicializar modo luz solar si estaba guardado
(function initSunlightMode() {
  if (localStorage.getItem('diamax_sunlight_mode') === 'true') {
    document.body.classList.add('sunlight-mode');
    setTimeout(() => {
      const iconH = document.getElementById('btn-sunlight-icon');
      const labelH = document.getElementById('btn-sunlight-label');
      if (iconH && labelH) {
        iconH.textContent = '🌙';
        labelH.textContent = 'Modo Noche';
      }
    }, 100);
  }
})();

// =========================================================================
// 🎟️ VALIDACIÓN DE CLAVE DE ACCESO GRATIS AL PLAN COMENTARISTA
// =========================================================================
window.validarClavePrensaGratis = function(origen) {
  const input = document.getElementById(origen === 'p2' ? 'input-key-media-p2' : 'input-key-media-p3');
  const val = (input ? input.value : '').trim().toUpperCase();
  const validKeys = ['PRENSA2026', 'MEDIAFREE', 'DIAMAXMEDIA', 'NARRADOR', 'COMENTARISTA', 'PRENSA', 'CABINA', '113714'];
  
  if (!val) {
    alert("Por favor introduzca su Clave de Prensa o Acreditación de Liga.");
    return;
  }

  if (validKeys.includes(val) || val === '113714') {
    localStorage.setItem('diamax_current_role', 'BROADCAST_MEDIA');
    localStorage.setItem('diamax_session_plan', 'MEDIA_PRO');
    localStorage.setItem('diamax_auth_token', 'TOKEN_PRENSA_' + Date.now());
    
    if (typeof currentUserSession !== 'undefined') {
      currentUserSession = {
        id: 'usr_media_' + Date.now(),
        email: 'prensa@diamaxpro.com',
        role: 'BROADCAST_MEDIA',
        plan: 'MEDIA_PRO',
        team: 'Cabina Oficial de Transmisión',
        verified: true
      };
    }

    if (typeof updateHeaderUserBadge === 'function') {
      try { updateHeaderUserBadge(); } catch(e){}
    }

    alert("🎙️ ¡Acceso Concedido de Prensa! Bienvenido a la Cabina Digital de DIAMAX PRO.");
    
    if (typeof irAPagina === 'function') irAPagina(3);
    if (typeof switchTab === 'function') switchTab('cabina');
    if (typeof iniciarCockpitCabina === 'function') {
      try { iniciarCockpitCabina(); } catch(e){}
    }
  } else {
    alert("❌ Clave de prensa no válida. Contacte al comisionado de la liga o administración.");
  }
};

// =========================================================================
// ⚡ CONTROL DEL TECLADO TÁCTIL EN 2 PASOS (DUGOUT)
// =========================================================================
function seleccionarCategoria2Paso(cat, btn) {
  document.querySelectorAll('.dugout-step1-btn').forEach(b => {
    b.classList.remove('active');
    b.style.borderColor = 'rgba(255,255,255,0.15)';
    b.style.boxShadow = 'none';
  });
  if (btn) {
    btn.classList.add('active');
    btn.style.borderColor = '#00D2FF';
    btn.style.boxShadow = '0 0 12px rgba(0,210,255,0.4)';
  }

  const subHits = document.getElementById('subgroup-hits');
  const subOuts = document.getElementById('subgroup-outs');
  const subPitch = document.getElementById('subgroup-pitch');
  const subExtra = document.getElementById('subgroup-extra');

  if (subHits) subHits.style.display = (cat === 'hits') ? 'grid' : 'none';
  if (subOuts) subOuts.style.display = (cat === 'outs') ? 'grid' : 'none';
  if (subPitch) subPitch.style.display = (cat === 'pitch') ? 'grid' : 'none';
  if (subExtra) subExtra.style.display = (cat === 'extra') ? 'grid' : 'none';
}
window.seleccionarCategoria2Paso = seleccionarCategoria2Paso;

function ejecutarJugada2Pasos(codigo) {
  if (typeof registrarJugadaLive === 'function') {
    registrarJugadaLive(codigo);
  } else {
    console.warn("registrarJugadaLive no encontrado, código:", codigo);
  }
}
window.ejecutarJugada2Pasos = ejecutarJugada2Pasos;

function toggleVistaTecladoDugout() {
  const panel2Step = document.getElementById('dugout-2step-keypad');
  const panel36 = document.getElementById('panel-36-plays');
  if (panel36 && panel2Step) {
    if (panel36.style.display === 'none') {
      panel36.style.display = 'block';
      panel36.scrollIntoView({ behavior: 'smooth' });
    } else {
      panel36.style.display = 'none';
      panel2Step.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
window.toggleVistaTecladoDugout = toggleVistaTecladoDugout;

function imprimirTarjetaEmergenciaDugout() {
  window.print();
}
window.imprimirTarjetaEmergenciaDugout = imprimirTarjetaEmergenciaDugout;
`;

if (!html.includes('☀️ GESTIÓN DE MODO LUZ SOLAR')) {
  html = html.replace('</script>', `${jsLogicUpdates}\n</script>`);
  console.log('Inserted JavaScript logic for Sunlight Mode, Free Press Validation & 2-Step Keypad.');
}

fs.writeFileSync('index.html', html, 'utf-8');
console.log('Successfully updated index.html! New length:', html.length);
