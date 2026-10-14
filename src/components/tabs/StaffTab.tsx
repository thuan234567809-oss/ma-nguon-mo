import React from 'react';
import { GameState, Applicant, StaffMember } from '../../types/game';
import { Users, UserPlus, ShieldAlert } from 'lucide-react';
import { soundEngine } from '../../engine/soundEngine';
import { useLanguage } from '../../context/LanguageContext';

interface StaffTabProps {
  state: GameState;
  onHireApplicant: (applicant: Applicant) => void;
  onFireStaff: (staffId: string) => void;
  onTrainStaff: (staffId: string, type: 'speed' | 'accuracy' | 'hospitality') => void;
  onChangeShift: (staffId: string, shift: 'morning' | 'evening' | 'full') => void;
}

export const StaffTab: React.FC<StaffTabProps> = ({
  state,
  onHireApplicant,
  onFireStaff,
  onTrainStaff,
  onChangeShift,
}) => {
  const { lang } = useLanguage();
  const [activeSubTab, setActiveSubTab] = React.useState<'roster' | 'hiring'>('roster');

  const roleNameMap: Record<string, string> = {
    head_chef: 'Bếp trưởng',
    line_cook: 'Đầu bếp',
    barista: 'Chuyên viên Barista',
    server: 'Phục vụ bàn',
    dishwasher: 'Tạp vụ & Phụ bếp',
  };

  return (
    <div className="space-y-4 select-none">
      {/* Sub-tab navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('roster')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeSubTab === 'roster'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>
            {lang === 'vi' ? 'Đội ngũ nhân sự đang làm việc' : 'Active Team Crew'} ({state.staff.length})
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('hiring')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeSubTab === 'hiring'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>
            {lang === 'vi' ? 'Hồ sơ tuyển dụng ứng viên' : 'Hiring Pool'} ({state.applicants.length} {lang === 'vi' ? 'ứng viên' : 'Applicants'})
          </span>
        </button>
      </div>

      {/* Roster View */}
      {activeSubTab === 'roster' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {state.staff.map((staff) => (
              <div key={staff.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-2.5">
                {/* Staff Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-md" style={{ backgroundColor: staff.avatarColor }}>
                      {staff.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-100">{staff.name}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">
                        {lang === 'vi' ? (roleNameMap[staff.role] || staff.role) : staff.role.replace('_', ' ')} • {lang === 'vi' ? 'Bậc ' : 'Tier '}{staff.experienceLevel}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono-num font-bold text-xs text-emerald-400">${staff.salary}/{lang === 'vi' ? 'ngày' : 'day'}</div>
                    <div className="text-[10px] text-slate-400">{lang === 'vi' ? 'Lương hàng ngày' : 'Daily Wage'}</div>
                  </div>
                </div>

                {/* Skill Bars */}
                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] bg-slate-950/70 p-2 rounded-lg border border-slate-800/80">
                  <div>
                    <span className="text-slate-400">{lang === 'vi' ? 'Tốc độ' : 'Speed'}</span>
                    <div className="font-bold font-mono-num text-amber-400">{staff.speed}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">{lang === 'vi' ? 'Chính xác' : 'Accuracy'}</span>
                    <div className="font-bold font-mono-num text-blue-400">{staff.accuracy}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">{lang === 'vi' ? 'Hiếu khách' : 'Hospitality'}</span>
                    <div className="font-bold font-mono-num text-emerald-400">{staff.hospitality}</div>
                  </div>
                </div>

                {/* Stress & Stamina Vitals */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-rose-400" /> {lang === 'vi' ? 'Căng thẳng' : 'Stress'}
                    </span>
                    <span className={`font-mono-num font-semibold ${staff.stress > 70 ? 'text-rose-400 animate-pulse' : 'text-slate-300'}`}>
                      {Math.round(staff.stress)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${staff.stress > 70 ? 'bg-rose-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(100, staff.stress)}%` }}
                    />
                  </div>
                </div>

                {/* Shift Selection & Training Actions */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {(['morning', 'evening', 'full'] as const).map(shift => (
                      <button
                        key={shift}
                        onClick={() => onChangeShift(staff.id, shift)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${
                          staff.assignedShift === shift
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {lang === 'vi' ? (shift === 'morning' ? 'Sáng' : shift === 'evening' ? 'Chiều' : 'Cả ngày') : shift}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    {staff.trainingInProgress ? (
                      <span className="text-[10px] text-amber-400 font-mono-num bg-amber-500/10 px-2 py-0.5 rounded">
                        {lang === 'vi' ? 'Đang học ' : 'Training '}{Math.round(staff.trainingInProgress.progress)}%
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          onTrainStaff(staff.id, 'speed');
                        }}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold rounded transition border border-slate-700"
                        title={lang === 'vi' ? 'Đào tạo tốc độ ($80)' : 'Train Speed ($80)'}
                      >
                        {lang === 'vi' ? 'Đào tạo ($80)' : 'Train ($80)'}
                      </button>
                    )}

                    <button
                      onClick={() => onFireStaff(staff.id)}
                      className="px-2 py-1 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 text-[10px] font-bold rounded transition border border-rose-900/50"
                      title={lang === 'vi' ? 'Cho nhân viên thôi việc' : 'Terminate Staff'}
                    >
                      {lang === 'vi' ? 'Thôi việc' : 'Fire'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hiring Pool View */}
      {activeSubTab === 'hiring' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {state.applicants.map((app) => (
            <div key={app.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-md" style={{ backgroundColor: app.avatarColor }}>
                    {app.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-100">{app.name}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      {lang === 'vi' ? (roleNameMap[app.role] || app.role) : app.role.replace('_', ' ')} • {lang === 'vi' ? `${app.experienceLevel} năm KN` : `Exp: ${app.experienceLevel} yrs`}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono-num font-bold text-xs text-amber-400">${app.expectedSalary}/{lang === 'vi' ? 'ngày' : 'day'}</div>
                  <div className="text-[10px] text-slate-400">{lang === 'vi' ? 'Mức lương mong muốn' : 'Expected Wage'}</div>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-300 italic">
                "{app.personality}"
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] bg-slate-950/50 p-1.5 rounded-lg">
                <div>
                  <span className="text-slate-400">{lang === 'vi' ? 'Tốc độ:' : 'Speed:'}</span> <strong className="text-amber-400 font-mono-num">{app.speed}</strong>
                </div>
                <div>
                  <span className="text-slate-400">{lang === 'vi' ? 'Chính xác:' : 'Accuracy:'}</span> <strong className="text-blue-400 font-mono-num">{app.accuracy}</strong>
                </div>
                <div>
                  <span className="text-slate-400">{lang === 'vi' ? 'Dịch vụ:' : 'Service:'}</span> <strong className="text-emerald-400 font-mono-num">{app.hospitality}</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  onHireApplicant(app);
                }}
                className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{lang === 'vi' ? `Ký Hợp Đồng Tuyển Dụng ($${app.expectedSalary}/ngày)` : `Extend Job Offer ($${app.expectedSalary}/day)`}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
