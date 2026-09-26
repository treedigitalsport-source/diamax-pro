const fs = require('fs');

const targetFiles = [
  'index.html',
  'v_original_aprobada.html',
  'v6_hace_1_hora_49505bc.html',
  'v1_actual_logo_photoroom_y_planes.html'
];

const comprehensiveCategoriesOptions = `
                  <optgroup label="🌱 BÉISBOL MENOR & FORMACIÓN (3 a 14 años)">
                    <option value="Semillitas">🍼 Semillitas / Tee-Ball (3 - 4 años)</option>
                    <option value="Iniciacion">🌱 Iniciación / Preparatorio (5 - 6 años)</option>
                    <option value="Pre-Infantil">⚾ Pre-Infantil / Coach Pitch (7 - 8 años)</option>
                    <option value="Infantil">🏆 Infantil / Minors (9 - 10 años)</option>
                    <option value="Pre-Junior">🥇 Pre-Junior / Majors (11 - 12 años)</option>
                    <option value="Junior">⚡ Junior / Intermedia (13 - 14 años)</option>
                  </optgroup>
                  <optgroup label="🔥 JUVENIL & PROSPECTOS">
                    <option value="Juvenil">🔥 Juvenil / Seniors (15 - 17 años)</option>
                    <option value="Sub-23">🌟 Sub-23 / Prospectos (18 - 23 años)</option>
                    <option value="Libre">⚾ Libre / Doble A (Abierta 18+)</option>
                  </optgroup>
                  <optgroup label="⭐ ADULTOS & CIRCUITOS POR EDAD">
                    <option value="+21">⭐ +21 (Adultos Jóvenes / 21+)</option>
                    <option value="+25">🥈 +25 (Adultos Intermedio / 25+)</option>
                    <option value="+30">🥉 +30 (Máster Bronce / 30+)</option>
                    <option value="+35">🎖️ +35 (Senior Máster / 35+)</option>
                    <option value="+40">🥈 +40 (Máster Plata / 40+)</option>
                    <option value="+45">🏅 +45 (Super Máster Oro / 45+)</option>
                    <option value="+50">🥇 +50 (Máster Oro / 50+)</option>
                    <option value="+55" selected>🏆 +55 (Super Máster Leyendas / 55+)</option>
                    <option value="+60">👑 +60 (Magíster Leyendas / 60+)</option>
                    <option value="+65">💎 +65 (Platino Leyendas / 65+)</option>
                    <option value="+70">🌟 +70 (Diamante Leyendas / 70+)</option>
                  </optgroup>
                  <optgroup label="🥎 OTRAS MODALIDADES">
                    <option value="Softbol">🥎 Softbol Libre / Máster</option>
                    <option value="Femenino">🎀 Béisbol Femenino</option>
                  </optgroup>`;

function updatePricingAndCategories(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Update Category Dropdown in Modal Form (<select id="reg-category">)
  const regCategoryRegex = /<select id="reg-category"[\s\S]*?<\/select>/;
  if (regCategoryRegex.test(content)) {
    const newRegCategorySelect = `<select id="reg-category" required style="width:100%; box-sizing:border-box; background:#020617; border:1px solid #334155; border-radius:8px; padding:10px 12px; color:#FFC72C; font-size:13px; font-weight:700; outline:none;" onfocus="this.style.borderColor='#F26522'" onblur="this.style.borderColor='#334155'">${comprehensiveCategoriesOptions}\n                </select>`;
    content = content.replace(regCategoryRegex, newRegCategorySelect);
  }

  // 2. Update Category Dropdown in Page 2 Form (<select id="p2-team-category">)
  const p2CategoryRegex = /<select id="p2-team-category"[\s\S]*?<\/select>/;
  if (p2CategoryRegex.test(content)) {
    const newP2CategorySelect = `<select id="p2-team-category" style="width:100%; box-sizing:border-box; background:rgba(3,7,18,0.85); border:1px solid rgba(255,255,255,0.12); border-radius:10px; padding:12px; color:#FFB82E; font-size:13px; font-weight:700; outline:none;">${comprehensiveCategoriesOptions}\n                  </select>`;
    content = content.replace(p2CategoryRegex, newP2CategorySelect);
  }

  // 3. Update Pricing in nombresPlanes JS dictionary
  const nombresPlanesRegex = /const nombresPlanes = \{[\s\S]*?\};/;
  const newNombresPlanes = `const nombresPlanes = {
    'TEAM': 'DIAMAX TEAM ($39.99 / temp.)',
    'CLUB': 'DIAMAX CLUB ($179.99 / temp.)',
    'LEAGUE': 'DIAMAX LEAGUE ($349.99 / temp.)',
    'LEAGUE_PRO': 'DIAMAX LEAGUE PRO ($649.99 / temp.)',
    'ORGANIZATION': 'DIAMAX ORGANIZATION ($949.99 / temp.)',
    'ENTERPRISE': 'DIAMAX ENTERPRISE (Personalizado)',
    'TRIAL': 'Prueba Gratuita (Acceso Inmediato)'
  };`;
  if (nombresPlanesRegex.test(content)) {
    content = content.replace(nombresPlanesRegex, newNombresPlanes);
  }

  // 4. Update Plan 1: TEAM ($40 -> $39.99)
  content = content.replace(/<!-- PLAN 1: DIAMAX TEAM \(\$40\) -->/g, '<!-- PLAN 1: DIAMAX TEAM ($39.99) -->');
  content = content.replace(/<span style="font-size:28px; font-weight:900; color:#FFF;">\$40<\/span>/g, '<span style="font-size:28px; font-weight:900; color:#FFF;">$39.99</span>');
  content = content.replace(/Elegir Plan TEAM \(\$40\)/g, 'Elegir Plan TEAM ($39.99)');

  // 5. Update Plan 2: CLUB ($180 -> $179.99)
  content = content.replace(/<!-- PLAN 2: DIAMAX CLUB \(\$180\) -->/g, '<!-- PLAN 2: DIAMAX CLUB ($179.99) -->');
  content = content.replace(/<span style="font-size:28px; font-weight:900; color:#FFF;">\$180<\/span>/g, '<span style="font-size:28px; font-weight:900; color:#FFF;">$179.99</span>');
  content = content.replace(/Elegir CLUB \(\$180\)/g, 'Elegir CLUB ($179.99)');

  // 6. Update Plan 3: LEAGUE ($350 -> $349.99)
  content = content.replace(/<!-- PLAN 3: DIAMAX LEAGUE \(\$350\) -->/g, '<!-- PLAN 3: DIAMAX LEAGUE ($349.99) -->');
  content = content.replace(/<span style="font-size:28px; font-weight:900; color:#FFF;">\$350<\/span>/g, '<span style="font-size:28px; font-weight:900; color:#FFF;">$349.99</span>');
  content = content.replace(/Elegir LEAGUE \(\$350\)/g, 'Elegir LEAGUE ($349.99)');

  // 7. Update Plan 4: LEAGUE PRO ($650 -> $649.99)
  content = content.replace(/<!-- PLAN 4: DIAMAX LEAGUE PRO \(\$650\) -->/g, '<!-- PLAN 4: DIAMAX LEAGUE PRO ($649.99) -->');
  content = content.replace(/<span style="font-size:28px; font-weight:900; color:#FFF;">\$650<\/span>/g, '<span style="font-size:28px; font-weight:900; color:#FFF;">$649.99</span>');
  content = content.replace(/Elegir LEAGUE PRO \(\$650\)/g, 'Elegir LEAGUE PRO ($649.99)');

  // 8. Update Plan 5: ORGANIZATION ($950 -> $949.99)
  content = content.replace(/<!-- PLAN 5: DIAMAX ORGANIZATION \(\$950\) -->/g, '<!-- PLAN 5: DIAMAX ORGANIZATION ($949.99) -->');
  content = content.replace(/<span style="font-size:28px; font-weight:900; color:#FFF;">\$950<\/span>/g, '<span style="font-size:28px; font-weight:900; color:#FFF;">$949.99</span>');
  content = content.replace(/Elegir ORGANIZATION \(\$950\)/g, 'Elegir ORGANIZATION ($949.99)');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated pricing & categories in ${filePath}`);
}

targetFiles.forEach(f => updatePricingAndCategories(f));
