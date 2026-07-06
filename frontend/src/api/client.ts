interface SubmitPayload {
  ocrTexts: string[];
  userMessage: string;
}

export async function submitMessage({ ocrTexts, userMessage }: SubmitPayload) {
    console.log('submitmessage called with:', { ocrTexts, userMessage });
  const res = await fetch('http://localhost:8000/generate', {
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