import requests
import json

# Test data
test_request = {
    "message": "I have chest pain and difficulty breathing",
    "patient_history": {
        "previous_visits": [10],
        "medical_conditions": ["hypertension"],
        "allergies": [],
        "medications": ["lisinopril"]
    },
    "patient_location": {
        "division": "Rajshahi",
        "district": "Chapai Nawabganj",
        "upazila": "Chapai Nababganj Sadar"
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
        },
        {
            "id": 7,
            "name": "Dr. Saiful Islam",
            "post": "Jr. Consultant (Medicine)",
            "division": "Rajshahi",
            "district": "Chapai Nawabganj",
            "upazila": "Chapai Nababganj Sadar",
            "facility": "Chapai Nababganj District Hospital",
            "discipline": "Medicine",
            "contact_no": "1788445566",
            "address": "Adhunik Sadar Hospital, Chapainawabganj",
            "degree": "MBBS/1995,MD(Medicine)/2004"
        }
    ]
}

def test_chatbot():
    url = "http://127.0.0.1:8000/chat"
    
    try:
        response = requests.post(url, json=test_request)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error: {e}")

def test_predict():
    url = "http://127.0.0.1:8000/predict"
    test_data = {"symptoms": "chest pain,difficulty breathing"}
    
    try:
        response = requests.post(url, json=test_data)
        print(f"ML Prediction Status: {response.status_code}")
        print(f"ML Prediction Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"ML Prediction Error: {e}")

if __name__ == "__main__":
    print("Testing ML Model...")
    test_predict()
    print("\n" + "="*50 + "\n")
    print("Testing Chatbot...")
    test_chatbot()
