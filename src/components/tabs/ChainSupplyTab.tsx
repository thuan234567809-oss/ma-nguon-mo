import React from 'react';
import { GameState } from '../../types/game';
import { Factory, Store, Check, Lock } from 'lucide-react';
import { soundEngine } from '../../engine/soundEngine';
import { useLanguage } from '../../context/LanguageContext';

interface ChainSupplyTabProps {
  state: GameState;
  onUnlockCommissary: () => void;
  onUpgradeCommissary: () => void;
  onOpenBranch: (branchId: string) => void;
}

export const ChainSupplyTab: React.FC<ChainSupplyTabProps> = ({
  state,
  onUnlockCommissary,
  onUpgradeCommissary,
  onOpenBranch,
}) => {
  const { lang } = useLanguage();
  const com = state.commissary;
  const unlockCost = 4200;
  const upgradeCost = com.tier * 3500;

  return (
    <div className="space-y-4 select-none">
      {/* Central Commissary System (Bếp Trung Tâm) */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-100">
                  {lang === 'vi' ? 'Bếp Trung Tâm & Xưởng Sản Xuất Quy Mô Lớn' : 'Central Commissary & Production Kitchen'}
                </span>
                {com.isUnlocked ? (
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
                    {lang === 'vi' ? 'Cấp độ ' : 'Tier '}{com.tier} {lang === 'vi' ? 'Đang Hoạt Động' : 'Active'}
                  </span>
                ) : (
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold">
                    {lang === 'vi' ? 'Chưa Mở Khóa' : 'Locked'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'vi'
                  ? 'Cơ sở chế biến nguyên liệu tập trung: ướp thịt số lượng lớn, nấu sốt đóng gói và rang xay hạt cà phê đặc sản.'
                  : 'Centralized food production facility for bulk marinades, batch sauces, and single-origin coffee roasting.'}
              </p>
            </div>
          </div>

          <div>
            {!com.isUnlocked ? (
              <button
                disabled={state.finances.cash < unlockCost}
                onClick={() => {
                  soundEngine.playCashRegister();
                  onUnlockCommissary();
                }}
                className="px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs transition shadow-md shadow-purple-600/20 flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{lang === 'vi' ? `Mở Bếp Trung Tâm ($${unlockCost.toLocaleString()})` : `Establish Commissary ($${unlockCost.toLocaleString()})`}</span>
              </button>
            ) : (
              <button
                disabled={state.finances.cash < upgradeCost || com.tier >= 3}
                onClick={() => {
                  soundEngine.playCashRegister();
                  onUpgradeCommissary();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 disabled:opacity-40 text-slate-200 hover:text-white font-bold text-xs transition border border-slate-700"
              >
                {com.tier >= 3 ? (lang === 'vi' ? 'Cấp Tối Đa' : 'Max Level') : (lang === 'vi' ? `Nâng Cấp Cấp ${com.tier + 1} ($${upgradeCost.toLocaleString()})` : `Upgrade Tier ${com.tier + 1} ($${upgradeCost.toLocaleString()})`)}
              </button>
            )}
          </div>
        </div>

        {/* Benefits breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase">
              {lang === 'vi' ? 'Giảm Chi Phí Giá Vốn COGS' : 'COGS Cost Reduction'}
            </div>
            <div className="text-base font-bold font-mono-num text-emerald-400 mt-0.5">
              -{com.isUnlocked ? com.cogsReductionPct : 0}% {lang === 'vi' ? 'Giá sỉ toàn hệ thống' : 'Wholesale Cost'}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase">
              {lang === 'vi' ? 'Công Suất Sơ Chế Hàng Ngày' : 'Daily Batch Output'}
            </div>
            <div className="text-base font-bold font-mono-num text-purple-300 mt-0.5">
              {com.isUnlocked ? com.dailyPrepCapacity : 0} {lang === 'vi' ? 'phần / ngày' : 'units / day'}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase">
              {lang === 'vi' ? 'Chi Phí Vận Hành Xưởng' : 'Facility Overhead'}
            </div>
            <div className="text-base font-bold font-mono-num text-rose-400 mt-0.5">
              ${com.isUnlocked ? com.dailyOperatingCost : 0} / {lang === 'vi' ? 'ngày' : 'day'}
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Branch Chain Network */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Store className="w-4 h-4 text-cyan-400" />{' '}
            {lang === 'vi' ? 'Mạng Lưới Chuỗi Chi Nhánh Trực Thuộc' : 'Multi-Branch Enterprise Network'}
          </h3>
          <span className="text-[10px] text-slate-400">
            {lang === 'vi' ? 'Mở rộng từ 1 bistro thành chuỗi F&B toàn thành phố' : 'Scale from 1 bistro to a city-wide F&B chain'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {state.branches.map((branch) => {
            const isOperational = branch.status === 'operational';
            const openCost = 5000;

            return (
              <div
                key={branch.id}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition ${
                  isOperational
                    ? 'bg-slate-950/80 border-cyan-500/30 shadow-md'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-100">{branch.name}</div>
                      <div className="text-[10px] text-slate-400 capitalize">
                        {lang === 'vi' ? `Quận ${branch.districtId}` : `${branch.districtId} District`}
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isOperational ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {lang === 'vi' ? (isOperational ? 'Đang hoạt động' : 'Đang chuẩn bị') : branch.status}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1 text-[11px] text-slate-400">
                    <div>
                      {lang === 'vi' ? 'Nhân sự ca: ' : 'Crew Assigned: '}
                      <strong className="text-slate-200">{branch.staffCount} {lang === 'vi' ? 'người' : 'staff'}</strong>
                    </div>
                    <div>
                      {lang === 'vi' ? 'Doanh thu ngày: ' : 'Daily Revenue: '}
                      <strong className="text-emerald-400 font-mono-num">${branch.dailyRevenue}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80">
                  {isOperational ? (
                    <div className="py-1 text-center text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" /> {lang === 'vi' ? 'Đang Phục Vụ' : 'Operating Actively'}
                    </div>
                  ) : (
                    <button
                      disabled={state.finances.cash < openCost}
                      onClick={() => {
                        soundEngine.playCashRegister();
                        onOpenBranch(branch.id);
                      }}
                      className="w-full py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-950 font-bold text-xs transition"
                    >
                      {lang === 'vi' ? `Mở Chi Nhánh ($${openCost.toLocaleString()})` : `Open Branch ($${openCost.toLocaleString()})`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
