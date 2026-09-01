"""
MindCare AI - Global Mental Health Intelligence & Risk Benchmarking Service
Uses the trained Random Forest Epidemiological Model to benchmark user distress levels
against real global epidemiological prevalence data.
"""
import os
import json
import joblib
import numpy as np

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "trained_epidemiology_model.joblib")
JSON_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "global_mental_health_summary.json")

class MentalHealthEpidemiologyService:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.summary_data = {}
        self.is_loaded = False
        self.load_model()

    def load_model(self):
        if os.path.exists(MODEL_PATH) and os.path.exists(JSON_PATH):
            try:
                artifacts = joblib.load(MODEL_PATH)
                self.model = artifacts.get("model")
                self.scaler = artifacts.get("scaler")
                with open(JSON_PATH, "r", encoding="utf-8") as f:
                    self.summary_data = json.load(f)
                self.is_loaded = True
                print("[Epidemiology Service] Trained ML Model & Global Benchmarks loaded.")
            except Exception as e:
                print(f"[Epidemiology Service Notice]: {e}")
                self.is_loaded = False
        else:
            self.is_loaded = False

    def predict_burden_and_distress(self, depression_score: float, anxiety_score: float, bipolar_score: float = 0.5):
        """
        Uses trained Random Forest Regressor to predict total mental health burden and composite distress index.
        """
        if not self.is_loaded or not self.model or not self.scaler:
            return {
                "predicted_total_burden_pct": round(depression_score + anxiety_score + bipolar_score, 2),
                "composite_distress_index": round((depression_score * 8.5) + (anxiety_score * 7.0), 1),
                "is_ml_inferred": False
            }

        # Scale features: [Year (current=2026), Depression_Share, Anxiety_Share, Bipolar_Share]
        dep_share = max(0.5, min(15.0, depression_score / 10.0))
        anx_share = max(0.5, min(15.0, anxiety_score / 10.0))
        bip_share = max(0.1, min(5.0, bipolar_score))

        X = np.array([[2026, dep_share, anx_share, bip_share]])
        X_scaled = self.scaler.transform(X)
        pred = self.model.predict(X_scaled)[0]

        return {
            "predicted_total_burden_pct": round(float(pred[0]), 2),
            "composite_distress_index": round(float(pred[1]), 1),
            "predicted_eating_disorder_risk": round(float(pred[2]), 3),
            "is_ml_inferred": True
        }

    def get_benchmarks(self, country: str = "World"):
        """
        Returns global and national mental health prevalence benchmarks.
        """
        countries = self.summary_data.get("countries", {})
        matched_key = next((k for k in countries if k.lower() == country.lower()), "World")
        return {
            "global_averages": {
                "depression_pct": self.summary_data.get("global_average_depression_pct", 3.5),
                "anxiety_pct": self.summary_data.get("global_average_anxiety_pct", 4.3),
                "total_burden_pct": self.summary_data.get("global_average_total_burden_pct", 9.2)
            },
            "country_benchmark": countries.get(matched_key, countries.get("World", {}))
        }

epidemiology_service = MentalHealthEpidemiologyService()
