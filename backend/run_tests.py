import urllib.request
import json

test_cases = [
    ("I have an exam tomorrow and I am terrified.", "Exam Panic / Anxiety"),
    ("My friend completely ignored me today and I feel terrible.", "Friend Distance / Sadness"),
    ("I finally got selected for my dream internship!", "Internship Success / Joy"),
    ("I am extremely angry at my roommate right now.", "Conflict / Anger"),
    ("What are some ways to sleep better?", "Informational Query"),
    ("I am fine 😊", "Emoji Happiness"),
    ("I am fine 😭", "Emoji Sadness/Distress"),
    ("Feeling very lonely today :(", "Emoticon Sadness"),
    ("So excited about this! :D", "Emoticon Joy")
]

with open("test_results.txt", "w", encoding="utf-8") as f:
    f.write("=== DISTILBERT & EMOJI MULTIMODAL EMOTION TEST RESULTS ===\n\n")
    for msg, label in test_cases:
        req = urllib.request.Request(
            "http://localhost:8000/api/emotion/analyze",
            data=json.dumps({"text": msg}).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        res = json.loads(urllib.request.urlopen(req).read().decode("utf-8"))
        f.write(f"[{label}] Input: \"{msg}\"\n")
        f.write(f"  -> Detected Emotion: {res.get('primary_emotion')} ({res.get('confidence_percentage')}%)\n")
        f.write(f"  -> Raw Model Label: {res.get('emotion')}\n")
        f.write(f"  -> Signals: {res.get('signals')}\n")
        f.write(f"  -> Risk Level: {res.get('risk_score')}\n\n")
    
    f.write("=== CHAT CONVERSATION ENDPOINT TESTS ===\n\n")
    chat_cases = [
        "I have an exam tomorrow and I am terrified.",
        "I am fine 😭",
        "What are some ways to sleep better?"
    ]
    for msg in chat_cases:
        req = urllib.request.Request(
            "http://localhost:8000/api/chat/message",
            data=json.dumps({"user_id": "usr-test", "session_id": "sess-test", "message": msg}).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        res = json.loads(urllib.request.urlopen(req).read().decode("utf-8"))
        f.write(f"[User Message]: \"{msg}\"\n")
        f.write(f"  [Emotion Card]: {res.get('detected_emotion')} ({res.get('confidence')}%)\n")
        f.write(f"  [AI Reply]:\n{res.get('response')}\n\n")

print("All tests written to test_results.txt")
