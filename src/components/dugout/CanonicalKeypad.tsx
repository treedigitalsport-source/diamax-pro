import React from 'react';
import { PlayAction } from '../../types/baseball';
import { RotateCcw, Zap, Target, Crosshair, Sparkles } from 'lucide-react';
import { soundSystem } from '../../utils/soundSystem';

interface CanonicalKeypadProps {
  onPlay: (action: PlayAction) => void;
  onUndo: () => void;
  canUndo: boolean;
}

export const CanonicalKeypad: React.FC<CanonicalKeypadProps> = ({ onPlay, onUndo, canUndo }) => {
  const handlePlayWithSound = (action: PlayAction) => {
    switch (action) {
      case 'BALL':
        soundSystem.playBall();
        break;
      case 'CALLED_STRIKE':
      case 'SWINGING_STRIKE':
      case 'FOUL':
        soundSystem.playStrike();
        break;
      case 'SINGLE':
      case 'DOUBLE':
      case 'TRIPLE':
        soundSystem.playHit();
        break;
      case 'HOME_RUN':
        soundSystem.playHomeRun();
        break;
      case 'GROUND_OUT':
      case 'FLY_OUT':
      case 'LINE_OUT':
      case 'POP_OUT':
      case 'DOUBLE_PLAY':
      case 'TRIPLE_PLAY':
      case 'STRIKEOUT_SWINGING':
      case 'STRIKEOUT_LOOKING':
        soundSystem.playOut();
        break;
      default:
        soundSystem.playClick();
        break;
    }
    onPlay(action);
  };

  const handleUndoWithSound = () => {
    soundSystem.playUndo();
    onUndo();
  };

  return (
    <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
      {/* Top Action Bar with Category Tabs and Undo Button */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Botonera Canónica WBSC (36 Jugadas)
          </span>
        </div>

        {/* Undo / Deshacer Button */}
        <button
          onClick={handleUndoWithSound}
          disabled={!canUndo}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
            canUndo
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30 active:scale-95 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
              : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
          }`}
          title="Deshacer la última jugada registrada de inmediato"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          DESHACER (UNDO)
        </button>
      </div>

      {/* Grid: 4 Strategic Sections */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Section 1: Pitch Count (Bolas & Strikes) */}
        <div className="flex flex-col gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[11px] font-mono font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <Target className="w-3 h-3" /> Conteo Pitcheos
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => handlePlayWithSound('BALL')}
              className="py-2.5 px-2 rounded-lg bg-emerald-950/40 border border-emerald-500/40 hover:bg-emerald-900/50 text-emerald-300 text-xs font-mono font-bold active:scale-95 transition"
            >
              Bola (B)
            </button>
            <button
              onClick={() => handlePlayWithSound('CALLED_STRIKE')}
              className="py-2.5 px-2 rounded-lg bg-amber-950/40 border border-amber-500/40 hover:bg-amber-900/50 text-amber-300 text-xs font-mono font-bold active:scale-95 transition"
            >
              Strike C (ꓘ)
            </button>
            <button
              onClick={() => handlePlayWithSound('SWINGING_STRIKE')}
              className="py-2.5 px-2 rounded-lg bg-amber-950/40 border border-amber-500/40 hover:bg-amber-900/50 text-amber-300 text-xs font-mono font-bold active:scale-95 transition"
            >
              Strike Tirando
            </button>
            <button
              onClick={() => handlePlayWithSound('FOUL')}
              className="py-2.5 px-2 rounded-lg bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold active:scale-95 transition"
            >
              Foul Ball
            </button>
          </div>
        </div>

        {/* Section 2: Hits & Extrabases */}
        <div className="flex flex-col gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[11px] font-mono font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
            <Crosshair className="w-3 h-3" /> Batazos / Imparables
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => handlePlayWithSound('SINGLE')}
              className="py-2.5 px-2 rounded-lg bg-cyan-950/40 border border-cyan-500/50 hover:bg-cyan-900/50 text-cyan-300 text-xs font-mono font-bold active:scale-95 transition"
            >
              Sencillo (1B)
            </button>
            <button
              onClick={() => handlePlayWithSound('DOUBLE')}
              className="py-2.5 px-2 rounded-lg bg-blue-950/40 border border-blue-500/50 hover:bg-blue-900/50 text-blue-300 text-xs font-mono font-bold active:scale-95 transition"
            >
              Doble (2B)
            </button>
            <button
              onClick={() => handlePlayWithSound('TRIPLE')}
              className="py-2.5 px-2 rounded-lg bg-purple-950/40 border border-purple-500/50 hover:bg-purple-900/50 text-purple-300 text-xs font-mono font-bold active:scale-95 transition"
            >
              Triple (3B)
            </button>
            <button
              onClick={() => handlePlayWithSound('HOME_RUN')}
              className="py-2.5 px-2 rounded-lg bg-amber-500/30 border border-amber-400 text-amber-200 text-xs font-mono font-black active:scale-95 transition shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:bg-amber-500/40"
            >
              ★ JONRÓN (HR)
            </button>
          </div>
        </div>

        {/* Section 3: Outs Tradicionales */}
        <div className="flex flex-col gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[11px] font-mono font-semibold text-red-400 uppercase tracking-wider flex items-center gap-1">
            <Target className="w-3 h-3" /> Outs & Jugadas
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => handlePlayWithSound('STRIKEOUT_SWINGING')}
              className="py-2.5 px-2 rounded-lg bg-red-950/40 border border-red-500/40 hover:bg-red-900/50 text-red-300 text-xs font-mono font-bold active:scale-95 transition"
            >
              Ponche (K)
            </button>
            <button
              onClick={() => handlePlayWithSound('STRIKEOUT_LOOKING')}
              className="py-2.5 px-2 rounded-lg bg-red-950/40 border border-red-500/40 hover:bg-red-900/50 text-red-300 text-xs font-mono font-bold active:scale-95 transition"
            >
              Ponche (ꓘ)
            </button>
            <button
              onClick={() => handlePlayWithSound('GROUND_OUT')}
              className="py-2.5 px-2 rounded-lg bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold active:scale-95 transition"
            >
              Rolata (GO)
            </button>
            <button
              onClick={() => handlePlayWithSound('FLY_OUT')}
              className="py-2.5 px-2 rounded-lg bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold active:scale-95 transition"
            >
              Elevado (FO)
            </button>
            <button
              onClick={() => handlePlayWithSound('LINE_OUT')}
              className="py-2.5 px-2 rounded-lg bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold active:scale-95 transition"
            >
              Línea (LO)
            </button>
            <button
              onClick={() => handlePlayWithSound('DOUBLE_PLAY')}
              className="py-2.5 px-2 rounded-lg bg-red-900/40 border border-red-500/50 hover:bg-red-800/50 text-red-200 text-xs font-mono font-bold active:scale-95 transition"
            >
              Doble Play (DP)
            </button>
          </div>
        </div>

        {/* Section 4: Avances & Estrategia */}
        <div className="flex flex-col gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[11px] font-mono font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Avances & Especiales
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => handlePlayWithSound('WALK')}
              className="py-2.5 px-2 rounded-lg bg-emerald-950/40 border border-emerald-500/40 hover:bg-emerald-900/50 text-emerald-300 text-xs font-mono font-bold active:scale-95 transition"
            >
              Boleto (BB)
            </button>
            <button
              onClick={() => handlePlayWithSound('HIT_BY_PITCH')}
              className="py-2.5 px-2 rounded-lg bg-purple-950/40 border border-purple-500/40 hover:bg-purple-900/50 text-purple-300 text-xs font-mono font-bold active:scale-95 transition"
            >
              Golpeado (HBP)
            </button>
            <button
              onClick={() => handlePlayWithSound('STOLEN_BASE')}
              className="py-2.5 px-2 rounded-lg bg-cyan-950/40 border border-cyan-500/40 hover:bg-cyan-900/50 text-cyan-300 text-xs font-mono font-bold active:scale-95 transition"
            >
              Robo (SB)
            </button>
            <button
              onClick={() => handlePlayWithSound('ERROR')}
              className="py-2.5 px-2 rounded-lg bg-red-950/30 border border-red-500/30 hover:bg-red-900/40 text-red-300 text-xs font-mono font-bold active:scale-95 transition"
            >
              Error (E)
            </button>
            <button
              onClick={() => handlePlayWithSound('SACRIFICE_FLY')}
              className="py-2.5 px-2 rounded-lg bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold active:scale-95 transition"
            >
              Sac Fly (SF)
            </button>
            <button
              onClick={() => handlePlayWithSound('WILD_PITCH')}
              className="py-2.5 px-2 rounded-lg bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold active:scale-95 transition"
            >
              Wild Pitch (WP)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
