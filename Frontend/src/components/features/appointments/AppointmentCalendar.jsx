import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../ui/button";
import { useState } from "react";

export function AppointmentCalendar({
  appointments = [],
  appointmentHistory = [],
}) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const allAppointments = [...appointments, ...appointmentHistory];

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const getAppointmentsForDate = (date) => {
    const dateString = formatDate(date);
    return allAppointments.filter((apt) => apt.date === dateString);
  };

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date) => {
    const today = new Date();
    return date < today && !isToday(date);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Create calendar grid
  const calendarDays = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const appointmentsOnDate = getAppointmentsForDate(date);

    calendarDays.push({
      date,
      day,
      appointments: appointmentsOnDate,
      isToday: isToday(date),
      isPast: isPast(date),
    });
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-500 dark:bg-blue-400";
      case "pending":
        return "bg-orange-500 dark:bg-orange-400";
      case "cancelled":
        return "bg-red-500 dark:bg-red-400";
      case "completed":
        return "bg-blue-600 dark:bg-blue-500";
      default:
        return "bg-gray-500 dark:bg-gray-400";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          Appointment Calendar
        </CardTitle>
        <CardDescription>
          View your appointments in calendar format
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <h3 className="text-lg font-semibold">{monthYear}</h3>

          <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-2 text-center font-medium text-sm text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((dayInfo, index) => {
            if (!dayInfo) {
              return <div key={index} className="p-2 h-20"></div>;
            }

            const { day, appointments, isToday, isPast } = dayInfo;

            return (
              <div
                key={day}
                className={`p-2 h-20 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                  isToday ? "bg-blue-50 border-blue-200" : ""
                } ${isPast ? "opacity-60" : ""}`}
              >
                <div
                  className={`text-sm font-medium mb-1 ${
                    isToday
                      ? "text-blue-600"
                      : isPast
                      ? "text-muted-foreground"
                      : ""
                  }`}
                >
                  {day}
                </div>

                {/* Appointment indicators */}
                <div className="space-y-1">
                  {appointments.slice(0, 2).map((appointment, idx) => (
                    <div
                      key={idx}
                      className={`text-xs px-1 py-0.5 rounded text-white truncate ${getStatusColor(
                        appointment.status
                      )}`}
                      title={`${appointment.time} - ${appointment.doctorName}`}
                    >
                      {appointment.time}
                    </div>
                  ))}
                  {appointments.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{appointments.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t dark:border-gray-700">
          <h4 className="font-medium mb-3 dark:text-gray-200">
            Status Legend:
          </h4>
          <div className="flex flex-wrap gap-4 text-sm dark:text-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded"></div>
              <span>Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 dark:bg-orange-400 rounded"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 dark:bg-blue-500 rounded"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 dark:bg-red-400 rounded"></div>
              <span>Cancelled</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
