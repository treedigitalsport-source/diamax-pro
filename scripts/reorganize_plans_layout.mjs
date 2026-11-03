import fs from 'fs';

const indexPath = 'index.html';
let html = fs.readFileSync(indexPath, 'utf-8');

console.log('--- REORGANIZANDO SECCIÓN DE PLANES: PARTE AZUL 2 ARRIBA, 2 ABAJO, 1 MÁS ABAJO ---');

const sIdx = html.indexOf('<div id="auth-panel-pricing" style="display:block;">');
const eIdx = html.indexOf('id="auth-panel-register"');

if (sIdx === -1 || eIdx === -1) {
  console.error('❌ No se encontró auth-panel-pricing o auth-panel-register', { sIdx, eIdx });
  process.exit(1);
}

const subChunk = html.substring(sIdx, eIdx);
const lastDivClose = subChunk.lastIndexOf('</div>');
const fullEndIdx = sIdx + lastDivClose + 6;

console.log('Rango a reemplazar:', sIdx, 'a', fullEndIdx);

const newPricingHTML = `<div id="auth-panel-pricing" style="display:block;">
        
        <div style="text-align:center; margin-bottom:18px;">
          <span style="background:rgba(0,122,255,0.15); border:1px solid #007AFF; color:#38BDF8; font-size:11px; font-weight:900; padding:4px 14px; border-radius:20px; text-transform:uppercase; letter-spacing:0.8px;">
            MODELO HÍBRIDO • PRECIOS POR TEMPORADA
          </span>
          <h3 style="font-size:22px; font-weight:900; margin:10px 0 4px 0; color:#FFF;">Seis planes, un solo ecosistema.</h3>
          <p style="margin:0; font-size:12px; color:#94A3B8;">Solución integral de sabermetría y anotación en vivo para equipos, academias y ligas completas.</p>
        </div>

        <!-- Banner de Prueba Gratuita sin Tarjeta -->
        <div style="background:linear-gradient(135deg, rgba(0,122,255,0.12), rgba(10,24,54,0.4)); border:1px solid rgba(0,122,255,0.4); border-radius:12px; padding:12px 18px; margin-bottom:18px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div>
              <div style="color:#38BDF8; font-weight:900; font-size:13px;">¿Quieres probar el Anotador Dugout antes de suscribirte?</div>
              <div style="color:#CBD5E1; font-size:11.5px;">Regístrate con tu correo y contraseña para activar tu acceso inmediato sin tarjeta de crédito.</div>
            </div>
          </div>
          <button type="button" onclick="seleccionarPlanSuscripcion('TRIAL', true)" style="background:#007AFF; color:#FFFFFF; border:none; padding:8px 16px; border-radius:8px; font-weight:900; font-size:12px; cursor:pointer; text-transform:uppercase; box-shadow:0 0 15px rgba(0,122,255,0.35); display:inline-flex; align-items:center; gap:6px;">
            Registro Gratuito →
          </button>
        </div>

        <!-- =========================================================================
             PARTE AZUL REORGANIZADA: PLAN COMENTARISTA (2 ARRIBA, 2 ABAJO, 1 MÁS ABAJO)
             ========================================================================= -->
        <div style="background:linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(6, 12, 28, 0.98)); border:1.8px solid #007AFF; border-radius:16px; padding:20px; margin-bottom:24px; box-shadow:0 8px 32px rgba(0,122,255,0.25);">
          
          <!-- Encabezado de la Tarjeta Azul -->
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px; padding-bottom:12px; border-bottom:1px solid rgba(0,122,255,0.25);">
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <h4 style="margin:0; font-size:17px; font-weight:900; color:#FFFFFF; display:inline-flex; align-items:center; gap:6px;">
                  🎙️ PLAN ESPECIAL: COMENTARISTA &amp; BROADCAST MEDIA
                </h4>
                <span style="background:rgba(0,122,255,0.2); border:1px solid #007AFF; color:#7DD3FC; font-size:10px; font-weight:900; padding:2px 8px; border-radius:10px;">ON AIR</span>
              </div>
              <div style="font-size:11.5px; color:#94A3B8; margin-top:3px;">
                Mesa de transmisión digital para radio, TV, YouTube y Twitch • Puesto oficial de cabina con telemetría en vivo
              </div>
            </div>

            <div style="text-align:right;">
              <div style="display:flex; align-items:baseline; gap:4px; justify-content:flex-end;">
                <span style="font-size:30px; font-weight:900; color:#FFFFFF; font-variant-numeric:tabular-nums;">$14.99</span>
                <span style="font-size:12px; color:#94A3B8; font-weight:600;">/ mes</span>
              </div>
              <div style="font-size:10.5px; color:#38BDF8; font-weight:700;">• Anual: $129.00 / año ($10.75/mes) • Pase Torneo: $49</div>
            </div>
          </div>

          <!-- GRID 2 ARRIBA, 2 ABAJO -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:12px; margin-bottom:12px;">
            <!-- 1. Arriba Izquierda -->
            <div style="background:rgba(0,122,255,0.08); border:1px solid rgba(0,122,255,0.25); border-radius:10px; padding:12px 14px;">
              <div style="color:#7DD3FC; font-weight:800; font-size:12.5px; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <span>🎙️ Cockpit Cabina a 60 cm</span>
              </div>
              <div style="font-size:11px; color:#CBD5E1; line-height:1.4;">
                Pantalla única de lectura rápida todo-en-uno, sin interferencias ni botones del Dugout.
              </div>
            </div>

            <!-- 2. Arriba Derecha -->
            <div style="background:rgba(0,122,255,0.08); border:1px solid rgba(0,122,255,0.25); border-radius:10px; padding:12px 14px;">
              <div style="color:#7DD3FC; font-weight:800; font-size:12.5px; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <span>📊 Telemetría Statcast &amp; BvP</span>
              </div>
              <div style="font-size:11px; color:#CBD5E1; line-height:1.4;">
                Spray Chart interactivo de 13 batazos, K-Zone 3x3 y divididos históricos frente a frente.
              </div>
            </div>

            <!-- 3. Abajo Izquierda -->
            <div style="background:rgba(0,122,255,0.08); border:1px solid rgba(0,122,255,0.25); border-radius:10px; padding:12px 14px;">
              <div style="color:#7DD3FC; font-weight:800; font-size:12.5px; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <span>⚡ Semáforo Médico +55 &amp; Pitcheos</span>
              </div>
              <div style="font-size:11px; color:#CBD5E1; line-height:1.4;">
                Control de degradación biomecánica de 1 a 75 lanzamientos con alerta automática de fatiga y bullpen a 70 envíos.
              </div>
            </div>

            <!-- 4. Abajo Derecha -->
            <div style="background:rgba(0,122,255,0.08); border:1px solid rgba(0,122,255,0.25); border-radius:10px; padding:12px 14px;">
              <div style="color:#7DD3FC; font-weight:800; font-size:12.5px; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <span>📜 Teleprompter Táctico de 3 Píldoras</span>
              </div>
              <div style="font-size:11px; color:#CBD5E1; line-height:1.4;">
                Menciones en vivo y detonadores comerciales automáticos por jugadas (Doble Play, Cuadrangular, Visita al Montículo).
              </div>
            </div>
          </div>

          <!-- 5. UNA MÁS ABAJO (ANCHO COMPLETO) -->
          <div style="background:rgba(0,122,255,0.12); border:1px solid rgba(0,122,255,0.35); border-radius:10px; padding:11px 16px; margin-bottom:16px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:10px; font-size:11.5px; color:#E2E8F0;">
              <span style="font-size:14px;">📡</span>
              <span><strong>URL de Overlay transparente para OBS Studio &amp; vMix</strong> • Gráfico WPA (Win Probability Added en vivo) y enlace directo a cabina</span>
            </div>
            <span style="background:rgba(56,189,248,0.2); border:1px solid #38BDF8; color:#7DD3FC; font-size:10px; font-weight:800; padding:2px 8px; border-radius:6px;">BROADCAST READY</span>
          </div>

          <!-- Barra de Acción y Acceso con Clave de Prensa / VIP -->
          <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center; justify-content:space-between; background:rgba(2,6,23,0.65); border:1px solid rgba(0,122,255,0.25); border-radius:12px; padding:12px 16px;">
            <button type="button" onclick="seleccionarPlanSuscripcion('MEDIA_PRO')" style="background:#007AFF; color:#FFFFFF; border:none; padding:11px 22px; border-radius:8px; font-weight:900; font-size:12px; cursor:pointer; text-transform:uppercase; box-shadow:0 0 16px rgba(0,122,255,0.4); transition:all 0.2s;">
              Elegir Plan Comentarista ($14.99)
            </button>

            <div style="display:flex; align-items:center; gap:8px; flex:1; max-width:460px;" onclick="event.stopPropagation();">
              <input type="text" id="input-key-media-p3" placeholder="Introducir Clave de Prensa / VIP" style="flex:1; background:#020617; border:1.5px solid #007AFF; border-radius:8px; padding:9px 12px; color:#FFF; font-size:11.5px; font-weight:700; outline:none; text-transform:uppercase;" onkeydown="if(event.key==='Enter') validarClavePrensaGratis('p3')">
              <button type="button" onclick="validarClavePrensaGratis('p3')" style="background:linear-gradient(135deg, #10B981, #059669); color:#FFFFFF; border:none; border-radius:8px; padding:9px 14px; font-weight:900; font-size:11px; cursor:pointer; white-space:nowrap; box-shadow:0 0 10px rgba(16,185,129,0.3);">
                Entrar Gratis
              </button>
            </div>
          </div>

        </div>

        <!-- SEPARADOR Y TÍTULO DE LOS 6 PLANES INSTITUCIONALES -->
        <div style="display:flex; align-items:center; gap:14px; margin:24px 0 18px 0;">
          <div style="flex:1; height:1px; background:rgba(255,255,255,0.1);"></div>
          <div style="font-size:11.5px; font-weight:900; color:#FCD34D; text-transform:uppercase; letter-spacing:0.8px; display:flex; align-items:center; gap:6px;">
            <span>🏟️ SEIS PLANES OFICIALES POR TEMPORADA (EQUIPOS, CLUBES &amp; LIGAS)</span>
          </div>
          <div style="flex:1; height:1px; background:rgba(255,255,255,0.1);"></div>
        </div>

        <!-- GRID DE LOS 6 PLANES OFICIALES: 2 ARRIBA, 2 ABAJO, 2 MÁS ABAJO -->
        <div id="auth-six-plans-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(290px, 1fr)); gap:18px; margin-bottom:24px;">

          <!-- PLAN 1: DIAMAX TEAM ($39.99 / temp.) -->
          <div class="diamax-plan-card" onclick="seleccionarPlanSuscripcion('TEAM')" style="background:rgba(15, 23, 42, 0.85); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); border:1px solid rgba(255, 255, 255, 0.1); border-radius:16px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 8px 30px rgba(0,0,0,0.4); transition:all 0.2s; cursor:pointer;" onmouseover="this.style.borderColor='#B18A53'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(0)';">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <div style="width:36px; height:36px; border-radius:8px; background:rgba(255,255,255,0.06); display:flex; align-items:center; justify-content:center; border:1px solid rgba(255,255,255,0.12);">
                    <svg width="22" height="22"><use href="#diamax-icon-tier-team"/></svg>
                  </div>
                  <div>
                    <h4 style="margin:0; font-size:16px; font-weight:800; color:#FFFFFF;">DIAMAX TEAM</h4>
                    <span style="font-size:11px; color:#94A3B8;">Mánager Individual</span>
                  </div>
                </div>
                <span style="background:rgba(255,255,255,0.08); color:#CBD5E1; border:1px solid rgba(255,255,255,0.12); font-size:10px; font-weight:800; padding:3px 8px; border-radius:6px; letter-spacing:0.5px;">1 EQUIPO</span>
              </div>

              <div style="margin-bottom:14px; padding-bottom:14px; border-bottom:1px solid rgba(255,255,255,0.08);">
                <div style="display:flex; align-items:baseline; gap:4px;">
                  <span style="font-size:32px; font-weight:900; color:#FFFFFF; font-variant-numeric:tabular-nums;">$39.99</span>
                  <span style="font-size:12px; color:#94A3B8; font-weight:600;">/ temporada</span>
                </div>
                <div style="font-size:11.5px; color:#B18A53; font-weight:700; margin-top:2px;">1 franquicia · Acceso dugout completo</div>
              </div>

              <ul style="list-style:none; padding:0; margin:0 0 18px 0; font-size:12px; color:#CBD5E1; display:flex; flex-direction:column; gap:8px;">
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Anotador Dugout en Vivo (36 Jugadas Canónicas)</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Optimizador Monte Carlo (10,000 Simulaciones xRuns)</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Campo 2D + Spray Chart &amp; Zonas de Bateo</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Manual Oficial WBSC con 10 Módulos de Operación</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Exportar Tarjeta Oficial y Boxscore (PDF/WhatsApp)</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>PWA Offline Ready (100% Funcional en Dugout)</span></li>
              </ul>
            </div>

            <button type="button" onclick="seleccionarPlanSuscripcion('TEAM')" style="width:100%; padding:11px; background:rgba(255,255,255,0.06); color:#F8FAFC; border:1px solid rgba(255,255,255,0.15); border-radius:8px; font-weight:800; font-size:12px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px; transition:all 0.2s;" onmouseover="this.style.background='#B18A53'; this.style.color='#FFFFFF';" onmouseout="this.style.background='rgba(255,255,255,0.06)'; this.style.color='#F8FAFC';">
              Elegir Plan TEAM ($39.99)
            </button>
          </div>

          <!-- PLAN 2: DIAMAX CLUB ($179.99 / temp.) -->
          <div class="diamax-plan-card" onclick="seleccionarPlanSuscripcion('CLUB')" style="background:rgba(15, 23, 42, 0.85); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); border:1px solid rgba(255, 255, 255, 0.1); border-radius:16px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 8px 30px rgba(0,0,0,0.4); transition:all 0.2s; cursor:pointer;" onmouseover="this.style.borderColor='#B18A53'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(0)';">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <div style="width:36px; height:36px; border-radius:8px; background:rgba(255,255,255,0.06); display:flex; align-items:center; justify-content:center; border:1px solid rgba(255,255,255,0.12);">
                    <svg width="22" height="22"><use href="#diamax-icon-tier-club"/></svg>
                  </div>
                  <div>
                    <h4 style="margin:0; font-size:16px; font-weight:800; color:#FFFFFF;">DIAMAX CLUB</h4>
                    <span style="font-size:11px; color:#94A3B8;">Clubes y Escuelas</span>
                  </div>
                </div>
                <span style="background:rgba(255,255,255,0.08); color:#CBD5E1; border:1px solid rgba(255,255,255,0.12); font-size:10px; font-weight:800; padding:3px 8px; border-radius:6px; letter-spacing:0.5px;">5 EQUIPOS</span>
              </div>

              <div style="margin-bottom:14px; padding-bottom:14px; border-bottom:1px solid rgba(255,255,255,0.08);">
                <div style="display:flex; align-items:baseline; gap:4px;">
                  <span style="font-size:32px; font-weight:900; color:#FFFFFF; font-variant-numeric:tabular-nums;">$179.99</span>
                  <span style="font-size:12px; color:#94A3B8; font-weight:600;">/ temporada</span>
                </div>
                <div style="font-size:11.5px; color:#B18A53; font-weight:700; margin-top:2px;">Hasta 5 franquicias asociadas</div>
              </div>

              <ul style="list-style:none; padding:0; margin:0 0 18px 0; font-size:12px; color:#CBD5E1; display:flex; flex-direction:column; gap:8px;">
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Todo lo incluido en Plan TEAM</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Panel Multi-Equipo para Mánager General</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Comparativa de Rendimiento y Roster Colectivo</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Control Centralizado de Categorías Menores</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Exportación Consolidada de Temporada</span></li>
              </ul>
            </div>

            <button type="button" onclick="seleccionarPlanSuscripcion('CLUB')" style="width:100%; padding:11px; background:rgba(255,255,255,0.06); color:#F8FAFC; border:1px solid rgba(255,255,255,0.15); border-radius:8px; font-weight:800; font-size:12px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px; transition:all 0.2s;" onmouseover="this.style.background='#B18A53'; this.style.color='#FFFFFF';" onmouseout="this.style.background='rgba(255,255,255,0.06)'; this.style.color='#F8FAFC';">
              Elegir Plan CLUB ($179.99)
            </button>
          </div>

          <!-- PLAN 3: DIAMAX ACADEMY ($349.99 / temp.) -->
          <div class="diamax-plan-card" onclick="seleccionarPlanSuscripcion('ACADEMY')" style="background:rgba(15, 23, 42, 0.85); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); border:1px solid rgba(255, 255, 255, 0.1); border-radius:16px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 8px 30px rgba(0,0,0,0.4); transition:all 0.2s; cursor:pointer;" onmouseover="this.style.borderColor='#B18A53'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(0)';">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <div style="width:36px; height:36px; border-radius:8px; background:rgba(255,255,255,0.06); display:flex; align-items:center; justify-content:center; border:1px solid rgba(255,255,255,0.12);">
                    <svg width="22" height="22"><use href="#diamax-icon-tier-academy"/></svg>
                  </div>
                  <div>
                    <h4 style="margin:0; font-size:16px; font-weight:800; color:#FFFFFF;">DIAMAX ACADEMY</h4>
                    <span style="font-size:11px; color:#94A3B8;">Desarrollo y Prospectos</span>
                  </div>
                </div>
                <span style="background:rgba(255,255,255,0.08); color:#CBD5E1; border:1px solid rgba(255,255,255,0.12); font-size:10px; font-weight:800; padding:3px 8px; border-radius:6px; letter-spacing:0.5px;">10 EQUIPOS</span>
              </div>

              <div style="margin-bottom:14px; padding-bottom:14px; border-bottom:1px solid rgba(255,255,255,0.08);">
                <div style="display:flex; align-items:baseline; gap:4px;">
                  <span style="font-size:32px; font-weight:900; color:#FFFFFF; font-variant-numeric:tabular-nums;">$349.99</span>
                  <span style="font-size:12px; color:#94A3B8; font-weight:600;">/ temporada</span>
                </div>
                <div style="font-size:11.5px; color:#B18A53; font-weight:700; margin-top:2px;">Hasta 10 equipos · Monitoreo técnico</div>
              </div>

              <ul style="list-style:none; padding:0; margin:0 0 18px 0; font-size:12px; color:#CBD5E1; display:flex; flex-direction:column; gap:8px;">
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Todo lo de CLUB</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Módulo de Habilidades Técnicas y Biomecánica</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Radar de Defensores y Bateadores Avanzado</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Reporte de Scouting para Firmas y Becas</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Soporte Prioritario para Entrenadores</span></li>
              </ul>
            </div>

            <button type="button" onclick="seleccionarPlanSuscripcion('ACADEMY')" style="width:100%; padding:11px; background:rgba(255,255,255,0.06); color:#F8FAFC; border:1px solid rgba(255,255,255,0.15); border-radius:8px; font-weight:800; font-size:12px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px; transition:all 0.2s;" onmouseover="this.style.background='#B18A53'; this.style.color='#FFFFFF';" onmouseout="this.style.background='rgba(255,255,255,0.06)'; this.style.color='#F8FAFC';">
              Elegir Plan ACADEMY ($349.99)
            </button>
          </div>

          <!-- PLAN 4: LEAGUE PRO ($649.99 / temp.) (DESTACADO) -->
          <div class="diamax-plan-card" onclick="seleccionarPlanSuscripcion('LEAGUE')" style="background:rgba(20, 29, 52, 0.95); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border:1.8px solid #F59E0B; border-radius:16px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 0 30px rgba(245, 158, 11, 0.25); transition:all 0.2s; cursor:pointer; position:relative;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 0 40px rgba(245, 158, 11, 0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 0 30px rgba(245, 158, 11, 0.25)';">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <div style="width:36px; height:36px; border-radius:8px; background:rgba(245,158,11,0.2); display:flex; align-items:center; justify-content:center; border:1px solid rgba(245,158,11,0.4);">
                    <svg width="22" height="22"><use href="#diamax-icon-tier-league"/></svg>
                  </div>
                  <div>
                    <h4 style="margin:0; font-size:16px; font-weight:800; color:#FFFFFF;">LEAGUE PRO</h4>
                    <span style="font-size:11px; color:#FCD34D; font-weight:700;">Circuito Oficial</span>
                  </div>
                </div>
                <span style="background:#D97706; color:#FFFFFF; font-size:10px; font-weight:900; padding:3px 8px; border-radius:6px; letter-spacing:0.5px;">20 EQUIPOS</span>
              </div>

              <div style="margin-bottom:14px; padding-bottom:14px; border-bottom:1px solid rgba(245,158,11,0.25);">
                <div style="display:flex; align-items:baseline; gap:4px;">
                  <span style="font-size:32px; font-weight:900; color:#FFFFFF; font-variant-numeric:tabular-nums;">$649.99</span>
                  <span style="font-size:12px; color:#FDE68A; font-weight:600;">/ temporada</span>
                </div>
                <div style="font-size:11.5px; color:#FCD34D; font-weight:700; margin-top:2px;">Hasta 20 equipos · Gestión de Liga</div>
              </div>

              <ul style="list-style:none; padding:0; margin:0 0 18px 0; font-size:12px; color:#CBD5E1; display:flex; flex-direction:column; gap:8px;">
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#F59E0B; font-weight:900;">✓</span> <span>Todo lo de ACADEMY</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#F59E0B; font-weight:900;">✓</span> <span>Administrador de Calendario de Torneo</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#F59E0B; font-weight:900;">✓</span> <span>Lideratos Oficiales WBSC en Tiempo Real</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#F59E0B; font-weight:900;">✓</span> <span>Módulo de Asignación de Árbitros y Anotadores</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#F59E0B; font-weight:900;">✓</span> <span>Sincronización Cloud Firebase Multidispositivo</span></li>
              </ul>
            </div>

            <button type="button" onclick="seleccionarPlanSuscripcion('LEAGUE')" style="width:100%; padding:11px; background:linear-gradient(135deg, #D97706, #B45309); color:#FFFFFF; border:none; border-radius:8px; font-weight:900; font-size:12px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px; box-shadow:0 4px 15px rgba(217,119,6,0.35); transition:all 0.2s;" onmouseover="this.style.filter='brightness(1.15)';" onmouseout="this.style.filter='none';">
              Elegir LEAGUE PRO ($649.99)
            </button>
          </div>

          <!-- PLAN 5: DIAMAX ORGANIZATION ($949.99 / temp.) -->
          <div class="diamax-plan-card" onclick="seleccionarPlanSuscripcion('ORGANIZATION')" style="background:rgba(15, 23, 42, 0.85); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); border:1px solid rgba(255, 255, 255, 0.1); border-radius:16px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 8px 30px rgba(0,0,0,0.4); transition:all 0.2s; cursor:pointer;" onmouseover="this.style.borderColor='#B18A53'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(0)';">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <div style="width:36px; height:36px; border-radius:8px; background:rgba(255,255,255,0.06); display:flex; align-items:center; justify-content:center; border:1px solid rgba(255,255,255,0.12);">
                    <svg width="22" height="22"><use href="#diamax-icon-tier-organization"/></svg>
                  </div>
                  <div>
                    <h4 style="margin:0; font-size:16px; font-weight:800; color:#FFFFFF;">ORGANIZATION</h4>
                    <span style="font-size:11px; color:#94A3B8;">Multi-División Estatal</span>
                  </div>
                </div>
                <span style="background:rgba(255,255,255,0.08); color:#CBD5E1; border:1px solid rgba(255,255,255,0.12); font-size:10px; font-weight:800; padding:3px 8px; border-radius:6px; letter-spacing:0.5px;">30 EQUIPOS</span>
              </div>

              <div style="margin-bottom:14px; padding-bottom:14px; border-bottom:1px solid rgba(255,255,255,0.08);">
                <div style="display:flex; align-items:baseline; gap:4px;">
                  <span style="font-size:32px; font-weight:900; color:#FFFFFF; font-variant-numeric:tabular-nums;">$949.99</span>
                  <span style="font-size:12px; color:#94A3B8; font-weight:600;">/ temporada</span>
                </div>
                <div style="font-size:11.5px; color:#B18A53; font-weight:700; margin-top:2px;">Hasta 30 equipos · Múltiples sedes</div>
              </div>

              <ul style="list-style:none; padding:0; margin:0 0 18px 0; font-size:12px; color:#CBD5E1; display:flex; flex-direction:column; gap:8px;">
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Todo lo de LEAGUE PRO</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Múltiples Categorías Simultáneas (+55, U12, etc.)</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Control Médico y Antidopaje por Franquicia</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Integración y Transmisión Multi-Cabina de Medios</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Atención Técnica Prioritaria para Directiva</span></li>
              </ul>
            </div>

            <button type="button" onclick="seleccionarPlanSuscripcion('ORGANIZATION')" style="width:100%; padding:11px; background:rgba(255,255,255,0.06); color:#F8FAFC; border:1px solid rgba(255,255,255,0.15); border-radius:8px; font-weight:800; font-size:12px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px; transition:all 0.2s;" onmouseover="this.style.background='#B18A53'; this.style.color='#FFFFFF';" onmouseout="this.style.background='rgba(255,255,255,0.06)'; this.style.color='#F8FAFC';">
              Elegir ORGANIZATION ($949.99)
            </button>
          </div>

          <!-- PLAN 6: ENTERPRISE (A Medida / SLA) -->
          <div class="diamax-plan-card" onclick="seleccionarPlanSuscripcion('ENTERPRISE')" style="background:linear-gradient(145deg, #0B132B, #1C2541); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); border:1px solid rgba(255,255,255,0.15); border-radius:16px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 8px 30px rgba(0,0,0,0.5); transition:all 0.2s; cursor:pointer;" onmouseover="this.style.borderColor='#B18A53'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='rgba(255,255,255,0.15)'; this.style.transform='translateY(0)';">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <div style="width:36px; height:36px; border-radius:8px; background:rgba(177,138,83,0.15); display:flex; align-items:center; justify-content:center; border:1px solid rgba(177,138,83,0.3);">
                    <svg width="22" height="22"><use href="#diamax-icon-tier-enterprise"/></svg>
                  </div>
                  <div>
                    <h4 style="margin:0; font-size:16px; font-weight:800; color:#FFFFFF;">ENTERPRISE</h4>
                    <span style="font-size:11px; color:#B18A53; font-weight:700;">Federaciones y Circuitos</span>
                  </div>
                </div>
                <span style="background:rgba(177,138,83,0.25); color:#E5C07B; border:1px solid rgba(177,138,83,0.5); font-size:10px; font-weight:800; padding:3px 8px; border-radius:6px; letter-spacing:0.5px;">30+ EQUIPOS</span>
              </div>

              <div style="margin-bottom:14px; padding-bottom:14px; border-bottom:1px solid rgba(255,255,255,0.08);">
                <div style="display:flex; align-items:baseline; gap:4px;">
                  <span style="font-size:26px; font-weight:900; color:#FFFFFF; letter-spacing:-0.5px;">A Medida / SLA</span>
                </div>
                <div style="font-size:11.5px; color:#E5C07B; font-weight:700; margin-top:2px;">Servicio Dedicado y Soporte 24/7</div>
              </div>

              <ul style="list-style:none; padding:0; margin:0 0 18px 0; font-size:12px; color:#CBD5E1; display:flex; flex-direction:column; gap:8px;">
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Todo lo de ORGANIZATION</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Circuitos Nacionales e Internacionales</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Servidor Dedicado e Integración API Directa</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Capacitación Oficial para Anotadores</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Ingeniero de Soporte 24/7 y SLA Corporativo</span></li>
              </ul>
            </div>

            <button type="button" onclick="seleccionarPlanSuscripcion('ENTERPRISE')" style="width:100%; padding:11px; background:rgba(255,255,255,0.06); color:#E5C07B; border:1px solid rgba(177,138,83,0.5); border-radius:8px; font-weight:800; font-size:12px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px; transition:all 0.2s;" onmouseover="this.style.background='#B18A53'; this.style.color='#FFFFFF';" onmouseout="this.style.background='rgba(255,255,255,0.06)'; this.style.color='#E5C07B';">
              Solicitar ENTERPRISE
            </button>
          </div>

        </div>

        <!-- Footer Bar del Submenú de Planes -->
        <div style="margin-top:20px; padding:12px 16px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:11.5px; color:#94A3B8;">¿Eres del equipo directivo de 3Tree? Utiliza el acceso maestro de fundador con clave PIN.</span>
          </div>
          <button type="button" onclick="switchAuthTab('master')" style="background:none; border:none; color:#FFB300; font-size:11.5px; font-weight:900; cursor:pointer; text-decoration:underline;">
            Portal Maestro 3Tree →
          </button>
        </div>

      </div>`;

// Reemplazar el bloque en html
html = html.substring(0, sIdx) + newPricingHTML + html.substring(fullEndIdx);
console.log('✓ Bloque auth-panel-pricing reemplazado exitosamente.');

// Asegurar que el modal tenga ancho responsivo amplio en pricing
const oldModalBox = '<div style="background:linear-gradient(145deg, #091329, #050b18); border:2px solid rgba(0,210,255,0.5); border-radius:22px; width:100%; max-width:880px;';
const newModalBox = '<div id="auth-modal-dialog" style="background:linear-gradient(145deg, #091329, #050b18); border:2px solid rgba(0,210,255,0.5); border-radius:22px; width:100%; max-width:1160px;';

if (html.includes(oldModalBox)) {
  html = html.replace(oldModalBox, newModalBox);
  console.log('✓ auth-modal-dialog ampliado a max-width:1160px.');
}

// Actualizar switchAuthTab
const oldSwitchFn = `function switchAuthTab(tab) {
  const activeColor = tab === 'master' ? '#FFC72C' : '#B18A53';
  ['pricing', 'register', 'login', 'master'].forEach(t => {`;

const newSwitchFn = `function switchAuthTab(tab) {
  const activeColor = tab === 'master' ? '#FFC72C' : '#B18A53';
  const modalBox = document.getElementById('auth-modal-dialog') || document.querySelector('#auth-modal-overlay > div');
  if (modalBox) {
    modalBox.style.maxWidth = (tab === 'pricing') ? '1160px' : '620px';
  }
  ['pricing', 'register', 'login', 'master'].forEach(t => {`;

if (html.includes(oldSwitchFn)) {
  html = html.replace(oldSwitchFn, newSwitchFn);
  console.log('✓ switchAuthTab actualizado.');
}

fs.writeFileSync(indexPath, html, 'utf-8');
console.log('=== SECCIÓN DE PLANES ACTUALIZADA CON ÉXITO ===');
