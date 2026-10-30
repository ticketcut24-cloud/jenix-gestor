import React from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useStore();
  const phone = settings.whatsappSupport.replace(/\D/g, '');

  return (
    <aside aria-label="Soporte y contacto" className="fixed bottom-6 right-6 z-40">
      <a
        href={`https://wa.me/${phone}?text=Hola%20JENYX%20✦%20deseo%20información%20o%20renovación%20de%20mi%20cuenta%20de%20streaming`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp para compras y soporte"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#12091A] border-2 border-[#3DDC97] text-[#3DDC97] shadow-[0_0_20px_rgba(61,220,151,0.4)] hover:shadow-[0_0_30px_rgba(61,220,151,0.7)] hover:bg-[#3DDC97] hover:text-[#07040C] transition-all duration-300 transform hover:scale-110"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3DDC97] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#3DDC97]"></span>
        </span>
        {/* Tooltip on desktop */}
        <span className="absolute right-16 bg-[#12091A] text-white text-xs py-1.5 px-3 rounded-lg border border-[#3DDC97]/40 shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
          ¿Dudas o Renovación? ¡Escríbenos! ✦
        </span>
      </a>
    </aside>
  );
};
