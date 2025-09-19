import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Clock, Bell, Check, AlertCircle } from "lucide-react";
import { useState } from "react";

export function MedicationReminders({ medications = [] }) {
  const [takenMedications, setTakenMedications] = useState(new Set());

  const getCurrentTime = () => {
    return new Date().toTimeString().slice(0, 5);
  };

  const getCurrentDate = () => {
    return new Date().toDateString();
  };

  // Generate today's reminders
  const generateTodaysReminders = () => {
    const reminders = [];
    const today = getCurrentDate();

    medications.forEach((medication) => {
      if (medication.reminders) {
        medication.timeOfDay.forEach((time) => {
          const reminderKey = `${medication.id}-${time}-${today}`;
          reminders.push({
            id: reminderKey,
            medicationId: medication.id,
            medicationName: medication.name,
            dosage: medication.dosage,
            time: time,
            isTaken: takenMedications.has(reminderKey),
            isPast: time < getCurrentTime(),
            isUpcoming: time > getCurrentTime(),
          });
        });
      }
    });

    return reminders.sort((a, b) => a.time.localeCompare(b.time));
  };

  const markAsTaken = (reminderId) => {
    setTakenMedications((prev) => new Set([...prev, reminderId]));
  };

  const undoTaken = (reminderId) => {
    setTakenMedications((prev) => {
      const newSet = new Set(prev);
      newSet.delete(reminderId);
      return newSet;
    });
  };

  const todaysReminders = generateTodaysReminders();
  const upcomingReminders = todaysReminders.filter(
    (r) => r.isUpcoming && !r.isTaken
  );
  const overdueReminders = todaysReminders.filter(
    (r) => r.isPast && !r.isTaken
  );
  const completedReminders = todaysReminders.filter((r) => r.isTaken);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-600" />
          Today's Medication Reminders
        </CardTitle>
        <CardDescription>
          Track your medication schedule for {new Date().toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {overdueReminders.length}
            </div>
            <div className="text-sm text-red-700">Overdue</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {upcomingReminders.length}
            </div>
            <div className="text-sm text-blue-700">Upcoming</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {completedReminders.length}
            </div>
            <div className="text-sm text-green-700">Completed</div>
          </div>
        </div>

        {/* Overdue Reminders */}
        {overdueReminders.length > 0 && (
          <div>
            <h3 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Overdue Medications
            </h3>
            <div className="space-y-2">
              {overdueReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-red-600">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {reminder.medicationName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {reminder.dosage} • Due at {reminder.time}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => markAsTaken(reminder.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Take Now
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Reminders */}
        {upcomingReminders.length > 0 && (
          <div>
            <h3 className="font-semibold text-blue-600 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Upcoming Medications
            </h3>
            <div className="space-y-2">
              {upcomingReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-blue-600 dark:text-blue-400">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {reminder.medicationName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {reminder.dosage} • Scheduled for {reminder.time}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markAsTaken(reminder.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Mark Taken
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Reminders */}
        {completedReminders.length > 0 && (
          <div>
            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
              <Check className="h-4 w-4" />
              Completed Today
            </h3>
            <div className="space-y-2">
              {completedReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-blue-600 dark:text-blue-400">
                      <Check className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {reminder.medicationName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {reminder.dosage} • Taken
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => undoTaken(reminder.id)}
                    className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950"
                  >
                    Undo
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Reminders Today */}
        {todaysReminders.length === 0 && (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-muted-foreground">
              No medication reminders scheduled for today
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-1" />
              Set Custom Reminder
            </Button>
            <Button variant="outline" size="sm">
              View Weekly Schedule
            </Button>
            <Button variant="outline" size="sm">
              Medication History
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
