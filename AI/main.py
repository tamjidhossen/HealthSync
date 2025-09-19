from dotenv import load_dotenv
import os

load_dotenv()

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
import time
from vector import retriever, get_patient_specific_retriever
from config import LLM_MODEL, CHATBOT_TEMPLATE, PATIENT_IDS

model = ChatGoogleGenerativeAI(model=LLM_MODEL)

template = CHATBOT_TEMPLATE

prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model

print("=== HealthSync AI Medical Chatbot ===")
print("Available Patient IDs:", list(PATIENT_IDS.values()))
print("Commands:")
print("- Type 'q' to quit")
print("- Type 'patient:PAT-56789' to switch to a specific patient")
print("- Type your medical question to query patient records")
print("=====================================\n")

current_patient_id = None

while True:
    print("\n-------------------------------")
    if current_patient_id:
        user_input = input(f"[Patient: {current_patient_id}] Ask your medical question (q to quit, patient:ID to switch): ")
    else:
        user_input = input("Ask your question (q to quit, patient:PAT-ID to select patient): ")
    print()
    
    if user_input == "q":
        break
    
    # Check if user wants to switch patient
    if user_input.startswith("patient:"):
        patient_id = user_input.split(":", 1)[1].strip()
        if patient_id in PATIENT_IDS.values():
            current_patient_id = patient_id
            print(f"✓ Switched to patient {patient_id}")
            continue
        else:
            print(f"❌ Patient ID '{patient_id}' not found. Available IDs: {list(PATIENT_IDS.values())}")
            continue
    
    question = user_input
    
    try:
        start_time = time.time()
        
        # Use patient-specific retriever if a patient is selected
        if current_patient_id:
            patient_retriever = get_patient_specific_retriever(current_patient_id)
            context = patient_retriever.invoke(question)
            print(f"🔍 Searching patient {current_patient_id} records...")
        else:
            context = retriever.invoke(question)
            print("🔍 Searching all patient records...")
        
        if not context:
            if current_patient_id:
                print(f"❌ No relevant information found in {current_patient_id}'s records for your question.")
            else:
                print("❌ No relevant information found in the medical database.")
            continue
            
        result = chain.invoke({"context": context, "question": question})
        elapsed_time = time.time() - start_time
        
        print("📋 Medical Information:")
        print("-" * 50)
        print(result.content)
        print("-" * 50)
        print(f"⏱️  Response time: {elapsed_time:.2f} seconds")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        print("Please try again or contact system administrator.")

