const fs = require('fs');

const targetFiles = [
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/index.html',
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/v_original_aprobada.html',
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/v6_hace_1_hora_49505bc.html',
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/v1_actual_logo_photoroom_y_planes.html'
];

targetFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  console.log(`Processing file: ${file}`);
  let html = fs.readFileSync(file, 'utf8');

  // 1. Fix unclosed divs in tab-envivo before tab-manual
  // Locate the quick plays at end of tab-envivo
  const targetEndPlays = `<button type="button" class="btn-action btn-out" onclick="registrarJugadaLive('6-4-3 DP')" style="min-height:34px; padding:3px; font-size:11.5px; font-weight:900;">DP</button>
            </div>
          </div>
        </div>
  </div>`;

  const properEndPlays = `<button type="button" class="btn-action btn-out" onclick="registrarJugadaLive('6-4-3 DP')" style="min-height:34px; padding:3px; font-size:11.5px; font-weight:900;">DP</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  if (html.includes(targetEndPlays)) {
    html = html.replace(targetEndPlays, properEndPlays);
    console.log('  -> Fixed tab-envivo closing divs');
  }

  // 2. Remove duplicate voice modal if present
  const dupVoiceComment = `<!-- ======================================================== -->
      <!-- 🎙️ MODAL AGENTE DE DICTADO POR VOZ DEL LINEUP -->
<div id="modal-voice-lineup"`;

  const firstVoiceIdx = html.indexOf('id="modal-voice-lineup"');
  const secondVoiceIdx = html.indexOf('id="modal-voice-lineup"', firstVoiceIdx + 30);

  if (firstVoiceIdx !== -1 && secondVoiceIdx !== -1) {
    console.log(`  -> Detected duplicate voice modal at ${secondVoiceIdx}. Removing duplicate...`);
    // Find where second modal-voice-lineup ends
    const endVoiceDiv = '</div>\n    </div>\n  </div>\n</div>';
    const closeIdx = html.indexOf(endVoiceDiv, secondVoiceIdx);
    if (closeIdx !== -1) {
      const startCut = html.lastIndexOf('<!--', secondVoiceIdx);
      const endCut = closeIdx + endVoiceDiv.length;
      html = html.substring(0, startCut) + html.substring(endCut);
      console.log('  -> Removed duplicate voice modal');
    }
  }

  fs.writeFileSync(file, html, 'utf8');
  console.log(`  -> Successfully saved ${file}`);
});
