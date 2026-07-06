import styles from './PastedImageGallery.module.css';

interface PastedImage {
    id: string;
    file: File;
    previewUrl: string;
}

interface Props {
    images: PastedImage[];
    onRemove: (id: string) => void;
}

export function PastedImageGallery({ images, onRemove }: Props) {
    if (images.length === 0) return null;

    return (
        <div className={styles.gallery}>
            {images.map((img) => (
                <div key={img.id} className={styles.imageCard}>
                    <button
                        className={styles.removeButton}
                        onClick={() => onRemove(img.id)}
                        aria-label="Remove image"
                    >
                        ✕
                    </button>
                    <img src={img.previewUrl} alt="Pasted screenshot" className={styles.image} />
                </div>
            ))}
        </div>
    );
}