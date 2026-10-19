import React, { useState } from 'react';
import {
  Activity,
  Users,
  Crosshair,
  BarChart3,
  Cpu,
  FileSpreadsheet,
  BookOpen,
  Sun,
  Moon,
  ShieldCheck,
  Video,
  Volume2,
  VolumeX,
  Sparkles,
  Calendar,
  Building2
} from 'lucide-react';
import { soundSystem } from '../../utils/soundSystem';

export type ActiveTab =
  | 'envivo'
  | 'lineup'
  | 'campo'
  | 'manual'
  | 'scorecard'
  | 'sabermetrics'
  | 'skills'
  | 'perfil';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  daylightMode: boolean;
  onToggleDaylight: () => void;
  onOpenIntro?: () => void;
  onOpenWizard?: () => void;
  onOpenNewGame?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  daylightMode,
  onToggleDaylight,
  onOpenIntro,
  onOpenWizard,
  onOpenNewGame
}) => {
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(soundSystem.getMuted());

  const handleToggleSound = () => {
    const next = soundSystem.toggleMuted();
    setIsAudioMuted(next);
    if (!next) {
      soundSystem.playClick();
      soundSystem.speak('Audio activado');
    }
  };

  const tabs = [
    { id: 'envivo' as ActiveTab, label: '1. Anotador Dugout', icon: Activity },
    { id: 'lineup' as ActiveTab, label: '2. Lineup Builder', icon: Users },
    { id: 'campo' as ActiveTab, label: '3. Terreno 2D', icon: Crosshair },
    { id: 'manual' as ActiveTab, label: '4. Manual & Reglas', icon: BookOpen },
    { id: 'scorecard' as ActiveTab, label: '5. Tarjeta Oficial', icon: FileSpreadsheet },
    { id: 'sabermetrics' as ActiveTab, label: '6. Tablero Sabermétrico', icon: BarChart3 },
    { id: 'skills' as ActiveTab, label: '7. DIAMAX Tactical AI', icon: Cpu },
    { id: 'perfil' as ActiveTab, label: '8. Perfil & Conectividad', icon: Building2 }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#040814]/95 border-b border-slate-800/80 backdrop-blur-xl shadow-2xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Top Bar: Brand, Badges, Utility Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenIntro}
              className="group flex items-center gap-3 text-left focus:outline-none"
              title="Ver Video Cinemático Inicial"
            >
              {/* Home Plate 3D Diamond Icon */}
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-slate-900 border border-cyan-400/40 flex items-center justify-center shadow-lg shadow-cyan-500/10 group-hover:scale-105 transition-transform">
                <svg width="24" height="24" viewBox="0 0 36 36" fill="none">
                  <polygon
                    points="18,2 34,14 28,34 8,34 2,14"
                    fill="url(#headerPlateGrad)"
                    stroke="#00D2FF"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 11h6a6 6 0 0 1 0 12h-6V11z"
                    stroke="#FFC72C"
                    strokeWidth="2.2"
                    fill="none"
                  />
                  <defs>
                    <linearGradient id="headerPlateGrad" x1="18" y1="2" x2="18" y2="34">
                      <stop offset="0%" stopColor="#1E293B" />
                      <stop offset="100%" stopColor="#030712" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black tracking-wider text-white font-mono flex items-center gap-1.5">
                    DIAMAX <span className="text-cyan-400">PRO</span>
                  </span>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    OS v2.5
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-semibold tracking-wide">
                  3Tree Digital Sport IA • Guerreros +55
                </div>
              </div>
            </button>
          </div>

          {/* Center / Right Badges & Controls */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Zero-Trust Security Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-[10px] text-slate-300 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Trust 256-bit</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* New Game Button */}
            {onOpenNewGame && (
              <button
                onClick={onOpenNewGame}
                className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-[10px] text-cyan-300 font-bold hover:bg-cyan-500/20 transition-all flex items-center gap-1.5"
                title="Configurar Nuevo Partido y Rival"
              >
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>+ Partido</span>
              </button>
            )}

            {/* Franchise / Plans Wizard Button */}
            {onOpenWizard && (
              <button
                onClick={onOpenWizard}
                className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/40 text-[10px] text-amber-300 font-bold hover:bg-amber-500/20 transition-all flex items-center gap-1.5"
                title="Planes de Franquicia, Registro y Acceso Maestro"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Planes & Franquicia</span>
              </button>
            )}

            {/* Audio Acoustic & Voice Synthesizer Toggle */}
            <button
              onClick={handleToggleSound}
              className={`px-2.5 py-1 rounded-full border text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                isAudioMuted
                  ? 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'
                  : 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/20'
              }`}
              title={isAudioMuted ? 'Activar Efectos de Audio y Voz' : 'Silenciar Audio y Voz'}
            >
              {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isAudioMuted ? 'Audio OFF' : 'Audio ON'}</span>
            </button>

            {/* Cinematic Video CTA */}
            {onOpenIntro && (
              <button
                onClick={onOpenIntro}
                className="px-2.5 py-1 rounded-full bg-slate-900/90 border border-cyan-500/40 text-[10px] text-cyan-300 font-bold hover:bg-cyan-500/10 transition-all flex items-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cinemática</span>
              </button>
            )}

            {/* Daylight Stadium Mode Toggle (Sol / Noche) */}
            <button
              onClick={onToggleDaylight}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 border ${
                daylightMode
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/30 font-black'
                  : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title={daylightMode ? 'Cambiar a Modo Nocturno' : 'Activar Modo Estadio Luz Solar'}
            >
              {daylightMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-slate-950" />
                  <span>Modo Sol Estadio</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Modo Noche</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Capsule Navigation Tabs Row */}
        <div className="flex items-center gap-1.5 pt-2.5 overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 shrink-0 ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-black scale-102 ring-1 ring-cyan-300'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
