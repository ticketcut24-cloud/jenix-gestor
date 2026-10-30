import React, { useState } from 'react';
import { Order } from '../../types';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  MessageCircle, 
  Tv, 
  Smartphone, 
  HardDrive, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  Moon, 
  Key, 
  Calendar,
  Lock,
  Download
} from 'lucide-react';

interface PurchaseTicketModalProps {
  order: Order;
  onClose: () => void;
}

export const PurchaseTicketModal: React.FC<PurchaseTicketModalProps> = ({ order, onClose }) => {
  const { settings } = useStore();
  const [copied, setCopied] = useState(false);

  const cleanPhone = order.customerWhatsApp.replace(/\D/g, '');

  // Format clean WhatsApp message ticket
  const generateTicketText = () => {
    let credentialsText = '';
    if (order.status === 'aprobado' || order.status === 'entregado') {
      if (order.assignedAccountEmail) {
        credentialsText += `\n🔐 *ACCESOS DE STREAMING:*\n• Correo/Usuario: ${order.assignedAccountEmail}\n• Contraseña: ${order.assignedAccountPassword || '••••••••'}\n• Perfil asignado: ${order.assignedProfileName || 'Perfil'}\n• PIN de pantalla: ${order.assignedProfilePin || '0000'}`;
      }
      if (order.deliveredDownloadUrl) {
        credentialsText += `\n📥 *ENLACE DE DESCARGA / VIP:*\n${order.deliveredDownloadUrl}`;
      }
      if (order.deliveredInstructions) {
        credentialsText += `\n📋 *Instrucciones:* ${order.deliveredInstructions}`;
      }
    } else {
      credentialsText += `\n⏳ *Estado:* En validación de comprobante. En breve recibirás tus accesos.`;
    }

    return `✦ ─────────────────────── ✦
*${settings.businessName}*
_${settings.motto}_
✦ ─────────────────────── ✦

🧾 *TICKET DE COMPRA DIGITAL*
• *Folio:* ${order.orderNumber}
• *Fecha:* ${new Date(order.createdAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
• *Cliente:* ${order.customerName}
• *WhatsApp:* ${order.customerWhatsApp}

🛍️ *DETALLE DEL PEDIDO:*
• *Producto:* ${order.productName}
• *Duración:* ${order.duration}
• *Total Pagado:* $${order.price} MXN
• *Método de Pago:* ${order.paymentMethod.toUpperCase()}
• *Vigencia:* ${order.expiresAt ? new Date(order.expiresAt).toLocaleDateString('es-MX') : '30 Días Garantizados'}
${credentialsText}

🛡️ *Garantía JENYX:* Servicio 100% garantizado con soporte los 7 días.
📲 *Soporte Oficial:* ${settings.whatsappSupport}
✦ ─────────────────────── ✦
¡Gracias por tu preferencia!`;
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generateTicketText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(generateTicketText());
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#12091A] border-2 border-[#FF2E93]/40 rounded-3xl shadow-[0_0_50px_rgba(255,46,147,0.35)] overflow-hidden">
        
        {/* Top Header decoration */}
        <div className="h-2 w-full bg-gradient-to-r from-[#7A1236] via-[#FF2E93] to-[#FF8CC6]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#0B0612]/80 border border-[#FF2E93]/30 text-[#C9C4D4] hover:text-white hover:border-[#FF2E93] transition-colors print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
          
          {/* Printable Ticket Body */}
          <div className="p-6 rounded-2xl bg-[#0B0612] border border-[#FF2E93]/30 text-[#FBEFF6] space-y-5 shadow-inner">
            
            {/* Ticket Header */}
            <div className="text-center pb-4 border-b border-dashed border-[#FF2E93]/40 space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full p-0.5 bg-gradient-to-b from-[#FF2E93] to-[#7A1236] shadow-[0_0_15px_rgba(255,46,147,0.5)]">
                <img
                  src={settings.logoUrl || '/assets/aistudio/jenix_4fac0935.jpeg'}
                  alt="JENYX"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h3 className="font-cinzel text-2xl font-black text-white tracking-widest">
                {settings.businessName}
              </h3>
              <p className="text-xs text-[#FF8CC6] tracking-wide">
                {settings.motto}
              </p>
              <div className="inline-block px-3 py-0.5 rounded-full bg-[#12091A] border border-[#FF2E93]/40 text-[11px] font-bold text-white tracking-widest uppercase">
                ✦ Ticket de Compra Digital ✦
              </div>
            </div>

            {/* Folio & Date */}
            <div className="grid grid-cols-2 gap-2 text-xs py-1 border-b border-white/5">
              <div>
                <span className="text-[#A394AE] block text-[10px] uppercase">Folio de Venta:</span>
                <span className="font-bold text-[#FF8CC6] text-sm">{order.orderNumber}</span>
              </div>
              <div className="text-right">
                <span className="text-[#A394AE] block text-[10px] uppercase">Fecha y Hora:</span>
                <span className="font-medium text-white">
                  {new Date(order.createdAt).toLocaleDateString('es-MX', {
                    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            {/* Customer Details */}
            <div className="p-3 rounded-xl bg-[#12091A]/80 border border-white/5 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#A394AE]">Cliente:</span>
                <span className="font-bold text-white">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A394AE]">WhatsApp:</span>
                <span className="font-semibold text-[#3DDC97]">{order.customerWhatsApp}</span>
              </div>
              {order.customerEmail && (
                <div className="flex justify-between">
                  <span className="text-[#A394AE]">Correo:</span>
                  <span className="text-gray-300">{order.customerEmail}</span>
                </div>
              )}
            </div>

            {/* Product & Payment Summary */}
            <div className="space-y-2 border-t border-b border-dashed border-[#FF2E93]/40 py-3 text-xs">
              <div className="flex justify-between font-semibold text-white">
                <span className="truncate pr-2">{order.productName}</span>
                <span className="text-[#FF8CC6] font-bold whitespace-nowrap">${order.price} MXN</span>
              </div>
              <div className="flex justify-between text-[#A394AE] text-[11px]">
                <span>Duración / Paquete:</span>
                <span>{order.duration}</span>
              </div>
              <div className="flex justify-between text-[#A394AE] text-[11px]">
                <span>Método de Pago:</span>
                <span className="uppercase text-white font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-[#A394AE] text-[11px]">
                <span>Estado:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  order.status === 'aprobado' || order.status === 'entregado'
                    ? 'bg-emerald-950 text-[#3DDC97] border border-[#3DDC97]/40'
                    : 'bg-yellow-950 text-[#FFB020] border border-[#FFB020]/40'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Credentials / Delivery Info */}
            {(order.status === 'aprobado' || order.status === 'entregado') && (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#7A1236]/30 to-[#12091A] border border-[#FF2E93]/40 space-y-2 text-xs">
                <div className="font-bold text-white flex items-center gap-1.5 text-xs text-[#FF8CC6]">
                  <Key className="w-3.5 h-3.5 text-[#FF2E93]" />
                  <span>Accesos y Credenciales Entregadas:</span>
                </div>

                {order.assignedAccountEmail && (
                  <div className="space-y-1 font-mono text-[11px] bg-black/40 p-2.5 rounded-lg border border-white/5">
                    <div><span className="text-[#A394AE]">Cuenta/Usuario:</span> <strong className="text-white">{order.assignedAccountEmail}</strong></div>
                    <div><span className="text-[#A394AE]">Contraseña:</span> <strong className="text-[#FF8CC6]">{order.assignedAccountPassword || '••••••••'}</strong></div>
                    <div><span className="text-[#A394AE]">Perfil Asignado:</span> <strong className="text-[#3DDC97]">{order.assignedProfileName || 'Perfil 1'}</strong></div>
                    <div><span className="text-[#A394AE]">PIN de Pantalla:</span> <strong className="text-[#00F0FF] text-xs font-bold">{order.assignedProfilePin || '0000'}</strong></div>
                  </div>
                )}

                {order.deliveredDownloadUrl && (
                  <div className="space-y-1 font-mono text-[11px] bg-black/40 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[#A394AE] block">Enlace de Descarga / Carpeta VIP:</span>
                    <a href={order.deliveredDownloadUrl} target="_blank" rel="noopener noreferrer" className="text-[#3DDC97] break-all underline">
                      {order.deliveredDownloadUrl}
                    </a>
                  </div>
                )}

                {order.expiresAt && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#A394AE] pt-1">
                    <Calendar className="w-3.5 h-3.5 text-[#3DDC97]" />
                    <span>Vencimiento: <strong className="text-white">{new Date(order.expiresAt).toLocaleDateString('es-MX')}</strong></span>
                  </div>
                )}
              </div>
            )}

            {/* Footer Guarantee */}
            <div className="text-center text-[10px] text-[#A394AE] space-y-1 pt-2 border-t border-dashed border-white/10">
              <div className="flex items-center justify-center gap-1 text-[#3DDC97] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Garantía JENYX &bull; Soporte 24/7 en WhatsApp</span>
              </div>
              <p>Guarda este comprobante o consulta tu folio en cualquier momento.</p>
            </div>

          </div>

          {/* Action Buttons (Hidden when printing) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 print:hidden">
            <button
              onClick={handleSendWhatsApp}
              className="py-3 px-4 rounded-xl text-xs font-bold bg-[#3DDC97] text-[#07040C] hover:bg-[#34c485] shadow-[0_0_15px_rgba(61,220,151,0.4)] flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enviar WhatsApp</span>
            </button>

            <button
              onClick={handleCopyText}
              className="py-3 px-4 rounded-xl text-xs font-bold bg-[#12091A] border border-[#FF2E93]/40 text-[#FF8CC6] hover:bg-[#FF2E93]/20 flex items-center justify-center gap-2 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-[#3DDC97]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="py-3 px-4 rounded-xl text-xs font-semibold bg-[#0B0612] border border-white/10 text-white hover:border-[#FF2E93] flex items-center justify-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4 text-[#FF8CC6]" />
              <span>Imprimir / PDF</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
