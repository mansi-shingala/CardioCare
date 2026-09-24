"""
Cardiovascular Disease Prediction API
-------------------------------------
FastAPI backend that:
1. Loads the trained model (model.pkl) and scaler (scaler.pkl) on startup
2. Provides a health check endpoint: GET /
3. Provides a metrics endpoint: GET /metrics
4. Provides a prediction endpoint: POST /predict
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Load environment variables
base_dir = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(base_dir, ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
else:
    load_dotenv()

app = FastAPI(
    title="Cardiovascular Disease Prediction API",
    description="Educational ML API for heart disease risk prediction",
    version="1.0.0"
)

# Configure CORS so the React frontend can talk to FastAPI
allowed_origins_env = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174")
allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

is_wildcard = "*" in allowed_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=not is_wildcard,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for loaded artifacts
model = None
scaler = None
metrics_data = None

# Pydantic schema for input validation
class HeartDiseaseInput(BaseModel):
    age: int = Field(..., ge=18, le=120, description="Age in years (e.g. 50)")
    gender: int = Field(..., ge=1, le=2, description="Gender (1 = Female, 2 = Male)")
    height: float = Field(..., ge=100, le=250, description="Height in cm (e.g. 165)")
    weight: float = Field(..., ge=30, le=250, description="Weight in kg (e.g. 70)")
    ap_hi: int = Field(..., ge=50, le=250, description="Systolic blood pressure in mm Hg (e.g. 120)")
    ap_lo: int = Field(..., ge=40, le=180, description="Diastolic blood pressure in mm Hg (e.g. 80)")
    cholesterol: int = Field(..., ge=1, le=3, description="Cholesterol level (1: normal, 2: above normal, 3: well above normal)")
    gluc: int = Field(..., ge=1, le=3, description="Glucose level (1: normal, 2: above normal, 3: well above normal)")
    smoke: int = Field(..., ge=0, le=1, description="Smoking status (0 = Non-Smoker, 1 = Smoker)")
    alco: int = Field(..., ge=0, le=1, description="Alcohol intake (0 = No, 1 = Yes)")
    active: int = Field(..., ge=0, le=1, description="Physical activity (0 = Inactive, 1 = Active)")

@app.on_event("startup")
def load_artifacts():
    """Load model, scaler, and metrics once when the server boots up."""
    global model, scaler, metrics_data

    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, "model.pkl")
    scaler_path = os.path.join(base_dir, "scaler.pkl")
    metrics_path = os.path.join(base_dir, "metrics.json")

    if not os.path.exists(model_path) or not os.path.exists(scaler_path):
        raise RuntimeError("model.pkl or scaler.pkl not found! Please run train_model.ipynb first.")

    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)

    if os.path.exists(metrics_path):
        with open(metrics_path, "r") as f:
            metrics_data = json.load(f)

    print("FastAPI: Model, Scaler, and Metrics successfully loaded into memory.")

@app.get("/")
def home():
    """Health check endpoint to test if the API is active."""
    return {
        "status": "online",
        "message": "Cardiovascular Disease Prediction API is running successfully.",
        "endpoints": {
            "health": "GET /",
            "predict": "POST /predict",
            "metrics": "GET /metrics"
        }
    }

@app.get("/metrics")
def get_metrics():
    """Returns real performance metrics calculated on actual test data."""
    if metrics_data is None:
        raise HTTPException(status_code=404, detail="Performance metrics not available.")
    return metrics_data

@app.post("/predict")
def predict_cardiovascular_risk(data: HeartDiseaseInput):
    """
    Receives patient clinical & lifestyle features, scales them using the saved scaler,
    and returns model prediction along with probability score.
    """
    if model is None or scaler is None:
        raise HTTPException(status_code=500, detail="Model is not loaded.")

    if data.ap_hi < data.ap_lo:
        raise HTTPException(
            status_code=400,
            detail="Systolic blood pressure (ap_hi) must be greater than or equal to diastolic blood pressure (ap_lo)."
        )

    feature_names = [
        "age", "gender", "height", "weight", "ap_hi", "ap_lo",
        "cholesterol", "gluc", "smoke", "alco", "active"
    ]
    input_df = pd.DataFrame([[
        data.age,
        data.gender,
        data.height,
        data.weight,
        data.ap_hi,
        data.ap_lo,
        data.cholesterol,
        data.gluc,
        data.smoke,
        data.alco,
        data.active
    ]], columns=feature_names)

    # Scale features using the fitted StandardScaler from training
    scaled_features = scaler.transform(input_df)

    # Predict class (0 = Low Risk, 1 = High Risk)
    prediction = int(model.predict(scaled_features)[0])

    # Predict probability if supported by the model
    probability = None
    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(scaled_features)[0]
        # Probability of CVD (class 1)
        probability = round(float(probabilities[1]) * 100, 2)

    risk_label = "High Risk of Cardiovascular Disease" if prediction == 1 else "Low Risk of Cardiovascular Disease"

    return {
        "prediction": prediction,
        "risk_level": risk_label,
        "probability": probability,
        "disclaimer": "This prediction is generated by a Machine Learning model for educational and demonstration purposes only. It is NOT a medical diagnosis. Please consult a licensed medical professional for personal health evaluations."
    }

if __name__ == "__main__":
    import uvicorn
    import sys
    base_dir = os.path.dirname(os.path.abspath(__file__))
    if base_dir not in sys.path:
        sys.path.insert(0, base_dir)
    port = int(os.getenv("PORT", 8001))
    print(f"Starting Cardiovascular Disease Prediction API on http://127.0.0.1:{port} ...")
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True, app_dir=base_dir)
