/**
 * GeoSentry-AI API Configuration
 *
 * When running on the Vite dev server (port 5173/5174), we use the SAME origin
 * so all requests go through the Vite proxy → FastAPI at :8000.
 * This ensures /health, /api/*, and /storage/* are all reachable.
 *
 * In production (not on a Vite port), we use window.location.origin directly.
 * A manual override via localStorage is still respected for custom deployments.
 */
function getApiBaseUrl() {
  // 1. Explicit localStorage override (set by clicking the SERVER badge)
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('geosentry_api_url');
    if (customUrl && customUrl.trim()) {
      return customUrl.trim().replace(/\/+$/, '');
    }
  }

  // 2. Build-time env override (e.g. production Docker)
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '');
  }

  // 3. Current host origin (handles port 3000, Vite dev server, and production)
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin;
  }

  // 4. Absolute fallback
  return '';
}

export const API_BASE_URL = getApiBaseUrl();

export function setApiBaseUrl(newUrl) {
  if (typeof window !== 'undefined') {
    if (newUrl && newUrl.trim()) {
      localStorage.setItem('geosentry_api_url', newUrl.trim().replace(/\/+$/, ''));
    } else {
      localStorage.removeItem('geosentry_api_url');
    }
    window.location.reload();
  }
}

/** Call this in dev to wipe any stale stored URL and reconnect via proxy */
export function resetApiBaseUrl() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('geosentry_api_url');
    window.location.reload();
  }
}
