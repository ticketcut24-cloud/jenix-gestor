import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  Key, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  MessageCircle
} from 'lucide-react';

interface ClientAuthModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'login' | 'register';
}

export const ClientAuthModal: React.FC<ClientAuthModalProps> = ({ 
  onClose, 
  onSuccess,
  initialMode = 'register'
}) => {
  const { clientRegister, clientLogin, clientRecoverPassword, settings } = useStore();
  
  const [mode, setMode] = useState<'login' | 'register' | 'recover'>(initialMode);
  
  // Register fields
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Recover field
  const [recoverIdentifier, setRecoverIdentifier] = useState('');
  const [recoverMessage, setRecoverMessage] = useState<string | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Ingresa tu nombre completo.');
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

    const res = clientRegister(name, whatsapp, email, password);
    if (res.success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setErrorMsg(res.message || 'Error al registrarte.');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMsg('Ingresa tu WhatsApp/correo y tu contraseña.');
      return;
    }

    const res = clientLogin(loginIdentifier, loginPassword);
    if (res.success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setErrorMsg(res.message || 'Error al iniciar sesión.');
    }
  };

  const handleRecover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoverIdentifier.trim()) {
      setErrorMsg('Ingresa tu WhatsApp o correo registrado.');
      return;
    }

    const res = clientRecoverPassword(recoverIdentifier);
    if (res.success) {
      setRecoverMessage(res.message);
      setErrorMsg(null);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#12091A] border-2 border-[#FF2E93]/60 rounded-3xl shadow-[0_0_50px_rgba(255,46,147,0.35)] overflow-hidden">
        
        {/* Top neon strip */}
        <div className="h-2 w-full bg-gradient-to-r from-[#7A1236] via-[#FF2E93] to-[#FF8CC6]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#0B0612]/80 border border-[#FF2E93]/30 text-[#C9C4D4] hover:text-white hover:border-[#FF2E93] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-7 space-y-5">
          {/* Brand header */}
          <div className="text-center space-y-1.5">
            <div className="w-13 h-13 rounded-full overflow-hidden border-2 border-[#FF2E93] shadow-[0_0_15px_rgba(255,46,147,0.5)] mx-auto mb-2">
              <img
                src={settings.logoUrl || '/assets/aistudio/jenix_4fac0935.jpeg'}
                alt="JENYX"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-2xl font-bold font-cinzel text-white">
              {mode === 'register' ? 'Registro de Clientes' : mode === 'login' ? 'Iniciar Sesión' : 'Recuperar Contraseña'}
            </h3>
            <p className="text-xs text-[#A394AE]">
              {mode === 'register' 
                ? 'Crea tu cuenta para consultar tus suscripciones, claves y PINs en cualquier momento.'
                : mode === 'login'
                ? 'Accede a tus cuentas de streaming, APKs y carpetas Drive compradas.'
                : 'Te ayudamos a recuperar el acceso a tu cuenta JENYX.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          {mode !== 'recover' && (
            <div className="grid grid-cols-2 p-1 rounded-xl bg-[#0B0612] border border-[#FF2E93]/20 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(null); }}
                className={`py-2 rounded-lg transition-all ${
                  mode === 'register'
                    ? 'bg-[#FF2E93] text-white shadow-[0_0_10px_rgba(255,46,147,0.4)]'
                    : 'text-[#A394AE] hover:text-white'
                }`}
              >
                Nuevo Registro
              </button>
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(null); }}
                className={`py-2 rounded-lg transition-all ${
                  mode === 'login'
                    ? 'bg-[#FF2E93] text-white shadow-[0_0_10px_rgba(255,46,147,0.4)]'
                    : 'text-[#A394AE] hover:text-white'
                }`}
              >
                Ya Tengo Cuenta
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1">Nombre Completo *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Ej. Sofía Valdés"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2E93] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1">WhatsApp Oficial con Lada *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="+52 55 1234 5678"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2E93] text-sm"
                  />
                </div>
                <span className="text-[10px] text-[#A394AE] mt-0.5 block">
                  Aquí te entregamos tus claves y recordatorios de renovación.
                </span>
              </div>

              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1">Correo Electrónico (Para recuperación) *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="tu-correo@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2E93] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1">Crea tu Contraseña *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Mínimo 4 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2E93] text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider neon-btn-primary flex items-center justify-center gap-2 mt-2"
              >
                <span>Registrarme y Guardar Cuenta</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1">WhatsApp o Correo Registrado *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Tu WhatsApp o correo"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2E93] text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[#FF8CC6] font-semibold">Contraseña *</label>
                  <button
                    type="button"
                    onClick={() => { setMode('recover'); setErrorMsg(null); }}
                    className="text-[11px] text-[#A394AE] hover:text-[#FF8CC6] hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Tu contraseña"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2E93] text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider neon-btn-primary flex items-center justify-center gap-2"
              >
                <span>Ingresar a Mi Cuenta</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* RECOVER PASSWORD */}
          {mode === 'recover' && (
            <form onSubmit={handleRecover} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1">
                  Ingresa tu WhatsApp o Correo Registrado
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Ej. 5543219876 o correo@ejemplo.com"
                    value={recoverIdentifier}
                    onChange={(e) => setRecoverIdentifier(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2E93] text-sm"
                  />
                </div>
              </div>

              {recoverMessage && (
                <div className="p-4 rounded-xl bg-[#3DDC97]/15 border border-[#3DDC97]/50 text-white space-y-2">
                  <div className="flex items-center gap-2 text-[#3DDC97] font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Recuperación exitosa</span>
                  </div>
                  <p className="text-xs text-[#C9C4D4] leading-relaxed">
                    {recoverMessage}
                  </p>
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setRecoverMessage(null); }}
                    className="text-xs font-bold text-[#3DDC97] hover:underline block pt-1"
                  >
                    Ir a Iniciar Sesión con mi contraseña &rarr;
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider neon-btn-primary"
              >
                Recuperar Contraseña
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(null); }}
                  className="text-xs text-[#A394AE] hover:text-white"
                >
                  &larr; Volver a Iniciar Sesión
                </button>
              </div>
            </form>
          )}

          {/* Sample quick login hint */}
          <div className="text-center pt-2 border-t border-white/5">
            <span className="text-[10px] text-gray-500 block">
              ✦ ¿Prueba rápida? Cliente demo: WhatsApp <strong>+525543219876</strong> con clave <strong>jenyx123</strong>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
