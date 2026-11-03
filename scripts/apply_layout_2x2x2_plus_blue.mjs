import fs from 'fs';

const indexPath = 'index.html';
let html = fs.readFileSync(indexPath, 'utf-8');

console.log('--- APLICANDO ESTRUCTURA: 2 BLANCAS ARRIBA, 2 ABAJO, 2 MÁS ABAJO + AZUL COMENTARISTA AL FINAL ---');

const sIdx = html.indexOf('<div id="auth-panel-pricing" style="display:block;">');
const eIdx = html.indexOf('id="auth-panel-register"');

if (sIdx === -1 || eIdx === -1) {
  console.error('❌ No se encontró el bloque auth-panel-pricing');
  process.exit(1);
}

const subChunk = html.substring(sIdx, eIdx);
const lastDivClose = subChunk.lastIndexOf('</div>');
const fullEndIdx = sIdx + lastDivClose + 6;

console.log('Rango:', sIdx, 'a', fullEndIdx);

const newPricingHTML = `<div id="auth-panel-pricing" style="display:block;">
        
        <!-- ENCABEZADO SUPERIOR -->
        <div style="text-align:center; margin-bottom:18px;">
          <span style="background:rgba(0,122,255,0.15); border:1px solid #007AFF; color:#38BDF8; font-size:11px; font-weight:900; padding:4px 14px; border-radius:20px; text-transform:uppercase; letter-spacing:0.8px;">
            MODELO HÍBRIDO • PRECIOS POR TEMPORADA
          </span>
          <h3 style="font-size:22px; font-weight:900; margin:10px 0 4px 0; color:#FFFFFF;">Seis planes, un solo ecosistema.</h3>
          <p style="margin:0; font-size:12px; color:#94A3B8;">Solución integral de sabermetría y anotación en vivo para equipos, academias y ligas completas.</p>
        </div>

        <!-- BANNER DE PRUEBA GRATUITA SIN TARJETA -->
        <div style="background:linear-gradient(135deg, rgba(0,122,255,0.12), rgba(10,24,54,0.4)); border:1px solid rgba(0,122,255,0.4); border-radius:12px; padding:12px 18px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
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
             GRID DE 6 TARJETAS BLANCAS:
             - 2 ARRIBA (TEAM & CLUB)
             - 2 ABAJO (ACADEMY & LEAGUE PRO)
             - 2 MÁS ABAJO (ORGANIZATION & ENTERPRISE)
             ========================================================================= -->
        <style>
          .diamax-white-grid-2x2x2 {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-bottom: 24px;
          }
          @media (max-width: 768px) {
            .diamax-white-grid-2x2x2 {
              grid-template-columns: 1fr;
            }
          }
          .diamax-white-card {
            background: #FFFFFF !important;
            color: #0F172A !important;
            border-radius: 14px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.25);
            border: 1px solid rgba(226, 232, 240, 0.9);
            transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
            cursor: pointer;
          }
          .diamax-white-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 26px rgba(0, 0, 0, 0.35);
          }
          .diamax-white-card h4 {
            color: #0F172A !important;
            margin: 0;
            font-size: 17px;
            font-weight: 900;
          }
          .diamax-white-card .plan-tier-badge {
            background: #F1F5F9;
            color: #334155;
            border: 1px solid #CBD5E1;
            font-size: 10px;
            font-weight: 900;
            padding: 3px 8px;
            border-radius: 6px;
            letter-spacing: 0.5px;
          }
          .diamax-white-card .plan-price {
            font-size: 32px;
            font-weight: 900;
            color: #0F172A;
            font-variant-numeric: tabular-nums;
          }
          .diamax-white-card .plan-term {
            font-size: 12px;
            color: #64748B;
            font-weight: 700;
          }
          .diamax-white-card .plan-sub {
            font-size: 11.5px;
            color: #B18A53;
            font-weight: 800;
            margin-top: 3px;
          }
          .diamax-white-card ul {
            list-style: none;
            padding: 0;
            margin: 14px 0 18px 0;
            font-size: 12px;
            color: #334155;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .diamax-white-card ul li {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            line-height: 1.4;
          }
          .diamax-white-card ul li .check-icon {
            color: #16A34A;
            font-weight: 900;
          }
          .diamax-white-card .btn-choose-plan {
            width: 100%;
            padding: 11px;
            background: #0F172A;
            color: #FFFFFF;
            border: none;
            border-radius: 8px;
            font-weight: 800;
            font-size: 12px;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: background 0.2s;
          }
          .diamax-white-card .btn-choose-plan:hover {
            background: #007AFF;
            color: #FFFFFF;
          }
        </style>

        <div class="diamax-white-grid-2x2x2" id="auth-six-plans-grid">

          <!-- ==============================================
               FILA 1 (DOS BLANCAS ARRIBA UNA AL LADO DE LA OTRA):
               1. DIAMAX TEAM & 2. DIAMAX CLUB
               ============================================== -->

          <!-- 1. DIAMAX TEAM ($39.99 / temp.) -->
          <div class="diamax-white-card" onclick="seleccionarPlanSuscripcion('TEAM')">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <div style="width:36px; height:36px; border-radius:8px; background:#F8FAFC; display:flex; align-items:center; justify-content:center; border:1px solid #E2E8F0;">
                    <svg width="22" height="22"><use href="#diamax-icon-tier-team"/></svg>
                  </div>
                  <div>
                    <h4>DIAMAX TEAM</h4>
                    <span style="font-size:11px; color:#64748B; font-weight:600;">Mánager Individual</span>
                  </div>
                </div>
                <span class="plan-tier-badge">1 EQUIPO</span>
              </div>

              <div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid #E2E8F0;">
                <div style="display:flex; align-items:baseline; gap:4px;">
                  <span class="plan-price">$39.99</span>
                  <span class="plan-term">/ temporada</span>
                </div>
                <div class="plan-sub">1 franquicia · Acceso dugout completo</div>
              </div>

              <ul>
                <li><span class="check-icon">✓</span> <span>Anotador Dugout en Vivo (36 Jugadas Canónicas)</span></li>
                <li><span class="check-icon">✓</span> <span>Optimizador Monte Carlo (10,000 Simulaciones xRuns)</span></li>
                <li><span class="check-icon">✓</span> <span>Campo 2D + Spray Chart &amp; Zonas de Bateo</span></li>
                <li><span class="check-icon">✓</span> <span>Manual Oficial WBSC con 10 Módulos de Operación</span></li>
                <li><span class="check-icon">✓</span> <span>Exportar Tarjeta Oficial y Boxscore (PDF/WhatsApp)</span></li>
                <li><span class="check-icon">✓</span> <span>PWA Offline Ready (100% Funcional en Dugout)</span></li>
              </ul>
            </div>

            <button type="button" class="btn-choose-plan" onclick="seleccionarPlanSuscripcion('TEAM')">
              Elegir Plan TEAM ($39.99)
            </button>
          </div>

          <!-- 2. DIAMAX CLUB ($179.99 / temp.) -->
          <div class="diamax-white-card" onclick="seleccionarPlanSuscripcion('CLUB')">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <div style="width:36px; height:36px; border-radius:8px; background:#F8FAFC; display:flex; align-items:center; justify-content:center; border:1px solid #E2E8F0;">
                    <svg width="22" height="22"><use href="#diamax-icon-tier-club"/></svg>
                  </div>
                  <div>
                    <h4>DIAMAX CLUB</h4>
                    <span style="font-size:11px; color:#64748B; font-weight:600;">Clubes y Escuelas</span>
                  </div>
                </div>
                <span class="plan-tier-badge">5 EQUIPOS</span>
              </div>

              <div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid #E2E8F0;">
                <div style="display:flex; align-items:baseline; gap:4px;">
                  <span class="plan-price">$179.99</span>
                  <span class="plan-term">/ temporada</span>
                </div>
                <div class="plan-sub">Hasta 5 franquicias asociadas</div>
              </div>

              <ul>
                <li><span class="check-icon">✓</span> <span>Todo lo incluido en Plan TEAM</span></li>
                <li><span class="check-icon">✓</span> <span>Panel Multi-Equipo para Mánager General</span></li>
                <li><span class="check-icon">✓</span> <span>Comparativa de Rendimiento y Roster Colectivo</span></li>
                <li><span class="check-icon">✓</span> <span>Control Centralizado de Categorías Menores</span></li>
                <li><span class="check-icon">✓</span> <span>Exportación Consolidada de Temporada</span></li>
              </ul>
            </div>

            <button type="button" class="btn-choose-plan" onclick="seleccionarPlanSuscripcion('CLUB')">
              Elegir Plan CLUB ($179.99)
            </button>
          </div>

          <!-- ==============================================
               FILA 2 (ABAJO DOS MÁS):
               3. DIAMAX ACADEMY & 4. LEAGUE PRO
               ============================================== -->

          <!-- 3. DIAMAX ACADEMY ($349.99 / temp.) -->
          <div class="diamax-white-card" onclick="seleccionarPlanSuscripcion('ACADEMY')">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <div style="width:36px; height:36px; border-radius:8px; background:#F8FAFC; display:flex; align-items:center; justify-content:center; border:1px solid #E2E8F0;">
                    <svg width="22" height="22"><use href="#diamax-icon-tier-academy"/></svg>
                  </div>
                  <div>
                    <h4>DIAMAX ACADEMY</h4>
                    <span style="font-size:11px; color:#64748B; font-weight:600;">Desarrollo y Prospectos</span>
                  </div>
                </div>
                <span class="plan-tier-badge">10 EQUIPOS</span>
              </div>

              <div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid #E2E8F0;">
                <div style="display:flex; align-items:baseline; gap:4px;">
                  <span class="plan-price">$349.99</span>
                  <span class="plan-term">/ temporada</span>
                </div>
                <div class="plan-sub">Hasta 10 equipos · Monitoreo técnico</div>
              </div>

              <ul>
                <li><span class="check-icon">✓</span> <span>Todo lo de CLUB</span></li>
                <li><span class="check-icon">✓</span> <span>Módulo de Habilidades Técnicas y Biomecánica</span></li>
                <li><span class="check-icon">✓</span> <span>Radar de Defensores y Bateadores Avanzado</span></li>
                <li><span class="check-icon">✓</span> <span>Reporte de Scouting para Firmas y Becas</span></li>
                <li><span class="check-icon">✓</span> <span>Soporte Prioritario para Entrenadores</span></li>
              </ul>
            </div>

            <button type="button" class="btn-choose-plan" onclick="seleccionarPlanSuscripcion('ACADEMY')">
              Elegir Plan ACADEMY ($349.99)
            </button>
          </div>

          <!-- 4. LEAGUE PRO ($649.99 / temp.) (DESTACADO OFICIAL) -->
          <div class="diamax-white-card" onclick="seleccionarPlanSuscripcion('LEAGUE')" style="border: 2px solid #D97706 !important; position:relative; box-shadow: 0 6px 24px rgba(217, 119, 6, 0.2);">
            <div style="position:absolute; top:-10px; right:16px; background:#D97706; color:#FFFFFF; font-size:9.5px; font-weight:900; padding:2px 10px; border-radius:10px; letter-spacing:0.5px; text-transform:uppercase;">
              MÁS POPULAR
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <div style="width:36px; height:36px; border-radius:8px; background:rgba(217, 119, 6, 0.1); display:flex; align-items:center; justify-content:center; border:1px solid rgba(217, 119, 6, 0.3);">
                    <svg width="22" height="22"><use href="#diamax-icon-tier-league"/></svg>
                  </div>
                  <div>
                    <h4>LEAGUE PRO</h4>
                    <span style="font-size:11px; color:#D97706; font-weight:700;">Circuito Oficial</span>
                  </div>
                </div>
                <span style="background:#D97706; color:#FFFFFF; font-size:10px; font-weight:900; padding:3px 8px; border-radius:6px; letter-spacing:0.5px;">20 EQUIPOS</span>
              </div>

              <div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid #E2E8F0;">
                <div style="display:flex; align-items:baseline; gap:4px;">
                  <span class="plan-price" style="color:#B45309;">$649.99</span>
                  <span class="plan-term">/ temporada</span>
                </div>
                <div class="plan-sub" style="color:#D97706;">Hasta 20 equipos · Gestión de Liga</div>
              </div>

              <ul>
                <li><span class="check-icon" style="color:#D97706;">✓</span> <span>Todo lo de ACADEMY</span></li>
                <li><span class="check-icon" style="color:#D97706;">✓</span> <span>Administrador de Calendario de Torneo</span></li>
                <li><span class="check-icon" style="color:#D97706;">✓</span> <span>Lideratos Oficiales WBSC en Tiempo Real</span></li>
                <li><span class="check-icon" style="color:#D97706;">✓</span> <span>Módulo de Asignación de Árbitros y Anotadores</span></li>
                <li><span class="check-icon" style="color:#D97706;">✓</span> <span>Sincronización Cloud Firebase Multidispositivo</span></li>
              </ul>
            </div>

            <button type="button" onclick="seleccionarPlanSuscripcion('LEAGUE')" style="width:100%; padding:11px; background:linear-gradient(135deg, #D97706, #B45309); color:#FFFFFF; border:none; border-radius:8px; font-weight:900; font-size:12px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px; box-shadow:0 4px 15px rgba(217,119,6,0.3); transition:filter 0.2s;" onmouseover="this.style.filter='brightness(1.15)';" onmouseout="this.style.filter='none';">
              Elegir LEAGUE PRO ($649.99)
            </button>
          </div>

          <!-- ==============================================
               FILA 3 (Y MÁS ABAJO DOS MÁS):
               5. DIAMAX ORGANIZATION & 6. ENTERPRISE
               ============================================== -->

          <!-- 5. DIAMAX ORGANIZATION ($949.99 / temp.) -->
          <div class="diamax-white-card" onclick="seleccionarPlanSuscripcion('ORGANIZATION')">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <div style="width:36px; height:36px; border-radius:8px; background:#F8FAFC; display:flex; align-items:center; justify-content:center; border:1px solid #E2E8F0;">
                    <svg width="22" height="22"><use href="#diamax-icon-tier-organization"/></svg>
                  </div>
                  <div>
                    <h4>ORGANIZATION</h4>
                    <span style="font-size:11px; color:#64748B; font-weight:600;">Multi-División Estatal</span>
                  </div>
                </div>
                <span class="plan-tier-badge">30 EQUIPOS</span>
              </div>

              <div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid #E2E8F0;">
                <div style="display:flex; align-items:baseline; gap:4px;">
                  <span class="plan-price">$949.99</span>
                  <span class="plan-term">/ temporada</span>
                </div>
                <div class="plan-sub">Hasta 30 equipos · Múltiples sedes</div>
              </div>

              <ul>
                <li><span class="check-icon">✓</span> <span>Todo lo de LEAGUE PRO</span></li>
                <li><span class="check-icon">✓</span> <span>Múltiples Categorías Simultáneas (+55, U12, etc.)</span></li>
                <li><span class="check-icon">✓</span> <span>Control Médico y Antidopaje por Franquicia</span></li>
                <li><span class="check-icon">✓</span> <span>Integración y Transmisión Multi-Cabina de Medios</span></li>
                <li><span class="check-icon">✓</span> <span>Atención Técnica Prioritaria para Directiva</span></li>
              </ul>
            </div>

            <button type="button" class="btn-choose-plan" onclick="seleccionarPlanSuscripcion('ORGANIZATION')">
              Elegir ORGANIZATION ($949.99)
            </button>
          </div>

          <!-- 6. ENTERPRISE (A Medida / SLA) -->
          <div class="diamax-white-card" onclick="seleccionarPlanSuscripcion('ENTERPRISE')" style="border: 1.5px solid #0F172A !important;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <div style="width:36px; height:36px; border-radius:8px; background:#0F172A; display:flex; align-items:center; justify-content:center;">
                    <svg width="22" height="22" style="fill:#F8FAFC;"><use href="#diamax-icon-tier-enterprise"/></svg>
                  </div>
                  <div>
                    <h4>ENTERPRISE</h4>
                    <span style="font-size:11px; color:#B18A53; font-weight:700;">Federaciones y Circuitos</span>
                  </div>
                </div>
                <span style="background:#0F172A; color:#FFFFFF; font-size:10px; font-weight:800; padding:3px 8px; border-radius:6px; letter-spacing:0.5px;">30+ EQUIPOS</span>
              </div>

              <div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid #E2E8F0;">
                <div style="display:flex; align-items:baseline; gap:4px;">
                  <span class="plan-price" style="font-size:26px;">A Medida / SLA</span>
                </div>
                <div class="plan-sub">Servicio Dedicado y Soporte 24/7</div>
              </div>

              <ul>
                <li><span class="check-icon">✓</span> <span>Todo lo de ORGANIZATION</span></li>
                <li><span class="check-icon">✓</span> <span>Circuitos Nacionales e Internacionales</span></li>
                <li><span class="check-icon">✓</span> <span>Servidor Dedicado e Integración API Directa</span></li>
                <li><span class="check-icon">✓</span> <span>Capacitación Oficial para Anotadores</span></li>
                <li><span class="check-icon">✓</span> <span>Ingeniero de Soporte 24/7 y SLA Corporativo</span></li>
              </ul>
            </div>

            <button type="button" class="btn-choose-plan" onclick="seleccionarPlanSuscripcion('ENTERPRISE')">
              Solicitar ENTERPRISE
            </button>
          </div>

        </div>

        <!-- =========================================================================
             Y LUEGO UNA LA AZUL DE EL COMENTARISTA
             (ANCHO COMPLETO AL FINAL)
             ========================================================================= -->
        <div style="background:linear-gradient(145deg, #091a3e, #050d22); border:2px solid #007AFF; border-radius:16px; padding:22px; margin-bottom:24px; box-shadow:0 8px 32px rgba(0,122,255,0.3);">
          
          <!-- Encabezado de la Tarjeta Azul -->
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px; padding-bottom:14px; border-bottom:1px solid rgba(0,122,255,0.25);">
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <h4 style="margin:0; font-size:18px; font-weight:900; color:#FFFFFF; display:inline-flex; align-items:center; gap:6px;">
                  🎙️ PLAN ESPECIAL: COMENTARISTA &amp; BROADCAST MEDIA
                </h4>
                <span style="background:rgba(0,122,255,0.25); border:1px solid #007AFF; color:#7DD3FC; font-size:10px; font-weight:900; padding:2px 8px; border-radius:10px;">ON AIR</span>
              </div>
              <div style="font-size:12px; color:#94A3B8; margin-top:4px;">
                Mesa de transmisión digital para radio, TV, YouTube y Twitch • Puesto oficial de cabina con telemetría en vivo
              </div>
            </div>

            <div style="text-align:right;">
              <div style="display:flex; align-items:baseline; gap:4px; justify-content:flex-end;">
                <span style="font-size:32px; font-weight:900; color:#FFFFFF; font-variant-numeric:tabular-nums;">$14.99</span>
                <span style="font-size:12px; color:#94A3B8; font-weight:600;">/ mes</span>
              </div>
              <div style="font-size:11px; color:#38BDF8; font-weight:700;">• Anual (-28%): $129.00 / año ($10.75/mes) • Pase Torneo: $49</div>
            </div>
          </div>

          <!-- GRID 2 ARRIBA, 2 ABAJO -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:12px; margin-bottom:12px;">
            <!-- 1. Arriba Izquierda -->
            <div style="background:rgba(0,122,255,0.08); border:1px solid rgba(0,122,255,0.25); border-radius:10px; padding:12px 14px;">
              <div style="color:#7DD3FC; font-weight:800; font-size:12.5px; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <span>🎙️ Cockpit Cabina a 60 cm</span>
              </div>
              <div style="font-size:11.5px; color:#CBD5E1; line-height:1.4;">
                Pantalla única de lectura rápida todo-en-uno, sin interferencias ni botones del Dugout.
              </div>
            </div>

            <!-- 2. Arriba Derecha -->
            <div style="background:rgba(0,122,255,0.08); border:1px solid rgba(0,122,255,0.25); border-radius:10px; padding:12px 14px;">
              <div style="color:#7DD3FC; font-weight:800; font-size:12.5px; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <span>📊 Telemetría Statcast &amp; BvP</span>
              </div>
              <div style="font-size:11.5px; color:#CBD5E1; line-height:1.4;">
                Spray Chart interactivo de 13 batazos, K-Zone 3x3 y divididos históricos frente a frente.
              </div>
            </div>

            <!-- 3. Abajo Izquierda -->
            <div style="background:rgba(0,122,255,0.08); border:1px solid rgba(0,122,255,0.25); border-radius:10px; padding:12px 14px;">
              <div style="color:#7DD3FC; font-weight:800; font-size:12.5px; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <span>⚡ Semáforo Médico +55 &amp; Pitcheos</span>
              </div>
              <div style="font-size:11.5px; color:#CBD5E1; line-height:1.4;">
                Control de degradación biomecánica de 1 a 75 lanzamientos con alerta automática de fatiga y bullpen a 70 envíos.
              </div>
            </div>

            <!-- 4. Abajo Derecha -->
            <div style="background:rgba(0,122,255,0.08); border:1px solid rgba(0,122,255,0.25); border-radius:10px; padding:12px 14px;">
              <div style="color:#7DD3FC; font-weight:800; font-size:12.5px; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <span>📜 Teleprompter Táctico de 3 Píldoras</span>
              </div>
              <div style="font-size:11.5px; color:#CBD5E1; line-height:1.4;">
                Menciones en vivo y detonadores comerciales automáticos por jugadas (Doble Play, Cuadrangular, Visita al Montículo).
              </div>
            </div>
          </div>

          <!-- 5. UNA MÁS ABAJO (ANCHO COMPLETO) -->
          <div style="background:rgba(0,122,255,0.14); border:1px solid rgba(0,122,255,0.4); border-radius:10px; padding:12px 16px; margin-bottom:16px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:10px; font-size:12px; color:#E2E8F0;">
              <span style="font-size:15px;">📡</span>
              <span><strong>URL de Overlay transparente para OBS Studio &amp; vMix</strong> • Gráfico WPA (Win Probability Added en vivo) y enlace directo a cabina</span>
            </div>
            <span style="background:rgba(56,189,248,0.2); border:1px solid #38BDF8; color:#7DD3FC; font-size:10px; font-weight:800; padding:3px 10px; border-radius:6px;">BROADCAST READY</span>
          </div>

          <!-- Barra de Acción y Acceso con Clave de Prensa / VIP -->
          <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center; justify-content:space-between; background:rgba(2,6,23,0.7); border:1px solid rgba(0,122,255,0.3); border-radius:12px; padding:12px 16px;">
            <button type="button" onclick="seleccionarPlanSuscripcion('MEDIA_PRO')" style="background:#007AFF; color:#FFFFFF; border:none; padding:11px 24px; border-radius:8px; font-weight:900; font-size:12px; cursor:pointer; text-transform:uppercase; box-shadow:0 0 16px rgba(0,122,255,0.4); transition:all 0.2s;" onmouseover="this.style.background='#0062cc';" onmouseout="this.style.background='#007AFF';">
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

        <!-- FOOTER BAR DEL SUBMENÚ DE PLANES -->
        <div style="margin-top:20px; padding:12px 16px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:11.5px; color:#94A3B8;">¿Eres del equipo directivo de 3Tree? Utiliza el acceso maestro de fundador con clave PIN.</span>
          </div>
          <button type="button" onclick="switchAuthTab('master')" style="background:none; border:none; color:#FFB300; font-size:11.5px; font-weight:900; cursor:pointer; text-decoration:underline;">
            Portal Maestro 3Tree →
          </button>
        </div>

      </div>`;

html = html.substring(0, sIdx) + newPricingHTML + html.substring(fullEndIdx);
console.log('✓ Bloque auth-panel-pricing reemplazado exitosamente.');

fs.writeFileSync(indexPath, html, 'utf-8');
console.log('=== SECCIÓN DE PLANES ACTUALIZADA CON ÉXITO: 2 BLANCAS ARRIBA, 2 ABAJO, 2 MÁS ABAJO + AZUL AL FINAL ===');
