import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, AlertCircle, Activity, Stethoscope } from "lucide-react";
import { 
  sendMLChatMessage, 
  checkMLServiceHealth,
  extractSymptomsFromText,
  formatSymptomsForAPI,
  predictDiseases,
  formatPredictionResults 
} from "../../../services/api/ml-api";

export function AIAssistantPanel() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm your HealthSync AI assistant powered by advanced ML models. I can help analyze your symptoms, predict potential conditions, and provide medical guidance. How can I help you with your health today?",
      timestamp: new Date(Date.now() - 5 * 60000),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mlServiceAvailable, setMlServiceAvailable] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Check ML service health on component mount
  useEffect(() => {
    const checkHealth = async () => {
      console.log("AIAssistantPanel mounted, checking ML service health...");
      const isHealthy = await checkMLServiceHealth();
      console.log("ML service health result:", isHealthy);
      setMlServiceAvailable(isHealthy);
    };
    
    checkHealth();
  }, []);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Dummy loading message for shimmer effect
  const loadingMessage = {
    id: "loading",
    type: "bot",
    content: "I'm analyzing your health data...",
    timestamp: new Date(),
    isLoading: true,
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    // Add loading message
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      if (mlServiceAvailable) {
        // Try ML-powered response first
        await handleMLResponse(currentMessage);
      } else {
        // Fallback to basic response if ML service is not available
        await handleBasicResponse(currentMessage);
      }
    } catch (error) {
      console.error("Chat error:", error);
      await handleErrorResponse(error);
    }
  };

  const handleMLResponse = async (message) => {
    try {
      // Extract symptoms from the message
      const extractedSymptoms = extractSymptomsFromText(message);
      
      // Default patient data (in a real app, this would come from user context)
      const patientHistory = {
        previous_visits: [],
        medical_conditions: [],
        allergies: [],
        medications: [],
      };
      
      const patientLocation = {
        division: "Dhaka",
        district: "Dhaka",
        upazila: null,
      };

      // Send to ML chat service
      const mlResponse = await sendMLChatMessage(
        message,
        patientHistory,
        patientLocation,
        [] // doctors list - would be populated from backend
      );

      let responseContent = mlResponse.response;
      let hasSymptoms = false;
      let hasPredictions = false;

      // If symptoms were extracted and predictions made, format the response
      if (mlResponse.extracted_symptoms && mlResponse.extracted_symptoms.length > 0) {
        hasSymptoms = true;
        responseContent += `\n\n🔍 **Identified Symptoms:** ${mlResponse.extracted_symptoms.join(", ")}`;
      }

      if (mlResponse.predicted_conditions) {
        hasPredictions = true;
        const formattedPredictions = formatPredictionResults(mlResponse.predicted_conditions);
        responseContent += `\n\n🏥 **AI Analysis Results:**\n`;
        responseContent += `**Most Likely Condition:** ${formattedPredictions.mostLikely}\n\n`;
        responseContent += `**All Model Predictions:**\n`;
        Object.entries(formattedPredictions.allPredictions).forEach(([model, prediction]) => {
          responseContent += `• ${model}: ${prediction}\n`;
        });
        responseContent += `\n⚠️ **Important:** These are AI predictions for informational purposes only. Please consult with a healthcare professional for proper diagnosis and treatment.`;
      }

      if (mlResponse.recommended_doctors && mlResponse.recommended_doctors.length > 0) {
        responseContent += `\n\n👨‍⚕️ **Recommended Doctors:**\n`;
        mlResponse.recommended_doctors.slice(0, 3).forEach((doctor, index) => {
          responseContent += `${index + 1}. Dr. ${doctor.name} - ${doctor.discipline}\n   📍 ${doctor.facility}, ${doctor.district}\n   📞 ${doctor.contact_no}\n\n`;
        });
      }

      const botResponse = {
        id: Date.now() + 1,
        type: "bot",
        content: responseContent,
        timestamp: new Date(),
        responseTime: (Math.random() * 2 + 1).toFixed(1),
        mlPowered: true,
        hasSymptoms,
        hasPredictions,
        extractedSymptoms: mlResponse.extracted_symptoms || [],
        predictions: mlResponse.predicted_conditions || null,
      };

      setMessages((prev) =>
        prev.filter((msg) => msg.id !== "loading").concat(botResponse)
      );
      setIsLoading(false);
    } catch (error) {
      console.error("ML Response error:", error);
      // Fallback to basic response
      await handleBasicResponse(message);
    }
  };

  const handleBasicResponse = async (message) => {
    // Simulate AI response delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: "bot",
        content: generateBasicAIResponse(message),
        timestamp: new Date(),
        responseTime: (Math.random() * 2 + 1).toFixed(1),
        mlPowered: false,
      };

      setMessages((prev) =>
        prev.filter((msg) => msg.id !== "loading").concat(botResponse)
      );
      setIsLoading(false);
    }, 1500);
  };

  const handleErrorResponse = async (error) => {
    const errorResponse = {
      id: Date.now() + 1,
      type: "bot",
      content: `I'm sorry, I encountered an error while processing your request. ${
        !mlServiceAvailable 
          ? "The ML prediction service is currently unavailable. " 
          : ""
      }Please try again or contact your healthcare provider if you need immediate assistance.`,
      timestamp: new Date(),
      isError: true,
    };

    setMessages((prev) =>
      prev.filter((msg) => msg.id !== "loading").concat(errorResponse)
    );
    setIsLoading(false);
  };

  const generateBasicAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check if user is describing symptoms
    if (lowerMessage.includes("symptom") || lowerMessage.includes("pain") || 
        lowerMessage.includes("fever") || lowerMessage.includes("headache") ||
        lowerMessage.includes("cough") || lowerMessage.includes("tired") ||
        lowerMessage.includes("sick") || lowerMessage.includes("hurt")) {
      return "I understand you're experiencing some symptoms. For accurate medical analysis, I recommend consulting with a healthcare professional. The ML prediction service is currently unavailable, but I'm here to provide general health guidance and help you understand when to seek medical care.";
    }
    
    // Basic responses for different types of health queries
    const responses = [
      "I understand your concern. Based on your medical history, I recommend discussing this with your healthcare provider.",
      "That's a good question. Your current medications might be related to this symptom. Let me check your records.",
      "Thank you for sharing this information. It's important to monitor these changes. I suggest scheduling an appointment.",
      "Based on your health profile, this could be normal, but it's always best to consult with your doctor.",
      "I see you're taking medication that can sometimes cause these effects. Please mention this at your next appointment.",
      "Your vital signs look stable. However, it's important to continue monitoring and follow your treatment plan.",
      "This symptom could be related to your current condition. I recommend keeping a health diary to track patterns.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative h-[calc(100vh-8rem)] flex flex-col">
      {/* ML Service Status Indicator */}
      {/* <div className={`px-4 py-2 text-xs font-medium ${
        mlServiceAvailable 
          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700" 
          : "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-700"
      } border-b`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            mlServiceAvailable ? "bg-green-500" : "bg-orange-500"
          }`}></div>
          {mlServiceAvailable 
            ? "🤖 AI-Powered Analysis Available - Advanced ML models active" 
            : "⚠️ ML Service Unavailable - Using basic responses only"
          }
        </div>
      </div> */}
      
      {/* Chat Messages Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-4 p-6 pb-24"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#53a2e3 transparent",
        }}
      >
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex max-w-[85%] sm:max-w-[80%] ${
                message.type === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 ${
                  message.type === "user" ? "ml-3" : "mr-3"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === "user" 
                      ? "bg-[#53a2e3]" 
                      : message.mlPowered 
                        ? "bg-gradient-to-r from-purple-500 to-[#53a2e3]" 
                        : "bg-[#53a2e3]"
                  }`}
                >
                  {message.type === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : message.mlPowered ? (
                    <Activity className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div
                className={`rounded-2xl px-4 py-3 max-w-full break-words ${
                  message.type === "user"
                    ? "bg-[#53a2e3] text-white"
                    : message.isError
                    ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700"
                    : "bg-[#e1eeff] dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                }`}
              >
                {message.isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#53a2e3] rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-[#53a2e3] rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-[#53a2e3] rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {message.content}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-start space-x-2">
                    {message.isError && (
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    )}
                    {message.mlPowered && (
                      <Stethoscope className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">
                        {message.content}
                      </p>
                      {message.mlPowered && (
                        <div className="mt-2 text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded border border-purple-200 dark:border-purple-700">
                          🤖 AI-Powered Analysis {message.hasSymptoms && "• Symptoms Detected"} {message.hasPredictions && "• ML Predictions"}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div
                  className={`text-xs mt-1 opacity-70 flex items-center justify-between ${
                    message.type === "user"
                      ? "text-blue-100"
                      : message.isError
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  <span>{formatTime(message.timestamp)}</span>
                  {message.responseTime && !message.isError && (
                    <span className="ml-2">({message.responseTime}s)</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Input Area at Bottom - Always sticks to bottom */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900 shadow-lg">
        <form onSubmit={handleSendMessage}>
          <div className="relative bg-[#e1eeff] dark:bg-gray-800 rounded-xl border border-blue-200 dark:border-gray-600 focus-within:border-[#53a2e3] transition-colors">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me about your health, medications, or symptoms..."
              disabled={isLoading}
              className="w-full bg-transparent px-6 py-4 pr-14 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-200 disabled:opacity-50 rounded-xl"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#53a2e3] hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-2.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
