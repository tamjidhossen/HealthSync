import { useEffect } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { useDashboard } from "../../hooks/useDashboard";
import { useUser } from "../../hooks/useUser";

// Import all patient dashboard components
import { PatientOverview } from "../../components/features/patients/PatientOverview";
import { MedicalRecordsTab } from "../../components/features/patients/MedicalRecordsTab";
import { AIAssistantPanel } from "../../components/features/chat/AIAssistantPanel";
import { AppointmentsTab } from "../../components/features/appointments/AppointmentsTab";
import { MedicationsTab } from "../../components/features/patients/MedicationsTab";
import { ProfileSettingsTab } from "../../components/features/patients/ProfileSettingsTab";

export function PatientDashboard() {
  const { activeTab } = useDashboard();
  const { setRole } = useUser();

  // Set role when component mounts
  useEffect(() => {
    setRole("patient");
  }, [setRole]);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <PatientOverview />;
      case "medical-records":
        return <MedicalRecordsTab />;
      case "ai-assistant":
        return <AIAssistantPanel />;
      case "appointments":
        return <AppointmentsTab />;
      case "medications":
        return <MedicationsTab />;
      case "profile":
        return <ProfileSettingsTab />;
      default:
        return <PatientOverview />;
    }
  };

  return <DashboardLayout>{renderContent()}</DashboardLayout>;
}
