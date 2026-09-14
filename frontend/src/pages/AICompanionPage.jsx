import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_CHAT_MESSAGES } from '../utils/mockData';
import { EmotionInsightCard } from '../components/EmotionInsightCard';
import { analyzeEmotionClient, generateClientResponse } from '../utils/aiResponseEngine';
import { callOpenRouter } from '../services/openRouterClient';
import {
  Bot,
  Send,
  Smile,
  Mic,
  Paperclip,
  Shield,
  RefreshCw,
  Zap
} from 'lucide-react';

export const AICompanionPage = ({ guideMode }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiStatus, setAiStatus] = useState('openrouter'); // 'openrouter' | 'fallback'
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const tsNow = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const buildInsightFromText = (userText) => {
    const emotion = analyzeEmotionClient(userText);
    return {
      primaryEmotion: emotion.primaryEmotion,
      confidence: emotion.confidence,
      signals: emotion.signals,
      riskScore: emotion.riskScore,
      recommendation:
        emotion.riskScore === 'High'
          ? 'Please consider reaching out to a licensed counselor or calling 988 (crisis line).'
          : emotion.primaryEmotion.includes('Anxiety')
          ? 'Try a 4-7-8 breathing cycle: inhale 4s, hold 7s, exhale 8s.'
          : emotion.primaryEmotion.includes('Sad')
          ? 'Journaling your thoughts for 10 minutes can help externalise heavy feelings.'
          : 'Continue taking moments for mindfulness and daily reflection.',
      isUnavailable: false
    };
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: tsNow()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // ── PRIMARY: OpenRouter LLM ──────────────────────────────────────────
      const llmReply = await callOpenRouter(userText, messages);
      const insight = buildInsightFromText(userText);

      setAiStatus('openrouter');
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'ai',
          text: llmReply,
          timestamp: tsNow(),
          insight
        }
      ]);
    } catch (err) {
      // ── FALLBACK: Local keyword engine ───────────────────────────────────
      console.warn('[OpenRouter unavailable, using local fallback]:', err.message);
      setAiStatus('fallback');
      const clientResult = generateClientResponse(userText, messages);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'ai',
          text: clientResult.response,
          timestamp: tsNow(),
          insight: {
            primaryEmotion: clientResult.detected_emotion,
            confidence: clientResult.confidence,
            signals: clientResult.signals,
            riskScore: clientResult.risk_score,
            recommendation: clientResult.recommendations,
            isUnavailable: false
          }
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your MindCare AI companion, powered by advanced language AI. I'm here to listen, reflect, and support you in a completely safe, private space. How are you feeling right now?`,
        timestamp: tsNow(),
        insight: null
      }
    ]);
  };

  const statusBadge =
    aiStatus === 'openrouter' ? (
      <span className="badge badge-mint" style={{ padding: '2px 10px', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <Zap size={11} /> Llama 3.1 AI Active
      </span>
    ) : (
      <span className="badge badge-amber" style={{ padding: '2px 10px', fontSize: '0.72rem' }}>
        ● Local Fallback Mode
      </span>
    );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 64px)',
      width: '100%',
      minHeight: 0,
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-light)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden'
    }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        background: '#FFFFFF',
        borderBottom: '1px solid var(--border-light)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #8B7CF6 0%, #6C9BF2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            flexShrink: 0
          }}>
            <Bot size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', margin: 0 }}>
                MindCare AI Companion
              </h2>
              {statusBadge}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, marginTop: '2px' }}>
              Real-time emotion analysis · Powered by OpenRouter + Llama 3.1
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="btn btn-outline btn-sm"
          title="Start fresh conversation"
        >
          <RefreshCw size={14} /> New Chat
        </button>
      </div>

      {/* Chat Stream */}
      <div style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        backgroundColor: '#F8F7FF',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
      }}>
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '82%',
                alignSelf: isUser ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '4px',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)'
              }}>
                <span style={{ fontWeight: 700 }}>
                  {isUser ? (user?.name || 'You') : 'MindCare AI'}
                </span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div style={{
                padding: '16px 20px',
                borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                backgroundColor: isUser ? 'var(--primary-lavender)' : '#FFFFFF',
                color: isUser ? '#FFFFFF' : 'var(--text-dark)',
                boxShadow: isUser
                  ? '0 4px 12px rgba(139, 124, 246, 0.25)'
                  : 'var(--shadow-sm)',
                lineHeight: 1.65,
                fontSize: '0.95rem',
                border: isUser ? 'none' : '1px solid var(--border-light)',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.text}

                {!isUser && msg.insight && (
                  <EmotionInsightCard insight={msg.insight} />
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem'
          }}>
            <Bot size={18} color="#8B7CF6" className="animate-pulse-soft" />
            <span>Thinking & generating response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Composer Input */}
      <div style={{
        flexShrink: 0,
        background: '#FFFFFF',
        borderTop: '1px solid var(--border-light)',
        padding: '14px 20px 12px'
      }}>
        <form onSubmit={handleSend} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            style={{ color: 'var(--text-secondary)', padding: '6px', flexShrink: 0 }}
            title="Attach file"
          >
            <Paperclip size={20} />
          </button>

          <button
            type="button"
            style={{ color: 'var(--text-secondary)', padding: '6px', flexShrink: 0 }}
            title="Voice input"
          >
            <Mic size={20} />
          </button>

          <input
            type="text"
            className="form-input"
            placeholder="Type your thoughts or feelings..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'var(--bg-lavender)',
              borderRadius: 'var(--radius-pill)',
              padding: '12px 20px',
              minWidth: 0
            }}
          />

          <button
            type="button"
            style={{ color: 'var(--text-secondary)', padding: '6px', flexShrink: 0 }}
            title="Emoji selector"
          >
            <Smile size={20} />
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ borderRadius: '50%', width: '44px', height: '44px', padding: 0, flexShrink: 0 }}
            disabled={!input.trim() || isTyping}
          >
            <Send size={18} />
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          marginTop: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px'
        }}>
          <Shield size={11} color="#8B7CF6" />
          MindCare AI provides supportive wellness guidance and is not a substitute for professional medical care.
        </div>
      </div>
    </div>
  );
};
