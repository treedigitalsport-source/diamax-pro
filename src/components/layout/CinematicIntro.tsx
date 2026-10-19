import React, { useRef, useState } from 'react';
import {
  Volume2,
  VolumeX,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface CinematicIntroProps {
  onEnterApp: () => void;
  videoSrc?: string;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  onEnterApp,
  videoSrc = '/Baseball_bat_striking_ball_1080p_20260913144643.mp4'
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleSound = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#020617] flex flex-col justify-between items-center p-6 select-none overflow-hidden font-sans">
      {/* 1080p Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover filter brightness-[0.80] contrast-[1.08] pointer-events-none z-0"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Cinematic Gradient Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/95 via-transparent to-[#020617]/80 pointer-events-none z-1" />

      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-6xl flex justify-between items-center">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-slate-900 border border-cyan-400/40 flex items-center justify-center shadow-lg shadow-cyan-500/20 backdrop-blur-md">
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <polygon
                points="18,2 34,14 28,34 8,34 2,14"
                fill="#0F172A"
                stroke="#00D2FF"
                strokeWidth="1.8"
              />
              <path
                d="M12 11h6a6 6 0 0 1 0 12h-6V11z"
                stroke="#FFC72C"
                strokeWidth="2.5"
                fill="none"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black text-white font-mono tracking-wider flex items-center gap-2">
              DIAMAX <span className="text-cyan-400">PRO</span>
            </h1>
            <p className="text-[11px] text-slate-300 font-semibold tracking-wide">
              Sports Operating System • 3Tree Digital Sport IA Corp
            </p>
          </div>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          className="p-2.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:text-white hover:border-cyan-400 transition-all backdrop-blur-md"
          title={isMuted ? 'Activar Sonido' : 'Silenciar'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>
      </header>

      {/* Center Hero Title & Slogan */}
      <main className="relative z-10 text-center max-w-3xl space-y-4 my-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wider backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>MOTOR ESTOCÁSTICO MARKOV + KINETIC VISION AI</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none drop-shadow-2xl">
          INTELIGENCIA TÁCTICA <br />
          <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent">
            EN TIEMPO REAL
          </span>
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed drop-shadow-md">
          Plataforma de comando para Dugout: prescripción de jugadas canónicas, semáforo médico de fatiga (+55), y modelado estocástico de carreras con 10,000 iteraciones Monte Carlo.
        </p>

        {/* Action Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onEnterApp}
            className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black text-sm tracking-wider uppercase flex items-center gap-3 shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-200"
          >
            <span>ENTRAR A DIAMAX PRO OS</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </main>

      {/* Bottom Footer Info */}
      <footer className="relative z-10 w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800/60 pt-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Roster Oficial: Guerreros de Venezuela Master (+55)</span>
        </div>
        <div className="font-mono text-[11px] text-slate-500">
          Lic. Alí José Zapata Mendoza • Founder & CEO
        </div>
      </footer>
    </div>
  );
};
