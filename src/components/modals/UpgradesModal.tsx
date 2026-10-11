import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  ChevronRight,
  Boxes,
  Snowflake,
  Monitor,
  CreditCard,
  UserCheck,
  Wind,
  Lightbulb,
  Maximize2,
  Check,
  Coins,
  Gem,
  AlertCircle
} from 'lucide-react';

interface Props {
  onClose: () => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Boxes,
  Snowflake,
  Monitor,
  CreditCard,
  UserCheck,
  Wind,
  Lightbulb,
  Maximize2
};

export const UpgradesModal: React.FC<Props> = ({ onClose }) => {
  const { upgrades, buyUpgrade, coins, gems, level } = useGame();
  const [activeCategory, setActiveCategory] = useState<'equipment' | 'staff' | 'expansion'>('equipment');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const filteredUpgrades = upgrades.filter(u => u.category === activeCategory);

  const handleBuy = (id: string) => {
    setErrorMsg(null);
    const res = buyUpgrade(id);
    if (!res.success) {
      setErrorMsg(res.message || 'فشلت عملية الشراء');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 pointer-events-auto">
      <div className="w-full max-w-lg bg-[#f8fbf9] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-teal-100 overflow-hidden flex flex-col h-[90dvh] sm:h-[85vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        {/* Mobile Drag Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2 shrink-0 sm:hidden" />

        {/* Header */}
        <div className="px-4 py-2.5 sm:py-3 bg-white border-b border-teal-100 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="min-h-[40px] flex items-center gap-1.5 text-slate-800 hover:text-teal-700 font-bold text-sm sm:text-base transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
            <span>تطوير وتحديث الصيدلية</span>
          </button>
          <span className="text-xs bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full font-bold">
            مستوى {level}
          </span>
        </div>

        {/* Tabs: المعدات / الديكور والكادر / التوسعة */}
        <div className="p-2 sm:p-3 bg-white border-b border-slate-100 flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              setActiveCategory('equipment');
              setErrorMsg(null);
            }}
            className={`flex-1 min-h-[38px] py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
              activeCategory === 'equipment'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            المعدات
          </button>
          <button
            onClick={() => {
              setActiveCategory('staff');
              setErrorMsg(null);
            }}
            className={`flex-1 min-h-[38px] py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
              activeCategory === 'staff'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            الكادر والديكور
          </button>
          <button
            onClick={() => {
              setActiveCategory('expansion');
              setErrorMsg(null);
            }}
            className={`flex-1 min-h-[38px] py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
              activeCategory === 'expansion'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            التوسعة
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mx-3 mt-2 p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Upgrades List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 pb-safe">
          {filteredUpgrades.map(upgrade => {
            const Icon = ICON_MAP[upgrade.iconName] || Boxes;
            const isLocked = level < upgrade.levelRequired;
            const canAfford =
              coins >= upgrade.cost &&
              (!upgrade.gemCost || gems >= upgrade.gemCost);

            return (
              <div
                key={upgrade.id}
                className={`p-3 sm:p-4 rounded-2xl border transition-all ${
                  upgrade.isUnlocked
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : isLocked
                    ? 'bg-slate-50/70 border-slate-200 opacity-70'
                    : 'bg-white border-slate-200 hover:border-teal-300 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                        upgrade.isUnlocked
                          ? 'bg-emerald-500 text-white'
                          : isLocked
                          ? 'bg-slate-200 text-slate-400'
                          : 'bg-teal-50 text-teal-700 border border-teal-200'
                      }`}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 truncate">
                        {upgrade.name}
                        {upgrade.isUnlocked && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold shrink-0">
                            مُفعل
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                        {upgrade.description}
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-teal-700 font-bold mt-1">
                        ✨ {upgrade.effectDescription}
                      </p>
                    </div>
                  </div>

                  {/* Buy / Unlocked Button */}
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    {upgrade.isUnlocked ? (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-xl flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        تم
                      </span>
                    ) : isLocked ? (
                      <span className="px-2 py-1 bg-slate-200 text-slate-600 font-bold text-[10px] rounded-xl">
                        مستوى {upgrade.levelRequired}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBuy(upgrade.id)}
                        disabled={!canAfford}
                        className={`game-btn min-h-[42px] px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 ${
                          canAfford
                            ? 'game-btn-gold'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border-2 border-slate-300'
                        }`}
                      >
                        <span>شراء</span>
                        <div className="flex items-center gap-0.5 font-mono text-[11px]">
                          <span>{upgrade.cost.toLocaleString()}</span>
                          <Coins className="w-3.5 h-3.5 text-amber-950 fill-amber-300" />
                          {upgrade.gemCost ? (
                            <>
                              <span>+{upgrade.gemCost}</span>
                              <Gem className="w-3.5 h-3.5 text-sky-200 fill-sky-100" />
                            </>
                          ) : null}
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
