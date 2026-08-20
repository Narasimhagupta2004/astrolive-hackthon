
    
const env = import.meta.env;

export const GEMINI_API_KEY = env.VITE_GEMINI_API_KEY || 'XXXX';

// Overridable so the model can be swapped without a code change.
export const GEMINI_MODEL = env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
