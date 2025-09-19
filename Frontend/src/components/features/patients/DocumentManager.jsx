import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";
import { Upload, FileText, Download, Trash2, Plus } from "lucide-react";
import { useState } from "react";

export function DocumentManager({ documents = [] }) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    // Handle file drop logic here
    const files = Array.from(e.dataTransfer.files);
    console.log("Dropped files:", files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    console.log("Selected files:", files);
  };

  // Sample documents for demo
  const sampleDocuments = [
    {
      id: "DOC001",
      name: "Blood Test Results - Aug 2024.pdf",
      type: "Lab Report",
      uploadDate: "2024-08-15",
      size: "2.4 MB",
      url: "/documents/blood_test_aug_2024.pdf",
    },
    {
      id: "DOC002",
      name: "X-Ray Chest - July 2024.jpg",
      type: "Imaging",
      uploadDate: "2024-07-20",
      size: "1.8 MB",
      url: "/documents/xray_chest_july_2024.jpg",
    },
    {
      id: "DOC003",
      name: "Prescription - Dr. Rahman.pdf",
      type: "Prescription",
      uploadDate: "2024-08-15",
      size: "456 KB",
      url: "/documents/prescription_rahman.pdf",
    },
  ];

  const allDocuments = [...sampleDocuments, ...documents];

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "lab report":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "imaging":
        return "bg-blue-200 text-blue-900 dark:bg-blue-800/30 dark:text-blue-200";
      case "prescription":
        return "bg-blue-300 text-blue-900 dark:bg-blue-700/30 dark:text-blue-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Medical Documents
        </CardTitle>
        <CardDescription>
          Upload and manage your medical documents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Upload Medical Documents</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop files here or click to browse
          </p>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button variant="outline" className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
          </label>
          <p className="text-xs text-muted-foreground mt-2">
            Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
          </p>
        </div>

        {/* Document List */}
        <div className="space-y-3">
          <h4 className="font-medium">
            Your Documents ({allDocuments.length})
          </h4>

          {allDocuments.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No documents uploaded yet
            </p>
          ) : (
            allDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h5 className="font-medium dark:text-gray-200">
                      {doc.name}
                    </h5>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground dark:text-gray-400">
                      <span>Type: {doc.type}</span>
                      <span>Size: {doc.size}</span>
                      <span>
                        Uploaded:{" "}
                        {new Date(doc.uploadDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${getTypeColor(
                      doc.type
                    )}`}
                  >
                    {doc.type}
                  </span>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Document Categories */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t dark:border-gray-700">
          <div className="text-center">
            <div className="font-semibold text-lg text-blue-600 dark:text-blue-400">
              {allDocuments.filter((d) => d.type === "Lab Report").length}
            </div>
            <div className="text-sm text-muted-foreground dark:text-gray-400">
              Lab Reports
            </div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg text-blue-600 dark:text-blue-400">
              {allDocuments.filter((d) => d.type === "Imaging").length}
            </div>
            <div className="text-sm text-muted-foreground dark:text-gray-400">
              Imaging
            </div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg text-blue-600 dark:text-blue-400">
              {allDocuments.filter((d) => d.type === "Prescription").length}
            </div>
            <div className="text-sm text-muted-foreground dark:text-gray-400">
              Prescriptions
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
