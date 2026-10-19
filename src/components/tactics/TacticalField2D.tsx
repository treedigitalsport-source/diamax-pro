import React from 'react';
import { DefensiveShift, BattedBall } from '../../types/baseball';
import { Shield } from 'lucide-react';

interface TacticalField2DProps {
  shift: DefensiveShift;
  onShiftChange: (newShift: DefensiveShift) => void;
  onFieldClick: (x: number, y: number, distanceFt: number, exitVeloMph: number) => void;
  battedBalls: BattedBall[];
  selectedQuadrant?: number | null;
}

// Coordinates for the 7 position players across 4 shifts (P and C remain stationary)
const SHIFT_COORDINATES: Record<DefensiveShift, Record<string, { x: number; y: number }>> = {
  standard: {
    '1B': { x: 74, y: 55 },
    '2B': { x: 62, y: 44 },
    '3B': { x: 26, y: 55 },
    'SS': { x: 38, y: 44 },
    'LF': { x: 22, y: 28 },
    'CF': { x: 50, y: 18 },
    'RF': { x: 78, y: 28 }
  },
  right_shift: {
    // Overload right side of infield & outfield for extreme pull lefties
    '1B': { x: 80, y: 60 },
    '2B': { x: 72, y: 42 }, // In shallow RF grass
    'SS': { x: 55, y: 46 }, // Shifted over 2nd base bag
    '3B': { x: 36, y: 48 }, // Shifted into standard SS hole
    'LF': { x: 30, y: 24 },
    'CF': { x: 60, y: 19 },
    'RF': { x: 82, y: 30 }
  },
  infield_in: {
    // Infielders play on grass cut to cut down winning run at home
    '1B': { x: 66, y: 64 },
    '2B': { x: 56, y: 55 },
    'SS': { x: 44, y: 55 },
    '3B': { x: 34, y: 64 },
    'LF': { x: 22, y: 28 },
    'CF': { x: 50, y: 18 },
    'RF': { x: 78, y: 28 }
  },
  deep_defense: {
    // No-doubles deep outfield alignment
    '1B': { x: 74, y: 55 },
    '2B': { x: 62, y: 44 },
    '3B': { x: 26, y: 55 },
    'SS': { x: 38, y: 44 },
    'LF': { x: 18, y: 16 },
    'CF': { x: 50, y: 10 },
    'RF': { x: 82, y: 16 }
  }
};

export const TacticalField2D: React.FC<TacticalField2DProps> = ({
  shift,
  onShiftChange,
  onFieldClick,
  battedBalls,
  selectedQuadrant
}) => {
  const currentCoords = SHIFT_COORDINATES[shift];

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Home plate is at (50, 85)
    // Distance calculation: 0 at home plate, ~400ft at fence (y = 10, x = 50)
    const dx = x - 50;
    const dy = 85 - y;
    const euclidean = Math.sqrt(dx * dx + dy * dy);
    // Scale: ~75 units = 400 feet -> factor ≈ 5.33
    const distanceFt = Math.max(10, Math.min(440, Math.round(euclidean * 5.33)));

    // Simulated exit velocity based on distance
    const exitVeloMph = Math.min(115, Math.max(65, Math.round(55 + (distanceFt / 400) * 50 + (Math.random() * 8 - 4))));

    onFieldClick(Number(x.toFixed(1)), Number(y.toFixed(1)), distanceFt, exitVeloMph);
  };

  // Filter balls if quadrant is selected
  const displayBalls = selectedQuadrant
    ? battedBalls.filter(b => b.quadrant === selectedQuadrant)
    : battedBalls;

  return (
    <div className="bg-slate-950/95 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-md">
      {/* Header & Shift Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 mb-4 border-b border-slate-800 gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Terreno Táctico 2D & Turnos Defensivos
          </h2>
          <p className="text-xs text-slate-400">
            Haz clic directamente en el campo para registrar batazos en tiempo real
          </p>
        </div>

        {/* Shift Strategy Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {(['standard', 'right_shift', 'infield_in', 'deep_defense'] as DefensiveShift[]).map(s => {
            const labels: Record<DefensiveShift, string> = {
              standard: 'Estándar',
              right_shift: 'Anti-Pull (Der)',
              infield_in: 'Infield Adentro',
              deep_defense: 'No Doubles'
            };
            const isActive = shift === s;
            return (
              <button
                key={s}
                onClick={() => onShiftChange(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_#10B981]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {labels[s]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Responsive Vector SVG Field */}
      <div className="relative w-full max-w-[620px] mx-auto aspect-square bg-[#0b1b11] rounded-2xl overflow-hidden border border-emerald-900/50 shadow-inner">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full cursor-crosshair select-none"
          onClick={handleSvgClick}
        >
          {/* Outfield Grass Arc */}
          <path
            d="M 12,47 Q 50,-5 88,47 L 50,85 Z"
            fill="#0f2e1b"
            stroke="#1b4d2e"
            strokeWidth="0.5"
          />

          {/* Outfield Wall & Warning Track */}
          <path
            d="M 12,47 Q 50,-5 88,47"
            fill="none"
            stroke="#92400e"
            strokeWidth="2.5"
            strokeDasharray="1,1"
          />
          <path
            d="M 12,47 Q 50,-5 88,47"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.2"
          />

          {/* Foul Lines */}
          <line x1="50" y1="85" x2="10" y2="45" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.9" />
          <line x1="50" y1="85" x2="90" y2="45" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.9" />

          {/* Infield Dirt Diamond */}
          <polygon
            points="50,48 70,68 50,88 30,68"
            fill="#78350f"
            stroke="#b45309"
            strokeWidth="0.8"
          />

          {/* Infield Grass Island */}
          <polygon
            points="50,55 64,69 50,83 36,69"
            fill="#0f2e1b"
          />

          {/* Base Paths (White Lines) */}
          <line x1="50" y1="85" x2="68" y2="67" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.8" />
          <line x1="68" y1="67" x2="50" y2="49" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.8" />
          <line x1="50" y1="49" x2="32" y2="67" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.8" />
          <line x1="32" y1="67" x2="50" y2="85" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.8" />

          {/* Pitcher's Mound */}
          <circle cx="50" cy="67" r="3" fill="#92400e" stroke="#d97706" strokeWidth="0.5" />
          <rect x="49" y="66.5" width="2" height="0.8" fill="#FFFFFF" />

          {/* Bases */}
          <rect x="66" y="65" width="3" height="3" transform="rotate(45 67.5 66.5)" fill="#FFFFFF" />
          <rect x="48.5" y="47.5" width="3" height="3" transform="rotate(45 50 49)" fill="#FFFFFF" />
          <rect x="31" y="65" width="3" height="3" transform="rotate(45 32.5 66.5)" fill="#FFFFFF" />

          {/* Home Plate */}
          <polygon points="50,85 48.5,86.5 48.5,88 51.5,88 51.5,86.5" fill="#FFFFFF" />

          {/* Distance Text on Fence */}
          <text x="13" y="44" fill="#fbbf24" fontSize="3" fontWeight="bold" fontFamily="monospace">330'</text>
          <text x="47" y="5" fill="#fbbf24" fontSize="3" fontWeight="bold" fontFamily="monospace">400'</text>
          <text x="81" y="44" fill="#fbbf24" fontSize="3" fontWeight="bold" fontFamily="monospace">330'</text>

          {/* Pitcher and Catcher Fixed Markers */}
          <g transform="translate(50, 67)">
            <circle r="2.8" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.8" />
            <text y="0.9" fill="#FFFFFF" fontSize="2.2" fontWeight="bold" textAnchor="middle" fontFamily="monospace">P</text>
          </g>
          <g transform="translate(50, 89)">
            <circle r="2.8" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.8" />
            <text y="0.9" fill="#FFFFFF" fontSize="2.2" fontWeight="bold" textAnchor="middle" fontFamily="monospace">C</text>
          </g>

          {/* Dynamic 7 Fielders with Smooth CSS Transforms */}
          {Object.entries(currentCoords).map(([pos, { x, y }]) => (
            <g
              key={pos}
              style={{
                transform: `translate(${x}px, ${y}px)`,
                transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              <circle
                r="3"
                fill="#10b981"
                stroke="#34d399"
                strokeWidth="0.9"
                className="shadow-[0_0_8px_#10B981]"
              />
              <text
                y="1"
                fill="#030712"
                fontSize="2.2"
                fontWeight="900"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {pos}
              </text>
            </g>
          ))}

          {/* Registered Batted Balls (Spray Chart Dots) */}
          {displayBalls.map(ball => {
            let color = '#38bdf8'; // Single
            if (ball.result === '2B') color = '#3b82f6';
            if (ball.result === '3B') color = '#a855f7';
            if (ball.result === 'HR') color = '#eab308';
            if (['GO', 'FO', 'LO', 'PO'].includes(ball.result)) color = '#ef4444';

            return (
              <g key={ball.id} className="animate-fadeIn">
                {/* Trajectory line from home plate */}
                <line
                  x1="50"
                  y1="85"
                  x2={ball.x}
                  y2={ball.y}
                  stroke={color}
                  strokeWidth="0.5"
                  strokeDasharray="1,1"
                  opacity="0.6"
                />
                {/* Hit mark */}
                <circle
                  cx={ball.x}
                  cy={ball.y}
                  r="2.2"
                  fill={color}
                  stroke="#FFFFFF"
                  strokeWidth="0.6"
                />
              </g>
            );
          })}
        </svg>

        {/* Legend Overlay in Corner */}
        <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-800 text-[10px] font-mono flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" /> 1B
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> 2B
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> 3B
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" /> HR
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Out
          </div>
        </div>
      </div>
    </div>
  );
};
