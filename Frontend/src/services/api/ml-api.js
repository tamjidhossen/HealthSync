// HealthSync ML Models API Service
const ML_API_BASE_URL = "http://localhost:8001";

/**
 * Predict diseases based on symptoms
 * @param {string} symptoms - Comma-separated symptoms string
 * @returns {Promise<Object>} Prediction response with multiple model results
 */
export const predictDiseases = async (symptoms) => {
  try {
    const response = await fetch(`${ML_API_BASE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symptoms: symptoms,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("ML Prediction API Error:", error);
    throw error;
  }
};

/**
 * Send a chat message to the ML-powered medical chatbot
 * @param {string} message - The user's message
 * @param {Object} patientHistory - Patient's medical history
 * @param {Object} patientLocation - Patient's location information
 * @param {Array} doctorsList - List of available doctors
 * @returns {Promise<Object>} Chat response with predictions and recommendations
 */
export const sendMLChatMessage = async (
  message,
  patientHistory = {
    previous_visits: [],
    medical_conditions: [],
    allergies: [],
    medications: [],
  },
  patientLocation = {
    division: "",
    district: "",
    upazila: null,
  },
  doctorsList = []
) => {
  try {
    console.log("Sending ML chat request to:", `${ML_API_BASE_URL}/chat`);
    console.log("Request payload:", {
      message,
      patient_history: patientHistory,
      patient_location: patientLocation,
      doctors_list: doctorsList,
    });
    
    const response = await fetch(`${ML_API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        patient_history: patientHistory,
        patient_location: patientLocation,
        doctors_list: doctorsList,
      }),
    });

    console.log("ML chat response status:", response.status, response.ok);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("ML chat response data:", data);
    return data;
  } catch (error) {
    console.error("ML Chat API Error:", error);
    throw error;
  }
};

/**
 * Check if the ML Models service is available
 * @returns {Promise<boolean>} True if service is available
 */
export const checkMLServiceHealth = async () => {
  try {
    console.log("Checking ML service health at:", `${ML_API_BASE_URL}/`);
    const response = await fetch(`${ML_API_BASE_URL}/`);
    console.log("ML service health response:", response.status, response.ok);
    return response.ok;
  } catch (error) {
    console.error("ML Service health check failed:", error);
    return false;
  }
};

/**
 * Extract symptoms from natural language text (helper function)
 * @param {string} text - Natural language text describing symptoms
 * @returns {Array} Array of extracted symptoms
 */
export const extractSymptomsFromText = (text) => {
  // Common medical symptoms keywords with variations and misspellings
  const symptomKeywords = [
    // Headache variations
    { patterns: ["headache", "headches", "headche", "head ache", "migraine", "head pain"], symptom: "headache" },
    // Fever variations
    { patterns: ["fever", "fevers", "temperature", "hot", "burning up"], symptom: "fever" },
    // Pain variations
    { patterns: ["pain", "ache", "aching", "hurt", "hurting", "sore"], symptom: "pain" },
    // Other symptoms
    { patterns: ["cough", "coughing"], symptom: "cough" },
    { patterns: ["nausea", "nauseous", "sick"], symptom: "nausea" },
    { patterns: ["vomiting", "vomit", "throwing up"], symptom: "vomiting" },
    { patterns: ["diarrhea", "diarrhoea", "loose stool"], symptom: "diarrhea" },
    { patterns: ["fatigue", "tired", "exhausted", "weakness"], symptom: "fatigue" },
    { patterns: ["dizziness", "dizzy", "lightheaded"], symptom: "dizziness" },
    { patterns: ["chest pain", "chest ache"], symptom: "chest pain" },
    { patterns: ["shortness of breath", "breathing difficulty", "can't breathe"], symptom: "shortness of breath" },
    { patterns: ["abdominal pain", "stomach pain", "belly pain"], symptom: "abdominal pain" },
    { patterns: ["back pain", "backache"], symptom: "back pain" },
    { patterns: ["joint pain", "joint ache"], symptom: "joint pain" },
    { patterns: ["muscle pain", "muscle ache"], symptom: "muscle pain" },
    { patterns: ["sore throat", "throat pain"], symptom: "sore throat" },
    { patterns: ["runny nose", "stuffy nose", "blocked nose"], symptom: "runny nose" },
    { patterns: ["sneezing"], symptom: "sneezing" },
    { patterns: ["chills", "shivering"], symptom: "chills" },
    { patterns: ["sweating", "sweats"], symptom: "sweating" },
    { patterns: ["loss of appetite", "no appetite"], symptom: "loss of appetite" },
    { patterns: ["weight loss"], symptom: "weight loss" },
    { patterns: ["weight gain"], symptom: "weight gain" },
    { patterns: ["insomnia", "can't sleep", "sleeplessness"], symptom: "insomnia" },
    { patterns: ["anxiety", "anxious", "worried"], symptom: "anxiety" },
    { patterns: ["depression", "depressed", "sad"], symptom: "depression" },
    { patterns: ["rash", "skin rash"], symptom: "rash" },
    { patterns: ["itching", "itchy"], symptom: "itching" },
    { patterns: ["swelling", "swollen"], symptom: "swelling" },
    { patterns: ["bruising", "bruises"], symptom: "bruising" },
    { patterns: ["bleeding"], symptom: "bleeding" },
    { patterns: ["constipation"], symptom: "constipation" },
    { patterns: ["indigestion"], symptom: "indigestion" },
    { patterns: ["heartburn"], symptom: "heartburn" },
    { patterns: ["blurred vision", "vision problems"], symptom: "blurred vision" },
    { patterns: ["ear pain", "earache"], symptom: "ear pain" },
    { patterns: ["hearing loss"], symptom: "hearing loss" },
    { patterns: ["difficulty swallowing"], symptom: "difficulty swallowing" },
    { patterns: ["hoarseness", "hoarse voice"], symptom: "hoarseness" },
    { patterns: ["leg pain"], symptom: "leg pain" },
    { patterns: ["arm pain"], symptom: "arm pain" }
  ];

  const lowercaseText = text.toLowerCase();
  const extractedSymptoms = new Set(); // Use Set to avoid duplicates

  symptomKeywords.forEach(({ patterns, symptom }) => {
    patterns.forEach(pattern => {
      if (lowercaseText.includes(pattern)) {
        extractedSymptoms.add(symptom);
      }
    });
  });

  return Array.from(extractedSymptoms);
};

/**
 * Format symptoms for API call
 * @param {Array} symptomsArray - Array of symptoms
 * @returns {string} Comma-separated symptoms string
 */
export const formatSymptomsForAPI = (symptomsArray) => {
  return symptomsArray.join(", ");
};

/**
 * Parse prediction results for user display
 * @param {Object} predictions - Prediction response from ML API
 * @returns {Object} Formatted prediction results
 */
export const formatPredictionResults = (predictions) => {
  return {
    mostLikely: predictions.voting_prediction, // Voting classifier is usually most accurate
    allPredictions: {
      "Random Forest": predictions.rf_prediction,
      "Naive Bayes": predictions.nb_prediction,
      "Support Vector Machine": predictions.svm_prediction,
      "Ensemble Vote": predictions.voting_prediction,
    }
  };
};
