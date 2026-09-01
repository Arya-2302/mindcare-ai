"""
MindCare AI - Global Mental Health Epidemiological Model Training Pipeline
Trains a Machine Learning predictive model on global mental disorder prevalence and burden datasets.
Generates:
  1. `backend/data/trained_epidemiology_model.joblib` (RandomForestRegressor + Preprocessing Pipeline)
  2. `backend/data/global_mental_health_summary.json` (Country & Global Benchmarks)
"""
import os
import json
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score
import joblib

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "mental_disorders_prevalence.csv")
MODEL_OUT = os.path.join(os.path.dirname(__file__), "data", "trained_epidemiology_model.joblib")
JSON_OUT = os.path.join(os.path.dirname(__file__), "data", "global_mental_health_summary.json")

def train_model():
    print(f"[Training Pipeline] Loading dataset from {DATA_PATH}...")
    df = pd.read_csv(DATA_PATH)
    
    # Rename columns for clarity
    df.columns = [
        "Entity", "Code", "Year",
        "Schizophrenia_Share", "Depression_Share",
        "Anxiety_Share", "Bipolar_Share", "Eating_Disorders_Share"
    ]

    # Feature Engineering:
    # 1. Total Disorder Burden Index
    df["Total_Mental_Health_Burden"] = (
        df["Depression_Share"] + df["Anxiety_Share"] + df["Bipolar_Share"] +
        df["Schizophrenia_Share"] + df["Eating_Disorders_Share"]
    )
    
    # 2. Anxiety-to-Depression Ratio
    df["Anxiety_Depression_Ratio"] = df["Anxiety_Share"] / (df["Depression_Share"] + 1e-5)
    
    # 3. Composite Distress Score (Normalized 0-100)
    df["Composite_Distress_Index"] = (
        (df["Depression_Share"] * 8.5) + (df["Anxiety_Share"] * 7.0) + (df["Bipolar_Share"] * 5.0)
    )

    print(f"[Dataset Stats] Processed {len(df)} country-year records across {df['Entity'].nunique()} entities.")

    # Train a Multi-Output Regression Model predicting Disorder Burden & Distress Index from Year & Emotional Prevalence Signals
    feature_cols = ["Year", "Depression_Share", "Anxiety_Share", "Bipolar_Share"]
    target_cols = ["Total_Mental_Health_Burden", "Composite_Distress_Index", "Eating_Disorders_Share"]

    X = df[feature_cols]
    y = df[target_cols]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    print("[Training Pipeline] Training Multi-Output Random Forest Regressor...")
    model = MultiOutputRegressor(
        RandomForestRegressor(n_estimators=100, max_depth=8, random_state=42)
    )
    model.fit(X_train_scaled, y_train)

    # Evaluate
    y_pred = model.predict(X_test_scaled)
    r2 = r2_score(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    print(f"[Evaluation] Model R² Score: {r2:.4f} | MSE: {mse:.4f}")

    # Save artifacts
    artifacts = {
        "model": model,
        "scaler": scaler,
        "feature_cols": feature_cols,
        "target_cols": target_cols,
        "r2_score": r2,
        "mse": mse,
        "training_samples": len(df)
    }

    os.makedirs(os.path.dirname(MODEL_OUT), exist_ok=True)
    joblib.dump(artifacts, MODEL_OUT)
    print(f"[Artifact Saved] Model binary saved to {MODEL_OUT}")

    # Compute Global & Country Benchmarks for real-time telemetry comparison
    country_summary = {}
    for country, group in df.groupby("Entity"):
        latest = group.sort_values("Year").iloc[-1]
        country_summary[country] = {
            "code": str(latest.get("Code", "")),
            "latest_year": int(latest["Year"]),
            "depression_share_pct": round(float(latest["Depression_Share"]), 2),
            "anxiety_share_pct": round(float(latest["Anxiety_Share"]), 2),
            "bipolar_share_pct": round(float(latest["Bipolar_Share"]), 2),
            "total_burden_pct": round(float(latest["Total_Mental_Health_Burden"]), 2),
            "composite_distress_index": round(float(latest["Composite_Distress_Index"]), 1)
        }

    global_stats = {
        "global_average_depression_pct": round(float(df["Depression_Share"].mean()), 2),
        "global_average_anxiety_pct": round(float(df["Anxiety_Share"].mean()), 2),
        "global_average_total_burden_pct": round(float(df["Total_Mental_Health_Burden"].mean()), 2),
        "countries": country_summary
    }

    with open(JSON_OUT, "w", encoding="utf-8") as f:
        json.dump(global_stats, f, indent=2)
    print(f"[Artifact Saved] Epidemiological summary saved to {JSON_OUT}")
    print("[Training Complete] ML Mental Health Epidemiological Model trained successfully!")

if __name__ == "__main__":
    train_model()
