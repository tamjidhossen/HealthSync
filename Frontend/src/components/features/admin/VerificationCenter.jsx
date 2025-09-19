import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Search,
  AlertTriangle,
  Clock,
  FileText,
  User,
  Building,
  UserCheck,
} from "lucide-react";
import adminData from "@/data/admin-data";

const VerificationCenter = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { pendingVerifications } = adminData;

  const filteredVerifications = pendingVerifications.filter(
    (verification) =>
      verification.applicant.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      verification.applicant.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      verification.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeIcon = (type) => {
    switch (type) {
      case "doctor":
        return <User className="h-5 w-5 text-blue-500" />;
      case "institute":
        return <Building className="h-5 w-5 text-green-500" />;
      case "patient":
        return <UserCheck className="h-5 w-5 text-purple-500" />;
      default:
        return <User className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "under-review":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "normal":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  const handleApprove = (verificationId) => {
    alert(`Approved verification request: ${verificationId}`);
  };

  const handleReject = (verificationId) => {
    if (rejectionReason.trim()) {
      alert(
        `Rejected verification request: ${verificationId}\nReason: ${rejectionReason}`
      );
      setRejectionReason("");
      setSelectedVerification(null);
    }
  };

  const approvedVerifications = [
    {
      id: "VER004",
      type: "doctor",
      applicant: { name: "Dr. Sarah Ahmed", email: "sarah.ahmed@email.com" },
      approvedOn: "2024-09-10",
      approvedBy: "ADM001",
    },
    {
      id: "VER005",
      type: "institute",
      applicant: { name: "United Hospital Ltd.", email: "admin@united.com.bd" },
      approvedOn: "2024-09-08",
      approvedBy: "ADM001",
    },
  ];

  const rejectedVerifications = [
    {
      id: "VER006",
      type: "doctor",
      applicant: { name: "Dr. Fake Name", email: "fake.doctor@email.com" },
      rejectedOn: "2024-09-05",
      rejectedBy: "ADM002",
      reason: "Invalid medical license number",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {
                    pendingVerifications.filter((v) => v.status === "pending")
                      .length
                  }
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Under Review</p>
                <p className="text-2xl font-bold text-blue-600">
                  {
                    pendingVerifications.filter(
                      (v) => v.status === "under-review"
                    ).length
                  }
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved Today</p>
                <p className="text-2xl font-bold text-green-600">2</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected Today</p>
                <p className="text-2xl font-bold text-red-600">0</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search verification requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Verification Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending (
            {
              pendingVerifications.filter(
                (v) => v.status === "pending" || v.status === "under-review"
              ).length
            }
            )
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedVerifications.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedVerifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {filteredVerifications.map((verification) => (
            <Card
              key={verification.id}
              className="cursor-pointer hover:bg-muted/50"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-lg">
                      {getTypeIcon(verification.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">
                          {verification.applicant.name}
                        </h3>
                        <Badge className={getStatusColor(verification.status)}>
                          {verification.status}
                        </Badge>
                        <Badge
                          className={getPriorityColor(verification.priority)}
                        >
                          {verification.priority}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-1">
                        {verification.applicant.email}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Type: {verification.type}</span>
                        <span>Submitted: {verification.submittedOn}</span>
                        {verification.reviewedBy && (
                          <span>Reviewed by: {verification.reviewedBy}</span>
                        )}
                      </div>

                      {/* Type-specific information */}
                      {verification.type === "doctor" && (
                        <div className="mt-2 text-sm">
                          <p>
                            <span className="font-medium">Specialization:</span>{" "}
                            {verification.applicant.specialization}
                          </p>
                          <p>
                            <span className="font-medium">License:</span>{" "}
                            {verification.applicant.license}
                          </p>
                          <p>
                            <span className="font-medium">Experience:</span>{" "}
                            {verification.applicant.experience}
                          </p>
                        </div>
                      )}

                      {verification.type === "institute" && (
                        <div className="mt-2 text-sm">
                          <p>
                            <span className="font-medium">Type:</span>{" "}
                            {verification.applicant.type}
                          </p>
                          <p>
                            <span className="font-medium">Address:</span>{" "}
                            {verification.applicant.address}
                          </p>
                          <p>
                            <span className="font-medium">Bed Capacity:</span>{" "}
                            {verification.applicant.bedCapacity}
                          </p>
                        </div>
                      )}

                      {verification.type === "patient" && (
                        <div className="mt-2 text-sm">
                          <p>
                            <span className="font-medium">DOB:</span>{" "}
                            {verification.applicant.dateOfBirth}
                          </p>
                          <p>
                            <span className="font-medium">NID:</span>{" "}
                            {verification.applicant.nid}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button
                      size="sm"
                      onClick={() => setSelectedVerification(verification)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApprove(verification.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>

                {/* Documents Status */}
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-medium mb-2">Documents:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {verification.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded"
                      >
                        <span className="text-xs font-medium">{doc.type}</span>
                        <div className="flex items-center space-x-1">
                          {doc.status === "uploaded" ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                          {doc.url && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedVerifications.map((verification) => (
            <Card key={verification.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                      {getTypeIcon(verification.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {verification.applicant.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {verification.applicant.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Approved on {verification.approvedOn} by{" "}
                        {verification.approvedBy}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Approved
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedVerifications.map((verification) => (
            <Card key={verification.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
                      {getTypeIcon(verification.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {verification.applicant.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {verification.applicant.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Rejected on {verification.rejectedOn} by{" "}
                        {verification.rejectedBy}
                      </p>
                      <p className="text-sm text-red-600 mt-1">
                        <span className="font-medium">Reason:</span>{" "}
                        {verification.reason}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    Rejected
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Verification Detail Modal/Panel */}
      {selectedVerification && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                Verification Review: {selectedVerification.applicant.name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedVerification(null)}
              >
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Document Review */}
            <div>
              <h4 className="font-semibold mb-3">Document Review</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedVerification.documents.map((doc, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">{doc.type}</h5>
                        <Badge
                          className={
                            doc.status === "uploaded"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {doc.status}
                        </Badge>
                      </div>
                      {doc.url ? (
                        <Button size="sm" variant="outline" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Download & Review
                        </Button>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Document not uploaded
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Rejection Reason */}
            <div>
              <h4 className="font-semibold mb-3">
                Rejection Reason (if applicable)
              </h4>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <Button
                variant="destructive"
                onClick={() => handleReject(selectedVerification.id)}
                disabled={!rejectionReason.trim()}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button onClick={() => handleApprove(selectedVerification.id)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VerificationCenter;
