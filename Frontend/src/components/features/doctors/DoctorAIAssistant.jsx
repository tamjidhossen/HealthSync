import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, AlertCircle, Stethoscope } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { doctorData } from "@/data/doctor-data";

export function DoctorAIAssistant() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Get patient list from doctor data
  const patientList = doctorData.patients || [];

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handlePatientSelect = (patientId) => {
    const patient = patientList.find((p) => p.id === patientId);
    setSelectedPatient(patient);
    setMessages([
      {
        id: 1,
        type: "bot",
        content: `Hello Dr. Rahman! I'm your AI medical assistant. I now have access to ${patient.name}'s medical records and can help you with diagnosis, treatment planning, medication reviews, and medical insights. How can I assist you today?`,
        timestamp: new Date(),
      },
    ]);
  };

  // Dummy loading message for shimmer effect
  const loadingMessage = {
    id: "loading",
    type: "bot",
    content: "Analyzing patient data and medical records...",
    timestamp: new Date(),
    isLoading: true,
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !selectedPatient) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Add loading message
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // Simulate AI response delay
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          type: "bot",
          content: generateDoctorAIResponse(inputMessage, selectedPatient),
          timestamp: new Date(),
          responseTime: (Math.random() * 2 + 1).toFixed(1),
        };

        setMessages((prev) =>
          prev.filter((msg) => msg.id !== "loading").concat(botResponse)
        );
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Chat error:", error);

      const errorResponse = {
        id: Date.now() + 1,
        type: "bot",
        content:
          "I'm sorry, I encountered an error while analyzing the medical data. Please try again or consult with other medical resources.",
        timestamp: new Date(),
        isError: true,
      };

      setMessages((prev) =>
        prev.filter((msg) => msg.id !== "loading").concat(errorResponse)
      );
      setIsLoading(false);
    }
  };

  const generateDoctorAIResponse = (message, patient) => {
    const lowerMessage = message.toLowerCase();

    // Medical history responses
    if (
      lowerMessage.includes("history") ||
      lowerMessage.includes("medical record")
    ) {
      return `${patient.name}'s medical history shows: 
      • Current condition: ${patient.condition}
      • Age: ${patient.age}, Gender: ${patient.gender}
      • Blood type: ${patient.bloodType}
      • Status: ${patient.status}
      • Last visit: ${patient.lastVisit}
      • Current vitals: BP ${patient.vitalSigns?.bloodPressure}, HR ${patient.vitalSigns?.heartRate}
      
      Recent medical history includes documented treatments and ongoing care. Would you like me to elaborate on any specific aspect?`;
    }

    // Medication-related responses
    if (
      lowerMessage.includes("medication") ||
      lowerMessage.includes("prescription") ||
      lowerMessage.includes("drug")
    ) {
      const medications = patient.currentMedications || [];
      const medsList =
        medications.length > 0
          ? medications
              .map((med) => `${med.name} ${med.dosage} (${med.frequency})`)
              .join(", ")
          : "No current medications on record";

      return `Current medications for ${patient.name}:
      ${medsList}
      
      Based on the patient's condition (${patient.condition}) and current status (${patient.status}), I can help review drug interactions, dosage adjustments, or suggest additional treatments. What specific medication inquiry do you have?`;
    }

    // Diagnosis and assessment
    if (
      lowerMessage.includes("diagnosis") ||
      lowerMessage.includes("assess") ||
      lowerMessage.includes("symptoms")
    ) {
      return `For ${patient.name}'s current condition (${patient.condition}):
      • Current status: ${patient.status}
      • Vital signs: ${patient.vitalSigns?.bloodPressure} BP, ${patient.vitalSigns?.heartRate} HR
      • Patient profile: ${patient.age}-year-old ${patient.gender}
      
      Based on the medical data, I recommend continuing current monitoring protocols. The patient's condition appears ${patient.status}. Would you like me to suggest specific diagnostic tests or treatment modifications?`;
    }

    // Lab and test results
    if (
      lowerMessage.includes("lab") ||
      lowerMessage.includes("test") ||
      lowerMessage.includes("result")
    ) {
      return `Lab and diagnostic recommendations for ${patient.name}:
      • Current vitals are within acceptable ranges for their condition
      • Blood pressure: ${patient.vitalSigns?.bloodPressure}
      • Heart rate: ${patient.vitalSigns?.heartRate}
      • Weight: ${patient.vitalSigns?.weight}
      
      Consider ordering follow-up tests based on ${patient.condition} protocols. I can help interpret results and suggest appropriate monitoring intervals.`;
    }

    // Treatment planning
    if (
      lowerMessage.includes("treatment") ||
      lowerMessage.includes("plan") ||
      lowerMessage.includes("therapy")
    ) {
      return `Treatment planning for ${patient.name}:
      • Current condition: ${patient.condition} (${patient.status})
      • Age considerations: ${patient.age} years old
      • Current treatment appears effective based on ${patient.status} status
      
      I recommend continuing current care protocols with regular monitoring. Would you like me to suggest modifications to the treatment plan or discuss alternative approaches?`;
    }

    // Default response
    return `I'm here to help with ${patient.name}'s medical care. I can assist with:
    • Medical history review and analysis
    • Medication management and interactions
    • Diagnostic recommendations and test interpretation
    • Treatment planning and modifications
    • Clinical decision support
    
    Patient summary: ${patient.age}-year-old ${patient.gender} with ${patient.condition}, currently ${patient.status}. What specific medical guidance do you need?`;
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative h-[calc(100vh-8rem)] flex flex-col">
      {/* Sticky Patient Selection Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Stethoscope className="h-5 w-5 text-[#53a2e3]" />
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">
              AI Medical Assistant
            </h2>
          </div>

          <div className="flex-1">
            <Select onValueChange={handlePatientSelect}>
              <SelectTrigger className="w-full max-w-md bg-[#e1eeff] dark:bg-gray-800 border-blue-200 dark:border-gray-600">
                <SelectValue placeholder="Select a patient to start consultation" />
              </SelectTrigger>
              <SelectContent>
                {patientList.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    <div className="flex items-center space-x-3 py-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={patient.profilePicture}
                          alt={patient.name}
                        />
                        <AvatarFallback className="text-xs">
                          {patient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{patient.name}</span>
                        <Badge
                          variant={
                            patient.status === "stable"
                              ? "default"
                              : "destructive"
                          }
                          className="text-xs"
                        >
                          {patient.condition}
                        </Badge>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPatient && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Active: {selectedPatient.name}</span>
            </div>
          )}
        </div>
      </div>

      {selectedPatient ? (
        <>
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
                          : "bg-[#53a2e3]"
                      }`}
                    >
                      {message.type === "user" ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Stethoscope className="w-4 h-4 text-white" />
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
                        <p className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere flex-1">
                          {message.content}
                        </p>
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

          {/* Fixed Input Area at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900 shadow-lg">
            <form onSubmit={handleSendMessage}>
              <div className="relative bg-[#e1eeff] dark:bg-gray-800 rounded-xl border border-blue-200 dark:border-gray-600 focus-within:border-[#53a2e3] transition-colors">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Ask about ${selectedPatient.name}'s diagnosis, medications, treatment plan, or medical history...`}
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
        </>
      ) : (
        /* No Patient Selected State */
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-6 max-w-md">
            <div className="p-4 bg-[#e1eeff] dark:bg-gray-800 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
              <Stethoscope className="h-10 w-10 text-[#53a2e3]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                AI Medical Assistant
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Select a patient from the dropdown above to start an intelligent
                medical consultation
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 text-left bg-[#e1eeff] dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-[#53a2e3] rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">
                  Patient medical history analysis
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-[#53a2e3] rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">
                  Medication review and interactions
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-[#53a2e3] rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">
                  Diagnostic recommendations
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-[#53a2e3] rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">
                  Treatment planning assistance
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { DoctorAIAssistant as default };
