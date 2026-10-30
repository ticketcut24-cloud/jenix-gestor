import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Bell, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  MessageCircle, 
  RotateCw, 
  CheckCircle2, 
  ShieldAlert,
  Send
} from 'lucide-react';

export const AdminNotifications: React.FC = () => {
  const { orders, settings, renewOrder } = useStore();
  const [tab, setTab] = useState<'proximos' | 'vencidos'>('proximos');
  const [renewedSuccess, setRenewedSuccess] = useState<string | null>(null);

  const now = new Date().getTime();
  const threeDays = 3 * 24 * 60 * 60 * 1000;

  // Expiring soon: approved/entregado orders with expiresAt within 3 days
  const expiringOrders = orders.filter(o => {
    if ((o.status === 'aprobado' || o.status === 'entregado') && o.expiresAt) {
      const diff = new Date(o.expiresAt).getTime() - now;
      return diff > 0 && diff <= threeDays;
    }
    return false;
  });

  // Expired orders: status is 'vencido' or expiresAt has passed
  const expiredOrders = orders.filter(o => {
    if (o.status === 'vencido') return true;
    if ((o.status === 'aprobado' || o.status === 'entregado') && o.expiresAt) {
      return new Date(o.expiresAt).getTime() < now;
    }
    return false;
  });

  const handleRenew = (orderId: string) => {
    const renewed = renewOrder(orderId);
    if (renewed) {
      setRenewedSuccess(`Se generó el pedido de renovación ${renewed.orderNumber}`);
      setTimeout(() => setRenewedSuccess(null), 4000);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#FF8CC6]">
          ✦ Operación &bull; Centro de Alertas y Retención
        </span>
        <h2 className="text-2xl font-bold font-cinzel text-white mt-1">
          Notificaciones y Vencimientos
        </h2>
        <p className="text-xs text-[#A394AE]">
          Monitoreo proactivo para evitar que los clientes se queden sin servicio y aumentar la recompra.
        </p>
      </div>

      {renewedSuccess && (
        <div className="p-3.5 rounded-xl bg-[#3DDC97]/20 border border-[#3DDC97] text-[#3DDC97] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{renewedSuccess}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setTab('proximos')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            tab === 'proximos'
              ? 'neon-btn-primary'
              : 'bg-[#12091A] text-[#C9C4D4] border border-white/10'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-[#FFB020]" />
          <span>Próximos a Vencer ({expiringOrders.length})</span>
        </button>

        <button
          onClick={() => setTab('vencidos')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            tab === 'vencidos'
              ? 'neon-btn-primary'
              : 'bg-[#12091A] text-[#C9C4D4] border border-white/10'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
          <span>Vencidos ({expiredOrders.length})</span>
        </button>
      </div>

      {/* LIST */}
      {tab === 'proximos' ? (
        expiringOrders.length === 0 ? (
          <div className="goth-card rounded-2xl p-12 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[#3DDC97] mx-auto" />
            <h4 className="font-bold text-white text-base">Sin vencimientos inminentes</h4>
            <p className="text-xs text-[#A394AE]">Ninguna suscripción expira en las próximas 72 horas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {expiringOrders.map((ord) => {
              const diffDays = ord.expiresAt ? Math.ceil((new Date(ord.expiresAt).getTime() - now) / (1000 * 60 * 60 * 24)) : 0;
              const encodedMsg = encodeURIComponent(
                `Hola ${ord.customerName} ✦ te saludamos de JENYX. Tu suscripción de ${ord.productName} vence en ${diffDays} día(s) (el ${new Date(ord.expiresAt || '').toLocaleDateString()}). Si deseas renovar para conservar tu perfil privado con PIN y no perder tu historial, indícanos por aquí. ¡Muchas gracias!`
              );

              return (
                <div key={ord.id} className="goth-card rounded-2xl p-5 border-yellow-500/40 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-mono font-bold text-white">{ord.orderNumber}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/40">
                      Vence en {diffDays} {diffDays === 1 ? 'día' : 'días'}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="text-white font-bold text-sm">{ord.customerName}</div>
                    <div className="text-[#FF8CC6] font-medium">{ord.productName}</div>
                    <div className="text-[#A394AE]">
                      Fecha de Vencimiento: <strong className="text-white">{ord.expiresAt ? new Date(ord.expiresAt).toLocaleDateString() : ''}</strong>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                    <a
                      href={`https://wa.me/${ord.customerWhatsApp.replace(/\D/g, '')}?text=${encodedMsg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-[#3DDC97] hover:bg-[#2fc081] text-[#07040C] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Enviar Recordatorio WhatsApp</span>
                    </a>

                    <button
                      onClick={() => handleRenew(ord.id)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10"
                      title="Generar pedido de renovación"
                    >
                      <RotateCw className="w-4 h-4 text-[#FF8CC6]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        expiredOrders.length === 0 ? (
          <div className="goth-card rounded-2xl p-12 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[#3DDC97] mx-auto" />
            <h4 className="font-bold text-white text-base">No hay cuentas vencidas</h4>
            <p className="text-xs text-[#A394AE]">Todos los accesos están renovados o en fecha.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {expiredOrders.map((ord) => {
              const encodedReactivate = encodeURIComponent(
                `Hola ${ord.customerName} ✦ te saludamos de JENYX. Notamos que tu servicio de ${ord.productName} expiró. Tenemos una promoción especial para reactivar tu cuenta sin perder tus preferencias. ¿Te gustaría reactivar hoy?`
              );

              return (
                <div key={ord.id} className="goth-card rounded-2xl p-5 border-red-500/40 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-mono font-bold text-white">{ord.orderNumber}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950/70 text-red-300 border border-red-500/40">
                      Vencido
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="text-white font-bold text-sm">{ord.customerName}</div>
                    <div className="text-[#A394AE]">{ord.productName} (${ord.price} MXN)</div>
                    <div className="text-red-400 text-[11px]">
                      Expiró el: {ord.expiresAt ? new Date(ord.expiresAt).toLocaleDateString() : 'Anterior'}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                    <a
                      href={`https://wa.me/${ord.customerWhatsApp.replace(/\D/g, '')}?text=${encodedReactivate}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-[#FF2E93]/20 border border-[#FF2E93] text-[#FF8CC6] hover:bg-[#FF2E93] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Reactivar por WhatsApp</span>
                    </a>

                    <button
                      onClick={() => handleRenew(ord.id)}
                      className="py-2 px-3 rounded-xl text-xs font-bold neon-btn-primary flex items-center gap-1"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Renovar</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};
