from fastapi.testclient import TestClient
import pandas as pd
from app import main

client = TestClient(main.app)

def test_health_contract():
    response = client.get("/health")
    assert response.status_code == 200
    assert "modelLoaded" in response.json()

def test_recommendation_requires_trained_model(monkeypatch, tmp_path):
    monkeypatch.setattr(main, "model", None)
    monkeypatch.setattr(main, "MODEL_PATH", tmp_path / "missing.joblib")
    response = client.post("/api/ml/recommend", json={
        "age": 24, "weight": 70, "fitnessLevel": "BEGINNER",
        "goal": "GENERAL_FITNESS", "weeklyWorkouts": 3
    })
    assert response.status_code == 503

def test_training_endpoint_is_protected(monkeypatch):
    monkeypatch.setenv("ML_TRAINING_TOKEN", "secret-token")
    response = client.post("/train")
    assert response.status_code == 403

def test_train_and_predict_pipeline(monkeypatch, tmp_path):
    rows = []
    for i in range(60):
        rows.append({
            "age": 20 + (i % 12), "weight": 55 + (i % 30),
            "fitnessLevel": ["BEGINNER", "INTERMEDIATE", "ADVANCED"][i % 3],
            "goal": ["WEIGHT_LOSS", "ENDURANCE", "GENERAL_FITNESS"][i % 3],
            "weeklyWorkouts": 1 + (i % 6), "averageDuration": 20 + (i % 45),
            "averageCalories": 100 + (i % 400),
            "recommendedActivity": ["WALKING", "RUNNING", "CYCLING"][i % 3]
        })
    csv_path = tmp_path / "fitness_training.csv"
    pd.DataFrame(rows).to_csv(csv_path, index=False)
    monkeypatch.setattr(main, "DATA_PATH", csv_path)
    monkeypatch.setattr(main, "MODEL_PATH", tmp_path / "model.joblib")
    monkeypatch.setattr(main, "model", None)
    monkeypatch.setenv("ML_TRAINING_TOKEN", "test-token")
    trained = client.post("/train", headers={"X-ML-Training-Token": "test-token"})
    assert trained.status_code == 200
    assert trained.json()["metrics"]["testRecords"] > 0
    prediction = client.post("/api/ml/recommend", json={
        "age": 25, "weight": 68, "fitnessLevel": "INTERMEDIATE",
        "goal": "ENDURANCE", "weeklyWorkouts": 4,
        "averageDuration": 35, "averageCalories": 260
    })
    assert prediction.status_code == 200
    assert prediction.json()["recommendedActivity"] in {"WALKING", "RUNNING", "CYCLING"}
