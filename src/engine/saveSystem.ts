import { GameState } from '../types/game';
import { INITIAL_GAME_STATE } from '../data/gameStateSeed';

const SAVE_KEY = 'bistro_tycoon_save_v1';

export function saveGameState(state: GameState): boolean {
  try {
    // Exclude selectedEntity to keep payload clean
    const payload = {
      ...state,
      selectedEntity: null,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.error('Failed to save game state', err);
    return false;
  }
}

export function loadGameState(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    if (!parsed || !parsed.companyName || typeof parsed.finances?.cash !== 'number') {
      return null;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to parse save game state', err);
    return null;
  }
}

export function clearSavedGame(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (err) {
    console.error('Failed to clear save', err);
  }
}
