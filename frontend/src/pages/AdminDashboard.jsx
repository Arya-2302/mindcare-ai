import React, { useState } from 'react';
import { ADMIN_STATS } from '../utils/mockData';
import {
  Users,
  UserCheck,
  Activity,
  AlertTriangle,
  Server,
  ShieldCheck,
  Search,
  CheckCircle2
} from 'lucide-react';

export const AdminDashboard = () => {
  const [usersList, setUsersList] = useState([
    { id: '1', name: 'Arya Sharma', email: 'patient@demo.com', role: 'patient', status: 'Active', joined: 'Jan 2026' },
    { id: '2', name: 'Dr. Elena Vance', email: 'counselor@demo.com', role: 'counselor', status: 'Verified', joined: 'Nov 2025' },
    { id: '3', name: 'Dr. Marcus Thorne', email: 'marcus@demo.com', role: 'counselor', status: 'Verified', joined: 'Dec 2025' },
    { id: '4', name: 'Sarah Jenkins', email: 'admin@demo.com', role: 'admin', status: 'SuperAdmin', joined: 'Oct 2025' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = usersList.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--mint-green)', fontWeight: 800, textTransform: 'uppercase' }}>
          SYSTEM ADMINISTRATION PORTAL
        </div>
        <h1 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)' }}>
          Platform Analytics & Controls 🛡️
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
          Global oversight for users, verified counselors, AI telemetry, and system health
        </p>
      </div>

      {/* Health Status Indicator */}
      <div className="card-glass" style={{
        background: 'linear-gradient(135deg, #EBF7F4 0%, #FFFFFF 100%)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckCircle2 size={24} color="#117863" />
          <div>
            <div style={{ fontWeight: 700, color: '#117863' }}>System Health Status: Operational</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>FastAPI Backend • JWT Auth • NLP Inference Engine Running Smoothly</div>
          </div>
        </div>
        <span className="badge badge-mint" style={{ fontSize: '0.85rem' }}>100% Uptime</span>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        <div className="card-glass" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Registered Users</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px' }}>{ADMIN_STATS.totalUsers}</div>
          <span className="badge badge-lavender" style={{ fontSize: '0.75rem', marginTop: '6px' }}>+18% this month</span>
        </div>

        <div className="card-glass" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Patients</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px' }}>{ADMIN_STATS.activePatients}</div>
          <span className="badge badge-mint" style={{ fontSize: '0.75rem', marginTop: '6px' }}>Active users</span>
        </div>

        <div className="card-glass" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Verified Counselors</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px' }}>{ADMIN_STATS.verifiedCounselors}</div>
          <span className="badge badge-blue" style={{ fontSize: '0.75rem', marginTop: '6px' }}>Licensed pros</span>
        </div>

        <div className="card-glass" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Sessions Completed</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px' }}>{ADMIN_STATS.completedSessions}</div>
          <span className="badge badge-peach" style={{ fontSize: '0.75rem', marginTop: '6px' }}>Telehealth</span>
        </div>
      </div>

      {/* User Management Table */}
      <div className="card-glass" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)' }}>User & Counselor Management</h2>
          <div style={{ position: 'relative', width: '280px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
            />
            <Search size={16} color="#73738A" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px' }}>Name</th>
                <th style={{ padding: '12px' }}>Email</th>
                <th style={{ padding: '12px' }}>Role</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Joined</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '16px 12px', fontWeight: 700 }}>{u.name}</td>
                  <td style={{ padding: '16px 12px', color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ padding: '16px 12px' }}>
                    <span className={`badge ${u.role === 'admin' ? 'badge-peach' : u.role === 'counselor' ? 'badge-blue' : 'badge-lavender'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <span className="badge badge-mint">{u.status}</span>
                  </td>
                  <td style={{ padding: '16px 12px', color: 'var(--text-secondary)' }}>{u.joined}</td>
                  <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                    <button className="btn btn-outline btn-sm" style={{ fontSize: '0.75rem' }}>
                      Edit Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
