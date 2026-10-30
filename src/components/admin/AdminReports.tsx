import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Tv, 
  CreditCard, 
  CheckCircle2, 
  ShieldAlert, 
  ShieldCheck, 
  RotateCw, 
  Wrench, 
  MessageCircle, 
  AlertTriangle, 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  Eye, 
  X, 
  CheckCheck, 
  Clock, 
  Sparkles,
  Key,
  Trash2
} from 'lucide-react';
import { WarrantyClaim, WarrantyClaimStatus } from '../../types';

export const AdminReports: React.FC = () => {
  const { 
    orders, 
    categories, 
    metrics, 
    warrantyClaims, 
    resolveWarrantyClaim, 
    updateWarrantyClaimStatus, 
    deleteWarrantyClaim,
    accounts,
    settings 
  } = useStore();

  const [activeMainTab, setActiveMainTab] = useState<'garantias' | 'financiero'>('garantias');
  
  // Warranty Filters & Search
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClaim, setSelectedClaim] = useState<WarrantyClaim | null>(null);
  
  // Solution Modal State
  const [solutionModalClaim, setSolutionModalClaim] = useState<WarrantyClaim | null>(null);
  const [solutionText, setSolutionText] = useState('');
  const [autoReplaceProfile, setAutoReplaceProfile] = useState(true);
  const [customPin, setCustomPin] = useState('');

  // Image Preview Modal
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Financial Stats Calculation
  const approvedOrders = orders.filter(o => o.status === 'aprobado' || o.status === 'entregado');
  const totalRevenue = metrics.totalRevenue;
  const avgOrderValue = approvedOrders.length > 0 ? Math.round(totalRevenue / approvedOrders.length) : 0;

  // Breakdown by Category
  const categoryStats = categories.map(cat => {
    const catOrders = approvedOrders.filter(o => o.categoryId === cat.id);
    const rev = catOrders.reduce((sum, o) => sum + (o.price || 0), 0);
    const percent = totalRevenue > 0 ? Math.round((rev / totalRevenue) * 100) : 0;
    return {
      id: cat.id,
      name: cat.name,
      color: cat.color,
      count: catOrders.length,
      revenue: rev,
      percentage: percent
    };
  }).filter(c => c.revenue > 0).sort((a, b) => b.revenue - a.revenue);

  // Breakdown by Payment Method
  const paymentStats = (['transferencia', 'oxxo', 'deposito'] as const).map(method => {
    const methodOrders = approvedOrders.filter(o => o.paymentMethod === method);
    const rev = methodOrders.reduce((sum, o) => sum + (o.price || 0), 0);
    const percent = totalRevenue > 0 ? Math.round((rev / totalRevenue) * 100) : 0;
    const label = method === 'transferencia' ? 'SPEI / Transferencia BBVA' : method === 'oxxo' ? 'Depósito en OXXO' : 'Depósito en Ventanilla';
    return {
      method,
      label,
      count: methodOrders.length,
      revenue: rev,
      percentage: percent
    };
  });

  // Filtered Claims
  const filteredClaims = warrantyClaims.filter(claim => {
    if (filterStatus !== 'todos' && claim.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        claim.claimNumber.toLowerCase().includes(q) ||
        claim.orderNumber.toLowerCase().includes(q) ||
        claim.customerName.toLowerCase().includes(q) ||
        claim.customerWhatsApp.toLowerCase().includes(q) ||
        claim.productName.toLowerCase().includes(q) ||
        claim.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const openClaimsCount = warrantyClaims.filter(c => c.status === 'abierto' || c.status === 'en_revision').length;
  const resolvedClaimsCount = warrantyClaims.filter(c => c.status === 'resuelto').length;

  const copyText = (txt: string, keyName: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleOpenSolutionModal = (claim: WarrantyClaim) => {
    setSolutionModalClaim(claim);
    setAutoReplaceProfile(claim.actionRequested === 'renovacion');
    setCustomPin('');
    setSolutionText(
      claim.actionRequested === 'renovacion'
        ? `✦ Solución de Garantía JENYX: Se te ha asignado un reemplazo de perfil limpio y funcional para ${claim.productName}. Disfruta tu servicio con cobertura total.`
        : `✦ Soporte JENYX: Se ha revisado tu reporte técnico. Se reestableció el acceso y se verificó la conexión.`
    );
  };

  const handleApplySolution = () => {
    if (!solutionModalClaim) return;
    resolveWarrantyClaim(solutionModalClaim.id, solutionText, {
      autoReplaceProfile,
      replacementPin: customPin || undefined
    });
    setSolutionModalClaim(null);
  };

  const handleQuickAutoRenew = (claim: WarrantyClaim) => {
    const text = `✦ Garantía Aplicada: Perfil reemplazado de manera automática por soporte JENYX para ${claim.productName}.`;
    resolveWarrantyClaim(claim.id, text, { autoReplaceProfile: true });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header and Master Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#FF8CC6]">
            ✦ Panel de Administración &bull; Operaciones
          </span>
          <h2 className="text-2xl font-bold font-cinzel text-white mt-0.5">
            Soporte, Garantías & Reportes
          </h2>
          <p className="text-xs text-[#A394AE]">
            Gestiona reclamos de garantía, reemplazos de perfiles caídos y analítica comercial.
          </p>
        </div>

        {/* Master Tab Buttons */}
        <div className="flex items-center gap-2 bg-[#0B0612] p-1.5 rounded-2xl border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveMainTab('garantias')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeMainTab === 'garantias'
                ? 'bg-[#FF2E93] text-white shadow-[0_0_15px_rgba(255,46,147,0.4)]'
                : 'text-[#C9C4D4] hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Garantías & Fallas</span>
            {openClaimsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-white text-[#FF2E93]">
                {openClaimsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveMainTab('financiero')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeMainTab === 'financiero'
                ? 'bg-[#3DDC97] text-[#07040C] shadow-[0_0_15px_rgba(61,220,151,0.4)]'
                : 'text-[#C9C4D4] hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analítica Financiera</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: CENTRO DE GARANTÍAS & REPORTES DE CLIENTES   */}
      {/* ========================================================= */}
      {activeMainTab === 'garantias' && (
        <div className="space-y-6">
          
          {/* Top KPI Cards for Warranty Claims */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="goth-card rounded-2xl p-4 border-[#FF2E93]/40 shadow-[0_0_15px_rgba(255,46,147,0.15)]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#A394AE]">Abiertos / Pendientes</span>
                <ShieldAlert className="w-4 h-4 text-[#FF2E93]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#FF2E93] mt-2">
                {openClaimsCount}
              </div>
              <span className="text-[10px] text-[#A394AE] mt-0.5 block">
                Requieren atención
              </span>
            </div>

            <div className="goth-card rounded-2xl p-4 border-[#3DDC97]/40 shadow-[0_0_15px_rgba(61,220,151,0.15)]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#A394AE]">Solucionados / Renovados</span>
                <CheckCircle2 className="w-4 h-4 text-[#3DDC97]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#3DDC97] mt-2">
                {resolvedClaimsCount}
              </div>
              <span className="text-[10px] text-[#A394AE] mt-0.5 block">
                Garantías cubiertas
              </span>
            </div>

            <div className="goth-card rounded-2xl p-4 border-blue-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#A394AE]">Perfiles Libres en Stock</span>
                <Tv className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-blue-300 mt-2">
                {metrics.freeProfilesCount}
              </div>
              <span className="text-[10px] text-[#A394AE] mt-0.5 block">
                Listos para reemplazo
              </span>
            </div>

            <div className="goth-card rounded-2xl p-4 border-purple-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#A394AE]">Periodo de Cobertura</span>
                <Clock className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-purple-300 mt-2">
                30 Días
              </div>
              <span className="text-[10px] text-[#A394AE] mt-0.5 block">
                Garantía oficial JENYX
              </span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="goth-card rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#A394AE] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por Folio (GAR-XXXX), Pedido (JNX-XXXX), Cliente o WhatsApp..."
                className="w-full py-2 pl-9 pr-3.5 rounded-xl bg-[#0B0612] border border-white/10 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-[#FF2E93]"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(['todos', 'abierto', 'en_revision', 'resuelto', 'rechazado'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    filterStatus === st
                      ? 'bg-[#FF2E93] text-white'
                      : 'bg-[#0B0612] text-[#A394AE] hover:text-white border border-white/5'
                  }`}
                >
                  {st === 'todos' ? 'Todos' : st === 'abierto' ? 'Abiertos' : st === 'en_revision' ? 'En Revisión' : st === 'resuelto' ? 'Resueltos' : 'Rechazados'}
                </button>
              ))}
            </div>
          </div>

          {/* Claims List */}
          {filteredClaims.length === 0 ? (
            <div className="text-center py-16 goth-card rounded-2xl border-white/5 space-y-3">
              <ShieldCheck className="w-12 h-12 text-[#3DDC97] mx-auto opacity-70" />
              <h3 className="text-base font-bold text-white">No hay reclamos en esta categoría</h3>
              <p className="text-xs text-[#A394AE] max-w-sm mx-auto">
                Excelente. Todas las suscripciones están funcionando con normalidad o no hay reportes pendientes con ese filtro.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredClaims.map((claim) => {
                const isOpen = claim.status === 'abierto';
                const isRevision = claim.status === 'en_revision';
                const isResolved = claim.status === 'resuelto';
                const isRejected = claim.status === 'rechazado';

                return (
                  <div
                    key={claim.id}
                    className={`goth-card rounded-2xl p-5 border transition-all ${
                      isOpen
                        ? 'border-[#FF2E93]/60 shadow-[0_0_20px_rgba(255,46,147,0.15)]'
                        : isRevision
                        ? 'border-blue-500/50'
                        : isResolved
                        ? 'border-[#3DDC97]/40'
                        : 'border-white/10 opacity-75'
                    }`}
                  >
                    {/* Top Row: Claim & Order Identifiers */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-black text-white">{claim.claimNumber}</span>
                          <span className="text-xs text-gray-400">&bull;</span>
                          <span className="font-mono text-xs text-[#FF8CC6]">Pedido: {claim.orderNumber}</span>
                        </div>

                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isResolved
                            ? 'bg-[#3DDC97]/20 text-[#3DDC97] border border-[#3DDC97]/40'
                            : isRevision
                            ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                            : isRejected
                            ? 'bg-red-950 text-red-300 border border-red-500/40'
                            : 'bg-[#FF2E93]/20 text-[#FF8CC6] border border-[#FF2E93]/50 animate-pulse'
                        }`}>
                          {claim.status === 'resuelto' ? '✦ Resuelto / Renovado' : claim.status === 'en_revision' ? 'En Revisión' : claim.status === 'rechazado' ? 'Rechazado' : 'Abierto &bull; Acción Requerida'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#A394AE]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(claim.createdAt).toLocaleString()}
                        </span>
                        {claim.isWithinWarranty ? (
                          <span className="px-2 py-0.5 rounded bg-[#3DDC97]/15 text-[#3DDC97] border border-[#3DDC97]/30 text-[10px] font-bold">
                            ✦ Dentro de Garantía (Vence {claim.warrantyValidUntil})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-yellow-950/60 text-[#FFB020] border border-yellow-500/30 text-[10px]">
                            Garantía vencida el {claim.warrantyValidUntil}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Middle: Details & Client Data */}
                    <div className="py-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                      
                      {/* Col 1: Customer & Product */}
                      <div className="space-y-1.5 text-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#A394AE]">
                          Cliente & Servicio
                        </span>
                        <div className="font-semibold text-white text-sm">{claim.customerName}</div>
                        <div className="text-[#FF8CC6] flex items-center gap-1">
                          <span>WhatsApp: <strong>{claim.customerWhatsApp}</strong></span>
                        </div>
                        {claim.customerEmail && (
                          <div className="text-[#A394AE]">{claim.customerEmail}</div>
                        )}
                        <div className="pt-1 text-white font-medium">
                          {claim.productName}
                        </div>
                      </div>

                      {/* Col 2: Action Requested & Issue description */}
                      <div className="space-y-1.5 text-xs lg:col-span-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A394AE]">
                            Detalle del Problema & Solicitud
                          </span>
                          
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-[#12091A] border border-[#FF2E93]/40 text-[#FF8CC6] text-[10px] font-bold">
                              {claim.actionRequested === 'renovacion' ? '⚡ Pide Renovación / Reemplazo' : '🔧 Pide Solución Técnica'}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10 text-yellow-300 text-[10px] capitalize">
                              {claim.issueType.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-black/50 border border-white/5 text-white leading-relaxed">
                          "{claim.description}"
                        </div>

                        {/* Evidence preview if uploaded */}
                        {claim.evidenceUrl && (
                          <div className="pt-1 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setPreviewImage(claim.evidenceUrl || null)}
                              className="px-2.5 py-1 rounded-lg bg-[#0B0612] border border-[#FF2E93]/30 text-xs text-[#FF8CC6] hover:text-white flex items-center gap-1.5 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#FF2E93]" />
                              <span>Ver captura adjunta del error</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Resolution Details (If already resolved) */}
                    {isResolved && (
                      <div className="mt-2 p-4 rounded-xl bg-[#0B0612] border border-[#3DDC97]/40 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#3DDC97] flex items-center gap-1.5">
                            <CheckCheck className="w-3.5 h-3.5" /> Solución Registrada por el Administrador
                          </span>
                          <span className="text-[10px] text-[#A394AE]">
                            Resuelto: {claim.resolvedAt ? new Date(claim.resolvedAt).toLocaleString() : 'Recientemente'}
                          </span>
                        </div>
                        <p className="text-white bg-black/40 p-2.5 rounded-lg border border-white/5">
                          {claim.solutionDetails || 'Garantía aplicada y credenciales actualizadas.'}
                        </p>

                        {claim.replacementAccountEmail && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                            <div className="p-2 rounded bg-black/50 border border-white/10 flex items-center justify-between">
                              <span className="truncate mr-1 text-white">{claim.replacementAccountEmail}</span>
                              <button onClick={() => copyText(claim.replacementAccountEmail || '', `mail-${claim.id}`)} className="p-1 text-[#FF8CC6]">
                                {copiedKey === `mail-${claim.id}` ? <Check className="w-3.5 h-3.5 text-[#3DDC97]" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                            <div className="p-2 rounded bg-black/50 border border-white/10 flex items-center justify-between">
                              <span className="truncate mr-1 text-white">{claim.replacementAccountPassword || '••••••'}</span>
                              <button onClick={() => copyText(claim.replacementAccountPassword || '', `pass-${claim.id}`)} className="p-1 text-[#FF8CC6]">
                                {copiedKey === `pass-${claim.id}` ? <Check className="w-3.5 h-3.5 text-[#3DDC97]" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                            {claim.replacementProfilePin && (
                              <div className="p-2 rounded bg-black/50 border border-white/10 flex items-center justify-between">
                                <span className="text-gray-400">PIN: <strong className="text-[#3DDC97]">{claim.replacementProfilePin}</strong></span>
                                <button onClick={() => copyText(claim.replacementProfilePin || '', `pin-${claim.id}`)} className="p-1 text-[#FF8CC6]">
                                  {copiedKey === `pin-${claim.id}` ? <Check className="w-3.5 h-3.5 text-[#3DDC97]" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Bar for Operator */}
                    <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* 1-Click Fast Auto-Renew button */}
                        {!isResolved && (
                          <button
                            onClick={() => handleQuickAutoRenew(claim)}
                            className="py-2 px-3 rounded-xl font-bold bg-[#3DDC97] text-[#07040C] hover:bg-[#34c485] flex items-center gap-1.5 shadow-[0_0_12px_rgba(61,220,151,0.3)] transition-all"
                            title="Asigna automáticamente un perfil libre activo de esta categoría al cliente y marca como resuelto"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                            <span>1-Clic Auto-Renovar Perfil</span>
                          </button>
                        )}

                        {/* Custom Solution Modal Button */}
                        <button
                          onClick={() => handleOpenSolutionModal(claim)}
                          className="py-2 px-3 rounded-xl font-bold bg-[#12091A] border border-[#FF2E93] text-[#FF8CC6] hover:bg-[#FF2E93] hover:text-white flex items-center gap-1.5 transition-all"
                        >
                          <Wrench className="w-3.5 h-3.5 text-[#FF2E93]" />
                          <span>{isResolved ? 'Editar Solución' : 'Dar Solución Técnica'}</span>
                        </button>

                        {/* Status toggles */}
                        {isOpen && (
                          <button
                            onClick={() => updateWarrantyClaimStatus(claim.id, 'en_revision')}
                            className="py-2 px-3 rounded-xl font-semibold bg-[#0B0612] border border-blue-500/40 text-blue-300 hover:bg-blue-950 transition-colors"
                          >
                            Marcar en Revisión
                          </button>
                        )}

                        {!isRejected && !isResolved && (
                          <button
                            onClick={() => {
                              const reason = prompt('Motivo del rechazo de garantía (opcional):', 'Garantía expirada o mal uso');
                              if (reason !== null) {
                                updateWarrantyClaimStatus(claim.id, 'rechazado', reason);
                              }
                            }}
                            className="py-2 px-2.5 rounded-xl font-semibold bg-[#0B0612] border border-red-500/30 text-red-400 hover:bg-red-950/60 transition-colors"
                          >
                            Rechazar
                          </button>
                        )}
                      </div>

                      {/* WhatsApp Direct Notification */}
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/${claim.customerWhatsApp.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `✦ *JENYX DIGITAL SERVICES* ✦\n` +
                            `Hola *${claim.customerName}*, te contactamos por tu reporte de garantía *${claim.claimNumber}* para el pedido *${claim.orderNumber}* (${claim.productName}).\n\n` +
                            (claim.status === 'resuelto' 
                              ? `✅ *ESTADO: SOLUCIONADO*\n${claim.solutionDetails || 'Se ha reactivado tu servicio bajo tu garantía oficial.'}\n\n` +
                                (claim.replacementAccountEmail ? `🔑 *Nuevos Accesos:*\nCorreo: ${claim.replacementAccountEmail}\nContraseña: ${claim.replacementAccountPassword}\nPIN: ${claim.replacementProfilePin || '0000'}\n\n` : '') +
                                `¡Gracias por confiar en JENYX! Tu mundo digital, a tu estilo. ✦`
                              : `⏳ *ESTADO: EN ATENCIÓN*\nEstamos revisando tu caso prioritariamente. En breve te enviamos tus nuevas credenciales o solución.`)
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-3.5 rounded-xl font-bold bg-[#3DDC97]/15 border border-[#3DDC97]/60 text-[#3DDC97] hover:bg-[#3DDC97] hover:text-[#07040C] flex items-center gap-1.5 transition-all"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>Notificar por WhatsApp</span>
                        </a>

                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar reporte ${claim.claimNumber}?`)) {
                              deleteWarrantyClaim(claim.id);
                            }
                          }}
                          className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                          title="Eliminar reporte"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 2: ANALÍTICA FINANCIERA & RENDIMIENTO DE VENTAS   */}
      {/* ========================================================= */}
      {activeMainTab === 'financiero' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="goth-card rounded-2xl p-5 border-[#3DDC97]/40 shadow-[0_0_20px_rgba(61,220,151,0.15)]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#A394AE]">Ingresos Totales</span>
                <DollarSign className="w-5 h-5 text-[#3DDC97]" />
              </div>
              <div className="text-3xl font-black text-[#3DDC97] mt-2">
                ${totalRevenue} <span className="text-xs font-normal text-white">MXN</span>
              </div>
              <span className="text-[11px] text-[#A394AE] mt-1 block">
                {approvedOrders.length} pedidos finalizados
              </span>
            </div>

            <div className="goth-card rounded-2xl p-5 border-[#FF2E93]/40 shadow-[0_0_20px_rgba(255,46,147,0.15)]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#A394AE]">Ticket Promedio</span>
                <TrendingUp className="w-5 h-5 text-[#FF2E93]" />
              </div>
              <div className="text-3xl font-black text-white mt-2">
                ${avgOrderValue} <span className="text-xs font-normal text-[#FF8CC6]">MXN / compra</span>
              </div>
              <span className="text-[11px] text-[#A394AE] mt-1 block">
                Promedio por cliente
              </span>
            </div>

            <div className="goth-card rounded-2xl p-5 border-blue-500/40">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#A394AE]">Tasa de Conversión</span>
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl font-black text-blue-300 mt-2">
                {orders.length > 0 ? Math.round((approvedOrders.length / orders.length) * 100) : 0}%
              </div>
              <span className="text-[11px] text-[#A394AE] mt-1 block">
                Pedidos pagados vs registrados
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales by Platform / Category */}
            <div className="goth-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Tv className="w-4 h-4 text-[#FF2E93]" />
                  Ingresos por Plataforma de Streaming
                </h3>
                <span className="text-xs text-[#FF8CC6]">Ranking</span>
              </div>

              <div className="space-y-4">
                {categoryStats.length === 0 ? (
                  <span className="text-gray-500 text-xs italic">Sin ventas registradas todavía.</span>
                ) : (
                  categoryStats.map(stat => (
                    <div key={stat.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stat.color }} />
                          {stat.name}
                        </span>
                        <span className="text-[#3DDC97] font-bold">
                          ${stat.revenue} MXN ({stat.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden border border-white/5">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${stat.percentage}%`, backgroundColor: stat.color || '#FF2E93' }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Sales by Payment Method */}
            <div className="goth-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#3DDC97]" />
                  Distribución por Método de Pago
                </h3>
                <span className="text-xs text-[#3DDC97]">Canales</span>
              </div>

              <div className="space-y-4">
                {paymentStats.map(stat => (
                  <div key={stat.method} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{stat.label}</span>
                      <span className="text-white font-mono">
                        ${stat.revenue} MXN <span className="text-[#A394AE]">({stat.count} transacciones)</span>
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden border border-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#FF2E93] to-[#3DDC97] transition-all duration-500"
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DAR SOLUCIÓN PERSONALIZADA / RENOVAR               */}
      {/* ========================================================= */}
      {solutionModalClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#12091A] border-2 border-[#3DDC97]/70 rounded-3xl p-6 space-y-4 shadow-[0_0_50px_rgba(61,220,151,0.3)]">
            <button
              onClick={() => setSolutionModalClaim(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-white/10 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3DDC97]">
                ✦ Aplicar Garantía & Resolver Falla
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Folio: {solutionModalClaim.claimNumber} ({solutionModalClaim.orderNumber})
              </h3>
              <p className="text-xs text-[#A394AE]">
                Cliente: <strong>{solutionModalClaim.customerName}</strong> &bull; {solutionModalClaim.productName}
              </p>
            </div>

            {/* Option to automatically assign fresh profile */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-[#3DDC97]/40 space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-white">
                <input
                  type="checkbox"
                  checked={autoReplaceProfile}
                  onChange={(e) => setAutoReplaceProfile(e.target.checked)}
                  className="rounded text-[#3DDC97] focus:ring-0"
                />
                <span>⚡ Auto-asignar un perfil libre del inventario</span>
              </label>
              <p className="text-[11px] text-[#A394AE] pl-6">
                Busca automáticamente una cuenta madre activa con perfil libre, actualiza el pedido y adjunta las nuevas credenciales al cliente.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">
                PIN de Perfil Personalizado (Opcional):
              </label>
              <input
                type="text"
                value={customPin}
                onChange={(e) => setCustomPin(e.target.value)}
                placeholder="ej. 7722 (deja vacío para usar el PIN de la cuenta)"
                className="w-full py-2 px-3 rounded-xl bg-[#0B0612] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#3DDC97]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">
                Mensaje de Solución / Instrucciones para el Cliente:
              </label>
              <textarea
                rows={4}
                value={solutionText}
                onChange={(e) => setSolutionText(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#0B0612] border border-white/15 text-white text-xs focus:outline-none focus:border-[#3DDC97]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSolutionModalClaim(null)}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#0B0612] border border-white/10 text-[#C9C4D4] hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleApplySolution}
                className="py-2.5 px-5 rounded-xl text-xs font-bold bg-[#3DDC97] text-[#07040C] hover:bg-[#2fc081] flex items-center gap-1.5 shadow-[0_0_15px_rgba(61,220,151,0.3)] transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Aplicar Solución y Marcar Resuelto</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: IMAGE ZOOM PREVIEW                                 */}
      {/* ========================================================= */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden border border-[#FF2E93]/60 bg-[#0B0612] p-2">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/80 text-white hover:text-red-400"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={previewImage} alt="Captura del error" className="max-w-full max-h-[85vh] object-contain rounded-xl" />
          </div>
        </div>
      )}

    </div>
  );
};
