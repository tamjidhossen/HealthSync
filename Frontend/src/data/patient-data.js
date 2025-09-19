// Dummy data for Patient Dashboard features
export const patientData = {
  // Basic patient information
  profile: {
    id: "PAT001",
    name: "Sarah Johnson",
    age: 32,
    gender: "Female",
    dateOfBirth: "1992-03-15",
    bloodType: "A+",
    phone: "+8801711123456",
    email: "sarah.johnson@email.com",
    address: "123 Dhanmondi Road, Dhaka-1205",
    emergencyContact: {
      name: "John Johnson",
      relationship: "Husband",
      phone: "+8801711654321",
    },
    profilePicture: "/api/placeholder/150/150",
    registrationDate: "2023-01-15",
  },

  // Health overview stats
  healthOverview: {
    height: "165 cm",
    weight: "62 kg",
    bmi: "22.8",
    bloodPressure: "120/80",
    heartRate: "72 bpm",
    temperature: "98.6°F",
    lastCheckup: "2024-08-15",
    riskLevel: "Low",
    chronicConditions: ["Mild Hypertension"],
    allergies: ["Penicillin", "Shellfish"],
  },

  // Upcoming appointments
  upcomingAppointments: [
    {
      id: "APT001",
      doctorName: "Dr. Ahmed Rahman",
      specialty: "Cardiology",
      date: "2024-09-20",
      time: "10:30 AM",
      location: "United Hospital, Dhaka",
      type: "Follow-up",
      status: "confirmed",
      notes: "Routine checkup for blood pressure monitoring",
    },
    {
      id: "APT002",
      doctorName: "Dr. Fatima Khan",
      specialty: "General Medicine",
      date: "2024-09-25",
      time: "2:00 PM",
      location: "Square Hospital, Dhaka",
      type: "Consultation",
      status: "pending",
      notes: "Annual health screening",
    },
  ],

  // Recent prescriptions
  recentPrescriptions: [
    {
      id: "RX001",
      doctorName: "Dr. Ahmed Rahman",
      date: "2024-08-15",
      medications: [
        {
          name: "Amlodipine",
          dosage: "5mg",
          frequency: "Once daily",
          duration: "30 days",
        },
        {
          name: "Metformin",
          dosage: "500mg",
          frequency: "Twice daily",
          duration: "30 days",
        },
      ],
      status: "active",
    },
    {
      id: "RX002",
      doctorName: "Dr. Fatima Khan",
      date: "2024-07-20",
      medications: [
        {
          name: "Vitamin D3",
          dosage: "1000 IU",
          frequency: "Once daily",
          duration: "60 days",
        },
      ],
      status: "completed",
    },
  ],

  // Current medications
  currentMedications: [
    {
      id: "MED001",
      name: "Amlodipine",
      dosage: "5mg",
      frequency: "Once daily",
      timeOfDay: ["8:00 AM"],
      startDate: "2024-08-15",
      endDate: "2024-09-15",
      prescribedBy: "Dr. Ahmed Rahman",
      purpose: "Blood pressure control",
      sideEffects: ["Dizziness", "Swelling in ankles"],
      reminders: true,
      stock: 15,
    },
    {
      id: "MED002",
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      timeOfDay: ["8:00 AM", "8:00 PM"],
      startDate: "2024-08-15",
      endDate: "2024-09-15",
      prescribedBy: "Dr. Ahmed Rahman",
      purpose: "Diabetes management",
      sideEffects: ["Nausea", "Stomach upset"],
      reminders: true,
      stock: 28,
    },
    {
      id: "MED003",
      name: "Vitamin D3",
      dosage: "1000 IU",
      frequency: "Once daily",
      timeOfDay: ["9:00 AM"],
      startDate: "2024-07-20",
      endDate: "2024-09-20",
      prescribedBy: "Dr. Fatima Khan",
      purpose: "Vitamin D deficiency",
      sideEffects: [],
      reminders: true,
      stock: 5,
    },
  ],

  // Medical history timeline
  medicalHistory: [
    {
      id: "HIST001",
      date: "2024-08-15",
      type: "checkup",
      title: "Cardiology Follow-up",
      doctor: "Dr. Ahmed Rahman",
      location: "United Hospital",
      diagnosis: "Mild Hypertension - Controlled",
      treatment: "Continue current medication",
      notes:
        "Blood pressure well controlled. Patient responding well to treatment.",
      documents: ["blood_pressure_log.pdf", "ecg_report.pdf"],
    },
    {
      id: "HIST002",
      date: "2024-07-20",
      type: "consultation",
      title: "Annual Health Screening",
      doctor: "Dr. Fatima Khan",
      location: "Square Hospital",
      diagnosis: "Vitamin D Deficiency",
      treatment: "Vitamin D3 supplementation",
      notes:
        "Overall health good. Recommended lifestyle changes and vitamin supplementation.",
      documents: ["blood_test_results.pdf", "health_screening_report.pdf"],
    },
    {
      id: "HIST003",
      date: "2024-06-10",
      type: "emergency",
      title: "Emergency Visit",
      doctor: "Dr. Emergency Staff",
      location: "Dhaka Medical College",
      diagnosis: "Food Poisoning",
      treatment: "IV fluids and medication",
      notes: "Patient recovered fully within 24 hours.",
      documents: ["emergency_report.pdf"],
    },
    {
      id: "HIST004",
      date: "2024-03-15",
      type: "surgery",
      title: "Minor Surgery",
      doctor: "Dr. Surgery Specialist",
      location: "Apollo Hospital",
      diagnosis: "Appendicitis",
      treatment: "Laparoscopic Appendectomy",
      notes: "Successful surgery. Full recovery in 2 weeks.",
      documents: ["surgery_report.pdf", "post_op_notes.pdf"],
    },
  ],

  // Lab results
  labResults: [
    {
      id: "LAB001",
      date: "2024-08-15",
      testName: "Complete Blood Count",
      status: "completed",
      results: {
        hemoglobin: {
          value: "13.5",
          unit: "g/dL",
          normal: "12.0-15.5",
          status: "normal",
        },
        wbc: {
          value: "7200",
          unit: "/μL",
          normal: "4000-11000",
          status: "normal",
        },
        platelets: {
          value: "280000",
          unit: "/μL",
          normal: "150000-450000",
          status: "normal",
        },
      },
      reportUrl: "/reports/cbc_20240815.pdf",
    },
    {
      id: "LAB002",
      date: "2024-08-15",
      testName: "Lipid Profile",
      status: "completed",
      results: {
        totalCholesterol: {
          value: "185",
          unit: "mg/dL",
          normal: "<200",
          status: "normal",
        },
        ldl: { value: "110", unit: "mg/dL", normal: "<100", status: "high" },
        hdl: { value: "55", unit: "mg/dL", normal: ">40", status: "normal" },
        triglycerides: {
          value: "120",
          unit: "mg/dL",
          normal: "<150",
          status: "normal",
        },
      },
      reportUrl: "/reports/lipid_20240815.pdf",
    },
    {
      id: "LAB003",
      date: "2024-07-20",
      testName: "Vitamin D",
      status: "completed",
      results: {
        vitaminD: {
          value: "18",
          unit: "ng/mL",
          normal: "30-100",
          status: "low",
        },
      },
      reportUrl: "/reports/vitamin_d_20240720.pdf",
    },
  ],

  // Notifications
  notifications: [
    {
      id: "NOT001",
      type: "reminder",
      title: "Medication Reminder",
      message: "Time to take your Amlodipine (5mg)",
      time: "8:00 AM",
      date: "2024-09-18",
      read: false,
      priority: "high",
    },
    {
      id: "NOT002",
      type: "appointment",
      title: "Upcoming Appointment",
      message:
        "You have an appointment with Dr. Ahmed Rahman tomorrow at 10:30 AM",
      time: "9:00 AM",
      date: "2024-09-19",
      read: false,
      priority: "high",
    },
    {
      id: "NOT003",
      type: "result",
      title: "Lab Results Available",
      message: "Your recent blood test results are now available",
      time: "2:30 PM",
      date: "2024-09-17",
      read: true,
      priority: "medium",
    },
    {
      id: "NOT004",
      type: "health_tip",
      title: "Health Tip",
      message: "Remember to stay hydrated and take your medications on time",
      time: "10:00 AM",
      date: "2024-09-18",
      read: true,
      priority: "low",
    },
  ],

  // Appointment history
  appointmentHistory: [
    {
      id: "APT_H001",
      doctorName: "Dr. Ahmed Rahman",
      specialty: "Cardiology",
      date: "2024-08-15",
      time: "10:30 AM",
      location: "United Hospital, Dhaka",
      type: "Follow-up",
      status: "completed",
      duration: "30 minutes",
      notes: "Routine checkup completed. Patient doing well.",
      diagnosis: "Mild Hypertension - Controlled",
      nextAppointment: "2024-09-20",
    },
    {
      id: "APT_H002",
      doctorName: "Dr. Fatima Khan",
      specialty: "General Medicine",
      date: "2024-07-20",
      time: "2:00 PM",
      location: "Square Hospital, Dhaka",
      type: "Consultation",
      status: "completed",
      duration: "45 minutes",
      notes: "Annual health screening completed.",
      diagnosis: "Generally healthy, Vitamin D deficiency",
      nextAppointment: "2025-07-20",
    },
  ],

  // Health insights from AI
  aiInsights: [
    {
      id: "AI001",
      type: "medication_adherence",
      title: "Medication Adherence",
      message:
        "You've been taking your medications consistently. Keep up the good work!",
      score: 95,
      date: "2024-09-18",
      priority: "info",
    },
    {
      id: "AI002",
      type: "health_trend",
      title: "Blood Pressure Trend",
      message: "Your blood pressure has been stable over the past month.",
      trend: "stable",
      date: "2024-09-18",
      priority: "info",
    },
    {
      id: "AI003",
      type: "recommendation",
      title: "Health Recommendation",
      message:
        "Consider adding light exercise to your routine to further improve cardiovascular health.",
      date: "2024-09-17",
      priority: "medium",
    },
  ],

  // Chat history with AI assistant
  chatHistory: [
    {
      id: "CHAT001",
      date: "2024-09-18",
      messages: [
        {
          id: "MSG001",
          sender: "patient",
          message: "I've been feeling dizzy lately, should I be concerned?",
          timestamp: "2024-09-18T10:30:00Z",
        },
        {
          id: "MSG002",
          sender: "ai",
          message:
            "Dizziness can be a side effect of your blood pressure medication (Amlodipine). However, it's important to monitor this. Have you noticed any patterns, like when you stand up quickly?",
          timestamp: "2024-09-18T10:30:30Z",
        },
        {
          id: "MSG003",
          sender: "patient",
          message: "Yes, mostly when I stand up from sitting or lying down.",
          timestamp: "2024-09-18T10:31:00Z",
        },
        {
          id: "MSG004",
          sender: "ai",
          message:
            "This sounds like orthostatic hypotension, which can be related to your blood pressure medication. I recommend discussing this with Dr. Ahmed Rahman at your upcoming appointment on September 20th. In the meantime, try standing up slowly and staying well hydrated.",
          timestamp: "2024-09-18T10:31:30Z",
        },
      ],
    },
  ],
};

// Helper functions for data manipulation
export const patientHelpers = {
  getUpcomingAppointments: () => patientData.upcomingAppointments,
  getCurrentMedications: () => patientData.currentMedications,
  getUnreadNotifications: () =>
    patientData.notifications.filter((n) => !n.read),
  getRecentLabResults: (limit = 3) => patientData.labResults.slice(0, limit),
  getMedicationReminders: () => {
    return patientData.currentMedications.filter((med) => med.reminders);
  },
  getHealthInsights: () => patientData.aiInsights,
  getMedicalHistoryByType: (type) =>
    patientData.medicalHistory.filter((h) => h.type === type),
};
