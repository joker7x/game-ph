import React from 'react';
import { useGame } from '../../context/GameContext';
import { ChevronRight, ClipboardList, CheckCircle2, Coins, Gem } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const MissionsModal: React.FC<Props> = ({ onClose }) => {
  const { missions, claimMissionReward } = useGame();

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 pointer-events-auto">
      <div className="w-full max-w-md bg-[#f8fbf9] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col h-[85dvh] sm:h-[75vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        {/* Mobile Drag Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2 shrink-0 sm:hidden" />

        {/* Header */}
        <div className="px-4 py-2.5 sm:py-3 bg-white border-b border-emerald-100 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="min-h-[40px] flex items-center gap-1.5 text-slate-800 hover:text-emerald-700 font-bold text-sm sm:text-base transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
            <span>المهام اليومية والمكافآت</span>
          </button>
          <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
            مهام نشطة
          </span>
        </div>

        {/* Missions List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 pb-safe">
          {missions.map(mission => {
            const percent = Math.min(100, Math.round((mission.progress / mission.target) * 100));

            return (
              <div
                key={mission.id}
                className={`p-3 sm:p-4 rounded-2xl border transition-all ${
                  mission.isClaimed
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : mission.isCompleted
                    ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-200/50'
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        mission.isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {mission.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">{mission.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{mission.description}</p>
                    </div>
                  </div>

                  {/* Reward badges */}
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-lg border border-amber-200">
                      <Coins className="w-3 h-3 text-amber-600" />
                      +{mission.rewardCoins}
                    </span>
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded-lg border border-sky-200">
                      <Gem className="w-3 h-3 text-sky-600" />
                      +{mission.rewardGems}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2.5 space-y-1">
                  <div className="w-full h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>
                      {mission.progress} / {mission.target}
                    </span>
                    <span>{percent}%</span>
                  </div>
                </div>

                {/* Claim Button */}
                {mission.isCompleted && !mission.isClaimed && (
                  <button
                    onClick={() => claimMissionReward(mission.id)}
                    className="game-btn game-btn-gold mt-2.5 w-full min-h-[44px] py-2 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 animate-pulse"
                  >
                    <span>استلام الجائزة الآن! 🎉</span>
                  </button>
                )}

                {mission.isClaimed && (
                  <p className="mt-2 text-center text-[10px] text-slate-400 font-bold">
                    ✓ تم استلام الجائزة بنجاح
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
