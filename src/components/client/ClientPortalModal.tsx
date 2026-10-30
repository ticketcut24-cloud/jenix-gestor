import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  User, 
  Key, 
  Calendar, 
  Clock, 
  Copy, 
  Check, 
  RotateCw, 
  Download, 
  LogOut, 
  MessageCircle, 
  Tv, 
  FolderDown, 
  ExternalLink,
  ShieldCheck,
  Eye,
  EyeOff,
  Wallet,
  Zap,
  History,
  ShieldAlert
} from 'lucide-react';
import { SpeiPaymentModal } from '../store/SpeiPaymentModal';
import { WarrantyClaimModal } from '../store/WarrantyClaimModal';

interface ClientPortalModalProps {
  onClose: () => void;
  onOpenStore: () => void;
}

export const ClientPortalModal: React.FC<ClientPortalModalProps> = ({ onClose, onOpenStore }) => {
  const { currentClient, clientLogout, orders, settings, renewOrder, warrantyClaims } = useStore();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<{ [id: string]: boolean }>({});
  const [renewedSuccess, setRenewedSuccess] = useState<string | null>(null);
  const [showSpeiModal, setShowSpeiModal] = useState(false);
  const [showBalanceHistory, setShowBalanceHistory] = useState(false);
  const [warrantyModalOrderId, setWarrantyModalOrderId] = useState<string | null>(null);


  if (!currentClient) return null;

  // Find all orders corresponding to this client
  const clientOrders = orders.filter(o => 
    o.customerWhatsApp === currentClient.whatsapp ||
    (currentClient.email && o.customerEmail?.toLowerCase() === currentClient.email.toLowerCase())
  );

  const copyText = (txt: string, keyName: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const togglePassword = (ordId: string) => {
    setShowPassword(prev => ({ ...prev, [ordId]: !prev[ordId] }));
  };

  const handleRenew = (orderId: string) => {
    const renewed = renewOrder(orderId);
    if (renewed) {
      setRenewedSuccess(renewed.orderNumber);
      setTimeout(() => setRenewedSuccess(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#12091A] border-2 border-[#FF2E93]/60 rounded-3xl shadow-[0_0_50px_rgba(255,46,147,0.35)] overflow-hidden">
        
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
          
          {/* Client Welcome Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-full bg-gradient-to-br from-[#FF2E93] to-[#7A1236] p-0.5 shadow-[0_0_15px_rgba(255,46,147,0.4)]">
                <div className="w-full h-full rounded-full bg-[#0B0612] flex items-center justify-center text-white">
                  <User className="w-6 h-6 text-[#FF8CC6]" />
                </div>
              </div>
              <div>
                <span className="text-xs text-[#FF8CC6] uppercase tracking-wider font-semibold">
                  ✦ Portal del Cliente JENYX
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-white leading-tight">
                  Hola, {currentClient.name}
                </h3>
                <div className="text-xs text-[#A394AE] flex flex-wrap items-center gap-2 mt-0.5">
                  <span>{currentClient.whatsapp}</span>
                  {currentClient.email && <span>&bull; {currentClient.email}</span>}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                clientLogout();
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#0B0612] border border-white/10 text-xs text-[#C9C4D4] hover:text-red-400 hover:border-red-500/40 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>

          {renewedSuccess && (
            <div className="p-3.5 rounded-xl bg-[#3DDC97]/15 border border-[#3DDC97]/40 text-[#3DDC97] text-xs font-semibold flex items-center justify-between">
              <span>✦ ¡Pedido de renovación generado! Folio: <strong>{renewedSuccess}</strong></span>
              <span className="text-[10px]">Verifica en WhatsApp o sube tu ticket</span>
            </div>
          )}

          {/* BILLETERA / SALDO JENYX CARD */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#12091A] via-[#1A0B26] to-[#12091A] border-2 border-[#3DDC97]/50 shadow-[0_0_25px_rgba(61,220,151,0.2)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3DDC97] flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5" /> Mi Billetera Digital JENYX
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white flex items-baseline gap-1.5">
                <span>${currentClient.balance || 0}</span>
                <span className="text-xs text-[#3DDC97] font-semibold">MXN Disponibles</span>
              </div>
              <p className="text-[11px] text-[#A394AE]">
                Usa tu saldo para comprar cuentas, perfiles o APKs al instante sin esperar revisión manual.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setShowSpeiModal(true)}
                className="py-2.5 px-4 rounded-xl text-xs font-bold bg-[#3DDC97] text-[#07040C] hover:bg-[#34c485] flex items-center gap-2 shadow-[0_0_15px_rgba(61,220,151,0.4)] transition-all"
              >
                <Zap className="w-4 h-4 text-[#07040C]" />
                <span>Recargar con SPEI</span>
              </button>

              {(currentClient.balanceHistory && currentClient.balanceHistory.length > 0) && (
                <button
                  onClick={() => setShowBalanceHistory(!showBalanceHistory)}
                  className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-[#0B0612] border border-white/10 text-[#C9C4D4] hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <History className="w-3.5 h-3.5 text-[#FF8CC6]" />
                  <span>{showBalanceHistory ? 'Ocultar' : 'Movimientos'}</span>
                </button>
              )}
            </div>
          </div>

          {/* BALANCE MOVEMENTS DROPDOWN */}
          {showBalanceHistory && currentClient.balanceHistory && currentClient.balanceHistory.length > 0 && (
            <div className="p-4 rounded-xl bg-[#0B0612] border border-white/10 space-y-2 text-xs animate-fadeIn">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A394AE] block mb-2">
                Historial de Movimientos de Saldo
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {currentClient.balanceHistory.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5 text-[11px]">
                    <div>
                      <span className="text-white font-medium block">{tx.reason}</span>
                      <span className="text-[10px] text-[#A394AE]">{new Date(tx.date).toLocaleDateString()}</span>
                    </div>
                    <span className={`font-mono font-bold ${tx.type === 'abono' ? 'text-[#3DDC97]' : 'text-red-400'}`}>
                      {tx.type === 'abono' ? '+' : '-'}${tx.amount} MXN
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subscriptions & Purchases Header */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold font-cinzel text-white flex items-center gap-2">
                <Tv className="w-4 h-4 text-[#FF2E93]" />
                <span>Mis Suscripciones & Archivos Adquiridos ({clientOrders.length})</span>
              </h4>
              <p className="text-xs text-[#A394AE]">
                Tus credenciales de streaming, PINs y enlaces de descarga de Drive / APKs.
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenStore();
              }}
              className="text-xs font-semibold text-[#FF8CC6] hover:underline"
            >
              + Comprar otro servicio
            </button>
          </div>

          {/* Orders / Subscriptions Cards */}
          {clientOrders.length === 0 ? (
            <div className="text-center py-10 bg-[#0B0612] rounded-2xl border border-white/5 space-y-3">
              <ShieldCheck className="w-10 h-10 text-[#FF8CC6] mx-auto opacity-60" />
              <h4 className="text-sm font-semibold text-white">Aún no tienes compras activas</h4>
              <p className="text-xs text-[#A394AE] max-w-sm mx-auto">
                Explora nuestro catálogo de cuentas de Netflix, Disney+, Max, o nuestros archivos Google Drive y APKs para comenzar.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenStore();
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold neon-btn-primary"
              >
                Ver Catálogo de Servicios
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {clientOrders.map((ord) => {
                const isDelivered = ord.status === 'entregado' || ord.status === 'aprobado';
                const isRevision = ord.status === 'revision';
                const isExpired = ord.status === 'vencido';

                let daysRemaining = 0;
                let isExpiringSoon = false;
                if (ord.expiresAt) {
                  const diff = new Date(ord.expiresAt).getTime() - new Date().getTime();
                  daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));
                  if (daysRemaining > 0 && daysRemaining <= 3) isExpiringSoon = true;
                }

                return (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl bg-[#0B0612] border border-[#FF2E93]/35 shadow-lg space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="font-mono text-white text-base">{ord.orderNumber}</strong>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isDelivered
                              ? 'bg-[#3DDC97]/20 text-[#3DDC97] border border-[#3DDC97]/40'
                              : isRevision
                              ? 'bg-blue-950/70 text-blue-300 border border-blue-500/40'
                              : isExpired
                              ? 'bg-red-950/70 text-red-300 border border-red-500/40'
                              : 'bg-yellow-950/70 text-[#FFB020] border border-yellow-500/40'
                          }`}>
                            {ord.status === 'revision' ? 'Pago en Revisión' : ord.status}
                          </span>
                        </div>
                        <div className="text-xs text-[#FF8CC6] font-medium mt-0.5">{ord.productName}</div>
                      </div>

                      {/* Expiration or duration badge */}
                      {ord.expiresAt && (
                        <div className="text-right">
                          <span className="text-[11px] text-[#A394AE] block">Vence el:</span>
                          <span className={`text-xs font-bold ${isExpiringSoon ? 'text-[#FFB020]' : isExpired ? 'text-red-400' : 'text-white'}`}>
                            {new Date(ord.expiresAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* FULFILLMENT: STREAMING CREDENTIALS */}
                    {isDelivered && ord.assignedAccountEmail && (
                      <div className="p-4 rounded-xl bg-[#12091A] border border-[#FF2E93]/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Key className="w-3.5 h-3.5 text-[#FF2E93]" />
                            Tus Claves de Streaming
                          </span>
                          <span className="text-[11px] text-[#3DDC97] font-semibold">1 Pantalla Exclusiva</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {/* Email */}
                          <div className="p-2.5 rounded-lg bg-black/50 border border-white/5 flex items-center justify-between">
                            <div className="truncate mr-2">
                              <span className="text-[10px] text-gray-400 block">Correo / Usuario</span>
                              <span className="font-mono text-white font-semibold select-all">{ord.assignedAccountEmail}</span>
                            </div>
                            <button
                              onClick={() => copyText(ord.assignedAccountEmail || '', `mail-${ord.id}`)}
                              className="p-1 rounded text-[#FF8CC6] hover:bg-[#FF2E93] hover:text-white transition-colors"
                            >
                              {copiedKey === `mail-${ord.id}` ? <Check className="w-3.5 h-3.5 text-[#3DDC97]" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          {/* Password */}
                          <div className="p-2.5 rounded-lg bg-black/50 border border-white/5 flex items-center justify-between">
                            <div className="truncate mr-2">
                              <span className="text-[10px] text-gray-400 block">Contraseña</span>
                              <span className="font-mono text-white font-semibold">
                                {showPassword[ord.id] ? ord.assignedAccountPassword : '••••••••••••'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => togglePassword(ord.id)}
                                className="p-1 rounded text-gray-400 hover:text-white"
                              >
                                {showPassword[ord.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => copyText(ord.assignedAccountPassword || '', `pass-${ord.id}`)}
                                className="p-1 rounded text-[#FF8CC6] hover:bg-[#FF2E93] hover:text-white transition-colors"
                              >
                                {copiedKey === `pass-${ord.id}` ? <Check className="w-3.5 h-3.5 text-[#3DDC97]" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* Profile */}
                          <div className="p-2.5 rounded-lg bg-black/50 border border-white/5 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-gray-400 block">Perfil Asignado</span>
                              <span className="font-semibold text-[#FF8CC6]">{ord.assignedProfileName || 'Tu Perfil'}</span>
                            </div>
                          </div>

                          {/* PIN */}
                          <div className="p-2.5 rounded-lg bg-black/50 border border-white/5 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-gray-400 block">PIN de Perfil</span>
                              <span className="font-mono text-lg font-bold text-[#3DDC97] tracking-widest">{ord.assignedProfilePin}</span>
                            </div>
                            <button
                              onClick={() => copyText(ord.assignedProfilePin || '', `pin-${ord.id}`)}
                              className="p-1 rounded text-[#FF8CC6] hover:bg-[#FF2E93] hover:text-white transition-colors"
                            >
                              {copiedKey === `pin-${ord.id}` ? <Check className="w-3.5 h-3.5 text-[#3DDC97]" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* FULFILLMENT: DIGITAL PRODUCT (DRIVE / APK / MÉTODO) */}
                    {isDelivered && (ord.deliveredDownloadUrl || ord.productType === 'digital') && (
                      <div className="p-4 rounded-xl bg-gradient-to-r from-[#1A0B26] to-[#12091A] border border-[#3DDC97]/40 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <FolderDown className="w-4 h-4 text-[#3DDC97]" />
                            Enlace Oficial de Descarga & Acceso
                          </span>
                          <span className="text-[11px] text-[#3DDC97] font-bold">Acceso Otorgado</span>
                        </div>

                        <p className="text-xs text-[#C9C4D4]">
                          {ord.deliveredInstructions || 'Haz clic en el enlace para descargar tu archivo APK o ingresar a tu carpeta Google Drive VIP.'}
                        </p>

                        <div className="pt-1 flex items-center gap-2">
                          <a
                            href={ord.deliveredDownloadUrl || 'https://drive.google.com'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#3DDC97] hover:bg-[#2fc081] text-[#07040C] flex items-center justify-center gap-2 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            <span>Abrir Enlace de Descarga / Drive</span>
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Actions bar */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-white/5 pt-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {(isExpiringSoon || isExpired) ? (
                          <button
                            onClick={() => handleRenew(ord.id)}
                            className="py-1.5 px-3 rounded-lg text-xs font-bold neon-btn-primary flex items-center gap-1.5"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                            <span>Renovar este servicio</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#A394AE]">
                            {daysRemaining > 0 ? `Quedan ${daysRemaining} días de servicio` : 'Servicio activo'}
                          </span>
                        )}

                        {/* GARANTIA & REPORTAR FALLA BUTTON */}
                        {isDelivered && (
                          <button
                            onClick={() => setWarrantyModalOrderId(ord.id)}
                            className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-[#12091A] border border-[#FF2E93]/60 text-[#FF8CC6] hover:bg-[#FF2E93] hover:text-white flex items-center gap-1.5 shadow-[0_0_10px_rgba(255,46,147,0.2)] transition-all"
                            title="Reportar falla o solicitar reemplazo por garantía de 30 días"
                          >
                            <ShieldAlert className="w-3.5 h-3.5 text-[#FF2E93]" />
                            <span>Reportar Falla / Garantía</span>
                          </button>
                        )}
                      </div>

                      <a
                        href={`https://wa.me/${settings.whatsappSupport.replace(/\D/g, '')}?text=Hola%20JENYX%20✦%20tengo%20consulta%20de%20mi%20pedido%20${ord.orderNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#3DDC97] hover:underline flex items-center gap-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Soporte WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {showSpeiModal && (
        <SpeiPaymentModal
          onClose={() => setShowSpeiModal(false)}
          onSuccess={() => {
            setShowSpeiModal(false);
          }}
        />
      )}

      {warrantyModalOrderId !== null && (
        <WarrantyClaimModal
          preselectedOrderId={warrantyModalOrderId}
          onClose={() => setWarrantyModalOrderId(null)}
        />
      )}
    </div>
  );
};

