import styles from './GameHeader.module.css';

interface Props {
  moves: number;
  elapsed: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function GameHeader({ moves, elapsed }: Props) {
  return (
    <div className={styles.header}>
      <div className={styles.stat}>
        <span className={styles.label}>てすう</span>
        <span className={styles.value}>{moves}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>じかん</span>
        <span className={styles.value}>{formatTime(elapsed)}</span>
      </div>
    </div>
  );
}
