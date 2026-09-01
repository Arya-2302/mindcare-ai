import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MoodSelector } from '../components/MoodSelector';
import { CircularProgress } from '../components/CircularProgress';
import { FeatureHelpCallout } from '../components/FeatureHelpGuide';
import {
  INITIAL_MOOD_LOGS,
  EMOTIONAL_SIGNALS_BREAKDOWN,
  WELLNESS_RESOURCES
} from '../utils/mockData';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Sparkles,
  HeartHandshake,
  TrendingUp,
  Smile,
  Activity,
  ArrowRight,
  Play
} from 'lucide-react';

export const PatientDashboardHome = ({ setActiveTab, triggerRiskModal, guideMode }) => {
  const { user } = useAuth();
  const [moodLogs, setMoodLogs] = useState(INITIAL_MOOD_LOGS);

  const handleMoodLogged = (newLog) => {
    const log = {
      id: `m-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...newLog
    };
    setMoodLogs(prev => [...prev.slice(1), log]);

    if (newLog.mood === 'Difficult') {
      setTimeout(() => {
        if (triggerRiskModal) triggerRiskModal();
      }, 1000);
    }
  };

  const chartData = moodLogs.map(l => ({
    day: l.date.split('-')[2],
    score: l.score,
    mood: l.mood
  }));

  const recommendedCards = WELLNESS_RESOURCES.slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Greeting Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)' }}>
            Good morning, {user?.name?.split(' ')[0] || 'Arya'} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '4px' }}>
            How are you feeling today? Take a moment for your mental well-being.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setActiveTab('companion')}
            className="btn btn-primary"
          >
            <Sparkles size={18} /> Talk with AI Companion
          </button>
        </div>
      </div>

      {/* Mood Check-In Section */}
      <div>
        <FeatureHelpCallout
          guideMode={guideMode}
          title="Daily Mood Check-In"
          description="Log how you're feeling right now (Great, Good, Okay, Low, Difficult) and add an optional note. This helps you track emotional patterns and triggers over time."
          tip="Logging daily improves your personal Wellness Score accuracy!"
        />
        <MoodSelector onMoodLogged={handleMoodLogged} />
      </div>

      {/* Grid Row: Wellness Score & Emotional Trends */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {/* Wellness Score Card */}
        <div>
          <FeatureHelpCallout
            guideMode={guideMode}
            title="Emotional Wellness Score"
            description="A composite wellness rating from 0 to 100 calculated from your mood check-ins, AI sentiment trends, and relaxation exercise habits."
            tip="This score is for guidance and self-reflection, not a medical diagnosis."
          />
          <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
            <div style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-lavender)', marginBottom: '16px' }}>
              WELLNESS SCORE
            </div>

            <CircularProgress value={user?.wellnessScore || 72} max={100} label={user?.wellnessStatus || "Doing well"} />

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '16px', textAlign: 'center', maxWidth: '280px' }}>
              Calculated from recent mood check-ins & mindfulness activities. *Not a medical diagnosis.
            </p>
          </div>
        </div>

        {/* Weekly Mood Chart Card */}
        <div>
          <FeatureHelpCallout
            guideMode={guideMode}
            title="7-Day Mood Trend Graph"
            description="A line chart showing your emotional balance trajectory over the past week so you can easily identify positive trends or difficult days."
          />
          <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-lavender)' }}>
                  WEEKLY TREND
                </div>
                <h3 style={{ fontSize: '1.2rem', marginTop: '2px' }}>7-Day Emotional Balance</h3>
              </div>
              <span className="badge badge-mint">+12% vs last week</span>
            </div>

            <div style={{ width: '100%', height: '180px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B7CF6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8B7CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#A0A0B5" fontSize={12} tickLine={false} />
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip 
                    contentStyle={{ background: '#FFF', borderRadius: '12px', border: '1px solid #EFEFF8', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`${value} pts`, 'Score']}
                  />
                  <Area type="monotone" dataKey="score" stroke="#8B7CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Emotional Trends Breakdown Indicator Card */}
        <div>
          <FeatureHelpCallout
            guideMode={guideMode}
            title="Emotional State Signals"
            description="Breakdown of detected underlying state signals (Positivity, Neutrality, Stress, Anxiety) derived from your interactions."
          />
          <div className="card-glass" style={{ padding: '24px', height: '100%' }}>
            <div style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-lavender)', marginBottom: '12px' }}>
              EMOTIONAL SIGNALS
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Current State Signals</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, marginBottom: '4px' }}>
                  <span>Positivity</span>
                  <span style={{ color: '#117863' }}>{EMOTIONAL_SIGNALS_BREAKDOWN.positivity}%</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-lavender)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${EMOTIONAL_SIGNALS_BREAKDOWN.positivity}%`, height: '100%', background: 'var(--mint-green)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, marginBottom: '4px' }}>
                  <span>Neutrality</span>
                  <span style={{ color: '#2E65C6' }}>{EMOTIONAL_SIGNALS_BREAKDOWN.neutrality}%</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-lavender)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${EMOTIONAL_SIGNALS_BREAKDOWN.neutrality}%`, height: '100%', background: 'var(--soft-blue)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, marginBottom: '4px' }}>
                  <span>Stress</span>
                  <span style={{ color: '#B45309' }}>{EMOTIONAL_SIGNALS_BREAKDOWN.stress}%</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-lavender)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${EMOTIONAL_SIGNALS_BREAKDOWN.stress}%`, height: '100%', background: 'var(--amber-warning)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, marginBottom: '4px' }}>
                  <span>Anxiety</span>
                  <span style={{ color: '#C04E30' }}>{EMOTIONAL_SIGNALS_BREAKDOWN.anxiety}%</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-lavender)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${EMOTIONAL_SIGNALS_BREAKDOWN.anxiety}%`, height: '100%', background: 'var(--soft-peach)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended For You Section */}
      <div>
        <FeatureHelpCallout
          guideMode={guideMode}
          title="Personalized Wellness Recommendations"
          description="Activities (guided breathing, calming soundscapes, grounding exercises) suggested specifically for your current mood state."
          tip="Click 'Start Activity' to play audio sessions!"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)' }}>Recommended For You</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Personalized wellness based on your recent check-ins</p>
          </div>
          <button 
            onClick={() => setActiveTab('wellness')}
            style={{ color: 'var(--primary-lavender)', fontWeight: 700, fontSize: '0.9rem' }}
          >
            Explore All Wellness →
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {recommendedCards.map(item => (
            <div key={item.id} className="card-glass" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className={`badge badge-${item.color}`}>
                    {item.category}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.duration}</span>
                </div>

                <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '20px' }}>
                  {item.description}
                </p>
              </div>

              <button 
                onClick={() => setActiveTab('wellness')}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%' }}
              >
                <Play size={14} /> Start Activity
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Counselor Connect Banner */}
      <div>
        <FeatureHelpCallout
          guideMode={guideMode}
          title="Licensed Counselor Telehealth Connect"
          description="Easily book 1-on-1 virtual sessions with licensed clinical psychologists specialized in CBT and anxiety care whenever you need human support."
        />
        <div className="card-glass" style={{
          background: 'linear-gradient(135deg, #EEEAFE 0%, #EBF2FE 100%)',
          padding: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div style={{ maxWidth: '600px' }}>
            <div style={{ color: 'var(--primary-lavender)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>
              PROFESSIONAL CARE
            </div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
              Need someone to talk to?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.5 }}>
              Book a 1-on-1 virtual session with licensed psychologists specializing in CBT, stress reduction, and anxiety care.
            </p>
          </div>

          <button 
            onClick={() => setActiveTab('counselors')}
            className="btn btn-primary"
            style={{ padding: '14px 28px' }}
          >
            <HeartHandshake size={18} /> Connect with a Counselor
          </button>
        </div>
      </div>
    </div>
  );
};
