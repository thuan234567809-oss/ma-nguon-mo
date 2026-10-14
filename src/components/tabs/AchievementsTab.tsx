import React, { useRef } from 'react';
import { GameState } from '../../types/game';
import { Trophy, CheckCircle2, Lock, Download, Upload } from 'lucide-react';
import { soundEngine } from '../../engine/soundEngine';
import { saveGameState } from '../../engine/saveSystem';
import { useLanguage } from '../../context/LanguageContext';

interface AchievementsTabProps {
  state: GameState;
  onImportState: (importedState: GameState) => void;
}

export const AchievementsTab: React.FC<AchievementsTabProps> = ({ state, onImportState }) => {
  const { lang, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const achievements = [
    {
      id: 'ach_rating',
      title: lang === 'vi' ? 'Chất Lượng Uy Tín 5 Sao' : 'Michelin Star Quality',
      desc: lang === 'vi' ? 'Đạt điểm uy tín thực khách trên 90/100 điểm.' : 'Achieve a customer reputation rating above 90/100.',
      unlocked: state.reputation >= 90,
      reward: lang === 'vi' ? 'Thưởng danh vọng +$2,500' : '+$2,500 Prestige Bonus',
    },
    {
      id: 'ach_fleet',
      title: lang === 'vi' ? 'Vua Giao Hàng Mùa Mưa Bão' : 'Monsoon Delivery King',
      desc: lang === 'vi' ? 'Hoàn thành trên 25 đơn hàng giao online trong 1 ngày.' : 'Deliver over 25 online takeout orders in a single day.',
      unlocked: state.deliveredOrdersToday >= 25,
      reward: lang === 'vi' ? 'Tăng vĩnh viễn +10% tốc độ shipper' : 'Permanent +10% delivery speed',
    },
    {
      id: 'ach_commissary',
      title: lang === 'vi' ? 'Bếp Trung Tâm Công Nghiệp' : 'Industrial Supply Chain',
      desc: lang === 'vi' ? 'Mở khóa và vận hành cơ sở Bếp Trung Tâm chế biến quy mô lớn.' : 'Establish and unlock the Central Commissary facility.',
      unlocked: state.commissary.isUnlocked,
      reward: lang === 'vi' ? 'Giảm tới 30% giá vốn nguyên liệu' : 'COGS costs slashed by up to 30%',
    },
    {
      id: 'ach_holdings',
      title: lang === 'vi' ? 'Tập Đoàn Ẩm Thực Đa Ngành' : 'Hospitality Conglomerate',
      desc: lang === 'vi' ? 'Thành lập tập đoàn mẹ (Holdings) và đạt định giá trên $100k.' : 'Incorporate the holding corporation and exceed $100k valuation.',
      unlocked: state.corporate.isHoldingsFormed && state.corporate.enterpriseValuation >= 100000,
      reward: lang === 'vi' ? 'Mở khóa điều kiện niêm yết IPO sàn chứng khoán' : 'Unlock NASDAQ IPO listing',
    },
    {
      id: 'ach_franchise',
      title: lang === 'vi' ? 'Mạng Lưới Nhượng Quyền Toàn Cầu' : 'Global Franchise Network',
      desc: lang === 'vi' ? 'Ký hợp đồng nhượng quyền với từ 2 đối tác kinh doanh trở lên.' : 'Sign 2 or more franchisee operating partner stores.',
      unlocked: state.franchise.units.filter(u => u.status === 'active').length >= 2,
      reward: lang === 'vi' ? 'Nhận dòng tiền bản quyền thương hiệu thụ động 6%' : 'Passive 6% daily royalty stream',
    },
    {
      id: 'ach_ipo',
      title: lang === 'vi' ? 'Gõ Chuông Niêm Yết Sàn IPO' : 'Wall Street Bell Ringer',
      desc: lang === 'vi' ? 'Niêm yết thành công cổ phiếu công ty lên sàn chứng khoán đại chúng.' : 'Successfully list corporate equity on the public stock exchange.',
      unlocked: state.corporate.isIpoListed,
      reward: lang === 'vi' ? 'Thu hút dòng vốn hàng trăm ngàn USD' : 'Massive public capital equity infusion',
    },
    {
      id: 'ach_monopoly',
      title: lang === 'vi' ? 'Độc Quyền Thị Phần Đô Thị (M&A)' : 'Market Monopoly',
      desc: lang === 'vi' ? 'Thâu tóm sáp nhập toàn bộ các chuỗi đối thủ trên toàn thành phố.' : 'Acquire all rival competitor chains across the metropolis.',
      unlocked: state.corporate.acquiredCompetitorIds.length >= 3,
      reward: lang === 'vi' ? 'Thống trị tuyệt đối thị phần ẩm thực đô thị' : 'Complete urban market domination',
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const handleExportSave = () => {
    soundEngine.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `bistro_empire_save_day_${state.currentDay}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.companyName && typeof parsed.finances?.cash === 'number') {
          saveGameState(parsed);
          onImportState(parsed);
          soundEngine.playCashRegister();
        }
      } catch {
        // Parse error
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4 select-none">
      {/* Header Trophy Banner */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-100">
                {lang === 'vi' ? 'Phòng Truyền Thống & Cúp Vinh Danh Thành Tựu' : 'Executive Hall of Fame & Achievements'}
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full font-mono">
                {unlockedCount} / {achievements.length} {lang === 'vi' ? 'Đã mở khóa' : 'Unlocked'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'vi'
                ? 'Các cột mốc chiến lược ghi nhận tài năng quản trị, sự thống trị thị trường và tầm nhìn tài chính.'
                : 'Strategic milestones rewarding operational mastery, market dominance, and financial acumen.'}
            </p>
          </div>
        </div>

        {/* Cloud Save / JSON Backup Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSave}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700 flex items-center gap-1.5"
            title={lang === 'vi' ? 'Tải tệp lưu game JSON về máy' : 'Download Empire Save as JSON'}
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{lang === 'vi' ? 'Xuất Tệp Lưu' : 'Export Save'}</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700 flex items-center gap-1.5"
            title={lang === 'vi' ? 'Nạp tệp lưu JSON từ thiết bị' : 'Upload and load saved Empire JSON'}
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{lang === 'vi' ? 'Nạp Tệp Lưu' : 'Import Save'}</span>
          </button>
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileChange} className="hidden" />
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`p-3.5 rounded-xl border transition ${
              ach.unlocked
                ? 'bg-amber-950/20 border-amber-500/40 shadow-md shadow-amber-500/5'
                : 'bg-slate-950/60 border-slate-800/80 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${ach.unlocked ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                  {ach.unlocked ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-100">{ach.title}</div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{ach.desc}</p>
                </div>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
              <span className="text-slate-400">{lang === 'vi' ? 'Phần thưởng danh hiệu:' : 'Milestone Impact:'}</span>
              <span className={`font-semibold ${ach.unlocked ? 'text-amber-300' : 'text-slate-500'}`}>
                {ach.reward}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
