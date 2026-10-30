import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  RotateCw, 
  Wrench, 
  Upload, 
  MessageCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Clock, 
  Search, 
  Key,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { WarrantyClaimIssueType, WarrantyClaimActionRequested, WarrantyClaim } from '../../types';

interface WarrantyClaimModalProps {
  onClose: () => void;
  preselectedOrderId?: string;
}

export const WarrantyClaimModal: React.FC<WarrantyClaimModalProps> = ({ onClose, preselectedOrderId }) => {
  const { orders, currentClient, settings, createWarrantyClaim, warrantyClaims } = useStore();

  const [activeTab, setActiveTab] = useState<'crear' | 'consultar'>('crear');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(preselectedOrderId || '');
  const [manualOrderNumber, setManualOrderNumber] = useState('');
  const [customerName, setCustomerName] = useState(currentClient?.name || '');
  const [customerWhatsApp, setCustomerWhatsApp] = useState(currentClient?.whatsapp || '');
  const [customerEmail, setCustomerEmail] = useState(currentClient?.email || '');
  
  const [actionRequested, setActionRequested] = useState<WarrantyClaimActionRequested>('renovacion');
  const [issueType, setIssueType] = useState<WarrantyClaimIssueType>('credenciales_incorrectas');
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string>('');

  const [createdClaim, setCreatedClaim] = useState<WarrantyClaim | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Search / Lookup tab state
  const [searchFolio, setSearchFolio] = useState('');
  const [searchedClaim, setSearchedClaim] = useState<WarrantyClaim | null>(null);
  const [searchError, setSearchError] = useState('');

  // Client's delivered / active orders
  const clientOrders = orders.filter(o => {
    if (currentClient) {
      return (
        o.customerWhatsApp === currentClient.whatsapp ||
        (currentClient.email && o.customerEmail?.toLowerCase() === currentClient.email.toLowerCase())
      );
    }
    return true;
  });

  // Find currently selected order
  const activeOrder = orders.find(o => o.id === selectedOrderId || (manualOrderNumber && o.orderNumber.toLowerCase() === manualOrderNumber.trim().toLowerCase()));

  // Warranty calculation for selected order
  let daysRemaining = 30;
  let isWithinWarranty = true;
  let warrantyDateStr = '';

  if (activeOrder) {
    if (activeOrder.expiresAt) {
      warrantyDateStr = new Date(activeOrder.expiresAt).toLocaleDateString();
      const diff = new Date(activeOrder.expiresAt).getTime() - Date.now();
      daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
      isWithinWarranty = diff > 0;
    } else if (activeOrder.createdAt) {
      const exp = new Date(activeOrder.createdAt);
      exp.setDate(exp.getDate() + 30);
      warrantyDateStr = exp.toLocaleDateString();
      const diff = exp.getTime() - Date.now();
      daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
      isWithinWarranty = diff > 0;
    }
  }

  // Handle file upload for screenshot
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert('La imagen no debe superar los 4MB');
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidenceUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeOrder && !manualOrderNumber) {
      alert('Por favor selecciona o ingresa tu número de pedido (Folio JNX-XXXX).');
      return;
    }

    if (!customerWhatsApp.trim()) {
      alert('Por favor ingresa tu número de WhatsApp para poder contactarte con la solución.');
      return;
    }

    if (!description.trim()) {
      alert('Por favor describe la falla o inconveniente que presentas.');
      return;
    }

    const orderIdToUse = activeOrder?.id || `ord-manual-${Date.now()}`;
    const orderNumToUse = activeOrder?.orderNumber || manualOrderNumber.toUpperCase().trim();
    const prodIdToUse = activeOrder?.productId || 'prod-custom';
    const prodNameToUse = activeOrder?.productName || 'Servicio Digital JENYX';

    const result = createWarrantyClaim({
      orderId: orderIdToUse,
      orderNumber: orderNumToUse,
      productId: prodIdToUse,
      productName: prodNameToUse,
      customerName: customerName || currentClient?.name || 'Cliente JENYX',
      customerWhatsApp: customerWhatsApp.trim(),
      customerEmail: customerEmail.trim() || undefined,
      actionRequested,
      issueType,
      description,
      evidenceUrl
    });

    if (result.success && result.claim) {
      setCreatedClaim(result.claim);
    }
  };

  const copyText = (txt: string, keyName: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleLookup = () => {
    setSearchError('');
    const query = searchFolio.trim().toUpperCase();
    if (!query) {
      setSearchError('Ingresa un número de folio (ej. GAR-1042 o JNX-8492)');
      return;
    }

    const found = warrantyClaims.find(c => 
      c.claimNumber.toUpperCase() === query || 
      c.orderNumber.toUpperCase() === query ||
      c.customerWhatsApp.replace(/\D/g, '').includes(query.replace(/\D/g, ''))
    );

    if (found) {
      setSearchedClaim(found);
    } else {
      setSearchedClaim(null);
      setSearchError(`No se encontró ningún reporte con el folio o dato "${query}". Verifica e intenta nuevamente.`);
    }
  };

  // Client's existing claims list
  const clientClaims = warrantyClaims.filter(c => {
    if (currentClient) {
      return (
        c.customerWhatsApp === currentClient.whatsapp ||
        (currentClient.email && c.customerEmail?.toLowerCase() === currentClient.email.toLowerCase())
      );
    }
    return false;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#12091A] border-2 border-[#FF2E93]/70 rounded-3xl shadow-[0_0_50px_rgba(255,46,147,0.35)] overflow-hidden">
        
        {/* Top neon aesthetic strip */}
        <div className="h-2 w-full bg-gradient-to-r from-[#7A1236] via-[#FF2E93] to-[#FF8CC6]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#0B0612]/80 border border-[#FF2E93]/30 text-[#C9C4D4] hover:text-white hover:border-[#FF2E93] transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 sm:p-7 space-y-5 max-h-[88vh] overflow-y-auto">
          
          {/* Header */}
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#FF8CC6] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#FF2E93]" />
              <span>Soporte Oficial & Centro de Garantías JENYX ✦</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-white mt-1">
              Garantía & Reporte de Fallas
            </h2>
            <p className="text-xs text-[#A394AE] mt-0.5">
              Si tu cuenta, perfil o archivo adquirido presenta cualquier falla antes de que termine tu periodo de garantía de 30 días, solicita una renovación inmediata o solución técnica.
            </p>

            {/* Tab switch */}
            <div className="flex items-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('crear');
                  setCreatedClaim(null);
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'crear'
                    ? 'bg-[#FF2E93] text-white shadow-[0_0_15px_rgba(255,46,147,0.4)]'
                    : 'bg-[#0B0612] text-[#A394AE] hover:text-white border border-white/5'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Reportar Falla / Pedir Garantía</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('consultar')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'consultar'
                    ? 'bg-[#FF2E93] text-white shadow-[0_0_15px_rgba(255,46,147,0.4)]'
                    : 'bg-[#0B0612] text-[#A394AE] hover:text-white border border-white/5'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Consultar Estado de Mi Reporte</span>
                {clientClaims.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#3DDC97] text-[#07040C] text-[10px] font-bold">
                    {clientClaims.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* TAB 1: CREAR REPORTE / SOLICITAR GARANTÍA */}
          {activeTab === 'crear' && (
            <>
              {createdClaim ? (
                /* SUCCESS VIEW */
                <div className="p-6 rounded-2xl bg-[#0B0612] border-2 border-[#3DDC97]/60 text-center space-y-4 animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-[#3DDC97]/20 border border-[#3DDC97] flex items-center justify-center mx-auto text-[#3DDC97]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#3DDC97]">
                      ✦ ¡Reporte de Garantía Registrado! ✦
                    </span>
                    <h3 className="text-2xl font-bold font-mono text-white mt-1">
                      {createdClaim.claimNumber}
                    </h3>
                    <p className="text-xs text-[#A394AE] max-w-md mx-auto mt-1">
                      Tu solicitud de <strong className="text-white">{createdClaim.actionRequested === 'renovacion' ? 'Renovación / Reemplazo' : 'Solución Técnica'}</strong> para <span className="text-[#FF8CC6]">{createdClaim.productName}</span> está en revisión prioritaria por el equipo de JENYX.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#12091A] border border-white/10 text-left text-xs space-y-2 max-w-md mx-auto">
                    <div className="flex justify-between">
                      <span className="text-[#A394AE]">Pedido Asociado:</span>
                      <strong className="text-white font-mono">{createdClaim.orderNumber}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A394AE]">Tipo de Falla:</span>
                      <span className="text-yellow-400 capitalize">{createdClaim.issueType.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A394AE]">Cobertura de Garantía:</span>
                      <span className="text-[#3DDC97] font-semibold">
                        {createdClaim.isWithinWarranty ? `Válida hasta ${createdClaim.warrantyValidUntil}` : 'Revisión técnica especial'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A394AE]">Estado Actual:</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
                        Abierto &bull; En Turno
                      </span>
                    </div>
                  </div>

                  {/* WhatsApp Direct Action Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/${settings.whatsappSupport.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Hola JENYX ✦ Acabo de registrar mi reporte de garantía con Folio: *${createdClaim.claimNumber}* para el pedido *${createdClaim.orderNumber}* (${createdClaim.productName}). Solicito: ${createdClaim.actionRequested === 'renovacion' ? 'Renovación de cuenta/perfil' : 'Solución técnica'}. Motivo: ${createdClaim.description}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-[#3DDC97] hover:bg-[#2fc081] text-[#07040C] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(61,220,151,0.3)] transition-all"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Agilizar por WhatsApp con mi Folio</span>
                    </a>

                    <button
                      onClick={() => {
                        setCreatedClaim(null);
                        setActiveTab('consultar');
                        setSearchFolio(createdClaim.claimNumber);
                        handleLookup();
                      }}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-semibold bg-[#12091A] border border-white/10 text-white hover:border-[#FF2E93] transition-colors"
                    >
                      Ver en "Mis Reportes"
                    </button>
                  </div>
                </div>
              ) : (
                /* FORM VIEW */
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Step 1: Select Order */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                      <span>1. Selecciona el Pedido con Falla</span>
                      <span className="text-[10px] text-[#FF8CC6] font-normal">Garantía de 30 días</span>
                    </label>

                    {clientOrders.length > 0 ? (
                      <select
                        value={selectedOrderId}
                        onChange={(e) => {
                          setSelectedOrderId(e.target.value);
                          setManualOrderNumber('');
                        }}
                        className="w-full py-2.5 px-3.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/40 text-white text-xs focus:outline-none focus:border-[#FF2E93]"
                      >
                        <option value="">-- Elige una de tus compras activas --</option>
                        {clientOrders.map(ord => (
                          <option key={ord.id} value={ord.id}>
                            {ord.orderNumber} - {ord.productName} ({new Date(ord.createdAt).toLocaleDateString()})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={manualOrderNumber}
                          onChange={(e) => setManualOrderNumber(e.target.value)}
                          placeholder="Ingresa tu Folio de Pedido ej. JNX-8492"
                          className="w-full py-2.5 px-3.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/40 text-white text-xs placeholder:text-gray-500 font-mono uppercase focus:outline-none focus:border-[#FF2E93]"
                          required
                        />
                        <span className="text-[10px] text-[#A394AE] block">
                          Ingresa el folio de 4 dígitos que recibiste al comprar o tu número de WhatsApp.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Warranty Status Banner for chosen order */}
                  {activeOrder && (
                    <div className={`p-3 rounded-xl text-xs flex items-center justify-between border ${
                      isWithinWarranty 
                        ? 'bg-[#3DDC97]/10 border-[#3DDC97]/40 text-[#3DDC97]'
                        : 'bg-yellow-950/30 border-[#FFB020]/40 text-[#FFB020]'
                    }`}>
                      <div className="flex items-center gap-2">
                        {isWithinWarranty ? <ShieldCheck className="w-4 h-4 text-[#3DDC97]" /> : <AlertTriangle className="w-4 h-4 text-[#FFB020]" />}
                        <span>
                          {isWithinWarranty ? (
                            <>✦ <strong>Garantía Oficial Activa:</strong> Te quedan <strong>{daysRemaining} días</strong> de cobertura total (Vence {warrantyDateStr})</>
                          ) : (
                            <>Garantía estándar de 30 días vencida el {warrantyDateStr}. Nuestro soporte evaluará tu caso para renovación con descuento.</>
                          )}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Action Requested */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white uppercase tracking-wider block">
                      2. ¿Qué Solución Requieres?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setActionRequested('renovacion')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          actionRequested === 'renovacion'
                            ? 'bg-[#FF2E93]/20 border-[#FF2E93] shadow-[0_0_15px_rgba(255,46,147,0.3)]'
                            : 'bg-[#0B0612] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <RotateCw className="w-4 h-4 text-[#FF8CC6]" />
                          <span className="text-xs font-bold text-white">Renovación / Reemplazo</span>
                        </div>
                        <p className="text-[10px] text-[#A394AE] mt-1">
                          Sustituir contraseña o que se me asigne un perfil completamente nuevo.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActionRequested('solucion')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          actionRequested === 'solucion'
                            ? 'bg-[#3DDC97]/20 border-[#3DDC97] shadow-[0_0_15px_rgba(61,220,151,0.3)]'
                            : 'bg-[#0B0612] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Wrench className="w-4 h-4 text-[#3DDC97]" />
                          <span className="text-xs font-bold text-white">Solución Técnica / Asistencia</span>
                        </div>
                        <p className="text-[10px] text-[#A394AE] mt-1">
                          Desbloquear PIN, resolver error de pantalla o recuperar acceso en mi dispositivo.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Step 3: Issue Type Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white uppercase tracking-wider block">
                      3. Tipo de Falla Detectada
                    </label>
                    <select
                      value={issueType}
                      onChange={(e) => setIssueType(e.target.value as WarrantyClaimIssueType)}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-[#0B0612] border border-white/15 text-white text-xs focus:outline-none focus:border-[#FF2E93]"
                    >
                      <option value="credenciales_incorrectas">Contraseña o correo incorrectos / Caída de membresía</option>
                      <option value="pantalla_ocupada">PIN bloqueado / Pantalla ocupada o límite de dispositivos</option>
                      <option value="geobloqueo">Error de código de hogar / Hogar Netflix / Ubicación</option>
                      <option value="enlace_caido">Enlace de Drive / APK caído o no permite descarga</option>
                      <option value="cuenta_suspendida">Cuenta suspendida por la plataforma</option>
                      <option value="otro">Otro problema técnico</option>
                    </select>
                  </div>

                  {/* Step 4: Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white uppercase tracking-wider block">
                      4. Describe la Falla
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Indica qué mensaje de error te aparece, en qué dispositivo lo estás usando o cualquier detalle para darte solución al instante..."
                      className="w-full py-2.5 px-3.5 rounded-xl bg-[#0B0612] border border-white/15 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-[#FF2E93]"
                      required
                    />
                  </div>

                  {/* Step 5: Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-[#A394AE]">Tu WhatsApp (Para enviarte credenciales/solución):</label>
                      <input
                        type="text"
                        value={customerWhatsApp}
                        onChange={(e) => setCustomerWhatsApp(e.target.value)}
                        placeholder="+52 55 1234 5678"
                        className="w-full py-2 px-3 rounded-xl bg-[#0B0612] border border-white/15 text-white text-xs focus:outline-none focus:border-[#FF2E93]"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-[#A394AE]">Tu Nombre o Alias:</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Santiago"
                        className="w-full py-2 px-3 rounded-xl bg-[#0B0612] border border-white/15 text-white text-xs focus:outline-none focus:border-[#FF2E93]"
                      />
                    </div>
                  </div>

                  {/* Step 6: Evidence Screenshot (Optional but helpful) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                      <span>Adjuntar Captura de Pantalla del Error (Opcional)</span>
                      <span className="text-[10px] text-[#A394AE]">JPG/PNG máx 4MB</span>
                    </label>

                    <div className="p-3 rounded-xl bg-[#0B0612] border border-dashed border-[#FF2E93]/40 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 truncate">
                        <Upload className="w-4 h-4 text-[#FF8CC6] shrink-0" />
                        <span className="text-xs text-[#C9C4D4] truncate">
                          {fileName ? fileName : 'Selecciona una imagen del error para resolverlo más rápido'}
                        </span>
                      </div>

                      <label className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#12091A] border border-[#FF2E93]/50 text-[#FF8CC6] hover:bg-[#FF2E93] hover:text-white cursor-pointer transition-colors shrink-0">
                        Examinar
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {evidenceUrl && (
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-[#FF2E93]/50 mt-2">
                        <img src={evidenceUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setEvidenceUrl(undefined);
                            setFileName('');
                          }}
                          className="absolute top-1 right-1 p-0.5 rounded-full bg-black/80 text-white hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider neon-btn-primary flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,46,147,0.4)]"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>Enviar Reporte y Solicitar Garantía</span>
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* TAB 2: CONSULTAR ESTADO DE MI REPORTE */}
          {activeTab === 'consultar' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Search bar */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchFolio}
                  onChange={(e) => setSearchFolio(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                  placeholder="Ingresa Folio de Garantía (GAR-XXXX) o Pedido (JNX-XXXX)..."
                  className="flex-1 py-2.5 px-3.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/40 text-white text-xs font-mono uppercase focus:outline-none focus:border-[#FF2E93]"
                />
                <button
                  type="button"
                  onClick={handleLookup}
                  className="py-2.5 px-5 rounded-xl text-xs font-bold bg-[#FF2E93] text-white hover:bg-[#d61e77] transition-all flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Buscar</span>
                </button>
              </div>

              {searchError && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
                  {searchError}
                </div>
              )}

              {/* Searched Claim Result */}
              {searchedClaim && (
                <div className="p-5 rounded-2xl bg-[#0B0612] border border-[#FF2E93]/50 space-y-4 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-white">{searchedClaim.claimNumber}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          searchedClaim.status === 'resuelto'
                            ? 'bg-[#3DDC97]/20 text-[#3DDC97] border border-[#3DDC97]/40'
                            : searchedClaim.status === 'en_revision'
                            ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                            : searchedClaim.status === 'rechazado'
                            ? 'bg-red-950 text-red-300 border border-red-500/40'
                            : 'bg-yellow-950 text-[#FFB020] border border-yellow-500/40'
                        }`}>
                          {searchedClaim.status === 'resuelto' ? 'Solucionado / Renovado' : searchedClaim.status}
                        </span>
                      </div>
                      <div className="text-xs text-[#FF8CC6] mt-0.5">{searchedClaim.productName}</div>
                    </div>

                    <div className="text-right text-[11px] text-[#A394AE]">
                      <span>Fecha: {new Date(searchedClaim.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="text-xs space-y-1.5 text-[#C9C4D4]">
                    <div>
                      <strong className="text-white">Problema reportado:</strong> {searchedClaim.description}
                    </div>
                    <div>
                      <strong className="text-white">Acción solicitada:</strong> {searchedClaim.actionRequested === 'renovacion' ? 'Renovación / Reemplazo' : 'Solución Técnica'}
                    </div>
                  </div>

                  {/* SOLUTION BOX WHEN RESOLVED */}
                  {searchedClaim.status === 'resuelto' && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-[#12091A] to-[#1A0B26] border-2 border-[#3DDC97]/60 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#3DDC97] uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>✦ Solución Aplicada por Soporte JENYX</span>
                      </div>

                      {searchedClaim.solutionDetails && (
                        <p className="text-xs text-white bg-black/40 p-2.5 rounded-lg border border-white/5">
                          {searchedClaim.solutionDetails}
                        </p>
                      )}

                      {/* Replacement credentials if any */}
                      {searchedClaim.replacementAccountEmail && (
                        <div className="p-3 rounded-lg bg-black/60 border border-[#3DDC97]/40 space-y-2">
                          <span className="text-[10px] text-[#3DDC97] font-bold uppercase tracking-wider flex items-center gap-1">
                            <Key className="w-3 h-3" /> Tus Nuevas Credenciales Renovadas
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className="p-2 rounded bg-black/40 flex items-center justify-between">
                              <span className="truncate mr-2 font-mono text-white">{searchedClaim.replacementAccountEmail}</span>
                              <button
                                onClick={() => copyText(searchedClaim.replacementAccountEmail || '', 'sol-email')}
                                className="p-1 rounded text-[#FF8CC6] hover:bg-[#FF2E93] hover:text-white"
                              >
                                {copiedKey === 'sol-email' ? <Check className="w-3.5 h-3.5 text-[#3DDC97]" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                            <div className="p-2 rounded bg-black/40 flex items-center justify-between">
                              <span className="truncate mr-2 font-mono text-white">{searchedClaim.replacementAccountPassword || '••••••••'}</span>
                              <button
                                onClick={() => copyText(searchedClaim.replacementAccountPassword || '', 'sol-pass')}
                                className="p-1 rounded text-[#FF8CC6] hover:bg-[#FF2E93] hover:text-white"
                              >
                                {copiedKey === 'sol-pass' ? <Check className="w-3.5 h-3.5 text-[#3DDC97]" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                            {searchedClaim.replacementProfilePin && (
                              <div className="p-2 rounded bg-black/40 flex items-center justify-between col-span-1 sm:col-span-2">
                                <span className="text-gray-400">PIN de Perfil Renovado:</span>
                                <span className="font-mono font-bold text-[#3DDC97] text-sm tracking-widest">{searchedClaim.replacementProfilePin}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Support WhatsApp Action */}
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-[#A394AE]">¿Aún tienes dudas sobre este caso?</span>
                    <a
                      href={`https://wa.me/${settings.whatsappSupport.replace(/\D/g, '')}?text=Hola%20JENYX%20✦%20consulto%20por%20mi%20reporte%20${searchedClaim.claimNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3DDC97] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Contactar al Soporte</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Client's List of Claims */}
              {clientClaims.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">
                    Tus Reportes Registrados ({clientClaims.length})
                  </span>

                  <div className="space-y-2">
                    {clientClaims.map(claim => (
                      <div
                        key={claim.id}
                        onClick={() => setSearchedClaim(claim)}
                        className="p-3 rounded-xl bg-[#0B0612] border border-white/10 hover:border-[#FF2E93] cursor-pointer flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <strong className="font-mono text-white">{claim.claimNumber}</strong>
                            <span className="text-[#FF8CC6]">&bull; {claim.productName}</span>
                          </div>
                          <span className="text-[11px] text-[#A394AE] line-clamp-1">
                            {claim.description}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            claim.status === 'resuelto'
                              ? 'bg-[#3DDC97]/20 text-[#3DDC97]'
                              : claim.status === 'rechazado'
                              ? 'bg-red-950 text-red-300'
                              : 'bg-yellow-950 text-yellow-300'
                          }`}>
                            {claim.status}
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
