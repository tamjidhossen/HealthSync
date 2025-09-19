# HealthSync

## AI-Driven Centralized Medical Record System

### 1. Problem Statement

Bangladesh’s healthcare system is fragmented, with no centralized medical database. Patients face multiple challenges:

* **No unified records:** Each hospital or doctor maintains separate files.
* **Data loss:** Patients often lose prescriptions, reports, or forget past diagnoses.
* **Inefficient care:** Doctors make uninformed decisions due to incomplete patient history.
* **Poor accessibility:** Patients struggle to track their medical journey.

This results in misdiagnosis, repeated tests, delayed treatment, and high costs.

---

### 2. Our Solution: HealthSync

We propose **HealthSync**, a centralized medical database with AI-powered assistance.

#### Core Features

1. **Unique Health ID**

   * Every patient gets a secure digital health ID.
   * Acts as a single entry point for their lifelong medical history.

2. **Unified Medical Records**

   * Store prescriptions, lab results, X-rays, MRI scans, and handwritten notes.
   * Auto transcription and OCR for digitizing handwritten and scanned documents.
   * Records updated directly by doctors, hospitals, or diagnostic centers.

3. **AI Powered Tools**

   * **Smart Dashboard:** Provides doctors AI-generated summaries of patients’ complete medical history, highlighting key diagnoses, prescriptions, and test results for quick and informed decision-making. Patients can also see past and upcoming checkups.
   * **DocAssist:** An AI assistant for doctors that enables natural language queries over a patient’s medical records, provides diagnostic suggestions, and highlights relevant past treatments, lab results, and imaging reports, supporting better clinical decisions.
   * **Doctor Recommender:** Patients can describe their symptoms via chatbot. An AI-powered ML model analyzes their medical history and current symptoms to suggest the most appropriate specialist, improving care efficiency and accuracy.

4. **Patient-Friendly Chatbot**

   * Recall past medical history.
   * Get AI-backed guidance on which doctor to consult.
   * Track prescribed medicines and upcoming checkups.

5. **Centralized Appointment System**

   * Role-based dashboards for patients, doctors, and medical institutes, ensuring each user sees only relevant information.
   * Appointment Flow: Patient requests a visit → Institute proposes a time slot → Patient confirms → Doctor’s dashboard updates automatically.
   * Efficiency: Doctors can quickly review relevant patient information, supporting faster and better-informed decisions.

---

### 3. Technical Workflow

1. **Data Collection:** Uploads from hospitals, labs, and patients.
2. **Processing:**

   * OCR and speech-to-text for digitization.
   * Vectorization to store in a vector database for semantic search.
3. **Storage:** Encrypted, centralized medical database linked to unique health ID.
4. **AI Models:**

   * NLP model for symptom classification and doctor recommendation.
   * RAG-based chatbot for querying medical history.
   * Summarization model for doctor dashboards.
5. **Access Control:** Patients control who can view their data.

---

### 4. Impact

**For Patients:**

* Lifetime access to health records.
* Easy doctor discovery via chatbot.
* Reduced duplication of tests.

**For Doctors:**

* Access to full medical history before consultation.
* AI-powered insights for better decision-making.

**For Hospitals and Healthcare:**

* Unified platform across facilities.
* Scalable foundation for nationwide Health ID system.

---

### 5. Technology Stack

* **Frontend:** React, ShadCN
* **Backend:** Node.js (Express.js), Python (FastAPI), MongoDB, ChromaDB
* **AI / ML:** LLMs, RAG, NLP, ML, Ollama, LangChain
* **Data Processing:** OCR, vectorization, embeddings for semantic search
