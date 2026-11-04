import fs from 'fs';

const indexPath = 'index.html';
let html = fs.readFileSync(indexPath, 'utf-8');

console.log('--- APLICANDO SOLUCIÓN RESPONSIVE COMPLETA PARA MÓVIL EN MODAL DE PLANES ---');

// 1. Inyectar estilos CSS específicos y de alta prioridad para móvil en el <head> o antes de auth-modal-overlay
const responsiveStyleTag = `<style id="diamax-pricing-mobile-fix">
  /* PREVENCIÓN DE CORTE Y OVERFLOW EN MÓVIL (320px a 768px) */
  #auth-modal-overlay {
    overflow-x: hidden !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
  }
  @media (max-width: 768px) {
    #auth-modal-overlay {
      padding: 6px !important;
      align-items: flex-start !important;
      padding-top: 10px !important;
      padding-bottom: 24px !important;
    }
    #auth-modal-dialog {
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 !important;
      border-radius: 14px !important;
      box-sizing: border-box !important;
      overflow-x: hidden !important;
    }
    .auth-modal-top-header {
      padding: 12px 14px !important;
    }
    .auth-modal-top-header h3, 
    .auth-modal-top-header .brand-title {
      font-size: 16px !important;
    }
    .auth-modal-body-scroll {
      padding: 12px 10px !important;
      max-height: calc(90vh - 90px) !important;
      box-sizing: border-box !important;
      overflow-x: hidden !important;
    }
    /* Pestañas de navegación en móvil */
    .auth-nav-tabs-bar {
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch !important;
      scrollbar-width: none !important;
      width: 100% !important;
    }
    .auth-nav-tabs-bar::-webkit-scrollbar {
      display: none !important;
    }
    .auth-tab-btn-fix {
      min-width: 105px !important;
      padding: 10px 6px !important;
      font-size: 11px !important;
      gap: 4px !important;
      white-space: nowrap !important;
    }
    /* Grid de tarjetas blancas a 1 columna en móvil */
    .diamax-white-grid-2x2x2 {
      grid-template-columns: 1fr !important;
      gap: 12px !important;
      margin-bottom: 16px !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }
    .diamax-white-card {
      padding: 14px 12px !important;
      border-radius: 12px !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }
    .diamax-white-card .plan-price {
      font-size: 26px !important;
    }
    /* Tarjeta azul de comentarista en móvil */
    .diamax-blue-commentator-card {
      padding: 12px 12px !important;
      border-radius: 12px !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }
    .diamax-blue-header-wrap {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 6px !important;
    }
    .diamax-blue-price-wrap {
      align-self: flex-start !important;
      flex-wrap: wrap !important;
    }
    .diamax-blue-pills-grid {
      grid-template-columns: 1fr !important;
      gap: 5px !important;
    }
    .diamax-blue-action-bar {
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 8px !important;
    }
    .diamax-blue-action-bar button,
    .diamax-blue-action-bar .vip-input-wrap {
      width: 100% !important;
      max-width: 100% !important;
    }
    /* Banner de prueba gratuita */
    .diamax-trial-banner-responsive {
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 10px !important;
      text-align: left !important;
      padding: 12px 12px !important;
    }
    .diamax-trial-banner-responsive button {
      width: 100% !important;
      justify-content: center !important;
    }
  }
</style>
`;

// Insertar o reemplazar el style tag
if (html.includes('id="diamax-pricing-mobile-fix"')) {
  html = html.replace(/<style id="diamax-pricing-mobile-fix">[\s\S]*?<\/style>/, responsiveStyleTag.trim());
} else {
  html = html.replace('</head>', `${responsiveStyleTag}\n</head>`);
}
console.log('✓ Tag de estilos CSS para móvil insertado en <head>');

// 2. Clases en el Header del Modal
const oldTopHeader = '<div style="background:linear-gradient(135deg, #070e1e, #0d1a38); padding:18px 24px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1);">';
const newTopHeader = '<div class="auth-modal-top-header" style="background:linear-gradient(135deg, #070e1e, #0d1a38); padding:18px 24px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); box-sizing:border-box;">';

if (html.includes(oldTopHeader)) {
  html = html.replace(oldTopHeader, newTopHeader);
  console.log('✓ auth-modal-top-header etiquetado.');
}

// 3. Clases en las Pestañas de Navegación del Modal
const oldTabsBar = '<div style="display:flex; border-bottom:1px solid #263445; background:#182331; overflow-x:auto;">';
const newTabsBar = '<div class="auth-nav-tabs-bar" style="display:flex; border-bottom:1px solid #263445; background:#182331; overflow-x:auto; width:100%; box-sizing:border-box;">';

if (html.includes(oldTabsBar)) {
  html = html.replace(oldTabsBar, newTabsBar);
  console.log('✓ auth-nav-tabs-bar etiquetado.');
}

// Asegurar que los botones de tabs tengan la clase auth-tab-btn-fix
['auth-tab-pricing-btn', 'auth-tab-register-btn', 'auth-tab-login-btn', 'auth-tab-master-btn'].forEach(id => {
  const needle = `id="${id}"`;
  if (html.includes(needle)) {
    html = html.replace(needle, `id="${id}" class="auth-tab-btn-fix"`);
  }
});
console.log('✓ Botones de tabs actualizados con auth-tab-btn-fix.');

// 4. Clases en el contenedor con scroll del cuerpo del modal
const oldBodyScroll = '<div style="padding:22px; max-height:calc(88vh - 120px); overflow-y:auto;">';
const newBodyScroll = '<div class="auth-modal-body-scroll" style="padding:22px; max-height:calc(88vh - 120px); overflow-y:auto; overflow-x:hidden; box-sizing:border-box;">';

if (html.includes(oldBodyScroll)) {
  html = html.replace(oldBodyScroll, newBodyScroll);
  console.log('✓ auth-modal-body-scroll etiquetado.');
}

// 5. Clases en la tarjeta azul de comentarista
const oldBlueCardStart = '<div style="background:linear-gradient(145deg, #091a3e, #050d22); border:1.8px solid #007AFF; border-radius:14px; padding:14px 18px; margin:0 0 16px 0; box-shadow:0 4px 20px rgba(0,122,255,0.25);">';
const newBlueCardStart = '<div class="diamax-blue-commentator-card" style="background:linear-gradient(145deg, #091a3e, #050d22); border:1.8px solid #007AFF; border-radius:14px; padding:14px 18px; margin:0 0 16px 0; box-shadow:0 4px 20px rgba(0,122,255,0.25); box-sizing:border-box;">';

if (html.includes(oldBlueCardStart)) {
  html = html.replace(oldBlueCardStart, newBlueCardStart);
  console.log('✓ diamax-blue-commentator-card etiquetado.');
}

// Etiquetar encabezado de la tarjeta azul
const oldBlueHeader = '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid rgba(0,122,255,0.2);">';
const newBlueHeader = '<div class="diamax-blue-header-wrap" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid rgba(0,122,255,0.2);">';

if (html.includes(oldBlueHeader)) {
  html = html.replace(oldBlueHeader, newBlueHeader);
  console.log('✓ diamax-blue-header-wrap etiquetado.');
}

// Etiquetar precio de la tarjeta azul
const oldBluePrice = '<div style="display:flex; align-items:baseline; gap:6px;">';
const newBluePrice = '<div class="diamax-blue-price-wrap" style="display:flex; align-items:baseline; gap:6px;">';

if (html.includes(oldBluePrice)) {
  html = html.replace(oldBluePrice, newBluePrice);
  console.log('✓ diamax-blue-price-wrap etiquetado.');
}

// Etiquetar píldoras de la tarjeta azul
const oldBluePills = '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:6px; margin-bottom:10px;">';
const newBluePills = '<div class="diamax-blue-pills-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:6px; margin-bottom:10px; box-sizing:border-box;">';

if (html.includes(oldBluePills)) {
  html = html.replace(oldBluePills, newBluePills);
  console.log('✓ diamax-blue-pills-grid etiquetado.');
}

// Etiquetar barra de acción de la tarjeta azul
const oldBlueAction = '<div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center; justify-content:space-between; background:rgba(2,6,23,0.55); border:1px solid rgba(0,122,255,0.25); border-radius:8px; padding:8px 12px; margin:0;">';
const newBlueAction = '<div class="diamax-blue-action-bar" style="display:flex; gap:10px; flex-wrap:wrap; align-items:center; justify-content:space-between; background:rgba(2,6,23,0.55); border:1px solid rgba(0,122,255,0.25); border-radius:8px; padding:8px 12px; margin:0; box-sizing:border-box;">';

if (html.includes(oldBlueAction)) {
  html = html.replace(oldBlueAction, newBlueAction);
  console.log('✓ diamax-blue-action-bar etiquetado.');
}

// Etiquetar banner de trial
const oldTrialBanner = '<div style="background:linear-gradient(135deg, rgba(0,122,255,0.12), rgba(10,24,54,0.4)); border:1px solid rgba(0,122,255,0.4); border-radius:12px; padding:12px 18px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">';
const newTrialBanner = '<div class="diamax-trial-banner-responsive" style="background:linear-gradient(135deg, rgba(0,122,255,0.12), rgba(10,24,54,0.4)); border:1px solid rgba(0,122,255,0.4); border-radius:12px; padding:12px 18px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; box-sizing:border-box;">';

if (html.includes(oldTrialBanner)) {
  html = html.replace(oldTrialBanner, newTrialBanner);
  console.log('✓ diamax-trial-banner-responsive etiquetado.');
}

fs.writeFileSync(indexPath, html, 'utf-8');
console.log('=== FIX RESPONSIVE MÓVIL APLICADO EXITOSAMENTE ===');
