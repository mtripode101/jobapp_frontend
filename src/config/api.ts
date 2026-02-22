// src/config/api.ts
declare global {
  interface Window {
    __APP_CONFIG__?: {
      API_URL?: string;
    };
  }
}

export const API_BASE_URL: string =
  window.__APP_CONFIG__?.API_URL ||
  process.env.REACT_APP_API_URL ||
  "/api";