import { useEffect } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { useDashboard } from "../../hooks/useDashboard";
import { useUser } from "../../hooks/useUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Users,
  Pill,
  Clock,
  BarChart3,
  Settings,
  Stethoscope,
  FileText,
  TrendingUp,
} from "lucide-react";

// Import doctor-specific components
import TodaysSchedule from "@/components/features/doctors/TodaysSchedule";
import PatientDirectory from "@/components/features/doctors/PatientDirectory";
import PrescriptionModule from "@/components/features/doctors/PrescriptionModule";
import AvailabilityManager from "@/components/features/doctors/AvailabilityManager";
import DoctorAnalytics from "@/components/features/doctors/DoctorAnalytics";
import DoctorAIAssistant from "@/components/features/doctors/DoctorAIAssistant";
import { AppointmentsTab } from "@/components/features/appointments/AppointmentsTab";

import doctorData from "@/data/doctor-data";

const DoctorDashboard = () => {
  const { activeTab } = useDashboard();
  const { setRole } = useUser();
  const { profile, todaysSchedule, pendingRequests } = doctorData;

  // Set role when component mounts
  useEffect(() => {
    setRole("doctor");
  }, [setRole]);

  // Quick stats for the dashboard header
  const quickStats = {
    todayAppointments: todaysSchedule.length,
    completedToday: todaysSchedule.filter((apt) => apt.status === "completed")
      .length,
    pendingRequests: pendingRequests.length,
    totalPatients: profile.totalPatients,
  };

  const DoctorOverview = () => (
    <div className="space-y-6">
      {/* Doctor Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile.profilePicture} alt={profile.name} />
                <AvatarFallback>
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-muted-foreground">
                  {profile.specialization}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {profile.verificationStatus}
                  </Badge>
                  <Badge variant="outline">{profile.experience}</Badge>
                  <Badge variant="outline">⭐ {profile.rating}</Badge>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <p className="text-2xl font-bold text-primary">
                  {quickStats.todayAppointments}
                </p>
                <p className="text-xs text-muted-foreground">Today's Total</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {quickStats.completedToday}
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-orange-600">
                  {quickStats.pendingRequests}
                </p>
                <p className="text-xs text-muted-foreground">Requests</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {quickStats.totalPatients}
                </p>
                <p className="text-xs text-muted-foreground">Total Patients</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule Overview */}
      <TodaysSchedule />
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "schedule":
        return <DoctorOverview />;
      case "patients":
        return <PatientDirectory />;
      case "ai-assistant":
        return <DoctorAIAssistant />;
      case "records":
        return <PatientDirectory />;
      case "appointments":
        return <AppointmentsTab userRole="doctor" />;
      case "prescriptions":
        return <PrescriptionModule />;
      case "availability":
        return <AvailabilityManager />;
      case "insights":
        return <DoctorAnalytics />;
      case "profile":
        return <DoctorOverview />;
      default:
        return <DoctorOverview />;
    }
  };

  return <DashboardLayout>{renderContent()}</DashboardLayout>;
};

export default DoctorDashboard;
