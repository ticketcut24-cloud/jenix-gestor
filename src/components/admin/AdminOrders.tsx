import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import { 
  ShoppingCart, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  Key, 
  MessageCircle, 
  Trash2, 
  Edit3, 
  Filter, 
  Calendar,
  AlertTriangle,
  RotateCw,
  ExternalLink,
  FileText
} from 'lucide-react';
import { PurchaseTicketModal } from '../common/PurchaseTicketModal';

export const AdminOrders: React.FC = () => {
  const { 
    orders, 
    accounts, 
    approveOrder, 
    rejectOrder, 
    updateOrderStatus, 
    deleteOrder, 
    settings 
  } = useStore();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [ticketOrder, setTicketOrder] = useState<Order | null>(null);
  
  // Manual fulfillment modal
  const [assigningOrder, setAssigningOrder] = useState<Order | null>(null);
  const [chosenAccountId, setChosenAccountId] = useState<string>('');
  const [chosenProfileId, setChosenProfileId] = useState<string>('');

  // Credentials inspection modal
  const [viewingCredentialsOrder, setViewingCredentialsOrder] = useState<Order | null>(null);

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerWhatsApp.includes(q);
      const matchProd = o.productName.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchPhone && !matchProd) return false;
    }
    return true;
  });

  const handleManualApproveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningOrder) return;

    if (chosenAccountId && chosenProfileId) {
      approveOrder(assigningOrder.id, chosenAccountId, chosenProfileId);
    } else {
      approveOrder(assigningOrder.id);
    }
    setAssigningOrder(null);
    setChosenAccountId('');
    setChosenProfileId('');
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'entregado':
      case 'aprobado':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#3DDC97]/20 text-[#3DDC97] border border-[#3DDC97]/50">Entregado</span>;
      case 'revision':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-950/70 text-blue-300 border border-blue-500/40">En Revisión</span>;
      case 'pendiente':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-950/70 text-[#FFB020] border border-yellow-500/40">Pendiente</span>;
      case 'vencido':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-950/70 text-red-300 border border-red-500/40">Vencido</span>;
      case 'cancelado':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-900 text-gray-400 border border-gray-700">Cancelado</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#FF8CC6]">
            ✦ Tienda &bull; Gestión de Ventas
          </span>
          <h2 className="text-2xl font-bold font-cinzel text-white mt-1">
            Pedidos de Clientes ({filteredOrders.length})
          </h2>
          <p className="text-xs text-[#A394AE]">
            Revisa compras, verifica comprobantes y asigna perfiles de streaming.
          </p>
        </div>

        {/* Search */}
        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-[#FF8CC6] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por folio, cliente, WhatsApp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#12091A] border border-[#FF2E93]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2E93] text-xs"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {[
          { id: 'all', label: 'Todos', count: orders.length },
          { id: 'revision', label: 'En Revisión (Comprobante)', count: orders.filter(o => o.status === 'revision').length },
          { id: 'entregado', label: 'Aprobados / Entregados', count: orders.filter(o => o.status === 'aprobado' || o.status === 'entregado').length },
          { id: 'pendiente', label: 'Pendientes de Pago', count: orders.filter(o => o.status === 'pendiente').length },
          { id: 'vencido', label: 'Vencidos', count: orders.filter(o => o.status === 'vencido').length },
          { id: 'cancelado', label: 'Cancelados', count: orders.filter(o => o.status === 'cancelado').length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
              statusFilter === tab.id
                ? 'neon-btn-primary'
                : 'bg-[#12091A] text-[#C9C4D4] border border-white/10 hover:border-[#FF2E93]/40'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="goth-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0612] text-[#FF8CC6] uppercase font-bold tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">Folio / Fecha</th>
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4">Producto & Precio</th>
                <th className="py-3.5 px-4">Comprobante</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4">Asignación</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500 italic">
                    No se encontraron pedidos con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const isDelivered = ord.status === 'entregado' || ord.status === 'aprobado';
                  return (
                    <tr key={ord.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Folio & Date */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-white block text-sm">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[10px] text-[#A394AE]">
                          {new Date(ord.createdAt).toLocaleDateString()} {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <strong className="text-white block">{ord.customerName}</strong>
                        <a
                          href={`https://wa.me/${ord.customerWhatsApp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#3DDC97] hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>{ord.customerWhatsApp}</span>
                        </a>
                      </td>

                      {/* Product & Price */}
                      <td className="py-3.5 px-4">
                        <span className="text-white font-medium block truncate max-w-[180px]">
                          {ord.productName}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#A394AE]">
                          <span className="font-bold text-[#FF8CC6]">${ord.price} MXN</span>
                          <span>•</span>
                          <span className="uppercase text-[10px]">{ord.paymentMethod}</span>
                        </div>
                      </td>

                      {/* Receipt */}
                      <td className="py-3.5 px-4">
                        {ord.receiptUrl ? (
                          <button
                            onClick={() => setSelectedReceipt(ord.receiptUrl || null)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FF2E93]/15 text-[#FF8CC6] hover:bg-[#FF2E93]/30 border border-[#FF2E93]/30"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver ticket</span>
                          </button>
                        ) : (
                          <span className="text-gray-500 text-[11px]">Sin archivo</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(ord.status)}
                      </td>

                      {/* Assigned Account & Profile */}
                      <td className="py-3.5 px-4">
                        {isDelivered && ord.assignedAccountEmail ? (
                          <button
                            onClick={() => setViewingCredentialsOrder(ord)}
                            className="flex items-center gap-1 text-[#3DDC97] hover:underline font-mono text-[11px]"
                          >
                            <Key className="w-3.5 h-3.5" />
                            <span>{ord.assignedProfileName || 'Perfil Activo'}</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-500">Sin asignar</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Fast Auto-Approve */}
                          {!isDelivered && ord.status !== 'cancelado' && (
                            <button
                              onClick={() => approveOrder(ord.id)}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#3DDC97] text-[#07040C] hover:bg-[#2fc081] shadow-[0_0_8px_rgba(61,220,151,0.4)]"
                              title="Auto-asignar perfil y aprobar"
                            >
                              Aprobar
                            </button>
                          )}

                          {/* Manual assign modal */}
                          <button
                            onClick={() => {
                              setAssigningOrder(ord);
                              setChosenAccountId(ord.assignedAccountId || '');
                              setChosenProfileId(ord.assignedProfileId || '');
                            }}
                            className="p-1.5 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-white"
                            title="Asignación manual de cuenta"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Generar Ticket WhatsApp */}
                          <button
                            onClick={() => setTicketOrder(ord)}
                            className="p-1.5 rounded-lg text-xs bg-[#FF2E93]/20 hover:bg-[#FF2E93] text-[#FF8CC6] hover:text-white transition-colors"
                            title="Generar Ticket de Compra para WhatsApp"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar pedido ${ord.orderNumber}?`)) {
                                deleteOrder(ord.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-xs text-red-400 hover:bg-red-950/40"
                            title="Eliminar pedido"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: MANUAL PROFILE ASSIGNMENT & STATUS UPDATE */}
      {assigningOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#12091A] border-2 border-[#FF2E93] rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold font-cinzel text-white">
                Gestionar Pedido {assigningOrder.orderNumber}
              </h3>
              <button onClick={() => setAssigningOrder(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleManualApproveSubmit} className="space-y-4 text-xs">
              <div>
                <span className="text-[#A394AE] block">Producto solicitado:</span>
                <span className="text-white font-bold text-sm">{assigningOrder.productName}</span>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1">Cambiar Estado Directo:</label>
                <div className="flex flex-wrap gap-2">
                  {(['pendiente', 'revision', 'aprobado', 'entregado', 'vencido', 'cancelado'] as OrderStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateOrderStatus(assigningOrder.id, st)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[11px] capitalize border transition-all ${
                        assigningOrder.status === st 
                          ? 'bg-[#FF2E93] text-white border-[#FF2E93]' 
                          : 'bg-[#0B0612] text-[#C9C4D4] border-white/10 hover:border-white/30'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Account selection */}
              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1">Seleccionar Cuenta Master:</label>
                <select
                  value={chosenAccountId}
                  onChange={(e) => {
                    setChosenAccountId(e.target.value);
                    setChosenProfileId('');
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white focus:outline-none"
                >
                  <option value="">-- Auto-asignar automáticamente --</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.serviceName} ({acc.email}) - {acc.profiles.filter(p => p.status === 'libre').length} libres
                    </option>
                  ))}
                </select>
              </div>

              {/* Profile selection if account is chosen */}
              {chosenAccountId && (
                <div>
                  <label className="block text-[#FF8CC6] font-semibold mb-1">Perfil específico:</label>
                  <select
                    value={chosenProfileId}
                    onChange={(e) => setChosenProfileId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white focus:outline-none"
                  >
                    <option value="">-- Primer perfil libre disponible --</option>
                    {accounts.find(a => a.id === chosenAccountId)?.profiles.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} (PIN: {p.pin}) - [{p.status.toUpperCase()}]
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssigningOrder(null)}
                  className="px-4 py-2 rounded-xl bg-[#0B0612] text-white border border-white/10"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold neon-btn-primary"
                >
                  Guardar y Activar Acceso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW CREDENTIALS */}
      {viewingCredentialsOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#12091A] border-2 border-[#3DDC97] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-[#3DDC97]" />
                Credenciales del Pedido {viewingCredentialsOrder.orderNumber}
              </h3>
              <button onClick={() => setViewingCredentialsOrder(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-black/50 border border-white/10">
                <span className="text-gray-400 block text-[10px]">Correo Streaming:</span>
                <strong className="text-white font-mono select-all text-sm">{viewingCredentialsOrder.assignedAccountEmail}</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-black/50 border border-white/10">
                <span className="text-gray-400 block text-[10px]">Contraseña:</span>
                <strong className="text-white font-mono select-all text-sm">{viewingCredentialsOrder.assignedAccountPassword}</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-black/50 border border-white/10">
                <span className="text-gray-400 block text-[10px]">Perfil Asignado:</span>
                <strong className="text-[#FF8CC6] text-sm">{viewingCredentialsOrder.assignedProfileName}</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-black/50 border border-white/10">
                <span className="text-gray-400 block text-[10px]">PIN de Perfil:</span>
                <strong className="text-[#3DDC97] font-mono text-xl tracking-widest">{viewingCredentialsOrder.assignedProfilePin}</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-black/50 border border-white/10">
                <span className="text-gray-400 block text-[10px]">Vence el:</span>
                <strong className="text-white text-sm">
                  {viewingCredentialsOrder.expiresAt ? new Date(viewingCredentialsOrder.expiresAt).toLocaleDateString() : 'No fijado'}
                </strong>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${viewingCredentialsOrder.customerWhatsApp.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(viewingCredentialsOrder.customerName)}%20✦%20Aquí%20tienes%20tus%20credenciales%20JENYX%20para%20${encodeURIComponent(viewingCredentialsOrder.productName)}:%0A%0ACorreo:%20${viewingCredentialsOrder.assignedAccountEmail}%0AContraseña:%20${viewingCredentialsOrder.assignedAccountPassword}%0APerfil:%20${viewingCredentialsOrder.assignedProfileName}%0APIN:%20${viewingCredentialsOrder.assignedProfilePin}%0A%0A¡Gracias%20por%20tu%20compra!`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-[#3DDC97] hover:bg-[#2fc081] text-[#07040C] flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Re-enviar Datos por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* RECEIPT ZOOM */}
      {selectedReceipt && (
        <div 
          onClick={() => setSelectedReceipt(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        >
          <div className="relative max-w-xl max-h-[90vh] rounded-2xl border-2 border-[#FF2E93] bg-[#12091A] p-4 text-center">
            <img src={selectedReceipt} alt="Comprobante de pago" className="max-h-[75vh] w-auto mx-auto object-contain rounded-lg" />
            <button
              onClick={() => setSelectedReceipt(null)}
              className="mt-3 px-5 py-2 rounded-xl text-xs font-bold neon-btn-primary"
            >
              Cerrar Vista
            </button>
          </div>
        </div>
      )}

      {/* PURCHASE TICKET MODAL */}
      {ticketOrder && (
        <PurchaseTicketModal
          order={ticketOrder}
          onClose={() => setTicketOrder(null)}
        />
      )}
    </div>
  );
};
