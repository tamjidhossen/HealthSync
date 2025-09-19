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
import { User, Phone, Mail, MapPin, Camera, Save } from "lucide-react";
import { useState } from "react";
import { patientData } from "../../../data/patient-data";

export function PersonalInfoForm() {
  const [formData, setFormData] = useState({
    name: patientData.profile.name,
    age: patientData.profile.age,
    gender: patientData.profile.gender,
    dateOfBirth: patientData.profile.dateOfBirth,
    bloodType: patientData.profile.bloodType,
    phone: patientData.profile.phone,
    email: patientData.profile.email,
    address: patientData.profile.address,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Saving personal info:", formData);
    setIsEditing(false);
    // Handle save logic here
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      name: patientData.profile.name,
      age: patientData.profile.age,
      gender: patientData.profile.gender,
      dateOfBirth: patientData.profile.dateOfBirth,
      bloodType: patientData.profile.bloodType,
      phone: patientData.profile.phone,
      email: patientData.profile.email,
      address: patientData.profile.address,
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          Personal Information
        </CardTitle>
        <CardDescription>
          Update your personal details and contact information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
              disabled={!isEditing}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <h3 className="font-semibold">{formData.name}</h3>
            <p className="text-sm text-muted-foreground">
              Patient ID: {patientData.profile.id}
            </p>
            <p className="text-sm text-muted-foreground">
              Member since:{" "}
              {new Date(
                patientData.profile.registrationDate
              ).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          {/* Date of Birth */}
          <div>
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          {/* Gender */}
          <div>
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              disabled={!isEditing}
              className="w-full p-2 border rounded-md disabled:bg-gray-50"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Blood Type */}
          <div>
            <Label htmlFor="bloodType">Blood Type</Label>
            <select
              id="bloodType"
              value={formData.bloodType}
              onChange={(e) => handleInputChange("bloodType", e.target.value)}
              disabled={!isEditing}
              className="w-full p-2 border rounded-md disabled:bg-gray-50"
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              disabled={!isEditing}
              type="tel"
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={!isEditing}
              type="email"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            disabled={!isEditing}
            rows={2}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit Information</Button>
          ) : (
            <>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
