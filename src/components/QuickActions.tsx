import React from 'react';
import { useGame } from '../context/GameContext';
import { ClipboardList, Truck, BarChart3 } from 'lucide-react';
import { sounds } from '../utils/sound';

interface Props {
  onOpenMissions: () => void;
  onOpenOrders: () => void;
  onOpenReports: () => void;
}

export const QuickActions: React.FC<Props> = ({
  onOpenMissions,
  onOpenOrders,
  onOpenReports
}) => {
  const { missions, orders } = useGame();

  const pendingRewards = missions.filter(m => m.isCompleted && !m.isClaimed).length;
  const inTransitCount = orders.filter(o => o.status === 'in_transit' || o.status === 'delivered').length;

  const handleAction = (cb: () => void) => {
    sounds.playPopSound();
    cb();
  };

  return (
    <aside aria-label="الإجراءات السريعة" className="fixed top-14 sm:top-18 right-2 sm:right-4 flex flex-col gap-2 z-20 pointer-events-auto">
      {/* 3D Missions Orb */}
      <button
        onClick={() => handleAction(onOpenMissions)}
        className="game-btn group relative flex flex-col items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-b from-emerald-100 to-emerald-200 text-slate-800 rounded-2xl shadow-[0_4px_0_#059669] border-2 border-emerald-300"
        title="المهام اليومية"
      >
        <ClipboardList className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform drop-shadow-xs" />
        <span className="text-[7.5px] sm:text-[8.5px] font-black text-emerald-950 leading-none mt-0.5">المهام</span>
        {pendingRewards > 0 && (
          <span className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-gradient-to-r from-rose-500 to-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-md animate-bounce">
            {pendingRewards}
          </span>
        )}
      </button>

      {/* 3D Supplier Orders Orb */}
      <button
        onClick={() => handleAction(onOpenOrders)}
        className="game-btn group relative flex flex-col items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-b from-amber-100 to-amber-200 text-slate-800 rounded-2xl shadow-[0_4px_0_#d97706] border-2 border-amber-300"
        title="طلبيات الموزعين"
      >
        <Truck className="w-5 h-5 text-amber-800 group-hover:scale-110 transition-transform drop-shadow-xs" />
        <span className="text-[7.5px] sm:text-[8.5px] font-black text-amber-950 leading-none mt-0.5">الطلبات</span>
        {inTransitCount > 0 && (
          <span className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-md animate-pulse">
            {inTransitCount}
          </span>
        )}
      </button>

      {/* 3D Reports Orb */}
      <button
        onClick={() => handleAction(onOpenReports)}
        className="game-btn group flex flex-col items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-b from-sky-100 to-sky-200 text-slate-800 rounded-2xl shadow-[0_4px_0_#0284c7] border-2 border-sky-300"
        title="التقارير اليومية"
      >
        <BarChart3 className="w-5 h-5 text-sky-800 group-hover:scale-110 transition-transform drop-shadow-xs" />
        <span className="text-[7.5px] sm:text-[8.5px] font-black text-sky-950 leading-none mt-0.5">التقرير</span>
      </button>
    </aside>
  );
};
