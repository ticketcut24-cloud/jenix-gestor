import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { StoreView } from './components/store/StoreView';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { OrderTrackingModal } from './components/store/OrderTrackingModal';
import { ClientAuthModal } from './components/client/ClientAuthModal';
import { ClientPortalModal } from './components/client/ClientPortalModal';

import { ClientAuthGate } from './components/client/ClientAuthGate';
import { SpeiPaymentModal } from './components/store/SpeiPaymentModal';
import { WarrantyClaimModal } from './components/store/WarrantyClaimModal';

function AppContent() {
  const { currentAdmin, currentClient } = useStore();
  const [currentView, setCurrentView] = useState<'store' | 'admin' | 'tracking'>('store');
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isClientAuthOpen, setIsClientAuthOpen] = useState(false);
  const [isClientPortalOpen, setIsClientPortalOpen] = useState(false);
  const [isSpeiModalOpen, setIsSpeiModalOpen] = useState(false);
  const [isWarrantyModalOpen, setIsWarrantyModalOpen] = useState(false);


  const handleOpenAdmin = () => {
    if (currentAdmin) {
      setCurrentView('admin');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setCurrentView('admin');
  };

  return (
    <div className="min-h-screen bg-[#07040C] text-[#FBEFF6] selection:bg-[#FF2E93] selection:text-white">
      {currentView === 'admin' && currentAdmin ? (
        <AdminLayout onBackToStore={() => setCurrentView('store')} />
      ) : !currentClient ? (
        /* MANDATORY CLIENT AUTH / REGISTRATION GATE */
        <ClientAuthGate
          onOpenAdminLogin={() => setShowLoginModal(true)}
        />
      ) : (
        /* FULL STORE (UNLOCKED FOR REGISTERED CLIENTS) */
        <>
          <Navbar
            currentView={currentView}
            setCurrentView={(view) => {
              if (view === 'admin') {
                handleOpenAdmin();
              } else {
                setCurrentView(view);
              }
            }}
            openTracking={() => setIsTrackingOpen(true)}
            openClientAuth={() => setIsClientAuthOpen(true)}
            openClientPortal={() => setIsClientPortalOpen(true)}
            openSpeiModal={() => setIsSpeiModalOpen(true)}
            openWarrantyModal={() => setIsWarrantyModalOpen(true)}
          />

          <main>
            <StoreView
              onOpenTracking={() => setIsTrackingOpen(true)}
              isTrackingOpen={isTrackingOpen}
              setIsTrackingOpen={setIsTrackingOpen}
              openClientAuth={() => setIsClientAuthOpen(true)}
              openClientPortal={() => setIsClientPortalOpen(true)}
            />
          </main>

          <FloatingWhatsApp />
        </>
      )}

      {/* Admin Login Modal with Master PIN 2026 */}
      {showLoginModal && (
        <AdminLoginModal
          onSuccess={handleLoginSuccess}
          onCancel={() => setShowLoginModal(false)}
        />
      )}

      {/* Client Registration / Login Modal */}
      {isClientAuthOpen && (
        <ClientAuthModal
          onClose={() => setIsClientAuthOpen(false)}
          onSuccess={() => {
            setIsClientAuthOpen(false);
            setIsClientPortalOpen(true);
          }}
        />
      )}

      {/* Client Private Portal Modal (My Account) */}
      {isClientPortalOpen && (
        <ClientPortalModal
          onClose={() => setIsClientPortalOpen(false)}
          onOpenStore={() => {
            setIsClientPortalOpen(false);
            setCurrentView('store');
          }}
        />
      )}

      {/* Global Order Tracking Modal */}
      {isTrackingOpen && currentView !== 'store' && (
        <OrderTrackingModal onClose={() => setIsTrackingOpen(false)} />
      )}

      {/* Global SPEI Payment & Top-Up Modal */}
      {isSpeiModalOpen && (
        <SpeiPaymentModal onClose={() => setIsSpeiModalOpen(false)} />
      )}

      {/* Global Warranty & Support Claim Modal */}
      {isWarrantyModalOpen && (
        <WarrantyClaimModal onClose={() => setIsWarrantyModalOpen(false)} />
      )}
    </div>
  );
}


export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
