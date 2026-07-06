interface SubmitPayload {
    image: File;
    ocrText: string;
    userMessage: string;
}

export async function submitMessage({ image, ocrText, userMessage }: SubmitPayload) {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('ocr_text', ocrText);
    formData.append('user_message', userMessage);

    const res = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        body: formData,
    });

    if(!res.ok) throw new Error('Backend request failed');
    return res.json();
}