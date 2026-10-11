import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Customer } from '../../types/game';
import { ChevronRight, FileText, CheckCircle2, Clock } from 'lucide-react';
import { CUSTOMER_AVATARS } from '../../data/customers';

interface Props {
  onClose: () => void;
  onSelectCustomer: (cust: Customer) => void;
}

export const PrescriptionsModal: React.FC<Props> = ({ onClose, onSelectCustomer }) => {
  const { customers } = useGame();
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'completed'>('all');

  const pendingCustomers = customers.filter(c => c.status === 'waiting');

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
            <span>الروشتات والعملاء</span>
          </button>
          <span className="text-xs text-slate-500 font-mono">
            {pendingCustomers.length} في الانتظار
          </span>
        </div>

        {/* Tabs: الجميع / قيد التنفيذ / تم التنفيذ */}
        <div className="p-2 sm:p-3 bg-white border-b border-slate-100 flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setFilterTab('all')}
            className={`flex-1 min-h-[38px] py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
              filterTab === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            الجميع ({pendingCustomers.length})
          </button>
          <button
            onClick={() => setFilterTab('pending')}
            className={`flex-1 min-h-[38px] py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
              filterTab === 'pending'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            قيد الانتظار ({pendingCustomers.length})
          </button>
          <button
            onClick={() => setFilterTab('completed')}
            className={`flex-1 min-h-[38px] py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
              filterTab === 'completed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            تم الصرف
          </button>
        </div>

        {/* Prescriptions List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 pb-safe">
          {filterTab === 'completed' ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center">
              <CheckCircle2 className="w-10 h-10 mb-2 text-emerald-400" />
              <p className="text-sm font-bold text-slate-600">تم تسجيل كافة الروشتات السابقة بنجاح</p>
              <p className="text-xs text-slate-400 mt-1">تظهر الروشتات المكتملة في سجل الحسابات والأرباح</p>
            </div>
          ) : pendingCustomers.length === 0 ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center">
              <FileText className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm font-bold text-slate-600">لا يوجد عملاء في الانتظار حالياً</p>
              <p className="text-xs text-slate-400 mt-1">سيتوافد الزبائن إلى الصيدلية تلقائياً خلال لحظات...</p>
            </div>
          ) : (
            pendingCustomers.map(cust => {
              const avatarInfo = CUSTOMER_AVATARS[cust.avatarSeed % CUSTOMER_AVATARS.length];

              return (
                <div
                  key={cust.id}
                  onClick={() => {
                    onClose();
                    onSelectCustomer(cust);
                  }}
                  className="p-3 sm:p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-xs flex items-center justify-between gap-2.5 cursor-pointer transition-all active:scale-98"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-slate-800 font-bold text-sm shadow-xs shrink-0"
                      style={{ backgroundColor: avatarInfo.bg }}
                    >
                      👤
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                        {cust.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-500">
                          {cust.prescription.length} أصناف
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />
                          صبر: {cust.patience}ث
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="px-2 py-0.5 rounded-lg bg-sky-100 text-sky-800 text-[10px] font-bold">
                      في الانتظار
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-emerald-600 font-mono">
                      {cust.totalPrice} EGP
                    </span>
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
