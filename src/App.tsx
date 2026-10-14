/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { GameState, InspectableEntity } from './types/game';
import { INITIAL_GAME_STATE } from './data/gameStateSeed';
import { advanceSimulationTick } from './engine/simulationEngine';
import { CityScene3D } from './scene/CityScene3D';
import { soundEngine } from './engine/soundEngine';
import { TopBar } from './components/TopBar';
import { ViewControls3D } from './components/ViewControls3D';
import { InspectorModal } from './components/InspectorModal';
import { EventBanner } from './components/EventBanner';
import { ManagementPanel, ManagementTabType } from './components/ManagementPanel';
import { BankruptcyModal } from './components/BankruptcyModal';
import { useGameActions } from './hooks/useGameActions';
import { saveGameState, loadGameState } from './engine/saveSystem';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = loadGameState();
    return saved || INITIAL_GAME_STATE;
  });
  const [activeTab, setActiveTab] = useState<ManagementTabType>('dashboard');
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);
  const [cameraPreset, setCameraPreset] = useState<'overview' | 'interior' | 'street'>('interior');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<CityScene3D | null>(null);
  const stateRef = useRef<GameState>(gameState);
  stateRef.current = gameState;

  // Actions hook for clean modular architecture
  const actions = useGameActions(gameState, setGameState);

  const handleManualSave = () => {
    saveGameState(stateRef.current);
    soundEngine.playClick();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Initialize 3D City Scene
  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const scene = new CityScene3D(canvasContainerRef.current, (entity: InspectableEntity) => {
      soundEngine.playClick();
      setGameState(prev => ({ ...prev, selectedEntity: entity }));
    });
    sceneRef.current = scene;

    return () => {
      scene.destroy();
      sceneRef.current = null;
    };
  }, []);

  // Main Simulation Loop
  useEffect(() => {
    let lastTime = performance.now();
    let animId: number;

    const tick = (time: number) => {
      const deltaSec = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      const currentState = stateRef.current;
      const nextState = advanceSimulationTick(currentState, deltaSec);
      setGameState(nextState);

      if (sceneRef.current) {
        sceneRef.current.updateState(nextState, deltaSec);
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleSetCameraPreset = (preset: 'overview' | 'interior' | 'street') => {
    soundEngine.playClick();
    setCameraPreset(preset);
    sceneRef.current?.setCameraPreset(preset);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans">
      {/* 3D WebGL Canvas Viewport */}
      <div ref={canvasContainerRef} className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing" />

      {/* Top Status & Controls Header */}
      <TopBar
        state={gameState}
        onSetSpeed={actions.handleSetSpeed}
        onOpenGDD={() => {
          setActiveTab('gdd');
          setIsPanelOpen(true);
        }}
        onSaveGame={handleManualSave}
        isSaved={isSaved}
      />

      {/* 3D Camera Preset Widget */}
      <ViewControls3D
        onSetPreset={handleSetCameraPreset}
        activePreset={cameraPreset}
      />

      {/* Breaking World Events Banner */}
      <EventBanner
        events={gameState.activeEvents}
        onDismiss={(id) => {
          soundEngine.playClick();
          setGameState(prev => ({ ...prev, activeEvents: prev.activeEvents.filter(e => e.id !== id) }));
        }}
      />

      {/* Entity Details Inspector Modal */}
      <InspectorModal
        entity={gameState.selectedEntity}
        gameState={gameState}
        onClose={() => setGameState(prev => ({ ...prev, selectedEntity: null }))}
        onTrainStaff={actions.handleTrainStaff}
        onFireStaff={actions.handleFireStaff}
      />

      {/* Insolvency & Bankruptcy Notice Modal */}
      <BankruptcyModal
        isOpen={gameState.isBankrupt}
        debtAmount={gameState.finances.cash}
        onRestructure={actions.handleRestructureDebt}
        onRestart={actions.handleRestartGame}
      />

      {/* Modern Collapsible Management Dock & Tabs */}
      <ManagementPanel
        state={gameState}
        activeTab={activeTab}
        isOpen={isPanelOpen}
        onSelectTab={setActiveTab}
        onToggleOpen={() => setIsPanelOpen(open => !open)}
        onTakeLoan={actions.handleTakeLoan}
        onUpdatePrice={actions.handleUpdatePrice}
        onToggleActiveDish={actions.handleToggleActiveDish}
        onHireApplicant={actions.handleHireApplicant}
        onFireStaff={actions.handleFireStaff}
        onTrainStaff={actions.handleTrainStaff}
        onChangeShift={actions.handleChangeShift}
        onOrderStock={actions.handleOrderStock}
        onUpdateAutoReorder={actions.handleUpdateAutoReorder}
        onBuyTable={actions.handleBuyTable}
        onUpgradeEquipment={actions.handleUpgradeEquipment}
        onToggleCampaign={actions.handleToggleCampaign}
        onRelocateDistrict={actions.handleRelocateDistrict}
        onToggleDeliveryPlatform={actions.handleToggleDeliveryPlatform}
        onBuyScooter={actions.handleBuyScooter}
        onUnlockCommissary={actions.handleUnlockCommissary}
        onUpgradeCommissary={actions.handleUpgradeCommissary}
        onOpenBranch={actions.handleOpenBranch}
        onSetProximityTier={actions.handleSetProximityTier}
        onToggleExpressPickup={actions.handleToggleExpressPickup}
        onToggleAcousticPanels={actions.handleToggleAcousticPanels}
        onFormHoldings={actions.handleFormHoldings}
        onSignFranchisee={actions.handleSignFranchisee}
        onAuditFranchisee={actions.handleAuditFranchisee}
        onAcquireCompetitor={actions.handleAcquireCompetitor}
        onLaunchIpo={actions.handleLaunchIpo}
        onStartResearch={actions.handleStartResearch}
        onUpgradeLab={actions.handleUpgradeCulinaryLab}
        onRequestAudit={actions.handleRequestMichelinAudit}
        onTrainMasterChef={actions.handleTrainMasterChef}
        onImportState={(newState) => setGameState(newState)}
      />
    </div>
  );
}
