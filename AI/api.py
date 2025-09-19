from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time
import os

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate

from vector import retriever, get_patient_specific_retriever
from config import LLM_MODEL, CHATBOT_TEMPLATE

app = FastAPI(title="HealthSync AI Medical Chatbot API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = ChatGoogleGenerativeAI(model=LLM_MODEL)

template = CHATBOT_TEMPLATE
prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model

class ChatRequest(BaseModel):
    question: str
    patient_id: str = None  # Optional patient ID for patient-specific queries

@app.get("/")
def read_root():
    return {"message": "Welcome to HealthSync AI Medical Chatbot API"}

@app.post("/chat")
def chat(request: ChatRequest):
    question = request.question
    patient_id = request.patient_id
    
    try:
        # Use patient-specific retriever if patient_id is provided
        if patient_id:
            patient_retriever = get_patient_specific_retriever(patient_id)
            context = patient_retriever.invoke(question)
            
            # Verify that we got results for the specified patient
            if not context:
                raise HTTPException(
                    status_code=404, 
                    detail=f"No medical records found for patient ID: {patient_id}"
                )
        else:
            # Use general retriever (searches all patients)
            context = retriever.invoke(question)
        
        start_time = time.time()
        result = chain.invoke({"context": context, "question": question})
        elapsed_time = time.time() - start_time
        
        return {
            "response": result.content,
            "patient_id": patient_id,
            "response_time": f"{elapsed_time:.2f}",
            "status": "success"
        }
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        return {
            "response": "I'm sorry, I encountered an error processing your request. Please try again later.",
            "patient_id": patient_id,
            "response_time": "0.00",
            "status": "error",
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run(app, host=host, port=port)

