import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  Music,
  Wind,
  Shield,
  Headphones,
  Sun,
  X,
  Volume2,
  VolumeX,
  CheckCircle2,
  Radio,
  RotateCcw,
  Moon,
  Flame,
  Heart
} from 'lucide-react';

// Comprehensive Curated Wellness Sessions with Sound Profiles
const WELLNESS_CATALOG = [
  {
    id: "w-overwhelm",
    title: "Overcoming Daily Overwhelm",
    category: "Motivational Content",
    duration: "6:00",
    durationSeconds: 360,
    icon: Sparkles,
    color: "peach",
    soundType: "motivational_ambient",
    description: "An uplifting audio reflection on breaking big challenges into clear, manageable micro-steps.",
    audioTone: "uplifting_harmony"
  },
  {
    id: "w-breathing",
    title: "5-Minute Diaphragmatic Breathing",
    category: "Breathing Exercises",
    duration: "5:00",
    durationSeconds: 300,
    icon: Wind,
    color: "mint",
    soundType: "breathing_chimes",
    description: "Rhythmic breathing pacer chimes that slow your heart rate and signal safety to your vagus nerve.",
    audioTone: "breath_waves"
  },
  {
    id: "w-sleep",
    title: "432Hz Deep Sleep & Restoration",
    category: "Sleep & Relaxation",
    duration: "15:00",
    durationSeconds: 900,
    icon: Moon,
    color: "lavender",
    soundType: "sleep_drone",
    description: "Gentle restorative 432Hz binaural drone designed to slow brainwave activity for effortless sleep.",
    audioTone: "binaural_sleep"
  },
  {
    id: "w-grounding",
    title: "5-4-3-2-1 Sensory Grounding Guide",
    category: "Stress Relief",
    duration: "4:30",
    durationSeconds: 270,
    icon: Shield,
    color: "blue",
    soundType: "ocean_grounding",
    description: "Oceanic pink noise and soft singing bowl harmonics to anchor you during acute stress or anxiety.",
    audioTone: "ocean_zen"
  },
  {
    id: "w-morning",
    title: "Morning Mindfulness & Clarity",
    category: "Guided Meditation",
    duration: "8:00",
    durationSeconds: 480,
    icon: Sun,
    color: "amber",
    soundType: "morning_chimes",
    description: "Gentle sunrise bells and warm harmonic pads to start your day with focus and presence.",
    audioTone: "sunrise_bells"
  },
  {
    id: "w-focus",
    title: "Calm Focus & Flow State Beats",
    category: "Stress Relief",
    duration: "12:00",
    durationSeconds: 720,
    icon: Headphones,
    color: "blue",
    soundType: "lofi_ambient",
    description: "Soothing ambient warmth and subtle rhythmic pulse to quiet background distractions.",
    audioTone: "focus_ambient"
  }
];

export const WellnessPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeItem, setActiveItem] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  // Web Audio Context & Nodes Ref
  const audioCtxRef = useRef(null);
  const soundNodesRef = useRef([]);
  const gainNodeRef = useRef(null);
  const timerRef = useRef(null);

  const categories = [
    'All',
    'Guided Meditation',
    'Breathing Exercises',
    'Stress Relief',
    'Sleep & Relaxation',
    'Motivational Content'
  ];

  const filteredResources = selectedCategory === 'All'
    ? WELLNESS_CATALOG
    : WELLNESS_CATALOG.filter(r => r.category === selectedCategory);

  // Format seconds to M:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  // Start Real Web Audio Synthesis based on track tone
  const startAudioSynthesis = (toneType) => {
    stopAudioSynthesis();

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : volume * 0.4, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      const nodes = [];

      if (toneType === 'binaural_sleep') {
        // 432Hz Binaural Beat
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(432, ctx.currentTime);
        osc2.frequency.setValueAtTime(436, ctx.currentTime); // 4Hz delta wave

        const g1 = ctx.createGain();
        const g2 = ctx.createGain();
        g1.gain.setValueAtTime(0.3, ctx.currentTime);
        g2.gain.setValueAtTime(0.3, ctx.currentTime);

        osc1.connect(g1);
        osc2.connect(g2);
        g1.connect(masterGain);
        g2.connect(masterGain);

        osc1.start();
        osc2.start();
        nodes.push(osc1, osc2);

      } else if (toneType === 'breath_waves') {
        // Low resonant breathing wave with LFO modulation
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, ctx.currentTime);

        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // ~8 sec breathing cycle

        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(0.25, ctx.currentTime);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.35, ctx.currentTime);

        lfo.connect(oscGain.gain);
        osc.connect(oscGain);
        oscGain.connect(masterGain);

        lfo.start();
        osc.start();
        nodes.push(osc, lfo);

      } else if (toneType === 'ocean_zen' || toneType === 'focus_ambient') {
        // Ocean / Pink Noise filtered wave
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();
        nodes.push(whiteNoise);

      } else {
        // Warm Harmonic Chord Drone (Motivational & Meditation)
        const freqs = [216, 270, 324, 432];
        freqs.forEach(f => {
          const osc = ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, ctx.currentTime);

          const g = ctx.createGain();
          g.gain.setValueAtTime(0.12, ctx.currentTime);

          osc.connect(g);
          g.connect(masterGain);
          osc.start();
          nodes.push(osc);
        });
      }

      soundNodesRef.current = nodes;
    } catch (e) {
      console.warn('[Web Audio Playback Info]:', e);
    }
  };

  const stopAudioSynthesis = () => {
    if (soundNodesRef.current) {
      soundNodesRef.current.forEach(node => {
        try { node.stop(); } catch (e) {}
        try { node.disconnect(); } catch (e) {}
      });
      soundNodesRef.current = [];
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch (e) {}
      audioCtxRef.current = null;
    }
  };

  // Handle Play/Pause
  const handleTogglePlay = (item) => {
    if (activeItem?.id === item.id) {
      if (isPlaying) {
        setIsPlaying(false);
        if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
          audioCtxRef.current.suspend();
        }
      } else {
        setIsPlaying(true);
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        } else {
          startAudioSynthesis(item.audioTone);
        }
      }
    } else {
      setActiveItem(item);
      setCurrentTime(0);
      setIsPlaying(true);
      startAudioSynthesis(item.audioTone);
    }
  };

  // Timer Tick when playing
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (activeItem && prev >= activeItem.durationSeconds) {
            setIsPlaying(false);
            stopAudioSynthesis();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, activeItem]);

  // Handle Volume Change
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(isMuted ? 0 : volume * 0.4, audioCtxRef.current.currentTime);
    }
  }, [volume, isMuted]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopAudioSynthesis();
      clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Title Header */}
      <div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>Wellness & Relaxation Discovery</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
          Explore interactive guided meditations, calming soundscapes, and breathing exercises
        </p>
      </div>

      {/* Category Pills Header */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Active Ambient Audio Banner */}
      <div className="card-glass" style={{
        background: 'linear-gradient(135deg, #F8F7FF 0%, #EEEAFE 100%)',
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '0.875rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary-lavender)', fontWeight: 700 }}>
          <Radio size={20} className={isPlaying ? 'animate-pulse-soft' : ''} />
          <span>Interactive Web Audio Relaxation Engine Active</span>
        </div>
        <span style={{ color: 'var(--text-secondary)' }}>
          Real-time binaural relaxation & breathing waves synthesized in-browser
        </span>
      </div>

      {/* Wellness Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {filteredResources.map(resource => {
          const IconComponent = resource.icon;
          const isThisActive = activeItem?.id === resource.id;
          const isThisPlaying = isThisActive && isPlaying;

          return (
            <div
              key={resource.id}
              className="card-glass"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '28px',
                border: isThisActive ? '2px solid var(--primary-lavender)' : '1px solid var(--border-light)',
                boxShadow: isThisActive ? 'var(--shadow-md)' : 'var(--shadow-sm)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span className={`badge badge-${resource.color}`}>
                    {resource.category}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {resource.duration}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--light-lavender)',
                    color: 'var(--primary-lavender)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <IconComponent size={20} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem' }}>{resource.title}</h3>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  {resource.description}
                </p>
              </div>

              <button
                onClick={() => handleTogglePlay(resource)}
                className={`btn btn-sm ${isThisPlaying ? 'btn-mint' : 'btn-primary'}`}
                style={{ width: '100%', gap: '10px' }}
              >
                {isThisPlaying ? (
                  <>
                    <Pause size={16} /> Pause Session
                  </>
                ) : (
                  <>
                    <Play size={16} /> {isThisActive ? 'Resume Session' : 'Stream Session'}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Audio Player Modal with Real Controls */}
      {activeItem && (
        <div className="modal-overlay">
          <div className="modal-card animate-fade-in" style={{ textAlign: 'center', maxWidth: '480px' }}>
            <button
              onClick={() => {
                setIsPlaying(false);
                stopAudioSynthesis();
                setActiveItem(null);
              }}
              style={{ position: 'absolute', top: '18px', right: '18px', color: 'var(--text-secondary)' }}
            >
              <X size={20} />
            </button>

            <span className={`badge badge-${activeItem.color}`} style={{ marginBottom: '12px' }}>
              {activeItem.category}
            </span>

            <h3 style={{ fontSize: '1.35rem', marginBottom: '8px' }}>{activeItem.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px' }}>
              {activeItem.description}
            </p>

            {/* Audio Wave Visualizer Simulation */}
            <div style={{
              background: 'var(--bg-lavender)',
              borderRadius: 'var(--radius-md)',
              padding: '28px',
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px'
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8B7CF6 0%, #6C9BF2 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isPlaying ? '0 8px 28px rgba(139, 124, 246, 0.45)' : '0 4px 14px rgba(139, 124, 246, 0.2)',
                transition: 'var(--transition-normal)'
              }}>
                <Volume2 size={32} className={isPlaying ? 'animate-pulse-soft' : ''} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: isPlaying ? '#117863' : 'var(--text-secondary)' }}>
                  {isPlaying ? '● Playing Audio Session' : 'Paused'}
                </span>
              </div>

              {/* Progress Slider */}
              <div style={{ width: '100%', marginTop: '6px' }}>
                <input
                  type="range"
                  min="0"
                  max={activeItem.durationSeconds}
                  value={currentTime}
                  onChange={(e) => setCurrentTime(Number(e.target.value))}
                  style={{
                    width: '100%',
                    accentColor: 'var(--primary-lavender)',
                    cursor: 'pointer'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  <span>{formatTime(currentTime)}</span>
                  <span>{activeItem.duration}</span>
                </div>
              </div>
            </div>

            {/* Volume Control */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
              <button
                onClick={() => setIsMuted(!isMuted)}
                style={{ color: 'var(--text-secondary)', padding: '4px' }}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                style={{
                  width: '120px',
                  accentColor: 'var(--primary-lavender)',
                  cursor: 'pointer'
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', minWidth: '32px' }}>
                {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
              </span>
            </div>

            {/* Playback Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  setCurrentTime(0);
                  if (!isPlaying) {
                    setIsPlaying(true);
                    startAudioSynthesis(activeItem.audioTone);
                  }
                }}
                className="btn btn-outline btn-sm"
                title="Restart Session"
              >
                <RotateCcw size={16} /> Restart
              </button>

              <button
                onClick={() => handleTogglePlay(activeItem)}
                className="btn btn-primary btn-sm"
                style={{ flex: 1 }}
              >
                {isPlaying ? (
                  <>
                    <Pause size={16} /> Pause Session
                  </>
                ) : (
                  <>
                    <Play size={16} /> Resume Session
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
