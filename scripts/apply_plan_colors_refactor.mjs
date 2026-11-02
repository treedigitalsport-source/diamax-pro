import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.resolve(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

console.log('Original length:', content.length);

// 1. Refactor CSS styles around lines 7380-7410
const cssTarget = `  /* Plan Mes Gratis: Resaltado Ice Cyan del Logo (#18D8FF) */
  #p2-plan-card-TRIAL {
    border: 1.5px solid rgba(24, 216, 255, 0.5) !important;
    box-shadow: 0 4px 20px rgba(24, 216, 255, 0.15) !important;
  }

  /* Plan Mánager Pro: Resaltado Gold del Logo (#FFB300) */
  #p2-plan-card-MANAGER {
    border: 1.5px solid rgba(255, 179, 0, 0.5) !important;
    box-shadow: 0 4px 20px rgba(255, 179, 0, 0.15) !important;
  }

  /* Plan Comentarista & Media: Resaltado Broadcast Cyan (#00D2FF) */
  #p2-plan-card-MEDIA {
    border: 1.5px solid rgba(0, 210, 255, 0.4) !important;
    box-shadow: 0 4px 20px rgba(0, 210, 255, 0.12) !important;
  }

  /* Banner de Registro QR con Squircle 14px y Vidrio */
  #p2-plans-header-banner {
    background: rgba(18, 22, 34, 0.65) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(48, 209, 88, 0.4) !important;
    border-radius: 14px !important;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4) !important;
  }`;

const cssReplacement = `  /* ARQUITECTURA VISUAL DE PLANES APPLE HIG (SISTEMA DE 2 COLORES: ELECTRIC BLUE #007AFF + CHAMPAGNE GOLD #FFB300) */
  #p2-plan-card-TRIAL {
    border: 2px solid #007AFF !important;
    box-shadow: 0 4px 24px rgba(0, 122, 255, 0.25) !important;
  }

  #p2-plan-card-MEDIA {
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    box-shadow: none !important;
  }

  #p2-plan-card-MANAGER {
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    box-shadow: none !important;
  }

  #p2-plan-card-LIGA {
    border: 1.5px solid rgba(255, 179, 0, 0.4) !important;
    box-shadow: 0 4px 20px rgba(255, 179, 0, 0.15) !important;
  }

  /* Banner de Registro QR con Squircle 14px y Vidrio Apple Blue */
  #p2-plans-header-banner {
    background: rgba(10, 18, 36, 0.75) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(0, 122, 255, 0.4) !important;
    border-radius: 14px !important;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.45) !important;
  }`;

// Helper to normalize CRLF
const replaceNormalized = (haystack, target, replacement) => {
  const normHaystack = haystack.replace(/\r\n/g, '\n');
  const normTarget = target.replace(/\r\n/g, '\n');
  const normReplacement = replacement.replace(/\r\n/g, '\n');
  if (!normHaystack.includes(normTarget)) {
    throw new Error('Target string not found in haystack!');
  }
  const result = normHaystack.replace(normTarget, normReplacement);
  return haystack.includes('\r\n') ? result.replace(/\n/g, '\r\n') : result;
};

content = replaceNormalized(content, cssTarget, cssReplacement);
console.log('✓ CSS de planes actualizado con éxito a 2 colores.');

// 2. Refactor JavaScript selection logic in seleccionarPlanP2 & validarYAvanzarPaso3
const jsTarget = `  if (cardTrial) {
    cardTrial.style.border = (plan === 'TRIAL_MES_GRATIS') ? '2.5px solid #00D2FF' : '1px solid rgba(255,255,255,0.12)';
    cardTrial.style.boxShadow = (plan === 'TRIAL_MES_GRATIS') ? '0 0 20px rgba(0,210,255,0.35)' : 'none';
  }
  if (cardMedia) {
    cardMedia.style.border = (plan === 'MEDIA_PRO') ? '2.5px solid #00D2FF' : '1.8px solid #00D2FF';
    cardMedia.style.boxShadow = (plan === 'MEDIA_PRO') ? '0 0 30px rgba(0,210,255,0.5)' : '0 0 15px rgba(0,210,255,0.2)';
  }
  if (cardMgr) {
    cardMgr.style.border = (plan === 'MANAGER_PRO') ? '2.5px solid #F26522' : '1px solid rgba(255,255,255,0.12)';
    cardMgr.style.boxShadow = (plan === 'MANAGER_PRO') ? '0 0 20px rgba(242,101,34,0.35)' : 'none';
  }
  if (cardLiga) {
    cardLiga.style.border = (plan === 'LIGA_ENTERPRISE') ? '2.5px solid #FFC72C' : '1px solid rgba(255,255,255,0.12)';
    cardLiga.style.boxShadow = (plan === 'LIGA_ENTERPRISE') ? '0 0 20px rgba(255,199,44,0.35)' : 'none';
  }`;

const jsReplacement = `  const defaultBorder = '1px solid rgba(255,255,255,0.12)';
  const activeBlueBorder = '2px solid #007AFF';
  const activeBlueShadow = '0 0 24px rgba(0,122,255,0.35)';
  const activeGoldBorder = '2px solid #FFB300';
  const activeGoldShadow = '0 0 24px rgba(255,179,0,0.35)';

  if (cardTrial) {
    cardTrial.style.border = (plan === 'TRIAL_MES_GRATIS') ? activeBlueBorder : defaultBorder;
    cardTrial.style.boxShadow = (plan === 'TRIAL_MES_GRATIS') ? activeBlueShadow : 'none';
  }
  if (cardMedia) {
    cardMedia.style.border = (plan === 'MEDIA_PRO') ? activeBlueBorder : defaultBorder;
    cardMedia.style.boxShadow = (plan === 'MEDIA_PRO') ? activeBlueShadow : 'none';
  }
  if (cardMgr) {
    cardMgr.style.border = (plan === 'MANAGER_PRO') ? activeBlueBorder : defaultBorder;
    cardMgr.style.boxShadow = (plan === 'MANAGER_PRO') ? activeBlueShadow : 'none';
  }
  if (cardLiga) {
    cardLiga.style.border = (plan === 'LIGA_ENTERPRISE') ? activeGoldBorder : defaultBorder;
    cardLiga.style.boxShadow = (plan === 'LIGA_ENTERPRISE') ? activeGoldShadow : 'none';
  }`;

content = replaceNormalized(content, jsTarget, jsReplacement);
console.log('✓ JS seleccionarPlanP2 actualizado.');

// 3. Refactor badge in validarYAvanzarPaso3
const badgeTarget = `    if (planSeleccionadoP2 === 'TRIAL_MES_GRATIS') {
      badgeEl.innerText = 'PLAN: MES GRATIS ($0.00 / 30 DÍAS)';
      badgeEl.style.background = '#00D2FF';
      badgeEl.style.color = '#020617';
    } else if (planSeleccionadoP2 === 'MEDIA_PRO') {
      badgeEl.innerText = 'PLAN: COMENTARISTA & MEDIA ($14.99 / MES)';
      badgeEl.style.background = '#00D2FF';
      badgeEl.style.color = '#020617';
    } else if (planSeleccionadoP2 === 'MANAGER_PRO') {
      badgeEl.innerText = 'PLAN: MANAGER PRO ($9.99 / MES)';
      badgeEl.style.background = '#F26522';
      badgeEl.style.color = '#FFF';
    } else {
      badgeEl.innerText = 'PLAN: LIGA MÁSTER ($29.99 / MES)';
      badgeEl.style.background = '#FFC72C';
      badgeEl.style.color = '#020617';
    }`;

const badgeReplacement = `    if (planSeleccionadoP2 === 'TRIAL_MES_GRATIS') {
      badgeEl.innerText = 'PLAN: MES GRATIS ($0.00 / 30 DÍAS)';
      badgeEl.style.background = '#007AFF';
      badgeEl.style.color = '#FFFFFF';
    } else if (planSeleccionadoP2 === 'MEDIA_PRO') {
      badgeEl.innerText = 'PLAN: COMENTARISTA & MEDIA ($14.99 / MES)';
      badgeEl.style.background = '#007AFF';
      badgeEl.style.color = '#FFFFFF';
    } else if (planSeleccionadoP2 === 'MANAGER_PRO') {
      badgeEl.innerText = 'PLAN: MANAGER PRO ($9.99 / MES)';
      badgeEl.style.background = '#007AFF';
      badgeEl.style.color = '#FFFFFF';
    } else {
      badgeEl.innerText = 'PLAN: LIGA MÁSTER ($29.99 / MES)';
      badgeEl.style.background = '#FFB300';
      badgeEl.style.color = '#020617';
    }`;

content = replaceNormalized(content, badgeTarget, badgeReplacement);
console.log('✓ JS validarYAvanzarPaso3 badge actualizado.');

// 4. Refactor Banner in Step 2 HTML (lines 8546-8603)
const bannerTarget = `<div id="p2-plans-header-banner" style="background:linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(6,78,59,0.3) 100%); border:2px solid #10B981; border-radius:18px; padding:20px 22px; margin-bottom:22px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:18px; box-shadow:0 10px 30px rgba(16,185,129,0.25);">
              <div style="flex:1; min-width:260px;">
                <div style="display:inline-flex; align-items:center; gap:6px; background:#10B981; color:#020617; padding:4px 12px; border-radius:20px; font-weight:900; font-size:10.5px; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:10px;">
                   <span>REGISTRO CON CÓDIGO QR · PRUEBA GRATIS</span>
                </div>
                <h4 style="margin:0 0 8px 0; font-size:17px; font-weight:900; color:#FFFFFF; letter-spacing:0.5px;">
                  ¿Quieres tu Credencial QR Personalizada para Probar la App?
                </h4>
                <p style="margin:0 0 14px 0; font-size:12.5px; color:#CBD5E1; line-height:1.5;">
                  Escanea el código con tu celular o pulsa el botón para registrarte en 30 segundos. Al completar tus datos, <strong>el sistema generará tu propio Pase QR Criptográfico de Seguridad</strong> con el que podrás entrar a DIAMAX PRO desde cualquier teléfono, tablet o computadora sin contraseñas.
                </p>
                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                  <button type="button" onclick="irAPasoWizardP2(1)" style="padding:11px 20px; background:linear-gradient(135deg, #10B981, #059669); color:#020617; border:none; border-radius:10px; font-weight:900; font-size:12.5px; cursor:pointer; text-transform:uppercase; letter-spacing:0.6px; display:inline-flex; align-items:center; gap:8px; box-shadow:0 0 20px rgba(16,185,129,0.45);">
                     <span>Registrarme y Generar Mi Pase QR</span>
                  </button>
                  <button type="button" onclick="showAuthModal('login')" style="padding:11px 18px; background:#0F172A; border:1.5px solid #10B981; color:#A7F3D0; border-radius:10px; font-weight:800; font-size:12px; cursor:pointer; display:inline-flex; align-items:center; gap:8px;">
                     <span>Ya tengo mi QR: Entrar Aquí</span>
                  </button>
                </div>
              </div>

              <!-- Tarjeta QR Visual Escaneable -->
              <div style="background:#FFFFFF; border:3px solid #020617; border-radius:16px; padding:12px; text-align:center; box-shadow:0 10px 25px rgba(0,0,0,0.7); flex-shrink:0;">
                <div style="font-size:10px; font-weight:900; color:#020617; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.5px;">ESCANEA PARA REGISTRO</div>
                <div id="p2-banner-qr-svg" style="display:flex; justify-content:center;">
                  <svg width="130" height="130" viewBox="0 0 100 100" style="border:1.5px solid #CBD5E1; border-radius:8px; padding:4px; background:#FFF;">
                    <rect x="0" y="0" width="100" height="100" fill="#FFF"/>
                    <rect x="6" y="6" width="24" height="24" fill="#020617"/>
                    <rect x="10" y="10" width="16" height="16" fill="#FFF"/>
                    <rect x="13" y="13" width="10" height="10" fill="#020617"/>
                    <rect x="70" y="6" width="24" height="24" fill="#020617"/>
                    <rect x="74" y="10" width="16" height="16" fill="#FFF"/>
                    <rect x="77" y="13" width="10" height="10" fill="#020617"/>
                    <rect x="6" y="70" width="24" height="24" fill="#020617"/>
                    <rect x="10" y="74" width="16" height="16" fill="#FFF"/>
                    <rect x="13" y="77" width="10" height="10" fill="#020617"/>
                    <rect x="36" y="10" width="6" height="6" fill="#020617"/>
                    <rect x="46" y="10" width="6" height="6" fill="#020617"/>
                    <rect x="56" y="10" width="6" height="6" fill="#020617"/>
                    <rect x="36" y="24" width="6" height="6" fill="#020617"/>
                    <rect x="56" y="24" width="6" height="6" fill="#020617"/>
                    <rect x="10" y="36" width="6" height="6" fill="#020617"/>
                    <rect x="24" y="46" width="6" height="6" fill="#020617"/>
                    <rect x="36" y="38" width="28" height="28" fill="#064E3B" rx="4"/>
                    <text x="50" y="56" font-size="11" font-weight="900" text-anchor="middle" fill="#A7F3D0">QR REG</text>
                    <rect x="74" y="36" width="6" height="6" fill="#020617"/>
                    <rect x="84" y="46" width="6" height="6" fill="#020617"/>
                    <rect x="36" y="74" width="6" height="6" fill="#020617"/>
                    <rect x="46" y="84" width="6" height="6" fill="#020617"/>
                    <rect x="56" y="74" width="6" height="6" fill="#020617"/>
                    <rect x="66" y="84" width="6" height="6" fill="#020617"/>
                    <rect x="76" y="74" width="6" height="6" fill="#020617"/>
                    <rect x="84" y="84" width="6" height="6" fill="#020617"/>
                  </svg>
                </div>
                <div style="font-size:9px; font-weight:800; color:#15803D; margin-top:6px; letter-spacing:0.5px;">PASE PRUEBA GRATIS 2026</div>
              </div>
            </div>`;

const bannerReplacement = `<div id="p2-plans-header-banner" style="background:linear-gradient(135deg, rgba(0,122,255,0.15) 0%, rgba(10,24,54,0.4) 100%); border:1.5px solid #007AFF; border-radius:18px; padding:20px 22px; margin-bottom:22px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:18px; box-shadow:0 10px 30px rgba(0,122,255,0.2);">
              <div style="flex:1; min-width:260px;">
                <div style="display:inline-flex; align-items:center; gap:6px; background:#007AFF; color:#FFFFFF; padding:4px 12px; border-radius:20px; font-weight:900; font-size:10.5px; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:10px;">
                   <span>REGISTRO CON CÓDIGO QR · PRUEBA GRATIS</span>
                </div>
                <h4 style="margin:0 0 8px 0; font-size:17px; font-weight:900; color:#FFFFFF; letter-spacing:0.5px;">
                  ¿Quieres tu Credencial QR Personalizada para Probar la App?
                </h4>
                <p style="margin:0 0 14px 0; font-size:12.5px; color:#CBD5E1; line-height:1.5;">
                  Escanea el código con tu celular o pulsa el botón para registrarte en 30 segundos. Al completar tus datos, <strong>el sistema generará tu propio Pase QR Criptográfico de Seguridad</strong> con el que podrás entrar a DIAMAX PRO desde cualquier teléfono, tablet o computadora sin contraseñas.
                </p>
                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                  <button type="button" onclick="irAPasoWizardP2(1)" style="padding:11px 20px; background:#007AFF; color:#FFFFFF; border:none; border-radius:10px; font-weight:900; font-size:12.5px; cursor:pointer; text-transform:uppercase; letter-spacing:0.6px; display:inline-flex; align-items:center; gap:8px; box-shadow:0 0 20px rgba(0,122,255,0.4);">
                     <span>Registrarme y Generar Mi Pase QR</span>
                  </button>
                  <button type="button" onclick="showAuthModal('login')" style="padding:11px 18px; background:#0F172A; border:1.5px solid #007AFF; color:#7DD3FC; border-radius:10px; font-weight:800; font-size:12px; cursor:pointer; display:inline-flex; align-items:center; gap:8px;">
                     <span>Ya tengo mi QR: Entrar Aquí</span>
                  </button>
                </div>
              </div>

              <!-- Tarjeta QR Visual Escaneable -->
              <div style="background:#FFFFFF; border:3px solid #020617; border-radius:16px; padding:12px; text-align:center; box-shadow:0 10px 25px rgba(0,0,0,0.7); flex-shrink:0;">
                <div style="font-size:10px; font-weight:900; color:#020617; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.5px;">ESCANEA PARA REGISTRO</div>
                <div id="p2-banner-qr-svg" style="display:flex; justify-content:center;">
                  <svg width="130" height="130" viewBox="0 0 100 100" style="border:1.5px solid #CBD5E1; border-radius:8px; padding:4px; background:#FFF;">
                    <rect x="0" y="0" width="100" height="100" fill="#FFF"/>
                    <rect x="6" y="6" width="24" height="24" fill="#020617"/>
                    <rect x="10" y="10" width="16" height="16" fill="#FFF"/>
                    <rect x="13" y="13" width="10" height="10" fill="#020617"/>
                    <rect x="70" y="6" width="24" height="24" fill="#020617"/>
                    <rect x="74" y="10" width="16" height="16" fill="#FFF"/>
                    <rect x="77" y="13" width="10" height="10" fill="#020617"/>
                    <rect x="6" y="70" width="24" height="24" fill="#020617"/>
                    <rect x="10" y="74" width="16" height="16" fill="#FFF"/>
                    <rect x="13" y="77" width="10" height="10" fill="#020617"/>
                    <rect x="36" y="10" width="6" height="6" fill="#020617"/>
                    <rect x="46" y="10" width="6" height="6" fill="#020617"/>
                    <rect x="56" y="10" width="6" height="6" fill="#020617"/>
                    <rect x="36" y="24" width="6" height="6" fill="#020617"/>
                    <rect x="56" y="24" width="6" height="6" fill="#020617"/>
                    <rect x="10" y="36" width="6" height="6" fill="#020617"/>
                    <rect x="24" y="46" width="6" height="6" fill="#020617"/>
                    <rect x="36" y="38" width="28" height="28" fill="#007AFF" rx="4"/>
                    <text x="50" y="56" font-size="11" font-weight="900" text-anchor="middle" fill="#FFFFFF">QR REG</text>
                    <rect x="74" y="36" width="6" height="6" fill="#020617"/>
                    <rect x="84" y="46" width="6" height="6" fill="#020617"/>
                    <rect x="36" y="74" width="6" height="6" fill="#020617"/>
                    <rect x="46" y="84" width="6" height="6" fill="#020617"/>
                    <rect x="56" y="74" width="6" height="6" fill="#020617"/>
                    <rect x="66" y="84" width="6" height="6" fill="#020617"/>
                    <rect x="76" y="74" width="6" height="6" fill="#020617"/>
                    <rect x="84" y="84" width="6" height="6" fill="#020617"/>
                  </svg>
                </div>
                <div style="font-size:9px; font-weight:800; color:#007AFF; margin-top:6px; letter-spacing:0.5px;">PASE PRUEBA GRATIS 2026</div>
              </div>
            </div>`;

content = replaceNormalized(content, bannerTarget, bannerReplacement);
console.log('✓ Banner QR actualizado a Electric Blue.');

// 5. Refactor Step 2 Plan Cards 1-4 (lines 8610-8736)
const cardsGridTarget = `              <!-- PLAN 1: MES GRATIS (RECOMENDADO / DESTACADO) -->
              <div id="p2-plan-card-TRIAL" onclick="seleccionarPlanP2('TRIAL_MES_GRATIS')" style="background:linear-gradient(165deg, rgba(14,32,64,0.95), rgba(6,14,32,0.98)); border:2.5px solid #18D8FF; border-radius:18px; padding:22px; cursor:pointer; position:relative; box-shadow:0 0 35px rgba(24,216,255,0.35), inset 0 1px 0 rgba(255,255,255,0.25); transform:translateY(-2px); transition:all 0.25s;">
                <div style="position:absolute; top:-12px; right:14px; background:linear-gradient(135deg, #18D8FF, #0077FF); color:#040814; font-weight:900; font-size:10px; padding:4px 10px; border-radius:12px; text-transform:uppercase; letter-spacing:0.8px; box-shadow:0 0 12px rgba(24,216,255,0.5);">
                  Recomendado
                </div>
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                  <div style="width:36px; height:36px; border-radius:10px; background:rgba(0,210,255,0.15); border:1px solid #00D2FF; display:flex; align-items:center; justify-content:center; box-shadow:0 0 14px rgba(0,210,255,0.35);">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00D2FF" stroke-width="2.2"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 8h10M7 12h6M7 16h8"/></svg>
                  </div>
                  <h4 style="margin:0; font-size:16px; font-weight:900; color:#FFF;">Mes Gratis</h4>
                </div>
                <p style="margin:0 0 12px 0; font-size:11.5px; color:#94A3B8; line-height:1.4;">Prueba piloto completa para torneos, campeonatos y temporadas activas.</p>
                <div style="margin-bottom:14px; padding-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.08);">
                  <span style="font-size:30px; font-weight:900; color:#18D8FF; letter-spacing:-0.5px;">$0.00</span>
                  <span style="font-size:11.5px; color:#94A3B8; font-weight:700;"> / 30 Días</span>
                </div>
                <ul style="list-style:none; padding:0; margin:0; font-size:11.5px; color:#E2E8F0; display:flex; flex-direction:column; gap:8px;">
                  <li><span style="color:#18C995; font-weight:900;">✓</span> Anotador Dugout en vivo oficial</li>
                  <li><span style="color:#18C995; font-weight:900;">✓</span> Sabermetría IA & Monte Carlo</li>
                  <li><span style="color:#18C995; font-weight:900;">✓</span> Roster completo hasta 30 atletas</li>
                  <li style="color:#FFB82E; font-weight:800;">Sin tarjeta de crédito requerida</li>
                </ul>
              </div>

              <!-- PLAN 2: MANAGER PRO -->
              <!-- PLAN COMENTARISTA & MEDIA -->
              <!-- PLAN 2: COMENTARISTA & BROADCAST MEDIA -->
              <div id="p2-plan-card-MEDIA" onclick="seleccionarPlanP2('MEDIA_PRO')" style="background:linear-gradient(165deg, rgba(0,210,255,0.12), rgba(6,14,32,0.95)); border:2px solid #00D2FF; border-radius:18px; padding:22px; cursor:pointer; transition:all 0.25s; box-shadow:0 0 30px rgba(0,210,255,0.25);">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                  <div style="display:flex; align-items:center; gap:10px;">
                    
                     
                    
                    <div>
                      <h4 style="margin:0; font-size:16px; font-weight:900; color:#00D2FF;">Plan Comentarista & Media</h4>
                      <span style="font-size:10px; color:#38BDF8; font-weight:800; text-transform:uppercase;">Cabina Digital TV & Radio</span>
                    </div>
                  </div>
                  <span style="background:rgba(239,68,68,0.2); border:1px solid #EF4444; color:#F87171; font-size:9.5px; font-weight:900; padding:2px 7px; border-radius:10px;">ON AIR</span>
                </div>
                
                <p style="margin:0 0 12px 0; font-size:11.5px; color:#94A3B8; line-height:1.4;">
                  La Cabina Digital Inteligente de Televisión y Radio con cero distracciones y lectura a 60 cm.
                </p>

                <div style="background:rgba(2,6,23,0.85); border:1px solid #1E293B; border-radius:12px; padding:10px 14px; margin-bottom:12px;">
                  <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4px;">
                    <span style="font-size:11px; color:#CBD5E1; font-weight:700;">• Plan Mensual:</span>
                    <strong style="font-size:16px; color:#00D2FF; font-variant-numeric:tabular-nums;">$14.99 <small style="font-size:10px; color:#94A3B8;">/ mes</small></strong>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4px;">
                    <span style="font-size:11px; color:#FFC72C; font-weight:800;">• Plan Anual (-28%):</span>
                    <strong style="font-size:16px; color:#FFC72C; font-variant-numeric:tabular-nums;">$129.00 <small style="font-size:10px; color:#94A3B8;">/ año</small></strong>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:baseline; font-size:10.5px; color:#94A3B8;">
                    <span>• Pase Torneo: $49 · Multi-Cabina:</span>
                    <span style="color:#38BDF8; font-weight:700;">$49.99/mes</span>
                  </div>
                </div>

                <div style="font-size:11px; font-weight:900; color:#FFF; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.5px;">¿Qué incluye?</div>
                <ul style="list-style:none; padding:0; margin:0; font-size:11px; color:#CBD5E1; display:flex; flex-direction:column; gap:6px;">
                  <li><span style="color:#00D2FF; font-weight:900;">✓</span> Entrada independiente (/cabina) sin permisos de anotador</li>
                  <li><span style="color:#00D2FF; font-weight:900;">✓</span> Pantalla única Todo-en-Uno (Cockpit) con cero distracciones</li>
                  <li><span style="color:#00D2FF; font-weight:900;">✓</span> Telemetría glanceable de alta visibilidad (a 60 cm del mic)</li>
                  <li><span style="color:#00D2FF; font-weight:900;">✓</span> Historial Frente a Frente (BvP) y divididos en vivo</li>
                  <li><span style="color:#00D2FF; font-weight:900;">✓</span> Semáforo médico (+55) con alerta de bullpen a 70 envíos</li>
                  <li><span style="color:#00D2FF; font-weight:900;">✓</span> Teleprompter con 3 píldoras por turno para hablar al aire</li>
                  <li><span style="color:#00D2FF; font-weight:900;">✓</span> Medidor de Probabilidad de Victoria (WPA Index)</li>
                  <li><span style="color:#00D2FF; font-weight:900;">✓</span> URL de Overlay transparente para OBS Studio y vMix</li>
                </ul>

                <!-- ACCESO GRATIS DIRECTO CON CLAVE DE PRENSA / LIGA -->
                <div style="margin-top:14px; padding-top:12px; border-top:1px dashed rgba(0,210,255,0.4);" onclick="event.stopPropagation();">
                  <div style="font-size:11px; font-weight:800; color:#38BDF8; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
                     <span>Acceso de Cortesía para Medios y Narradores:</span>
                  </div>
                  <div style="display:flex; gap:6px;">
                    <input type="text" id="input-key-media-p2" placeholder="Introducir Clave de Acreditación / VIP" style="flex:1; background:#020617; border:1.5px solid #00D2FF; border-radius:8px; padding:8px 10px; color:#FFF; font-size:12px; font-weight:700; outline:none; text-transform:uppercase;" onkeydown="if(event.key==='Enter') validarClavePrensaGratis('p2')">
                    <button type="button" onclick="validarClavePrensaGratis('p2')" style="background:linear-gradient(135deg, #0284C7, #00D2FF); color:#020617; border:none; border-radius:8px; padding:8px 12px; font-weight:900; font-size:11.5px; cursor:pointer; white-space:nowrap; box-shadow:0 0 10px rgba(0,210,255,0.4);">
                      Entrar Gratis
                    </button>
                  </div>
                </div>

              </div>

              <!-- PLAN 3: MANAGER PRO -->
              <div id="p2-plan-card-MANAGER" onclick="seleccionarPlanP2('MANAGER_PRO')" style="background:linear-gradient(165deg, rgba(28,20,10,0.85), rgba(8,12,24,0.9)); border:1px solid rgba(255,184,46,0.45); border-radius:18px; padding:22px; cursor:pointer; transition:all 0.25s;">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                  <div style="width:36px; height:36px; border-radius:10px; background:rgba(255,199,44,0.18); border:1px solid #FFC72C; display:flex; align-items:center; justify-content:center; box-shadow:0 0 14px rgba(255,199,44,0.35);">
                    
                  </div>
                  <h4 style="margin:0; font-size:16px; font-weight:900; color:#FFB82E;">Manager Pro</h4>
                </div>
                <p style="margin:0 0 12px 0; font-size:11.5px; color:#94A3B8; line-height:1.4;">Para 1 franquicia que busca dominar la liga con analítica de élite.</p>
                <div style="margin-bottom:14px; padding-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.08);">
                  <span style="font-size:30px; font-weight:900; color:#FFF; letter-spacing:-0.5px;">$9.99</span>
                  <span style="font-size:11.5px; color:#94A3B8; font-weight:700;"> / mes</span>
                </div>
                <ul style="list-style:none; padding:0; margin:0; font-size:11.5px; color:#CBD5E1; display:flex; flex-direction:column; gap:8px;">
                  <li><span style="color:#18C995; font-weight:900;">✓</span> Todo lo incluido en Mes Gratis</li>
                  <li><span style="color:#18C995; font-weight:900;">✓</span> Exportar PDF & WhatsApp masivo</li>
                  <li><span style="color:#18C995; font-weight:900;">✓</span> Spray Chart de Bateo por Zona</li>
                  <li style="color:#FFB82E; font-weight:800;">Soporte Prioritario 24/7</li>
                </ul>
              </div>

              <!-- PLAN 3: LIGA ENTERPRISE -->
              <div id="p2-plan-card-LIGA" onclick="seleccionarPlanP2('LIGA_ENTERPRISE')" style="background:linear-gradient(165deg, rgba(24,12,42,0.85), rgba(8,12,24,0.9)); border:1px solid rgba(139,92,246,0.45); border-radius:18px; padding:22px; cursor:pointer; transition:all 0.25s;">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                  <div style="width:36px; height:36px; border-radius:10px; background:rgba(167,139,250,0.18); border:1px solid #A78BFA; display:flex; align-items:center; justify-content:center; box-shadow:0 0 14px rgba(167,139,250,0.35);">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="2"><path d="M3 21h18M4 18h16M4 14h16M6 10v4M10 10v4M14 10v4M18 10v4M3 6l9-3 9 3v4H3V6z" fill="rgba(167,139,250,0.2)"/></svg>
                  </div>
                  <h4 style="margin:0; font-size:16px; font-weight:900; color:#A78BFA;">Liga Máster</h4>
                </div>
                <p style="margin:0 0 12px 0; font-size:11.5px; color:#94A3B8; line-height:1.4;">Para comisionados de liga y circuitos (hasta 20 equipos aislados).</p>
                <div style="margin-bottom:14px; padding-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.08);">
                  <span style="font-size:30px; font-weight:900; color:#FFF; letter-spacing:-0.5px;">$29.99</span>
                  <span style="font-size:11.5px; color:#94A3B8; font-weight:700;"> / mes</span>
                </div>
                <ul style="list-style:none; padding:0; margin:0; font-size:11.5px; color:#CBD5E1; display:flex; flex-direction:column; gap:8px;">
                  <li><span style="color:#18C995; font-weight:900;">✓</span> Multi-Tenant por Estado y Sede</li>
                  <li><span style="color:#18C995; font-weight:900;">✓</span> Tabla de Posiciones en Vivo</li>
                  <li><span style="color:#18C995; font-weight:900;">✓</span> Estadísticas oficiales consolidadas</li>
                  <li style="color:#A78BFA; font-weight:800;">Panel Central de Comisionado</li>
                </ul>
              </div>`;

const cardsGridReplacement = `              <!-- PLAN 1: MES GRATIS (RECOMENDADO / DESTACADO - ELECTRIC BLUE) -->
              <div id="p2-plan-card-TRIAL" onclick="seleccionarPlanP2('TRIAL_MES_GRATIS')" style="background:linear-gradient(165deg, rgba(10,22,46,0.95), rgba(6,12,28,0.98)); border:2px solid #007AFF; border-radius:18px; padding:22px; cursor:pointer; position:relative; box-shadow:0 0 30px rgba(0,122,255,0.25), inset 0 1px 0 rgba(255,255,255,0.15); transform:translateY(-2px); transition:all 0.25s;">
                <div style="position:absolute; top:-12px; right:14px; background:#007AFF; color:#FFFFFF; font-weight:900; font-size:10px; padding:4px 10px; border-radius:12px; text-transform:uppercase; letter-spacing:0.8px; box-shadow:0 0 12px rgba(0,122,255,0.5);">
                  Recomendado
                </div>
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                  <div style="width:36px; height:36px; border-radius:10px; background:rgba(0,122,255,0.15); border:1px solid #007AFF; display:flex; align-items:center; justify-content:center;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2.2"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 8h10M7 12h6M7 16h8"/></svg>
                  </div>
                  <h4 style="margin:0; font-size:16px; font-weight:900; color:#FFF;">Mes Gratis</h4>
                </div>
                <p style="margin:0 0 12px 0; font-size:11.5px; color:#94A3B8; line-height:1.4;">Prueba piloto completa para torneos, campeonatos y temporadas activas.</p>
                <div style="margin-bottom:14px; padding-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.08);">
                  <span style="font-size:30px; font-weight:900; color:#00D2FF; letter-spacing:-0.5px;">$0.00</span>
                  <span style="font-size:11.5px; color:#94A3B8; font-weight:700;"> / 30 Días</span>
                </div>
                <ul style="list-style:none; padding:0; margin:0; font-size:11.5px; color:#E2E8F0; display:flex; flex-direction:column; gap:8px;">
                  <li><span style="color:#007AFF; font-weight:900;">✓</span> Anotador Dugout en vivo oficial</li>
                  <li><span style="color:#007AFF; font-weight:900;">✓</span> Sabermetría IA &amp; Monte Carlo</li>
                  <li><span style="color:#007AFF; font-weight:900;">✓</span> Roster completo hasta 30 atletas</li>
                  <li style="color:#94A3B8; font-weight:800;">Sin tarjeta de crédito requerida</li>
                </ul>
              </div>

              <!-- PLAN 2: COMENTARISTA & BROADCAST MEDIA (ELECTRIC BLUE) -->
              <div id="p2-plan-card-MEDIA" onclick="seleccionarPlanP2('MEDIA_PRO')" style="background:linear-gradient(165deg, rgba(10,22,46,0.85), rgba(6,12,28,0.95)); border:1px solid rgba(255,255,255,0.12); border-radius:18px; padding:22px; cursor:pointer; transition:all 0.25s;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                  <div style="display:flex; align-items:center; gap:10px;">
                    <div>
                      <h4 style="margin:0; font-size:16px; font-weight:900; color:#FFF;">Plan Comentarista &amp; Media</h4>
                      <span style="font-size:10px; color:#00D2FF; font-weight:800; text-transform:uppercase;">Cabina Digital TV &amp; Radio</span>
                    </div>
                  </div>
                  <span style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); color:#CBD5E1; font-size:9.5px; font-weight:900; padding:2px 7px; border-radius:10px;">ON AIR</span>
                </div>
                
                <p style="margin:0 0 12px 0; font-size:11.5px; color:#94A3B8; line-height:1.4;">
                  La Cabina Digital Inteligente de Televisión y Radio con cero distracciones y lectura a 60 cm.
                </p>

                <div style="background:rgba(2,6,23,0.85); border:1px solid #1E293B; border-radius:12px; padding:10px 14px; margin-bottom:12px;">
                  <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4px;">
                    <span style="font-size:11px; color:#CBD5E1; font-weight:700;">• Plan Mensual:</span>
                    <strong style="font-size:16px; color:#00D2FF; font-variant-numeric:tabular-nums;">$14.99 <small style="font-size:10px; color:#94A3B8;">/ mes</small></strong>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4px;">
                    <span style="font-size:11px; color:#94A3B8; font-weight:700;">• Plan Anual (-28%):</span>
                    <strong style="font-size:16px; color:#FFF; font-variant-numeric:tabular-nums;">$129.00 <small style="font-size:10px; color:#94A3B8;">/ año</small></strong>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:baseline; font-size:10.5px; color:#94A3B8;">
                    <span>• Pase Torneo: $49 · Multi-Cabina:</span>
                    <span style="color:#00D2FF; font-weight:700;">$49.99/mes</span>
                  </div>
                </div>

                <div style="font-size:11px; font-weight:900; color:#FFF; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.5px;">¿Qué incluye?</div>
                <ul style="list-style:none; padding:0; margin:0; font-size:11px; color:#CBD5E1; display:flex; flex-direction:column; gap:6px;">
                  <li><span style="color:#007AFF; font-weight:900;">✓</span> Entrada independiente (/cabina) sin permisos de anotador</li>
                  <li><span style="color:#007AFF; font-weight:900;">✓</span> Pantalla única Todo-en-Uno (Cockpit) con cero distracciones</li>
                  <li><span style="color:#007AFF; font-weight:900;">✓</span> Telemetría glanceable de alta visibilidad (a 60 cm del mic)</li>
                  <li><span style="color:#007AFF; font-weight:900;">✓</span> Historial Frente a Frente (BvP) y divididos en vivo</li>
                  <li><span style="color:#007AFF; font-weight:900;">✓</span> Semáforo médico (+55) con alerta de bullpen a 70 envíos</li>
                  <li><span style="color:#007AFF; font-weight:900;">✓</span> Teleprompter con 3 píldoras por turno para hablar al aire</li>
                  <li><span style="color:#007AFF; font-weight:900;">✓</span> Medidor de Probabilidad de Victoria (WPA Index)</li>
                  <li><span style="color:#007AFF; font-weight:900;">✓</span> URL de Overlay transparente para OBS Studio y vMix</li>
                </ul>

                <!-- ACCESO GRATIS DIRECTO CON CLAVE DE PRENSA / LIGA -->
                <div style="margin-top:14px; padding-top:12px; border-top:1px dashed rgba(0,122,255,0.35);" onclick="event.stopPropagation();">
                  <div style="font-size:11px; font-weight:800; color:#00D2FF; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
                     <span>Acceso de Cortesía para Medios y Narradores:</span>
                  </div>
                  <div style="display:flex; gap:6px;">
                    <input type="text" id="input-key-media-p2" placeholder="Introducir Clave de Acreditación / VIP" style="flex:1; background:#020617; border:1.5px solid rgba(0,122,255,0.4); border-radius:8px; padding:8px 10px; color:#FFF; font-size:12px; font-weight:700; outline:none; text-transform:uppercase;" onkeydown="if(event.key==='Enter') validarClavePrensaGratis('p2')">
                    <button type="button" onclick="validarClavePrensaGratis('p2')" style="background:#007AFF; color:#FFFFFF; border:none; border-radius:8px; padding:8px 12px; font-weight:900; font-size:11.5px; cursor:pointer; white-space:nowrap; box-shadow:0 0 10px rgba(0,122,255,0.4);">
                      Entrar Gratis
                    </button>
                  </div>
                </div>

              </div>

              <!-- PLAN 3: MANAGER PRO (ELECTRIC BLUE) -->
              <div id="p2-plan-card-MANAGER" onclick="seleccionarPlanP2('MANAGER_PRO')" style="background:linear-gradient(165deg, rgba(10,22,46,0.85), rgba(6,12,28,0.95)); border:1px solid rgba(255,255,255,0.12); border-radius:18px; padding:22px; cursor:pointer; transition:all 0.25s;">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                  <div style="width:36px; height:36px; border-radius:10px; background:rgba(0,122,255,0.15); border:1px solid #007AFF; display:flex; align-items:center; justify-content:center;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2.2"><circle cx="12" cy="8" r="4"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>
                  </div>
                  <h4 style="margin:0; font-size:16px; font-weight:900; color:#FFF;">Manager Pro</h4>
                </div>
                <p style="margin:0 0 12px 0; font-size:11.5px; color:#94A3B8; line-height:1.4;">Para 1 franquicia que busca dominar la liga con analítica de élite.</p>
                <div style="margin-bottom:14px; padding-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.08);">
                  <span style="font-size:30px; font-weight:900; color:#FFF; letter-spacing:-0.5px;">$9.99</span>
                  <span style="font-size:11.5px; color:#94A3B8; font-weight:700;"> / mes</span>
                </div>
                <ul style="list-style:none; padding:0; margin:0; font-size:11.5px; color:#CBD5E1; display:flex; flex-direction:column; gap:8px;">
                  <li><span style="color:#007AFF; font-weight:900;">✓</span> Todo lo incluido en Mes Gratis</li>
                  <li><span style="color:#007AFF; font-weight:900;">✓</span> Exportar PDF &amp; WhatsApp masivo</li>
                  <li><span style="color:#007AFF; font-weight:900;">✓</span> Spray Chart de Bateo por Zona</li>
                  <li style="color:#94A3B8; font-weight:800;">Soporte Prioritario 24/7</li>
                </ul>
              </div>

              <!-- PLAN 4: LIGA ENTERPRISE (CHAMPAGNE GOLD) -->
              <div id="p2-plan-card-LIGA" onclick="seleccionarPlanP2('LIGA_ENTERPRISE')" style="background:linear-gradient(165deg, rgba(26,20,10,0.85), rgba(12,10,6,0.95)); border:1.5px solid rgba(255,179,0,0.4); border-radius:18px; padding:22px; cursor:pointer; transition:all 0.25s;">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                  <div style="width:36px; height:36px; border-radius:10px; background:rgba(255,179,0,0.15); border:1px solid #FFB300; display:flex; align-items:center; justify-content:center;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFB300" stroke-width="2"><path d="M3 21h18M4 18h16M4 14h16M6 10v4M10 10v4M14 10v4M18 10v4M3 6l9-3 9 3v4H3V6z" fill="rgba(255,179,0,0.15)"/></svg>
                  </div>
                  <h4 style="margin:0; font-size:16px; font-weight:900; color:#FFB300;">Liga Máster</h4>
                </div>
                <p style="margin:0 0 12px 0; font-size:11.5px; color:#94A3B8; line-height:1.4;">Para comisionados de liga y circuitos (hasta 20 equipos aislados).</p>
                <div style="margin-bottom:14px; padding-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.08);">
                  <span style="font-size:30px; font-weight:900; color:#FFF; letter-spacing:-0.5px;">$29.99</span>
                  <span style="font-size:11.5px; color:#94A3B8; font-weight:700;"> / mes</span>
                </div>
                <ul style="list-style:none; padding:0; margin:0; font-size:11.5px; color:#CBD5E1; display:flex; flex-direction:column; gap:8px;">
                  <li><span style="color:#FFB300; font-weight:900;">✓</span> Multi-Tenant por Estado y Sede</li>
                  <li><span style="color:#FFB300; font-weight:900;">✓</span> Tabla de Posiciones en Vivo</li>
                  <li><span style="color:#FFB300; font-weight:900;">✓</span> Estadísticas oficiales consolidadas</li>
                  <li style="color:#FFB300; font-weight:800;">Panel Central de Comisionado</li>
                </ul>
              </div>`;

content = replaceNormalized(content, cardsGridTarget, cardsGridReplacement);
console.log('✓ Grid de tarjetas de Paso 2 actualizado a 2 colores.');

// 6. Refactor auth-panel-pricing (lines 23670-23932)
// Header pill & banner
const authHeaderTarget = `        <div style="text-align:center; margin-bottom:18px;">
          <span style="background:rgba(242,101,34,0.15); border:1px solid #F26522; color:#F26522; font-size:11px; font-weight:900; padding:4px 14px; border-radius:20px; text-transform:uppercase; letter-spacing:0.8px;">
            MODELO HÍBRIDO • PRECIOS POR TEMPORADA
          </span>
          <h3 style="font-size:22px; font-weight:900; margin:10px 0 4px 0; color:#FFF;">Seis planes, un solo ecosistema.</h3>
          <p style="margin:0; font-size:12px; color:#94A3B8;">Solución integral de sabermetría y anotación en vivo para equipos, academias y ligas completas.</p>
        </div>

        <!-- Banner de Prueba Gratuita sin Tarjeta -->
        <div style="background:linear-gradient(135deg, rgba(0,210,255,0.12), rgba(16,185,129,0.08)); border:1px solid rgba(0,210,255,0.4); border-radius:12px; padding:12px 18px; margin-bottom:18px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
          <div style="display:flex; align-items:center; gap:10px;">
            
            <div>
              <div style="color:#00D2FF; font-weight:900; font-size:13px;">¿Quieres probar el Anotador Dugout antes de suscribirte?</div>
              <div style="color:#CBD5E1; font-size:11.5px;">Regístrate con tu correo y contraseña para activar tu acceso inmediato sin tarjeta de crédito.</div>
            </div>
          </div>
          <button onclick="seleccionarPlanSuscripcion('TRIAL', true)" style="background:linear-gradient(135deg, #10B981, #059669); color:#020617; border:none; padding:8px 16px; border-radius:8px; font-weight:900; font-size:12px; cursor:pointer; text-transform:uppercase; box-shadow:0 0 15px rgba(16,185,129,0.3); display:inline-flex; align-items:center; gap:6px;">
            Registro Gratuito →
          </button>
        </div>`;

const authHeaderReplacement = `        <div style="text-align:center; margin-bottom:18px;">
          <span style="background:rgba(0,122,255,0.15); border:1px solid #007AFF; color:#00D2FF; font-size:11px; font-weight:900; padding:4px 14px; border-radius:20px; text-transform:uppercase; letter-spacing:0.8px;">
            MODELO HÍBRIDO • PRECIOS POR TEMPORADA
          </span>
          <h3 style="font-size:22px; font-weight:900; margin:10px 0 4px 0; color:#FFF;">Seis planes, un solo ecosistema.</h3>
          <p style="margin:0; font-size:12px; color:#94A3B8;">Solución integral de sabermetría y anotación en vivo para equipos, academias y ligas completas.</p>
        </div>

        <!-- Banner de Prueba Gratuita sin Tarjeta -->
        <div style="background:linear-gradient(135deg, rgba(0,122,255,0.12), rgba(10,24,54,0.4)); border:1px solid rgba(0,122,255,0.4); border-radius:12px; padding:12px 18px; margin-bottom:18px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
          <div style="display:flex; align-items:center; gap:10px;">
            
            <div>
              <div style="color:#00D2FF; font-weight:900; font-size:13px;">¿Quieres probar el Anotador Dugout antes de suscribirte?</div>
              <div style="color:#CBD5E1; font-size:11.5px;">Regístrate con tu correo y contraseña para activar tu acceso inmediato sin tarjeta de crédito.</div>
            </div>
          </div>
          <button onclick="seleccionarPlanSuscripcion('TRIAL', true)" style="background:#007AFF; color:#FFFFFF; border:none; padding:8px 16px; border-radius:8px; font-weight:900; font-size:12px; cursor:pointer; text-transform:uppercase; box-shadow:0 0 15px rgba(0,122,255,0.35); display:inline-flex; align-items:center; gap:6px;">
            Registro Gratuito →
          </button>
        </div>`;

content = replaceNormalized(content, authHeaderTarget, authHeaderReplacement);
console.log('✓ Header de auth-panel-pricing actualizado.');

// CLUB (change green to blue)
const clubTarget = `          <!-- PLAN 2: DIAMAX CLUB ($179.99) -->
          <div onclick="seleccionarPlanSuscripcion('CLUB')" style="cursor:pointer; background:#070e1c; border:1px solid rgba(16,185,129,0.3); border-radius:16px; padding:18px; display:flex; flex-direction:column; justify-content:space-between; transition:transform 0.2s;" onmouseover="this.style.borderColor='#10B981'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='rgba(16,185,129,0.3)'; this.style.transform='translateY(0)';">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                <h4 style="margin:0; font-size:16px; font-weight:900; color:#10B981; display:inline-flex; align-items:center; gap:6px;">
                  <svg viewBox="0 0 24 24" width="18" height="18"><use href="#diamax-icon-tier-club"/></svg> DIAMAX CLUB
                </h4>
                <span style="background:rgba(16,185,129,0.15); color:#10B981; font-size:9.5px; font-weight:900; padding:2px 7px; border-radius:6px;">HASTA 5 EQUIPOS</span>
              </div>
              
              <div style="margin-bottom:12px;">
                <span style="font-size:28px; font-weight:900; color:#FFF;">$179.99</span>
                <span style="font-size:11.5px; color:#94A3B8;"> / temporada</span>
                <div style="font-size:11px; color:#34D399; font-weight:700; margin-top:2px;">Hasta 5 equipos · Franquicia Pro</div>
              </div>

              <ul style="list-style:none; padding:0; margin:0 0 16px 0; font-size:11.5px; color:#CBD5E1; display:flex; flex-direction:column; gap:7px;">
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#10B981;"><use href="#diamax-icon-check-circle"/></svg> <span>Todo lo del Plan TEAM</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#10B981;"><use href="#diamax-icon-check-circle"/></svg> <span>Gestión Multi-Equipo (Hasta 5 Categorías)</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#10B981;"><use href="#diamax-icon-check-circle"/></svg> <span>Asistente Táctico IA (DIAMAX Agent v2.5 + RAG)</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#10B981;"><use href="#diamax-icon-check-circle"/></svg> <span>Dictado y Control de Alineación por Voz</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#10B981;"><use href="#diamax-icon-check-circle"/></svg> <span>Monitor de Fatiga de Pitcheo (+55: Límite 75)</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#10B981;"><use href="#diamax-icon-check-circle"/></svg> <span>Acceso al Mapa Mundial de Inteligencia (GPS)</span></li>
              </ul>
            </div>

            <button onclick="seleccionarPlanSuscripcion('CLUB')" style="width:100%; padding:11px; background:rgba(16,185,129,0.12); color:#10B981; border:1.5px solid #10B981; border-radius:8px; font-weight:900; font-size:12px; cursor:pointer; text-transform:uppercase; transition:all 0.2s;" onmouseover="this.style.background='#10B981'; this.style.color='#020617';" onmouseout="this.style.background='rgba(16,185,129,0.12)'; this.style.color='#10B981';">
              Elegir Plan CLUB ($179.99)
            </button>
          </div>`;

const clubReplacement = `          <!-- PLAN 2: DIAMAX CLUB ($179.99 - ELECTRIC BLUE) -->
          <div onclick="seleccionarPlanSuscripcion('CLUB')" style="cursor:pointer; background:#070e1c; border:1px solid rgba(0,122,255,0.25); border-radius:16px; padding:18px; display:flex; flex-direction:column; justify-content:space-between; transition:transform 0.2s;" onmouseover="this.style.borderColor='#007AFF'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='rgba(0,122,255,0.25)'; this.style.transform='translateY(0)';">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                <h4 style="margin:0; font-size:16px; font-weight:900; color:#00D2FF; display:inline-flex; align-items:center; gap:6px;">
                  <svg viewBox="0 0 24 24" width="18" height="18"><use href="#diamax-icon-tier-club"/></svg> DIAMAX CLUB
                </h4>
                <span style="background:rgba(0,122,255,0.15); color:#00D2FF; font-size:9.5px; font-weight:900; padding:2px 7px; border-radius:6px;">HASTA 5 EQUIPOS</span>
              </div>
              
              <div style="margin-bottom:12px;">
                <span style="font-size:28px; font-weight:900; color:#FFF;">$179.99</span>
                <span style="font-size:11.5px; color:#94A3B8;"> / temporada</span>
                <div style="font-size:11px; color:#7DD3FC; font-weight:700; margin-top:2px;">Hasta 5 equipos · Franquicia Pro</div>
              </div>

              <ul style="list-style:none; padding:0; margin:0 0 16px 0; font-size:11.5px; color:#CBD5E1; display:flex; flex-direction:column; gap:7px;">
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#00D2FF;"><use href="#diamax-icon-check-circle"/></svg> <span>Todo lo del Plan TEAM</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#00D2FF;"><use href="#diamax-icon-check-circle"/></svg> <span>Gestión Multi-Equipo (Hasta 5 Categorías)</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#00D2FF;"><use href="#diamax-icon-check-circle"/></svg> <span>Asistente Táctico IA (DIAMAX Agent v2.5 + RAG)</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#00D2FF;"><use href="#diamax-icon-check-circle"/></svg> <span>Dictado y Control de Alineación por Voz</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#00D2FF;"><use href="#diamax-icon-check-circle"/></svg> <span>Monitor de Fatiga de Pitcheo (+55: Límite 75)</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#00D2FF;"><use href="#diamax-icon-check-circle"/></svg> <span>Acceso al Mapa Mundial de Inteligencia (GPS)</span></li>
              </ul>
            </div>

            <button onclick="seleccionarPlanSuscripcion('CLUB')" style="width:100%; padding:11px; background:rgba(0,122,255,0.12); color:#00D2FF; border:1.5px solid #007AFF; border-radius:8px; font-weight:900; font-size:12px; cursor:pointer; text-transform:uppercase; transition:all 0.2s;" onmouseover="this.style.background='#007AFF'; this.style.color='#FFFFFF';" onmouseout="this.style.background='rgba(0,122,255,0.12)'; this.style.color='#00D2FF';">
              Elegir Plan CLUB ($179.99)
            </button>
          </div>`;

content = replaceNormalized(content, clubTarget, clubReplacement);
console.log('✓ Plan CLUB actualizado a Electric Blue.');

// ACADEMY (change yellow to blue)
const academyTarget = `          <!-- PLAN 3: DIAMAX ACADEMY ($349.99) -->
          <div onclick="seleccionarPlanSuscripcion('ACADEMY')" style="cursor:pointer; background:#070e1c; border:1px solid rgba(255,199,44,0.3); border-radius:16px; padding:18px; display:flex; flex-direction:column; justify-content:space-between; transition:transform 0.2s;" onmouseover="this.style.borderColor='#FFC72C'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='rgba(255,199,44,0.3)'; this.style.transform='translateY(0)';">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                <h4 style="margin:0; font-size:16px; font-weight:900; color:#FFC72C; display:inline-flex; align-items:center; gap:6px;">
                  <svg viewBox="0 0 24 24" width="18" height="18"><use href="#diamax-icon-tier-academy"/></svg> DIAMAX ACADEMY
                </h4>
                <span style="background:rgba(255,199,44,0.15); color:#FFC72C; font-size:9.5px; font-weight:900; padding:2px 7px; border-radius:6px;">HASTA 10 EQUIPOS</span>
              </div>
              
              <div style="margin-bottom:12px;">
                <span style="font-size:28px; font-weight:900; color:#FFF;">$349.99</span>
                <span style="font-size:11.5px; color:#94A3B8;"> / temporada</span>
                <div style="font-size:11px; color:#FDE047; font-weight:700; margin-top:2px;">Hasta 10 equipos / categorías</div>
              </div>

              <ul style="list-style:none; padding:0; margin:0 0 16px 0; font-size:11.5px; color:#CBD5E1; display:flex; flex-direction:column; gap:7px;">
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#FFC72C;"><use href="#diamax-icon-check-circle"/></svg> <span>Todo lo del Plan CLUB</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#FFC72C;"><use href="#diamax-icon-check-circle"/></svg> <span>Dashboard Sabermétrico (OPS, wOBA, BABIP, ERA, RE24)</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#FFC72C;"><use href="#diamax-icon-check-circle"/></svg> <span>Telemetría Climática GPS &amp; Aerodinámica Zapata</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#FFC72C;"><use href="#diamax-icon-check-circle"/></svg> <span>Scouting &amp; Radiografía Táctica de Rivales</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#FFC72C;"><use href="#diamax-icon-check-circle"/></svg> <span>Certificación Oficial de Cierre de Encuentro</span></li>
              </ul>
            </div>

            <button onclick="seleccionarPlanSuscripcion('ACADEMY')" style="width:100%; padding:11px; background:rgba(255,199,44,0.12); color:#FFC72C; border:1.5px solid #FFC72C; border-radius:8px; font-weight:900; font-size:12px; cursor:pointer; text-transform:uppercase; transition:all 0.2s;" onmouseover="this.style.background='#FFC72C'; this.style.color='#020617';" onmouseout="this.style.background='rgba(255,199,44,0.12)'; this.style.color='#FFC72C';">
              Elegir Plan ACADEMY ($349.99)
            </button>
          </div>`;

const academyReplacement = `          <!-- PLAN 3: DIAMAX ACADEMY ($349.99 - ELECTRIC BLUE) -->
          <div onclick="seleccionarPlanSuscripcion('ACADEMY')" style="cursor:pointer; background:#070e1c; border:1px solid rgba(0,122,255,0.25); border-radius:16px; padding:18px; display:flex; flex-direction:column; justify-content:space-between; transition:transform 0.2s;" onmouseover="this.style.borderColor='#007AFF'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='rgba(0,122,255,0.25)'; this.style.transform='translateY(0)';">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                <h4 style="margin:0; font-size:16px; font-weight:900; color:#00D2FF; display:inline-flex; align-items:center; gap:6px;">
                  <svg viewBox="0 0 24 24" width="18" height="18"><use href="#diamax-icon-tier-academy"/></svg> DIAMAX ACADEMY
                </h4>
                <span style="background:rgba(0,122,255,0.15); color:#00D2FF; font-size:9.5px; font-weight:900; padding:2px 7px; border-radius:6px;">HASTA 10 EQUIPOS</span>
              </div>
              
              <div style="margin-bottom:12px;">
                <span style="font-size:28px; font-weight:900; color:#FFF;">$349.99</span>
                <span style="font-size:11.5px; color:#94A3B8;"> / temporada</span>
                <div style="font-size:11px; color:#7DD3FC; font-weight:700; margin-top:2px;">Hasta 10 equipos / categorías</div>
              </div>

              <ul style="list-style:none; padding:0; margin:0 0 16px 0; font-size:11.5px; color:#CBD5E1; display:flex; flex-direction:column; gap:7px;">
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#00D2FF;"><use href="#diamax-icon-check-circle"/></svg> <span>Todo lo del Plan CLUB</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#00D2FF;"><use href="#diamax-icon-check-circle"/></svg> <span>Dashboard Sabermétrico (OPS, wOBA, BABIP, ERA, RE24)</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#00D2FF;"><use href="#diamax-icon-check-circle"/></svg> <span>Telemetría Climática GPS &amp; Aerodinámica Zapata</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#00D2FF;"><use href="#diamax-icon-check-circle"/></svg> <span>Scouting &amp; Radiografía Táctica de Rivales</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#00D2FF;"><use href="#diamax-icon-check-circle"/></svg> <span>Certificación Oficial de Cierre de Encuentro</span></li>
              </ul>
            </div>

            <button onclick="seleccionarPlanSuscripcion('ACADEMY')" style="width:100%; padding:11px; background:rgba(0,122,255,0.12); color:#00D2FF; border:1.5px solid #007AFF; border-radius:8px; font-weight:900; font-size:12px; cursor:pointer; text-transform:uppercase; transition:all 0.2s;" onmouseover="this.style.background='#007AFF'; this.style.color='#FFFFFF';" onmouseout="this.style.background='rgba(0,122,255,0.12)'; this.style.color='#00D2FF';">
              Elegir Plan ACADEMY ($349.99)
            </button>
          </div>`;

content = replaceNormalized(content, academyTarget, academyReplacement);
console.log('✓ Plan ACADEMY actualizado a Electric Blue.');

// LEAGUE PRO (ensure Champagne Gold)
const leagueTarget = `          <!-- PLAN 4: LEAGUE PRO ($649.99) -->
          <div onclick="seleccionarPlanSuscripcion('LEAGUE')" style="cursor:pointer; background:linear-gradient(145deg, #091224, #0d1a33); border:1.8px solid #38BDF8; border-radius:16px; padding:18px; display:flex; flex-direction:column; justify-content:space-between; position:relative; box-shadow:0 0 20px rgba(56,189,248,0.15); transition:transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='translateY(0)';">
            <div style="position:absolute; top:-10px; right:16px; background:#38BDF8; color:#020617; font-size:9.5px; font-weight:900; padding:2px 8px; border-radius:10px; text-transform:uppercase; letter-spacing:0.5px;">
              MÁS POPULAR LIGAS
            </div>

            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                <h4 style="margin:0; font-size:16px; font-weight:900; color:#38BDF8; display:inline-flex; align-items:center; gap:6px;">
                  <svg viewBox="0 0 24 24" width="18" height="18"><use href="#diamax-icon-tier-league"/></svg> LEAGUE PRO
                </h4>
                <span style="background:rgba(56,189,248,0.15); color:#38BDF8; font-size:9.5px; font-weight:900; padding:2px 7px; border-radius:6px;">HASTA 20 EQUIPOS</span>
              </div>
              
              <div style="margin-bottom:12px;">
                <span style="font-size:28px; font-weight:900; color:#FFF;">$649.99</span>
                <span style="font-size:11.5px; color:#94A3B8;"> / temporada</span>
                <div style="font-size:11px; color:#7DD3FC; font-weight:700; margin-top:2px;">Hasta 20 equipos por circuito</div>
              </div>

              <ul style="list-style:none; padding:0; margin:0 0 16px 0; font-size:11.5px; color:#CBD5E1; display:flex; flex-direction:column; gap:7px;">
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#38BDF8;"><use href="#diamax-icon-check-circle"/></svg> <span>Todo lo del Plan ACADEMY</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#38BDF8;"><use href="#diamax-icon-check-circle"/></svg> <span>Tabla de Posiciones y Estadísticas de Circuito</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#38BDF8;"><use href="#diamax-icon-check-circle"/></svg> <span>Reportes Técnicos Comparativos de Ambos Equipos</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#38BDF8;"><use href="#diamax-icon-check-circle"/></svg> <span>Gestión de Sedes, Estadios y Calendario</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#38BDF8;"><use href="#diamax-icon-check-circle"/></svg> <span>Soporte Técnico Prioritario para Anotadores</span></li>
              </ul>
            </div>

            <button onclick="seleccionarPlanSuscripcion('LEAGUE')" style="width:100%; padding:11px; background:#38BDF8; color:#020617; border:none; border-radius:8px; font-weight:900; font-size:12px; cursor:pointer; text-transform:uppercase; box-shadow:0 0 15px rgba(56,189,248,0.3); transition:all 0.2s;" onmouseover="this.style.background='#7DD3FC';" onmouseout="this.style.background='#38BDF8';">
              Elegir LEAGUE PRO ($649.99)
            </button>
          </div>`;

const leagueReplacement = `          <!-- PLAN 4: LEAGUE PRO ($649.99 - CHAMPAGNE GOLD) -->
          <div onclick="seleccionarPlanSuscripcion('LEAGUE')" style="cursor:pointer; background:linear-gradient(145deg, #141006, #1c1508); border:1.8px solid #FFB300; border-radius:16px; padding:18px; display:flex; flex-direction:column; justify-content:space-between; position:relative; box-shadow:0 0 20px rgba(255,179,0,0.15); transition:transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='translateY(0)';">
            <div style="position:absolute; top:-10px; right:16px; background:#FFB300; color:#020617; font-size:9.5px; font-weight:900; padding:2px 8px; border-radius:10px; text-transform:uppercase; letter-spacing:0.5px;">
              MÁS POPULAR LIGAS
            </div>

            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                <h4 style="margin:0; font-size:16px; font-weight:900; color:#FFB300; display:inline-flex; align-items:center; gap:6px;">
                  <svg viewBox="0 0 24 24" width="18" height="18"><use href="#diamax-icon-tier-league"/></svg> LEAGUE PRO
                </h4>
                <span style="background:rgba(255,179,0,0.15); color:#FFB300; font-size:9.5px; font-weight:900; padding:2px 7px; border-radius:6px;">HASTA 20 EQUIPOS</span>
              </div>
              
              <div style="margin-bottom:12px;">
                <span style="font-size:28px; font-weight:900; color:#FFF;">$649.99</span>
                <span style="font-size:11.5px; color:#94A3B8;"> / temporada</span>
                <div style="font-size:11px; color:#FDE047; font-weight:700; margin-top:2px;">Hasta 20 equipos por circuito</div>
              </div>

              <ul style="list-style:none; padding:0; margin:0 0 16px 0; font-size:11.5px; color:#CBD5E1; display:flex; flex-direction:column; gap:7px;">
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#FFB300;"><use href="#diamax-icon-check-circle"/></svg> <span>Todo lo del Plan ACADEMY</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#FFB300;"><use href="#diamax-icon-check-circle"/></svg> <span>Tabla de Posiciones y Estadísticas de Circuito</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#FFB300;"><use href="#diamax-icon-check-circle"/></svg> <span>Reportes Técnicos Comparativos de Ambos Equipos</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#FFB300;"><use href="#diamax-icon-check-circle"/></svg> <span>Gestión de Sedes, Estadios y Calendario</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#FFB300;"><use href="#diamax-icon-check-circle"/></svg> <span>Soporte Técnico Prioritario para Anotadores</span></li>
              </ul>
            </div>

            <button onclick="seleccionarPlanSuscripcion('LEAGUE')" style="width:100%; padding:11px; background:#FFB300; color:#020617; border:none; border-radius:8px; font-weight:900; font-size:12px; cursor:pointer; text-transform:uppercase; box-shadow:0 0 15px rgba(255,179,0,0.3); transition:all 0.2s;" onmouseover="this.style.background='#FDE047';" onmouseout="this.style.background='#FFB300';">
              Elegir LEAGUE PRO ($649.99)
            </button>
          </div>`;

content = replaceNormalized(content, leagueTarget, leagueReplacement);
console.log('✓ Plan LEAGUE PRO actualizado a Champagne Gold.');

// ORGANIZATION (change orange to gold)
const orgTarget = `          <!-- PLAN 5: DIAMAX ORGANIZATION ($949.99) -->
          <div onclick="seleccionarPlanSuscripcion('ORGANIZATION')" style="cursor:pointer; background:#070e1c; border:1px solid rgba(242,101,34,0.3); border-radius:16px; padding:18px; display:flex; flex-direction:column; justify-content:space-between; transition:transform 0.2s;" onmouseover="this.style.borderColor='#F26522'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='rgba(242,101,34,0.3)'; this.style.transform='translateY(0)';">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                <h4 style="margin:0; font-size:16px; font-weight:900; color:#F26522; display:inline-flex; align-items:center; gap:6px;">
                  <svg viewBox="0 0 24 24" width="18" height="18"><use href="#diamax-icon-tier-organization"/></svg> DIAMAX ORGANIZATION
                </h4>
                <span style="background:rgba(242,101,34,0.15); color:#F26522; font-size:9.5px; font-weight:900; padding:2px 7px; border-radius:6px;">HASTA 30 EQUIPOS</span>
              </div>
              
              <div style="margin-bottom:12px;">
                <span style="font-size:28px; font-weight:900; color:#FFF;">$949.99</span>
                <span style="font-size:11.5px; color:#94A3B8;"> / temporada</span>
                <div style="font-size:11px; color:#FB923C; font-weight:700; margin-top:2px;">Hasta 30 equipos por asociación</div>
              </div>

              <ul style="list-style:none; padding:0; margin:0 0 16px 0; font-size:11.5px; color:#CBD5E1; display:flex; flex-direction:column; gap:7px;">
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#F26522;"><use href="#diamax-icon-check-circle"/></svg> <span>Todo lo de LEAGUE PRO</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#F26522;"><use href="#diamax-icon-check-circle"/></svg> <span>Panel de Comisionado General &amp; Delegados</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#F26522;"><use href="#diamax-icon-check-circle"/></svg> <span>Personalización con Identidad de Marca y Logo</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#F26522;"><use href="#diamax-icon-check-circle"/></svg> <span>Exportación Masiva de Datos Oficiales</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#F26522;"><use href="#diamax-icon-check-circle"/></svg> <span>Almacenamiento y Sincronización Automática en la Nube</span></li>
              </ul>
            </div>

            <button onclick="seleccionarPlanSuscripcion('ORGANIZATION')" style="width:100%; padding:11px; background:rgba(242,101,34,0.12); color:#F26522; border:1.5px solid #F26522; border-radius:8px; font-weight:900; font-size:12px; cursor:pointer; text-transform:uppercase; transition:all 0.2s;" onmouseover="this.style.background='#F26522'; this.style.color='#020617';" onmouseout="this.style.background='rgba(242,101,34,0.12)'; this.style.color='#F26522';">
              Elegir ORGANIZATION ($949.99)
            </button>
          </div>`;

const orgReplacement = `          <!-- PLAN 5: DIAMAX ORGANIZATION ($949.99 - CHAMPAGNE GOLD) -->
          <div onclick="seleccionarPlanSuscripcion('ORGANIZATION')" style="cursor:pointer; background:#070e1c; border:1px solid rgba(255,179,0,0.25); border-radius:16px; padding:18px; display:flex; flex-direction:column; justify-content:space-between; transition:transform 0.2s;" onmouseover="this.style.borderColor='#FFB300'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='rgba(255,179,0,0.25)'; this.style.transform='translateY(0)';">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                <h4 style="margin:0; font-size:16px; font-weight:900; color:#FFB300; display:inline-flex; align-items:center; gap:6px;">
                  <svg viewBox="0 0 24 24" width="18" height="18"><use href="#diamax-icon-tier-organization"/></svg> DIAMAX ORGANIZATION
                </h4>
                <span style="background:rgba(255,179,0,0.15); color:#FFB300; font-size:9.5px; font-weight:900; padding:2px 7px; border-radius:6px;">HASTA 30 EQUIPOS</span>
              </div>
              
              <div style="margin-bottom:12px;">
                <span style="font-size:28px; font-weight:900; color:#FFF;">$949.99</span>
                <span style="font-size:11.5px; color:#94A3B8;"> / temporada</span>
                <div style="font-size:11px; color:#FDE047; font-weight:700; margin-top:2px;">Hasta 30 equipos por asociación</div>
              </div>

              <ul style="list-style:none; padding:0; margin:0 0 16px 0; font-size:11.5px; color:#CBD5E1; display:flex; flex-direction:column; gap:7px;">
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#FFB300;"><use href="#diamax-icon-check-circle"/></svg> <span>Todo lo de LEAGUE PRO</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#FFB300;"><use href="#diamax-icon-check-circle"/></svg> <span>Panel de Comisionado General &amp; Delegados</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#FFB300;"><use href="#diamax-icon-check-circle"/></svg> <span>Personalización con Identidad de Marca y Logo</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#FFB300;"><use href="#diamax-icon-check-circle"/></svg> <span>Exportación Masiva de Datos Oficiales</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#FFB300;"><use href="#diamax-icon-check-circle"/></svg> <span>Almacenamiento y Sincronización Automática en la Nube</span></li>
              </ul>
            </div>

            <button onclick="seleccionarPlanSuscripcion('ORGANIZATION')" style="width:100%; padding:11px; background:rgba(255,179,0,0.12); color:#FFB300; border:1.5px solid #FFB300; border-radius:8px; font-weight:900; font-size:12px; cursor:pointer; text-transform:uppercase; transition:all 0.2s;" onmouseover="this.style.background='#FFB300'; this.style.color='#020617';" onmouseout="this.style.background='rgba(255,179,0,0.12)'; this.style.color='#FFB300';">
              Elegir ORGANIZATION ($949.99)
            </button>
          </div>`;

content = replaceNormalized(content, orgTarget, orgReplacement);
console.log('✓ Plan ORGANIZATION actualizado a Champagne Gold.');

// ENTERPRISE (change purple to gold)
const entTarget = `          <!-- PLAN 6: ENTERPRISE (PERSONALIZADO) -->
          <div style="grid-column:1 / -1; justify-self:center; width:100%; max-width:440px; margin:0 auto; background:linear-gradient(145deg, #161026, #090514); border:2px solid #A855F7; border-radius:18px; padding:22px; display:flex; flex-direction:column; justify-content:space-between; text-align:center; box-shadow:0 0 30px rgba(168,85,247,0.25); transition:all 0.2s;" onmouseover="this.style.borderColor='#C084FC'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 0 40px rgba(168,85,247,0.45)';" onmouseout="this.style.borderColor='#A855F7'; this.style.transform='translateY(0)'; this.style.boxShadow='0 0 30px rgba(168,85,247,0.25)';">
            <div>
              <div style="display:flex; justify-content:center; align-items:center; gap:8px; margin-bottom:10px; flex-wrap:wrap;">
                <h4 style="margin:0; font-size:17px; font-weight:900; color:#C084FC; display:inline-flex; align-items:center; gap:6px;">
                  <svg viewBox="0 0 24 24" width="20" height="20"><use href="#diamax-icon-tier-enterprise"/></svg> ENTERPRISE
                </h4>
                <span style="background:rgba(168,85,247,0.2); border:1px solid rgba(168,85,247,0.4); color:#C084FC; font-size:9.5px; font-weight:900; padding:2px 8px; border-radius:6px; letter-spacing:0.5px;">30+ EQUIPOS</span>
              </div>
              
              <div style="margin-bottom:14px; text-align:center;">
                <span style="font-size:26px; font-weight:900; color:#FFF; display:block; letter-spacing:-0.5px;">A Medida / SLA</span>
                <div style="font-size:11.5px; color:#DDD6FE; font-weight:700; margin-top:3px;">Federaciones y Circuitos Mayores</div>
              </div>

              <ul style="list-style:none; padding:0; margin:0 auto 16px auto; max-width:340px; font-size:11.5px; color:#CBD5E1; display:flex; flex-direction:column; gap:7px; text-align:left;">
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#C084FC;"><use href="#diamax-icon-check-circle"/></svg> <span>Todo lo de ORGANIZATION</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#C084FC;"><use href="#diamax-icon-check-circle"/></svg> <span>Circuitos Nacionales e Internacionales</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#C084FC;"><use href="#diamax-icon-check-circle"/></svg> <span>Servidor Dedicado e Integración API</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#C084FC;"><use href="#diamax-icon-check-circle"/></svg> <span>Capacitación Oficial para Anotadores</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#C084FC;"><use href="#diamax-icon-check-circle"/></svg> <span>Ingeniero de Soporte 24/7 y SLA Corporativo</span></li>
              </ul>
            </div>

            <div style="display:flex; justify-content:center; width:100%;">
              <button onclick="seleccionarPlanSuscripcion('ENTERPRISE')" style="width:100%; max-width:340px; padding:12px 16px; background:linear-gradient(135deg, rgba(168,85,247,0.25), rgba(147,51,234,0.35)); color:#E9D5FF; border:1.5px solid #A855F7; border-radius:10px; font-weight:900; font-size:12.5px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px; box-shadow:0 0 20px rgba(168,85,247,0.25); transition:all 0.2s;" onmouseover="this.style.background='#A855F7'; this.style.color='#020617'; this.style.boxShadow='0 0 25px rgba(168,85,247,0.5)';" onmouseout="this.style.background='linear-gradient(135deg, rgba(168,85,247,0.25), rgba(147,51,234,0.35))'; this.style.color='#E9D5FF'; this.style.boxShadow='0 0 20px rgba(168,85,247,0.25)';">
                Solicitar ENTERPRISE
              </button>
            </div>
          </div>`;

const entReplacement = `          <!-- PLAN 6: ENTERPRISE (PERSONALIZADO - CHAMPAGNE GOLD FLAGSHIP) -->
          <div style="grid-column:1 / -1; justify-self:center; width:100%; max-width:440px; margin:0 auto; background:linear-gradient(145deg, #1c1508, #0e0a02); border:2px solid #FFB300; border-radius:18px; padding:22px; display:flex; flex-direction:column; justify-content:space-between; text-align:center; box-shadow:0 0 30px rgba(255,179,0,0.2); transition:all 0.2s;" onmouseover="this.style.borderColor='#FDE047'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 0 40px rgba(255,179,0,0.35)';" onmouseout="this.style.borderColor='#FFB300'; this.style.transform='translateY(0)'; this.style.boxShadow='0 0 30px rgba(255,179,0,0.2)';">
            <div>
              <div style="display:flex; justify-content:center; align-items:center; gap:8px; margin-bottom:10px; flex-wrap:wrap;">
                <h4 style="margin:0; font-size:17px; font-weight:900; color:#FFB300; display:inline-flex; align-items:center; gap:6px;">
                  <svg viewBox="0 0 24 24" width="20" height="20"><use href="#diamax-icon-tier-enterprise"/></svg> ENTERPRISE
                </h4>
                <span style="background:rgba(255,179,0,0.18); border:1px solid rgba(255,179,0,0.4); color:#FFB300; font-size:9.5px; font-weight:900; padding:2px 8px; border-radius:6px; letter-spacing:0.5px;">30+ EQUIPOS</span>
              </div>
              
              <div style="margin-bottom:14px; text-align:center;">
                <span style="font-size:26px; font-weight:900; color:#FFF; display:block; letter-spacing:-0.5px;">A Medida / SLA</span>
                <div style="font-size:11.5px; color:#FDE047; font-weight:700; margin-top:3px;">Federaciones y Circuitos Mayores</div>
              </div>

              <ul style="list-style:none; padding:0; margin:0 auto 16px auto; max-width:340px; font-size:11.5px; color:#CBD5E1; display:flex; flex-direction:column; gap:7px; text-align:left;">
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#FFB300;"><use href="#diamax-icon-check-circle"/></svg> <span>Todo lo de ORGANIZATION</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#FFB300;"><use href="#diamax-icon-check-circle"/></svg> <span>Circuitos Nacionales e Internacionales</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#FFB300;"><use href="#diamax-icon-check-circle"/></svg> <span>Servidor Dedicado e Integración API</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#FFB300;"><use href="#diamax-icon-check-circle"/></svg> <span>Capacitación Oficial para Anotadores</span></li>
                <li style="display:flex; align-items:flex-start; gap:6px;"><svg viewBox="0 0 24 24" width="13" height="13" style="flex-shrink:0; margin-top:2px; color:#FFB300;"><use href="#diamax-icon-check-circle"/></svg> <span>Ingeniero de Soporte 24/7 y SLA Corporativo</span></li>
              </ul>
            </div>

            <div style="display:flex; justify-content:center; width:100%;">
              <button onclick="seleccionarPlanSuscripcion('ENTERPRISE')" style="width:100%; max-width:340px; padding:12px 16px; background:#FFB300; color:#020617; border:none; border-radius:10px; font-weight:900; font-size:12.5px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px; box-shadow:0 0 20px rgba(255,179,0,0.3); transition:all 0.2s;" onmouseover="this.style.background='#FDE047'; this.style.boxShadow='0 0 25px rgba(255,179,0,0.5)';" onmouseout="this.style.background='#FFB300'; this.style.boxShadow='0 0 20px rgba(255,179,0,0.3)';">
                Solicitar ENTERPRISE
              </button>
            </div>
          </div>`;

content = replaceNormalized(content, entTarget, entReplacement);
console.log('✓ Plan ENTERPRISE actualizado a Champagne Gold.');

fs.writeFileSync(indexPath, content, 'utf8');
console.log('🎉 REFACTORIZACIÓN EXITOSA: Colores de planes unificados a 2 colores.');
