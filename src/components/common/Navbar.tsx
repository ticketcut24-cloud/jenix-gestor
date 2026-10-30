import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Sparkles, 
  ShoppingBag, 
  Search, 
  ShieldCheck, 
  ExternalLink, 
  Menu, 
  X,
  CreditCard,
  Moon,
  User,
  UserCheck,
  FolderDown,
  Zap,
  ShieldAlert
} from 'lucide-react';

interface NavbarProps {
  currentView: 'store' | 'admin' | 'tracking';
  setCurrentView: (view: 'store' | 'admin' | 'tracking') => void;
  openTracking: () => void;
  openClientAuth: () => void;
  openClientPortal: () => void;
  openSpeiModal?: () => void;
  openWarrantyModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  setCurrentView, 
  openTracking,
  openClientAuth,
  openClientPortal,
  openSpeiModal,
  openWarrantyModal
}) => {
  const { settings, currentAdmin, currentClient } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  return (
    <header className="sticky top-0 z-40 bg-[#0B0612]/90 backdrop-blur-md border-b border-[#FF2E93]/20">
      {settings.announcement && (
        <div className="bg-gradient-to-r from-[#7A1236] via-[#FF2E93] to-[#7A1236] text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
          <Moon className="w-3.5 h-3.5 text-pink-200 fill-pink-200" />
          <span>{settings.announcement}</span>
          <span className="hidden sm:inline">✦</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setCurrentView('store')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-13 h-13 rounded-full overflow-hidden border-2 border-[#FF2E93] shadow-[0_0_15px_rgba(255,46,147,0.5)] group-hover:shadow-[0_0_22px_rgba(255,46,147,0.8)] transition-all duration-300">
                <img 
                  src={settings.logoUrl || '/assets/aistudio/jenix_4fac0935.jpeg'} 
                  alt="JENYX Logo" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 text-xs text-[#FF2E93] font-bold">✦</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-cinzel text-2xl font-bold tracking-wider text-white group-hover:text-[#FF8CC6] transition-colors">
                  {settings.businessName}
                </span>
                <span className="text-[#FF2E93] text-sm animate-pulse">✦</span>
              </div>
              <p className="text-xs text-[#A394AE] hidden sm:block tracking-wide">
                {settings.motto}
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-5">
            <button
              onClick={() => setCurrentView('store')}
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 py-1 ${
                currentView === 'store' 
                  ? 'text-[#FF8CC6] border-b-2 border-[#FF2E93] font-semibold' 
                  : 'text-[#C9C4D4] hover:text-[#FF8CC6]'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-[#FF2E93]" />
              Catálogo & APKs
            </button>

            <button
              onClick={openTracking}
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 py-1 ${
                currentView === 'tracking'
                  ? 'text-[#FF8CC6] border-b-2 border-[#FF2E93] font-semibold'
                  : 'text-[#C9C4D4] hover:text-[#FF8CC6]'
              }`}
            >
              <Search className="w-4 h-4 text-[#FF2E93]" />
              Rastrear Folio
            </button>

            {/* WARRANTY & TECHNICAL SUPPORT MODAL SHORTCUT */}
            {openWarrantyModal && (
              <button
                onClick={openWarrantyModal}
                className="text-sm font-medium transition-colors flex items-center gap-1.5 py-1 text-[#C9C4D4] hover:text-[#FF8CC6]"
                title="Reportar fallas o solicitar reemplazo por garantía de 30 días"
              >
                <ShieldAlert className="w-4 h-4 text-[#FF2E93]" />
                <span>Garantías & Soporte</span>
              </button>
            )}

            {/* SPEI RECHARGE / PAYMENT SHORTCUT */}
            {openSpeiModal && (

              <button
                onClick={openSpeiModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#12091A] border border-[#3DDC97]/60 text-[#3DDC97] hover:bg-[#3DDC97] hover:text-[#07040C] shadow-[0_0_15px_rgba(61,220,151,0.25)] transition-all"
                title="Pagar o recargar saldo vía SPEI"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Recarga SPEI</span>
              </button>
            )}

            {/* CLIENT PORTAL: REGISTER / LOGIN OR MY ACCOUNT */}
            {currentClient ? (
              <button
                onClick={openClientPortal}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#12091A] border border-[#3DDC97]/50 text-[#3DDC97] hover:bg-[#3DDC97] hover:text-[#07040C] shadow-[0_0_12px_rgba(61,220,151,0.25)] transition-all"
              >
                <UserCheck className="w-4 h-4" />
                <span>{currentClient.name.split(' ')[0]} (${currentClient.balance || 0} MXN)</span>
              </button>
            ) : (
              <button
                onClick={openClientAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#12091A] border border-[#FF2E93]/40 text-[#FF8CC6] hover:bg-[#FF2E93]/20 hover:text-white transition-all"
              >
                <User className="w-3.5 h-3.5 text-[#FF2E93]" />
                <span>Área de Clientes (Registro/Login)</span>
              </button>
            )}

            {/* Admin Panel Link */}
            <button
              onClick={() => setCurrentView('admin')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider neon-btn-secondary"
            >
              <ShieldCheck className="w-4 h-4 text-[#FF2E93]" />
              {currentAdmin ? `Panel (${currentAdmin.role})` : 'Panel Admin (PIN)'}
            </button>
          </nav>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            {currentClient ? (
              <button
                onClick={openClientPortal}
                className="p-2 rounded-lg bg-[#12091A] border border-[#3DDC97]/40 text-[#3DDC97]"
                title="Mi cuenta"
              >
                <UserCheck className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={openClientAuth}
                className="p-2 rounded-lg bg-[#12091A] border border-[#FF2E93]/30 text-[#FF8CC6]"
                title="Registro / Login"
              >
                <User className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={openTracking}
              className="p-2 rounded-lg bg-[#12091A] border border-[#FF2E93]/30 text-[#FF8CC6]"
              title="Rastrear pedido"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#12091A] border border-[#FF2E93]/30 text-[#FBEFF6]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0612] border-b border-[#FF2E93]/30 px-4 pt-3 pb-5 space-y-3">
          <button
            onClick={() => {
              setCurrentView('store');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2.5 px-3 rounded-lg text-sm text-[#FBEFF6] hover:bg-[#12091A] flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-[#FF2E93]" />
            Catálogo Streaming & APKs
          </button>

          {currentClient ? (
            <button
              onClick={() => {
                openClientPortal();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-lg text-sm text-[#3DDC97] bg-[#12091A] border border-[#3DDC97]/40 flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-[#3DDC97]" />
              Mi Cuenta ({currentClient.name})
            </button>
          ) : (
            <button
              onClick={() => {
                openClientAuth();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-lg text-sm text-[#FF8CC6] bg-[#12091A] border border-[#FF2E93]/40 flex items-center gap-2"
            >
              <User className="w-4 h-4 text-[#FF2E93]" />
              Registrarme / Iniciar Sesión Cliente
            </button>
          )}

          <button
            onClick={() => {
              openTracking();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2.5 px-3 rounded-lg text-sm text-[#FBEFF6] hover:bg-[#12091A] flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-[#FF2E93]" />
            Rastrear Pedido / Folio
          </button>

          {openWarrantyModal && (
            <button
              onClick={() => {
                openWarrantyModal();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-lg text-sm text-[#FF8CC6] bg-[#12091A] border border-[#FF2E93]/30 flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-[#FF2E93]" />
              Soporte & Garantías (Reportar Falla)
            </button>
          )}

          {openSpeiModal && (

            <button
              onClick={() => {
                openSpeiModal();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-lg text-sm text-[#3DDC97] bg-[#12091A] border border-[#3DDC97]/40 flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-[#3DDC97]" />
              Pagar / Recargar Saldo con SPEI
            </button>
          )}

          <button
            onClick={() => {
              setCurrentView('admin');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2.5 px-3 rounded-lg text-sm text-[#FF8CC6] bg-[#12091A] border border-[#FF2E93]/40 flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#FF2E93]" />
            {currentAdmin ? `Panel Admin (${currentAdmin.role})` : 'Acceso Admin (Con PIN)'}
          </button>
        </div>
      )}
    </header>
  );
};
