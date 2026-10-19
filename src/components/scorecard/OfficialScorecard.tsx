import React, { useState } from 'react';
import { Player, LineupSlot } from '../../types/baseball';
import {
  FileSpreadsheet,
  Printer,
  Calendar,
  MapPin,
  Shield,
  Award,
  Users,
  CheckCircle2
} from 'lucide-react';

interface OfficialScorecardProps {
  lineup: LineupSlot[];
  bench: Player[];
  homeTeam: string;
  awayTeam: string;
  venue: string;
  date: string;
}

export const OfficialScorecard: React.FC<OfficialScorecardProps> = ({
  lineup,
  bench,
  homeTeam,
  awayTeam,
  venue,
  date
}) => {
  const [managerName] = useState<string>('Lic. Alí José Zapata Mendoza');
  const [headCoach] = useState<string>('Leandro Chavez');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#0B132B]/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              Tarjeta Oficial de Juego & Lineup Card (+55)
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Formato Federado FVB
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Hoja canónica de alineación para entrega obligatoria a la cuarteta arbitral y anotador oficial.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Imprimir Tarjeta</span>
          </button>
        </div>
      </div>

      {/* Game Metadata Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">Fecha Oficial</span>
            <span className="font-bold text-white">{date || 'Hoy'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-400" />
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">Estadio / Sede</span>
            <span className="font-bold text-white">{venue || 'Estadio Chucho Ramos'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">Enfrentamiento</span>
            <span className="font-bold text-white">{homeTeam} vs {awayTeam}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Starters Lineup Card (Left Column) */}
        <div className="lg:col-span-8 bg-slate-950/90 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Alineación Titular — Guerreros de Venezuela
              </h4>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">9 Bateadores</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-[10px] uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3 text-center w-10">#</th>
                  <th className="py-2 px-3">Jugador</th>
                  <th className="py-2 px-3 text-center">POS</th>
                  <th className="py-2 px-3 text-center">DORSAL</th>
                  <th className="py-2 px-3 text-center">B/T</th>
                  <th className="py-2 px-3 text-right">AVG</th>
                  <th className="py-2 px-3 text-right">OBP</th>
                  <th className="py-2 px-3 text-right">OPS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {lineup.map((slot) => (
                  <tr key={slot.order} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-3 text-center font-bold text-cyan-400">
                      {slot.order}
                    </td>
                    <td className="py-2.5 px-3 flex items-center gap-2.5 font-sans font-semibold text-white">
                      <img
                        src={slot.player.photo}
                        alt={slot.player.name}
                        className="w-6 h-6 rounded-full object-cover border border-slate-700 bg-slate-800"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span>{slot.player.name}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-amber-400 font-sans">
                      {slot.pos}
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-300">
                      #{slot.player.num}
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-400 text-[10px]">
                      {slot.player.bats}/{slot.player.throws}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-200">
                      {slot.player.avg.toFixed(3)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-cyan-300">
                      {slot.player.obp.toFixed(3)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-emerald-400">
                      {(slot.player.ops || slot.player.obp + slot.player.slg).toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bench / Reserves & Official Signatures (Right Column) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Bench Reserve Card */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Banca & Reservas Elegibles</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-400 font-bold">{bench.length} Jugadores</span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {bench.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={player.photo}
                      alt={player.name}
                      className="w-5 h-5 rounded-full object-cover bg-slate-800"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="font-semibold text-slate-200">{player.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300">{player.defaultPos}</span>
                    <span>#{player.num}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Official Signatures Box */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 shadow-xl text-xs space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Cuerpo Técnico & Validación</span>
            </h4>

            <div className="space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Manager:</span>
                <span className="font-bold text-white">{managerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Head Coach:</span>
                <span className="font-bold text-white">{headCoach}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Alineación Certificada
              </span>
              <span className="font-mono">DIAMAX-VERIFIED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
