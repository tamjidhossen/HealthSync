from typing import List
from .schemas import Doctor, PatientHistory, PatientLocation, PredictResponse, ChatRequest, ChatResponse
from .utils import extract_symptoms_from_text, format_symptoms_for_ml
from .models import ModelEnsemble
from .gemini_client import get_gemini_response

class ChatbotService:
    def __init__(self, model_ensemble: ModelEnsemble):
        self.model_ensemble = model_ensemble
    
    def process_chat(self, request: ChatRequest) -> ChatResponse:
        # Extract symptoms from message
        extracted_symptoms = extract_symptoms_from_text(request.message)
        
        # Get ML predictions if symptoms found
        ml_predictions = None
        if extracted_symptoms:
            try:
                symptoms_str = format_symptoms_for_ml(extracted_symptoms)
                ml_predictions = self.model_ensemble.predict(symptoms_str)
            except Exception as e:
                # ML model failed, will use Gemini fallback
                print(f"ML model prediction failed: {e}")
                ml_predictions = None
        
        # Filter and rank doctors
        recommended_doctors = self._recommend_doctors(
            request.doctors_list,
            request.patient_history,
            request.patient_location,
            extracted_symptoms
        )
        
        # Generate Gemini response
        response_text = get_gemini_response(
            request.message,
            extracted_symptoms,
            ml_predictions,
            request.patient_history,
            request.patient_location,
            recommended_doctors
        )
        
        return ChatResponse(
            response=response_text,
            extracted_symptoms=extracted_symptoms,
            predicted_conditions=ml_predictions,
            recommended_doctors=recommended_doctors[:3]  # Top 3 doctors
        )
    
    def _recommend_doctors(
        self,
        doctors_list: List[Doctor],
        patient_history: PatientHistory,
        patient_location: PatientLocation,
        symptoms: List[str]
    ) -> List[Doctor]:
        """Rank doctors based on patient history, location, and symptoms"""
        
        scored_doctors = []
        
        for doctor in doctors_list:
            score = 0
            
            # Priority 1: Previously visited doctors
            if doctor.id in patient_history.previous_visits:
                score += 100
            
            # Priority 2: Same district
            if doctor.district.lower() == patient_location.district.lower():
                score += 50
            
            # Priority 3: Same division
            if doctor.division.lower() == patient_location.division.lower():
                score += 25
            
            # Priority 4: Specialty matching (basic keyword matching)
            specialty_keywords = {
                'cardiology': ['chest pain', 'palpitations', 'heart'],
                'orthopedics': ['back pain', 'joint pain', 'bone'],
                'ent': ['ear pain', 'throat', 'nose'],
                'medicine': ['fever', 'headache', 'general'],
                'gynae': ['vaginal', 'menstrual', 'pregnancy'],
                'pediatrics': ['infant', 'child'],
                'ophthalmology': ['eye', 'vision'],
                'surgery': ['mass', 'lump', 'swelling']
            }
            
            discipline_lower = doctor.discipline.lower()
            for specialty, keywords in specialty_keywords.items():
                if specialty in discipline_lower:
                    for symptom in symptoms:
                        for keyword in keywords:
                            if keyword in symptom.lower():
                                score += 10
                                break
            
            scored_doctors.append((doctor, score))
        
        # Sort by score (highest first)
        scored_doctors.sort(key=lambda x: x[1], reverse=True)
        
        return [doctor for doctor, score in scored_doctors]
