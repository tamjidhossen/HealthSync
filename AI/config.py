"""Configuration settings for the HealthSync Medical Chatbot"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Verify LangSmith configuration
if os.getenv("LANGSMITH_TRACING") == "true":
    print("LangSmith tracing enabled")
    print(f"Project: {os.getenv('LANGSMITH_PROJECT')}")
else:
    print("LangSmith tracing disabled")

# Model configurations
LLM_MODEL = "gemini-2.5-flash"
GEMINI_EMBEDDING_MODEL = "models/embedding-001"  # Gemini embedding model
OLLAMA_EMBEDDING_MODEL = "nomic-embed-text"  # Ollama embedding model

# Embedding provider selection (can be "gemini" or "ollama")
EMBEDDING_PROVIDER = os.getenv("EMBEDDING_PROVIDER", "gemini")

# Vector store configuration
VECTOR_DB_PATH = "./chroma_langchain_db"
COLLECTION_NAME = "healthsync_patients"

# Text splitting configuration
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200

# Retrieval configuration
RETRIEVAL_K = 20

# Data paths
DATA_DIR = "Data"
PATIENT_DATA_FILES = ["patient1.txt", "patient2.txt", "patient3.txt", "patient4.txt"]

# Patient ID mapping
PATIENT_IDS = {
    "patient1.txt": "PAT-12345",
    "patient2.txt": "PAT-56789", 
    "patient3.txt": "PAT-98765",
    "patient4.txt": "PAT-11111"
}

# Medical system information
HOSPITAL_NAME = "HealthSync Medical Center"

# Chatbot prompt template
CHATBOT_TEMPLATE = """
You are HealthSync AI, a medical assistant chatbot designed to help doctors access patient medical history and records.

Based on the following patient medical records and context: {{context}}

Question from Doctor: {{question}}

Instructions:
- Response in markdown format only, make it look good
- You are assisting a licensed medical professional
- Provide medical information based on the patient records in the context
- Include relevant dates, test results, medications, and medical history when available
- If the context doesn't contain enough information to answer the question, say "The available patient records do not contain sufficient information to answer that question."
- Focus on factual medical data from the patient's records
- When discussing medications, include dosages and administration details if available
- For laboratory results, include reference ranges and dates when provided
""".format(hospital_name=HOSPITAL_NAME)
