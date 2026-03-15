import styles from './MiniPreview.module.css';

interface Props {
  imageUrl: string;
  onClick: () => void;
}

export default function MiniPreview({ imageUrl, onClick }: Props) {
  return (
    <div className={styles.container}>
      <img
        src={imageUrl}
        alt="みほん"
        className={styles.image}
        onClick={onClick}
      />
    </div>
  );
}
