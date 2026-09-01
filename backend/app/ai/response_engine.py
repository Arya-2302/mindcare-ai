"""
MindCare AI - Dynamic Context-Aware & Memory-Enabled Response Engine
Connects DistilBERT Emotion Classification, Multimodal Emojis,
Conversation History, and Subject/Intent Extraction to generate
personalized, non-repetitive responses.
"""
import re

def _extract_subject_from_history(history: list) -> str:
    """
    Scans recent conversation history to identify the persistent topic
    (e.g., exams, friendship conflict, job search, loneliness).
    """
    if not history:
        return None

    # Look at recent user messages
    recent_user_texts = [
        msg.get("text", "").lower()
        for msg in reversed(history)
        if isinstance(msg, dict) and msg.get("sender") == "user"
    ][:3]

    combined = " ".join(recent_user_texts)

    if any(k in combined for k in ["exam", "test", "quiz", "finals", "midterm", "studying"]):
        return "exams"
    if any(k in combined for k in ["friend", "best friend", "roommate", "partner", "relationship"]):
        return "relationships"
    if any(k in combined for k in ["college", "university", "internship", "job", "career", "dream"]):
        return "career_academic"
    if any(k in combined for k in ["lonely", "alone", "isolated", "isolation"]):
        return "loneliness"
    if any(k in combined for k in ["sleep", "insomnia", "tired", "wake up"]):
        return "sleep"

    return None

def generate_contextual_response(user_message: str, emotion_data: dict, history: list = None) -> str:
    msg = user_message.strip()
    msg_lower = msg.lower()

    primary_emotion = emotion_data.get("primary_emotion", "Neutral")
    confidence = emotion_data.get("confidence", 75)
    raw_label = emotion_data.get("raw_label", "neutral")

    # Inherit persistent topic from history if user's current message is brief
    history_subject = _extract_subject_from_history(history) if history else None

    # Check for emojis/laughter
    has_laughing_emojis = any(em in msg for em in ["😂", "🤣", "😆", "😄", "😹", "rofl", "lmao", "lol"]) or "can't stop laughing" in msg_lower or "cant stop laughing" in msg_lower

    response_text = ""

    # =========================================================================
    # 1. SPECIAL TOPIC & INTENT HANDLING
    # =========================================================================

    # --- A. Humor & Uncontrollable Laughter ---
    if has_laughing_emojis:
        response_text = (
            "I love that energy! 😂 There's nothing quite like a genuine laughing fit to instantly lighten your mood and release tension.\n\n"
            "Laughter releases endorphins and naturally lowers cortisol. What was so funny? I'd love to hear what got you laughing so hard!"
        )

    # --- B. Weather Queries ---
    elif any(k in msg_lower for k in ["weather", "temperature", "forecast", "is it raining", "is it sunny"]):
        response_text = (
            "As an AI mental wellness companion, I don't have direct access to real-time GPS weather sensors or local forecasts! 🌦️\n\n"
            "You can quickly check your device's weather app for today's forecast. If the weather is pleasant outside, taking a short 10-minute walk in the fresh air and natural sunlight is a wonderful way to boost your mood and reset your mind."
        )

    # --- C. Space & Curiosity Queries ---
    elif any(k in msg_lower for k in ["space", "universe", "galaxy", "astronomy", "cosmos", "stars", "planet"]):
        response_text = (
            "Here's one of my favorite mind-expanding facts about space:\n\n"
            "When astronauts view Earth from orbit, many experience what psychologists call the **'Overview Effect'**—a profound cognitive shift seeing our fragile planet as a unified, borderless home suspended in the vast cosmos.\n\n"
            "Also, nearly every atom in your body—the iron in your blood, the calcium in your bones—was forged in the heart of ancient dying stars billions of years ago. You are literally made of stardust. ✨\n\n"
            "Does contemplating the scale of the universe bring you a sense of calm, curiosity, or wonder?"
        )

    # --- D. Life Direction & Existential Uncertainty ---
    elif any(k in msg_lower for k in ["don't know what to do with my life", "dont know what to do with my life", "lost in life", "no purpose", "feel aimless", "what to do with my life"]):
        response_text = (
            "It takes immense honesty to admit when you feel lost about your life's direction. Feeling uncertain or without a clear roadmap is actually a very normal, human transition phase, even though it feels uncomfortable.\n\n"
            "You don't need to have the next five or ten years figured out right now. When the big picture feels overwhelming, we zoom in to just today:\n"
            "1. What is one small activity or topic that brought you even a flicker of curiosity or peace recently?\n"
            "2. What is a core value (like creativity, helping others, independence, or learning) that matters to you?\n\n"
            "We can explore this together step by step. What has been making you feel most uncertain lately?"
        )

    # --- E. College / Dream School / Job / Career Achievement ---
    elif any(k in msg_lower for k in ["dream college", "got into college", "selected for my dream", "dream job", "got selected", "got the job", "passed my", "promoted", "won the", "dream internship"]):
        target = "dream college" if "college" in msg_lower or "university" in msg_lower or "school" in msg_lower else "dream achievement"
        if "job" in msg_lower:
            target = "dream job"
        elif "internship" in msg_lower:
            target = "dream internship"

        response_text = (
            f"🎉 Wow, huge congratulations! Getting selected for your {target} is a massive milestone!\n\n"
            "That achievement is the direct result of all the effort, persistence, and late hours you dedicated to your goals. Take a moment today to truly savor this feeling and give yourself the credit you deserve.\n\n"
            "How are you planning to celebrate this victory? And what are you looking forward to most about this new chapter?"
        )

    # --- F. Exam / Test / Academic Anxiety (or follow-up about exams) ---
    elif any(k in msg_lower for k in ["exam", "exams", "test tomorrow", "finals", "midterm", "terrified of failing", "studying for"]) or (history_subject == "exams" and any(k in msg_lower for k in ["anxious", "scared", "nervous", "worried", "panic", "can't focus", "stressed"])):
        response_text = (
            "I hear you loud and clear. Exam anxiety is one of the most intense forms of stress because your mind feels under constant evaluation.\n\n"
            "Let's ground your nervous system right now:\n"
            "• **One breath at a time**: Take a slow inhale through your nose for 4 seconds, and exhale slowly for 6 seconds. This physically slows your heart rate.\n"
            "• **Micro-Focus**: Rather than trying to master the entire syllabus at once, pick just ONE specific concept to review in a focused 20-minute block.\n\n"
            "Which subject or topic is causing the most pressure right now? We can break it down together."
        )

    # --- G. Interpersonal Conflict / Anger at Friend or Roommate ---
    elif any(k in msg_lower for k in ["angry at my friend", "angry with my friend", "furious at my friend", "mad at my friend", "angry at my roommate", "fight with my", "betrayed by", "argument with"]) or (raw_label == "anger" and any(k in msg_lower for k in ["friend", "roommate", "they did", "she said", "he said"])):
        response_text = (
            "I completely acknowledge your anger. When someone close to you—especially a friend—does something hurtful or dismissive, anger is a completely natural reaction that signals a boundary has been crossed.\n\n"
            "It's healthy to acknowledge that heat instead of bottling it up. To handle this without regret:\n"
            "1. Give yourself permission to feel angry right now without taking impulsive action.\n"
            "2. When the acute intensity cools down, you can decide whether you want to communicate your boundary clearly or take space.\n\n"
            "What did your friend do that triggered this frustration? I'm here to listen and help you process it."
        )

    # --- H. Loneliness / Social Isolation ---
    elif any(k in msg_lower for k in ["feeling lonely", "feel lonely", "lonely lately", "feel so alone", "isolated", "nobody to talk to", "no close friends", "nobody cares"]):
        response_text = (
            "I want you to know that I hear you, and feeling lonely is a genuinely heavy and aching emotion to carry. It's easy for our minds to convince us that everyone else is connected and we are the only ones on the outside.\n\n"
            "Please remember that feeling lonely does not mean you are unlovable or unworthy of deep connection. Even sharing that feeling here is a courageous step of reaching out.\n\n"
            "Has this feeling of distance been building up over time, or did something specific happen recently that made you feel isolated?"
        )

    # --- I. Sleep / Insomnia Informational Query ---
    elif any(k in msg_lower for k in ["sleep better", "insomnia", "can't sleep", "cant sleep", "how to sleep", "improve sleep"]):
        response_text = (
            "Here are 5 evidence-based strategies to help your mind and body ease into restful sleep:\n\n"
            "1. **Screen Curfew (45 mins)**: Turn off blue-light devices before bed to allow your brain's natural melatonin production to kick in.\n"
            "2. **Cool Room Temperature**: Aim for a bedroom temperature around 65°F (18°C)—a drop in core body temperature signals sleepiness.\n"
            "3. **Brain Dump Journal**: If racing thoughts keep you awake, write them all down on paper to 'park' them until tomorrow.\n"
            "4. **4-7-8 Breathing**: Inhale for 4s, hold for 7s, exhale slowly for 8s to trigger your parasympathetic nervous system.\n"
            "5. **Consistent Rise Time**: Waking up at the same time every morning (even weekends) stabilizes your circadian rhythm.\n\n"
            "Would you like to try a soothing guided breathing session in the Wellness Center?"
        )

    # =========================================================================
    # 2. EMOTION-GUIDED CONVERSATIONAL ADAPTATION
    # =========================================================================
    if not response_text:
        if raw_label in ["fear", "anxiety"] or "Anxiety" in primary_emotion:
            response_text = (
                f"I sense that you're carrying a noticeable amount of anxiety or fear right now ({confidence}% detected sentiment).\n\n"
                "When anxious feelings arise, our thoughts tend to race ahead into 'what-if' scenarios. "
                "Let's bring your focus back to this present moment where you are safe. Take a slow, gentle breath with me.\n\n"
                "What is the main thought or worry on your mind right now? Talking it through can help take the edge off."
            )
        elif raw_label == "sadness" or "Sadness" in primary_emotion:
            response_text = (
                f"I can feel the emotional weight and sadness in what you're experiencing ({confidence}% detected sentiment).\n\n"
                "It's completely okay to not be okay right now. You don't have to put on a brave face or rush to fix how you feel. "
                "I am here to sit with you in this space without any judgment.\n\n"
                "Would you like to share more about what has been feeling so heavy?"
            )
        elif raw_label in ["joy", "love"] or "Joy" in primary_emotion or "Positive" in primary_emotion:
            response_text = (
                f"It is wonderful to feel the positive energy and brightness in your message! ({confidence}% detected positivity).\n\n"
                "Pausing to acknowledge and celebrate these uplifting moments builds deep emotional resilience and joy.\n\n"
                "What else is bringing a smile to your face today?"
            )
        elif raw_label == "anger" or "Anger" in primary_emotion:
            response_text = (
                f"I hear the strong frustration and anger in what you shared ({confidence}% intensity).\n\n"
                "Anger is a very valid emotion—it usually tells us that something important has felt unjust, disrespectful, or boundary-crossing. "
                "Giving yourself space to vent it constructively is healthy.\n\n"
                "What led up to this situation? Feel free to share whatever you need to get off your chest."
            )
        else:
            # Neutral / Open dialogue
            response_text = (
                f"Thank you for checking in. I'm listening closely to your thoughts.\n\n"
                "How has the rest of your day been treating you so far? Let me know what's on your mind or how I can best support you right now."
            )

    # =========================================================================
    # 3. DEBUG LOGGING (Requirement 9)
    # =========================================================================
    print("=" * 60)
    print(f"[DEBUG] USER MESSAGE: {user_message}")
    print(f"[DEBUG] DETECTED EMOTION: {primary_emotion}")
    print(f"[DEBUG] CONFIDENCE: {confidence}% (Raw: {raw_label})")
    print(f"[DEBUG] CONVERSATION HISTORY COUNT: {len(history) if history else 0}")
    print(f"[DEBUG] GENERATED RESPONSE:\n{response_text}")
    print("=" * 60)

    return response_text
