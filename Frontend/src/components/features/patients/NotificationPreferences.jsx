import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Bell, Settings, Shield, Eye } from "lucide-react";
import { useState } from "react";

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState({
    medicationReminders: true,
    appointmentReminders: true,
    healthTips: true,
    labResults: true,
    emergencyAlerts: true,
    promotionalEmails: false,
    smsNotifications: true,
    emailNotifications: true,
    pushNotifications: true,
    reminderTime: "30", // minutes before
    quietHours: {
      enabled: true,
      start: "22:00",
      end: "08:00",
    },
  });

  const handleToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleQuietHoursToggle = () => {
    setPreferences((prev) => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        enabled: !prev.quietHours.enabled,
      },
    }));
  };

  const handleQuietHoursChange = (field, value) => {
    setPreferences((prev) => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    console.log("Saving notification preferences:", preferences);
    // Handle save logic
  };

  const ToggleSwitch = ({ enabled, onToggle, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <div className="font-medium">{label}</div>
        {description && (
          <div className="text-sm text-muted-foreground">{description}</div>
        )}
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? "bg-blue-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Notification Types
          </CardTitle>
          <CardDescription>
            Choose which notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          <ToggleSwitch
            enabled={preferences.medicationReminders}
            onToggle={() => handleToggle("medicationReminders")}
            label="Medication Reminders"
            description="Get notified when it's time to take your medications"
          />

          <ToggleSwitch
            enabled={preferences.appointmentReminders}
            onToggle={() => handleToggle("appointmentReminders")}
            label="Appointment Reminders"
            description="Receive reminders about upcoming appointments"
          />

          <ToggleSwitch
            enabled={preferences.labResults}
            onToggle={() => handleToggle("labResults")}
            label="Lab Results"
            description="Get notified when new lab results are available"
          />

          <ToggleSwitch
            enabled={preferences.healthTips}
            onToggle={() => handleToggle("healthTips")}
            label="Health Tips"
            description="Receive personalized health tips and recommendations"
          />

          <ToggleSwitch
            enabled={preferences.emergencyAlerts}
            onToggle={() => handleToggle("emergencyAlerts")}
            label="Emergency Alerts"
            description="Important health alerts and emergency notifications"
          />

          <ToggleSwitch
            enabled={preferences.promotionalEmails}
            onToggle={() => handleToggle("promotionalEmails")}
            label="Promotional Content"
            description="Receive promotional emails and special offers"
          />
        </CardContent>
      </Card>

      {/* Delivery Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Delivery Methods
          </CardTitle>
          <CardDescription>
            Choose how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          <ToggleSwitch
            enabled={preferences.pushNotifications}
            onToggle={() => handleToggle("pushNotifications")}
            label="Push Notifications"
            description="Instant notifications on your device"
          />

          <ToggleSwitch
            enabled={preferences.smsNotifications}
            onToggle={() => handleToggle("smsNotifications")}
            label="SMS Notifications"
            description="Text messages to your phone"
          />

          <ToggleSwitch
            enabled={preferences.emailNotifications}
            onToggle={() => handleToggle("emailNotifications")}
            label="Email Notifications"
            description="Notifications sent to your email address"
          />
        </CardContent>
      </Card>

      {/* Timing Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Timing Settings</CardTitle>
          <CardDescription>
            Configure when and how often you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Reminder Timing */}
          <div>
            <Label htmlFor="reminderTime">Appointment Reminder Time</Label>
            <select
              id="reminderTime"
              value={preferences.reminderTime}
              onChange={(e) =>
                setPreferences((prev) => ({
                  ...prev,
                  reminderTime: e.target.value,
                }))
              }
              className="w-full p-2 border rounded-md mt-1"
            >
              <option value="15">15 minutes before</option>
              <option value="30">30 minutes before</option>
              <option value="60">1 hour before</option>
              <option value="120">2 hours before</option>
              <option value="1440">1 day before</option>
            </select>
          </div>

          {/* Quiet Hours */}
          <div className="border rounded-lg p-4">
            <ToggleSwitch
              enabled={preferences.quietHours.enabled}
              onToggle={handleQuietHoursToggle}
              label="Quiet Hours"
              description="Don't send non-urgent notifications during these hours"
            />

            {preferences.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="quietStart">Start Time</Label>
                  <input
                    id="quietStart"
                    type="time"
                    value={preferences.quietHours.start}
                    onChange={(e) =>
                      handleQuietHoursChange("start", e.target.value)
                    }
                    className="w-full p-2 border rounded-md mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="quietEnd">End Time</Label>
                  <input
                    id="quietEnd"
                    type="time"
                    value={preferences.quietHours.end}
                    onChange={(e) =>
                      handleQuietHoursChange("end", e.target.value)
                    }
                    className="w-full p-2 border rounded-md mt-1"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Privacy Settings
          </CardTitle>
          <CardDescription>
            Control who can see your information and activity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-gray-500" />
              <div>
                <div className="font-medium">Profile Visibility</div>
                <div className="text-sm text-muted-foreground">
                  Who can see your basic profile information
                </div>
              </div>
            </div>
            <select className="p-2 border rounded-md">
              <option value="doctors">Only My Doctors</option>
              <option value="family">Family Members</option>
              <option value="emergency">Emergency Contacts Only</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-gray-500" />
              <div>
                <div className="font-medium">Medical History Sharing</div>
                <div className="text-sm text-muted-foreground">
                  Allow sharing medical history with new doctors
                </div>
              </div>
            </div>
            <select className="p-2 border rounded-md">
              <option value="auto">Automatic</option>
              <option value="manual">Manual Approval</option>
              <option value="none">No Sharing</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button onClick={handleSave} className="w-full">
        Save Preferences
      </Button>
    </div>
  );
}
