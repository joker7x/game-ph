import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Product } from '../../types/game';
import { MedicineBoxArt } from '../MedicineBoxArt';
import { Search, Filter, Plus, ChevronRight, X, AlertTriangle } from 'lucide-react';
import { CATEGORY_LABELS } from '../../data/products';

interface Props {
  onClose: () => void;
  onOpenOrdersModal: (productId?: string) => void;
  initialCategory?: string | null;
}

export const InventoryModal: React.FC<Props> = ({ onClose, onOpenOrdersModal, initialCategory }) => {
  const { products } = useGame();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.includes(searchQuery) ||
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 pointer-events-auto">
      <div className="w-full max-w-lg bg-[#f8fbf9] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col h-[90dvh] sm:h-[85vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        {/* Mobile Drag Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2 shrink-0 sm:hidden" />

        {/* Header */}
        <div className="px-4 py-2.5 sm:py-3 bg-white border-b border-emerald-100 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="min-h-[40px] flex items-center gap-1.5 text-slate-800 hover:text-emerald-700 font-bold text-sm sm:text-base transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
            <span>المخزون والصيدلية</span>
          </button>
          <span className="text-xs text-slate-500 font-mono">
            {filteredProducts.length} صنف
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
              placeholder="بحث عن دواء أو مادة فعالة..."
              className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-emerald-400 focus:bg-white transition-colors"
            />
          </div>
          <button
            onClick={() => setSelectedCategory('all')}
            className="min-h-[38px] min-w-[38px] p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center"
            title="إعادة ضبط التصنيف"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Category Pills Bar */}
        <div className="px-3 py-1.5 sm:py-2 bg-white/50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors min-h-[36px] ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            الجميع
          </button>
          {Object.entries(CATEGORY_LABELS).map(([catKey, catVal]) => (
            <button
              key={catKey}
              onClick={() => setSelectedCategory(catKey)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors min-h-[36px] ${
                selectedCategory === catKey
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {catVal.label}
            </button>
          ))}
        </div>

        {/* Products List */}
        <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-2 pb-safe">
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center">
              <Search className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">لا توجد أدوية مطابقة للبحث</p>
            </div>
          ) : (
            filteredProducts.map(product => {
              const isOutOfStock = product.stock === 0;
              const isLowStock = product.stock <= product.minThreshold && !isOutOfStock;

              return (
                <div
                  key={product.id}
                  onClick={() => setDetailProduct(product)}
                  className="p-2.5 sm:p-3 bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 shadow-xs flex items-center justify-between gap-2.5 cursor-pointer transition-all active:scale-98"
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
                        <span className="text-xs font-bold text-emerald-600 font-mono">
                          {product.price} EGP
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ({product.cost} ج.م)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Stock badge */}
                    {isOutOfStock ? (
                      <span className="px-2 py-0.5 rounded-lg bg-rose-100 text-rose-700 text-[11px] font-black">
                        نفد
                      </span>
                    ) : (
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-medium ${
                          isLowStock
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        متاح {product.stock}
                      </span>
                    )}

                    {/* Quick order button */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onClose();
                        onOpenOrdersModal(product.id);
                      }}
                      className="min-h-[36px] min-w-[36px] p-2 rounded-xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 text-slate-600 transition-colors flex items-center justify-center active:scale-95"
                      title="طلب توريد من المورد"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Medicine Detail Modal */}
        {detailProduct && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-60 pointer-events-auto">
            <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-4 sm:p-5 pb-safe shadow-2xl border border-slate-100 space-y-3.5 animate-in slide-in-from-bottom sm:zoom-in-95">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MedicineBoxArt product={detailProduct} size="md" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {detailProduct.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {detailProduct.nameEn}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDetailProduct(null)}
                  className="min-h-[36px] min-w-[36px] p-1 rounded-lg text-slate-400 hover:text-slate-700 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                <p className="text-slate-600">
                  <strong className="text-slate-800">الاستخدام:</strong> {detailProduct.description}
                </p>
                <p className="text-slate-600">
                  <strong className="text-slate-800">الجرعة المقترحة:</strong> {detailProduct.dosage}
                </p>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span>سعر البيع: <strong>{detailProduct.price} ج.م</strong></span>
                  <span>سعر الشراء: <strong>{detailProduct.cost} ج.م</strong></span>
                </div>
                <div className="flex justify-between">
                  <span>الرصيد الحالي: <strong>{detailProduct.stock} علبة</strong></span>
                  <span>الحد الأقصى للرف: <strong>{detailProduct.maxStock} علبة</strong></span>
                </div>
              </div>

              {detailProduct.isColdChain && (
                <div className="p-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-[11px] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-sky-600" />
                  <span>دواء مبرد: يتطلب حفظه داخل ثلاجة الصيدلية (2-8 درجات).</span>
                </div>
              )}

              <button
                onClick={() => {
                  const id = detailProduct.id;
                  setDetailProduct(null);
                  onClose();
                  onOpenOrdersModal(id);
                }}
                className="w-full min-h-[46px] py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-md transition-colors active:scale-95"
              >
                طلب شحنة من الموزع 🚚
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
