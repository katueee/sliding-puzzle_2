import { useState } from 'react';
import type { GridSize } from './types/game';
import { useGameState } from './hooks/useGameState';
import PuzzleBoard from './components/PuzzleBoard';
import GameHeader from './components/GameHeader';
import ActionButtons from './components/ActionButtons';
import PreviewModal from './components/PreviewModal';
import MiniPreview from './components/MiniPreview';
import ClearOverlay from './components/ClearOverlay';
import Tutorial from './components/Tutorial';
import './App.css';

const BG_DECORATIONS = [
  { emoji: '🌸', top: '8%', left: '5%', delay: '0s' },
  { emoji: '⭐', top: '15%', left: '85%', delay: '1s' },
  { emoji: '🌈', top: '75%', left: '8%', delay: '2s' },
  { emoji: '🦋', top: '80%', left: '90%', delay: '3s' },
  { emoji: '☁️', top: '5%', left: '45%', delay: '1.5s' },
  { emoji: '💫', top: '60%', left: '92%', delay: '0.5s' },
];

function getPuzzleImageUrl(gridSize: GridSize): string {
  const base = import.meta.env.BASE_URL;
  return gridSize === 3
    ? `${base}images/puzzle_3x3.png`
    : `${base}images/puzzle_4x4.png`;
}

export default function App() {
  const {
    state,
    movePiece,
    shuffle,
    restart,
    setGridSize,
    toggleSound,
    dismissTutorial,
  } = useGameState();

  const [showPreview, setShowPreview] = useState(false);
  const imageUrl = getPuzzleImageUrl(state.gridSize);

  return (
    <div className="app">
      {BG_DECORATIONS.map((d, i) => (
        <span
          key={i}
          className="bg-decoration"
          style={{
            top: d.top,
            left: d.left,
            animationDelay: d.delay,
          }}
        >
          {d.emoji}
        </span>
      ))}

      <h1 className="app-title">スライドパズル</h1>

      <GameHeader moves={state.moves} elapsed={state.elapsed} />

      <div className={`puzzle-wrapper ${state.status === 'cleared' ? 'puzzle-cleared' : ''}`}>
        <PuzzleBoard
          board={state.board}
          gridSize={state.gridSize}
          imageUrl={imageUrl}
          onMovePiece={movePiece}
          disabled={state.status === 'cleared'}
        />
      </div>

      <ActionButtons
        gridSize={state.gridSize}
        soundEnabled={state.soundEnabled}
        onShuffle={shuffle}
        onSetGridSize={setGridSize}
        onToggleSound={toggleSound}
        onShowPreview={() => setShowPreview(true)}
      />

      <MiniPreview imageUrl={imageUrl} onClick={() => setShowPreview(true)} />

      {showPreview && (
        <PreviewModal imageUrl={imageUrl} onClose={() => setShowPreview(false)} />
      )}

      {state.status === 'cleared' && (
        <ClearOverlay
          moves={state.moves}
          elapsed={state.elapsed}
          gridSize={state.gridSize}
          onRestart={restart}
        />
      )}

      {state.showTutorial && <Tutorial onDismiss={dismissTutorial} />}
    </div>
  );
}
