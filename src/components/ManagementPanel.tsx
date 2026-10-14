import React from 'react';
import { GameState, GameSpeed, DistrictId, Applicant } from '../types/game';
import {
  LayoutDashboard,
  DollarSign,
  Utensils,
  Bike,
  Factory,
  LayoutGrid,
  Users,
  Package,
  Hammer,
  Megaphone,
  MapPin,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Building,
  BarChart3,
  FlaskConical,
  Trophy,
} from 'lucide-react';
import { DashboardTab } from './tabs/DashboardTab';
import { FinanceTab } from './tabs/FinanceTab';
import { MenuTab } from './tabs/MenuTab';
import { DeliveryTab } from './tabs/DeliveryTab';
import { ChainSupplyTab } from './tabs/ChainSupplyTab';
import { FloorplanTab } from './tabs/FloorplanTab';
import { CorporateTab } from './tabs/CorporateTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { CulinaryLabTab } from './tabs/CulinaryLabTab';
import { StaffTab } from './tabs/StaffTab';
import { InventoryTab } from './tabs/InventoryTab';
import { BuildTab } from './tabs/BuildTab';
import { MarketingTab } from './tabs/MarketingTab';
import { MarketCityTab } from './tabs/MarketCityTab';
import { AchievementsTab } from './tabs/AchievementsTab';
import { GddRoadmapTab } from './tabs/GddRoadmapTab';
import { soundEngine } from '../engine/soundEngine';
import { useLanguage } from '../context/LanguageContext';

export type ManagementTabType =
  | 'dashboard'
  | 'analytics'
  | 'culinary'
  | 'corporate'
  | 'delivery'
  | 'chain'
  | 'floorplan'
  | 'finance'
  | 'menu'
  | 'staff'
  | 'inventory'
  | 'build'
  | 'marketing'
  | 'market'
  | 'achievements'
  | 'gdd';

interface ManagementPanelProps {
  state: GameState;
  activeTab: ManagementTabType;
  isOpen: boolean;
  onSelectTab: (tab: ManagementTabType) => void;
  onToggleOpen: () => void;
  // Handlers
  onTakeLoan: (amount: number) => void;
  onUpdatePrice: (itemId: string, newPrice: number) => void;
  onToggleActiveDish: (itemId: string) => void;
  onHireApplicant: (applicant: Applicant) => void;
  onFireStaff: (staffId: string) => void;
  onTrainStaff: (staffId: string, type: 'speed' | 'accuracy' | 'hospitality') => void;
  onChangeShift: (staffId: string, shift: 'morning' | 'evening' | 'full') => void;
  onOrderStock: (ingredientId: string, amount: number) => void;
  onUpdateAutoReorder: (ingredientId: string, threshold: number, amount: number) => void;
  onBuyTable: (type: 'table_2p' | 'table_4p' | 'counter_bar') => void;
  onUpgradeEquipment: (equipId: string) => void;
  onToggleCampaign: (campaignId: string) => void;
  onRelocateDistrict: (districtId: DistrictId) => void;
  // Phase 2 Handlers
  onToggleDeliveryPlatform: (platformId: string) => void;
  onBuyScooter: () => void;
  onUnlockCommissary: () => void;
  onUpgradeCommissary: () => void;
  onOpenBranch: (branchId: string) => void;
  onSetProximityTier: (tier: number) => void;
  onToggleExpressPickup: () => void;
  onToggleAcousticPanels: () => void;
  // Phase 3 Corporate Handlers
  onFormHoldings: () => void;
  onSignFranchisee: () => void;
  onAuditFranchisee: (unitId: string) => void;
  onAcquireCompetitor: (competitorId: string, cost: number) => void;
  onLaunchIpo: () => void;
  // Phase 5 Culinary & Save Handlers
  onStartResearch: (projectId: string) => void;
  onUpgradeLab: () => void;
  onRequestAudit: () => void;
  onTrainMasterChef: (staffId: string) => void;
  onImportState?: (state: GameState) => void;
}

export const ManagementPanel: React.FC<ManagementPanelProps> = ({
  state,
  activeTab,
  isOpen,
  onSelectTab,
  onToggleOpen,
  onTakeLoan,
  onUpdatePrice,
  onToggleActiveDish,
  onHireApplicant,
  onFireStaff,
  onTrainStaff,
  onChangeShift,
  onOrderStock,
  onUpdateAutoReorder,
  onBuyTable,
  onUpgradeEquipment,
  onToggleCampaign,
  onRelocateDistrict,
  onToggleDeliveryPlatform,
  onBuyScooter,
  onUnlockCommissary,
  onUpgradeCommissary,
  onOpenBranch,
  onSetProximityTier,
  onToggleExpressPickup,
  onToggleAcousticPanels,
  onFormHoldings,
  onSignFranchisee,
  onAuditFranchisee,
  onAcquireCompetitor,
  onLaunchIpo,
  onStartResearch,
  onUpgradeLab,
  onRequestAudit,
  onTrainMasterChef,
  onImportState,
}) => {
  const { t } = useLanguage();

  const tabs = [
    { id: 'dashboard', label: t('tab_dashboard'), icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'analytics', label: t('tab_analytics'), icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'culinary', label: t('tab_culinary'), icon: <FlaskConical className="w-4 h-4 text-amber-400" /> },
    { id: 'corporate', label: t('tab_corporate'), icon: <Building className="w-4 h-4" /> },
    { id: 'delivery', label: t('tab_delivery'), icon: <Bike className="w-4 h-4" /> },
    { id: 'chain', label: t('tab_chain'), icon: <Factory className="w-4 h-4" /> },
    { id: 'floorplan', label: t('tab_floorplan'), icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'finance', label: t('tab_finance'), icon: <DollarSign className="w-4 h-4" /> },
    { id: 'menu', label: t('tab_menu'), icon: <Utensils className="w-4 h-4" /> },
    { id: 'staff', label: t('tab_staff'), icon: <Users className="w-4 h-4" /> },
    { id: 'inventory', label: t('tab_inventory'), icon: <Package className="w-4 h-4" /> },
    { id: 'build', label: t('tab_build'), icon: <Hammer className="w-4 h-4" /> },
    { id: 'marketing', label: t('tab_marketing'), icon: <Megaphone className="w-4 h-4" /> },
    { id: 'market', label: t('tab_market'), icon: <MapPin className="w-4 h-4" /> },
    { id: 'achievements', label: t('tab_achievements'), icon: <Trophy className="w-4 h-4 text-yellow-400" /> },
    { id: 'gdd', label: t('tab_gdd'), icon: <BookOpen className="w-4 h-4" /> },
  ] as const;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-30 transition-all duration-300 flex flex-col justify-end select-none pointer-events-none`}>
      <div className="max-w-6xl w-full mx-auto px-3 pb-3 pointer-events-auto">
        <div className="bg-slate-950/92 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Top navigation dock bar */}
          <div className="h-12 bg-slate-900/90 border-b border-slate-800/80 px-2 flex items-center justify-between overflow-x-auto gap-1">
            <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundEngine.playClick();
                    if (!isOpen) onToggleOpen();
                    onSelectTab(tab.id as ManagementTabType);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    isOpen && activeTab === tab.id
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Toggle Minimize/Maximize button */}
            <button
              onClick={() => {
                soundEngine.playClick();
                onToggleOpen();
              }}
              className="p-1.5 ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
              title={isOpen ? 'Minimize Management Console' : 'Expand Management Console'}
            >
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>

          {/* Collapsible Content Area */}
          {isOpen && (
            <div className="p-4 max-h-[58vh] overflow-y-auto">
              {activeTab === 'dashboard' && <DashboardTab state={state} />}
              {activeTab === 'analytics' && <AnalyticsTab state={state} />}
              {activeTab === 'culinary' && (
                <CulinaryLabTab
                  state={state}
                  onStartResearch={onStartResearch}
                  onUpgradeLab={onUpgradeLab}
                  onRequestAudit={onRequestAudit}
                  onTrainMasterChef={onTrainMasterChef}
                />
              )}
              {activeTab === 'corporate' && (
                <CorporateTab
                  state={state}
                  onFormHoldings={onFormHoldings}
                  onSignFranchisee={onSignFranchisee}
                  onAuditFranchisee={onAuditFranchisee}
                  onAcquireCompetitor={onAcquireCompetitor}
                  onLaunchIpo={onLaunchIpo}
                />
              )}
              {activeTab === 'delivery' && (
                <DeliveryTab
                  state={state}
                  onTogglePlatform={onToggleDeliveryPlatform}
                  onBuyScooter={onBuyScooter}
                />
              )}
              {activeTab === 'chain' && (
                <ChainSupplyTab
                  state={state}
                  onUnlockCommissary={onUnlockCommissary}
                  onUpgradeCommissary={onUpgradeCommissary}
                  onOpenBranch={onOpenBranch}
                />
              )}
              {activeTab === 'floorplan' && (
                <FloorplanTab
                  state={state}
                  onSetProximityTier={onSetProximityTier}
                  onToggleExpressPickup={onToggleExpressPickup}
                  onToggleAcousticPanels={onToggleAcousticPanels}
                />
              )}
              {activeTab === 'finance' && <FinanceTab state={state} onTakeLoan={onTakeLoan} />}
              {activeTab === 'menu' && (
                <MenuTab
                  state={state}
                  onUpdatePrice={onUpdatePrice}
                  onToggleActive={onToggleActiveDish}
                />
              )}
              {activeTab === 'staff' && (
                <StaffTab
                  state={state}
                  onHireApplicant={onHireApplicant}
                  onFireStaff={onFireStaff}
                  onTrainStaff={onTrainStaff}
                  onChangeShift={onChangeShift}
                />
              )}
              {activeTab === 'inventory' && (
                <InventoryTab
                  state={state}
                  onOrderStock={onOrderStock}
                  onUpdateAutoReorder={onUpdateAutoReorder}
                />
              )}
              {activeTab === 'build' && (
                <BuildTab
                  state={state}
                  onBuyTable={onBuyTable}
                  onUpgradeEquipment={onUpgradeEquipment}
                />
              )}
              {activeTab === 'marketing' && (
                <MarketingTab
                  state={state}
                  onToggleCampaign={onToggleCampaign}
                />
              )}
              {activeTab === 'market' && (
                <MarketCityTab
                  state={state}
                  onRelocateDistrict={onRelocateDistrict}
                />
              )}
              {activeTab === 'achievements' && (
                <AchievementsTab
                  state={state}
                  onImportState={onImportState || (() => {})}
                />
              )}
              {activeTab === 'gdd' && <GddRoadmapTab />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

