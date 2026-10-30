import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';
import { 
  FolderPlus, 
  Plus, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Check, 
  Tv, 
  Gamepad2, 
  Smartphone, 
  FileCheck, 
  FolderDown, 
  HardDrive,
  Flame,
  Zap
} from 'lucide-react';

const CATEGORY_PRESETS = [
  {
    name: 'Trámites Digitales',
    slug: 'tramites',
    color: '#3DDC97',
    iconName: 'FileCheck',
    description: 'Constancias de Situación Fiscal (SAT), RFC, Actas de Nacimiento oficiales y CURP.'
  },
  {
    name: 'Recargas Telefónicas',
    slug: 'recargas',
    color: '#FFB020',
    iconName: 'Smartphone',
    description: 'Recargas de tiempo aire y paquetes de datos para Telcel, Movistar, AT&T y Bait al instante.'
  },
  {
    name: 'Diamantes & Videojuegos',
    slug: 'diamantes',
    color: '#00F0FF',
    iconName: 'Gamepad2',
    description: 'Recargas directas de Diamantes Free Fire por ID, Robux para Roblox y pases de batalla.'
  },
  {
    name: 'Streaming & Películas',
    slug: 'streaming',
    color: '#FF2E93',
    iconName: 'Tv',
    description: 'Cuentas completas y perfiles individuales con PIN para Netflix, Disney+, Max y Prime.'
  },
  {
    name: 'APKs & Smart TV',
    slug: 'apks-smart-tv',
    color: '#FF8CC6',
    iconName: 'Smartphone',
    description: 'Aplicaciones Android y Smart TV sin anuncios, canales en vivo y películas.'
  },
  {
    name: 'Google Drive VIP',
    slug: 'drive-vip',
    color: '#0063E5',
    iconName: 'HardDrive',
    description: 'Carpetas VIP con terabytes de contenido multimedia en 4K UHD para descarga directa.'
  }
];

export const AdminCategories: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, products } = useStore();

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formColor, setFormColor] = useState('#FF2E93');
  const [formIconName, setFormIconName] = useState('Tv');
  const [formDescription, setFormDescription] = useState('');
  const [formActive, setFormActive] = useState(true);

  const openAdd = () => {
    setEditingCategory(null);
    setFormName('');
    setFormSlug('');
    setFormColor('#FF2E93');
    setFormIconName('Tv');
    setFormDescription('');
    setFormActive(true);
    setShowModal(true);
  };

  const applyPreset = (preset: typeof CATEGORY_PRESETS[0]) => {
    setFormName(preset.name);
    setFormSlug(preset.slug);
    setFormColor(preset.color);
    setFormIconName(preset.iconName);
    setFormDescription(preset.description);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormColor(cat.color);
    setFormIconName(cat.iconName || 'Tv');
    setFormDescription(cat.description);
    setFormActive(cat.active);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const slug = formSlug.trim() || formName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    if (editingCategory) {
      updateCategory({
        ...editingCategory,
        name: formName.trim(),
        slug,
        color: formColor,
        iconName: formIconName,
        description: formDescription.trim(),
        active: formActive
      });
    } else {
      addCategory({
        name: formName.trim(),
        slug,
        color: formColor,
        iconName: formIconName,
        description: formDescription.trim(),
        active: formActive,
        order: categories.length + 1
      });
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#FF8CC6] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#FF2E93]" /> Tienda &bull; Categorías Libres
          </span>
          <h2 className="text-2xl font-bold font-cinzel text-white mt-1">
            Categorías y Servicios ({categories.length})
          </h2>
          <p className="text-xs text-[#A394AE]">
            Crea y administra cualquier categoría que desees: Trámites, Recargas, Diamantes Free Fire, Streaming, APKs, etc.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider neon-btn-primary flex items-center gap-2 self-start sm:self-auto shadow-[0_0_15px_rgba(255,46,147,0.4)]"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Categoría Libre</span>
        </button>
      </div>

      {/* Quick Presets Bar */}
      <div className="p-4 rounded-2xl bg-[#0B0612] border border-[#FF2E93]/20 space-y-2">
        <span className="text-[11px] font-bold text-[#FF8CC6] uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-[#3DDC97]" /> Sugerencias Rápidas de Categorías:
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORY_PRESETS.map((pr, i) => (
            <button
              key={i}
              onClick={() => {
                openAdd();
                applyPreset(pr);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#12091A] border border-white/10 hover:border-[#FF2E93] text-xs text-white hover:text-[#FF8CC6] flex items-center gap-1.5 transition-colors"
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pr.color }} />
              <span>+ {pr.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((c) => {
          const prodCount = products.filter(p => p.categoryId === c.id).length;
          return (
            <div
              key={c.id}
              className="goth-card rounded-2xl p-5 space-y-3 flex flex-col justify-between border border-[#FF2E93]/25 group hover:border-[#FF2E93] transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full shadow-[0_0_10px_currentColor]" 
                      style={{ backgroundColor: c.color, color: c.color }} 
                    />
                    <span className="text-[10px] text-[#A394AE] font-mono">/{c.slug}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${c.active ? 'bg-[#3DDC97]/20 text-[#3DDC97]' : 'bg-gray-800 text-gray-500'}`}>
                    {c.active ? 'Activa' : 'Inactiva'}
                  </span>
                </div>

                <h4 className="font-bold text-white text-base group-hover:text-[#FF8CC6] transition-colors">
                  {c.name}
                </h4>
                <p className="text-xs text-[#A394AE] line-clamp-2 leading-relaxed">
                  {c.description || 'Sin descripción'}
                </p>
                <div className="text-[11px] text-[#FF8CC6] font-semibold pt-1">
                  {prodCount} productos asociados
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEdit(c)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#C9C4D4] hover:text-white transition-colors"
                  title="Editar categoría"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`¿Eliminar la categoría "${c.name}"? Los productos asociados se mantendrán.`)) {
                      deleteCategory(c.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-950/40 transition-colors"
                  title="Eliminar categoría"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT CATEGORY MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#12091A] border-2 border-[#FF2E93] rounded-3xl p-6 sm:p-7 space-y-4 text-xs shadow-[0_0_40px_rgba(255,46,147,0.3)]">
            <h3 className="text-lg font-bold font-cinzel text-white flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-[#FF2E93]" />
              <span>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría Libre'}</span>
            </h3>

            {/* Presets buttons inside modal */}
            {!editingCategory && (
              <div className="space-y-1">
                <span className="text-[10px] text-[#A394AE] uppercase font-bold">O elige plantilla rápida:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {CATEGORY_PRESETS.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className="px-2 py-1 rounded bg-[#0B0612] border border-white/10 text-[10px] text-[#C9C4D4] hover:text-white"
                    >
                      {p.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1">Nombre de la Categoría *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Trámites SAT, Recargas Telcel, Diamantes Free Fire..."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white focus:outline-none focus:border-[#FF2E93]"
                />
              </div>

              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1">Slug / URL (Opcional)</label>
                <input
                  type="text"
                  placeholder="ej. tramites-sat, diamantes-free-fire"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0612] border border-white/10 text-white font-mono focus:outline-none focus:border-[#FF2E93]"
                />
              </div>

              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1">Color Neón de Marca</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    className="w-12 h-9 p-1 rounded-lg bg-[#0B0612] border border-white/10 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detalles sobre qué ofrece esta categoría..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0612] border border-white/10 text-white focus:outline-none focus:border-[#FF2E93]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="cat-active"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="rounded border-gray-700 text-[#FF2E93] focus:ring-[#FF2E93]"
                />
                <label htmlFor="cat-active" className="text-white text-xs cursor-pointer">
                  Categoría visible en la tienda pública
                </label>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#0B0612] text-[#C9C4D4] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold neon-btn-primary"
                >
                  {editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
