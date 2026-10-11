import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { MedicineBoxArt } from '../MedicineBoxArt';
import { ChevronRight, Search, ShoppingCart, AlertTriangle } from 'lucide-react';

interface Props {
  onClose: () => void;
  onQuickOrder: (productId: string) => void;
}

export const ShortagesModal: React.FC<Props> = ({ onClose, onQuickOrder }) => {
  const { getShortages } = useGame();
  const [searchQuery, setSearchQuery] = useState('');

  const shortages = getShortages().filter(p =>
    p.name.includes(searchQuery) ||
    p.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 pointer-events-auto">
      <div className="w-full max-w-lg bg-[#f8fbf9] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-rose-100 overflow-hidden flex flex-col h-[90dvh] sm:h-[85vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        {/* Mobile Drag Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2 shrink-0 sm:hidden" />

        {/* Header */}
        <div className="px-4 py-2.5 sm:py-3 bg-white border-b border-rose-100 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="min-h-[40px] flex items-center gap-1.5 text-slate-800 hover:text-rose-700 font-bold text-sm sm:text-base transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
            <span>نواقص الأدوية والطلبات</span>
          </button>
          <span className="text-xs bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full font-bold">
            {shortages.length} أصناف عاجلة
          </span>
        </div>

        {/* Search Bar */}
        <div className="p-2.5 sm:p-3 bg-white border-b border-slate-100 flex items-center gap-2 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="بحث في النواقص..."
              className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-rose-400 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Shortages Alert Info */}
        <div className="p-2.5 sm:p-3 bg-rose-50/70 border-b border-rose-100 flex items-center gap-2 text-[11px] sm:text-xs text-rose-800 shrink-0">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <p>
            أصناف نفدت أو انخفضت عن الحد الأدنى. اطلبها فوراً من الموزعين!
          </p>
        </div>

        {/* Shortages List */}
        <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-2 pb-safe">
          {shortages.length === 0 ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center">
              <span className="text-4xl mb-2">🎉</span>
              <p className="text-sm font-bold text-emerald-700">لا توجد نواقص في الصيدلية حالياً!</p>
              <p className="text-xs text-slate-400 mt-1">جميع الأدوية متوفرة بأرصدة كافية ومستقرة</p>
            </div>
          ) : (
            shortages.map(product => {
              const neededCount = Math.max(10, product.maxStock - product.stock);

              return (
                <div
                  key={product.id}
                  className="p-2.5 sm:p-3 bg-white rounded-2xl border border-rose-100 hover:border-rose-300 shadow-xs flex items-center justify-between gap-2.5 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MedicineBoxArt product={product} size="sm" />
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        {product.nameEn}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold text-slate-500 font-mono">
                          متاح: <strong className={product.stock === 0 ? 'text-rose-600' : 'text-amber-600'}>{product.stock}</strong>
                        </span>
                        <span className="text-[10px] text-slate-400">·</span>
                        <span className="text-xs font-bold text-rose-700">
                          مطلوب: {neededCount} علبة
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-black">
                      مطلوب
                    </span>

                    <button
                      onClick={() => {
                        onClose();
                        onQuickOrder(product.id);
                      }}
                      className="min-h-[40px] min-w-[40px] p-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-sm flex items-center justify-center transition-colors active:scale-95"
                      title="طلب فوري من المورد"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
