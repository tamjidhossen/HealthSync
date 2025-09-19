import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  MessageSquare,
} from "lucide-react";

export function AppointmentStatusTracker({
  appointments = [],
  appointmentHistory = [],
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "completed":
        return "bg-blue-200 text-blue-900 dark:bg-blue-800/30 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const allAppointments = [...appointments, ...appointmentHistory].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  if (allAppointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Appointment Status
          </CardTitle>
          <CardDescription>
            Track your appointment requests and confirmations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No appointments found
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Appointment Status
        </CardTitle>
        <CardDescription>
          Track your appointment requests and confirmations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {allAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="border dark:border-gray-700 rounded-lg p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg dark:text-gray-200">
                  {appointment.doctorName}
                </h3>
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  {appointment.specialty}
                </p>
              </div>
              <Badge className={getStatusColor(appointment.status)}>
                {appointment.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm dark:text-gray-300">
                  <Calendar className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  <span>{new Date(appointment.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm dark:text-gray-300">
                  <Clock className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm dark:text-gray-300">
                  <MapPin className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  <span>{appointment.location}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm dark:text-gray-300">
                  <User className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  <span>Type: {appointment.type}</span>
                </div>
                {appointment.duration && (
                  <div className="flex items-center gap-2 text-sm dark:text-gray-300">
                    <Clock className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                    <span>Duration: {appointment.duration}</span>
                  </div>
                )}
                {appointment.nextAppointment && (
                  <div className="flex items-center gap-2 text-sm dark:text-gray-300">
                    <Calendar className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                    <span>
                      Next:{" "}
                      {new Date(
                        appointment.nextAppointment
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {appointment.notes && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm dark:text-gray-200">
                  <strong>Notes:</strong> {appointment.notes}
                </p>
              </div>
            )}

            {appointment.diagnosis && (
              <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-800/20 rounded-lg">
                <p className="text-sm dark:text-gray-200">
                  <strong>Diagnosis:</strong> {appointment.diagnosis}
                </p>
              </div>
            )}

            {/* Action buttons based on status */}
            <div className="flex gap-2 flex-wrap">
              {appointment.status === "pending" && (
                <>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Contact Clinic
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600">
                    Cancel Request
                  </Button>
                </>
              )}

              {appointment.status === "confirmed" && (
                <>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-1" />
                    Call Clinic
                  </Button>
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600">
                    Cancel
                  </Button>
                </>
              )}

              {appointment.status === "completed" && (
                <>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    Book Follow-up
                  </Button>
                  <Button variant="outline" size="sm">
                    View Report
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
