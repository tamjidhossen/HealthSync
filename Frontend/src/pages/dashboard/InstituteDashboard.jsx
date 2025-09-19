import { useEffect } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useDashboard } from "../../hooks/useDashboard";
import { useUser } from "../../hooks/useUser";
import { Calendar, Users, Building2, Activity } from "lucide-react";

export function InstituteDashboard() {
  const { activeTab } = useDashboard();
  const { setRole } = useUser();

  // Set role when component mounts
  useEffect(() => {
    setRole("institute");
  }, [setRole]);

  const renderContent = () => {
    switch (activeTab) {
      case "appointment-hub":
        return <InstituteOverview />;
      case "doctors":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold">Doctor Management</h2>
            <p className="text-muted-foreground">Manage your medical staff</p>
          </div>
        );
      case "slots":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold">Slot Management</h2>
            <p className="text-muted-foreground">Manage appointment slots</p>
          </div>
        );
      case "roster":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold">Roster Management</h2>
            <p className="text-muted-foreground">Manage staff schedules</p>
          </div>
        );
      case "communications":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold">Communications</h2>
            <p className="text-muted-foreground">
              Manage notifications and messages
            </p>
          </div>
        );
      case "analytics":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold">Analytics</h2>
            <p className="text-muted-foreground">View detailed analytics</p>
          </div>
        );
      case "settings":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold">Settings</h2>
            <p className="text-muted-foreground">
              Configure institute settings
            </p>
          </div>
        );
      default:
        return <InstituteOverview />;
    }
  };

  return <DashboardLayout>{renderContent()}</DashboardLayout>;
}

function InstituteOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          HealthSync Medical Center
        </h2>
        <p className="text-muted-foreground">
          Appointment hub and management dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Awaiting assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Doctors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">12 available today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              All departments active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Daily Capacity
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Optimal utilization</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Appointment Requests</CardTitle>
            <CardDescription>
              Manage incoming appointment requests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">John Doe - Cardiology</p>
                <p className="text-xs text-muted-foreground">
                  Requested: Tomorrow 2:00 PM
                </p>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                Pending
              </span>
            </div>
            <div className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Sarah Johnson - Neurology</p>
                <p className="text-xs text-muted-foreground">
                  Requested: Today 4:00 PM
                </p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Assigned
              </span>
            </div>
            <div className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Michael Brown - Pediatrics
                </p>
                <p className="text-xs text-muted-foreground">
                  Requested: Friday 10:00 AM
                </p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Confirmed
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Department Status</CardTitle>
            <CardDescription>Current status of all departments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Cardiology</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Neurology</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Emergency</span>
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                Busy
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
