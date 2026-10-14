import React from 'react';
import { GameState } from '../../types/game';
import { Utensils, Zap } from 'lucide-react';
import { soundEngine } from '../../engine/soundEngine';
import { useLanguage } from '../../context/LanguageContext';

interface BuildTabProps {
  state: GameState;
  onBuyTable: (type: 'table_2p' | 'table_4p' | 'counter_bar') => void;
  onUpgradeEquipment: (equipId: string) => void;
}

export const BuildTab: React.FC<BuildTabProps> = ({ state, onBuyTable, onUpgradeEquipment }) => {
  const { lang } = useLanguage();
  const currentTotalSeats = state.tables.reduce((sum, t) => sum + t.seats, 0);

  return (
    <div className="space-y-4 select-none">
      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">
            {lang === 'vi' ? 'Tổng số chỗ ngồi ăn' : 'Total Dining Seats'}
          </div>
          <div className="text-xl font-bold font-mono-num text-cyan-300 mt-1">
            {currentTotalSeats} {lang === 'vi' ? 'chỗ' : 'Seats'} ({state.tables.length} {lang === 'vi' ? 'bàn' : 'Tables'})
          </div>
        </div>

        <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">
            {lang === 'vi' ? 'Công suất phục vụ bếp' : 'Total Kitchen Capacity'}
          </div>
          <div className="text-xl font-bold font-mono-num text-amber-300 mt-1">
            {state.kitchenCapacityPerHour} {lang === 'vi' ? 'đơn / giờ' : 'orders / hr'}
          </div>
        </div>

        <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl col-span-2 md:col-span-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">
            {lang === 'vi' ? 'Điểm không gian quán' : 'Ambiance Score'}
          </div>
          <div className="text-xl font-bold font-mono-num text-emerald-300 mt-1">
            {Math.round(state.reputation * 0.9)} / 100
          </div>
        </div>
      </div>

      {/* Seating Expansion Section */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Utensils className="w-4 h-4 text-cyan-400" />{' '}
            {lang === 'vi' ? 'Lắp Đặt Bàn Ghế & Mở Rộng Sức Chứa' : 'Dining Furniture & Seating Additions'}
          </h3>
          <span className="text-[10px] text-slate-400">
            {lang === 'vi' ? 'Nhấn để mua thêm chỗ ngồi' : 'Click to expand capacity'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 2-Person Table */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="font-bold text-xs text-slate-100">
                {lang === 'vi' ? 'Bàn Bistro Tròn 2 Chỗ' : 'Bistro 2-Seater Table'}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {lang === 'vi' ? 'Bàn gỗ gọn gàng cho khách lẻ & cặp đôi' : 'Compact table for couples & solo guests'}
              </div>
              <div className="text-xs font-mono-num text-emerald-400 font-bold mt-2">
                +$180 • +2 {lang === 'vi' ? 'ghế' : 'Seats'}
              </div>
            </div>
            <button
              disabled={state.finances.cash < 180 || state.tables.length >= 10}
              onClick={() => {
                soundEngine.playClick();
                onBuyTable('table_2p');
              }}
              className="mt-3 w-full py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-950 font-bold text-xs transition"
            >
              {lang === 'vi' ? 'Mua Bàn ($180)' : 'Install Table ($180)'}
            </button>
          </div>

          {/* 4-Person Booth */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="font-bold text-xs text-slate-100">
                {lang === 'vi' ? 'Bàn Chữ Nhật 4 Chỗ' : 'Family 4-Seater Booth'}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {lang === 'vi' ? 'Bàn rộng rãi cho nhóm bạn & gia đình' : 'High comfort booth for groups & lunches'}
              </div>
              <div className="text-xs font-mono-num text-emerald-400 font-bold mt-2">
                +$320 • +4 {lang === 'vi' ? 'ghế' : 'Seats'}
              </div>
            </div>
            <button
              disabled={state.finances.cash < 320 || state.tables.length >= 10}
              onClick={() => {
                soundEngine.playClick();
                onBuyTable('table_4p');
              }}
              className="mt-3 w-full py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-950 font-bold text-xs transition"
            >
              {lang === 'vi' ? 'Mua Bàn ($320)' : 'Install Booth ($320)'}
            </button>
          </div>

          {/* Counter Bar */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="font-bold text-xs text-slate-100">
                {lang === 'vi' ? 'Ghế Quầy Bar Trực Tiếp' : 'Artisan Bar Counter'}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {lang === 'vi' ? 'Ghế chân cao ngắm barista biểu diễn' : 'Bar stools facing barista & espresso line'}
              </div>
              <div className="text-xs font-mono-num text-emerald-400 font-bold mt-2">
                +$260 • +3 {lang === 'vi' ? 'ghế' : 'Seats'}
              </div>
            </div>
            <button
              disabled={state.finances.cash < 260 || state.tables.length >= 10}
              onClick={() => {
                soundEngine.playClick();
                onBuyTable('counter_bar');
              }}
              className="mt-3 w-full py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-950 font-bold text-xs transition"
            >
              {lang === 'vi' ? 'Lắp Ghế Bar ($260)' : 'Install Bar ($260)'}
            </button>
          </div>
        </div>
      </div>

      {/* Commercial Kitchen Equipment Upgrades */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />{' '}
          {lang === 'vi' ? 'Máy Móc & Trang Thiết Bị Bếp Chuyên Nghiệp' : 'Commercial Kitchen & Beverage Equipment'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {state.equipment.map((eq) => {
            const upgradeCost = eq.tier * 800;
            const eqDisplayName = lang === 'vi' && eq.vietnameseName ? eq.vietnameseName : eq.name;

            return (
              <div key={eq.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-xs text-slate-100">{eqDisplayName}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      {lang === 'vi' ? 'Cấp độ ' : 'Tier '}{eq.tier} • {lang === 'vi' ? 'Tốc độ: ' : 'Prep Rate: '}{eq.capacityPerMin} {lang === 'vi' ? 'món/phút' : 'dishes/min'}
                    </div>
                  </div>
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded-full">
                    +{eq.efficiencyBonus}% {lang === 'vi' ? 'Tốc độ' : 'Speed'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-400">
                    {lang === 'vi' ? 'Tình trạng: ' : 'Condition: '}{eq.condition}%
                  </span>
                  <button
                    disabled={state.finances.cash < upgradeCost || eq.tier >= 3}
                    onClick={() => {
                      soundEngine.playClick();
                      onUpgradeEquipment(eq.id);
                    }}
                    className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition"
                  >
                    {eq.tier >= 3 ? (lang === 'vi' ? 'Tối đa' : 'Max Tier') : (lang === 'vi' ? `Nâng cấp Cấp ${eq.tier + 1} ($${upgradeCost})` : `Upgrade to Tier ${eq.tier + 1} ($${upgradeCost})`)}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
