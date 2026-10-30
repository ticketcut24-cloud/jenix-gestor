import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductType, ItemCategoryType } from '../../types';
import { 
  ShoppingBag, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Clock, 
  DollarSign, 
  Tag,
  Search,
  CheckCircle2,
  X,
  Download,
  Upload,
  FileSpreadsheet,
  Tv,
  FolderDown,
  FileText,
  Smartphone,
  HardDrive
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { 
    products, 
    categories, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    addCategory, 
    exportProductsCSV, 
    importProductsCSV 
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // CSV Import Modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [importResult, setImportResult] = useState<{ imported: number; errors: string[] } | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategoryId, setFormCategoryId] = useState(categories[0]?.id || '');
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  
  const [formType, setFormType] = useState<ProductType>('perfil');
  const [formItemCategory, setFormItemCategory] = useState<ItemCategoryType>('streaming');
  const [formDuration, setFormDuration] = useState('1 Mes');
  const [formPrice, setFormPrice] = useState(65);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | undefined>(85);
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formDownloadUrl, setFormDownloadUrl] = useState('');
  const [formGuideInstructions, setFormGuideInstructions] = useState('');
  const [formVersion, setFormVersion] = useState('');
  
  const [formFeatures, setFormFeatures] = useState<string[]>(['1 Pantalla', 'Calidad 4K UHD', 'Garantía 30 días']);
  const [formNewFeature, setFormNewFeature] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formActive, setFormActive] = useState(true);

  const openAdd = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategoryId(categories[0]?.id || '');
    setCustomCategoryName('');
    setIsCustomCategory(false);
    setFormType('perfil');
    setFormItemCategory('streaming');
    setFormDuration('1 Mes');
    setFormPrice(65);
    setFormOriginalPrice(85);
    setFormDescription('');
    setFormImageUrl('');
    setFormDownloadUrl('');
    setFormGuideInstructions('');
    setFormVersion('');
    setFormFeatures(['1 Pantalla', 'Calidad 4K UHD', 'Garantía 30 días']);
    setFormBadge('');
    setFormActive(true);
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategoryId(p.categoryId);
    setIsCustomCategory(false);
    setCustomCategoryName('');
    setFormType(p.type);
    setFormItemCategory(p.itemCategory || (p.type === 'digital' ? 'apk' : 'streaming'));
    setFormDuration(p.duration);
    setFormPrice(p.price);
    setFormOriginalPrice(p.originalPrice);
    setFormDescription(p.description);
    setFormImageUrl(p.image || '');
    setFormDownloadUrl(p.downloadUrl || '');
    setFormGuideInstructions(p.guideInstructions || '');
    setFormVersion(p.version || '');
    setFormFeatures([...p.features]);
    setFormBadge(p.badge || '');
    setFormActive(p.active);
    setShowModal(true);
  };

  const handleAddFeature = () => {
    if (!formNewFeature.trim()) return;
    setFormFeatures([...formFeatures, formNewFeature.trim()]);
    setFormNewFeature('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFormFeatures(formFeatures.filter((_, i) => i !== idx));
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    let targetCatId = formCategoryId;
    let targetCatName = '';

    if (isCustomCategory && customCategoryName.trim()) {
      const createdCat = addCategory({
        name: customCategoryName.trim(),
        slug: customCategoryName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        iconName: 'Tv',
        color: '#FF2E93',
        description: `Plataforma personalizada ${customCategoryName.trim()}`,
        active: true,
        order: categories.length + 1
      });
      targetCatId = createdCat.id;
      targetCatName = createdCat.name;
    } else {
      const cat = categories.find(c => c.id === formCategoryId);
      targetCatName = cat?.name || 'Streaming';
    }

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        categoryId: targetCatId,
        categoryName: targetCatName,
        name: formName.trim(),
        type: formType,
        itemCategory: formItemCategory,
        duration: formDuration,
        price: Number(formPrice),
        originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
        description: formDescription.trim(),
        image: formImageUrl || undefined,
        downloadUrl: formDownloadUrl || undefined,
        guideInstructions: formGuideInstructions || undefined,
        version: formVersion || undefined,
        features: formFeatures,
        badge: formBadge.trim() || undefined,
        active: formActive
      });
    } else {
      addProduct({
        categoryId: targetCatId,
        categoryName: targetCatName,
        name: formName.trim(),
        type: formType,
        itemCategory: formItemCategory,
        duration: formDuration,
        price: Number(formPrice),
        originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
        description: formDescription.trim(),
        image: formImageUrl || undefined,
        downloadUrl: formDownloadUrl || undefined,
        guideInstructions: formGuideInstructions || undefined,
        version: formVersion || undefined,
        features: formFeatures,
        badge: formBadge.trim() || undefined,
        active: formActive
      });
    }

    setShowModal(false);
  };

  const handleExportCSV = () => {
    const csv = exportProductsCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `catalogo_jenyx_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = () => {
    if (!csvContent.trim()) return;
    const res = importProductsCSV(csvContent);
    setImportResult(res);
  };

  const filteredProducts = products.filter(p => {
    if (filterType !== 'all') {
      if (filterType === 'digital' && p.type !== 'digital' && p.itemCategory !== 'apk' && p.itemCategory !== 'drive' && p.itemCategory !== 'metodo') return false;
      if (filterType === 'streaming' && (p.type === 'digital' || p.itemCategory === 'apk' || p.itemCategory === 'drive' || p.itemCategory === 'metodo')) return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.categoryName?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#FF8CC6]">
            ✦ Tienda &bull; Catálogo Completo, APKs & Métodos
          </span>
          <h2 className="text-2xl font-bold font-cinzel text-white mt-1">
            Gestión de Productos ({products.length})
          </h2>
          <p className="text-xs text-[#A394AE]">
            Crea plataformas libres, cuentas, APKs, métodos de pago, archivos Drive y gestiona con CSV.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="py-2.5 px-3.5 rounded-xl font-bold text-xs bg-[#12091A] border border-[#FF2E93]/40 text-[#FF8CC6] hover:bg-[#FF2E93]/20 hover:text-white flex items-center gap-1.5 transition-colors"
            title="Exportar catálogo en CSV"
          >
            <Download className="w-4 h-4 text-[#FF2E93]" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => {
              setCsvContent('');
              setImportResult(null);
              setShowImportModal(true);
            }}
            className="py-2.5 px-3.5 rounded-xl font-bold text-xs bg-[#12091A] border border-white/20 text-white hover:bg-white/10 flex items-center gap-1.5"
            title="Importar catálogo desde CSV"
          >
            <Upload className="w-4 h-4" />
            <span>Subir CSV</span>
          </button>

          <button
            onClick={openAdd}
            className="py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider neon-btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterType === 'all' ? 'neon-btn-primary' : 'bg-[#12091A] text-[#C9C4D4] border border-white/10'
            }`}
          >
            Todos ({products.length})
          </button>
          <button
            onClick={() => setFilterType('streaming')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterType === 'streaming' ? 'neon-btn-primary' : 'bg-[#12091A] text-[#C9C4D4] border border-white/10'
            }`}
          >
            Streaming Cuentas & Perfiles
          </button>
          <button
            onClick={() => setFilterType('digital')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterType === 'digital' ? 'neon-btn-primary' : 'bg-[#12091A] text-[#C9C4D4] border border-white/10'
            }`}
          >
            APKs, Métodos & Drive
          </button>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-[#FF8CC6] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar producto, APK o plataforma..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#12091A] border border-[#FF2E93]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2E93] text-xs"
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((p) => {
          const isDigital = p.type === 'digital' || p.itemCategory === 'apk' || p.itemCategory === 'drive' || p.itemCategory === 'metodo';

          return (
            <div
              key={p.id}
              className={`goth-card rounded-2xl p-5 space-y-4 flex flex-col justify-between ${
                !p.active ? 'opacity-50' : ''
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FF2E93]/20 text-[#FF8CC6] border border-[#FF2E93]/30 flex items-center gap-1">
                    {isDigital ? (
                      p.itemCategory === 'apk' ? <Smartphone className="w-3 h-3 text-[#3DDC97]" /> :
                      p.itemCategory === 'drive' ? <HardDrive className="w-3 h-3 text-blue-400" /> :
                      <FileText className="w-3 h-3 text-[#FFB020]" />
                    ) : <Tv className="w-3 h-3 text-[#FF2E93]" />}
                    <span>{p.categoryName || 'Streaming'}</span>
                  </span>
                  
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    p.active ? 'bg-[#3DDC97]/20 text-[#3DDC97]' : 'bg-gray-800 text-gray-400'
                  }`}>
                    {p.active ? 'Activo' : 'Pausado'}
                  </span>
                </div>

                {/* Optional Custom Image / Photo Preview */}
                {p.image && (
                  <div className="w-full h-28 rounded-xl overflow-hidden border border-white/10 bg-black/40">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-white text-base leading-snug">{p.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-[#A394AE] mt-1">
                    <span className="text-[#FF8CC6] font-medium">{p.duration}</span>
                    <span>•</span>
                    <span className="capitalize">{p.itemCategory || p.type}</span>
                    {p.version && <span>({p.version})</span>}
                  </div>
                </div>

                <div className="text-xl font-extrabold text-white">
                  ${p.price} <span className="text-xs text-[#FF8CC6] font-normal">MXN</span>
                  {p.originalPrice && (
                    <span className="text-xs text-[#A394AE] line-through ml-2 font-normal">
                      ${p.originalPrice} MXN
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#C9C4D4] line-clamp-2">{p.description}</p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => updateProduct({ ...p, active: !p.active })}
                  className="text-xs text-[#A394AE] hover:text-white"
                >
                  {p.active ? 'Desactivar' : 'Activar'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(p)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#C9C4D4] hover:text-white"
                    title="Editar producto"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar producto ${p.name}?`)) {
                        deleteProduct(p.id);
                      }
                    }}
                    className="p-2 rounded-xl text-red-400 hover:bg-red-950/40"
                    title="Eliminar producto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: CREATE / EDIT PRODUCT */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#12091A] border-2 border-[#FF2E93] rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold font-cinzel text-white">
                {editingProduct ? 'Editar Producto / Servicio' : 'Crear Producto o Archivo Digital'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Product Nature */}
              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1">Tipo de Venta</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'streaming_perfil', type: 'perfil', cat: 'streaming', label: 'Perfil Streaming' },
                    { id: 'streaming_cuenta', type: 'cuenta_completa', cat: 'streaming', label: 'Cuenta Completa' },
                    { id: 'apk', type: 'digital', cat: 'apk', label: 'Aplicación APK' },
                    { id: 'drive', type: 'digital', cat: 'drive', label: 'Google Drive / Método' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setFormType(m.type as ProductType);
                        setFormItemCategory(m.cat as ItemCategoryType);
                      }}
                      className={`p-2 rounded-xl text-center font-bold transition-all border ${
                        formType === m.type && formItemCategory === m.cat
                          ? 'bg-[#FF2E93] text-white border-[#FF2E93]'
                          : 'bg-[#0B0612] text-gray-400 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Free Category / Platform Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[#FF8CC6] font-semibold">Plataforma o Categoría *</label>
                  <button
                    type="button"
                    onClick={() => setIsCustomCategory(!isCustomCategory)}
                    className="text-[11px] text-[#FF8CC6] hover:underline"
                  >
                    {isCustomCategory ? '← Seleccionar de la lista' : '+ Crear Nueva Plataforma Libre'}
                  </button>
                </div>

                {isCustomCategory ? (
                  <input
                    type="text"
                    required
                    placeholder="Escribe el nombre de la nueva plataforma (ej. Vix+, IPTV Pro, Crunchyroll)"
                    value={customCategoryName}
                    onChange={(e) => setCustomCategoryName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border-2 border-[#FF2E93] text-white focus:outline-none"
                  />
                ) : (
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1">Nombre Comercial del Producto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Netflix 4K UHD - Perfil Personal o MagisTV Pro APK"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white focus:outline-none text-sm font-semibold"
                />
              </div>

              {/* Free Duration & Pricing */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#FF8CC6] font-semibold mb-1">Duración / Meses *</label>
                  <input
                    type="text"
                    required
                    placeholder="1 Mes, 3 Meses, 6 Meses, Vitalicio..."
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#FF8CC6] font-semibold mb-1">Precio MXN *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formPrice}
                    onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white focus:outline-none font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[#FF8CC6] font-semibold mb-1">Precio Anterior (Tachado)</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="Opcional"
                    value={formOriginalPrice || ''}
                    onChange={(e) => setFormOriginalPrice(parseFloat(e.target.value) || undefined)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Custom Image / Icon URL or Upload */}
              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1">Foto, Logo o Banner del Producto (URL o Subir archivo)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://ejemplo.com/imagen.jpg o sube archivo"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#0B0612] border border-white/10 text-white font-mono text-[11px]"
                  />
                  <label className="px-3 py-2 rounded-xl bg-[#FF2E93]/20 hover:bg-[#FF2E93] text-[#FF8CC6] hover:text-white cursor-pointer font-bold transition-colors shrink-0">
                    Subir Foto
                    <input type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Digital Goods extra fields: Google Drive or APK Link */}
              {(formType === 'digital' || formItemCategory === 'apk' || formItemCategory === 'drive' || formItemCategory === 'metodo') && (
                <div className="p-3.5 rounded-2xl bg-black/40 border border-[#3DDC97]/40 space-y-3">
                  <span className="text-[#3DDC97] font-bold block">✦ Datos de Entrega Digital (Drive, APK o Método)</span>
                  
                  <div>
                    <label className="block text-gray-300 font-medium mb-1">Enlace de Descarga Directa o Carpeta Drive *</label>
                    <input
                      type="text"
                      placeholder="https://drive.google.com/drive/folders/..."
                      value={formDownloadUrl}
                      onChange={(e) => setFormDownloadUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#3DDC97]/40 text-white font-mono text-[11px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-300 font-medium mb-1">Versión (Opcional)</label>
                      <input
                        type="text"
                        placeholder="Ej. v5.4.2 Pro"
                        value={formVersion}
                        onChange={(e) => setFormVersion(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-medium mb-1">Instrucciones de instalación</label>
                      <input
                        type="text"
                        placeholder="Código Downloader, etc."
                        value={formGuideInstructions}
                        onChange={(e) => setFormGuideInstructions(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-white/10 text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1">Etiqueta Destacada (Badge)</label>
                <input
                  type="text"
                  placeholder="Ej. Más Vendido ✦, APK Mod, Drive VIP"
                  value={formBadge}
                  onChange={(e) => setFormBadge(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detalles del plan, pantallas, compatibilidad..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white focus:outline-none"
                />
              </div>

              {/* Features Checklist */}
              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1">Beneficios / Características</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Ej. Calidad 4K UHD, Sin anuncios, Entrega inmediata"
                    value={formNewFeature}
                    onChange={(e) => setFormNewFeature(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#0B0612] border border-white/10 text-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-1.5 rounded-lg bg-[#FF2E93] text-white font-bold text-xs"
                  >
                    Agregar
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {formFeatures.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0B0612] border border-white/10 text-[11px] text-white">
                      <span>{f}</span>
                      <button type="button" onClick={() => handleRemoveFeature(i)} className="text-gray-400 hover:text-red-400">✕</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="prodActive"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="rounded text-[#FF2E93]"
                />
                <label htmlFor="prodActive" className="text-white font-medium">Producto visible en la tienda pública</label>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#0B0612] text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold neon-btn-primary"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV IMPORT MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#12091A] border-2 border-[#FF2E93] rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold font-cinzel text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#FF2E93]" />
                Importar Catálogo desde Archivo CSV
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-[#A394AE]">
              Carga tu catálogo masivo de streaming, APKs o carpetas Drive con un solo archivo CSV.
            </p>

            <label className="border-2 border-dashed border-[#FF2E93]/40 hover:border-[#FF2E93] rounded-2xl p-5 text-center cursor-pointer block bg-[#0B0612]/60 transition-colors">
              <Upload className="w-8 h-8 text-[#FF8CC6] mx-auto mb-1.5" />
              <span className="text-xs font-semibold text-white block">
                Seleccionar archivo .CSV de productos
              </span>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {csvContent && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-[#3DDC97]">
                  Archivo leído: {csvContent.split('\n').length - 1} filas detectadas
                </span>
                <textarea
                  rows={4}
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  className="w-full p-2 rounded-xl bg-black/60 border border-white/10 text-[10px] font-mono text-gray-300"
                />
              </div>
            )}

            {importResult && (
              <div className="p-3 rounded-xl bg-[#3DDC97]/20 border border-[#3DDC97] text-[#3DDC97] text-xs space-y-1">
                <div className="font-bold">✦ ¡Catálogo actualizado!</div>
                <div>Se importaron {importResult.imported} productos correctamente.</div>
              </div>
            )}

            <div className="pt-2 border-t border-white/10 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl bg-[#0B0612] text-white text-xs border border-white/10"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={!csvContent}
                className="px-5 py-2 rounded-xl font-bold text-xs neon-btn-primary disabled:opacity-50"
              >
                Importar al Catálogo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
