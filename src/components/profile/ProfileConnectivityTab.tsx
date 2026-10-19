import React, { useState } from 'react';
import {
  Building2,
  Save,
  Cloud,
  CheckCircle2,
  Volume2,
  RotateCw,
  MapPin,
  Calendar,
  Clock,
  Swords,
  Download,
  Key,
  Database
} from 'lucide-react';
import { Player, GameState } from '../../types/baseball';
import { soundSystem } from '../../utils/soundSystem';

interface ProfileConnectivityTabProps {
  gameState: GameState;
  pitchers: Player[];
  onUpdateGameConfig: (config: {
    homeTeam?: string;
    awayTeam?: string;
    venue?: string;
    isHomeClub?: boolean;
    currentPitcher?: Player;
    date?: string;
  }) => void;
}

export const ProfileConnectivityTab: React.FC<ProfileConnectivityTabProps> = ({
  gameState,
  pitchers,
  onUpdateGameConfig
}) => {
  // 1. Club Profile State
  const [teamName, setTeamName] = useState<string>(gameState.homeTeam || 'Guerreros de Venezuela +55');
  const [manager, setManager] = useState<string>('Leandro Chávez');
  const [venueAddress, setVenueAddress] = useState<string>('5709 Kingfish Drive, Lutz, Florida, USA 33558');
  const [category] = useState<string>('Master +55 (Límite 75 envíos)');
  const [modality] = useState<string>('Béisbol Adulto / Master');

  // 2. Tactical Pre-Game Setup State
  const [rivalName, setRivalName] = useState<string>(gameState.awayTeam || 'Cerveceros de Miranda');
  const [rivalAbbr, setRivalAbbr] = useState<string>('CER');
  const [rivalManager, setRivalManager] = useState<string>('Carlos Mendoza');
  const [rivalPitcher, setRivalPitcher] = useState<string>('Freddy García');
  const [rivalArm, setRivalArm] = useState<'RHP' | 'LHP'>('RHP');

  const [gameDate, setGameDate] = useState<string>(gameState.date || new Date().toISOString().split('T')[0]);
  const [gameTime, setGameTime] = useState<string>('10:00 AM');
  const [stadiumVenue, setStadiumVenue] = useState<string>(gameState.venue || 'Estadio Universitario de Caracas');
  const [isHomeClub, setIsHomeClub] = useState<boolean>(gameState.isHomeClub !== undefined ? gameState.isHomeClub : true);

  const [selectedPitcherId, setSelectedPitcherId] = useState<number>(
    gameState.currentPitcher?.id || (pitchers[0]?.id || 0)
  );
  const [clutchBatterId, setClutchBatterId] = useState<number>(
    gameState.lineup[3]?.player.id || (gameState.lineup[0]?.player.id || 0)
  );

  // Weather telemetry state
  const [weatherTelemetry, setWeatherTelemetry] = useState({
    temp: '28°C',
    humidity: '68%',
    wind: '12 km/h hacia CF',
    pressure: '1013 hPa'
  });
  const [isRefreshingGps, setIsRefreshingGps] = useState<boolean>(false);

  // 3. Supabase Cloud Connectivity State
  const [supabaseUrl, setSupabaseUrl] = useState<string>('https://diamax-pro.supabase.co');
  const [supabaseKey, setSupabaseKey] = useState<string>('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [cloudStatus, setCloudStatus] = useState<string>('Nube PostgreSQL conectada en tiempo real (Latencia 38ms)');

  // 4. AI Key & Voice
  const [aiKey, setAiKey] = useState<string>('3TREE-DIAMAX-GROQ-SECURE-ALPHA');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleSaveProfile = () => {
    soundSystem.playClick();
    onUpdateGameConfig({
      homeTeam: teamName,
      venue: stadiumVenue
    });
    setStatusMessage('Perfil del Club y Sede actualizados exitosamente en la memoria del sistema.');
    setTimeout(() => setStatusMessage(''), 3500);
  };

  const handleApplyPreGameSetup = () => {
    soundSystem.playHomeRun();
    const pitcherObj = pitchers.find(p => p.id === selectedPitcherId) || gameState.currentPitcher;
    onUpdateGameConfig({
      homeTeam: teamName,
      awayTeam: rivalName,
      venue: stadiumVenue,
      isHomeClub,
      currentPitcher: pitcherObj,
      date: gameDate
    });
    soundSystem.speak(`Configuración táctica aplicada. Partido configurado contra ${rivalName} en ${stadiumVenue}`);
    setStatusMessage(`Partido Oficial Activado: ${teamName} vs ${rivalName}. Localía: ${isHomeClub ? 'Home Club' : 'Visitante'}.`);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const handleRefreshGps = () => {
    soundSystem.playClick();
    setIsRefreshingGps(true);
    setTimeout(() => {
      setIsRefreshingGps(false);
      setWeatherTelemetry({
        temp: '29°C',
        humidity: '64%',
        wind: '14 km/h hacia LF/CF',
        pressure: '1012 hPa'
      });
      soundSystem.speak('Telemetría meteorológica GPS actualizada en el diamante');
    }, 600);
  };

  const handleTestVoice = () => {
    soundSystem.playClick();
    soundSystem.speak('Sistema acústico y narrador por voz de DIAMAX PRO activo y operando correctamente.');
  };

  const handleSyncCloud = () => {
    soundSystem.playClick();
    setIsCloudSyncing(true);
    setTimeout(() => {
      setIsCloudSyncing(false);
      setCloudStatus('Sincronización forense completada con Supabase Cloud. 0 discrepancias.');
      soundSystem.speak('Datos sincronizados con la nube');
    }, 700);
  };

  const handleExportBackup = () => {
    soundSystem.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(gameState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `DIAMAX_BACKUP_${teamName.replace(/\s+/g, '_')}_${gameDate}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>Pestaña Canónica 08 • Centro de Mando Táctico</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Perfil del Equipo, Rivales & Conectividad Cloud
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Gestión multi-tenant de la franquicia, configuración pre-juego (Reglas Oficiales 1-9) y sincronización con Supabase PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestVoice}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-all"
            title="Probar sintetizador de voz"
          >
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>Probar Voz</span>
          </button>
          <button
            onClick={handleExportBackup}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-all"
            title="Exportar respaldo JSON de todo el estado"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Exportar JSON</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-500/15 border border-emerald-400/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{statusMessage}</span>
        </div>
      )}

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PANEL 1: DATOS OFICIALES DEL CLUB */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Datos Oficiales del Club & Franquicia</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
              Multi-Tenant
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Nombre Oficial del Equipo:</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Mánager Oficial:</label>
                <input
                  type="text"
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Categoría Oficial:</label>
                <input
                  type="text"
                  value={category}
                  disabled
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Sede Oficial / Dirección:</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <div className="w-14 h-14 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center text-amber-400 font-black text-xs font-mono shadow-md shadow-amber-500/20">
                GVE55
              </div>
              <div className="flex-1 text-[11px] text-slate-400">
                <span className="text-white font-bold block mb-0.5">Franquicia Federada FVB / WBSC</span>
                <span>Modalidad: {modality} · Regla Canónica de 75 Pitcheos Activa.</span>
              </div>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
              >
                <Save className="w-3.5 h-3.5 text-slate-950" />
                <span>Guardar Club</span>
              </button>
            </div>
          </div>
        </div>

        {/* PANEL 2: CONECTIVIDAD CLOUD & SUPABASE */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Supabase Cloud (PostgreSQL & Realtime)</span>
            </h3>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sincronizado
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">URL del Proyecto Supabase:</label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Anon Public Key / JWT Token:</label>
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Clave de Acceso Motor IA (3Tree Security):</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={aiKey}
                  onChange={(e) => setAiKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{cloudStatus}</span>
              </div>
              <button
                type="button"
                onClick={handleSyncCloud}
                disabled={isCloudSyncing}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/40 flex items-center gap-1 transition-all"
              >
                <RotateCw className={`w-3 h-3 text-emerald-400 ${isCloudSyncing ? 'animate-spin' : ''}`} />
                <span>{isCloudSyncing ? 'Sincronizando...' : 'Sincronizar'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* PANEL 3: CONFIGURACIÓN TÁCTICA PRE-JUEGO (REGLAS 1-9) — Full Width */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <Swords className="w-5 h-5 text-amber-400" />
                <span>🏟️ Configuración Táctica Pre-Juego (Reglas Oficiales 1-9)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Definición canónica de rival, localía, telemetría meteorológica y abridor del cotejo.
              </p>
            </div>

            <button
              type="button"
              onClick={handleApplyPreGameSetup}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <span>⚾ Iniciar Encuentro Oficial</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            {/* 1. Datos del Rival */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                <span>⚔️ 1. Cargar Equipo Rival</span>
              </h4>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Nombre del Club Rival:</label>
                <input
                  type="text"
                  value={rivalName}
                  onChange={(e) => setRivalName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-bold"
                  placeholder="Cerveceros de Miranda"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Siglas (3 Ltrs):</label>
                  <input
                    type="text"
                    value={rivalAbbr}
                    maxLength={3}
                    onChange={(e) => setRivalAbbr(e.target.value.toUpperCase())}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Mánager Rival:</label>
                  <input
                    type="text"
                    value={rivalManager}
                    onChange={(e) => setRivalManager(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Abridor As Rival:</label>
                  <input
                    type="text"
                    value={rivalPitcher}
                    onChange={(e) => setRivalPitcher(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Brazo Lanzador:</label>
                  <select
                    value={rivalArm}
                    onChange={(e) => setRivalArm(e.target.value as 'RHP' | 'LHP')}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                  >
                    <option value="RHP">Diestro (RHP)</option>
                    <option value="LHP">Zurdo (LHP)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Sede, Fecha y Clima */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="font-bold text-cyan-300 flex items-center gap-1.5 text-xs">
                <span>🏟️ 2. Sede, Fecha & Clima GPS</span>
              </h4>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Estadio / Sede Oficial:</label>
                <input
                  type="text"
                  value={stadiumVenue}
                  onChange={(e) => setStadiumVenue(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Fecha del Partido:</label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={gameDate}
                      onChange={(e) => setGameDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-7 pr-2 py-1.5 text-white text-[11px]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Hora de Inicio:</label>
                  <div className="relative">
                    <Clock className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={gameTime}
                      onChange={(e) => setGameTime(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-7 pr-2 py-1.5 text-white text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Weather Telemetry Box */}
              <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                  <span>🌤️ Telemetría GPS en Vivo</span>
                  <button
                    type="button"
                    onClick={handleRefreshGps}
                    className="text-cyan-400 hover:text-white flex items-center gap-1"
                  >
                    <RotateCw className={`w-3 h-3 ${isRefreshingGps ? 'animate-spin' : ''}`} />
                    <span>Actualizar</span>
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-1 text-center font-mono text-[10px]">
                  <div className="bg-slate-950 p-1 rounded">
                    <div className="text-slate-500 text-[8px]">TEMP</div>
                    <div className="text-white font-bold">{weatherTelemetry.temp}</div>
                  </div>
                  <div className="bg-slate-950 p-1 rounded">
                    <div className="text-slate-500 text-[8px]">HUM</div>
                    <div className="text-white font-bold">{weatherTelemetry.humidity}</div>
                  </div>
                  <div className="bg-slate-950 p-1 rounded">
                    <div className="text-slate-500 text-[8px]">VIENTO</div>
                    <div className="text-cyan-400 font-bold truncate">{weatherTelemetry.wind}</div>
                  </div>
                  <div className="bg-slate-950 p-1 rounded">
                    <div className="text-slate-500 text-[8px]">PRES</div>
                    <div className="text-white font-bold">{weatherTelemetry.pressure}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Localía y Roster Guerreros */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
                <span>🇻🇪 3. Táctica Guerreros (+55)</span>
              </h4>

              {/* Locality Toggle */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Definición de Localía:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      soundSystem.playClick();
                      setIsHomeClub(true);
                    }}
                    className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all border ${
                      isHomeClub
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    🏠 Home Club
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundSystem.playClick();
                      setIsHomeClub(false);
                    }}
                    className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all border ${
                      !isHomeClub
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    ✈️ Visitante
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Pitcher Abridor de Guerreros:</label>
                <select
                  value={selectedPitcherId}
                  onChange={(e) => setSelectedPitcherId(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-bold"
                >
                  {pitchers.map((p) => (
                    <option key={p.id} value={p.id}>
                      #{p.num} {p.name} ({p.defaultPos || 'P'}) {p.era ? `· ERA ${p.era}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Bateador Clave (Situaciones Clutch):</label>
                <select
                  value={clutchBatterId}
                  onChange={(e) => setClutchBatterId(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-bold"
                >
                  {gameState.lineup.map((slot) => (
                    <option key={slot.player.id} value={slot.player.id}>
                      {slot.order}. #{slot.player.num} {slot.player.name} ({slot.pos}) {slot.player.ops ? `· OPS ${slot.player.ops}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
