import React from 'react';
import { GameState } from '../../types/game';
import { Users, Clock, Utensils, Zap, TrendingUp, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface DashboardTabProps {
  state: GameState;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ state }) => {
  const { lang } = useLanguage();
  const occupiedSeats = state.tables.reduce((sum, t) => sum + (t.occupied ? t.seats : 0), 0);
  const totalSeats = state.tables.reduce((sum, t) => sum + t.seats, 0);
  const seatPercentage = totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0;

  const activeStaffCount = state.staff.filter(s => s.isWorking).length;
  const isOverCapacity = state.currentHourDemand > state.kitchenCapacityPerHour;

  const getRushDescription = (hour: number) => {
    if (hour >= 6.5 && hour < 9.5) {
      return {
        title: lang === 'vi' ? 'Cao Điểm Cà Phê Sáng' : 'Morning Coffee Rush',
        desc: lang === 'vi' ? 'Nhu cầu cao về cà phê pha máy, bánh sừng bò & phục vụ nhanh.' : 'High demand for espresso, croissants & fast service.',
        hot: true,
      };
    }
    if (hour >= 11.5 && hour < 14.0) {
      return {
        title: lang === 'vi' ? 'Đỉnh Điểm Giờ Ăn Trưa' : 'Peak Lunch Hour Surge',
        desc: lang === 'vi' ? 'Lượng đơn bùng nổ! Khách gọi burger, đồ ăn nóng và nước uống cùng lúc.' : 'Maximum orders! Burgers, meals & drinks simultaneously.',
        hot: true,
      };
    }
    if (hour >= 17.5 && hour < 20.5) {
      return {
        title: lang === 'vi' ? 'Cao Điểm Bữa Tối Thư Giãn' : 'Dinner Social Rush',
        desc: lang === 'vi' ? 'Gia đình & nhóm bạn gọi các món chính cao cấp với biên lãi lớn.' : 'Families & friend groups ordering high-margin main dishes.',
        hot: true,
      };
    }
    if (hour >= 20.5 || hour < 6.0) {
      return {
        title: lang === 'vi' ? 'Khoảng Lặng Ban Đêm' : 'Quiet Night Slump',
        desc: lang === 'vi' ? 'Ít khách vãng lai. Thời điểm lý tưởng để sơ chế và dọn dẹp quán.' : 'Low customer arrival. Great time to prep & clean.',
        hot: false,
      };
    }
    return {
      title: lang === 'vi' ? 'Lượng Khách Chiều Ổn Định' : 'Steady Afternoon Flow',
      desc: lang === 'vi' ? 'Khách làm việc từ xa, sinh viên nhâm nhi đồ uống mát lạnh.' : 'Casual visitors, iced drinks and remote workers.',
      hot: false,
    };
  };

  const rushInfo = getRushDescription(state.timeHour);

  return (
    <div className="space-y-4 select-none">
      {/* Rush Advisory Alert */}
      <div className={`p-4 rounded-xl border flex items-center justify-between ${rushInfo.hot ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-900/60 border-slate-800'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${rushInfo.hot ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}>
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-100">{rushInfo.title}</span>
              {rushInfo.hot && (
                <span className="text-[10px] bg-rose-500 text-white font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                  {lang === 'vi' ? 'GIỜ CAO ĐIỂM' : 'HIGH DEMAND'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{rushInfo.desc}</p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">
            {lang === 'vi' ? 'Lưu lượng khách khu vực' : 'District Traffic'}
          </div>
          <div className="text-sm font-bold text-amber-300 font-mono-num">
            {state.currentHourDemand} {lang === 'vi' ? 'khách / giờ' : 'guests / hr'}
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Served Orders */}
        <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{lang === 'vi' ? 'Đơn đã phục vụ' : 'Orders Served'}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono-num text-emerald-300 mt-1">
            {state.ordersServedToday}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {lang === 'vi' ? 'Khách thanh toán hài lòng' : "Today's happy checkouts"}
          </div>
        </div>

        {/* Lost Customers */}
        <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{lang === 'vi' ? 'Khách bỏ về' : 'Lost Customers'}</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className={`text-2xl font-bold font-mono-num mt-1 ${state.customersLostToday > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
            {state.customersLostToday}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {lang === 'vi' ? 'Bỏ về vì phải đợi lâu' : 'Left due to long queues'}
          </div>
        </div>

        {/* Kitchen Capacity vs Demand */}
        <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{lang === 'vi' ? 'Công suất bếp' : 'Kitchen Throughput'}</span>
            <Zap className={`w-4 h-4 ${isOverCapacity ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`} />
          </div>
          <div className="text-xl font-bold font-mono-num text-slate-100 mt-1">
            <span className={isOverCapacity ? 'text-rose-400' : 'text-amber-300'}>{state.kitchenCapacityPerHour}</span>
            <span className="text-xs text-slate-400 font-normal"> / {state.currentHourDemand} {lang === 'vi' ? 'món/giờ' : 'cap/hr'}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {isOverCapacity ? (lang === 'vi' ? '⚠️ Bếp Đang Quá Tải!' : '⚠️ Kitchen Overloaded!') : (lang === 'vi' ? 'Đáp ứng tốt nhu cầu' : 'Optimal prep throughput')}
          </div>
        </div>

        {/* Seating Occupancy */}
        <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{lang === 'vi' ? 'Lấp đầy bàn' : 'Table Occupancy'}</span>
            <Utensils className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono-num text-cyan-300 mt-1">
            {seatPercentage}%
            <span className="text-xs text-slate-400 font-normal"> ({occupiedSeats}/{totalSeats} {lang === 'vi' ? 'ghế' : 'seats'})</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {lang === 'vi' ? 'Sức chứa đang phục vụ' : 'Active dining capacity'}
          </div>
        </div>
      </div>

      {/* Operational Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Staffing Status */}
        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-400" /> {lang === 'vi' ? 'Nhân sự trong ca' : 'Crew on Shift'}
            </span>
            <span className="text-xs font-mono-num font-semibold text-blue-400">
              {activeStaffCount} {lang === 'vi' ? 'đang làm' : 'active'} / {state.staff.length} {lang === 'vi' ? 'tổng nhân sự' : 'hired'}
            </span>
          </div>
          <div className="space-y-1.5">
            {state.staff.map(s => (
              <div key={s.id} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.avatarColor }} />
                  <span className="font-medium text-slate-200">{s.name}</span>
                  <span className="text-[10px] text-slate-400">({s.role.replace('_', ' ')})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">{lang === 'vi' ? 'Căng thẳng: ' : 'Stress: '}{Math.round(s.stress)}%</span>
                  <span className="font-mono-num text-[11px] text-emerald-400">${s.salary}/{lang === 'vi' ? 'ngày' : 'day'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Economic History */}
        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> {lang === 'vi' ? 'Hiệu Quả Kinh Doanh Gần Nhất' : 'Recent Daily Performance'}
            </span>
            <span className="text-[10px] text-slate-400">{lang === 'vi' ? 'Sổ cái các ngày qua' : 'Last days ledger'}</span>
          </div>
          {state.finances.dailyHistory.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500 italic">
              {lang === 'vi' ? 'Đang hoạt động Ngày 1. Kết thúc ngày để ghi nhận sổ cái nửa đêm.' : 'Day 1 operations in progress. Complete day cycle to record nightly ledger.'}
            </div>
          ) : (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {state.finances.dailyHistory.slice(-4).reverse().map(h => (
                <div key={h.day} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 font-medium">{lang === 'vi' ? 'Ngày ' : 'Day '}{h.day}</span>
                  <span className="font-mono-num text-slate-300">${h.revenue} {lang === 'vi' ? 'thu' : 'rev'}</span>
                  <span className={`font-mono-num font-bold ${h.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {h.netProfit >= 0 ? `+$${h.netProfit}` : `-$${Math.abs(h.netProfit)}`} {lang === 'vi' ? 'lãi' : 'profit'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono-num">{h.customerCount} {lang === 'vi' ? 'khách' : 'guests'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
