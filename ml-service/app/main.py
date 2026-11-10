import os
import secrets
from pathlib import Path
from contextlib import asynccontextmanager
from typing import Literal, Optional
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel, Field
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score

try:
    from .planner import generate_full_plan
except ImportError:
    from planner import generate_full_plan

APP_DIR = Path(__file__).resolve().parent
MODEL_PATH = Path(os.getenv("MODEL_PATH", APP_DIR / "models" / "activity_model.joblib"))
DATA_PATH = Path(os.getenv("TRAINING_DATA", APP_DIR / "data" / "fitness_training.csv"))
@asynccontextmanager
async def lifespan(application):
    load_model()
    yield

app = FastAPI(title="SmartFit ML Service", version="1.0.0", lifespan=lifespan)
model = None
metrics = {}

class RecommendationRequest(BaseModel):
    age: int = Field(ge=13, le=110)
    weight: float = Field(gt=25, le=350)
    fitnessLevel: Literal["BEGINNER", "INTERMEDIATE", "ADVANCED"]
    goal: Literal["WEIGHT_LOSS", "MUSCLE_GAIN", "ENDURANCE", "GENERAL_FITNESS", "STRENGTH", "FLEXIBILITY"]
    weeklyWorkouts: int = Field(ge=0, le=21)
    averageDuration: float = Field(default=30, ge=0, le=600)
    averageCalories: float = Field(default=200, ge=0, le=5000)
    targetActivity: Optional[str] = "AUTO"
    height: Optional[float] = Field(default=175.0, ge=50, le=260)
    gender: Optional[str] = "MALE"
    dietaryPreference: Optional[str] = "STANDARD"

def load_model():
    global model
    if MODEL_PATH.exists():
        model = joblib.load(MODEL_PATH)

@app.get("/health")
def health():
    return {"status": "UP", "modelLoaded": model is not None, "trained": MODEL_PATH.exists()}

@app.post("/train")
@app.post("/api/ml/train")
def train(x_ml_training_token: str | None = Header(default=None, alias="X-ML-Training-Token")):
    global model, metrics
    expected_token = os.getenv("ML_TRAINING_TOKEN", "")
    if not expected_token or not x_ml_training_token or not secrets.compare_digest(expected_token, x_ml_training_token):
        raise HTTPException(403, "Model training is disabled until a valid ML_TRAINING_TOKEN is configured.")
    if not DATA_PATH.exists():
        raise HTTPException(400, f"Training CSV not found: {DATA_PATH}. Provide a validated historical dataset.")
    df = pd.read_csv(DATA_PATH)
    required = ["age", "weight", "fitnessLevel", "goal", "weeklyWorkouts", "averageDuration", "averageCalories", "recommendedActivity"]
    missing = sorted(set(required) - set(df.columns))
    if missing:
        raise HTTPException(400, f"Training CSV missing columns: {missing}")
    df = df[required].dropna()
    if len(df) < 30 or df["recommendedActivity"].nunique() < 2:
        raise HTTPException(400, "At least 30 complete records and two activity classes are required.")
    X = df.drop(columns=["recommendedActivity"])
    y = df["recommendedActivity"]
    numeric = ["age", "weight", "weeklyWorkouts", "averageDuration", "averageCalories"]
    categorical = ["fitnessLevel", "goal"]
    pre = ColumnTransformer([("num", StandardScaler(), numeric),
                             ("cat", OneHotEncoder(handle_unknown="ignore"), categorical)])
    candidate = Pipeline([("preprocess", pre), ("classifier", RandomForestClassifier(
        n_estimators=250, random_state=42, class_weight="balanced"))])
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    candidate.fit(X_train, y_train)
    pred = candidate.predict(X_test)
    metrics = {"accuracy": round(float(accuracy_score(y_test, pred)), 4),
               "f1_weighted": round(float(f1_score(y_test, pred, average="weighted")), 4),
               "testRecords": int(len(y_test))}
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(candidate, MODEL_PATH)
    model = candidate
    return {"status": "trained", "metrics": metrics}

@app.post("/api/ml/recommend")
def recommend(request: RecommendationRequest):
    global model
    has_target = bool(request.targetActivity and request.targetActivity.strip().upper() not in ("AUTO", "NONE", ""))
    
    prediction = None
    confidence = 1.0

    if model is not None:
        features = {
            "age": request.age,
            "weight": request.weight,
            "fitnessLevel": request.fitnessLevel,
            "goal": request.goal,
            "weeklyWorkouts": request.weeklyWorkouts,
            "averageDuration": request.averageDuration,
            "averageCalories": request.averageCalories
        }
        row = pd.DataFrame([features])
        prediction = str(model.predict(row)[0])
        probabilities = model.predict_proba(row)[0]
        confidence = float(max(probabilities))
    elif not has_target:
        raise HTTPException(503, "ML model is not trained. Add validated fitness_training.csv and call POST /train.")
    else:
        prediction = request.targetActivity.strip().upper()

    final_activity = request.targetActivity.strip().upper() if has_target else prediction

    plan_data = generate_full_plan(
        age=request.age,
        weight_kg=request.weight,
        fitness_level=request.fitnessLevel,
        goal=request.goal,
        weekly_workouts=request.weeklyWorkouts,
        recommended_activity=prediction or final_activity,
        target_activity=request.targetActivity,
        dietary_preference=request.dietaryPreference or "STANDARD",
        height_cm=request.height or 175.0,
        gender=request.gender or "MALE",
        average_duration=request.averageDuration or 45.0
    )

    return {
        "recommendedActivity": final_activity,
        "mlPredictedActivity": prediction,
        "confidence": round(confidence, 4),
        "model": "RandomForestClassifier + SmartFit Planner Engine",
        "disclaimer": "A personalized fitness and nutrition plan, not medical advice.",
        "dietPlan": plan_data["dietPlan"],
        "activityPlan": plan_data["activityPlan"]
    }

@app.get("/metrics")
def get_metrics():
    if not metrics:
        raise HTTPException(404, "No training metrics available in this process.")
    return metrics
