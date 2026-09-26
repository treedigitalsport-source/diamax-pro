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

  const target = `<div>
            <button type="button" onclick="accesoMaestroFounder(document.getElementById('master-key-input').value)" style="width:100%; padding:12px; background:rgba(255,199,44,0.15); border:1.5px solid #FFC72C; color:#FFC72C; border-radius:8px; font-weight:900; font-size:13px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px;">
              Desbloquear Acceso con Clave Escrita
            </button>
          </div>
        </div>
      </div>`;

  const replacement = `<div>
            <button type="button" onclick="accesoMaestroFounder(document.getElementById('master-key-input').value)" style="width:100%; padding:12px; background:rgba(255,199,44,0.15); border:1.5px solid #FFC72C; color:#FFC72C; border-radius:8px; font-weight:900; font-size:13px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px;">
              Desbloquear Acceso con Clave Escrita
            </button>
          </div>
        </div>
      </div>
    </div> <!-- Close Modal Body -->
  </div> <!-- Close Modal Card -->
</div> <!-- Close #auth-modal-overlay -->`;

  if (html.includes(target)) {
    html = html.replace(target, replacement);
    fs.writeFileSync(file, html, 'utf8');
    console.log(`Successfully updated closing tags for ${file}`);
  } else {
    console.log(`Target snippet not found in ${file}`);
  }
});
