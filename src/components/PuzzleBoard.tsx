import { useRef, useCallback } from 'react';
import type { Board, GridSize } from '../types/game';
import { getEmptyIndex, getSlidingIndices } from '../utils/puzzle';
import styles from './PuzzleBoard.module.css';

interface Props {
  board: Board;
  gridSize: GridSize;
  imageUrl: string;
  onMovePiece: (index: number) => void;
  disabled?: boolean;
}

export default function PuzzleBoard({ board, gridSize, imageUrl, onMovePiece, disabled }: Props) {
  const animatingRef = useRef(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    startX: number;
    startY: number;
    index: number;
    direction: 'x' | 'y' | null;
  } | null>(null);

  const boardSize = Math.min(window.innerWidth - 40, 400);
  const pieceSize = (boardSize - (gridSize - 1) * 4 - 16) / gridSize;

  const handleClick = useCallback(
    (index: number) => {
      if (disabled || animatingRef.current) return;
      if (board[index] === 0) return;
      const indices = getSlidingIndices(board, index, gridSize);
      if (indices.length === 0) return;
      animatingRef.current = true;
      onMovePiece(index);
      setTimeout(() => {
        animatingRef.current = false;
      }, 150);
    },
    [board, gridSize, onMovePiece, disabled]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent, index: number) => {
      if (disabled || animatingRef.current) return;
      if (board[index] === 0) return;
      const touch = e.touches[0];
      dragState.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        index,
        direction: null,
      };
    },
    [board, disabled]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!dragState.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - dragState.current.startX;
      const dy = touch.clientY - dragState.current.startY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance >= 5) {
        const emptyIdx = getEmptyIndex(board);
        const emptyRow = Math.floor(emptyIdx / gridSize);
        const emptyCol = emptyIdx % gridSize;
        const touchedRow = Math.floor(dragState.current.index / gridSize);
        const touchedCol = dragState.current.index % gridSize;

        let targetIndex = dragState.current.index;

        if (Math.abs(dx) > Math.abs(dy)) {
          if (touchedRow === emptyRow) {
            targetIndex = dragState.current.index;
          }
        } else {
          if (touchedCol === emptyCol) {
            targetIndex = dragState.current.index;
          }
        }

        handleClick(targetIndex);
      }

      dragState.current = null;
    },
    [board, gridSize, handleClick]
  );

  return (
    <div
      ref={boardRef}
      className={styles.board}
      style={{
        gridTemplateColumns: `repeat(${gridSize}, ${pieceSize}px)`,
        gridTemplateRows: `repeat(${gridSize}, ${pieceSize}px)`,
        width: boardSize,
      }}
    >
      {board.map((value, index) => {
        if (value === 0) {
          return <div key={index} className={styles.empty} />;
        }

        const origRow = Math.floor((value - 1) / gridSize);
        const origCol = (value - 1) % gridSize;

        return (
          <button
            key={index}
            className={styles.piece}
            onClick={() => handleClick(index)}
            onTouchStart={(e) => handleTouchStart(e, index)}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={imageUrl}
              alt=""
              className={styles.pieceImg}
              style={{
                width: `${gridSize * 100}%`,
                height: `${gridSize * 100}%`,
                left: `${-origCol * 100}%`,
                top: `${-origRow * 100}%`,
              }}
              draggable={false}
            />
            <span className={styles.pieceNumber}>{value}</span>
          </button>
        );
      })}
    </div>
  );
}
