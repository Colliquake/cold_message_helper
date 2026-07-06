import { useState, useEffect } from 'react';
import { runOcr } from '../utils/ocr.ts';
import { submitMessage } from '../api/client.ts';
import styles from './ComposeModal.module.css';

interface Props {
    image: File,
    onClose: () => void;
}

export function ComposeModal({ image, onClose }: Props) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [userMessage, setUserMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const url = URL.createObjectURL(image);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [image]);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const ocrText = await runOcr(image);
            await submitMessage({ image, ocrText, userMessage });
            onClose();
        } catch(err) {
            console.error('Submission failed', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button onClick={onClose} className={styles.closeButton}>X</button>
                {previewUrl && <img src={previewUrl} alt="pasted" />}
                <textarea 
                    className={styles.textarea}
                    placeholder="What would you like to cold message this person about?"
                    value={userMessage}
                    onChange={(e) => {setUserMessage(e.target.value); console.log(e.target.value)}}
                    rows={4}
                />
                <button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Generate Message'}
                </button>
            </div>
        </div>
    );
}