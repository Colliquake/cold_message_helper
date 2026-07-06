import Tesseract from 'tesseract.js';

export async function runOcr(image: File): Promise<string> {
    const { data } = await Tesseract.recognize(image, 'eng');
    console.log('ocr extracted text:', data.text);
    return data.text;
}