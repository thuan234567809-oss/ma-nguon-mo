import React from 'react';
import { BookOpen, Target, Cpu, TrendingUp, Layers, CheckCircle2, ShieldAlert } from 'lucide-react';

export const GddRoadmapTab: React.FC = () => {
  return (
    <div className="space-y-4 select-none max-h-[70vh] overflow-y-auto pr-1">
      {/* Title */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <BookOpen className="w-4 h-4" />
          <span>BistroTycoon 3D — Official Game Design Document (GDD) & Architecture</span>
        </div>
        <p className="text-xs text-slate-400">
          Executive Design Specification, Economic Models, Simulation Loop, and Multi-Phase Release Roadmap.
        </p>
      </div>

      {/* 1. Core Mechanics & Philosophy */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-400" /> 1. Core Simulation Pillars & Trade-offs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
            <div className="font-bold text-amber-300">• Operational Throughput vs Demand</div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Guest demand is dynamic: peaks at breakfast (7-9am), lunch rush (11:30am-1:30pm), and dinner (6-8pm). Kitchen output depends on equipment tiers and line cook speed. If demand exceeds capacity, queues bottleneck, customer patience expires, and reputation tanks.
            </p>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
            <div className="font-bold text-emerald-300">• Cash Flow vs Accounting Profit</div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Distinguishes revenue from profit and profit from cash flow. Over-investing in marketing without working capital triggers bankruptcy at midnight when commercial rent and payroll are settled.
            </p>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
            <div className="font-bold text-cyan-300">• Human Labor Dynamics</div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Staff are not robots: they experience fatigue, stress, wage expectation, and attrition. High stress during prolonged rushes reduces service speed and increases food error rates or sudden resignations.
            </p>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
            <div className="font-bold text-purple-300">• Dynamic World Weather & Day/Night</div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Weather is not cosmetic: rain reduces outdoor pedestrian foot-traffic while boosting delivery/takeout orders; heatwaves boost cold beverage demand and increase electricity costs.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Economic Formulas */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" /> 2. Mathematical Economic Model
        </h3>
        <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg font-mono text-[11px] space-y-1.5 text-slate-300">
          <div>Demand = BaseTraffic &times; DistMult &times; TimeCurve(hour) &times; MktBoost &times; WeatherMod &times; RepFactor</div>
          <div>KitchenCap = (StoveCap &times; CookEff + DrinkCap &times; BaristaEff) / 2</div>
          <div>COGS = &sum;(RecipeIngredients &times; UnitWholesaleCost)</div>
          <div>GrossMargin = (Revenue - COGS) / Revenue &times; 100%</div>
          <div>NetDailyCashFlow = Revenue - (COGS + Rent + Payroll + Utilities + Marketing + Maintenance)</div>
        </div>
      </div>

      {/* 3. Technical Architecture */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-400" /> 3. Technical & 3D WebGL Architecture
        </h3>
        <div className="text-xs text-slate-400 leading-relaxed space-y-1">
          <div>• <strong>Engine:</strong> Three.js WebGL with PCF Soft Shadows, volumetric fog, and dynamic directional solar azimuth.</div>
          <div>• <strong>Audio:</strong> Web Audio API procedural synthesis (procedural cash register chime, bell, frying sizzle, rain noise filter).</div>
          <div>• <strong>Simulation:</strong> Pure delta-time tick loop with pause, 1x, 2x, and 5x turbo multipliers.</div>
          <div>• <strong>Modular Design:</strong> Strict adherence to sub-500 LOC per file, single responsibility, and decoupled state management.</div>
        </div>
      </div>

      {/* 4. Release Roadmap */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" /> 4. Development & Expansion Roadmap
        </h3>

        <div className="space-y-2 text-xs">
          {/* Phase 1 MVP */}
          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>MVP Phase (Completed & Live)</span>
            </div>
            <div className="text-slate-300 text-[11px] mt-1 space-y-0.5">
              <div>✓ Interactive 3D Isometric Living City with day/night cycle & dynamic rain.</div>
              <div>✓ Core simulation tick loop (Demand curve, kitchen capacity, guest patience, ordering, COGS).</div>
              <div>✓ Staff hiring, roster management, shift assignment, and skills training.</div>
              <div>✓ Full financial ledger (Cash, Revenue, COGS, Gross vs Net profit, Rent, Payroll, Bank credit line).</div>
              <div>✓ Click-to-inspect 3D raycasting for guests, crew, dining tables, and city landmarks.</div>
            </div>
          </div>

          {/* Phase 2 Beta */}
          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Phase 2: Delivery & Chain Logistics (Completed & Live)</span>
            </div>
            <div className="text-slate-300 text-[11px] mt-1 space-y-0.5">
              <div>✓ Online Delivery Aggregator dispatch (FoodFast, CityGrab, UrbanEats) with weather rain surges.</div>
              <div>✓ Dedicated in-house delivery scooter fleet with curbside pickup station.</div>
              <div>✓ Central Commissary prep kitchen cutting ingredient COGS by 20-30% network-wide.</div>
              <div>✓ Multi-branch satellite expansion (FinTech Hub & College Blvd locations).</div>
              <div>✓ Spatial Layout Ergonomics: Golden triangle station transit times & express pickup hatch.</div>
            </div>
          </div>

          {/* Phase 3 Full Release */}
          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Phase 3: F&B Corporate Conglomerate & IPO (Completed & Live)</span>
            </div>
            <div className="text-slate-300 text-[11px] mt-1 space-y-0.5">
              <div>✓ Holding Corporation incorporation & dynamic enterprise valuation model.</div>
              <div>✓ Franchise Licensing Engine: Collect $20k upfront fees, 6% daily royalties, and brand quality audits.</div>
              <div>✓ Competitor M&A Hostile Takeovers: Acquire QuickBite, Artisan Roast, and Urban Crust.</div>
              <div>✓ Public Stock Market IPO listing on NASDAQ with equity float & live share price tracking.</div>
              <div>✓ Insolvency & Chapter 11 bankruptcy restructuring enforcement with financial reality penalties.</div>
            </div>
          </div>

          {/* Phase 4 Advanced BI & Ergonomics */}
          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Phase 4: BI Analytics, Ergonomics & Achievements (Completed & Live)</span>
            </div>
            <div className="text-slate-300 text-[11px] mt-1 space-y-0.5">
              <div>✓ Real-time business intelligence metrics, hourly customer flow analysis, and P&L breakdowns.</div>
              <div>✓ Spatial Layout Ergonomics: Transit station optimization & acoustic wall panel dampening.</div>
              <div>✓ Full trophy room achievement milestones with JSON save export & local restore.</div>
            </div>
          </div>

          {/* Phase 5 Culinary Innovation & Michelin Guide */}
          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Phase 5: Culinary R&D Lab, Michelin Stars & Master Chef Guild (Completed & Live)</span>
            </div>
            <div className="text-slate-300 text-[11px] mt-1 space-y-0.5">
              <div>✓ Secret Signature Recipe Innovation Lab with real-time research time investment.</div>
              <div>✓ Formal Michelin Guide Inspection audits awarding up to 3 Prestigious Stars.</div>
              <div>✓ Master Chef certification academy providing line cooks with lightning throughput.</div>
              <div>✓ Seamless English & Vietnamese bilingual localization (ENG / VI) with instant topbar toggle.</div>
              <div>✓ Custom 3D F&B Empire culinary vector favicon & branding emblem.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
