import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Users, 
  ShoppingBag, 
  ShoppingCart, 
  DollarSign, 
  Clock, 
  FileText, 
  CheckCircle2, 
  Key, 
  ShieldAlert, 
  AlertTriangle, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Tv, 
  Eye, 
  ExternalLink,
  RotateCw,
  MessageCircle,
  TrendingUp,
  Flame
} from 'lucide-react';

interface AdminDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActiveTab }) => {
  const { 
    metrics, 
    orders, 
    accounts, 
    clients, 
    products, 
    approveOrder, 
    rejectOrder,
    settings 
  } = useStore();

  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  // Global search filtering
  const q = globalSearch.trim().toLowerCase();
  const searchResults = {
    orders: q ? orders.filter(o => 
      o.orderNumber.toLowerCase().includes(q) || 
      o.customerName.toLowerCase().includes(q) ||
      o.customerWhatsApp.includes(q) ||
      o.productName.toLowerCase().includes(q)
    ) : [],
    clients: q ? clients.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.whatsapp.includes(q) ||
      c.email?.toLowerCase().includes(q)
    ) : [],
    products: q ? products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.categoryName?.toLowerCase().includes(q)
    ) : [],
    accounts: q ? accounts.filter(a => 
      a.serviceName.toLowerCase().includes(q) || 
      a.email.toLowerCase().includes(q)
    ) : []
  };

  const hasSearch = Boolean(q);

  // Pending receipts
  const pendingReceiptOrders = orders.filter(o => o.status === 'revision');
  
  // Expiring soon orders
  const expiringOrders = orders.filter(o => {
    if ((o.status === 'aprobado' || o.status === 'entregado') && o.expiresAt) {
      const diff = new Date(o.expiresAt).getTime() - new Date().getTime();
      return diff > 0 && diff <= 3 * 24 * 60 * 60 * 1000;
    }
    return false;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title & Global Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#FF8CC6] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF2E93]" /> Panel de Control Operativo
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mt-1">
            Resumen General del Sistema
          </h1>
          <p className="text-xs text-[#A394AE] mt-0.5">
            Monitoreo en tiempo real de clientes, inventario de perfiles y facturación.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="w-full md:w-96 relative">
          <Search className="w-4 h-4 text-[#FF8CC6] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscador global: cliente, pedido, producto..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12091A] border border-[#FF2E93]/35 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93] text-xs shadow-lg"
          />
          {hasSearch && (
            <button
              onClick={() => setGlobalSearch('')}
              className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* GLOBAL SEARCH RESULTS (OVERLAY SECTION WHEN SEARCHING) */}
      {hasSearch && (
        <div className="p-6 rounded-2xl bg-[#12091A] border-2 border-[#FF2E93] shadow-[0_0_30px_rgba(255,46,147,0.3)] space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-[#FF2E93]" />
              Resultados de búsqueda global para "{globalSearch}"
            </h3>
            <button
              onClick={() => setGlobalSearch('')}
              className="text-xs text-[#FF8CC6] hover:underline"
            >
              Cerrar búsqueda
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Orders found */}
            <div>
              <div className="font-semibold text-[#FF8CC6] mb-2 flex items-center justify-between">
                <span>Pedidos encontrados ({searchResults.orders.length})</span>
                <button onClick={() => setActiveTab('tienda_pedidos')} className="text-[11px] hover:underline">Ver todos en Pedidos</button>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {searchResults.orders.length === 0 ? (
                  <span className="text-gray-500 italic">Sin coincidencias en pedidos.</span>
                ) : (
                  searchResults.orders.map(o => (
                    <div key={o.id} className="p-2 rounded-lg bg-[#0B0612] border border-white/5 flex items-center justify-between">
                      <div>
                        <strong className="text-white">{o.orderNumber}</strong> - {o.customerName}
                        <div className="text-[10px] text-gray-400">{o.productName} (${o.price} MXN)</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF2E93]/20 text-[#FF8CC6]">
                        {o.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Clients found */}
            <div>
              <div className="font-semibold text-[#3DDC97] mb-2 flex items-center justify-between">
                <span>Clientes encontrados ({searchResults.clients.length})</span>
                <button onClick={() => setActiveTab('clientes')} className="text-[11px] hover:underline">Ver en Clientes</button>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {searchResults.clients.length === 0 ? (
                  <span className="text-gray-500 italic">Sin coincidencias en clientes.</span>
                ) : (
                  searchResults.clients.map(c => (
                    <div key={c.id} className="p-2 rounded-lg bg-[#0B0612] border border-white/5 flex items-center justify-between">
                      <div>
                        <strong className="text-white">{c.name}</strong>
                        <div className="text-[10px] text-gray-400">{c.whatsapp} • {c.totalOrders} pedidos</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-white">
                        {c.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 12 METRIC CARDS (ALL REQUIRED BY PROMPT) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
        
        {/* 1. Clientes */}
        <div 
          onClick={() => setActiveTab('clientes')}
          className="goth-card rounded-xl p-4 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#A394AE]">Clientes</span>
            <div className="p-2 rounded-lg bg-[#FF2E93]/15 text-[#FF8CC6] group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{metrics.totalClients}</div>
          <span className="text-[10px] text-[#3DDC97] flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> Registrados
          </span>
        </div>

        {/* 2. Productos */}
        <div 
          onClick={() => setActiveTab('tienda_productos')}
          className="goth-card rounded-xl p-4 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#A394AE]">Productos</span>
            <div className="p-2 rounded-lg bg-purple-500/15 text-purple-300 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{metrics.totalProducts}</div>
          <span className="text-[10px] text-purple-300 mt-1 block">Catálogo activo</span>
        </div>

        {/* 3. Pedidos */}
        <div 
          onClick={() => setActiveTab('tienda_pedidos')}
          className="goth-card rounded-xl p-4 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#A394AE]">Pedidos</span>
            <div className="p-2 rounded-lg bg-pink-500/15 text-pink-300 group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{metrics.totalOrders}</div>
          <span className="text-[10px] text-pink-300 mt-1 block">Historial total</span>
        </div>

        {/* 4. Ingresos */}
        <div 
          onClick={() => setActiveTab('reportes')}
          className="goth-card rounded-xl p-4 cursor-pointer group border-[#3DDC97]/40 shadow-[0_0_15px_rgba(61,220,151,0.15)]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#A394AE]">Ingresos</span>
            <div className="p-2 rounded-lg bg-[#3DDC97]/15 text-[#3DDC97] group-hover:scale-110 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#3DDC97]">
            ${metrics.totalRevenue} <span className="text-[11px] font-normal text-white">MXN</span>
          </div>
          <span className="text-[10px] text-[#A394AE] mt-1 block">Ventas aprobadas</span>
        </div>

        {/* 5. Pagos Pendientes */}
        <div 
          onClick={() => setActiveTab('tienda_pedidos')}
          className="goth-card rounded-xl p-4 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#A394AE]">Pagos Pendientes</span>
            <div className="p-2 rounded-lg bg-yellow-500/15 text-[#FFB020] group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#FFB020]">{metrics.pendingPaymentsCount}</div>
          <span className="text-[10px] text-[#A394AE] mt-1 block">Sin comprobante</span>
        </div>

        {/* 6. Comprobantes Pendientes */}
        <div 
          onClick={() => setActiveTab('ventas_pagos')}
          className="goth-card rounded-xl p-4 cursor-pointer group border-[#FF2E93]/60 shadow-[0_0_18px_rgba(255,46,147,0.25)]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#FF8CC6] font-semibold">Comprobantes</span>
            <div className="p-2 rounded-lg bg-[#FF2E93]/20 text-[#FF2E93] animate-pulse">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#FF2E93]">{metrics.pendingReceiptsCount}</div>
          <span className="text-[10px] text-[#FF8CC6] mt-1 block font-medium">Por aprobar manual</span>
        </div>

        {/* 7. Saldo por Aprobar */}
        <div 
          onClick={() => setActiveTab('ventas_pagos')}
          className="goth-card rounded-xl p-4 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#A394AE]">Saldo por Aprobar</span>
            <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400 group-hover:scale-110 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-blue-300">
            ${metrics.pendingApprovalBalance} <span className="text-[10px] text-white">MXN</span>
          </div>
          <span className="text-[10px] text-[#A394AE] mt-1 block">En revisión</span>
        </div>

        {/* 8. Accesos Activos */}
        <div 
          onClick={() => setActiveTab('operacion')}
          className="goth-card rounded-xl p-4 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#A394AE]">Accesos Activos</span>
            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{metrics.activeAccessesCount}</div>
          <span className="text-[10px] text-emerald-400 mt-1 block">Suscripciones vigentes</span>
        </div>

        {/* 9. Cuentas */}
        <div 
          onClick={() => setActiveTab('operacion')}
          className="goth-card rounded-xl p-4 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#A394AE]">Cuentas Master</span>
            <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-400 group-hover:scale-110 transition-transform">
              <Tv className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{metrics.totalAccounts}</div>
          <span className="text-[10px] text-indigo-300 mt-1 block">Servidores streaming</span>
        </div>

        {/* 10. Perfiles Libres */}
        <div 
          onClick={() => setActiveTab('operacion')}
          className="goth-card rounded-xl p-4 cursor-pointer group border-[#3DDC97]/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#A394AE]">Perfiles Libres</span>
            <div className="p-2 rounded-lg bg-[#3DDC97]/15 text-[#3DDC97] group-hover:scale-110 transition-transform">
              <Key className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#3DDC97]">{metrics.freeProfilesCount}</div>
          <span className="text-[10px] text-[#A394AE] mt-1 block">Stock listo p/venta</span>
        </div>

        {/* 11. Vencidos */}
        <div 
          onClick={() => setActiveTab('notificaciones')}
          className="goth-card rounded-xl p-4 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#A394AE]">Vencidos</span>
            <div className="p-2 rounded-lg bg-red-500/15 text-red-400 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-red-400">{metrics.expiredOrdersCount}</div>
          <span className="text-[10px] text-red-300 mt-1 block">Sin renovar</span>
        </div>

        {/* 12. Próximos Vencimientos */}
        <div 
          onClick={() => setActiveTab('notificaciones')}
          className="goth-card rounded-xl p-4 cursor-pointer group border-yellow-500/40"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#A394AE]">Por Vencer</span>
            <div className="p-2 rounded-lg bg-yellow-500/20 text-[#FFB020] group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#FFB020]">{metrics.expiringSoonOrdersCount}</div>
          <span className="text-[10px] text-yellow-300 mt-1 block">Próximos 3 días</span>
        </div>

      </div>

      {/* OPEN WARRANTY CLAIMS NOTIFICATION BANNER */}
      {metrics.openClaimsCount > 0 && (
        <div 
          onClick={() => setActiveTab('reportes')}
          className="p-4 rounded-2xl bg-gradient-to-r from-[#12091A] via-[#1F0827] to-[#12091A] border-2 border-[#FF2E93] shadow-[0_0_25px_rgba(255,46,147,0.3)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:border-[#FF8CC6] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF2E93]/20 border border-[#FF2E93] flex items-center justify-center text-[#FF8CC6] shrink-0">
              <ShieldAlert className="w-5 h-5 text-[#FF2E93] animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>✦ {metrics.openClaimsCount} {metrics.openClaimsCount === 1 ? 'Reporte de Garantía Pendiente' : 'Reportes de Garantía Pendientes'}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF2E93] text-white">Atención Requerida</span>
              </h4>
              <p className="text-xs text-[#A394AE]">
                Clientes reportando fallas antes de que concluya su garantía. Haz clic para auto-renovar perfiles o dar solución técnica.
              </p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-xl text-xs font-bold neon-btn-primary self-start sm:self-auto shrink-0">
            Atender Garantías &rarr;
          </button>
        </div>
      )}

      {/* QUICK WORKFLOW PANELS: COMPROBANTES POR REVISAR & PRÓXIMOS VENCIMIENTOS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        
        {/* Left: Pending Receipts / Comprobantes pendientes */}
        <div className="lg:col-span-7 goth-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF2E93] animate-ping" />
                <h3 className="font-bold text-white text-base">
                  Comprobantes Pendientes de Aprobación
                </h3>
              </div>
              <p className="text-xs text-[#A394AE]">
                Revisa el comprobante y aprueba para auto-asignar perfil y activar credenciales.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('ventas_pagos')}
              className="text-xs text-[#FF8CC6] hover:underline flex items-center gap-1"
            >
              <span>Ver todos ({pendingReceiptOrders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {pendingReceiptOrders.length === 0 ? (
            <div className="text-center py-10 bg-[#0B0612]/60 rounded-xl border border-white/5 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#3DDC97] mx-auto" />
              <div className="text-sm font-semibold text-white">¡Al día! No hay comprobantes pendientes</div>
              <div className="text-xs text-[#A394AE]">Los nuevos pagos aparecerán aquí en cuanto el cliente suba su ticket.</div>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingReceiptOrders.slice(0, 3).map((ord) => (
                <div 
                  key={ord.id}
                  className="p-3.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    {ord.receiptUrl ? (
                      <div 
                        onClick={() => setSelectedReceipt(ord.receiptUrl || null)}
                        className="w-14 h-14 rounded-lg overflow-hidden border border-[#FF2E93]/40 cursor-pointer shrink-0 relative group"
                      >
                        <img src={ord.receiptUrl} alt="Comprobante" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-gray-900 border border-white/10 flex items-center justify-center text-gray-500 text-xs shrink-0">
                        Sin foto
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-white text-sm">{ord.orderNumber}</strong>
                        <span className="text-[11px] text-[#A394AE]">({ord.paymentMethod.toUpperCase()})</span>
                      </div>
                      <div className="text-xs text-[#FF8CC6] font-medium">{ord.productName}</div>
                      <div className="text-[11px] text-[#C9C4D4]">
                        Cliente: {ord.customerName} &bull; {ord.customerWhatsApp}
                      </div>
                      {ord.receiptNote && (
                        <div className="text-[10px] text-gray-400 italic">"{ord.receiptNote}"</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => approveOrder(ord.id)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#3DDC97] hover:bg-[#2fc081] text-[#07040C] shadow-[0_0_12px_rgba(61,220,151,0.4)] flex items-center gap-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Aprobar (${ord.price})</span>
                    </button>
                    <button
                      onClick={() => rejectOrder(ord.id, 'Comprobante no legible')}
                      className="p-2 rounded-xl text-xs text-red-400 hover:bg-red-950/40 border border-red-500/20"
                      title="Rechazar comprobante"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Expiring Soon Alerts & Quick Actions */}
        <div className="lg:col-span-5 goth-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#FFB020]" />
                <h3 className="font-bold text-white text-base">
                  Próximos a Vencer (3 Días)
                </h3>
              </div>
              <p className="text-xs text-[#A394AE]">
                Clientes que requieren aviso para renovar su perfil.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('notificaciones')}
              className="text-xs text-[#FF8CC6] hover:underline"
            >
              Ver todos
            </button>
          </div>

          {expiringOrders.length === 0 ? (
            <div className="text-center py-10 bg-[#0B0612]/60 rounded-xl border border-white/5 space-y-2">
              <Sparkles className="w-8 h-8 text-[#FF8CC6] mx-auto opacity-70" />
              <div className="text-sm font-semibold text-white">Ninguna cuenta vence en las próximas 72 horas</div>
              <div className="text-xs text-[#A394AE]">Todos los accesos están vigentes.</div>
            </div>
          ) : (
            <div className="space-y-3">
              {expiringOrders.slice(0, 3).map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 rounded-xl bg-[#0B0612] border border-[#FFB020]/30 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-white">{ord.customerName}</div>
                    <div className="text-[11px] text-[#A394AE]">{ord.productName}</div>
                    <div className="text-[10px] text-[#FFB020]">
                      Vence el: {ord.expiresAt ? new Date(ord.expiresAt).toLocaleDateString() : 'Pronto'}
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${ord.customerWhatsApp.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(ord.customerName)}%20✦%20de%20JENYX.%20Tu%20suscripción%20de%20${encodeURIComponent(ord.productName)}%20vence%20en%20breve.%20¿Deseas%20renovarla%20para%20conservar%20tu%20perfil?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg font-bold bg-[#3DDC97]/20 border border-[#3DDC97] text-[#3DDC97] hover:bg-[#3DDC97] hover:text-[#07040C] flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Avisar WhatsApp</span>
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Quick shortcuts */}
          <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setActiveTab('operacion')}
              className="p-2.5 rounded-xl bg-[#0B0612] hover:bg-[#12091A] border border-white/10 text-left"
            >
              <div className="font-semibold text-white flex items-center gap-1">
                <Tv className="w-3.5 h-3.5 text-[#FF2E93]" />
                Ver Inventario
              </div>
              <div className="text-[10px] text-[#A394AE]">{accounts.length} Cuentas configuradas</div>
            </button>
            <button
              onClick={() => setActiveTab('tienda_productos')}
              className="p-2.5 rounded-xl bg-[#0B0612] hover:bg-[#12091A] border border-white/10 text-left"
            >
              <div className="font-semibold text-white flex items-center gap-1">
                <ShoppingBag className="w-3.5 h-3.5 text-[#FF8CC6]" />
                Crear Producto
              </div>
              <div className="text-[10px] text-[#A394AE]">Precios y promociones</div>
            </button>
          </div>
        </div>

      </div>

      {/* RECEIPT ZOOM MODAL */}
      {selectedReceipt && (
        <div 
          onClick={() => setSelectedReceipt(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        >
          <div className="relative max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border-2 border-[#FF2E93] bg-[#12091A] p-4">
            <img src={selectedReceipt} alt="Comprobante en grande" className="max-h-[80vh] w-auto mx-auto object-contain rounded-lg" />
            <div className="text-center mt-3">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#FF2E93] text-white"
              >
                Cerrar vista
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
