//
// Minimal API client for the chatbot frontend
//

/**
 * Resolve the base API URL from environment variables or fallback.
 * - Uses process.env.REACT_APP_API_BASE_URL if provided.
 * - Otherwise defaults to window.location.origin but forces port 3001.
 */
function resolveBaseURL() {
  const envBase = process.env.REACT_APP_API_BASE_URL;
  if (envBase && typeof envBase === 'string' && envBase.trim().length > 0) {
    return envBase.trim().replace(/\/+$/, '');
  }
  try {
    const current = new URL(window.location.origin);
    current.port = '3001';
    // URL.origin will include the port when non-default
    return current.origin;
  } catch {
    // Absolute last-resort fallback
    return 'http://localhost:3001';
  }
}

const baseURL = resolveBaseURL();

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

  const response = await fetch(`${baseURL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

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
