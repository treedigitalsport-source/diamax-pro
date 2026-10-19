import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  Send,
  Volume2,
  Trash2,
  Compass,
  Zap,
  Target,
  Radio,
  Mic,
  Copy,
  Check
} from 'lucide-react';
import { GameState } from '../../types/baseball';
import { soundSystem } from '../../utils/soundSystem';

interface DiamaxTacticalAIProps {
  gameState: GameState;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  category?: string;
}

interface BroadcastPill {
  id: string;
  category: string;
  title: string;
  badge: string;
  badgeColor: string;
  headline: string;
  narrationScript: string;
  statLabel: string;
  statValue: string;
}

export const DiamaxTacticalAI: React.FC<DiamaxTacticalAIProps> = ({ gameState }) => {
  const [activeSubView, setActiveSubView] = useState<'console' | 'broadcast'>('console');
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentBatter = gameState.lineup[gameState.currentBatterIndex]?.player;
  const currentPitcher = gameState.currentPitcher;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'agent',
      text: `DIAMAX TACTICAL AGENT v2.5 en línea. Marcador en vivo: ${gameState.scoreHome} - ${gameState.scoreAway}. Inning ${gameState.currentInning} (${gameState.isTopInning ? 'Alta' : 'Baja'}), ${gameState.outs} out(s). Sistema conectado a la matriz sabermétrica y cabina de transmisión oficial. ¿Cuál es su consulta táctica, Head Coach?`,
      timestamp: 'Ahora',
      category: 'SYSTEM'
    }
  ]);

  const winProbability = Math.min(
    95,
    Math.max(15, Math.round(50 + (gameState.scoreHome - gameState.scoreAway) * 8.5 - gameState.outs * 2.2))
  );

  // Dynamic Broadcast Pills for Narrators & Media
  const pitchCount = gameState.pitchCount;
  const maxLimit = 75;
  const fatiguePct = Math.round((pitchCount / maxLimit) * 100);
  const fatigueZone = pitchCount >= 70 ? 'Alarma Médica' : pitchCount >= 50 ? 'Precaución' : 'Óptima';

  const runnersCount = (gameState.runners.first ? 1 : 0) + (gameState.runners.second ? 1 : 0) + (gameState.runners.third ? 1 : 0);
  const basesDesc = runnersCount === 3
    ? 'bases llenas'
    : runnersCount === 2
    ? 'dos corredores en circulación'
    : runnersCount === 1
    ? 'corredor en base'
    : 'bases limpias';

  const estimatedRallyProb = Math.min(
    92,
    Math.max(14, Math.round(22 + runnersCount * 18 - gameState.outs * 9))
  );

  const broadcastPills: BroadcastPill[] = [
    {
      id: 'fatigue-pill',
      category: 'CONTROL DE PITCHEO',
      title: 'Fatiga Médica del Lanzador (+55)',
      badge: `${pitchCount}/${maxLimit} Envíos (${fatiguePct}%)`,
      badgeColor: pitchCount >= 70 ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-[#F26522]/20 text-[#F26522] border-[#F26522]/40',
      headline: `Abridor ${currentPitcher.name}: ${pitchCount} lanzamientos efectuados.`,
      narrationScript: `Atención en la lomita: ${currentPitcher.name} suma ${pitchCount} envíos oficiales de su cuota reglamentaria de 75 pitcheos en la categoría Máster +55. Su índice de fatiga médica entra en zona de ${fatigueZone}, con el bullpen calentando de emergencia.`,
      statLabel: 'Límite Canónico',
      statValue: `${maxLimit} Pitcheos`
    },
    {
      id: 'batter-pill',
      category: 'SABERMETRÍA AL BATE',
      title: 'Perfil Ofensivo & wOBA del Bateador',
      badge: `wOBA .${Math.round((currentBatter?.woba || 0.365) * 1000)}`,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      headline: `Al bate #${currentBatter?.num || 10} ${currentBatter?.name || 'Bateador'}: OPS de .${Math.round((currentBatter?.ops || 0.880) * 1000)}.`,
      narrationScript: `Se cuadra en la caja de bateo el número ${currentBatter?.num || 10}, ${currentBatter?.name || 'Bateador'}. Presenta un wOBA de punto ${Math.round((currentBatter?.woba || 0.365) * 1000)} y un OPS temible de punto ${Math.round((currentBatter?.ops || 0.880) * 1000)}. Peligroso jalando hacia su banda en conteo favorable.`,
      statLabel: 'Promedio AVG',
      statValue: `.${Math.round((currentBatter?.avg || 0.310) * 1000)}`
    },
    {
      id: 'rally-pill',
      category: 'MODELO ESTOCÁSTICO MARKOV',
      title: 'Probabilidad de Rally en el Inning',
      badge: `${estimatedRallyProb}% Probabilidad`,
      badgeColor: 'bg-[#FFC72C]/20 text-[#FFC72C] border-[#FFC72C]/40',
      headline: `Situación con ${basesDesc} y ${gameState.outs} out(s).`,
      narrationScript: `Momento cumbre del episodio: con ${basesDesc} y ${gameState.outs} out registrado, la matriz estocástica de Markov proyecta un ${estimatedRallyProb} por ciento de probabilidad de fabricar carreras para este inning.`,
      statLabel: 'Rally Markov',
      statValue: `${estimatedRallyProb}%`
    },
    {
      id: 'clutch-pill',
      category: 'LEVERAGE & MOMENTUM',
      title: 'Presión en el Marcador & Situación Clutch',
      badge: `${gameState.scoreHome} - ${gameState.scoreAway} Pizarra`,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      headline: `Diferencial de ${Math.abs(gameState.scoreHome - gameState.scoreAway)} carreras en el Inning ${gameState.currentInning}.`,
      narrationScript: `Tensión total en el diamante: pizarra ${gameState.scoreHome} por ${gameState.scoreAway} en la ${gameState.isTopInning ? 'alta' : 'baja'} del inning ${gameState.currentInning}. Cada lanzamiento en este duelo redefine el índice de apalancamiento del cotejo.`,
      statLabel: 'Win Prob Local',
      statValue: `${winProbability}%`
    },
    {
      id: 'wind-pill',
      category: 'AERODINÁMICA ZAPATA',
      title: 'Condición Ambiental & Resistencia del Aire',
      badge: 'Viento 12 km/h CF',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      headline: 'Sustentación positiva para batazos al jardín central.',
      narrationScript: `Telemetría ambiental en la sede: viento sostenido de 12 km/h hacia los jardines con presión barométrica estable. La bola gana entre 8 y 10 pies de trayectoria adicional en batazos elevados con ángulo de salida superior a 26 grados.`,
      statLabel: 'Vuelo Proyectado',
      statValue: '+8 a 10 ft'
    }
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    soundSystem.playClick();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      soundSystem.playHit();
      let responseText = '';

      if (query.includes('PITCH_CALL') || query.toLowerCase().includes('pitcheo')) {
        responseText = `Recomendación de Pitcheo: Para la cuenta actual (${gameState.balls}-${gameState.strikes}) con corredor en base, ejecutar recta cortada (Cutter) en la esquina baja y externa (Zona 8/9). Reduce el ángulo de salida proyectado a < 11° y maximiza probabilidad de rodado para Doble Play al 64.8%.`;
      } else if (query.includes('DEFENSIVE_SHIFT') || query.toLowerCase().includes('shift')) {
        responseText = `Shift Defensivo Recomendado: Ajustar 2B a 12 pies hacia la pradera derecha y cargar SS 5 pies hacia la almohadilla de segunda. El spray chart del bateador rival muestra un 71.4% de jaloneo hacia el callejón derecho.`;
      } else if (query.includes('BASERUNNING') || query.toLowerCase().includes('robo')) {
        responseText = `Estrategia de Corrido de Bases: Tiempo de entrega al plato del lanzador rival: 1.38s. Pop-time del receptor rival: 2.12s (Total 3.50s). La velocidad de nuestro corredor en primera es élite. El robo de segunda tiene una probabilidad de éxito del 82.5%.`;
      } else if (query.includes('PINCH_HITTER') || query.toLowerCase().includes('emergente')) {
        responseText = `Emergente Sabermétrico: Contra relevista derecho con sinker pronunciado, insertar a bateador con wOBA superior a .380 y bajo índice de rodados para forzar elevado de sacrificio o extrabase por el gap.`;
      } else if (query.includes('viento') || query.toLowerCase().includes('aerodinámica')) {
        responseText = `Análisis Aerodinámico Zapata: Viento sostenido a 12 km/h hacia el jardín central con presión barométrica de 1013 hPa. La resistencia al avance de la bola en elevado profundo se reduce un 3.8%. Se proyectan 8 a 10 pies adicionales de vuelo en batazos sobre 26° de launch angle.`;
      } else {
        responseText = `Dictamen Táctico: Mantener agresividad en la zona de strike con ventaja en el marcador (${gameState.scoreHome}-${gameState.scoreAway}). Proteger las líneas defensivas y evitar otorgar boletos gratis con 2 outs.`;
      }

      const agentMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, agentMsg]);
      soundSystem.speak(responseText);
    }, 600);
  };

  const handleClearChat = () => {
    soundSystem.playUndo();
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'agent',
        text: 'Conversación táctica reiniciada. Matriz RAG y telemetría de juego listas.',
        timestamp: 'Ahora'
      }
    ]);
  };

  const handleCopyScript = (id: string, scriptText: string) => {
    soundSystem.playClick();
    navigator.clipboard.writeText(scriptText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNarrateScript = (scriptText: string) => {
    soundSystem.playClick();
    soundSystem.speak(scriptText);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner & Sub-View Switcher */}
      <div className="bg-gradient-to-r from-[#020617] via-[#060D1F] to-[#020617] p-5 rounded-2xl border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <BrainCircuit className="w-4 h-4 text-cyan-400" />
            <span>Pestaña Canónica 07 • Inteligencia Táctica & Media</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>DIAMAX TACTICAL AI & BROADCAST HUB</span>
          </h2>
          <div className="flex items-center gap-2 flex-wrap mt-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE & CONECTADO
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold">
              🏆 Win Prob: {winProbability}%
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#F26522]/15 border border-[#F26522]/30 text-[#F26522] text-[10px] font-mono font-bold">
              🎙️ Cabina de Medios Activa
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFC72C]/15 border border-[#FFC72C]/30 text-[#FFC72C] text-[10px] font-mono font-bold">
              ⚡ Inferencia &lt; 1.5s
            </span>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-[#020617] p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              soundSystem.playClick();
              setActiveSubView('console');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === 'console'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Consola Táctica Chat</span>
          </button>
          <button
            type="button"
            onClick={() => {
              soundSystem.playClick();
              setActiveSubView('broadcast');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === 'broadcast'
                ? 'bg-[#F26522] text-slate-950 font-black shadow-md shadow-[#F26522]/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>🎙️ Cabina de Transmisión</span>
          </button>
        </div>
      </div>

      {/* Main Content Area based on sub-view */}
      {activeSubView === 'console' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Chat Conversation Stream */}
          <div className="lg:col-span-2 bg-[#060D1F]/95 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-[650px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase font-mono">Stream de Razonamiento Táctico</span>
              </div>
              <button
                type="button"
                onClick={handleClearChat}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                title="Limpiar Conversación"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpiar</span>
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-cyan-600 text-white font-medium rounded-br-none shadow-md'
                        : 'bg-[#020617] text-slate-200 border border-slate-800 rounded-bl-none shadow-inner'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-70 font-mono">
                      <span>{m.sender === 'user' ? 'HEAD COACH' : 'DIAMAX AGENT'}</span>
                      <span>{m.timestamp}</span>
                    </div>
                    <div>{m.text}</div>
                    {m.sender === 'agent' && (
                      <button
                        type="button"
                        onClick={() => soundSystem.speak(m.text)}
                        className="mt-2 text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold"
                        title="Escuchar narración de audio"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Escuchar Voz</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono p-3 bg-slate-950/80 rounded-xl border border-cyan-500/20 animate-pulse">
                  <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>DIAMAX Agent calculando matriz estocástica y probabilidades...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="pt-3 border-t border-slate-800 mt-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Pregunte al Agente: pitcheo, shift, emergente, corrido de bases..."
                  className="flex-1 bg-[#020617] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isThinking}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Consultar</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Quick Tactical Triggers */}
          <div className="space-y-4">
            <div className="bg-[#060D1F]/95 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
              <h3 className="text-xs font-bold text-cyan-400 uppercase font-mono flex items-center gap-1.5">
                <Target className="w-4 h-4 text-cyan-400" />
                <span>Consultas Tácticas Inmediatas</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                {[
                  { id: 'PITCH_CALL', label: 'Pitcheo / Selección', desc: 'Lanzamiento óptimo para la cuenta', color: 'border-cyan-500/30 text-cyan-300' },
                  { id: 'DEFENSIVE_SHIFT', label: 'Shift / Ubicación', desc: 'Ajuste posicional de praderas e infield', color: 'border-cyan-500/30 text-cyan-300' },
                  { id: 'BASERUNNING', label: 'Robo / Toque / Corrido', desc: 'Análisis de pop-time y riesgo de out', color: 'border-cyan-500/30 text-cyan-300' },
                  { id: 'PINCH_HITTER', label: 'Emergente Sabermétrico', desc: 'Cálculo de wOBA vs brazo rival', color: 'border-[#F26522]/40 text-[#F26522]' }
                ].map((btn) => (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => handleSendMessage(btn.id)}
                    className={`p-3 rounded-xl bg-[#020617] border ${btn.color} text-left hover:border-cyan-400 hover:scale-[1.01] transition-all`}
                  >
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>{btn.label}</span>
                      <Zap className="w-3 h-3 text-cyan-400" />
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{btn.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Strategic Questions */}
            <div className="bg-[#060D1F]/95 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-2.5">
              <h3 className="text-xs font-bold text-[#FFC72C] uppercase font-mono flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#FFC72C]" />
                <span>Preguntas Clave del Partido</span>
              </h3>

              <div className="space-y-1.5">
                {[
                  '¿Cuál es la estrategia óptima para este inning?',
                  '¿Cómo neutralizamos al bateador más peligroso del rival?',
                  '¿Cómo influye el viento y el clima en este estadio hoy?'
                ].map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(q)}
                    className="w-full p-2.5 rounded-xl bg-[#020617] border border-slate-800 hover:border-slate-700 text-left text-[11px] text-slate-300 hover:text-white transition-all flex items-center justify-between"
                  >
                    <span>{q}</span>
                    <Sparkles className="w-3 h-3 text-[#FFC72C] shrink-0 ml-1.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Broadcast Hub / Cabina de Transmisión View */
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="bg-[#060D1F] border border-[#F26522]/30 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[#F26522] font-mono text-xs font-bold uppercase mb-1">
                <Radio className="w-4 h-4 text-[#F26522] animate-pulse" />
                <span>Media & Broadcast Live Studio • Modo Cabina de Transmisión</span>
              </div>
              <h3 className="text-lg font-black text-white">
                Píldoras Tácticas Automáticas para Narradores de Béisbol
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Frases sabermétricas listas para locución al micrófono entre pitcheos. Formato de alto contraste y gran legibilidad para comentaristas.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 font-bold flex items-center gap-2">
                <Mic className="w-3.5 h-3.5 text-[#F26522]" />
                <span>Cabina al Aire</span>
              </span>
            </div>
          </div>

          {/* Cards Grid: Modo Pantalla Gigante para Locutores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {broadcastPills.map((pill) => (
              <div
                key={pill.id}
                className="bg-[#060D1F] border border-slate-800 hover:border-[#F26522]/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      {pill.category}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold ${pill.badgeColor}`}>
                      {pill.badge}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-2 group-hover:text-[#F26522] transition-colors">
                    {pill.headline}
                  </h4>

                  {/* Teleprompter Style Script */}
                  <div className="bg-[#020617] border border-slate-800/80 rounded-xl p-3.5 my-2.5 text-xs text-slate-200 leading-relaxed font-sans shadow-inner">
                    <span className="text-[#FFC72C] font-mono text-[10px] font-bold block mb-1">
                      🗣️ GUIÓN PARA LOCUCIÓN:
                    </span>
                    "{pill.narrationScript}"
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-2">
                  <div className="text-[11px] font-mono">
                    <span className="text-slate-500 block text-[9px] uppercase">{pill.statLabel}</span>
                    <span className="text-white font-bold">{pill.statValue}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyScript(pill.id, pill.narrationScript)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1 transition-all"
                      title="Copiar guión al portapapeles"
                    >
                      {copiedId === pill.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 text-[11px]">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[11px]">Copiar</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNarrateScript(pill.narrationScript)}
                      className="px-3 py-1.5 rounded-lg bg-[#F26522] hover:bg-[#d95318] text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#F26522]/20 transition-all"
                      title="Narrar frase mediante voz sintetizada"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-slate-950" />
                      <span>Narrar Voz</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
