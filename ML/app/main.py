from fastapi import FastAPI
from .schemas import PredictRequest, PredictResponse
from .models import ModelEnsemble

app = FastAPI(title="Disease Prediction API")

ensemble = None

@app.on_event("startup")
def load_models():
    global ensemble
    ensemble = ModelEnsemble()

@app.get("/")
def home():
    return {"message": "Disease Prediction API is running!"}

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    return ensemble.predict(req.symptoms)
