import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminDashboard } from './AdminDashboard';
import { AdminOrders } from './AdminOrders';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminPayments } from './AdminPayments';
import { AdminAccounts } from './AdminAccounts';
import { AdminClients } from './AdminClients';
import { AdminReports } from './AdminReports';
import { AdminNotifications } from './AdminNotifications';
import { AdminSettings } from './AdminSettings';
import { AdminUsersView } from './AdminUsersView';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  ShoppingCart, 
  FolderTree, 
  CreditCard, 
  Tv, 
  BarChart3, 
  Bell, 
  Settings, 
  UserCheck, 
  LogOut, 
  Store, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Moon
} from 'lucide-react';

interface AdminLayoutProps {
  onBackToStore: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToStore }) => {
  const { settings, currentAdmin, adminLogout, metrics } = useStore();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [tiendaSubmenuOpen, setTiendaSubmenuOpen] = useState(true);
  const [configSubmenuOpen, setConfigSubmenuOpen] = useState(true);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'clientes',
      label: 'Clientes',
      icon: Users,
      badge: metrics.totalClients
    },
    {
      id: 'tienda_group',
      label: 'Tienda',
      icon: ShoppingBag,
      subItems: [
        { id: 'tienda_pedidos', label: 'Pedidos', icon: ShoppingCart, badge: metrics.pendingReceiptsCount > 0 ? `${metrics.pendingReceiptsCount} por rev.` : null },
        { id: 'tienda_productos', label: 'Productos', icon: ShoppingBag },
        { id: 'tienda_categorias', label: 'Categorías', icon: FolderTree },
      ]
    },
    {
      id: 'ventas_pagos',
      label: 'Ventas / Pagos',
      icon: CreditCard,
      badge: metrics.pendingReceiptsCount > 0 ? metrics.pendingReceiptsCount : null,
      badgeColor: 'bg-[#FF2E93]'
    },
    {
      id: 'operacion',
      label: 'Operación (Cuentas)',
      icon: Tv,
      badge: `${metrics.freeProfilesCount} libres`
    },
    {
      id: 'reportes',
      label: 'Garantías & Reportes',
      icon: ShieldAlert,
      badge: metrics.openClaimsCount > 0 ? `${metrics.openClaimsCount} por atender` : null,
      badgeColor: 'bg-[#FF2E93]'
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      icon: Bell,
      badge: metrics.expiringSoonOrdersCount > 0 ? metrics.expiringSoonOrdersCount : null,
      badgeColor: 'bg-[#FFB020]'
    },

    {
      id: 'config_group',
      label: 'Configuración',
      icon: Settings,
      subItems: [
        { id: 'config_personalizacion', label: 'Personalización', icon: Settings },
        { id: 'config_usuarios', label: 'Usuarios del Panel', icon: UserCheck },
      ]
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard setActiveTab={setActiveTab} />;
      case 'clientes':
        return <AdminClients />;
      case 'tienda_pedidos':
        return <AdminOrders />;
      case 'tienda_productos':
        return <AdminProducts />;
      case 'tienda_categorias':
        return <AdminCategories />;
      case 'ventas_pagos':
        return <AdminPayments />;
      case 'operacion':
        return <AdminAccounts />;
      case 'reportes':
        return <AdminReports />;
      case 'notificaciones':
        return <AdminNotifications />;
      case 'config_personalizacion':
        return <AdminSettings />;
      case 'config_usuarios':
        return <AdminUsersView />;
      default:
        return <AdminDashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#07040C] text-[#FBEFF6] flex flex-col lg:flex-row">
      
      {/* SIDEBAR (DESKTOP & MOBILE DRAWER) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#0B0612] border-r border-[#FF2E93]/20 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Top brand header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#FF2E93] shadow-[0_0_15px_rgba(255,46,147,0.5)] shrink-0">
                <img
                  src={settings.logoUrl || '/assets/aistudio/jenix_4fac0935.jpeg'}
                  alt="JENYX Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-cinzel text-lg font-bold tracking-wider text-white block">
                  {settings.businessName}
                </span>
                <span className="text-[10px] text-[#FF8CC6] uppercase tracking-widest block font-medium">
                  Panel de Administración
                </span>
              </div>
            </div>

            {/* Mobile close */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5 scrollbar-thin">
          {navItems.map((item) => {
            if (item.subItems) {
              const isGroupActive = item.subItems.some(sub => sub.id === activeTab);
              const isOpen = item.id === 'tienda_group' ? tiendaSubmenuOpen : configSubmenuOpen;
              const toggleOpen = () => {
                if (item.id === 'tienda_group') setTiendaSubmenuOpen(!tiendaSubmenuOpen);
                else setConfigSubmenuOpen(!configSubmenuOpen);
              };

              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={toggleOpen}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
                      isGroupActive ? 'text-white' : 'text-[#C9C4D4] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-[#FF2E93]" />
                      <span>{item.label}</span>
                    </div>
                    {isOpen ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                  </button>

                  {isOpen && (
                    <div className="pl-6 space-y-1 border-l border-white/10 ml-4 py-1">
                      {item.subItems.map((sub) => {
                        const isSubActive = activeTab === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setActiveTab(sub.id);
                              setMobileSidebarOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                              isSubActive
                                ? 'sidebar-active-item font-bold'
                                : 'text-[#A394AE] hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <sub.icon className="w-3.5 h-3.5" />
                              <span>{sub.label}</span>
                            </div>
                            {sub.badge && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#FF2E93] text-white">
                                {sub.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'sidebar-active-item font-bold'
                    : 'text-[#C9C4D4] hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#FF2E93]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${
                    item.badgeColor || 'bg-[#12091A] border border-[#FF2E93]/40'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer profile & actions */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-[#07040C]/80">
          {/* Operator card */}
          {currentAdmin && (
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#12091A] border border-white/5">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#FF2E93] shrink-0">
                <img
                  src={currentAdmin.avatar || '/assets/aistudio/jenix_4fac0935.jpeg'}
                  alt={currentAdmin.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">{currentAdmin.name}</div>
                <div className="text-[10px] text-[#3DDC97] uppercase tracking-wider font-semibold">
                  {currentAdmin.role}
                </div>
              </div>
            </div>
          )}

          {/* Buttons: Tienda pública and Logout */}
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToStore}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-[#12091A] border border-[#FF2E93]/40 text-[#FF8CC6] hover:bg-[#FF2E93]/20 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Ver Tienda</span>
            </button>
            <button
              onClick={() => {
                adminLogout();
                onBackToStore();
              }}
              className="p-2 rounded-lg text-xs text-red-400 hover:bg-red-950/40 border border-red-500/20"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* BACKDROP FOR MOBILE SIDEBAR */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar in Admin */}
        <header className="sticky top-0 z-30 bg-[#0B0612]/90 backdrop-blur-md border-b border-[#FF2E93]/20 px-4 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-[#12091A] border border-[#FF2E93]/30 text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-[#A394AE]">
              <span>JENYX Admin</span>
              <span>/</span>
              <span className="text-[#FF8CC6] font-semibold uppercase">{activeTab.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct Switch to Public Store */}
            <button
              onClick={onBackToStore}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold neon-btn-secondary"
            >
              <Store className="w-3.5 h-3.5 text-[#FF2E93]" />
              <span className="hidden sm:inline">Tienda Pública</span>
            </button>

            {/* Role indicator badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12091A] border border-[#3DDC97]/40 text-xs text-[#3DDC97]">
              <span className="w-2 h-2 rounded-full bg-[#3DDC97] shadow-[0_0_8px_#3DDC97]" />
              <span className="font-semibold uppercase text-[10px]">{currentAdmin?.role || 'admin'}</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>
      </div>

    </div>
  );
};
