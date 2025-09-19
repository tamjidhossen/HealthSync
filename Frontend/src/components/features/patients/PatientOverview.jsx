import { UpcomingAppointments } from "../appointments/UpcomingAppointments";
import { RecentPrescriptions } from "./RecentPrescriptions";
import { HealthStatusOverview } from "./HealthStatusOverview";
import { NotificationPanel } from "../notifications/NotificationPanel";
import { patientData } from "../../../data/patient-data";

export function PatientOverview() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {patientData.profile.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your health information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <UpcomingAppointments
            appointments={patientData.upcomingAppointments}
          />
          <RecentPrescriptions
            prescriptions={patientData.recentPrescriptions}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <HealthStatusOverview healthData={patientData.healthOverview} />
          <NotificationPanel notifications={patientData.notifications} />
        </div>
      </div>

      {/* Bottom Row - Full Width Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-blue-500 dark:bg-blue-600 text-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Active Medications</h3>
          <p className="text-3xl font-bold">
            {patientData.currentMedications.length}
          </p>
          <p className="text-blue-100 dark:text-blue-200 text-sm">
            Currently taking
          </p>
        </div>

        <div className="bg-blue-400 dark:bg-blue-500 text-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">
            Appointments This Month
          </h3>
          <p className="text-3xl font-bold">
            {patientData.upcomingAppointments.length}
          </p>
          <p className="text-blue-100 dark:text-blue-200 text-sm">Scheduled</p>
        </div>

        <div className="bg-blue-600 dark:bg-blue-700 text-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Health Records</h3>
          <p className="text-3xl font-bold">
            {patientData.medicalHistory.length}
          </p>
          <p className="text-blue-100 dark:text-blue-200 text-sm">
            Total entries
          </p>
        </div>
      </div>
    </div>
  );
}
