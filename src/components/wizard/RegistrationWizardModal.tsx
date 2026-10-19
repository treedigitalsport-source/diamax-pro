import React, { useState } from 'react';
import {
  Shield,
  User,
  Mail,
  Lock,
  Phone,
  CheckCircle2,
  Building2,
  Award,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Key,
  Copy,
  Check
} from 'lucide-react';
import { soundSystem } from '../../utils/soundSystem';

interface RegistrationWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteRegistration?: (data: { teamName: string; managerName: string; plan: string }) => void;
  initialTab?: 'register' | 'login';
}

type UserRole = 'MANAGER' | 'COACH' | 'ADMIN_LIGA' | 'JUGADOR';
type PlanType = 'TRIAL' | 'MANAGER' | 'LIGA';

export const RegistrationWizardModal: React.FC<RegistrationWizardModalProps> = ({
  isOpen,
  onClose,
  onCompleteRegistration,
  initialTab = 'register'
}) => {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>(initialTab);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: User Data
  const [fullName, setFullName] = useState<string>('Lic. Alí José Zapata Mendoza');
  const [email, setEmail] = useState<string>('ali.zapata@3treedigitalsport.com');
  const [password, setPassword] = useState<string>('diamax2026');
  const [confirmPassword, setConfirmPassword] = useState<string>('diamax2026');
  const [phone, setPhone] = useState<string>('+58 412-555-3333');
  const [role, setRole] = useState<UserRole>('MANAGER');

  // Step 2: Team Data
  const [teamMode, setTeamMode] = useState<'create' | 'join'>('create');
  const [teamName, setTeamName] = useState<string>('Guerreros de Venezuela +55');
  const [category, setCategory] = useState<string>('Master +55');
  const [modality, setModality] = useState<string>('Béisbol Adulto / Master');
  const [country, setCountry] = useState<string>('Venezuela');
  const [state, setState] = useState<string>('Distrito Capital / Miranda');
  const [city, setCity] = useState<string>('Caracas');
  const [league, setLeague] = useState<string>('Liga de Béisbol Máster Chucho Ramos');
  const [selectedColor, setSelectedColor] = useState<string>('#F26522');
  const [joinCode, setJoinCode] = useState<string>('');

  // Step 3: Plan Selection
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('TRIAL');

  // Step 4: OTP Verification
  const [otpCode, setOtpCode] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string>('');

  // Step 5: Credentials Generated
  const [zeroTrustKey] = useState<string>('DIAMAX-ZT-9821-3TREE-ALPHA');
  const [franchiseId] = useState<string>('FRANQ-GVE55-MASTER');
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState<string>('ali.zapata@3treedigitalsport.com');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginAlert, setLoginAlert] = useState<string>('');

  if (!isOpen) return null;

  const handleNextStep = () => {
    soundSystem.playClick();
    if (currentStep === 1) {
      if (!fullName || !email || !password) {
        alert('Por favor complete los campos obligatorios del usuario.');
        return;
      }
      if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
      }
    }
    if (currentStep === 2 && teamMode === 'create' && !teamName) {
      alert('Por favor ingrese el nombre del equipo.');
      return;
    }
    setCurrentStep(prev => Math.min(5, prev + 1));
  };

  const handlePrevStep = () => {
    soundSystem.playClick();
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleVerifyOtp = (codeToTest?: string) => {
    soundSystem.playClick();
    setIsVerifying(true);
    setOtpError('');
    const code = codeToTest || otpCode;
    setTimeout(() => {
      setIsVerifying(false);
      if (code === '777000' || code === '123456' || code === '777-000' || codeToTest) {
        soundSystem.playHomeRun();
        setCurrentStep(5);
      } else {
        setOtpError('Código de verificación incorrecto. Use el código 777-000 o presione el botón de bypass QA.');
      }
    }, 600);
  };

  const handleCompleteAndEnter = () => {
    soundSystem.playHit();
    onCompleteRegistration?.({
      teamName,
      managerName: fullName,
      plan: selectedPlan
    });
    onClose();
  };

  const handleMasterCeoLogin = () => {
    soundSystem.playHomeRun();
    setLoginEmail('ali.zapata@3treedigitalsport.com');
    setLoginPassword('CEO-3TREE-MAESTRO');
    setLoginAlert('Acceso Maestro de Fundador & CEO Validado. Redirigiendo a DIAMAX PRO OS...');
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const copyToClipboard = (text: string) => {
    soundSystem.playClick();
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-slate-900 border border-cyan-400/40 flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-white font-mono tracking-wider flex items-center gap-2">
                DIAMAX PRO <span className="text-cyan-400">WIZARD</span>
              </h3>
              <p className="text-xs text-slate-400">
                Registro de Franquicias, Planes y Activación Zero-Trust
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            title="Cerrar Ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle: Registro vs Login */}
        <div className="grid grid-cols-2 bg-slate-950/90 border-b border-slate-800 text-xs font-bold font-mono">
          <button
            onClick={() => {
              soundSystem.playClick();
              setActiveTab('register');
            }}
            className={`py-3 text-center border-b-2 transition-all ${
              activeTab === 'register'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            NUEVA FRANQUICIA (REGISTRO & PLANES)
          </button>
          <button
            onClick={() => {
              soundSystem.playClick();
              setActiveTab('login');
            }}
            className={`py-3 text-center border-b-2 transition-all ${
              activeTab === 'login'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            INICIAR SESIÓN / ACCESO MAESTRO CEO
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 max-h-[80vh] overflow-y-auto">
          {activeTab === 'register' ? (
            <div>
              {/* Stepper Progress Bar */}
              {currentStep < 5 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs font-mono font-bold mb-2">
                    <span className="text-cyan-400">
                      PASO 0{currentStep} / 04:{' '}
                      {currentStep === 1 && 'DATOS DEL USUARIO / MANAGER'}
                      {currentStep === 2 && 'CONFIGURACIÓN DE EQUIPO'}
                      {currentStep === 3 && 'SELECCIÓN DE PLANES'}
                      {currentStep === 4 && 'ACTIVACIÓN ZERO-TRUST'}
                    </span>
                    <span className="text-slate-400">{Math.round((currentStep / 4) * 100)}%</span>
                  </div>

                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400 transition-all duration-300"
                      style={{ width: `${(currentStep / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* STEP 1: DATOS DEL USUARIO */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="border-b border-slate-800 pb-2">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-cyan-400" />
                      <span>Datos del Mánager / Administrador</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Ingrese las credenciales principales para la gestión táctica de su franquicia.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-medium"
                          placeholder="Lic. Alí Zapata"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-medium"
                          placeholder="correo@ejemplo.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Contraseña de Seguridad *</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-medium"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Confirmar Contraseña *</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-medium"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono Móvil (WhatsApp para reportes y Boxscores)</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-medium"
                          placeholder="+58 412 000 0000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Role Selector Cards */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Rol Operativo en DIAMAX PRO</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { id: 'MANAGER' as UserRole, label: 'Manager / Head Coach', desc: 'Lineups, táctica y bullpen' },
                        { id: 'COACH' as UserRole, label: 'Coach Asistente', desc: 'Anotación y scouting' },
                        { id: 'ADMIN_LIGA' as UserRole, label: 'Directiva de Liga', desc: 'Torneo y arbitraje' },
                        { id: 'JUGADOR' as UserRole, label: 'Jugador / Atleta', desc: 'Estadísticas personales' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            soundSystem.playClick();
                            setRole(item.id);
                          }}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            role === item.id
                              ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="font-bold text-xs text-cyan-300 mb-0.5">{item.label}</div>
                          <div className="text-[10px] text-slate-400">{item.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: CONFIGURACIÓN DE EQUIPO */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="border-b border-slate-800 pb-2">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      <span>Configuración de Liga / Equipo (Multi-Tenant)</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Defina la franquicia deportiva que comandará en el terreno de juego.
                    </p>
                  </div>

                  {/* Mode Toggle: Crear vs Unirse */}
                  <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        soundSystem.playClick();
                        setTeamMode('create');
                      }}
                      className={`flex-1 py-2 rounded-lg transition-all ${
                        teamMode === 'create'
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      + Crear Nuevo Equipo / Franquicia
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundSystem.playClick();
                        setTeamMode('join');
                      }}
                      className={`flex-1 py-2 rounded-lg transition-all ${
                        teamMode === 'join'
                          ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Unirse con Código de Invitación
                    </button>
                  </div>

                  {teamMode === 'create' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Oficial del Equipo *</label>
                        <input
                          type="text"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-bold"
                          placeholder="Ej: Guerreros de Venezuela +55"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría Oficial</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                        >
                          <option value="Master +55">Master +55 (Límite 75 envíos)</option>
                          <option value="Master +40">Master +40</option>
                          <option value="Magister +60">Magister +60</option>
                          <option value="Doble A">Doble A (AA)</option>
                          <option value="Libre Adulto">Libre Adulto</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Modalidad Deportiva</label>
                        <select
                          value={modality}
                          onChange={(e) => setModality(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                        >
                          <option value="Béisbol Adulto / Master">Béisbol Adulto / Master</option>
                          <option value="Sóftbol Bola Rápida">Sóftbol Bola Rápida</option>
                          <option value="Sóftbol Modificado">Sóftbol Modificado</option>
                          <option value="Béisbol Five (WBSC)">Béisbol Five (WBSC)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">País</label>
                        <input
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                          placeholder="Venezuela"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Estado / Región</label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                          placeholder="Distrito Capital / Miranda"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Ciudad / Municipio</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                          placeholder="Caracas"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Liga Federada</label>
                        <input
                          type="text"
                          value={league}
                          onChange={(e) => setLeague(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                          placeholder="Liga de Béisbol Máster Chucho Ramos"
                        />
                      </div>

                      {/* Color Palette Selector */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Color Primario de la Franquicia</label>
                        <div className="flex items-center gap-3">
                          {[
                            { hex: '#F26522', label: 'Naranja 3Tree' },
                            { hex: '#00D2FF', label: 'Cian Neón' },
                            { hex: '#FFC72C', label: 'Oro 24k' },
                            { hex: '#10B981', label: 'Esmeralda' },
                            { hex: '#EF4444', label: 'Rojo Carmesí' }
                          ].map((c) => (
                            <button
                              key={c.hex}
                              type="button"
                              onClick={() => {
                                soundSystem.playClick();
                                setSelectedColor(c.hex);
                              }}
                              className={`w-8 h-8 rounded-full border-2 transition-transform ${
                                selectedColor === c.hex ? 'scale-125 border-white ring-2 ring-cyan-400' : 'border-transparent hover:scale-110'
                              }`}
                              style={{ backgroundColor: c.hex }}
                              title={c.label}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                      <label className="block text-xs font-semibold text-slate-300">
                        Código de Invitación de Franquicia
                      </label>
                      <input
                        type="text"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        placeholder="Ej: GVE55-WARRIOR-2026"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-cyan-400"
                      />
                      <p className="text-[11px] text-slate-400">
                        Solicite este código al mánager o presidente de su equipo para vincularse automáticamente a su roster y calendario.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: SELECCIÓN DE PLANES & MES GRATIS */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>Planes de Suscripción & Mes Gratis</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Todos los planes incluyen 30 días de prueba gratuita sin compromiso.
                      </p>
                    </div>

                    {/* Billing Period Toggle */}
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => setBillingPeriod('monthly')}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          billingPeriod === 'monthly' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                        }`}
                      >
                        Mensual
                      </button>
                      <button
                        type="button"
                        onClick={() => setBillingPeriod('annual')}
                        className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                          billingPeriod === 'annual' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                        }`}
                      >
                        <span>Anual</span>
                        <span className="text-[9px] px-1 bg-amber-400 text-slate-950 rounded">Ahorro 25%</span>
                      </button>
                    </div>
                  </div>

                  {/* Plans Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {/* Plan 1: TRIAL */}
                    <div
                      onClick={() => {
                        soundSystem.playClick();
                        setSelectedPlan('TRIAL');
                      }}
                      className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        selectedPlan === 'TRIAL'
                          ? 'bg-slate-950 border-emerald-400 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-400/30'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="absolute -top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                        Recomendado
                      </div>

                      <div>
                        <div className="text-xs font-mono font-bold text-emerald-400 uppercase">PLAN 1 • MES GRATIS</div>
                        <h5 className="text-base font-black text-white mt-1">30 Días de Prueba</h5>
                        <div className="text-2xl font-black text-white font-mono mt-2 mb-3">
                          $0 <span className="text-xs text-slate-400 font-normal">/ 1er mes</span>
                        </div>

                        <ul className="text-xs text-slate-300 space-y-1.5 border-t border-slate-800 pt-3">
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Dugout Scoreboard LED</li>
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Semáforo Fatiga (+55: 75 envíos)</li>
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Botonera 36 Jugadas con Undo</li>
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Simulador Markov 10,000 juegos</li>
                        </ul>
                      </div>

                      <div className="mt-4 pt-2">
                        <span className={`block w-full text-center py-2 rounded-xl text-xs font-bold ${
                          selectedPlan === 'TRIAL' ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {selectedPlan === 'TRIAL' ? 'Plan Seleccionado' : 'Seleccionar'}
                        </span>
                      </div>
                    </div>

                    {/* Plan 2: MANAGER PRO */}
                    <div
                      onClick={() => {
                        soundSystem.playClick();
                        setSelectedPlan('MANAGER');
                      }}
                      className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        selectedPlan === 'MANAGER'
                          ? 'bg-slate-950 border-cyan-400 shadow-xl shadow-cyan-500/10 ring-2 ring-cyan-400/30'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-mono font-bold text-cyan-400 uppercase">PLAN 2 • MANAGER PRO</div>
                        <h5 className="text-base font-black text-white mt-1">Franquicia Competitiva</h5>
                        <div className="text-2xl font-black text-white font-mono mt-2 mb-3">
                          {billingPeriod === 'monthly' ? '$9.99' : '$89.00'} <span className="text-xs text-slate-400 font-normal">/{billingPeriod === 'monthly' ? 'mes' : 'año'}</span>
                        </div>

                        <ul className="text-xs text-slate-300 space-y-1.5 border-t border-slate-800 pt-3">
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Todo lo del Plan Mes Gratis</li>
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> ScoutAI Biomechanics HUD</li>
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Spray Chart Vectorial & Heatmap</li>
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Roster oficial ilimitado</li>
                        </ul>
                      </div>

                      <div className="mt-4 pt-2">
                        <span className={`block w-full text-center py-2 rounded-xl text-xs font-bold ${
                          selectedPlan === 'MANAGER' ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {selectedPlan === 'MANAGER' ? 'Plan Seleccionado' : 'Seleccionar'}
                        </span>
                      </div>
                    </div>

                    {/* Plan 3: LIGA MÁSTER */}
                    <div
                      onClick={() => {
                        soundSystem.playClick();
                        setSelectedPlan('LIGA');
                      }}
                      className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        selectedPlan === 'LIGA'
                          ? 'bg-slate-950 border-amber-400 shadow-xl shadow-amber-500/10 ring-2 ring-amber-400/30'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-mono font-bold text-amber-400 uppercase">PLAN 3 • LIGA ENTERPRISE</div>
                        <h5 className="text-base font-black text-white mt-1">Circuito / Asociación</h5>
                        <div className="text-2xl font-black text-white font-mono mt-2 mb-3">
                          {billingPeriod === 'monthly' ? '$29.99' : '$280.00'} <span className="text-xs text-slate-400 font-normal">/{billingPeriod === 'monthly' ? 'mes' : 'año'}</span>
                        </div>

                        <ul className="text-xs text-slate-300 space-y-1.5 border-t border-slate-800 pt-3">
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Multi-equipos y torneos</li>
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Tarjeta oficial FVB / WBSC</li>
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Base de datos PostgreSQL Cloud</li>
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Soporte prioritario 24/7</li>
                        </ul>
                      </div>

                      <div className="mt-4 pt-2">
                        <span className={`block w-full text-center py-2 rounded-xl text-xs font-bold ${
                          selectedPlan === 'LIGA' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {selectedPlan === 'LIGA' ? 'Plan Seleccionado' : 'Seleccionar'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: ACTIVACIÓN ZERO-TRUST */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="border-b border-slate-800 pb-2">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      <span>Confirmación y Activación Segura Zero Trust</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Para certificar la autenticidad del mánager, ingrese el código enviado a su correo electrónico.
                    </p>
                  </div>

                  {/* Resumen del Pedido */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Franquicia:</span>
                      <span className="font-bold text-white">{teamName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mánager:</span>
                      <span className="font-bold text-white">{fullName} ({email})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Plan Seleccionado:</span>
                      <span className="font-bold text-emerald-400 uppercase font-mono">
                        {selectedPlan === 'TRIAL' ? 'Mes Gratis (30 Días $0)' : selectedPlan}
                      </span>
                    </div>
                  </div>

                  {/* OTP Code Input */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-cyan-500/30 text-center space-y-3">
                    <label className="block text-xs font-bold text-slate-200">
                      Código de Verificación OTP (6 Dígitos)
                    </label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="777-000"
                      maxLength={7}
                      className="w-48 mx-auto text-center font-mono text-xl tracking-widest bg-slate-900 border-2 border-cyan-400 text-white rounded-xl py-2 focus:outline-none"
                    />

                    {otpError && (
                      <p className="text-xs text-rose-400 font-medium">{otpError}</p>
                    )}

                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handleVerifyOtp()}
                        disabled={isVerifying}
                        className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all"
                      >
                        {isVerifying ? 'Verificando...' : 'Verificar y Activar Cuenta'}
                      </button>

                      {/* QA Bypass Button */}
                      <button
                        type="button"
                        onClick={() => handleVerifyOtp('777000')}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono border border-slate-700"
                        title="Bypass rápido para pruebas"
                      >
                        ⚡ Bypass QA (777-000)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: FINAL CONFIRMATION CARD */}
              {currentStep === 5 && (
                <div className="text-center space-y-5 py-4 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
                    <Sparkles className="w-8 h-8" />
                  </div>

                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      CERTIFICADO CANÓNICO 3TREE DIGITAL SPORT IA
                    </span>
                    <h4 className="text-2xl font-black text-white mt-1">
                      ¡CUENTA & MES GRATIS ACTIVADOS CON ÉXITO!
                    </h4>
                    <p className="text-xs text-slate-300 max-w-md mx-auto mt-1 leading-relaxed">
                      Bienvenido al Sistema Operativo DIAMAX PRO. Su franquicia <strong>{teamName}</strong> ha sido inscrita y sincronizada con el motor táctico.
                    </p>
                  </div>

                  {/* Issued Credentials Box */}
                  <div className="max-w-md mx-auto bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left text-xs font-mono space-y-2.5 shadow-inner">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="text-slate-400">ID de Franquicia:</span>
                      <span className="text-cyan-400 font-bold">{franchiseId}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-1">Llave Criptográfica Zero-Trust:</span>
                      <div className="flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-800 text-emerald-400">
                        <span className="truncate">{zeroTrustKey}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(zeroTrustKey)}
                          className="p-1 hover:text-white"
                          title="Copiar Llave"
                        >
                          {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Big Enter App Button */}
                  <button
                    type="button"
                    onClick={handleCompleteAndEnter}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-emerald-500/30 hover:scale-105 transition-all"
                  >
                    ENTRAR AHORA A DIAMAX PRO OS →
                  </button>
                </div>
              )}

              {/* Navigation Footer (Steps 1 to 4) */}
              {currentStep < 5 && (
                <div className="flex items-center justify-between pt-5 mt-6 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={currentStep === 1}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      currentStep === 1 ? 'opacity-30 cursor-not-allowed text-slate-600' : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Anterior</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-500/20"
                  >
                    <span>{currentStep === 4 ? 'Finalizar' : 'Continuar'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* TAB LOGIN / ACCESO MAESTRO CEO */
            <div className="space-y-4 max-w-md mx-auto py-3 animate-in fade-in duration-150">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-2">
                  <Key className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black text-white">Acceso a DIAMAX PRO OS</h4>
                <p className="text-xs text-slate-400">
                  Inicie sesión con su cuenta de mánager o utilice la Llave Maestra del CEO.
                </p>
              </div>

              {loginAlert && (
                <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{loginAlert}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contraseña</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundSystem.playClick();
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all"
                >
                  Entrar a Mi Franquicia
                </button>
              </div>

              {/* Master CEO Key Bypass */}
              <div className="pt-4 border-t border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-mono block mb-2">
                  Acceso Especial Directo para el Fundador & CEO
                </span>
                <button
                  type="button"
                  onClick={handleMasterCeoLogin}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Key className="w-4 h-4 text-slate-950" />
                  <span>Acceso Maestro Lic. Alí Zapata (CEO Demo)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
