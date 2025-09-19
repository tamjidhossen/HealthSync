import {
  Activity,
  Calendar,
  FileText,
  Heart,
  Home,
  MessageCircle,
  Pill,
  Settings,
  Stethoscope,
  User,
  Users,
  Building2,
  ClipboardList,
  Shield,
  BarChart3,
} from "lucide-react";

export const navigationConfig = {
  patient: [
    {
      title: "Overview",
      url: "/dashboard/overview",
      icon: Home,
    },
    {
      title: "Medical Records",
      url: "/dashboard/medical-records",
      icon: FileText,
    },
    {
      title: "AI Assistant",
      url: "/dashboard/ai-assistant",
      icon: MessageCircle,
    },
    {
      title: "Appointments",
      url: "/dashboard/appointments",
      icon: Calendar,
    },
    {
      title: "Medications",
      url: "/dashboard/medications",
      icon: Pill,
    },
    {
      title: "Profile Settings",
      url: "/dashboard/profile",
      icon: Settings,
    },
  ],
  doctor: [
    {
      title: "Today's Schedule",
      url: "/dashboard/schedule",
      icon: Calendar,
    },
    {
      title: "Patient Management",
      url: "/dashboard/patients",
      icon: Users,
    },
    {
      title: "AI Assistant",
      url: "/dashboard/ai-assistant",
      icon: MessageCircle,
    },
    {
      title: "Patient Records",
      url: "/dashboard/records",
      icon: FileText,
    },
    {
      title: "Appointments",
      url: "/dashboard/appointments",
      icon: ClipboardList,
    },
    {
      title: "Prescriptions",
      url: "/dashboard/prescriptions",
      icon: Pill,
    },
    {
      title: "Availability",
      url: "/dashboard/availability",
      icon: Activity,
    },
    {
      title: "Insights",
      url: "/dashboard/insights",
      icon: BarChart3,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: User,
    },
  ],
  institute: [
    {
      title: "Appointment Hub",
      url: "/dashboard/appointment-hub",
      icon: Calendar,
    },
    {
      title: "Doctor Management",
      url: "/dashboard/doctors",
      icon: Stethoscope,
    },
    {
      title: "Slot Management",
      url: "/dashboard/slots",
      icon: ClipboardList,
    },
    {
      title: "Roster Management",
      url: "/dashboard/roster",
      icon: Users,
    },
    {
      title: "Communications",
      url: "/dashboard/communications",
      icon: MessageCircle,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],
  admin: [
    {
      title: "Overview",
      url: "/dashboard/overview",
      icon: Home,
    },
    {
      title: "Verification Center",
      url: "/dashboard/verification",
      icon: Shield,
    },
    {
      title: "User Management",
      url: "/dashboard/users",
      icon: Users,
    },
    {
      title: "System Monitoring",
      url: "/dashboard/monitoring",
      icon: Activity,
    },
    {
      title: "Audit Dashboard",
      url: "/dashboard/audit",
      icon: BarChart3,
    },
    {
      title: "Configuration",
      url: "/dashboard/config",
      icon: Settings,
    },
  ],
};

export const getRoleDisplayName = (role) => {
  const roleNames = {
    patient: "Patient",
    doctor: "Doctor",
    institute: "Institute",
    admin: "Administrator",
  };
  return roleNames[role] || "User";
};

export const getRoleIcon = (role) => {
  const roleIcons = {
    patient: Heart,
    doctor: Stethoscope,
    institute: Building2,
    admin: Shield,
  };
  return roleIcons[role] || User;
};
