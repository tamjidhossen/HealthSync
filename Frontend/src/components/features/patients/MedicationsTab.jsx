import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { MedicationList } from "./MedicationList";
import { MedicationReminders } from "./MedicationReminders";
import { SideEffectsTracker } from "./SideEffectsTracker";
import { RecentPrescriptions } from "./RecentPrescriptions";
import { patientData } from "../../../data/patient-data";

export function MedicationsTab() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Medications
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your medications, track reminders, and monitor side effects
        </p>
      </div>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current">Current Medications</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="side-effects">Side Effects</TabsTrigger>
          <TabsTrigger value="history">Prescription History</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          <MedicationList medications={patientData.currentMedications} />

          {/* Medication Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Total Active</h3>
              <p className="text-2xl font-bold text-blue-700">
                {patientData.currentMedications.length}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">With Reminders</h3>
              <p className="text-2xl font-bold text-green-700">
                {
                  patientData.currentMedications.filter((m) => m.reminders)
                    .length
                }
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-900">Low Stock</h3>
              <p className="text-2xl font-bold text-yellow-700">
                {
                  patientData.currentMedications.filter((m) => m.stock <= 10)
                    .length
                }
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900">
                Prescribing Doctors
              </h3>
              <p className="text-2xl font-bold text-purple-700">
                {
                  new Set(
                    patientData.currentMedications.map((m) => m.prescribedBy)
                  ).size
                }
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reminders" className="space-y-6">
          <MedicationReminders medications={patientData.currentMedications} />
        </TabsContent>

        <TabsContent value="side-effects" className="space-y-6">
          <SideEffectsTracker medications={patientData.currentMedications} />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <RecentPrescriptions
            prescriptions={patientData.recentPrescriptions}
          />

          {/* Additional prescription stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Recent Prescriptions</h3>
              <p className="text-sm text-muted-foreground">
                Total prescriptions in the last 6 months:{" "}
                {patientData.recentPrescriptions.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Active prescriptions:{" "}
                {
                  patientData.recentPrescriptions.filter(
                    (p) => p.status === "active"
                  ).length
                }
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Medication Adherence</h3>
              <p className="text-sm text-muted-foreground">
                Overall adherence rate: 95%
              </p>
              <p className="text-sm text-muted-foreground">
                Missed doses this week: 1
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
