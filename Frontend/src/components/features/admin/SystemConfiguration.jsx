import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  Shield,
  Mail,
  Database,
  Save,
  RefreshCw,
  Key,
  Globe,
  Server,
  HardDrive,
  Zap,
  Bell,
  Users,
  FileText,
} from "lucide-react";
import adminData from "@/data/admin-data";

const SystemConfiguration = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [config, setConfig] = useState(adminData.systemConfig);
  const [saving, setSaving] = useState(false);

  const handleConfigChange = (section, key, value) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleSave = async (section) => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert(`${section} settings saved successfully!`);
    }, 1500);
  };

  const getFeatureStatusColor = (enabled) => {
    return enabled
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <div className="space-y-6">
      {/* Configuration Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {config.generalSettings.systemVersion}
              </div>
              <p className="text-sm text-muted-foreground">System Version</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {config.generalSettings.maintenanceMode ? "ON" : "OFF"}
              </div>
              <p className="text-sm text-muted-foreground">Maintenance Mode</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Object.values(config.features).filter(Boolean).length}
              </div>
              <p className="text-sm text-muted-foreground">Features Enabled</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {config.securitySettings.sslCertificateValid
                  ? "Valid"
                  : "Invalid"}
              </div>
              <p className="text-sm text-muted-foreground">SSL Status</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="systemName">System Name</Label>
                  <Input
                    id="systemName"
                    value={config.generalSettings.systemName}
                    onChange={(e) =>
                      handleConfigChange(
                        "generalSettings",
                        "systemName",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="systemVersion">System Version</Label>
                  <Input
                    id="systemVersion"
                    value={config.generalSettings.systemVersion}
                    onChange={(e) =>
                      handleConfigChange(
                        "generalSettings",
                        "systemVersion",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="maxFileSize">Max File Upload Size</Label>
                  <Input
                    id="maxFileSize"
                    value={config.generalSettings.maxFileUploadSize}
                    onChange={(e) =>
                      handleConfigChange(
                        "generalSettings",
                        "maxFileUploadSize",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout</Label>
                  <Input
                    id="sessionTimeout"
                    value={config.generalSettings.sessionTimeout}
                    onChange={(e) =>
                      handleConfigChange(
                        "generalSettings",
                        "sessionTimeout",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Maintenance Mode</h4>
                    <p className="text-sm text-muted-foreground">
                      Put the system in maintenance mode
                    </p>
                  </div>
                  <Button
                    variant={
                      config.generalSettings.maintenanceMode
                        ? "destructive"
                        : "outline"
                    }
                    onClick={() =>
                      handleConfigChange(
                        "generalSettings",
                        "maintenanceMode",
                        !config.generalSettings.maintenanceMode
                      )
                    }
                  >
                    {config.generalSettings.maintenanceMode
                      ? "Disable"
                      : "Enable"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">User Registration</h4>
                    <p className="text-sm text-muted-foreground">
                      Allow new user registrations
                    </p>
                  </div>
                  <Button
                    variant={
                      config.generalSettings.registrationEnabled
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      handleConfigChange(
                        "generalSettings",
                        "registrationEnabled",
                        !config.generalSettings.registrationEnabled
                      )
                    }
                  >
                    {config.generalSettings.registrationEnabled
                      ? "Enabled"
                      : "Disabled"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Email Verification Required</h4>
                    <p className="text-sm text-muted-foreground">
                      Require email verification for new accounts
                    </p>
                  </div>
                  <Button
                    variant={
                      config.generalSettings.emailVerificationRequired
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      handleConfigChange(
                        "generalSettings",
                        "emailVerificationRequired",
                        !config.generalSettings.emailVerificationRequired
                      )
                    }
                  >
                    {config.generalSettings.emailVerificationRequired
                      ? "Required"
                      : "Optional"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Admin Approval Required</h4>
                    <p className="text-sm text-muted-foreground">
                      Require admin approval for new accounts
                    </p>
                  </div>
                  <Button
                    variant={
                      config.generalSettings.adminApprovalRequired
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      handleConfigChange(
                        "generalSettings",
                        "adminApprovalRequired",
                        !config.generalSettings.adminApprovalRequired
                      )
                    }
                  >
                    {config.generalSettings.adminApprovalRequired
                      ? "Required"
                      : "Optional"}
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("general")} disabled={saving}>
                  {saving ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save General Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="passwordMinLength">
                    Password Minimum Length
                  </Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={config.securitySettings.passwordMinLength}
                    onChange={(e) =>
                      handleConfigChange(
                        "securitySettings",
                        "passwordMinLength",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={config.securitySettings.maxLoginAttempts}
                    onChange={(e) =>
                      handleConfigChange(
                        "securitySettings",
                        "maxLoginAttempts",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="lockoutDuration">
                    Account Lockout Duration
                  </Label>
                  <Input
                    id="lockoutDuration"
                    value={config.securitySettings.accountLockoutDuration}
                    onChange={(e) =>
                      handleConfigChange(
                        "securitySettings",
                        "accountLockoutDuration",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="encryptionStandard">
                    Encryption Standard
                  </Label>
                  <Input
                    id="encryptionStandard"
                    value={config.securitySettings.encryptionStandard}
                    onChange={(e) =>
                      handleConfigChange(
                        "securitySettings",
                        "encryptionStandard",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">
                      Password Complexity Required
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Require complex passwords with special characters
                    </p>
                  </div>
                  <Button
                    variant={
                      config.securitySettings.passwordComplexityRequired
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      handleConfigChange(
                        "securitySettings",
                        "passwordComplexityRequired",
                        !config.securitySettings.passwordComplexityRequired
                      )
                    }
                  >
                    {config.securitySettings.passwordComplexityRequired
                      ? "Required"
                      : "Optional"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Enable 2FA for all users
                    </p>
                  </div>
                  <Button
                    variant={
                      config.securitySettings.twoFactorAuthEnabled
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      handleConfigChange(
                        "securitySettings",
                        "twoFactorAuthEnabled",
                        !config.securitySettings.twoFactorAuthEnabled
                      )
                    }
                  >
                    {config.securitySettings.twoFactorAuthEnabled
                      ? "Enabled"
                      : "Disabled"}
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">
                  SSL Certificate Status
                </h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700">
                      Certificate is valid
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Expires: {config.securitySettings.sslExpiryDate}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Valid
                  </Badge>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("security")}
                  disabled={saving}
                >
                  {saving ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpServer">SMTP Server</Label>
                  <Input
                    id="smtpServer"
                    value={config.emailSettings.smtpServer}
                    onChange={(e) =>
                      handleConfigChange(
                        "emailSettings",
                        "smtpServer",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={config.emailSettings.smtpPort}
                    onChange={(e) =>
                      handleConfigChange(
                        "emailSettings",
                        "smtpPort",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Email Verification</h4>
                    <p className="text-sm text-muted-foreground">
                      Send verification emails to new users
                    </p>
                  </div>
                  <Button
                    variant={
                      config.emailSettings.emailVerificationEnabled
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      handleConfigChange(
                        "emailSettings",
                        "emailVerificationEnabled",
                        !config.emailSettings.emailVerificationEnabled
                      )
                    }
                  >
                    {config.emailSettings.emailVerificationEnabled
                      ? "Enabled"
                      : "Disabled"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Notification Emails</h4>
                    <p className="text-sm text-muted-foreground">
                      Send system notification emails
                    </p>
                  </div>
                  <Button
                    variant={
                      config.emailSettings.notificationEmailsEnabled
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      handleConfigChange(
                        "emailSettings",
                        "notificationEmailsEnabled",
                        !config.emailSettings.notificationEmailsEnabled
                      )
                    }
                  >
                    {config.emailSettings.notificationEmailsEnabled
                      ? "Enabled"
                      : "Disabled"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Marketing Emails</h4>
                    <p className="text-sm text-muted-foreground">
                      Send promotional and marketing emails
                    </p>
                  </div>
                  <Button
                    variant={
                      config.emailSettings.marketingEmailsEnabled
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      handleConfigChange(
                        "emailSettings",
                        "marketingEmailsEnabled",
                        !config.emailSettings.marketingEmailsEnabled
                      )
                    }
                  >
                    {config.emailSettings.marketingEmailsEnabled
                      ? "Enabled"
                      : "Disabled"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Daily Reports</h4>
                    <p className="text-sm text-muted-foreground">
                      Send daily system reports to admins
                    </p>
                  </div>
                  <Button
                    variant={
                      config.emailSettings.dailyReportsEnabled
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      handleConfigChange(
                        "emailSettings",
                        "dailyReportsEnabled",
                        !config.emailSettings.dailyReportsEnabled
                      )
                    }
                  >
                    {config.emailSettings.dailyReportsEnabled
                      ? "Enabled"
                      : "Disabled"}
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("email")} disabled={saving}>
                  {saving ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Email Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Backup Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <select
                    id="backupFrequency"
                    value={config.backupSettings.backupFrequency}
                    onChange={(e) =>
                      handleConfigChange(
                        "backupSettings",
                        "backupFrequency",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="retentionDays">Retention Period (Days)</Label>
                  <Input
                    id="retentionDays"
                    type="number"
                    value={config.backupSettings.backupRetentionDays}
                    onChange={(e) =>
                      handleConfigChange(
                        "backupSettings",
                        "backupRetentionDays",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="backupLocation">Backup Location</Label>
                  <Input
                    id="backupLocation"
                    value={config.backupSettings.backupLocation}
                    onChange={(e) =>
                      handleConfigChange(
                        "backupSettings",
                        "backupLocation",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="lastBackup">Last Backup</Label>
                  <Input
                    id="lastBackup"
                    value={config.backupSettings.lastBackupDate}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Auto Backup</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically backup system data
                    </p>
                  </div>
                  <Button
                    variant={
                      config.backupSettings.autoBackupEnabled
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      handleConfigChange(
                        "backupSettings",
                        "autoBackupEnabled",
                        !config.backupSettings.autoBackupEnabled
                      )
                    }
                  >
                    {config.backupSettings.autoBackupEnabled
                      ? "Enabled"
                      : "Disabled"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Backup Encryption</h4>
                    <p className="text-sm text-muted-foreground">
                      Encrypt backup files
                    </p>
                  </div>
                  <Button
                    variant={
                      config.backupSettings.backupEncrypted
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      handleConfigChange(
                        "backupSettings",
                        "backupEncrypted",
                        !config.backupSettings.backupEncrypted
                      )
                    }
                  >
                    {config.backupSettings.backupEncrypted
                      ? "Enabled"
                      : "Disabled"}
                  </Button>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Restore Backup
                </Button>
                <Button onClick={() => handleSave("backup")} disabled={saving}>
                  {saving ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Backup Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Feature Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(config.features).map(([feature, enabled]) => (
                  <div
                    key={feature}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium capitalize">
                        {feature
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {feature === "aiAssistantEnabled" &&
                          "AI-powered patient assistant"}
                        {feature === "telemedConsultationEnabled" &&
                          "Remote video consultations"}
                        {feature === "mobileAppEnabled" &&
                          "Mobile application access"}
                        {feature === "prescriptionModuleEnabled" &&
                          "Digital prescription system"}
                        {feature === "analyticsEnabled" &&
                          "Advanced analytics and reporting"}
                        {feature === "chatSupportEnabled" &&
                          "Live chat support system"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getFeatureStatusColor(enabled)}>
                        {enabled ? "Enabled" : "Disabled"}
                      </Badge>
                      <Button
                        size="sm"
                        variant={enabled ? "destructive" : "default"}
                        onClick={() =>
                          handleConfigChange("features", feature, !enabled)
                        }
                      >
                        {enabled ? "Disable" : "Enable"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("features")}
                  disabled={saving}
                >
                  {saving ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Feature Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemConfiguration;
