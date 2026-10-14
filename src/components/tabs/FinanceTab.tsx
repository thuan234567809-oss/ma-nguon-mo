import React from 'react';
import { GameState } from '../../types/game';
import { DollarSign, TrendingDown, TrendingUp, AlertTriangle, Building, CreditCard } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FinanceTabProps {
  state: GameState;
  onTakeLoan: (amount: number) => void;
}

export const FinanceTab: React.FC<FinanceTabProps> = ({ state, onTakeLoan }) => {
  const { lang } = useLanguage();
  const f = state.finances;
  const currentRent = state.districts[state.currentDistrict]?.baseRent || 120;
  const currentPayroll = state.staff.reduce((sum, s) => sum + s.salary, 0);
  const currentUtilities = 35 + state.equipment.length * 8 + state.tables.length * 4;
  const currentMarketing = state.marketing.filter(m => m.active).reduce((sum, m) => sum + m.dailyCost, 0);
  const currentMaintenance = state.equipment.reduce((sum, e) => sum + (100 - e.condition) * 0.2, 0);

  const projectedDailyExpenses = f.cogsToday + currentRent + currentPayroll + currentUtilities + currentMarketing + currentMaintenance;
  const grossProfitToday = f.revenueToday - f.cogsToday;
  const projectedNetProfit = f.revenueToday - projectedDailyExpenses;
  const grossMarginPct = f.revenueToday > 0 ? Math.round((grossProfitToday / f.revenueToday) * 100) : 0;

  return (
    <div className="space-y-4 select-none">
      {/* Financial Reality Banner */}
      <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-start gap-3">
        <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-bold text-slate-100 flex items-center gap-2">
            <span>{lang === 'vi' ? 'Kỷ Luật Quản Trị Tài Chính F&B' : 'Executive Financial Discipline'}</span>
            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-mono">
              {lang === 'vi' ? 'Dòng Tiền ≠ Lợi Nhuận' : 'Cash ≠ Profit'}
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            {lang === 'vi'
              ? 'Doanh thu trên sổ sách chưa phải là tiền trong túi. Một quán F&B có thể có lãi kế toán nhưng vẫn phá sản nếu thiếu tiền mặt thanh toán tiền mặt bằng và lương nhân sự vào nửa đêm!'
              : 'Revenue does not mean profit. An F&B business can show accounting profit but still collapse into bankruptcy if immediate cash runs out before rent and payroll are settled at midnight!'}
          </p>
        </div>
      </div>

      {/* Primary Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Cash on Hand */}
        <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>{lang === 'vi' ? 'Dự Trữ Tiền Mặt Thực Tế' : 'Liquid Cash Reserves'}</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className={`text-2xl font-bold font-mono-num mt-1 ${f.cash < 400 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
            ${Math.round(f.cash).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {lang === 'vi' ? 'Sẵn sàng chi trả lương, mặt bằng & nhập hàng' : 'Available for payroll, rent & inventory'}
          </div>
        </div>

        {/* Today's Gross Margin */}
        <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>{lang === 'vi' ? 'Biên Lợi Nhuận Gộp' : 'Gross Profit Margin'}</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono-num text-cyan-300 mt-1">
            {grossMarginPct}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {lang === 'vi' ? 'Lợi nhuận gộp: ' : 'Gross Profit: '}${Math.round(grossProfitToday)}
          </div>
        </div>

        {/* Projected Daily Net Profit */}
        <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>{lang === 'vi' ? 'Lợi Nhuận Ròng Dự Phóng' : 'Projected Net Profit'}</span>
            {projectedNetProfit >= 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <div className={`text-2xl font-bold font-mono-num mt-1 ${projectedNetProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {projectedNetProfit >= 0 ? `+$${Math.round(projectedNetProfit)}` : `-$${Math.round(Math.abs(projectedNetProfit))}`}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {lang === 'vi' ? 'Sau khi trừ toàn bộ định phí vận hành trong ngày' : 'After settling all daily fixed overhead'}
          </div>
        </div>
      </div>

      {/* Detailed Income Statement (P&L Breakdown) */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Building className="w-4 h-4 text-amber-400" />{' '}
          {lang === 'vi' ? 'Báo Cáo Kết Quả Kinh Doanh Hàng Ngày (P&L Ledger)' : 'Daily Income Statement (P&L Ledger)'}
        </h3>

        <div className="space-y-1.5 text-xs font-mono-num">
          {/* Revenue */}
          <div className="flex justify-between py-1 px-2.5 rounded-lg bg-slate-950/60 text-slate-200">
            <span className="text-slate-300 font-medium">
              {lang === 'vi' ? '1. Tổng Doanh Thu Bán Món (Khách hàng)' : '1. Gross Revenue (Customer Orders)'}
            </span>
            <span className="text-emerald-400 font-bold">+${Math.round(f.revenueToday).toLocaleString()}</span>
          </div>

          {/* COGS */}
          <div className="flex justify-between py-1 px-2.5 rounded-lg bg-slate-950/60 text-slate-400">
            <span>{lang === 'vi' ? '2. Giá Vốn Hàng Bán (COGS Nguyên liệu)' : '2. COGS (Ingredient Recipe Costs)'}</span>
            <span className="text-rose-400">-${Math.round(f.cogsToday).toLocaleString()}</span>
          </div>

          {/* Gross Profit subtotal */}
          <div className="flex justify-between py-1 px-2.5 rounded-lg bg-slate-800/60 text-slate-100 font-bold border-t border-slate-700">
            <span>= {lang === 'vi' ? 'Lợi Nhuận Gộp' : 'Gross Profit'}</span>
            <span className={grossProfitToday >= 0 ? 'text-emerald-300' : 'text-rose-400'}>
              ${Math.round(grossProfitToday).toLocaleString()}
            </span>
          </div>

          {/* Operating Expenses */}
          <div className="pt-2 text-[11px] font-sans font-bold text-slate-400 uppercase">
            {lang === 'vi' ? 'Chi Phí Hoạt Động (OPEX):' : 'Operating Expenses (OPEX):'}
          </div>

          <div className="flex justify-between py-1 px-2.5 rounded-lg bg-slate-950/40 text-slate-400">
            <span>• {lang === 'vi' ? 'Tiền Thuê Mặt Bằng' : 'Commercial Lease Rent'}</span>
            <span className="text-rose-400">-${currentRent}</span>
          </div>

          <div className="flex justify-between py-1 px-2.5 rounded-lg bg-slate-950/40 text-slate-400">
            <span>• {lang === 'vi' ? 'Lương Nhân Sự Trong Ca' : 'Crew Payroll & Staff Wages'}</span>
            <span className="text-rose-400">-${currentPayroll}</span>
          </div>

          <div className="flex justify-between py-1 px-2.5 rounded-lg bg-slate-950/40 text-slate-400">
            <span>• {lang === 'vi' ? 'Điện, Nước, Ga & Tiện Ích' : 'Utilities (Power, Water, Gas)'}</span>
            <span className="text-rose-400">-${currentUtilities}</span>
          </div>

          <div className="flex justify-between py-1 px-2.5 rounded-lg bg-slate-950/40 text-slate-400">
            <span>• {lang === 'vi' ? 'Ngân Sách Tiếp Thị Quảng Cáo' : 'Marketing & Promotional Ads'}</span>
            <span className="text-rose-400">-${currentMarketing}</span>
          </div>

          <div className="flex justify-between py-1 px-2.5 rounded-lg bg-slate-950/40 text-slate-400">
            <span>• {lang === 'vi' ? 'Khấu Hao & Bảo Trì Thiết Bị' : 'Equipment Wear & Maintenance'}</span>
            <span className="text-rose-400">-${Math.round(currentMaintenance)}</span>
          </div>

          {/* Total Net Profit */}
          <div className="flex justify-between py-1.5 px-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-slate-100 font-bold text-sm mt-2">
            <span>{lang === 'vi' ? 'Lợi Nhuận Ròng Ước Tính (Net Profit)' : 'Estimated Net Profit'}</span>
            <span className={projectedNetProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              {projectedNetProfit >= 0 ? `+$${Math.round(projectedNetProfit)}` : `-$${Math.round(Math.abs(projectedNetProfit))}`}
            </span>
          </div>
        </div>
      </div>

      {/* Financing & Emergency Credit */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-100">
              {lang === 'vi' ? 'Hạn Mức Thấu Chi Vốn Lưu Động Thương Mại' : 'Commercial Working Capital Credit Line'}
            </div>
            <div className="text-[11px] text-slate-400">
              {lang === 'vi'
                ? 'Rút ngay $2,000 tiền mặt khẩn cấp để bổ sung thanh khoản hoặc mở rộng kinh doanh.'
                : 'Draw $2,000 emergency liquid capital to survive tight cashflow or rapid expansion.'}
            </div>
          </div>
        </div>

        <button
          onClick={() => onTakeLoan(2000)}
          className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-md shadow-emerald-500/20"
        >
          {lang === 'vi' ? 'Rút +$2,000 Tiền Mặt' : 'Draw +$2,000 Cash'}
        </button>
      </div>
    </div>
  );
};
