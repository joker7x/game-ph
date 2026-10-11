import React from 'react';
import { requestLandscapeMode } from '../utils/orientation';
import { Smartphone, RotateCw } from 'lucide-react';
import { sounds } from '../utils/sound';

interface Props {
  onDismiss: () => void;
}

export const OrientationPrompt: React.FC<Props> = ({ onDismiss }) => {
  const handleRotateClick = async () => {
    sounds.playPopSound();
    await requestLandscapeMode();
    setTimeout(onDismiss, 600);
  };

  const handleDismiss = () => {
    sounds.playPopSound();
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 sm:p-6 shadow-[0_15px_35px_rgba(0,0,0,0.3)] border-2 border-emerald-200 text-center space-y-4">
        {/* Animated Rotating Smartphone Graphic */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center shadow-inner">
            <Smartphone className="w-9 h-9 animate-[spin_4s_ease-in-out_infinite]" />
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-md border border-white">
            <RotateCw className="w-4 h-4 animate-spin" />
          </div>
        </div>

        {/* Text Heading & Description */}
        <div className="space-y-1.5">
          <span className="text-xs bg-emerald-50 text-emerald-800 border-2 border-emerald-300 px-3 py-0.5 rounded-full font-black shadow-xs">
            تجربة الصيدلية الكاملة
          </span>
          <h3 className="text-lg font-black text-slate-900 mt-1">
            يرجى تدوير الهاتف بالعرض 🔄
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto font-medium">
            صُممت صيدلية 24 بمشهد أيزومتري واسع. قم بتدوير هاتفك أفقياً (Landscape) لرؤية كافة الأرفف والتفاصيل بدقة فائقة!
          </p>
        </div>

        {/* 3D Actions */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleRotateClick}
            className="game-btn game-btn-green w-full min-h-[46px] py-3 font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2"
          >
            <RotateCw className="w-4 h-4" />
            <span>تدوير الشاشة إلى الوضع الأفقي 📲</span>
          </button>

          <button
            onClick={handleDismiss}
            className="game-btn game-btn-white w-full min-h-[40px] py-2 font-bold text-xs rounded-xl"
          >
            المتابعة بالوضع الرأسي الحالي
          </button>
        </div>
      </div>
    </div>
  );
};
