import React from 'react';
import { Product, StreamingAccount } from '../../types';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Users, 
  Tv, 
  Lock,
  ArrowRight,
  Smartphone,
  HardDrive,
  FileText,
  FolderDown
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  accounts: StreamingAccount[];
  onClose: () => void;
  onBuy: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  accounts,
  onClose,
  onBuy
}) => {
  // Calculate free profiles available for this category
  const matchingAccounts = accounts.filter(a => a.categoryId === product.categoryId && a.status === 'activa');
  let freeProfilesCount = 0;
  matchingAccounts.forEach(acc => {
    acc.profiles.forEach(p => {
      if (p.status === 'libre') freeProfilesCount++;
    });
  });

  const isProfile = product.type === 'perfil';
  const isDigital = product.type === 'digital' || product.itemCategory === 'apk' || product.itemCategory === 'drive' || product.itemCategory === 'metodo';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#12091A] border border-[#FF2E93]/40 rounded-2xl shadow-[0_0_40px_rgba(255,46,147,0.3)] overflow-hidden">
        {/* Header decoration */}
        <div className="h-2 w-full bg-gradient-to-r from-[#7A1236] via-[#FF2E93] to-[#FF8CC6]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#0B0612]/80 border border-[#FF2E93]/30 text-[#C9C4D4] hover:text-white hover:border-[#FF2E93] transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
          {/* Badge & Category */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#FF2E93]/20 border border-[#FF2E93]/50 text-[#FF8CC6] flex items-center gap-1.5">
              {isDigital ? (
                product.itemCategory === 'apk' ? <Smartphone className="w-3.5 h-3.5 text-[#3DDC97]" /> :
                product.itemCategory === 'drive' ? <HardDrive className="w-3.5 h-3.5 text-blue-400" /> :
                <FileText className="w-3.5 h-3.5 text-[#FFB020]" />
              ) : <Tv className="w-3.5 h-3.5 text-[#FF2E93]" />}
              <span>{product.categoryName || 'Streaming'}</span>
            </span>

            {product.badge && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[#FF2E93] to-[#C2187A] text-white shadow-[0_0_10px_rgba(255,46,147,0.4)]">
                {product.badge}
              </span>
            )}

            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isDigital
                ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-700/40'
                : isProfile 
                  ? 'bg-purple-950/70 text-purple-300 border border-purple-700/40' 
                  : 'bg-pink-950/70 text-pink-300 border border-pink-700/40'
            }`}>
              {isDigital 
                ? (product.itemCategory === 'apk' ? '✦ APK Premium Instalable' : product.itemCategory === 'drive' ? '✦ Enlace VIP Google Drive' : '✦ Guía & Método Digital')
                : (isProfile ? '✦ Perfil Individual con PIN' : '✦ Cuenta Completa Privada')}
            </span>
          </div>

          {/* Optional Image */}
          {product.image && (
            <div className="w-full h-40 sm:h-48 rounded-xl overflow-hidden border border-[#FF2E93]/30 bg-black/40">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Title & Price */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#FF2E93]/20 pb-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white leading-tight">
                {product.name}
              </h2>
              <div className="flex items-center gap-3 mt-2 text-sm text-[#A394AE]">
                <span className="flex items-center gap-1 text-[#FF8CC6]">
                  <Clock className="w-4 h-4" /> Duración: {product.duration}
                </span>
                {product.version && (
                  <>
                    <span>•</span>
                    <span className="text-[#3DDC97]">Versión: {product.version}</span>
                  </>
                )}
                <span>•</span>
                <span className="flex items-center gap-1 text-[#C9C4D4]">
                  <ShieldCheck className="w-4 h-4 text-[#3DDC97]" /> Garantía total
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              {product.originalPrice && (
                <div className="text-sm text-[#A394AE] line-through">
                  ${product.originalPrice} MXN
                </div>
              )}
              <div className="text-3xl sm:text-4xl font-extrabold text-[#FBEFF6] flex items-baseline gap-1">
                <span>${product.price}</span>
                <span className="text-xs font-medium text-[#FF8CC6]">MXN</span>
              </div>
            </div>
          </div>

          {/* Stock availability or delivery indicator */}
          <div className="p-3.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/25 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className={`w-3 h-3 rounded-full ${(!isDigital && freeProfilesCount > 0) || isDigital ? 'bg-[#3DDC97] shadow-[0_0_8px_#3DDC97]' : 'bg-[#FFB020]'}`} />
              <div>
                <div className="text-xs font-semibold text-white">
                  {isDigital 
                    ? 'Descarga Digital Inmediata: Entrega directa de enlace y guía'
                    : freeProfilesCount > 0 
                      ? `Disponibilidad Inmediata: ${freeProfilesCount} accesos libres` 
                      : 'Alta demanda: Asignación prioritaria en menos de 15 min'}
                </div>
                <div className="text-[11px] text-[#A394AE]">
                  {isDigital 
                    ? 'Al aprobarse tu pago recibes el link de Google Drive / APK directo en tu folio'
                    : 'Entrega automática de credenciales tras aprobación del comprobante'}
                </div>
              </div>
            </div>
            {isDigital ? <FolderDown className="w-5 h-5 text-[#3DDC97]" /> : <Users className="w-5 h-5 text-[#FF2E93]" />}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#FF8CC6] mb-2">
              Descripción del servicio
            </h4>
            <p className="text-sm text-[#C9C4D4] leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Features Checklist */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#FF8CC6] mb-3">
              ¿Qué incluye este plan?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {product.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#FBEFF6] p-2 rounded-lg bg-[#0B0612]/50 border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-[#3DDC97] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How it works info */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#7A1236]/30 to-[#12091A] border border-[#FF2E93]/20 text-xs text-[#A394AE] space-y-1.5">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#FF2E93]" />
              Proceso de Compra Seguro en JENYX:
            </div>
            <p>1. Completa tus datos y selecciona tu método de pago (BBVA o OXXO).</p>
            <p>2. Sube foto o captura de tu comprobante de pago.</p>
            <p>3. Nuestro panel verifica tu pago y te entrega tus accesos / enlaces de descarga en tu portal de cliente y buscador de folios.</p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onClose}
              className="w-1/3 py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#C9C4D4] hover:text-white bg-[#0B0612] border border-white/10 hover:border-white/20 transition-all"
            >
              Cerrar
            </button>
            <button
              onClick={() => onBuy(product)}
              className="w-2/3 py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide neon-btn-primary flex items-center justify-center gap-2"
            >
              <span>Comprar Ahora (${product.price} MXN)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
