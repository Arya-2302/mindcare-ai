"""
MindCare AI - DistilBERT Emotion Classification & Multimodal Emoji/Emoticon Engine
Combines transformer NLP inference with fine-grained emoji/emoticon analysis
to detect emotions: Happiness, Sadness, Anger, Fear, Anxiety, Stress, Loneliness, and Neutral.
"""
import os
import re

# Comprehensive Emoji & Emoticon Sentiment Dictionaries
EMOJI_EMOTION_MAP = {
    # Joy / Happiness
    "😊": ("Joy", "joy", 0.90),
    "😄": ("Joy", "joy", 0.92),
    "😁": ("Joy", "joy", 0.90),
    "😂": ("Joy", "joy", 0.88),
    "🤣": ("Joy", "joy", 0.88),
    "😃": ("Joy", "joy", 0.88),
    "🥳": ("Joy", "joy", 0.95),
    "✨": ("Joy", "joy", 0.75),
    "🌟": ("Joy", "joy", 0.75),
    "🥰": ("Joy", "joy", 0.92),
    "😍": ("Positive", "love", 0.92),
    "❤️": ("Positive", "love", 0.90),
    "💖": ("Positive", "love", 0.90),
    "💕": ("Positive", "love", 0.88),
    "🙂": ("Calm / Positive", "joy", 0.70),
    "😌": ("Calm / Positive", "joy", 0.75),
    "😇": ("Calm / Positive", "joy", 0.80),

    # Sadness / Loneliness / Heartbreak
    "😢": ("Sadness", "sadness", 0.92),
    "😭": ("Sadness", "sadness", 0.95),
    "😞": ("Sadness", "sadness", 0.88),
    "😔": ("Sadness", "sadness", 0.88),
    "🥺": ("Sadness", "sadness", 0.82),
    "💔": ("Sadness", "sadness", 0.92),
    "😿": ("Sadness", "sadness", 0.85),
    "🙍‍♂️": ("Sadness", "sadness", 0.78),
    "🙍‍♀️": ("Sadness", "sadness", 0.78),
    "🥀": ("Sadness", "sadness", 0.80),

    # Anger / Frustration
    "😡": ("Anger", "anger", 0.95),
    "🤬": ("Anger", "anger", 0.98),
    "👿": ("Anger", "anger", 0.90),
    "😤": ("Anger", "anger", 0.82),
    "💢": ("Anger", "anger", 0.85),
    "😠": ("Anger", "anger", 0.90),

    # Anxiety / Fear / Panic
    "😰": ("Anxiety", "fear", 0.92),
    "😨": ("Anxiety", "fear", 0.90),
    "😱": ("Fear / Panic", "fear", 0.95),
    "🫣": ("Anxiety", "fear", 0.80),
    "😬": ("Anxiety", "fear", 0.75),
    "😓": ("Stress", "fear", 0.82),
    "🤯": ("Stress", "fear", 0.88),

    # Neutral
    "😐": ("Neutral", "neutral", 0.85),
    "😶": ("Neutral", "neutral", 0.85),
    "😑": ("Neutral", "neutral", 0.80),
    "🤷‍♂️": ("Neutral", "neutral", 0.70),
    "🤷‍♀️": ("Neutral", "neutral", 0.70),
    "🥱": ("Neutral", "neutral", 0.75),
}

EMOTICON_PATTERNS = [
    # Joy / Happiness emoticons
    (r"(:\)|:-\)|:D|:-D|:=D|=\)|;\)|;-\)|<3)", ("Joy", "joy", 0.85)),
    # Sadness emoticons
    (r"(:\(|:-\(|:'\(|:'-\(|=\(|:\[|:-\[|:\/|:-\/|:\\|:-\\)", ("Sadness", "sadness", 0.88)),
    # Anger emoticons
    (r"(>:\(|>:-\(|>:\/|:-@)", ("Anger", "anger", 0.90)),
    # Surprise / Fear emoticons
    (r"(:o|:-O|:O|8-O)", ("Surprised", "surprise", 0.80)),
]

# Friendly UI Label Mapping for DistilBERT Emotion Labels
EMOTION_LABEL_MAP = {
    "sadness": "Sadness",
    "joy": "Joy",
    "love": "Positive",
    "anger": "Anger",
    "fear": "Anxiety",
    "surprise": "Surprised",
    "neutral": "Neutral"
}

class EmotionAnalysisService:
    def __init__(self, model_name: str = "bhadresh-savani/distilbert-base-uncased-emotion"):
        self.model_name = model_name
        self.classifier = None
        self.is_transformer_loaded = False
        # Try loading model on init
        self.load_model()

    def load_model(self):
        """
        Loads HuggingFace DistilBERT emotion classification pipeline.
        """
        if self.is_transformer_loaded and self.classifier:
            return True

        try:
            from transformers import pipeline
            print(f"[MindCare ML Engine] Loading DistilBERT Emotion Model ({self.model_name})...")
            self.classifier = pipeline(
                "text-classification",
                model=self.model_name,
                return_all_scores=True
            )
            self.is_transformer_loaded = True
            print("[MindCare ML Engine] DistilBERT Emotion Model loaded successfully! Ready for inference.")
            return True
        except Exception as e:
            print(f"[MindCare ML Engine] Transformer load notice: {e}. Using multimodal NLP fallback.")
            self.is_transformer_loaded = False
            return False

    def _extract_emoji_emoticon_signals(self, text: str):
        """
        Scans text for emojis and ASCII emoticons to extract explicit emotional modifiers.
        """
        detected_emojis = []
        for char in text:
            if char in EMOJI_EMOTION_MAP:
                detected_emojis.append(EMOJI_EMOTION_MAP[char])

        detected_emoticons = []
        for pattern, data in EMOTICON_PATTERNS:
            if re.search(pattern, text):
                detected_emoticons.append(data)

        return detected_emojis + detected_emoticons

    def analyze_text(self, text: str) -> dict:
        """
        Performs holistic emotion classification:
        1. Emojis and emoticons are evaluated
        2. Transformer / NLP classification is performed
        3. Fused emotional context is returned
        """
        if not text or not text.strip():
            return {
                "primary_emotion": "Neutral",
                "confidence": 85,
                "raw_label": "neutral",
                "all_emotions": [{"label": "Neutral", "score": 0.85}],
                "signals": {"stress": "Low (10%)", "anxiety": "Low (10%)", "positivity": "Moderate (50%)", "neutrality": "High (85%)"},
                "risk_score": "Low",
                "recommendation": "Share how you are feeling today."
            }

        clean_text = text.strip()
        emoji_signals = self._extract_emoji_emoticon_signals(clean_text)

        # 1. DistilBERT Transformer Inference (if loaded)
        if not self.is_transformer_loaded:
            self.load_model()

        primary_emotion = None
        raw_label = None
        confidence = 75
        all_emotions = []

        if self.is_transformer_loaded and self.classifier:
            try:
                results = self.classifier(clean_text[:512])[0]
                sorted_results = sorted(results, key=lambda x: x["score"], reverse=True)
                top = sorted_results[0]
                raw_label = top["label"].lower()
                confidence = int(float(top["score"]) * 100)
                primary_emotion = EMOTION_LABEL_MAP.get(raw_label, raw_label.capitalize())

                all_emotions = [
                    {"label": EMOTION_LABEL_MAP.get(item["label"].lower(), item["label"].capitalize()), "score": round(item["score"], 2)}
                    for item in sorted_results[:4]
                ]
            except Exception as err:
                print(f"[MindCare ML Engine Inference Error]: {err}")
                primary_emotion = None

        # 2. If transformer wasn't used or if strong emoji modifier is present
        if emoji_signals and (not primary_emotion or len(clean_text.split()) <= 6 or emoji_signals[0][2] > 0.88):
            # Strongest emoji signal modifies or refines the emotion
            top_emoji = emoji_signals[0]
            # If text is e.g. "I am fine 😭", the emoji turns the primary emotion into Sadness!
            if top_emoji[1] in ["sadness", "anger", "fear", "joy", "love"]:
                primary_emotion = top_emoji[0]
                raw_label = top_emoji[1]
                confidence = int(top_emoji[2] * 100)
                all_emotions = [{"label": primary_emotion, "score": round(top_emoji[2], 2)}]

        # 3. Fallback NLP rule engine if no result yet
        if not primary_emotion:
            rule_result = self._rule_based_analysis(clean_text, emoji_signals)
            primary_emotion = rule_result["primary_emotion"]
            raw_label = rule_result["raw_label"]
            confidence = rule_result["confidence"]
            all_emotions = rule_result["all_emotions"]

        # Calculate signal percentages based on detected emotion & confidence
        stress_pct = 20
        anxiety_pct = 15
        positivity_pct = 45
        neutrality_pct = 35

        if raw_label in ["fear", "anxiety"] or "Anxiety" in primary_emotion:
            anxiety_pct = max(70, confidence)
            stress_pct = max(65, int(confidence * 0.85))
            positivity_pct = 15
            neutrality_pct = 10
        elif raw_label == "sadness" or "Sadness" in primary_emotion:
            stress_pct = max(55, int(confidence * 0.7))
            anxiety_pct = max(45, int(confidence * 0.6))
            positivity_pct = 10
            neutrality_pct = 20
        elif raw_label == "anger" or "Anger" in primary_emotion:
            stress_pct = max(80, confidence)
            anxiety_pct = 40
            positivity_pct = 10
            neutrality_pct = 15
        elif raw_label in ["joy", "love"] or "Joy" in primary_emotion or "Positive" in primary_emotion:
            positivity_pct = max(75, confidence)
            stress_pct = 15
            anxiety_pct = 10
            neutrality_pct = 30
        elif "Stress" in primary_emotion:
            stress_pct = max(75, confidence)
            anxiety_pct = max(60, int(confidence * 0.75))
            positivity_pct = 20
            neutrality_pct = 20
        elif "Loneliness" in primary_emotion:
            stress_pct = 50
            anxiety_pct = 55
            positivity_pct = 15
            neutrality_pct = 25

        risk_level = "Low"
        if anxiety_pct > 75 or stress_pct > 75 or (raw_label == "sadness" and confidence > 85):
            risk_level = "Moderate"
            if (anxiety_pct > 85 and stress_pct > 80) or (raw_label == "sadness" and confidence > 92):
                risk_level = "High"

        recommendation = "Continue engaging in daily mindfulness and personal reflection."
        if risk_level == "High":
            recommendation = "Consider scheduling a supportive virtual session with a licensed counselor."
        elif risk_level == "Moderate":
            recommendation = "Try a 5-minute deep diaphragmatic breathing or grounding exercise in the Wellness Center."

        return {
            "primary_emotion": primary_emotion,
            "confidence": confidence,
            "raw_label": raw_label,
            "all_emotions": all_emotions,
            "signals": {
                "stress": f"{'High' if stress_pct > 70 else 'Moderate' if stress_pct > 40 else 'Low'} ({stress_pct}%)",
                "anxiety": f"{'High' if anxiety_pct > 70 else 'Moderate' if anxiety_pct > 40 else 'Low'} ({anxiety_pct}%)",
                "positivity": f"{'High' if positivity_pct > 70 else 'Moderate' if positivity_pct > 40 else 'Low'} ({positivity_pct}%)",
                "neutrality": f"{'High' if neutrality_pct > 70 else 'Moderate'} ({neutrality_pct}%)"
            },
            "risk_score": risk_level,
            "recommendation": recommendation,
            "model_metadata": {
                "pipeline": self.model_name,
                "is_transformer": self.is_transformer_loaded
            }
        }

    def _rule_based_analysis(self, text: str, emoji_signals: list) -> dict:
        text_lower = text.lower()

        # Keyword dictionaries for all required emotions
        keywords = {
            "Anxiety": (["anxious", "anxiety", "scared", "worried", "nervous", "dread", "panic", "panicking", "terrified", "exam", "test", "racing thoughts"], "fear", 86),
            "Sadness": (["sad", "sadness", "crying", "depressed", "heartbroken", "hurt", "grief", "hopeless", "down", "terrible", "ignored", "awful"], "sadness", 85),
            "Anger": (["furious", "angry", "mad", "pissed", "hate", "frustrated", "annoyed", "roommate", "screaming", "rage"], "anger", 88),
            "Joy": (["happy", "joy", "excited", "internship", "dream", "yay", "celebrate", "great", "wonderful", "amazing", "passed", "selected", "proud"], "joy", 90),
            "Stress": (["stressed", "stress", "overwhelmed", "burnout", "can't cope", "exhausted", "too much", "pressure"], "fear", 84),
            "Loneliness": (["lonely", "alone", "isolated", "no one", "abandoned", "nobody cares", "empty"], "sadness", 83),
        }

        # Check keyword matches
        scores = {}
        for emotion, (word_list, raw, base_conf) in keywords.items():
            count = sum(1 for w in word_list if w in text_lower)
            if count > 0:
                scores[emotion] = (count, raw, min(95, base_conf + (count - 1) * 4))

        if emoji_signals:
            top_emoji = emoji_signals[0]
            if top_emoji[0] in scores:
                scores[top_emoji[0]] = (scores[top_emoji[0]][0] + 2, top_emoji[1], max(scores[top_emoji[0]][2], int(top_emoji[2] * 100)))
            else:
                scores[top_emoji[0]] = (2, top_emoji[1], int(top_emoji[2] * 100))

        if scores:
            best_emotion = max(scores.keys(), key=lambda k: (scores[k][0], scores[k][2]))
            raw = scores[best_emotion][1]
            conf = scores[best_emotion][2]
            return {
                "primary_emotion": best_emotion,
                "raw_label": raw,
                "confidence": conf,
                "all_emotions": [{"label": best_emotion, "score": round(conf / 100.0, 2)}]
            }

        return {
            "primary_emotion": "Neutral",
            "raw_label": "neutral",
            "confidence": 72,
            "all_emotions": [{"label": "Neutral", "score": 0.72}]
        }

emotion_engine = EmotionAnalysisService()
