import React, { useState } from 'react';
import {
  BookOpen,
  Printer,
  Search,
  CheckCircle2,
  Lock,
  Calendar,
  Users,
  Activity,
  HeartPulse,
  Crosshair,
  FileSpreadsheet,
  BarChart3,
  Cpu,
  Cloud,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { soundSystem } from '../../utils/soundSystem';

export const OperationalManualFull: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'manual' | 'rules'>('manual');

  const chapters = [
    {
      num: 1,
      title: '1. Acceso, Roles & Seguridad Zero-Trust',
      badge: 'MULTI-TENANT RBAC',
      icon: Lock,
      content: [
        {
          sub: 'Paso 1.1: Inicio y Portada',
          text: 'Al ingresar a diamax-pro.vercel.app, presione "Entrar a DIAMAX PRO OS" o configure su rol de bienvenida en la pantalla inicial.'
        },
        {
          sub: 'Paso 1.2: Roles del Sistema',
          text: 'CEO (Control y auditoría total), ADMIN_LIGA (Gestión y calendarios de torneos), MANAGER (Lineups y táctica activa en dugout), COACH (Anotación y bullpen), JUGADOR (Estadísticas personales).'
        },
        {
          sub: 'Paso 1.3: PIN de Seguridad',
          text: 'Para mánagers y anotadores autorizados en el dugout, el PIN canónico predeterminado es 1234 para desbloqueo táctico instantáneo sin fricción.'
        }
      ]
    },
    {
      num: 2,
      title: '2. Protocolo Pre-Juego: Wizard de 5 Pasos & Definición de Localía',
      badge: 'REGLAMENTO OFICIAL',
      icon: Calendar,
      content: [
        {
          sub: 'Paso 2.1: Rival & Logo',
          text: 'Presione "+ Configurar Partido & Rival". Seleccione un rival de la base de datos (ej. Criollos Master, Tampa Masters, Daytona Beach) o cree uno nuevo cargando su logotipo.'
        },
        {
          sub: 'Paso 2.2: Sede & Clima GPS',
          text: 'Confirme la sede oficial (Estadio Chucho Ramos / Lutz Baseball Park) y sincronice la telemetría climática (temperatura, humedad y dirección del viento).'
        },
        {
          sub: 'Paso 2.3: Localía (Home Club vs Visitante)',
          text: '• HOME CLUB (Local): Guerreros defiende en la Entrada Alta (▲) y cierra bateando en la Entrada Baja (▼).\n• VISITANTE: Guerreros abre el encuentro bateando en la Entrada Alta (▲).'
        },
        {
          sub: 'Paso 2.4: Abridor & Situación Clutch',
          text: 'Designe al lanzador abridor oficial (Raul Lozada #11 / Pedro Chavez #10) y determine el bateador clave para situaciones de alta presión.'
        },
        {
          sub: 'Paso 2.5: Certificar & Iniciar',
          text: 'Verifique la validación de 9 posiciones defensivas sin repeticiones y presione "Iniciar Juego Oficial".'
        }
      ]
    },
    {
      num: 3,
      title: '3. Lineup Builder Dual & Simulación Monte Carlo',
      badge: '16 INTEGRANTES + RIVAL',
      icon: Users,
      content: [
        {
          sub: 'Botonera Dual Home Club vs Visitante',
          text: 'Alterne y edite de forma independiente las alineaciones de ambos equipos manteniendo la paridad de datos.'
        },
        {
          sub: 'Acciones del Lineup de Guerreros',
          text: '• Cargar Lineup Oficial (+55): Restaura los 9 titulares y abridor calibrados.\n• 🔼 / 🔽: Reordena turnos al bate al instante arrastrando o pulsando.\n• Motor Monte Carlo (10,000 iteraciones): Proyecta carreras esperadas (xR) y rallies explosivos.'
        },
        {
          sub: 'Roster Oficial Calibrado (+55)',
          text: '• 9 Titulares: #1 Olivo (CF), #2 Morales (1B), #3 Lozada (SS), #4 Mitchell (2B), #5 Grillo (3B), #6 Vera (LF), #7 Moreno (RF), #8 Perez (C), #9 Rojas (DH).\n• Abridor & Reservas: #10 Chavez (P), #11 Silva, #12 Barrios, #13 Segarra, #14 Machado, #15 Avancines, #16 Rodriguez.'
        }
      ]
    },
    {
      num: 4,
      title: '4. Operación en Vivo (Dugout Keypad, 36 Jugadas Canónicas & Deshacer)',
      badge: 'EVENT SOURCING V2.4',
      icon: Activity,
      content: [
        {
          sub: '1. Flujo Táctico Alta/Baja',
          text: 'Alcanzados los 3 outs o con el botón de entrada, conmuta de alta a baja. Resetea outs y conteo a cero.'
        },
        {
          sub: '2. Conexiones & Hits',
          text: '[1B] Sencillo · [2B] Doble · [3B] Triple · [HR] Jonrón. Calcula automáticamente carreras impulsadas (RBI) y avance de corredores.'
        },
        {
          sub: '3. Outs Defensivos & Doble Play',
          text: '[Fly 1 a 9] Elevados por posición · [6-3, 4-3, 5-3, 1-3] Rolatas con asistencia · [6-4-3 DP] y [4-6-3 DP] Doble Matanza.'
        },
        {
          sub: '4. Pitcheo & Jugadas Especiales',
          text: '[K] Tirando · [Kc] Cantado · [BB] Boleto · [HBP] Golpeado · [SF/SH] Sacrificios · [SB] Robo · [CS] Out Robando · [E] Error.'
        },
        {
          sub: '5. Corrección Inmediata (Deshacer / Undo)',
          text: 'Presione el botón "DESHACER (UNDO)" para revertir de inmediato la última acción registrada manteniendo la integridad de la base de datos de eventos.'
        }
      ]
    },
    {
      num: 5,
      title: '5. Protocolo Médico-Deportivo: Semáforo de Fatiga (+55: Límite 75 Pitches)',
      badge: 'SEGURIDAD DEL ATLETA',
      icon: HeartPulse,
      content: [
        {
          sub: '🟢 0 - 50 Pitches (Zona Verde)',
          text: 'Rendimiento Óptimo y Plena Potencia. Elasticidad muscular y velocidad de brazo dentro de la ventana de confort.'
        },
        {
          sub: '🟡 51 - 65 Pitches (Zona Amarilla)',
          text: 'Precaución Médica: Monitorear velocidad y control de zona. Posible pérdida de quiebre en pitcheos rompientes.'
        },
        {
          sub: '🔴 66 - 75 Pitches (Zona Roja Crítica)',
          text: 'Límite Máximo Reglamentario +55. A los 70 lanzamientos se emite alerta acústica y visual obligatoria para activar el relevista en el bullpen.'
        },
        {
          sub: 'Relevo en Vivo',
          text: 'Sustituya al lanzador activo desde el banco con un solo toque para iniciar el conteo de envíos del nuevo pitcher en cero.'
        }
      ]
    },
    {
      num: 6,
      title: '6. Terreno Táctico 2D, Spray Chart & Posicionamiento Defensivo',
      badge: 'ESTADÍSTICA ESPACIAL',
      icon: Crosshair,
      content: [
        {
          sub: 'Marcado Táctico de Batazos',
          text: 'Haga clic sobre cualquier coordenada del diamante interactivo para trazar el vector de impacto con distancia en pies y velocidad de salida proyectada.'
        },
        {
          sub: '4 Formaciones Defensivas (Shifts)',
          text: 'Alterne entre Estándar, Formación Especial Derecha (para bateadores zurdos de jale), Infield Adentro (para cortar carrera de gane en home) y Defensa Profunda (prevención de extrabases).'
        },
        {
          sub: 'Filtros Sabermétricos de Spray',
          text: 'Filtre batazos entre Rodados (GB), Elevados (FB), Líneas (LD) y Jonrones (HR).'
        }
      ]
    },
    {
      num: 7,
      title: '7. Tarjeta Oficial de Béisbol Dual & Exportación Reglamentaria',
      badge: 'FORMATO FEDERADO',
      icon: FileSpreadsheet,
      content: [
        {
          sub: 'Tarjeta Dual para Árbitros y Mánagers',
          text: 'Visualice la hoja oficial de alineación y reservas para entrega a la cuarteta arbitral. Cuenta con botón de impresión directa adaptada a papel.'
        },
        {
          sub: 'Exportación de Boxscore Oficial',
          text: 'Resumen completo del partido estructurado en formato tabular para compartir por WhatsApp o publicar en boletines oficiales de la liga.'
        }
      ]
    },
    {
      num: 8,
      title: '8. Dashboard Sabermétrico, Métricas Avanzadas & Fórmulas',
      badge: 'MATEMÁTICA PURA',
      icon: BarChart3,
      content: [
        {
          sub: 'Fórmulas Deterministas sin Manipulación Manual',
          text: '• AVG: H / AB\n• OBP: (H + BB + HBP) / (AB + BB + HBP + SF)\n• SLG: (1B + 2·2B + 3·3B + 4·HR) / AB\n• OPS: OBP + SLG\n• wOBA: (0.69·BB + 0.72·HBP + 0.89·1B + 1.27·2B + 1.62·3B + 2.10·HR) / PA\n• ISO: SLG - AVG\n• Runs Created (RC): ((H + BB) · TB) / (AB + BB)\n• BABIP: (H - HR) / (AB - SO - HR + SF)'
        }
      ]
    },
    {
      num: 9,
      title: '9. Inteligencia Artificial Sabermétrica & Asistente Táctico',
      badge: 'SCOUTAI & RAG',
      icon: Cpu,
      content: [
        {
          sub: 'Motor Neuronal & Scouting Situacional',
          text: 'Prescribe decisiones tácticas en vivo ante conteos 3-2, posicionamiento defensivo ante bateadores de poder, probabilidad de victoria en vivo (Win Probability) y diagnóstico cinético de 33 puntos articulares en el bateo.'
        }
      ]
    },
    {
      num: 10,
      title: '10. Sincronización en la Nube (PostgreSQL / Supabase) & Modo Offline',
      badge: 'CLOUD SYNC ACTIVO',
      icon: Cloud,
      content: [
        {
          sub: 'Modo Desconectado (PWA Offline)',
          text: 'Si el estadio carece de señal celular o internet, DIAMAX PRO almacena cada jugada en el almacenamiento local del dispositivo sin interrumpir la anotación ni perder datos.'
        },
        {
          sub: 'Streaming Canónico a PostgreSQL',
          text: 'Al recuperar la conexión de datos, el motor sincroniza automáticamente los eventos en la base de datos oficial en la nube.'
        }
      ]
    }
  ];

  // Reglas Oficiales de Competición (+55)
  const competitionRules = [
    {
      code: 'Art. 42.1',
      title: 'Límite Máximo Legal de Lanzamientos (+55)',
      desc: 'El límite legal es de 75 lanzamientos por encuentro. A los 70 envíos el sistema emite alerta obligatoria de calentamiento en el bullpen. Si se alcanza a mitad de un turno, se permite culminar ese bateador.',
      penalty: 'Forfeit automático (9-0) en caso de enfrentar un nuevo bateador habiendo alcanzado 75 lanzamientos.'
    },
    {
      code: 'Art. 18.4',
      title: 'Corredor de Cortesía Obligatorio con 2 Outs',
      desc: 'Con dos outs en la pizarra, es obligatorio el ingreso de un corredor de cortesía para el receptor y lanzador activos en base, agilizando el ritmo de juego.',
      penalty: 'Pérdida de la base si se utiliza un corredor no autorizado tras apelación arbitral.'
    },
    {
      code: 'Art. 29.2',
      title: 'Regla de la Piedad (Nocaut y Super Nocaut)',
      desc: 'Se declarará nocaut con 10 carreras de ventaja tras 5 innings completos (o 4.5 si el home club lidera), y super nocaut con 15 carreras al 4to inning.',
      penalty: 'Finalización inmediata del encuentro.'
    },
    {
      code: 'Art. 14.6',
      title: 'Reingreso de Jugadores Titulares',
      desc: 'Cualquier jugador de la alineación titular puede ser sustituido y reingresar una sola vez, siempre ocupando su mismo turno en el orden al bate.',
      penalty: 'Bateador ilegal; out por regla y expulsión del mánager.'
    },
    {
      code: 'Art. 33.1',
      title: 'Desempate WBSC / Regla Olímpica en Extra-Innings',
      desc: 'A partir del 8vo inning, cada entrada inicia con corredores en 1ra y 2da base sin outs (los dos bateadores que preceden al bateador de turno).',
      penalty: 'Anulación de anotaciones si los corredores no corresponden al orden reglamentario.'
    },
    {
      code: 'Art. 08.3',
      title: 'Bates Certificados BPF 1.15 / BBCOR .50',
      desc: 'Permitidos bates de madera natural, composite certificado y aleación con sello oficial BPF 1.15 o BBCOR .50. Prohibidos bates alterados.',
      penalty: 'Expulsión inmediata del torneo.'
    }
  ];

  const toggleChapter = (num: number) => {
    soundSystem.playClick();
    setActiveChapter(prev => (prev === num ? null : num));
  };

  const handlePrint = () => {
    soundSystem.playClick();
    window.print();
  };

  const filteredChapters = chapters.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.content.some(item => item.sub.toLowerCase().includes(searchTerm.toLowerCase()) || item.text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-[#0B132B]/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <BookOpen className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              Manual Oficial de Operaciones & Protocolos DIAMAX PRO
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                10 Capítulos Canónicos
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Guía técnica y operativa paso a paso para Gerencia, Mánagers, Coaches, Umpires, Anotadores y Jugadores de Guerreros de Venezuela (+55).
          </p>
        </div>

        {/* View Mode Toggle & Print */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => {
                soundSystem.playClick();
                setViewMode('manual');
              }}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'manual' ? 'bg-amber-400 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Manual de Operación (10 Capítulos)
            </button>
            <button
              onClick={() => {
                soundSystem.playClick();
                setViewMode('rules');
              }}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'rules' ? 'bg-amber-400 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Reglamento de Juego (+55)
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white transition-all"
            title="Imprimir Manual Completo"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Search Input Filter */}
      <div className="my-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar en el manual (ej: semáforo, localía, Monte Carlo, undo)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* VIEW MODE 1: MANUAL DE OPERACIÓN (10 CAPÍTULOS COMPLETOS) */}
      {viewMode === 'manual' ? (
        <div className="space-y-3">
          {filteredChapters.map((ch) => {
            const Icon = ch.icon;
            const isExpanded = activeChapter === ch.num || searchTerm.length > 0;

            return (
              <div
                key={ch.num}
                className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden transition-all hover:border-slate-700"
              >
                {/* Chapter Header Accordion Toggle */}
                <button
                  type="button"
                  onClick={() => toggleChapter(ch.num)}
                  className="w-full p-4 flex items-center justify-between text-left focus:outline-none bg-slate-900/40 hover:bg-slate-800/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-cyan-400/20">
                          {ch.badge}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-0.5">
                        {ch.title}
                      </h4>
                    </div>
                  </div>

                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Chapter Content Details */}
                {isExpanded && (
                  <div className="p-4 pt-1 border-t border-slate-800/80 space-y-3 animate-in fade-in duration-150">
                    {ch.content.map((item, idx) => (
                      <div key={idx} className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/60 text-xs">
                        <h5 className="font-bold text-amber-300 mb-1">
                          {item.sub}
                        </h5>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* VIEW MODE 2: REGLAMENTO OFICIAL DE COMPETICIÓN (+55) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {competitionRules.map((rule, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-amber-400/20">
                    {rule.code}
                  </span>
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Oficial FVB
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mt-2.5 mb-1">
                  {rule.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  {rule.desc}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 text-rose-400 text-[11px] font-semibold">
                ⚠️ Sanción: <span className="text-slate-300 font-normal">{rule.penalty}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
