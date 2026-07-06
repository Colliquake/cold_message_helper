import { useState, useCallback } from 'react';
import { usePasteListener } from './hooks/usePasteListener';
import { PastedImageGallery } from './components/PastedImageGallery';
import { runOcr } from './utils/ocr';
import { submitMessage } from './api/client';

interface PastedImage {
  id: string;
  file: File;
  previewUrl: string;
}

function App() {
  const [pastedImages, setPastedImages] = useState<PastedImage[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');

  const handleImagePasted = useCallback((file: File) => {
    const newImage: PastedImage = {
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    };
    setPastedImages((prev) => [...prev, newImage]);
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setPastedImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  usePasteListener(handleImagePasted);

  const handleSubmit = async () => {
    if (pastedImages.length === 0) {
      alert('Paste at least one screenshot first.');
      return;
    }
    if (!userMessage.trim()) {
      alert('Describe what you want to say first.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Run OCR on all pasted images in parallel
      const ocrTexts = await Promise.all(
        pastedImages.map((img) => runOcr(img.file))
      );

      // console.log("ocr texts:", ocrTexts);

      const result = await submitMessage({ ocrTexts, userMessage });
      setGeneratedMessage(result.generated_message);
    } catch (err) {
      console.error('Submission failed', err);
      alert('Something went wrong — check the console.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1>Cold Message Helper</h1>
      <p>Paste one or more screenshots of a LinkedIn profile anywhere on this page.</p>

      <PastedImageGallery images={pastedImages} onRemove={handleRemoveImage} />

      <textarea
        placeholder="What do you want to say to this person? (e.g. 'ask about a referral', 'compliment their work on X')"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        rows={4}
        style={{ width: '100%', marginTop: '1.5rem' }}
      />

      <button onClick={handleSubmit} disabled={isSubmitting} style={{ marginTop: '0.75rem' }}>
        {isSubmitting ? 'Generating...' : 'Generate Message'}
      </button>

      {generatedMessage && (
        <div style={{ marginTop: '1.5rem' }}>
          <label htmlFor="generated">Generated message (edit as needed):</label>
          <textarea
            id="generated"
            value={generatedMessage}
            onChange={(e) => setGeneratedMessage(e.target.value)}
            rows={6}
            style={{ width: '100%', marginTop: '0.5rem' }}
          />
        </div>
      )}
    </div>
  );
}

export default App;