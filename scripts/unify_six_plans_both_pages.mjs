import fs from 'fs';
import path from 'path';

const basePath = 'C:\\Users\\fitne\\Documents\\3Tree_Codebase\\DIAMAX';
const filePath = path.join(basePath, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

console.log('=== UNIFICANDO LOS 6 PLANES EN diamax-page-2 Y auth-modal-overlay ===');

// 1. Reemplazar la cuadrícula de 4 tarjetas en diamax-page-2 por los 6 planes oficiales
const p2OldStart = `<!-- Grid de Planes de Suscripción -->\r\n            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px; margin-bottom:22px;">`;
const p2OldStartLF = `<!-- Grid de Planes de Suscripción -->\n            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px; margin-bottom:22px;">`;

const p2OldEnd = `<!-- Botones de Navegación del Paso 3 -->`;

let idxStart = content.indexOf('<!-- Grid de Planes de Suscripción -->');
let idxEnd = content.indexOf('<!-- Botones de Navegación del Paso 3 -->');

if (idxStart !== -1 && idxEnd !== -1) {
  const oldP2Block = content.slice(idxStart, idxEnd);

  const newP2Block = `<!-- Grid de Planes de Suscripción Oficial (6 PLANES OFICIALES DIAMAX PRO) -->
            <div id="p2-six-plans-catalog" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:18px; margin-bottom:24px;">

              <!-- 1. DIAMAX TEAM -->
              <div id="p2-plan-card-TEAM" onclick="seleccionarPlanP2('TEAM')" style="background:#FFFFFF; border:1px solid #E8EDF1; border-radius:14px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; cursor:pointer; transition:all 0.2s; box-shadow:0 2px 8px rgba(24,35,49,0.04);" onmouseover="this.style.borderColor='#B18A53'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='#E8EDF1'; this.style.transform='translateY(0)';">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                      <div style="width:36px; height:36px; border-radius:8px; background:#F2F4F6; display:flex; align-items:center; justify-content:center; border:1px solid #E8EDF1;">
                        <svg width="22" height="22"><use href="#diamax-icon-tier-team"/></svg>
                      </div>
                      <div>
                        <h4 style="margin:0; font-size:16px; font-weight:800; color:#182331;">DIAMAX TEAM</h4>
                        <span style="font-size:11px; color:#64748B;">Mánager Individual</span>
                      </div>
                    </div>
                    <span style="background:#F2F4F6; color:#182331; border:1px solid #E8EDF1; font-size:10px; font-weight:800; padding:3px 8px; border-radius:6px;">1 EQUIPO</span>
                  </div>
                  <div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid #E8EDF1;">
                    <div style="display:flex; align-items:baseline; gap:4px;">
                      <span style="font-size:30px; font-weight:900; color:#182331; font-variant-numeric:tabular-nums;">$39.99</span>
                      <span style="font-size:12px; color:#64748B; font-weight:600;">/ temporada</span>
                    </div>
                    <div style="font-size:11px; color:#B18A53; font-weight:700; margin-top:2px;">1 franquicia · Acceso Dugout completo</div>
                  </div>
                  <ul style="list-style:none; padding:0; margin:0 0 16px 0; font-size:11.5px; color:#263445; display:flex; flex-direction:column; gap:7px;">
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Anotador Dugout en Vivo (36 Jugadas Canónicas)</span></li>
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Optimizador Monte Carlo (10,000 Simulaciones)</span></li>
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Campo 2D + Spray Chart de Bateo</span></li>
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Exportar Tarjeta Oficial WBSC (PDF/WhatsApp)</span></li>
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>PWA Offline Ready en Dugout</span></li>
                  </ul>
                </div>
                <button type="button" onclick="seleccionarPlanP2('TEAM')" style="width:100%; padding:10px; background:#F2F4F6; color:#182331; border:1px solid #E8EDF1; border-radius:8px; font-weight:800; font-size:11.5px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px; transition:all 0.2s;">
                  Seleccionar TEAM ($39.99)
                </button>
              </div>

              <!-- 2. DIAMAX CLUB -->
              <div id="p2-plan-card-CLUB" onclick="seleccionarPlanP2('CLUB')" style="background:#FFFFFF; border:1px solid #E8EDF1; border-radius:14px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; cursor:pointer; transition:all 0.2s; box-shadow:0 2px 8px rgba(24,35,49,0.04);" onmouseover="this.style.borderColor='#B18A53'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='#E8EDF1'; this.style.transform='translateY(0)';">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                      <div style="width:36px; height:36px; border-radius:8px; background:#F2F4F6; display:flex; align-items:center; justify-content:center; border:1px solid #E8EDF1;">
                        <svg width="22" height="22"><use href="#diamax-icon-tier-club"/></svg>
                      </div>
                      <div>
                        <h4 style="margin:0; font-size:16px; font-weight:800; color:#182331;">DIAMAX CLUB</h4>
                        <span style="font-size:11px; color:#64748B;">Clubes y Escuelas</span>
                      </div>
                    </div>
                    <span style="background:#F2F4F6; color:#182331; border:1px solid #E8EDF1; font-size:10px; font-weight:800; padding:3px 8px; border-radius:6px;">5 EQUIPOS</span>
                  </div>
                  <div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid #E8EDF1;">
                    <div style="display:flex; align-items:baseline; gap:4px;">
                      <span style="font-size:30px; font-weight:900; color:#182331; font-variant-numeric:tabular-nums;">$179.99</span>
                      <span style="font-size:12px; color:#64748B; font-weight:600;">/ temporada</span>
                    </div>
                    <div style="font-size:11px; color:#B18A53; font-weight:700; margin-top:2px;">Hasta 5 franquicias asociadas</div>
                  </div>
                  <ul style="list-style:none; padding:0; margin:0 0 16px 0; font-size:11.5px; color:#263445; display:flex; flex-direction:column; gap:7px;">
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Todo lo incluido en Plan TEAM</span></li>
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Panel Multi-Equipo para Mánager General</span></li>
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Comparativa de Rendimiento y Rosters</span></li>
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Control Centralizado de Categorías Menores</span></li>
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Exportación Consolidada de Temporada</span></li>
                  </ul>
                </div>
                <button type="button" onclick="seleccionarPlanP2('CLUB')" style="width:100%; padding:10px; background:#F2F4F6; color:#182331; border:1px solid #E8EDF1; border-radius:8px; font-weight:800; font-size:11.5px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px; transition:all 0.2s;">
                  Seleccionar CLUB ($179.99)
                </button>
              </div>

              <!-- 3. DIAMAX ACADEMY -->
              <div id="p2-plan-card-ACADEMY" onclick="seleccionarPlanP2('ACADEMY')" style="background:#FFFFFF; border:1px solid #E8EDF1; border-radius:14px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; cursor:pointer; transition:all 0.2s; box-shadow:0 2px 8px rgba(24,35,49,0.04);" onmouseover="this.style.borderColor='#B18A53'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='#E8EDF1'; this.style.transform='translateY(0)';">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                      <div style="width:36px; height:36px; border-radius:8px; background:#F2F4F6; display:flex; align-items:center; justify-content:center; border:1px solid #E8EDF1;">
                        <svg width="22" height="22"><use href="#diamax-icon-tier-academy"/></svg>
                      </div>
                      <div>
                        <h4 style="margin:0; font-size:16px; font-weight:800; color:#182331;">DIAMAX ACADEMY</h4>
                        <span style="font-size:11px; color:#64748B;">Desarrollo y Prospectos</span>
                      </div>
                    </div>
                    <span style="background:#F2F4F6; color:#182331; border:1px solid #E8EDF1; font-size:10px; font-weight:800; padding:3px 8px; border-radius:6px;">10 EQUIPOS</span>
                  </div>
                  <div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid #E8EDF1;">
                    <div style="display:flex; align-items:baseline; gap:4px;">
                      <span style="font-size:30px; font-weight:900; color:#182331; font-variant-numeric:tabular-nums;">$349.99</span>
                      <span style="font-size:12px; color:#64748B; font-weight:600;">/ temporada</span>
                    </div>
                    <div style="font-size:11px; color:#B18A53; font-weight:700; margin-top:2px;">Hasta 10 equipos · Monitoreo técnico</div>
                  </div>
                  <ul style="list-style:none; padding:0; margin:0 0 16px 0; font-size:11.5px; color:#263445; display:flex; flex-direction:column; gap:7px;">
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Todo lo de CLUB</span></li>
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Módulo de Habilidades Técnicas y Biomecánica</span></li>
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Radar de Defensores y Bateadores Avanzado</span></li>
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Reporte de Scouting para Prospectos</span></li>
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Soporte Prioritario para Entrenadores</span></li>
                  </ul>
                </div>
                <button type="button" onclick="seleccionarPlanP2('ACADEMY')" style="width:100%; padding:10px; background:#F2F4F6; color:#182331; border:1px solid #E8EDF1; border-radius:8px; font-weight:800; font-size:11.5px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px; transition:all 0.2s;">
                  Seleccionar ACADEMY ($349.99)
                </button>
              </div>

              <!-- 4. LEAGUE PRO -->
              <div id="p2-plan-card-LEAGUE" onclick="seleccionarPlanP2('LEAGUE')" style="background:#FFFFFF; border:1.5px solid #B18A53; border-radius:14px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; cursor:pointer; transition:all 0.2s; box-shadow:0 4px 14px rgba(177,138,83,0.12);" onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='translateY(0)';">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                      <div style="width:36px; height:36px; border-radius:8px; background:rgba(177,138,83,0.12); display:flex; align-items:center; justify-content:center; border:1px solid rgba(177,138,83,0.3);">
                        <svg width="22" height="22"><use href="#diamax-icon-tier-league"/></svg>
                      </div>
                      <div>
                        <h4 style="margin:0; font-size:16px; font-weight:800; color:#182331;">LEAGUE PRO</h4>
                        <span style="font-size:11px; color:#B18A53; font-weight:700;">Circuito Oficial</span>
                      </div>
                    </div>
                    <span style="background:#B18A53; color:#FFFFFF; font-size:10px; font-weight:800; padding:3px 8px; border-radius:6px;">20 EQUIPOS</span>
                  </div>
                  <div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid #E8EDF1;">
                    <div style="display:flex; align-items:baseline; gap:4px;">
                      <span style="font-size:30px; font-weight:900; color:#182331; font-variant-numeric:tabular-nums;">$649.99</span>
                      <span style="font-size:12px; color:#64748B; font-weight:600;">/ temporada</span>
                    </div>
                    <div style="font-size:11px; color:#B18A53; font-weight:700; margin-top:2px;">Hasta 20 equipos · Gestión de Liga</div>
                  </div>
                  <ul style="list-style:none; padding:0; margin:0 0 16px 0; font-size:11.5px; color:#263445; display:flex; flex-direction:column; gap:7px;">
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Todo lo de ACADEMY</span></li>
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Administrador de Calendario de Torneo</span></li>
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Lideratos Oficiales WBSC en Tiempo Real</span></li>
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Módulo de Asignación de Árbitros y Anotadores</span></li>
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Sincronización Cloud Firebase Multidispositivo</span></li>
                  </ul>
                </div>
                <button type="button" onclick="seleccionarPlanP2('LEAGUE')" style="width:100%; padding:10px; background:#B18A53; color:#FFFFFF; border:none; border-radius:8px; font-weight:800; font-size:11.5px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px; transition:all 0.2s;">
                  Seleccionar LEAGUE PRO ($649.99)
                </button>
              </div>

              <!-- 5. DIAMAX ORGANIZATION -->
              <div id="p2-plan-card-ORGANIZATION" onclick="seleccionarPlanP2('ORGANIZATION')" style="background:#FFFFFF; border:1px solid #E8EDF1; border-radius:14px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; cursor:pointer; transition:all 0.2s; box-shadow:0 2px 8px rgba(24,35,49,0.04);" onmouseover="this.style.borderColor='#B18A53'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='#E8EDF1'; this.style.transform='translateY(0)';">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                      <div style="width:36px; height:36px; border-radius:8px; background:#F2F4F6; display:flex; align-items:center; justify-content:center; border:1px solid #E8EDF1;">
                        <svg width="22" height="22"><use href="#diamax-icon-tier-organization"/></svg>
                      </div>
                      <div>
                        <h4 style="margin:0; font-size:16px; font-weight:800; color:#182331;">ORGANIZATION</h4>
                        <span style="font-size:11px; color:#64748B;">Multi-División Estatal</span>
                      </div>
                    </div>
                    <span style="background:#F2F4F6; color:#182331; border:1px solid #E8EDF1; font-size:10px; font-weight:800; padding:3px 8px; border-radius:6px;">30 EQUIPOS</span>
                  </div>
                  <div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid #E8EDF1;">
                    <div style="display:flex; align-items:baseline; gap:4px;">
                      <span style="font-size:30px; font-weight:900; color:#182331; font-variant-numeric:tabular-nums;">$949.99</span>
                      <span style="font-size:12px; color:#64748B; font-weight:600;">/ temporada</span>
                    </div>
                    <div style="font-size:11px; color:#B18A53; font-weight:700; margin-top:2px;">Hasta 30 equipos · Múltiples sedes</div>
                  </div>
                  <ul style="list-style:none; padding:0; margin:0 0 16px 0; font-size:11.5px; color:#263445; display:flex; flex-direction:column; gap:7px;">
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Todo lo de LEAGUE PRO</span></li>
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Múltiples Categorías (+55, U12, etc.)</span></li>
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Control Médico y Antidopaje por Franquicia</span></li>
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Transmisión Multi-Cabina de Medios</span></li>
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Atención Técnica Prioritaria para Directiva</span></li>
                  </ul>
                </div>
                <button type="button" onclick="seleccionarPlanP2('ORGANIZATION')" style="width:100%; padding:10px; background:#F2F4F6; color:#182331; border:1px solid #E8EDF1; border-radius:8px; font-weight:800; font-size:11.5px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px; transition:all 0.2s;">
                  Seleccionar ORGANIZATION ($949.99)
                </button>
              </div>

              <!-- 6. ENTERPRISE -->
              <div id="p2-plan-card-ENTERPRISE" onclick="seleccionarPlanP2('ENTERPRISE')" style="background:#182331; border:1px solid #263445; border-radius:14px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; cursor:pointer; transition:all 0.2s; box-shadow:0 4px 16px rgba(24,35,49,0.12);" onmouseover="this.style.borderColor='#B18A53'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='#263445'; this.style.transform='translateY(0)';">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                      <div style="width:36px; height:36px; border-radius:8px; background:rgba(177,138,83,0.15); display:flex; align-items:center; justify-content:center; border:1px solid rgba(177,138,83,0.3);">
                        <svg width="22" height="22"><use href="#diamax-icon-tier-enterprise"/></svg>
                      </div>
                      <div>
                        <h4 style="margin:0; font-size:16px; font-weight:800; color:#FFFFFF;">ENTERPRISE</h4>
                        <span style="font-size:11px; color:#B18A53; font-weight:700;">Federaciones y Circuitos</span>
                      </div>
                    </div>
                    <span style="background:rgba(177,138,83,0.25); color:#E5C07B; border:1px solid rgba(177,138,83,0.5); font-size:10px; font-weight:800; padding:3px 8px; border-radius:6px;">30+ EQUIPOS</span>
                  </div>
                  <div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid #263445;">
                    <div style="display:flex; align-items:baseline; gap:4px;">
                      <span style="font-size:26px; font-weight:900; color:#FFFFFF; letter-spacing:-0.5px;">A Medida / SLA</span>
                    </div>
                    <div style="font-size:11px; color:#E5C07B; font-weight:700; margin-top:2px;">Servidor Dedicado e Integración API</div>
                  </div>
                  <ul style="list-style:none; padding:0; margin:0 0 16px 0; font-size:11.5px; color:#CBD5E1; display:flex; flex-direction:column; gap:7px;">
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Todo lo de ORGANIZATION</span></li>
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Circuitos Nacionales e Internacionales</span></li>
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Servidor Dedicado e Integración API Directa</span></li>
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Capacitación Oficial para Anotadores</span></li>
                    <li style="display:flex; align-items:flex-start; gap:6px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Ingeniero de Soporte 24/7 y SLA Corporativo</span></li>
                  </ul>
                </div>
                <button type="button" onclick="seleccionarPlanP2('ENTERPRISE')" style="width:100%; padding:10px; background:#B18A53; color:#FFFFFF; border:none; border-radius:8px; font-weight:800; font-size:11.5px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px; transition:all 0.2s;">
                  Solicitar ENTERPRISE
                </button>
              </div>

            </div>\r\n\r\n            `;

  content = content.replace(oldP2Block, newP2Block);
  console.log('✓ diamax-page-2 actualizado a los 6 planes oficiales unificados.');
} else {
  console.error('No se pudo ubicar el bloque de planes en diamax-page-2');
}

// 2. Actualizar función seleccionarPlanP2 para soportar los 6 planes oficiales
const oldSeleccionarP2Function = `function seleccionarPlanP2(plan) {
  planSeleccionadoP2 = plan;
  const inputPlan = document.getElementById('p2-selected-plan');
  if (inputPlan) inputPlan.value = plan;

  const cardTrial = document.getElementById('p2-plan-card-TRIAL');
  const cardMedia = document.getElementById('p2-plan-card-MEDIA');
  const cardMgr = document.getElementById('p2-plan-card-MANAGER');
  const cardLiga = document.getElementById('p2-plan-card-LIGA');`;

const newSeleccionarP2Function = `function seleccionarPlanP2(plan) {
  planSeleccionadoP2 = plan;
  const inputPlan = document.getElementById('p2-selected-plan');
  if (inputPlan) inputPlan.value = plan;

  const allCards = ['TEAM', 'CLUB', 'ACADEMY', 'LEAGUE', 'ORGANIZATION', 'ENTERPRISE'];
  allCards.forEach(c => {
    const el = document.getElementById('p2-plan-card-' + c);
    if (el) {
      if (c === plan) {
        el.style.borderColor = '#B18A53';
        el.style.boxShadow = '0 0 16px rgba(177, 138, 83, 0.4)';
        el.style.transform = 'translateY(-3px)';
      } else {
        el.style.borderColor = c === 'ENTERPRISE' ? '#263445' : '#E8EDF1';
        el.style.boxShadow = '0 2px 8px rgba(24,35,49,0.04)';
        el.style.transform = 'translateY(0)';
      }
    }
  });`;

if (content.includes(oldSeleccionarP2Function)) {
  content = content.replace(oldSeleccionarP2Function, newSeleccionarP2Function);
  console.log('✓ seleccionarPlanP2 actualizado para soportar los 6 planes oficiales (LF).');
} else {
  // Try CRLF
  const oldCRLF = oldSeleccionarP2Function.replaceAll('\n', '\r\n');
  const newCRLF = newSeleccionarP2Function.replaceAll('\n', '\r\n');
  if (content.includes(oldCRLF)) {
    content = content.replace(oldCRLF, newCRLF);
    console.log('✓ seleccionarPlanP2 actualizado para soportar los 6 planes oficiales (CRLF).');
  } else {
    console.warn('⚠ oldSeleccionarP2Function no coincidió.');
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ Archivo index.html guardado exitosamente.');
