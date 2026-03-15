import type { GridSize } from '../types/game';
import styles from './ActionButtons.module.css';

interface Props {
  gridSize: GridSize;
  soundEnabled: boolean;
  onShuffle: () => void;
  onSetGridSize: (size: GridSize) => void;
  onToggleSound: () => void;
  onShowPreview: () => void;
}

export default function ActionButtons({
  gridSize,
  soundEnabled,
  onShuffle,
  onSetGridSize,
  onToggleSound,
  onShowPreview,
}: Props) {
  return (
    <div className={styles.container}>
      <button className={`${styles.button} ${styles.primary}`} onClick={onShuffle}>
        シャッフル
      </button>
      <button className={`${styles.button} ${styles.secondary}`} onClick={onShowPreview}>
        みほん
      </button>
      <div className={styles.gridToggle}>
        {([3, 4] as GridSize[]).map((size) => (
          <button
            key={size}
            className={`${styles.gridButton} ${gridSize === size ? styles.gridButtonActive : ''}`}
            onClick={() => onSetGridSize(size)}
          >
            {size}x{size}
          </button>
        ))}
      </div>
      <button className={styles.soundButton} onClick={onToggleSound}>
        {soundEnabled ? '🔊' : '🔇'}
      </button>
    </div>
  );
}
