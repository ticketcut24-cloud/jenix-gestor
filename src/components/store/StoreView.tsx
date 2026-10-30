import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductType } from '../../types';
import { ProductDetailModal } from './ProductDetailModal';
import { CheckoutModal } from './CheckoutModal';
import { OrderTrackingModal } from './OrderTrackingModal';
import { SpeiPaymentModal } from './SpeiPaymentModal';
import { 
  Sparkles, 
  Search, 
  Tv, 
  ShieldCheck, 
  Zap, 
  Users, 
  Clock, 
  CreditCard, 
  Check, 
  ArrowRight,
  Flame,
  Moon,
  MessageCircle,
  HelpCircle,
  Filter,
  Smartphone,
  HardDrive,
  FileText,
  FolderDown,
  UserCheck,
  UserPlus
} from 'lucide-react';

interface StoreViewProps {
  onOpenTracking: () => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  openClientAuth: () => void;
  openClientPortal: () => void;
}

export const StoreView: React.FC<StoreViewProps> = ({ 
  onOpenTracking, 
  isTrackingOpen, 
  setIsTrackingOpen,
  openClientAuth,
  openClientPortal
}) => {
  const { settings, categories, products, accounts, currentClient } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | ProductType | 'digital'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [selectedProductToBuy, setSelectedProductToBuy] = useState<Product | null>(null);
  const [showSpeiModal, setShowSpeiModal] = useState(false);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (!p.active) return false;
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
      
      if (selectedType === 'digital') {
        if (p.type !== 'digital' && p.itemCategory !== 'apk' && p.itemCategory !== 'drive' && p.itemCategory !== 'metodo') return false;
      } else if (selectedType !== 'all') {
        if (p.type !== selectedType) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesCat = p.categoryName?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }
      return true;
    });
  }, [products, selectedCategory, selectedType, searchQuery]);

  // Featured / Best-sellers
  const bestSellers = useMemo(() => {
    return products.filter(p => p.active && p.badge).slice(0, 3);
  }, [products]);

  // Free profiles inventory per category
  const getFreeProfilesCount = (categoryId: string) => {
    const matchingAccounts = accounts.filter(a => a.categoryId === categoryId && a.status === 'activa');
    let count = 0;
    matchingAccounts.forEach(acc => {
      acc.profiles.forEach(p => {
        if (p.status === 'libre') count++;
      });
    });
    return count;
  };

  return (
    <div className="min-h-screen goth-bg pb-20">
      
      {/* HERO BANNER - Gothic Dark + Neon Pink Aesthetic */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:py-20 border-b border-[#FF2E93]/20">
        <div className="absolute top-10 left-10 text-pink-500/20 text-4xl select-none pointer-events-none">✦</div>
        <div className="absolute top-32 right-12 text-pink-500/20 text-5xl select-none pointer-events-none">✦</div>
        <div className="absolute bottom-6 left-1/3 text-pink-400/15 text-3xl select-none pointer-events-none">★</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12091A] border border-[#FF2E93]/40 text-xs font-semibold text-[#FF8CC6] shadow-[0_0_15px_rgba(255,46,147,0.25)]">
                <Moon className="w-3.5 h-3.5 text-[#FF2E93]" />
                <span>Estilo Gótico Dark &bull; Cuentas, APKs & Drive 100% Garantizados</span>
                <span>✦</span>
              </div>

              <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-wide">
                {settings.businessName}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E93] via-[#FF8CC6] to-[#C2187A] text-2xl sm:text-3xl lg:text-4xl mt-2 font-normal">
                  {settings.motto}
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#C9C4D4] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Disfruta de streaming, películas, series y música en máxima resolución. Cuentas privadas, perfiles con PIN, aplicaciones APK sin anuncios para Smart TV y carpetas VIP de Google Drive con descarga inmediata.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#catalogo"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm tracking-wide neon-btn-primary flex items-center justify-center gap-2.5"
                >
                  <Flame className="w-4 h-4 text-white" />
                  <span>Explorar Catálogo ({products.length} Planes & APKs)</span>
                </a>

                {currentClient ? (
                  <button
                    onClick={openClientPortal}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide bg-[#12091A] border-2 border-[#3DDC97] text-[#3DDC97] hover:bg-[#3DDC97] hover:text-[#07040C] shadow-[0_0_15px_rgba(61,220,151,0.3)] flex items-center justify-center gap-2 transition-all"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Mi Cuenta ({currentClient.name.split(' ')[0]})</span>
                  </button>
                ) : (
                  <button
                    onClick={openClientAuth}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm tracking-wide neon-btn-secondary flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4 text-[#FF2E93]" />
                    <span>Registrarme como Cliente</span>
                  </button>
                )}
              </div>

              {/* Client registration benefit bar */}
              {!currentClient && (
                <div 
                  onClick={openClientAuth}
                  className="cursor-pointer p-3 rounded-xl bg-[#12091A]/80 border border-[#FF2E93]/30 text-xs text-[#C9C4D4] flex items-center gap-2 hover:border-[#FF2E93] transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#FF2E93] shrink-0" />
                  <span>✦ <strong>¿Primera vez?</strong> Regístrate con tu WhatsApp y correo para que todas tus contraseñas y renovaciones queden guardadas en tu portal.</span>
                </div>
              )}

              {/* Micro Perks */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5 text-xs text-[#A394AE]">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <ShieldCheck className="w-4 h-4 text-[#3DDC97]" />
                  <span>Garantía de 30 Días</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <Zap className="w-4 h-4 text-[#FF2E93]" />
                  <span>Entrega Inmediata</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <CreditCard className="w-4 h-4 text-[#FF8CC6]" />
                  <span>SPEI / BBVA / OXXO</span>
                </div>
              </div>

              {/* SPEI Flow & WhatsApp Direct Top-up Banner */}
              <div className="p-3.5 rounded-2xl bg-[#12091A]/90 border border-[#3DDC97]/40 shadow-[0_0_20px_rgba(61,220,151,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#3DDC97]/20 border border-[#3DDC97]/50 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-[#3DDC97]" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-white block">¿Quieres pagar por transferencia SPEI?</span>
                    <span className="text-[11px] text-[#A394AE]">Transfiere, adjunta tu comprobante y confirma por WhatsApp al instante.</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSpeiModal(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#3DDC97] text-[#07040C] hover:bg-[#34c485] shadow-[0_0_12px_rgba(61,220,151,0.3)] transition-all shrink-0 self-start sm:self-auto"
                >
                  Pagar / Recargar SPEI
                </button>
              </div>
            </div>

            {/* Right Logo Presentation */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#FF2E93] via-[#7A1236] to-[#C2187A] opacity-40 blur-2xl group-hover:opacity-75 transition duration-500" />
                
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full p-1.5 bg-gradient-to-b from-[#FF2E93] via-[#7A1236] to-[#FF2E93] shadow-[0_0_40px_rgba(255,46,147,0.5)]">
                  <img
                    src={settings.logoUrl || '/assets/aistudio/jenix_4fac0935.jpeg'}
                    alt="JENYX Gothic Girl & Black Cat Logo"
                    className="w-full h-full object-cover rounded-full"
                  />
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#12091A] border border-[#FF2E93] text-xs font-bold text-white shadow-lg whitespace-nowrap flex items-center gap-1.5">
                    <span className="text-[#FF2E93]">✦</span>
                    <span>100% Cuentas Seguras</span>
                    <span className="text-[#FF2E93]">✦</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURED / BEST SELLERS SECTION */}
      {bestSellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FF8CC6] flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#FF2E93]" /> Los Más Populares
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mt-1">
                Servicios Destacados JENYX
              </h2>
            </div>
            <span className="text-xs text-[#A394AE] hidden sm:block">
              Precios transparentes en Pesos Mexicanos (MXN)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bestSellers.map((item) => (
              <div 
                key={item.id}
                className="goth-card rounded-2xl p-6 relative flex flex-col justify-between group"
              >
                {item.badge && (
                  <div className="absolute -top-3 right-6 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#FF2E93] to-[#C2187A] text-white shadow-[0_0_12px_rgba(255,46,147,0.5)]">
                    {item.badge}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#FF2E93]/15 text-[#FF8CC6] border border-[#FF2E93]/30">
                      {item.categoryName}
                    </span>
                    <span className="text-xs text-[#A394AE]">
                      {item.type === 'perfil' ? 'Perfil con PIN' : item.type === 'cuenta_completa' ? 'Cuenta Completa' : 'Archivo Digital'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#FF8CC6] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#C9C4D4] mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    {item.features.slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#FBEFF6]">
                        <Check className="w-3.5 h-3.5 text-[#3DDC97] shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#A394AE] block">{item.duration}</span>
                    <div className="text-2xl font-extrabold text-white">
                      ${item.price} <span className="text-xs text-[#FF8CC6] font-normal">MXN</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedProductDetail(item)}
                      className="p-2.5 rounded-xl bg-[#0B0612] border border-white/10 text-xs text-[#C9C4D4] hover:text-white hover:border-[#FF2E93] transition-colors"
                      title="Ver detalles"
                    >
                      Info
                    </button>
                    <button
                      onClick={() => setSelectedProductToBuy(item)}
                      className="py-2.5 px-4 rounded-xl text-xs font-bold neon-btn-primary flex items-center gap-1.5"
                    >
                      <span>Comprar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MAIN CATALOG & FILTERS */}
      <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="border-t border-[#FF2E93]/20 pt-10">
          
          {/* Section Title */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FF8CC6] flex items-center gap-1">
                <span>✦</span> Todo el Entretenimiento y Productos Digitales
              </span>
              <h2 className="text-3xl font-bold font-cinzel text-white mt-1">
                Catálogo de Cuentas, APKs & Drive
              </h2>
              <p className="text-xs text-[#A394AE] mt-1">
                Selecciona tu plataforma o archivo y adquiere tu acceso al instante con garantía JENYX.
              </p>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-72 relative">
              <Search className="w-4 h-4 text-[#FF8CC6] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Buscar Netflix, APK, Drive, Spotify..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#12091A] border border-[#FF2E93]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2E93] text-xs"
              />
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-thin">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all shrink-0 ${
                selectedCategory === 'all'
                  ? 'neon-btn-primary'
                  : 'bg-[#12091A] text-[#C9C4D4] border border-white/10 hover:border-[#FF2E93]/40'
              }`}
            >
              ✦ Todas ({products.length})
            </button>
            {categories.filter(c => c.active).map((cat) => {
              const count = products.filter(p => p.categoryId === cat.id && p.active).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 flex items-center gap-2 ${
                    selectedCategory === cat.id
                      ? 'neon-btn-primary'
                      : 'bg-[#12091A] text-[#C9C4D4] border border-white/10 hover:border-[#FF2E93]/40'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span>{cat.name}</span>
                  <span className="text-[10px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Type Filter Sub-Pills including APKs, Métodos & Drive */}
          <div className="flex items-center justify-between flex-wrap gap-3 my-5 py-3 px-4 rounded-xl bg-[#0B0612] border border-[#FF2E93]/15 text-xs">
            <div className="flex items-center flex-wrap gap-2">
              <Filter className="w-3.5 h-3.5 text-[#FF2E93]" />
              <span className="text-[#A394AE]">Modalidad:</span>
              <button
                onClick={() => setSelectedType('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedType === 'all' ? 'bg-[#FF2E93] text-white font-bold' : 'text-[#C9C4D4] hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setSelectedType('perfil')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedType === 'perfil' ? 'bg-[#FF2E93] text-white font-bold' : 'text-[#C9C4D4] hover:text-white'
                }`}
              >
                Perfiles con PIN
              </button>
              <button
                onClick={() => setSelectedType('cuenta_completa')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedType === 'cuenta_completa' ? 'bg-[#FF2E93] text-white font-bold' : 'text-[#C9C4D4] hover:text-white'
                }`}
              >
                Cuentas Completas
              </button>
              <button
                onClick={() => setSelectedType('digital')}
                className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                  selectedType === 'digital' ? 'bg-[#3DDC97] text-[#07040C] font-bold shadow-[0_0_10px_#3DDC97]' : 'text-[#3DDC97] hover:text-white'
                }`}
              >
                <FolderDown className="w-3.5 h-3.5" />
                <span>APKs, Métodos & Drive</span>
              </button>
            </div>

            <span className="text-[11px] text-[#A394AE]">
              Mostrando {filteredProducts.length} de {products.length} productos
            </span>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-[#12091A]/50 rounded-2xl border border-white/5 space-y-3">
              <Search className="w-10 h-10 text-[#FF8CC6] mx-auto opacity-60" />
              <h3 className="text-base font-semibold text-white">No encontramos productos con esos filtros</h3>
              <p className="text-xs text-[#A394AE]">Intenta con otra categoría o término de búsqueda.</p>
              <button
                onClick={() => { setSelectedCategory('all'); setSelectedType('all'); setSearchQuery(''); }}
                className="px-4 py-2 rounded-xl text-xs font-semibold neon-btn-secondary"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((prod) => {
                const freeCount = getFreeProfilesCount(prod.categoryId);
                const isProf = prod.type === 'perfil';
                const isDigital = prod.type === 'digital' || prod.itemCategory === 'apk' || prod.itemCategory === 'drive' || prod.itemCategory === 'metodo';

                return (
                  <div
                    key={prod.id}
                    className="goth-card rounded-2xl p-5 flex flex-col justify-between group relative"
                  >
                    {prod.badge && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF2E93] text-white shadow-[0_0_8px_rgba(255,46,147,0.5)]">
                        {prod.badge}
                      </span>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FF2E93]/20 text-[#FF8CC6] border border-[#FF2E93]/40 flex items-center gap-1">
                          {isDigital ? (
                            prod.itemCategory === 'apk' ? <Smartphone className="w-3 h-3 text-[#3DDC97]" /> :
                            prod.itemCategory === 'drive' ? <HardDrive className="w-3 h-3 text-blue-400" /> :
                            <FileText className="w-3 h-3 text-[#FFB020]" />
                          ) : <Tv className="w-3 h-3 text-[#FF2E93]" />}
                          <span>{prod.categoryName || 'Streaming'}</span>
                        </span>
                        
                        <span className="text-[11px] text-[#A394AE]">
                          {isDigital ? (prod.itemCategory?.toUpperCase() || 'DIGITAL') : isProf ? '1 Pantalla' : 'Familiar'}
                        </span>
                      </div>

                      {/* Custom image or photo preview */}
                      {prod.image && (
                        <div className="w-full h-24 rounded-xl overflow-hidden border border-white/10 bg-black/40">
                          <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                      )}

                      <div>
                        <h4 className="font-bold text-white text-base group-hover:text-[#FF8CC6] transition-colors leading-snug">
                          {prod.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-[#A394AE]">
                          <span className="flex items-center gap-1 text-[#FF8CC6]">
                            <Clock className="w-3 h-3" /> {prod.duration}
                          </span>
                          {!isDigital && (
                            <>
                              <span>•</span>
                              <span className={freeCount > 0 ? 'text-[#3DDC97]' : 'text-[#FFB020]'}>
                                {freeCount > 0 ? `${freeCount} disp.` : 'Inmediato'}
                              </span>
                            </>
                          )}
                          {prod.version && (
                            <span className="text-[10px] text-gray-400">({prod.version})</span>
                          )}
                        </div>
                      </div>

                      {/* Feature points */}
                      <div className="space-y-1 pt-1">
                        {prod.features.slice(0, 3).map((f, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#C9C4D4]">
                            <Check className="w-3 h-3 text-[#3DDC97] shrink-0" />
                            <span className="truncate">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 mt-4">
                      <div className="flex items-baseline justify-between mb-3">
                        <div>
                          {prod.originalPrice && (
                            <span className="text-[11px] text-[#A394AE] line-through block">
                              ${prod.originalPrice} MXN
                            </span>
                          )}
                          <div className="text-xl font-extrabold text-white">
                            ${prod.price} <span className="text-[10px] text-[#FF8CC6] font-normal">MXN</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedProductDetail(prod)}
                          className="text-[11px] text-[#FF8CC6] hover:underline"
                        >
                          Ver detalles
                        </button>
                      </div>

                      <button
                        onClick={() => setSelectedProductToBuy(prod)}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold neon-btn-primary flex items-center justify-center gap-1.5"
                      >
                        <span>Comprar Ahora</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* TRACKING PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#12091A] via-[#1E0B2B] to-[#12091A] border-2 border-[#FF2E93]/40 shadow-[0_0_40px_rgba(255,46,147,0.2)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF8CC6] flex items-center gap-1.5 justify-center md:justify-start">
              <span>✦</span> ¿Ya compraste en JENYX?
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">
              Consulta tus Accesos, PIN y Vencimiento
            </h3>
            <p className="text-xs sm:text-sm text-[#C9C4D4] max-w-xl">
              Accede al portal con tu cuenta de cliente o con tu folio (ej. JNX-2091). Podrás copiar tus credenciales, enlaces de Drive / APKs o renovar con un solo clic.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {currentClient ? (
              <button
                onClick={openClientPortal}
                className="px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide bg-[#3DDC97] text-[#07040C] flex items-center gap-2 shadow-[0_0_15px_#3DDC97]"
              >
                <UserCheck className="w-4 h-4" />
                <span>Abrir Mi Portal de Cliente</span>
              </button>
            ) : (
              <button
                onClick={openClientAuth}
                className="px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide bg-[#12091A] border-2 border-[#FF2E93] text-[#FF8CC6] hover:bg-[#FF2E93] hover:text-white flex items-center gap-2 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Registrarme / Entrar</span>
              </button>
            )}

            <button
              onClick={onOpenTracking}
              className="px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide neon-btn-primary shrink-0 flex items-center gap-2 shadow-[0_0_20px_rgba(255,46,147,0.6)]"
            >
              <Search className="w-4 h-4" />
              <span>Rastrear Folio</span>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#FF2E93]/20 bg-[#0B0612] pt-12 pb-8 mt-16 text-xs text-[#A394AE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <img 
                  src={settings.logoUrl || '/assets/aistudio/jenix_4fac0935.jpeg'} 
                  alt="JENYX Logo" 
                  className="w-9 h-9 rounded-full border border-[#FF2E93]"
                />
                <span className="font-cinzel text-lg font-bold text-white tracking-wider">
                  {settings.businessName}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-[#C9C4D4]">
                {settings.motto} La tienda preferida de streaming, APKs premium y archivos Drive con estilo gótico neón en México.
              </p>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider text-xs mb-3 text-[#FF8CC6]">
                Plataformas & Digital
              </h5>
              <ul className="space-y-1.5 text-xs text-[#C9C4D4]">
                <li>Netflix 4K Ultra HD</li>
                <li>Disney+ / Star+</li>
                <li>Max Platino (HBO)</li>
                <li>MagisTV & Tele Latino (APKs)</li>
                <li>Carpetas Google Drive VIP</li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider text-xs mb-3 text-[#FF8CC6]">
                Métodos de Pago
              </h5>
              <ul className="space-y-1.5 text-xs text-[#C9C4D4]">
                <li>✦ Transferencia SPEI (BBVA)</li>
                <li>✦ Depósito en Tiendas OXXO</li>
                <li>✦ Cajeros y Practicajas</li>
                <li>✦ Moneda: Pesos Mexicanos (MXN)</li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider text-xs mb-3 text-[#FF8CC6]">
                Atención & Garantía
              </h5>
              <p className="text-xs text-[#C9C4D4] mb-3">
                Atención personalizada los 7 días de la semana con soporte prioritario en WhatsApp.
              </p>
              <a
                href={`https://wa.me/${settings.whatsappSupport.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#3DDC97]/20 border border-[#3DDC97] text-[#3DDC97] hover:bg-[#3DDC97] hover:text-[#07040C] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Soporte</span>
              </a>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <div>
              &copy; {new Date().getFullYear()} {settings.businessName}. Todos los derechos reservados.
            </div>
            <div className="flex items-center gap-4">
              <span>✦ Tu mundo digital, a tu estilo ✦</span>
            </div>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {selectedProductDetail && (
        <ProductDetailModal
          product={selectedProductDetail}
          accounts={accounts}
          onClose={() => setSelectedProductDetail(null)}
          onBuy={(prod) => {
            setSelectedProductDetail(null);
            setSelectedProductToBuy(prod);
          }}
        />
      )}

      {selectedProductToBuy && (
        <CheckoutModal
          product={selectedProductToBuy}
          onClose={() => setSelectedProductToBuy(null)}
          onSuccess={() => {
            setSelectedProductToBuy(null);
          }}
        />
      )}

      {isTrackingOpen && (
        <OrderTrackingModal
          onClose={() => setIsTrackingOpen(false)}
        />
      )}

      {showSpeiModal && (
        <SpeiPaymentModal
          onClose={() => setShowSpeiModal(false)}
        />
      )}
    </div>
  );
};
