export const dummyUsers = {
  patient: {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: null,
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-05-15",
    address: "123 Main St, Anytown, USA",
    emergencyContact: {
      name: "Jane Doe",
      phone: "+1 (555) 987-6543",
      relationship: "Spouse",
    },
  },
  doctor: {
    id: 2,
    name: "Dr. Sarah Wilson",
    email: "sarah.wilson@healthsync.com",
    avatar: null,
    phone: "+1 (555) 234-5678",
    specialization: "Cardiologist",
    license: "MD-12345",
    department: "Cardiology",
    hospital: "HealthSync Medical Center",
  },
  institute: {
    id: 3,
    name: "HealthSync Medical Center",
    email: "admin@healthsync.com",
    avatar: null,
    phone: "+1 (555) 345-6789",
    address: "456 Medical Plaza, Healthcare City",
    type: "Hospital",
    departments: ["Cardiology", "Neurology", "Pediatrics", "Emergency"],
  },
  admin: {
    id: 4,
    name: "System Administrator",
    email: "admin@healthsync.system",
    avatar: null,
    phone: "+1 (555) 456-7890",
    role: "System Admin",
    permissions: ["all"],
  },
};

export const dummyNotifications = [
  {
    id: 1,
    title: "Appointment Reminder",
    message: "You have an appointment with Dr. Wilson tomorrow at 2:00 PM",
    type: "reminder",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
  },
  {
    id: 2,
    title: "Test Results Available",
    message: "Your blood test results are now available",
    type: "info",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    read: false,
  },
  {
    id: 3,
    title: "Prescription Refill",
    message: "Your prescription is ready for pickup",
    type: "info",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: true,
  },
];
