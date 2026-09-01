import React from 'react';

export const CircularProgress = ({ value = 72, max = 100, size = 140, strokeWidth = 12, label = "Doing well" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(value / max, 0), 1);
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div className="circle-progress-wrapper" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track Background */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#EEEAFE"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active Gradient Stroke */}
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B7CF6" />
              <stop offset="100%" stopColor="#6C9BF2" />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#scoreGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>

        {/* Center Text */}
        <div style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1 }}>
            {value}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            / {max}
          </span>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <span className="badge badge-lavender" style={{ padding: '6px 16px', fontSize: '0.875rem' }}>
          {label}
        </span>
      </div>
    </div>
  );
};
