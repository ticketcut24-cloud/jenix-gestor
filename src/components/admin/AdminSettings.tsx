import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Palette, 
  Settings as SettingsIcon, 
  CreditCard, 
  Save, 
  RotateCcw, 
  Check, 
  Moon, 
  Sparkles,
  Building2,
  Store,
  Upload
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, resetToDefaultData } = useStore();

  const [businessName, setBusinessName] = useState(settings.businessName);
  const [motto, setMotto] = useState(settings.motto);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor);
  const [accentSoftColor, setAccentSoftColor] = useState(settings.accentSoftColor);
  const [wineColor, setWineColor] = useState(settings.wineColor);
  const [whatsappSupport, setWhatsappSupport] = useState(settings.whatsappSupport);
  const [announcement, setAnnouncement] = useState(settings.announcement || '');
  const [adminPin, setAdminPin] = useState(settings.adminPin || '2026');
  const [vaultMasterPin, setVaultMasterPin] = useState(settings.vaultMasterPin || '7799');

  // Payment
  const [bank, setBank] = useState(settings.payment.bank);
  const [clabe, setClabe] = useState(settings.payment.clabe);
  const [beneficiary, setBeneficiary] = useState(settings.payment.beneficiary);
  const [oxxoCard, setOxxoCard] = useState(settings.payment.oxxoCardNumber);
  const [oxxoBeneficiary, setOxxoBeneficiary] = useState(settings.payment.oxxoBeneficiary);
  const [instructions, setInstructions] = useState(settings.payment.instructions);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      businessName,
      motto,
      logoUrl,
      primaryColor,
      accentSoftColor,
      wineColor,
      whatsappSupport,
      announcement,
      adminPin: adminPin.trim() || '2026',
      vaultMasterPin: vaultMasterPin.trim() || '7799',
      payment: {
        bank,
        clabe,
        beneficiary,
        oxxoCardNumber: oxxoCard,
        oxxoBeneficiary,
        whatsappSupportNumber: whatsappSupport,
        instructions
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#FF8CC6]">
          ✦ Configuración &bull; Personalización de Marca
        </span>
        <h2 className="text-2xl font-bold font-cinzel text-white mt-1">
          Identidad Visual y Cuentas de Cobro
        </h2>
        <p className="text-xs text-[#A394AE]">
          Modifica el nombre de tu negocio, logo, lema, colores neón y datos bancarios para los clientes.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-[#3DDC97]/20 border border-[#3DDC97] text-[#3DDC97] text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>✦ ¡Configuración y personalización guardada con éxito en JENYX!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* IDENTIDAD VISUAL */}
        <div className="goth-card rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-white/10 pb-3">
            <Palette className="w-4 h-4 text-[#FF2E93]" />
            Identidad de Marca y Logo
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#FF8CC6] font-semibold mb-1">Nombre del Negocio</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-[#FF8CC6] font-semibold mb-1">Lema Oficial</label>
              <input
                type="text"
                required
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white"
              />
            </div>

            <div>
              <label className="block text-[#FF8CC6] font-semibold mb-1">URL del Logo (Recortado en Círculo)</label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white font-mono text-[11px]"
              />
              <span className="text-[10px] text-[#A394AE] mt-1 block">
                Predeterminado: /assets/aistudio/jenix_4fac0935.jpeg
              </span>
            </div>

            <div>
              <label className="block text-[#FF8CC6] font-semibold mb-1">WhatsApp de Atención y Soporte</label>
              <input
                type="text"
                value={whatsappSupport}
                onChange={(e) => setWhatsappSupport(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[#FF8CC6] font-semibold mb-1">Anuncio Superior de la Tienda</label>
              <input
                type="text"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white"
              />
            </div>
          </div>

          {/* Color Palettes */}
          <div className="pt-3 border-t border-white/10">
            <label className="block text-[#FF8CC6] font-semibold text-xs mb-2">Paleta Neón Dark Oficial</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0B0612] border border-white/10">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-8 h-8 rounded border border-white/20 cursor-pointer"
                />
                <div>
                  <span className="text-white block font-medium">Acento Primario</span>
                  <span className="text-gray-400 font-mono text-[11px]">{primaryColor}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0B0612] border border-white/10">
                <input
                  type="color"
                  value={accentSoftColor}
                  onChange={(e) => setAccentSoftColor(e.target.value)}
                  className="w-8 h-8 rounded border border-white/20 cursor-pointer"
                />
                <div>
                  <span className="text-white block font-medium">Acento Suave</span>
                  <span className="text-gray-400 font-mono text-[11px]">{accentSoftColor}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0B0612] border border-white/10">
                <input
                  type="color"
                  value={wineColor}
                  onChange={(e) => setWineColor(e.target.value)}
                  className="w-8 h-8 rounded border border-white/20 cursor-pointer"
                />
                <div>
                  <span className="text-white block font-medium">Tono Vino</span>
                  <span className="text-gray-400 font-mono text-[11px]">{wineColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEGURIDAD & PINS MAESTROS */}
        <div className="goth-card rounded-2xl p-6 space-y-4 border-[#FF2E93]/40 shadow-[0_0_20px_rgba(255,46,147,0.15)]">
          <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-white/10 pb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF2E93] shadow-[0_0_8px_#FF2E93]" />
            Seguridad &bull; PIN de Panel y Bóveda de Cuentas Madre
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#0B0612] border border-[#FF2E93]/20 space-y-2">
              <label className="block text-[#FF8CC6] font-bold text-xs">
                PIN Maestro de Acceso al Panel Admin
              </label>
              <input
                type="text"
                required
                maxLength={8}
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-[#FF2E93]/40 text-white font-mono text-base font-bold tracking-widest focus:outline-none"
              />
              <span className="text-[10px] text-[#A394AE] block">
                Solo tú con este PIN puedes entrar al panel de administración desde la tienda.
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0612] border border-[#FF2E93]/20 space-y-2">
              <label className="block text-[#3DDC97] font-bold text-xs">
                PIN de la Bóveda de Cuentas Madre (Máxima Seguridad)
              </label>
              <input
                type="text"
                required
                maxLength={8}
                value={vaultMasterPin}
                onChange={(e) => setVaultMasterPin(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-[#3DDC97]/40 text-[#3DDC97] font-mono text-base font-bold tracking-widest focus:outline-none"
              />
              <span className="text-[10px] text-[#A394AE] block">
                Bloquea y cifra las contraseñas reales de tus cuentas de Netflix, Disney+, etc. frente a ojos curiosos.
              </span>
            </div>
          </div>
        </div>

        {/* DATOS DE PAGO Y COBRO */}
        <div className="goth-card rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-white/10 pb-3">
            <CreditCard className="w-4 h-4 text-[#3DDC97]" />
            Cuentas de Cobro para Clientes (Checkout)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#FF8CC6] font-semibold mb-1">Banco Receptor (SPEI)</label>
              <input
                type="text"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white"
              />
            </div>

            <div>
              <label className="block text-[#FF8CC6] font-semibold mb-1">CLABE Interbancaria (18 dígitos)</label>
              <input
                type="text"
                value={clabe}
                onChange={(e) => setClabe(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[#FF8CC6] font-semibold mb-1">Titular de la Cuenta SPEI</label>
              <input
                type="text"
                value={beneficiary}
                onChange={(e) => setBeneficiary(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white"
              />
            </div>

            <div>
              <label className="block text-[#FF8CC6] font-semibold mb-1">Tarjeta para Depósito OXXO</label>
              <input
                type="text"
                value={oxxoCard}
                onChange={(e) => setOxxoCard(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[#FF8CC6] font-semibold mb-1">Beneficiario OXXO</label>
              <input
                type="text"
                value={oxxoBeneficiary}
                onChange={(e) => setOxxoBeneficiary(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[#FF8CC6] font-semibold mb-1">Instrucciones de Pago al Cliente</label>
              <textarea
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={() => {
              if (confirm('¿Restablecer todos los datos de ejemplo predeterminados de JENYX?')) {
                resetToDefaultData();
              }
            }}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Datos de Ejemplo Iniciales</span>
          </button>

          <button
            type="submit"
            className="py-3 px-8 rounded-xl font-bold text-xs uppercase tracking-wider neon-btn-primary flex items-center gap-2 shadow-[0_0_20px_rgba(255,46,147,0.5)]"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Toda la Configuración</span>
          </button>
        </div>

      </form>
    </div>
  );
};
