import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  User,
  Phone,
  Calendar,
  FileText,
  Activity,
  Pill,
  Eye,
  Edit,
  MessageSquare,
} from "lucide-react";
import doctorData from "@/data/doctor-data";

const PatientDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const { patients } = doctorData;

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "stable":
        return "bg-green-100 text-green-800 border-green-200";
      case "under-investigation":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients by name, condition, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <User className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>My Patients ({filteredPatients.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedPatient?.id === patient.id
                        ? "border-primary bg-blue-50"
                        : ""
                    }`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <img
                          src={patient.profilePicture}
                          alt={patient.name}
                          className="rounded-full object-cover"
                        />
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">
                          {patient.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {patient.age}y, {patient.gender}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {patient.condition}
                        </p>
                      </div>
                      <Badge
                        className={getStatusColor(patient.status)}
                        variant="outline"
                      >
                        {patient.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Details */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <img
                        src={selectedPatient.profilePicture}
                        alt={selectedPatient.name}
                        className="rounded-full object-cover"
                      />
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {selectedPatient.name}
                      </h2>
                      <p className="text-muted-foreground">
                        {selectedPatient.age} years old,{" "}
                        {selectedPatient.gender}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          className={getStatusColor(selectedPatient.status)}
                        >
                          {selectedPatient.status}
                        </Badge>
                        <Badge variant="outline">
                          {selectedPatient.bloodType}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Chat
                    </Button>
                    <Button size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="history">Medical History</TabsTrigger>
                    <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
                    <TabsTrigger value="medications">Medications</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">
                          Contact Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Phone:</span>{" "}
                            {selectedPatient.phone}
                          </p>
                          <p>
                            <span className="font-medium">Email:</span>{" "}
                            {selectedPatient.email}
                          </p>
                          <p>
                            <span className="font-medium">Blood Type:</span>{" "}
                            {selectedPatient.bloodType}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Appointment Info</h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Last Visit:</span>{" "}
                            {selectedPatient.lastVisit}
                          </p>
                          <p>
                            <span className="font-medium">
                              Next Appointment:
                            </span>{" "}
                            {selectedPatient.nextAppointment}
                          </p>
                          <p>
                            <span className="font-medium">
                              Primary Condition:
                            </span>{" "}
                            {selectedPatient.condition}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="space-y-4">
                    <h4 className="font-semibold">Medical History</h4>
                    <div className="space-y-3">
                      {selectedPatient.medicalHistory.map((record, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium">{record.diagnosis}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {record.treatment}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {record.notes}
                              </p>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {record.date}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="vitals" className="space-y-4">
                    <h4 className="font-semibold">Current Vital Signs</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Activity className="h-8 w-8 mx-auto text-red-500 mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Blood Pressure
                          </p>
                          <p className="text-lg font-bold">
                            {selectedPatient.vitalSigns.bloodPressure}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <Activity className="h-8 w-8 mx-auto text-green-500 mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Heart Rate
                          </p>
                          <p className="text-lg font-bold">
                            {selectedPatient.vitalSigns.heartRate}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <Activity className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Weight
                          </p>
                          <p className="text-lg font-bold">
                            {selectedPatient.vitalSigns.weight}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <Activity className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Height
                          </p>
                          <p className="text-lg font-bold">
                            {selectedPatient.vitalSigns.height}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="medications" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Current Medications</h4>
                      <Button size="sm">
                        <Pill className="h-4 w-4 mr-1" />
                        Add Medication
                      </Button>
                    </div>

                    {selectedPatient.currentMedications.length > 0 ? (
                      <div className="space-y-3">
                        {selectedPatient.currentMedications.map(
                          (medication, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-medium">
                                    {medication.name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {medication.dosage} - {medication.frequency}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Started: {medication.startDate}
                                  </p>
                                </div>
                                <div className="flex space-x-1">
                                  <Button size="sm" variant="outline">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No current medications</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center text-muted-foreground">
                  <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Select a patient to view details</p>
                  <p className="text-sm">
                    Choose from the patient list on the left
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDirectory;
