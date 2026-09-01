import React, { useState } from 'react';
import { INITIAL_MOOD_LOGS, EMOTIONAL_SIGNALS_BREAKDOWN } from '../utils/mockData';
import { MoodSelector } from '../components/MoodSelector';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import {
  Calendar,
  Smile,
  Plus,
  Search,
  TrendingUp,
  BookOpen,
  Sparkles,
  Award,
  Activity,
  Heart
} from 'lucide-react';

export const MoodTrackerPage = () => {
  const [moodLogs, setMoodLogs] = useState(INITIAL_MOOD_LOGS);
  const [journals, setJournals] = useState([
    { id: 'j1', date: '2026-08-19', title: 'Morning Reflection', text: 'Felt very calm after practicing 5-min diaphragmatic breathing.', mood: 'Good', emoji: '🙂' },
    { id: 'j2', date: '2026-08-18', title: 'Coffee with Sarah', text: 'Reconnecting with old friends reminded me of the importance of community.', mood: 'Great', emoji: '😄' },
    { id: 'j3', date: '2026-08-16', title: 'Work Deadlines Overwhelm', text: 'Felt tired in the afternoon. Need to pace tasks more effectively.', mood: 'Low', emoji: '😔' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');

  const handleMoodLogged = (newLog) => {
    const log = {
      id: `m-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...newLog
    };
    setMoodLogs(prev => [...prev.slice(1), log]);
  };

  const chartData = moodLogs.map(m => ({
    date: m.date.split('-')[2] + ' Aug',
    score: m.score,
    mood: m.mood
  }));

  const pieData = [
    { name: 'Positivity', value: EMOTIONAL_SIGNALS_BREAKDOWN.positivity, color: '#8FD8C8' },
    { name: 'Neutrality', value: EMOTIONAL_SIGNALS_BREAKDOWN.neutrality, color: '#6C9BF2' },
    { name: 'Stress', value: EMOTIONAL_SIGNALS_BREAKDOWN.stress, color: '#F59E0B' },
    { name: 'Anxiety', value: EMOTIONAL_SIGNALS_BREAKDOWN.anxiety, color: '#F7C7B8' }
  ];

  const commonEmotions = [
    { label: 'Calm & Joyful', count: '4 days (57%)', color: 'mint' },
    { label: 'Moderate Stress', count: '2 days (28%)', color: 'amber' },
    { label: 'Low Energy', count: '1 day (15%)', color: 'peach' }
  ];

  const filteredJournals = journals.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    j.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddJournal = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newText.trim()) return;

    const entry = {
      id: `j-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: newTitle,
      text: newText,
      mood: 'Good',
      emoji: '🙂'
    };

    setJournals([entry, ...journals]);
    setNewTitle('');
    setNewText('');
    setShowAddModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Title Header */}
      <div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>Mood Tracker & Emotional Insights</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
          Track daily feelings, view weekly mood trends, and reflect with private journaling
        </p>
      </div>

      {/* Interactive Mood Check-In Widget */}
      <div>
        <h2 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>
          Log Today's Mood
        </h2>
        <MoodSelector onMoodLogged={handleMoodLogged} />
      </div>

      {/* Mood Statistics Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '18px'
      }}>
        <div className="card-glass" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-lavender)', marginBottom: '8px' }}>
            <Activity size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Average Score</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>73 <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/ 100</span></div>
          <div style={{ fontSize: '0.8rem', color: '#117863', fontWeight: 600, marginTop: '4px' }}>+8% improvement</div>
        </div>

        <div className="card-glass" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#117863', marginBottom: '8px' }}>
            <Smile size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Dominant Mood</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>Good 🙂</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Logged 4 times this week</div>
        </div>

        <div className="card-glass" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#B45309', marginBottom: '8px' }}>
            <Award size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Check-in Streak</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>5 Days 🔥</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>2 days to badge reward</div>
        </div>

        <div className="card-glass" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#2E65C6', marginBottom: '8px' }}>
            <Heart size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Positivity Ratio</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>64%</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Higher than monthly avg</div>
        </div>
      </div>

      {/* Grid: Interactive Line Chart & Emotional Breakdown Donut Chart */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '24px'
      }}>
        {/* Line Chart */}
        <div className="card-glass" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem' }}>7-Day Mood Progression</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Daily score changes over the past week</p>
            </div>
            <span className="badge badge-mint">+12% vs last week</span>
          </div>
          <div style={{ width: '100%', height: '230px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" stroke="#A0A0B5" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#A0A0B5" fontSize={12} />
                <Tooltip 
                  contentStyle={{ background: '#FFF', borderRadius: '12px', border: '1px solid #EFEFF8' }}
                  formatter={(val) => [`${val} pts`, 'Wellness Score']}
                />
                <Line type="monotone" dataKey="score" stroke="#8B7CF6" strokeWidth={3} dot={{ r: 5, fill: '#8B7CF6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Emotional Breakdown Donut */}
        <div className="card-glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Emotional State Breakdown</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Aggregate distribution of emotional signals</p>
          </div>
          <div style={{ width: '100%', height: '190px', display: 'flex', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '6px' }}>
            {pieData.map(p => (
              <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: p.color }} />
                <span>{p.name} ({p.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Private Reflection Journal Tool */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)' }}>Private Reflection Journal</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Write down thoughts, reflections, and gratitude</p>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} /> Add Journal Entry
          </button>
        </div>

        {/* Search Bar */}
        <div className="card-glass" style={{ padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Search size={18} color="#73738A" />
          <input
            type="text"
            placeholder="Search journal reflections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem', background: 'transparent' }}
          />
        </div>

        {/* Journal Entries List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredJournals.map(j => (
            <div key={j.id} className="card-glass" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.5rem' }}>{j.emoji}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{j.date}</span>
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>{j.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{j.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Journal Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>New Journal Entry</h3>
            <form onSubmit={handleAddJournal}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Entry title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Journal Reflection</label>
                <textarea
                  className="form-input"
                  rows={5}
                  placeholder="What's on your mind today?"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
