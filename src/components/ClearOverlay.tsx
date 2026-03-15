import { useMemo } from 'react';
import type { GridSize } from '../types/game';
import styles from './ClearOverlay.module.css';

interface Props {
  moves: number;
  elapsed: number;
  gridSize: GridSize;
  onRestart: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) return `${m}ぷん${s}びょう`;
  return `${s}びょう`;
}

function getStarCount(moves: number, gridSize: GridSize): number {
  const thresholds = gridSize === 3 ? [15, 30, 50] : [40, 80, 120];
  if (moves <= thresholds[0]) return 3;
  if (moves <= thresholds[1]) return 2;
  return 1;
}

function generateConfetti(count: number) {
  const colors = ['#ff6b9d', '#c06cff', '#6cb4ff', '#ffd93d', '#6bff9d', '#ff9d6b'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: colors[i % colors.length],
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
  }));
}

function generateParticles(count: number) {
  const emojis = ['🌟', '⭐', '✨', '🎉', '🎊', '💖', '🌈', '🦋'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: 20 + Math.random() * 60,
    emoji: emojis[i % emojis.length],
    delay: Math.random() * 2,
  }));
}

export default function ClearOverlay({ moves, elapsed, gridSize, onRestart }: Props) {
  const starCount = getStarCount(moves, gridSize);
  const confetti = useMemo(() => generateConfetti(30), []);
  const particles = useMemo(() => generateParticles(12), []);

  return (
    <div className={styles.overlay}>
      {confetti.map((c) => (
        <div
          key={c.id}
          className={styles.confetti}
          style={{
            left: `${c.left}%`,
            backgroundColor: c.color,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
          }}
        />
      ))}
      {particles.map((p) => (
        <span
          key={p.id}
          className={styles.particle}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.emoji}
        </span>
      ))}
      <div className={styles.content}>
        <div className={styles.title}>できたね！すっごーい！！</div>
        <div className={styles.stars}>
          {'★'.repeat(starCount)}
          {'☆'.repeat(3 - starCount)}
        </div>
        <div className={styles.stats}>
          {moves}てすう ／ {formatTime(elapsed)}
        </div>
        <div className={styles.buttons}>
          <button className={styles.retryButton} onClick={onRestart}>
            もういっかい！
          </button>
        </div>
      </div>
    </div>
  );
}
