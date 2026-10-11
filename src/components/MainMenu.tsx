import React from 'react';
import coverArtImg from '../assets/images/pharmacy_masterpiece_3d_1791672148646.jpg';
import { Play, Settings, HelpCircle, Sparkles, Smartphone } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { requestLandscapeMode } from '../utils/orientation';
import { sounds } from '../utils/sound';

interface Props {
  onStartGame: () => void;
  onOpenSettings: () => void;
  onOpenHowToPlay: () => void;
}

export const MainMenu: React.FC<Props> = ({ onStartGame, onOpenSettings, onOpenHowToPlay }) => {
  const { level, coins } = useGame();

  const handlePlayClick = async () => {
    sounds.playCoinSound();
    // Attempt automatic phone rotation to landscape on start
    await requestLandscapeMode();
    onStartGame();
  };

  const handleSettingsClick = () => {
    sounds.playPopSound();
    onOpenSettings();
  };

  const handleHowToPlayClick = () => {
    sounds.playPopSound();
    onOpenHowToPlay();
  };

  return (
    <div className="relative w-full h-full min-h-dvh flex items-center justify-center p-3 sm:p-4 bg-gradient-to-b from-[#bbf7d0] via-[#ecfdf5] to-[#fef3c7] overflow-y-auto select-none">
      {/* Decorative background glows */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-emerald-400/20 blur-3xl -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-amber-400/20 blur-3xl -bottom-20 -right-20 pointer-events-none" />

      {/* Main Menu 3D Card */}
      <div className="relative z-10 w-full max-w-sm bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-[0_15px_35px_rgba(0,0,0,0.25)] border-2 border-white flex flex-col items-center text-center my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Masterpiece 3D Banner */}
        <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden shadow-inner border-2 border-emerald-200 mb-3 group">
          <img
            src={coverArtImg}
            alt="صيدلية 24"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-3 text-white text-right">
            <span className="text-[10px] font-bold text-emerald-300">محاكاة وإدارة صيدلية مصرية ثلاثية الأبعاد</span>
            <h2 className="text-xl sm:text-2xl font-black drop-shadow-md tracking-tight">PHARMACY 24 • صيدلية ٢٤</h2>
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="mb-3.5 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-emerald-50 text-emerald-800 border-2 border-emerald-300 rounded-full text-[11px] font-black shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
            <span>لعبة المحاكاة والإدارة الواقعية</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            صيدلية 24
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 max-w-xs font-medium">
            اخدم الزبائن، اصرف الروشتات الطبية، اطلب النواقص وطوّر صيدليتك!
          </p>

          {/* Player status pill */}
          <div className="pt-1 flex items-center justify-center gap-3 text-xs font-black text-slate-700">
            <span>المستوى: <strong className="text-emerald-600 font-mono">⭐{level}</strong></span>
            <span>·</span>
            <span>الخزينة: <strong className="text-amber-600 font-mono">{coins.toLocaleString()} EGP</strong></span>
          </div>
        </div>

        {/* 3D Game Push Buttons */}
        <div className="w-full space-y-2.5">
          {/* Big Chunky Play Button */}
          <button
            onClick={handlePlayClick}
            className="game-btn game-btn-gold w-full py-3.5 px-4 rounded-2xl font-black text-base shadow-[0_5px_0_#b45309] flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-amber-950 text-amber-950" />
            <span>ابدأ اللعب • تدوير الشاشة ودخول الصيدلية</span>
          </button>

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            {/* Settings button */}
            <button
              onClick={handleSettingsClick}
              className="game-btn game-btn-white min-h-[44px] py-2 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Settings className="w-4 h-4 text-slate-600" />
              <span>إعدادات وجرافيك</span>
            </button>

            {/* How to play button */}
            <button
              onClick={handleHowToPlayClick}
              className="game-btn game-btn-white min-h-[44px] py-2 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>دليل الصيدلي</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 font-semibold mt-3">
          <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
          <span>متوافق بالكامل مع جميع الهواتف الذكية • بدون سكرول جانبي</span>
        </div>
      </div>
    </div>
  );
};
