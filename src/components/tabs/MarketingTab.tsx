import React from 'react';
import { GameState } from '../../types/game';
import { AlertTriangle, Check, X } from 'lucide-react';
import { soundEngine } from '../../engine/soundEngine';
import { useLanguage } from '../../context/LanguageContext';

interface MarketingTabProps {
  state: GameState;
  onToggleCampaign: (campaignId: string) => void;
}

export const MarketingTab: React.FC<MarketingTabProps> = ({ state, onToggleCampaign }) => {
  const { lang } = useLanguage();
  const activeCost = state.marketing.filter(m => m.active).reduce((sum, m) => sum + m.dailyCost, 0);
  const totalTrafficBoost = state.marketing.filter(m => m.active).reduce((sum, m) => sum + m.trafficBoostPercentage, 0);

  return (
    <div className="space-y-4 select-none">
      {/* Brand Awareness & Overload Advisory */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">
            {lang === 'vi' ? 'Độ Nhận Diện Thương Hiệu' : 'Brand Awareness'}
          </div>
          <div className="text-2xl font-bold font-mono-num text-amber-300 mt-1">
            {Math.round(state.brandAwareness)}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {lang === 'vi' ? 'Độ phủ sóng trong tâm trí thực khách' : 'City-wide consumer recognition'}
          </div>
        </div>

        <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">
            {lang === 'vi' ? 'Gia Tăng Khách Vào Quán' : 'Total Traffic Boost'}
          </div>
          <div className="text-2xl font-bold font-mono-num text-emerald-400 mt-1">
            +{totalTrafficBoost}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {lang === 'vi' ? 'Lượng khách tăng thêm nhờ quảng bá' : 'Incremental customer inflow'}
          </div>
        </div>

        <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">
            {lang === 'vi' ? 'Ngân Sách Tiếp Thị Hàng Ngày' : 'Daily Marketing Budget'}
          </div>
          <div className="text-2xl font-bold font-mono-num text-rose-400 mt-1">
            ${activeCost}/{lang === 'vi' ? 'ngày' : 'day'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {lang === 'vi' ? 'Khấu trừ tự động vào lúc nửa đêm' : 'Deducted nightly at midnight'}
          </div>
        </div>
      </div>

      {/* ROI & Bottleneck Warning */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl flex items-start gap-3 text-xs text-slate-300">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-slate-100">
            {lang === 'vi' ? 'Cảnh Báo Quá Tải Tiếp Thị & Điểm Nghẽn Vận Hành' : 'Marketing Overload & ROI Trade-off'}
          </div>
          <p className="text-slate-400 mt-0.5">
            {lang === 'vi'
              ? 'Kéo khách ồ ạt khi công suất bếp và số bàn còn ít sẽ khiến khách phải chờ lâu, bỏ về và đánh giá sao tiêu cực thê thảm. Hãy đảm bảo nhân sự và máy móc sẵn sàng trước khi bung ngân sách quảng bá!'
              : 'Driving huge traffic when your kitchen capacity is low will cause long lines, walk-outs, and catastrophic rating drops. Ensure staffing and equipment can handle the rush before launching aggressive campaigns!'}
          </p>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {state.marketing.map((camp) => {
          const campName = lang === 'vi' && camp.vietnameseName ? camp.vietnameseName : camp.name;

          return (
            <div
              key={camp.id}
              className={`p-3.5 rounded-xl border transition ${
                camp.active
                  ? 'bg-slate-900/90 border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-100">{campName}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">
                    {lang === 'vi' ? 'Hình thức: ' : 'Type: '}{camp.type.replace('_', ' ')}
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onToggleCampaign(camp.id);
                  }}
                  className={`p-1.5 rounded-lg border transition ${
                    camp.active
                      ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title={camp.active ? (lang === 'vi' ? 'Tắt chiến dịch' : 'Deactivate') : (lang === 'vi' ? 'Bật chiến dịch' : 'Activate')}
                >
                  {camp.active ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </button>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs bg-slate-950/70 p-2 rounded-lg border border-slate-800/80">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">{lang === 'vi' ? 'Chi phí' : 'Cost'}</div>
                  <div className="font-bold font-mono-num text-rose-400">${camp.dailyCost}/{lang === 'vi' ? 'ngày' : 'day'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">{lang === 'vi' ? 'Khách tăng' : 'Foot Traffic'}</div>
                  <div className="font-bold font-mono-num text-emerald-400">+{camp.trafficBoostPercentage}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">{lang === 'vi' ? 'Nhận diện' : 'Brand Rep'}</div>
                  <div className="font-bold font-mono-num text-amber-400">+{camp.awarenessBoost}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
