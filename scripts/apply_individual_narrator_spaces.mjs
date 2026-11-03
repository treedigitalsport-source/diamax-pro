import fs from 'fs';
import path from 'path';

const indexPath = path.resolve('index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

console.log('Aplicando corrección de espacio individual y retirando Lic. Alí Zapata de narrador...');

// 1. Corregir getNombreNarradorCabina para que retorne "Por Asignar" por defecto
const getNombreNarradorTarget = `function getNombreNarradorCabina() {
  try {
    const guardado = localStorage.getItem('diamax_nombre_narrador');
    if (guardado && guardado.trim()) return guardado.trim();
  } catch(e){}

  if (typeof currentUserSession !== 'undefined' && currentUserSession && currentUserSession.name) {
    return currentUserSession.name.trim();
  }
  return "Lic. Alí Zapata"; // Narrador Oficial / Fundador por defecto
}`;

const getNombreNarradorReplacement = `function getNombreNarradorCabina() {
  try {
    const guardado = localStorage.getItem('diamax_nombre_narrador');
    if (guardado && guardado.trim() && guardado.trim() !== 'Lic. Alí Zapata' && guardado.trim() !== 'Por Asignar') {
      return guardado.trim();
    }
  } catch(e){}

  if (typeof currentUserSession !== 'undefined' && currentUserSession && currentUserSession.role === 'BROADCAST_MEDIA' && currentUserSession.name && currentUserSession.name !== 'Lic. Alí Zapata') {
    return currentUserSession.name.trim();
  }
  return "Por Asignar"; // Sin nombre asignado por defecto
}`;

if (html.includes(getNombreNarradorTarget)) {
  html = html.replace(getNombreNarradorTarget, getNombreNarradorReplacement);
  console.log('✓ getNombreNarradorCabina corregido (default: "Por Asignar").');
} else {
  console.warn('⚠️ No se encontró getNombreNarradorTarget exacto.');
}

// 2. Corregir el tag de cockpit-narrator-name en el HTML del Cockpit
const cockpitNarratorHtmlTarget = `<strong id="cockpit-narrator-name" style="font-size:13px; color:#FFFFFF; font-weight:900; cursor:pointer;" onclick="cambiarNombreNarradorCabina()" title="Toca para cambiar de narrador">Lic. Alí Zapata</strong>`;
const cockpitNarratorHtmlReplacement = `<strong id="cockpit-narrator-name" style="font-size:13px; color:#FFFFFF; font-weight:900; cursor:pointer;" onclick="cambiarNombreNarradorCabina()" title="Toca para asignar narrador">Por Asignar</strong>`;

if (html.includes(cockpitNarratorHtmlTarget)) {
  html = html.replace(cockpitNarratorHtmlTarget, cockpitNarratorHtmlReplacement);
  console.log('✓ cockpit-narrator-name en HTML cambiado a "Por Asignar".');
} else {
  console.warn('⚠️ No se encontró cockpitNarratorHtmlTarget exacto.');
}

// 3. Corregir DEFAULT_COMMENTATORS para eliminar comm_ali_zapata y añadir campo team
const defaultCommentatorsTarget = `    const DEFAULT_COMMENTATORS = [
      {
        id: "comm_pedro_chavez",
        name: "Pedro Chávez",
        handle: "@pedro_chavez_narrador",
        mediaOutlet: "YouTube Live / Radio 101.5 FM",
        role: "NARRADOR_PLAY_BY_PLAY",
        channelUrl: "https://youtube.com/live/diamax_baseball",
        activeGameId: "game_master",
        catchphrase: "¡A lo profundo... y noooo... no regresará jamás! Cuadrangular descomunal",
        assignedSponsors: [
          { id: "spons_titan", brand: "Baterías Titán", trigger: "HR", text: "¡Poder total en este batazo descomunal! Baterías Titán: la energía que nunca falla en el momento clutch." },
          { id: "spons_ferreteria", brand: "Ferretería La Solución", trigger: "DP", text: "¡Doble matanza redonda y cerrojo perfecto! Ferretería La Solución: materiales y herramientas para cerrar cualquier entrada." }
        ],
        stats: { gamesBroadcasted: 14, pillsRead: 58 },
        status: "on_air",
        createdAt: "2026-11-03T10:00:00.000Z"
      },
      {
        id: "comm_ali_zapata",
        name: "Lic. Alí Zapata",
        handle: "@alizapata_coach",
        mediaOutlet: "DIAMAX Network TV & Streaming",
        role: "COMENTARISTA_SABERMETRICO",
        channelUrl: "https://youtube.com/live/diamax_network",
        activeGameId: "game_master",
        catchphrase: "La sabermetría y el semáforo médico dictan la jugada clave en el diamante.",
        assignedSponsors: [
          { id: "spons_diamante", brand: "Seguros Diamante Pro", trigger: "PITCH_CHANGE", text: "Llamada al bullpen y visita a la lomita. Este relevo seguro llega respaldado por Seguros Diamante Pro: tu póliza de confianza en cada jugada." },
          { id: "spons_medica_55", brand: "Clínica Especializada +55", trigger: "FATIGUE_75", text: "El brazo llega a 75 envíos y la fatiga exige precisión. Cuida tu salud y rendimiento con la Clínica Médica Deportiva 55." }
        ],
        stats: { gamesBroadcasted: 28, pillsRead: 92 },
        status: "standby",
        createdAt: "2026-11-03T10:00:00.000Z"
      },
      {
        id: "comm_beto_mendez",
        name: "Beto Méndez",
        handle: "@betomendez_radio",
        mediaOutlet: "Circuito Radial Deportivo 98.9 FM",
        role: "VOZ_COMERCIAL_Y_COLOR",
        channelUrl: "https://radio.diamaxpro.com/live",
        activeGameId: "game_master",
        catchphrase: "¡Sensación en las cuatro esquinas! Emoción pura en el diamante.",
        assignedSponsors: [
          { id: "spons_titan", brand: "Baterías Titán", trigger: "HR", text: "¡Poder total en este batazo descomunal! Baterías Titán: la energía que nunca falla en el momento clutch." },
          { id: "spons_diamante", brand: "Seguros Diamante Pro", trigger: "PITCH_CHANGE", text: "Llamada al bullpen y visita a la lomita. Este relevo seguro llega respaldado por Seguros Diamante Pro: tu póliza de confianza en cada jugada." }
        ],
        stats: { gamesBroadcasted: 9, pillsRead: 41 },
        status: "standby",
        createdAt: "2026-11-03T10:00:00.000Z"
      }
    ];`;

const defaultCommentatorsReplacement = `    const DEFAULT_COMMENTATORS = [
      {
        id: "comm_pedro_chavez",
        name: "Pedro Chávez",
        handle: "@pedro_chavez_narrador",
        team: "Guerreros de Tampa",
        mediaOutlet: "YouTube Live / Radio 101.5 FM",
        role: "NARRADOR_PLAY_BY_PLAY",
        channelUrl: "https://youtube.com/live/diamax_baseball",
        activeGameId: "game_master",
        catchphrase: "¡A lo profundo... y noooo... no regresará jamás! Cuadrangular descomunal",
        privateNotes: [
          { id: "note_1", text: "Atención a la recta cortada de Pedro en conteos de 2 strikes.", target: "pitcher", timestamp: Date.now() }
        ],
        assignedSponsors: [
          { id: "spons_titan", brand: "Baterías Titán", trigger: "HR", text: "¡Poder total en este batazo descomunal! Baterías Titán: la energía que nunca falla en el momento clutch." },
          { id: "spons_ferreteria", brand: "Ferretería La Solución", trigger: "DP", text: "¡Doble matanza redonda y cerrojo perfecto! Ferretería La Solución: materiales y herramientas para cerrar cualquier entrada." }
        ],
        stats: { gamesBroadcasted: 14, pillsRead: 58 },
        status: "standby",
        createdAt: "2026-11-03T10:00:00.000Z"
      },
      {
        id: "comm_beto_mendez",
        name: "Beto Méndez",
        handle: "@betomendez_radio",
        team: "Guerreros de Tampa",
        mediaOutlet: "Circuito Radial Deportivo 98.9 FM",
        role: "VOZ_COMERCIAL_Y_COLOR",
        channelUrl: "https://radio.diamaxpro.com/live",
        activeGameId: "game_master",
        catchphrase: "¡Sensación en las cuatro esquinas! Emoción pura en el diamante.",
        privateNotes: [
          { id: "note_2", text: "Recordar mencionar el patrocinio de Baterías Titán al primer HR.", target: "game", timestamp: Date.now() }
        ],
        assignedSponsors: [
          { id: "spons_titan", brand: "Baterías Titán", trigger: "HR", text: "¡Poder total en este batazo descomunal! Baterías Titán: la energía que nunca falla en el momento clutch." },
          { id: "spons_diamante", brand: "Seguros Diamante Pro", trigger: "PITCH_CHANGE", text: "Llamada al bullpen y visita a la lomita. Este relevo seguro llega respaldado por Seguros Diamante Pro: tu póliza de confianza en cada jugada." }
        ],
        stats: { gamesBroadcasted: 9, pillsRead: 41 },
        status: "standby",
        createdAt: "2026-11-03T10:00:00.000Z"
      }
    ];`;

if (html.includes(defaultCommentatorsTarget)) {
  html = html.replace(defaultCommentatorsTarget, defaultCommentatorsReplacement);
  console.log('✓ DEFAULT_COMMENTATORS actualizado (eliminado Lic. Alí Zapata, añadido campo team y privateNotes).');
} else {
  console.warn('⚠️ No se encontró defaultCommentatorsTarget exacto.');
}

// 4. Cambiar activeCommentatorId inicial a null (sin narrador por defecto)
const activeIdTarget = `    let activeCommentatorId = "comm_pedro_chavez";`;
const activeIdReplacement = `    let activeCommentatorId = null;`;

if (html.includes(activeIdTarget)) {
  html = html.replace(activeIdTarget, activeIdReplacement);
  console.log('✓ activeCommentatorId inicial cambiado a null (sin narrador asignado por defecto).');
}

// 5. Actualizar renderDirectory para mostrar el equipo y el espacio individual
const renderDirTarget = `      container.innerHTML = cachedCommentators.map(c => {
        const isOnAir = (c.status === 'on_air' || c.id === activeCommentatorId);
        const borderStyle = isOnAir ? 'border:1.8px solid #34D399; box-shadow:0 0 20px rgba(52, 211, 153, 0.25);' : 'border:1px solid #1E293B;';
        const statusBadge = isOnAir 
          ? '<span style="background:rgba(16,185,129,0.25); border:1px solid #10B981; color:#34D399; font-size:10px; font-weight:900; padding:3px 8px; border-radius:12px; display:inline-flex; align-items:center; gap:5px;"><span style="width:6px; height:6px; border-radius:50%; background:#10B981; box-shadow:0 0 6px #10B981;"></span>ON AIR</span>'
          : '<span style="background:rgba(100,116,139,0.2); border:1px solid #475569; color:#94A3B8; font-size:10px; font-weight:800; padding:3px 8px; border-radius:12px;">STANDBY</span>';

        return \`
          <div style="background:#060A12; \${borderStyle} border-radius:14px; padding:16px; display:flex; flex-direction:column; justify-content:space-between; gap:12px; transition:all 0.2s ease;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                <div style="display:flex; align-items:center; gap:10px;">
                  <div style="width:38px; height:38px; border-radius:10px; background:linear-gradient(135deg, #1E293B, #0F172A); border:1px solid rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:900; color:#FFFFFF;">
                    \${c.name.split(' ').map(n=>n[0]).slice(0,2).join('')}
                  </div>
                  <div>
                    <strong style="display:block; font-size:14px; color:#FFFFFF; font-weight:900;">\${c.name}</strong>
                    <span style="font-size:11px; color:#94A3B8;">\${c.handle || '@diamax'}</span>
                  </div>
                </div>
                \${statusBadge}
              </div>

              <div style="display:flex; align-items:center; gap:6px; margin-bottom:8px; flex-wrap:wrap;">
                \${roleBadges[c.role] || ''}
                <span style="font-size:10.5px; color:#CBD5E1; background:rgba(255,255,255,0.06); padding:2px 6px; border-radius:4px;">\${c.mediaOutlet}</span>
              </div>

              <div style="background:#020617; border-left:3px solid #D97706; padding:8px 10px; border-radius:0 8px 8px 0; margin-bottom:10px;">
                <p style="margin:0; font-size:11.5px; color:#F1F5F9; font-style:italic; line-height:1.4;">
                  "\${c.catchphrase || 'Emoción pura en el terreno de juego.'}"
                </p>
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; font-size:10.5px; color:#64748B; border-top:1px solid rgba(255,255,255,0.05); padding-top:8px;">
                <span>🎙️ Partidos: <strong style="color:#FFF;">\${c.stats?.gamesBroadcasted || 0}</strong></span>
                <span>📢 Cuñas Leídas: <strong style="color:#FFF;">\${c.stats?.pillsRead || 0}</strong></span>
              </div>
            </div>

            <div style="display:flex; gap:8px;">
              \${c.channelUrl ? \`<a href="\${c.channelUrl}" target="_blank" rel="noopener" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); color:#94A3B8; text-decoration:none; padding:7px 10px; border-radius:8px; font-size:11px; font-weight:700; display:inline-flex; align-items:center; gap:4px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>\` : ''}
              <button type="button" onclick="DIAMAX_BROADCAST.asignarNarradorActivo('\${c.id}', '\${c.name}')" style="flex:1; background:\${isOnAir ? '#10B981' : '#D97706'}; border:none; color:#FFFFFF; font-size:11.5px; font-weight:900; padding:8px 12px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:6px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
                <span>\${isOnAir ? 'Narrador Oficial ON AIR' : 'Asignar como Narrador'}</span>
              </button>
            </div>
          </div>
        \`;
      }).join('');`;

const renderDirReplacement = `      container.innerHTML = cachedCommentators.map(c => {
        const isOnAir = (activeCommentatorId && (c.id === activeCommentatorId || c.status === 'on_air'));
        const borderStyle = isOnAir ? 'border:1.8px solid #34D399; box-shadow:0 0 20px rgba(52, 211, 153, 0.25);' : 'border:1px solid #1E293B;';
        const statusBadge = isOnAir 
          ? '<span style="background:rgba(16,185,129,0.25); border:1px solid #10B981; color:#34D399; font-size:10px; font-weight:900; padding:3px 8px; border-radius:12px; display:inline-flex; align-items:center; gap:5px;"><span style="width:6px; height:6px; border-radius:50%; background:#10B981; box-shadow:0 0 6px #10B981;"></span>ESPACIO ACTIVO ON AIR</span>'
          : '<span style="background:rgba(100,116,139,0.2); border:1px solid #475569; color:#94A3B8; font-size:10px; font-weight:800; padding:3px 8px; border-radius:12px;">CABINA STANDBY</span>';

        return \`
          <div style="background:#060A12; \${borderStyle} border-radius:14px; padding:16px; display:flex; flex-direction:column; justify-content:space-between; gap:12px; transition:all 0.2s ease;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                <div style="display:flex; align-items:center; gap:10px;">
                  <div style="width:38px; height:38px; border-radius:10px; background:linear-gradient(135deg, #1E293B, #0F172A); border:1px solid rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:900; color:#FFFFFF;">
                    \${c.name.split(' ').map(n=>n[0]).slice(0,2).join('')}
                  </div>
                  <div>
                    <strong style="display:block; font-size:14px; color:#FFFFFF; font-weight:900;">\${c.name}</strong>
                    <span style="font-size:11px; color:#94A3B8;">\${c.handle || '@diamax'}</span>
                  </div>
                </div>
                \${statusBadge}
              </div>

              <!-- EQUIPO Y ROL INDIVIDUAL -->
              <div style="display:flex; align-items:center; gap:6px; margin-bottom:8px; flex-wrap:wrap;">
                <span style="background:rgba(217, 119, 6, 0.15); border:1px solid #D97706; color:#FDE68A; font-size:10px; font-weight:800; padding:2px 7px; border-radius:6px;">Equipo: \${c.team || 'Guerreros de Tampa'}</span>
                \${roleBadges[c.role] || ''}
                <span style="font-size:10.5px; color:#CBD5E1; background:rgba(255,255,255,0.06); padding:2px 6px; border-radius:4px;">\${c.mediaOutlet}</span>
              </div>

              <div style="background:#020617; border-left:3px solid #D97706; padding:8px 10px; border-radius:0 8px 8px 0; margin-bottom:10px;">
                <p style="margin:0; font-size:11.5px; color:#F1F5F9; font-style:italic; line-height:1.4;">
                  "\${c.catchphrase || 'Emoción pura en el terreno de juego.'}"
                </p>
              </div>

              <!-- APUNTES Y ESTADÍSTICAS INDIVIDUALES -->
              <div style="display:flex; justify-content:space-between; align-items:center; font-size:10.5px; color:#64748B; border-top:1px solid rgba(255,255,255,0.05); padding-top:8px;">
                <span>🎙️ Partidos: <strong style="color:#FFF;">\${c.stats?.gamesBroadcasted || 0}</strong></span>
                <span>📢 Cuñas Leídas: <strong style="color:#FFF;">\${c.stats?.pillsRead || 0}</strong></span>
                <span>📝 Notas: <strong style="color:#38BDF8;">\${(c.privateNotes && c.privateNotes.length) || 0}</strong></span>
              </div>
            </div>

            <div style="display:flex; gap:8px;">
              \${c.channelUrl ? \`<a href="\${c.channelUrl}" target="_blank" rel="noopener" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); color:#94A3B8; text-decoration:none; padding:7px 10px; border-radius:8px; font-size:11px; font-weight:700; display:inline-flex; align-items:center; gap:4px;" title="Ver canal"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>\` : ''}
              <button type="button" onclick="DIAMAX_BROADCAST.asignarNarradorActivo('\${c.id}', '\${c.name}')" style="flex:1; background:\${isOnAir ? '#10B981' : '#D97706'}; border:none; color:#FFFFFF; font-size:11.5px; font-weight:900; padding:8px 12px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:6px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
                <span>\${isOnAir ? 'Espacio Activo (Toca para Cerrar)' : 'Entrar a Mi Espacio Individual'}</span>
              </button>
            </div>
          </div>
        \`;
      }).join('');`;

if (html.includes(renderDirTarget)) {
  html = html.replace(renderDirTarget, renderDirReplacement);
  console.log('✓ renderDirectory actualizado con soporte de espacio individual y equipo.');
} else {
  console.warn('⚠️ No se encontró renderDirTarget exacto.');
}

// 6. Actualizar asignarNarradorActivo para permitir toggle / desasignar
const asignarTarget = `    function asignarNarradorActivo(id, name) {
      activeCommentatorId = id;
      try {
        localStorage.setItem('diamax_nombre_narrador', name);
        localStorage.setItem('diamax_active_commentator_id', id);
      } catch(e){}

      const cockpitEl = document.getElementById('cockpit-narrator-name');
      if (cockpitEl) cockpitEl.innerText = name;

      // Actualizar en Firestore si está conectado
      if (window.firestoreDb) {
        try {
          cachedCommentators.forEach(c => {
            const newStatus = (c.id === id) ? 'on_air' : 'standby';
            window.firestoreDb.collection('commentators').doc(c.id).set({ status: newStatus }, { merge: true });
          });
        } catch(e) {
          console.warn('[DIAMAX BROADCAST] Error actualizando status:', e);
        }
      }
      renderDirectory();
      if (typeof mostrarToast === 'function') mostrarToast('🎙️ Narrador activo en cabina: ' + name);
    }`;

const asignarReplacement = `    function asignarNarradorActivo(id, name) {
      if (activeCommentatorId === id) {
        // Tocar de nuevo desasigna el espacio para quedar limpio
        activeCommentatorId = null;
        try {
          localStorage.removeItem('diamax_nombre_narrador');
          localStorage.removeItem('diamax_active_commentator_id');
        } catch(e){}
        const cockpitEl = document.getElementById('cockpit-narrator-name');
        if (cockpitEl) cockpitEl.innerText = 'Por Asignar';
        if (window.firestoreDb) {
          try {
            window.firestoreDb.collection('commentators').doc(id).set({ status: 'standby' }, { merge: true });
          } catch(e){}
        }
        renderDirectory();
        if (typeof mostrarToast === 'function') mostrarToast('Cabina liberada: Narrador Por Asignar');
        return;
      }

      activeCommentatorId = id;
      try {
        localStorage.setItem('diamax_nombre_narrador', name);
        localStorage.setItem('diamax_active_commentator_id', id);
      } catch(e){}

      const cockpitEl = document.getElementById('cockpit-narrator-name');
      if (cockpitEl) cockpitEl.innerText = name;

      // Actualizar en Firestore si está conectado
      if (window.firestoreDb) {
        try {
          cachedCommentators.forEach(c => {
            const newStatus = (c.id === id) ? 'on_air' : 'standby';
            window.firestoreDb.collection('commentators').doc(c.id).set({ status: newStatus }, { merge: true });
          });
        } catch(e) {
          console.warn('[DIAMAX BROADCAST] Error actualizando status:', e);
        }
      }
      renderDirectory();
      if (typeof mostrarToast === 'function') mostrarToast('🎙️ Espacio de narrador activo: ' + name);
    }`;

if (html.includes(asignarTarget)) {
  html = html.replace(asignarTarget, asignarReplacement);
  console.log('✓ asignarNarradorActivo actualizado con soporte de toggle.');
} else {
  console.warn('⚠️ No se encontró asignarTarget exacto.');
}

// 7. Actualizar el formulario para incluir el campo Equipo (Team)
const formNarradorTarget = `          <div>
            <label style="display:block; font-size:10.5px; font-weight:800; color:#94A3B8; margin-bottom:4px; text-transform:uppercase;">Nombre Completo:</label>
            <input type="text" id="comm-form-name" required placeholder="Ej. Carlos Valmore" style="width:100%; box-sizing:border-box; background:#030712; border:1px solid #334155; border-radius:8px; padding:8px 12px; color:#FFFFFF; font-size:12px;">
          </div>
          <div>
            <label style="display:block; font-size:10.5px; font-weight:800; color:#94A3B8; margin-bottom:4px; text-transform:uppercase;">Usuario / Handle:</label>
            <input type="text" id="comm-form-handle" required placeholder="Ej. @carlosvalmore" style="width:100%; box-sizing:border-box; background:#030712; border:1px solid #334155; border-radius:8px; padding:8px 12px; color:#FFFFFF; font-size:12px;">
          </div>
          <div>
            <label style="display:block; font-size:10.5px; font-weight:800; color:#94A3B8; margin-bottom:4px; text-transform:uppercase;">Medio de Transmisión:</label>
            <input type="text" id="comm-form-media" required placeholder="Ej. IVC Networks / YouTube" style="width:100%; box-sizing:border-box; background:#030712; border:1px solid #334155; border-radius:8px; padding:8px 12px; color:#FFFFFF; font-size:12px;">
          </div>`;

const formNarradorReplacement = `          <div>
            <label style="display:block; font-size:10.5px; font-weight:800; color:#94A3B8; margin-bottom:4px; text-transform:uppercase;">Nombre del Narrador / Locutor:</label>
            <input type="text" id="comm-form-name" required placeholder="Ej. Carlos Valmore" style="width:100%; box-sizing:border-box; background:#030712; border:1px solid #334155; border-radius:8px; padding:8px 12px; color:#FFFFFF; font-size:12px;">
          </div>
          <div>
            <label style="display:block; font-size:10.5px; font-weight:800; color:#94A3B8; margin-bottom:4px; text-transform:uppercase;">Equipo al que Transmite:</label>
            <input type="text" id="comm-form-team" placeholder="Ej. Guerreros de Tampa (o Cadena Neutral)" value="Guerreros de Tampa" style="width:100%; box-sizing:border-box; background:#030712; border:1px solid #334155; border-radius:8px; padding:8px 12px; color:#FFFFFF; font-size:12px;">
          </div>
          <div>
            <label style="display:block; font-size:10.5px; font-weight:800; color:#94A3B8; margin-bottom:4px; text-transform:uppercase;">Usuario / Handle:</label>
            <input type="text" id="comm-form-handle" required placeholder="Ej. @carlosvalmore" style="width:100%; box-sizing:border-box; background:#030712; border:1px solid #334155; border-radius:8px; padding:8px 12px; color:#FFFFFF; font-size:12px;">
          </div>
          <div>
            <label style="display:block; font-size:10.5px; font-weight:800; color:#94A3B8; margin-bottom:4px; text-transform:uppercase;">Medio de Transmisión:</label>
            <input type="text" id="comm-form-media" required placeholder="Ej. IVC Networks / YouTube" style="width:100%; box-sizing:border-box; background:#030712; border:1px solid #334155; border-radius:8px; padding:8px 12px; color:#FFFFFF; font-size:12px;">
          </div>`;

if (html.includes(formNarradorTarget)) {
  html = html.replace(formNarradorTarget, formNarradorReplacement);
  console.log('✓ Formulario de nuevo narrador actualizado con campo de equipo.');
} else {
  console.warn('⚠️ No se encontró formNarradorTarget exacto.');
}

// 8. Actualizar guardarNuevoNarrador para incluir team
const guardarTarget = `    async function guardarNuevoNarrador(e) {
      e.preventDefault();
      const name = document.getElementById('comm-form-name')?.value?.trim();
      const handle = document.getElementById('comm-form-handle')?.value?.trim();
      const media = document.getElementById('comm-form-media')?.value?.trim();
      const role = document.getElementById('comm-form-role')?.value;
      const url = document.getElementById('comm-form-url')?.value?.trim() || '';
      const phrase = document.getElementById('comm-form-catchphrase')?.value?.trim();

      if (!name || !handle) return;
      const id = 'comm_' + name.toLowerCase().replace(/[^a-z0-9]/g, '_');

      const nuevo = {
        id,
        name,
        handle,
        mediaOutlet: media,
        role,
        channelUrl: url,
        activeGameId: 'game_master',
        catchphrase: phrase,
        assignedSponsors: [],
        stats: { gamesBroadcasted: 1, pillsRead: 0 },
        status: 'standby',
        createdAt: new Date().toISOString()
      };`;

const guardarReplacement = `    async function guardarNuevoNarrador(e) {
      e.preventDefault();
      const name = document.getElementById('comm-form-name')?.value?.trim();
      const team = document.getElementById('comm-form-team')?.value?.trim() || 'Guerreros de Tampa';
      const handle = document.getElementById('comm-form-handle')?.value?.trim();
      const media = document.getElementById('comm-form-media')?.value?.trim();
      const role = document.getElementById('comm-form-role')?.value;
      const url = document.getElementById('comm-form-url')?.value?.trim() || '';
      const phrase = document.getElementById('comm-form-catchphrase')?.value?.trim();

      if (!name || !handle) return;
      const id = 'comm_' + name.toLowerCase().replace(/[^a-z0-9]/g, '_');

      const nuevo = {
        id,
        name,
        handle,
        team,
        mediaOutlet: media,
        role,
        channelUrl: url,
        activeGameId: 'game_master',
        catchphrase: phrase,
        privateNotes: [],
        assignedSponsors: [],
        stats: { gamesBroadcasted: 1, pillsRead: 0 },
        status: 'standby',
        createdAt: new Date().toISOString()
      };`;

if (html.includes(guardarTarget)) {
  html = html.replace(guardarTarget, guardarReplacement);
  console.log('✓ guardarNuevoNarrador actualizado con campo de equipo y privateNotes.');
} else {
  console.warn('⚠️ No se encontró guardarTarget exacto.');
}

// 9. Actualizar texto descriptivo del header de la sección
const sectionHeaderDescTarget = `            <div style="font-size:11.5px; color:#94A3B8; margin-top:3px;">
              Proyecto: <strong style="color:#FDE68A;">diamax-pro-f6f16</strong> • Aislamiento Estricto: Los comentaristas leen telemetría en vivo sin alterar la anotación del dugout.
            </div>`;

const sectionHeaderDescReplacement = `            <div style="font-size:11.5px; color:#94A3B8; margin-top:3px;">
              Proyecto: <strong style="color:#FDE68A;">diamax-pro-f6f16</strong> • <strong>Espacio Individual por Narrador</strong>: Cada locutor gestiona su propio perfil, equipo y libreta privada de cabina de forma 100% aislada.
            </div>`;

if (html.includes(sectionHeaderDescTarget)) {
  html = html.replace(sectionHeaderDescTarget, sectionHeaderDescReplacement);
  console.log('✓ Descripción de sección actualizada con énfasis en espacio individual.');
}

// Guardar
fs.writeFileSync(indexPath, html, 'utf-8');
console.log('=== ACTUALIZACIÓN DE ESPACIOS INDIVIDUALES DE NARRADORES COMPLETADA ===');
