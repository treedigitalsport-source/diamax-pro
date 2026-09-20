const fs = require('fs');
const path = require('path');

const coreDir = path.join(__dirname, '..', 'core');
const bundlePath = path.join(__dirname, '..', 'diamax-core-bundle.js');

function cleanModule(code) {
  return code
    .replace(/const\s*\{[\s\S]*?\}\s*=\s*require\([^)]+\);?/g, '')
    .replace(/module\.exports\s*=\s*\{[\s\S]*?\};?/g, '');
}

const f1 = cleanModule(fs.readFileSync(path.join(coreDir, 'diamax_event_core.js'), 'utf8'));
const f2 = cleanModule(fs.readFileSync(path.join(coreDir, 'diamax_game_projector.js'), 'utf8'));
const f3 = cleanModule(fs.readFileSync(path.join(coreDir, 'diamax_projector_revert.js'), 'utf8'));
const f4 = cleanModule(fs.readFileSync(path.join(coreDir, 'diamax_undo_engine.js'), 'utf8'));
const f5 = cleanModule(fs.readFileSync(path.join(coreDir, 'diamax_stat_engine.js'), 'utf8'));
const f6 = cleanModule(fs.readFileSync(path.join(coreDir, 'diamax_command_dispatcher.js'), 'utf8'));

const bundle = `/**
 * DIAMAX PRO — UNIFIED CORE BUNDLE v2.5
 * =====================================
 * 3Tree Digital Sport IA · CEO Alí Zapata · Lutz, Florida USA
 */
(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.DIAMAX_CORE = factory();
    if (typeof window !== 'undefined') {
      window.DIAMAX_DISPATCHER = new root.DIAMAX_CORE.CommandDispatcher();
    }
  }
})(typeof self !== 'undefined' ? self : this, function() {

${f1}

${f2}

${f3}

${f4}

${f5}

${f6}

  return {
    EventValidationError,
    EventValidator,
    EventStore,
    createInitialGameState,
    getActiveOffenseDefense,
    projectGameState,
    projectGameStateWithReverts,
    formatIP,
    formatDecimal,
    calculateRunAccounting,
    recalculateStatsFromEvents,
    reconcileGameStats,
    UndoEngine,
    CommandDispatcher
  };
});
`;

fs.writeFileSync(bundlePath, bundle, 'utf8');
console.log('✅ DIAMAX core bundle built successfully! Size:', bundle.length, 'bytes');
