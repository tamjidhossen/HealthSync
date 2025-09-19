import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { AppointmentRequestForm } from "./AppointmentRequestForm";
import { AppointmentStatusTracker } from "./AppointmentStatusTracker";
import { AppointmentCalendar } from "./AppointmentCalendar";
import { UpcomingAppointments } from "./UpcomingAppointments";
import { patientData } from "../../../data/patient-data";

export function AppointmentsTab() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Appointments
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your appointments and schedule new ones
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="request">Request New</TabsTrigger>
          <TabsTrigger value="status">All Appointments</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          <UpcomingAppointments
            appointments={patientData.upcomingAppointments}
          />

          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Next Appointment</h3>
              <p className="text-sm text-blue-700">
                {patientData.upcomingAppointments.length > 0
                  ? `${
                      patientData.upcomingAppointments[0].doctorName
                    } - ${new Date(
                      patientData.upcomingAppointments[0].date
                    ).toLocaleDateString()}`
                  : "No upcoming appointments"}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">Total Scheduled</h3>
              <p className="text-2xl font-bold text-green-700">
                {patientData.upcomingAppointments.length}
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900">This Month</h3>
              <p className="text-2xl font-bold text-purple-700">
                {patientData.upcomingAppointments.length}
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="request" className="space-y-6">
          <AppointmentRequestForm />
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <AppointmentStatusTracker
            appointments={patientData.upcomingAppointments}
            appointmentHistory={patientData.appointmentHistory}
          />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <AppointmentCalendar
            appointments={patientData.upcomingAppointments}
            appointmentHistory={patientData.appointmentHistory}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
