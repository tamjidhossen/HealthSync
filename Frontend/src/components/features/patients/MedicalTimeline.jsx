import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import {
  FileText,
  Calendar,
  User,
  MapPin,
  Upload,
  Download,
} from "lucide-react";
import { Button } from "../../ui/button";

export function MedicalTimeline({ medicalHistory = [] }) {
  const getTypeIcon = (type) => {
    switch (type) {
      case "checkup":
        return "🩺";
      case "consultation":
        return "👨‍⚕️";
      case "emergency":
        return "🚨";
      case "surgery":
        return "🏥";
      default:
        return "📋";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "checkup":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "consultation":
        return "bg-blue-200 text-blue-900 dark:bg-blue-800/30 dark:text-blue-200";
      case "emergency":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "surgery":
        return "bg-blue-300 text-blue-900 dark:bg-blue-700/30 dark:text-blue-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Medical History Timeline
        </CardTitle>
        <CardDescription>Your complete medical history</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          <div className="space-y-6">
            {medicalHistory.map((record) => (
              <div key={record.id} className="relative flex gap-4">
                {/* Timeline dot */}
                <div className="flex-shrink-0 w-16 h-16 bg-white border-4 border-blue-200 rounded-full flex items-center justify-center text-2xl z-10">
                  {getTypeIcon(record.type)}
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg dark:text-gray-200">
                          {record.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(record.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Badge className={getTypeColor(record.type)}>
                        {record.type}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                        <span>
                          <strong>Doctor:</strong> {record.doctor}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                        <span>
                          <strong>Location:</strong> {record.location}
                        </span>
                      </div>
                      <div>
                        <strong>Diagnosis:</strong> {record.diagnosis}
                      </div>
                      <div>
                        <strong>Treatment:</strong> {record.treatment}
                      </div>
                      {record.notes && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 dark:text-gray-200 rounded">
                          <strong>Notes:</strong> {record.notes}
                        </div>
                      )}
                    </div>

                    {/* Documents */}
                    {record.documents && record.documents.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <h4 className="font-medium text-sm mb-2">Documents:</h4>
                        <div className="flex flex-wrap gap-2">
                          {record.documents.map((doc, docIndex) => (
                            <Button
                              key={docIndex}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              {doc}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
