from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .schemas import PredictRequest, PredictResponse, ChatRequest, ChatResponse
from .models import ModelEnsemble
from .chatbot_service import ChatbotService
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="HealthSync API")

# Add CORS middleware
origins = os.getenv("CORS_ORIGINS", "").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ensemble = None
chatbot_service = None

@app.on_event("startup")
def load_models():
    global ensemble, chatbot_service
    ensemble = ModelEnsemble()
    chatbot_service = ChatbotService(ensemble)

@app.get("/")
def home():
    return {"message": "HealthSync API is running!"}

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    return ensemble.predict(req.symptoms)

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    return chatbot_service.process_chat(req)
