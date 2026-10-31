import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

// 1. Backup
fs.writeFileSync('index.html.bak_comentarista', html, 'utf8');
console.log('✅ Backup created: index.html.bak_comentarista');

// 2. Fix Header in auth-panel-register (remove "Acceso Inmediato al Anotador")
const oldRegHeader = `<span style="background:rgba(242,101,34,0.2); border:1px solid #F26522; color:#FFF; font-size:10.5px; font-weight:900; padding:4px 10px; border-radius:20px; display:inline-flex; align-items:center; gap:4px;">
            <svg viewBox="0 0 24 24" width="12" height="12"><use href="#diamax-icon-franchise-tier"/></svg> Acceso Inmediato al Anotador
          </span>`;

const newRegHeader = `<span id="auth-reg-access-badge" style="background:rgba(242,101,34,0.2); border:1px solid #F26522; color:#FFF; font-size:10.5px; font-weight:900; padding:4px 10px; border-radius:20px; display:inline-flex; align-items:center; gap:4px;">
            <svg viewBox="0 0 24 24" width="12" height="12"><use href="#diamax-icon-franchise-tier"/></svg> <span id="auth-reg-access-badge-text">Acceso Oficial a Franquicia &amp; Dugout</span>
          </span>`;

if (html.includes(oldRegHeader)) {
  html = html.replace(oldRegHeader, newRegHeader);
  console.log('✅ Replaced static Acceso Inmediato al Anotador badge in auth-panel-register');
} else {
  console.log('⚠️ Could not find exact oldRegHeader string, checking alternative...');
}

// Ensure IDs on title and description in auth-panel-register
const oldTitlePart = `<span style="color:#00D2FF; font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:0.5px; display:inline-flex; align-items:center; gap:6px;"><svg viewBox="0 0 24 24" width="16" height="16"><use href="#diamax-icon-roster-sheet"/></svg> Hoja de Inscripción &amp; Creador de Franquicia</span>
            <p style="margin:2px 0 0 0; font-size:11px; color:#94A3B8;">Completa tus datos con correo y clave para crear tu equipo o incorporarte al roster oficial.</p>`;

const newTitlePart = `<span id="auth-reg-title-badge" style="color:#00D2FF; font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:0.5px; display:inline-flex; align-items:center; gap:6px;"><svg viewBox="0 0 24 24" width="16" height="16"><use href="#diamax-icon-roster-sheet"/></svg> Hoja de Inscripción &amp; Creador de Franquicia</span>
            <p id="auth-reg-desc-text" style="margin:2px 0 0 0; font-size:11px; color:#94A3B8;">Completa tus datos con correo y clave para crear tu equipo o incorporarte al roster oficial.</p>`;

if (html.includes(oldTitlePart)) {
  html = html.replace(oldTitlePart, newTitlePart);
  console.log('✅ Added IDs to auth-reg-title-badge and auth-reg-desc-text');
}

// Ensure label for team name has ID
const oldTeamLabel = `<label style="display:block; font-size:10.5px; font-weight:800; color:#CBD5E1; margin-bottom:5px; text-transform:uppercase;">Nombre del Equipo <span style="color:#EF4444;">*</span></label>`;
const newTeamLabel = `<label id="reg-team-name-label" style="display:block; font-size:10.5px; font-weight:800; color:#CBD5E1; margin-bottom:5px; text-transform:uppercase;">Nombre del Equipo <span style="color:#EF4444;">*</span></label>`;
if (html.includes(oldTeamLabel)) {
  html = html.replace(oldTeamLabel, newTeamLabel);
  console.log('✅ Added ID reg-team-name-label');
}

// Add BROADCAST_MEDIA to reg-user-role select
const oldRoleSelect = `<select id="reg-user-role" onchange="actualizarExplicacionRol(this.value)" required style="width:100%; box-sizing:border-box; background:#020617; border:1px solid #334155; border-radius:8px; padding:10px 12px; color:#00D2FF; font-size:13px; font-weight:800; outline:none;" onfocus="this.style.borderColor='#00D2FF'" onblur="this.style.borderColor='#334155'">
                  <option value="MANAGER">👑 Manager (Creador y Administrador de Franquicia)</option>
                  <option value="COACH">🧢 Coach (Asistente Técnico &amp; Lineup)</option>
                  <option value="ADMIN_LIGA">🏛️ Administrador de Liga / Comisionado</option>
                  <option value="JUGADOR">⚾ Jugador (Atleta / Miembro de Roster)</option>
                </select>`;

const newRoleSelect = `<select id="reg-user-role" onchange="actualizarExplicacionRol(this.value)" required style="width:100%; box-sizing:border-box; background:#020617; border:1px solid #334155; border-radius:8px; padding:10px 12px; color:#00D2FF; font-size:13px; font-weight:800; outline:none;" onfocus="this.style.borderColor='#00D2FF'" onblur="this.style.borderColor='#334155'">
                  <option value="MANAGER">👑 Manager (Creador y Administrador de Franquicia)</option>
                  <option value="COACH">🧢 Coach (Asistente Técnico &amp; Lineup)</option>
                  <option value="ADMIN_LIGA">🏛️ Administrador de Liga / Comisionado</option>
                  <option value="JUGADOR">⚾ Jugador (Atleta / Miembro de Roster)</option>
                  <option value="BROADCAST_MEDIA">🎙️ Comentarista &amp; Narrador (Medios / Radio / TV)</option>
                </select>`;

if (html.includes(oldRoleSelect)) {
  html = html.replace(oldRoleSelect, newRoleSelect);
  console.log('✅ Added BROADCAST_MEDIA to reg-user-role');
}

// Update actualizarExplicacionRol
const oldActualizarRol = `function actualizarExplicacionRol(role) {
  const txt = document.getElementById('txt-info-rol');
  const badge = document.getElementById('badge-info-rol');
  if (!txt || !badge) return;

  if (role === 'MANAGER' || role === 'ADMIN_LIGA') {
    badge.style.background = 'rgba(16,185,129,0.08)';
    badge.style.borderColor = 'rgba(16,185,129,0.3)';
    badge.style.color = '#A7F3D0';
    txt.innerHTML = '<strong>Permisos de Manager/Admin:</strong> Control total de franquicia. Permiso automático para crear roster de hasta 30 jugadores, editar alineaciones, programar partidos y administrar la liga.';
  } else if (role === 'COACH') {
    badge.style.background = 'rgba(0,210,255,0.08)';
    badge.style.borderColor = 'rgba(0,210,255,0.3)';
    badge.style.color = '#BAE6FD';
    txt.innerHTML = '<strong>Permisos de Coach:</strong> Acceso táctico al Lineup, pizarra de posiciones y registro de jugadas en vivo bajo la supervisión del Manager.';
  } else if (role === 'JUGADOR') {
    badge.style.background = 'rgba(255,199,44,0.08)';
    badge.style.borderColor = 'rgba(255,199,44,0.3)';
    badge.style.color = '#FDE68A';
    txt.innerHTML = '<strong>Regla de Atleta / Jugador:</strong> Al registrarte ingresas como miembro del equipo previa aprobación del Manager en el roster activo. Podrás consultar tus métricas individuales y confirmar asistencia.';
  }
}`;

const newActualizarRol = `function actualizarExplicacionRol(role) {
  const txt = document.getElementById('txt-info-rol');
  const badge = document.getElementById('badge-info-rol');
  if (!txt || !badge) return;

  if (role === 'MANAGER' || role === 'ADMIN_LIGA') {
    badge.style.background = 'rgba(16,185,129,0.08)';
    badge.style.borderColor = 'rgba(16,185,129,0.3)';
    badge.style.color = '#A7F3D0';
    txt.innerHTML = '<strong>Permisos de Manager/Admin:</strong> Control total de franquicia. Permiso automático para crear roster de hasta 30 jugadores, editar alineaciones, programar partidos y administrar la liga.';
  } else if (role === 'COACH') {
    badge.style.background = 'rgba(0,210,255,0.08)';
    badge.style.borderColor = 'rgba(0,210,255,0.3)';
    badge.style.color = '#BAE6FD';
    txt.innerHTML = '<strong>Permisos de Coach:</strong> Acceso táctico al Lineup, pizarra de posiciones y registro de jugadas en vivo bajo la supervisión del Manager.';
  } else if (role === 'JUGADOR') {
    badge.style.background = 'rgba(255,199,44,0.08)';
    badge.style.borderColor = 'rgba(255,199,44,0.3)';
    badge.style.color = '#FDE68A';
    txt.innerHTML = '<strong>Regla de Atleta / Jugador:</strong> Al registrarte ingresas como miembro del equipo previa aprobación del Manager en el roster activo. Podrás consultar tus métricas individuales y confirmar asistencia.';
  } else if (role === 'BROADCAST_MEDIA') {
    badge.style.background = 'rgba(0,210,255,0.12)';
    badge.style.borderColor = '#00D2FF';
    badge.style.color = '#7DD3FC';
    txt.innerHTML = '<strong>Permisos de Comentarista & Medios (TV/Radio):</strong> Acceso exclusivo y directo a la <strong>Cabina de Transmisión (Cockpit en vivo)</strong>. Telemetría glanceable a 60 cm, métricas BvP en tiempo real, semáforo médico +55 y teleprompter. <em>Aislamiento estricto: sin permisos ni interferencia con el Anotador de Dugout.</em>';
  }
}`;

if (html.includes(oldActualizarRol)) {
  html = html.replace(oldActualizarRol, newActualizarRol);
  console.log('✅ Updated actualizarExplicacionRol with BROADCAST_MEDIA branch');
}

// Update seleccionarPlanSuscripcion
const oldSelPlanSub = `function seleccionarPlanSuscripcion(plan, esGratuito = false) {
  planSuscripcionActual = plan;
  
  const nombresPlanes = {
    'TEAM': 'DIAMAX TEAM ($39.99 / temp.)',
    'CLUB': 'DIAMAX CLUB ($179.99 / temp.)',
    'LEAGUE': 'DIAMAX LEAGUE ($349.99 / temp.)',
    'LEAGUE_PRO': 'DIAMAX LEAGUE PRO ($649.99 / temp.)',
    'ORGANIZATION': 'DIAMAX ORGANIZATION ($949.99 / temp.)',
    'ENTERPRISE': 'DIAMAX ENTERPRISE (Personalizado)',
    'TRIAL': 'Prueba Gratuita (Acceso Inmediato)'
  };
  
  const planNombre = nombresPlanes[plan] || 'DIAMAX TEAM';
  
  // Actualizar indicador visual en el formulario de registro
  const badgePlan = document.getElementById('reg-selected-plan-badge');
  const btnSubmit = document.getElementById('reg-submit-btn-text');
  const tabRegText = document.getElementById('auth-tab-reg-text');
  
  if (badgePlan) {
    badgePlan.innerHTML = esGratuito 
      ? '🎁 <strong>MODO DE PRUEBA:</strong> Acceso Inmediato sin Tarjeta de Crédito'
      : \`💎 <strong>PLAN SELECCIONADO:</strong> \${planNombre}\`;
    badgePlan.style.background = esGratuito ? 'rgba(16,185,129,0.15)' : 'rgba(0,210,255,0.15)';
    badgePlan.style.borderColor = esGratuito ? '#10B981' : '#00D2FF';
    badgePlan.style.color = esGratuito ? '#A7F3D0' : '#7DD3FC';
  }
  
  if (btnSubmit) {
    btnSubmit.innerText = esGratuito ? 'Activar Registro Gratuito y Entrar' : 'Completar Registro Oficial';
  }
  
  if (tabRegText) {
    tabRegText.innerText = esGratuito ? 'Registro Gratuito' : 'Registro';
  }
  
  // Transición automática inmediata al formulario de registro
  switchAuthTab('register');
  
  setTimeout(() => {
    const inputNombre = document.getElementById('reg-fullname');
    if (inputNombre) inputNombre.focus();
  }, 100);
}`;

const newSelPlanSub = `function seleccionarPlanSuscripcion(plan, esGratuito = false) {
  planSuscripcionActual = plan;
  
  const nombresPlanes = {
    'TEAM': 'DIAMAX TEAM ($39.99 / temp.)',
    'CLUB': 'DIAMAX CLUB ($179.99 / temp.)',
    'LEAGUE': 'DIAMAX LEAGUE ($349.99 / temp.)',
    'LEAGUE_PRO': 'DIAMAX LEAGUE PRO ($649.99 / temp.)',
    'ORGANIZATION': 'DIAMAX ORGANIZATION ($949.99 / temp.)',
    'ENTERPRISE': 'DIAMAX ENTERPRISE (Personalizado)',
    'MEDIA_PRO': 'PLAN COMENTARISTA & MEDIA ($14.99 / mes)',
    'TRIAL': 'Prueba Gratuita (Acceso Inmediato)'
  };
  
  const planNombre = nombresPlanes[plan] || (plan === 'MEDIA_PRO' ? 'PLAN COMENTARISTA & MEDIA ($14.99 / mes)' : 'DIAMAX TEAM');
  
  // Actualizar indicador visual en el formulario de registro
  const badgePlan = document.getElementById('reg-selected-plan-badge');
  const btnSubmit = document.getElementById('reg-submit-btn-text');
  const tabRegText = document.getElementById('auth-tab-reg-text');
  const accessBadge = document.getElementById('auth-reg-access-badge');
  const titleBadge = document.getElementById('auth-reg-title-badge');
  const descText = document.getElementById('auth-reg-desc-text');
  const roleSelect = document.getElementById('reg-user-role');
  const teamLabel = document.getElementById('reg-team-name-label');
  const teamInput = document.getElementById('reg-team-name');
  
  if (plan === 'MEDIA_PRO') {
    if (badgePlan) {
      badgePlan.innerHTML = \`🎙️ <strong>PLAN SELECCIONADO:</strong> \${planNombre}\`;
      badgePlan.style.background = 'rgba(0,210,255,0.18)';
      badgePlan.style.borderColor = '#00D2FF';
      badgePlan.style.color = '#7DD3FC';
    }
    if (accessBadge) {
      accessBadge.innerHTML = \`<svg viewBox="0 0 24 24" width="12" height="12"><use href="#diamax-icon-radio-tower"/></svg> <span id="auth-reg-access-badge-text">🎙️ Acceso Directo a Cabina de Transmisión</span>\`;
      accessBadge.style.background = 'rgba(0,210,255,0.2)';
      accessBadge.style.borderColor = '#00D2FF';
      accessBadge.style.color = '#00D2FF';
    }
    if (titleBadge) {
      titleBadge.innerHTML = \`<svg viewBox="0 0 24 24" width="16" height="16"><use href="#diamax-icon-radio-tower"/></svg> Acreditación de Prensa &amp; Cabina de Transmisión\`;
    }
    if (descText) {
      descText.innerText = 'Completa tus datos para activar tu puesto oficial en Cabina de Transmisión (Cockpit en vivo con telemetría glanceable, BvP y overlay TV/Radio sin anotador).';
    }
    if (roleSelect) {
      roleSelect.value = 'BROADCAST_MEDIA';
      actualizarExplicacionRol('BROADCAST_MEDIA');
    }
    if (teamLabel) {
      teamLabel.innerHTML = 'Medio / Circuito Radial / Cadena TV <span style="color:#EF4444;">*</span>';
    }
    if (teamInput) {
      teamInput.placeholder = 'ej. Circuito Radial Diamante / Meridiano TV';
    }
    if (btnSubmit) {
      btnSubmit.innerText = '🎙️ Activar Cabina de Transmisión & Entrar';
    }
    if (tabRegText) {
      tabRegText.innerText = 'Acreditación Medios';
    }
  } else {
    if (badgePlan) {
      badgePlan.innerHTML = esGratuito 
        ? '🎁 <strong>MODO DE PRUEBA:</strong> Acceso Inmediato sin Tarjeta de Crédito'
        : \`💎 <strong>PLAN SELECCIONADO:</strong> \${planNombre}\`;
      badgePlan.style.background = esGratuito ? 'rgba(16,185,129,0.15)' : 'rgba(0,210,255,0.15)';
      badgePlan.style.borderColor = esGratuito ? '#10B981' : '#00D2FF';
      badgePlan.style.color = esGratuito ? '#A7F3D0' : '#7DD3FC';
    }
    if (accessBadge) {
      accessBadge.innerHTML = \`<svg viewBox="0 0 24 24" width="12" height="12"><use href="#diamax-icon-franchise-tier"/></svg> <span id="auth-reg-access-badge-text">Acceso Oficial a Franquicia &amp; Dugout</span>\`;
      accessBadge.style.background = 'rgba(242,101,34,0.2)';
      accessBadge.style.borderColor = '#F26522';
      accessBadge.style.color = '#FFF';
    }
    if (titleBadge) {
      titleBadge.innerHTML = \`<svg viewBox="0 0 24 24" width="16" height="16"><use href="#diamax-icon-roster-sheet"/></svg> Hoja de Inscripción &amp; Creador de Franquicia\`;
    }
    if (descText) {
      descText.innerText = 'Completa tus datos con correo y clave para crear tu equipo o incorporarte al roster oficial.';
    }
    if (roleSelect && roleSelect.value === 'BROADCAST_MEDIA') {
      roleSelect.value = 'MANAGER';
      actualizarExplicacionRol('MANAGER');
    }
    if (teamLabel) {
      teamLabel.innerHTML = 'Nombre del Equipo <span style="color:#EF4444;">*</span>';
    }
    if (teamInput) {
      teamInput.placeholder = 'ej. Guerreros de Venezuela';
    }
    if (btnSubmit) {
      btnSubmit.innerText = esGratuito ? 'Activar Registro Gratuito y Entrar' : 'Completar Registro Oficial';
    }
    if (tabRegText) {
      tabRegText.innerText = esGratuito ? 'Registro Gratuito' : 'Registro';
    }
  }
  
  // Transición automática inmediata al formulario de registro
  switchAuthTab('register');
  
  setTimeout(() => {
    const inputNombre = document.getElementById('reg-fullname');
    if (inputNombre) inputNombre.focus();
  }, 100);
}`;

if (html.includes(oldSelPlanSub)) {
  html = html.replace(oldSelPlanSub, newSelPlanSub);
  console.log('✅ Updated seleccionarPlanSuscripcion for MEDIA_PRO and Franchise plans');
}

// Update ejecutarRegistroOficial permissions, success message, and redirect
const oldPermissionsBlock = `  if (role === 'MANAGER' || role === 'ADMIN_LIGA') {
    userPermissions = ['CREATE_ROSTER', 'EDIT_LINEUP', 'SCHEDULE_GAMES', 'MANAGE_PLAYERS', 'ADMIN_TEAM', 'EXPORT_STATS'];
    isTeamOwner = true;
    memberStatus = 'ACTIVE';
  } else if (role === 'COACH') {
    userPermissions = ['EDIT_LINEUP', 'VIEW_ROSTER', 'RECORD_PLAYS', 'VIEW_STATS'];
    isTeamOwner = false;
    memberStatus = 'ACTIVE';
  } else if (role === 'JUGADOR') {
    userPermissions = ['VIEW_STATS', 'CONFIRM_ATTENDANCE', 'VIEW_LINEUP'];
    isTeamOwner = false;
    memberStatus = 'PENDING_APPROVAL'; // Previa aprobación del Manager
  }`;

const newPermissionsBlock = `  if (role === 'BROADCAST_MEDIA' || planSuscripcionActual === 'MEDIA_PRO') {
    userPermissions = ['BROADCAST_MEDIA', 'VIEW_COCKPIT', 'VIEW_STATS', 'VIEW_BVP', 'VIEW_OVERLAY'];
    isTeamOwner = false;
    memberStatus = 'ACTIVE';
  } else if (role === 'MANAGER' || role === 'ADMIN_LIGA') {
    userPermissions = ['CREATE_ROSTER', 'EDIT_LINEUP', 'SCHEDULE_GAMES', 'MANAGE_PLAYERS', 'ADMIN_TEAM', 'EXPORT_STATS'];
    isTeamOwner = true;
    memberStatus = 'ACTIVE';
  } else if (role === 'COACH') {
    userPermissions = ['EDIT_LINEUP', 'VIEW_ROSTER', 'RECORD_PLAYS', 'VIEW_STATS'];
    isTeamOwner = false;
    memberStatus = 'ACTIVE';
  } else if (role === 'JUGADOR') {
    userPermissions = ['VIEW_STATS', 'CONFIRM_ATTENDANCE', 'VIEW_LINEUP'];
    isTeamOwner = false;
    memberStatus = 'PENDING_APPROVAL'; // Previa aprobación del Manager
  }`;

if (html.includes(oldPermissionsBlock)) {
  html = html.replace(oldPermissionsBlock, newPermissionsBlock);
  console.log('✅ Updated ejecutarRegistroOficial permissions for BROADCAST_MEDIA');
}

const oldSuccessRedirect = `  let successMsg = '';
  if (isTeamOwner) {
    successMsg = \`🎉 <strong>¡Franquicia "\${teamNameInput}" Creada con Éxito!</strong><br>
    Asignado como <strong>Creador y Administrador</strong>.<br>
    Código de Invitación para Jugadores: <strong style="color:#00D2FF; font-size:14px;">\${inviteCode}</strong><br>
    <span style="color:#FFC72C;">🎁 Acceso Pro Extendido (365 Días) Activado.</span>\`;
  } else {
    successMsg = \`✅ <strong>¡Registro Exitoso!</strong><br>
    Registrado como <strong>\${role === 'JUGADOR' ? 'Jugador' : 'Coach'}</strong> en \${teamNameInput}.<br>
    \${role === 'JUGADOR' ? 'Estado: Pendiente de confirmación en el Roster por el Manager.' : 'Permisos tácticos activados.'}\`;
  }

  showAuthAlert(successMsg, false);
  setTimeout(() => { cerrarAuthModal(); irAPagina(3); }, 1200);`;

const newSuccessRedirect = `  let successMsg = '';
  const esComentaristaReg = (role === 'BROADCAST_MEDIA' || planSuscripcionActual === 'MEDIA_PRO');
  if (esComentaristaReg) {
    localStorage.setItem('diamax_current_role', 'BROADCAST_MEDIA');
    localStorage.setItem('diamax_session_plan', 'MEDIA_PRO');
    successMsg = \`🎙️ <strong>¡Acreditación de Medios Activada con Éxito!</strong><br>
    Puesto Oficial: <strong>Cabina de Transmisión (TV & Radio)</strong>.<br>
    Medio / Cadena: <strong style="color:#00D2FF;">\${teamNameInput}</strong><br>
    <span style="color:#38BDF8;">📡 Conectando directamente con el Cockpit de Transmisión (sin anotador)...</span>\`;
  } else if (isTeamOwner) {
    successMsg = \`🎉 <strong>¡Franquicia "\${teamNameInput}" Creada con Éxito!</strong><br>
    Asignado como <strong>Creador y Administrador</strong>.<br>
    Código de Invitación para Jugadores: <strong style="color:#00D2FF; font-size:14px;">\${inviteCode}</strong><br>
    <span style="color:#FFC72C;">🎁 Acceso Pro Extendido (365 Días) Activado.</span>\`;
  } else {
    successMsg = \`✅ <strong>¡Registro Exitoso!</strong><br>
    Registrado como <strong>\${role === 'JUGADOR' ? 'Jugador' : 'Coach'}</strong> en \${teamNameInput}.<br>
    \${role === 'JUGADOR' ? 'Estado: Pendiente de confirmación en el Roster por el Manager.' : 'Permisos tácticos activados.'}\`;
  }

  showAuthAlert(successMsg, false);
  setTimeout(() => { 
    cerrarAuthModal(); 
    irAPagina(3);
    if (esComentaristaReg) {
      if (typeof switchTab === 'function') switchTab('cabina');
      if (typeof iniciarCockpitCabina === 'function') {
        try { iniciarCockpitCabina(); } catch(e){}
      }
    } else {
      if (typeof switchTab === 'function') switchTab('anotador');
    }
  }, 1200);`;

if (html.includes(oldSuccessRedirect)) {
  html = html.replace(oldSuccessRedirect, newSuccessRedirect);
  console.log('✅ Updated ejecutarRegistroOficial redirect to cabina for commentators');
}

// Update Página 2 step 4 button text
const oldStep4Btn = `<button type="button" onclick="confirmarYVerificarCuentaP2()" style="padding:16px 32px; background:linear-gradient(135deg, #18C995, #059669); color:#040814; border:none; border-radius:12px; font-weight:900; font-size:14.5px; cursor:pointer; text-transform:uppercase; letter-spacing:0.8px; box-shadow:0 0 30px rgba(24,201,149,0.5); display:flex; align-items:center; gap:10px;">
                <span>🛡️</span> <span>Activar Mes Gratis & Entrar al Dugout (Página 3)</span>
              </button>`;

const newStep4Btn = `<button type="button" onclick="confirmarYVerificarCuentaP2()" style="padding:16px 32px; background:linear-gradient(135deg, #18C995, #059669); color:#040814; border:none; border-radius:12px; font-weight:900; font-size:14.5px; cursor:pointer; text-transform:uppercase; letter-spacing:0.8px; box-shadow:0 0 30px rgba(24,201,149,0.5); display:flex; align-items:center; gap:10px;">
                <span>🛡️</span> <span id="p2-btn-step4-text">Activar Mes Gratis &amp; Entrar al Dugout (Página 3)</span>
              </button>`;

if (html.includes(oldStep4Btn)) {
  html = html.replace(oldStep4Btn, newStep4Btn);
  console.log('✅ Added ID p2-btn-step4-text to Step 4 button');
}

// Update Página 2 Step 5 - Replace residual QR code badge with Sleek Military-Grade 4-Layer Security Certificate
const oldStep5BadgeBlock = `            <!-- ============================================================== -->
            <!-- 🛡️ CREDENCIAL DIGITAL QR PERSONALIZADA DE SEGURIDAD EMITIDA    -->
            <!-- ============================================================== -->
            <div id="p2-official-account-badge" style="background:#FFFFFF; border:3px solid #000; border-radius:20px; padding:22px; max-width:440px; margin:0 auto 24px auto; color:#020617; box-shadow:0 15px 40px rgba(0,0,0,0.6); text-align:center;">
              
              <!-- Cabecera de la Credencial -->
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid #E2E8F0; padding-bottom:10px; margin-bottom:12px;">
                <div style="text-align:left;">
                  <div style="font-size:12px; font-weight:900; color:#0F172A; text-transform:uppercase; letter-spacing:0.8px;">DIAMAX PRO OS</div>
                  <div style="font-size:9.5px; font-weight:800; color:#15803D;">★ MEDIA & SECURITY PASS OFICIAL ★</div>
                </div>
                <span style="background:#15803D; color:#FFF; font-size:9.5px; font-weight:900; padding:3px 8px; border-radius:12px; letter-spacing:0.5px;">ACTIVO</span>
              </div>

              <!-- Datos del Titular -->
              <div style="margin-bottom:12px;">
                <div id="qr-badge-titular-name" style="font-size:18px; font-weight:900; color:#020617; text-transform:uppercase;">TITULAR</div>
                <div id="qr-badge-titular-role" style="font-size:12px; font-weight:800; color:#2563EB; margin-top:2px;">MANAGER OFICIAL (+55)</div>
                <div id="qr-badge-titular-team" style="font-size:11.5px; font-weight:700; color:#475569;">Guerreros de Venezuela</div>
              </div>

              <!-- Matriz QR Renderizada con Token Firmado -->
              <div id="qr-badge-svg-container" style="display:flex; justify-content:center; margin-bottom:12px;">
                <!-- Generado dinámicamente con token firmado -->
              </div>

              <!-- Código de Pase Visible y Validez -->
              <div style="background:#F1F5F9; border:1px solid #CBD5E1; border-radius:8px; padding:8px 12px; margin-bottom:10px;">
                <div style="font-size:10px; font-weight:800; color:#64748B; text-transform:uppercase;">CÓDIGO DE PASE DIRECTO:</div>
                <div id="qr-badge-pass-code" style="font-family:'Courier New', monospace; font-size:16px; font-weight:900; color:#0F172A; letter-spacing:2px;">DMX-PASS-8492</div>
              </div>

              <div style="font-size:10px; color:#64748B; line-height:1.4;">
                🛡️ <strong>CERO CONTRASEÑAS:</strong> Muestra este QR frente a la cámara de cualquier tablet, celular o laptop para acceder automáticamente.
              </div>

              <!-- Botones de Acción de la Credencial -->
              <div style="display:flex; gap:8px; margin-top:14px; justify-content:center; flex-wrap:wrap;">
                <button type="button" onclick="window.print()" style="flex:1; min-width:130px; background:#25D366; color:#FFF; border:none; padding:9px 12px; border-radius:8px; font-weight:900; font-size:11.5px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:6px;">
                  <span>📲</span> <span>Mi WhatsApp</span>
                </button>
                <button type="button" onclick="window.print()" style="flex:1; min-width:120px; background:#0F172A; color:#FFF; border:none; padding:9px 12px; border-radius:8px; font-weight:800; font-size:11.5px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:6px;">
                  <span>🖨️</span> <span>Imprimir</span>
                </button>
              </div>

            </div>`;

const newStep5BadgeBlock = `            <!-- ============================================================== -->
            <!-- 🛡️ CERTIFICADO CRIPTOGRÁFICO DE SEGURIDAD 4-CAPAS ZERO-TRUST    -->
            <!-- ============================================================== -->
            <div id="p2-official-account-badge" style="background:rgba(4,9,21,0.95); border:1.8px solid #00D2FF; border-radius:18px; padding:22px; max-width:460px; margin:0 auto 24px auto; color:#FFF; box-shadow:0 15px 40px rgba(0,210,255,0.25); text-align:center;">
              
              <!-- Cabecera del Certificado -->
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(0,210,255,0.25); padding-bottom:10px; margin-bottom:14px;">
                <div style="text-align:left;">
                  <div style="font-size:12px; font-weight:900; color:#00D2FF; text-transform:uppercase; letter-spacing:1px; display:flex; align-items:center; gap:6px;">
                    <svg viewBox="0 0 24 24" width="16" height="16" style="color:#00D2FF;"><use href="#diamax-icon-biometric-auth"/></svg> DIAMAX PRO CYBER-DEFENSE
                  </div>
                  <div style="font-size:9.5px; font-weight:800; color:#38BDF8;">4-LAYER ZERO-TRUST MILITARY ARCHITECTURE</div>
                </div>
                <span style="background:rgba(16,185,129,0.2); border:1px solid #10B981; color:#34D399; font-size:10px; font-weight:900; padding:3px 10px; border-radius:12px; letter-spacing:0.5px;">AUTORIZADO</span>
              </div>

              <!-- Datos del Titular -->
              <div style="margin-bottom:14px; text-align:left; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:14px;">
                <div style="font-size:10px; color:#94A3B8; text-transform:uppercase; font-weight:800;">TITULAR CERTIFICADO</div>
                <div id="cert-titular-name" style="font-size:17px; font-weight:900; color:#FFF; text-transform:uppercase; margin-top:2px;">TITULAR</div>
                <div id="cert-titular-role" style="font-size:12.5px; font-weight:800; color:#00D2FF; margin-top:3px;">MANAGER OFICIAL (+55)</div>
                <div id="cert-titular-team" style="font-size:12px; font-weight:700; color:#CBD5E1; margin-top:2px;">Guerreros de Venezuela</div>
                <div id="cert-titular-domain" style="font-size:11px; font-weight:800; color:#FFC72C; margin-top:6px; padding-top:6px; border-top:1px dashed rgba(255,255,255,0.1);">
                  ⚾ Dominio: Dugout &amp; Anotación Oficial
                </div>
              </div>

              <!-- Identificador Criptográfico SHA-256 -->
              <div style="background:#020617; border:1px solid #1E293B; border-radius:10px; padding:10px 14px; margin-bottom:12px; text-align:left;">
                <div style="font-size:9.5px; font-weight:800; color:#64748B; text-transform:uppercase; letter-spacing:0.5px;">HUELLA CRIPTOGRÁFICA (SHA-256 SESSION ID):</div>
                <div id="cert-pass-code" style="font-family:'Courier New', monospace; font-size:13px; font-weight:900; color:#38BDF8; letter-spacing:1px; word-break:break-all; margin-top:3px;">DMX-AUTH-TOKEN-HASH</div>
              </div>

              <div style="font-size:10.5px; color:#94A3B8; line-height:1.4;">
                🛡️ <strong>SEGURIDAD ESTILO MILITAR:</strong> Sesión blindada con token efímero anti-secuestro de hardware y aislamiento de roles.
              </div>

            </div>`;

if (html.includes(oldStep5BadgeBlock)) {
  html = html.replace(oldStep5BadgeBlock, newStep5BadgeBlock);
  console.log('✅ Replaced legacy Step 5 QR badge with sleek Military-Grade 4-Layer Security Certificate');
}

// Update Step 5 button on line 7156
const oldStep5AccessBtn = `<button type="button" onclick="irAPagina(3)" style="width:100%; max-width:480px; padding:18px 28px; background:linear-gradient(135deg, #18D8FF, #0284C7); color:#040814; border:none; border-radius:14px; font-weight:900; font-size:16px; cursor:pointer; text-transform:uppercase; letter-spacing:1px; box-shadow:0 10px 35px rgba(24,216,255,0.45); display:inline-flex; align-items:center; justify-content:center; gap:10px;">
              <span>🚀</span> <span>ACCEDER AL DUGOUT & SABERMETRÍA (PÁGINA 3)</span>
            </button>`;

const newStep5AccessBtn = `<button type="button" onclick="accederDesdeP2()" style="width:100%; max-width:480px; padding:18px 28px; background:linear-gradient(135deg, #18D8FF, #0284C7); color:#040814; border:none; border-radius:14px; font-weight:900; font-size:16px; cursor:pointer; text-transform:uppercase; letter-spacing:1px; box-shadow:0 10px 35px rgba(24,216,255,0.45); display:inline-flex; align-items:center; justify-content:center; gap:10px;">
              <span>🚀</span> <span id="p2-btn-step5-text">ACCEDER AL DUGOUT &amp; SABERMETRÍA (PÁGINA 3)</span>
            </button>`;

if (html.includes(oldStep5AccessBtn)) {
  html = html.replace(oldStep5AccessBtn, newStep5AccessBtn);
  console.log('✅ Updated Step 5 button to call accederDesdeP2()');
}

// Update seleccionarPlanP2 to adjust Step 4 and Step 5 labels dynamically
const oldSelPlanP2 = `function seleccionarPlanP2(plan) {
  planSeleccionadoP2 = plan;
  const inputPlan = document.getElementById('p2-selected-plan');
  if (inputPlan) inputPlan.value = plan;

  const cardTrial = document.getElementById('p2-plan-card-TRIAL');
  const cardMedia = document.getElementById('p2-plan-card-MEDIA');
  const cardMgr = document.getElementById('p2-plan-card-MANAGER');
  const cardLiga = document.getElementById('p2-plan-card-LIGA');

  if (cardTrial) {
    cardTrial.style.border = (plan === 'TRIAL_MES_GRATIS') ? '2.5px solid #00D2FF' : '1px solid rgba(255,255,255,0.12)';
    cardTrial.style.boxShadow = (plan === 'TRIAL_MES_GRATIS') ? '0 0 20px rgba(0,210,255,0.35)' : 'none';
  }
  if (cardMedia) {
    cardMedia.style.border = (plan === 'MEDIA_PRO') ? '2.5px solid #00D2FF' : '1.8px solid #00D2FF';
    cardMedia.style.boxShadow = (plan === 'MEDIA_PRO') ? '0 0 30px rgba(0,210,255,0.5)' : '0 0 15px rgba(0,210,255,0.2)';
  }
  if (cardMgr) {
    cardMgr.style.border = (plan === 'MANAGER_PRO') ? '2.5px solid #F26522' : '1px solid rgba(255,255,255,0.12)';
    cardMgr.style.boxShadow = (plan === 'MANAGER_PRO') ? '0 0 20px rgba(242,101,34,0.35)' : 'none';
  }
  if (cardLiga) {
    cardLiga.style.border = (plan === 'LIGA_ENTERPRISE') ? '2.5px solid #FFC72C' : '1px solid rgba(255,255,255,0.12)';
    cardLiga.style.boxShadow = (plan === 'LIGA_ENTERPRISE') ? '0 0 20px rgba(255,199,44,0.35)' : 'none';
  }
}`;

const newSelPlanP2 = `function seleccionarPlanP2(plan) {
  planSeleccionadoP2 = plan;
  const inputPlan = document.getElementById('p2-selected-plan');
  if (inputPlan) inputPlan.value = plan;

  const cardTrial = document.getElementById('p2-plan-card-TRIAL');
  const cardMedia = document.getElementById('p2-plan-card-MEDIA');
  const cardMgr = document.getElementById('p2-plan-card-MANAGER');
  const cardLiga = document.getElementById('p2-plan-card-LIGA');

  if (cardTrial) {
    cardTrial.style.border = (plan === 'TRIAL_MES_GRATIS') ? '2.5px solid #00D2FF' : '1px solid rgba(255,255,255,0.12)';
    cardTrial.style.boxShadow = (plan === 'TRIAL_MES_GRATIS') ? '0 0 20px rgba(0,210,255,0.35)' : 'none';
  }
  if (cardMedia) {
    cardMedia.style.border = (plan === 'MEDIA_PRO') ? '2.5px solid #00D2FF' : '1.8px solid #00D2FF';
    cardMedia.style.boxShadow = (plan === 'MEDIA_PRO') ? '0 0 30px rgba(0,210,255,0.5)' : '0 0 15px rgba(0,210,255,0.2)';
  }
  if (cardMgr) {
    cardMgr.style.border = (plan === 'MANAGER_PRO') ? '2.5px solid #F26522' : '1px solid rgba(255,255,255,0.12)';
    cardMgr.style.boxShadow = (plan === 'MANAGER_PRO') ? '0 0 20px rgba(242,101,34,0.35)' : 'none';
  }
  if (cardLiga) {
    cardLiga.style.border = (plan === 'LIGA_ENTERPRISE') ? '2.5px solid #FFC72C' : '1px solid rgba(255,255,255,0.12)';
    cardLiga.style.boxShadow = (plan === 'LIGA_ENTERPRISE') ? '0 0 20px rgba(255,199,44,0.35)' : 'none';
  }

  // Ajustar textos dinámicos de botones según rol de comentarista o mánager
  const btn4 = document.getElementById('p2-btn-step4-text');
  const btn5 = document.getElementById('p2-btn-step5-text');
  if (plan === 'MEDIA_PRO') {
    if (btn4) btn4.innerText = 'Activar Plan Comentarista & Entrar a Cabina (TV & Radio)';
    if (btn5) btn5.innerText = 'ACCEDER A CABINA DE TRANSMISIÓN (TV & RADIO)';
  } else {
    if (btn4) btn4.innerText = 'Activar Mes Gratis & Entrar al Dugout (Página 3)';
    if (btn5) btn5.innerText = 'ACCEDER AL DUGOUT & SABERMETRÍA (PÁGINA 3)';
  }
}`;

if (html.includes(oldSelPlanP2)) {
  html = html.replace(oldSelPlanP2, newSelPlanP2);
  console.log('✅ Updated seleccionarPlanP2 to adjust buttons dynamically');
}

// In confirmarYVerificarCuentaP2: replace generarCredencialQRPersonalizada with actualizarCertificadoSeguridadP2
const oldVerifCall = `  generarCredencialQRPersonalizada(currentUserSession);
  irAPasoWizardP2(5);`;

const newVerifCall = `  if (planSeleccionadoP2 === 'MEDIA_PRO') {
    currentUserSession.role = 'BROADCAST_MEDIA';
    currentUserSession.plan = 'MEDIA_PRO';
    currentUserSession.permissions = ['BROADCAST_MEDIA', 'VIEW_COCKPIT', 'VIEW_STATS', 'VIEW_BVP', 'VIEW_OVERLAY'];
    localStorage.setItem('diamax_current_role', 'BROADCAST_MEDIA');
    localStorage.setItem('diamax_session_plan', 'MEDIA_PRO');
  }

  actualizarCertificadoSeguridadP2(currentUserSession);
  irAPasoWizardP2(5);`;

if (html.includes(oldVerifCall)) {
  html = html.replace(oldVerifCall, newVerifCall);
  console.log('✅ Replaced generarCredencialQRPersonalizada call with actualizarCertificadoSeguridadP2');
}

// Add definition of actualizarCertificadoSeguridadP2 and accederDesdeP2
const fnDefs = `
// 🛡️ ACTUALIZACIÓN DEL CERTIFICADO CRIPTOGRÁFICO DE SEGURIDAD 4 CAPAS (PÁGINA 2)
function actualizarCertificadoSeguridadP2(session) {
  if (!session) return;
  const nameEl = document.getElementById('cert-titular-name');
  const roleEl = document.getElementById('cert-titular-role');
  const teamEl = document.getElementById('cert-titular-team');
  const domainEl = document.getElementById('cert-titular-domain');
  const codeEl = document.getElementById('cert-pass-code');
  const btn5 = document.getElementById('p2-btn-step5-text');

  const esMedia = (session.plan === 'MEDIA_PRO' || session.role === 'BROADCAST_MEDIA');

  if (nameEl) nameEl.innerText = session.name || 'TITULAR';
  if (roleEl) roleEl.innerText = esMedia ? '🎙️ COMENTARISTA & MEDIOS (CABINA)' : (session.role || 'MANAGER OFICIAL');
  if (teamEl) teamEl.innerText = session.team || 'Franquicia Oficial';
  
  if (domainEl) {
    if (esMedia) {
      domainEl.innerHTML = '<span style="color:#00D2FF;">🎙️ Puesto Oficial: Cabina de Transmisión (TV & Radio)</span><br><span style="font-size:10px; color:#94A3B8;">Aislamiento estricto: cero interferencia con el Anotador de Dugout</span>';
    } else {
      domainEl.innerHTML = '<span style="color:#FFC72C;">⚾ Dominio: Dugout &amp; Anotación Oficial</span><br><span style="font-size:10px; color:#94A3B8;">Control de Roster, Lineup y Event Store</span>';
    }
  }

  if (codeEl) {
    codeEl.innerText = session.token ? ('SHA256:' + session.token) : ('DMX-SEC-' + Math.floor(100000 + Math.random() * 900000));
  }

  if (btn5) {
    btn5.innerText = esMedia ? 'ACCEDER A CABINA DE TRANSMISIÓN (TV & RADIO)' : 'ACCEDER AL DUGOUT & SABERMETRÍA (PÁGINA 3)';
  }
}

// 🚀 NAVEGACIÓN Y ACCESO SEGMENTADO DESDE PÁGINA 2
function accederDesdeP2() {
  irAPagina(3);
  const esMedia = (planSeleccionadoP2 === 'MEDIA_PRO' || (typeof currentUserSession !== 'undefined' && currentUserSession?.role === 'BROADCAST_MEDIA'));
  if (esMedia) {
    if (typeof switchTab === 'function') switchTab('cabina');
    if (typeof iniciarCockpitCabina === 'function') {
      try { iniciarCockpitCabina(); } catch(e){}
    }
  } else {
    if (typeof switchTab === 'function') switchTab('anotador');
  }
}
`;

// Insert the functions right before window.validarClavePrensaGratis or at a safe position
const targetAnchor = 'window.validarClavePrensaGratis = function(origen) {';
if (html.includes(targetAnchor)) {
  html = html.replace(targetAnchor, fnDefs + '\n' + targetAnchor);
  console.log('✅ Added actualizarCertificadoSeguridadP2 and accederDesdeP2 functions');
} else {
  console.log('⚠️ Could not find targetAnchor for helper functions');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('🎉 index.html successfully updated and saved!');
