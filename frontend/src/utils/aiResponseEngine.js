/**
 * MindCare AI - Client-side Context-Aware AI Companion & NLP Engine
 * Provides immediate, intelligent, and context-dependent responses
 * when operating both standalone or as an instant fallback.
 */

export function analyzeEmotionClient(text) {
  const lower = text.toLowerCase();

  // Emotion Keyword / Pattern dictionaries
  const joyKeywords = ['happy', 'great', 'awesome', 'amazing', 'excited', 'good', 'wonderful', 'joy', 'proud', 'love', 'selected', 'won', 'passed', 'celebrate', 'smile', 'laugh', 'funny'];
  const anxietyKeywords = ['anxious', 'scared', 'panic', 'nervous', 'worried', 'stress', 'overwhelm', 'overwhelmed', 'exam', 'test', 'finals', 'interview', 'deadline', 'pressure', 'terrified'];
  const sadnessKeywords = ['sad', 'depressed', 'crying', 'cry', 'lonely', 'alone', 'hurt', 'heartbroken', 'hopeless', 'grief', 'miserable', 'empty', 'lost', 'exhausted', 'tired'];
  const angerKeywords = ['angry', 'mad', 'furious', 'annoyed', 'irritated', 'betrayed', 'hate', 'frustrated', 'unfair', 'fight', 'argument'];

  let joyScore = joyKeywords.filter(w => lower.includes(w)).length * 20;
  let anxietyScore = anxietyKeywords.filter(w => lower.includes(w)).length * 25;
  let sadnessScore = sadnessKeywords.filter(w => lower.includes(w)).length * 25;
  let angerScore = angerKeywords.filter(w => lower.includes(w)).length * 25;

  let primaryEmotion = 'Neutral';
  let confidence = 75;
  let riskScore = 'Low';

  if (anxietyScore > 0 && anxietyScore >= joyScore && anxietyScore >= sadnessScore && anxietyScore >= angerScore) {
    primaryEmotion = 'Anxiety / Stress';
    confidence = Math.min(95, 70 + anxietyScore);
    riskScore = anxietyScore > 40 ? 'Moderate' : 'Low';
  } else if (sadnessScore > 0 && sadnessScore >= joyScore && sadnessScore >= anxietyScore && sadnessScore >= angerScore) {
    primaryEmotion = 'Sadness / Low Energy';
    confidence = Math.min(95, 70 + sadnessScore);
    riskScore = sadnessScore > 40 ? 'Moderate' : 'Low';
  } else if (angerScore > 0 && angerScore >= joyScore && angerScore >= anxietyScore && angerScore >= sadnessScore) {
    primaryEmotion = 'Anger / Frustration';
    confidence = Math.min(95, 70 + angerScore);
    riskScore = 'Low';
  } else if (joyScore > 0) {
    primaryEmotion = 'Joy / Positive';
    confidence = Math.min(98, 75 + joyScore);
    riskScore = 'Low';
  }

  const signals = {
    stress: anxietyScore > 20 ? 'Moderate (55%)' : 'Low (15%)',
    anxiety: anxietyScore > 0 ? `${Math.min(90, 30 + anxietyScore)}%` : 'Low (10%)',
    positivity: joyScore > 0 ? `${Math.min(95, 50 + joyScore)}%` : (primaryEmotion === 'Neutral' ? 'Moderate (50%)' : 'Low (20%)'),
    neutrality: primaryEmotion === 'Neutral' ? 'High (70%)' : 'Moderate (35%)'
  };

  return {
    primaryEmotion,
    confidence,
    signals,
    riskScore,
    rawLabel: primaryEmotion.toLowerCase().split(' ')[0]
  };
}

export function generateClientResponse(userMessage, history = []) {
  const msg = userMessage.trim();
  const lower = msg.toLowerCase();
  const emotion = analyzeEmotionClient(userMessage);

  const hasLaughter = /[\u{1F600}-\u{1F64F}]/u.test(msg) && (lower.includes('😂') || lower.includes('🤣') || lower.includes('lol') || lower.includes('lmao') || lower.includes('haha'));

  // 1. Specific Intent Matching
  if (hasLaughter || lower.includes('cant stop laughing') || lower.includes("can't stop laughing")) {
    return {
      response: "I love that energy! 😂 There's nothing quite like a genuine laughing fit to instantly lighten your mood and release tension.\n\nLaughter releases endorphins and naturally lowers cortisol. What was so funny? I'd love to hear what got you laughing so hard!",
      detected_emotion: 'Joy / Humor',
      confidence: 94,
      signals: { stress: "Low (5%)", anxiety: "Low (5%)", positivity: "High (95%)", neutrality: "Low (10%)" },
      risk_score: "Low",
      recommendations: "Savor these uplifting moments—they build lasting emotional resilience."
    };
  }

  if (lower.includes('weather') || lower.includes('temperature') || lower.includes('forecast')) {
    return {
      response: "As an AI mental wellness companion, I don't have direct access to real-time GPS weather sensors or local forecasts! 🌦️\n\nYou can quickly check your device's weather app for today's forecast. If the weather is pleasant outside, taking a short 10-minute walk in the fresh air and natural sunlight is a wonderful way to boost your mood and reset your mind.",
      detected_emotion: 'Curious / Neutral',
      confidence: 85,
      signals: emotion.signals,
      risk_score: "Low",
      recommendations: "A brief walk in natural sunlight supports healthy circadian rhythms."
    };
  }

  if (lower.includes('space') || lower.includes('universe') || lower.includes('galaxy') || lower.includes('astronomy') || lower.includes('stars')) {
    return {
      response: "Here's one of my favorite mind-expanding facts about space:\n\nWhen astronauts view Earth from orbit, many experience what psychologists call the **'Overview Effect'**—a profound cognitive shift seeing our fragile planet as a unified, borderless home suspended in the vast cosmos.\n\nAlso, nearly every atom in your body—the iron in your blood, the calcium in your bones—was forged in the heart of ancient dying stars billions of years ago. You are literally made of stardust. ✨\n\nDoes contemplating the scale of the universe bring you a sense of calm, curiosity, or wonder?",
      detected_emotion: 'Curious / Wonder',
      confidence: 88,
      signals: emotion.signals,
      risk_score: "Low",
      recommendations: "Contemplative practices foster cognitive perspective and reduce micro-stressors."
    };
  }

  if (lower.includes('sleep better') || lower.includes('insomnia') || lower.includes("can't sleep") || lower.includes('cant sleep') || lower.includes('how to sleep')) {
    return {
      response: "Here are 5 evidence-based strategies to help your mind and body ease into restful sleep:\n\n1. **Screen Curfew (45 mins)**: Turn off blue-light devices before bed to allow your brain's natural melatonin production to kick in.\n2. **Cool Room Temperature**: Aim for a bedroom temperature around 65°F (18°C)—a drop in core body temperature signals sleepiness.\n3. **Brain Dump Journal**: If racing thoughts keep you awake, write them all down on paper to 'park' them until tomorrow.\n4. **4-7-8 Breathing**: Inhale for 4s, hold for 7s, exhale slowly for 8s to trigger your parasympathetic nervous system.\n5. **Consistent Rise Time**: Waking up at the same time every morning stabilizes your circadian rhythm.\n\nWould you like to try the 432Hz sleep session in our Wellness Center?",
      detected_emotion: 'Fatigue / Rest Seeking',
      confidence: 86,
      signals: { stress: "Moderate (40%)", anxiety: "Moderate (35%)", positivity: "Moderate (45%)", neutrality: "Moderate (50%)" },
      risk_score: "Low",
      recommendations: "Practice 5 minutes of guided diaphragmatic breathing before lying down."
    };
  }

  if (lower.includes('dream college') || lower.includes('got into') || lower.includes('selected') || lower.includes('dream job') || lower.includes('passed my') || lower.includes('promoted')) {
    return {
      response: "🎉 Wow, huge congratulations! Reaching this milestone is a massive achievement!\n\nThat success is the direct outcome of all the hard work, persistence, and dedication you put in behind the scenes. Make sure to pause and truly let this victory sink in.\n\nHow do you plan on celebrating? And what are you looking forward to most in this exciting new chapter?",
      detected_emotion: 'Joy / Celebration',
      confidence: 96,
      signals: { stress: "Low (5%)", anxiety: "Low (10%)", positivity: "High (95%)", neutrality: "Low (15%)" },
      risk_score: "Low",
      recommendations: "Acknowledge your progress and share this joyous milestone with loved ones."
    };
  }

  if (lower.includes('exam') || lower.includes('test') || lower.includes('finals') || lower.includes('midterm') || lower.includes('studying')) {
    return {
      response: "I hear you loud and clear. Exam and academic stress can feel overwhelming because of the pressure to perform.\n\nLet's steady your focus right now:\n• **Deep Exhale**: Take a slow breath in for 4 seconds, and release it for 6 seconds. This calms physical tension.\n• **Micro-Goals**: Instead of trying to tackle everything at once, choose just ONE topic for a 20-minute focused sprint.\n\nWhich specific subject or concept is weighing on your mind the most right now?",
      detected_emotion: 'Academic Stress',
      confidence: 90,
      signals: { stress: "High (70%)", anxiety: "Moderate (65%)", positivity: "Low (20%)", neutrality: "Low (25%)" },
      risk_score: "Moderate",
      recommendations: "Break study material into 25-minute Pomodoro blocks with regular rest intervals."
    };
  }

  if (lower.includes('angry') || lower.includes('fight') || lower.includes('betrayed') || lower.includes('mad at') || lower.includes('argument')) {
    return {
      response: "I completely acknowledge your feelings. When someone crosses our boundaries or causes hurt, anger is a very natural and protective reaction.\n\nGiving yourself space to process that energy without judgment is healthy. When you feel ready, talking through what happened can help bring clarity on how to respond.\n\nWhat happened that triggered this frustration? I'm here to listen.",
      detected_emotion: 'Anger / Boundary Conflict',
      confidence: 87,
      signals: { stress: "Moderate (60%)", anxiety: "Moderate (40%)", positivity: "Low (15%)", neutrality: "Low (30%)" },
      risk_score: "Low",
      recommendations: "Take a pause to let acute adrenaline settle before responding to interpersonal friction."
    };
  }

  if (lower.includes('lonely') || lower.includes('alone') || lower.includes('isolated') || lower.includes('nobody cares')) {
    return {
      response: "I want you to know that I hear you, and carrying a sense of loneliness can be deeply exhausting. Please remember that feeling isolated right now does not mean you are unworthy of connection or care.\n\nReaching out and expressing how you feel is a brave step. Has this feeling been building up over time, or did a specific event make you feel disconnected recently?",
      detected_emotion: 'Loneliness / Vulnerability',
      confidence: 91,
      signals: { stress: "Moderate (50%)", anxiety: "Moderate (55%)", positivity: "Low (10%)", neutrality: "Low (35%)" },
      risk_score: "Moderate",
      recommendations: "Consider booking a warm 1-on-1 check-in with a verified counselor in Counselor Connect."
    };
  }

  // 2. Emotion-based Adaptive Fallback
  if (emotion.primaryEmotion.includes('Anxiety')) {
    return {
      response: `I sense that you're navigating some anxiety or tension right now (${emotion.confidence}% sentiment).\n\nWhen our thoughts start accelerating, bringing our attention back to physical sensations can help ground us. Take one gentle breath with me.\n\nWhat is the main concern or thought circulating in your mind? We can untangle it step by step.`,
      detected_emotion: emotion.primaryEmotion,
      confidence: emotion.confidence,
      signals: emotion.signals,
      risk_score: emotion.riskScore,
      recommendations: "Try a 3-minute sensory grounding exercise in the Wellness Center."
    };
  }

  if (emotion.primaryEmotion.includes('Sadness')) {
    return {
      response: `I hear the weight in what you're sharing, and I want you to know this is a safe, judgment-free space.\n\nYou don't have to carry everything by yourself or force yourself to feel positive right away. Take whatever time you need.\n\nWould you like to share a bit more about what's been feeling heavy lately?`,
      detected_emotion: emotion.primaryEmotion,
      confidence: emotion.confidence,
      signals: emotion.signals,
      risk_score: emotion.riskScore,
      recommendations: "Allow yourself time for gentle self-care and soothing activities today."
    };
  }

  if (emotion.primaryEmotion.includes('Joy')) {
    return {
      response: `It's truly uplifting to read your positive message! (${emotion.confidence}% positivity detected).\n\nTaking note of what brings you happiness helps rewire the mind toward gratitude and vitality.\n\nWhat else has been going well for you today?`,
      detected_emotion: emotion.primaryEmotion,
      confidence: emotion.confidence,
      signals: emotion.signals,
      risk_score: emotion.riskScore,
      recommendations: "Log this positive moment in your Mood Journal to reflect upon later."
    };
  }

  // Default Open / Reflective Dialogue
  return {
    response: `Thank you for sharing that with me. I am here and listening attentively.\n\nHow is your day unfolding overall, and what's on your mind right now?`,
    detected_emotion: 'Attentive / Neutral',
    confidence: 78,
    signals: emotion.signals,
    risk_score: "Low",
    recommendations: "Continue taking moments for mindfulness and daily reflection."
  };
}
