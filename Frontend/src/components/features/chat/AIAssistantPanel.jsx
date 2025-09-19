import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, AlertCircle } from "lucide-react";

export function AIAssistantPanel() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm your HealthSync AI assistant. How can I help you with your health today?",
      timestamp: new Date(Date.now() - 5 * 60000),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

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
          content: generateAIResponse(),
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
          "I'm sorry, I encountered an error. Please try again or contact your healthcare provider.",
        timestamp: new Date(),
        isError: true,
      };

      setMessages((prev) =>
        prev.filter((msg) => msg.id !== "loading").concat(errorResponse)
      );
      setIsLoading(false);
    }
  };

  const generateAIResponse = () => {
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
    <div className="h-full flex flex-col">
      {/* Chat Messages Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-4 p-6"
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
                    message.type === "user" ? "bg-[#53a2e3]" : "bg-[#53a2e3]"
                  }`}
                >
                  {message.type === "user" ? (
                    <User className="w-4 h-4 text-white" />
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

      {/* Fixed Input Area at Bottom - Always sticks to bottom */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
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
