import { GEMINI_API_KEY, GEMINI_MODEL } from '../config/gemini';

const ENDPOINT = (model) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
const TIMEOUT_MS = 12000;

export function isGeminiConfigured() {
  return typeof GEMINI_API_KEY === 'string' && GEMINI_API_KEY.length > 20 && !GEMINI_API_KEY.includes('XXXX');
}

export async function askGeminiJSON({ systemPrompt, userPrompt }) {
  if (!isGeminiConfigured()) throw new Error('Gemini API key not configured');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${ENDPOINT(GEMINI_MODEL)}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { role: 'system', parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.6,
          maxOutputTokens: 900
        }
      })
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      throw new Error(`Gemini HTTP ${res.status}: ${errBody.slice(0, 200)}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Gemini returned empty content');

    try {
      return JSON.parse(text);
    } catch {
      throw new Error('Gemini response was not valid JSON');
    }
  } finally {
    clearTimeout(timer);
  }
}
