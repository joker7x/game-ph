import React from 'react';
import { useGame } from '../../context/GameContext';
import { GraphicsQuality } from '../../types/game';
import {
  X,
  Volume2,
  VolumeX,
  RotateCcw,
  HelpCircle,
  Sparkles,
  MonitorCheck,
  Activity
} from 'lucide-react';
import { sounds } from '../../utils/sound';

interface Props {
  onClose: () => void;
  onOpenHowToPlay: () => void;
}

export const SettingsModal: React.FC<Props> = ({ onClose, onOpenHowToPlay }) => {
  const { settings, updateSettings, resetGame, currentFps } = useGame();

  const handleReset = () => {
    sounds.playAlertSound();
    if (window.confirm('هل أنت متأكد من رغبتك في إعادة ضبط اللعبة وبدء صيدلية جديدة من الصفر؟')) {
      resetGame();
      onClose();
    }
  };

  const handleClose = () => {
    sounds.playPopSound();
    onClose();
  };

  const handleQualityChange = (q: GraphicsQuality) => {
    sounds.playPopSound();
    updateSettings({ graphicsQuality: q });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 pointer-events-auto select-none">
      <div className="w-full max-w-md bg-[#f8fbf9] rounded-t-3xl sm:rounded-3xl shadow-[0_15px_35px_rgba(0,0,0,0.35)] border-2 border-emerald-300 overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[85vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2 shrink-0 sm:hidden" />

        {/* 3D Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-emerald-100 to-teal-100 border-b-2 border-emerald-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-slate-800 text-sm sm:text-base">إعدادات اللعبة والجرافيك</h3>
            <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full font-black font-mono shadow-xs">
              {currentFps} FPS
            </span>
          </div>

          <button
            onClick={handleClose}
            className="game-btn game-btn-white w-8 h-8 rounded-full flex items-center justify-center text-slate-700"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 pb-safe">
          {/* Graphics Quality Setting */}
          <div className="p-3.5 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-700">
                <MonitorCheck className="w-4 h-4" />
                <h4 className="text-xs sm:text-sm font-black text-slate-800">جودة الجرافيك والوضوح</h4>
              </div>
              <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                {settings.graphicsQuality === 'ultra' ? 'خارق Ultra HD' : settings.graphicsQuality === 'high' ? 'عالي High' : 'متوازن'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['ultra', 'high', 'balanced'] as GraphicsQuality[]).map(q => (
                <button
                  key={q}
                  onClick={() => handleQualityChange(q)}
                  className={`game-btn min-h-[44px] py-2 px-1 rounded-xl text-xs font-black border-2 ${
                    settings.graphicsQuality === q
                      ? 'game-btn-green scale-102'
                      : 'game-btn-white'
                  }`}
                >
                  {q === 'ultra' ? 'Ultra فائق' : q === 'high' ? 'High عالي' : 'متوازن'}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 leading-tight font-medium">
              وضع Ultra يُفعّل أعلى دقة ريتينا 3x مع وضوح فائق للرفوف، الإضاءة النيون والجسيمات ومعدل 60 إطار في الثانية (FPS).
            </p>
          </div>

          {/* FPS Counter Toggle */}
          <div className="p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-800">عرض عداد الإطارات (FPS)</h4>
                <p className="text-[11px] text-slate-400">مراقبة استقرار وسلاسة حركة الصيدلية</p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playPopSound();
                updateSettings({ showFps: !settings.showFps });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.showFps ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.showFps ? 'translate-x-0' : '-translate-x-6'
                }`}
              />
            </button>
          </div>

          {/* Audio Setting */}
          <div className="p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-800">المؤثرات الصوتية</h4>
                <p className="text-[11px] text-slate-400">رنين الكاشير، نقود الأرباح، وأصوات الصيدلية</p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playPopSound();
                updateSettings({ soundEnabled: !settings.soundEnabled });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.soundEnabled ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-0' : '-translate-x-6'
                }`}
              />
            </button>
          </div>

          {/* Game Speed Setting */}
          <div className="p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-700">
                <Sparkles className="w-4 h-4" />
                <h4 className="text-xs sm:text-sm font-black text-slate-800">سرعة محاكاة اللعبة</h4>
              </div>
              <span className="text-[11px] font-black font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                x{settings.gameSpeed}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {([1, 2, 3] as const).map(speed => (
                <button
                  key={speed}
                  onClick={() => {
                    sounds.playPopSound();
                    updateSettings({ gameSpeed: speed });
                  }}
                  className={`game-btn min-h-[40px] py-1.5 px-2 rounded-xl text-xs font-black border-2 ${
                    settings.gameSpeed === speed
                      ? 'game-btn-gold'
                      : 'game-btn-white'
                  }`}
                >
                  {speed === 1 ? 'عادي 1x' : speed === 2 ? 'سريع 2x' : 'فائق 3x'}
                </button>
              ))}
            </div>
          </div>

          {/* Guide & Reset Buttons */}
          <div className="pt-1 space-y-2">
            <button
              onClick={() => {
                sounds.playPopSound();
                onOpenHowToPlay();
              }}
              className="game-btn game-btn-white w-full py-2.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 text-slate-800"
            >
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>دليل الصيدلي وطريقة اللعب 📖</span>
            </button>

            <button
              onClick={handleReset}
              className="game-btn w-full py-2.5 px-3 rounded-2xl text-xs font-black bg-rose-50 hover:bg-rose-100 text-rose-700 border-2 border-rose-200 shadow-[0_3px_0_#f43f5e] flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة ضبط اللعبة والبدء من الصفر</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
