import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Badge } from "../../ui/badge";
import { Calendar, Clock, Plus, Search } from "lucide-react";
import { useState } from "react";

export function AppointmentRequestForm() {
  const [formData, setFormData] = useState({
    doctorSpecialty: "",
    preferredDoctor: "",
    appointmentType: "",
    preferredDate: "",
    preferredTime: "",
    symptoms: "",
    urgency: "normal",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Appointment request:", formData);
    // Handle form submission
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const specialties = [
    "Cardiology",
    "General Medicine",
    "Dermatology",
    "Orthopedics",
    "Neurology",
    "Pediatrics",
    "Gynecology",
    "Ophthalmology",
  ];

  const appointmentTypes = [
    "Consultation",
    "Follow-up",
    "Emergency",
    "Routine Checkup",
    "Second Opinion",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-blue-600" />
          Request New Appointment
        </CardTitle>
        <CardDescription>
          Schedule an appointment with a healthcare provider
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Specialty Selection */}
            <div>
              <Label htmlFor="specialty">Medical Specialty</Label>
              <select
                id="specialty"
                value={formData.doctorSpecialty}
                onChange={(e) =>
                  handleInputChange("doctorSpecialty", e.target.value)
                }
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select specialty</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Doctor */}
            <div>
              <Label htmlFor="doctor">Preferred Doctor (Optional)</Label>
              <Input
                id="doctor"
                value={formData.preferredDoctor}
                onChange={(e) =>
                  handleInputChange("preferredDoctor", e.target.value)
                }
                placeholder="Dr. Name"
              />
            </div>

            {/* Appointment Type */}
            <div>
              <Label htmlFor="type">Appointment Type</Label>
              <select
                id="type"
                value={formData.appointmentType}
                onChange={(e) =>
                  handleInputChange("appointmentType", e.target.value)
                }
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select type</option>
                {appointmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Urgency */}
            <div>
              <Label htmlFor="urgency">Urgency Level</Label>
              <select
                id="urgency"
                value={formData.urgency}
                onChange={(e) => handleInputChange("urgency", e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>

            {/* Preferred Date */}
            <div>
              <Label htmlFor="date">Preferred Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.preferredDate}
                onChange={(e) =>
                  handleInputChange("preferredDate", e.target.value)
                }
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            {/* Preferred Time */}
            <div>
              <Label htmlFor="time">Preferred Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.preferredTime}
                onChange={(e) =>
                  handleInputChange("preferredTime", e.target.value)
                }
                required
              />
            </div>
          </div>

          {/* Symptoms/Reason */}
          <div>
            <Label htmlFor="symptoms">Symptoms/Reason for Visit</Label>
            <Textarea
              id="symptoms"
              value={formData.symptoms}
              onChange={(e) => handleInputChange("symptoms", e.target.value)}
              placeholder="Describe your symptoms or reason for the appointment..."
              rows={3}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Submit Appointment Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
