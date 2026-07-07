const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface SubmitPayload {
  ocrTexts: string[];
  userMessage: string;
}

export async function submitMessage({ ocrTexts, userMessage }: SubmitPayload) {
  const res = await fetch(`${API_BASE_URL}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ocr_texts: ocrTexts,
      user_message: userMessage,
    }),
  });

  if (!res.ok) throw new Error('Backend request failed');
  return res.json();
}