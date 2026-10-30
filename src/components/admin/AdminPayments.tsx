import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, Client } from '../../types';
import { 
  DollarSign, 
  FileCheck, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  CreditCard, 
  Building2, 
  Store, 
  Search,
  MessageCircle,
  ExternalLink,
  Wallet,
  Sparkles,
  Zap,
  ArrowRight,
  Plus
} from 'lucide-react';
import { PurchaseTicketModal } from '../common/PurchaseTicketModal';

export const AdminPayments: React.FC = () => {
  const { 
    orders, 
    clients, 
    approveOrder, 
    rejectOrder, 
    updateOrderStatus, 
    creditClientBalance, 
    metrics,
    settings 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'pendientes' | 'historial'>('pendientes');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [rejectReasonOrder, setRejectReasonOrder] = useState<Order | null>(null);
  const [rejectReasonText, setRejectReasonText] = useState('Comprobante ilegible o pago no reflejado en cuenta bancaria');
  
  // Success feedback state after crediting
  const [creditedNotification, setCreditedNotification] = useState<{
    order: Order;
    clientName: string;
    clientPhone: string;
    amount: number;
  } | null>(null);

  // Ticket viewing
  const [ticketOrder, setTicketOrder] = useState<Order | null>(null);

  // Manual Quick Credit Modal
  const [showManualCreditModal, setShowManualCreditModal] = useState(false);
  const [manualClientId, setManualClientId] = useState('');
  const [manualAmount, setManualAmount] = useState('');
  const [manualReason, setManualReason] = useState('Recarga SPEI autorizada en panel');

  const pendingPayments = orders.filter(o => o.status === 'revision');
  const approvedPayments = orders.filter(o => o.status === 'aprobado' || o.status === 'entregado');

  // Segregate pending SPEI recharges vs pending regular orders
  const pendingSpeiRecharges = pendingPayments.filter(o => 
    o.productName.toLowerCase().includes('recarga') || o.itemCategory === 'metodo'
  );
  const pendingProductOrders = pendingPayments.filter(o => 
    !o.productName.toLowerCase().includes('recarga') && o.itemCategory !== 'metodo'
  );

  const handleRejectConfirm = () => {
    if (!rejectReasonOrder) return;
    rejectOrder(rejectReasonOrder.id, rejectReasonText);
    setRejectReasonOrder(null);
  };

  // 1-Click SPEI Balance Accreditation Handler
  const handleCreditSpeiBalance = (ord: Order) => {
    // 1. Locate client by WhatsApp or Email or create matching link
    let targetClient = clients.find(c => 
      c.whatsapp === ord.customerWhatsApp || 
      (ord.customerEmail && c.email?.toLowerCase() === ord.customerEmail.toLowerCase())
    );

    let clientIdToCredit = targetClient?.id;

    if (!clientIdToCredit && targetClient) {
      clientIdToCredit = targetClient.id;
    }

    if (clientIdToCredit) {
      creditClientBalance(
        clientIdToCredit, 
        ord.price, 
        `Recarga SPEI Folio ${ord.orderNumber} (${ord.receiptNote || 'Comprobante aprobado'})`, 
        'abono'
      );
    }

    // 2. Mark order as approved
    updateOrderStatus(ord.id, 'aprobado', `Saldo de $${ord.price} MXN acreditado exitosamente`);

    // 3. Show notification modal with 1-click WhatsApp message to client
    setCreditedNotification({
      order: ord,
      clientName: ord.customerName,
      clientPhone: ord.customerWhatsApp,
      amount: ord.price
    });
  };

  // WhatsApp notification sender
  const sendWhatsAppApproval = (clientPhone: string, clientName: string, orderNumber: string, amount: number) => {
    const cleanPhone = clientPhone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Hola ${clientName} ✦\n\n` +
      `¡Tu recarga SPEI en JENYX ha sido aprobada exitosamente!\n` +
      `• Folio: ${orderNumber}\n` +
      `• Monto Acreditado: $${amount} MXN\n` +
      `• Estado: Saldo disponible en tu cuenta\n\n` +
      `Ya puedes utilizar tu saldo para comprar cualquier perfil de streaming o archivo VIP al instante.\n\n` +
      `¡Gracias por tu preferencia!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  // Handle Manual Direct Credit
  const handleManualCreditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(manualAmount);
    if (!manualClientId || isNaN(amt) || amt <= 0) return;

    creditClientBalance(manualClientId, amt, manualReason, 'abono');
    setShowManualCreditModal(false);
    setManualAmount('');
    setManualReason('Recarga SPEI autorizada en panel');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#FF8CC6]">
            ✦ Ventas &bull; Verificación y Acreditación de Saldo SPEI
          </span>
          <h2 className="text-2xl font-bold font-cinzel text-white mt-1">
            Comprobantes y Pagos Recibidos
          </h2>
          <p className="text-xs text-[#A394AE]">
            Revisa transferencias SPEI, comprobantes bancarios y acredita saldo al instante a los clientes.
          </p>
        </div>

        <button
          onClick={() => setShowManualCreditModal(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#FF2E93] to-[#7A1236] text-white hover:opacity-95 shadow-[0_0_15px_rgba(255,46,147,0.3)] flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Acreditar Saldo Manualmente</span>
        </button>
      </div>

      {/* Metric summary banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="goth-card rounded-xl p-4 border-[#FF2E93]/40">
          <span className="text-xs text-[#FF8CC6] block">Comprobantes por Revisar</span>
          <div className="text-2xl font-black text-white mt-1">{pendingPayments.length}</div>
          <span className="text-[11px] text-[#A394AE]">
            {pendingSpeiRecharges.length} recargas SPEI &bull; {pendingProductOrders.length} pedidos
          </span>
        </div>
        <div className="goth-card rounded-xl p-4 border-blue-500/40">
          <span className="text-xs text-blue-300 block">Saldo por Validar</span>
          <div className="text-2xl font-black text-blue-300 mt-1">${metrics.pendingApprovalBalance} MXN</div>
          <span className="text-[11px] text-[#A394AE]">En revisión bancaria</span>
        </div>
        <div className="goth-card rounded-xl p-4 border-[#3DDC97]/40">
          <span className="text-xs text-[#3DDC97] block">Total Ingresos Aprobados</span>
          <div className="text-2xl font-black text-[#3DDC97] mt-1">${metrics.totalRevenue} MXN</div>
          <span className="text-[11px] text-[#A394AE]">Fondos acreditados</span>
        </div>
        <div className="goth-card rounded-xl p-4 border-purple-500/40">
          <span className="text-xs text-purple-300 block">Total Clientes con Saldo</span>
          <div className="text-2xl font-black text-purple-300 mt-1">
            {clients.filter(c => (c.balance || 0) > 0).length}
          </div>
          <span className="text-[11px] text-[#A394AE]">Billeteras activas</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('pendientes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pendientes'
              ? 'neon-btn-primary'
              : 'bg-[#12091A] text-[#C9C4D4] border border-white/10'
          }`}
        >
          Comprobantes Pendientes ({pendingPayments.length})
        </button>
        <button
          onClick={() => setActiveTab('historial')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'historial'
              ? 'neon-btn-primary'
              : 'bg-[#12091A] text-[#C9C4D4] border border-white/10'
          }`}
        >
          Historial de Pagos Aprobados ({approvedPayments.length})
        </button>
      </div>

      {/* CONTENT: PENDING VOUCHERS */}
      {activeTab === 'pendientes' ? (
        pendingPayments.length === 0 ? (
          <div className="goth-card rounded-2xl p-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#3DDC97] mx-auto shadow-sm" />
            <h3 className="text-base font-bold text-white">¡No hay comprobantes pendientes de validación!</h3>
            <p className="text-xs text-[#A394AE] max-w-sm mx-auto">
              Todas las transferencias SPEI y pedidos han sido revisados y acreditados a las cuentas de los clientes.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* 1. SECCIÓN PRIORITARIA: RECARGAS SPEI PENDIENTES */}
            {pendingSpeiRecharges.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-[#FF2E93]/20 text-[#FF8CC6]">
                    <Zap className="w-4 h-4" />
                  </span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#FF8CC6]">
                    Solicitudes de Recarga de Saldo SPEI ({pendingSpeiRecharges.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {pendingSpeiRecharges.map((ord) => {
                    const client = clients.find(c => 
                      c.whatsapp === ord.customerWhatsApp || 
                      (ord.customerEmail && c.email?.toLowerCase() === ord.customerEmail.toLowerCase())
                    );
                    const currentBal = client?.balance || 0;
                    const newBal = currentBal + ord.price;

                    return (
                      <div
                        key={ord.id}
                        className="p-5 rounded-2xl bg-[#12091A] border-2 border-[#3DDC97]/60 shadow-[0_0_25px_rgba(61,220,151,0.2)] flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-white text-base">
                                {ord.orderNumber}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#3DDC97]/20 text-[#3DDC97] border border-[#3DDC97]/50 flex items-center gap-1">
                                <Zap className="w-3 h-3" /> RECARGA SPEI
                              </span>
                            </div>
                            <span className="text-xs text-[#A394AE]">
                              {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div className="flex gap-4">
                            {/* Receipt Thumbnail */}
                            {ord.receiptUrl ? (
                              <div
                                onClick={() => setSelectedReceipt(ord.receiptUrl || null)}
                                className="w-24 h-24 rounded-xl overflow-hidden border-2 border-[#3DDC97]/60 cursor-pointer shrink-0 relative group"
                              >
                                <img src={ord.receiptUrl} alt="Comprobante SPEI" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] transition-opacity">
                                  <Eye className="w-5 h-5 mb-0.5 text-[#3DDC97]" />
                                  <span>Ampliar</span>
                                </div>
                              </div>
                            ) : (
                              <div className="w-24 h-24 rounded-xl bg-black/50 border border-white/10 flex flex-col items-center justify-center text-gray-500 text-[10px] shrink-0 p-1 text-center">
                                <AlertCircle className="w-5 h-5 mb-1" />
                                <span>Sin imagen</span>
                              </div>
                            )}

                            <div className="space-y-1.5 text-xs flex-1">
                              <div>
                                <span className="text-[10px] text-[#A394AE] block">Monto Solicitado:</span>
                                <div className="text-2xl font-black text-[#3DDC97]">
                                  ${ord.price} <span className="text-xs text-white">MXN</span>
                                </div>
                              </div>

                              <div className="text-[#C9C4D4]">
                                Cliente: <strong className="text-white">{ord.customerName}</strong>
                              </div>

                              <div className="flex items-center gap-2 text-[11px]">
                                <span className="text-[#A394AE]">Saldo actual:</span>
                                <strong className="text-[#FF8CC6]">${currentBal} MXN</strong>
                                <span className="text-gray-500">&rarr;</span>
                                <strong className="text-[#3DDC97]">${newBal} MXN</strong>
                              </div>

                              {ord.receiptNote && (
                                <div className="text-[11px] text-gray-300 bg-black/50 p-2 rounded-lg border border-white/5 font-mono">
                                  {ord.receiptNote}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => handleCreditSpeiBalance(ord)}
                            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#3DDC97] hover:bg-[#2fc081] text-[#07040C] shadow-[0_0_15px_rgba(61,220,151,0.5)] flex items-center justify-center gap-1.5 transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>✓ Acreditar Saldo (${ord.price} MXN)</span>
                          </button>

                          <button
                            onClick={() => setRejectReasonOrder(ord)}
                            className="py-2.5 px-3 rounded-xl text-xs font-semibold text-red-400 bg-red-950/30 hover:bg-red-950/60 border border-red-500/30"
                          >
                            Rechazar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. PEDIDOS REGULARES DE PRODUCTOS / STREAMING PENDIENTES */}
            {pendingProductOrders.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-[#FF2E93]/20 text-[#FF8CC6]">
                    <Store className="w-4 h-4" />
                  </span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#FF8CC6]">
                    Pedidos de Cuentas & Streaming Pendientes ({pendingProductOrders.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {pendingProductOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="goth-card rounded-2xl p-5 space-y-4 border-[#FF2E93]/40 shadow-[0_0_20px_rgba(255,46,147,0.15)] flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="font-mono font-bold text-white text-base">
                            {ord.orderNumber}
                          </span>
                          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-950/80 text-blue-300 border border-blue-500/40">
                            Revisión Manual
                          </span>
                        </div>

                        <div className="flex gap-4">
                          {/* Thumbnail preview */}
                          {ord.receiptUrl ? (
                            <div
                              onClick={() => setSelectedReceipt(ord.receiptUrl || null)}
                              className="w-24 h-24 rounded-xl overflow-hidden border-2 border-[#FF2E93]/50 cursor-pointer shrink-0 relative group"
                            >
                              <img src={ord.receiptUrl} alt="Comprobante" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] transition-opacity">
                                <Eye className="w-5 h-5 mb-0.5" />
                                <span>Ampliar</span>
                              </div>
                            </div>
                          ) : (
                            <div className="w-24 h-24 rounded-xl bg-black/50 border border-white/10 flex flex-col items-center justify-center text-gray-500 text-[10px] shrink-0 p-1 text-center">
                              <AlertCircle className="w-5 h-5 mb-1" />
                              <span>Sin imagen</span>
                            </div>
                          )}

                          <div className="space-y-1 text-xs flex-1">
                            <div className="font-bold text-white text-sm">{ord.productName}</div>
                            <div className="text-xl font-extrabold text-[#3DDC97]">
                              ${ord.price} <span className="text-xs text-white">MXN</span>
                            </div>
                            <div className="text-[#C9C4D4]">
                              Cliente: <strong className="text-white">{ord.customerName}</strong>
                            </div>
                            <div className="text-[#A394AE] flex items-center gap-1">
                              <span>Método:</span>
                              <strong className="text-[#FF8CC6] uppercase font-mono">{ord.paymentMethod}</strong>
                            </div>
                            {ord.receiptNote && (
                              <div className="text-[11px] text-gray-400 bg-black/40 p-1.5 rounded border border-white/5">
                                Ref: "{ord.receiptNote}"
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                        <button
                          onClick={() => approveOrder(ord.id)}
                          className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#3DDC97] hover:bg-[#2fc081] text-[#07040C] shadow-[0_0_12px_rgba(61,220,151,0.5)] flex items-center justify-center gap-1.5 transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Aprobar Pago & Asignar Perfil</span>
                        </button>
                        <button
                          onClick={() => setRejectReasonOrder(ord)}
                          className="py-2.5 px-3 rounded-xl text-xs font-semibold text-red-400 bg-red-950/30 hover:bg-red-950/60 border border-red-500/30"
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )
      ) : (
        /* APPROVED PAYMENTS HISTORY */
        <div className="goth-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B0612] text-[#FF8CC6] uppercase font-bold tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Folio</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Concepto / Producto</th>
                  <th className="py-3 px-4">Método</th>
                  <th className="py-3 px-4">Monto</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {approvedPayments.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-mono font-bold text-white">{ord.orderNumber}</td>
                    <td className="py-3 px-4 text-white">
                      <div>{ord.customerName}</div>
                      <div className="text-[10px] text-[#A394AE]">{ord.customerWhatsApp}</div>
                    </td>
                    <td className="py-3 px-4 text-[#C9C4D4]">{ord.productName}</td>
                    <td className="py-3 px-4 uppercase text-[#FF8CC6] font-mono">{ord.paymentMethod}</td>
                    <td className="py-3 px-4 font-bold text-[#3DDC97]">${ord.price} MXN</td>
                    <td className="py-3 px-4 text-gray-400 text-[11px]">
                      {new Date(ord.updatedAt || ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 flex items-center gap-3">
                      {ord.receiptUrl && (
                        <button
                          onClick={() => setSelectedReceipt(ord.receiptUrl || null)}
                          className="text-[#FF8CC6] hover:underline flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Comprobante</span>
                        </button>
                      )}
                      <button
                        onClick={() => setTicketOrder(ord)}
                        className="text-[#3DDC97] hover:underline flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Ticket</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: POST-ACCREDITATION NOTIFICATION CONFIRMATION */}
      {creditedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#12091A] border-2 border-[#3DDC97] rounded-3xl p-6 sm:p-7 space-y-5 text-center shadow-[0_0_40px_rgba(61,220,151,0.35)]">
            <div className="w-14 h-14 rounded-full bg-[#3DDC97]/20 border-2 border-[#3DDC97] text-[#3DDC97] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3DDC97]">
                ✦ Saldo Acreditado Exitosamente
              </span>
              <h3 className="text-xl font-bold font-cinzel text-white mt-1">
                +${creditedNotification.amount} MXN Acreditados
              </h3>
              <p className="text-xs text-[#C9C4D4] mt-2">
                El saldo de <strong className="text-white">{creditedNotification.clientName}</strong> ha sido actualizado en su billetera.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 text-xs text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-[#A394AE]">Folio:</span>
                <span className="font-mono text-white font-bold">{creditedNotification.order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A394AE]">WhatsApp:</span>
                <span className="text-white">{creditedNotification.clientPhone}</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  sendWhatsAppApproval(
                    creditedNotification.clientPhone,
                    creditedNotification.clientName,
                    creditedNotification.order.orderNumber,
                    creditedNotification.amount
                  );
                }}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-[#3DDC97] text-[#07040C] hover:bg-[#34c485] flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(61,220,151,0.4)]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Notificar Acreditación al Cliente por WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  setTicketOrder(creditedNotification.order);
                  setCreditedNotification(null);
                }}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-[#0B0612] border border-[#FF2E93]/40 text-[#FF8CC6] hover:bg-[#FF2E93]/20 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generar Ticket de Compra</span>
              </button>

              <button
                onClick={() => setCreditedNotification(null)}
                className="w-full py-2 text-xs text-gray-400 hover:text-white"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: MANUAL QUICK CREDIT */}
      {showManualCreditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#12091A] border-2 border-[#FF2E93]/60 rounded-3xl p-6 space-y-4 shadow-[0_0_40px_rgba(255,46,147,0.35)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold font-cinzel text-white flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#FF2E93]" />
                <span>Acreditar Saldo a Cliente</span>
              </h3>
              <button
                onClick={() => setShowManualCreditModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualCreditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#C9C4D4] mb-1">Seleccionar Cliente:</label>
                <select
                  required
                  value={manualClientId}
                  onChange={(e) => setManualClientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-white/10 text-white focus:outline-none focus:border-[#FF2E93]"
                >
                  <option value="">-- Elige un cliente registrado --</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.whatsapp}) - Saldo: ${c.balance || 0} MXN
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#C9C4D4] mb-1">Monto en Pesos (MXN):</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  placeholder="Ej. 100"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-white/10 text-white focus:outline-none focus:border-[#FF2E93]"
                />
              </div>

              <div>
                <label className="block text-[#C9C4D4] mb-1">Motivo / Folio SPEI:</label>
                <input
                  type="text"
                  required
                  value={manualReason}
                  onChange={(e) => setManualReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-white/10 text-white focus:outline-none focus:border-[#FF2E93]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowManualCreditModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#0B0612] text-gray-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-[#3DDC97] text-[#07040C] hover:bg-[#34c485]"
                >
                  Acreditar Ahora
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectReasonOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#12091A] border-2 border-red-500 rounded-2xl p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white">
              Rechazar Comprobante de {rejectReasonOrder.orderNumber}
            </h3>
            <p className="text-gray-400">
              Indica el motivo por el cual no se pudo validar el pago:
            </p>
            <input
              type="text"
              value={rejectReasonText}
              onChange={(e) => setRejectReasonText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-red-500/40 text-white focus:outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectReasonOrder(null)}
                className="px-4 py-2 rounded-xl bg-[#0B0612] text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                className="px-4 py-2 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white"
              >
                Confirmar Rechazo
              </button>
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
            <img src={selectedReceipt} alt="Comprobante" className="max-h-[75vh] w-auto mx-auto object-contain rounded-lg" />
            <button
              onClick={() => setSelectedReceipt(null)}
              className="mt-3 px-5 py-2 rounded-xl text-xs font-bold neon-btn-primary"
            >
              Cerrar Vista
            </button>
          </div>
        </div>
      )}

      {/* TICKET DIGITAL MODAL */}
      {ticketOrder && (
        <PurchaseTicketModal
          order={ticketOrder}
          onClose={() => setTicketOrder(null)}
        />
      )}
    </div>
  );
};
