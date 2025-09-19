import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Server,
  Database,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Cpu,
  HardDrive,
  Wifi,
  Activity,
  Clock,
  Eye,
  RefreshCw,
  Download,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import adminData from "@/data/admin-data";

const SystemMonitoring = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  const { systemMonitoring } = adminData;
  const {
    serverHealth,
    apiMetrics,
    databaseHealth,
    securityAlerts,
    errorLogs,
  } = systemMonitoring;

  // Mock real-time data for charts
  const serverMetrics = [
    { time: "00:00", cpu: 25, memory: 45, connections: 1200 },
    { time: "04:00", cpu: 30, memory: 50, connections: 1100 },
    { time: "08:00", cpu: 45, memory: 65, connections: 1400 },
    { time: "12:00", cpu: 35, memory: 70, connections: 1600 },
    { time: "16:00", cpu: 40, memory: 68, connections: 1500 },
    { time: "20:00", cpu: 30, memory: 60, connections: 1300 },
    { time: "24:00", cpu: 28, memory: 55, connections: 1200 },
  ];

  const apiResponseTimes = [
    { time: "00:00", responseTime: 120 },
    { time: "04:00", responseTime: 135 },
    { time: "08:00", responseTime: 180 },
    { time: "12:00", responseTime: 200 },
    { time: "16:00", responseTime: 165 },
    { time: "20:00", responseTime: 145 },
    { time: "24:00", responseTime: 130 },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  const getAlertTypeColor = (type) => {
    switch (type) {
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Monitoring</h2>
        <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
          <RefreshCw
            className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Quick Health Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Server Status</p>
                <p className="text-xl font-bold text-green-600">Healthy</p>
                <p className="text-xs text-muted-foreground">
                  Uptime: {serverHealth.uptime}
                </p>
              </div>
              <Server className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Database</p>
                <p className="text-xl font-bold text-green-600">Healthy</p>
                <p className="text-xs text-muted-foreground">
                  Pool: {databaseHealth.connectionPool}
                </p>
              </div>
              <Database className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Security</p>
                <p className="text-xl font-bold text-yellow-600">2 Alerts</p>
                <p className="text-xs text-muted-foreground">
                  Active monitoring
                </p>
              </div>
              <Shield className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">API Health</p>
                <p className="text-xl font-bold text-green-600">
                  {apiMetrics.errorRate}
                </p>
                <p className="text-xs text-muted-foreground">Error rate</p>
              </div>
              <Wifi className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monitoring Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          <TabsTrigger value="server">Server Health</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="api">API Metrics</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="logs">Error Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Real-time Metrics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Server Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={serverMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="cpu"
                      stroke="#53a2e3"
                      strokeWidth={2}
                      name="CPU %"
                    />
                    <Line
                      type="monotone"
                      dataKey="memory"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      name="Memory %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Response Times</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={apiResponseTimes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="responseTime"
                      stroke="#53a2e3"
                      fill="#a5ccff"
                      name="Response Time (ms)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* System Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Current Load
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Active Connections</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {serverHealth.activeConnections}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Requests/min</span>
                    <Badge className="bg-green-100 text-green-800">
                      {apiMetrics.requestsPerMinute}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Response Time</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {serverHealth.responseTime}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  Resource Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>CPU Usage</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {serverHealth.cpuUsage}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Memory Usage</span>
                    <Badge className="bg-orange-100 text-orange-800">
                      {serverHealth.memoryUsage}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Disk Usage</span>
                    <Badge className="bg-green-100 text-green-800">
                      {serverHealth.diskUsage}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Connection Pool</span>
                    <Badge className="bg-green-100 text-green-800">
                      {databaseHealth.connectionPool}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Last Backup</span>
                    <Badge variant="outline">{databaseHealth.lastBackup}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Performance</span>
                    <Badge className="bg-green-100 text-green-800">
                      {databaseHealth.queryPerformance}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="server" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Server Health Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded">
                      <span>System Uptime</span>
                      <Badge className="bg-green-100 text-green-800">
                        {serverHealth.uptime}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded">
                      <span>CPU Usage</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {serverHealth.cpuUsage}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded">
                      <span>Memory Usage</span>
                      <Badge className="bg-orange-100 text-orange-800">
                        {serverHealth.memoryUsage}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded">
                      <span>Disk Usage</span>
                      <Badge className="bg-green-100 text-green-800">
                        {serverHealth.diskUsage}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Network & Connections</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded">
                      <span>Active Connections</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {serverHealth.activeConnections}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded">
                      <span>Response Time</span>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {serverHealth.responseTime}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded">
                      <span>Last Downtime</span>
                      <Badge variant="outline">
                        {serverHealth.lastDowntime}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded">
                      <span>Status</span>
                      <Badge
                        className={getHealthStatusColor(serverHealth.status)}
                      >
                        {serverHealth.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">
                    Connection & Performance
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>Status</span>
                      <Badge
                        className={getHealthStatusColor(databaseHealth.status)}
                      >
                        {databaseHealth.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>Connection Pool</span>
                      <Badge className="bg-green-100 text-green-800">
                        {databaseHealth.connectionPool}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>Query Performance</span>
                      <Badge className="bg-green-100 text-green-800">
                        {databaseHealth.queryPerformance}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Backup & Integrity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>Backup Status</span>
                      <Badge className="bg-green-100 text-green-800">
                        {databaseHealth.backupStatus}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>Last Backup</span>
                      <Badge variant="outline">
                        {databaseHealth.lastBackup}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>Data Integrity</span>
                      <Badge className="bg-green-100 text-green-800">
                        {databaseHealth.dataIntegrityCheck}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {apiMetrics.totalRequests.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total Requests
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {apiMetrics.successfulRequests.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Successful</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {apiMetrics.failedRequests}
                  </div>
                  <p className="text-sm text-muted-foreground">Failed</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>Average Response Time</span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {apiMetrics.averageResponseTime}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>Requests per Minute</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {apiMetrics.requestsPerMinute}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>Error Rate</span>
                  <Badge className="bg-red-100 text-red-800">
                    {apiMetrics.errorRate}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>Success Rate</span>
                  <Badge className="bg-green-100 text-green-800">98.1%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-start space-x-3">
                      <AlertTriangle
                        className={`h-5 w-5 mt-1 ${
                          alert.type === "warning"
                            ? "text-yellow-500"
                            : "text-blue-500"
                        }`}
                      />
                      <div>
                        <h4 className="font-medium">{alert.message}</h4>
                        <p className="text-sm text-muted-foreground">
                          {alert.source}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {alert.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getAlertTypeColor(alert.type)}>
                        {alert.type}
                      </Badge>
                      <Badge
                        className={
                          alert.status === "resolved"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {alert.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Error Logs
                </span>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Logs
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {errorLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full mt-2 ${
                          log.level === "error" ? "bg-red-500" : "bg-yellow-500"
                        }`}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{log.message}</h4>
                        <p className="text-sm text-muted-foreground">
                          Service: {log.service}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {log.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getAlertTypeColor(log.level)}>
                        {log.level}
                      </Badge>
                      <Badge
                        className={
                          log.resolved
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {log.resolved ? "Resolved" : "Active"}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemMonitoring;
