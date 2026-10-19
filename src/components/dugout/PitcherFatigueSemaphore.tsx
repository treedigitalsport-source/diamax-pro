import React from 'react';
import { Player } from '../../types/baseball';
import { ShieldAlert, HeartPulse } from 'lucide-react';

interface PitcherFatigueSemaphoreProps {
  pitcher: Player;
  pitchCount: number;
  balls: number;
  strikes: number;
}

export const PitcherFatigueSemaphore: React.FC<PitcherFatigueSemaphoreProps> = ({
  pitcher,
  pitchCount,
  balls,
  strikes
}) => {
  const maxLimit = 75;
  const pct = Math.min(100, Math.round((pitchCount / maxLimit) * 100));

  // Determine medical status
  let statusColor = 'text-emerald-400';
  let barColor = 'bg-emerald-500 shadow-[0_0_12px_#10B981]';
  let statusBadge = 'ÓPTIMO (0-50)';
  let bgBadge = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';

  if (pitchCount >= 66) {
    statusColor = 'text-red-400';
    barColor = 'bg-red-500 shadow-[0_0_12px_#EF4444] animate-pulse';
    statusBadge = 'CRÍTICO (+55 LÍMITE)';
    bgBadge = 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse';
  } else if (pitchCount >= 51) {
    statusColor = 'text-amber-400';
    barColor = 'bg-amber-500 shadow-[0_0_12px_#F59E0B]';
    statusBadge = 'PRECAUCIÓN (51-65)';
    bgBadge = 'bg-amber-500/15 border-amber-500/40 text-amber-400';
  }

  const remaining = Math.max(0, maxLimit - pitchCount);
  const isNearLimit = pitchCount >= 70;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <HeartPulse className={`w-5 h-5 ${statusColor}`} />
          <h3 className="text-sm font-semibold tracking-wider text-slate-200 uppercase font-mono">
            Semáforo Médico +55
          </h3>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${bgBadge}`}>
          {statusBadge}
        </span>
      </div>

      {/* Pitcher Info & Count */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
            {pitcher.photo ? (
              <img src={pitcher.photo} alt={pitcher.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-mono font-bold text-slate-400">P</span>
            )}
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-tight">
              #{pitcher.num} {pitcher.name}
            </div>
            <div className="text-xs text-slate-400 font-mono">
              B: {balls} · S: {strikes} (Ratio: {pitchCount > 0 ? ((strikes / pitchCount) * 100).toFixed(0) : 0}% S)
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className={`text-2xl font-black font-mono tracking-tight ${statusColor}`}>
            {pitchCount}
            <span className="text-xs font-normal text-slate-500 font-sans"> / {maxLimit} P</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {remaining} restantes
          </div>
        </div>
      </div>

      {/* Tri-color Progress Bar */}
      <div className="w-full h-3 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/60 mb-2">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Scale markers */}
      <div className="flex justify-between text-[10px] font-mono text-slate-500 px-1 mb-2">
        <span>0</span>
        <span className="text-emerald-500/80">50</span>
        <span className="text-amber-500/80">65</span>
        <span className="text-red-500/80">75 Legal</span>
      </div>

      {/* Bullpen Legal Alert */}
      {isNearLimit && (
        <div className="mt-2.5 p-2.5 rounded-lg bg-red-950/60 border border-red-500/60 text-red-200 text-xs flex items-center gap-2 animate-bounce">
          <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div className="leading-snug">
            <span className="font-bold text-red-300">AVISO DE BULLPEN OBLIGATORIO:</span>{' '}
            El lanzador está a solo <strong className="text-white underline">{remaining} lanzamientos</strong> del descanso reglamentario de la liga (+55).
          </div>
        </div>
      )}
    </div>
  );
};
