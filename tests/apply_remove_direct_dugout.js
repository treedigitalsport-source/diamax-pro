const fs = require('fs');

const targetFiles = [
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/index.html',
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/v_original_aprobada.html',
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/v6_hace_1_hora_49505bc.html',
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/v1_actual_logo_photoroom_y_planes.html'
];

targetFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');

  // Regex to match the button group on Page 1
  const oldBtnGroupRegex = /<!-- Botonera de Entrada Principal[\s\S]*?<\/div>\s*<!-- Barra de Seguridad/i;

  const newBtnGroup = `<!-- Botonera de Entrada Principal a DIAMAX (ÚNICOS 3 BOTONES AUTORIZADOS POR EL CEO LIC. ALÍ ZAPATA) -->
    <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:16px; margin-bottom:24px;">
      
      <!-- Botón 1: 6 PLANES OFICIALES -->
      <button type="button" id="p1-btn-plans" onclick="showAuthModal('pricing')" style="padding:16px 28px; background:linear-gradient(135deg, #00D2FF 0%, #0072FF 100%); color:#FFFFFF; border:1px solid rgba(255,255,255,0.4); border-radius:14px; font-family:'Montserrat', sans-serif; font-weight:900; font-size:13.5px; cursor:pointer; text-transform:uppercase; letter-spacing:0.8px; box-shadow:0 8px 30px rgba(0,210,255,0.45), 0 0 25px rgba(0,114,255,0.35); display:inline-flex; align-items:center; gap:10px; transition:all 0.25s ease;" onmouseover="this.style.transform='translateY(-3px) scale(1.02)'; this.style.boxShadow='0 12px 40px rgba(0,210,255,0.75)';" onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 8px 30px rgba(0,210,255,0.45), 0 0 25px rgba(0,114,255,0.35)';">
        <span style="font-size:18px; filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6));">💎</span>
        <span id="p1-btn-plans-text">6 PLANES OFICIALES</span>
      </button>

      <!-- Botón 2: INICIAR SESIÓN -->
      <button type="button" id="p1-btn-login" onclick="showAuthModal('login')" style="padding:16px 28px; background:rgba(4,8,20,0.75); color:#18D8FF; border:1.8px solid #18D8FF; border-radius:14px; font-family:'Montserrat', sans-serif; font-weight:900; font-size:13.5px; cursor:pointer; text-transform:uppercase; letter-spacing:0.8px; box-shadow:0 8px 30px rgba(24,216,255,0.25), inset 0 0 15px rgba(24,216,255,0.1); display:inline-flex; align-items:center; gap:10px; transition:all 0.25s ease;" onmouseover="this.style.background='rgba(24,216,255,0.18)'; this.style.transform='translateY(-3px) scale(1.02)'; this.style.boxShadow='0 12px 40px rgba(24,216,255,0.45)';" onmouseout="this.style.background='rgba(4,8,20,0.75)'; this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 8px 30px rgba(24,216,255,0.25), inset 0 0 15px rgba(24,216,255,0.1)';">
        <span style="font-size:18px; filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6));">🔑</span>
        <span id="p1-btn-login-text">INICIAR SESIÓN</span>
      </button>

      <!-- Botón 3: ACCESO MASTER -->
      <button type="button" id="p1-btn-ceo-key" data-test-id="p1-btn-master" onclick="abrirAccesoClaveCEO()" style="padding:16px 28px; background:rgba(255,199,44,0.12); color:#FFC72C; border:1.8px solid #FFC72C; border-radius:14px; font-family:'Montserrat', sans-serif; font-weight:900; font-size:13.5px; cursor:pointer; text-transform:uppercase; letter-spacing:0.8px; box-shadow:0 8px 30px rgba(255,199,44,0.25); display:inline-flex; align-items:center; gap:10px; transition:all 0.25s ease;" onmouseover="this.style.background='rgba(255,199,44,0.25)'; this.style.transform='translateY(-3px) scale(1.02)'; this.style.boxShadow='0 12px 40px rgba(255,199,44,0.45)';" onmouseout="this.style.background='rgba(255,199,44,0.12)'; this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 8px 30px rgba(255,199,44,0.25)';">
        <span style="font-size:18px; filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6));">👑</span>
        <span id="p1-btn-ceo-text">ACCESO MASTER</span>
      </button>

    </div>
    <!-- Barra de Seguridad`;

  if (oldBtnGroupRegex.test(html)) {
    html = html.replace(oldBtnGroupRegex, newBtnGroup);
    fs.writeFileSync(file, html, 'utf8');
    console.log(`Successfully updated Page 1 to ONLY the 3 official buttons in ${file}`);
  } else {
    console.log(`Could not find oldBtnGroupRegex in ${file}`);
  }
});
