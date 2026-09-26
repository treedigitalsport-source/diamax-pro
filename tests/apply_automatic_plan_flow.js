const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Update seleccionarPlanSuscripcion function for instant transition and plan tracking
const newSelectPlanFn = `let planSuscripcionActual = 'TEAM';

function seleccionarPlanSuscripcion(plan, esGratuito = false) {
  planSuscripcionActual = plan;
  
  const nombresPlanes = {
    'TEAM': 'DIAMAX TEAM ($40 / temp.)',
    'CLUB': 'DIAMAX CLUB ($180 / temp.)',
    'LEAGUE': 'DIAMAX LEAGUE ($350 / temp.)',
    'LEAGUE_PRO': 'DIAMAX LEAGUE PRO ($650 / temp.)',
    'ORGANIZATION': 'DIAMAX ORGANIZATION ($950 / temp.)',
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

// Replace function in JS
const fnRegex = /function seleccionarPlanSuscripcion\(plan\)[\s\S]*?switchAuthTab\('register'\);\s*},\s*2200\);\s*}/;
if (fnRegex.test(html)) {
  html = html.replace(fnRegex, newSelectPlanFn);
}

// 2. Make the plan cards themselves clickable in auth-panel-pricing
// Make sure each card in auth-panel-pricing has onclick="seleccionarPlanSuscripcion('...')"
html = html.replace(
  /<!-- PLAN 1: DIAMAX TEAM \(\$40\) -->\s*<div style="background:#070e1c;/g,
  `<!-- PLAN 1: DIAMAX TEAM ($40) -->\n          <div onclick="seleccionarPlanSuscripcion('TEAM')" style="cursor:pointer; background:#070e1c;`
);
html = html.replace(
  /<!-- PLAN 2: DIAMAX CLUB \(\$180\) -->\s*<div style="background:#070e1c;/g,
  `<!-- PLAN 2: DIAMAX CLUB ($180) -->\n          <div onclick="seleccionarPlanSuscripcion('CLUB')" style="cursor:pointer; background:#070e1c;`
);
html = html.replace(
  /<!-- PLAN 3: DIAMAX LEAGUE \(\$350\) -->\s*<div style="background:#070e1c;/g,
  `<!-- PLAN 3: DIAMAX LEAGUE ($350) -->\n          <div onclick="seleccionarPlanSuscripcion('LEAGUE')" style="cursor:pointer; background:#070e1c;`
);
html = html.replace(
  /<!-- PLAN 4: DIAMAX LEAGUE PRO \(\$650\) -->\s*<div style="background:#070e1c;/g,
  `<!-- PLAN 4: DIAMAX LEAGUE PRO ($650) -->\n          <div onclick="seleccionarPlanSuscripcion('LEAGUE_PRO')" style="cursor:pointer; background:#070e1c;`
);
html = html.replace(
  /<!-- PLAN 5: DIAMAX ORGANIZATION \(\$950\) -->\s*<div style="background:#070e1c;/g,
  `<!-- PLAN 5: DIAMAX ORGANIZATION ($950) -->\n          <div onclick="seleccionarPlanSuscripcion('ORGANIZATION')" style="cursor:pointer; background:#070e1c;`
);
html = html.replace(
  /<!-- PLAN 6: ENTERPRISE GLOBAL -->\s*<div style="background:#070e1c;/g,
  `<!-- PLAN 6: ENTERPRISE GLOBAL -->\n          <div onclick="seleccionarPlanSuscripcion('ENTERPRISE')" style="cursor:pointer; background:#070e1c;`
);

// 3. Make sure the trial banner calls seleccionarPlanSuscripcion('TRIAL', true)
html = html.replace(
  /<button onclick="switchAuthTab\('register'\)" style="background:linear-gradient\(135deg, #10B981, #059669\);/g,
  `<button onclick="seleccionarPlanSuscripcion('TRIAL', true)" style="background:linear-gradient(135deg, #10B981, #059669);`
);

// 4. Update the registration tab button in Auth Modal so it has id="auth-tab-reg-text"
html = html.replace(
  /<span>Registro Gratuito<\/span>/g,
  `<span id="auth-tab-reg-text">Registro</span>`
);

// 5. In auth-panel-register, add a dynamic badge showing selected plan
const regHeaderOld = `<!-- Subtítulo e instrucciones -->
        <div style="margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">`;

const regHeaderNew = `<!-- Badge dinámico de Plan Seleccionado -->
        <div id="reg-selected-plan-badge" style="background:rgba(0,210,255,0.12); border:1px solid #00D2FF; border-radius:10px; padding:10px 14px; margin-bottom:14px; font-size:12.5px; color:#7DD3FC; display:flex; align-items:center; gap:8px;">
          💎 <strong>PLAN SELECCIONADO:</strong> DIAMAX TEAM ($40 / temp.)
        </div>

        <!-- Subtítulo e instrucciones -->
        <div style="margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">`;

if (html.includes(regHeaderOld)) {
  html = html.replace(regHeaderOld, regHeaderNew);
}

// 6. Update the register submit button text
html = html.replace(
  /<span>Completar Registro Oficial y Entrar al Anotador<\/span>/g,
  `<span id="reg-submit-btn-text">Completar Registro Oficial</span>`
);

fs.writeFileSync('index.html', html, 'utf8');
fs.writeFileSync('v_original_aprobada.html', html, 'utf8');
fs.writeFileSync('v6_hace_1_hora_49505bc.html', html, 'utf8');
fs.writeFileSync('v1_actual_logo_photoroom_y_planes.html', html, 'utf8');

console.log('Successfully updated automatic plan selection flow and registration texts!');
