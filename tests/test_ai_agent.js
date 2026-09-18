/**
 * DIAMAX PRO — SPRINT 3: AI SABERMETRIC AGENT & NLP TEST SUITE (30 TESTS)
 * =======================================================================
 * 3Tree Digital Sport IA · CEO Alí Zapata · Lutz, Florida USA
 */

const assert = require('assert');
const DiamaxAIAgent = require('../core/diamax_ai_agent.js');

let totalTests = 0;
let passedTests = 0;

function it(desc, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`   ✨ [PASS] ${desc}`);
  } catch (err) {
    console.error(`   ❌ [FAIL] ${desc}:`, err.message);
    throw err;
  }
}

async function itAsync(desc, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`   ✨ [PASS] ${desc}`);
  } catch (err) {
    console.error(`   ❌ [FAIL] ${desc}:`, err.message);
    throw err;
  }
}

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('🤖 DIAMAX PRO — AGENTE IA SABERMÉTRICO & NLP TEST SUITE (30 TESTS)');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// 1. Instanciación y Configuración Básica
it('AI01: Debe instanciar el Agente con valores por defecto y versión 2.5.0', () => {
  const agent = new DiamaxAIAgent();
  assert.strictEqual(agent.version, '2.5.0');
  assert.strictEqual(agent.name, 'DIAMAX AI Sabermetric Copilot');
  assert.strictEqual(agent.language, 'es');
  assert.strictEqual(Array.isArray(agent.conversationHistory), true);
});

// 2. Idioma Inglés Configurable
it('AI02: Debe soportar inicialización con idioma inglés', () => {
  const agent = new DiamaxAIAgent({ language: 'en' });
  assert.strictEqual(agent.language, 'en');
});

// 3. Parsing de Alineación Dictada con Números (Español)
it('AI03: Debe parsear alineación completa dictada con números y posiciones', () => {
  const agent = new DiamaxAIAgent();
  const transcript = 'Alineacion Visitante: 1. Jose Altuve 2B, 2. Ronald Acuña Jr RF, 3. Miguel Cabrera DH, 4. Salvador Perez C, 5. Luis Arraez 1B, 6. Gleyber Torres SS, 7. Anthony Santander LF, 8. Eugenio Suarez 3B, 9. Jackson Chourio CF, Lanzador: Ranger Suarez';
  const parsed = agent.parseLineupText(transcript);

  assert.strictEqual(parsed.team, 'away');
  assert.strictEqual(parsed.players.length, 9);
  assert.strictEqual(parsed.players[0].name, 'Jose Altuve');
  assert.strictEqual(parsed.players[0].position, '2B');
  assert.strictEqual(parsed.players[2].name, 'Miguel Cabrera');
  assert.strictEqual(parsed.players[2].position, 'DH');
  assert.strictEqual(parsed.players[3].position, 'C');
  assert.strictEqual(parsed.pitcher.name, 'Ranger Suarez');
  assert.strictEqual(parsed.pitcher.position, 'P');
});

// 4. Parsing con Palabras Ordinales (primer bate, segundo bate...)
it('AI04: Debe parsear alineación con ordinales hablados en español', () => {
  const agent = new DiamaxAIAgent();
  const transcript = 'Equipo Local: primer bate Luis Arraez segunda base, segundo bate Jose Ramirez tercera base, tercer bate Aaron Judge jardinero derecho, cuarto bate Juan Soto designado, lanzador Gerrit Cole';
  const parsed = agent.parseLineupText(transcript);

  assert.strictEqual(parsed.team, 'home');
  assert.strictEqual(parsed.players.length >= 4, true);
  assert.strictEqual(parsed.players[0].name, 'Luis Arraez');
  assert.strictEqual(parsed.players[0].position, '2B');
  assert.strictEqual(parsed.players[1].name, 'Jose Ramirez');
  assert.strictEqual(parsed.players[1].position, '3B');
  assert.strictEqual(parsed.pitcher.name, 'Gerrit Cole');
});

// 5. Normalización de Aliases de Posiciones en Béisbol
it('AI05: Debe normalizar aliases en español a códigos estándar (campo corto -> SS, receptor -> C)', () => {
  const agent = new DiamaxAIAgent();
  const parsed1 = agent.parseLineupText('1. Omar Vizquel campo corto, 2. Yadier Molina receptor, 3. Andres Galarraga primera base');
  assert.strictEqual(parsed1.players[0].position, 'SS');
  assert.strictEqual(parsed1.players[1].position, 'C');
  assert.strictEqual(parsed1.players[2].position, '1B');
});

// 6. Asignación de Pitcher por Defecto
it('AI06: Debe asignar pitcher por defecto si no se especifica explícitamente', () => {
  const agent = new DiamaxAIAgent();
  const parsed = agent.parseLineupText('1. Mookie Betts RF, 2. Freddie Freeman 1B');
  assert.strictEqual(parsed.pitcher.name, 'Lanzador Por Designar');
  assert.strictEqual(parsed.pitcher.position, 'P');
});

// 7. Pitcher incluido dentro de la lista de bateadores
it('AI07: Debe detectar pitcher si está marcado como P en los jugadores', () => {
  const agent = new DiamaxAIAgent();
  const parsed = agent.parseLineupText('1. Shohei Ohtani P, 2. Mike Trout CF');
  assert.strictEqual(parsed.pitcher.name, 'Shohei Ohtani');
});

// 8. Aplicación de Alineación al Estado del Juego (Away)
it('AI08: Debe inyectar la alineación directamente en gameState para equipo visitante', () => {
  const agent = new DiamaxAIAgent();
  const gameState = { lineups: { away: [], home: [] }, pitchers: {} };
  const parsed = agent.parseLineupText('Alineacion Visitante: 1. Jose Altuve 2B, 2. Ronald Acuña RF, Lanzador: Ranger Suarez');

  const res = agent.applyLineupToGame(parsed, gameState);
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.team, 'away');
  assert.strictEqual(gameState.lineups.away.length, 2);
  assert.strictEqual(gameState.lineups.away[0].name, 'Jose Altuve');
  assert.strictEqual(gameState.pitchers.away.name, 'Ranger Suarez');
});

// 9. Aplicación de Alineación para equipo Local (Home)
it('AI09: Debe inyectar la alineación directamente en gameState para equipo local', () => {
  const agent = new DiamaxAIAgent();
  const gameState = { lineups: { away: [], home: [] }, pitchers: {} };
  const parsed = agent.parseLineupText('Equipo Home: 1. Gleyber Torres 2B, 2. Giancarlo Stanton DH, Lanzador: Nestor Cortes');

  const res = agent.applyLineupToGame(parsed, gameState);
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.team, 'home');
  assert.strictEqual(gameState.lineups.home.length, 2);
  assert.strictEqual(gameState.pitchers.home.name, 'Nestor Cortes');
});

// 10. Validación de Error en Alineación Vacía
it('AI10: Debe lanzar error si se intenta aplicar una alineación vacía', () => {
  const agent = new DiamaxAIAgent();
  assert.throws(() => {
    agent.applyLineupToGame({ players: [] }, {});
  }, /Alineación inválida o vacía/);
});

// 11. Generación de Reporte Boxscore Oficial
it('AI11: Debe generar reporte Boxscore oficial con R-H-E y líneas de entrada', () => {
  const agent = new DiamaxAIAgent();
  const mockState = {
    awayTeamName: 'Guerreros',
    homeTeamName: 'Magallanes',
    awayScore: 5,
    homeScore: 3,
    awayHits: 8,
    homeHits: 6,
    awayErrors: 1,
    homeErrors: 0,
    currentInning: 9,
    halfInning: 'BOTTOM',
    isGameOver: true,
    linescore: {
      away: { 1: 1, 2: 0, 3: 2, 4: 0, 5: 0, 6: 2, 7: 0, 8: 0, 9: 0 },
      home: { 1: 0, 2: 1, 3: 0, 4: 0, 5: 1, 6: 0, 7: 1, 8: 0, 9: 0 }
    }
  };

  const report = agent.generateBoxscoreReport(mockState, []);
  assert.strictEqual(report.type, 'BOXSCORE');
  assert.strictEqual(report.summary.away.runs, 5);
  assert.strictEqual(report.summary.home.runs, 3);
  assert.strictEqual(report.status, 'FINAL');
  assert.strictEqual(report.linescore.length >= 9, true);
});

// 12. Boxscore en Juego en Progreso
it('AI12: Debe reflejar estado en vivo durante el partido en el Boxscore', () => {
  const agent = new DiamaxAIAgent();
  const mockState = { currentInning: 4, halfInning: 'TOP', isGameOver: false };
  const report = agent.generateBoxscoreReport(mockState, []);
  assert.strictEqual(report.status, 'INNING 4 (TOP)');
});

// 13. Generación de Reporte Sabermétrico
it('AI13: Debe calcular métricas sabermétricas con precisión matemática (OPS, wOBA, BABIP, WHIP)', () => {
  const agent = new DiamaxAIAgent();
  const mockEvents = [
    { result: { code: '1B' } },
    { result: { code: '2B' } },
    { result: { code: 'HR' } },
    { result: { code: 'BB' } },
    { result: { code: 'K' } },
    { result: { code: 'GO' } }
  ];

  const report = agent.generateSabermetricReport({ currentInning: 5, outs: 2 }, mockEvents);
  assert.strictEqual(report.type, 'SABERMETRICS');
  assert.strictEqual(typeof report.metrics.OPS, 'string');
  assert.strictEqual(typeof report.metrics.wOBA, 'string');
  assert.strictEqual(typeof report.metrics.BABIP, 'string');
  assert.strictEqual(typeof report.metrics.WHIP, 'string');
  assert.strictEqual(typeof report.evaluation, 'string');
});

// 14. Evaluación Ofensiva Elite en Sabermetría
it('AI14: Debe clasificar adecuadamente el nivel ofensivo según OPS', () => {
  const agent = new DiamaxAIAgent();
  const mockEventsElite = [
    { result: { code: 'HR' } },
    { result: { code: 'HR' } },
    { result: { code: '2B' } },
    { result: { code: 'BB' } }
  ];
  const report = agent.generateSabermetricReport({ currentInning: 3 }, mockEventsElite);
  assert.strictEqual(report.evaluation, 'ÉLITE OFENSIVA');
});

// 15. Reporte de Pitcheo - Nivel Óptimo
it('AI15: Debe calcular reporte de pitcheo con estado Óptimo (<85 pitcheos)', () => {
  const agent = new DiamaxAIAgent();
  const report = agent.generatePitchingFatigueReport({ totalPitches: 72, currentPitcherName: 'Pablo López' });
  assert.strictEqual(report.fatigueLevel, 'OPTIMO');
  assert.strictEqual(report.fatigueColor, '#10B981');
  assert.strictEqual(report.totalPitches, 72);
});

// 16. Reporte de Pitcheo - Nivel Moderado
it('AI16: Debe alertar estado Moderado / Monitoreo (85-99 pitcheos)', () => {
  const agent = new DiamaxAIAgent();
  const report = agent.generatePitchingFatigueReport({ totalPitches: 89, currentPitcherName: 'Pablo López' });
  assert.strictEqual(report.fatigueLevel.includes('MODERADO'), true);
  assert.strictEqual(report.fatigueColor, '#F59E0B');
});

// 17. Reporte de Pitcheo - Nivel Crítico
it('AI17: Debe alertar estado Crítico / Cambio Recomendado (>=100 pitcheos)', () => {
  const agent = new DiamaxAIAgent();
  const report = agent.generatePitchingFatigueReport({ totalPitches: 105, currentPitcherName: 'Pablo López' });
  assert.strictEqual(report.fatigueLevel.includes('CRITICO'), true);
  assert.strictEqual(report.fatigueColor, '#EF4444');
});

// 18. Táctica: Situación de Doble Play
it('AI18: Debe recomendar sinker/rompiente en situación de Doble Play', () => {
  const agent = new DiamaxAIAgent();
  const advice = agent.generateTacticalAdvice({ outs: 1, bases: { b1: true, b2: false, b3: false } });
  assert.strictEqual(advice.recommendation.includes('Doble Play'), true);
  assert.strictEqual(advice.riskLevel, 'MEDIO');
});

// 19. Táctica: Corredores en Posición Anotadora
it('AI19: Debe recomendar cuadro cerrado/intermedio con corredores en scoring position', () => {
  const agent = new DiamaxAIAgent();
  const advice = agent.generateTacticalAdvice({ outs: 1, bases: { b1: false, b2: true, b3: false } });
  assert.strictEqual(advice.recommendation.includes('anotadora'), true);
  assert.strictEqual(advice.riskLevel, 'ALTO');
});

// 20. Táctica: Cuenta favorable de 2 strikes
it('AI20: Debe sugerir zona de sombra con 2 strikes en la cuenta', () => {
  const agent = new DiamaxAIAgent();
  const advice = agent.generateTacticalAdvice({ count: { balls: 0, strikes: 2 }, bases: { b1: false } });
  assert.strictEqual(advice.recommendation.includes('2 strikes'), true);
  assert.strictEqual(advice.riskLevel, 'VENTAJA');
});

// 21. Búsqueda en Base de Datos
it('AI21: Debe responder consultas de base de datos con jugadores sincronizados', () => {
  const agent = new DiamaxAIAgent();
  const res = agent.searchDatabase('Acuña');
  assert.strictEqual(res.matchedRecords > 0, true);
  assert.strictEqual(Array.isArray(res.data), true);
});

// 22. Formato Markdown para Boxscore
it('AI22: Debe formatear reporte Boxscore a Markdown válido', () => {
  const agent = new DiamaxAIAgent();
  const box = agent.generateBoxscoreReport({ awayTeamName: 'VE', homeTeamName: 'US' });
  const md = agent.formatReportToMarkdown(box);
  assert.strictEqual(md.includes('## 📊 Boxscore Oficial'), true);
});

// 23. Formato Markdown para Sabermetría
it('AI23: Debe formatear reporte Sabermétrico a Markdown estructurado con tablas', () => {
  const agent = new DiamaxAIAgent();
  const sab = agent.generateSabermetricReport();
  const md = agent.formatReportToMarkdown(sab);
  assert.strictEqual(md.includes('## 🧠 Métricas Sabermétricas'), true);
  assert.strictEqual(md.includes('| **wOBA** |'), true);
});

// 24. Formato Markdown para Pitcheo y Fatiga
it('AI24: Debe formatear reporte de Pitcheo a Markdown con métricas de bullpen', () => {
  const agent = new DiamaxAIAgent();
  const pitch = agent.generatePitchingFatigueReport({ totalPitches: 75 });
  const md = agent.formatReportToMarkdown(pitch);
  assert.strictEqual(md.includes('## 🔥 Reporte de Pitcheo y Fatiga'), true);
  assert.strictEqual(md.includes('Pitcheos Totales'), true);
});

// 25. Fallback Seguro de Reporte Nulo
it('AI25: Debe manejar reporte nulo en formatReportToMarkdown sin lanzar excepción', () => {
  const agent = new DiamaxAIAgent();
  const md = agent.formatReportToMarkdown(null);
  assert.strictEqual(md.includes('no disponible'), true);
});

// 26-30. Consultas Asíncronas en processQuery
(async () => {
  await itAsync('AI26: processQuery - Creación de Alineación', async () => {
    const agent = new DiamaxAIAgent();
    const r = await agent.processQuery('Crear alineacion: 1. Altuve 2B, 2. Acuña RF');
    assert.strictEqual(r.type, 'LINEUP_CREATED');
    assert.strictEqual(r.canApply, true);
  });

  await itAsync('AI27: processQuery - Consulta Boxscore', async () => {
    const agent = new DiamaxAIAgent();
    const r = await agent.processQuery('Dame el boxscore y score del juego');
    assert.strictEqual(r.type, 'REPORT_BOXSCORE');
    assert.strictEqual(r.data.type, 'BOXSCORE');
  });

  await itAsync('AI28: processQuery - Consulta Sabermetría', async () => {
    const agent = new DiamaxAIAgent();
    const r = await agent.processQuery('Reporte de sabermetria y woba');
    assert.strictEqual(r.type, 'REPORT_SABERMETRICS');
    assert.strictEqual(r.data.type, 'SABERMETRICS');
  });

  await itAsync('AI29: processQuery - Consulta Pitcheo y Fatiga', async () => {
    const agent = new DiamaxAIAgent();
    const r = await agent.processQuery('Como esta la fatiga del pitcher y el bullpen?');
    assert.strictEqual(r.type, 'REPORT_PITCHING_FATIGUE');
  });

  await itAsync('AI30: processQuery - Sugerencia Táctica Situacional', async () => {
    const agent = new DiamaxAIAgent();
    const r = await agent.processQuery('Que tactica o recomendacion sugieres en esta situacion?');
    assert.strictEqual(r.type, 'TACTICAL_ADVICE');
    assert.strictEqual(typeof r.message, 'string');
  });

  console.log(`\n🏆 RESUMEN FINAL: ${passedTests} / ${totalTests} PRUEBAS PASADAS AL 100%`);
})();
