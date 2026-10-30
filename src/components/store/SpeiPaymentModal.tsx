import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { 
  X, 
  Copy, 
  Check, 
  Upload, 
  Building2, 
  Sparkles, 
  CheckCircle, 
  MessageCircle, 
  ShieldCheck, 
  AlertCircle, 
  Wallet,
  ArrowRight,
  Zap,
  Info
} from 'lucide-react';
import { PurchaseTicketModal } from '../common/PurchaseTicketModal';

interface SpeiPaymentModalProps {
  onClose: () => void;
  onSuccess?: (order: Order) => void;
  initialAmount?: number;
}

const PRESET_AMOUNTS = [50, 100, 150, 200, 500];

export const SpeiPaymentModal: React.FC<SpeiPaymentModalProps> = ({
  onClose,
  onSuccess,
  initialAmount = 100
}) => {
  const { settings, currentClient, createOrder } = useStore();

  const [selectedAmount, setSelectedAmount] = useState<number>(initialAmount);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);

  const [clientName, setClientName] = useState(currentClient?.name || '');
  const [clientWhatsApp, setClientWhatsApp] = useState(currentClient?.whatsapp || '');
  const [trackingFolio, setTrackingFolio] = useState('');
  
  const [receiptBase64, setReceiptBase64] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [showTicket, setShowTicket] = useState(false);

  // Generate a unique payment concept based on client's WhatsApp or random code
  const generatedConcept = React.useMemo(() => {
    const suffix = clientWhatsApp.replace(/\D/g, '').slice(-4) || Math.floor(1000 + Math.random() * 9000).toString();
    return `SPEI-JNX-${suffix}`;
  }, [clientWhatsApp]);

  const effectiveAmount = isCustom ? (parseFloat(customAmount) || 0) : selectedAmount;

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

    if (file.size > 6 * 1024 * 1024) {
      setErrorMsg('La imagen no debe superar los 6MB.');
      return;
    }

    setReceiptFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setReceiptBase64(reader.result as string);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setErrorMsg('Ingresa tu nombre completo.');
      return;
    }
    if (!clientWhatsApp.trim() || clientWhatsApp.replace(/\D/g, '').length < 8) {
      setErrorMsg('Ingresa un número de WhatsApp válido.');
      return;
    }
    if (effectiveAmount < 10) {
      setErrorMsg('El monto mínimo de recarga SPEI es de $10 MXN.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const order = createOrder({
        customerName: clientName.trim(),
        customerWhatsApp: clientWhatsApp.trim(),
        customerEmail: currentClient?.email || undefined,
        productName: `Recarga de Saldo Billetera JENYX ($${effectiveAmount} MXN)`,
        productType: 'digital',
        itemCategory: 'metodo',
        duration: 'Saldo Permanente',
        price: effectiveAmount,
        paymentMethod: 'transferencia',
        receiptUrl: receiptBase64 || undefined,
        receiptNote: trackingFolio.trim() ? `Rastreo: ${trackingFolio.trim()} | Concepto: ${generatedConcept}` : `Concepto: ${generatedConcept}`,
        notes: `Recarga de saldo por SPEI solicitada por ${clientName.trim()}`
      });

      setCompletedOrder(order);
      setSubmitting(false);
      if (onSuccess) onSuccess(order);
    } catch (err) {
      setErrorMsg('Error al registrar la solicitud de recarga. Intenta nuevamente.');
      setSubmitting(false);
    }
  };

  const openWhatsAppConfirmation = () => {
    const cleanPhone = settings.whatsappSupport.replace(/\D/g, '');
    const folioStr = completedOrder ? completedOrder.orderNumber : 'NUEVO';
    const message = encodeURIComponent(
      `Hola JENYX ✦\nAcabo de realizar una transferencia SPEI para recargar mi saldo:\n\n` +
      `• Folio de Solicitud: ${folioStr}\n` +
      `• Cliente: ${clientName || 'Cliente'}\n` +
      `• WhatsApp: ${clientWhatsApp}\n` +
      `• Monto: $${effectiveAmount} MXN\n` +
      `• Concepto Usado: ${generatedConcept}\n` +
      (trackingFolio ? `• Clave de Rastreo / Folio: ${trackingFolio}\n` : '') +
      `• Comprobante: ${receiptBase64 ? 'Adjunto en plataforma' : 'Te lo envío por aquí'}\n\n` +
      `¿Me ayudan a acreditar mi saldo en mi cuenta por favor?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
        <div className="relative w-full max-w-xl bg-[#12091A] border-2 border-[#FF2E93]/60 rounded-3xl shadow-[0_0_50px_rgba(255,46,147,0.35)] overflow-hidden">
          
          {/* Top Neon Bar */}
          <div className="h-2 w-full bg-gradient-to-r from-[#7A1236] via-[#FF2E93] to-[#3DDC97]" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-[#0B0612]/80 border border-[#FF2E93]/30 text-[#C9C4D4] hover:text-white hover:border-[#FF2E93] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {completedOrder ? (
            /* SUCCESS STATE */
            <div className="p-7 sm:p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#3DDC97]/20 border-2 border-[#3DDC97] text-[#3DDC97] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(61,220,151,0.5)]">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#3DDC97] flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#3DDC97]" />
                  ¡Comprobante SPEI Enviado a Revisión!
                </span>
                <h3 className="text-2xl font-bold font-cinzel text-white mt-1">
                  Folio: {completedOrder.orderNumber}
                </h3>
                <p className="text-xs text-[#C9C4D4] mt-2 max-w-md mx-auto">
                  Hemos registrado tu transferencia SPEI por <strong className="text-[#3DDC97]">${effectiveAmount} MXN</strong>.
                  El administrador validará el movimiento bancario y acreditará tu saldo de inmediato.
                </p>
              </div>

              {/* Order summary card */}
              <div className="p-4 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#A394AE]">Monto a Acreditar:</span>
                  <span className="font-extrabold text-[#3DDC97] text-sm">${effectiveAmount} MXN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A394AE]">Concepto Registrado:</span>
                  <span className="font-mono text-white">{generatedConcept}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A394AE]">Estado:</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-950 text-blue-300 border border-blue-500/40">
                    En Revisión Bancaria
                  </span>
                </div>
                {receiptBase64 && (
                  <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-[11px] text-[#3DDC97]">
                    <Check className="w-3.5 h-3.5" />
                    <span>Comprobante digital adjunto ({receiptFileName || 'imagen'})</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={openWhatsAppConfirmation}
                  className="py-3 px-4 rounded-xl font-bold text-xs tracking-wide bg-[#3DDC97] text-[#07040C] hover:bg-[#34c485] flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(61,220,151,0.3)]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Confirmar por WhatsApp</span>
                </button>

                <button
                  onClick={() => setShowTicket(true)}
                  className="py-3 px-4 rounded-xl font-bold text-xs tracking-wide bg-[#12091A] border-2 border-[#FF2E93] text-[#FF8CC6] hover:bg-[#FF2E93] hover:text-white flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(255,46,147,0.3)]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ver Ticket de Solicitud</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-[#A394AE] hover:text-white"
              >
                Cerrar y volver a la tienda
              </button>
            </div>
          ) : (
            /* SPEI RECHARGE & PAYMENT FORM */
            <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5 max-h-[85vh] overflow-y-auto">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF8CC6] flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#FF2E93]" />
                  ✦ Módulo de Pago y Recarga SPEI al Instante
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-white mt-1">
                  Acredita Saldo en tu Billetera JENYX
                </h2>
                <p className="text-xs text-[#A394AE] mt-1">
                  Transfiere desde tu banco a nuestra CLABE interbancaria. Una vez validado, tu saldo queda acreditado para comprar sin demoras.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1. SELECCIÓN DE MONTO */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#FF8CC6]">
                  1. Selecciona el Monto a Recargar
                </label>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {PRESET_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setIsCustom(false);
                      }}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                        !isCustom && selectedAmount === amt
                          ? 'bg-[#FF2E93] text-white border-[#FF8CC6] shadow-[0_0_15px_rgba(255,46,147,0.5)]'
                          : 'bg-[#0B0612] text-[#C9C4D4] border-white/10 hover:border-[#FF2E93]/50'
                      }`}
                    >
                      ${amt} MXN
                    </button>
                  ))}
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setIsCustom(true)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                      isCustom
                        ? 'bg-[#12091A] border-[#FF2E93] text-white'
                        : 'bg-[#0B0612] border-white/10 text-[#A394AE] hover:border-white/20'
                    }`}
                  >
                    <span>Otro monto personalizado (mínimo $10 MXN):</span>
                    {isCustom && (
                      <div className="flex items-center gap-1 font-mono font-bold text-[#FF8CC6]">
                        <span>$</span>
                        <input
                          type="number"
                          min="10"
                          step="5"
                          autoFocus
                          placeholder="Monto"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="w-24 px-2 py-1 rounded bg-black/60 border border-[#FF2E93] text-white text-xs focus:outline-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span>MXN</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* 2. DATOS BANCARIOS SPEI CON COPIADO RÁPIDO */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#FF8CC6]">
                  2. Transfiere a Nuestra Cuenta SPEI
                </label>

                <div className="p-4 rounded-2xl bg-[#0B0612] border border-[#FF2E93]/40 space-y-3">
                  {/* CLABE */}
                  <div className="flex items-center justify-between bg-black/50 p-2.5 rounded-xl border border-white/10">
                    <div>
                      <span className="text-[10px] text-[#A394AE] block">CLABE Interbancaria (18 dígitos)</span>
                      <strong className="font-mono text-sm sm:text-base text-white tracking-wider block">
                        {settings.payment.clabe}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(settings.payment.clabe, 'clabe')}
                      className="px-3 py-1.5 rounded-lg bg-[#FF2E93]/20 text-[#FF8CC6] hover:bg-[#FF2E93] hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
                    >
                      {copiedField === 'clabe' ? <Check className="w-3.5 h-3.5 text-[#3DDC97]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'clabe' ? '¡Copiada!' : 'Copiar'}</span>
                    </button>
                  </div>

                  {/* Banco & Beneficiario */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                      <span className="text-[10px] text-[#A394AE] block">Banco Receptor</span>
                      <strong className="text-white block">{settings.payment.bank}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                      <span className="text-[10px] text-[#A394AE] block">Beneficiario</span>
                      <strong className="text-white block truncate">{settings.payment.beneficiary}</strong>
                    </div>
                  </div>

                  {/* Concepto & Monto */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5">
                      <div>
                        <span className="text-[10px] text-[#A394AE] block">Concepto SPEI</span>
                        <strong className="font-mono text-xs text-[#FF8CC6]">{generatedConcept}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(generatedConcept, 'concept')}
                        className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-300"
                        title="Copiar concepto"
                      >
                        {copiedField === 'concept' ? <Check className="w-3 h-3 text-[#3DDC97]" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5">
                      <div>
                        <span className="text-[10px] text-[#A394AE] block">Monto a Transferir</span>
                        <strong className="font-bold text-sm text-[#3DDC97]">${effectiveAmount} MXN</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(effectiveAmount.toString(), 'amount')}
                        className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-300"
                        title="Copiar monto"
                      >
                        {copiedField === 'amount' ? <Check className="w-3 h-3 text-[#3DDC97]" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. TUS DATOS DE CLIENTE */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#FF8CC6]">
                  3. Datos de tu Cuenta JENYX
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Tu nombre completo *"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#FF2E93]"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="WhatsApp (10 dígitos) *"
                      value={clientWhatsApp}
                      onChange={(e) => setClientWhatsApp(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#FF2E93]"
                    />
                  </div>
                </div>
              </div>

              {/* 4. ADJUNTAR COMPROBANTE SPEI */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#FF8CC6] flex items-center justify-between">
                  <span>4. Adjunta Comprobante de Transferencia</span>
                  <span className="text-[10px] lowercase text-[#3DDC97]">(obligatorio para acreditar)</span>
                </label>

                {receiptBase64 ? (
                  <div className="relative p-3 rounded-2xl bg-[#0B0612] border border-[#3DDC97]/60 flex items-center gap-3">
                    <img
                      src={receiptBase64}
                      alt="Comprobante SPEI"
                      className="w-16 h-16 object-cover rounded-xl border border-white/20"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#3DDC97] flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Comprobante adjuntado con éxito
                      </div>
                      <p className="text-[11px] text-[#A394AE] truncate">{receiptFileName || 'Captura de transferencia SPEI'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setReceiptBase64(null);
                        setReceiptFileName('');
                      }}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-950/40"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block border-2 border-dashed border-[#FF2E93]/40 hover:border-[#FF2E93] rounded-2xl p-5 text-center bg-[#0B0612]/70 transition-all group">
                    <Upload className="w-7 h-7 text-[#FF8CC6] group-hover:scale-110 transition-transform mx-auto mb-1" />
                    <span className="text-xs font-bold text-white block">
                      Haz clic para subir la captura de pantalla o PDF del SPEI
                    </span>
                    <span className="text-[10px] text-[#A394AE] block mt-0.5">
                      Formatos soportados: JPG, PNG, WebP (Máx. 6MB)
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
                    placeholder="Clave de rastreo o folio bancario (opcional)"
                    value={trackingFolio}
                    onChange={(e) => setTrackingFolio(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0612] border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#FF2E93]"
                  />
                </div>
              </div>

              {/* BOTÓN DE ENVIAR SOLICITUD */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={submitting || effectiveAmount < 10}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-[#FF2E93] via-[#C2187A] to-[#3DDC97] text-white flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,46,147,0.5)] hover:opacity-95 transition-all disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span>
                    {submitting 
                      ? 'Registrando Solicitud SPEI...' 
                      : `✦ Enviar Comprobante y Solicitar Acreditación ($${effectiveAmount} MXN) ✦`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#A394AE]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3DDC97]" />
                  <span>Acreditación manual inmediata por el administrador de JENYX</span>
                </div>
              </div>

            </form>
          )}

        </div>
      </div>

      {showTicket && completedOrder && (
        <PurchaseTicketModal
          order={completedOrder}
          onClose={() => setShowTicket(false)}
        />
      )}
    </>
  );
};
