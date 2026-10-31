import fs from 'fs';

const indexPath = 'C:\\Users\\fitne\\Documents\\3Tree_Codebase\\DIAMAX\\index.html';
console.log('Reading index.html...');
let html = fs.readFileSync(indexPath, 'utf-8');

// 1. ELIMINAR TODAS LAS FUNCIONES TTS Y LLAMADAS A SpeechSynthesisUtterance / speechSynthesis en el ámbito de Cabina
html = html.replace(/function narrarPildoraTexto\(idx\) \{[\s\S]*?window\.narrarPildoraTexto = narrarPildoraTexto;\s*/g, '');
html = html.replace(/function narrarTextoCabina\(text\) \{[\s\S]*?window\.narrarTextoCabina = narrarTextoCabina;\s*/g, '');
html = html.replace(/function narrarSituacionCabinaCompleta\(\) \{[\s\S]*?window\.narrarSituacionCabinaCompleta = narrarSituacionCabinaCompleta;\s*/g, '');
html = html.replace(/function narrarFraseCabina\(id\) \{[\s\S]*?window\.narrarFraseCabina = narrarFraseCabina;\s*/g, '');

// También retirar botones de voz sintética en el markup
// A. Botón en alerta de sustitución
html = html.replace(
  /<button type="button" onclick="narrarTextoCabina\(document\.getElementById\('cockpit-sub-alert-text'\)\.innerText\)"[\s\S]*?<\/button>/g,
  ''
);

// B. Botones de "Narrar" en los 3 nuggets
html = html.replace(
  /<button type="button" onclick="narrarTextoCabina\(document\.getElementById\('cockpit-nugget-1'\)\.innerText\)"[^>]*>.*?<\/button>/g,
  ''
);
html = html.replace(
  /<button type="button" onclick="narrarTextoCabina\(document\.getElementById\('cockpit-nugget-2'\)\.innerText\)"[^>]*>.*?<\/button>/g,
  ''
);
html = html.replace(
  /<button type="button" onclick="narrarTextoCabina\(document\.getElementById\('cockpit-nugget-3'\)\.innerText\)"[^>]*>.*?<\/button>/g,
  ''
);

// C. Botón "Leer al Aire (Voz)" en teleprompter de patrocinio
html = html.replace(
  /<button type="button" onclick="narrarTextoCabina\(document\.getElementById\('cockpit-sponsor-text'\)\.innerText\)"[^>]*>[\s\S]*?<\/button>/g,
  ''
);

// D. Botón "Narrar Outro" en salida a comerciales
html = html.replace(
  /<button type="button" onclick="narrarTextoCabina\(document\.getElementById\('cockpit-commercial-script'\)\.innerText\)"[^>]*>[\s\S]*?<\/button>/g,
  ''
);

// E. Botones residuales en frases de cabina si existen
html = html.replace(/<button type="button" onclick="narrarFraseCabina\([^)]*\)"[^>]*>.*?<\/button>/g, '');
html = html.replace(/<button type="button" onclick="narrarPildoraTexto\([^)]*\)"[^>]*>.*?<\/button>/g, '');

console.log('Removed TTS / SpeechSynthesis code and buttons from Cabina.');

// 2. AÑADIR BOTÓN PRINCIPAL DE DICTADO POR VOZ Y SELECTOR DE DESTINO EN LA BARRA SUPERIOR DE CABINA
const oldTopControls = `        <!-- OVERLAY OBS / vMix -->
        <button type="button" onclick="copiarOverlayOBS()"`;

const newTopControls = `        <!-- 🎙️ BOTÓN DE UN SOLO TOQUE: DICTADO DE NOTAS POR VOZ (SPEECH-TO-TEXT) -->
        <button type="button" id="btn-dictar-nota-cabina" onclick="cabinaVoice.toggleGrabacion()" style="background:linear-gradient(135deg, #0284C7, #0369A1); border:1.5px solid #38BDF8; color:#FFFFFF; font-size:12px; font-weight:900; padding:8px 14px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; box-shadow:0 0 12px rgba(2,132,199,0.4);" title="Dictar nota por voz con un toque">
          <span style="font-size:14px;">🎙️</span> <span id="lbl-btn-dictar-nota">Dictar Nota de Juego</span>
        </button>

        <!-- SELECTOR RÁPIDO DE DESTINO DE NOTA -->
        <div style="display:inline-flex; align-items:center; gap:4px; background:#0B132B; padding:3px 8px; border-radius:8px; border:1px solid #1E293B;">
          <span style="font-size:9.5px; color:#94A3B8; font-weight:800; text-transform:uppercase;">Destino:</span>
          <button type="button" id="btn-note-target-batter" onclick="cabinaVoice.setTarget('batter')" style="background:#F59E0B; border:none; color:#000; font-size:10.5px; font-weight:900; padding:3px 7px; border-radius:4px; cursor:pointer;">👤 Bateador</button>
          <button type="button" id="btn-note-target-pitcher" onclick="cabinaVoice.setTarget('pitcher')" style="background:#1E293B; border:none; color:#CBD5E1; font-size:10.5px; font-weight:700; padding:3px 7px; border-radius:4px; cursor:pointer;">⚾ Pitcher</button>
          <button type="button" id="btn-note-target-game" onclick="cabinaVoice.setTarget('game')" style="background:#1E293B; border:none; color:#CBD5E1; font-size:10.5px; font-weight:700; padding:3px 7px; border-radius:4px; cursor:pointer;">📋 Inning</button>
        </div>

        <!-- OVERLAY OBS / vMix -->
        <button type="button" onclick="copiarOverlayOBS()"`;

html = html.replace(oldTopControls, newTopControls);

// 3. AÑADIR SECCIÓN DE APUNTES PROPIOS (PÍLDORAS AMARILLAS) EN EL SPOTTING BOARD
const oldBatterCardEnd = `          <!-- Siguiente Bateador (On-Deck) -->
          <div style="font-size:11.5px; color:#CBD5E1; background:rgba(255,255,255,0.03); padding:8px 12px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
            <span>⏳ <strong>Prevenido (En Espera):</strong></span>
            <span id="cockpit-batter-ondeck" style="color:#FFC72C; font-weight:800;">Carlos Mendoza #12 (3B)</span>
          </div>
        </div>`;

const newBatterCardEnd = `          <!-- Siguiente Bateador (On-Deck) -->
          <div style="font-size:11.5px; color:#CBD5E1; background:rgba(255,255,255,0.03); padding:8px 12px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
            <span>⏳ <strong>Prevenido (En Espera):</strong></span>
            <span id="cockpit-batter-ondeck" style="color:#FFC72C; font-weight:800;">Carlos Mendoza #12 (3B)</span>
          </div>

          <!-- NOTA DESTACADA DEL BATEADOR ACTUAL AL BATE (RECORDATORIO DE TURNO PREVIO) -->
          <div id="cockpit-batter-active-note" style="display:none; margin-top:10px; background:rgba(255, 199, 44, 0.12); border:1.5px solid #FFC72C; border-radius:8px; padding:8px 12px; color:#FFF;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
              <span style="font-size:9.5px; color:#FFC72C; font-weight:900; text-transform:uppercase;">⚡ APUNTE PREVIO DICTADO PARA ESTE BATEADOR:</span>
              <span id="cockpit-batter-active-note-time" style="font-size:9px; color:#94A3B8;"></span>
            </div>
            <div id="cockpit-batter-active-note-text" style="font-size:12px; font-weight:800; color:#FDE68A; line-height:1.35;"></div>
          </div>
        </div>

        <!-- 📝 MÓDULO DE APUNTES PROPIOS DEL NARRADOR (DICTADOS POR VOZ) -->
        <div style="background:#050B18; border:1.5px solid #FFC72C; border-radius:14px; padding:16px; box-shadow:0 4px 20px rgba(255,199,44,0.15);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <div style="font-size:11.5px; font-weight:900; color:#FFC72C; text-transform:uppercase; letter-spacing:0.8px; display:flex; align-items:center; gap:6px;">
              <span>📝</span> <span>APUNTES PROPIOS DEL NARRADOR</span>
            </div>
            <div style="display:flex; gap:5px;">
              <button type="button" onclick="cabinaVoice.toggleGrabacion('batter')" style="background:rgba(255,199,44,0.18); border:1px solid #FFC72C; color:#FFC72C; font-size:10.5px; font-weight:900; padding:3px 8px; border-radius:6px; cursor:pointer;" title="Dictar apunte para este bateador">
                🎙️ + Bateador
              </button>
              <button type="button" onclick="cabinaVoice.toggleGrabacion('game')" style="background:#1E293B; border:1px solid #475569; color:#CBD5E1; font-size:10.5px; font-weight:800; padding:3px 8px; border-radius:6px; cursor:pointer;" title="Dictar incidencia general">
                🎙️ + General
              </button>
            </div>
          </div>

          <!-- Transcripción en vivo (Interim) mientras habla -->
          <div id="cockpit-dictado-interim" style="display:none; background:rgba(239, 68, 68, 0.15); border:1.5px dashed #EF4444; border-radius:8px; padding:8px 12px; margin-bottom:10px; color:#FCA5A5; font-size:12px; font-weight:800; animation:pulseGlow 1s infinite;">
            Transcribiendo: ...
          </div>

          <!-- Contenedor de Píldoras Amarillas de Apuntes Propios -->
          <div id="cockpit-notes-container" style="display:flex; flex-direction:column; gap:8px; max-height:260px; overflow-y:auto; padding-right:4px;">
            <!-- Inyección dinámica -->
          </div>
        </div>`;

html = html.replace(oldBatterCardEnd, newBatterCardEnd);

// 4. INYECTAR LA CLASE CabinaVoiceNotes Y renderizarNotasCabina EN EL JAVASCRIPT
const voiceNotesClassJS = `
// =========================================================================
// 🎙️ NUEVA FUNCIÓN: DICTADO DE NOTAS POR VOZ PARA EL NARRADOR (SPEECH-TO-TEXT)
// SPEECHRECOGNITION NATIVO — CERO IA SINTÉTICA — SOLO APUNTES HUMANOS
// =========================================================================

class CabinaVoiceNotes {
  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Navegador no soporta reconocimiento de voz nativo.");
      this.supported = false;
    } else {
      this.supported = true;
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'es-419'; // Español latinoamericano / Florida / Caribe
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.isRecording = false;

      this.recognition.onstart = () => {
        this.isRecording = true;
        this.actualizarBotonUI(true);
      };

      this.recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        if (interimTranscript) {
          this.mostrarFeedbackDictado(interimTranscript);
        }
        if (finalTranscript) {
          this.guardarNota(finalTranscript);
        }
      };

      this.recognition.onend = () => {
        this.isRecording = false;
        this.actualizarBotonUI(false);
        this.ocultarFeedbackDictado();
      };

      this.recognition.onerror = (err) => {
        console.warn("Dictado SpeechRecognition error:", err.error);
        this.isRecording = false;
        this.actualizarBotonUI(false);
        this.ocultarFeedbackDictado();
        if (err.error === 'not-allowed') {
          alert("Permiso de micrófono denegado. Por favor permite el acceso al micrófono en el navegador para dictar notas.");
        }
      };
    }

    this.currentTarget = 'batter'; // 'batter', 'pitcher', 'game'
    this.cargarNotasDesdeStorage();
  }

  setTarget(target) {
    this.currentTarget = target;
    const btns = ['batter', 'pitcher', 'game'];
    btns.forEach(t => {
      const b = document.getElementById('btn-note-target-' + t);
      if (b) {
        if (t === target) {
          b.style.background = '#F59E0B';
          b.style.color = '#000';
          b.style.fontWeight = '900';
        } else {
          b.style.background = '#1E293B';
          b.style.color = '#CBD5E1';
          b.style.fontWeight = '700';
        }
      }
    });
    if (typeof mostrarToast === 'function') {
      const labels = { batter: 'Bateador de Turno', pitcher: 'Lanzador', game: 'Incidencia del Inning' };
      mostrarToast('🎙️ Destino de nota: ' + labels[target]);
    }
  }

  toggleGrabacion(target) {
    if (target) this.setTarget(target);
    if (!this.supported) {
      const texto = prompt("Tu navegador no soporta reconocimiento de voz nativo. Escribe tu apunte rápido para el narrador:");
      if (texto && texto.trim()) {
        this.guardarNota(texto.trim());
      }
      return;
    }
    if (this.isRecording) {
      try { this.recognition.stop(); } catch(e){}
      this.isRecording = false;
      this.actualizarBotonUI(false);
    } else {
      try {
        this.recognition.start();
      } catch (err) {
        console.warn("Recognition start error:", err);
      }
    }
  }

  cargarNotasDesdeStorage() {
    try {
      const raw = localStorage.getItem('diamax_cabina_notas');
      window.diamaxCabinaNotas = raw ? JSON.parse(raw) : [];
    } catch(e) {
      window.diamaxCabinaNotas = [];
    }
  }

  guardarEnStorage() {
    try {
      localStorage.setItem('diamax_cabina_notas', JSON.stringify(window.diamaxCabinaNotas || []));
    } catch(e){}
  }

  guardarNota(texto) {
    if (!texto || !texto.trim()) return;
    const current = (typeof getLiveCurrentBatter === 'function') ? getLiveCurrentBatter() : null;
    const ls = (typeof liveState !== 'undefined') ? liveState : { inning: 4, half: 'top' };
    
    let sujeto = 'Incidencia General';
    let sujetoId = 'game';
    if (this.currentTarget === 'batter') {
      sujeto = current?.player?.name || 'Bateador de Turno';
      sujetoId = current?.player?.id || ('batter_' + (current?.player?.num || '1'));
    } else if (this.currentTarget === 'pitcher') {
      sujeto = current?.pitcherName || 'Lanzador Activo';
      sujetoId = 'pitcher_active';
    }

    const nuevaNota = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tipo: this.currentTarget, // 'batter', 'pitcher', 'game'
      sujetoId: String(sujetoId),
      sujeto: sujeto,
      texto: texto.trim(),
      inning: 'Inn ' + (ls.inning || 1) + ' ' + (ls.half === 'bot' || ls.half === 'bottom' ? '▼' : '▲')
    };

    if (!window.diamaxCabinaNotas) window.diamaxCabinaNotas = [];
    window.diamaxCabinaNotas.unshift(nuevaNota);
    this.guardarEnStorage();
    renderizarNotasCabina();
    if (typeof mostrarToast === 'function') mostrarToast('🎙️ Nota guardada: "' + nuevaNota.texto.substring(0, 32) + '..."');
  }

  eliminarNota(id) {
    if (!window.diamaxCabinaNotas) return;
    window.diamaxCabinaNotas = window.diamaxCabinaNotas.filter(n => n.id !== id);
    this.guardarEnStorage();
    renderizarNotasCabina();
    if (typeof mostrarToast === 'function') mostrarToast('🗑️ Apunte eliminado.');
  }

  editarNota(id) {
    const nota = (window.diamaxCabinaNotas || []).find(n => n.id === id);
    if (!nota) return;
    const nuevoTexto = prompt("Editar apunte del narrador:", nota.texto);
    if (nuevoTexto !== null && nuevoTexto.trim() !== '') {
      nota.texto = nuevoTexto.trim();
      this.guardarEnStorage();
      renderizarNotasCabina();
      if (typeof mostrarToast === 'function') mostrarToast('✏️ Apunte actualizado.');
    }
  }

  actualizarBotonUI(grabando) {
    const btn = document.getElementById('btn-dictar-nota-cabina');
    const lbl = document.getElementById('lbl-btn-dictar-nota');
    if (!btn) return;
    if (grabando) {
      btn.style.background = '#EF4444';
      btn.style.borderColor = '#FCA5A5';
      btn.classList.add('cockpit-alert-blink');
      if (lbl) lbl.innerText = '● Grabando nota... hable ahora (Toque para terminar)';
    } else {
      btn.style.background = 'linear-gradient(135deg, #0284C7, #0369A1)';
      btn.style.borderColor = '#38BDF8';
      btn.classList.remove('cockpit-alert-blink');
      if (lbl) lbl.innerText = 'Dictar Nota de Juego';
    }
  }

  mostrarFeedbackDictado(interim) {
    const fEl = document.getElementById('cockpit-dictado-interim');
    if (fEl) {
      fEl.style.display = 'block';
      fEl.innerText = '🎙️ Transcribiendo: "' + interim + '..."';
    }
  }

  ocultarFeedbackDictado() {
    const fEl = document.getElementById('cockpit-dictado-interim');
    if (fEl) {
      fEl.style.display = 'none';
      fEl.innerText = '';
    }
  }
}

window.cabinaVoice = new CabinaVoiceNotes();

// Renderizar Píldoras Amarillas de Apuntes Propios en el Spotting Board
function renderizarNotasCabina() {
  const container = document.getElementById('cockpit-notes-container');
  if (!container) return;

  const notas = window.diamaxCabinaNotas || [];
  const current = (typeof getLiveCurrentBatter === 'function') ? getLiveCurrentBatter() : null;
  const currentBatterId = current?.player?.id ? String(current.player.id) : null;
  const currentBatterName = current?.player?.name ? current.player.name.toLowerCase() : '';

  // Actualizar Apunte Activo en la Tarjeta del Bateador (si tiene alguno previo)
  const activeNoteCard = document.getElementById('cockpit-batter-active-note');
  const activeNoteText = document.getElementById('cockpit-batter-active-note-text');
  const activeNoteTime = document.getElementById('cockpit-batter-active-note-time');
  
  const batterNote = notas.find(n => 
    (n.tipo === 'batter' && currentBatterId && String(n.sujetoId) === currentBatterId) ||
    (n.tipo === 'batter' && currentBatterName && n.sujeto && n.sujeto.toLowerCase().includes(currentBatterName))
  );

  if (activeNoteCard && activeNoteText) {
    if (batterNote) {
      activeNoteCard.style.display = 'block';
      activeNoteText.innerText = '“' + batterNote.texto + '”';
      if (activeNoteTime) activeNoteTime.innerText = '[' + batterNote.inning + '] ' + batterNote.timestamp;
    } else {
      activeNoteCard.style.display = 'none';
    }
  }

  // Renderizar la lista completa de píldoras amarillas
  if (notas.length === 0) {
    container.innerHTML = '<div style="font-size:11.5px; color:#64748B; font-style:italic; padding:8px 0; text-align:center;">Sin apuntes dictados aún. Toca [🎙️ Dictar Nota] para grabar tu observación con la voz.</div>';
    return;
  }

  let html = '';
  notas.forEach(nota => {
    const badgeColor = nota.tipo === 'batter' ? '#FFC72C' : (nota.tipo === 'pitcher' ? '#10B981' : '#38BDF8');
    const badgeLabel = nota.tipo === 'batter' ? '👤 Bateador' : (nota.tipo === 'pitcher' ? '⚾ Pitcher' : '📋 Inning');

    html += \`
      <div style="background:rgba(255, 199, 44, 0.09); border:1.5px solid \${badgeColor}; border-radius:10px; padding:9px 12px; display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
        <div style="flex:1;">
          <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:3px;">
            <span style="font-size:9.5px; font-weight:900; color:\${badgeColor}; background:rgba(0,0,0,0.4); padding:1px 6px; border-radius:4px; text-transform:uppercase;">
              \${badgeLabel}
            </span>
            <strong style="font-size:11px; color:#FFFFFF;">\${nota.sujeto}</strong>
            <span style="font-size:9.5px; color:#94A3B8;">• [\${nota.inning}] \${nota.timestamp}</span>
          </div>
          <div style="font-size:12px; color:#FDE68A; font-weight:700; line-height:1.4;">
            “\${nota.texto}”
          </div>
        </div>
        <div style="display:flex; gap:4px; flex-shrink:0;">
          <button type="button" onclick="cabinaVoice.editarNota(\${nota.id})" style="background:#1E293B; border:none; color:#CBD5E1; padding:3px 6px; border-radius:4px; font-size:11px; cursor:pointer;" title="Editar texto de la nota">✏️</button>
          <button type="button" onclick="cabinaVoice.eliminarNota(\${nota.id})" style="background:rgba(239,68,68,0.2); border:1px solid #EF4444; color:#F87171; padding:3px 6px; border-radius:4px; font-size:11px; cursor:pointer;" title="Eliminar nota">🗑️</button>
        </div>
      </div>
    \`;
  });

  container.innerHTML = html;
}
window.renderizarNotasCabina = renderizarNotasCabina;
`;

// Insert voice notes class right before actualizarCockpitCabina
const hookTarget = 'function actualizarCockpitCabina(lastAction, lastPayload) {';
html = html.replace(hookTarget, voiceNotesClassJS + '\n\n' + hookTarget);

// Ensure actualizarCockpitCabina calls renderizarNotasCabina
const hookRenderNotas = `  // E. Radar de 9 Defensores
  actualizarRadarDefensaCabina();

  // H. Renderizar Apuntes Dictados por Voz en el Spotting Board
  if (typeof renderizarNotasCabina === 'function') renderizarNotasCabina();`;

html = html.replace('  // E. Radar de 9 Defensores\n  actualizarRadarDefensaCabina();', hookRenderNotas);

console.log('Writing updated index.html with CabinaVoiceNotes engine...');
fs.writeFileSync(indexPath, html, 'utf-8');
console.log('Successfully completed cleanup of TTS and addition of Speech-to-Text Voice Notes!');
