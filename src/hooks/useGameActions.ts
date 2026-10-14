import React from 'react';
import confetti from 'canvas-confetti';
import { GameState, DistrictId, Applicant, GameSpeed } from '../types/game';
import { soundEngine } from '../engine/soundEngine';
import { useCorporateActions } from './useCorporateActions';
import { useOperationsActions } from './useOperationsActions';
import { evaluateMichelinAudit } from '../engine/culinaryEngine';

export function useGameActions(
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
) {
  const handleSetSpeed = (speed: GameSpeed) => {
    soundEngine.playClick();
    setGameState(prev => ({ ...prev, gameSpeed: speed }));
  };

  const handleTakeLoan = (amount: number) => {
    soundEngine.playCashRegister();
    setGameState(prev => ({
      ...prev,
      finances: { ...prev.finances, cash: prev.finances.cash + amount },
    }));
  };

  const handleUpdatePrice = (itemId: string, newPrice: number) => {
    setGameState(prev => ({
      ...prev,
      menu: prev.menu.map(m => (m.id === itemId ? { ...m, sellingPrice: newPrice } : m)),
    }));
  };

  const handleToggleActiveDish = (itemId: string) => {
    setGameState(prev => ({
      ...prev,
      menu: prev.menu.map(m => (m.id === itemId ? { ...m, active: !m.active } : m)),
    }));
  };

  const handleHireApplicant = (applicant: Applicant) => {
    setGameState(prev => {
      const newStaff = {
        id: `staff_${Date.now()}`,
        name: applicant.name,
        role: applicant.role,
        salary: applicant.expectedSalary,
        experienceLevel: applicant.experienceLevel,
        speed: applicant.speed,
        accuracy: applicant.accuracy,
        hospitality: applicant.hospitality,
        stamina: 85,
        stress: 10,
        satisfaction: 95,
        assignedShift: 'morning' as const,
        avatarColor: applicant.avatarColor,
        isWorking: true,
      };
      return {
        ...prev,
        staff: [...prev.staff, newStaff],
        applicants: prev.applicants.filter(a => a.id !== applicant.id),
      };
    });
  };

  const handleFireStaff = (staffId: string) => {
    soundEngine.playClick();
    setGameState(prev => ({
      ...prev,
      staff: prev.staff.filter(s => s.id !== staffId),
      selectedEntity: prev.selectedEntity?.id === staffId ? null : prev.selectedEntity,
    }));
  };

  const handleTrainStaff = (staffId: string, type: 'speed' | 'accuracy' | 'hospitality') => {
    const cost = 80;
    if (gameState.finances.cash < cost) return;
    soundEngine.playClick();
    setGameState(prev => ({
      ...prev,
      finances: { ...prev.finances, cash: prev.finances.cash - cost },
      staff: prev.staff.map(s => (s.id === staffId ? { ...s, trainingInProgress: { type, progress: 0 } } : s)),
    }));
  };

  const handleChangeShift = (staffId: string, shift: 'morning' | 'evening' | 'full') => {
    soundEngine.playClick();
    setGameState(prev => ({
      ...prev,
      staff: prev.staff.map(s => (s.id === staffId ? { ...s, assignedShift: shift } : s)),
    }));
  };

  const handleOrderStock = (ingredientId: string, amount: number) => {
    setGameState(prev => {
      const inv = prev.inventory.find(i => i.id === ingredientId);
      if (!inv) return prev;
      const cost = amount * inv.unitCost;
      if (prev.finances.cash < cost) return prev;
      soundEngine.playCashRegister();
      return {
        ...prev,
        finances: { ...prev.finances, cash: prev.finances.cash - cost },
        inventory: prev.inventory.map(i => (i.id === ingredientId ? { ...i, stock: Math.min(i.maxStock, i.stock + amount) } : i)),
      };
    });
  };

  const handleUpdateAutoReorder = (ingredientId: string, threshold: number, amount: number) => {
    setGameState(prev => ({
      ...prev,
      inventory: prev.inventory.map(i => (i.id === ingredientId ? { ...i, autoReorderThreshold: threshold, autoReorderAmount: amount } : i)),
    }));
  };

  const handleBuyTable = (type: 'table_2p' | 'table_4p' | 'counter_bar') => {
    const costs = { table_2p: 180, table_4p: 320, counter_bar: 260 };
    const seats = { table_2p: 2, table_4p: 4, counter_bar: 3 };
    const cost = costs[type];
    if (gameState.finances.cash < cost) return;

    soundEngine.playCashRegister();
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    const index = gameState.tables.length;
    const x = -3.5 + (index % 3) * 3.2;
    const z = -2.5 + Math.floor(index / 3) * 2.8;

    const newTbl = {
      id: `tbl_${Date.now()}`,
      type,
      seats: seats[type],
      cost,
      ambianceBonus: 8,
      x,
      z,
      occupied: false,
      currentCustomerIds: [],
    };
    setGameState(prev => ({
      ...prev,
      finances: { ...prev.finances, cash: prev.finances.cash - cost },
      tables: [...prev.tables, newTbl],
    }));
  };

  const handleUpgradeEquipment = (equipId: string) => {
    setGameState(prev => {
      const eq = prev.equipment.find(e => e.id === equipId);
      if (!eq) return prev;
      const cost = eq.tier * 800;
      if (prev.finances.cash < cost) return prev;

      soundEngine.playCashRegister();
      confetti({ particleCount: 40, spread: 70, origin: { y: 0.8 } });
      return {
        ...prev,
        finances: { ...prev.finances, cash: prev.finances.cash - cost },
        equipment: prev.equipment.map(e =>
          e.id === equipId
            ? { ...e, tier: e.tier + 1, capacityPerMin: Number((e.capacityPerMin * 1.35).toFixed(1)), efficiencyBonus: e.efficiencyBonus + 12, condition: 100 }
            : e
        ),
      };
    });
  };

  const handleToggleCampaign = (campaignId: string) => {
    setGameState(prev => ({
      ...prev,
      marketing: prev.marketing.map(m => (m.id === campaignId ? { ...m, active: !m.active } : m)),
    }));
  };

  const handleRelocateDistrict = (districtId: DistrictId) => {
    const dist = gameState.districts[districtId];
    if (!dist) return;

    if (!dist.unlocked) {
      if (gameState.finances.cash < dist.unlockCost) return;
      soundEngine.playCashRegister();
      confetti({ particleCount: 70, spread: 90, origin: { y: 0.6 } });
      setGameState(prev => ({
        ...prev,
        finances: { ...prev.finances, cash: prev.finances.cash - dist.unlockCost },
        districts: { ...prev.districts, [districtId]: { ...dist, unlocked: true } },
        currentDistrict: districtId,
      }));
    } else {
      soundEngine.playClick();
      setGameState(prev => ({ ...prev, currentDistrict: districtId }));
    }
  };

  // Phase 2 Operations & Logistics Handlers
  const operationsActions = useOperationsActions(gameState, setGameState);

  // Phase 3 Corporate Handlers delegated to useCorporateActions
  const corporateActions = useCorporateActions(gameState, setGameState);

  // Phase 5 Culinary R&D Lab & Michelin Handlers
  const handleStartResearch = (projectId: string) => {
    const project = gameState.culinaryLab.projects.find(p => p.id === projectId);
    if (!project || project.isUnlocked) return;
    if (gameState.finances.cash < project.researchCost) return;

    soundEngine.playCashRegister();
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
    setGameState(prev => ({
      ...prev,
      finances: { ...prev.finances, cash: prev.finances.cash - project.researchCost },
      culinaryLab: {
        ...prev.culinaryLab,
        activeProjectId: projectId,
        projects: prev.culinaryLab.projects.map(p =>
          p.id === projectId ? { ...p, isResearching: true } : { ...p, isResearching: false }
        ),
      },
    }));
  };

  const handleUpgradeCulinaryLab = () => {
    const cost = gameState.culinaryLab.labTier * 2800;
    if (gameState.finances.cash < cost || gameState.culinaryLab.labTier >= 3) return;

    soundEngine.playCashRegister();
    confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
    setGameState(prev => ({
      ...prev,
      finances: { ...prev.finances, cash: prev.finances.cash - cost },
      culinaryLab: {
        ...prev.culinaryLab,
        isLabEquipped: true,
        labTier: prev.culinaryLab.labTier + 1,
        labEfficiencyBonus: prev.culinaryLab.labEfficiencyBonus + 25,
      },
    }));
  };

  const handleRequestMichelinAudit = () => {
    const auditCost = 500;
    if (gameState.finances.cash < auditCost) return;

    soundEngine.playKitchenBell();
    const result = evaluateMichelinAudit(gameState);

    if (result.stars > 0) {
      confetti({ particleCount: 140, spread: 130, origin: { y: 0.4 } });
      soundEngine.playCashRegister();
    }

    setGameState(prev => ({
      ...prev,
      finances: { ...prev.finances, cash: prev.finances.cash - auditCost },
      reputation: result.stars > 0 ? Math.min(100, prev.reputation + result.stars * 5) : prev.reputation,
      corporate: {
        ...prev.corporate,
        enterpriseValuation: prev.corporate.enterpriseValuation + (result.stars * 35000),
      },
      culinaryLab: {
        ...prev.culinaryLab,
        michelin: {
          stars: result.stars,
          lastInspectionDay: prev.currentDay,
          inspectorPending: false,
          auditScore: result.score,
          feedbackReport: result.report,
        },
      },
    }));
  };

  const handleTrainMasterChef = (staffId: string) => {
    const cost = 1200;
    if (gameState.finances.cash < cost) return;

    soundEngine.playCashRegister();
    confetti({ particleCount: 75, spread: 90, origin: { y: 0.6 } });
    setGameState(prev => ({
      ...prev,
      finances: { ...prev.finances, cash: prev.finances.cash - cost },
      staff: prev.staff.map(s =>
        s.id === staffId
          ? {
              ...s,
              experienceLevel: 5,
              speed: Math.min(100, s.speed + 15),
              accuracy: 98,
              hospitality: Math.min(100, s.hospitality + 10),
            }
          : s
      ),
      culinaryLab: {
        ...prev.culinaryLab,
        masterChefCount: prev.culinaryLab.masterChefCount + 1,
      },
    }));
  };

  return {
    handleSetSpeed,
    handleTakeLoan,
    handleUpdatePrice,
    handleToggleActiveDish,
    handleHireApplicant,
    handleFireStaff,
    handleTrainStaff,
    handleChangeShift,
    handleOrderStock,
    handleUpdateAutoReorder,
    handleBuyTable,
    handleUpgradeEquipment,
    handleToggleCampaign,
    handleRelocateDistrict,
    handleStartResearch,
    handleUpgradeCulinaryLab,
    handleRequestMichelinAudit,
    handleTrainMasterChef,
    ...operationsActions,
    ...corporateActions,
  };
}
