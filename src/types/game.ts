export type GridSize = 3 | 4;
export type PieceValue = number;
export type Board = PieceValue[];
export type GameStatus = 'idle' | 'playing' | 'cleared';

export interface GameState {
  gridSize: GridSize;
  board: Board;
  moves: number;
  elapsed: number;
  status: GameStatus;
  soundEnabled: boolean;
  showTutorial: boolean;
}

export interface SavedSettings {
  soundEnabled: boolean;
  lastGridSize: GridSize;
  bestMoves: Record<GridSize, number | null>;
  bestTime: Record<GridSize, number | null>;
  tutorialSeen: boolean;
}

export type GameAction =
  | { type: 'MOVE_PIECE'; index: number }
  | { type: 'SHUFFLE' }
  | { type: 'RESTART' }
  | { type: 'SET_GRID_SIZE'; size: GridSize }
  | { type: 'TICK' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'DISMISS_TUTORIAL' };
