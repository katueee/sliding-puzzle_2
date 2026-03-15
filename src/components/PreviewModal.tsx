import styles from './PreviewModal.module.css';

interface Props {
  imageUrl: string;
  onClose: () => void;
}

export default function PreviewModal({ imageUrl, onClose }: Props) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="完成図" className={styles.image} />
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
