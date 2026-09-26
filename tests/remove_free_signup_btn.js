const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replacement for Page 1 buttons: exactly 3 buttons (Plans, Login, CEO Master Key)
const oldButtonsPattern = /<!-- 3\. Botones de Acción[\s\S]*?<!-- Micro Footer/i;

const newButtons = `<!-- 3. Botones de Acción Cinemáticos Flotantes (3 BOTONES OFICIALES AUTORIZADOS POR EL CEO) -->
    <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:16px; margin-bottom:20px;">
      
      <!-- Botón 1: 6 OFFICIAL PLANS / 6 PLANES OFICIALES (Acceso al catálogo y registro de franquicia) -->
      <button type="button" id="p1-btn-plans" onclick="showAuthModal('pricing')" style="padding:16px 28px; background:linear-gradient(135deg, #00D2FF 0%, #0072FF 100%); color:#FFFFFF; border:1px solid rgba(255,255,255,0.4); border-radius:14px; font-family:'Montserrat', sans-serif; font-weight:900; font-size:13.5px; cursor:pointer; text-transform:uppercase; letter-spacing:0.8px; box-shadow:0 8px 30px rgba(0,210,255,0.45), 0 0 25px rgba(0,114,255,0.35); display:inline-flex; align-items:center; gap:10px; transition:all 0.25s ease;" onmouseover="this.style.transform='translateY(-3px) scale(1.02)'; this.style.boxShadow='0 12px 40px rgba(0,210,255,0.75)';" onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 8px 30px rgba(0,210,255,0.45), 0 0 25px rgba(0,114,255,0.35)';">
        <span style="font-size:18px; filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6));">💎</span>
        <span id="p1-btn-plans-text">6 OFFICIAL PLANS</span>
      </button>

      <!-- Botón 2: SIGN IN / INICIAR SESIÓN -->
      <button type="button" id="p1-btn-login" onclick="showAuthModal('login')" style="padding:16px 26px; background:rgba(4,8,20,0.75); color:#18D8FF; border:1.8px solid #18D8FF; border-radius:14px; font-family:'Montserrat', sans-serif; font-weight:900; font-size:13.5px; cursor:pointer; text-transform:uppercase; letter-spacing:0.8px; box-shadow:0 8px 30px rgba(24,216,255,0.25), inset 0 0 15px rgba(24,216,255,0.1); display:inline-flex; align-items:center; gap:10px; transition:all 0.25s ease;" onmouseover="this.style.background='rgba(24,216,255,0.18)'; this.style.transform='translateY(-3px) scale(1.02)'; this.style.boxShadow='0 12px 40px rgba(24,216,255,0.45)';" onmouseout="this.style.background='rgba(4,8,20,0.75)'; this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 8px 30px rgba(24,216,255,0.25), inset 0 0 15px rgba(24,216,255,0.1)';">
        <span style="font-size:18px; filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6));">🔑</span>
        <span id="p1-btn-login-text">SIGN IN</span>
      </button>

      <!-- Botón 3: 3TREE MASTER ACCESS (Acceso CEO Alí Zapata / Clave 113714) -->
      <button type="button" id="p1-btn-ceo-key" data-test-id="p1-btn-master" onclick="abrirAccesoClaveCEO()" style="padding:16px 26px; background:rgba(255,199,44,0.12); color:#FFC72C; border:1.8px solid #FFC72C; border-radius:14px; font-family:'Montserrat', sans-serif; font-weight:900; font-size:13.5px; cursor:pointer; text-transform:uppercase; letter-spacing:0.8px; box-shadow:0 8px 30px rgba(255,199,44,0.25); display:inline-flex; align-items:center; gap:10px; transition:all 0.25s ease;" onmouseover="this.style.background='rgba(255,199,44,0.25)'; this.style.transform='translateY(-3px) scale(1.02)'; this.style.boxShadow='0 12px 40px rgba(255,199,44,0.5)';" onmouseout="this.style.background='rgba(255,199,44,0.12)'; this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 8px 30px rgba(255,199,44,0.25)';">
        <span style="font-size:18px; filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6));">👑</span>
        <span id="p1-btn-master-text">3TREE MASTER ACCESS</span>
      </button>

    </div>\n\n    <!-- Micro Footer`;

html = html.replace(oldButtonsPattern, newButtons);

fs.writeFileSync('index.html', html, 'utf8');
fs.writeFileSync('v_original_aprobada.html', html, 'utf8');
fs.writeFileSync('v6_hace_1_hora_49505bc.html', html, 'utf8');
fs.writeFileSync('v1_actual_logo_photoroom_y_planes.html', html, 'utf8');

console.log('Successfully removed Registro Gratuito button from Page 1 and synced files!');
