import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import {
  TestTube,
  Download,
  Calendar,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Button } from "../../ui/button";

export function LabResults({ labResults = [] }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "normal":
        return (
          <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        );
      case "high":
      case "low":
        return (
          <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
        );
      default:
        return (
          <TestTube className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "normal":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "low":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  if (labResults.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-blue-600" />
            Lab Results
          </CardTitle>
          <CardDescription>Your laboratory test results</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No lab results available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5 text-blue-600" />
          Lab Results
        </CardTitle>
        <CardDescription>Your laboratory test results</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {labResults.map((test) => (
          <div
            key={test.id}
            className="border dark:border-gray-700 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold dark:text-gray-200">
                  {test.testName}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(test.date).toLocaleDateString()}</span>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {test.status}
              </Badge>
            </div>

            {/* Test Results */}
            <div className="space-y-2">
              {Object.entries(test.results).map(([key, result]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                >
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    <span className="font-medium capitalize dark:text-gray-200">
                      {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold dark:text-gray-200">
                        {result.value} {result.unit}
                      </span>
                      <Badge
                        variant="outline"
                        className={getStatusColor(result.status)}
                      >
                        {result.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground dark:text-gray-400">
                      Normal: {result.normal}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Download Report */}
            {test.reportUrl && (
              <div className="mt-3 pt-3 border-t">
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Full Report
                </Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
