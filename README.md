# MindCare AI - Smart Telehealth & Mental Wellness Ecosystem 🌿

**MindCare AI** is an intelligent, production-grade telehealth and mental wellness web application. It combines 24/7 AI-powered emotional support, NLP sentiment analysis, interactive mood tracking, personalized relaxation tools, and licensed counselor telehealth escalation.

---

## 🌟 Key Features & Highlights

- **3 Dedicated User Portals**:
  1. **Patient Workspace**: Mood check-in, circular wellness score (72/100), AI companion chat with expandable sentiment insights, weekly trends, wellness discovery, and counselor booking.
  2. **Counselor Workspace**: Caseload overview, patient risk overview table with mint/amber/soft coral badges, clinical alert triage center, and patient medical profile history.
  3. **Administrator Workspace**: Platform activity stats, verified counselor management, user tables, and system telemetry monitoring.
- **🎨 Premium Healthcare Design**: Calming light theme using soft lavender (`#8B7CF6`), mint green (`#8FD8C8`), soft blue (`#6C9BF2`), and warm peach (`#F7C7B8`).
- **⚡ 1-Click Demo Persona Bar**: Instant top banner allowing evaluators to switch seamlessly between Patient, Counselor, and Admin personas.
- **🤖 Modular AI Architecture**: Abstracted `EmotionAnalysisService` ready for HuggingFace **DistilBERT** & **RoBERTa** transformers.
- **⚠️ Non-Alarmist Safety Triage**: Empathetic intervention modal (*"We noticed you may be going through a difficult moment"*) providing direct counselor booking and emergency resources.

---

## 🔑 Demo Credentials

Use these credentials or click any avatar in the **DEMO MODE** top bar:

| Role | Email | Password | Features |
|---|---|---|---|
| **Patient** | `patient@demo.com` | `demo1234` | AI Chat, Mood Analytics, Wellness, Counselor Booking |
| **Counselor** | `counselor@demo.com` | `demo1234` | Risk Table, Clinical Alerts Triage, Patient Profiles |
| **Admin** | `admin@demo.com` | `demo1234` | System Analytics, User Management |

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Lucide React Icons, Recharts, Custom CSS Design System
- **Backend**: Python 3.13, FastAPI, Uvicorn, Pydantic, SQLAlchemy, JWT Auth
- **Database**: SQLite (Development) / PostgreSQL & MongoDB ready schemas
- **AI / NLP**: DistilBERT & RoBERTa sentiment classification abstraction

---

## 📂 Project Structure

```
mindcare-ai/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI (Navbar, Sidebar, MoodSelector, CircularProgress, etc.)
│   │   ├── context/          # AuthContext & Demo Role Switcher
│   │   ├── pages/            # Landing, Auth, Patient, Counselor, Admin & Settings
│   │   ├── utils/            # Realistic mock data generators
│   │   ├── App.jsx           # Master App & Navigation controller
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Design tokens & CSS variables
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── app/
│   │   ├── ai/               # EmotionAnalysisService (DistilBERT / RoBERTa wrapper)
│   │   ├── schemas/          # Pydantic request/response models
│   │   └── main.py           # FastAPI application routes
│   └── requirements.txt
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🚀 Local Quickstart Instructions

### 1. Install & Launch Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will start at: **http://localhost:5173**

### 2. Install & Launch FastAPI Backend
In a separate terminal window:
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
The backend API documentation will start at: **http://localhost:8000/docs**

---

## 🔌 Connecting Real DistilBERT / RoBERTa Models

To connect actual HuggingFace PyTorch models:

1. Install transformers and torch in backend:
   ```bash
   pip install transformers torch
   ```
2. In `backend/app/ai/emotion_service.py`, set:
   ```python
   from transformers import pipeline
   self.classifier = pipeline("text-classification", model="bhadresh-savani/distilbert-base-uncased-emotion")
   ```
3. Update `analyze_text()` to return raw model logits and softmax confidence scores.

---

## 🌐 Deploying to Vercel (Frontend)

The frontend is fully configured for Vercel:

1. Import the `mindcare-ai/frontend` directory into your Vercel Dashboard.
2. Add Environment Variable:
   ```env
   VITE_API_URL=https://your-backend-api-url.com
   ```
3. Click **Deploy**.
