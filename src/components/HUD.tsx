import React from 'react';
import { useGame } from '../context/GameContext';
import { Settings, Volume2, VolumeX, Sparkles, Coins, Gem, Zap, RotateCw } from 'lucide-react';
import pharmacistAvatarImg from '../assets/images/pharmacist_portrait_1791637330357.jpg';
import { requestLandscapeMode } from '../utils/orientation';
import { sounds } from '../utils/sound';

interface HUDProps {
  onOpenSettings: () => void;
}

export const HUD: React.FC<HUDProps> = ({ onOpenSettings }) => {
  const {
    coins,
    gems,
    level,
    xp,
    xpNeeded,
    idleIncomePerMin,
    boostActive,
    settings,
    currentFps,
    updateSettings,
    triggerTapBoost
  } = useGame();

  const xpPercent = Math.min(100, Math.round((xp / xpNeeded) * 100));

  const handleRotate = async () => {
    sounds.playPopSound();
    await requestLandscapeMode();
  };

  const handleSoundToggle = () => {
    sounds.playPopSound();
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const handleSettingsOpen = () => {
    sounds.playPopSound();
    onOpenSettings();
  };

  return (
    <header className="w-full pt-safe px-2 py-1.5 sm:px-4 sm:py-2 flex items-center justify-between pointer-events-auto z-30 select-none bg-gradient-to-b from-slate-950/75 via-slate-900/35 to-transparent">
      {/* 3D Character Avatar & Level Frame */}
      <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-b from-white to-emerald-50 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.2)] border-2 border-emerald-300 border-b-4 border-b-emerald-600 shrink-0">
        <div className="relative">
          <img
            src={pharmacistAvatarImg}
            alt="الصيدلي"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-amber-400 shadow-md ring-2 ring-emerald-400/50"
          />
          <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-amber-950 text-[9px] font-black px-1.5 py-0.2 rounded-full border border-white shadow-xs">
            ⭐{level}
          </span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-xs font-black text-slate-800">د. سارة</span>
            {settings.showFps && (
              <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded border border-emerald-300">
                {currentFps} FPS
              </span>
            )}
          </div>
          <div className="w-16 sm:w-20 h-2 bg-slate-200 rounded-full overflow-hidden mt-0.5 border border-slate-300 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-300"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3D Currency Banks (Gold & Gems) */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* 3D Gold Bank */}
        <div className="flex items-center gap-1 bg-gradient-to-b from-amber-100 via-amber-200 to-amber-300 border-2 border-amber-400 border-b-4 border-b-amber-600 px-2 sm:px-2.5 py-1 rounded-2xl shadow-[0_4px_8px_rgba(180,83,9,0.25)]">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 text-amber-950 flex items-center justify-center font-black text-xs shadow-xs border border-yellow-200 shrink-0">
            <Coins className="w-3.5 h-3.5 text-amber-950 fill-amber-300" />
          </div>
          <div className="flex flex-col text-right leading-tight">
            <span className="text-xs sm:text-sm font-black text-amber-950 font-mono tabular-nums drop-shadow-xs">
              {coins.toLocaleString()}
            </span>
            <span className="text-[7px] sm:text-[8px] font-extrabold text-amber-800">EGP</span>
          </div>
        </div>

        {/* 3D Gem Bank */}
        <div className="flex items-center gap-1 bg-gradient-to-b from-sky-100 via-sky-200 to-sky-300 border-2 border-sky-400 border-b-4 border-b-sky-600 px-2 py-1 rounded-2xl shadow-[0_4px_8px_rgba(2,132,199,0.25)]">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-sky-300 to-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs border border-sky-200 shrink-0">
            <Gem className="w-3.5 h-3.5 fill-sky-200 text-white" />
          </div>
          <span className="text-xs sm:text-sm font-black text-sky-950 font-mono tabular-nums drop-shadow-xs">
            {gems}
          </span>
        </div>

        {/* Live Idle Rate Widget */}
        <div className="hidden lg:flex items-center gap-1 bg-gradient-to-b from-emerald-100 to-emerald-200 border-2 border-emerald-400 border-b-4 border-b-emerald-600 px-2 py-1 rounded-2xl shadow-md text-emerald-950 text-[10px] font-black font-mono">
          <Zap className="w-3 h-3 text-emerald-700 fill-emerald-400 animate-pulse" />
          <span>+{idleIncomePerMin.toLocaleString()} ج.م/د</span>
        </div>
      </div>

      {/* 3D Pressable Arcade Game Buttons */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* 3D Tap Boost Button */}
        <button
          onClick={triggerTapBoost}
          className={`game-btn min-h-[36px] px-2 sm:px-2.5 py-1 rounded-2xl text-xs font-black flex items-center justify-center gap-1 ${
            boostActive
              ? 'game-btn-gold scale-105'
              : 'game-btn-coral'
          }`}
          title="اضغط لتسريع صرف الروشتات"
        >
          <Sparkles className="w-3.5 h-3.5 fill-white text-yellow-200 animate-spin" />
          <span className="text-[10px] sm:text-xs">تسريع ⚡</span>
        </button>

        {/* 3D Rotate Screen Button */}
        <button
          onClick={handleRotate}
          className="game-btn game-btn-green min-w-[36px] min-h-[36px] rounded-2xl flex items-center justify-center"
          title="تدوير الشاشة أفقياً"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        {/* 3D Sound Toggle Button */}
        <button
          onClick={handleSoundToggle}
          className="game-btn game-btn-white min-w-[36px] min-h-[36px] rounded-2xl flex items-center justify-center"
          title={settings.soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
        >
          {settings.soundEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <VolumeX className="w-4 h-4 text-rose-500" />
          )}
        </button>

        {/* 3D Settings Button */}
        <button
          onClick={handleSettingsOpen}
          className="game-btn game-btn-white min-w-[36px] min-h-[36px] rounded-2xl flex items-center justify-center"
          title="الإعدادات والجرافيك"
        >
          <Settings className="w-4 h-4 text-slate-700" />
        </button>
      </div>
    </header>
  );
};
