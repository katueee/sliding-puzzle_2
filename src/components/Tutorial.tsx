import styles from './Tutorial.module.css';

interface Props {
  onDismiss: () => void;
}

export default function Tutorial({ onDismiss }: Props) {
  return (
    <div className={styles.overlay} onClick={onDismiss}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.emoji}>🧩</div>
        <div className={styles.title}>スライドパズル</div>
        <p className={styles.description}>
          ピースをタップしてスライドさせて、
          <br />
          えをかんせいさせよう！
          <br />
          みほんボタンでかんせいずがみれるよ
        </p>
        <button className={styles.button} onClick={onDismiss}>
          あそぶ！
        </button>
      </div>
    </div>
  );
}
