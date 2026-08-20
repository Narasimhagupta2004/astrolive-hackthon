
const env = import.meta.env;

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'XXXX',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'XXXX',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'XXXX',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: env.VITE_FIREBASE_APP_ID || 'XXXX'
};

export function isConfigured() {
  return ['apiKey', 'authDomain', 'projectId', 'appId']
    .every((k) => firebaseConfig[k] && !firebaseConfig[k].includes('XXXX'));
}
