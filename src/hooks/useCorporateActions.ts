import React from 'react';
import confetti from 'canvas-confetti';
import { GameState } from '../types/game';
import { soundEngine } from '../engine/soundEngine';
import { generateCandidateFranchisee } from '../engine/corporateEngine';
import { INITIAL_GAME_STATE } from '../data/gameStateSeed';

export function useCorporateActions(
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
) {
  const handleFormHoldings = () => {
    const cost = 6000;
    if (gameState.finances.cash < cost) return;
    soundEngine.playCashRegister();
    confetti({ particleCount: 80, spread: 100, origin: { y: 0.5 } });
    setGameState(prev => ({
      ...prev,
      finances: { ...prev.finances, cash: prev.finances.cash - cost },
      corporate: {
        ...prev.corporate,
        isHoldingsFormed: true,
        enterpriseValuation: prev.corporate.enterpriseValuation + 25000,
      },
    }));
  };

  const handleSignFranchisee = () => {
    const upfrontFee = gameState.franchise.initialFee;
    const newUnit = generateCandidateFranchisee(gameState);
    soundEngine.playCashRegister();
    confetti({ particleCount: 90, spread: 110, origin: { y: 0.6 } });
    setGameState(prev => ({
      ...prev,
      finances: { ...prev.finances, cash: prev.finances.cash + upfrontFee },
      franchise: {
        ...prev.franchise,
        units: [...prev.franchise.units, newUnit],
      },
    }));
  };

  const handleAuditFranchisee = (unitId: string) => {
    const cost = 300;
    if (gameState.finances.cash < cost) return;
    soundEngine.playClick();
    setGameState(prev => ({
      ...prev,
      finances: { ...prev.finances, cash: prev.finances.cash - cost },
      reputation: Math.min(100, prev.reputation + 1.5),
      franchise: {
        ...prev.franchise,
        units: prev.franchise.units.map(u => (u.id === unitId ? { ...u, auditScore: 98, status: 'active' } : u)),
      },
    }));
  };

  const handleAcquireCompetitor = (competitorId: string, cost: number) => {
    if (gameState.finances.cash < cost) return;
    soundEngine.playCashRegister();
    confetti({ particleCount: 120, spread: 120, origin: { y: 0.5 } });
    setGameState(prev => ({
      ...prev,
      finances: { ...prev.finances, cash: prev.finances.cash - cost },
      brandAwareness: Math.min(100, prev.brandAwareness + 18),
      reputation: Math.min(100, prev.reputation + 6),
      corporate: {
        ...prev.corporate,
        acquiredCompetitorIds: [...prev.corporate.acquiredCompetitorIds, competitorId],
        enterpriseValuation: prev.corporate.enterpriseValuation + cost * 1.5,
      },
    }));
  };

  const handleLaunchIpo = () => {
    const capitalRaised = Math.round(gameState.corporate.enterpriseValuation * 0.25);
    soundEngine.playCashRegister();
    confetti({ particleCount: 150, spread: 140, origin: { y: 0.4 } });
    setGameState(prev => ({
      ...prev,
      finances: { ...prev.finances, cash: prev.finances.cash + capitalRaised },
      corporate: {
        ...prev.corporate,
        isIpoListed: true,
        publicFloatPct: 25,
      },
    }));
  };

  const handleRestructureDebt = () => {
    setGameState(prev => ({
      ...prev,
      finances: { ...prev.finances, cash: 1000 },
      reputation: Math.max(25, prev.reputation - 18),
      equipment: prev.equipment.slice(0, Math.max(2, prev.equipment.length - 1)),
      isBankrupt: false,
    }));
  };

  const handleRestartGame = () => {
    setGameState(INITIAL_GAME_STATE);
  };

  return {
    handleFormHoldings,
    handleSignFranchisee,
    handleAuditFranchisee,
    handleAcquireCompetitor,
    handleLaunchIpo,
    handleRestructureDebt,
    handleRestartGame,
  };
}
