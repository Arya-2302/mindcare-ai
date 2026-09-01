import re
from pydantic import BaseModel, field_validator
from typing import Optional, Dict, Any, List

class UserLogin(BaseModel):
    email: str
    password: str
    role: Optional[str] = "patient"

    @field_validator("email")
    def validate_email(cls, v):
        clean_v = v.strip().lower()
        if not clean_v or "@" not in clean_v or "." not in clean_v:
            raise ValueError("Please provide a valid email address.")
        return clean_v

    @field_validator("password")
    def validate_password(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError("Password cannot be empty.")
        return v

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "patient"
    license_id: Optional[str] = None

    @field_validator("name")
    def validate_name(cls, v):
        clean_v = v.strip()
        if not clean_v:
            raise ValueError("Full Name cannot be empty.")
        return clean_v

    @field_validator("email")
    def validate_email(cls, v):
        clean_v = v.strip().lower()
        email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        if not re.match(email_regex, clean_v):
            raise ValueError("Please enter a valid email address.")
        return clean_v

    @field_validator("password")
    def validate_password(cls, v):
        if not v or len(v) < 6:
            raise ValueError("Password must be at least 6 characters long.")
        return v

class ChatRequest(BaseModel):
    user_id: str
    session_id: str
    message: str
    history: Optional[List[Dict[str, Any]]] = []

class ChatResponse(BaseModel):
    response: str
    detected_emotion: str
    confidence: int
    signals: Dict[str, str]
    risk_score: str
    recommendations: str

class MoodLogCreate(BaseModel):
    mood: str
    score: int
    emoji: str
    note: Optional[str] = ""

class AppointmentCreate(BaseModel):
    counselor_id: str
    counselor_name: str
    date: str
    time: str
    notes: Optional[str] = ""
