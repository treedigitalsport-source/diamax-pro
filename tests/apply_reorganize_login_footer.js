const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Clean structure for Auth Modal
const modalLoginFooterOld = `<div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px; flex-wrap:wrap; gap:8px; font-size:12px;">
          <button type="button" onclick="mostrarRecuperarClave('modal')" style="background:none; border:none; color:#00D2FF; font-weight:700; cursor:pointer; text-decoration:underline; display:inline-flex; align-items:center; gap:4px;">
            <span>🔄</span> <span>¿Olvidaste tu usuario o clave?</span>
          </button>
          <button onclick="switchAuthTab('master')" style="background:none; border:none; color:#FFC72C; font-weight:700; cursor:pointer; text-decoration:underline; display:inline-flex; align-items:center; gap:4px;">
            <svg viewBox="0 0 24 24" width="14" height="14"><use href="#diamax-icon-founder-crown"/></svg> <span>Acceso Maestro Fundador</span>
          </button>
          <button onclick="switchAuthTab('register')" style="background:none; border:none; color:#10B981; font-weight:700; cursor:pointer; text-decoration:underline;">
            ¿No tienes cuenta? Regístrate
          </button>
        </div>`;

const modalLoginFooterNew = `<!-- Caja de Acciones Secundarias y Soporte (Estructura Organizada Apple Sports) -->
        <div style="margin-top:20px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.08); display:flex; flex-direction:column; gap:12px;">
          
          <!-- Fila 1: Recuperar Credenciales & Acceso Maestro CEO -->
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <button type="button" onclick="mostrarRecuperarClave('modal')" style="background:rgba(0,210,255,0.08); border:1px solid rgba(0,210,255,0.25); color:#00D2FF; font-family:'Plus Jakarta Sans', sans-serif; font-size:12px; font-weight:700; padding:8px 14px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; transition:all 0.2s ease;" onmouseover="this.style.background='rgba(0,210,255,0.18)'; this.style.borderColor='#00D2FF';" onmouseout="this.style.background='rgba(0,210,255,0.08)'; this.style.borderColor='rgba(0,210,255,0.25)';">
              <span>🔄</span> <span>¿Olvidaste tu usuario o clave?</span>
            </button>
            
            <button type="button" onclick="switchAuthTab('master')" style="background:rgba(255,199,44,0.08); border:1px solid rgba(255,199,44,0.25); color:#FFC72C; font-family:'Plus Jakarta Sans', sans-serif; font-size:12px; font-weight:700; padding:8px 14px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; transition:all 0.2s ease;" onmouseover="this.style.background='rgba(255,199,44,0.18)'; this.style.borderColor='#FFC72C';" onmouseout="this.style.background='rgba(255,199,44,0.08)'; this.style.borderColor='rgba(255,199,44,0.25)';">
              <svg viewBox="0 0 24 24" width="14" height="14" style="filter:drop-shadow(0 0 4px #FFC72C);"><use href="#diamax-icon-founder-crown"/></svg> <span>Acceso Maestro Fundador</span>
            </button>
          </div>

          <!-- Fila 2: Registro de Nueva Franquicia / Cuenta -->
          <div style="text-align:center; padding:10px 14px; background:rgba(255,255,255,0.02); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
            <span style="color:#94A3B8; font-size:12px;">¿No tienes cuenta?</span>
            <button type="button" onclick="switchAuthTab('pricing')" style="background:none; border:none; color:#10B981; font-family:'Plus Jakarta Sans', sans-serif; font-size:12.5px; font-weight:800; cursor:pointer; text-decoration:underline; margin-left:6px; display:inline-flex; align-items:center; gap:4px;" onmouseover="this.style.color='#34D399';" onmouseout="this.style.color='#10B981';">
              <span>Ver Planes &amp; Registrarse →</span>
            </button>
          </div>

        </div>`;

if (html.includes(modalLoginFooterOld)) {
  html = html.replace(modalLoginFooterOld, modalLoginFooterNew);
}

// 2. Clean structure for Page 2 Login
const p2LoginFooterOld = `<div style="text-align:center; margin-top:14px;">
            <button type="button" onclick="mostrarRecuperarClave('p2')" style="background:none; border:none; color:#18D8FF; font-size:12.5px; font-weight:800; cursor:pointer; text-decoration:underline;">
              🔄 ¿Olvidaste tu usuario o clave? Recuperar Acceso
            </button>
          </div>`;

const p2LoginFooterNew = `<!-- Caja de Acciones Secundarias y Soporte (Página 2 Organizada) -->
          <div style="margin-top:20px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.08); display:flex; flex-direction:column; gap:12px;">
            
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
              <button type="button" onclick="mostrarRecuperarClave('p2')" style="background:rgba(24,216,255,0.08); border:1px solid rgba(24,216,255,0.25); color:#18D8FF; font-family:'Plus Jakarta Sans', sans-serif; font-size:12px; font-weight:700; padding:8px 14px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; gap:6px;" onmouseover="this.style.background='rgba(24,216,255,0.18)'; this.style.borderColor='#18D8FF';" onmouseout="this.style.background='rgba(24,216,255,0.08)'; this.style.borderColor='rgba(24,216,255,0.25)';">
                <span>🔄</span> <span>¿Olvidaste tu usuario o clave?</span>
              </button>
              
              <button type="button" onclick="abrirAccesoClaveCEO()" style="background:rgba(255,199,44,0.08); border:1px solid rgba(255,199,44,0.25); color:#FFC72C; font-family:'Plus Jakarta Sans', sans-serif; font-size:12px; font-weight:700; padding:8px 14px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; gap:6px;" onmouseover="this.style.background='rgba(255,199,44,0.18)'; this.style.borderColor='#FFC72C';" onmouseout="this.style.background='rgba(255,199,44,0.08)'; this.style.borderColor='rgba(255,199,44,0.25)';">
                <svg viewBox="0 0 24 24" width="14" height="14" style="filter:drop-shadow(0 0 4px #FFC72C);"><use href="#diamax-icon-founder-crown"/></svg> <span>Acceso Maestro Fundador</span>
              </button>
            </div>

            <div style="text-align:center; padding:10px 14px; background:rgba(255,255,255,0.02); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
              <span style="color:#94A3B8; font-size:12px;">¿No tienes cuenta?</span>
              <button type="button" onclick="mostrarSubPasoP2('registro')" style="background:none; border:none; color:#18C995; font-family:'Plus Jakarta Sans', sans-serif; font-size:12.5px; font-weight:800; cursor:pointer; text-decoration:underline; margin-left:6px; display:inline-flex; align-items:center; gap:4px;" onmouseover="this.style.color='#34D399';" onmouseout="this.style.color='#18C995';">
                <span>Registrar Franquicia →</span>
              </button>
            </div>

          </div>`;

if (html.includes(p2LoginFooterOld)) {
  html = html.replace(p2LoginFooterOld, p2LoginFooterNew);
}

fs.writeFileSync('index.html', html, 'utf8');
fs.writeFileSync('v_original_aprobada.html', html, 'utf8');
fs.writeFileSync('v6_hace_1_hora_49505bc.html', html, 'utf8');
fs.writeFileSync('v1_actual_logo_photoroom_y_planes.html', html, 'utf8');

console.log('Successfully reorganized login actions into clean structured cards!');
