import React from 'react';
import { useGame } from '../context/GameContext';
import { Coins, Sparkles } from 'lucide-react';

export const OfflineEarningsModal: React.FC = () => {
  const { offlineEarnings, claimOfflineEarnings } = useGame();

  if (!offlineEarnings) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 pointer-events-auto animate-in fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-amber-200 text-center space-y-4 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-3xl shadow-sm">
          💰
        </div>

        <div>
          <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
            أرباح الغياب المتراكمة
          </span>
          <h3 className="text-lg font-black text-slate-900 mt-2">
            مرحباً بعودتك إلى صيدلية 24!
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            استمرت صيدليتك في العمل وخدمة أهالي الحي أثناء غيابك وحققت أرباحاً إضافية:
          </p>
        </div>

        <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 shadow-inner">
          <div className="flex items-center justify-center gap-2">
            <Coins className="w-6 h-6 text-amber-500 animate-bounce" />
            <span className="text-2xl font-black text-amber-950 font-mono">
              +{offlineEarnings.toLocaleString()} EGP
            </span>
          </div>
          <span className="text-[11px] font-bold text-amber-700 mt-0.5 block">
            تمت إضافتها مباشرة إلى خزينة الصيدلية
          </span>
        </div>

        <button
          onClick={claimOfflineEarnings}
          className="game-btn game-btn-gold w-full min-h-[48px] py-3.5 font-black text-sm rounded-2xl flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-950 fill-amber-300" />
          <span>استلام الأرباح ومتابعة العمل! ✨</span>
        </button>
      </div>
    </div>
  );
};
