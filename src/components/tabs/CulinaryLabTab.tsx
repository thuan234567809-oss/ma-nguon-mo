import React from 'react';
import { GameState, RdRecipeProject } from '../../types/game';
import { Sparkles, Award, Star, FlaskConical, ChefHat, CheckCircle2, AlertCircle, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface CulinaryLabTabProps {
  state: GameState;
  onStartResearch: (projectId: string) => void;
  onUpgradeLab: () => void;
  onRequestAudit: () => void;
  onTrainMasterChef: (staffId: string) => void;
}

export const CulinaryLabTab: React.FC<CulinaryLabTabProps> = ({
  state,
  onStartResearch,
  onUpgradeLab,
  onRequestAudit,
  onTrainMasterChef,
}) => {
  const { lang, t } = useLanguage();
  const lab = state.culinaryLab;
  const michelin = lab.michelin;
  const headChef = state.staff.find(s => s.role === 'head_chef');

  const avgQuality = Math.round(state.menu.reduce((sum, m) => sum + m.quality, 0) / Math.max(1, state.menu.length));
  const fulfillmentPct = Math.round((state.ordersServedToday / Math.max(1, state.ordersServedToday + state.customersLostToday)) * 100);

  const criteria = [
    { label: lang === 'vi' ? 'Chất lượng món >= 85' : 'Menu Quality >= 85', met: avgQuality >= 85, current: avgQuality },
    { label: lang === 'vi' ? 'Độ sạch quán >= 90%' : 'Cleanliness >= 90%', met: state.cleanliness >= 90, current: `${Math.round(state.cleanliness)}%` },
    { label: lang === 'vi' ? 'Tỷ lệ phục vụ >= 80%' : 'Order Speed >= 80%', met: fulfillmentPct >= 80, current: `${fulfillmentPct}%` },
    { label: lang === 'vi' ? 'Bếp trưởng Cấp 4+' : 'Head Chef Lv4+', met: (headChef?.experienceLevel ?? 0) >= 4, current: `Lv${headChef?.experienceLevel ?? 1}` },
  ];

  return (
    <div className="space-y-4 select-none max-h-[58vh] overflow-y-auto pr-1">
      {/* Facility Header */}
      <div className="p-4 bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-slate-900 border border-amber-500/30 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <FlaskConical className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-amber-300">{t('culinaryTitle')}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {t('labTierLabel')} {lab.labTier}
              </span>
            </div>
            <p className="text-xs text-slate-400">{t('culinaryDesc')}</p>
          </div>
        </div>

        {lab.labTier < 3 && (
          <button
            onClick={onUpgradeLab}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-500/20 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('upgradeLabBtn')} (${lab.labTier * 2800})</span>
          </button>
        )}
      </div>

      {/* Michelin Guide Panel */}
      <div className="p-4 bg-slate-900/80 border border-purple-500/30 rounded-2xl space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{t('michelinGuideHeading')}</h3>
          </div>

          <div className="flex items-center gap-1 bg-slate-950/80 px-3 py-1 rounded-xl border border-amber-500/40">
            <span className="text-xs text-slate-400 font-semibold mr-1">{t('michelinStarsCount')}:</span>
            {[1, 2, 3].map(starIndex => (
              <Star
                key={starIndex}
                className={`w-4 h-4 ${starIndex <= michelin.stars ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-slate-700'}`}
              />
            ))}
            <span className="ml-1 text-xs font-bold text-amber-300">
              {michelin.stars > 0 ? `${michelin.stars} ${lang === 'vi' ? 'Sao' : 'Stars'}` : (lang === 'vi' ? 'Chưa có' : 'None')}
            </span>
          </div>
        </div>

        {/* Audit Checklist */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {criteria.map((c, i) => (
            <div key={i} className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${c.met ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-slate-950/60 border-slate-800 text-slate-400'}`}>
              <div className="truncate pr-1">
                <div className="font-semibold">{c.label}</div>
                <div className="text-[10px] text-slate-400">({c.current})</div>
              </div>
              {c.met ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-slate-600 shrink-0" />}
            </div>
          ))}
        </div>

        {/* Report & Action */}
        <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-xs text-slate-300 italic">
            "{michelin.feedbackReport}"
          </p>

          <button
            onClick={onRequestAudit}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-purple-600/20 shrink-0"
          >
            <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>{t('requestAuditBtn')}</span>
          </button>
        </div>
      </div>

      {/* Secret Signature R&D Projects */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <FlaskConical className="w-4 h-4 text-amber-400" />
            <span>{lang === 'vi' ? 'Dự Án Công Thức Bí Truyền Độc Quyền (R&D Lab)' : 'Secret Signature Recipe R&D Projects'}</span>
          </h3>
          <span className="text-[11px] text-slate-400">
            {lab.projects.filter(p => p.isUnlocked).length}/{lab.projects.length} {lang === 'vi' ? 'Đã hoàn thành' : 'Completed'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {lab.projects.map(project => {
            const isCurrentActive = lab.activeProjectId === project.id;
            const progressPct = Math.min(100, Math.round((project.hoursInvested / project.durationHours) * 100));

            return (
              <div
                key={project.id}
                className={`p-3.5 rounded-2xl border transition ${
                  project.isUnlocked
                    ? 'bg-emerald-950/15 border-emerald-500/30'
                    : isCurrentActive
                    ? 'bg-amber-950/20 border-amber-500/50 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {lang === 'vi' ? project.vietnameseName : project.name}
                      </span>
                      {project.isUnlocked && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {t('dishUnlockedBadge')}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-amber-400/90 italic mt-0.5">
                      "{project.flavorProfile}"
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-emerald-400 font-mono-num">${project.sellingPrice}</div>
                    <div className="text-[10px] text-slate-400">Cost: ${project.baseCost}</div>
                  </div>
                </div>

                {/* Progress bar if researching */}
                {isCurrentActive && !project.isUnlocked && (
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[10px] text-amber-300 font-semibold">
                      <span>{t('researchingBtn')}</span>
                      <span>{project.hoursInvested.toFixed(1)}h / {project.durationHours}h ({progressPct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-amber-500/30">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Card footer */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-3 text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{project.durationHours}h R&D</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                      <span>+{project.qualityBonus} Quality</span>
                    </span>
                  </div>

                  {!project.isUnlocked && !isCurrentActive && (
                    <button
                      onClick={() => onStartResearch(project.id)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-semibold transition"
                    >
                      {t('startResearchBtn')} (${project.researchCost})
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Master Chef Guild */}
      {headChef && (
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">
                {t('masterChefHeading')} — {headChef.name}
              </div>
              <div className="text-[11px] text-slate-400">
                {lang === 'vi' ? 'Cấp độ hiện tại' : 'Current Rank'}: Lv{headChef.experienceLevel} • Speed: {headChef.speed} • Accuracy: {headChef.accuracy}%
              </div>
            </div>
          </div>

          {headChef.experienceLevel < 5 && (
            <button
              onClick={() => onTrainMasterChef(headChef.id)}
              className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shrink-0"
            >
              <Award className="w-3.5 h-3.5" />
              <span>{t('trainMasterChefBtn')}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
