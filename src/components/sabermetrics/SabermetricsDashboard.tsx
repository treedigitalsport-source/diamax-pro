import React, { useState, useMemo } from 'react';
import { Player } from '../../types/baseball';
import {
  BarChart3,
  Search,
  ArrowUpDown,
  Zap,
  Shield
} from 'lucide-react';

interface SabermetricsDashboardProps {
  roster: Player[];
}

type SortField = 'name' | 'avg' | 'obp' | 'slg' | 'ops' | 'woba' | 'iso' | 'h' | 'hr' | 'rbi';

export const SabermetricsDashboard: React.FC<SabermetricsDashboardProps> = ({ roster }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('ops');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [tabType, setTabType] = useState<'batting' | 'pitching'>('batting');

  // Enriched players with calculated sabermetrics
  const calculatedBatters = useMemo(() => {
    return roster.map(p => {
      const ab = p.ab || 28;
      const h = p.h || Math.round(ab * p.avg);
      const doubles = p.doubles || 2;
      const triples = p.triples || 0;
      const hr = p.hr || 1;
      const singles = Math.max(0, h - (doubles + triples + hr));
      const bb = p.bb || 4;
      const so = p.so || 5;
      const hbp = 0;
      const sf = 1;

      // Sabermetric formulas
      const pa = ab + bb + hbp + sf;
      const avg = ab > 0 ? (h / ab) : 0;
      const obp = pa > 0 ? (h + bb + hbp) / pa : 0;
      const tb = singles + (2 * doubles) + (3 * triples) + (4 * hr);
      const slg = ab > 0 ? (tb / ab) : 0;
      const ops = obp + slg;
      const iso = Math.max(0, slg - avg);
      
      // wOBA (Standard MLB / Sabermetric Linear Weights)
      const wobaNum = (0.69 * bb) + (0.72 * hbp) + (0.89 * singles) + (1.27 * doubles) + (1.62 * triples) + (2.10 * hr);
      const woba = pa > 0 ? (wobaNum / pa) : 0;

      // Runs Created (Bill James Basic)
      const rc = (ab + bb) > 0 ? ((h + bb) * tb) / (ab + bb) : 0;

      // BABIP
      const babipDenom = ab - so - hr + sf;
      const babip = babipDenom > 0 ? (h - hr) / babipDenom : 0;

      return {
        ...p,
        pa,
        ab,
        h,
        doubles,
        triples,
        hr,
        bb,
        so,
        tb,
        avg: p.avg || Number(avg.toFixed(3)),
        obp: p.obp || Number(obp.toFixed(3)),
        slg: p.slg || Number(slg.toFixed(3)),
        ops: p.ops || Number(ops.toFixed(3)),
        woba: p.woba || Number(woba.toFixed(3)),
        iso: p.iso || Number(iso.toFixed(3)),
        rc: Number(rc.toFixed(1)),
        babip: Number(babip.toFixed(3))
      };
    });
  }, [roster]);

  // Filtered and sorted batters
  const filteredBatters = useMemo(() => {
    return calculatedBatters
      .filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.defaultPos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.num.toString().includes(searchTerm)
      )
      .sort((a, b) => {
        let valA = a[sortField] ?? 0;
        let valB = b[sortField] ?? 0;
        if (typeof valA === 'string') valA = (valA as string).toLowerCase();
        if (typeof valB === 'string') valB = (valB as string).toLowerCase();
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [calculatedBatters, searchTerm, sortField, sortAsc]);

  // Team summary metrics
  const teamAggregates = useMemo(() => {
    const count = calculatedBatters.length;
    if (count === 0) return { avg: 0, obp: 0, slg: 0, ops: 0, woba: 0, hr: 0 };
    const sumAvg = calculatedBatters.reduce((acc, p) => acc + p.avg, 0);
    const sumObp = calculatedBatters.reduce((acc, p) => acc + p.obp, 0);
    const sumSlg = calculatedBatters.reduce((acc, p) => acc + p.slg, 0);
    const sumOps = calculatedBatters.reduce((acc, p) => acc + p.ops, 0);
    const sumWoba = calculatedBatters.reduce((acc, p) => acc + p.woba, 0);
    const totalHr = calculatedBatters.reduce((acc, p) => acc + (p.hr || 0), 0);

    return {
      avg: (sumAvg / count).toFixed(3),
      obp: (sumObp / count).toFixed(3),
      slg: (sumSlg / count).toFixed(3),
      ops: (sumOps / count).toFixed(3),
      woba: (sumWoba / count).toFixed(3),
      hr: totalHr
    };
  }, [calculatedBatters]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="bg-[#0B132B]/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              DIAMAX Sabermetrics Intelligence Hub
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Statcast Formulas
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Métricas avanzadas de producción ofensiva y rendimiento de Guerreros de Venezuela +55.
          </p>
        </div>

        {/* Tab switcher: Batting vs Pitching */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setTabType('batting')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              tabType === 'batting'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> Ofensiva
          </button>
          <button
            onClick={() => setTabType('pitching')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              tabType === 'pitching'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> Pitcheo
          </button>
        </div>
      </div>

      {/* Team Aggregates Summary Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 my-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Team AVG</div>
          <div className="text-lg font-mono font-black text-white">{teamAggregates.avg}</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Team OBP</div>
          <div className="text-lg font-mono font-black text-cyan-400">{teamAggregates.obp}</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Team SLG</div>
          <div className="text-lg font-mono font-black text-amber-400">{teamAggregates.slg}</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Team OPS</div>
          <div className="text-lg font-mono font-black text-emerald-400">{teamAggregates.ops}</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Team wOBA</div>
          <div className="text-lg font-mono font-black text-indigo-400">{teamAggregates.woba}</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Total HRs</div>
          <div className="text-lg font-mono font-black text-rose-400">{teamAggregates.hr}</div>
        </div>
      </div>

      {/* Search Input Filter */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por jugador, posición o número..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Interactive Sabermetrics Table */}
      {tabType === 'batting' ? (
        <div className="overflow-x-auto rounded-xl border border-slate-800 shadow-inner">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 text-[11px] font-bold uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Jugador</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-2 text-center">POS</th>
                <th className="py-3 px-2 text-center">B/T</th>
                <th
                  onClick={() => handleSort('avg')}
                  className="py-3 px-2 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>AVG</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('obp')}
                  className="py-3 px-2 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>OBP</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('slg')}
                  className="py-3 px-2 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>SLG</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('ops')}
                  className="py-3 px-2 text-right cursor-pointer hover:text-white font-black text-emerald-400"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>OPS</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('woba')}
                  className="py-3 px-2 text-right cursor-pointer hover:text-white font-bold text-indigo-400"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>wOBA</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('iso')}
                  className="py-3 px-2 text-right cursor-pointer hover:text-white text-amber-400"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>ISO</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-2 text-right">RC</th>
                <th className="py-3 px-2 text-right">BABIP</th>
                <th
                  onClick={() => handleSort('h')}
                  className="py-3 px-2 text-right cursor-pointer hover:text-white"
                >
                  H
                </th>
                <th
                  onClick={() => handleSort('hr')}
                  className="py-3 px-2 text-right cursor-pointer hover:text-white"
                >
                  HR
                </th>
                <th
                  onClick={() => handleSort('rbi')}
                  className="py-3 px-2 text-right cursor-pointer hover:text-white"
                >
                  RBI
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredBatters.map((player) => (
                <tr
                  key={player.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-2.5 px-3 flex items-center gap-2.5 font-sans font-semibold text-white">
                    <img
                      src={player.photo}
                      alt={player.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-700 bg-slate-800"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div>
                      <div>{player.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-normal">#{player.num}</div>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-400 font-bold font-sans">
                    {player.defaultPos}
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-400 text-[10px]">
                    {player.bats}/{player.throws}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-200">
                    {player.avg.toFixed(3)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-cyan-300">
                    {player.obp.toFixed(3)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-amber-300">
                    {player.slg.toFixed(3)}
                  </td>
                  <td className="py-2.5 px-2 text-right font-black text-emerald-400">
                    {player.ops.toFixed(3)}
                  </td>
                  <td className="py-2.5 px-2 text-right font-bold text-indigo-300">
                    {player.woba.toFixed(3)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-amber-400">
                    {player.iso.toFixed(3)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-300">
                    {player.rc}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-400">
                    {player.babip.toFixed(3)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-200">
                    {player.h}
                  </td>
                  <td className="py-2.5 px-2 text-right text-rose-400 font-bold">
                    {player.hr || 0}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-200">
                    {player.rbi || 4}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Pitching Staff View */
        <div className="overflow-x-auto rounded-xl border border-slate-800 shadow-inner">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 text-[11px] font-bold uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Lanzador</th>
                <th className="py-3 px-2 text-center">ROL</th>
                <th className="py-3 px-2 text-center">BRAZO</th>
                <th className="py-3 px-2 text-right">ERA</th>
                <th className="py-3 px-2 text-right">FIP</th>
                <th className="py-3 px-2 text-right">WHIP</th>
                <th className="py-3 px-2 text-right">IP</th>
                <th className="py-3 px-2 text-right">K/9</th>
                <th className="py-3 px-2 text-right">BB/9</th>
                <th className="py-3 px-2 text-center">LÍMITE +55</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {roster.filter(p => p.defaultPos === 'P' || p.era !== undefined).map(pitcher => (
                <tr key={pitcher.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 flex items-center gap-2.5 font-sans font-semibold text-white">
                    <img
                      src={pitcher.photo}
                      alt={pitcher.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-700 bg-slate-800"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div>
                      <div>{pitcher.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-normal">#{pitcher.num}</div>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-400 font-bold font-sans">
                    {pitcher.num === 11 ? 'Abridor 1' : 'Relevista'}
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-400 text-[10px]">
                    {pitcher.throws === 'R' ? 'Derecho' : 'Zurdo'}
                  </td>
                  <td className="py-2.5 px-2 text-right font-bold text-emerald-400">
                    {(pitcher.era || 2.45).toFixed(2)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-cyan-300">
                    {(pitcher.fip || 2.85).toFixed(2)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-200">
                    1.12
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-300">
                    14.1
                  </td>
                  <td className="py-2.5 px-2 text-right text-amber-300">
                    8.2
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-400">
                    2.1
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      75 Pitches Max
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
