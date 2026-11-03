import fs from 'fs';
import path from 'path';

const basePath = 'C:\\Users\\fitne\\Documents\\3Tree_Codebase\\DIAMAX';
const filePath = path.join(basePath, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

console.log('=== AUDITORÍA Y REDISEÑO DE LOS 6 PLANES OFICIALES ===');

// 1. Definir los 6 símbolos SVG oficiales de la familia DIAMAX PRO
const svgIconsBlock = `    <!-- ⚾ FAMILIA OFICIAL DE 6 ICONOS VECTORIALES DE SUSCRIPCIÓN DIAMAX PRO -->
    <!-- 1. TEAM (1 Equipo / Diamante de Precisión) -->
    <symbol id="diamax-icon-tier-team" viewBox="0 0 24 24">
      <path d="M12 2L3 11l9 9 9-9-9-9z" fill="none" stroke="#B18A53" stroke-width="1.9" stroke-linejoin="round"/>
      <circle cx="12" cy="11" r="2.8" fill="#182331" stroke="#B18A53" stroke-width="1.5"/>
    </symbol>

    <!-- 2. CLUB (Hasta 5 Equipos / Cluster de Diamantes Conectados) -->
    <symbol id="diamax-icon-tier-club" viewBox="0 0 24 24">
      <path d="M12 2L4 9l8 7 8-7-8-7z" fill="none" stroke="#B18A53" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M7 14l5 4.5 5-4.5" fill="none" stroke="#263445" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M5 17.5l7 4.5 7-4.5" fill="none" stroke="#B18A53" stroke-width="1.8" stroke-linecap="round"/>
    </symbol>

    <!-- 3. ACADEMY (Hasta 10 Equipos / Radar de Desarrollo y Prospección) -->
    <symbol id="diamax-icon-tier-academy" viewBox="0 0 24 24">
      <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill="none" stroke="#B18A53" stroke-width="1.9" stroke-linejoin="round"/>
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="#263445" stroke-width="1.6"/>
      <line x1="12" y1="8" x2="12" y2="16" stroke="#B18A53" stroke-width="1.6" stroke-linecap="round"/>
      <line x1="8" y1="12" x2="16" y2="12" stroke="#B18A53" stroke-width="1.6" stroke-linecap="round"/>
    </symbol>

    <!-- 4. LEAGUE PRO (Hasta 20 Equipos / Escudo Oficial de Circuito) -->
    <symbol id="diamax-icon-tier-league" viewBox="0 0 24 24">
      <path d="M12 2L4 5.5v6c0 5 3.5 9.5 8 10.5 4.5-1 8-5.5 8-10.5v-6L12 2z" fill="none" stroke="#B18A53" stroke-width="1.9" stroke-linejoin="round"/>
      <path d="M8.5 12l2.5 2.5 5-5" fill="none" stroke="#182331" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </symbol>

    <!-- 5. ORGANIZATION (Hasta 30 Equipos / Corporación Multidivisión) -->
    <symbol id="diamax-icon-tier-organization" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1.5" fill="none" stroke="#B18A53" stroke-width="1.8"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5" fill="none" stroke="#263445" stroke-width="1.8"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5" fill="none" stroke="#263445" stroke-width="1.8"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5" fill="none" stroke="#B18A53" stroke-width="1.8"/>
      <line x1="10" y1="6.5" x2="14" y2="6.5" stroke="#B18A53" stroke-width="1.5"/>
      <line x1="6.5" y1="10" x2="6.5" y2="14" stroke="#B18A53" stroke-width="1.5"/>
      <line x1="17.5" y1="10" x2="17.5" y2="14" stroke="#B18A53" stroke-width="1.5"/>
      <line x1="10" y1="17.5" x2="14" y2="17.5" stroke="#B18A53" stroke-width="1.5"/>
    </symbol>

    <!-- 6. ENTERPRISE (30+ Equipos / Ecosistema Federativo SLA) -->
    <symbol id="diamax-icon-tier-enterprise" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="none" stroke="#B18A53" stroke-width="1.8" stroke-linejoin="round"/>
      <circle cx="12" cy="12" r="3" fill="#182331" stroke="#B18A53" stroke-width="1.5"/>
    </symbol>`;

// Reemplazar o insertar los símbolos de tiers
const oldTiersSearch = `    <!-- 💎 16. TIERS OFICIALES SKEUOMORPHIC (TEAM, CLUB, LEAGUE, ENTERPRISE) -->`;
if (content.includes(oldTiersSearch)) {
  const endOfDefs = content.indexOf('</defs>', content.indexOf(oldTiersSearch));
  if (endOfDefs !== -1) {
    const toReplace = content.slice(content.indexOf(oldTiersSearch), endOfDefs);
    content = content.replace(toReplace, svgIconsBlock + '\n  ');
    console.log('✓ Familia oficial de 6 iconos SVG integrada con éxito.');
  }
}

// 2. Construir el Markup Unificado Oficial de los 6 Planes
const buildSixPlansCardsHTML = (containerId = 'pricing-catalog-grid') => `
        <div id="${containerId}" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(290px, 1fr)); gap:20px; margin-bottom:24px;">

          <!-- PLAN 1: DIAMAX TEAM ($39.99 / temp.) -->
          <div class="diamax-plan-card" onclick="seleccionarPlanSuscripcion('TEAM')" style="background:#FFFFFF; border:1px solid #E8EDF1; border-radius:14px; padding:22px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 2px 8px rgba(24,35,49,0.04); transition:all 0.2s; cursor:pointer;" onmouseover="this.style.borderColor='#B18A53'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='#E8EDF1'; this.style.transform='translateY(0)';">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <div style="width:36px; height:36px; border-radius:8px; background:#F2F4F6; display:flex; align-items:center; justify-content:center; border:1px solid #E8EDF1;">
                    <svg width="22" height="22"><use href="#diamax-icon-tier-team"/></svg>
                  </div>
                  <div>
                    <h4 style="margin:0; font-size:16px; font-weight:800; color:#182331;">DIAMAX TEAM</h4>
                    <span style="font-size:11px; color:#64748B;">Mánager Individual</span>
                  </div>
                </div>
                <span style="background:#F2F4F6; color:#182331; border:1px solid #E8EDF1; font-size:10px; font-weight:800; padding:3px 8px; border-radius:6px; letter-spacing:0.5px;">1 EQUIPO</span>
              </div>

              <div style="margin-bottom:14px; padding-bottom:14px; border-bottom:1px solid #E8EDF1;">
                <div style="display:flex; align-items:baseline; gap:4px;">
                  <span style="font-size:32px; font-weight:900; color:#182331; font-variant-numeric:tabular-nums;">$39.99</span>
                  <span style="font-size:12px; color:#64748B; font-weight:600;">/ temporada</span>
                </div>
                <div style="font-size:11.5px; color:#B18A53; font-weight:700; margin-top:2px;">1 franquicia · Acceso dugout completo</div>
              </div>

              <ul style="list-style:none; padding:0; margin:0 0 18px 0; font-size:12px; color:#263445; display:flex; flex-direction:column; gap:8px;">
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Anotador Dugout en Vivo (36 Jugadas Canónicas)</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Optimizador Monte Carlo (10,000 Simulaciones xRuns)</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Campo 2D + Spray Chart & Zonas de Bateo</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Manual Oficial WBSC con 10 Módulos de Operación</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Exportar Tarjeta Oficial y Boxscore (PDF/WhatsApp)</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>PWA Offline Ready (100% Funcional en Dugout)</span></li>
              </ul>
            </div>

            <button onclick="seleccionarPlanSuscripcion('TEAM')" style="width:100%; padding:11px; background:#F2F4F6; color:#182331; border:1px solid #E8EDF1; border-radius:8px; font-weight:800; font-size:12px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px; transition:all 0.2s;" onmouseover="this.style.background='#182331'; this.style.color='#FFFFFF';" onmouseout="this.style.background='#F2F4F6'; this.style.color='#182331';">
              Elegir Plan TEAM ($39.99)
            </button>
          </div>

          <!-- PLAN 2: DIAMAX CLUB ($179.99 / temp.) -->
          <div class="diamax-plan-card" onclick="seleccionarPlanSuscripcion('CLUB')" style="background:#FFFFFF; border:1px solid #E8EDF1; border-radius:14px; padding:22px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 2px 8px rgba(24,35,49,0.04); transition:all 0.2s; cursor:pointer;" onmouseover="this.style.borderColor='#B18A53'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='#E8EDF1'; this.style.transform='translateY(0)';">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <div style="width:36px; height:36px; border-radius:8px; background:#F2F4F6; display:flex; align-items:center; justify-content:center; border:1px solid #E8EDF1;">
                    <svg width="22" height="22"><use href="#diamax-icon-tier-club"/></svg>
                  </div>
                  <div>
                    <h4 style="margin:0; font-size:16px; font-weight:800; color:#182331;">DIAMAX CLUB</h4>
                    <span style="font-size:11px; color:#64748B;">Clubes y Escuelas</span>
                  </div>
                </div>
                <span style="background:#F2F4F6; color:#182331; border:1px solid #E8EDF1; font-size:10px; font-weight:800; padding:3px 8px; border-radius:6px; letter-spacing:0.5px;">5 EQUIPOS</span>
              </div>

              <div style="margin-bottom:14px; padding-bottom:14px; border-bottom:1px solid #E8EDF1;">
                <div style="display:flex; align-items:baseline; gap:4px;">
                  <span style="font-size:32px; font-weight:900; color:#182331; font-variant-numeric:tabular-nums;">$179.99</span>
                  <span style="font-size:12px; color:#64748B; font-weight:600;">/ temporada</span>
                </div>
                <div style="font-size:11.5px; color:#B18A53; font-weight:700; margin-top:2px;">Hasta 5 franquicias asociadas</div>
              </div>

              <ul style="list-style:none; padding:0; margin:0 0 18px 0; font-size:12px; color:#263445; display:flex; flex-direction:column; gap:8px;">
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Todo lo incluido en Plan TEAM</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Panel Multi-Equipo para Mánager General</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Comparativa de Rendimiento y Roster Colectivo</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Control Centralizado de Categorías Menores</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Exportación Consolidada de Temporada</span></li>
              </ul>
            </div>

            <button onclick="seleccionarPlanSuscripcion('CLUB')" style="width:100%; padding:11px; background:#F2F4F6; color:#182331; border:1px solid #E8EDF1; border-radius:8px; font-weight:800; font-size:12px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px; transition:all 0.2s;" onmouseover="this.style.background='#182331'; this.style.color='#FFFFFF';" onmouseout="this.style.background='#F2F4F6'; this.style.color='#182331';">
              Elegir Plan CLUB ($179.99)
            </button>
          </div>

          <!-- PLAN 3: DIAMAX ACADEMY ($349.99 / temp.) -->
          <div class="diamax-plan-card" onclick="seleccionarPlanSuscripcion('ACADEMY')" style="background:#FFFFFF; border:1px solid #E8EDF1; border-radius:14px; padding:22px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 2px 8px rgba(24,35,49,0.04); transition:all 0.2s; cursor:pointer;" onmouseover="this.style.borderColor='#B18A53'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='#E8EDF1'; this.style.transform='translateY(0)';">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <div style="width:36px; height:36px; border-radius:8px; background:#F2F4F6; display:flex; align-items:center; justify-content:center; border:1px solid #E8EDF1;">
                    <svg width="22" height="22"><use href="#diamax-icon-tier-academy"/></svg>
                  </div>
                  <div>
                    <h4 style="margin:0; font-size:16px; font-weight:800; color:#182331;">DIAMAX ACADEMY</h4>
                    <span style="font-size:11px; color:#64748B;">Desarrollo y Prospectos</span>
                  </div>
                </div>
                <span style="background:#F2F4F6; color:#182331; border:1px solid #E8EDF1; font-size:10px; font-weight:800; padding:3px 8px; border-radius:6px; letter-spacing:0.5px;">10 EQUIPOS</span>
              </div>

              <div style="margin-bottom:14px; padding-bottom:14px; border-bottom:1px solid #E8EDF1;">
                <div style="display:flex; align-items:baseline; gap:4px;">
                  <span style="font-size:32px; font-weight:900; color:#182331; font-variant-numeric:tabular-nums;">$349.99</span>
                  <span style="font-size:12px; color:#64748B; font-weight:600;">/ temporada</span>
                </div>
                <div style="font-size:11.5px; color:#B18A53; font-weight:700; margin-top:2px;">Hasta 10 equipos · Monitoreo técnico</div>
              </div>

              <ul style="list-style:none; padding:0; margin:0 0 18px 0; font-size:12px; color:#263445; display:flex; flex-direction:column; gap:8px;">
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Todo lo de CLUB</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Módulo de Habilidades Técnicas y Biomecánica</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Radar de Defensores y Bateadores Avanzado</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Reporte de Scouting para Firmas y Becas</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Soporte Prioritario para Entrenadores</span></li>
              </ul>
            </div>

            <button onclick="seleccionarPlanSuscripcion('ACADEMY')" style="width:100%; padding:11px; background:#F2F4F6; color:#182331; border:1px solid #E8EDF1; border-radius:8px; font-weight:800; font-size:12px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px; transition:all 0.2s;" onmouseover="this.style.background='#182331'; this.style.color='#FFFFFF';" onmouseout="this.style.background='#F2F4F6'; this.style.color='#182331';">
              Elegir Plan ACADEMY ($349.99)
            </button>
          </div>

          <!-- PLAN 4: LEAGUE PRO ($649.99 / temp.) -->
          <div class="diamax-plan-card" onclick="seleccionarPlanSuscripcion('LEAGUE')" style="background:#FFFFFF; border:1.5px solid #B18A53; border-radius:14px; padding:22px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 4px 14px rgba(177,138,83,0.12); transition:all 0.2s; cursor:pointer;" onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='translateY(0)';">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <div style="width:36px; height:36px; border-radius:8px; background:rgba(177,138,83,0.12); display:flex; align-items:center; justify-content:center; border:1px solid rgba(177,138,83,0.3);">
                    <svg width="22" height="22"><use href="#diamax-icon-tier-league"/></svg>
                  </div>
                  <div>
                    <h4 style="margin:0; font-size:16px; font-weight:800; color:#182331;">LEAGUE PRO</h4>
                    <span style="font-size:11px; color:#B18A53; font-weight:700;">Circuito Oficial</span>
                  </div>
                </div>
                <span style="background:#B18A53; color:#FFFFFF; font-size:10px; font-weight:800; padding:3px 8px; border-radius:6px; letter-spacing:0.5px;">20 EQUIPOS</span>
              </div>

              <div style="margin-bottom:14px; padding-bottom:14px; border-bottom:1px solid #E8EDF1;">
                <div style="display:flex; align-items:baseline; gap:4px;">
                  <span style="font-size:32px; font-weight:900; color:#182331; font-variant-numeric:tabular-nums;">$649.99</span>
                  <span style="font-size:12px; color:#64748B; font-weight:600;">/ temporada</span>
                </div>
                <div style="font-size:11.5px; color:#B18A53; font-weight:700; margin-top:2px;">Hasta 20 equipos · Gestión de Liga</div>
              </div>

              <ul style="list-style:none; padding:0; margin:0 0 18px 0; font-size:12px; color:#263445; display:flex; flex-direction:column; gap:8px;">
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Todo lo de ACADEMY</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Administrador de Calendario de Torneo</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Lideratos Oficiales WBSC en Tiempo Real</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Módulo de Asignación de Árbitros y Anotadores</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Sincronización Cloud Firebase Multidispositivo</span></li>
              </ul>
            </div>

            <button onclick="seleccionarPlanSuscripcion('LEAGUE')" style="width:100%; padding:11px; background:#B18A53; color:#FFFFFF; border:none; border-radius:8px; font-weight:800; font-size:12px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px; transition:all 0.2s;" onmouseover="this.style.background='#96723e';" onmouseout="this.style.background='#B18A53';">
              Elegir LEAGUE PRO ($649.99)
            </button>
          </div>

          <!-- PLAN 5: DIAMAX ORGANIZATION ($949.99 / temp.) -->
          <div class="diamax-plan-card" onclick="seleccionarPlanSuscripcion('ORGANIZATION')" style="background:#FFFFFF; border:1px solid #E8EDF1; border-radius:14px; padding:22px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 2px 8px rgba(24,35,49,0.04); transition:all 0.2s; cursor:pointer;" onmouseover="this.style.borderColor='#B18A53'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='#E8EDF1'; this.style.transform='translateY(0)';">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <div style="width:36px; height:36px; border-radius:8px; background:#F2F4F6; display:flex; align-items:center; justify-content:center; border:1px solid #E8EDF1;">
                    <svg width="22" height="22"><use href="#diamax-icon-tier-organization"/></svg>
                  </div>
                  <div>
                    <h4 style="margin:0; font-size:16px; font-weight:800; color:#182331;">ORGANIZATION</h4>
                    <span style="font-size:11px; color:#64748B;">Multi-División Estatal</span>
                  </div>
                </div>
                <span style="background:#F2F4F6; color:#182331; border:1px solid #E8EDF1; font-size:10px; font-weight:800; padding:3px 8px; border-radius:6px; letter-spacing:0.5px;">30 EQUIPOS</span>
              </div>

              <div style="margin-bottom:14px; padding-bottom:14px; border-bottom:1px solid #E8EDF1;">
                <div style="display:flex; align-items:baseline; gap:4px;">
                  <span style="font-size:32px; font-weight:900; color:#182331; font-variant-numeric:tabular-nums;">$949.99</span>
                  <span style="font-size:12px; color:#64748B; font-weight:600;">/ temporada</span>
                </div>
                <div style="font-size:11.5px; color:#B18A53; font-weight:700; margin-top:2px;">Hasta 30 equipos · Múltiples sedes</div>
              </div>

              <ul style="list-style:none; padding:0; margin:0 0 18px 0; font-size:12px; color:#263445; display:flex; flex-direction:column; gap:8px;">
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Todo lo de LEAGUE PRO</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Múltiples Categorías Simultáneas (+55, U12, etc.)</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Control Médico y Antidopaje por Franquicia</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Integración y Transmisión Multi-Cabina de Medios</span></li>
                <li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:#B18A53; font-weight:900;">✓</span> <span>Atención Técnica Prioritaria para Directiva</span></li>
              </ul>
            </div>

            <button onclick="seleccionarPlanSuscripcion('ORGANIZATION')" style="width:100%; padding:11px; background:#F2F4F6; color:#182331; border:1px solid #E8EDF1; border-radius:8px; font-weight:800; font-size:12px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px; transition:all 0.2s;" onmouseover="this.style.background='#182331'; this.style.color='#FFFFFF';" onmouseout="this.style.background='#F2F4F6'; this.style.color='#182331';">
              Elegir ORGANIZATION ($949.99)
            </button>
          </div>

          <!-- PLAN 6: ENTERPRISE (A Medida / SLA) -->
          <div class="diamax-plan-card" onclick="seleccionarPlanSuscripcion('ENTERPRISE')" style="background:#182331; border:1px solid #263445; border-radius:14px; padding:22px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 4px 16px rgba(24,35,49,0.12); transition:all 0.2s; cursor:pointer;" onmouseover="this.style.borderColor='#B18A53'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='#263445'; this.style.transform='translateY(0)';">
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

              <div style="margin-bottom:14px; padding-bottom:14px; border-bottom:1px solid #263445;">
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

            <button onclick="seleccionarPlanSuscripcion('ENTERPRISE')" style="width:100%; padding:11px; background:#B18A53; color:#FFFFFF; border:none; border-radius:8px; font-weight:800; font-size:12px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px; transition:all 0.2s;" onmouseover="this.style.background='#96723e';" onmouseout="this.style.background='#B18A53';">
              Solicitar ENTERPRISE
            </button>
          </div>

        </div>`;

// 3. Reemplazar el contenedor de planes en auth-modal-overlay
const startCardsSearch = `          <!-- PLAN 1: DIAMAX TEAM ($39.99) -->`;
const endCardsSearch = `        <!-- Footer Bar del Submenú de Planes -->`;

const startIdx = content.indexOf(startCardsSearch);
const endIdx = content.indexOf(endCardsSearch, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  const cardsBlockToReplace = content.slice(startIdx, endIdx);
  content = content.replace(cardsBlockToReplace, buildSixPlansCardsHTML('auth-six-plans-grid') + '\n        ');
  console.log('✓ Las 6 tarjetas de planes en auth-modal-overlay rediseñadas con éxito.');
} else {
  console.warn('⚠ No se encontró el bloque exacto de tarjetas en auth-modal-overlay');
}

// 4. Actualizar diamax-page-2 para mostrar los 6 planes unificados con la misma identidad oficial
const p2StartSearch = `<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:18px; margin-bottom:28px;">`;
const p2EndSearch = `</div>\r\n\r\n            <!-- FOOTER DE ASISTENCIA Y CONTACTO -->`;
const p2EndSearchLF = `</div>\n\n            <!-- FOOTER DE ASISTENCIA Y CONTACTO -->`;

let p2Start = content.indexOf(p2StartSearch);
let p2End = content.indexOf('<!-- FOOTER DE ASISTENCIA Y CONTACTO -->', p2Start);

if (p2Start !== -1 && p2End !== -1) {
  // Encontrar el cierre del div antes del footer
  const lastDivBeforeFooter = content.lastIndexOf('</div>', p2End);
  const p2CardsBlock = content.slice(p2Start, lastDivBeforeFooter + 6);
  content = content.replace(p2CardsBlock, buildSixPlansCardsHTML('page2-six-plans-grid'));
  console.log('✓ Las 6 tarjetas en diamax-page-2 unificadas con la misma identidad oficial.');
} else {
  console.warn('⚠ Bloque p2CardsBlock no coincidió.');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ index.html actualizado con los 6 planes rediseñados.');
