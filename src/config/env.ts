/**
 * SIGNET PROTOCOL - SECURE KEY ENCAPSULATION
 * 
 * This file safely reads environment variables injected by Vite or Node.
 * It is safe to commit because it contains NO hardcoded secrets.
 * 
 * In AI Studio: Set these in the Environment Variables UI.
 * In GitHub Actions: These are generated into a .env file.
 * Locally: Create a .env file.
 * 
 * IMPORTANT API KEY CONFIGURATION:
 * - GEMINI_API_KEY: Used for standard HTTP requests (Diff Engines). Should have HTTP Referrer restrictions.
 *   Whitelist: https://ais-dev-volxjj72guvgx7lp3qo724-21086313823.us-west1.run.app/*, https://ais-pre-volxjj72guvgx7lp3qo724-21086313823.us-west1.run.app/*, https://www.signetai.io/*
 * - VITE_GEMINI_LIVE_API_KEY (or selected via UI): Used for WebSockets (Live Assistant). MUST NOT have Referrer restrictions, as WebSockets do not send the Referer header.
 * - YOUTUBE_API_KEY: Used by the Universal Signer to fetch YouTube metadata. Can use the same Referrer restrictions as GEMINI_API_KEY.
 */

// We must explicitly reference process.env.VAR_NAME so Vite's static `define` replacement works.
const getEnv = (key: string, processEnvValue?: string) => {
  if (processEnvValue) {
    return processEnvValue;
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[`VITE_${key}`] || import.meta.env[key];
  }
  return undefined;
};

// Explicitly pass the statically replaced process.env values
export const GOOGLE_GEMINI_KEY = getEnv('GEMINI_API_KEY', typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined) 
  || getEnv('API_KEY', typeof process !== 'undefined' ? process.env?.API_KEY : undefined) 
  || "";

export const GOOGLE_GEMINI_LIVE_KEY = getEnv('VITE_GEMINI_LIVE_API_KEY', typeof process !== 'undefined' ? process.env?.VITE_GEMINI_LIVE_API_KEY : undefined) || "";

export const YOUTUBE_API_KEY = getEnv('YOUTUBE_API_KEY', typeof process !== 'undefined' ? process.env?.YOUTUBE_API_KEY : undefined) || "";

export const GOOGLE_OAUTH_CLIENT_ID = getEnv('OAUTH_CLIENT_ID', typeof process !== 'undefined' ? process.env?.OAUTH_CLIENT_ID : undefined) || "";

export const firebaseConfig = {
  apiKey: getEnv('FIREBASE_API_KEY', typeof process !== 'undefined' ? process.env?.FIREBASE_API_KEY : undefined) || "",
  authDomain: getEnv('FIREBASE_AUTH_DOMAIN', typeof process !== 'undefined' ? process.env?.FIREBASE_AUTH_DOMAIN : undefined) || "",
  projectId: getEnv('FIREBASE_PROJECT_ID', typeof process !== 'undefined' ? process.env?.FIREBASE_PROJECT_ID : undefined) || "",
  storageBucket: getEnv('FIREBASE_STORAGE_BUCKET', typeof process !== 'undefined' ? process.env?.FIREBASE_STORAGE_BUCKET : undefined) || "",
  messagingSenderId: getEnv('FIREBASE_MESSAGING_SENDER_ID', typeof process !== 'undefined' ? process.env?.FIREBASE_MESSAGING_SENDER_ID : undefined) || "",
  appId: getEnv('FIREBASE_APP_ID', typeof process !== 'undefined' ? process.env?.FIREBASE_APP_ID : undefined) || "",
  measurementId: getEnv('FIREBASE_MEASUREMENT_ID', typeof process !== 'undefined' ? process.env?.FIREBASE_MEASUREMENT_ID : undefined) || ""
};
