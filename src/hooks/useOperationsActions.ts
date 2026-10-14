import React from 'react';
import confetti from 'canvas-confetti';
import { GameState } from '../types/game';
import { soundEngine } from '../engine/soundEngine';

export function useOperationsActions(
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
) {
  const handleToggleDeliveryPlatform = (platformId: string) => {
    setGameState(prev => ({
      ...prev,
      deliveryPlatforms: prev.deliveryPlatforms.map(p => (p.id === platformId ? { ...p, active: !p.active } : p)),
    }));
  };

  const handleBuyScooter = () => {
    const cost = 450;
    if (gameState.finances.cash < cost) return;
    soundEngine.playCashRegister();
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
    setGameState(prev => ({
      ...prev,
      finances: { ...prev.finances, cash: prev.finances.cash - cost },
      ownedScooters: prev.ownedScooters + 1,
    }));
  };

  const handleUnlockCommissary = () => {
    const cost = 4200;
    if (gameState.finances.cash < cost) return;
    soundEngine.playCashRegister();
    confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
    setGameState(prev => ({
      ...prev,
      finances: { ...prev.finances, cash: prev.finances.cash - cost },
      commissary: { ...prev.commissary, isUnlocked: true },
    }));
  };

  const handleUpgradeCommissary = () => {
    const cost = gameState.commissary.tier * 3500;
    if (gameState.finances.cash < cost || gameState.commissary.tier >= 3) return;
    soundEngine.playCashRegister();
    confetti({ particleCount: 50, spread: 75, origin: { y: 0.6 } });
    setGameState(prev => ({
      ...prev,
      finances: { ...prev.finances, cash: prev.finances.cash - cost },
      commissary: {
        ...prev.commissary,
        tier: prev.commissary.tier + 1,
        cogsReductionPct: prev.commissary.cogsReductionPct + 5,
        dailyPrepCapacity: prev.commissary.dailyPrepCapacity + 60,
      },
    }));
  };

  const handleOpenBranch = (branchId: string) => {
    const cost = 5000;
    if (gameState.finances.cash < cost) return;
    soundEngine.playCashRegister();
    confetti({ particleCount: 80, spread: 100, origin: { y: 0.6 } });
    setGameState(prev => ({
      ...prev,
      finances: { ...prev.finances, cash: prev.finances.cash - cost },
      branches: prev.branches.map(b => (b.id === branchId ? { ...b, status: 'operational', dailyRevenue: 850, dailyProfit: 280, staffCount: 4 } : b)),
    }));
  };

  const handleSetProximityTier = (tier: number) => {
    const costs = [0, 0, 600, 1200];
    const cost = costs[tier] || 0;
    if (gameState.finances.cash < cost) return;
    soundEngine.playClick();
    setGameState(prev => ({
      ...prev,
      finances: { ...prev.finances, cash: prev.finances.cash - cost },
      layoutSettings: { ...prev.layoutSettings, kitchenProximityTier: tier },
    }));
  };

  const handleToggleExpressPickup = () => {
    const cost = 450;
    if (!gameState.layoutSettings.expressPickupWindow && gameState.finances.cash < cost) return;
    soundEngine.playClick();
    setGameState(prev => ({
      ...prev,
      finances: { ...prev.finances, cash: prev.layoutSettings.expressPickupWindow ? prev.finances.cash : prev.finances.cash - cost },
      layoutSettings: { ...prev.layoutSettings, expressPickupWindow: !prev.layoutSettings.expressPickupWindow },
    }));
  };

  const handleToggleAcousticPanels = () => {
    const cost = 380;
    if (!gameState.layoutSettings.acousticWallPanels && gameState.finances.cash < cost) return;
    soundEngine.playClick();
    setGameState(prev => ({
      ...prev,
      finances: { ...prev.finances, cash: prev.layoutSettings.acousticWallPanels ? prev.finances.cash : prev.finances.cash - cost },
      layoutSettings: { ...prev.layoutSettings, acousticWallPanels: !prev.layoutSettings.acousticWallPanels },
    }));
  };

  return {
    handleToggleDeliveryPlatform,
    handleBuyScooter,
    handleUnlockCommissary,
    handleUpgradeCommissary,
    handleOpenBranch,
    handleSetProximityTier,
    handleToggleExpressPickup,
    handleToggleAcousticPanels,
  };
}
