#!/usr/bin/env python3
"""
Test script for HealthSync Medical Chatbot
Tests patient-specific queries
"""

from dotenv import load_dotenv
import os

load_dotenv()

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
import time
from vector import retriever, get_patient_specific_retriever
from config import LLM_MODEL, CHATBOT_TEMPLATE, PATIENT_IDS

def test_patient_query(patient_id, question):
    """Test a query for a specific patient"""
    print(f"\n{'='*60}")
    print(f"Testing Patient: {patient_id}")
    print(f"Question: {question}")
    print(f"{'='*60}")
    
    model = ChatGoogleGenerativeAI(model=LLM_MODEL)
    prompt = ChatPromptTemplate.from_template(CHATBOT_TEMPLATE)
    chain = prompt | model
    
    try:
        start_time = time.time()
        
        # Get patient-specific retriever
        patient_retriever = get_patient_specific_retriever(patient_id)
        context = patient_retriever.invoke(question)
        
        if not context:
            print(f"❌ No relevant information found in {patient_id}'s records.")
            return
            
        print(f"🔍 Found {len(context)} relevant document chunks")
        print("\nContext preview:")
        for i, doc in enumerate(context[:2]):  # Show first 2 chunks
            print(f"Chunk {i+1}: {doc.page_content[:200]}...")
        
        result = chain.invoke({"context": context, "question": question})
        elapsed_time = time.time() - start_time
        
        print(f"\n📋 Medical Response:")
        print("-" * 50)
        print(result.content)
        print("-" * 50)
        print(f"⏱️  Response time: {elapsed_time:.2f} seconds")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def main():
    print("🏥 HealthSync Medical Chatbot Test")
    print(f"Available Patient IDs: {list(PATIENT_IDS.values())}")
    
    # Test queries for PAT-56789 (Tuhin Molla)
    test_patient_query("PAT-56789", "What is the patient's medical history?")
    test_patient_query("PAT-56789", "What medications is the patient taking?")
    test_patient_query("PAT-56789", "What are the recent lab results?")
    
    # Test queries for PAT-12345 (Akkas Molla)
    test_patient_query("PAT-12345", "What chronic conditions does this patient have?")
    test_patient_query("PAT-12345", "What is the patient's smoking history?")

if __name__ == "__main__":
    main()