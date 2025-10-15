import React, { useState } from 'react';
import './App.css';
import { chat as chatApi } from './services/api';

// PUBLIC_INTERFACE
function App() {
  /**
   * Minimal chatbot UI with:
   * - Text input for user message
   * - "Send" button
   * - Area showing last user message and assistant reply
   * - Error handling display
   */
  const [input, setInput] = useState('');
  const [lastUserMessage, setLastUserMessage] = useState('');
  const [assistantReply, setAssistantReply] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canSend = input.trim().length > 0 && !loading;

  const handleSend = async () => {
    const message = input.trim();
    if (!message || loading) return;
    setError('');
    setLoading(true);
    setAssistantReply('');
    setLastUserMessage(message);
    setInput('');
    try {
      const reply = await chatApi(message);
      setAssistantReply(reply);
    } catch (e) {
      setError(e?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && canSend) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="brand">
          <span className="brand-badge">Gemini</span>
          <h1 className="title">Playful Chatbot</h1>
        </div>
        <p className="subtitle">A minimal UI: type a message, send, and see the reply.</p>
      </header>

      <main className="chat-container" aria-live="polite">
        {!lastUserMessage && !assistantReply && !error && (
          <div className="placeholder">
            <p>Start the conversation by typing below.</p>
          </div>
        )}

        {lastUserMessage && (
          <div className="bubble-row right">
            <div className="bubble bubble-user">
              <div className="bubble-label">You</div>
              <div className="bubble-text">{lastUserMessage}</div>
            </div>
          </div>
        )}

        {(assistantReply || loading) && (
          <div className="bubble-row left">
            <div className="bubble bubble-assistant">
              <div className="bubble-label">Assistant</div>
              <div className="bubble-text">
                {loading ? 'Thinking…' : assistantReply}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="error-row" role="alert">
            <span className="error-text">Error: {error}</span>
          </div>
        )}
      </main>

      <footer className="input-area">
        <input
          className="text-input"
          type="text"
          placeholder="Type your message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Message input"
        />
        <button
          className="send-button"
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
        >
          {loading ? 'Sending…' : 'Send'}
        </button>
      </footer>
    </div>
  );
}

export default App;
