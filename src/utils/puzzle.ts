import type { Board, GridSize } from '../types/game';

export function createSolvedBoard(size: GridSize): Board {
  const total = size * size;
  const board: Board = [];
  for (let i = 1; i < total; i++) board.push(i);
  board.push(0);
  return board;
}

export function isSolved(board: Board, size: GridSize): boolean {
  const total = size * size;
  for (let i = 0; i < total - 1; i++) {
    if (board[i] !== i + 1) return false;
  }
  return board[total - 1] === 0;
}

export function getEmptyIndex(board: Board): number {
  return board.indexOf(0);
}

export function getSlidingIndices(
  board: Board,
  touchedIndex: number,
  size: GridSize
): number[] {
  const emptyIdx = getEmptyIndex(board);
  if (touchedIndex === emptyIdx) return [];

  const touchedRow = Math.floor(touchedIndex / size);
  const touchedCol = touchedIndex % size;
  const emptyRow = Math.floor(emptyIdx / size);
  const emptyCol = emptyIdx % size;

  const indices: number[] = [];

  if (touchedRow === emptyRow) {
    const step = touchedCol < emptyCol ? 1 : -1;
    for (let c = touchedCol; c !== emptyCol; c += step) {
      indices.push(touchedRow * size + c);
    }
  } else if (touchedCol === emptyCol) {
    const step = touchedRow < emptyRow ? 1 : -1;
    for (let r = touchedRow; r !== emptyRow; r += step) {
      indices.push(r * size + touchedCol);
    }
  }

  return indices;
}

export function slidePiecesTo(
  board: Board,
  touchedIndex: number,
  size: GridSize
): Board {
  const indices = getSlidingIndices(board, touchedIndex, size);
  if (indices.length === 0) return board;

  const newBoard = [...board];
  const emptyIdx = getEmptyIndex(newBoard);

  const touchedRow = Math.floor(touchedIndex / size);
  const emptyRow = Math.floor(emptyIdx / size);
  const touchedCol = touchedIndex % size;
  const emptyCol = emptyIdx % size;

  if (touchedRow === emptyRow) {
    const step = emptyCol < touchedCol ? 1 : -1;
    for (let c = emptyCol; c !== touchedCol; c += step) {
      newBoard[touchedRow * size + c] = newBoard[touchedRow * size + c + step];
    }
  } else {
    const step = emptyRow < touchedRow ? 1 : -1;
    for (let r = emptyRow; r !== touchedRow; r += step) {
      newBoard[r * size + touchedCol] = newBoard[(r + step) * size + touchedCol];
    }
  }

  newBoard[touchedIndex] = 0;
  return newBoard;
}

function countInversions(board: Board): number {
  let inversions = 0;
  const filtered = board.filter((v) => v !== 0);
  for (let i = 0; i < filtered.length; i++) {
    for (let j = i + 1; j < filtered.length; j++) {
      if (filtered[i] > filtered[j]) inversions++;
    }
  }
  return inversions;
}

export function isSolvable(board: Board, size: GridSize): boolean {
  const inversions = countInversions(board);
  if (size % 2 === 1) {
    return inversions % 2 === 0;
  } else {
    const emptyRow = Math.floor(getEmptyIndex(board) / size);
    const fromBottom = size - emptyRow;
    return (inversions + fromBottom) % 2 === 1;
  }
}

export function shuffleBoard(size: GridSize): Board {
  const total = size * size;
  let board: Board;

  do {
    board = Array.from({ length: total }, (_, i) => i === total - 1 ? 0 : i + 1);
    for (let i = total - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [board[i], board[j]] = [board[j], board[i]];
    }
  } while (!isSolvable(board, size) || isSolved(board, size));

  return board;
}
