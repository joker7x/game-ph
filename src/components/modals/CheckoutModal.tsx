import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Customer } from '../../types/game';
import { MedicineBoxArt } from '../MedicineBoxArt';
import { ChevronRight, Trash2, Plus, Minus, AlertCircle, Coins, CheckCircle2 } from 'lucide-react';
import { CUSTOMER_AVATARS } from '../../data/customers';

interface Props {
  customer: Customer;
  onClose: () => void;
  onOpenOrdersModal: () => void;
}

export const CheckoutModal: React.FC<Props> = ({ customer, onClose, onOpenOrdersModal }) => {
  const { products, dispensePrescription, rejectCustomer } = useGame();

  const [items, setItems] = useState(() =>
    customer.prescription.map(p => ({ ...p }))
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const avatarInfo = CUSTOMER_AVATARS[customer.avatarSeed % CUSTOMER_AVATARS.length];

  const handleQtyChange = (productId: string, delta: number) => {
    setItems(prev =>
      prev.map(it => {
        if (it.productId === productId) {
          const newQty = Math.max(1, it.quantity + delta);
          return { ...it, quantity: newQty };
        }
        return it;
      })
    );
  };

  const totalPrice = items.reduce((sum, item) => {
    const prod = products.find(p => p.id === item.productId);
    return sum + (prod ? prod.price * item.quantity : 0);
  }, 0);

  const stockErrors = items.map(item => {
    const prod = products.find(p => p.id === item.productId);
    const available = prod ? prod.stock : 0;
    return {
      productId: item.productId,
      isShortage: available < item.quantity,
      available,
      requested: item.quantity,
      name: prod?.name || 'صنف غير معروف'
    };
  });

  const hasShortages = stockErrors.some(e => e.isShortage);

  const handleDispense = () => {
    const shortageItem = stockErrors.find(e => e.isShortage);
    if (shortageItem) {
      setErrorMessage(`عذراً، الصنف (${shortageItem.name}) غير متوفر بالكمية المطلوبة (المتاح ${shortageItem.available})`);
      return;
    }

    const updatedCustomer: Customer = {
      ...customer,
      prescription: items,
      totalPrice
    };

    const res = dispensePrescription(updatedCustomer);
    if (!res.success) {
      setErrorMessage(res.message || 'حدث خطأ أثناء صرف الروشتة');
    } else {
      onClose();
    }
  };

  const handleReject = () => {
    rejectCustomer(customer, 'اعتذار لعدم توفر الصنف أو بناءً على رغبة العميل');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 pointer-events-auto">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[90vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        {/* Mobile Drag Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2 shrink-0 sm:hidden" />

        {/* Header */}
        <div className="px-4 py-2.5 sm:py-3 bg-emerald-50/80 border-b border-emerald-100 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="min-h-[40px] flex items-center gap-1 text-slate-700 hover:text-emerald-700 font-bold text-sm transition-colors active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
            <span>روشتة جديدة</span>
          </button>

          <button
            onClick={handleReject}
            className="min-h-[40px] min-w-[40px] p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors flex items-center justify-center active:scale-95"
            title="إلغاء واعتذار للعميل"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Customer Information Bar */}
        <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-800 font-bold text-sm shadow-xs border border-white"
              style={{ backgroundColor: avatarInfo.bg }}
            >
              👤
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">{customer.name}</h4>
              <p className="text-[10px] text-slate-500">
                {items.length} {items.length === 1 ? 'صنف مطلوب' : 'أصناف مطلوبة'}
              </p>
            </div>
          </div>

          {/* Patience Bar */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400 font-mono">
              صبر: {customer.patience}ث
            </span>
            <div className="w-16 sm:w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
              <div
                className={`h-full transition-all duration-300 ${
                  customer.patience > 20 ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'
                }`}
                style={{ width: `${(customer.patience / customer.maxPatience) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="mx-3 mt-2 p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Prescription Items List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
          {items.map(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return null;

            const isLowStock = product.stock < item.quantity;

            return (
              <div
                key={item.productId}
                className={`p-2.5 sm:p-3 rounded-2xl border transition-all ${
                  isLowStock
                    ? 'bg-rose-50/50 border-rose-200'
                    : 'bg-white border-slate-200 hover:border-emerald-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MedicineBoxArt product={product} size="sm" />
                    <div className="min-w-0">
                      <h5 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                        {product.name}
                      </h5>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-bold text-emerald-600 font-mono">
                          {product.price} ج.م
                        </span>
                        <span
                          className={`text-[9px] px-1 py-0.2 rounded font-medium ${
                            product.stock === 0
                              ? 'bg-rose-100 text-rose-700 font-bold'
                              : isLowStock
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {product.stock === 0
                            ? 'نفد بالمخزون!'
                            : `متاح: ${product.stock}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 shrink-0">
                    <button
                      onClick={() => handleQtyChange(item.productId, -1)}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center font-bold text-xs shadow-xs active:scale-95"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-bold font-mono text-xs text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQtyChange(item.productId, 1)}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center font-bold text-xs shadow-xs active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {isLowStock && (
                  <div className="mt-2 pt-2 border-t border-rose-100 flex items-center justify-between text-[11px] text-rose-600">
                    <span>الصنف ناقص بالمخزون</span>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenOrdersModal();
                      }}
                      className="text-emerald-700 font-bold hover:underline"
                    >
                      طلب توريد الآن 🚚
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer with Big Total Dispense Button */}
        <div className="p-3 sm:p-4 pb-safe bg-emerald-50/60 border-t border-emerald-100 space-y-1.5 shrink-0">
          <button
            onClick={handleDispense}
            disabled={hasShortages}
            className={`game-btn w-full min-h-[50px] py-3.5 px-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 ${
              hasShortages
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none border-2 border-slate-300'
                : 'game-btn-green'
            }`}
          >
            <Coins className="w-5 h-5 text-amber-200 fill-amber-300" />
            <span>صرف الروشتة • {totalPrice.toLocaleString()} EGP</span>
            <CheckCircle2 className="w-5 h-5 text-white" />
          </button>

          {hasShortages && (
            <p className="text-[10px] sm:text-[11px] text-center text-rose-600 font-bold">
              لا يمكن صرف الروشتة لوجود أصناف غير متوفرة بالمخزون
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
