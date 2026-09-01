import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export const MoodSelector = ({ onMoodLogged }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const moods = [
    { label: 'Great', emoji: '😄', score: 85, color: '#8FD8C8', bg: '#EBF7F4' },
    { label: 'Good', emoji: '🙂', score: 75, color: '#8B7CF6', bg: '#EEEAFE' },
    { label: 'Okay', emoji: '😐', score: 60, color: '#6C9BF2', bg: '#EBF2FE' },
    { label: 'Low', emoji: '😔', score: 45, color: '#F7C7B8', bg: '#FDF3F0' },
    { label: 'Difficult', emoji: '😣', score: 30, color: '#F87171', bg: '#FEE2E2' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMood) return;

    setSubmitted(true);
    if (onMoodLogged) {
      onMoodLogged({
        mood: selectedMood.label,
        score: selectedMood.score,
        emoji: selectedMood.emoji,
        note: note || 'Checked in mood'
      });
    }

    setTimeout(() => {
      setSubmitted(false);
      setSelectedMood(null);
      setNote('');
    }, 4000);
  };

  if (submitted) {
    return (
      <div className="card-glass" style={{ textAlign: 'center', padding: '32px 24px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--mint-green-light)',
          color: '#117863',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <CheckCircle2 size={32} />
        </div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Mood Check-In Logged!</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
          Thank you for taking a moment for yourself today. Your insights have been saved.
        </p>
      </div>
    );
  }

  return (
    <div className="card-glass" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F7FF 100%)' }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--primary-lavender)', fontWeight: 800, letterSpacing: '0.05em' }}>
          DAILY CHECK-IN
        </div>
        <h2 style={{ fontSize: '1.4rem', marginTop: '4px' }}>How are you feeling today?</h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        {moods.map((m) => {
          const isSelected = selectedMood?.label === m.label;
          return (
            <button
              key={m.label}
              type="button"
              onClick={() => setSelectedMood(m)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '16px 8px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isSelected ? m.bg : '#FFFFFF',
                border: isSelected ? `2px solid ${m.color}` : '1.5px solid var(--border-light)',
                boxShadow: isSelected ? '0 6px 16px rgba(139, 124, 246, 0.15)' : 'none',
                transform: isSelected ? 'translateY(-2px)' : 'none',
                transition: 'var(--transition-fast)'
              }}
            >
              <span style={{ fontSize: '2rem', marginBottom: '6px', lineHeight: 1 }}>{m.emoji}</span>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: isSelected ? 700 : 500,
                color: isSelected ? m.color : 'var(--text-dark)'
              }}>
                {m.label}
              </span>
            </button>
          );
        })}
      </div>

      {selectedMood && (
        <form onSubmit={handleSubmit} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Add an optional note about why you feel this way..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary btn-sm">
              Log Today's Mood <Send size={14} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
