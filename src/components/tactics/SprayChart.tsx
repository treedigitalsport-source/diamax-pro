import React, { useState, useMemo } from 'react';
import { BattedBall, BattedBallResult, Player } from '../../types/baseball';
import { Target, Activity, Flame, Wind } from 'lucide-react';

interface SprayChartProps {
  battedBalls: BattedBall[];
  selectedBatter?: Player | null;
  players?: Player[];
  onSelectBall?: (ball: BattedBall) => void;
}

export const SprayChart: React.FC<SprayChartProps> = ({
  battedBalls,
  selectedBatter,
  players = [],
  onSelectBall
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [activeBallId, setActiveBallId] = useState<string | null>(null);
  const [selectedPlayerFilter, setSelectedPlayerFilter] = useState<number | 'ALL'>('ALL');

  // Filter balls based on type and selected player
  const filteredBalls = useMemo(() => {
    return battedBalls.filter(ball => {
      const matchesPlayer = selectedPlayerFilter === 'ALL'
        ? (selectedBatter ? ball.batterId === selectedBatter.id : true)
        : ball.batterId === selectedPlayerFilter;

      if (!matchesPlayer) return false;

      if (filterType === 'ALL') return true;
      if (filterType === 'GB') return ball.result === 'GO' || ball.result === '1B';
      if (filterType === 'FB') return ball.result === 'FO' || ball.result === 'PO';
      if (filterType === 'LD') return ball.result === 'LO' || ball.result === '2B' || ball.result === '3B';
      if (filterType === 'HR') return ball.result === 'HR';
      return true;
    });
  }, [battedBalls, filterType, selectedBatter, selectedPlayerFilter]);

  // Telemetry aggregates
  const stats = useMemo(() => {
    if (filteredBalls.length === 0) {
      return { total: 0, avgExitVelo: 0, maxDistance: 0, hardHitPct: 0 };
    }
    const total = filteredBalls.length;
    const sumVelo = filteredBalls.reduce((acc, b) => acc + b.exitVeloMph, 0);
    const maxDist = Math.max(...filteredBalls.map(b => b.distanceFt));
    const hardHitCount = filteredBalls.filter(b => b.exitVeloMph >= 95).length;

    return {
      total,
      avgExitVelo: Math.round(sumVelo / total),
      maxDistance: maxDist,
      hardHitPct: Math.round((hardHitCount / total) * 100)
    };
  }, [filteredBalls]);

  const getColorByResult = (result: BattedBallResult) => {
    switch (result) {
      case 'HR':
        return '#EF4444'; // Red
      case '2B':
      case '3B':
        return '#F59E0B'; // Amber
      case '1B':
        return '#10B981'; // Green
      case 'FO':
      case 'PO':
        return '#00D2FF'; // Cyan
      case 'GO':
      case 'LO':
      default:
        return '#8B5CF6'; // Purple
    }
  };

  const getLabelByResult = (result: BattedBallResult) => {
    switch (result) {
      case 'HR': return 'Home Run';
      case '3B': return 'Triple';
      case '2B': return 'Doble';
      case '1B': return 'Sencillo';
      case 'FO': return 'Fly Out';
      case 'PO': return 'Pop Out';
      case 'GO': return 'Ground Out';
      case 'LO': return 'Line Out';
      default: return 'Contacto';
    }
  };

  return (
    <div className="bg-[#0B132B]/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Target className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              DIAMAX Spray Chart 2.0
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Vector Trajectory
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Distribución angular y vector de impacto de batazos en tiempo real.
          </p>
        </div>

        {/* Player selector filter */}
        {players.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-semibold">Bateador:</label>
            <select
              value={selectedPlayerFilter}
              onChange={(e) => setSelectedPlayerFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:border-cyan-400 focus:outline-none"
            >
              <option value="ALL">Todos los Bateadores</option>
              {players.map(p => (
                <option key={p.id} value={p.id}>
                  #{p.num} {p.name} ({p.bats})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Contactos</div>
            <div className="text-xl font-black text-white font-mono">{stats.total}</div>
          </div>
          <Activity className="w-5 h-5 text-cyan-400 opacity-60" />
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Vel. Salida Prom.</div>
            <div className="text-xl font-black text-emerald-400 font-mono">
              {stats.avgExitVelo} <span className="text-xs font-normal text-slate-400">mph</span>
            </div>
          </div>
          <Flame className="w-5 h-5 text-emerald-400 opacity-60" />
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Distancia Máx.</div>
            <div className="text-xl font-black text-amber-400 font-mono">
              {stats.maxDistance} <span className="text-xs font-normal text-slate-400">ft</span>
            </div>
          </div>
          <Wind className="w-5 h-5 text-amber-400 opacity-60" />
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Hard Hit %</div>
            <div className="text-xl font-black text-rose-400 font-mono">
              {stats.hardHitPct}<span className="text-xs font-normal text-slate-400">%</span>
            </div>
          </div>
          <Target className="w-5 h-5 text-rose-400 opacity-60" />
        </div>
      </div>

      {/* Type Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filterType === 'ALL'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          TODOS ({battedBalls.length})
        </button>
        <button
          onClick={() => setFilterType('GB')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            filterType === 'GB'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900/80 text-emerald-400 hover:text-white border border-emerald-900/30'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          RODADOS (GB)
        </button>
        <button
          onClick={() => setFilterType('FB')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            filterType === 'FB'
              ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20'
              : 'bg-slate-900/80 text-cyan-400 hover:text-white border border-cyan-900/30'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          ELEVADOS (FB)
        </button>
        <button
          onClick={() => setFilterType('LD')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            filterType === 'LD'
              ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
              : 'bg-slate-900/80 text-amber-400 hover:text-white border border-amber-900/30'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          LÍNEAS (LD)
        </button>
        <button
          onClick={() => setFilterType('HR')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            filterType === 'HR'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              : 'bg-slate-900/80 text-rose-400 hover:text-white border border-rose-900/30'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          JONRONES (HR)
        </button>
      </div>

      {/* SVG Spray Chart Field */}
      <div className="relative w-full aspect-[4/3] max-w-2xl mx-auto bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full select-none"
        >
          <defs>
            <radialGradient id="sprayGrass" cx="50%" cy="85%" r="75%">
              <stop offset="0%" stopColor="#0B2E1D" />
              <stop offset="70%" stopColor="#05170E" />
              <stop offset="100%" stopColor="#020905" />
            </radialGradient>
            <linearGradient id="foulLine" x1="50" y1="92" x2="10" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFC72C" stopOpacity="0.4" />
            </linearGradient>
            <filter id="sprayGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#00D2FF" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Outfield Grass sector */}
          <path
            d="M 50 92 L 6 36 A 65 65 0 0 1 94 36 Z"
            fill="url(#sprayGrass)"
            stroke="#1E3A2F"
            strokeWidth="0.8"
          />

          {/* Warning Track & Outfield Fence Arc */}
          <path
            d="M 6 36 A 65 65 0 0 1 94 36"
            fill="none"
            stroke="#D97706"
            strokeWidth="1.2"
            strokeDasharray="2 1.5"
            strokeOpacity="0.6"
          />
          <path
            d="M 9 39 A 61 61 0 0 1 91 39"
            fill="none"
            stroke="#1E293B"
            strokeWidth="0.5"
          />

          {/* Distance markers */}
          <text x="50" y="27" fill="#94A3B8" fontSize="2.8" fontWeight="bold" textAnchor="middle" opacity="0.6">
            385 FT
          </text>
          <text x="14" y="38" fill="#94A3B8" fontSize="2.5" fontWeight="bold" textAnchor="middle" opacity="0.6">
            320 FT
          </text>
          <text x="86" y="38" fill="#94A3B8" fontSize="2.5" fontWeight="bold" textAnchor="middle" opacity="0.6">
            320 FT
          </text>

          {/* Foul Lines */}
          <line x1="50" y1="92" x2="6" y2="36" stroke="url(#foulLine)" strokeWidth="0.8" />
          <line x1="50" y1="92" x2="94" y2="36" stroke="url(#foulLine)" strokeWidth="0.8" />

          {/* Infield Dirt Diamond */}
          <polygon
            points="50,92 68,74 50,56 32,74"
            fill="#3E2723"
            stroke="#5D4037"
            strokeWidth="0.6"
            opacity="0.75"
          />

          {/* Infield Inner Grass */}
          <polygon
            points="50,90 66,74 50,58 34,74"
            fill="#062215"
            opacity="0.9"
          />

          {/* Pitcher's Mound */}
          <circle cx="50" cy="74" r="3" fill="#4E342E" stroke="#8D6E63" strokeWidth="0.4" />
          <rect x="49" y="73.6" width="2" height="0.8" fill="#FFFFFF" rx="0.2" />

          {/* Bases */}
          <rect x="49" y="91" width="2" height="2" fill="#FFFFFF" transform="rotate(45 50 92)" />
          <rect x="67" y="73" width="2" height="2" fill="#FFFFFF" transform="rotate(45 68 74)" />
          <rect x="49" y="55" width="2" height="2" fill="#FFFFFF" transform="rotate(45 50 56)" />
          <rect x="31" y="73" width="2" height="2" fill="#FFFFFF" transform="rotate(45 32 74)" />

          {/* Trajectory Arcs & Landing Dots */}
          {filteredBalls.map((ball) => {
            const isHovered = activeBallId === ball.id;
            const ballColor = getColorByResult(ball.result);

            // Control point for smooth curved trajectory
            const midX = (50 + ball.x) / 2 + (ball.x - 50) * 0.1;
            const midY = (92 + ball.y) / 2 - 4;

            return (
              <g
                key={ball.id}
                className="cursor-pointer transition-all duration-200"
                onClick={() => onSelectBall?.(ball)}
                onMouseEnter={() => setActiveBallId(ball.id)}
                onMouseLeave={() => setActiveBallId(null)}
              >
                {/* Trajectory Flight Path */}
                <path
                  d={`M 50 92 Q ${midX} ${midY} ${ball.x} ${ball.y}`}
                  fill="none"
                  stroke={ballColor}
                  strokeWidth={isHovered ? '0.8' : '0.35'}
                  strokeDasharray={ball.result === 'HR' ? 'none' : '1.5 1'}
                  strokeOpacity={isHovered ? 0.9 : 0.4}
                />

                {/* Outer Pulse ring on hover */}
                {isHovered && (
                  <circle
                    cx={ball.x}
                    cy={ball.y}
                    r="4"
                    fill="none"
                    stroke={ballColor}
                    strokeWidth="0.5"
                    className="animate-ping"
                  />
                )}

                {/* Landing Point Dot */}
                <circle
                  cx={ball.x}
                  cy={ball.y}
                  r={isHovered ? '2.5' : '1.5'}
                  fill={ballColor}
                  stroke="#FFFFFF"
                  strokeWidth="0.4"
                  filter="url(#sprayGlow)"
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip when hovering over a batted ball */}
        {activeBallId && (
          <div className="absolute top-3 left-3 bg-slate-900/95 border border-slate-700 rounded-xl p-3 shadow-2xl backdrop-blur-md pointer-events-none text-xs max-w-xs animate-in fade-in duration-150">
            {(() => {
              const b = battedBalls.find(x => x.id === activeBallId);
              if (!b) return null;
              return (
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1">
                    <span className="font-bold text-white">{b.batterName}</span>
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase"
                      style={{ backgroundColor: `${getColorByResult(b.result)}25`, color: getColorByResult(b.result) }}
                    >
                      {getLabelByResult(b.result)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1 text-[11px] text-slate-300">
                    <div>Exit Velo: <span className="font-mono font-bold text-emerald-400">{b.exitVeloMph} mph</span></div>
                    <div>Distancia: <span className="font-mono font-bold text-amber-400">{b.distanceFt} ft</span></div>
                    <div>Ángulo: <span className="font-mono font-bold text-cyan-400">{b.launchAngleDeg}°</span></div>
                    <div>Inning: <span className="font-mono font-bold text-slate-300">#{b.inning} ({b.outs} Out)</span></div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Empty state */}
      {filteredBalls.length === 0 && (
        <div className="text-center py-8 text-slate-400 text-xs">
          No hay batazos registrados con los filtros seleccionados.
        </div>
      )}
    </div>
  );
};
