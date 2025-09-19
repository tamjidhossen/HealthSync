import os
from typing import List
from .schemas import Doctor, PatientHistory, PatientLocation, PredictResponse

try:
    import google.generativeai as genai
    # Configure Gemini API
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    model = genai.GenerativeModel('gemini-2.5-flash')
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

def get_gemini_response(
    user_message: str,
    extracted_symptoms: List[str],
    ml_predictions: PredictResponse = None,
    patient_history: PatientHistory = None,
    patient_location: PatientLocation = None,
    doctors_list: List[Doctor] = None
) -> str:
    """Generate response using Gemini API with healthcare context"""
    
    if not GEMINI_AVAILABLE:
        return generate_fallback_response(user_message, extracted_symptoms, ml_predictions, doctors_list)
    
    # Build context for Gemini
    context = f"""You are a caring healthcare assistant for HealthSync. A patient has sent you this message: "{user_message}"

Patient's symptoms identified: {', '.join(extracted_symptoms) if extracted_symptoms else 'None clearly identified'}
"""
    
    # Add ML predictions if available, otherwise ask Gemini to analyze
    if ml_predictions:
        context += f"""
Based on our analysis, possible conditions include: {ml_predictions.voting_prediction}
"""
    elif extracted_symptoms:
        context += f"""
Please provide your medical insights about what these symptoms might indicate: {', '.join(extracted_symptoms)}
"""
    
    if patient_history and patient_history.previous_visits:
        context += f"Patient has previously seen doctors with IDs: {patient_history.previous_visits}\n"
    
    if patient_location:
        context += f"Patient is located in {patient_location.district}, {patient_location.division}\n"
    
    if doctors_list:
        context += "Available doctors nearby:\n"
        for doc in doctors_list[:3]:
            context += f"- Dr. {doc.name} ({doc.discipline}) - Contact: {doc.contact_no}\n"
    
    context += """
Please respond as a caring, professional healthcare assistant:
1. Acknowledge their concerns with empathy
2. If symptoms are present, provide general health guidance (not diagnosis)
3. Recommend appropriate doctors from the list based on symptoms
4. Always advise consulting healthcare professionals
5. Be warm, reassuring, and human-like in your response
6. Don't mention technical details about AI or ML models
7. Keep response concise but caring

Respond naturally and helpfully:"""
    
    try:
        response = model.generate_content(context)
        return response.text
    except Exception as e:
        return generate_fallback_response(user_message, extracted_symptoms, ml_predictions, doctors_list)

def generate_fallback_response(
    user_message: str,
    extracted_symptoms: List[str],
    ml_predictions: PredictResponse = None,
    doctors_list: List[Doctor] = None
) -> str:
    """Generate a natural fallback response when Gemini API is not available"""
    
    response = "Thank you for reaching out to HealthSync. I understand your health concerns and I'm here to help.\n\n"
    
    if extracted_symptoms:
        response += f"I notice you mentioned: {', '.join(extracted_symptoms)}. "
        
        if ml_predictions:
            response += f"Based on your symptoms, this could be related to {ml_predictions.voting_prediction}. "
        else:
            response += "These symptoms deserve proper medical attention. "
    
    response += "I strongly recommend consulting with a healthcare professional who can properly evaluate your condition.\n\n"
    
    if doctors_list:
        response += f"You might consider reaching out to Dr. {doctors_list[0].name} ({doctors_list[0].discipline}) at {doctors_list[0].contact_no}. "
        response += "They can provide the medical expertise you need.\n\n"
    
    response += "Please remember that this guidance is not a substitute for professional medical advice. "
    response += "Your health is important, so don't hesitate to seek medical care when needed.\n\n"
    response += "Take care and feel better soon!"
    
    return response
