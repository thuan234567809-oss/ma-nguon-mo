import React from 'react';
import { GameState } from '../../types/game';
import { Plus, Minus, Check, X, Clock, Flame, Star } from 'lucide-react';
import { soundEngine } from '../../engine/soundEngine';
import { useLanguage } from '../../context/LanguageContext';

interface MenuTabProps {
  state: GameState;
  onUpdatePrice: (itemId: string, newPrice: number) => void;
  onToggleActive: (itemId: string) => void;
}

export const MenuTab: React.FC<MenuTabProps> = ({ state, onUpdatePrice, onToggleActive }) => {
  const { lang } = useLanguage();

  return (
    <div className="space-y-4 select-none">
      {/* Menu Engineering Insight Banner */}
      <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>
            <strong>{lang === 'vi' ? 'Chiến lược Định giá & Tối ưu Thực đơn:' : 'Strategic Menu Engineering:'}</strong>{' '}
            {lang === 'vi'
              ? 'Món có biên lãi cao mang lại lợi nhuận vượt trội, nhưng món chế biến phức tạp sẽ gây nghẽn bếp trong giờ cao điểm!'
              : 'High-margin dishes increase profitability, but complex meals with high prep time bottleneck kitchen throughput during rushes!'}
          </span>
        </div>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          {state.menu.filter(m => m.active).length} / {state.menu.length}{' '}
          {lang === 'vi' ? 'Món đang phục vụ' : 'Dishes Offered'}
        </span>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {state.menu.map((dish) => {
          const margin = dish.sellingPrice > 0 ? Math.round(((dish.sellingPrice - dish.baseCost) / dish.sellingPrice) * 100) : 0;
          const profitPerItem = (dish.sellingPrice - dish.baseCost).toFixed(2);
          const dishDisplayName = lang === 'vi' && dish.vietnameseName ? dish.vietnameseName : dish.name;

          return (
            <div
              key={dish.id}
              className={`p-3.5 rounded-xl border transition ${
                dish.active
                  ? 'bg-slate-900/80 border-slate-800 shadow-lg'
                  : 'bg-slate-950/40 border-slate-900 opacity-60'
              }`}
            >
              {/* Top row: Name & Active switch */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">{dishDisplayName}</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {dish.category.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span className="flex items-center gap-1 font-mono-num">
                      <Clock className="w-3 h-3 text-slate-400" /> {dish.prepTimeSeconds}s {lang === 'vi' ? 'chế biến' : 'prep'}
                    </span>
                    <span className="flex items-center gap-1 font-mono-num">
                      <Star className="w-3 h-3 text-amber-400" /> {dish.quality} {lang === 'vi' ? 'Chất lượng' : 'Quality'}
                    </span>
                    <span className="text-slate-400 font-mono-num">
                      {lang === 'vi' ? 'Độ khó:' : 'Difficulty:'} {dish.difficulty}/5
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onToggleActive(dish.id);
                  }}
                  className={`p-1.5 rounded-lg border transition ${
                    dish.active
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                  title={dish.active ? (lang === 'vi' ? 'Tạm ngưng phục vụ món' : 'Remove from live menu') : (lang === 'vi' ? 'Bật phục vụ món' : 'Add to live menu')}
                >
                  {dish.active ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </button>
              </div>

              {/* Economic stats: Cost, Price & Margin */}
              <div className="mt-3 p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">{lang === 'vi' ? 'Giá vốn nguyên liệu' : 'Ingredient Cost'}</div>
                  <div className="font-bold font-mono-num text-slate-300">${dish.baseCost.toFixed(2)}</div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 uppercase">{lang === 'vi' ? 'Biên lợi nhuận' : 'Profit Margin'}</div>
                  <div className={`font-bold font-mono-num ${margin >= 60 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {margin}% (${profitPerItem})
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 uppercase">{lang === 'vi' ? 'Giá bán thực tế' : 'Selling Price'}</div>
                  <div className="flex items-center justify-center gap-1 font-bold font-mono-num text-amber-300">
                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        onUpdatePrice(dish.id, Math.max(1.0, Number((dish.sellingPrice - 0.5).toFixed(2))));
                      }}
                      className="p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                      title={lang === 'vi' ? 'Giảm $0.50' : 'Decrease $0.50'}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span>${dish.sellingPrice.toFixed(2)}</span>
                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        onUpdatePrice(dish.id, Number((dish.sellingPrice + 0.5).toFixed(2)));
                      }}
                      className="p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                      title={lang === 'vi' ? 'Tăng $0.50' : 'Increase $0.50'}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Today's Sales Performance */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono-num">
                <span>{lang === 'vi' ? 'Đã bán hôm nay: ' : 'Sold Today: '}<strong className="text-slate-200">{dish.totalSoldToday} {lang === 'vi' ? 'phần' : 'units'}</strong></span>
                <span>{lang === 'vi' ? 'Doanh thu: ' : 'Revenue: '}<strong className="text-emerald-400">${dish.totalRevenueToday.toFixed(2)}</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
