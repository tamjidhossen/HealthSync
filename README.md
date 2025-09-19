# HealthSync AI Chatbot

An ensemble machine learning model for predicting diseases based on symptoms with an intelligent chatbot powered by Google Gemini AI.

## 🚀 Features

- **Disease Prediction**: ML ensemble (Random Forest, SVM, Naive Bayes) for accurate disease prediction
- **AI Chatbot**: Intelligent healthcare assistant powered by Google Gemini
- **Symptom Extraction**: Automatically detects symptoms from natural language
- **Doctor Recommendation**: Smart doctor matching based on:
  - Patient history (previously visited doctors)
  - Location proximity (same district/division)
  - Medical specialty matching
- **FastAPI Backend**: RESTful API for easy frontend integration

---

## 🏗️ Workflow

1. **Training**: The `train/train_models.py` script trains **Random Forest, SVM, and Gaussian Naive Bayes** models.
2. **Saving Models**: The trained models are saved as `.joblib` files inside the `saved_models/` directory.
3. **Chatbot Processing**: When a patient sends a message:
   - **Symptom Extraction**: AI extracts valid symptoms from natural language
   - **ML Prediction**: Runs symptoms through all models for disease prediction
   - **Doctor Recommendation**: Ranks doctors based on patient history and location
   - **AI Response**: Gemini AI generates caring, professional healthcare guidance
4. **API Response**: Returns structured response with symptoms, predictions, and doctor recommendations

---

## 🛠️ Setup & Installation

### Prerequisites
- Python 3.8+
- Git

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/tamjidhossen/HealthSync.git
   cd HealthSync
   ```

2. **Create and Activate Virtual Environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # Linux/macOS
   # venv\Scripts\activate   # Windows
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   pip install google-generativeai python-dotenv
   ```

4. **Environment Configuration**:
   Create a `.env` file in the `ML/` directory:
   ```env
   GOOGLE_API_KEY="your_gemini_api_key_here"
   CORS_ORIGINS="http://localhost:3000,http://localhost:5173"
   ```

5. **Train Models** (if needed):
   ```bash
   python ML/training/train.py
   ```

6. **Start the Server**:
   ```bash
   source venv/bin/activate
   uvicorn ML.app.main:app --reload --port 8000
   ```

7. **Access API**:
   - Server: `http://127.0.0.1:8000`
   - Documentation: `http://127.0.0.1:8000/docs`

---

## 📡 API Endpoints

### `/chat` - AI Chatbot
- **Method**: `POST`
- **Description**: Intelligent healthcare chatbot with symptom analysis and doctor recommendations
- **Request Body**:
  ```json
  {
    "message": "I have chest pain and shortness of breath",
    "patient_history": {
      "previous_visits": [10],
      "medical_conditions": ["hypertension"],
      "allergies": [],
      "medications": ["lisinopril"]
    },
    "patient_location": {
      "division": "Rajshahi",
      "district": "Chapai Nawabganj"
    },
    "doctors_list": [
      {
        "id": 10,
        "name": "Dr. Shafiqul Alam",
        "post": "Jr. Consultant (Cardiology)",
        "division": "Rajshahi",
        "district": "Chapai Nawabganj",
        "upazila": "Chapai Nababganj Sadar",
        "facility": "Chapai Nababganj District Hospital",
        "discipline": "Cardiology",
        "contact_no": "1711223344",
        "address": "Chapainawabganj Sadar Hospital",
        "degree": "MBBS/1990,MD(Cardiology)/1999"
      }
    ]
  }
  ```

- **Response**:
  ```json
  {
    "response": "Thank you for reaching out to HealthSync...",
    "extracted_symptoms": ["shortness of breath", "sharp chest pain"],
    "predicted_conditions": {
      "rf_prediction": "coronary atherosclerosis",
      "nb_prediction": "coronary atherosclerosis", 
      "svm_prediction": "coronary atherosclerosis",
      "voting_prediction": "coronary atherosclerosis"
    },
    "recommended_doctors": [...]
  }
  ```

### `/predict` - Direct ML Prediction
- **Method**: `POST`
- **Description**: Direct disease prediction from symptoms
- **Request Body**:
  ```json
  {
    "symptoms": "anxiety and nervousness, insomnia, dizziness, shortness of breath, sharp chest pain"
  }
  ```

## 🧠 Example Symptom Inputs

```json
// Anxiety/Panic symptoms
{
  "symptoms": "anxiety and nervousness, insomnia, dizziness, shortness of breath, sharp chest pain"
}

// Gastrointestinal issues  
{
  "symptoms": "nausea, diarrhea, vomiting, headache, lower abdominal pain"
}

// Respiratory infection
{
  "symptoms": "sore throat, cough, hoarse voice, nasal congestion, throat swelling"
}

// Musculoskeletal pain
{
  "symptoms": "back pain, neck pain, shoulder pain, low back pain, leg pain"
}

// General illness
{
  "symptoms": "fever, chills, fatigue, feeling ill, ache all over"
}
```

## 🎯 Chatbot Features

### Symptom Extraction
- Automatically identifies medical symptoms from natural language
- Supports 400+ medical symptoms from validated symptom list
- Uses fuzzy matching and keyword mapping

### Smart Doctor Recommendations
**Priority Ranking:**
1. **Previous Visits**: Doctors the patient has seen before (highest priority)
2. **Location Match**: Same district > same division  
3. **Specialty Match**: Medical discipline matching detected symptoms

### AI Response Generation
- **Fallback Support**: Works even if Gemini API is unavailable
- **Medical Disclaimers**: Always includes proper medical advice disclaimers
- **Professional Tone**: Caring, helpful, and medically appropriate responses

## 🧪 Testing

### Quick Test
```bash
# Test the chatbot
curl -X POST "http://127.0.0.1:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I have chest pain and difficulty breathing",
    "patient_history": {"previous_visits": [], "medical_conditions": [], "allergies": [], "medications": []},
    "patient_location": {"division": "Rajshahi", "district": "Chapai Nawabganj"},
    "doctors_list": []
  }'

# Test ML prediction only
curl -X POST "http://127.0.0.1:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{"symptoms": "chest pain,difficulty breathing"}'
```

### Using the Test Script
```bash
source venv/bin/activate
python test_chatbot.py
```

## 🏥 Frontend Integration

### React/Vue/Angular Example
```javascript
const chatWithBot = async (message, patientData) => {
  const response = await fetch('http://127.0.0.1:8000/chat', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      message: message,
      patient_history: patientData.history,
      patient_location: patientData.location,
      doctors_list: patientData.doctors
    })
  });
  
  const result = await response.json();
  return result;
};
```

## 🔧 Configuration

### Environment Variables (.env)
```env
# Required
GOOGLE_API_KEY="your_gemini_api_key_here"

# Optional
CORS_ORIGINS="http://localhost:3000,http://localhost:5173"
LANGSMITH_API_KEY="your_langsmith_key"  
LANGSMITH_PROJECT="HealthSync Patient Assist BOT"
```

## 📁 Project Structure
```
HealthSync/
├── ML/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── models.py            # ML model ensemble
│   │   ├── schemas.py           # Pydantic models
│   │   ├── chatbot_service.py   # Main chatbot logic
│   │   ├── gemini_client.py     # Gemini AI integration
│   │   └── utils.py             # Symptom extraction
│   ├── saved_models/            # Trained ML models
│   ├── data/                    # Training datasets
│   └── training/                # Model training scripts
├── test_chatbot.py              # Test script
├── requirements.txt             # Dependencies
└── README.md                    # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email tamjidhossen@gmail.com or create an issue in the GitHub repository.