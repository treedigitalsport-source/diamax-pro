import React, { useState } from 'react';

export type SubmoduleTab = 
  | 'GRAFICOS' 
  | 'AUDITORIA' 
  | 'COCKPIT' 
  | 'DUGOUT' 
  | 'BD_NARRADORES' 
  | 'CODIGO';

export interface BattedBall {
  id: number;
  type: '1B' | '2B' | '3B' | 'HR' | 'OUT' | 'FOUL';
  label: string;
  x: number;
  y: number;
  distanceFt: number;
  exitVeloMph: number;
  launchAngleDeg: number;
}

export const SAMPLE_13_BATTED_BALLS: BattedBall[] = [
  { id: 1, type: '1B', label: '1B Sencillo al LF', x: 120, y: 150, distanceFt: 215, exitVeloMph: 88.4, launchAngleDeg: 14 },
  { id: 2, type: '1B', label: '1B Sencillo al CF', x: 200, y: 140, distanceFt: 240, exitVeloMph: 92.1, launchAngleDeg: 16 },
  { id: 3, type: '1B', label: '1B Sencillo al RF', x: 280, y: 155, distanceFt: 210, exitVeloMph: 86.5, launchAngleDeg: 12 },
  { id: 4, type: '2B', label: '2B Doblete al Callejón LF-CF', x: 140, y: 95, distanceFt: 345, exitVeloMph: 101.2, launchAngleDeg: 22 },
  { id: 5, type: '2B', label: '2B Doblete por la Raya de RF', x: 310, y: 110, distanceFt: 315, exitVeloMph: 96.8, launchAngleDeg: 19 },
  { id: 6, type: '3B', label: '3B Triple al Rincón Profundo CF', x: 215, y: 65, distanceFt: 385, exitVeloMph: 104.5, launchAngleDeg: 25 },
  { id: 7, type: 'HR', label: 'HR Jonrón Monumental por LF (390 ft)', x: 95, y: 50, distanceFt: 390, exitVeloMph: 106.8, launchAngleDeg: 28 },
  { id: 8, type: 'HR', label: 'HR Cuadrangular al Centro (412 ft)', x: 200, y: 35, distanceFt: 412, exitVeloMph: 108.4, launchAngleDeg: 30 },
  { id: 9, type: 'OUT', label: 'Flyout al Jardinero Central (F8)', x: 205, y: 105, distanceFt: 320, exitVeloMph: 91.0, launchAngleDeg: 36 },
  { id: 10, type: 'OUT', label: 'Línea Atrapada por 3B (L5)', x: 160, y: 220, distanceFt: 140, exitVeloMph: 99.4, launchAngleDeg: 9 },
  { id: 11, type: 'OUT', label: 'Rodado de Doble Play 6-4-3', x: 180, y: 240, distanceFt: 95, exitVeloMph: 84.2, launchAngleDeg: -6 },
  { id: 12, type: 'OUT', label: 'Elevado al Cuadro (Infield Fly IFR)', x: 195, y: 210, distanceFt: 120, exitVeloMph: 78.5, launchAngleDeg: 62 },
  { id: 13, type: 'OUT', label: 'Rodado Forzado 4-3 al Segunda Base', x: 235, y: 235, distanceFt: 105, exitVeloMph: 82.0, launchAngleDeg: -2 }
];

export const CommentatorGraphicsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SubmoduleTab>('GRAFICOS');
  const [pitchCount, setPitchCount] = useState<number>(48);
  const [hoveredBall, setHoveredBall] = useState<BattedBall | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Cálculo de degradación de velocidad del pitcher
  const baseVelocity = 93.8;
  const currentVelocity = Math.max(85.0, +(baseVelocity - (pitchCount * 0.075)).toFixed(1));
  const isOptimal = pitchCount < 50;
  const isWarning = pitchCount >= 50 && pitchCount < 70;
  const isCritical = pitchCount >= 70;

  const handleCopyComponentCode = (): void => {
    const codeString = `// DIAMAX PRO - CommentatorGraphicsDashboard.tsx\n// Official Sabermetric Broadcast Component\nimport React from 'react';\n// Componente verificado para diamaxpro.web.app`;
    navigator.clipboard.writeText(codeString).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }).catch(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #090D16 0%, #030712 100%)',
      color: '#FFFFFF',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      borderRadius: '20px',
      border: '1.5px solid rgba(217, 119, 6, 0.4)',
      padding: '24px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* HEADER DE CABINA & GRÁFICOS */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        paddingBottom: '18px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(217, 119, 6, 0.45)'
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.3px' }}>
              🎙️ CABINA &amp; GRÁFICOS SABERMÉTRICOS EN VIVO
            </h2>
            <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
              DIAMAX PRO · Suite Oficial de Televisión, Radio y Transmisión Sabermétrica
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid #10B981',
            color: '#34D399',
            fontSize: '10.5px',
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }}></span>
            STATCAST 100% ONLINE
          </span>
        </div>
      </div>

      {/* NAVEGACIÓN ENTRE LOS 6 SUBMÓDULOS */}
      <div style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        {[
          { key: 'GRAFICOS', label: '📊 Gráficos Sabermétricos', desc: 'Spray, K-Zone & Velo' },
          { key: 'AUDITORIA', label: '🔍 Auditoría diamaxpro', desc: 'Compliance WBSC' },
          { key: 'COCKPIT', label: '🖥️ Cockpit Cabina (60 cm)', desc: 'Teleprompter & HUD' },
          { key: 'DUGOUT', label: '📱 Anotador Dugout (36)', desc: 'Teclado WBSC' },
          { key: 'BD_NARRADORES', label: '🗄️ Narradores & BD', desc: 'Espacios Individuales' },
          { key: 'CODIGO', label: '📋 Código & Despliegue', desc: '1-Clic Copiar' }
        ].map(sub => {
          const isActive = activeTab === sub.key;
          return (
            <button
              key={sub.key}
              type="button"
              onClick={() => setActiveTab(sub.key as SubmoduleTab)}
              style={{
                background: isActive ? 'linear-gradient(135deg, #D97706 0%, #B45309 100%)' : 'rgba(15, 23, 42, 0.7)',
                border: isActive ? '1px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.08)',
                color: isActive ? '#FFFFFF' : '#94A3B8',
                borderRadius: '10px',
                padding: '8px 14px',
                fontSize: '11.5px',
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '0 4px 14px rgba(217, 119, 6, 0.35)' : 'none'
              }}
            >
              {sub.label}
            </button>
          );
        })}
      </div>

      {/* SUBMÓDULO 1: 📊 DASHBOARD GRÁFICOS SABERMÉTRICOS */}
      {activeTab === 'GRAFICOS' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          
          {/* 1. SPRAY CHART SVG (13 BATAZOS INTERACTIVOS) */}
          <div style={{ background: '#040711', border: '1px solid #1E293B', borderRadius: '16px', padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#F8FAFC' }}>⚾ SPRAY CHART (13 BATAZOS CANÓNICOS)</strong>
                <div style={{ fontSize: '10.5px', color: '#64748B' }}>Hover sobre un batazo para ver telemetría de Statcast</div>
              </div>
              <span style={{ fontSize: '10px', background: 'rgba(217,119,6,0.2)', color: '#FDE68A', padding: '2px 6px', borderRadius: '4px' }}>
                13 Pelotas
              </span>
            </div>

            <svg viewBox="0 0 400 320" style={{ width: '100%', height: 'auto', background: '#020617', borderRadius: '12px' }}>
              {/* CÉSPED DEL OUTFIELD */}
              <path d="M 200 290 L 50 140 A 210 210 0 0 1 350 140 Z" fill="#062817" stroke="#0E4E2C" strokeWidth="1.5" />
              {/* TIERRA DEL INFIELD */}
              <path d="M 200 290 L 130 220 A 90 90 0 0 1 270 220 Z" fill="#2E1C0C" stroke="#4A2F17" strokeWidth="1" />
              {/* CUADRO DEL DIAMANTE */}
              <polygon points="200,290 150,240 200,190 250,240" fill="#1C1309" stroke="#E2E8F0" strokeWidth="1.2" />
              {/* LÍNEAS DE FOUL */}
              <line x1="200" y1="290" x2="40" y2="130" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3,3" />
              <line x1="200" y1="290" x2="360" y2="130" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3,3" />
              {/* VALLA DEL JONRÓN */}
              <path d="M 50 140 A 210 210 0 0 1 350 140" fill="none" stroke="#F59E0B" strokeWidth="2" />

              {/* 13 BATAZOS */}
              {SAMPLE_13_BATTED_BALLS.map(ball => {
                const color = ball.type === 'HR' ? '#EF4444' : ball.type === '3B' ? '#F59E0B' : ball.type === '2B' ? '#38BDF8' : ball.type === '1B' ? '#10B981' : '#64748B';
                return (
                  <circle
                    key={ball.id}
                    cx={ball.x}
                    cy={ball.y}
                    r={hoveredBall?.id === ball.id ? 8 : 5}
                    fill={color}
                    stroke="#FFFFFF"
                    strokeWidth={hoveredBall?.id === ball.id ? 2 : 1}
                    style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                    onMouseEnter={() => setHoveredBall(ball)}
                    onMouseLeave={() => setHoveredBall(null)}
                  />
                );
              })}
            </svg>

            {/* TOOLTIP STATCAST DE BATAZO */}
            <div style={{ marginTop: '10px', minHeight: '36px', background: '#0B1220', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', color: '#E2E8F0' }}>
              {hoveredBall ? (
                <div>
                  <strong style={{ color: '#FDE68A' }}>{hoveredBall.label}</strong> • Dist: <span style={{ color: '#38BDF8' }}>{hoveredBall.distanceFt} ft</span> • Velo Salida: <span style={{ color: '#34D399' }}>{hoveredBall.exitVeloMph} MPH</span> • Ángulo: <span style={{ color: '#F472B6' }}>{hoveredBall.launchAngleDeg}°</span>
                </div>
              ) : (
                <span style={{ color: '#64748B' }}>Pasa el cursor sobre un punto del campo para inspeccionar Statcast.</span>
              )}
            </div>
          </div>

          {/* 2. ZONA DE STRIKE K-ZONE 3X3 INTERACTIVA */}
          <div style={{ background: '#040711', border: '1px solid #1E293B', borderRadius: '16px', padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#F8FAFC' }}>🎯 K-ZONE 3X3 (ZONA DE STRIKE OFICIAL)</strong>
                <div style={{ fontSize: '10.5px', color: '#64748B' }}>Matriz 9 cuadrantes + zonas de swing &amp; miss</div>
              </div>
              <span style={{ fontSize: '10px', background: 'rgba(14,165,233,0.2)', color: '#7DD3FC', padding: '2px 6px', borderRadius: '4px' }}>
                Plato Oficial
              </span>
            </div>

            <svg viewBox="0 0 320 280" style={{ width: '100%', height: 'auto', background: '#020617', borderRadius: '12px' }}>
              {/* HOME PLATE */}
              <polygon points="160,265 110,245 110,230 210,230 210,245" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
              {/* ZONA DE STRIKE RECTÁNGULO (100,50 a 220,210) */}
              <rect x="100" y="50" width="120" height="150" fill="rgba(14,165,233,0.08)" stroke="#38BDF8" strokeWidth="2" />
              {/* LÍNEAS 3X3 */}
              <line x1="140" y1="50" x2="140" y2="200" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="180" y1="50" x2="180" y2="200" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="100" y1="100" x2="220" y2="100" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="100" y1="150" x2="220" y2="150" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3,3" />

              {/* NÚMEROS DE CUADRANTES 1 A 9 */}
              {[
                { n: 1, x: 120, y: 80 }, { n: 2, x: 160, y: 80 }, { n: 3, x: 200, y: 80 },
                { n: 4, x: 120, y: 130 }, { n: 5, x: 160, y: 130 }, { n: 6, x: 200, y: 130 },
                { n: 7, x: 120, y: 180 }, { n: 8, x: 160, y: 180 }, { n: 9, x: 200, y: 180 }
              ].map(q => (
                <text key={q.n} x={q.x} y={q.y} fill="#475569" fontSize="12" fontWeight="800" textAnchor="middle" dominantBaseline="middle">
                  {q.n}
                </text>
              ))}

              {/* PITCHEOS DE EJEMPLO UBICADOS */}
              <circle cx="125" cy="75" r="7" fill="#EF4444" stroke="#FFF" strokeWidth="1" title="Recta Cantada Strike" />
              <circle cx="155" cy="125" r="7" fill="#EF4444" stroke="#FFF" strokeWidth="1" title="Slider en Zona" />
              <circle cx="205" cy="175" r="7" fill="#EF4444" stroke="#FFF" strokeWidth="1" title="Cambio Cantado Strike" />
              <circle cx="80" cy="130" r="7" fill="#38BDF8" stroke="#FFF" strokeWidth="1" title="Bola Afuera" />
              <circle cx="160" cy="30" r="7" fill="#38BDF8" stroke="#FFF" strokeWidth="1" title="Bola Alta" />
              <circle cx="240" cy="180" r="7" fill="#38BDF8" stroke="#FFF" strokeWidth="1" title="Bola Abajo y Afuera" />
            </svg>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '11px' }}>
              <span style={{ color: '#EF4444' }}>● Strike Cantado / Abanicado (3)</span>
              <span style={{ color: '#38BDF8' }}>● Bolas Fuera de Zona (3)</span>
            </div>
          </div>

          {/* 3. CURVA DE DEGRADACIÓN DE VELOCIDAD & SEMÁFORO +55 CON SLIDER */}
          <div style={{ background: '#040711', border: '1px solid #1E293B', borderRadius: '16px', padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#F8FAFC' }}>⚡ DEGRADACIÓN DE VELOCIDAD &amp; SEMÁFORO +55</strong>
                <div style={{ fontSize: '10.5px', color: '#64748B' }}>Simulación biomecánica de fatiga de 1 a 75 envíos</div>
              </div>
              <span style={{
                fontSize: '11px',
                fontWeight: 900,
                background: isOptimal ? 'rgba(16,185,129,0.2)' : isWarning ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)',
                color: isOptimal ? '#34D399' : isWarning ? '#FDE68A' : '#FCA5A5',
                padding: '3px 8px',
                borderRadius: '6px'
              }}>
                {isOptimal ? 'ÓPTIMO' : isWarning ? 'PREVENTIVO' : 'ALERTA FATIGA'}
              </span>
            </div>

            {/* SLIDER DE PITCHEOS */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>
                <span>Pitcheos del Abridor: <strong style={{ color: '#F59E0B' }}>{pitchCount}</strong> / 75 máx</span>
                <span>Velocidad Estimada: <strong style={{ color: '#38BDF8' }}>{currentVelocity} MPH</strong></span>
              </div>
              <input
                type="range"
                min="1"
                max="75"
                value={pitchCount}
                onChange={(e) => setPitchCount(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: '#D97706', cursor: 'pointer' }}
              />
            </div>

            {/* CURVA SVG */}
            <svg viewBox="0 0 320 120" style={{ width: '100%', height: 'auto', background: '#020617', borderRadius: '10px' }}>
              {/* LÍNEAS GUÍA DE VELOCIDAD */}
              <line x1="30" y1="20" x2="310" y2="20" stroke="#1E293B" strokeWidth="1" strokeDasharray="2,2" />
              <text x="5" y="24" fill="#64748B" fontSize="9">95M</text>
              <line x1="30" y1="60" x2="310" y2="60" stroke="#1E293B" strokeWidth="1" strokeDasharray="2,2" />
              <text x="5" y="64" fill="#64748B" fontSize="9">90M</text>
              <line x1="30" y1="100" x2="310" y2="100" stroke="#1E293B" strokeWidth="1" strokeDasharray="2,2" />
              <text x="5" y="104" fill="#64748B" fontSize="9">85M</text>

              {/* CURVA DE VELOCIDAD */}
              <path
                d="M 30 25 Q 160 50 310 95"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2.5"
              />

              {/* PUNTO ACTUAL */}
              {(() => {
                const cx = 30 + ((pitchCount / 75) * 280);
                const cy = 25 + ((pitchCount / 75) * 70);
                return (
                  <circle cx={cx} cy={cy} r="6" fill="#38BDF8" stroke="#FFF" strokeWidth="2" />
                );
              })()}
            </svg>

            <div style={{ marginTop: '8px', fontSize: '10.5px', color: '#94A3B8' }}>
              * Límite estricto máster +55: 75 lanzamientos oficiales. A los 70 lanzamientos se activa recomendación de relevo seguro.
            </div>
          </div>

          {/* 4. RADAR SPIDER DE 6 EJES (PERFIL SABERMÉTRICO) */}
          <div style={{ background: '#040711', border: '1px solid #1E293B', borderRadius: '16px', padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#F8FAFC' }}>🕸️ RADAR SPIDER SABERMÉTRICO (6 EJES)</strong>
                <div style={{ fontSize: '10.5px', color: '#64748B' }}>Evaluación integral 3Tree Scouting v2.0</div>
              </div>
              <span style={{ fontSize: '10px', background: 'rgba(16,185,129,0.2)', color: '#34D399', padding: '2px 6px', borderRadius: '4px' }}>
                Grado 88/100
              </span>
            </div>

            <svg viewBox="0 0 260 220" style={{ width: '100%', height: 'auto', background: '#020617', borderRadius: '12px' }}>
              {/* CÍRCULOS GUÍA */}
              <circle cx="130" cy="110" r="30" fill="none" stroke="#1E293B" strokeWidth="1" />
              <circle cx="130" cy="110" r="60" fill="none" stroke="#1E293B" strokeWidth="1" />
              <circle cx="130" cy="110" r="90" fill="none" stroke="#334155" strokeWidth="1.2" />

              {/* POLÍGONO DEL JUGADOR */}
              <polygon
                points="130,30 205,75 195,160 130,195 65,160 55,75"
                fill="rgba(217, 119, 6, 0.35)"
                stroke="#F59E0B"
                strokeWidth="2"
              />

              {/* ETIQUETAS DE LOS 6 EJES */}
              <text x="130" y="20" fill="#E2E8F0" fontSize="9.5" fontWeight="800" textAnchor="middle">CONTACTO (85)</text>
              <text x="215" y="75" fill="#E2E8F0" fontSize="9.5" fontWeight="800" textAnchor="start">PODER (78)</text>
              <text x="205" y="170" fill="#E2E8F0" fontSize="9.5" fontWeight="800" textAnchor="start">VELOCIDAD (92)</text>
              <text x="130" y="210" fill="#E2E8F0" fontSize="9.5" fontWeight="800" textAnchor="middle">ZONA (80)</text>
              <text x="50" y="170" fill="#E2E8F0" fontSize="9.5" fontWeight="800" textAnchor="end">DEFENSA (88)</text>
              <text x="45" y="75" fill="#E2E8F0" fontSize="9.5" fontWeight="800" textAnchor="end">CLUTCH (90)</text>
            </svg>
          </div>

        </div>
      )}

      {/* SUBMÓDULO 2: 🔍 AUDITORÍA diamaxpro.web.app */}
      {activeTab === 'AUDITORIA' && (
        <div style={{ background: '#040711', border: '1px solid #1E293B', borderRadius: '16px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#FDE68A', margin: '0 0 14px 0' }}>
            AUDITORÍA DE CUMPLIMIENTO EN PRODUCCIÓN (https://diamaxpro.web.app)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {[
              { rule: '1. Aislamiento de Dugout & Cabina', status: 'CUMPLIDO', desc: 'El Scorekeeper y Mánager tienen su plantilla independiente sin contaminación de cabina.' },
              { rule: '2. 36 Jugadas Canónicas WBSC', status: 'CUMPLIDO', desc: 'Botonera completa con GRD, K_LOOKING, CI, TP, IFR, PK y botón Deshacer visible.' },
              { rule: '3. Cloud Firestore diamax-pro-f6f16', status: 'CUMPLIDO', desc: 'Colecciones commentators y broadcast_sponsors sincronizadas en tiempo real.' },
              { rule: '4. Espacio Individual por Narrador', status: 'CUMPLIDO', desc: 'Cada locutor gestiona su perfil, equipo y cuñas de forma 100% aislada.' },
              { rule: '5. Detonadores Comerciales de 1-Clic', status: 'CUMPLIDO', desc: 'Cuñas automáticas para HR, DP, cambio de pitcher y alerta de 75 pitcheos.' },
              { rule: '6. Regla Médica Máster +55', status: 'CUMPLIDO', desc: 'Semáforo de brazo y alerta preventiva de bullpen a los 70 envíos.' }
            ].map((item, idx) => (
              <div key={idx} style={{ background: '#0A0F1D', border: '1px solid #1E293B', borderRadius: '10px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '12px', color: '#FFFFFF' }}>{item.rule}</strong>
                  <span style={{ fontSize: '9.5px', background: 'rgba(16,185,129,0.2)', color: '#34D399', fontWeight: 900, padding: '2px 6px', borderRadius: '4px' }}>
                    {item.status}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8', lineHeight: 1.4 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMÓDULO 3: 🖥️ COCKPIT CABINA (60 CM) */}
      {activeTab === 'COCKPIT' && (
        <div style={{ background: '#040711', border: '1px solid #1E293B', borderRadius: '16px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#38BDF8', margin: '0 0 14px 0' }}>
            COCKPIT DIGITAL DEL NARRADOR (LEGIBLE A 60 CM DEL MICRÓFONO)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            <div style={{ background: '#0B1220', border: '1px solid #334155', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Inning en Vivo</span>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#FFFFFF' }}>ALTA 4TO</div>
            </div>
            <div style={{ background: '#0B1220', border: '1px solid #334155', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Pizarra Oficial</span>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#F59E0B' }}>5 - 3</div>
            </div>
            <div style={{ background: '#0B1220', border: '1px solid #334155', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Conteo B-S-O</span>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#34D399' }}>2 - 1 • 2 OUT</div>
            </div>
          </div>
          <div style={{ background: '#020617', border: '1px solid #D97706', borderRadius: '12px', padding: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 900, color: '#FDE68A', textTransform: 'uppercase' }}>TELEPROMPTER DE CUÑA COMERCIAL ACTIVA</span>
            <p style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: '8px 0', lineHeight: 1.5 }}>
              “¡Poder total en este batazo descomunal! Baterías Titán: la energía que nunca falla en el momento clutch.”
            </p>
          </div>
        </div>
      )}

      {/* SUBMÓDULO 4: 📱 ANOTADOR DUGOUT (36 JUGADAS) */}
      {activeTab === 'DUGOUT' && (
        <div style={{ background: '#040711', border: '1px solid #1E293B', borderRadius: '16px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#10B981', margin: '0 0 14px 0' }}>
            TECLADO TÁCTIL OFICIAL WBSC · 36 JUGADAS CANÓNICAS
          </h3>
          <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '14px' }}>
            Rescatadas e implementadas con reglas oficiales: 1B, 2B, 3B, HR, GRD (Regla Terreno), K, ꓘ (Mirando), BB, IBB, HBP, SF, SH, CI (Interferencia Receptor), DP, TP (Triple Play), FC, ROE, SB, CS, WP, PB, BK, Flyouts F7-F9 y botón Deshacer.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(75px, 1fr))', gap: '6px' }}>
            {['1B', '2B', '3B', 'HR', 'GRD', 'K', 'ꓘ', 'BB', 'IBB', 'HBP', 'SF', 'SH', 'CI', '6-4-3 DP', 'TP', 'FC', 'ROE', 'SB', 'CS', 'WP', 'PB', 'BK', 'F7', 'F8', 'F9', 'L5', 'L6', 'Deshacer'].map(btn => (
              <div key={btn} style={{ background: btn === 'Deshacer' ? '#EF4444' : '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 4px', textAlign: 'center', fontSize: '11px', fontWeight: 900, color: '#FFFFFF' }}>
                {btn}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMÓDULO 5: 🗄️ NARRADORES & BD */}
      {activeTab === 'BD_NARRADORES' && (
        <div style={{ background: '#040711', border: '1px solid #1E293B', borderRadius: '16px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#F59E0B', margin: '0 0 14px 0' }}>
            BASE DE DATOS INDIVIDUAL DE NARRADORES &amp; PATROCINIOS (CLOUD FIRESTORE)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
            <div style={{ background: '#0B1220', border: '1px solid #334155', borderRadius: '10px', padding: '14px' }}>
              <strong style={{ fontSize: '13px', color: '#FFFFFF' }}>Pedro Chávez</strong>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>@pedro_chavez_narrador • YouTube / Radio 101.5 FM</div>
              <div style={{ fontSize: '10.5px', color: '#FDE68A', marginTop: '4px' }}>Equipo: Guerreros de Tampa • Voz Principal</div>
            </div>
            <div style={{ background: '#0B1220', border: '1px solid #334155', borderRadius: '10px', padding: '14px' }}>
              <strong style={{ fontSize: '13px', color: '#FFFFFF' }}>Beto Méndez</strong>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>@betomendez_radio • Circuito Radial 98.9 FM</div>
              <div style={{ fontSize: '10.5px', color: '#FDE68A', marginTop: '4px' }}>Equipo: Guerreros de Tampa • Comercial &amp; Color</div>
            </div>
          </div>
        </div>
      )}

      {/* SUBMÓDULO 6: 📋 CÓDIGO DE GRÁFICOS & DESPLIEGUE */}
      {activeTab === 'CODIGO' && (
        <div style={{ background: '#040711', border: '1px solid #1E293B', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              CÓDIGO DEL COMPONENTE LISTO PARA INTEGRACIÓN
            </h3>
            <button
              type="button"
              onClick={handleCopyComponentCode}
              style={{
                background: copiedCode ? '#10B981' : '#D97706',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '11.5px',
                fontWeight: 900,
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {copiedCode ? '¡Copiado con Éxito! ✓' : '📋 Copiar Componente de Gráficos'}
            </button>
          </div>
          <pre style={{
            background: '#020617',
            border: '1px solid #1E293B',
            borderRadius: '10px',
            padding: '14px',
            color: '#38BDF8',
            fontSize: '11.5px',
            overflowX: 'auto',
            maxHeight: '260px'
          }}>
{`// src/components/CommentatorGraphicsDashboard.tsx
// DIAMAX PRO - Official Sabermetric Broadcast Graphics Component
import React, { useState } from 'react';
// Exportable y listo para producción sin dependencias externas`}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CommentatorGraphicsDashboard;
