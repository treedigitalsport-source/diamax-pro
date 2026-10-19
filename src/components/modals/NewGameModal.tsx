import React, { useState } from 'react';
import { Player } from '../../types/baseball';
import {
  X,
  Calendar,
  MapPin,
  Shield,
  User,
  CheckCircle2
} from 'lucide-react';
import { soundSystem } from '../../utils/soundSystem';

interface NewGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  pitchers: Player[];
  onStartNewGame: (config: {
    venue: string;
    awayTeam: string;
    isHomeClub: boolean;
    startingPitcher: Player;
    date: string;
  }) => void;
}

export const NewGameModal: React.FC<NewGameModalProps> = ({
  isOpen,
  onClose,
  pitchers,
  onStartNewGame
}) => {
  const [venue, setVenue] = useState<string>('Estadio Chucho Ramos');
  const [awayTeam, setAwayTeam] = useState<string>('Criollos Master');
  const [isHomeClub, setIsHomeClub] = useState<boolean>(true);
  const [selectedPitcherId, setSelectedPitcherId] = useState<number>(pitchers[0]?.id || 1);
  const [date, setDate] = useState<string>('19 Octubre 2026');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundSystem.playHomeRun();
    const pitcher = pitchers.find(p => p.id === selectedPitcherId) || pitchers[0];
    onStartNewGame({
      venue,
      awayTeam,
      isHomeClub,
      startingPitcher: pitcher,
      date
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Configurar Partido & Rival
              </h3>
              <p className="text-[11px] text-slate-400">
                Protocolo Pre-Juego Oficial • Wizard Canónico
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Estadio / Sede Oficial
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                placeholder="Estadio Chucho Ramos / Lutz Park"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Equipo Rival
            </label>
            <div className="relative">
              <Shield className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-bold"
                placeholder="Criollos Master / Tampa Masters"
                required
              />
            </div>
          </div>

          {/* Localía (Home Club vs Visitante) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Condición de Localía de Guerreros (+55)
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  soundSystem.playClick();
                  setIsHomeClub(true);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isHomeClub
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-md ring-1 ring-cyan-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div>🏠 HOME CLUB (Local)</div>
                <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                  Defiende en la Alta (▲) y cierra bateando en la Baja (▼)
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundSystem.playClick();
                  setIsHomeClub(false);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  !isHomeClub
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-md ring-1 ring-cyan-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div>✈️ VISITANTE</div>
                <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                  Abre bateando en la Entrada Alta (▲)
                </div>
              </button>
            </div>
          </div>

          {/* Lanzador Abridor */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Lanzador Abridor Designado (+55)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={selectedPitcherId}
                onChange={(e) => setSelectedPitcherId(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                {pitchers.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.num} {p.name} ({p.throws === 'R' ? 'Derecho' : 'Zurdo'} • ERA {p.era?.toFixed(2) || '2.80'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Fecha del Encuentro
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-102 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Certificar & Iniciar Partido</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
