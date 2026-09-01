import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  COUNSELOR_PATIENTS_OVERVIEW,
  HIGH_RISK_ALERTS,
  APPOINTMENTS_LIST
} from '../utils/mockData';
import {
  Users,
  AlertTriangle,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  MessageSquare,
  ShieldAlert,
  Search,
  Filter,
  Eye,
  X
} from 'lucide-react';

export const CounselorDashboard = ({ activeTab }) => {
  const { user } = useAuth();
  const [patients, setPatients] = useState(COUNSELOR_PATIENTS_OVERVIEW);
  const [alerts, setAlerts] = useState(HIGH_RISK_ALERTS);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [alertFilter, setAlertFilter] = useState('All');

  const getRiskBadge = (risk) => {
    if (risk === 'High') return <span className="badge badge-coral">High Risk</span>;
    if (risk === 'Moderate') return <span className="badge badge-amber">Moderate</span>;
    return <span className="badge badge-mint">Low Risk</span>;
  };

  const filteredAlerts = alertFilter === 'All' 
    ? alerts 
    : alerts.filter(a => a.riskLevel === alertFilter);

  const handleDismissAlert = (alertId) => {
    setAlerts(alerts.filter(a => a.id !== alertId));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--primary-lavender)', fontWeight: 800, textTransform: 'uppercase' }}>
          CLINICAL TELEHEALTH PORTAL
        </div>
        <h1 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)' }}>
          Welcome, {user?.name || 'Dr. Elena Vance'} 🩺
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
          Monitor assigned patients, triage high-priority risk alerts, and manage upcoming consultations
        </p>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        <div className="card-glass" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Patients</span>
            <Users size={20} color="#8B7CF6" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>4</div>
          <span className="badge badge-lavender" style={{ fontSize: '0.75rem' }}>Active caseload</span>
        </div>

        <div className="card-glass" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Upcoming Sessions</span>
            <Calendar size={20} color="#6C9BF2" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>2</div>
          <span className="badge badge-blue" style={{ fontSize: '0.75rem' }}>Scheduled today</span>
        </div>

        <div className="card-glass" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Pending Requests</span>
            <Clock size={20} color="#117863" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>1</div>
          <span className="badge badge-mint" style={{ fontSize: '0.75rem' }}>New booking</span>
        </div>

        <div className="card-glass" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>High Priority Alerts</span>
            <AlertTriangle size={20} color="#B91C1C" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#B91C1C' }}>{alerts.length}</div>
          <span className="badge badge-coral" style={{ fontSize: '0.75rem' }}>Needs triage</span>
        </div>
      </div>

      {/* ALERT CENTER (If active tab is counselor_alerts or high priority alerts exist) */}
      {(activeTab === 'counselor_alerts' || alerts.length > 0) && (
        <div className="card-glass" style={{ borderLeft: '4px solid var(--soft-coral)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={22} color="#B91C1C" />
              <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)' }}>Clinical Alert Triage Center</h2>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {['All', 'High', 'Moderate'].map(f => (
                <button
                  key={f}
                  onClick={() => setAlertFilter(f)}
                  className={`btn btn-sm ${alertFilter === f ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontSize: '0.75rem' }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredAlerts.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', padding: '16px', textAlign: 'center' }}>No active alerts in this filter.</div>
            ) : (
              filteredAlerts.map(alt => (
                <div
                  key={alt.id}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div style={{ maxWidth: '600px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{alt.patientName}</span>
                      {getRiskBadge(alt.riskLevel)}
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{alt.timestamp}</span>
                    </div>

                    <p style={{ color: 'var(--text-dark)', fontSize: '0.9rem', marginBottom: '8px' }}>{alt.summary}</p>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {alt.detectedSignals.map((sig, idx) => (
                        <span key={idx} style={{ background: 'var(--bg-lavender)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {sig}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => setSelectedPatient(patients[0])}
                      className="btn btn-primary btn-sm"
                    >
                      <Eye size={14} /> Review Patient History
                    </button>
                    <button 
                      onClick={() => handleDismissAlert(alt.id)}
                      className="btn btn-outline btn-sm"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* PATIENT RISK OVERVIEW TABLE */}
      <div className="card-glass" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>
          Patient Risk Overview
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px' }}>Patient Name</th>
                <th style={{ padding: '12px' }}>Current Mood</th>
                <th style={{ padding: '12px' }}>Risk Indicator</th>
                <th style={{ padding: '12px' }}>Last Active</th>
                <th style={{ padding: '12px' }}>Recent Signals</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '16px 12px', fontWeight: 700 }}>{p.name}</td>
                  <td style={{ padding: '16px 12px' }}>{p.mood}</td>
                  <td style={{ padding: '16px 12px' }}>{getRiskBadge(p.risk)}</td>
                  <td style={{ padding: '16px 12px', color: 'var(--text-secondary)' }}>{p.lastActive}</td>
                  <td style={{ padding: '16px 12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.recentSignals}</td>
                  <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedPatient(p)}
                      className="btn btn-outline btn-sm"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detail Profile Modal */}
      {selectedPatient && (
        <div className="modal-overlay">
          <div className="modal-card animate-fade-in" style={{ maxWidth: '640px' }}>
            <button 
              onClick={() => setSelectedPatient(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-secondary)' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--light-lavender)',
                color: 'var(--primary-lavender)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 700
              }}>
                {selectedPatient.name[0]}
              </div>
              <div>
                <h3 style={{ fontSize: '1.4rem' }}>{selectedPatient.name}</h3>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.85rem', marginTop: '2px' }}>
                  <span>{selectedPatient.age} yrs • {selectedPatient.gender}</span>
                  {getRiskBadge(selectedPatient.risk)}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div style={{ background: 'var(--bg-lavender)', padding: '14px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Average Wellness Score</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{selectedPatient.avgScore} / 100</div>
              </div>

              <div style={{ background: 'var(--bg-lavender)', padding: '14px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Completed Sessions</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{selectedPatient.sessionsCount} sessions</div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '8px' }}>AI Conversation Summary (Privacy Preserved)</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', background: '#F8F7FF', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--primary-lavender)' }}>
                User engaged with AI companion discussing workload pressure and evening sleep anxiety. Reported positive outcomes from 5-minute breathing techniques.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setSelectedPatient(null)} className="btn btn-primary btn-sm">
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
