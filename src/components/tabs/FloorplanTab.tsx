import React from 'react';
import { GameState } from '../../types/game';
import { LayoutGrid, Move, Zap, Check, Sparkles, AlertTriangle, ArrowRight, Volume2 } from 'lucide-react';
import { soundEngine } from '../../engine/soundEngine';

interface FloorplanTabProps {
  state: GameState;
  onSetProximityTier: (tier: number) => void;
  onToggleExpressPickup: () => void;
  onToggleAcousticPanels: () => void;
}

export const FloorplanTab: React.FC<FloorplanTabProps> = ({
  state,
  onSetProximityTier,
  onToggleExpressPickup,
  onToggleAcousticPanels,
}) => {
  const currentTier = state.layoutSettings.kitchenProximityTier;
  const hasPickup = state.layoutSettings.expressPickupWindow;
  const hasAcoustic = state.layoutSettings.acousticWallPanels;

  const tiers = [
    {
      tier: 1,
      title: 'Ergonomic Golden Triangle (3.2m)',
      delay: '0s delay (Optimal)',
      cost: 0,
      desc: 'Cook line, barista counter, and pickup window within arm reach. Maximum staff speed.',
    },
    {
      tier: 2,
      title: 'Standard Linear Layout (5.4m)',
      delay: '+4s transit delay',
      cost: 600,
      desc: 'Separated prep counter and coffee bar. Reasonable space for multiple staff.',
    },
    {
      tier: 3,
      title: 'Sprawling Split Concept (8.5m)',
      delay: '+8s transit delay',
      cost: 1200,
      desc: 'Open show kitchen with extended walking paths between line cooks and counter.',
    },
  ];

  return (
    <div className="space-y-4 select-none">
      {/* Layout Ergonomics Concept Banner */}
      <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-start gap-3 text-xs text-slate-300">
        <LayoutGrid className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-slate-100 flex items-center gap-2">
            <span>Spatial Layout & Ergonomics Engineering</span>
            <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono">
              Travel Distance = Prep Time
            </span>
          </div>
          <p className="text-slate-400 mt-0.5 leading-relaxed">
            Every extra meter a chef or barista walks between the cooking line and pickup counter adds seconds to customer wait times. During 100-order rushes, inefficient layouts cause queue blowouts and walk-outs!
          </p>
        </div>
      </div>

      {/* Proximity Layout Tiers */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Move className="w-4 h-4 text-amber-400" /> Kitchen-to-Counter Transit Optimization
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {tiers.map((t) => {
            const isSelected = currentTier === t.tier;

            return (
              <div
                key={t.tier}
                className={`p-3 rounded-xl border flex flex-col justify-between transition ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-md'
                    : 'bg-slate-950/60 border-slate-800/80 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-xs text-slate-100">{t.title}</span>
                    {isSelected && (
                      <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono-num font-bold text-amber-300 mt-1">
                    {t.delay}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
                    {t.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80">
                  <button
                    disabled={isSelected || state.finances.cash < t.cost}
                    onClick={() => {
                      soundEngine.playClick();
                      onSetProximityTier(t.tier);
                    }}
                    className={`w-full py-1.5 rounded-lg text-xs font-bold transition ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 cursor-default'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isSelected ? 'Active Configuration' : `Apply Layout ($${t.cost})`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Specialized Station Additions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Curbside Delivery & Express Pickup Window */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between">
          <div>
            <div className="font-bold text-xs text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" /> Curbside Express Delivery Hatch
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Separates online delivery drivers and to-go patrons from dine-in seating. Prevents queue crowding at main POS.
            </p>
            <div className="text-[11px] font-mono-num text-emerald-400 font-bold mt-2">
              {hasPickup ? 'Installed & Operational' : 'Cost: $450'}
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onToggleExpressPickup();
            }}
            className={`p-2 rounded-xl border transition ${
              hasPickup
                ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {hasPickup ? <Check className="w-4 h-4" /> : 'Install'}
          </button>
        </div>

        {/* Acoustic Sound Dampening Panels */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between">
          <div>
            <div className="font-bold text-xs text-slate-100 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-cyan-400" /> Acoustic Wall Wood Paneling
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Reduces noisy kitchen clatter & street rumble. Boosts dining ambiance by +15% and increases guest wait tolerance.
            </p>
            <div className="text-[11px] font-mono-num text-cyan-400 font-bold mt-2">
              {hasAcoustic ? 'Installed & Operational' : 'Cost: $380'}
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onToggleAcousticPanels();
            }}
            className={`p-2 rounded-xl border transition ${
              hasAcoustic
                ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {hasAcoustic ? <Check className="w-4 h-4" /> : 'Install'}
          </button>
        </div>
      </div>
    </div>
  );
};
