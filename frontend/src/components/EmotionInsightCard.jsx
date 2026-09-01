import React, { useState } from 'react';
import { Brain, ChevronDown, ChevronUp, AlertCircle, Activity } from 'lucide-react';

/**
 * EmotionInsightCard
 * Displays the real DistilBERT emotion classification result from the backend.
 * - If insight.isUnavailable is true → shows "Emotion analysis unavailable"
 * - If confidence < 45 → shows low-confidence indicator
 * - Otherwise → shows primary emotion + confidence + expanded signal breakdown
 */
export const EmotionInsightCard = ({ insight }) => {
  const [expanded, setExpanded] = useState(false);

  if (!insight) return null;

  // Model failed / backend unreachable
  if (insight.isUnavailable) {
    return (
      <div style={{
        marginTop: '10px',
        backgroundColor: 'rgba(255, 243, 230, 0.6)',
        border: '1px solid #FBCF8B',
        borderRadius: 'var(--radius-sm)',
        padding: '8px 14px',
        fontSize: '0.82rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#B45309'
      }}>
        <AlertCircle size={14} />
        <span>Emotion analysis unavailable</span>
      </div>
    );
  }

  const conf = typeof insight.confidence === 'number' ? insight.confidence : 0;
  const isLowConf = conf < 45;

  // Choose badge colour by emotion
  const emotionColors = {
    Anxiety: '#6C9BF2',
    Sadness: '#8B7CF6',
    Anger: '#F87171',
    Joy: '#8FD8C8',
    Positive: '#8FD8C8',
    Surprised: '#F59E0B',
    Neutral: '#A0A0B5'
  };
  const emotionKey = Object.keys(emotionColors).find(k =>
    insight.primaryEmotion?.toLowerCase().includes(k.toLowerCase())
  );
  const emotionColor = emotionColors[emotionKey] || 'var(--primary-lavender)';

  return (
    <div style={{
      marginTop: '12px',
      backgroundColor: 'rgba(238, 234, 254, 0.45)',
      border: '1px solid #D8D0FC',
      borderRadius: 'var(--radius-sm)',
      padding: '10px 14px',
      fontSize: '0.85rem'
    }}>
      {/* ── Collapsed header row ── */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Brain size={15} color="var(--primary-lavender)" />
          <span style={{ fontWeight: 700, color: 'var(--primary-lavender)' }}>Emotion Insight</span>

          {/* Primary emotion badge */}
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 10px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--light-lavender)',
            color: emotionColor,
            fontSize: '0.72rem',
            fontWeight: 700
          }}>
            <Activity size={10} />
            Primary: {insight.primaryEmotion} ({conf}%)
            {isLowConf && <span style={{ color: '#B45309', marginLeft: '4px' }}>⚠ low</span>}
          </span>
        </div>

        <button style={{ color: 'var(--primary-lavender)', padding: '2px', background: 'none', border: 'none', cursor: 'pointer' }}>
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </div>

      {/* ── Expanded detail ── */}
      {expanded && (
        <div className="animate-fade-in" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E2DAFE' }}>

          {/* Signal grid — only render if signals exist */}
          {insight.signals && Object.keys(insight.signals).length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              {Object.entries(insight.signals).map(([key, value]) => (
                <div key={key} style={{
                  background: '#FFFFFF',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)'
                }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                    {key}
                  </span>
                  <div style={{ fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.82rem' }}>{value}</div>
                </div>
              ))}

              {/* Risk score */}
              {insight.riskScore && (
                <div style={{
                  background: '#FFFFFF',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)'
                }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Composite Risk</span>
                  <div style={{
                    fontWeight: 700,
                    color: insight.riskScore === 'High' ? '#B91C1C' : insight.riskScore === 'Moderate' ? '#B45309' : '#117863',
                    fontSize: '0.82rem'
                  }}>
                    {insight.riskScore}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recommendation */}
          {insight.recommendation && (
            <div style={{
              background: '#FFFFFF',
              padding: '9px 12px',
              borderRadius: '8px',
              borderLeft: '3px solid var(--primary-lavender)',
              fontSize: '0.79rem',
              color: 'var(--text-dark)',
              marginBottom: '8px'
            }}>
              <strong>Suggested Action:</strong> {insight.recommendation}
            </div>
          )}

          {/* Low-confidence disclaimer */}
          {isLowConf && (
            <div style={{ fontSize: '0.72rem', color: '#B45309', fontStyle: 'italic', marginBottom: '6px' }}>
              ⚠ Confidence below 45% — emotion reading may be uncertain.
            </div>
          )}

          <div style={{ fontSize: '0.69rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            * Powered by DistilBERT NLP model. Not a clinical diagnosis. Emotion detection is not a substitute for professional mental health care.
          </div>
        </div>
      )}
    </div>
  );
};
