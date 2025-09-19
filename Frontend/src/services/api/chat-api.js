// HealthSync AI Chat API Service
const API_BASE_URL = "http://localhost:8000";

/**
 * Send a chat message to the AI assistant for a specific patient
 * @param {string} question - The user's question
 * @param {string} patientId - The patient ID (patient1, patient2, etc.)
 * @returns {Promise<Object>} Chat response from AI
 */
export const sendChatMessage = async (question, patientId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question,
        patient_id: patientId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Chat API Error:", error);
    throw error;
  }
};

/**
 * Check if the AI service is available
 * @returns {Promise<boolean>} True if service is available
 */
export const checkAIServiceHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    return response.ok;
  } catch (error) {
    console.error("AI Service health check failed:", error);
    return false;
  }
};
