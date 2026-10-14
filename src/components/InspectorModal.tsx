import React from 'react';
import { X, User, Briefcase, Utensils, Building2, Flame, Heart, Zap, Award } from 'lucide-react';
import { InspectableEntity, GameState } from '../types/game';
import { useLanguage } from '../context/LanguageContext';

interface InspectorModalProps {
  entity: InspectableEntity | null;
  gameState: GameState;
  onClose: () => void;
  onTrainStaff?: (staffId: string, type: 'speed' | 'accuracy' | 'hospitality') => void;
  onFireStaff?: (staffId: string) => void;
}

export const InspectorModal: React.FC<InspectorModalProps> = ({
  entity,
  gameState,
  onClose,
  onTrainStaff,
  onFireStaff,
}) => {
  const { lang, t } = useLanguage();
  if (!entity) return null;

  // Enhance stats if entity is staff or customer
  let detailedTitle = entity.title;
  let detailedSubtitle = entity.subtitle;
  let statsList = [...entity.stats];
  let staffObj = entity.type === 'staff' ? gameState.staff.find(s => s.id === entity.id) : null;
  let custObj = entity.type === 'customer' ? gameState.customers.find(c => c.id === entity.id) : null;
  let tableObj = entity.type === 'table' ? gameState.tables.find(t => t.id === entity.id) : null;

  if (staffObj) {
    const roleViMap: Record<string, string> = {
      head_chef: 'Bếp trưởng',
      line_cook: 'Đầu bếp chính',
      barista: 'Chuyên viên Barista',
      server: 'Phục vụ bàn',
      dishwasher: 'Tạp vụ & Rửa chén',
    };
    detailedTitle = staffObj.name;
    detailedSubtitle = lang === 'vi'
      ? `Vai trò: ${roleViMap[staffObj.role] || staffObj.role} • Lương ngày: $${staffObj.salary}`
      : `Role: ${staffObj.role.toUpperCase().replace('_', ' ')} • Daily Wage: $${staffObj.salary}`;
    statsList = lang === 'vi' ? [
      { label: 'Tốc độ làm việc', value: `${staffObj.speed}/100`, color: 'text-amber-400' },
      { label: 'Độ chính xác', value: `${staffObj.accuracy}/100`, color: 'text-blue-400' },
      { label: 'Thái độ hiếu khách', value: `${staffObj.hospitality}/100`, color: 'text-emerald-400' },
      { label: 'Mức căng thẳng', value: `${Math.round(staffObj.stress)}%`, color: staffObj.stress > 70 ? 'text-rose-400 font-bold' : 'text-slate-300' },
      { label: 'Thể lực ca làm', value: `${Math.round(staffObj.stamina)}%`, color: 'text-cyan-400' },
      { label: 'Ca làm việc', value: staffObj.assignedShift === 'morning' ? 'Ca Sáng' : staffObj.assignedShift === 'evening' ? 'Ca Chiều' : 'Cả Ngày' },
    ] : [
      { label: 'Speed', value: `${staffObj.speed}/100`, color: 'text-amber-400' },
      { label: 'Accuracy', value: `${staffObj.accuracy}/100`, color: 'text-blue-400' },
      { label: 'Hospitality', value: `${staffObj.hospitality}/100`, color: 'text-emerald-400' },
      { label: 'Stress Level', value: `${Math.round(staffObj.stress)}%`, color: staffObj.stress > 70 ? 'text-rose-400 font-bold' : 'text-slate-300' },
      { label: 'Stamina', value: `${Math.round(staffObj.stamina)}%`, color: 'text-cyan-400' },
      { label: 'Shift Assigned', value: staffObj.assignedShift.toUpperCase() },
    ];
  } else if (custObj) {
    detailedTitle = custObj.name;
    const demoViMap: Record<string, string> = {
      student: 'Sinh viên',
      office_worker: 'Dân văn phòng',
      family: 'Khách gia đình',
      foodie: 'Tín đồ ẩm thực',
      retiree: 'Người hưu trí',
    };
    detailedSubtitle = lang === 'vi'
      ? `Khách hàng (${demoViMap[custObj.demographic] || custObj.demographic}) • Ngân sách: $${custObj.budget}`
      : `Customer (${custObj.demographic}) • Budget: $${custObj.budget}`;

    const stateLabelsVi = {
      arriving: 'Đang tìm bàn trống',
      queueing: 'Đang xếp hàng chờ tại quầy',
      seated: 'Đang chọn món',
      waiting_food: 'Đang chờ món ăn được chế biến',
      eating: 'Đang thưởng thức món ăn',
      leaving_happy: 'Hài lòng vui vẻ ra về',
      leaving_angry: 'Bực bội bỏ về vì chờ lâu',
    };
    const stateLabelsEn = {
      arriving: 'Looking for a table',
      queueing: 'Waiting at pickup counter',
      seated: 'Deciding what to order',
      waiting_food: 'Waiting for fresh food to be cooked',
      eating: 'Enjoying meal at table',
      leaving_happy: 'Satisfied customer leaving',
      leaving_angry: 'Walked out frustrated (Long wait)',
    };
    const activity = lang === 'vi' ? (stateLabelsVi[custObj.state] || custObj.state) : (stateLabelsEn[custObj.state] || custObj.state);

    statsList = lang === 'vi' ? [
      { label: 'Hành động hiện tại', value: activity },
      { label: 'Độ hài lòng', value: `${Math.round(custObj.satisfaction)}%`, color: custObj.satisfaction > 70 ? 'text-emerald-400' : 'text-rose-400' },
      { label: 'Kiên nhẫn còn lại', value: `${Math.max(0, Math.round(custObj.patience - custObj.waitingTime))} giây` },
      { label: 'Đã thanh toán', value: `$${custObj.spentAmount.toFixed(2)}`, color: 'text-emerald-400 font-bold' },
    ] : [
      { label: 'Current Activity', value: activity },
      { label: 'Satisfaction', value: `${Math.round(custObj.satisfaction)}%`, color: custObj.satisfaction > 70 ? 'text-emerald-400' : 'text-rose-400' },
      { label: 'Patience Left', value: `${Math.max(0, Math.round(custObj.patience - custObj.waitingTime))}s` },
      { label: 'Amount Spent', value: `$${custObj.spentAmount.toFixed(2)}`, color: 'text-emerald-400 font-bold' },
    ];
  } else if (tableObj) {
    detailedTitle = lang === 'vi' ? `Bàn Ăn #${tableObj.id.replace('tbl_', '')}` : `Table #${tableObj.id.replace('tbl_', '')}`;
    detailedSubtitle = lang === 'vi'
      ? `Bàn ăn ${tableObj.seats} chỗ (Không gian +${tableObj.ambianceBonus}%)`
      : `${tableObj.seats}-Seater Dining Unit (Ambiance +${tableObj.ambianceBonus}%)`;
    statsList = lang === 'vi' ? [
      { label: 'Trạng thái', value: tableObj.occupied ? 'Đang có khách ngồi' : 'Bàn còn trống', color: tableObj.occupied ? 'text-amber-400 font-bold' : 'text-emerald-400' },
      { label: 'Số chỗ ngồi', value: tableObj.seats },
      { label: 'Số khách đang ngồi', value: tableObj.currentCustomerIds.length },
    ] : [
      { label: 'Status', value: tableObj.occupied ? 'Occupied' : 'Available', color: tableObj.occupied ? 'text-amber-400 font-bold' : 'text-emerald-400' },
      { label: 'Seats', value: tableObj.seats },
      { label: 'Patrons Seated', value: tableObj.currentCustomerIds.length },
    ];
  } else if (entity.type === 'competitor') {
    const comp = gameState.competitors.find(c => entity.title.includes(c.name) || entity.id.includes(c.id)) || gameState.competitors[0];
    const isAcquired = comp && gameState.corporate.acquiredCompetitorIds.includes(comp.id);
    detailedTitle = comp ? (lang === 'vi' && comp.vietnameseName ? comp.vietnameseName : comp.name) : entity.title;
    detailedSubtitle = lang === 'vi'
      ? (isAcquired ? 'Công ty con đã sáp nhập • Sở hữu 100%' : 'Chuỗi F&B đối thủ trên địa bàn')
      : (isAcquired ? 'Acquired Subsidiary • Wholly Owned' : 'Rival Food Chain Brand');
    statsList = lang === 'vi' ? [
      { label: 'Thị phần khu vực', value: `${comp ? comp.marketShare : 25}%`, color: 'text-rose-400 font-bold' },
      { label: 'Uy tín thương hiệu', value: `${comp ? comp.reputation : 70}/100`, color: 'text-amber-300' },
      { label: 'Phân khúc giá', value: comp ? (comp.priceLevel === 'cheap' ? 'Bình dân' : comp.priceLevel === 'moderate' ? 'Trung cấp' : 'Cao cấp') : 'Trung cấp' },
      { label: 'Quyền sở hữu', value: isAcquired ? 'Công ty con (Đã thâu tóm)' : 'Đối thủ độc lập', color: isAcquired ? 'text-emerald-400 font-bold' : 'text-slate-300' },
    ] : [
      { label: 'Market Share', value: `${comp ? comp.marketShare : 25}%`, color: 'text-rose-400 font-bold' },
      { label: 'Brand Reputation', value: `${comp ? comp.reputation : 70}/100`, color: 'text-amber-300' },
      { label: 'Pricing Model', value: comp ? comp.priceLevel.toUpperCase() : 'MODERATE' },
      { label: 'Ownership', value: isAcquired ? 'Subsidiary (Owned)' : 'Independent Rival', color: isAcquired ? 'text-emerald-400 font-bold' : 'text-slate-300' },
    ];
  }

  const getIcon = () => {
    switch (entity.type) {
      case 'staff': return <Briefcase className="w-5 h-5 text-amber-400" />;
      case 'customer': return <User className="w-5 h-5 text-blue-400" />;
      case 'table': return <Utensils className="w-5 h-5 text-emerald-400" />;
      case 'competitor': return <Briefcase className="w-5 h-5 text-rose-400" />;
      case 'district_building': return <Building2 className="w-5 h-5 text-purple-400" />;
      default: return <Zap className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="absolute top-16 right-4 z-20 w-80 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl overflow-hidden select-none animate-in fade-in slide-in-from-right-4 duration-200">
      {/* Header */}
      <div className="p-3.5 bg-slate-900/80 border-b border-slate-800 flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700">
            {getIcon()}
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 leading-snug">{detailedTitle}</h3>
            <p className="text-[11px] text-slate-400">{detailedSubtitle}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Stats list */}
      <div className="p-3.5 space-y-2">
        {statsList.map((st, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-900/50 border border-slate-800/60">
            <span className="text-slate-400">{st.label}</span>
            <span className={`font-semibold font-mono-num ${st.color || 'text-slate-200'}`}>
              {st.value}
            </span>
          </div>
        ))}

        {/* Staff Training Actions if Staff member inspected */}
        {staffObj && onTrainStaff && (
          <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Staff Development ($80/training)
            </div>
            {staffObj.trainingInProgress ? (
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                Training in progress: {Math.round(staffObj.trainingInProgress.progress)}%
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => onTrainStaff(staffObj!.id, 'speed')}
                  className="px-2 py-1.5 text-[10px] font-bold rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 transition text-slate-200 border border-slate-700"
                >
                  ⚡ Speed (+8)
                </button>
                <button
                  onClick={() => onTrainStaff(staffObj!.id, 'accuracy')}
                  className="px-2 py-1.5 text-[10px] font-bold rounded-lg bg-slate-800 hover:bg-blue-500 hover:text-slate-950 transition text-slate-200 border border-slate-700"
                >
                  🎯 Skill (+8)
                </button>
                <button
                  onClick={() => onTrainStaff(staffObj!.id, 'hospitality')}
                  className="px-2 py-1.5 text-[10px] font-bold rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 transition text-slate-200 border border-slate-700"
                >
                  ❤️ Service (+8)
                </button>
              </div>
            )}

            {onFireStaff && (
              <button
                onClick={() => onFireStaff(staffObj!.id)}
                className="w-full mt-2 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/50 rounded-lg transition font-semibold"
              >
                Terminate Employment
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
