import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { AlertTriangle, Plus, Calendar, User } from "lucide-react";
import { useState } from "react";

export function SideEffectsTracker({ medications = [] }) {
  const [selectedMedication, setSelectedMedication] = useState("");
  const [sideEffect, setSideEffect] = useState("");
  const [severity, setSeverity] = useState("mild");
  const [description, setDescription] = useState("");
  const [reportedEffects, setReportedEffects] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMedication || !sideEffect) return;

    const newReport = {
      id: Date.now(),
      medicationId: selectedMedication,
      medicationName:
        medications.find((m) => m.id === selectedMedication)?.name || "",
      sideEffect,
      severity,
      description,
      reportedDate: new Date().toISOString().split("T")[0],
      status: "reported",
    };

    setReportedEffects((prev) => [newReport, ...prev]);

    // Reset form
    setSelectedMedication("");
    setSideEffect("");
    setSeverity("mild");
    setDescription("");
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "mild":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300";
      case "moderate":
        return "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200";
      case "severe":
        return "bg-blue-300 dark:bg-blue-700 text-blue-800 dark:text-blue-100";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
    }
  };

  // Sample reported side effects for demo
  const sampleReports = [
    {
      id: 1,
      medicationId: "MED001",
      medicationName: "Amlodipine",
      sideEffect: "Dizziness",
      severity: "mild",
      description:
        "Mild dizziness when standing up quickly, especially in the morning",
      reportedDate: "2024-09-15",
      status: "under_review",
    },
    {
      id: 2,
      medicationId: "MED002",
      medicationName: "Metformin",
      sideEffect: "Nausea",
      severity: "moderate",
      description:
        "Nausea after taking medication, usually subsides after 30 minutes",
      reportedDate: "2024-09-10",
      status: "acknowledged",
    },
  ];

  const allReports = [...sampleReports, ...reportedEffects];

  const commonSideEffects = [
    "Nausea",
    "Dizziness",
    "Headache",
    "Fatigue",
    "Stomach upset",
    "Drowsiness",
    "Dry mouth",
    "Constipation",
    "Diarrhea",
    "Skin rash",
    "Sleep problems",
    "Loss of appetite",
    "Weight changes",
    "Mood changes",
  ];

  return (
    <div className="space-y-6">
      {/* Report New Side Effect */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-600" />
            Report Side Effect
          </CardTitle>
          <CardDescription>
            Report any side effects you're experiencing from your medications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Medication
                </label>
                <select
                  value={selectedMedication}
                  onChange={(e) => setSelectedMedication(e.target.value)}
                  className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  required
                >
                  <option value="">Select medication</option>
                  {medications.map((med) => (
                    <option key={med.id} value={med.id}>
                      {med.name} ({med.dosage})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Severity
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                Side Effect
              </label>
              <Input
                value={sideEffect}
                onChange={(e) => setSideEffect(e.target.value)}
                placeholder="e.g., Nausea, Dizziness, Headache"
                required
              />
            </div>

            {/* Common Side Effects Quick Select */}
            <div>
              <p className="text-sm font-medium mb-2 text-gray-900 dark:text-white">
                Common side effects:
              </p>
              <div className="flex flex-wrap gap-2">
                {commonSideEffects.slice(0, 8).map((effect) => (
                  <Button
                    key={effect}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSideEffect(effect)}
                    className="text-xs"
                  >
                    {effect}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                Description (Optional)
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe when it occurs, how long it lasts, what triggers it, etc."
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full">
              Report Side Effect
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Reported Side Effects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Reported Side Effects ({allReports.length})
          </CardTitle>
          <CardDescription>
            Your reported side effects and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allReports.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No side effects reported yet
            </p>
          ) : (
            <div className="space-y-4">
              {allReports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {report.sideEffect}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {report.medicationName}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getSeverityColor(report.severity)}>
                        {report.severity}
                      </Badge>
                      <Badge variant="outline">
                        {report.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>

                  {report.description && (
                    <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {report.description}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Reported:{" "}
                          {new Date(report.reportedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>Status: {report.status.replace("_", " ")}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 dark:text-blue-400"
                      >
                        Resolve
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                Important Notice
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                If you experience severe side effects or allergic reactions,
                stop taking the medication immediately and contact your doctor
                or emergency services. Do not ignore severe symptoms.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
