import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { PhaserGame } from './game/PhaserGame';
import { HUD } from './components/HUD';
import { BottomNav, ActiveTab } from './components/BottomNav';
import { QuickActions } from './components/QuickActions';
import { MainMenu } from './components/MainMenu';
import { CheckoutModal } from './components/modals/CheckoutModal';
import { InventoryModal } from './components/modals/InventoryModal';
import { PrescriptionsModal } from './components/modals/PrescriptionsModal';
import { ShortagesModal } from './components/modals/ShortagesModal';
import { OrdersModal } from './components/modals/OrdersModal';
import { UpgradesModal } from './components/modals/UpgradesModal';
import { MissionsModal } from './components/modals/MissionsModal';
import { ReportsModal } from './components/modals/ReportsModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { HowToPlayModal } from './components/modals/HowToPlayModal';
import { OfflineEarningsModal } from './components/OfflineEarningsModal';
import { OrientationPrompt } from './components/OrientationPrompt';
import { isDevicePortrait } from './utils/orientation';

const PharmacyGameApp: React.FC = () => {
  const {
    activeCustomer,
    setActiveCustomer,
    selectedCategory,
    setSelectedCategory
  } = useGame();

  const [gameState, setGameState] = useState<'menu' | 'playing'>('menu');
  const [activeTab, setActiveTab] = useState<ActiveTab>('scene');

  // Modals state
  const [showMissions, setShowMissions] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [orderTargetProductId, setOrderTargetProductId] = useState<string | undefined>(undefined);

  // Device orientation state
  const [isPortrait, setIsPortrait] = useState<boolean>(() => isDevicePortrait());
  const [dismissRotationPrompt, setDismissRotationPrompt] = useState<boolean>(false);

  React.useEffect(() => {
    const handleOrientationChange = () => {
      setIsPortrait(isDevicePortrait());
    };
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  React.useEffect(() => {
    if (selectedCategory) {
      setActiveTab('inventory');
    }
  }, [selectedCategory]);

  return (
    <div className="relative w-full h-dvh max-h-dvh overflow-hidden select-none font-['Tajawal',sans-serif] bg-slate-900">
      {gameState === 'menu' ? (
        <MainMenu
          onStartGame={() => setGameState('playing')}
          onOpenSettings={() => setShowSettings(true)}
          onOpenHowToPlay={() => setShowHowToPlay(true)}
        />
      ) : (
        <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
          {/* Top HUD */}
          <HUD onOpenSettings={() => setShowSettings(true)} />

          {/* Quick Action Buttons on right */}
          <QuickActions
            onOpenMissions={() => setShowMissions(true)}
            onOpenOrders={() => setActiveTab('orders')}
            onOpenReports={() => setShowReports(true)}
          />

          {/* Phaser 3 Canvas Scene: Full Fit without any scroll */}
          <main className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-auto">
            <PhaserGame />
          </main>

          {/* Interactive Cue overlay for players on first glance */}
          <div className="absolute top-14 sm:top-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none px-2 max-w-[92vw]">
            <div className="bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-emerald-200 shadow-xs text-[10px] sm:text-[11px] text-slate-700 font-bold flex items-center gap-1 animate-pulse truncate text-center">
              <span>💡 اضغط على الكاشير أو الزبائن للتسريع الفوري ⚡</span>
            </div>
          </div>

          {/* Bottom Navigation Dock */}
          <BottomNav
            activeTab={activeTab}
            onTabChange={tab => {
              setActiveTab(tab);
              if (tab !== 'inventory') {
                setSelectedCategory(null);
              }
            }}
          />

          {/* Modals */}
          {/* 1. Checkout Modal (Active Prescription) */}
          {activeCustomer && (
            <CheckoutModal
              customer={activeCustomer}
              onClose={() => setActiveCustomer(null)}
              onOpenOrdersModal={() => {
                setActiveCustomer(null);
                setActiveTab('orders');
              }}
            />
          )}

          {/* 2. Inventory Modal */}
          {activeTab === 'inventory' && (
            <InventoryModal
              onClose={() => {
                setActiveTab('scene');
                setSelectedCategory(null);
              }}
              onOpenOrdersModal={productId => {
                setOrderTargetProductId(productId);
                setActiveTab('orders');
              }}
              initialCategory={selectedCategory}
            />
          )}

          {/* 3. Prescriptions Queue Modal */}
          {activeTab === 'prescriptions' && (
            <PrescriptionsModal
              onClose={() => setActiveTab('scene')}
              onSelectCustomer={cust => {
                setActiveTab('scene');
                setActiveCustomer(cust);
              }}
            />
          )}

          {/* 4. Shortages Modal */}
          {activeTab === 'shortages' && (
            <ShortagesModal
              onClose={() => setActiveTab('scene')}
              onQuickOrder={productId => {
                setOrderTargetProductId(productId);
                setActiveTab('orders');
              }}
            />
          )}

          {/* 5. Orders & Suppliers Modal */}
          {activeTab === 'orders' && (
            <OrdersModal
              onClose={() => {
                setActiveTab('scene');
                setOrderTargetProductId(undefined);
              }}
              preselectedProductId={orderTargetProductId}
            />
          )}

          {/* 6. Upgrades Modal */}
          {activeTab === 'upgrades' && (
            <UpgradesModal onClose={() => setActiveTab('scene')} />
          )}

          {/* 7. Missions Modal */}
          {showMissions && (
            <MissionsModal onClose={() => setShowMissions(false)} />
          )}

          {/* 8. Reports Modal */}
          {showReports && (
            <ReportsModal onClose={() => setShowReports(false)} />
          )}

          {/* 9. Offline Passive Earnings Modal */}
          <OfflineEarningsModal />
        </div>
      )}

      {/* Phone Rotation Prompt if held in portrait while playing */}
      {gameState === 'playing' && isPortrait && !dismissRotationPrompt && (
        <OrientationPrompt onDismiss={() => setDismissRotationPrompt(true)} />
      )}

      {/* Global Modals (accessible from both Menu and Playing) */}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onOpenHowToPlay={() => {
            setShowSettings(false);
            setShowHowToPlay(true);
          }}
        />
      )}

      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <PharmacyGameApp />
    </GameProvider>
  );
}
