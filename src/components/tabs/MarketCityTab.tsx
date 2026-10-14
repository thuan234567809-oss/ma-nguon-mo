import React from 'react';
import { GameState, DistrictId } from '../../types/game';
import { MapPin, Building2, Award, Lock, Check } from 'lucide-react';
import { soundEngine } from '../../engine/soundEngine';
import { useLanguage } from '../../context/LanguageContext';

interface MarketCityTabProps {
  state: GameState;
  onRelocateDistrict: (districtId: DistrictId) => void;
}

export const MarketCityTab: React.FC<MarketCityTabProps> = ({ state, onRelocateDistrict }) => {
  const { lang } = useLanguage();
  const currentDist = state.districts[state.currentDistrict];

  return (
    <div className="space-y-4 select-none">
      {/* Current District Header */}
      <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-100">
                {lang === 'vi' ? currentDist.vietnameseName : currentDist.name} ({lang === 'vi' ? currentDist.name : currentDist.vietnameseName})
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                {lang === 'vi' ? 'Trụ Sở Chính Đang Hoạt Động' : 'Active HQ Branch'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{currentDist.description}</p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <div className="text-[10px] text-slate-400 uppercase">{lang === 'vi' ? 'Tiền thuê mặt bằng/ngày' : 'Daily District Rent'}</div>
          <div className="text-sm font-bold font-mono-num text-rose-400">${currentDist.baseRent}/{lang === 'vi' ? 'ngày' : 'day'}</div>
        </div>
      </div>

      {/* City Districts Catalogue */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Building2 className="w-4 h-4 text-cyan-400" />{' '}
          {lang === 'vi' ? 'Các Quận Trung Tâm Thành Phố & Điểm Mở Rộng' : 'Metropolitan Districts & Expansion Sites'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {(Object.keys(state.districts) as DistrictId[]).map((distId) => {
            const d = state.districts[distId];
            const isCurrent = state.currentDistrict === distId;
            const canUnlock = state.finances.cash >= d.unlockCost;

            return (
              <div
                key={d.id}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-lg'
                    : 'bg-slate-900/70 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-100">
                        {lang === 'vi' ? d.vietnameseName : d.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {lang === 'vi' ? d.name : d.vietnameseName}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono-num font-bold text-rose-400 bg-slate-950 px-2 py-0.5 rounded">
                      ${d.baseRent}/{lang === 'vi' ? 'ngày' : 'day'}
                    </span>
                  </div>

                  <div className="mt-2.5 space-y-1 text-[11px] text-slate-400">
                    <div>
                      • {lang === 'vi' ? 'Hệ số khách bộ hành: ' : 'Traffic Multiplier: '}
                      <strong className="text-amber-300 font-mono-num">{d.footTrafficMultiplier}x</strong>
                    </div>
                    <div>
                      • {lang === 'vi' ? 'Mức thu nhập: ' : 'Income Tier: '}
                      <strong className="text-slate-200 capitalize">
                        {lang === 'vi' ? (d.averageIncome === 'low' ? 'Bình dân' : d.averageIncome === 'medium' ? 'Trung bình' : d.averageIncome === 'high' ? 'Khá giả' : 'Thượng lưu') : d.averageIncome}
                      </strong>
                    </div>
                    <div className="text-[10px] text-slate-500 italic mt-1">{d.targetAudience}</div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80">
                  {isCurrent ? (
                    <div className="py-1 text-center text-xs font-bold text-amber-400 flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" /> {lang === 'vi' ? 'Vị Trí Hiện Tại' : 'Current Location'}
                    </div>
                  ) : d.unlocked ? (
                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        onRelocateDistrict(d.id);
                      }}
                      className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                    >
                      {lang === 'vi' ? `Chuyển Trụ Sở Đến (${d.baseRent}$/ngày)` : `Relocate Bistro ($${d.baseRent}/day)`}
                    </button>
                  ) : (
                    <button
                      disabled={!canUnlock}
                      onClick={() => {
                        soundEngine.playClick();
                        onRelocateDistrict(d.id);
                      }}
                      className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1"
                    >
                      <Lock className="w-3 h-3" />
                      <span>{lang === 'vi' ? `Mở Khóa Khu Vực ($${d.unlockCost.toLocaleString()})` : `Unlock Branch Site ($${d.unlockCost.toLocaleString()})`}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Competitor Radar */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-rose-400" />{' '}
          {lang === 'vi' ? 'Tình Báo Đối Thủ Cạnh Tranh & Thị Phần F&B' : 'Rival F&B Chains & Competitor Intelligence'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {state.competitors.map((comp) => {
            const compName = lang === 'vi' && comp.vietnameseName ? comp.vietnameseName : comp.name;

            return (
              <div key={comp.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-xs text-slate-100">{compName}</div>
                    <div className="text-[10px] text-slate-400 uppercase">{comp.brandType.replace('_', ' ')}</div>
                  </div>
                  <span className="text-[10px] font-mono-num font-bold text-rose-400 bg-rose-950/40 px-1.5 py-0.5 rounded">
                    {comp.marketShare}% {lang === 'vi' ? 'Thị phần' : 'Share'}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <div>
                    {lang === 'vi' ? 'Uy tín: ' : 'Reputation: '}
                    <strong className="text-amber-300 font-mono-num">{comp.reputation}/100</strong>
                  </div>
                  <div>
                    {lang === 'vi' ? 'Chiến lược giá: ' : 'Pricing Strategy: '}
                    <strong className="text-slate-200 capitalize">
                      {lang === 'vi' ? (comp.priceLevel === 'cheap' ? 'Bình dân' : comp.priceLevel === 'moderate' ? 'Trung cấp' : 'Cao cấp') : comp.priceLevel}
                    </strong>
                  </div>
                  <div>
                    {lang === 'vi' ? 'Mức độ truyền thông: ' : 'Aggression: '}
                    <strong className="text-slate-200 font-mono-num">{comp.marketingAggression}%</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
