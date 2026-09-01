import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Sparkles,
  Calendar,
  Smile,
  HeartHandshake,
  Clock,
  Trash2,
  CheckCheck,
  Filter
} from 'lucide-react';

export const NotificationsPage = ({ guideMode, onNotificationCountChange }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      type: 'wellness',
      title: 'Personalized Wellness Recommendation',
      message: 'Based on your recent evening reflections, we recommend trying the 5-Minute Diaphragmatic Breathing session before sleep.',
      timestamp: '10 minutes ago',
      read: false,
      icon: Sparkles,
      color: 'lavender'
    },
    {
      id: 'notif-2',
      type: 'counselor',
      title: 'Appointment Confirmed with Dr. Elena Vance',
      message: 'Your 1-on-1 virtual CBT session is confirmed for tomorrow at 3:00 PM. A secure video link has been prepared.',
      timestamp: '2 hours ago',
      read: false,
      icon: Calendar,
      color: 'mint'
    },
    {
      id: 'notif-3',
      type: 'mood',
      title: 'Daily Mood Check-In Streak',
      message: 'You have logged your emotional wellness for 5 consecutive days! Consistency is key to noticing long-term patterns.',
      timestamp: 'Yesterday at 8:30 PM',
      read: true,
      icon: Smile,
      color: 'blue'
    },
    {
      id: 'notif-4',
      type: 'reflection',
      title: 'Weekly Positivity Growth',
      message: 'Great news! Your composite wellness index rose by +12% this week compared to last week.',
      timestamp: '2 days ago',
      read: true,
      icon: HeartHandshake,
      color: 'peach'
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      if (onNotificationCountChange) {
        onNotificationCountChange(updated.filter(n => !n.read).length);
      }
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      if (onNotificationCountChange) {
        onNotificationCountChange(0);
      }
      return updated;
    });
  };

  const deleteNotification = (id) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      if (onNotificationCountChange) {
        onNotificationCountChange(updated.filter(n => !n.read).length);
      }
      return updated;
    });
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'wellness') return n.type === 'wellness' || n.type === 'reflection';
    if (activeFilter === 'counselor') return n.type === 'counselor';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '900px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>Notifications</h1>
            {unreadCount > 0 && (
              <span className="badge badge-coral" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
            Stay updated on wellness insights, reminders, and counselor appointments
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="btn btn-outline btn-sm"
          >
            <CheckCheck size={16} /> Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
        {[
          { id: 'all', label: `All (${notifications.length})` },
          { id: 'unread', label: `Unread (${unreadCount})` },
          { id: 'wellness', label: 'Wellness & Insights' },
          { id: 'counselor', label: 'Appointments' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: activeFilter === tab.id ? 700 : 500,
              color: activeFilter === tab.id ? 'var(--primary-lavender)' : 'var(--text-secondary)',
              backgroundColor: activeFilter === tab.id ? 'var(--light-lavender)' : 'transparent',
              transition: 'var(--transition-fast)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredNotifications.length === 0 ? (
          <div className="card-glass" style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-secondary)' }}>
            <Bell size={36} color="var(--primary-lavender)" style={{ marginBottom: '12px', opacity: 0.6 }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', marginBottom: '6px' }}>No notifications to display</h3>
            <p style={{ fontSize: '0.9rem' }}>You are completely caught up!</p>
          </div>
        ) : (
          filteredNotifications.map(notif => {
            const IconComponent = notif.icon;
            return (
              <div
                key={notif.id}
                className="card-glass"
                style={{
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '18px',
                  borderLeft: notif.read ? '1px solid var(--border-light)' : '4px solid var(--primary-lavender)',
                  backgroundColor: notif.read ? '#FFFFFF' : 'rgba(238, 234, 254, 0.35)',
                  transition: 'var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1 }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: `var(--${notif.color === 'lavender' ? 'light-lavender' : notif.color === 'mint' ? 'mint-green-light' : notif.color === 'blue' ? 'soft-blue-light' : 'soft-peach-light'})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: notif.color === 'lavender' ? 'var(--primary-lavender)' : notif.color === 'mint' ? '#117863' : notif.color === 'blue' ? '#2E65C6' : '#C04E30',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <IconComponent size={20} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: notif.read ? 600 : 700, color: 'var(--text-dark)' }}>
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <span className="badge badge-lavender" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                          New
                        </span>
                      )}
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '8px' }}>
                      {notif.message}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <Clock size={12} />
                      <span>{notif.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="btn btn-outline btn-sm"
                      title="Mark as read"
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    >
                      <CheckCircle2 size={14} /> Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    style={{ color: 'var(--text-muted)', padding: '6px', cursor: 'pointer' }}
                    title="Delete notification"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
