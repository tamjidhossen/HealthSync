from langchain_ollama import OllamaEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
import os
import json
import time
from config import (
    GEMINI_EMBEDDING_MODEL, OLLAMA_EMBEDDING_MODEL, VECTOR_DB_PATH, COLLECTION_NAME,
    CHUNK_SIZE, CHUNK_OVERLAP, RETRIEVAL_K,
    DATA_DIR, PATIENT_DATA_FILES, PATIENT_IDS
)


# Option 1: Ollama Embeddings
embeddings = OllamaEmbeddings(model=OLLAMA_EMBEDDING_MODEL)

# Option 2: Google Gemini Embeddings (currently active)
# embeddings = GoogleGenerativeAIEmbeddings(model=EMBEDDING_MODEL)

# vector = embeddings.embed_query("Hello world")
# print(vector[:5])

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=CHUNK_SIZE,
    chunk_overlap=CHUNK_OVERLAP,
)

db_location = VECTOR_DB_PATH

# Create vector store
vector_store = Chroma(
    collection_name=COLLECTION_NAME,
    persist_directory=db_location,
    embedding_function=embeddings
)

# Check if there's already data in the vector store
existing_data = vector_store.get()
existing_count = len(existing_data['documents']) if existing_data['documents'] else 0

print(f"Found {existing_count} existing chunks in vector store")

# Only add documents if the vector store is empty
add_documents = existing_count == 0

if add_documents:
    print("Vector store is empty. Adding new documents...")
else:
    print("Vector store already contains data. Skipping document embedding.")

if add_documents:
    documents = []
    
    total_chunks = 0
    
    # Load and chunk patient data
    for patient_file in PATIENT_DATA_FILES:
        patient_id = PATIENT_IDS[patient_file]
        file_path = os.path.join(DATA_DIR, patient_file)
        
        print(f"Processing {patient_file} with ID {patient_id}")
        
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                patient_content = f.read()
            
            # Split patient content into chunks
            patient_chunks = text_splitter.split_text(patient_content)
            
            for i, chunk in enumerate(patient_chunks):
                if chunk.strip():
                    document = Document(
                        page_content=chunk.strip(),
                        metadata={
                            "source": patient_file,
                            "patient_id": patient_id,
                            "chunk": i,
                            "document_type": "patient_record"
                        }
                    )
                    documents.append(document)
            
            print(f"Added {len(patient_chunks)} chunks for patient {patient_id}")
            
        except FileNotFoundError:
            print(f"Warning: File {file_path} not found, skipping...")
            continue
        except Exception as e:
            print(f"Error processing {patient_file}: {str(e)}")
            continue
    
    # Add all patient documents to vector store
    if documents:
        print(f"Adding {len(documents)} total patient record chunks to vector store")
        vector_store.add_documents(documents=documents)
        total_chunks = len(documents)
    
    print(f"Total patient record chunks added: {total_chunks}")
    
retriever = vector_store.as_retriever(search_kwargs={"k": RETRIEVAL_K})

def get_patient_specific_retriever(patient_id):
    """
    Create a retriever that only searches for documents of a specific patient
    """
    return vector_store.as_retriever(
        search_kwargs={
            "k": RETRIEVAL_K,
            "filter": {"patient_id": patient_id}
        }
    )
