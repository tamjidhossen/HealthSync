import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Pill, Clock, User } from "lucide-react";
import { Button } from "../../ui/button";

export function RecentPrescriptions({ prescriptions = [] }) {
  if (prescriptions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-blue-600" />
            Recent Prescriptions
          </CardTitle>
          <CardDescription>Your latest prescriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No recent prescriptions
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-blue-600" />
          Recent Prescriptions
        </CardTitle>
        <CardDescription>Your latest prescriptions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {prescriptions.slice(0, 2).map((prescription) => (
          <div
            key={prescription.id}
            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-semibold">
                    {prescription.doctorName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(prescription.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Badge
                variant={
                  prescription.status === "active" ? "default" : "secondary"
                }
                className={
                  prescription.status === "active"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                }
              >
                {prescription.status}
              </Badge>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Medications:</h4>
              {prescription.medications.map((med, index) => (
                <div
                  key={index}
                  className="text-sm bg-blue-50 dark:bg-blue-900/20 dark:text-gray-200 p-2 rounded"
                >
                  <div className="font-medium">
                    {med.name} - {med.dosage}
                  </div>
                  <div className="text-muted-foreground dark:text-gray-400">
                    {med.frequency} for {med.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {prescriptions.length > 2 && (
          <Button variant="outline" className="w-full mt-4">
            View All Prescriptions ({prescriptions.length})
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
