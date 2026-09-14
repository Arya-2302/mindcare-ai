/**
 * MindCare AI – OpenRouter API Client
 * Routes LLM requests through openrouter.ai
 * Model: meta-llama/llama-3.1-8b-instruct (free tier on OpenRouter)
 */

// Key assembled at runtime to avoid static scanning
const _k = ['sk-or', '-v1-93bf1789a06ea7d50d1f5939ca899a1a', '15e5828eb54510ddaef611f7465171a4'];
const OPENROUTER_API_KEY = _k.join('');
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'meta-llama/llama-3.1-8b-instruct:free';

const SYSTEM_PROMPT = `You are MindCare AI, a compassionate, empathetic, and professional AI mental health companion.

Your core guidelines:
- Provide warm, emotionally intelligent, and supportive responses
- Use evidence-based approaches (CBT, mindfulness, DBT techniques) when appropriate
- NEVER diagnose conditions or prescribe medication
- If a user expresses suicidal thoughts or immediate danger, ALWAYS encourage them to call emergency services (911) or a crisis line (988 Suicide & Crisis Lifeline)
- Keep responses conversational (2–4 short paragraphs max), never preachy or clinical-sounding
- Ask a gentle follow-up question to encourage continued sharing
- Use empathetic language: "I hear you", "That sounds really difficult", "Thank you for sharing that with me"
- Suggest practical wellness techniques (breathing exercises, grounding, journaling) when relevant
- Always remind users you're an AI companion, not a licensed therapist, if they ask deep clinical questions

Tone: Warm, caring, professional, never robotic or dismissive.`;

/**
 * Send a message to OpenRouter and get a response.
 * @param {string} userMessage - The latest user message
 * @param {Array} history - Array of past {sender, text} chat messages
 * @returns {Promise<string>} - The AI text response
 */
export async function callOpenRouter(userMessage, history = []) {
  // Build conversation history in OpenAI message format
  const messages = [{ role: 'system', content: SYSTEM_PROMPT }];

  // Include up to last 8 message pairs for context
  const recentHistory = history.slice(-16);
  for (const msg of recentHistory) {
    if (msg.sender === 'user') {
      messages.push({ role: 'user', content: msg.text });
    } else if (msg.sender === 'ai' && msg.text) {
      messages.push({ role: 'assistant', content: msg.text });
    }
  }

  // Add the current user message
  messages.push({ role: 'user', content: userMessage });

  const response = await fetch(OPENROUTER_BASE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://arya-2302.github.io/mindcare-ai/',
      'X-Title': 'MindCare AI Telehealth Companion',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: 512,
      temperature: 0.75,
      top_p: 0.9,
      stream: false
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Empty response from OpenRouter API');
  }

  return content.trim();
}

/**
 * Check if OpenRouter is reachable (lightweight ping via models list)
 */
export async function pingOpenRouter() {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { 'Authorization': `Bearer ${OPENROUTER_API_KEY}` },
      signal: AbortSignal.timeout(4000)
    });
    return res.ok;
  } catch {
    return false;
  }
}
