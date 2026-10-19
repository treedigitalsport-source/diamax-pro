import React, { useState } from 'react';
import { Player } from '../../types/baseball';
import { Info, Flame, Snowflake, AlertCircle, Crosshair } from 'lucide-react';

interface ZoneProfile {
  zone: number;
  avg: string;
  whiff: string;
  slg: string;
  pitches: number;
  status: 'sz-hot' | 'sz-neutral' | 'sz-cold';
  label: string;
  recommendation: string;
}

const ZONE_PROFILES: Record<number, ZoneProfile> = {
  1: { zone: 1, avg: '.345', whiff: '14%', slg: '.580', pitches: 84, status: 'sz-hot', label: 'Arriba - Adentro', recommendation: 'Peligro de jale con poder. Evitar rectas altas pegadas.' },
  2: { zone: 2, avg: '.290', whiff: '21%', slg: '.420', pitches: 92, status: 'sz-neutral', label: 'Arriba - Centro', recommendation: 'Zona de sacrificio. Efectivo con rectas de 4 costuras elevadas.' },
  3: { zone: 3, avg: '.180', whiff: '42%', slg: '.240', pitches: 76, status: 'sz-cold', label: 'Arriba - Afuera', recommendation: 'Zona de ponche. Slider o cutter quebrando fuera de zona.' },
  4: { zone: 4, avg: '.380', whiff: '11%', slg: '.640', pitches: 110, status: 'sz-hot', label: 'Medio - Adentro', recommendation: 'Zona roja de contacto pleno. Prohibido lanzar rompientes colgados.' },
  5: { zone: 5, avg: '.310', whiff: '18%', slg: '.490', pitches: 135, status: 'sz-hot', label: 'Centro - Corazón', recommendation: 'Centro de la zona. Mayor daño registrado en líneas sólidas.' },
  6: { zone: 6, avg: '.210', whiff: '38%', slg: '.310', pitches: 88, status: 'sz-cold', label: 'Medio - Afuera', recommendation: 'Zona vulnerable. Lanzar sinker buscando rodado a la banda contraria.' },
  7: { zone: 7, avg: '.260', whiff: '28%', slg: '.360', pitches: 95, status: 'sz-neutral', label: 'Abajo - Adentro', recommendation: 'Riesgo moderado. Utilizar cambio de velocidad enterrado.' },
  8: { zone: 8, avg: '.225', whiff: '34%', slg: '.290', pitches: 104, status: 'sz-cold', label: 'Abajo - Centro', recommendation: 'Zona de roletazos. Sinker o splitter en la rodilla baja.' },
  9: { zone: 9, avg: '.160', whiff: '49%', slg: '.190', pitches: 118, status: 'sz-cold', label: 'Abajo - Afuera', recommendation: 'Máxima efectividad de ponche. Slider barredor hacia el suelo.' }
};

interface StrikeZoneHeatmapProps {
  player?: Player | null;
  onSelectZone?: (zone: number) => void;
}

export const StrikeZoneHeatmap: React.FC<StrikeZoneHeatmapProps> = ({
  player,
  onSelectZone
}) => {
  const [selectedZone, setSelectedZone] = useState<number>(5);
  const [stance, setStance] = useState<'R' | 'L'>(player?.bats === 'L' ? 'L' : 'R');

  const activeProfile = ZONE_PROFILES[selectedZone] || ZONE_PROFILES[5];

  const handleZoneClick = (z: number) => {
    setSelectedZone(z);
    onSelectZone?.(z);
  };

  const getHeatBg = (status: 'sz-hot' | 'sz-neutral' | 'sz-cold') => {
    switch (status) {
      case 'sz-hot':
        return 'bg-rose-500/25 border-rose-500 text-rose-200 hover:bg-rose-500/40';
      case 'sz-neutral':
        return 'bg-amber-500/20 border-amber-500 text-amber-200 hover:bg-amber-500/35';
      case 'sz-cold':
      default:
        return 'bg-sky-500/20 border-sky-500 text-sky-200 hover:bg-sky-500/35';
    }
  };

  return (
    <div className="bg-[#0B132B]/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Crosshair className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              Matriz de Zona de Strike 3x3
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Heatmap Sabermétrico
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tendencia de contacto, Whiff % y efectividad por cuadrante oficial (MLB Statcast 9-Grid).
          </p>
        </div>

        {/* Batter Stance Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setStance('R')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              stance === 'R'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bateador Derecho (R)
          </button>
          <button
            onClick={() => setStance('L')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              stance === 'L'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bateador Zurdo (L)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-5 items-center">
        {/* 3x3 Interactive Strike Zone Grid */}
        <div className="md:col-span-6 flex flex-col items-center">
          <div className="text-xs text-slate-400 font-semibold mb-2 flex items-center gap-2">
            <span>Perspectiva: Receptor / Árbitro</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 rounded text-slate-300">
              {stance === 'R' ? 'Caja Derecha' : 'Caja Zurda'}
            </span>
          </div>

          <div className="relative p-3 bg-slate-950/80 rounded-2xl border-2 border-slate-700 shadow-2xl">
            {/* Batter silhouette hint */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-600 uppercase tracking-widest writing-mode-vertical ${
                stance === 'R' ? '-left-6' : '-right-6'
              }`}
            >
              [BATEADOR]
            </div>

            {/* 3x3 Quadrants Grid */}
            <div className="grid grid-cols-3 gap-2 w-64 h-64">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((zoneNum) => {
                const prof = ZONE_PROFILES[zoneNum];
                const isSelected = selectedZone === zoneNum;

                return (
                  <button
                    key={zoneNum}
                    onClick={() => handleZoneClick(zoneNum)}
                    className={`relative rounded-xl border-2 flex flex-col items-center justify-center p-2 transition-all duration-200 cursor-pointer ${getHeatBg(
                      prof.status
                    )} ${
                      isSelected
                        ? 'ring-4 ring-cyan-400 ring-offset-2 ring-offset-slate-950 scale-105 z-10 shadow-lg'
                        : 'opacity-90 hover:opacity-100 hover:scale-102'
                    }`}
                  >
                    <span className="text-xs font-black opacity-75 mb-0.5">Z{zoneNum}</span>
                    <span className="text-sm font-mono font-black">{prof.avg}</span>
                    <span className="text-[10px] font-mono opacity-80">W: {prof.whiff}</span>

                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-cyan-400 border border-white" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Home Plate Indicator at Bottom */}
            <div className="mt-3 flex justify-center">
              <svg width="40" height="20" viewBox="0 0 40 20">
                <polygon points="0,0 40,0 40,10 20,20 0,10" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
              </svg>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 text-[11px] font-semibold text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500/50 border border-rose-500" />
              <span>Caliente (&gt;.300)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500/50 border border-amber-500" />
              <span>Neutral (.230-.300)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-sky-500/50 border border-sky-500" />
              <span>Fría (&lt;.230)</span>
            </div>
          </div>
        </div>

        {/* Selected Zone Telemetry Card */}
        <div className="md:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                Detalle Táctico de Cuadrante
              </span>
              <h4 className="text-base font-black text-white flex items-center gap-2">
                Cuadrante Z{activeProfile.zone} — {activeProfile.label}
              </h4>
            </div>
            <span
              className={`px-2 py-1 rounded-lg text-xs font-bold uppercase flex items-center gap-1 ${
                activeProfile.status === 'sz-hot'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : activeProfile.status === 'sz-neutral'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
              }`}
            >
              {activeProfile.status === 'sz-hot' ? (
                <>
                  <Flame className="w-3.5 h-3.5" /> Peligro
                </>
              ) : activeProfile.status === 'sz-neutral' ? (
                <>
                  <Info className="w-3.5 h-3.5" /> Neutral
                </>
              ) : (
                <>
                  <Snowflake className="w-3.5 h-3.5" /> Vulnerable
                </>
              )}
            </span>
          </div>

          {/* Metric Stats Grid */}
          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Promedio Bateo (AVG)</span>
              <div className="text-lg font-mono font-black text-white">{activeProfile.avg}</div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Tasa Abanicos (Whiff %)</span>
              <div className="text-lg font-mono font-black text-cyan-400">{activeProfile.whiff}</div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Slugging Esperado (SLG)</span>
              <div className="text-lg font-mono font-black text-amber-400">{activeProfile.slg}</div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Muestras Lanzamientos</span>
              <div className="text-lg font-mono font-black text-slate-300">{activeProfile.pitches}</div>
            </div>
          </div>

          {/* Tactical Recommendation Box */}
          <div className="bg-slate-950/90 border border-cyan-500/30 rounded-lg p-3 text-xs">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
              <AlertCircle className="w-4 h-4" />
              <span>Prescripción Táctica para Pitcher</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {activeProfile.recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
