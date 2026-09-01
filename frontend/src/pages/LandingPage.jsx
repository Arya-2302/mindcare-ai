import React from 'react';
import {
  Sparkles,
  Bot,
  Brain,
  Smile,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
  Clock,
  Shield
} from 'lucide-react';
import { Navbar } from '../components/Navbar';

export const LandingPage = ({ setCurrentView }) => {
  return (
    <div className="app-container">
      <Navbar currentView="landing" setCurrentView={setCurrentView} />

      {/* HERO SECTION */}
      <section style={{
        background: 'linear-gradient(180deg, #F8F7FF 0%, #FFFFFF 100%)',
        padding: '80px 24px 60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          alignItems: 'center'
        }}>
          <div>
            {/* Trust Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--light-lavender)',
              color: 'var(--primary-lavender)',
              fontWeight: 700,
              fontSize: '0.85rem',
              marginBottom: '24px'
            }}>
              <Sparkles size={16} /> Intelligent Mental Wellness Ecosystem
            </div>

            <h1 style={{
              fontSize: '3.4rem',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '20px',
              fontFamily: 'var(--font-heading)'
            }}>
              Your mental wellness, <span style={{ color: 'var(--primary-lavender)' }}>understood.</span>
            </h1>

            <p style={{
              fontSize: '1.2rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '32px',
              maxWidth: '540px'
            }}>
              AI-powered emotional support, personalized wellness, and professional care — all in one safe space.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
              <button 
                onClick={() => setCurrentView('register')}
                className="btn btn-primary"
                style={{ padding: '16px 32px', fontSize: '1.05rem' }}
              >
                Start Your Wellness Journey <ArrowRight size={18} />
              </button>
              <a 
                href="#how-it-works"
                className="btn btn-outline"
                style={{ padding: '16px 28px', fontSize: '1.05rem' }}
              >
                Explore How It Works
              </a>
            </div>

            {/* Trust Indicators */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: 600
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={16} color="#8B7CF6" /> Private & Secure
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} color="#6C9BF2" /> Available 24/7
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="#8FD8C8" /> HIPAA Ready Design
              </span>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div style={{ position: 'relative' }}>
            <div style={{
              background: 'linear-gradient(135deg, #EEEAFE 0%, #EBF2FE 50%, #FDF3F0 100%)',
              borderRadius: 'var(--radius-lg)',
              padding: '36px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-light)',
              position: 'relative'
            }}>
              {/* Floating UI Elements */}
              <div className="card-glass animate-pulse-soft" style={{
                marginBottom: '20px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'var(--light-lavender)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-lavender)'
                }}>
                  <Bot size={26} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary-lavender)', fontWeight: 700 }}>AI COMPANION</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-dark)' }}>"How are you feeling today?"</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Empathetic listener & non-judgmental guide</div>
                </div>
              </div>

              <div className="card-glass" style={{
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#117863', fontWeight: 700 }}>EMOTIONAL WELLNESS SCORE</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)' }}>72 <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/ 100</span></div>
                  <span className="badge badge-mint">Doing Well (+12% this week)</span>
                </div>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  border: '6px solid var(--mint-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  color: 'var(--text-dark)'
                }}>
                  72%
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section id="features" style={{ padding: '80px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px' }}>
            <div style={{ color: 'var(--primary-lavender)', fontWeight: 800, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              COMPLETE WELLNESS ECOSYSTEM
            </div>
            <h2 style={{ fontSize: '2.4rem', marginTop: '8px', fontFamily: 'var(--font-heading)' }}>
              Intelligent Care Built Around You
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '12px' }}>
              Combining conversational AI, sentiment intelligence, mood analytics, and licensed therapist care.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '32px'
          }}>
            {/* Feature Card 1 */}
            <div className="card-glass" style={{ padding: '32px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'var(--light-lavender)',
                color: 'var(--primary-lavender)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Bot size={28} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '10px' }}>AI Wellness Assistant</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                24/7 conversational emotional support in a completely private space. Reflect on your thoughts without judgement.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="card-glass" style={{ padding: '32px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'var(--soft-blue-light)',
                color: '#2E65C6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Brain size={28} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '10px' }}>Emotion Intelligence</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Understand underlying emotional patterns, stress triggers, and positive signals powered by NLP models.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="card-glass" style={{ padding: '32px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'var(--mint-green-light)',
                color: '#117863',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Smile size={28} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '10px' }}>Mood Tracking</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Track daily mood scores, visualize weekly trends, and keep private journal reflections over time.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="card-glass" style={{ padding: '32px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'var(--soft-peach-light)',
                color: '#C04E30',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Sparkles size={28} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '10px' }}>Personalized Wellness</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Receive tailored meditation exercises, relaxing ambient music therapy, and grounding mindfulness tools.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="card-glass" style={{ padding: '32px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'var(--light-lavender)',
                color: 'var(--primary-lavender)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <HeartHandshake size={28} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '10px' }}>Counselor Connect</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Seamlessly connect with licensed psychologists and counselors when human guidance is needed.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="card-glass" style={{ padding: '32px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'var(--amber-light)',
                color: '#B45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '10px' }}>Smart Safety Alerts</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Identify concerning emotional trajectories and safely trigger counselor intervention notifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        backgroundColor: '#25253A',
        color: '#FFFFFF',
        padding: '60px 24px 32px',
        borderTop: '1px solid var(--border-light)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '32px',
          marginBottom: '40px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Sparkles size={24} color="#8B7CF6" />
              <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                MindCare AI
              </span>
            </div>
            <p style={{ color: '#A0A0B5', maxWidth: '340px', fontSize: '0.9rem' }}>
              Intelligent mental wellness and telehealth platform combining supportive AI and human care.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '12px', fontSize: '0.9rem', color: '#EEEAFE' }}>Platform</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#A0A0B5' }}>
                <a href="#features">AI Assistant</a>
                <a href="#features">Mood Tracking</a>
                <a href="#features">Wellness Center</a>
                <a href="#features">Counselor Connect</a>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: '12px', fontSize: '0.9rem', color: '#EEEAFE' }}>Roles</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#A0A0B5' }}>
                <button onClick={() => setCurrentView('register')} style={{ color: '#A0A0B5', textAlign: 'left' }}>Patient Portal</button>
                <button onClick={() => setCurrentView('login')} style={{ color: '#A0A0B5', textAlign: 'left' }}>Counselor Portal</button>
                <button onClick={() => setCurrentView('login')} style={{ color: '#A0A0B5', textAlign: 'left' }}>Admin Portal</button>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: '#A0A0B5',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>© 2026 MindCare AI. All rights reserved.</div>
          <div>MindCare AI is an emotional wellness platform and does not replace medical advice.</div>
        </div>
      </footer>
    </div>
  );
};
