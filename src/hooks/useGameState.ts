import { useReducer, useEffect, useCallback } from 'react';
import type { GameState, GameAction, GridSize } from '../types/game';
import { shuffleBoard, slidePiecesTo, isSolved, getSlidingIndices } from '../utils/puzzle';
import { loadSettings, saveSettings, updateBestScore } from '../utils/storage';
import { playMoveSound, playClearSound } from '../utils/sound';

function createInitialState(): GameState {
  const settings = loadSettings();
  const gridSize = settings.lastGridSize;
  return {
    gridSize,
    board: shuffleBoard(gridSize),
    moves: 0,
    elapsed: 0,
    status: 'idle',
    soundEnabled: settings.soundEnabled,
    showTutorial: !settings.tutorialSeen,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'MOVE_PIECE': {
      if (state.status === 'cleared') return state;
      const indices = getSlidingIndices(state.board, action.index, state.gridSize);
      if (indices.length === 0) return state;

      const newBoard = slidePiecesTo(state.board, action.index, state.gridSize);
      const newMoves = state.moves + 1;
      const newStatus = isSolved(newBoard, state.gridSize) ? 'cleared' : 'playing';

      if (newStatus === 'cleared') {
        updateBestScore(state.gridSize, newMoves, state.elapsed);
        if (state.soundEnabled) playClearSound();
      } else {
        if (state.soundEnabled) playMoveSound();
      }

      return {
        ...state,
        board: newBoard,
        moves: newMoves,
        status: newStatus === 'cleared' ? 'cleared' : 'playing',
      };
    }
    case 'SHUFFLE':
      return {
        ...state,
        board: shuffleBoard(state.gridSize),
        moves: 0,
        elapsed: 0,
        status: 'idle',
      };
    case 'RESTART':
      return {
        ...state,
        board: shuffleBoard(state.gridSize),
        moves: 0,
        elapsed: 0,
        status: 'idle',
      };
    case 'SET_GRID_SIZE': {
      saveSettings({ lastGridSize: action.size });
      return {
        ...state,
        gridSize: action.size,
        board: shuffleBoard(action.size),
        moves: 0,
        elapsed: 0,
        status: 'idle',
      };
    }
    case 'TICK':
      if (state.status !== 'playing') return state;
      return { ...state, elapsed: state.elapsed + 1 };
    case 'TOGGLE_SOUND': {
      const newEnabled = !state.soundEnabled;
      saveSettings({ soundEnabled: newEnabled });
      return { ...state, soundEnabled: newEnabled };
    }
    case 'DISMISS_TUTORIAL':
      saveSettings({ tutorialSeen: true });
      return { ...state, showTutorial: false };
    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);

  useEffect(() => {
    if (state.status !== 'playing') return;
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(id);
  }, [state.status]);

  const movePiece = useCallback((index: number) => {
    dispatch({ type: 'MOVE_PIECE', index });
  }, []);

  const shuffle = useCallback(() => dispatch({ type: 'SHUFFLE' }), []);
  const restart = useCallback(() => dispatch({ type: 'RESTART' }), []);
  const setGridSize = useCallback((size: GridSize) => dispatch({ type: 'SET_GRID_SIZE', size }), []);
  const toggleSound = useCallback(() => dispatch({ type: 'TOGGLE_SOUND' }), []);
  const dismissTutorial = useCallback(() => dispatch({ type: 'DISMISS_TUTORIAL' }), []);

  return { state, movePiece, shuffle, restart, setGridSize, toggleSound, dismissTutorial };
}
