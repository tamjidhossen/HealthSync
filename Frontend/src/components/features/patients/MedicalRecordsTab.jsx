import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { MedicalTimeline } from "./MedicalTimeline";
import { LabResults } from "./LabResults";
import { DocumentManager } from "./DocumentManager";
import { RecentPrescriptions } from "./RecentPrescriptions";
import { patientData } from "../../../data/patient-data";

export function MedicalRecordsTab() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Medical Records
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage your complete medical history
        </p>
      </div>

      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timeline">Medical History</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-6">
          <MedicalTimeline medicalHistory={patientData.medicalHistory} />
        </TabsContent>

        <TabsContent value="prescriptions" className="space-y-6">
          <div className="grid gap-6">
            <RecentPrescriptions
              prescriptions={patientData.recentPrescriptions}
            />

            {/* Additional prescription history could go here */}
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                All prescription history is displayed above
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="lab-results" className="space-y-6">
          <LabResults labResults={patientData.labResults} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <DocumentManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
