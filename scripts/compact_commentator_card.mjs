import fs from 'fs';

const indexPath = 'index.html';
let html = fs.readFileSync(indexPath, 'utf-8');

console.log('--- COMPACTANDO PLAN DE COMENTARISTA: ELIMINANDO MÁRGENES LARGOS ---');

const sIdx = html.indexOf('<!-- =========================================================================\r\n             Y LUEGO UNA LA AZUL DE EL COMENTARISTA') !== -1 
  ? html.indexOf('<!-- =========================================================================\r\n             Y LUEGO UNA LA AZUL DE EL COMENTARISTA')
  : html.indexOf('<!-- =========================================================================\n             Y LUEGO UNA LA AZUL DE EL COMENTARISTA');

const eIdx = html.indexOf('<!-- FOOTER BAR DEL SUBMENÚ DE PLANES -->');

if (sIdx === -1 || eIdx === -1) {
  console.error('❌ Índices no encontrados:', { sIdx, eIdx });
  process.exit(1);
}

const compactBlueCard = `<!-- =========================================================================
             Y LUEGO UNA LA AZUL DE EL COMENTARISTA (COMPACTA, SIN MÁRGENES LARGOS)
             ========================================================================= -->
        <div style="background:linear-gradient(145deg, #091a3e, #050d22); border:1.8px solid #007AFF; border-radius:14px; padding:14px 18px; margin:0 0 16px 0; box-shadow:0 4px 20px rgba(0,122,255,0.25);">
          
          <!-- Encabezado Compacto: Título + Precio en 1 sola fila sin margen largo -->
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid rgba(0,122,255,0.2);">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:18px;">🎙️</span>
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <h4 style="margin:0; font-size:15px; font-weight:900; color:#FFFFFF; letter-spacing:0.3px;">
                    PLAN COMENTARISTA &amp; BROADCAST MEDIA
                  </h4>
                  <span style="background:rgba(0,122,255,0.25); border:1px solid #007AFF; color:#7DD3FC; font-size:9.5px; font-weight:900; padding:1px 7px; border-radius:8px;">ON AIR</span>
                </div>
                <div style="font-size:11px; color:#94A3B8; margin-top:2px;">
                  Mesa de transmisión digital para radio, TV, YouTube y Twitch • Puesto oficial sin botones de anotador
                </div>
              </div>
            </div>

            <div style="display:flex; align-items:baseline; gap:6px;">
              <span style="font-size:26px; font-weight:900; color:#FFFFFF; font-variant-numeric:tabular-nums;">$14.99</span>
              <span style="font-size:11.5px; color:#94A3B8; font-weight:600;">/ mes</span>
              <span style="font-size:10.5px; color:#38BDF8; font-weight:700; margin-left:6px;">(Anual $129 · Torneo $49)</span>
            </div>
          </div>

          <!-- Píldoras de Características Compactas (Sin cajas infladas ni márgenes largos) -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:6px; margin-bottom:10px;">
            <div style="background:rgba(0,122,255,0.1); border:1px solid rgba(0,122,255,0.2); border-radius:6px; padding:6px 10px; font-size:11px; color:#E2E8F0; display:flex; align-items:center; gap:6px;">
              <span style="color:#38BDF8; font-weight:900;">✓</span>
              <span><strong>Cockpit 60 cm:</strong> lectura rápida sin botones dugout</span>
            </div>
            <div style="background:rgba(0,122,255,0.1); border:1px solid rgba(0,122,255,0.2); border-radius:6px; padding:6px 10px; font-size:11px; color:#E2E8F0; display:flex; align-items:center; gap:6px;">
              <span style="color:#38BDF8; font-weight:900;">✓</span>
              <span><strong>Statcast &amp; BvP:</strong> Spray Chart (13) y K-Zone 3x3</span>
            </div>
            <div style="background:rgba(0,122,255,0.1); border:1px solid rgba(0,122,255,0.2); border-radius:6px; padding:6px 10px; font-size:11px; color:#E2E8F0; display:flex; align-items:center; gap:6px;">
              <span style="color:#38BDF8; font-weight:900;">✓</span>
              <span><strong>Semáforo +55:</strong> alerta médica y fatiga a 70</span>
            </div>
            <div style="background:rgba(0,122,255,0.1); border:1px solid rgba(0,122,255,0.2); border-radius:6px; padding:6px 10px; font-size:11px; color:#E2E8F0; display:flex; align-items:center; gap:6px;">
              <span style="color:#38BDF8; font-weight:900;">✓</span>
              <span><strong>Teleprompter:</strong> cuñas y menciones por jugada</span>
            </div>
            <div style="background:rgba(0,122,255,0.15); border:1px solid rgba(0,122,255,0.3); border-radius:6px; padding:6px 10px; font-size:11px; color:#7DD3FC; display:flex; align-items:center; gap:6px;">
              <span style="color:#38BDF8; font-weight:900;">📡</span>
              <span><strong>Overlay OBS / vMix:</strong> WPA y gráficos limpios</span>
            </div>
          </div>

          <!-- Barra de Acción y Acceso VIP Ajustada -->
          <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center; justify-content:space-between; background:rgba(2,6,23,0.55); border:1px solid rgba(0,122,255,0.25); border-radius:8px; padding:8px 12px; margin:0;">
            <button type="button" onclick="seleccionarPlanSuscripcion('MEDIA_PRO')" style="background:#007AFF; color:#FFFFFF; border:none; padding:8px 18px; border-radius:6px; font-weight:900; font-size:11.5px; cursor:pointer; text-transform:uppercase; box-shadow:0 0 12px rgba(0,122,255,0.35); transition:all 0.2s;" onmouseover="this.style.background='#0062cc';" onmouseout="this.style.background='#007AFF';">
              Elegir Plan Comentarista ($14.99)
            </button>

            <div style="display:flex; align-items:center; gap:6px; flex:1; max-width:400px;" onclick="event.stopPropagation();">
              <input type="text" id="input-key-media-p3" placeholder="Clave de Prensa / VIP" style="flex:1; background:#020617; border:1px solid #007AFF; border-radius:6px; padding:7px 10px; color:#FFF; font-size:11px; font-weight:700; outline:none; text-transform:uppercase;" onkeydown="if(event.key==='Enter') validarClavePrensaGratis('p3')">
              <button type="button" onclick="validarClavePrensaGratis('p3')" style="background:linear-gradient(135deg, #10B981, #059669); color:#FFFFFF; border:none; border-radius:6px; padding:7px 12px; font-weight:900; font-size:11px; cursor:pointer; white-space:nowrap; box-shadow:0 0 8px rgba(16,185,129,0.3);">
                Entrar Gratis
              </button>
            </div>
          </div>

        </div>

        `;

html = html.substring(0, sIdx) + compactBlueCard + html.substring(eIdx);
console.log('✓ Tarjeta azul compactada con éxito.');

fs.writeFileSync(indexPath, html, 'utf-8');
console.log('=== ACTUALIZACIÓN LISTA ===');
