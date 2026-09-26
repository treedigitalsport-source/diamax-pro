const fs = require('fs');

const v5 = fs.readFileSync('v5_dugout_emergente_ph_blindado.html', 'utf8');

const p36Start = v5.indexOf('<!-- Botonera Táctil Dugout Oficial (36 JUGADAS CANÓNICAS COMPLETAS) -->');
const p36End = v5.indexOf('</div>\n  </div>\n\n  \n  <!-- TAB 4: TARJETA OFICIAL -->', p36Start);

console.log('p36Start:', p36Start, 'p36End:', p36End);
const panel36HTML = v5.substring(p36Start, p36End);
console.log('panel36HTML length:', panel36HTML.length);

const targetFiles = [
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/index.html',
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/v_original_aprobada.html',
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/v6_hace_1_hora_49505bc.html',
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/v1_actual_logo_photoroom_y_planes.html'
];

targetFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');

  // Check if panel-36-plays already exists
  if (!html.includes('id="panel-36-plays"')) {
    // We want to insert panel36HTML right before the closing of the grid in tab-envivo
    const targetClose = `</div>
      </div>
    </div>
  </div>

  
  <!-- TAB 4: TARJETA OFICIAL -->`;

    const properInsertion = `</div>
      </div>

      ${panel36HTML}
    </div>
  </div>

  
  <!-- TAB 4: TARJETA OFICIAL -->`;

    if (html.includes(targetClose)) {
      html = html.replace(targetClose, properInsertion);
      fs.writeFileSync(file, html, 'utf8');
      console.log(`Successfully inserted 36 plays panel into ${file}`);
    } else {
      console.log(`targetClose not found in ${file}`);
    }
  } else {
    console.log(`panel-36-plays already exists in ${file}`);
  }
});
