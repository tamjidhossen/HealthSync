import { useEffect } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { useDashboard } from "../../hooks/useDashboard";
import { useUser } from "../../hooks/useUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Shield,
  Users,
  Activity,
  TrendingUp,
  Server,
  AlertTriangle,
  CheckCircle,
  FileText,
  Settings,
  UserCheck,
  BarChart3,
  Database,
} from "lucide-react";

// Import admin feature components
import VerificationCenter from "@/components/features/admin/VerificationCenter";
import UserManagement from "@/components/features/admin/UserManagement";
import SystemMonitoring from "@/components/features/admin/SystemMonitoring";
import AuditDashboard from "@/components/features/admin/AuditDashboard";
import SystemConfiguration from "@/components/features/admin/SystemConfiguration";

// Import admin data
import { adminData } from "@/data/admin-data";

const AdminDashboard = () => {
  const { activeTab } = useDashboard();
  const { setRole } = useUser();

  // Set role when component mounts
  useEffect(() => {
    setRole("admin");
  }, [setRole]);

  // Calculate overview statistics
  const overviewStats = {
    totalUsers: adminData.userManagement.users.reduce(
      (acc, user) => acc + user.count,
      0
    ),
    pendingVerifications: adminData.pendingVerifications.length,
    systemStatus: adminData.systemMonitoring.systemHealth.status,
    criticalAlerts: adminData.systemMonitoring.alerts.filter(
      (alert) => alert.severity === "critical"
    ).length,
    activeUsers:
      adminData.userManagement.users.find((u) => u.type === "Active")?.count ||
      0,
    serverUptime: adminData.systemMonitoring.systemHealth.uptime,
  };

  const AdminOverview = () => (
    <div className="space-y-6">
      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overviewStats.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Verifications
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overviewStats.pendingVerifications}
            </div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">
                {overviewStats.systemStatus}
              </div>
              {overviewStats.systemStatus === "Healthy" ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Uptime: {overviewStats.serverUptime}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Critical Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overviewStats.criticalAlerts}
            </div>
            <p className="text-xs text-muted-foreground">
              Need immediate action
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adminData.auditData.activities
                .slice(0, 5)
                .map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full mt-1 ${
                        activity.type === "security"
                          ? "bg-red-500"
                          : activity.type === "user"
                          ? "bg-blue-500"
                          : activity.type === "system"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.action}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.user}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>System Health</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">API Response Time</span>
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-600"
                >
                  {adminData.systemMonitoring.apiMetrics.responseTime}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Database Performance</span>
                <Badge
                  variant="outline"
                  className="text-blue-600 border-blue-600"
                >
                  {adminData.systemMonitoring.systemHealth.cpu}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Security Score</span>
                <Badge
                  variant="outline"
                  className="text-purple-600 border-purple-600"
                >
                  {adminData.auditData.compliance.securityScore}/100
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Sessions</span>
                <Badge variant="outline">
                  {overviewStats.activeUsers.toLocaleString()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setActiveTab("verifications")}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Review Verifications</h3>
                <p className="text-sm text-muted-foreground">
                  {overviewStats.pendingVerifications} pending
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setActiveTab("monitoring")}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Database className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">System Monitoring</h3>
                <p className="text-sm text-muted-foreground">
                  Check system health
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setActiveTab("users")}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium">Manage Users</h3>
                <p className="text-sm text-muted-foreground">
                  {overviewStats.totalUsers.toLocaleString()} total users
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverview />;
      case "verification":
        return <VerificationCenter />;
      case "users":
        return <UserManagement />;
      case "monitoring":
        return <SystemMonitoring />;
      case "audit":
        return <AuditDashboard />;
      case "config":
        return <SystemConfiguration />;
      default:
        return <AdminOverview />;
    }
  };

  return <DashboardLayout>{renderContent()}</DashboardLayout>;
};

export default AdminDashboard;
