import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Lock, 
  User, 
  Phone, 
  Mail, 
  Key, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Moon, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  MessageCircle,
  Flame,
  Tv,
  Zap
} from 'lucide-react';

interface ClientAuthGateProps {
  onOpenAdminLogin: () => void;
}

export const ClientAuthGate: React.FC<ClientAuthGateProps> = ({ onOpenAdminLogin }) => {
  const { settings, clientRegister, clientLogin, clientRecoverPassword } = useStore();

  const [mode, setMode] = useState<'register' | 'login' | 'recover'>('register');
  
  // Register state
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Login state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Recover state
  const [recoverIdentifier, setRecoverIdentifier] = useState('');
  const [recoverSuccess, setRecoverSuccess] = useState<string | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!whatsapp.trim() || whatsapp.replace(/\D/g, '').length < 8) {
      setErrorMsg('Ingresa un número de WhatsApp válido.');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setErrorMsg('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = clientRegister(name, whatsapp, email, password);
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.message || 'Error al registrar.');
      }
    }, 300);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!loginIdentifier.trim()) {
      setErrorMsg('Ingresa tu WhatsApp o correo registrado.');
      return;
    }
    if (!loginPassword.trim()) {
      setErrorMsg('Ingresa tu contraseña.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = clientLogin(loginIdentifier, loginPassword);
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.message || 'Datos incorrectos.');
      }
    }, 300);
  };

  const handleRecover = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setRecoverSuccess(null);

    if (!recoverIdentifier.trim()) {
      setErrorMsg('Ingresa el correo o WhatsApp con el que te registraste.');
      return;
    }

    const res = clientRecoverPassword(recoverIdentifier);
    if (res.success) {
      setRecoverSuccess(res.message);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-h-screen goth-bg relative flex flex-col justify-between items-center px-4 py-8 sm:py-12 selection:bg-[#FF2E93] selection:text-white">
      {/* Decorative stars */}
      <div className="absolute top-12 left-8 text-pink-500/25 text-3xl select-none pointer-events-none animate-pulse">✦</div>
      <div className="absolute top-28 right-12 text-pink-400/20 text-4xl select-none pointer-events-none">✦</div>
      <div className="absolute bottom-20 left-16 text-pink-500/15 text-2xl select-none pointer-events-none">★</div>
      <div className="absolute bottom-32 right-24 text-pink-400/20 text-3xl select-none pointer-events-none animate-pulse">✦</div>

      {/* Top Banner / Announcement */}
      {settings.announcement && (
        <div className="w-full max-w-2xl mx-auto mb-6 p-2 rounded-full bg-[#12091A] border border-[#FF2E93]/30 text-center text-xs text-[#FF8CC6] flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,46,147,0.2)]">
          <Moon className="w-3.5 h-3.5 text-[#FF2E93]" />
          <span>{settings.announcement}</span>
          <span>✦</span>
        </div>
      )}

      {/* Central Gate Card */}
      <div className="w-full max-w-xl mx-auto my-auto z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-6 space-y-3">
          <div className="relative inline-block group">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#FF2E93] via-[#7A1236] to-[#C2187A] opacity-60 blur-xl group-hover:opacity-90 transition-opacity" />
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full p-1 bg-gradient-to-b from-[#FF2E93] via-[#7A1236] to-[#FF2E93] shadow-[0_0_35px_rgba(255,46,147,0.6)]">
              <img
                src={settings.logoUrl || '/assets/aistudio/jenix_4fac0935.jpeg'}
                alt="JENYX Gothic Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 text-sm text-[#FF2E93] font-bold">✦</div>
          </div>

          <div>
            <h1 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-white tracking-widest flex items-center justify-center gap-2">
              <span>{settings.businessName}</span>
              <span className="text-[#FF2E93] text-lg animate-pulse">✦</span>
            </h1>
            <p className="text-sm font-medium text-[#FF8CC6] tracking-wide mt-1">
              {settings.motto}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#12091A] border border-[#FF2E93]/40 text-xs text-[#C9C4D4]">
            <Lock className="w-3.5 h-3.5 text-[#FF2E93]" />
            <span>Acceso Privado Obligatorio para Clientes</span>
          </div>
        </div>

        {/* Auth Box Container */}
        <div className="goth-card rounded-3xl p-6 sm:p-8 border border-[#FF2E93]/40 shadow-[0_0_50px_rgba(255,46,147,0.25)] relative overflow-hidden backdrop-blur-md">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#7A1236] via-[#FF2E93] to-[#FF8CC6] absolute top-0 left-0" />

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#0B0612] border border-[#FF2E93]/20 mb-6">
            <button
              onClick={() => { setMode('register'); setErrorMsg(null); setRecoverSuccess(null); }}
              className={`py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                mode === 'register'
                  ? 'neon-btn-primary shadow-[0_0_15px_rgba(255,46,147,0.4)]'
                  : 'text-[#C9C4D4] hover:text-white'
              }`}
            >
              <span>✦ Registrarme</span>
            </button>
            <button
              onClick={() => { setMode('login'); setErrorMsg(null); setRecoverSuccess(null); }}
              className={`py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                mode === 'login'
                  ? 'neon-btn-primary shadow-[0_0_15px_rgba(255,46,147,0.4)]'
                  : 'text-[#C9C4D4] hover:text-white'
              }`}
            >
              <span>Iniciar Sesión</span>
            </button>
          </div>

          {/* Feedback message */}
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {recoverSuccess && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{recoverSuccess}</span>
            </div>
          )}

          {/* TAB 1: REGISTRATION */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#FF8CC6] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#FF2E93]" />
                  <span>Nombre Completo *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Mariana Reyes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#FF2E93]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#FF8CC6] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#3DDC97]" />
                  <span>WhatsApp (para entrega de tus accesos) *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. +52 55 4321 9876"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#FF2E93]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#FF8CC6] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#FF2E93]" />
                  <span>Correo Electrónico (para respaldo o recuperación)</span>
                </label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#FF2E93]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#FF8CC6] flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#FF8CC6]" />
                  <span>Crea tu Contraseña *</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 4 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#FF2E93]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#0B0612]/60 border border-white/5 text-[11px] text-[#A394AE] space-y-1">
                <div className="flex items-center gap-1.5 text-white font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3DDC97]" />
                  <span>Beneficios de registrarte:</span>
                </div>
                <p>✦ Tus contraseñas y PINs de streaming quedan guardados en tu portal privado.</p>
                <p>✦ Acceso inmediato al catálogo de Cuentas, APKs, Drive, Trámites y Recargas.</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide neon-btn-primary flex items-center justify-center gap-2 mt-2 shadow-[0_0_20px_rgba(255,46,147,0.6)]"
              >
                <span>{loading ? 'Creando cuenta...' : '✦ Crear Cuenta y Entrar a la Tienda ✦'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 2: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#FF8CC6] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#FF2E93]" />
                  <span>WhatsApp o Correo Registrado *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. +52 55 4321 9876 o tu@correo.com"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#FF2E93]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#FF8CC6] flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#FF2E93]" />
                    <span>Tu Contraseña *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode('recover'); setErrorMsg(null); setRecoverSuccess(null); }}
                    className="text-[11px] text-[#FF8CC6] hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  placeholder="Ingresa tu contraseña"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#FF2E93]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide neon-btn-primary flex items-center justify-center gap-2 mt-4 shadow-[0_0_20px_rgba(255,46,147,0.6)]"
              >
                <span>{loading ? 'Accediendo...' : 'Iniciar Sesión y Ver Catálogo'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 3: RECOVER PASSWORD */}
          {mode === 'recover' && (
            <form onSubmit={handleRecover} className="space-y-4">
              <div className="p-3 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-xs text-[#C9C4D4] space-y-1">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#FF2E93]" />
                  Recuperación de Clave
                </span>
                <p>Ingresa tu WhatsApp o correo para recordarte tu clave de inmediato.</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#FF8CC6]">
                  WhatsApp o Correo Electrónico
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. +52 55 4321 9876 o correo@ejemplo.com"
                  value={recoverIdentifier}
                  onChange={(e) => setRecoverIdentifier(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#FF2E93]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(null); setRecoverSuccess(null); }}
                  className="w-1/2 py-2.5 px-4 rounded-xl text-xs font-semibold text-[#C9C4D4] bg-[#0B0612] border border-white/10 hover:text-white"
                >
                  Regresar a Login
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 px-4 rounded-xl text-xs font-bold neon-btn-primary"
                >
                  Recuperar Clave
                </button>
              </div>

              <div className="pt-3 border-t border-white/5 text-center">
                <a
                  href={`https://wa.me/${settings.whatsappSupport.replace(/\D/g, '')}?text=Hola%20JENYX,%20olvidé%20mi%20contraseña%20de%20cliente`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#3DDC97] hover:underline"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>O pide ayuda directa por WhatsApp</span>
                </a>
              </div>
            </form>
          )}

        </div>

        {/* Discreet Admin Entrance Link */}
        <div className="mt-6 text-center">
          <button
            onClick={onOpenAdminLogin}
            className="text-xs text-[#A394AE] hover:text-[#FF8CC6] transition-colors inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#12091A]/60 border border-white/5 hover:border-[#FF2E93]/40"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF2E93]" />
            <span>¿Eres del equipo o Dueño? <strong>Acceso al Panel Admin con PIN</strong></span>
          </button>
        </div>

      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-[#A394AE]/70 z-10">
        &copy; {new Date().getFullYear()} {settings.businessName}. Todos los derechos reservados.
      </footer>
    </div>
  );
};
