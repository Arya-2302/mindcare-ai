import sys
import urllib.request
import json

# Set standard output encoding to utf-8 safe
sys.stdout.reconfigure(encoding='utf-8')

test_messages = [
    ("I have an exam tomorrow and I am terrified.", "Text Anxiety"),
    ("My friend completely ignored me today and I feel terrible.", "Text Sadness"),
    ("I finally got selected for my dream internship!", "Text Joy"),
    ("I am extremely angry at my roommate right now.", "Text Anger"),
    ("What are some ways to sleep better?", "Informational Query"),
    ("I am fine 😊", "Emoji Happiness"),
    ("I am fine 😭", "Emoji Sadness/Distress"),
    ("Feeling very lonely today :(", "Emoticon Sadness/Loneliness"),
    ("So excited about this! :D", "Emoticon Joy"),
]

print("=== DISTILBERT & EMOJI MULTIMODAL EMOTION CLASSIFIER TEST ===")
for msg, desc in test_messages:
    req = urllib.request.Request(
        "http://localhost:8000/api/emotion/analyze",
        data=json.dumps({"text": msg}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    res = json.loads(urllib.request.urlopen(req).read().decode("utf-8"))
    print(f"\n[{desc}] Input: \"{msg}\"")
    print(f"  -> Detected Emotion: {res.get('primary_emotion')} ({res.get('confidence_percentage')}%)")
    print(f"  -> Signals: {res.get('signals')}")

print("\n=== AI COMPANION CONTEXT-AWARE CHAT TEST ===")
chat_examples = [
    "I have an exam tomorrow and I am terrified.",
    "I am fine 😭",
    "What are some ways to sleep better?"
]
for msg in chat_examples:
    req = urllib.request.Request(
        "http://localhost:8000/api/chat/message",
        data=json.dumps({"user_id": "usr-test", "session_id": "sess-test", "message": msg}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    res = json.loads(urllib.request.urlopen(req).read().decode("utf-8"))
    print(f"\n[User Message]: \"{msg}\"")
    print(f"  [Emotion Insight]: {res.get('detected_emotion')} ({res.get('confidence')}%)")
    print(f"  [AI Contextual Response]:\n{res.get('response')}\n")
