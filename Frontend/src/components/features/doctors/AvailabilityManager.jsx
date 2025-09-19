import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle,
  X,
  Settings,
} from "lucide-react";
import doctorData from "@/data/doctor-data";

const AvailabilityManager = () => {
  const [activeTab, setActiveTab] = useState("schedule");
  const [workingHours, setWorkingHours] = useState(
    doctorData.availability.workingHours
  );
  const [blockedSlots, setBlockedSlots] = useState(
    doctorData.availability.blockedSlots
  );
  const [emergencyAvailable, setEmergencyAvailable] = useState(
    doctorData.availability.emergencyAvailable
  );

  // Form states for new blocked slot
  const [newBlockDate, setNewBlockDate] = useState("");
  const [newBlockTime, setNewBlockTime] = useState("");
  const [newBlockReason, setNewBlockReason] = useState("");

  const daysOfWeek = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  const updateWorkingHours = (day, field, value) => {
    setWorkingHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
        slots:
          field === "start" || field === "end"
            ? calculateSlots(
                field === "start" ? value : prev[day].start,
                field === "end" ? value : prev[day].end
              )
            : prev[day].slots,
      },
    }));
  };

  const calculateSlots = (start, end) => {
    if (!start || !end) return 0;
    const startTime = new Date(`2024-01-01 ${start}`);
    const endTime = new Date(`2024-01-01 ${end}`);
    const diffInMinutes = (endTime - startTime) / (1000 * 60);
    return Math.max(0, Math.floor(diffInMinutes / 30)); // 30-minute slots
  };

  const addBlockedSlot = () => {
    if (newBlockDate && newBlockTime && newBlockReason) {
      const newSlot = {
        date: newBlockDate,
        time: newBlockTime,
        reason: newBlockReason,
      };
      setBlockedSlots([...blockedSlots, newSlot]);
      setNewBlockDate("");
      setNewBlockTime("");
      setNewBlockReason("");
    }
  };

  const removeBlockedSlot = (index) => {
    setBlockedSlots(blockedSlots.filter((_, i) => i !== index));
  };

  const saveAvailability = () => {
    // Here you would typically save to backend
    alert("Availability settings saved successfully!");
  };

  // Generate time slots for a day
  const generateTimeSlots = (day) => {
    const dayData = workingHours[day];
    if (!dayData.start || !dayData.end) return [];

    const slots = [];
    const startTime = new Date(`2024-01-01 ${dayData.start}`);
    const endTime = new Date(`2024-01-01 ${dayData.end}`);

    let currentTime = new Date(startTime);
    while (currentTime < endTime) {
      slots.push(
        currentTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    return slots;
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="schedule">Weekly Schedule</TabsTrigger>
          <TabsTrigger value="blocked">Blocked Slots</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Settings</TabsTrigger>
          <TabsTrigger value="preview">Schedule Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Working Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {daysOfWeek.map((day) => (
                  <div
                    key={day.key}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <div className="w-24">
                      <Label className="font-medium">{day.label}</Label>
                    </div>

                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm">Start:</Label>
                        <Input
                          type="time"
                          value={workingHours[day.key].start}
                          onChange={(e) =>
                            updateWorkingHours(day.key, "start", e.target.value)
                          }
                          className="w-32"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Label className="text-sm">End:</Label>
                        <Input
                          type="time"
                          value={workingHours[day.key].end}
                          onChange={(e) =>
                            updateWorkingHours(day.key, "end", e.target.value)
                          }
                          className="w-32"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {workingHours[day.key].slots} slots
                        </Badge>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateWorkingHours(day.key, "start", "")}
                    >
                      Off
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={saveAvailability}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocked" className="space-y-6">
          {/* Add New Blocked Slot */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Block Time Slot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="blockDate">Date</Label>
                  <Input
                    id="blockDate"
                    type="date"
                    value={newBlockDate}
                    onChange={(e) => setNewBlockDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <Label htmlFor="blockTime">Time</Label>
                  <Input
                    id="blockTime"
                    type="time"
                    value={newBlockTime}
                    onChange={(e) => setNewBlockTime(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="blockReason">Reason</Label>
                  <Input
                    id="blockReason"
                    value={newBlockReason}
                    onChange={(e) => setNewBlockReason(e.target.value)}
                    placeholder="e.g., Surgery, Conference"
                  />
                </div>

                <div className="flex items-end">
                  <Button onClick={addBlockedSlot} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Block Slot
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Existing Blocked Slots */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Blocked Time Slots
              </CardTitle>
            </CardHeader>
            <CardContent>
              {blockedSlots.length > 0 ? (
                <div className="space-y-3">
                  {blockedSlots.map((slot, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="font-medium text-red-700">
                            {slot.date}
                          </p>
                          <p className="text-sm text-red-600">{slot.time}</p>
                        </div>
                        <div>
                          <p className="font-medium">{slot.reason}</p>
                          <Badge variant="destructive" className="text-xs">
                            Blocked
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeBlockedSlot(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No blocked time slots</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Emergency Availability Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Emergency Consultations</h3>
                    <p className="text-sm text-muted-foreground">
                      Allow emergency appointments outside regular hours
                    </p>
                  </div>
                  <Button
                    variant={emergencyAvailable ? "default" : "outline"}
                    onClick={() => setEmergencyAvailable(!emergencyAvailable)}
                  >
                    {emergencyAvailable ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Enabled
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Disabled
                      </>
                    )}
                  </Button>
                </div>

                {emergencyAvailable && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">
                      Emergency Contact Information
                    </h4>
                    <div className="space-y-2 text-sm text-green-700">
                      <p>• Patients can request emergency consultations</p>
                      <p>• You will receive immediate notifications</p>
                      <p>• Emergency fee: 2x regular consultation fee</p>
                      <p>• Response time: Within 2 hours</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button onClick={saveAvailability}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Schedule Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {daysOfWeek.map((day) => (
                  <Card key={day.key} className="h-fit">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{day.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {workingHours[day.key].start &&
                      workingHours[day.key].end ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">Hours:</span>
                            <span>
                              {workingHours[day.key].start} -{" "}
                              {workingHours[day.key].end}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">
                              Available Slots:
                            </span>
                            <Badge variant="outline">
                              {workingHours[day.key].slots}
                            </Badge>
                          </div>

                          {/* Sample time slots */}
                          <div className="mt-3">
                            <p className="text-xs text-muted-foreground mb-2">
                              Time Slots:
                            </p>
                            <div className="grid grid-cols-3 gap-1">
                              {generateTimeSlots(day.key)
                                .slice(0, 6)
                                .map((slot, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs p-1"
                                  >
                                    {slot}
                                  </Badge>
                                ))}
                              {generateTimeSlots(day.key).length > 6 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs p-1"
                                >
                                  +{generateTimeSlots(day.key).length - 6} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground py-4">
                          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Day Off</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Emergency Status */}
              <Card className="mt-6">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle
                        className={`h-5 w-5 ${
                          emergencyAvailable
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                      />
                      <span className="font-medium">
                        Emergency Availability
                      </span>
                    </div>
                    <Badge
                      className={
                        emergencyAvailable
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-gray-100 text-gray-800 border-gray-200"
                      }
                    >
                      {emergencyAvailable ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AvailabilityManager;
