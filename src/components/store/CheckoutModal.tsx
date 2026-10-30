import React, { useState } from 'react';
import { Product, PaymentMethod, Order } from '../../types';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Copy, 
  Check, 
  Upload, 
  CreditCard, 
  Building2, 
  Store, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  Wallet,
  Zap,
  Key,
  FolderDown,
  Sparkles
} from 'lucide-react';
import { PurchaseTicketModal } from '../common/PurchaseTicketModal';
import { SpeiPaymentModal } from './SpeiPaymentModal';

interface CheckoutModalProps {
  product: Product;
  onClose: () => void;
  onSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  product,
  onClose,
  onSuccess
}) => {
  const { settings, createOrder, currentClient } = useStore();

  const clientBalance = currentClient?.balance || 0;
  const canPayWithBalance = currentClient && clientBalance >= product.price;

  const [customerName, setCustomerName] = useState(currentClient?.name || '');
  const [customerWhatsApp, setCustomerWhatsApp] = useState(currentClient?.whatsapp || '');
  const [customerEmail, setCustomerEmail] = useState(currentClient?.email || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    canPayWithBalance ? 'saldo' : 'transferencia'
  );
  const [receiptBase64, setReceiptBase64] = useState<string | null>(null);
  const [receiptNote, setReceiptNote] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [showTicket, setShowTicket] = useState(false);
  const [showSpeiTopUp, setShowSpeiTopUp] = useState(false);

  const speiConcept = React.useMemo(() => {
    return `JNX-${product.id.replace(/\D/g, '').slice(0, 4) || '7799'}`;
  }, [product.id]);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Por favor selecciona una imagen válida (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('La imagen no debe pesar más de 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setReceiptBase64(reader.result as string);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMsg('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!customerWhatsApp.trim() || customerWhatsApp.replace(/\D/g, '').length < 8) {
      setErrorMsg('Ingresa un número de WhatsApp válido para enviarte el acceso.');
      return;
    }

    if (paymentMethod === 'saldo' && (!currentClient || clientBalance < product.price)) {
      setErrorMsg(`Saldo insuficiente ($${clientBalance} MXN). Por favor selecciona SPEI o WhatsApp.`);
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const order = createOrder({
        customerName: customerName.trim(),
        customerWhatsApp: customerWhatsApp.trim(),
        customerEmail: customerEmail.trim() || undefined,
        productId: product.id,
        productName: product.name,
        productType: product.type,
        itemCategory: product.itemCategory,
        categoryId: product.categoryId,
        categoryName: product.categoryName,
        duration: product.duration,
        price: product.price,
        paymentMethod,
        receiptUrl: receiptBase64 || undefined,
        receiptNote: receiptNote.trim() || undefined,
      });

      setCompletedOrder(order);
      setSubmitting(false);
      onSuccess(order);
    } catch (err) {
      setErrorMsg('Error al procesar el pedido. Intenta nuevamente.');
      setSubmitting(false);
    }
  };

  // WhatsApp instant order message
  const openWhatsAppInstant = () => {
    const cleanPhone = settings.whatsappSupport.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Hola JENYX ✦\nQuiero pagar al instante mi pedido de:\n• Producto: ${product.name}\n• Precio: $${product.price} MXN\n• Mi Nombre: ${customerName || 'Cliente'}\n• Mi WhatsApp: ${customerWhatsApp || ''}\n¿Me comparten datos para pago o confirmación?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
        <div className="relative w-full max-w-xl bg-[#12091A] border-2 border-[#FF2E93]/40 rounded-3xl shadow-[0_0_50px_rgba(255,46,147,0.35)] overflow-hidden">
          {/* Top neon strip */}
          <div className="h-2 w-full bg-gradient-to-r from-[#7A1236] via-[#FF2E93] to-[#FF8CC6]" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-[#0B0612]/80 border border-[#FF2E93]/30 text-[#C9C4D4] hover:text-white hover:border-[#FF2E93] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {completedOrder ? (
            /* SUCCESS STATE */
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#3DDC97]/20 border-2 border-[#3DDC97] text-[#3DDC97] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(61,220,151,0.5)]">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF8CC6] flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#3DDC97]" />
                  {completedOrder.status === 'aprobado'
                    ? '¡Pago Aprobado & Entrega Inmediata!'
                    : '¡Pedido Recibido con Éxito!'}
                </span>
                <h3 className="text-2xl font-bold font-cinzel text-white mt-1">
                  Folio: {completedOrder.orderNumber}
                </h3>
                <p className="text-xs text-[#C9C4D4] mt-2 max-w-md mx-auto">
                  {completedOrder.status === 'aprobado'
                    ? 'Tu compra ha sido pagada con tu saldo y tus credenciales han sido generadas al instante.'
                    : receiptBase64 
                      ? 'Hemos recibido tu comprobante de pago. Tu pedido se encuentra en "Revisión" y será activado en breve.'
                      : 'Tu pedido está registrado. Recuerda adjuntar tu comprobante o enviarlo por WhatsApp para recibir tus credenciales.'}
                </p>
              </div>

              {/* Instant Delivery Credentials (If paid with balance) */}
              {completedOrder.status === 'aprobado' && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#7A1236]/30 to-[#12091A] border border-[#3DDC97]/50 text-left text-xs space-y-2">
                  <div className="font-bold text-[#3DDC97] flex items-center gap-1.5 text-xs">
                    <Zap className="w-4 h-4" />
                    <span>Tus Accesos Activos:</span>
                  </div>

                  {completedOrder.assignedAccountEmail && (
                    <div className="p-2.5 rounded-lg bg-black/50 border border-white/5 space-y-1 font-mono text-[11px]">
                      <div><span className="text-[#A394AE]">Cuenta:</span> <strong className="text-white">{completedOrder.assignedAccountEmail}</strong></div>
                      <div><span className="text-[#A394AE]">Contraseña:</span> <strong className="text-[#FF8CC6]">{completedOrder.assignedAccountPassword || '••••••••'}</strong></div>
                      <div><span className="text-[#A394AE]">Perfil:</span> <strong className="text-[#3DDC97]">{completedOrder.assignedProfileName || 'Perfil 1'}</strong></div>
                      <div><span className="text-[#A394AE]">PIN de pantalla:</span> <strong className="text-[#00F0FF] font-bold">{completedOrder.assignedProfilePin || '0000'}</strong></div>
                    </div>
                  )}

                  {completedOrder.deliveredDownloadUrl && (
                    <div className="p-2.5 rounded-lg bg-black/50 border border-white/5 space-y-1">
                      <span className="text-[#A394AE] block text-[10px]">Enlace de Descarga / Google Drive:</span>
                      <a href={completedOrder.deliveredDownloadUrl} target="_blank" rel="noopener noreferrer" className="text-[#3DDC97] underline break-all">
                        {completedOrder.deliveredDownloadUrl}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Summary Card */}
              <div className="p-4 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#A394AE]">Producto:</span>
                  <span className="font-semibold text-white">{completedOrder.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A394AE]">Monto:</span>
                  <span className="font-bold text-[#FF8CC6]">${completedOrder.price} MXN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A394AE]">Método:</span>
                  <span className="uppercase text-white font-medium">{completedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-white/5">
                  <span className="text-[#A394AE]">Estado:</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                    completedOrder.status === 'aprobado'
                      ? 'bg-emerald-950 text-[#3DDC97] border border-[#3DDC97]/40'
                      : 'bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/40'
                  }`}>
                    {completedOrder.status === 'aprobado' ? 'Aprobado & Entregado' : 'Pago en Revisión'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setShowTicket(true)}
                  className="py-3 px-4 rounded-xl font-bold text-xs tracking-wide bg-[#12091A] border-2 border-[#FF2E93] text-[#FF8CC6] hover:bg-[#FF2E93] hover:text-white flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(255,46,147,0.3)]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ver Ticket Digital</span>
                </button>

                <a
                  href={`https://wa.me/${settings.whatsappSupport.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hola JENYX ✦\nAcabo de realizar el pedido:\n• Folio: ${completedOrder.orderNumber}\n• Producto: ${completedOrder.productName}\n• Monto: $${completedOrder.price} MXN\n• Método: ${completedOrder.paymentMethod.toUpperCase()}\n• Cliente: ${completedOrder.customerName}\n• WhatsApp: ${completedOrder.customerWhatsApp}\n${receiptBase64 ? '✓ Comprobante de transferencia adjunto en plataforma' : 'Te comparto el comprobante por este medio.'}\n\n¿Me confirman la entrega/activación por favor?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl font-bold text-xs tracking-wide bg-[#3DDC97] text-[#07040C] hover:bg-[#34c485] flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(61,220,151,0.3)]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Notificar por WhatsApp</span>
                </a>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-[#A394AE] hover:text-white"
              >
                Cerrar y volver a la tienda
              </button>
            </div>
          ) : (
            /* CHECKOUT FORM */
            <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5 max-h-[85vh] overflow-y-auto">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#FF8CC6]">
                    ✦ Finalizar Compra
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-white mt-1">
                  {product.name}
                </h2>
                <div className="flex items-center justify-between text-xs text-[#A394AE] mt-1">
                  <span>Duración: {product.duration}</span>
                  <span className="text-base font-extrabold text-[#FF8CC6]">${product.price} MXN</span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Customer Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#FF8CC6]">
                  1. Tus Datos de Entrega
                </h4>
                <div>
                  <label className="block text-xs text-[#C9C4D4] mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Mariana Reyes"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2E93] text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#C9C4D4] mb-1">WhatsApp de contacto *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej. +52 55 1234 5678"
                      value={customerWhatsApp}
                      onChange={(e) => setCustomerWhatsApp(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2E93] text-xs"
                    />
                    <span className="text-[10px] text-[#A394AE]">Aquí recibirás tus accesos y comprobante.</span>
                  </div>
                  <div>
                    <label className="block text-xs text-[#C9C4D4] mb-1">Correo Electrónico (Opcional)</label>
                    <input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2E93] text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#FF8CC6]">
                    2. Selecciona Método de Pago
                  </h4>
                  {currentClient && (
                    <span className="text-[11px] text-[#3DDC97] font-semibold flex items-center gap-1">
                      <Wallet className="w-3.5 h-3.5" />
                      Saldo: ${clientBalance} MXN
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* Billetera Saldo */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('saldo')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      paymentMethod === 'saldo'
                        ? 'bg-[#3DDC97]/20 border-[#3DDC97] shadow-[0_0_12px_rgba(61,220,151,0.4)]'
                        : canPayWithBalance
                          ? 'bg-[#12091A] border-[#3DDC97]/40 hover:border-[#3DDC97]'
                          : 'bg-[#0B0612] border-white/5 opacity-70'
                    }`}
                  >
                    <Wallet className={`w-4 h-4 mb-1 ${paymentMethod === 'saldo' ? 'text-[#3DDC97]' : 'text-gray-400'}`} />
                    <div className="text-xs font-bold text-white">Mi Saldo</div>
                    <div className="text-[10px] text-[#3DDC97] font-semibold">${clientBalance} MXN</div>
                  </button>

                  {/* SPEI Instantáneo */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('transferencia')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      paymentMethod === 'transferencia'
                        ? 'bg-[#FF2E93]/20 border-[#FF2E93] shadow-[0_0_12px_rgba(255,46,147,0.4)]'
                        : 'bg-[#0B0612] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <Building2 className={`w-4 h-4 mb-1 ${paymentMethod === 'transferencia' ? 'text-[#FF2E93]' : 'text-gray-400'}`} />
                    <div className="text-xs font-semibold text-white">SPEI / BBVA</div>
                    <div className="text-[10px] text-[#A394AE]">Al Instante</div>
                  </button>

                  {/* Vía WhatsApp */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('whatsapp')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      paymentMethod === 'whatsapp'
                        ? 'bg-[#3DDC97]/20 border-[#3DDC97] shadow-[0_0_12px_rgba(61,220,151,0.4)]'
                        : 'bg-[#0B0612] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <MessageCircle className={`w-4 h-4 mb-1 ${paymentMethod === 'whatsapp' ? 'text-[#3DDC97]' : 'text-gray-400'}`} />
                    <div className="text-xs font-semibold text-white">Vía WhatsApp</div>
                    <div className="text-[10px] text-[#A394AE]">Chat directo</div>
                  </button>

                  {/* OXXO Pay */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('oxxo')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      paymentMethod === 'oxxo'
                        ? 'bg-[#FF2E93]/20 border-[#FF2E93] shadow-[0_0_12px_rgba(255,46,147,0.4)]'
                        : 'bg-[#0B0612] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <Store className={`w-4 h-4 mb-1 ${paymentMethod === 'oxxo' ? 'text-[#FF2E93]' : 'text-gray-400'}`} />
                    <div className="text-xs font-semibold text-white">OXXO Pay</div>
                    <div className="text-[10px] text-[#A394AE]">Efectivo</div>
                  </button>
                </div>

                {/* DYNAMIC PAYMENT METHOD INSTRUCTIONS */}
                <div className="p-4 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 space-y-3">
                  
                  {/* OPTION 1: SALDO DISPONIBLE */}
                  {paymentMethod === 'saldo' && (
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white flex items-center gap-1.5 text-[#3DDC97]">
                          <Zap className="w-4 h-4" /> Pago Instantáneo con Saldo JENYX
                        </span>
                        <span className="text-xs font-bold text-white">Total: ${product.price} MXN</span>
                      </div>

                      {canPayWithBalance ? (
                        <div className="p-3 rounded-lg bg-emerald-950/40 border border-[#3DDC97]/40 text-emerald-200 text-xs space-y-1">
                          <p className="font-semibold text-white">✓ Tienes saldo suficiente para pagar esta compra.</p>
                          <p className="text-[11px] text-[#C9C4D4]">
                            Se descontarán <strong>${product.price} MXN</strong> de tus <strong>${clientBalance} MXN</strong>. Tu entrega será automática e inmediata.
                          </p>
                        </div>
                      ) : (
                        <div className="p-3.5 rounded-xl bg-yellow-950/40 border border-[#FFB020]/40 text-yellow-200 text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">Saldo insuficiente (${clientBalance} MXN disponible).</span>
                            <span className="text-[11px] text-[#FF8CC6] font-mono">Faltan ${product.price - clientBalance} MXN</span>
                          </div>
                          <p className="text-[11px] text-[#C9C4D4]">
                            Puedes recargar saldo a tu cuenta vía SPEI y pagar al instante, o continuar con transferencia directa.
                          </p>
                          <button
                            type="button"
                            onClick={() => setShowSpeiTopUp(true)}
                            className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-[#FF2E93] to-[#3DDC97] text-[#07040C] font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(255,46,147,0.3)]"
                          >
                            <Zap className="w-3.5 h-3.5 text-black" />
                            <span>⚡ Recargar Saldo con SPEI Ahora</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* OPTION 2: SPEI AL INSTANTE */}
                  {paymentMethod === 'transferencia' && (
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[#A394AE]">Transferencia Interbancaria SPEI:</span>
                        <span className="text-white font-bold text-sm text-[#3DDC97]">Total: ${product.price} MXN</span>
                      </div>

                      <div className="space-y-2">
                        {/* CLABE */}
                        <div className="flex items-center justify-between bg-black/50 p-2.5 rounded-lg border border-white/5">
                          <div>
                            <div className="text-[10px] text-[#A394AE]">CLABE Interbancaria (18 dígitos)</div>
                            <div className="font-mono font-bold text-white text-sm tracking-wider">{settings.payment.clabe}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(settings.payment.clabe, 'clabe')}
                            className="px-2.5 py-1 rounded bg-[#FF2E93]/20 text-[#FF8CC6] hover:bg-[#FF2E93] hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                          >
                            {copiedField === 'clabe' ? <Check className="w-3.5 h-3.5 text-[#3DDC97]" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedField === 'clabe' ? 'Copiado' : 'Copiar CLABE'}</span>
                          </button>
                        </div>

                        {/* Concepto y Monto */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex items-center justify-between bg-black/50 p-2 rounded-lg border border-white/5">
                            <div>
                              <div className="text-[10px] text-[#A394AE]">Concepto sugerido:</div>
                              <div className="font-mono font-bold text-[#FF8CC6] text-xs">{speiConcept}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(speiConcept, 'concept')}
                              className="px-2 py-1 rounded bg-white/5 text-[#C9C4D4] hover:text-white transition-colors flex items-center gap-1 text-[10px]"
                            >
                              {copiedField === 'concept' ? <Check className="w-3 h-3 text-[#3DDC97]" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedField === 'concept' ? 'Copiado' : 'Copiar'}</span>
                            </button>
                          </div>

                          <div className="flex items-center justify-between bg-black/50 p-2 rounded-lg border border-white/5">
                            <div>
                              <div className="text-[10px] text-[#A394AE]">Monto Exacto:</div>
                              <div className="font-mono font-bold text-[#3DDC97] text-sm">${product.price} MXN</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(product.price.toString(), 'price')}
                              className="px-2 py-1 rounded bg-white/5 text-[#C9C4D4] hover:text-white transition-colors flex items-center gap-1 text-[10px]"
                            >
                              {copiedField === 'price' ? <Check className="w-3 h-3 text-[#3DDC97]" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedField === 'price' ? 'Copiado' : 'Copiar'}</span>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-[#C9C4D4] pt-1">
                          <div>Banco: <strong className="text-white">{settings.payment.bank}</strong></div>
                          <div>Beneficiario: <strong className="text-white">{settings.payment.beneficiary}</strong></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OPTION 3: VÍA WHATSAPP */}
                  {paymentMethod === 'whatsapp' && (
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white flex items-center gap-1.5 text-[#3DDC97]">
                          <MessageCircle className="w-4 h-4" /> Pago y Activación por WhatsApp
                        </span>
                        <span className="text-xs font-bold text-white">${product.price} MXN</span>
                      </div>
                      <p className="text-[11px] text-[#C9C4D4]">
                        ¿Prefieres pagar por WhatsApp o requieres asistencia personalizada? Haz clic en el botón para chatear con soporte de JENYX y coordinar tu pago.
                      </p>
                      <button
                        type="button"
                        onClick={openWhatsAppInstant}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#3DDC97] text-[#07040C] flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(61,220,151,0.3)] hover:bg-[#34c485]"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Abrir Chat de WhatsApp para Pagar</span>
                      </button>
                    </div>
                  )}

                  {/* OPTION 4: OXXO */}
                  {paymentMethod === 'oxxo' && (
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-lg border border-white/5">
                        <div>
                          <div className="text-[10px] text-[#A394AE]">Número de Tarjeta para depósito OXXO</div>
                          <div className="font-mono font-bold text-white text-sm">{settings.payment.oxxoCardNumber}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(settings.payment.oxxoCardNumber, 'oxxo')}
                          className="px-2.5 py-1 rounded bg-[#FF2E93]/20 text-[#FF8CC6] hover:bg-[#FF2E93] hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                        >
                          {copiedField === 'oxxo' ? <Check className="w-3.5 h-3.5 text-[#3DDC97]" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedField === 'oxxo' ? 'Copiado' : 'Copiar'}</span>
                        </button>
                      </div>
                      <div className="text-[11px] text-[#C9C4D4]">
                        Beneficiario: <strong className="text-white">{settings.payment.oxxoBeneficiary}</strong>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Voucher / Receipt Upload (Only needed if NOT paying with balance) */}
              {paymentMethod !== 'saldo' && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#FF8CC6] flex items-center justify-between">
                    <span>3. Adjuntar Comprobante de Pago</span>
                    <span className="text-[10px] lowercase text-[#A394AE]">(puedes subirlo ahora o después)</span>
                  </h4>

                  {receiptBase64 ? (
                    <div className="relative p-3 rounded-xl bg-[#0B0612] border border-[#3DDC97]/50 flex items-center gap-3">
                      <img
                        src={receiptBase64}
                        alt="Comprobante subido"
                        className="w-16 h-16 object-cover rounded-lg border border-white/20"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-[#3DDC97] flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Comprobante adjuntado
                        </div>
                        <p className="text-[11px] text-[#A394AE] truncate">Listo para verificación por el panel.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setReceiptBase64(null)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-950/40"
                        title="Eliminar comprobante"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block border-2 border-dashed border-[#FF2E93]/30 hover:border-[#FF2E93]/70 rounded-xl p-4 text-center bg-[#0B0612]/60 transition-colors">
                      <Upload className="w-6 h-6 text-[#FF8CC6] mx-auto mb-1" />
                      <span className="text-xs font-medium text-white block">
                        Haz clic para subir foto o captura de pantalla
                      </span>
                      <span className="text-[10px] text-[#A394AE] block mt-0.5">
                        JPG, PNG o WebP (Máx. 5MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  )}

                  <div>
                    <input
                      type="text"
                      placeholder="Número de folio o referencia de pago (opcional)"
                      value={receiptNote}
                      onChange={(e) => setReceiptNote(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0B0612] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2E93]"
                    />
                  </div>
                </div>
              )}

              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting || (paymentMethod === 'saldo' && !canPayWithBalance)}
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'saldo' && canPayWithBalance
                      ? 'bg-[#3DDC97] text-[#07040C] shadow-[0_0_20px_rgba(61,220,151,0.5)] hover:bg-[#34c485]'
                      : 'neon-btn-primary shadow-[0_0_20px_rgba(255,46,147,0.5)]'
                  } disabled:opacity-50`}
                >
                  <span>
                    {submitting 
                      ? 'Procesando...' 
                      : paymentMethod === 'saldo' && canPayWithBalance
                        ? `✦ Pagar al Instante con mi Saldo ($${product.price} MXN) ✦`
                        : `Confirmar Pedido ($${product.price} MXN)`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#A394AE] mt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3DDC97]" />
                  <span>Garantía JENYX: Activación y soporte prioritario</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Ticket Modal if triggered */}
      {showTicket && completedOrder && (
        <PurchaseTicketModal
          order={completedOrder}
          onClose={() => setShowTicket(false)}
        />
      )}

      {/* SPEI Top-Up Modal */}
      {showSpeiTopUp && (
        <SpeiPaymentModal
          initialAmount={Math.max(50, Math.ceil(product.price - clientBalance))}
          onClose={() => setShowSpeiTopUp(false)}
          onSuccess={() => {
            setShowSpeiTopUp(false);
          }}
        />
      )}
    </>
  );
};
