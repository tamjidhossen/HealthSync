import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Heart, Activity, Thermometer, Droplets } from "lucide-react";

export function HealthStatusOverview({ healthData = {} }) {
  const {
    bloodPressure = "N/A",
    heartRate = "N/A",
    temperature = "N/A",
    bmi = "N/A",
    lastCheckup = "N/A",
    riskLevel = "Unknown",
    chronicConditions = [],
    allergies = [],
  } = healthData;

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const healthMetrics = [
    {
      label: "Blood Pressure",
      value: bloodPressure,
      icon: Heart,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Heart Rate",
      value: heartRate,
      icon: Activity,
      color: "text-blue-500 dark:text-blue-400",
    },
    {
      label: "Temperature",
      value: temperature,
      icon: Thermometer,
      color: "text-blue-700 dark:text-blue-300",
    },
    {
      label: "BMI",
      value: bmi,
      icon: Droplets,
      color: "text-blue-600 dark:text-blue-400",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-blue-600" />
          Health Status Overview
        </CardTitle>
        <CardDescription>Your current health metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Health Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {healthMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                  <span className="text-sm font-medium">{metric.label}</span>
                </div>
                <div className="text-lg font-semibold">{metric.value}</div>
              </div>
            );
          })}
        </div>

        {/* Risk Level */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <span className="font-medium">Risk Level:</span>
          <Badge className={getRiskColor(riskLevel)}>{riskLevel} Risk</Badge>
        </div>

        {/* Last Checkup */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <span className="font-medium">Last Checkup:</span>
          <span className="text-muted-foreground">
            {lastCheckup !== "N/A"
              ? new Date(lastCheckup).toLocaleDateString()
              : "N/A"}
          </span>
        </div>

        {/* Chronic Conditions */}
        {chronicConditions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Chronic Conditions:</h4>
            <div className="flex flex-wrap gap-2">
              {chronicConditions.map((condition, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-orange-50 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-600"
                >
                  {condition}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Allergies */}
        {allergies.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Allergies:</h4>
            <div className="flex flex-wrap gap-2">
              {allergies.map((allergy, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300 dark:border-red-600"
                >
                  {allergy}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
