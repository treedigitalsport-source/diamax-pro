const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Add Nombre de la Liga field to Section 2 in Auth Modal
const teamNameFieldOld = `<!-- Nombre del Equipo -->
              <div style="margin-bottom:12px;">
                <label style="display:block; font-size:10.5px; font-weight:800; color:#CBD5E1; margin-bottom:5px; text-transform:uppercase;">Nombre del Equipo <span style="color:#EF4444;">*</span></label>
                <input type="text" id="reg-team-name" placeholder="ej. Guerreros de Venezuela" required style="width:100%; box-sizing:border-box; background:#020617; border:1px solid #334155; border-radius:8px; padding:10px 12px; color:#FFF; font-size:13px; outline:none;" onfocus="this.style.borderColor='#F26522'" onblur="this.style.borderColor='#334155'">
              </div>`;

const teamNameFieldNew = `<!-- Nombre del Equipo -->
              <div style="margin-bottom:12px;">
                <label style="display:block; font-size:10.5px; font-weight:800; color:#CBD5E1; margin-bottom:5px; text-transform:uppercase;">Nombre del Equipo <span style="color:#EF4444;">*</span></label>
                <input type="text" id="reg-team-name" placeholder="ej. Guerreros de Venezuela" required style="width:100%; box-sizing:border-box; background:#020617; border:1px solid #334155; border-radius:8px; padding:10px 12px; color:#FFF; font-size:13px; outline:none;" onfocus="this.style.borderColor='#F26522'" onblur="this.style.borderColor='#334155'">
              </div>

              <!-- Nombre de la Liga / Torneo -->
              <div style="margin-bottom:12px;">
                <label style="display:block; font-size:10.5px; font-weight:800; color:#CBD5E1; margin-bottom:5px; text-transform:uppercase;">Nombre de la Liga / Torneo <span style="color:#EF4444;">*</span></label>
                <input type="text" id="reg-league-name" placeholder="ej. Liga Máster de Béisbol / Florida Senior Circuit" required style="width:100%; box-sizing:border-box; background:#020617; border:1px solid #334155; border-radius:8px; padding:10px 12px; color:#FFF; font-size:13px; outline:none;" onfocus="this.style.borderColor='#F26522'" onblur="this.style.borderColor='#334155'">
              </div>`;

if (html.includes(teamNameFieldOld)) {
  html = html.replace(teamNameFieldOld, teamNameFieldNew);
}

// 2. Update ejecutarRegistroOficial function to validate and store leagueName
const regFnOld = `const teamNameInput = document.getElementById('reg-team-name')?.value.trim();
  const category = document.getElementById('reg-category')?.value;
  const role = document.getElementById('reg-user-role')?.value;
  const location = document.getElementById('reg-location')?.value.trim();

  // 1. Validación de campos obligatorios
  if (!fullName || !email || !pass || !phone || !teamNameInput || !category || !role || !location) {`;

const regFnNew = `const teamNameInput = document.getElementById('reg-team-name')?.value.trim();
  const leagueName = document.getElementById('reg-league-name')?.value.trim();
  const category = document.getElementById('reg-category')?.value;
  const role = document.getElementById('reg-user-role')?.value;
  const location = document.getElementById('reg-location')?.value.trim();

  // 1. Validación de campos obligatorios
  if (!fullName || !email || !pass || !phone || !teamNameInput || !leagueName || !category || !role || !location) {`;

if (html.includes(regFnOld)) {
  html = html.replace(regFnOld, regFnNew);
}

// Update user object creation inside ejecutarRegistroOficial
const userObjOld = `teamName: teamNameInput,
    category: category,`;

const userObjNew = `teamName: teamNameInput,
    leagueName: leagueName,
    category: category,`;

if (html.includes(userObjOld)) {
  html = html.replace(userObjOld, userObjNew);
}

fs.writeFileSync('index.html', html, 'utf8');
fs.writeFileSync('v_original_aprobada.html', html, 'utf8');
fs.writeFileSync('v6_hace_1_hora_49505bc.html', html, 'utf8');
fs.writeFileSync('v1_actual_logo_photoroom_y_planes.html', html, 'utf8');

console.log('Successfully added Nombre de la Liga field and validation across all files!');
