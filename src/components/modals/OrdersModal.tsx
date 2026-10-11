import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { SUPPLIERS } from '../../data/suppliers';
import { MedicineBoxArt } from '../MedicineBoxArt';
import { ChevronRight, Truck, CheckCircle2, Clock, Plus, Minus, ShoppingCart, AlertCircle } from 'lucide-react';

interface Props {
  onClose: () => void;
  preselectedProductId?: string;
}

export const OrdersModal: React.FC<Props> = ({ onClose, preselectedProductId }) => {
  const { products, orders, orderFromSupplier, collectOrder, coins } = useGame();
  const [activeTab, setActiveTab] = useState<'new' | 'transit' | 'delivered'>('new');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('ibnsina');

  const [cart, setCart] = useState<Record<string, number>>(() => {
    if (preselectedProductId) {
      return { [preselectedProductId]: 10 };
    }
    return {};
  });
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const selectedSupplier = SUPPLIERS.find(s => s.id === selectedSupplierId) || SUPPLIERS[0];

  const handleUpdateCart = (productId: string, delta: number) => {
    setCart(prev => {
      const current = prev[productId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: next };
    });
  };

  const cartEntries = Object.entries(cart);
  const rawTotal = cartEntries.reduce((sum, [pId, qty]) => {
    const prod = products.find(p => p.id === pId);
    return sum + (prod ? prod.cost * qty : 0);
  }, 0);

  const discountAmount = Math.round((rawTotal * selectedSupplier.discountPercentage) / 100);
  const netTotal = Math.max(0, rawTotal - discountAmount);

  const handlePlaceOrder = () => {
    if (cartEntries.length === 0) {
      setFeedbackMsg({ text: 'يرجى اختيار صنف واحد على الأقل للطلب', isError: true });
      return;
    }

    const items = cartEntries.map(([productId, quantity]) => ({ productId, quantity }));
    const res = orderFromSupplier(selectedSupplier.id, items);

    if (!res.success) {
      setFeedbackMsg({ text: res.message || 'فشل إرسال الطلب', isError: true });
    } else {
      setFeedbackMsg({ text: `تم إرسال الطلبية بنجاح إلى ${selectedSupplier.name}! جاري التوصيل...`, isError: false });
      setCart({});
      setActiveTab('transit');
    }
  };

  const inTransitOrders = orders.filter(o => o.status === 'in_transit');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 pointer-events-auto">
      <div className="w-full max-w-lg bg-[#f8fbf9] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-amber-100 overflow-hidden flex flex-col h-[92dvh] sm:h-[88vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        {/* Mobile Drag Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2 shrink-0 sm:hidden" />

        {/* Header */}
        <div className="px-4 py-2.5 sm:py-3 bg-white border-b border-amber-100 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="min-h-[40px] flex items-center gap-1.5 text-slate-800 hover:text-amber-700 font-bold text-sm sm:text-base transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
            <span>توريد وطلبيات الأدوية</span>
          </button>
          <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
            شركات التوزيع
          </span>
        </div>

        {/* Tabs: جديد / قيد التنفيذ / تم الاستلام */}
        <div className="p-2 sm:p-3 bg-white border-b border-slate-100 flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 min-h-[38px] py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
              activeTab === 'new'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            طلب جديد
          </button>
          <button
            onClick={() => setActiveTab('transit')}
            className={`flex-1 min-h-[38px] py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
              activeTab === 'transit'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            قيد التوصيل ({inTransitOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('delivered')}
            className={`flex-1 min-h-[38px] py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
              activeTab === 'delivered'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            جاهز ({deliveredOrders.length})
          </button>
        </div>

        {/* Feedback Banner */}
        {feedbackMsg && (
          <div
            className={`mx-3 mt-2 p-2 rounded-xl text-xs flex items-center gap-2 shrink-0 ${
              feedbackMsg.isError
                ? 'bg-rose-50 border border-rose-200 text-rose-700'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Tab 1: New Order */}
        {activeTab === 'new' && (
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 pb-safe">
            {/* Supplier Selector Cards */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                اختر شركة التوزيع / الموزع:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SUPPLIERS.map(sup => {
                  const isSelected = selectedSupplierId === sup.id;
                  return (
                    <div
                      key={sup.id}
                      onClick={() => setSelectedSupplierId(sup.id)}
                      className={`p-2.5 rounded-2xl border cursor-pointer transition-all active:scale-98 ${
                        isSelected
                          ? 'bg-amber-50/80 border-amber-400 shadow-xs ring-2 ring-amber-200'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                          {sup.name}
                        </h4>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1 rounded">
                          {sup.discountPercentage}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-amber-700 font-mono mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{sup.deliveryTimeSeconds} ث</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Products Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  الأدوية المطلوبة للطلبية:
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {cartEntries.length} أصناف
                </span>
              </div>

              <div className="space-y-1.5 max-h-48 sm:max-h-56 overflow-y-auto p-1 border border-slate-200/80 rounded-2xl bg-white">
                {products.map(prod => {
                  const qty = cart[prod.id] || 0;
                  return (
                    <div
                      key={prod.id}
                      className="p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between gap-2 border-b border-slate-100 last:border-0"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <MedicineBoxArt product={prod} size="sm" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {prod.name}
                          </p>
                          <span className="text-[10px] text-slate-500">
                            جملة: {prod.cost} ج.م · رصيد: {prod.stock}
                          </span>
                        </div>
                      </div>

                      {/* Quantity stepper */}
                      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 shrink-0">
                        <button
                          onClick={() => handleUpdateCart(prod.id, -5)}
                          className="w-7 h-7 rounded bg-white text-slate-700 flex items-center justify-center font-bold text-xs shadow-xs active:scale-95"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center font-bold font-mono text-xs text-slate-800">
                          {qty}
                        </span>
                        <button
                          onClick={() => handleUpdateCart(prod.id, 5)}
                          className="w-7 h-7 rounded bg-white text-slate-700 flex items-center justify-center font-bold text-xs shadow-xs active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cost Summary & Order Button */}
            <div className="p-2.5 sm:p-3 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>الإجمالي قبل الخصم:</span>
                <span className="font-mono">{rawTotal.toLocaleString()} ج.م</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>خصم الموزع ({selectedSupplier.discountPercentage}%):</span>
                <span className="font-mono">-{discountAmount.toLocaleString()} ج.م</span>
              </div>
              <div className="flex justify-between font-black text-slate-900 pt-1 border-t border-amber-200">
                <span>الصافي المطلوب:</span>
                <span className="text-amber-800 font-mono text-sm sm:text-base">{netTotal.toLocaleString()} EGP</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={cartEntries.length === 0 || coins < netTotal}
              className={`game-btn w-full min-h-[48px] py-3 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 ${
                cartEntries.length === 0 || coins < netTotal
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none border-2 border-slate-300'
                  : 'game-btn-gold'
              }`}
            >
              <ShoppingCart className="w-4 h-4 text-amber-950 fill-amber-300" />
              <span>
                {coins < netTotal
                  ? 'الرصيد غير كافٍ لإتمام الطلب'
                  : `تأكيد وإرسال الطلبية (${netTotal.toLocaleString()} EGP)`}
              </span>
            </button>
          </div>
        )}

        {/* Tab 2: In Transit */}
        {activeTab === 'transit' && (
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 pb-safe">
            {inTransitOrders.length === 0 ? (
              <div className="py-16 text-center text-slate-400 flex flex-col items-center">
                <Truck className="w-10 h-10 mb-2 opacity-50 text-amber-500" />
                <p className="text-sm font-bold text-slate-600">لا توجد شحنات قيد التوصيل الآن</p>
                <p className="text-xs text-slate-400 mt-1">يمكنك إرسال طلبية جديدة لتغذية المخزون</p>
              </div>
            ) : (
              inTransitOrders.map(order => {
                const remainingSeconds = Math.max(0, Math.ceil((order.deliveredAt - Date.now()) / 1000));
                const progress = Math.min(
                  100,
                  Math.round(((order.deliveryDuration - remainingSeconds) / order.deliveryDuration) * 100)
                );

                return (
                  <div
                    key={order.id}
                    className="p-3 sm:p-4 bg-white rounded-2xl border border-amber-200 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                          <Truck className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-800">{order.supplierName}</h4>
                          <span className="text-[10px] text-slate-400">
                            {order.items.length} أصناف • {order.totalCost} EGP
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        {remainingSeconds} ث
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>سيارة الشحن في الطريق...</span>
                        <span>{progress}%</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 3: Delivered & History */}
        {activeTab === 'delivered' && (
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 pb-safe">
            {deliveredOrders.length === 0 ? (
              <div className="py-16 text-center text-slate-400 flex flex-col items-center">
                <CheckCircle2 className="w-10 h-10 mb-2 opacity-50 text-emerald-500" />
                <p className="text-sm font-bold text-slate-600">لا توجد طلبيات جاهزة للاستلام حالياً</p>
                <p className="text-xs text-slate-400 mt-1">ستصل الشحنات فور انتهاء وقت التوصيل</p>
              </div>
            ) : (
              deliveredOrders.map(order => (
                <div
                  key={order.id}
                  className="p-3 sm:p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 shadow-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-emerald-900">
                        وصلت شحنة {order.supplierName} 📦
                      </h4>
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        تحتوي على {order.items.length} أصناف جاهزة لتعبئة الرفوف
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                      جاهز
                    </span>
                  </div>

                  <button
                    onClick={() => collectOrder(order.id)}
                    className="game-btn game-btn-green w-full min-h-[44px] py-2.5 font-black text-xs rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <span>استلام الشحنة وتعبئة الرفوف فوراً ✨</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
