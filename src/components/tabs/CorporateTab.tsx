import React from 'react';
import { GameState } from '../../types/game';
import { Building, TrendingUp, Award, Briefcase, Check } from 'lucide-react';
import { soundEngine } from '../../engine/soundEngine';
import { useLanguage } from '../../context/LanguageContext';

interface CorporateTabProps {
  state: GameState;
  onFormHoldings: () => void;
  onSignFranchisee: () => void;
  onAuditFranchisee: (unitId: string) => void;
  onAcquireCompetitor: (competitorId: string, cost: number) => void;
  onLaunchIpo: () => void;
}

export const CorporateTab: React.FC<CorporateTabProps> = ({
  state,
  onFormHoldings,
  onSignFranchisee,
  onAuditFranchisee,
  onAcquireCompetitor,
  onLaunchIpo,
}) => {
  const { lang } = useLanguage();
  const corp = state.corporate;
  const fran = state.franchise;
  const totalUnits = 1 + state.branches.filter(b => b.status === 'operational').length + fran.units.filter(u => u.status === 'active').length;
  const canFranchise = state.reputation >= fran.minReputationRequired;
  const canIpo = corp.isHoldingsFormed && !corp.isIpoListed && corp.enterpriseValuation >= 80000 && totalUnits >= 3;

  return (
    <div className="space-y-4 select-none">
      {/* Executive Enterprise Header */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-100">{corp.holdingCompanyName}</span>
                {corp.isIpoListed ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold font-mono">
                    NASDAQ: ${corp.tickerSymbol} (${corp.sharePrice})
                  </span>
                ) : corp.isHoldingsFormed ? (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                    {lang === 'vi' ? 'Tập đoàn Cổ phần' : 'Holdings Group'}
                  </span>
                ) : (
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold">
                    {lang === 'vi' ? 'Hộ Kinh Doanh Cá Thể' : 'Private Entity'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'vi'
                  ? 'Tập đoàn mẹ quản trị chuỗi công ty con, bếp trung tâm sản xuất độc quyền và cấp phép nhượng quyền toàn cầu.'
                  : 'Corporate conglomerate overseeing subsidiaries, proprietary supply chain, and global franchise licenses.'}
              </p>
            </div>
          </div>

          <div>
            {!corp.isHoldingsFormed ? (
              <button
                disabled={state.finances.cash < 6000}
                onClick={() => {
                  soundEngine.playCashRegister();
                  onFormHoldings();
                }}
                className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition shadow-md shadow-amber-500/20"
              >
                {lang === 'vi' ? 'Thành Lập Tập Đoàn Holdings ($6,000)' : 'Incorporate Holding Co. ($6,000)'}
              </button>
            ) : !corp.isIpoListed ? (
              <button
                disabled={!canIpo}
                onClick={() => {
                  soundEngine.playCashRegister();
                  onLaunchIpo();
                }}
                className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>
                  {lang === 'vi'
                    ? `Niêm Yết Cổ Phiếu IPO (+${Math.round(corp.enterpriseValuation * 0.25).toLocaleString()}$)`
                    : `Launch Stock IPO (+${Math.round(corp.enterpriseValuation * 0.25).toLocaleString()}$)`}
                </span>
              </button>
            ) : (
              <div className="text-right">
                <div className="text-[10px] text-emerald-400 uppercase font-bold">
                  {lang === 'vi' ? 'Tỷ Lệ Cổ Phiếu Tự Do' : 'Public Equity Float'}
                </div>
                <div className="text-sm font-bold font-mono-num text-emerald-300">
                  {corp.publicFloatPct}% {lang === 'vi' ? 'Đã giao dịch đại chúng' : 'Publicly Traded'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enterprise Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase">
              {lang === 'vi' ? 'Định Giá Doanh Nghiệp' : 'Enterprise Valuation'}
            </div>
            <div className="text-base font-bold font-mono-num text-amber-300 mt-0.5">
              ${corp.enterpriseValuation.toLocaleString()}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase">
              {lang === 'vi' ? 'Tổng Mạng Lưới Chi Nhánh' : 'Total Store Network'}
            </div>
            <div className="text-base font-bold font-mono-num text-cyan-300 mt-0.5">
              {totalUnits} {lang === 'vi' ? 'Điểm bán' : 'Outlets'}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase">
              {lang === 'vi' ? 'Phí Nhượng Quyền Thu' : 'Franchise Royalty Rate'}
            </div>
            <div className="text-base font-bold font-mono-num text-emerald-400 mt-0.5">
              {fran.royaltyPct}% {lang === 'vi' ? 'Doanh thu ngày' : 'Gross Sales'}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase">
              {lang === 'vi' ? 'Thị Giá Cổ Phiếu' : 'Stock Share Price'}
            </div>
            <div className="text-base font-bold font-mono-num text-purple-300 mt-0.5">
              {corp.isIpoListed ? `$${corp.sharePrice}` : (lang === 'vi' ? 'Chưa lên sàn' : 'Pre-IPO')}
            </div>
          </div>
        </div>
      </div>

      {/* Franchise Expansion System */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />{' '}
              {lang === 'vi' ? 'Nhượng Quyền Thương Hiệu & Tiêu Chuẩn Vận Hành' : 'Franchise Licensing & Brand Standards'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {lang === 'vi'
                ? 'Cấp phép thương hiệu cho đối tác độc lập. Thu phí nhượng quyền ban đầu + 6% phí bản quyền hàng ngày.'
                : 'License your brand to third-party owner-operators. Collect upfront fee + 6% daily royalties.'}
            </p>
          </div>

          <button
            disabled={!canFranchise}
            onClick={() => {
              soundEngine.playCashRegister();
              onSignFranchisee();
            }}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs transition shadow-md"
          >
            {canFranchise
              ? (lang === 'vi' ? `Ký Đối Tác Nhượng Quyền (+${fran.initialFee.toLocaleString()}$)` : `Sign Franchisee (+$${fran.initialFee.toLocaleString()})`)
              : (lang === 'vi' ? `Cần Uy Tín >= 80 (Hiện có: ${Math.round(state.reputation)})` : `Requires 80+ Rep (Current: ${Math.round(state.reputation)})`)}
          </button>
        </div>

        {fran.units.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500 italic bg-slate-950/40 rounded-xl border border-slate-800/60">
            {lang === 'vi'
              ? 'Chưa có đối tác nhượng quyền nào. Hãy xây dựng uy tín thương hiệu trên 80 điểm để thu hút các nhà đầu tư!'
              : 'No franchisee stores signed yet. Build brand reputation above 80 to attract prospective franchisees!'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto">
            {fran.units.map((unit) => (
              <div key={unit.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-100 flex items-center gap-2">
                    <span>{unit.locationName}</span>
                    <span className="text-[10px] text-emerald-400 font-mono-num font-semibold">
                      +${unit.dailyRoyaltyFee}/{lang === 'vi' ? 'ngày' : 'day'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {lang === 'vi' ? 'Chủ cơ sở: ' : 'Operator: '}{unit.ownerName} • {lang === 'vi' ? 'Chuẩn vận hành: ' : 'Audit Quality: '}{Math.round(unit.auditScore)}%
                  </div>
                </div>

                <button
                  disabled={state.finances.cash < 300}
                  onClick={() => {
                    soundEngine.playClick();
                    onAuditFranchisee(unit.id);
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded-lg transition border border-slate-700"
                >
                  {lang === 'vi' ? 'Thanh tra ($300)' : 'Audit ($300)'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* M&A Competitor Buyouts */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-rose-400" />{' '}
          {lang === 'vi' ? 'Mua Bán & Sáp Nhập Thâu Tóm Đối Thủ (M&A Rival Takeovers)' : 'Mergers & Acquisitions (M&A Rival Takeovers)'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {state.competitors.map((comp) => {
            const isAcquired = corp.acquiredCompetitorIds.includes(comp.id);
            const buyoutCost = comp.marketShare * 800;
            const compName = lang === 'vi' && comp.vietnameseName ? comp.vietnameseName : comp.name;

            return (
              <div
                key={comp.id}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition ${
                  isAcquired
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-xs text-slate-100">{compName}</span>
                    <span className="text-[10px] font-mono-num font-bold text-rose-400 bg-slate-900 px-1.5 py-0.5 rounded">
                      {comp.marketShare}% {lang === 'vi' ? 'Thị phần' : 'Share'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 capitalize">
                    {comp.brandType.replace('_', ' ')} • Rep: {comp.reputation}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80">
                  {isAcquired ? (
                    <div className="py-1 text-center text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" /> {lang === 'vi' ? 'Đã Thâu Tóm Xong' : 'Acquired Subsidiary'}
                    </div>
                  ) : (
                    <button
                      disabled={state.finances.cash < buyoutCost}
                      onClick={() => {
                        soundEngine.playCashRegister();
                        onAcquireCompetitor(comp.id, buyoutCost);
                      }}
                      className="w-full py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold text-xs transition shadow-md shadow-rose-600/20"
                    >
                      {lang === 'vi' ? `Thâu Tóm Chuỗi ($${buyoutCost.toLocaleString()})` : `Acquire Brand ($${buyoutCost.toLocaleString()})`}
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
