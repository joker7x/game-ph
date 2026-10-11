import React from 'react';
import { ChevronRight, HeartHandshake, Package, Truck, ArrowUpCircle } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-60 pointer-events-auto">
      <div className="w-full max-w-md bg-[#f8fbf9] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col max-h-[90dvh] sm:max-h-[85vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        {/* Mobile Drag Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2 shrink-0 sm:hidden" />

        <div className="px-4 py-2.5 sm:py-3 bg-white border-b border-emerald-100 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="min-h-[40px] flex items-center gap-1.5 text-slate-800 hover:text-emerald-700 font-bold text-sm sm:text-base transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
            <span>دليل اللعب وكيفية إدارة الصيدلية</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 text-xs text-slate-700 pb-safe">
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">1. خدمة الزبائن وصرف الروشتات</h4>
              <p className="text-slate-500 mt-0.5 leading-relaxed text-[11px]">
                يصل الزبائن إلى طابور الكاشير ولديهم روشتة بأدوية محددة. اضغط على الزبون أو الكاشير لفتح الروشتة ومراجعة الأصناف وصرفها لكسب الجنيهات ونقاط الخبرة (XP).
              </p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">2. متابعة النواقص والأرصدة</h4>
              <p className="text-slate-500 mt-0.5 leading-relaxed text-[11px]">
                عند نفاذ أي دواء أو انخفاضه، سينتقل تلقائياً إلى شاشة "النواقص". احرص على تفقده باستمرار لكي لا يغادر الزبائن غاضبين!
              </p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">3. الطلب من شركات التوزيع</h4>
              <p className="text-slate-500 mt-0.5 leading-relaxed text-[11px]">
                اطلب الأدوية بالجملة من شركات التوزيع (ابن سينا فارما، إيفا فارما، أدويا). فور وصول الشحنة، اضغط "استلام" لتعبئة الرفوف!
              </p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <ArrowUpCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">4. تطوير الصيدلية وتوسعتها</h4>
              <p className="text-slate-500 mt-0.5 leading-relaxed text-[11px]">
                اشترِ معدات جديدة كالثلاجة المبردة لحفظ الأنسولين، ونظام الكمبيوتر، وعيّن مساعد صيدلي يخدم الزبائن تلقائياً!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full min-h-[46px] py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition-colors active:scale-95"
          >
            فهمت، لنبدأ إدارة الصيدلية! 💊
          </button>
        </div>
      </div>
    </div>
  );
};
