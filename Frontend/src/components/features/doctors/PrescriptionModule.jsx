import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pill,
  Plus,
  Search,
  FileText,
  Calendar,
  User,
  Save,
  Printer,
  Send,
  Trash2,
} from "lucide-react";
import doctorData from "@/data/doctor-data";

const PrescriptionModule = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [medications, setMedications] = useState([]);
  const [instructions, setInstructions] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState("");

  const { prescriptionData, patients } = doctorData;
  const { templates, medicineDatabase } = prescriptionData;

  const filteredMedicines = medicineDatabase.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addMedication = () => {
    if (selectedMedicine) {
      const medicine = medicineDatabase.find(
        (med) => med.name === selectedMedicine
      );
      setMedications([
        ...medications,
        {
          id: Date.now(),
          name: medicine.name,
          category: medicine.category,
          dosage: medicine.dosages[0],
          frequency: "Once daily",
          duration: "7 days",
          instructions: "Take with food",
        },
      ]);
      setSelectedMedicine("");
    }
  };

  const removeMedication = (id) => {
    setMedications(medications.filter((med) => med.id !== id));
  };

  const updateMedication = (id, field, value) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, [field]: value } : med
      )
    );
  };

  const loadTemplate = (templateId) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setMedications(
        template.medications.map((med, index) => ({
          id: Date.now() + index,
          ...med,
          instructions: "Take with food",
        }))
      );
      setInstructions(template.instructions);
    }
  };

  const clearForm = () => {
    setSelectedPatient("");
    setSelectedTemplate("");
    setMedications([]);
    setInstructions("");
  };

  // Sample recent prescriptions
  const recentPrescriptions = [
    {
      id: "PRESC001",
      patient: "Sarah Johnson",
      date: "2024-09-18",
      medications: 2,
      status: "sent",
    },
    {
      id: "PRESC002",
      patient: "Mohammad Ali",
      date: "2024-09-17",
      medications: 3,
      status: "printed",
    },
    {
      id: "PRESC003",
      patient: "Fatima Begum",
      date: "2024-09-15",
      medications: 1,
      status: "draft",
    },
  ];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="create">Create Prescription</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">Prescription History</TabsTrigger>
          <TabsTrigger value="medicines">Medicine Database</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          {/* Patient Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patient">Select Patient</Label>
                  <Select
                    value={selectedPatient}
                    onValueChange={setSelectedPatient}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name} - {patient.age}y, {patient.condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="template">Load Template (Optional)</Label>
                  <Select
                    value={selectedTemplate}
                    onValueChange={(value) => {
                      setSelectedTemplate(value);
                      if (value) loadTemplate(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medication Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Add Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Select
                  value={selectedMedicine}
                  onValueChange={setSelectedMedicine}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select medicine" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicineDatabase.map((medicine) => (
                      <SelectItem key={medicine.name} value={medicine.name}>
                        {medicine.name} ({medicine.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addMedication} disabled={!selectedMedicine}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              {/* Medications List */}
              <div className="space-y-4">
                {medications.map((medication) => (
                  <div key={medication.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{medication.name}</h4>
                        <Badge variant="outline">{medication.category}</Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeMedication(medication.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <Label>Dosage</Label>
                        <Select
                          value={medication.dosage}
                          onValueChange={(value) =>
                            updateMedication(medication.id, "dosage", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {medicineDatabase
                              .find((med) => med.name === medication.name)
                              ?.dosages.map((dosage) => (
                                <SelectItem key={dosage} value={dosage}>
                                  {dosage}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Frequency</Label>
                        <Select
                          value={medication.frequency}
                          onValueChange={(value) =>
                            updateMedication(medication.id, "frequency", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Once daily">
                              Once daily
                            </SelectItem>
                            <SelectItem value="Twice daily">
                              Twice daily
                            </SelectItem>
                            <SelectItem value="Three times daily">
                              Three times daily
                            </SelectItem>
                            <SelectItem value="Four times daily">
                              Four times daily
                            </SelectItem>
                            <SelectItem value="As needed">As needed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Duration</Label>
                        <Select
                          value={medication.duration}
                          onValueChange={(value) =>
                            updateMedication(medication.id, "duration", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3 days">3 days</SelectItem>
                            <SelectItem value="7 days">7 days</SelectItem>
                            <SelectItem value="14 days">14 days</SelectItem>
                            <SelectItem value="30 days">30 days</SelectItem>
                            <SelectItem value="60 days">60 days</SelectItem>
                            <SelectItem value="90 days">90 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Instructions</Label>
                        <Input
                          value={medication.instructions}
                          onChange={(e) =>
                            updateMedication(
                              medication.id,
                              "instructions",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Take with food"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* General Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                General Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Add general instructions for the patient..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between">
                <Button variant="outline" onClick={clearForm}>
                  Clear Form
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Save className="h-4 w-4 mr-1" />
                    Save Draft
                  </Button>
                  <Button variant="outline">
                    <Printer className="h-4 w-4 mr-1" />
                    Print
                  </Button>
                  <Button>
                    <Send className="h-4 w-4 mr-1" />
                    Send to Patient
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prescription Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {template.instructions}
                      </p>
                      <div className="space-y-2">
                        {template.medications.map((med, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">{med.name}</span> -{" "}
                            {med.dosage}, {med.frequency}
                          </div>
                        ))}
                      </div>
                      <Button
                        size="sm"
                        className="mt-3"
                        onClick={() => {
                          setActiveTab("create");
                          loadTemplate(template.id);
                        }}
                      >
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPrescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-semibold">
                          {prescription.patient}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {prescription.date} • {prescription.medications}{" "}
                          medications
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          prescription.status === "sent" ? "default" : "outline"
                        }
                      >
                        {prescription.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medicines" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Medicine Database</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search medicines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMedicines.map((medicine) => (
                  <Card key={medicine.name} className="hover:bg-gray-50">
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{medicine.name}</h3>
                      <Badge variant="outline" className="mb-2">
                        {medicine.category}
                      </Badge>

                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Dosages:</span>{" "}
                          {medicine.dosages.join(", ")}
                        </div>
                        <div>
                          <span className="font-medium">Indications:</span>{" "}
                          {medicine.indications.join(", ")}
                        </div>
                        <div>
                          <span className="font-medium">
                            Contraindications:
                          </span>{" "}
                          {medicine.contraindications.join(", ")}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PrescriptionModule;
