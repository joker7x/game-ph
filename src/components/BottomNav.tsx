import React from 'react';
import { useGame } from '../context/GameContext';
import { Home, Package, FileText, AlertTriangle, Truck, ArrowUpCircle } from 'lucide-react';
import { sounds } from '../utils/sound';

export type ActiveTab = 'scene' | 'inventory' | 'prescriptions' | 'shortages' | 'orders' | 'upgrades';

interface Props {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const { customers, getShortages, orders } = useGame();

  const shortagesCount = getShortages().length;
  const waitingCustomersCount = customers.length;
  const inTransitCount = orders.filter(o => o.status === 'in_transit' || o.status === 'delivered').length;

  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    colorActive: string;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'scene',
      label: 'الصيدلية',
      icon: Home,
      colorActive: 'bg-gradient-to-b from-emerald-400 to-teal-600 border-emerald-300 shadow-[0_4px_0_#065f46] text-white'
    },
    {
      id: 'inventory',
      label: 'المخزون',
      icon: Package,
      colorActive: 'bg-gradient-to-b from-sky-400 to-blue-600 border-sky-300 shadow-[0_4px_0_#0369a1] text-white'
    },
    {
      id: 'prescriptions',
      label: 'الروشتات',
      icon: FileText,
      colorActive: 'bg-gradient-to-b from-amber-400 to-orange-600 border-amber-300 shadow-[0_4px_0_#b45309] text-white',
      badge: waitingCustomersCount,
      badgeColor: 'bg-rose-500'
    },
    {
      id: 'shortages',
      label: 'النواقص',
      icon: AlertTriangle,
      colorActive: 'bg-gradient-to-b from-rose-400 to-rose-600 border-rose-300 shadow-[0_4px_0_#be123c] text-white',
      badge: shortagesCount,
      badgeColor: 'bg-rose-600'
    },
    {
      id: 'orders',
      label: 'الموردين',
      icon: Truck,
      colorActive: 'bg-gradient-to-b from-indigo-400 to-purple-600 border-indigo-300 shadow-[0_4px_0_#4338ca] text-white',
      badge: inTransitCount,
      badgeColor: 'bg-amber-500'
    },
    {
      id: 'upgrades',
      label: 'التطوير',
      icon: ArrowUpCircle,
      colorActive: 'bg-gradient-to-b from-teal-400 to-emerald-700 border-teal-300 shadow-[0_4px_0_#065f46] text-white'
    }
  ];

  const handleTabClick = (id: ActiveTab) => {
    sounds.playPopSound();
    onTabChange(id);
  };

  return (
    <nav
      aria-label="شريط أزرار اللعبة الرئيسية"
      className="fixed bottom-0 left-0 right-0 z-30 pointer-events-auto pb-safe px-2 pt-1 flex justify-center bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-transparent"
    >
      {/* 3D Mobile Game Arcade Dock */}
      <div className="w-full max-w-md sm:max-w-lg bg-gradient-to-b from-white/95 to-slate-100/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-[0_10px_25px_rgba(0,0,0,0.35)] border-2 border-white p-1 sm:p-1.5 flex items-center justify-around gap-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`game-btn relative flex flex-col items-center justify-center flex-1 min-w-[46px] min-h-[50px] sm:min-h-[54px] py-1 px-1 rounded-xl sm:rounded-2xl border-2 transition-transform duration-100 ${
                isActive
                  ? `${item.colorActive} scale-105 z-10`
                  : 'bg-gradient-to-b from-white to-slate-100 text-slate-700 border-slate-200 shadow-[0_3px_0_#cbd5e1] hover:brightness-105'
              }`}
            >
              {/* Top glossy shine reflection on button */}
              <div className="absolute top-0 inset-x-1.5 h-2.5 rounded-t-lg bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

              <div className="relative">
                <Icon
                  className={`w-5 h-5 drop-shadow-xs transition-transform ${
                    isActive ? 'scale-110 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]' : ''
                  }`}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full min-w-4 text-center shadow-md border-2 border-white animate-bounce ${
                      item.badgeColor || 'bg-rose-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              <span className="text-[9.5px] sm:text-[10.5px] font-black mt-0.5 whitespace-nowrap drop-shadow-2xs">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
