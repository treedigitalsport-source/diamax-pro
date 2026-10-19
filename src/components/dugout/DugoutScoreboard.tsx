import React from 'react';
import { GameState } from '../../types/baseball';
import { Radio } from 'lucide-react';

interface DugoutScoreboardProps {
  gameState: GameState;
}

export const DugoutScoreboard: React.FC<DugoutScoreboardProps> = ({ gameState }) => {
  const currentBatter = gameState.lineup[gameState.currentBatterIndex]?.player;
  const currentPitcher = gameState.currentPitcher;

  const { runners, balls, strikes, outs } = gameState;

  return (
    <div className="bg-slate-950/95 border-2 border-emerald-500/40 rounded-2xl p-4 md:p-6 shadow-[0_0_30px_rgba(0,245,155,0.15)] relative overflow-hidden">
      {/* Background stadium grid accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

      {/* Top Banner: Venue, Status & Live Inning */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
            EN VIVO · {gameState.venue}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 px-3 py-1 rounded-full">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-300">
            {gameState.isTopInning ? '▲ ALTA' : '▼ BAJA'} INNING {gameState.currentInning}
          </span>
        </div>
      </div>

      {/* Main Score & Diamond Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Teams & Scores */}
        <div className="flex flex-col gap-2.5 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-900/60 border border-blue-500/40 flex items-center justify-center font-bold text-xs text-blue-300">
                {gameState.awayTeam.slice(0, 3).toUpperCase()}
              </div>
              <span className={`text-sm font-bold ${!gameState.isTopInning ? 'text-slate-400' : 'text-white'}`}>
                {gameState.awayTeam}
              </span>
            </div>
            <span className="text-2xl font-black font-mono text-emerald-400 tracking-tight">
              {gameState.scoreAway}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-800 w-full" />

          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center font-bold text-xs text-emerald-300">
                GVE
              </div>
              <span className={`text-sm font-bold ${gameState.isTopInning ? 'text-slate-400' : 'text-white'}`}>
                {gameState.homeTeam}
              </span>
            </div>
            <span className="text-2xl font-black font-mono text-emerald-400 tracking-tight">
              {gameState.scoreHome}
            </span>
          </div>
        </div>

        {/* Center: Base Diamond & B-S-O LED Counters */}
        <div className="flex items-center justify-around bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          {/* SVG Base Diamond */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Diamond Base Paths */}
              <polygon
                points="50,15 85,50 50,85 15,50"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="3"
              />
              {/* Home Plate */}
              <polygon points="50,83 45,88 55,88" fill="#FFFFFF" />

              {/* 1st Base */}
              <rect
                x="79"
                y="44"
                width="12"
                height="12"
                transform="rotate(45 85 50)"
                fill={runners.first ? '#F59E0B' : '#1e293b'}
                stroke={runners.first ? '#FFD700' : '#475569'}
                strokeWidth="1.5"
                className={runners.first ? 'animate-pulse drop-shadow-[0_0_8px_#F59E0B]' : ''}
              />

              {/* 2nd Base */}
              <rect
                x="44"
                y="9"
                width="12"
                height="12"
                transform="rotate(45 50 15)"
                fill={runners.second ? '#F59E0B' : '#1e293b'}
                stroke={runners.second ? '#FFD700' : '#475569'}
                strokeWidth="1.5"
                className={runners.second ? 'animate-pulse drop-shadow-[0_0_8px_#F59E0B]' : ''}
              />

              {/* 3rd Base */}
              <rect
                x="9"
                y="44"
                width="12"
                height="12"
                transform="rotate(45 15 50)"
                fill={runners.third ? '#F59E0B' : '#1e293b'}
                stroke={runners.third ? '#FFD700' : '#475569'}
                strokeWidth="1.5"
                className={runners.third ? 'animate-pulse drop-shadow-[0_0_8px_#F59E0B]' : ''}
              />
            </svg>
          </div>

          {/* B-S-O Segment Dots */}
          <div className="flex flex-col gap-2 font-mono text-xs">
            {/* Balls (3) */}
            <div className="flex items-center gap-2">
              <span className="w-4 font-bold text-slate-400">B</span>
              <div className="flex gap-1.5">
                {[1, 2, 3].map(n => (
                  <span
                    key={`b-${n}`}
                    className={`w-3.5 h-3.5 rounded-full border transition-all ${
                      balls >= n
                        ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_8px_#10B981]'
                        : 'bg-slate-800 border-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Strikes (2) */}
            <div className="flex items-center gap-2">
              <span className="w-4 font-bold text-slate-400">S</span>
              <div className="flex gap-1.5">
                {[1, 2].map(n => (
                  <span
                    key={`s-${n}`}
                    className={`w-3.5 h-3.5 rounded-full border transition-all ${
                      strikes >= n
                        ? 'bg-amber-500 border-amber-400 shadow-[0_0_8px_#F59E0B]'
                        : 'bg-slate-800 border-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Outs (2) */}
            <div className="flex items-center gap-2">
              <span className="w-4 font-bold text-slate-400">O</span>
              <div className="flex gap-1.5">
                {[1, 2].map(n => (
                  <span
                    key={`o-${n}`}
                    className={`w-3.5 h-3.5 rounded-full border transition-all ${
                      outs >= n
                        ? 'bg-red-500 border-red-400 shadow-[0_0_8px_#EF4444]'
                        : 'bg-slate-800 border-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Current Matchup: Batter vs Pitcher */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex flex-col gap-2">
          {/* Batter at plate */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                BATEA
              </span>
              <span className="text-xs font-bold text-white truncate max-w-[120px]">
                {currentBatter ? `#${currentBatter.num} ${currentBatter.name}` : 'En Espera'}
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              AVG {currentBatter?.avg?.toFixed(3).slice(1) || '.000'}
            </span>
          </div>

          {/* Pitcher on mound */}
          <div className="flex items-center justify-between border-t border-slate-800/80 pt-2">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">
                LANZA
              </span>
              <span className="text-xs font-bold text-white truncate max-w-[120px]">
                #{currentPitcher.num} {currentPitcher.name}
              </span>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-semibold">
              {gameState.pitchCount}P (ERA {currentPitcher.era?.toFixed(2) || '0.00'})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
