import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { Button } from "../../ui/button";

export function UpcomingAppointments({ appointments = [] }) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Upcoming Appointments
          </CardTitle>
          <CardDescription>Your scheduled appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No upcoming appointments scheduled
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
          Upcoming Appointments
        </CardTitle>
        <CardDescription>Your scheduled appointments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {appointments.slice(0, 2).map((appointment) => (
          <div
            key={appointment.id}
            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-lg">
                  {appointment.doctorName}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {appointment.specialty}
                </p>
              </div>
              <Badge
                variant={
                  appointment.status === "confirmed" ? "default" : "secondary"
                }
                className={
                  appointment.status === "confirmed"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    : "dark:bg-gray-700 dark:text-gray-300"
                }
              >
                {appointment.status}
              </Badge>
            </div>

            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(appointment.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{appointment.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{appointment.location}</span>
              </div>
            </div>

            {appointment.notes && (
              <p className="text-sm mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 dark:text-gray-200 rounded">
                {appointment.notes}
              </p>
            )}
          </div>
        ))}

        {appointments.length > 2 && (
          <Button variant="outline" className="w-full mt-4">
            View All Appointments ({appointments.length})
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
