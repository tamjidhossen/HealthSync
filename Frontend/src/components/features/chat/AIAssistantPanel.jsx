import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Lightbulb,
  Heart,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { patientData } from "../../../data/patient-data";

export function AIAssistantPanel() {
  const [messages, setMessages] = useState(
    patientData.chatHistory[0]?.messages || []
  );
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: `MSG${Date.now()}`,
      sender: "patient",
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = {
        id: `MSG${Date.now() + 1}`,
        sender: "ai",
        message: generateAIResponse(),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = () => {
    const responses = [
      "I understand your concern. Based on your medical history, I recommend discussing this with your healthcare provider.",
      "That's a good question. Your current medications might be related to this symptom. Let me check your records.",
      "Thank you for sharing this information. It's important to monitor these changes. I suggest scheduling an appointment.",
      "Based on your health profile, this could be normal, but it's always best to consult with Dr. Ahmed Rahman.",
      "I see you're taking Amlodipine, which can sometimes cause these effects. Please mention this at your next appointment.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const quickQuestions = [
    "What are the side effects of my medications?",
    "When is my next appointment?",
    "I'm feeling dizzy, what should I do?",
    "Can I exercise with my current condition?",
    "What foods should I avoid?",
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          AI Health Assistant
        </h1>
        <p className="text-muted-foreground mt-1">
          Get personalized health insights and ask questions about your health
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                Chat with AI Assistant
              </CardTitle>
              <CardDescription>
                Ask questions about your health, medications, or symptoms
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "patient"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === "patient"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.sender === "patient" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                        <span className="text-xs opacity-75">
                          {message.sender === "patient"
                            ? "You"
                            : "AI Assistant"}
                        </span>
                      </div>
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        <span className="text-xs">
                          AI Assistant is typing...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ask about your health, medications, or symptoms..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Quick Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start text-sm"
                  onClick={() => setNewMessage(question)}
                >
                  {question}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Health Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                Health Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {patientData.aiInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="p-3 border dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {insight.priority === "medium" ? (
                      <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    ) : (
                      <Heart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    )}
                    <Badge
                      variant="outline"
                      className="text-xs dark:border-gray-600 dark:text-gray-300"
                    >
                      {insight.type.replace("_", " ")}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-sm dark:text-gray-200">
                    {insight.title}
                  </h4>
                  <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                    {insight.message}
                  </p>
                  {insight.score && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs dark:text-gray-300">
                        <span>Score</span>
                        <span>{insight.score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
                          style={{ width: `${insight.score}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Emergency Notice */}
          <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-300 mb-2">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-semibold">Emergency Notice</span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-200">
                This AI assistant is for informational purposes only. In case of
                medical emergencies, call emergency services or visit the
                nearest hospital immediately.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
