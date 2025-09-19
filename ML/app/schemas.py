from pydantic import BaseModel
from typing import List, Optional

class PredictRequest(BaseModel):
    symptoms: str  # comma-separated symptoms string

class PredictResponse(BaseModel):
    rf_prediction: str
    nb_prediction: str
    svm_prediction: str
    voting_prediction: str

class Doctor(BaseModel):
    id: int
    name: str
    post: str
    division: str
    district: str
    upazila: str
    facility: str
    discipline: str
    contact_no: str
    address: str
    degree: str

class PatientHistory(BaseModel):
    previous_visits: List[int] = []  # Doctor IDs of previous visits
    medical_conditions: List[str] = []
    allergies: List[str] = []
    medications: List[str] = []

class PatientLocation(BaseModel):
    division: str
    district: str
    upazila: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    patient_history: PatientHistory
    patient_location: PatientLocation
    doctors_list: List[Doctor]

class ChatResponse(BaseModel):
    response: str
    extracted_symptoms: List[str] = []
    predicted_conditions: Optional[PredictResponse] = None
    recommended_doctors: List[Doctor] = []
