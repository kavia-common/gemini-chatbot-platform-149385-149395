//
// Minimal API client for the chatbot frontend
//

/**
 * Resolve the base API URL from environment variables or fallback.
 * Priority:
 * 1) If REACT_APP_USE_PROXY === 'true', use relative '' so fetch('/api/...') hits CRA proxy (avoids CORS in dev).
 * 2) Use REACT_APP_API_BASE_URL if provided.
 * 3) Default to current origin but force port 3001 (backend default).
 */
function resolveBaseURL() {
  const useProxy = String(process.env.REACT_APP_USE_PROXY || '').toLowerCase() === 'true';
  if (useProxy) {
    return ''; // relative requests -> CRA devServer proxy
  }

  const envBase = process.env.REACT_APP_API_BASE_URL;
  if (envBase && typeof envBase === 'string' && envBase.trim().length > 0) {
    return envBase.trim().replace(/\/*$/, '');
  }

  try {
    const current = new URL(window.location.origin);
    current.port = '3001';
    return current.origin;
  } catch {
    return 'http://localhost:3001';
  }
}

const baseURL = resolveBaseURL();

/**
 * Build a full URL by joining baseURL and path safely.
 */
function buildUrl(path) {
  if (!path.startsWith('/')) path = `/${path}`;
  if (!baseURL) return path; // proxy mode -> relative path
  return `${baseURL}${path}`;
}

/**
 * Convert a low-level error into a more helpful message for users.
 */
function toFriendlyError(err, requestUrl) {
  // Network or CORS issues surface as TypeError('Failed to fetch') in browsers
  const msg = err?.message || String(err);
  if (/Failed to fetch/i.test(msg) || /NetworkError/i.test(msg) || /TypeError/i.test(msg)) {
    const hint = baseURL
      ? `Check that the backend is running and reachable at ${baseURL}, that it exposes the expected path, and that CORS is configured if not using the dev proxy.`
      : `Using dev proxy. Ensure 'npm start' is running and package.json has proxy pointing to the backend (default http://localhost:3001).`;
    return new Error(`Network error while calling ${requestUrl}: ${msg}. ${hint}`);
  }
  return new Error(msg);
}

// PUBLIC_INTERFACE
export async function chat(message) {
  /**
   * Send a chat message to the backend and return the assistant reply.
   * @param {string} message - The user's message text to send to the assistant.
   * @returns {Promise<string>} - The assistant's reply text.
   * @throws {Error} - If the request fails or the server returns a non-OK status.
   */
  if (!message || typeof message !== 'string') {
    throw new Error('Message must be a non-empty string');
  }

  const url = buildUrl('/api/chat');

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // For credentialed sessions, uncomment next line and configure backend CORS accordingly:
      // credentials: 'include',
      body: JSON.stringify({ message }),
    });
  } catch (err) {
    throw toFriendlyError(err, url);
  }

  if (!response.ok) {
    let info = '';
    try {
      info = await response.text();
    } catch {
      // ignore
    }
    const details = info ? ` (${info})` : '';
    throw new Error(`Request failed with status ${response.status}${details}`);
  }

  // Attempt to extract a reply from common fields
  const data = await response.json().catch(() => ({}));
  const reply =
    (data && (data.reply || data.text || data.message || data.content)) || '';

  return typeof reply === 'string' && reply.length > 0
    ? reply
    : JSON.stringify(data);
}

export default { chat };
