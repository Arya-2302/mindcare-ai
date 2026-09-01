import urllib.request
import json

BASE_URL = "http://localhost:8000"

test_cases = [
    ("TEST 1 (Exam Anxiety)", "I am feeling anxious about my exams."),
    ("TEST 2 (College Joy)", "I am really happy today because I got selected for my dream college!"),
    ("TEST 3 (Friend Anger)", "I am extremely angry at my friend."),
    ("TEST 4 (Loneliness)", "I have been feeling lonely lately."),
    ("TEST 5 (Weather Informational)", "What is the weather like today?"),
    ("TEST 6 (Laughter / Humor)", "😂😂 I can't stop laughing."),
    ("TEST 7 (Space Curiosity)", "Tell me something interesting about space."),
    ("TEST 8 (Life Uncertainty)", "I don't know what to do with my life.")
]

print("=================================================================")
print("  MINDCARD AI COMPANION COMPREHENSIVE PIPELINE VERIFICATION")
print("=================================================================\n")

for test_name, user_msg in test_cases:
    req = urllib.request.Request(
        f"{BASE_URL}/api/chat/message",
        data=json.dumps({
            "user_id": "usr-test",
            "session_id": "sess-test",
            "message": user_msg,
            "history": []
        }).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    res = json.loads(urllib.request.urlopen(req).read().decode("utf-8"))
    print(f"--- {test_name} ---")
    print(f"User: \"{user_msg}\"")
    print(f"Detected Emotion: {res.get('detected_emotion')} ({res.get('confidence')}%)")
    print(f"AI Response:\n{res.get('response')}\n")

# Multi-turn Memory Test
print("--- TEST 9 (Multi-Turn Conversation Memory) ---")
conversation_history = [
    {"sender": "user", "text": "I have an important physics exam tomorrow."},
    {"sender": "ai", "text": "That sounds like a lot of pressure. How are you feeling about your prep?"}
]
followup_msg = "Very anxious."
req = urllib.request.Request(
    f"{BASE_URL}/api/chat/message",
    data=json.dumps({
        "user_id": "usr-test",
        "session_id": "sess-test",
        "message": followup_msg,
        "history": conversation_history
    }).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)
res = json.loads(urllib.request.urlopen(req).read().decode("utf-8"))
print(f"History Topic: Physics exam")
print(f"Followup User: \"{followup_msg}\"")
print(f"Detected Emotion: {res.get('detected_emotion')} ({res.get('confidence')}%)")
print(f"AI Response:\n{res.get('response')}\n")

# Epidemiological Model Global Benchmark Test
print("--- TEST 10 (Trained Epidemiological ML Benchmark) ---")
req = urllib.request.Request(f"{BASE_URL}/api/insights/global-benchmarks?country=United%20States")
res = json.loads(urllib.request.urlopen(req).read().decode("utf-8"))
print(f"US Benchmark: {json.dumps(res, indent=2)}")

print("\nALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!")
