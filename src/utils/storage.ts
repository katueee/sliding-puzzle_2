import type { GridSize, SavedSettings } from '../types/game';

const STORAGE_KEY = 'sliding-puzzle-settings';

const defaultSettings: SavedSettings = {
  soundEnabled: true,
  lastGridSize: 3,
  bestMoves: { 3: null, 4: null },
  bestTime: { 3: null, 4: null },
  tutorialSeen: false,
};

export function loadSettings(): SavedSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultSettings };
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return { ...defaultSettings };
  }
}

export function saveSettings(settings: Partial<SavedSettings>): void {
  try {
    const current = loadSettings();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...settings }));
  } catch {
    // ignore
  }
}

export function updateBestScore(
  gridSize: GridSize,
  moves: number,
  time: number
): { newBestMoves: boolean; newBestTime: boolean } {
  const settings = loadSettings();
  let newBestMoves = false;
  let newBestTime = false;

  if (settings.bestMoves[gridSize] === null || moves < settings.bestMoves[gridSize]!) {
    settings.bestMoves[gridSize] = moves;
    newBestMoves = true;
  }

  if (settings.bestTime[gridSize] === null || time < settings.bestTime[gridSize]!) {
    settings.bestTime[gridSize] = time;
    newBestTime = true;
  }

  saveSettings(settings);
  return { newBestMoves, newBestTime };
}
