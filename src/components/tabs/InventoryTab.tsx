import React from 'react';
import { GameState } from '../../types/game';
import { Package, RefreshCw } from 'lucide-react';
import { soundEngine } from '../../engine/soundEngine';
import { useLanguage } from '../../context/LanguageContext';

interface InventoryTabProps {
  state: GameState;
  onOrderStock: (ingredientId: string, amount: number) => void;
  onUpdateAutoReorder: (ingredientId: string, threshold: number, amount: number) => void;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  state,
  onOrderStock,
}) => {
  const { lang } = useLanguage();

  return (
    <div className="space-y-4 select-none">
      {/* Supply Chain Insight Banner */}
      <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-emerald-400" />
          <span>
            <strong>{lang === 'vi' ? 'Quản Lý Chuỗi Cung Ứng & Hạn Dùng:' : 'Working Capital & Spoilage Balance:'}</strong>{' '}
            {lang === 'vi'
              ? 'Thiếu nguyên liệu sẽ khiến quán hết món và mất doanh thu, trong khi tồn kho quá nhiều sẽ chôn vốn và gây hư hỏng đồ tươi sống!'
              : "Under-stocking results in 86'd menu items and lost sales, whereas over-stocking ties up valuable cash and causes perishables to spoil!"}
          </span>
        </div>
      </div>

      {/* Ingredient Stock Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {state.inventory.map((inv) => {
          const stockPercentage = Math.round((inv.stock / inv.maxStock) * 100);
          const isLow = inv.stock <= inv.autoReorderThreshold;
          const cost25 = Math.round(25 * inv.unitCost);
          const cost50 = Math.round(50 * inv.unitCost);
          const displayName = lang === 'vi' && inv.vietnameseName ? inv.vietnameseName : inv.name;

          return (
            <div
              key={inv.id}
              className={`p-3.5 rounded-xl border transition ${
                isLow
                  ? 'bg-rose-950/20 border-rose-900/50 shadow-md shadow-rose-950/30'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-100">{displayName}</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {inv.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {lang === 'vi' ? 'Đơn giá vốn: ' : 'Unit Cost: '}
                    <strong className="text-emerald-400 font-mono-num">${inv.unitCost.toFixed(2)}</strong> • {lang === 'vi' ? 'Phẩm cấp: ' : 'Grade: '}{inv.qualityGrade}
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-mono-num font-bold text-sm ${isLow ? 'text-rose-400 animate-pulse' : 'text-slate-100'}`}>
                    {inv.stock} <span className="text-xs text-slate-500 font-normal">/ {inv.maxStock}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{lang === 'vi' ? 'Đơn vị trong kho' : 'Units in Pantry'}</div>
                </div>
              </div>

              {/* Stock Bar */}
              <div className="mt-2.5 space-y-1">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${isLow ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, stockPercentage)}%` }}
                  />
                </div>
              </div>

              {/* Quick Restock Buttons */}
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <RefreshCw className="w-3 h-3 text-cyan-400" />
                  <span>{lang === 'vi' ? 'Tự đặt: ' : 'Auto: '}&le;{inv.autoReorderThreshold} &rarr; +{inv.autoReorderAmount}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={state.finances.cash < cost25 || inv.stock >= inv.maxStock}
                    onClick={() => {
                      soundEngine.playClick();
                      onOrderStock(inv.id, 25);
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-[10px] font-bold rounded-lg transition border border-slate-700"
                    title={lang === 'vi' ? `Nhập 25 đơn vị ($${cost25})` : `Order 25 units ($${cost25})`}
                  >
                    +25 (${cost25})
                  </button>

                  <button
                    disabled={state.finances.cash < cost50 || inv.stock >= inv.maxStock}
                    onClick={() => {
                      soundEngine.playClick();
                      onOrderStock(inv.id, 50);
                    }}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-[10px] font-bold rounded-lg transition shadow-sm"
                    title={lang === 'vi' ? `Nhập 50 đơn vị ($${cost50})` : `Order 50 units ($${cost50})`}
                  >
                    +50 (${cost50})
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
