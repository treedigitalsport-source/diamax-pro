const fs = require('fs');

const targetFiles = [
  'index.html',
  'v_original_aprobada.html',
  'v6_hace_1_hora_49505bc.html',
  'v1_actual_logo_photoroom_y_planes.html'
];

// 1. Ultra-Premium 3D Skeuomorphic SVG Defs & Symbols
const skeuomorphicDefsAndSymbols = `
  <!-- ══════════════════════════════════════════════════════════════════════ -->
  <!-- 💎 SKEUOMORPHIC 3D METALLIC & LIQUID GLASS ICON SUITE (DIAMAX PRO)    -->
  <!-- ══════════════════════════════════════════════════════════════════════ -->
  <defs>
    <!-- Gradientes Metálicos y de Cristal Líquido -->
    <linearGradient id="skeuo-gold-24k" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF9D2"/>
      <stop offset="25%" stop-color="#FFD700"/>
      <stop offset="50%" stop-color="#F59E0B"/>
      <stop offset="75%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>

    <linearGradient id="skeuo-chrome-silver" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="30%" stop-color="#E2E8F0"/>
      <stop offset="55%" stop-color="#94A3B8"/>
      <stop offset="85%" stop-color="#475569"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>

    <linearGradient id="skeuo-cyan-neon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#CFF9FE"/>
      <stop offset="35%" stop-color="#38BDF8"/>
      <stop offset="70%" stop-color="#0284C7"/>
      <stop offset="100%" stop-color="#0369A1"/>
    </linearGradient>

    <linearGradient id="skeuo-emerald-gem" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D1FAE5"/>
      <stop offset="35%" stop-color="#34D399"/>
      <stop offset="70%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#064E3B"/>
    </linearGradient>

    <linearGradient id="skeuo-crimson-ruby" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEE2E2"/>
      <stop offset="35%" stop-color="#F87171"/>
      <stop offset="70%" stop-color="#DC2626"/>
      <stop offset="100%" stop-color="#7F1D1D"/>
    </linearGradient>

    <linearGradient id="skeuo-purple-amethyst" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F3E8FF"/>
      <stop offset="35%" stop-color="#C084FC"/>
      <stop offset="70%" stop-color="#9333EA"/>
      <stop offset="100%" stop-color="#581C87"/>
    </linearGradient>

    <filter id="skeuo-3d-drop" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.8"/>
      <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#00D2FF" flood-opacity="0.4"/>
    </filter>
    <filter id="skeuo-gold-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.85"/>
      <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#FFD700" flood-opacity="0.5"/>
    </filter>
    <filter id="skeuo-red-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.85"/>
      <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#EF4444" flood-opacity="0.5"/>
    </filter>

    <!-- 🔑 1. RESTABLECIMIENTO & RECUPERACIÓN DE CLAVE / CREDENCIALES (SKEUOMORPHIC 3D) -->
    <symbol id="diamax-icon-key-recovery" viewBox="0 0 24 24">
      <path d="M12 2.2L4 5.8V11.2C4 16.2 7.4 20.8 12 22C16.6 20.8 20 16.2 20 11.2V5.8L12 2.2Z" fill="rgba(2,132,199,0.25)" stroke="url(#skeuo-cyan-neon)" stroke-width="1.6" filter="url(#skeuo-3d-drop)"/>
      <path d="M12 4.2L5.8 7V11.2C5.8 15.2 8.5 18.8 12 19.8C15.5 18.8 18.2 15.2 18.2 11.2V7L12 4.2Z" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.8"/>
      <circle cx="10" cy="10" r="3.2" fill="url(#skeuo-gold-24k)" stroke="#FFFFFF" stroke-width="0.8"/>
      <circle cx="10" cy="10" r="1.2" fill="#040914"/>
      <path d="M12.3 12.3L16.8 16.8M14.8 14.8L16.2 13.4M16.5 16.5L17.8 15.2" stroke="url(#skeuo-gold-24k)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="17.2" cy="7.2" r="1" fill="#38BDF8" filter="url(#skeuo-3d-drop)"/>
    </symbol>

    <!-- 👑 2. ACCESO MAESTRO 3TREE (CORONA IMPERIAL SKEUOMORPHIC 3D) -->
    <symbol id="diamax-icon-founder-crown" viewBox="0 0 24 24">
      <path d="M3 18L4.5 9L9 13.5L12 5L15 13.5L19.5 9L21 18H3Z" fill="url(#skeuo-gold-24k)" stroke="#FFFFFF" stroke-width="0.9" stroke-linejoin="round" filter="url(#skeuo-gold-glow)"/>
      <rect x="3" y="18" width="18" height="3" rx="1.5" fill="url(#skeuo-gold-24k)" stroke="#FFFFFF" stroke-width="0.7"/>
      <circle cx="12" cy="4" r="1.6" fill="url(#skeuo-emerald-gem)" stroke="#FFFFFF" stroke-width="0.6"/>
      <circle cx="4.5" cy="8" r="1.3" fill="url(#skeuo-crimson-ruby)" stroke="#FFFFFF" stroke-width="0.5"/>
      <circle cx="19.5" cy="8" r="1.3" fill="url(#skeuo-crimson-ruby)" stroke="#FFFFFF" stroke-width="0.5"/>
      <line x1="5" y1="19.5" x2="19" y2="19.5" stroke="rgba(255,255,255,0.7)" stroke-width="0.8"/>
    </symbol>

    <!-- 🎯 3. ANOTADOR DUGOUT (MIRA TÁCTICA SKEUOMORPHIC 3D) -->
    <symbol id="diamax-icon-tactical-crosshair" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9.5" fill="rgba(0,210,255,0.12)" stroke="url(#skeuo-cyan-neon)" stroke-width="1.6" filter="url(#skeuo-3d-drop)"/>
      <circle cx="12" cy="12" r="5.5" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1"/>
      <circle cx="12" cy="12" r="2.2" fill="url(#skeuo-gold-24k)" stroke="#FFFFFF" stroke-width="0.8"/>
      <line x1="12" y1="1" x2="12" y2="6.5" stroke="url(#skeuo-cyan-neon)" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="12" y1="17.5" x2="12" y2="23" stroke="url(#skeuo-cyan-neon)" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="1" y1="12" x2="6.5" y2="12" stroke="url(#skeuo-cyan-neon)" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="17.5" y1="12" x2="23" y2="12" stroke="url(#skeuo-cyan-neon)" stroke-width="1.8" stroke-linecap="round"/>
    </symbol>

    <!-- 📋 4. LINEUP BUILDER & DICTADO (SKEUOMORPHIC 3D) -->
    <symbol id="diamax-icon-lineup-dictate" viewBox="0 0 24 24">
      <rect x="4" y="4" width="16" height="17" rx="3" fill="rgba(15,23,42,0.9)" stroke="url(#skeuo-cyan-neon)" stroke-width="1.6" filter="url(#skeuo-3d-drop)"/>
      <path d="M8.5 2.5H15.5C16 2.5 16.5 3 16.5 3.5V5.5H7.5V3.5C7.5 3 8 2.5 8.5 2.5Z" fill="url(#skeuo-gold-24k)" stroke="#FFFFFF" stroke-width="0.8"/>
      <line x1="7.5" y1="9.5" x2="16.5" y2="9.5" stroke="url(#skeuo-cyan-neon)" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="7.5" y1="13.5" x2="14.5" y2="13.5" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="7.5" y1="17.5" x2="11.5" y2="17.5" stroke="url(#skeuo-gold-24k)" stroke-width="1.5" stroke-linecap="round"/>
    </symbol>

    <!-- 🏟️ 5. CAMPO DE BÉISBOL 3D (SKEUOMORPHIC) -->
    <symbol id="diamax-icon-nav-field" viewBox="0 0 24 24">
      <path d="M12 2L2 12C7 19 12 22 12 22C12 22 17 19 22 12L12 2Z" fill="url(#skeuo-emerald-gem)" stroke="#FFFFFF" stroke-width="1.2" stroke-linejoin="round" filter="url(#skeuo-3d-drop)"/>
      <polygon points="12,18 7,13 12,8 17,13" fill="rgba(180,83,9,0.85)" stroke="url(#skeuo-gold-24k)" stroke-width="1"/>
      <circle cx="12" cy="13" r="1.5" fill="#FFFFFF" filter="url(#skeuo-3d-drop)"/>
      <circle cx="12" cy="18" r="1" fill="#FFFFFF"/>
      <circle cx="7" cy="13" r="1" fill="#FFFFFF"/>
      <circle cx="17" cy="13" r="1" fill="#FFFFFF"/>
      <circle cx="12" cy="8" r="1" fill="#FFFFFF"/>
    </symbol>

    <!-- 📜 6. HOJA DE ROSTER & MANUAL (SKEUOMORPHIC 3D) -->
    <symbol id="diamax-icon-roster-sheet" viewBox="0 0 24 24">
      <path d="M5 3C4.4 3 4 3.4 4 4V20C4 20.6 4.4 21 5 21H19C19.6 21 20 20.6 20 20V8L15 3H5Z" fill="rgba(15,23,42,0.95)" stroke="url(#skeuo-cyan-neon)" stroke-width="1.6" filter="url(#skeuo-3d-drop)"/>
      <polygon points="15,3 20,8 15,8" fill="url(#skeuo-gold-24k)" stroke="#FFFFFF" stroke-width="0.8"/>
      <line x1="7" y1="11" x2="17" y2="11" stroke="#FFFFFF" stroke-width="1.3" stroke-linecap="round"/>
      <line x1="7" y1="14.5" x2="15" y2="14.5" stroke="url(#skeuo-cyan-neon)" stroke-width="1.3" stroke-linecap="round"/>
      <line x1="7" y1="18" x2="12" y2="18" stroke="url(#skeuo-gold-24k)" stroke-width="1.3" stroke-linecap="round"/>
    </symbol>

    <!-- 📊 7. TARJETA OFICIAL WBSC / BOXSCORE MATRIX (SKEUOMORPHIC 3D) -->
    <symbol id="diamax-icon-boxscore-matrix" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="16" rx="3" fill="rgba(8,16,34,0.95)" stroke="url(#skeuo-gold-24k)" stroke-width="1.6" filter="url(#skeuo-gold-glow)"/>
      <line x1="3" y1="9.5" x2="21" y2="9.5" stroke="url(#skeuo-gold-24k)" stroke-width="1.2"/>
      <line x1="9" y1="4" x2="9" y2="20" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
      <line x1="15" y1="4" x2="15" y2="20" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
      <circle cx="6" cy="6.8" r="1.3" fill="url(#skeuo-cyan-neon)"/>
      <circle cx="12" cy="6.8" r="1.3" fill="url(#skeuo-cyan-neon)"/>
      <circle cx="18" cy="6.8" r="1.3" fill="url(#skeuo-cyan-neon)"/>
      <circle cx="6" cy="14.5" r="1.2" fill="#FFFFFF"/>
      <circle cx="12" cy="14.5" r="1.2" fill="url(#skeuo-gold-24k)"/>
      <circle cx="18" cy="14.5" r="1.2" fill="#FFFFFF"/>
    </symbol>

    <!-- 🧠 8. SABERMETRIC BRAIN & IA (SKEUOMORPHIC 3D) -->
    <symbol id="diamax-icon-sabermetric-brain" viewBox="0 0 24 24">
      <path d="M9.5 3.5C7 3.5 5 5.5 5 8C5 9.2 5.5 10.3 6.3 11C5.5 11.7 5 12.8 5 14C5 15.9 6.4 17.5 8.2 17.9C8.6 19.7 10.2 21 12 21C13.8 21 15.4 19.7 15.8 17.9C17.6 17.5 19 15.9 19 14C19 12.8 18.5 11.7 17.7 11C18.5 10.3 19 9.2 19 8C19 5.5 17 3.5 14.5 3.5C13.6 3.5 12.7 3.8 12 4.3C11.3 3.8 10.4 3.5 9.5 3.5Z" fill="url(#skeuo-purple-amethyst)" stroke="#FFFFFF" stroke-width="1.2" filter="url(#skeuo-3d-drop)"/>
      <line x1="12" y1="5" x2="12" y2="19" stroke="url(#skeuo-cyan-neon)" stroke-width="1.5" stroke-dasharray="1 2"/>
      <circle cx="9" cy="8" r="1.5" fill="url(#skeuo-cyan-neon)" filter="url(#skeuo-3d-drop)"/>
      <circle cx="15" cy="8" r="1.5" fill="url(#skeuo-cyan-neon)" filter="url(#skeuo-3d-drop)"/>
      <circle cx="9" cy="14" r="1.5" fill="url(#skeuo-gold-24k)"/>
      <circle cx="15" cy="14" r="1.5" fill="url(#skeuo-gold-24k)"/>
    </symbol>

    <!-- 🤖 9. ASISTENTE IA SABERMÉTRICO (QUANTUM NEURO-CORE 3D) -->
    <symbol id="diamax-icon-ai-core" viewBox="0 0 24 24">
      <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill="rgba(6,12,28,0.95)" stroke="url(#skeuo-cyan-neon)" stroke-width="1.8" filter="url(#skeuo-3d-drop)"/>
      <polygon points="12,6 18,9.5 18,14.5 12,18 6,14.5 6,9.5" fill="rgba(2,132,199,0.35)" stroke="url(#skeuo-gold-24k)" stroke-width="1.2"/>
      <circle cx="12" cy="12" r="3" fill="url(#skeuo-cyan-neon)" stroke="#FFFFFF" stroke-width="0.8" filter="url(#skeuo-3d-drop)"/>
      <line x1="12" y1="2" x2="12" y2="6" stroke="#FFFFFF" stroke-width="1.2"/>
      <line x1="3" y1="7" x2="6" y2="9.5" stroke="#FFFFFF" stroke-width="1.2"/>
      <line x1="21" y1="7" x2="18" y2="9.5" stroke="#FFFFFF" stroke-width="1.2"/>
    </symbol>

    <!-- 👑 10. INSIGNIA MANAGER / PERFIL & SEDE (SKEUOMORPHIC 3D) -->
    <symbol id="diamax-icon-manager-badge" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9.5" fill="url(#skeuo-gold-24k)" stroke="#FFFFFF" stroke-width="1.2" filter="url(#skeuo-gold-glow)"/>
      <circle cx="12" cy="12" r="7.5" fill="rgba(6,12,28,0.92)" stroke="rgba(255,255,255,0.4)" stroke-width="0.8"/>
      <polygon points="12,7 13.5,10.5 17.5,11 14.5,13.8 15.2,17.5 12,15.5 8.8,17.5 9.5,13.8 6.5,11 10.5,10.5" fill="url(#skeuo-gold-24k)" stroke="#FFFFFF" stroke-width="0.6"/>
    </symbol>

    <!-- ⚙️ 11. ENGRANAJE DE PRECISIÓN CONFIGURACIÓN (SKEUOMORPHIC 3D) -->
    <symbol id="diamax-icon-gear-precision" viewBox="0 0 24 24">
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" fill="url(#skeuo-gold-24k)" stroke="#FFFFFF" stroke-width="0.8"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" fill="url(#skeuo-chrome-silver)" stroke="#FFFFFF" stroke-width="1" filter="url(#skeuo-3d-drop)"/>
    </symbol>

    <!-- 🔄 12. REFRESCAR BASE DE DATOS (SKEUOMORPHIC 3D) -->
    <symbol id="diamax-icon-db-refresh" viewBox="0 0 24 24">
      <path d="M21.5 2v6h-6M2.5 22v-6h6" stroke="url(#skeuo-crimson-ruby)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M3.5 12a8.5 8.5 0 0 1 14.5-6l3.5 2M20.5 12a8.5 8.5 0 0 1-14.5 6l-3.5-2" fill="none" stroke="url(#skeuo-crimson-ruby)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" filter="url(#skeuo-red-glow)"/>
    </symbol>

    <!-- ☀️ 13. SOL / NOCHE ALTO CONTRASTE (SKEUOMORPHIC 3D) -->
    <symbol id="diamax-icon-sun-moon" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5" fill="url(#skeuo-gold-24k)" stroke="#FFFFFF" stroke-width="1" filter="url(#skeuo-gold-glow)"/>
      <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="url(#skeuo-gold-24k)" stroke-width="2" stroke-linecap="round"/>
      <path d="M12 7a5 5 0 0 0 5 5 5 5 0 0 1-5-5Z" fill="#040914" opacity="0.75"/>
    </symbol>

    <!-- 🏟️ 14. ESTADIO CARGAR NUEVO JUEGO (SKEUOMORPHIC 3D) -->
    <symbol id="diamax-icon-stadium-gate" viewBox="0 0 24 24">
      <ellipse cx="12" cy="12" rx="9.5" ry="6.5" fill="rgba(6,12,28,0.95)" stroke="url(#skeuo-cyan-neon)" stroke-width="1.6" filter="url(#skeuo-3d-drop)"/>
      <polygon points="12,15 9,12 12,9 15,12" fill="url(#skeuo-emerald-gem)" stroke="url(#skeuo-gold-24k)" stroke-width="0.8"/>
      <path d="M4 12c0-3 3.6-5 8-5s8 2 8 5" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-dasharray="2 2"/>
    </symbol>

    <!-- 🛡️ 15. CERTIFICADO DE SEGURIDAD / CHECK VERIFIED (SKEUOMORPHIC 3D) -->
    <symbol id="diamax-icon-shield-cert" viewBox="0 0 24 24">
      <path d="M12 2L4 5v6c0 5.5 3.4 10.7 8 12 4.6-1.3 8-6.5 8-12V5l-8-3z" fill="url(#skeuo-emerald-gem)" stroke="#FFFFFF" stroke-width="1.2" filter="url(#skeuo-3d-drop)"/>
      <polyline points="8.5 11.5 11 14 16 9" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </symbol>

    <!-- 💎 16. TIERS OFICIALES SKEUOMORPHIC (TEAM, CLUB, LEAGUE, ENTERPRISE) -->
    <symbol id="diamax-icon-tier-team" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" fill="rgba(2,132,199,0.3)" stroke="url(#skeuo-cyan-neon)" stroke-width="1.8" filter="url(#skeuo-3d-drop)"/>
      <path d="M12 6L14 10H18L14.8 12.5L16 17L12 14.5L8 17L9.2 12.5L6 10H10L12 6Z" fill="url(#skeuo-gold-24k)" stroke="#FFFFFF" stroke-width="0.6"/>
    </symbol>

    <symbol id="diamax-icon-tier-club" viewBox="0 0 24 24">
      <polygon points="12,3 20,7 20,17 12,21 4,17 4,7" fill="rgba(5,150,105,0.3)" stroke="url(#skeuo-emerald-gem)" stroke-width="1.8" filter="url(#skeuo-3d-drop)"/>
      <circle cx="12" cy="12" r="4.5" fill="url(#skeuo-gold-24k)" stroke="#FFFFFF" stroke-width="0.8"/>
    </symbol>

    <symbol id="diamax-icon-tier-league" viewBox="0 0 24 24">
      <path d="M12 2L4 6v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V6l-8-4z" fill="rgba(217,119,6,0.3)" stroke="url(#skeuo-gold-24k)" stroke-width="1.8" filter="url(#skeuo-gold-glow)"/>
      <polygon points="12,6 14,10 18,10.5 15,13.5 16,17.5 12,15 8,17.5 9,13.5 6,10.5 10,10" fill="#FFFFFF"/>
    </symbol>

    <symbol id="diamax-icon-tier-enterprise" viewBox="0 0 24 24">
      <polygon points="12,2 22,8 18,20 6,20 2,8" fill="rgba(147,51,234,0.35)" stroke="url(#skeuo-purple-amethyst)" stroke-width="1.8" filter="url(#skeuo-3d-drop)"/>
      <circle cx="12" cy="12" r="5" fill="url(#skeuo-gold-24k)" stroke="#FFFFFF" stroke-width="0.8"/>
      <circle cx="12" cy="12" r="2" fill="#FFFFFF"/>
    </symbol>
  </defs>
`;

// 2. Liquid Glass CSS Architecture (Apple VisionOS Luxury Translucent Material)
const liquidGlassMasterCSS = `
/* ========================================================================== */
/* 💎 DIAMAX PRO — ULTRA-LUXURY LIQUID GLASS & SKEUOMORPHIC DESIGN SYSTEM   */
/* ========================================================================== */

:root {
  --liquid-glass-bg: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%), rgba(6, 12, 28, 0.78);
  --liquid-glass-border: 1px solid rgba(255, 255, 255, 0.16);
  --liquid-glass-shadow: inset 0 1px 1.5px rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.5), 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 210, 255, 0.12);
  --liquid-glass-blur: blur(28px) saturate(200%);
}

/* Base Liquid Glass Classes */
.liquid-glass,
.glass-panel,
.game-ribbon,
.header,
#main-nav.nav,
.modal-card,
#auth-modal-overlay > div,
#p2-wizard-container,
.ai-tactical-card,
.scoreboard,
.keypad-container,
.batter-card,
.pitcher-card,
.bullpen-card,
.boxscore-table-container {
  background: var(--liquid-glass-bg) !important;
  backdrop-filter: var(--liquid-glass-blur) !important;
  -webkit-backdrop-filter: var(--liquid-glass-blur) !important;
  border: var(--liquid-glass-border) !important;
  box-shadow: var(--liquid-glass-shadow) !important;
  border-radius: 20px !important;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

/* Liquid Glass Hover & Interactive Highlights */
.liquid-glass-hover:hover,
.nav button:hover:not(.active),
.btn-settings:hover,
.btn-new-game:hover {
  border-color: #00D2FF !important;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.6), 0 0 25px rgba(0, 210, 255, 0.45) !important;
  transform: translateY(-2px) scale(1.015) !important;
}

/* Skeuomorphic 3D Icon Container Glow */
.skeuo-icon-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 4px 14px rgba(0, 0, 0, 0.5);
  padding: 6px;
  transition: all 0.25s ease;
}

.skeuo-icon-badge:hover {
  transform: scale(1.08) rotate(2deg);
  border-color: #00D2FF;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.7), 0 0 20px rgba(0, 210, 255, 0.6);
}
`;

function applyLiquidGlassAndIcons(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Inject or update Skeuomorphic SVG Defs & Symbols
  const skeuoMarker = '<!-- 💎 SKEUOMORPHIC 3D METALLIC & LIQUID GLASS ICON SUITE (DIAMAX PRO) -->';
  if (content.includes(skeuoMarker)) {
    content = content.replace(
      /<!-- 💎 SKEUOMORPHIC 3D METALLIC[\s\S]*?<\/defs>/,
      `${skeuomorphicDefsAndSymbols.trim()}`
    );
  } else if (content.includes('</defs>')) {
    // Replace the first </defs> block
    content = content.replace('</defs>', `${skeuomorphicDefsAndSymbols.trim()}\n  </defs>`);
  }

  // 2. Inject or update Liquid Glass Master CSS
  const cssMarker = '/* 💎 DIAMAX PRO — ULTRA-LUXURY LIQUID GLASS & SKEUOMORPHIC DESIGN SYSTEM */';
  if (content.includes(cssMarker)) {
    content = content.replace(
      /\/\* 💎 DIAMAX PRO — ULTRA-LUXURY LIQUID GLASS[\s\S]*?\/\* End Liquid Glass \*\//,
      `${liquidGlassMasterCSS.trim()}\n/* End Liquid Glass */`
    );
  } else if (content.includes('</style>')) {
    content = content.replace('</style>', `${liquidGlassMasterCSS.trim()}\n/* End Liquid Glass */\n</style>`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully upgraded ${filePath} to Liquid Glass & Skeuomorphic 3D Icons.`);
}

targetFiles.forEach(f => applyLiquidGlassAndIcons(f));
