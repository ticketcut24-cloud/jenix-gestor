import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  Key, 
  AlertCircle 
} from 'lucide-react';

interface AdminLoginModalProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onSuccess, onCancel }) => {
  const { settings, adminLoginQuick, adminLoginWithGoogle, adminUsers, verifyAdminPin } = useStore();
  const [authMode, setAuthMode] = useState<'pin' | 'credentials'>('pin');
  const [adminPinInput, setAdminPinInput] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPinInput.trim()) {
      setError('Por favor ingresa el PIN de seguridad del administrador.');
      return;
    }

    if (verifyAdminPin(adminPinInput)) {
      adminLoginQuick('admin', 'ticket.cut24@gmail.com');
      onSuccess();
    } else {
      setError('PIN maestro incorrecto. Acceso denegado.');
    }
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Ingresa tu correo de operador.');
      return;
    }

    const found = adminUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (found) {
      adminLoginQuick(found.role, found.email);
      onSuccess();
    } else {
      adminLoginQuick('admin', email.trim());
      onSuccess();
    }
  };

  const handleQuickRole = (role: 'admin' | 'vendedor', defaultEmail: string) => {
    adminLoginQuick(role, defaultEmail);
    onSuccess();
  };

  const handleGoogle = async () => {
    const ok = await adminLoginWithGoogle();
    if (ok) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#12091A] border-2 border-[#FF2E93] rounded-3xl shadow-[0_0_50px_rgba(255,46,147,0.4)] overflow-hidden">
        {/* Top neon stripe */}
        <div className="h-2 w-full bg-gradient-to-r from-[#7A1236] via-[#FF2E93] to-[#FF8CC6]" />

        <div className="p-7 space-y-5">
          {/* Logo & Header */}
          <div className="text-center space-y-1.5">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#FF2E93] shadow-[0_0_20px_rgba(255,46,147,0.6)] mx-auto mb-2">
              <img
                src={settings.logoUrl || '/assets/aistudio/jenix_4fac0935.jpeg'}
                alt="JENYX"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-2xl font-bold font-cinzel text-white">
              {settings.businessName} Panel de Control
            </h3>
            <p className="text-xs text-[#A394AE]">
              Acceso restringido para el dueño y operadores autorizados
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-[#0B0612] border border-[#FF2E93]/20 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setAuthMode('pin'); setError(null); }}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                authMode === 'pin'
                  ? 'bg-[#FF2E93] text-white shadow-[0_0_10px_rgba(255,46,147,0.4)]'
                  : 'text-[#A394AE] hover:text-white'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>PIN de Dueño</span>
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('credentials'); setError(null); }}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                authMode === 'credentials'
                  ? 'bg-[#FF2E93] text-white shadow-[0_0_10px_rgba(255,46,147,0.4)]'
                  : 'text-[#A394AE] hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Correo & Clave</span>
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* PIN LOGIN FORM */}
          {authMode === 'pin' ? (
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#FF8CC6] uppercase tracking-wider mb-1 text-center">
                  Ingresa tu PIN Maestro de Administrador
                </label>
                <div className="relative max-w-[200px] mx-auto">
                  <input
                    type="password"
                    maxLength={8}
                    required
                    autoFocus
                    placeholder="••••"
                    value={adminPinInput}
                    onChange={(e) => setAdminPinInput(e.target.value)}
                    className="w-full text-center tracking-[0.5em] font-mono text-2xl py-3 rounded-xl bg-[#0B0612] border-2 border-[#FF2E93] text-white focus:outline-none focus:shadow-[0_0_15px_rgba(255,46,147,0.5)]"
                  />
                </div>
                <span className="text-[10px] text-gray-500 block text-center mt-1">
                  (PIN predeterminado: <strong>2026</strong> - configurable en Ajustes)
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider neon-btn-primary flex items-center justify-center gap-2"
              >
                <span>Desbloquear y Entrar al Panel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* EMAIL & PASSWORD LOGIN FORM */
            <form onSubmit={handleManualLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#FF8CC6] uppercase tracking-wider mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    placeholder="admin@jenyx.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2E93] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#FF8CC6] uppercase tracking-wider mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2E93] text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider neon-btn-primary flex items-center justify-center gap-2"
              >
                <span>Ingresar al Sistema</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Access Switchers */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <span className="text-[10px] text-[#A394AE] block text-center uppercase tracking-wider font-semibold">
              ✦ Acceso Rápido / Firebase ✦
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickRole('admin', 'ticket.cut24@gmail.com')}
                className="py-2 px-2.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/40 text-xs text-[#FF8CC6] hover:bg-[#FF2E93]/20 hover:text-white transition-all text-center"
              >
                <div className="font-bold text-[11px]">Super Admin Dueño</div>
                <div className="text-[9px] text-gray-400 truncate">ticket.cut24@gmail.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('vendedor', 'ventas@jenyx.com')}
                className="py-2 px-2.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/40 text-xs text-[#C9C4D4] hover:bg-[#FF2E93]/20 hover:text-white transition-all text-center"
              >
                <div className="font-bold text-[11px]">Vendedor / Ventas</div>
                <div className="text-[9px] text-gray-400 truncate">ventas@jenyx.com</div>
              </button>
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              className="w-full py-2 px-3 rounded-xl bg-[#0B0612] border border-white/20 text-xs font-semibold text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Acceder con Google Auth</span>
            </button>
          </div>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-[#A394AE] hover:text-white"
            >
              Volver a la Tienda Pública
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
