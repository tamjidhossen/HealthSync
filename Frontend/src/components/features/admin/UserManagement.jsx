import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Search,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import adminData from "@/data/admin-data";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);

  const { userManagement } = adminData;
  const { totalUsers, usersByRole, recentUsers, suspendedUsers } =
    userManagement;

  // Mock data for all users
  const allUsers = [
    ...recentUsers,
    {
      id: "USR005",
      name: "Dr. John Smith",
      email: "john.smith@healthsync.com",
      role: "doctor",
      status: "active",
      joinDate: "2024-08-15",
      lastActive: "2024-09-18",
      verificationStatus: "verified",
    },
    {
      id: "USR006",
      name: "Dhaka Medical College",
      email: "admin@dmc.edu.bd",
      role: "institute",
      status: "active",
      joinDate: "2024-07-20",
      lastActive: "2024-09-17",
      verificationStatus: "verified",
    },
    {
      id: "USR007",
      name: "Fatima Rahman",
      email: "fatima.rahman@email.com",
      role: "patient",
      status: "active",
      joinDate: "2024-09-01",
      lastActive: "2024-09-16",
      verificationStatus: "verified",
    },
    {
      id: "USR008",
      name: "Dr. Michael Johnson",
      email: "michael.j@email.com",
      role: "doctor",
      status: "inactive",
      joinDate: "2024-06-10",
      lastActive: "2024-08-20",
      verificationStatus: "pending",
    },
  ];

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "suspended":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "doctor":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "patient":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "institute":
        return "bg-green-100 text-green-800 border-green-200";
      case "admin":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleSuspendUser = (userId) => {
    alert(`User ${userId} suspended`);
  };

  const handleActivateUser = (userId) => {
    alert(`User ${userId} activated`);
  };

  const handleDeleteUser = (userId) => {
    if (
      confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      alert(`User ${userId} deleted`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-primary">{totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Patients</p>
                <p className="text-2xl font-bold text-purple-600">
                  {usersByRole.patients}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Doctors</p>
                <p className="text-2xl font-bold text-blue-600">
                  {usersByRole.doctors}
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Institutes</p>
                <p className="text-2xl font-bold text-green-600">
                  {usersByRole.institutes}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold text-orange-600">
                  {usersByRole.admins}
                </p>
              </div>
              <Shield className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Roles</option>
                <option value="patient">Patients</option>
                <option value="doctor">Doctors</option>
                <option value="institute">Institutes</option>
                <option value="admin">Admins</option>
              </select>

              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">All Users</TabsTrigger>
          <TabsTrigger value="recent">Recent Users</TabsTrigger>
          <TabsTrigger value="suspended">
            Suspended ({suspendedUsers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-gray-600" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{user.name}</h3>
                          <Badge className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span>Joined: {user.joinDate}</span>
                          <span>Last active: {user.lastActive}</span>
                          <span>Status: {user.verificationStatus}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>

                      {user.status === "active" ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleSuspendUser(user.id)}
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleActivateUser(user.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recently Joined Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{user.name}</h3>
                          <Badge className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Joined on {user.joinDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suspended" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="h-5 w-5 text-red-500" />
                Suspended Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suspendedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <Ban className="h-6 w-6 text-red-600" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{user.name}</h3>
                          <Badge className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-red-600">
                          <span className="font-medium">Reason:</span>{" "}
                          {user.reason}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Suspended on {user.suspendedOn} by {user.suspendedBy}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleActivateUser(user.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Reactivate
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Detail Modal */}
      {selectedUser && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>User Details: {selectedUser.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Basic Information</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">ID:</span> {selectedUser.id}
                  </p>
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedUser.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedUser.email}
                  </p>
                  <p>
                    <span className="font-medium">Role:</span>{" "}
                    {selectedUser.role}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    {selectedUser.status}
                  </p>
                  <p>
                    <span className="font-medium">Verification:</span>{" "}
                    {selectedUser.verificationStatus}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Activity Information</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Join Date:</span>{" "}
                    {selectedUser.joinDate}
                  </p>
                  <p>
                    <span className="font-medium">Last Active:</span>{" "}
                    {selectedUser.lastActive}
                  </p>
                  <p>
                    <span className="font-medium">Total Logins:</span> 45
                  </p>
                  <p>
                    <span className="font-medium">Last Login IP:</span>{" "}
                    192.168.1.25
                  </p>
                </div>

                <div className="mt-4 flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Mail className="h-4 w-4 mr-1" />
                    Send Email
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="h-4 w-4 mr-1" />
                    View Activity
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagement;
