import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Client } from '../../types';
import { 
  Users, 
  Search, 
  MessageCircle, 
  Calendar, 
  Clock, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  Download,
  Upload,
  FileSpreadsheet,
  X,
  Check,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  History
} from 'lucide-react';

export const AdminClients: React.FC = () => {
  const { 
    clients, 
    updateClient, 
    deleteClient, 
    creditClientBalance,
    exportClientsCSV, 
    importClientsCSV 
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<Client['status']>('activo');

  // Balance Credit Modal
  const [balanceModalClient, setBalanceModalClient] = useState<Client | null>(null);
  const [creditAmount, setCreditAmount] = useState<string>('100');
  const [creditReason, setCreditReason] = useState<string>('Abono por recarga SPEI');
  const [creditType, setCreditType] = useState<'abono' | 'cargo'>('abono');
  const [creditSuccessMsg, setCreditSuccessMsg] = useState<string | null>(null);

  // CSV Import Modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [importResult, setImportResult] = useState<{ imported: number; errors: string[] } | null>(null);

  const filteredClients = clients.filter(c => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.whatsapp.includes(q) || c.email?.toLowerCase().includes(q);
    }
    return true;
  });

  const openEdit = (c: Client) => {
    setEditingClient(c);
    setNotes(c.notes || '');
    setStatus(c.status);
  };

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    updateClient({
      ...editingClient,
      notes,
      status
    });
    setEditingClient(null);
  };

  const openBalanceModal = (c: Client) => {
    setBalanceModalClient(c);
    setCreditAmount('100');
    setCreditReason('Abono por recarga SPEI');
    setCreditType('abono');
    setCreditSuccessMsg(null);
  };

  const handleApplyBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!balanceModalClient) return;
    const num = parseFloat(creditAmount);
    if (isNaN(num) || num <= 0) return;

    creditClientBalance(balanceModalClient.id, num, creditReason, creditType);
    
    // Refresh modal client
    const updated = clients.find(c => c.id === balanceModalClient.id);
    if (updated) {
      const newBal = creditType === 'abono' 
        ? (balanceModalClient.balance || 0) + num 
        : Math.max(0, (balanceModalClient.balance || 0) - num);
      setBalanceModalClient({ ...balanceModalClient, balance: newBal });
    }

    setCreditSuccessMsg(`¡Saldo de $${num} MXN ${creditType === 'abono' ? 'acreditado' : 'descontado'} con éxito!`);
    setTimeout(() => setCreditSuccessMsg(null), 3000);
  };

  const handleExportCSV = () => {
    const csv = exportClientsCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `clientes_jenyx_${new Date().toISOString().split('T')[0]}.csv`);
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
    const res = importClientsCSV(csvContent);
    setImportResult(res);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#FF8CC6] flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#FF2E93]" /> Directorio de Clientes & Saldo
          </span>
          <h2 className="text-2xl font-bold font-cinzel text-white mt-1">
            Gestión de Clientes ({clients.length})
          </h2>
          <p className="text-xs text-[#A394AE]">
            Clientes registrados, historial de pedidos, acreditación de saldo en billetera y alertas de vencimiento.
          </p>
        </div>

        {/* CSV Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              setCsvContent('');
              setImportResult(null);
              setShowImportModal(true);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#12091A] border border-[#FF2E93]/40 text-[#FF8CC6] hover:bg-[#FF2E93]/20 flex items-center gap-2 transition-all shadow-[0_0_12px_rgba(255,46,147,0.2)]"
          >
            <Upload className="w-4 h-4 text-[#FF2E93]" />
            <span>Subir / Importar CSV</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0B0612] border border-white/10 text-white hover:border-[#FF2E93] flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-[#3DDC97]" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="goth-card rounded-2xl p-4">
          <span className="text-[11px] text-[#A394AE] uppercase font-bold block">Total Clientes</span>
          <div className="text-2xl font-black text-white mt-1">{clients.length}</div>
          <span className="text-[10px] text-[#3DDC97]">100% en base de datos</span>
        </div>

        <div className="goth-card rounded-2xl p-4">
          <span className="text-[11px] text-[#A394AE] uppercase font-bold block">Registrados con Clave</span>
          <div className="text-2xl font-black text-[#FF8CC6] mt-1">
            {clients.filter(c => c.registered || c.password).length}
          </div>
          <span className="text-[10px] text-gray-400">Tienen portal privado</span>
        </div>

        <div className="goth-card rounded-2xl p-4">
          <span className="text-[11px] text-[#A394AE] uppercase font-bold block">Saldo Total Clientes</span>
          <div className="text-2xl font-black text-[#3DDC97] mt-1">
            ${clients.reduce((acc, c) => acc + (c.balance || 0), 0)} MXN
          </div>
          <span className="text-[10px] text-gray-400">En billeteras activas</span>
        </div>

        <div className="goth-card rounded-2xl p-4">
          <span className="text-[11px] text-[#A394AE] uppercase font-bold block">Por Vencer (48h)</span>
          <div className="text-2xl font-black text-[#FFB020] mt-1">
            {clients.filter(c => c.status === 'por_vencer').length}
          </div>
          <span className="text-[10px] text-[#FFB020]">Requieren aviso WhatsApp</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="w-full sm:w-80 relative">
        <Search className="w-4 h-4 text-[#FF8CC6] absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Buscar por nombre, teléfono o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#12091A] border border-[#FF2E93]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF2E93] text-xs"
        />
      </div>

      {/* Clients Table */}
      <div className="goth-card rounded-2xl overflow-hidden border border-[#FF2E93]/25 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0612] text-[#FF8CC6] uppercase font-bold tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">WhatsApp</th>
                <th className="py-3 px-4">Saldo Billetera</th>
                <th className="py-3 px-4">Portal Cliente</th>
                <th className="py-3 px-4">Compras</th>
                <th className="py-3 px-4">Accesos</th>
                <th className="py-3 px-4">Próx. Vence</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredClients.map((cli) => {
                const isExpiringSoon = cli.status === 'por_vencer';
                const isExpired = cli.status === 'vencido';
                const bal = cli.balance || 0;

                return (
                  <tr key={cli.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <strong className="text-white block text-sm">{cli.name}</strong>
                      <span className="text-[11px] text-gray-400">{cli.email || 'Sin correo'}</span>
                      {cli.notes && (
                        <div className="text-[10px] text-[#FF8CC6] italic mt-0.5 truncate max-w-[180px]">
                          "{cli.notes}"
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <a
                        href={`https://wa.me/${cli.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#3DDC97] hover:underline flex items-center gap-1.5 font-mono text-[11px]"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{cli.whatsapp}</span>
                      </a>
                    </td>

                    {/* Saldo Billetera Column */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 ${
                          bal > 0 
                            ? 'bg-emerald-950/80 text-[#3DDC97] border border-[#3DDC97]/40 shadow-[0_0_10px_rgba(61,220,151,0.2)]'
                            : 'bg-black/40 text-gray-400 border border-white/5'
                        }`}>
                          <Wallet className="w-3.5 h-3.5" />
                          <span>${bal} MXN</span>
                        </span>
                        <button
                          onClick={() => openBalanceModal(cli)}
                          className="p-1 rounded bg-[#3DDC97]/20 hover:bg-[#3DDC97] text-[#3DDC97] hover:text-[#07040C] transition-colors"
                          title="Acreditar / Modificar Saldo"
                        >
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {cli.registered || cli.password ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#3DDC97]/20 text-[#3DDC97] border border-[#3DDC97]/40 flex items-center gap-1 w-max">
                          <Check className="w-3 h-3" /> Registrado
                        </span>
                      ) : (
                        <span className="text-gray-500 text-[10px]">Solo comprador</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{cli.totalOrders} pedidos</div>
                      <div className="text-[11px] text-[#3DDC97]">${cli.totalSpent} MXN</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        cli.activeSubscriptions > 0 ? 'bg-[#3DDC97]/20 text-[#3DDC97]' : 'bg-gray-800 text-gray-400'
                      }`}>
                        {cli.activeSubscriptions} activas
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {cli.nextExpirationDate ? (
                        <span className={`flex items-center gap-1 font-mono text-[11px] ${
                          isExpiringSoon ? 'text-[#FFB020] font-bold' : isExpired ? 'text-red-400 font-bold' : 'text-gray-300'
                        }`}>
                          <Calendar className="w-3 h-3" />
                          <span>{cli.nextExpirationDate}</span>
                        </span>
                      ) : (
                        <span className="text-gray-500 text-[11px]">-</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        cli.status === 'activo'
                          ? 'bg-[#3DDC97]/20 text-[#3DDC97]'
                          : cli.status === 'por_vencer'
                          ? 'bg-yellow-950/70 text-[#FFB020] border border-yellow-500/40'
                          : 'bg-red-950/70 text-red-300 border border-red-500/40'
                      }`}>
                        {cli.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openBalanceModal(cli)}
                          className="p-1.5 rounded-lg bg-[#3DDC97]/20 hover:bg-[#3DDC97] text-[#3DDC97] hover:text-[#07040C] transition-colors"
                          title="Acreditar Saldo a Favor"
                        >
                          <Wallet className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={`https://wa.me/${cli.whatsapp.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(cli.name)}%20✦%20te%20escribimos%20de%20JENYX`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-[#3DDC97]/20 hover:bg-[#3DDC97] text-[#3DDC97] hover:text-[#07040C] transition-colors"
                          title="Enviar mensaje WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => openEdit(cli)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white"
                          title="Editar notas y estado"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar al cliente ${cli.name}?`)) {
                              deleteClient(cli.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-950/40"
                          title="Eliminar cliente"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ACREDITAR SALDO EN ADMIN */}
      {balanceModalClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#12091A] border-2 border-[#3DDC97] rounded-3xl p-6 sm:p-7 space-y-5 shadow-[0_0_40px_rgba(61,220,151,0.3)]">
            <button
              onClick={() => setBalanceModalClient(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#0B0612] text-[#C9C4D4] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="p-3 rounded-2xl bg-[#3DDC97]/20 border border-[#3DDC97]/40 text-[#3DDC97]">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF8CC6]">
                  ✦ Monedero Digital JENYX
                </span>
                <h3 className="text-xl font-bold font-cinzel text-white">
                  Acreditar Saldo a {balanceModalClient.name}
                </h3>
                <p className="text-xs text-[#A394AE]">WhatsApp: {balanceModalClient.whatsapp}</p>
              </div>
            </div>

            {/* Current Balance Display */}
            <div className="p-4 rounded-2xl bg-[#0B0612] border border-[#3DDC97]/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#A394AE] uppercase block">Saldo Actual Disponible:</span>
                <div className="text-3xl font-black text-[#3DDC97] mt-0.5">
                  ${balanceModalClient.balance || 0} <span className="text-xs text-gray-400 font-normal">MXN</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#3DDC97]/20 text-[#3DDC97] text-xs font-semibold border border-[#3DDC97]/40">
                Billetera Activa
              </span>
            </div>

            {creditSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{creditSuccessMsg}</span>
              </div>
            )}

            {/* Action Form */}
            <form onSubmit={handleApplyBalance} className="space-y-4 text-xs">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 p-1 rounded-xl bg-[#0B0612] border border-white/10">
                <button
                  type="button"
                  onClick={() => setCreditType('abono')}
                  className={`py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                    creditType === 'abono'
                      ? 'bg-[#3DDC97] text-[#07040C] shadow-[0_0_10px_#3DDC97]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Abonar Saldo (+)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCreditType('cargo')}
                  className={`py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                    creditType === 'cargo'
                      ? 'bg-[#FF4D6D] text-white shadow-[0_0_10px_#FF4D6D]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>Descontar Saldo (-)</span>
                </button>
              </div>

              {/* Amount Quick Pills */}
              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1.5">Monto en Pesos Mexicanos ($ MXN):</label>
                <div className="flex items-center gap-2 mb-2">
                  {[50, 100, 200, 500].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setCreditAmount(val.toString())}
                      className="px-3 py-1 rounded-lg bg-[#0B0612] border border-[#3DDC97]/30 text-white hover:border-[#3DDC97] text-xs font-bold"
                    >
                      ${val} MXN
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0612] border border-[#3DDC97]/40 text-white font-mono text-base font-bold focus:outline-none focus:border-[#3DDC97]"
                />
              </div>

              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1.5">Motivo / Concepto del Movimiento:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Recarga SPEI comprobante #9812, Diamantes, etc."
                  value={creditReason}
                  onChange={(e) => setCreditReason(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-[#0B0612] border border-white/10 text-white text-xs focus:outline-none focus:border-[#3DDC97]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl font-bold text-sm tracking-wide bg-[#3DDC97] text-[#07040C] hover:bg-[#34c485] shadow-[0_0_20px_rgba(61,220,151,0.4)] flex items-center justify-center gap-2 transition-all mt-2"
              >
                <Check className="w-4 h-4" />
                <span>Aplicar Movimiento de Saldo</span>
              </button>
            </form>

            {/* History preview */}
            {balanceModalClient.balanceHistory && balanceModalClient.balanceHistory.length > 0 && (
              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#A394AE] flex items-center gap-1">
                  <History className="w-3.5 h-3.5" /> Últimos Movimientos de Saldo:
                </span>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                  {balanceModalClient.balanceHistory.slice(0, 5).map(tx => (
                    <div key={tx.id} className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-[11px]">
                      <div>
                        <span className="font-semibold text-white block">{tx.reason}</span>
                        <span className="text-[10px] text-gray-500">{new Date(tx.date).toLocaleDateString('es-MX')} &bull; por {tx.adminName || 'Admin'}</span>
                      </div>
                      <span className={`font-mono font-bold ${tx.type === 'abono' ? 'text-[#3DDC97]' : 'text-red-400'}`}>
                        {tx.type === 'abono' ? `+$${tx.amount}` : `-$${tx.amount}`} MXN
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: SUBIR / IMPORTAR CSV */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#12091A] border-2 border-[#FF2E93] rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold font-cinzel text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#FF2E93]" />
                Importar Clientes desde CSV
              </h3>
              <button 
                onClick={() => setShowImportModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#C9C4D4]">
              Carga un archivo CSV con las columnas: <code>Nombre, WhatsApp, Email, Pedidos, Activas, TotalGastado, Estado, ProximoVence, Notas</code>.
            </p>

            {/* File Upload Box */}
            <div className="border-2 border-dashed border-[#FF2E93]/40 rounded-2xl p-4 text-center bg-[#0B0612]">
              <Upload className="w-7 h-7 text-[#FF8CC6] mx-auto mb-2" />
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#FF2E93] file:text-white hover:file:bg-[#FF8CC6]"
              />
            </div>

            {/* Or Paste Area */}
            <div>
              <label className="text-xs text-[#FF8CC6] font-semibold block mb-1">
                O pega el texto CSV directamente:
              </label>
              <textarea
                rows={5}
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                placeholder="Nombre,WhatsApp,Email,Pedidos,Activas,Total,Estado,Vencimiento,Notas&#10;Mariana,+525543219876,mariana@gmail.com,3,1,195,activo,2026-11-26,Cliente VIP"
                className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-[#FF2E93]"
              />
            </div>

            {/* Import Feedback */}
            {importResult && (
              <div className={`p-3 rounded-xl text-xs space-y-1 ${
                importResult.imported > 0 ? 'bg-emerald-950/70 text-emerald-200 border border-emerald-500/40' : 'bg-red-950/70 text-red-200 border border-red-500/40'
              }`}>
                <div className="font-bold">
                  {importResult.imported > 0 ? `✓ Se importaron ${importResult.imported} clientes correctamente.` : 'No se importaron clientes.'}
                </div>
                {importResult.errors.length > 0 && (
                  <ul className="list-disc pl-4 text-[11px] text-gray-300">
                    {importResult.errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0B0612] text-[#C9C4D4] hover:text-white"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={!csvContent.trim()}
                className="px-5 py-2 rounded-xl text-xs font-bold neon-btn-primary disabled:opacity-40"
              >
                Procesar e Importar Clientes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT CLIENT NOTES MODAL */}
      {editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#12091A] border-2 border-[#FF2E93] rounded-2xl p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white">
              Gestionar Cliente: {editingClient.name}
            </h3>

            <form onSubmit={handleSaveNotes} className="space-y-3">
              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1">Estado del Cliente</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Client['status'])}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white focus:outline-none"
                >
                  <option value="activo">Activo</option>
                  <option value="por_vencer">Por Vencer</option>
                  <option value="vencido">Vencido</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1">Notas Internas</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Preferencias, método de pago habitual, etc."
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingClient(null)}
                  className="px-4 py-2 rounded-xl bg-[#0B0612] text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold neon-btn-primary"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
