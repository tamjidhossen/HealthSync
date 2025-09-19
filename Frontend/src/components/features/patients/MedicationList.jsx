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
  Pill,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  Package,
} from "lucide-react";

export function MedicationList({ medications = [] }) {
  const getStockColor = (stock) => {
    if (stock <= 5)
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    if (stock <= 10)
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
  };

  const getStockStatus = (stock) => {
    if (stock <= 5) return "Low Stock";
    if (stock <= 10) return "Running Low";
    return "In Stock";
  };

  if (medications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Current Medications
          </CardTitle>
          <CardDescription>
            Your active prescriptions and medications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground dark:text-gray-400 text-center py-8">
            No active medications
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Current Medications ({medications.length})
        </CardTitle>
        <CardDescription>
          Your active prescriptions and medications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {medications.map((medication) => (
          <div
            key={medication.id}
            className="border dark:border-gray-700 rounded-lg p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg dark:text-gray-200">
                  {medication.name}
                </h3>
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  {medication.dosage} - {medication.frequency}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStockColor(medication.stock)}>
                  {getStockStatus(medication.stock)}
                </Badge>
                {medication.reminders && (
                  <Badge
                    variant="outline"
                    className="dark:border-gray-600 dark:text-gray-300"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Reminders
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm dark:text-gray-300">
                  <Clock className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  <span>Times: {medication.timeOfDay.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm dark:text-gray-300">
                  <Calendar className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  <span>
                    Duration:{" "}
                    {new Date(medication.startDate).toLocaleDateString()} -
                    {new Date(medication.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm dark:text-gray-300">
                  <Package className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  <span>Stock: {medication.stock} pills</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm dark:text-gray-300">
                  <User className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  <span>Prescribed by: {medication.prescribedBy}</span>
                </div>
                <div className="text-sm dark:text-gray-300">
                  <strong>Purpose:</strong> {medication.purpose}
                </div>
              </div>
            </div>

            {medication.sideEffects && medication.sideEffects.length > 0 && (
              <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="font-medium text-sm dark:text-gray-200">
                    Possible Side Effects:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {medication.sideEffects.map((effect, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-600"
                    >
                      {effect}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-1" />
                Mark as Taken
              </Button>
              <Button variant="outline" size="sm">
                Set Reminder
              </Button>
              {medication.stock <= 10 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 dark:text-blue-400"
                >
                  Refill Request
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
