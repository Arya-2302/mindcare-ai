import os
import uuid
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.schemas.schemas import UserLogin, UserRegister, ChatRequest, ChatResponse
from app.database.database import get_db, init_db, UserDB
from app.auth.security import get_password_hash, verify_password, create_access_token, decode_access_token
from app.ai.emotion_service import emotion_engine
from app.ai.response_engine import generate_contextual_response
from app.email.welcome_email import send_welcome_confirmation_email

app = FastAPI(
    title="MindCare AI Telehealth Backend",
    description="Real Database Persistence, Standard JWT Auth & DistilBERT Emotion Intelligence Engine",
    version="4.5.0"
)

# Initialize Database tables
init_db()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmotionAnalyzeRequest(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": "MindCare AI Telehealth & Emotion NLP Engine",
        "version": "4.5.0"
    }

from app.ai.epidemiology_service import epidemiology_service

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "database": "sqlite_database_active",
        "emotion_engine": emotion_engine.model_name,
        "transformer_loaded": emotion_engine.is_transformer_loaded,
        "epidemiology_model_loaded": epidemiology_service.is_loaded
    }

@app.get("/api/insights/global-benchmarks")
def get_global_benchmarks(country: str = "World"):
    return epidemiology_service.get_benchmarks(country)

@app.post("/api/emotion/analyze")
def analyze_emotion_endpoint(data: EmotionAnalyzeRequest):
    """
    Dedicated Modular Emotion NLP API Endpoint.
    Analyzes input text using DistilBERT model and returns structured classification metrics.
    """
    if not data.text or not data.text.strip():
        raise HTTPException(status_code=400, detail="Text field cannot be empty.")
    
    result = emotion_engine.analyze_text(data.text)
    return {
        "emotion": result.get("raw_label", "neutral"),
        "primary_emotion": result.get("primary_emotion", "Neutral"),
        "confidence": round(result.get("confidence", 70) / 100.0, 2),
        "confidence_percentage": result.get("confidence", 70),
        "all_emotions": result.get("all_emotions", []),
        "signals": result.get("signals", {}),
        "risk_score": result.get("risk_score", "Low"),
        "recommendation": result.get("recommendation", "")
    }

@app.post("/api/auth/register")
def register(data: UserRegister, db: Session = Depends(get_db)):
    clean_email = data.email.strip().lower()

    existing_user = db.query(UserDB).filter(UserDB.email == clean_email).first()
    if existing_user:
        raise HTTPException(
            status_code=400, 
            detail="An account with this email already exists."
        )

    user_id = f"usr-{uuid.uuid4().hex[:8]}"
    hashed_pwd = get_password_hash(data.password)

    new_user = UserDB(
        id=user_id,
        name=data.name.strip(),
        email=clean_email,
        hashed_password=hashed_pwd,
        role=data.role or "patient",
        license_id=data.license_id,
        email_verified=True
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    send_welcome_confirmation_email(
        recipient_email=new_user.email,
        recipient_name=new_user.name,
        role=new_user.role
    )

    return {
        "success": True,
        "message": "Account created successfully",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role
        }
    }

@app.post("/api/auth/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    clean_email = data.email.strip().lower()
    user = db.query(UserDB).filter(UserDB.email == clean_email).first()

    if not user:
        user_id = f"usr-{uuid.uuid4().hex[:8]}"
        hashed_pwd = get_password_hash(data.password or "demo1234")
        user = UserDB(
            id=user_id,
            name=clean_email.split('@')[0].capitalize(),
            email=clean_email,
            hashed_password=hashed_pwd,
            role=data.role or "patient",
            email_verified=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        if not verify_password(data.password, user.hashed_password):
            raise HTTPException(
                status_code=401, 
                detail="Invalid email or password credentials."
            )

    access_token = create_access_token(data={"sub": user.id, "email": user.email, "role": user.role})

    return {
        "success": True,
        "message": "Login successful!",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }

@app.get("/api/auth/me")
def get_me(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header.")
    
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Session expired or invalid JWT token.")
    
    user = db.query(UserDB).filter(UserDB.id == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
        
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }

@app.post("/api/chat/message", response_model=ChatResponse)
def handle_chat(data: ChatRequest):
    # 1. Run DistilBERT Emotion Classification Model
    emotion_analysis = emotion_engine.analyze_text(data.message)

    # 2. Generate Contextual AI Response based on message + emotion + confidence + history
    ai_reply = generate_contextual_response(
        user_message=data.message,
        emotion_data=emotion_analysis,
        history=data.history
    )

    return ChatResponse(
        response=ai_reply,
        detected_emotion=emotion_analysis.get("primary_emotion", "Neutral"),
        confidence=emotion_analysis.get("confidence", 75),
        signals=emotion_analysis.get("signals", {}),
        risk_score=emotion_analysis.get("risk_score", "Low"),
        recommendations=emotion_analysis.get("recommendation", "")
    )
