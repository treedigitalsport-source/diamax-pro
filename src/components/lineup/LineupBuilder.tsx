import React from 'react';
import { Player, LineupSlot } from '../../types/baseball';
import { ArrowUp, ArrowDown, Users } from 'lucide-react';

interface LineupBuilderProps {
  lineup: LineupSlot[];
  bench: Player[];
  onReorder: (newLineup: LineupSlot[]) => void;
  onSubstitute: (orderIdx: number, newPlayer: Player) => void;
}

const POSITIONS = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH'];

export const LineupBuilder: React.FC<LineupBuilderProps> = ({
  lineup,
  bench,
  onReorder,
  onSubstitute
}) => {
  const moveSlot = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= lineup.length) return;

    const copy = [...lineup];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    // Re-assign order numbers
    const updated = copy.map((slot, idx) => ({ ...slot, order: idx + 1 }));
    onReorder(updated);
  };

  const handlePosChange = (index: number, newPos: string) => {
    const copy = [...lineup];
    copy[index] = { ...copy[index], pos: newPos };
    onReorder(copy);
  };

  // Team averages
  const teamAvg = (lineup.reduce((acc, s) => acc + (s.player.avg || 0.270), 0) / 9).toFixed(3);
  const teamObp = (lineup.reduce((acc, s) => acc + (s.player.obp || 0.330), 0) / 9).toFixed(3);
  const teamSlg = (lineup.reduce((acc, s) => acc + (s.player.slg || 0.400), 0) / 9).toFixed(3);
  const teamOps = (parseFloat(teamObp) + parseFloat(teamSlg)).toFixed(3);

  return (
    <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-md">
      {/* Header & Team Averages Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            Constructor de Orden al Bate (1 - 9)
          </h2>
          <p className="text-xs text-slate-400">
            Alineación titular ofensiva para Guerreros de Venezuela +55
          </p>
        </div>

        {/* Sabermetric Team Summary Cards */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-center">
            <span className="text-[10px] text-slate-500 block">AVG EQUIPO</span>
            <span className="font-bold text-emerald-400">{teamAvg}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-center">
            <span className="text-[10px] text-slate-500 block">OBP EQUIPO</span>
            <span className="font-bold text-cyan-400">{teamObp}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-center">
            <span className="text-[10px] text-slate-500 block">SLG EQUIPO</span>
            <span className="font-bold text-amber-400">{teamSlg}</span>
          </div>
          <div className="bg-slate-900 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-center shadow-[0_0_10px_rgba(0,245,155,0.15)]">
            <span className="text-[10px] text-emerald-400 block font-bold">OPS EQUIPO</span>
            <span className="font-bold text-white">{teamOps}</span>
          </div>
        </div>
      </div>

      {/* Lineup List (1 - 9) */}
      <div className="flex flex-col gap-2">
        {lineup.map((slot, index) => {
          const { player, order, pos } = slot;
          return (
            <div
              key={`slot-${player.id}-${index}`}
              className="flex items-center justify-between bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700/80 rounded-xl p-2.5 transition-all group"
            >
              {/* Order Number & Reorder Controls */}
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveSlot(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent"
                    title="Subir en el orden"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveSlot(index, 'down')}
                    disabled={index === lineup.length - 1}
                    className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent"
                    title="Bajar en el orden"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-sm flex items-center justify-center">
                  #{order}
                </div>
              </div>

              {/* Player Identity */}
              <div className="flex items-center gap-3 flex-1 px-3">
                <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {player.photo ? (
                    <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-mono font-bold text-slate-400">#{player.num}</span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="font-bold text-sm text-white truncate flex items-center gap-1.5">
                    {player.name}
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      B: {player.bats} / L: {player.throws}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                    <span>AVG <strong className="text-slate-200">{player.avg?.toFixed(3).slice(1)}</strong></span>
                    <span>OBP <strong className="text-cyan-400">{player.obp?.toFixed(3).slice(1)}</strong></span>
                    <span>SLG <strong className="text-amber-400">{player.slg?.toFixed(3).slice(1)}</strong></span>
                  </div>
                </div>
              </div>

              {/* Position Selector */}
              <div className="flex items-center gap-2">
                <select
                  value={pos}
                  onChange={(e) => handlePosChange(index, e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-emerald-400 font-mono text-xs font-bold rounded-lg px-2.5 py-1.5 outline-none focus:border-emerald-500"
                >
                  {POSITIONS.map(p => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>

                {/* Substitute Selector from Bench */}
                {bench.length > 0 && (
                  <select
                    onChange={(e) => {
                      const selectedId = Number(e.target.value);
                      const targetPlayer = bench.find(b => b.id === selectedId);
                      if (targetPlayer) onSubstitute(index, targetPlayer);
                    }}
                    value=""
                    className="bg-slate-800/80 border border-slate-700 text-slate-300 font-mono text-xs rounded-lg px-2 py-1.5 outline-none hover:border-slate-600"
                  >
                    <option value="" disabled>
                      Sustituir...
                    </option>
                    {bench.map(b => (
                      <option key={b.id} value={b.id}>
                        #{b.num} {b.name} ({b.defaultPos})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
