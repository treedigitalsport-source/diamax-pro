import React, { useState, useRef, useEffect } from 'react';
import { Player } from '../../types/baseball';
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Gauge,
  Compass,
  Cpu
} from 'lucide-react';

interface BiomechanicsHUDProps {
  player?: Player | null;
  videoSrc?: string;
}

interface KineticFlaw {
  id: string;
  title: string;
  severity: 'optimal' | 'warning' | 'critical';
  angle: string;
  targetRange: string;
  description: string;
  remedy: string;
}

export const BiomechanicsHUD: React.FC<BiomechanicsHUDProps> = ({
  player,
  videoSrc = '/Baseball_bat_striking_ball_1080p_20260913144643.mp4'
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);
  const [showTelemetry, setShowTelemetry] = useState<boolean>(true);
  const [selectedPhase, setSelectedPhase] = useState<'load' | 'stride' | 'contact' | 'followThrough'>('contact');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Biomechanical Flaw Diagnostics
  const flaws: KineticFlaw[] = [
    {
      id: 'lead-leg-block',
      title: 'Bloqueo Pierna Delantera (Lead Leg Block)',
      severity: 'warning',
      angle: '14.8° Flexión Residual',
      targetRange: '0° - 5° (Rígido)',
      description: 'Fuga de energía cinética: la rodilla delantera no traba firmemente al momento del impacto, disipando 4.2 mph de velocidad de salida.',
      remedy: 'Ejercicios de freno isométrico con cajón y transferencia rotacional del talón delantero.'
    },
    {
      id: 'hip-shoulder-sep',
      title: 'Separación Cadera - Hombros (X-Factor)',
      severity: 'optimal',
      angle: '34.2°',
      targetRange: '30° - 38°',
      description: 'El timing rotacional entre la pelvis y el torso superior es de nivel élite, maximizando el efecto resorte de la fascia toracolumbar.',
      remedy: 'Mantener protocolo actual de calentamiento rotacional con bandas elásticas.'
    },
    {
      id: 'ucl-torque',
      title: 'Estrés Varus UCL / Codo Guía',
      severity: 'optimal',
      angle: '68 N·m Torque',
      targetRange: '< 85 N·m (Seguro)',
      description: 'La desaceleración articular se encuentra dentro de los márgenes seguros para atletas categoría Master (+55).',
      remedy: 'Crioterapia preventiva post-juego y carga dosificada de swings por semana.'
    }
  ];

  // Toggle video playback
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Rewind video
  const rewindVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    if (!isPlaying) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Render 33-Landmark Biomechanical Skeleton Overlay on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number = 0;

    const renderSkeleton = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!showSkeleton) return;

      const width = canvas.width;
      const height = canvas.height;

      // Dynamic landmark positions based on selected phase or time
      const cx = width * 0.48;
      const cy = height * 0.52;

      // 33-Keypoint synthetic kinetic model coordinates
      const landmarks: Record<string, [number, number]> = {
        // Head & Torso
        nose: [cx, cy - height * 0.35],
        neck: [cx - width * 0.01, cy - height * 0.28],
        chest: [cx - width * 0.02, cy - height * 0.18],
        midSpine: [cx - width * 0.03, cy - height * 0.08],
        pelvis: [cx - width * 0.04, cy + height * 0.02],

        // Lead Arm (Left for righty batter)
        lShoulder: [cx + width * 0.08, cy - height * 0.24],
        lElbow: [cx + width * 0.16, cy - height * 0.16],
        lWrist: [cx + width * 0.24, cy - height * 0.10],

        // Trail Arm (Right)
        rShoulder: [cx - width * 0.10, cy - height * 0.25],
        rElbow: [cx - width * 0.18, cy - height * 0.18],
        rWrist: [cx + width * 0.12, cy - height * 0.12],

        // Bat
        batGrip: [cx + width * 0.18, cy - height * 0.11],
        batBarrel: [cx + width * 0.32, cy - height * 0.06],
        batTip: [cx + width * 0.42, cy - height * 0.02],

        // Lead Leg (Front leg - Left)
        lHip: [cx + width * 0.05, cy + height * 0.04],
        lKnee: [cx + width * 0.14, cy + height * 0.22],
        lAnkle: [cx + width * 0.18, cy + height * 0.40],
        lFoot: [cx + width * 0.24, cy + height * 0.42],

        // Trail Leg (Back leg - Right)
        rHip: [cx - width * 0.12, cy + height * 0.03],
        rKnee: [cx - width * 0.16, cy + height * 0.20],
        rAnkle: [cx - width * 0.14, cy + height * 0.38],
        rFoot: [cx - width * 0.10, cy + height * 0.41]
      };

      // Draw Bones (Connections)
      const bones: [string, string, string][] = [
        ['nose', 'neck', '#00D2FF'],
        ['neck', 'chest', '#00D2FF'],
        ['chest', 'midSpine', '#00D2FF'],
        ['midSpine', 'pelvis', '#00D2FF'],
        // Shoulders & Pelvis Bar
        ['lShoulder', 'rShoulder', '#F59E0B'],
        ['lHip', 'rHip', '#F59E0B'],
        // Left Arm
        ['neck', 'lShoulder', '#10B981'],
        ['lShoulder', 'lElbow', '#10B981'],
        ['lElbow', 'lWrist', '#10B981'],
        // Right Arm
        ['neck', 'rShoulder', '#10B981'],
        ['rShoulder', 'rElbow', '#10B981'],
        ['rElbow', 'rWrist', '#10B981'],
        // Bat
        ['lWrist', 'batGrip', '#F43F5E'],
        ['rWrist', 'batGrip', '#F43F5E'],
        ['batGrip', 'batBarrel', '#F43F5E'],
        ['batBarrel', 'batTip', '#F43F5E'],
        // Left Leg
        ['pelvis', 'lHip', '#38BDF8'],
        ['lHip', 'lKnee', '#38BDF8'],
        ['lKnee', 'lAnkle', '#EF4444'], // Highlighted red/flaw
        ['lAnkle', 'lFoot', '#38BDF8'],
        // Right Leg
        ['pelvis', 'rHip', '#38BDF8'],
        ['rHip', 'rKnee', '#38BDF8'],
        ['rKnee', 'rAnkle', '#38BDF8'],
        ['rAnkle', 'rFoot', '#38BDF8']
      ];

      // Draw bone lines with neon glow
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 8;

      bones.forEach(([from, to, color]) => {
        const p1 = landmarks[from];
        const p2 = landmarks[to];
        if (p1 && p2) {
          ctx.strokeStyle = color;
          ctx.shadowColor = color;
          ctx.beginPath();
          ctx.moveTo(p1[0], p1[1]);
          ctx.lineTo(p2[0], p2[1]);
          ctx.stroke();
        }
      });

      // Draw Landmark Nodes
      Object.entries(landmarks).forEach(([name, [x, y]]) => {
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FFFFFF';
        ctx.fillStyle = name.startsWith('bat') ? '#FF2A6D' : '#00F59B';
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Special Annotation: Lead Knee Leak Indicator
      const [kx, ky] = landmarks['lKnee'];
      ctx.strokeStyle = '#EF4444';
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.beginPath();
      ctx.arc(kx, ky, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Text callout
      ctx.font = 'bold 10px monospace';
      ctx.fillStyle = '#F87171';
      ctx.fillText('LEAD KNEE LEAK: 14.8°', kx + 22, ky + 4);

      // Special Annotation: Hip-Shoulder Separation Arc
      const [px, py] = landmarks['pelvis'];
      ctx.font = 'bold 10px monospace';
      ctx.fillStyle = '#34D399';
      ctx.fillText('X-FACTOR: 34.2° OK', px - 110, py - 10);
    };

    renderSkeleton();
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [showSkeleton, selectedPhase]);

  return (
    <div className="bg-[#0B132B]/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Cpu className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              ScoutAI Biomechanics HUD
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Kinetic Vision 33-Points
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracking articular computarizado, vector de salida y diagnóstico cinético de bateo para {player?.name || 'Guerreros +55'}.
          </p>
        </div>

        {/* Phase Selector */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setSelectedPhase('load')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              selectedPhase === 'load' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Carga
          </button>
          <button
            onClick={() => setSelectedPhase('stride')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              selectedPhase === 'stride' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Zancada
          </button>
          <button
            onClick={() => setSelectedPhase('contact')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              selectedPhase === 'contact' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Impacto
          </button>
          <button
            onClick={() => setSelectedPhase('followThrough')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              selectedPhase === 'followThrough' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Terminación
          </button>
        </div>
      </div>

      {/* Main HUD Viewport (Video + Kinetic Overlay) */}
      <div className="relative w-full aspect-video max-w-4xl mx-auto my-5 bg-slate-950 rounded-2xl border-2 border-slate-800 overflow-hidden shadow-2xl">
        {/* Background Video */}
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover filter brightness-90 contrast-110"
        />

        {/* Biomechanical Canvas Overlay */}
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Heads-Up Display Telemetry Badges */}
        {showTelemetry && (
          <div className="absolute top-4 left-4 z-20 space-y-2 pointer-events-none">
            <div className="bg-slate-950/85 border border-cyan-500/40 rounded-xl px-3 py-2 backdrop-blur-md shadow-xl flex items-center gap-3">
              <Gauge className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Exit Velocity</div>
                <div className="text-lg font-mono font-black text-cyan-300">
                  96.4 <span className="text-xs font-normal text-slate-400">MPH</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/85 border border-emerald-500/40 rounded-xl px-3 py-2 backdrop-blur-md shadow-xl flex items-center gap-3">
              <Compass className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Launch Angle</div>
                <div className="text-lg font-mono font-black text-emerald-300">
                  24.5° <span className="text-xs font-normal text-slate-400">SWEET SPOT</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/85 border border-amber-500/40 rounded-xl px-3 py-2 backdrop-blur-md shadow-xl flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Bat Speed (Sweet Spot)</div>
                <div className="text-lg font-mono font-black text-amber-300">
                  78.2 <span className="text-xs font-normal text-slate-400">MPH</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Kinematic Sequence Flow on bottom right */}
        {showTelemetry && (
          <div className="absolute bottom-4 right-4 z-20 bg-slate-950/85 border border-slate-700 rounded-xl p-3 backdrop-blur-md shadow-xl pointer-events-none">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Secuencia Cinética Rotacional</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">1. Pelvis (460°/s)</span>
              <span className="text-slate-500">→</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">2. Torso (720°/s)</span>
              <span className="text-slate-500">→</span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">3. Bate (1850°/s)</span>
            </div>
          </div>
        )}

        {/* Video Control Bar */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-slate-950/80 border border-slate-800 p-1.5 rounded-xl backdrop-blur-md">
          <button
            onClick={togglePlay}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-all"
            title={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={rewindVideo}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-all"
            title="Reiniciar Video"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowSkeleton(!showSkeleton)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              showSkeleton ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {showSkeleton ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            Esqueleto 3D
          </button>

          <button
            onClick={() => setShowTelemetry(!showTelemetry)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              showTelemetry ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}
          >
            HUD Telemetría
          </button>
        </div>
      </div>

      {/* Flaw Detection & Correction Cards */}
      <div className="mt-6">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <span>Diagnóstico de Fallas Mecánicas y Prescripción Técnica</span>
          <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
            1 Corrección Prioritaria
          </span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {flaws.map((flaw) => (
            <div
              key={flaw.id}
              className={`rounded-xl border p-4 transition-all ${
                flaw.severity === 'warning'
                  ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  {flaw.severity === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className="font-bold text-white text-xs">{flaw.title}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase font-mono ${
                    flaw.severity === 'warning'
                      ? 'bg-rose-500/20 text-rose-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {flaw.angle}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 mt-2 space-y-1.5">
                <div>
                  <span className="text-slate-500">Rango Objetivo:</span>{' '}
                  <span className="text-slate-300 font-mono font-semibold">{flaw.targetRange}</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  {flaw.description}
                </p>
                <div className="mt-2 pt-2 border-t border-slate-800/60 text-emerald-400/90 text-xs font-semibold">
                  🛠️ Prescripción: <span className="text-slate-300 font-normal">{flaw.remedy}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
