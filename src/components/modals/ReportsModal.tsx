import React from 'react';
import { useGame } from '../../context/GameContext';
import { ChevronRight, TrendingUp, DollarSign, Users, Award, AlertCircle } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const ReportsModal: React.FC<Props> = ({ onClose }) => {
  const { todayReport, level, levelTitle } = useGame();

  const satisfactionRate =
    todayReport.customersServed + todayReport.customersLost > 0
      ? Math.round(
          (todayReport.customersServed /
            (todayReport.customersServed + todayReport.customersLost)) *
            100
        )
      : 100;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 pointer-events-auto">
      <div className="w-full max-w-md bg-[#f8fbf9] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col h-[88dvh] sm:h-[78vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        {/* Mobile Drag Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2 shrink-0 sm:hidden" />

        {/* Header */}
        <div className="px-4 py-2.5 sm:py-3 bg-white border-b border-sky-100 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="min-h-[40px] flex items-center gap-1.5 text-slate-800 hover:text-sky-700 font-bold text-sm sm:text-base transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
            <span>التقارير اليومية والأرباح</span>
          </button>
          <span className="text-xs bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded-full font-bold">
            اليوم {todayReport.dayNumber}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 pb-safe">
          {/* Pharmacy Status Card */}
          <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] text-emerald-100 font-bold">رتبة الإدارة:</span>
              <h3 className="text-sm sm:text-base font-black mt-0.5">{levelTitle}</h3>
              <p className="text-[11px] text-emerald-100 mt-0.5">المستوى {level} • صيدلية 24 مصر</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl sm:text-2xl">
              🏥
            </div>
          </div>

          {/* Financial Metrics Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 sm:p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-1.5 text-emerald-600 mb-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold text-slate-700">المبيعات</span>
              </div>
              <p className="text-sm sm:text-base font-extrabold text-slate-900 font-mono">
                {todayReport.totalRevenue.toLocaleString()} EGP
              </p>
            </div>

            <div className="p-2.5 sm:p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-1.5 text-rose-600 mb-0.5">
                <DollarSign className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold text-slate-700">المشتريات</span>
              </div>
              <p className="text-sm sm:text-base font-extrabold text-slate-900 font-mono">
                {todayReport.totalExpenses.toLocaleString()} EGP
              </p>
            </div>

            <div className="p-2.5 sm:p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-1.5 text-amber-600 mb-0.5">
                <Award className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold text-slate-700">الأرباح الصافية</span>
              </div>
              <p className="text-sm sm:text-base font-extrabold text-emerald-600 font-mono">
                {todayReport.netProfit.toLocaleString()} EGP
              </p>
            </div>

            <div className="p-2.5 sm:p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-1.5 text-sky-600 mb-0.5">
                <Users className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold text-slate-700">رضاء الزبائن</span>
              </div>
              <p className="text-sm sm:text-base font-extrabold text-sky-600 font-mono">
                {satisfactionRate}%
              </p>
            </div>
          </div>

          {/* Performance Breakdown */}
          <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1.5 text-xs">
            <h4 className="font-bold text-slate-800 text-xs sm:text-sm">تفاصيل حركة العمل:</h4>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">الروشتات المصروفة:</span>
              <strong className="text-slate-900 font-mono">{todayReport.prescriptionsFilled} روشتة</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">الزبائن المخدومين:</span>
              <strong className="text-emerald-700 font-mono">{todayReport.customersServed} عميل</strong>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600">فرص مبيعات فائتة:</span>
              <strong className="text-rose-600 font-mono">{todayReport.customersLost} عميل</strong>
            </div>
          </div>

          {/* Advice card */}
          <div className="p-2.5 rounded-2xl bg-sky-50/80 border border-sky-200 text-sky-900 text-[11px] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <p>
              نصيحة الصيدلي: احرص دائماً على مراجعة شاشة النواقص وإجراء طلبيات دورية من شركة ابن سينا أو إيفا فارما للحفاظ على رضاء العملاء!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
