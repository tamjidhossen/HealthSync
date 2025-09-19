import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  Clock,
  Phone,
  User,
  AlertCircle,
  CheckCircle,
  Calendar,
  FileText,
} from "lucide-react";
import doctorData from "@/data/doctor-data";

const TodaysSchedule = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { todaysSchedule, pendingRequests } = doctorData;

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "normal":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Today</p>
                <p className="text-2xl font-bold text-primary">
                  {todaysSchedule.length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    todaysSchedule.filter((apt) => apt.status === "completed")
                      .length
                  }
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-blue-600">
                  {
                    todaysSchedule.filter((apt) => apt.status === "scheduled")
                      .length
                  }
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Requests</p>
                <p className="text-2xl font-bold text-orange-600">
                  {pendingRequests.length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todaysSchedule.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedAppointment(appointment)}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-center min-w-[80px]">
                    <p className="font-semibold text-primary">
                      {appointment.time}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.duration}min
                    </p>
                  </div>

                  <Avatar className="h-12 w-12">
                    <img
                      src={appointment.patient.profilePicture}
                      alt={appointment.patient.name}
                      className="rounded-full object-cover"
                    />
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        {appointment.patient.name}
                      </h3>
                      <Badge
                        className={getPriorityColor(
                          appointment.patient.priority
                        )}
                      >
                        {appointment.patient.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {appointment.patient.condition}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.patient.age}y, {appointment.patient.gender}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                  <Badge variant="outline">{appointment.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Pending Appointment Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-orange-50 border-orange-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-center min-w-[120px]">
                      <p className="font-semibold text-orange-600">
                        {request.requestedDate}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {request.requestedTime}
                      </p>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {request.patient.name}
                        </h3>
                        <Badge className={getPriorityColor(request.urgency)}>
                          {request.urgency}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {request.patient.condition}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {request.reason}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Accept
                    </Button>
                    <Button size="sm" variant="destructive">
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Appointment Detail Modal/Panel */}
      {selectedAppointment && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Appointment Details</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedAppointment(null)}
              >
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Patient Information</h4>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedAppointment.patient.name}
                  </p>
                  <p>
                    <span className="font-medium">Age:</span>{" "}
                    {selectedAppointment.patient.age}
                  </p>
                  <p>
                    <span className="font-medium">Gender:</span>{" "}
                    {selectedAppointment.patient.gender}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedAppointment.patient.phone}
                  </p>
                  <p>
                    <span className="font-medium">Condition:</span>{" "}
                    {selectedAppointment.patient.condition}
                  </p>
                  <p>
                    <span className="font-medium">Last Visit:</span>{" "}
                    {selectedAppointment.patient.lastVisit || "First visit"}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">AI Summary</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm">{selectedAppointment.aiSummary}</p>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedAppointment.notes}
                  </p>
                </div>

                <div className="mt-4 flex space-x-2">
                  <Button size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    View Records
                  </Button>
                  <Button size="sm" variant="outline">
                    <User className="h-4 w-4 mr-1" />
                    Patient Profile
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TodaysSchedule;
