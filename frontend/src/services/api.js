// MindCare AI API Client Layer

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  async register(name, email, password, role) {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Registration failed');
    return data;
  },

  async login(email, password, role) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Login failed');
    return data;
  },

  async sendMessage(userId, sessionId, message, history = []) {
    try {
      const res = await fetch(`${API_BASE}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId || 'usr-default',
          session_id: sessionId || 'sess-default',
          message,
          history
        })
      });
      if (!res.ok) throw new Error('Backend message call failed');
      return await res.json();
    } catch (err) {
      console.warn('[API Chat Fallback]:', err);
      return null;
    }
  },

  async analyzeEmotion(text) {
    try {
      const res = await fetch(`${API_BASE}/api/emotion/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error('Emotion analysis failed');
      return await res.json();
    } catch (err) {
      console.warn('[API Emotion Fallback]:', err);
      return null;
    }
  },

  async getGlobalBenchmarks(country = "World") {
    try {
      const res = await fetch(`${API_BASE}/api/insights/global-benchmarks?country=${encodeURIComponent(country)}`);
      if (!res.ok) throw new Error('Benchmark fetch failed');
      return await res.json();
    } catch (err) {
      console.warn('[API Benchmark Fallback]:', err);
      return null;
    }
  }
};
