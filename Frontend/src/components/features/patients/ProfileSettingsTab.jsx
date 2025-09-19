import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { EmergencyContacts } from "./EmergencyContacts";
import { NotificationPreferences } from "./NotificationPreferences";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";
import { Shield, Download, Trash2, Key, LogOut } from "lucide-react";

export function ProfileSettingsTab() {
  const handleExportData = () => {
    console.log("Exporting user data...");
    // Handle data export
  };

  const handleDeleteAccount = () => {
    console.log("Delete account requested...");
    // Handle account deletion
  };

  const handleChangePassword = () => {
    console.log("Change password requested...");
    // Handle password change
  };

  const handleLogout = () => {
    console.log("Logout requested...");
    // Handle logout
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal information, privacy settings, and account
          preferences
        </p>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <PersonalInfoForm />
        </TabsContent>

        <TabsContent value="emergency" className="space-y-6">
          <EmergencyContacts />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationPreferences />
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Password
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Last changed 3 months ago
                  </div>
                </div>
                <Button variant="outline" onClick={handleChangePassword}>
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Two-Factor Authentication
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </div>
                </div>
                <Button variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Enable 2FA
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Login Sessions
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Manage your active login sessions
                  </div>
                </div>
                <Button variant="outline">View Sessions</Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Download your data or manage your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Export Your Data
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Download a copy of all your medical records and data
                  </div>
                </div>
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Account Backup
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Create a backup of your account settings
                  </div>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Create Backup
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>Logout or delete your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Sign Out
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Sign out from this device
                  </div>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-950">
                <div>
                  <div className="font-medium text-blue-800 dark:text-blue-300">
                    Delete Account
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    Permanently delete your account and all data
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleDeleteAccount}
                  className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Legal & Support */}
          <Card>
            <CardHeader>
              <CardTitle>Legal & Support</CardTitle>
              <CardDescription>
                Important information and support options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  Privacy Policy
                </Button>
                <Button variant="outline" className="justify-start">
                  Terms of Service
                </Button>
                <Button variant="outline" className="justify-start">
                  Contact Support
                </Button>
                <Button variant="outline" className="justify-start">
                  Report an Issue
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
