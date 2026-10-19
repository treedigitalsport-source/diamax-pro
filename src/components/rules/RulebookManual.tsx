import React, { useState } from 'react';
import {
  BookOpen,
  ShieldAlert,
  Search,
  CheckCircle2
} from 'lucide-react';

interface RuleItem {
  id: string;
  category: string;
  article: string;
  title: string;
  summary: string;
  details: string;
  strictPenalty: string;
}

export const RulebookManual: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const rules: RuleItem[] = [
    {
      id: 'rule-pitch-limit',
      category: 'PITCHING',
      article: 'Art. 42.1',
      title: 'Límite Máximo Legal de Lanzamientos (+55)',
      summary: 'El límite oficial infranqueable por lanzador es de setenta y cinco (75) envíos por encuentro.',
      details: 'Ningún lanzador en la categoría Master +55 podrá sobrepasar los 75 lanzamientos oficiales. Si el límite se alcanza a mitad de un turno al bate, se autoriza al pitcher a culminar dicho bateador. Al llegar a 70 envíos, el sistema DIAMAX emite alerta obligatoria de preparación en el bullpen.',
      strictPenalty: 'Confiscación automática del juego (Forfeit 9-0) en caso de superar los 75 envíos con un nuevo bateador.'
    },
    {
      id: 'rule-courtesy-runner',
      category: 'CORREDORES',
      article: 'Art. 18.4',
      title: 'Corredor de Cortesía para Receptor y Lanzador',
      summary: 'Obligatorio con dos (2) outs para agilizar la entrada y preservar la condición física.',
      details: 'Con dos outs en la pizarra, es imperativo ingresar un corredor de cortesía para el catcher y pitcher activos en base. El corredor de cortesía debe ser el último bateador que haya sido out en el orden al bate, o un jugador de la banca que no haya participado si las bases están congestionadas.',
      strictPenalty: 'Pérdida de la base en caso de designar un corredor no elegible tras apelación antes del siguiente lanzamiento.'
    },
    {
      id: 'rule-mercy-knockout',
      category: 'FINALIZACIÓN',
      article: 'Art. 29.2',
      title: 'Regla de la Piedad (Super Nocaut y Nocaut)',
      summary: 'Diferencia de 15 carreras al 4to inning o 10 carreras al 5to inning completo.',
      details: 'El juego se declarará finalizado por Nocaut si un equipo aventaja al rival por diez (10) o más carreras habiéndose completado cinco (5) entradas reglamentarias (o 4 entradas y media si el equipo local está arriba). Se aplicará Súper Nocaut con 15 carreras de diferencia al 4to inning.',
      strictPenalty: 'Cierre oficial e irreversible de la hoja de anotación.'
    },
    {
      id: 'rule-reentry',
      category: 'ALINEACIÓN',
      article: 'Art. 14.6',
      title: 'Regla de Reingreso de Jugadores Titulares',
      summary: 'Cualquier jugador abridor puede ser sustituido y reingresar una sola vez.',
      details: 'Un jugador del lineup abridor que haya sido reemplazado puede reingresar al juego una única vez, siempre y cuando ocupe exactamente su posición original en el orden al bate. El sustituto que sale no puede volver a participar bajo ninguna circunstancia.',
      strictPenalty: 'Bateador ilegal; out por regla y expulsión del manager infractor.'
    },
    {
      id: 'rule-tiebreaker',
      category: 'EXTRA-INNING',
      article: 'Art. 33.1',
      title: 'Desempate WBSC / Regla Olímpica',
      summary: 'Entradas extras inician con corredores en 1ra y 2da base sin outs.',
      details: 'Si el juego culmina empatado en las siete (7) entradas regulares, a partir del 8vo inning cada equipo comenzará su turno al bate colocando a los dos bateadores que preceden al bateador de turno en primera y segunda base sin outs.',
      strictPenalty: 'Invalidez de las carreras anotadas si los corredores asignados no corresponden al orden correlativo.'
    },
    {
      id: 'rule-bats',
      category: 'EQUIPAMIENTO',
      article: 'Art. 08.3',
      title: 'Especificaciones de Bates Certificados',
      summary: 'Permitidos bates de madera pura, composite certificado y aleación BBCOR .50.',
      details: 'Todos los bates deben portar el sello oficial de fábrica BPF 1.15 o BBCOR .50. Se prohíbe terminantemente el uso de bates alterados, rebajados o que no cumplan con la relación peso-longitud reglamentaria (-3 en aleación, o madera natural).',
      strictPenalty: 'Expulsión inmediata del bateador del torneo y anulación de cualquier jugada resultante.'
    }
  ];

  const filteredRules = rules.filter(rule => {
    const matchesCat = selectedCategory === 'ALL' || rule.category === selectedCategory;
    const matchesSearch =
      rule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.article.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

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
              Manual de Reglas y Condiciones de Juego (+55)
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Reglamento Oficial FVB / WBSC
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Compendio canónico de estatutos, restricciones médicas y normativas para la Liga Master Guerreros +55.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar regla o artículo..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2 my-4">
        {['ALL', 'PITCHING', 'CORREDORES', 'FINALIZACIÓN', 'ALINEACIÓN', 'EXTRA-INNING', 'EQUIPAMIENTO'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat === 'ALL' ? 'TODAS LAS REGLAS' : cat}
          </button>
        ))}
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-amber-400/20">
                  {rule.article} • {rule.category}
                </span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Vigente
                </span>
              </div>

              <h4 className="text-sm font-bold text-white mt-2.5 mb-1">
                {rule.title}
              </h4>
              <p className="text-xs text-amber-300/90 font-medium mb-2">
                {rule.summary}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                {rule.details}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 bg-rose-950/20 rounded-lg p-2.5 border border-rose-900/30">
              <div className="text-[10px] font-bold text-rose-400 uppercase flex items-center gap-1 mb-0.5">
                <ShieldAlert className="w-3.5 h-3.5" /> Sanción por Incumplimiento:
              </div>
              <div className="text-xs text-slate-300">
                {rule.strictPenalty}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
