// MindCare AI Mock Dataset for Development & Demo Mode

export const DEMO_USERS = {
  patient: {
    id: "pat-101",
    name: "Arya Sharma",
    email: "patient@demo.com",
    role: "patient",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
    phone: "+1 (555) 234-5678",
    dob: "1997-04-15",
    joinedDate: "Jan 2026",
    wellnessScore: 72,
    wellnessStatus: "Doing well",
    streakDays: 5
  },
  counselor: {
    id: "coun-201",
    name: "Dr. Elena Vance, Psy.D.",
    email: "counselor@demo.com",
    role: "counselor",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&q=80",
    specialization: "Cognitive Behavioral Therapy (CBT), Anxiety & Stress Management",
    experience: "12 years",
    languages: "English, Spanish",
    rating: 4.9,
    reviewsCount: 128,
    availability: "Mon, Wed, Fri (9:00 AM - 5:00 PM)",
    bio: "Licensed Clinical Psychologist specializing in mindfulness-based stress reduction, holistic emotional wellness, and actionable CBT techniques."
  },
  admin: {
    id: "adm-301",
    name: "Sarah Jenkins",
    email: "admin@demo.com",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    title: "Chief System Administrator"
  }
};

export const INITIAL_MOOD_LOGS = [
  { id: "m1", date: "2026-08-13", mood: "Great", score: 85, note: "Went for a morning run in the park", emoji: "😄" },
  { id: "m2", date: "2026-08-14", mood: "Good", score: 75, note: "Productive workday, relaxed evening", emoji: "🙂" },
  { id: "m3", date: "2026-08-15", mood: "Okay", score: 62, note: "Slightly overwhelmed with deadlines", emoji: "😐" },
  { id: "m4", date: "2026-08-16", mood: "Low", score: 48, note: "Feeling drained and tired", emoji: "😔" },
  { id: "m5", date: "2026-08-17", mood: "Good", score: 70, note: "Practiced 10-min breathing exercise", emoji: "🙂" },
  { id: "m6", date: "2026-08-18", mood: "Great", score: 80, note: "Caught up with a close friend over coffee", emoji: "😄" },
  { id: "m7", date: "2026-08-19", mood: "Good", score: 72, note: "Feeling calm and centered this morning", emoji: "🙂" },
];

export const EMOTIONAL_SIGNALS_BREAKDOWN = {
  stress: 28,
  anxiety: 22,
  positivity: 64,
  neutrality: 38
};

export const INITIAL_CHAT_MESSAGES = [
  {
    id: "msg-1",
    sender: "ai",
    text: "Hi Arya! 👋 I'm your MindCare AI companion. I'm here to listen, reflect, and support you anytime in a completely safe, private space. How are you feeling today?",
    timestamp: "10:30 AM",
    insight: null
  },
  {
    id: "msg-2",
    sender: "user",
    text: "Honestly, I've been feeling a bit stressed about work projects this week. My mind keeps racing at night.",
    timestamp: "10:31 AM",
    insight: null
  },
  {
    id: "msg-3",
    sender: "ai",
    text: "Thank you for sharing that with me. It takes courage to acknowledge when work pressure is weighing on you. Nighttime racing thoughts often happen when our nervous system hasn't had time to wind down. Would you like to try a quick 3-minute grounding exercise or talk more about what's on your mind?",
    timestamp: "10:31 AM",
    insight: {
      primaryEmotion: "Stress",
      confidence: 78,
      signals: {
        stress: "Moderate-High (72%)",
        anxiety: "Moderate (55%)",
        positivity: "Low (20%)",
        neutrality: "Low (15%)"
      },
      riskScore: "Low",
      recommendation: "Try a 5-minute deep diaphragmatic breathing session before sleep."
    }
  }
];

export const WELLNESS_RESOURCES = [
  {
    id: "w1",
    title: "5-Minute Diaphragmatic Breathing",
    category: "Meditation",
    duration: "5 mins",
    icon: "Wind",
    color: "mint",
    description: "Slowing down your breath signals safety to your nervous system and quickly relieves tension.",
    type: "audio",
    url: "#"
  },
  {
    id: "w2",
    title: "Deep Relaxation & Sleep Soundscape",
    category: "Music Therapy",
    duration: "15 mins",
    icon: "Music",
    color: "lavender",
    description: "Ambient binaural soundwaves tuned to 432Hz to promote deep restorative sleep.",
    type: "music",
    url: "#"
  },
  {
    id: "w3",
    title: "5-4-3-2-1 Sensory Grounding Technique",
    category: "Exercises",
    duration: "4 mins",
    icon: "Shield",
    color: "blue",
    description: "Re-anchor yourself to the present moment using your 5 physical senses during acute anxiety.",
    type: "guide",
    url: "#"
  },
  {
    id: "w4",
    title: "Overcoming Daily Overwhelm",
    category: "Motivational Content",
    duration: "6 mins",
    icon: "Sparkles",
    color: "peach",
    description: "Short audio reflection on breaking big challenges into manageable micro-steps.",
    type: "podcast",
    url: "#"
  },
  {
    id: "w5",
    title: "Morning Calm Mindfulness Meditation",
    category: "Meditation",
    duration: "10 mins",
    icon: "Sun",
    color: "lavender",
    description: "Start your day with intention and non-judgmental awareness of your thoughts.",
    type: "audio",
    url: "#"
  },
  {
    id: "w6",
    title: "Focus & Flow State Instrumental",
    category: "Music Therapy",
    duration: "30 mins",
    icon: "Headphones",
    color: "blue",
    description: "Gentle lo-fi beats designed to increase cognitive clarity and calm task focus.",
    type: "music",
    url: "#"
  }
];

export const COUNSELORS_LIST = [
  {
    id: "c1",
    name: "Dr. Elena Vance, Psy.D.",
    specialization: "CBT, Anxiety & Stress Management",
    experience: "12 years",
    languages: ["English", "Spanish"],
    rating: 4.9,
    reviewsCount: 128,
    availability: "Today available at 3:00 PM",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&q=80",
    consultationType: "Video & Audio",
    fee: "$90 / session"
  },
  {
    id: "c2",
    name: "Dr. Marcus Thorne, Ph.D.",
    specialization: "Mindfulness, Depression & Resilience",
    experience: "15 years",
    languages: ["English"],
    rating: 4.95,
    reviewsCount: 184,
    availability: "Tomorrow available at 11:00 AM",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&q=80",
    consultationType: "Video Call",
    fee: "$100 / session"
  },
  {
    id: "c3",
    name: "Dr. Ananya Sharma, MD",
    specialization: "Holistic Telehealth & Sleep Disorders",
    experience: "9 years",
    languages: ["English", "Hindi"],
    rating: 4.88,
    reviewsCount: 96,
    availability: "Today available at 5:30 PM",
    avatar: "https://images.unsplash.com/photo-1594824813566-88855ce78341?auto=format&fit=crop&w=256&q=80",
    consultationType: "Video & Chat",
    fee: "$85 / session"
  },
  {
    id: "c4",
    name: "Dr. James Lin, LMFT",
    specialization: "Relationship & Work-Life Balance",
    experience: "10 years",
    languages: ["English", "Mandarin"],
    rating: 4.92,
    reviewsCount: 112,
    availability: "Thursday available at 2:00 PM",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=256&q=80",
    consultationType: "Video Call",
    fee: "$95 / session"
  }
];

export const COUNSELOR_PATIENTS_OVERVIEW = [
  {
    id: "p1",
    name: "Arya Sharma (Demo Patient)",
    age: 28,
    gender: "Female",
    mood: "Good",
    risk: "Low",
    lastActive: "10 mins ago",
    sessionsCount: 4,
    statusBadge: "Active",
    avgScore: 74,
    recentSignals: "Work stress (Moderate), Sleep anxiety (Low)"
  },
  {
    id: "p2",
    name: "Patient #8492 (Anonymous)",
    age: 34,
    gender: "Male",
    mood: "Low",
    risk: "Moderate",
    lastActive: "2 hours ago",
    sessionsCount: 2,
    statusBadge: "Needs Review",
    avgScore: 52,
    recentSignals: "Persistent anxiety, Isolation"
  },
  {
    id: "p3",
    name: "Patient #9103 (Anonymous)",
    age: 23,
    gender: "Other",
    mood: "Difficult",
    risk: "High",
    lastActive: "15 mins ago",
    sessionsCount: 6,
    statusBadge: "High Priority",
    avgScore: 38,
    recentSignals: "Acute emotional distress, Low positivity"
  },
  {
    id: "p4",
    name: "Liam Chen",
    age: 41,
    gender: "Male",
    mood: "Great",
    risk: "Low",
    lastActive: "1 day ago",
    sessionsCount: 8,
    statusBadge: "Stable",
    avgScore: 82,
    recentSignals: "Positive coping strategies"
  }
];

export const HIGH_RISK_ALERTS = [
  {
    id: "alt-1",
    patientId: "p3",
    patientName: "Patient #9103 (Anonymous User)",
    riskLevel: "High",
    detectedSignals: ["High stress (89%)", "Low positivity (12%)", "Repeated negative sentiment across 3 sessions"],
    timestamp: "15 minutes ago",
    status: "Unresolved",
    summary: "User expressed feeling completely overwhelmed and unable to sleep for 4 consecutive nights."
  },
  {
    id: "alt-2",
    patientId: "p2",
    patientName: "Patient #8492 (Anonymous)",
    riskLevel: "Moderate",
    detectedSignals: ["Elevated anxiety (68%)", "Social withdrawal indicators"],
    timestamp: "2 hours ago",
    status: "Reviewing",
    summary: "User logged mood as 'Low' three times this week with notes regarding burnout."
  }
];

export const APPOINTMENTS_LIST = [
  {
    id: "apt-1",
    patientName: "Arya Sharma",
    counselorName: "Dr. Elena Vance, Psy.D.",
    date: "2026-08-21",
    time: "3:00 PM - 3:45 PM",
    type: "Video Session",
    status: "Confirmed",
    notes: "Follow-up regarding anxiety reduction strategies."
  },
  {
    id: "apt-2",
    patientName: "Liam Chen",
    counselorName: "Dr. Elena Vance, Psy.D.",
    date: "2026-08-22",
    time: "10:00 AM - 10:45 AM",
    type: "Video Session",
    status: "Confirmed",
    notes: "Monthly check-in on stress coping mechanisms."
  }
];

export const ADMIN_STATS = {
  totalUsers: 1482,
  activePatients: 1120,
  verifiedCounselors: 34,
  completedSessions: 3840,
  wellnessActivitiesCompleted: 12950,
  activeAlerts: 2,
  systemStatus: "Healthy (All API Services Operational)"
};
