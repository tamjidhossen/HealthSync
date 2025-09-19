import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Send,
  MessageCircle,
  Stethoscope,
  Pill,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
} from "lucide-react";
import { doctorData } from "@/data/doctor-data";

const DoctorAIAssistant = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Get patient list from doctor data
  const patientList = doctorData.patients || [];

  const handlePatientSelect = (patientId) => {
    const patient = patientList.find((p) => p.id === patientId);
    setSelectedPatient(patient);
    setMessages([
      {
        id: 1,
        sender: "AI",
        content: `Hello! I'm your AI medical assistant. I have access to ${patient.name}'s medical records. How can I help you today?`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedPatient) return;

    const userMessage = {
      id: messages.length + 1,
      sender: "Doctor",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    // Simulate AI response with medical context
    setTimeout(() => {
      let aiResponse = "";

      if (
        newMessage.toLowerCase().includes("diagnosis") ||
        newMessage.toLowerCase().includes("diagnose")
      ) {
        aiResponse = `Based on ${
          selectedPatient.name
        }'s recent symptoms and medical history, I recommend considering differential diagnosis including viral infection, bacterial complications, or chronic condition exacerbation. Current vital signs show: BP ${
          selectedPatient.vitals?.bloodPressure || "120/80"
        }, HR ${
          selectedPatient.vitals?.heartRate || "72 bpm"
        }. Would you like me to analyze specific lab results or symptoms?`;
      } else if (
        newMessage.toLowerCase().includes("medication") ||
        newMessage.toLowerCase().includes("prescription")
      ) {
        aiResponse = `${selectedPatient.name} is currently on: ${
          selectedPatient.medications?.map((med) => med.name).join(", ") ||
          "No current medications"
        }. For drug interactions and dosage recommendations, please consider patient's age (${
          selectedPatient.age
        }), weight, and current condition. Any specific medication you'd like to prescribe or modify?`;
      } else if (
        newMessage.toLowerCase().includes("test") ||
        newMessage.toLowerCase().includes("lab")
      ) {
        aiResponse = `Latest lab results for ${
          selectedPatient.name
        }: Recent tests show ${
          selectedPatient.condition || "stable condition"
        }. I recommend ordering: Complete Blood Count, Comprehensive Metabolic Panel, and condition-specific tests based on current symptoms. Shall I prepare the lab order forms?`;
      } else if (
        newMessage.toLowerCase().includes("history") ||
        newMessage.toLowerCase().includes("medical record")
      ) {
        aiResponse = `${
          selectedPatient.name
        }'s medical history includes: Previous conditions, allergies, and family history. Age: ${
          selectedPatient.age
        }, Gender: ${selectedPatient.gender}, Current status: ${
          selectedPatient.condition
        }. Emergency contact: ${
          selectedPatient.emergencyContact || "On file"
        }. What specific aspect would you like to review?`;
      } else {
        aiResponse = `I understand you're asking about ${selectedPatient.name}. As your AI medical assistant, I can help with diagnosis suggestions, medication reviews, lab interpretations, treatment planning, or patient history analysis. Could you be more specific about what medical assistance you need?`;
      }

      const aiMessage = {
        id: messages.length + 2,
        sender: "AI",
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const quickActions = [
    {
      label: "Diagnosis Help",
      icon: Stethoscope,
      query: "Help me with diagnosis for current symptoms",
    },
    {
      label: "Medication Review",
      icon: Pill,
      query: "Review current medications and suggest adjustments",
    },
    {
      label: "Lab Results",
      icon: FileText,
      query: "Analyze latest lab test results",
    },
    {
      label: "Medical History",
      icon: Clock,
      query: "Review complete medical history and previous treatments",
    },
  ];

  const handleQuickAction = (query) => {
    setNewMessage(query);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <MessageCircle className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            AI Medical Assistant
          </h2>
          <p className="text-muted-foreground">
            Get intelligent medical insights and recommendations
          </p>
        </div>
      </div>

      {/* Patient Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Select Patient</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handlePatientSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a patient to start consultation" />
            </SelectTrigger>
            <SelectContent>
              {patientList.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={patient.avatar} alt={patient.name} />
                      <AvatarFallback>
                        {patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{patient.name}</span>
                    <Badge variant="outline" className="ml-auto">
                      {patient.condition}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedPatient && (
            <div className="mt-4 p-4 bg-muted/20 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={selectedPatient.avatar}
                    alt={selectedPatient.name}
                  />
                  <AvatarFallback>
                    {selectedPatient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {selectedPatient.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedPatient.age} years old • {selectedPatient.gender} •{" "}
                    {selectedPatient.condition}
                  </p>
                </div>
                <div className="ml-auto">
                  <Badge
                    variant={
                      selectedPatient.condition === "Stable"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {selectedPatient.condition}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Interface */}
      {selectedPatient && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Medical Consultation - {selectedPatient.name}</span>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">
                  AI Assistant Active
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {/* Quick Actions */}
              <div>
                <p className="text-sm font-medium text-foreground mb-3">
                  Quick Actions:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action.query)}
                      className="justify-start space-x-2 h-auto p-3"
                    >
                      <action.icon className="h-4 w-4" />
                      <span>{action.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div className="h-96 overflow-y-auto space-y-4 p-4 bg-muted/10 border border-border rounded-lg">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "Doctor"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === "Doctor"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border text-card-foreground"
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        {message.sender === "AI" && (
                          <Stethoscope className="h-4 w-4" />
                        )}
                        <span className="text-xs font-medium">
                          {message.sender === "Doctor"
                            ? "Dr. You"
                            : "AI Assistant"}
                        </span>
                        <span className="text-xs opacity-70">
                          {message.timestamp}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-card border border-border text-card-foreground px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Stethoscope className="h-4 w-4" />
                        <span className="text-xs font-medium">
                          AI Assistant
                        </span>
                      </div>
                      <div className="flex space-x-1 mt-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-current rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-current rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ask about diagnosis, medications, tests, or medical history..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isTyping}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      {!selectedPatient && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  AI Medical Assistant
                </h3>
                <p className="text-muted-foreground">
                  Select a patient above to start an intelligent medical
                  consultation
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-foreground">
                      Diagnosis assistance
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-foreground">
                      Medication reviews
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-foreground">
                      Lab result analysis
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-foreground">
                      Medical history insights
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DoctorAIAssistant;
