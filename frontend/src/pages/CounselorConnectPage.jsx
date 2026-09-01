import React, { useState } from 'react';
import { COUNSELORS_LIST } from '../utils/mockData';
import {
  Star,
  Calendar,
  Clock,
  Video,
  Globe,
  HeartHandshake,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const CounselorConnectPage = () => {
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('2026-08-21');
  const [bookingTime, setBookingTime] = useState('3:00 PM');
  const [bookingNotes, setBookingNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleBook = (e) => {
    e.preventDefault();
    setConfirmed(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>Counselor Connect</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
          Connect with licensed mental health professionals for confidential telehealth consultations
        </p>
      </div>

      {/* Directory Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {COUNSELORS_LIST.map(counselor => (
          <div key={counselor.id} className="card-glass" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '28px' }}>
            <div>
              {/* Header Profile */}
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <img
                  src={counselor.avatar}
                  alt={counselor.name}
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--light-lavender)' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{counselor.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--primary-lavender)', fontWeight: 700 }}>
                    {counselor.specialization}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
                    <Star size={14} fill="#F59E0B" color="#F59E0B" />
                    <span>{counselor.rating}</span>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>({counselor.reviewsCount} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Specs List */}
              <div style={{
                background: 'var(--bg-lavender)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px',
                fontSize: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                  <Globe size={14} color="#8B7CF6" />
                  <span>Languages: {counselor.languages.join(', ')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                  <Video size={14} color="#6C9BF2" />
                  <span>Type: {counselor.consultationType}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#117863', fontWeight: 600 }}>
                  <Clock size={14} />
                  <span>{counselor.availability}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  setSelectedCounselor(counselor);
                  setShowBookingModal(true);
                  setConfirmed(false);
                }}
                className="btn btn-primary btn-sm"
                style={{ flex: 1 }}
              >
                <Calendar size={14} /> Book Session
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedCounselor && (
        <div className="modal-overlay">
          <div className="modal-card animate-fade-in" style={{ maxWidth: '520px' }}>
            <button 
              onClick={() => setShowBookingModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-secondary)' }}
            >
              <X size={20} />
            </button>

            {confirmed ? (
              <div style={{ textAlign: 'center', padding: '24px 12px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
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
                <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Appointment Requested!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '20px' }}>
                  Your session with <strong>{selectedCounselor.name}</strong> on <strong>{bookingDate} at {bookingTime}</strong> has been scheduled.
                </p>
                <button onClick={() => setShowBookingModal(false)} className="btn btn-primary btn-sm">
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'center' }}>
                  <img
                    src={selectedCounselor.avatar}
                    alt={selectedCounselor.name}
                    style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.2rem' }}>Book Session with {selectedCounselor.name}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--primary-lavender)', fontWeight: 600 }}>
                      {selectedCounselor.fee}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleBook}>
                  <div className="form-group">
                    <label className="form-label">Preferred Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preferred Time Slot</label>
                    <select
                      className="form-input"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                    >
                      <option value="9:00 AM">9:00 AM - 9:45 AM</option>
                      <option value="11:00 AM">11:00 AM - 11:45 AM</option>
                      <option value="3:00 PM">3:00 PM - 3:45 PM</option>
                      <option value="5:30 PM">5:30 PM - 6:15 PM</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Note for Counselor (Optional)</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      placeholder="Share any specific topics or goals for this session..."
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                    <button type="button" onClick={() => setShowBookingModal(false)} className="btn btn-outline btn-sm">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Confirm Booking
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
