import React from 'react';
import { GameState } from '../../types/game';
import { BarChart3, PieChart, TrendingUp, Users, DollarSign, Award, Target, Utensils } from 'lucide-react';

interface AnalyticsTabProps {
  state: GameState;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ state }) => {
  const f = state.finances;
  const history = f.dailyHistory;

  // Calculate revenue by channel
  const dineInRev = Math.max(0, f.revenueToday - state.deliveryRevenueToday);
  const deliveryRev = state.deliveryRevenueToday;
  const branchRev = state.branches.filter(b => b.status === 'operational' && b.id !== 'branch_hq').reduce((sum, b) => sum + b.dailyRevenue, 0);
  const royaltyRev = state.franchise.units.filter(u => u.status === 'active').reduce((sum, u) => sum + u.dailyRoyaltyFee, 0);
  const totalRev = dineInRev + deliveryRev + branchRev + royaltyRev || 1;

  const dineInPct = Math.round((dineInRev / totalRev) * 100);
  const deliveryPct = Math.round((deliveryRev / totalRev) * 100);
  const branchPct = Math.round((branchRev / totalRev) * 100);
  const royaltyPct = Math.round((royaltyRev / totalRev) * 100);

  // Demographics breakdown based on current district & active customers
  const demoData = [
    { label: 'Corporate Office Workers', pct: state.currentDistrict === 'business' ? 55 : 25, color: 'bg-blue-500', pref: 'Espresso, Americano, Quick Lunch' },
    { label: 'University Students', pct: state.currentDistrict === 'college' ? 50 : 22, color: 'bg-amber-500', pref: 'Matcha Latte, Croissants, Happy Hour' },
    { label: 'Families & Residents', pct: state.currentDistrict === 'residential' ? 45 : 20, color: 'bg-emerald-500', pref: 'Angus Burgers, Seated Dining' },
    { label: 'Gourmet Foodies & Influencers', pct: state.currentDistrict === 'downtown' ? 40 : 18, color: 'bg-purple-500', pref: 'Artisan Vanilla Latte, Truffle Dishes' },
    { label: 'Commuters & Road Trippers', pct: state.currentDistrict === 'suburb' ? 48 : 15, color: 'bg-cyan-500', pref: 'Takeaway Coffee, Pastries' },
  ];

  return (
    <div className="space-y-4 select-none">
      {/* Executive Analytics Header */}
      <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <span>
            <strong>Executive Data Intelligence:</strong> Real-time breakdown of revenue diversification channels, customer demographic mix, and dish contribution margins.
          </span>
        </div>
      </div>

      {/* Revenue Diversification Channels */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400" /> Omnichannel Revenue Stream Breakdown
        </h3>

        {/* Stacked Progress Bar */}
        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
          <div className="bg-amber-500 transition-all" style={{ width: `${dineInPct}%` }} title={`Dine-in: ${dineInPct}%`} />
          <div className="bg-blue-500 transition-all" style={{ width: `${deliveryPct}%` }} title={`Delivery: ${deliveryPct}%`} />
          <div className="bg-cyan-500 transition-all" style={{ width: `${branchPct}%` }} title={`Branches: ${branchPct}%`} />
          <div className="bg-purple-500 transition-all" style={{ width: `${royaltyPct}%` }} title={`Franchise: ${royaltyPct}%`} />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <div className="w-2 h-2 rounded-full bg-amber-500" /> Dine-in Outlets
            </div>
            <div className="font-bold font-mono-num text-slate-200 mt-1">${Math.round(dineInRev)} ({dineInPct}%)</div>
          </div>

          <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <div className="w-2 h-2 rounded-full bg-blue-500" /> Online Delivery
            </div>
            <div className="font-bold font-mono-num text-slate-200 mt-1">${Math.round(deliveryRev)} ({deliveryPct}%)</div>
          </div>

          <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <div className="w-2 h-2 rounded-full bg-cyan-500" /> Satellite Branches
            </div>
            <div className="font-bold font-mono-num text-slate-200 mt-1">${Math.round(branchRev)} ({branchPct}%)</div>
          </div>

          <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <div className="w-2 h-2 rounded-full bg-purple-500" /> Franchise Royalties
            </div>
            <div className="font-bold font-mono-num text-slate-200 mt-1">${Math.round(royaltyRev)} ({royaltyPct}%)</div>
          </div>
        </div>
      </div>

      {/* Demographic Mix */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" /> Guest Demographics & Spending Patterns
        </h3>

        <div className="space-y-2">
          {demoData.map((d, idx) => (
            <div key={idx} className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">{d.label}</span>
                <span className="font-mono-num text-slate-400">{d.pct}% of district foot-traffic</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-1.5">
                <div className={`h-full ${d.color}`} style={{ width: `${d.pct}%` }} />
              </div>
              <div className="text-[10px] text-slate-500 mt-1 italic">Favorites: {d.pref}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Ledger Trend Table */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" /> Longitudinal Performance History
        </h3>

        {history.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500 italic bg-slate-950/40 rounded-xl border border-slate-800/60">
            Operate through multiple days to unlock longitudinal financial trending graphs.
          </div>
        ) : (
          <div className="overflow-x-auto max-h-44">
            <table className="w-full text-xs text-left">
              <thead className="text-[10px] uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-1 px-2">Day</th>
                  <th className="py-1 px-2">Revenue</th>
                  <th className="py-1 px-2">COGS</th>
                  <th className="py-1 px-2">Net Profit</th>
                  <th className="py-1 px-2">Guests</th>
                  <th className="py-1 px-2">Avg Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono-num">
                {history.slice(-8).reverse().map((h) => (
                  <tr key={h.day} className="hover:bg-slate-900/40">
                    <td className="py-1 px-2 text-slate-300 font-bold">Day {h.day}</td>
                    <td className="py-1 px-2 text-slate-200">${h.revenue.toLocaleString()}</td>
                    <td className="py-1 px-2 text-rose-400">-${h.cogs.toLocaleString()}</td>
                    <td className={`py-1 px-2 font-bold ${h.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {h.netProfit >= 0 ? `+$${h.netProfit}` : `-$${Math.abs(h.netProfit)}`}
                    </td>
                    <td className="py-1 px-2 text-slate-400">{h.customerCount}</td>
                    <td className="py-1 px-2 text-amber-300">${h.avgSpend.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
