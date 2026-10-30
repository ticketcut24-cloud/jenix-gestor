import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { 
  X, 
  Search, 
  ShieldCheck, 
  Copy, 
  Check, 
  Clock, 
  Key, 
  Mail, 
  Lock, 
  Calendar, 
  RotateCw, 
  AlertTriangle, 
  CheckCircle2, 
  MessageCircle,
  ExternalLink,
  Eye,
  EyeOff,
  ShieldAlert
} from 'lucide-react';
import { WarrantyClaimModal } from './WarrantyClaimModal';

interface OrderTrackingModalProps {
  onClose: () => void;
  initialQuery?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ onClose, initialQuery = '' }) => {
  const { orders, settings, renewOrder } = useStore();
  const [query, setQuery] = useState(initialQuery);
  const [searched, setSearched] = useState(Boolean(initialQuery));
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [renewalSuccessOrder, setRenewalSuccessOrder] = useState<string | null>(null);
  const [warrantyModalOrderId, setWarrantyModalOrderId] = useState<string | null>(null);


  const cleanQuery = query.trim().toLowerCase();

  const matchingOrders = orders.filter(o => {
    if (!cleanQuery) return false;
    const matchNumber = o.orderNumber.toLowerCase().includes(cleanQuery);
    const matchPhone = o.customerWhatsApp.replace(/\D/g, '').includes(cleanQuery.replace(/\D/g, ''));
    const matchEmail = o.customerEmail?.toLowerCase().includes(cleanQuery);
    return matchNumber || matchPhone || matchEmail;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRenew = (orderId: string) => {
    const renewed = renewOrder(orderId);
    if (renewed) {
      setRenewalSuccessOrder(renewed.orderNumber);
      setQuery(renewed.orderNumber);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#12091A] border border-[#FF2E93]/40 rounded-2xl shadow-[0_0_50px_rgba(255,46,147,0.35)] overflow-hidden">
        {/* Top neon strip */}
        <div className="h-2 w-full bg-gradient-to-r from-[#7A1236] via-[#FF2E93] to-[#FF8CC6]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#0B0612]/80 border border-[#FF2E93]/30 text-[#C9C4D4] hover:text-white hover:border-[#FF2E93] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#FF8CC6] flex items-center gap-1.5">
              <span>✦</span> Seguimiento de Pedidos y Entrega de Accesos
            </span>
            <h2 className="text-2xl font-bold font-cinzel text-white mt-1">
              Rastrear Mi Suscripción
            </h2>
            <p className="text-xs text-[#A394AE] mt-1">
              Ingresa tu número de folio (ej. JNX-2091) o tu número de WhatsApp para consultar el estado o ver tus claves de streaming.
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#FF8CC6] absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Ingresa tu Folio (JNX-...) o WhatsApp"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2E93] text-sm"
              />
            </div>
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl font-bold text-xs uppercase tracking-wider neon-btn-primary shrink-0"
            >
              Consultar
            </button>
          </form>

          {/* Quick Demo Search Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] text-[#A394AE]">Prueba con:</span>
            <button
              type="button"
              onClick={() => { setQuery('JNX-2091'); setSearched(true); }}
              className="px-2 py-0.5 rounded bg-[#0B0612] border border-[#3DDC97]/40 text-[#3DDC97] hover:bg-[#3DDC97]/10"
            >
              JNX-2091 (Entregado con Claves)
            </button>
            <button
              type="button"
              onClick={() => { setQuery('JNX-2070'); setSearched(true); }}
              className="px-2 py-0.5 rounded bg-[#0B0612] border border-[#FFB020]/40 text-[#FFB020] hover:bg-[#FFB020]/10"
            >
              JNX-2070 (Por Vencer)
            </button>
            <button
              type="button"
              onClick={() => { setQuery('JNX-2092'); setSearched(true); }}
              className="px-2 py-0.5 rounded bg-[#0B0612] border border-blue-400/40 text-blue-300 hover:bg-blue-400/10"
            >
              JNX-2092 (En Revisión)
            </button>
          </div>

          {renewalSuccessOrder && (
            <div className="p-3.5 rounded-xl bg-[#3DDC97]/15 border border-[#3DDC97]/50 text-[#3DDC97] text-xs flex items-center justify-between">
              <span>✦ ¡Solicitud de renovación creada! Folio generado: <strong>{renewalSuccessOrder}</strong></span>
              <span className="text-[11px] font-semibold">Esperando comprobante</span>
            </div>
          )}

          {/* Results Area */}
          {searched && (
            <div className="space-y-4">
              {matchingOrders.length === 0 ? (
                <div className="p-8 text-center bg-[#0B0612] rounded-xl border border-white/5 space-y-3">
                  <AlertTriangle className="w-8 h-8 text-[#FFB020] mx-auto" />
                  <h4 className="text-sm font-semibold text-white">No encontramos ningún pedido con esos datos</h4>
                  <p className="text-xs text-[#A394AE] max-w-sm mx-auto">
                    Verifica que hayas escrito el folio exacto (ej. JNX-2091) o los dígitos de tu WhatsApp. Si acabas de pagar, puedes contactar a soporte.
                  </p>
                  <a
                    href={`https://wa.me/${settings.whatsappSupport.replace(/\D/g, '')}?text=Hola%20JENYX%20✦%20no%20encuentro%20mi%20pedido%20con%20búsqueda:%20${encodeURIComponent(query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#3DDC97] hover:underline pt-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Consultar con un asesor humano en WhatsApp
                  </a>
                </div>
              ) : (
                matchingOrders.map((ord) => {
                  const isApproved = ord.status === 'aprobado' || ord.status === 'entregado';
                  const isRevision = ord.status === 'revision';
                  const isPending = ord.status === 'pendiente';
                  const isExpired = ord.status === 'vencido';

                  // Expiry calculations
                  let daysRemaining = 0;
                  let isExpiringSoon = false;
                  if (ord.expiresAt) {
                    const diff = new Date(ord.expiresAt).getTime() - new Date().getTime();
                    daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));
                    if (daysRemaining > 0 && daysRemaining <= 3) {
                      isExpiringSoon = true;
                    }
                  }

                  return (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl bg-[#0B0612] border border-[#FF2E93]/30 space-y-4 shadow-lg"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white text-base">
                              {ord.orderNumber}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                              isApproved 
                                ? 'bg-[#3DDC97]/20 text-[#3DDC97] border-[#3DDC97]/50'
                                : isRevision
                                ? 'bg-blue-950/60 text-blue-300 border-blue-500/40'
                                : isExpired
                                ? 'bg-red-950/60 text-red-300 border-red-500/40'
                                : 'bg-[#FFB020]/20 text-[#FFB020] border-[#FFB020]/40'
                            }`}>
                              {ord.status === 'revision' ? 'Pago en Revisión' : ord.status}
                            </span>
                          </div>
                          <div className="text-xs text-[#A394AE] mt-0.5">
                            {ord.productName} • ${ord.price} MXN
                          </div>
                        </div>

                        {/* Renewal Button if expiring soon or expired */}
                        {(isExpiringSoon || isExpired) && (
                          <button
                            onClick={() => handleRenew(ord.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold neon-btn-primary flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,46,147,0.5)]"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                            <span>Renovar Ahora</span>
                          </button>
                        )}
                      </div>

                      {/* Status Stepper */}
                      <div className="grid grid-cols-4 gap-1 text-center text-[10px] sm:text-xs">
                        <div className={`p-2 rounded-lg ${isPending || isRevision || isApproved ? 'bg-[#FF2E93]/20 text-[#FF8CC6] border border-[#FF2E93]/40' : 'bg-black/30 text-gray-500'}`}>
                          1. Registrado
                        </div>
                        <div className={`p-2 rounded-lg ${isRevision || isApproved ? 'bg-[#FF2E93]/20 text-[#FF8CC6] border border-[#FF2E93]/40' : 'bg-black/30 text-gray-500'}`}>
                          2. En Revisión
                        </div>
                        <div className={`p-2 rounded-lg ${isApproved ? 'bg-[#3DDC97]/20 text-[#3DDC97] border border-[#3DDC97]/40' : 'bg-black/30 text-gray-500'}`}>
                          3. Aprobado
                        </div>
                        <div className={`p-2 rounded-lg ${ord.status === 'entregado' ? 'bg-[#3DDC97] text-[#07040C] font-bold shadow-[0_0_10px_#3DDC97]' : 'bg-black/30 text-gray-500'}`}>
                          4. Entregado
                        </div>
                      </div>

                      {/* Expiration alert banner */}
                      {isExpiringSoon && (
                        <div className="p-3 rounded-xl bg-[#FFB020]/15 border border-[#FFB020]/40 text-[#FFB020] text-xs flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 shrink-0" />
                            <span>✦ Atención: Tu suscripción vence en <strong>{daysRemaining} días</strong>. ¡Renueva con anticipación para no perder tu perfil!</span>
                          </div>
                        </div>
                      )}

                      {/* STREAMING CREDENTIALS DISPLAY (REVEALED ONLY IF APPROVED/ENTREGADO) */}
                      {isApproved && ord.assignedAccountEmail ? (
                        <div className="p-4 rounded-xl bg-gradient-to-b from-[#1A0B26] to-[#12091A] border-2 border-[#FF2E93] shadow-[0_0_20px_rgba(255,46,147,0.25)] space-y-3">
                          <div className="flex items-center justify-between border-b border-[#FF2E93]/30 pb-2">
                            <div className="flex items-center gap-2">
                              <Key className="w-4 h-4 text-[#FF2E93]" />
                              <span className="text-xs font-bold uppercase tracking-wider text-white">
                                Tus Credenciales de Acceso Oficiales
                              </span>
                            </div>
                            <span className="text-[11px] text-[#3DDC97] font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Acceso Activo
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                            {/* Correo */}
                            <div className="p-2.5 rounded-lg bg-black/50 border border-white/10 flex items-center justify-between">
                              <div className="truncate mr-2">
                                <span className="text-[10px] text-[#A394AE] block">Correo / Usuario</span>
                                <span className="font-mono text-white select-all text-xs font-semibold">
                                  {ord.assignedAccountEmail}
                                </span>
                              </div>
                              <button
                                onClick={() => copyText(ord.assignedAccountEmail || '', 'email')}
                                className="p-1.5 rounded bg-[#FF2E93]/20 hover:bg-[#FF2E93] text-[#FF8CC6] hover:text-white transition-colors"
                                title="Copiar correo"
                              >
                                {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-[#3DDC97]" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>

                            {/* Contraseña */}
                            <div className="p-2.5 rounded-lg bg-black/50 border border-white/10 flex items-center justify-between">
                              <div className="truncate mr-2">
                                <span className="text-[10px] text-[#A394AE] block">Contraseña</span>
                                <span className="font-mono text-white text-xs font-semibold">
                                  {showPassword ? ord.assignedAccountPassword : '••••••••••••'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-300"
                                >
                                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  onClick={() => copyText(ord.assignedAccountPassword || '', 'pass')}
                                  className="p-1.5 rounded bg-[#FF2E93]/20 hover:bg-[#FF2E93] text-[#FF8CC6] hover:text-white transition-colors"
                                  title="Copiar contraseña"
                                >
                                  {copiedKey === 'pass' ? <Check className="w-3.5 h-3.5 text-[#3DDC97]" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>

                            {/* Perfil */}
                            <div className="p-2.5 rounded-lg bg-black/50 border border-white/10 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-[#A394AE] block">Perfil Asignado</span>
                                <span className="font-semibold text-[#FF8CC6] text-xs">
                                  {ord.assignedProfileName || 'Tu Perfil Asignado'}
                                </span>
                              </div>
                            </div>

                            {/* PIN */}
                            <div className="p-2.5 rounded-lg bg-black/50 border border-white/10 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-[#A394AE] block">PIN de Perfil</span>
                                <span className="font-mono text-xl font-bold text-[#3DDC97] tracking-widest">
                                  {ord.assignedProfilePin || '0000'}
                                </span>
                              </div>
                              <button
                                onClick={() => copyText(ord.assignedProfilePin || '', 'pin')}
                                className="p-1.5 rounded bg-[#FF2E93]/20 hover:bg-[#FF2E93] text-[#FF8CC6] hover:text-white transition-colors"
                                title="Copiar PIN"
                              >
                                {copiedKey === 'pin' ? <Check className="w-3.5 h-3.5 text-[#3DDC97]" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* Expiration date */}
                          <div className="flex items-center justify-between text-xs text-[#C9C4D4] pt-1">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#FF2E93]" />
                              Vence el: <strong className="text-white">{ord.expiresAt ? new Date(ord.expiresAt).toLocaleDateString() : '30 días'}</strong>
                            </span>
                            <span className="text-[11px] text-[#3DDC97]">
                              {daysRemaining > 0 ? `Quedan ${daysRemaining} días` : 'Vigente'}
                            </span>
                          </div>
                        </div>
                      ) : isRevision ? (
                        <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200 space-y-2">
                          <div className="font-semibold flex items-center gap-1.5 text-blue-100">
                            <Clock className="w-4 h-4 text-blue-400" />
                            Pago recibido y en validación
                          </div>
                          <p>
                            Un operador de JENYX está validando tu comprobante de pago. Tan pronto se apruebe, verás aquí tus accesos de streaming de inmediato.
                          </p>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-yellow-950/40 border border-yellow-500/30 text-xs text-yellow-200 space-y-2">
                          <div className="font-semibold flex items-center gap-1.5 text-yellow-100">
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                            Pendiente de Comprobante
                          </div>
                          <p>
                            Por favor realiza tu transferencia o depósito y envía tu comprobante por WhatsApp con el folio <strong>{ord.orderNumber}</strong> para activar tu servicio.
                          </p>
                        </div>
                      )}

                      {/* Direct WhatsApp button and Warranty button for this specific order */}
                      <div className="pt-1 flex flex-wrap items-center gap-2">
                        {(isApproved || ord.status === 'entregado') && (
                          <button
                            type="button"
                            onClick={() => setWarrantyModalOrderId(ord.id)}
                            className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold bg-[#12091A] border border-[#FF2E93]/60 text-[#FF8CC6] hover:bg-[#FF2E93] hover:text-white flex items-center justify-center gap-1.5 transition-all"
                            title="Pedir garantía o solución de fallas antes de que concluya tu suscripción"
                          >
                            <ShieldAlert className="w-3.5 h-3.5 text-[#FF2E93]" />
                            <span>Reportar Falla / Garantía</span>
                          </button>
                        )}


                        <a
                          href={`https://wa.me/${settings.whatsappSupport.replace(/\D/g, '')}?text=Hola%20JENYX%20✦%20tengo%20duda%20o%20renovación%20del%20pedido%20${ord.orderNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#12091A] border border-[#3DDC97]/40 text-[#3DDC97] hover:bg-[#3DDC97] hover:text-[#07040C] flex items-center justify-center gap-2 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>WhatsApp Soporte</span>
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {warrantyModalOrderId !== null && (
        <WarrantyClaimModal
          preselectedOrderId={warrantyModalOrderId}
          onClose={() => setWarrantyModalOrderId(null)}
        />
      )}
    </div>
  );
};

