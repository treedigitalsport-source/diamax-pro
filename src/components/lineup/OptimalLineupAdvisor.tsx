import React, { useState, useEffect } from 'react';
import { Player, LineupSlot, SimulationResult } from '../../types/baseball';
import { simulateLineup, getOptimalLineup } from '../../utils/markovSimulator';
import { Sparkles, TrendingUp, Cpu, CheckCircle2, BarChart2, Zap } from 'lucide-react';

interface OptimalLineupAdvisorProps {
  currentLineup: LineupSlot[];
  onApplyOptimal: (newLineupSlots: LineupSlot[]) => void;
}

export const OptimalLineupAdvisor: React.FC<OptimalLineupAdvisorProps> = ({
  currentLineup,
  onApplyOptimal
}) => {
  const [currentResult, setCurrentResult] = useState<SimulationResult | null>(null);
  const [optimalResult, setOptimalResult] = useState<SimulationResult | null>(null);
  const [optimalPlayers, setOptimalPlayers] = useState<Player[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [applied, setApplied] = useState<boolean>(false);

  useEffect(() => {
    runComparison();
  }, [currentLineup]);

  const runComparison = () => {
    setIsSimulating(true);
    setApplied(false);

    // Run in a slight timeout to yield thread for UI rendering
    setTimeout(() => {
      const activePlayers = currentLineup.map(s => s.player);
      const curSim = simulateLineup(activePlayers, 10000);
      const optPlayers = getOptimalLineup(activePlayers);
      const optSim = simulateLineup(optPlayers, 10000);

      setCurrentResult(curSim);
      setOptimalResult(optSim);
      setOptimalPlayers(optPlayers);
      setIsSimulating(false);
    }, 50);
  };

  const handleApply = () => {
    if (optimalPlayers.length < 9) return;

    // Preserve defensive positions if possible or assign defaultPos
    const newLineupSlots: LineupSlot[] = optimalPlayers.map((player, idx) => {
      // Find previous assigned pos or use defaultPos
      const existing = currentLineup.find(s => s.player.id === player.id);
      return {
        order: idx + 1,
        player,
        pos: existing ? existing.pos : player.defaultPos
      };
    });

    onApplyOptimal(newLineupSlots);
    setApplied(true);
  };

  const deltaXR = optimalResult && currentResult
    ? (optimalResult.expectedRuns - currentResult.expectedRuns).toFixed(2)
    : '0.00';

  return (
    <div className="bg-slate-950/95 border-2 border-cyan-500/40 rounded-2xl p-4 md:p-6 shadow-[0_0_30px_rgba(0,210,255,0.15)] relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-400">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-wide">
                Asesor Sabermétrico "The Book"
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                MARKOV N = 10,000
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Simulación estocástica de 24 estados base/out para maximizar Carreras Esperadas (xR)
            </p>
          </div>
        </div>

        {/* Action Button: Apply Optimal Lineup with 1 Click */}
        <button
          onClick={handleApply}
          disabled={isSimulating || applied}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-lg active:scale-95 ${
            applied
              ? 'bg-emerald-600/80 text-white border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
              : 'bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white border border-cyan-400 shadow-[0_0_20px_rgba(0,210,255,0.3)]'
          }`}
        >
          {applied ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              ¡ORDEN ÓPTIMO APLICADO!
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300 animate-bounce" />
              APLICAR ORDEN ÓPTIMO CON 1 CLIC
            </>
          )}
        </button>
      </div>

      {/* Comparison Cards: Current vs Optimal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Card 1: Current Lineup */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
            Alineación Actual (Manual)
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-black font-mono text-white">
              {currentResult ? currentResult.expectedRuns : '---'}
            </span>
            <span className="text-xs font-mono text-slate-400">carreras esperadas / juego (xR)</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block">% Inning con Carreras</span>
              <span className="text-emerald-400 font-bold">{currentResult?.scoringInningsPct || 0}%</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block">% Rally Explosivo (≥3)</span>
              <span className="text-amber-400 font-bold">{currentResult?.explosiveRalliesPct || 0}%</span>
            </div>
          </div>
        </div>

        {/* Card 2: The Book Optimal Lineup */}
        <div className="bg-gradient-to-br from-slate-900/90 to-cyan-950/40 p-4 rounded-xl border border-cyan-500/50 relative">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Orden Optimizado ("The Book")
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              +{deltaXR} xR
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-black font-mono text-cyan-300">
              {optimalResult ? optimalResult.expectedRuns : '---'}
            </span>
            <span className="text-xs font-mono text-slate-400">carreras esperadas / juego (xR)</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block">% Inning con Carreras</span>
              <span className="text-emerald-400 font-bold">{optimalResult?.scoringInningsPct || 0}%</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block">% Rally Explosivo (≥3)</span>
              <span className="text-amber-400 font-bold">{optimalResult?.explosiveRalliesPct || 0}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested 1-9 Rationale according to The Book */}
      <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 mb-4">
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          Estrategia Sabermétrica de Construcción:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-300 font-sans">
          <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
            <strong className="text-cyan-400 font-mono">#1 & #2:</strong> Mayor OBP y wOBA élite. Generan tráfico constante sin outs y aprovechan turnos al bate adicionales.
          </div>
          <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
            <strong className="text-amber-400 font-mono">#3 & #4:</strong> Contacto consistente en #3 y máximo Slugging/ISO en #4 para limpiar bases en momentos de alta palanca.
          </div>
          <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
            <strong className="text-emerald-400 font-mono">#5 a #9:</strong> Poder secundario en #5 y orden descendente de producción ofensiva para evitar rallies cortados.
          </div>
        </div>
      </div>

      {/* Stochastic Frequency Histogram (0 to 12+ runs) */}
      {optimalResult && (
        <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800">
          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
            Distribución de Frecuencia de Carreras por Partido (N = 10,000)
          </div>
          <div className="flex items-end gap-1.5 h-20 pt-2 px-1">
            {optimalResult.runsDistribution.map((pct, runs) => {
              const maxPct = Math.max(...optimalResult.runsDistribution, 1);
              const heightPct = Math.max(8, Math.round((pct / maxPct) * 100));
              return (
                <div key={`hist-${runs}`} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-6 bg-slate-800 text-[10px] font-mono px-1.5 py-0.5 rounded text-white whitespace-nowrap transition-opacity pointer-events-none z-10">
                    {pct}% ({runs === 12 ? '12+' : runs} R)
                  </span>
                  <div
                    className={`w-full rounded-t transition-all ${
                      runs >= 4 ? 'bg-gradient-to-t from-cyan-600 to-emerald-400' : 'bg-slate-700'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[9px] font-mono text-slate-500">
                    {runs === 12 ? '12+' : runs}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
