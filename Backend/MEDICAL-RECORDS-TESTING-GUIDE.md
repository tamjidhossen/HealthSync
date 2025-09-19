# HealthSync Medical Records - Admin Testing Guide

## 🚀 Quick Start Testing

### Step 1: Login as Admin

```bash
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@healthsync.com",
  "password": "Admin123!"
}
```

**Save the token as `{{adminToken}}`**

---

## 🔍 Medical Records Testing

### Test 1: Search Patient with Prescriptions

```bash
GET http://localhost:5000/api/v1/admin/patient-search/PATIENT_ID_OR_MONGODB_OBJECTID
Authorization: Bearer {{adminToken}}
```

**Expected Response:**
- Patient details
- Latest prescriptions
- Associated medical records

### Test 2: Create Medical Record

```bash
POST http://localhost:5000/api/v1/admin/medical-records
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "prescriptionId": "PRSC-123456",
  "tests": [
    {
      "testName": "Complete Blood Count (CBC)",
      "status": "Pending"
    },
    {
      "testName": "Chest X-Ray",
      "status": "Pending"
    }
  ],
  "doctorNotes": "Patient requires immediate attention for respiratory symptoms"
}
```

### Test 3: Upload Test Result

```bash
POST http://localhost:5000/api/v1/admin/medical-records/MR-123456/test-result
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "testName": "Complete Blood Count (CBC)",
  "testResult": "WBC: 12,000/μL (elevated), RBC: 4.5 million/μL (normal), Hemoglobin: 14.2 g/dL (normal)",
  "testFileUrl": "/uploads/medical-reports/cbc-report-123.pdf"
}
```

### Test 4: Get All Medical Records (with filters)

```bash
# Get all records
GET http://localhost:5000/api/v1/admin/medical-records?page=1&limit=10
Authorization: Bearer {{adminToken}}

# Filter by patient
GET http://localhost:5000/api/v1/admin/medical-records?patientId=PAT-12345&page=1&limit=5
Authorization: Bearer {{adminToken}}

# Filter by test status
GET http://localhost:5000/api/v1/admin/medical-records?testStatus=Completed&page=1&limit=10
Authorization: Bearer {{adminToken}}

# Filter by test name
GET http://localhost:5000/api/v1/admin/medical-records?testName=X-Ray&page=1&limit=10
Authorization: Bearer {{adminToken}}
```

### Test 5: Get Medical Record Details

```bash
GET http://localhost:5000/api/v1/admin/medical-records/MR-123456
Authorization: Bearer {{adminToken}}
```

### Test 6: Update Medical Record

```bash
PUT http://localhost:5000/api/v1/admin/medical-records/MR-123456
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "doctorNotes": "Updated notes: Patient showing improvement after treatment",
  "aiSummary": "Patient has elevated white blood cell count indicating possible infection. Chest X-ray shows clear lungs."
}
```

---

## 📊 Expected Responses

### Patient Search Response
```json
{
  "status": "success",
  "data": {
    "patient": {
      "_id": "66e8f123456789abcdef1234",
      "patientId": "PAT-12345",
      "fullName": "John Smith",
      "email": "john.smith@email.com",
      "phone": "+8801912345678",
      "age": 35,
      "bloodGroup": "A+"
    },
    "prescriptions": [
      {
        "_id": "66e8f123456789abcdef5678",
        "prescriptionId": "PRSC-123456",
        "diagnosis": {
          "primary": "Hypertension"
        },
        "doctor": {
          "fullName": "Dr. Sarah Johnson",
          "specialization": "Cardiology"
        },
        "status": "active",
        "createdAt": "2025-09-19T10:30:00.000Z",
        "medicineCount": 2,
        "testCount": 1
      }
    ],
    "medicalRecords": 1,
    "records": [...]
  }
}
```

### Medical Record Details Response
```json
{
  "status": "success",
  "data": {
    "medicalRecord": {
      "_id": "66e8f123456789abcdef9012",
      "recordId": "MR-123456",
      "prescription": {
        "prescriptionId": "PRSC-123456",
        "diagnosis": {
          "primary": "Hypertension"
        }
      },
      "patient": {
        "fullName": "John Smith",
        "patientId": "PAT-12345"
      },
      "doctor": {
        "fullName": "Dr. Sarah Johnson",
        "specialization": "Cardiology"
      },
      "tests": [
        {
          "testName": "Complete Blood Count (CBC)",
          "testResult": "WBC: 12,000/μL (elevated)",
          "testFileUrl": "/uploads/medical-reports/cbc-report-123.pdf",
          "status": "Completed",
          "requestedAt": "2025-09-19T10:30:00.000Z",
          "completedAt": "2025-09-19T14:30:00.000Z"
        }
      ],
      "aiSummary": "AI summary will be generated automatically based on test results and patient history.",
      "doctorNotes": "Patient requires immediate attention",
      "createdAt": "2025-09-19T10:30:00.000Z"
    }
  }
}
```

---

## 🛠️ Testing Workflow

1. **Find a Patient**: Use patient search to get patient details
2. **Get Patient's Prescriptions**: Latest prescriptions will be shown
3. **Create Medical Record**: For a specific prescription
4. **Upload Test Results**: Add test results with files
5. **Review Records**: Filter and search medical records
6. **Update Records**: Add notes and summaries

---

## 🚨 Common Test Data

### Test Names (Examples)
- Complete Blood Count (CBC)
- Chest X-Ray
- MRI Scan
- CT Scan
- Lipid Profile
- Liver Function Test
- Kidney Function Test
- ECG/EKG
- Ultrasound
- Blood Sugar Test

### Test Results (Examples)
- **CBC**: "WBC: 8,500/μL (normal), RBC: 4.2 million/μL (normal), Hemoglobin: 13.8 g/dL (normal)"
- **X-Ray**: "Clear lung fields, no acute findings. Heart size normal."
- **Blood Sugar**: "Fasting: 95 mg/dL (normal), Random: 140 mg/dL (normal)"

### File URLs (Examples)
- `/uploads/medical-reports/cbc-report-123.pdf`
- `/uploads/medical-reports/xray-chest-456.jpg`
- `/uploads/medical-reports/mri-brain-789.pdf`

---

## ✅ Test Completion Checklist

- [ ] Admin logged in successfully
- [ ] Patient search working with ID
- [ ] Medical record created for prescription
- [ ] Test results uploaded successfully
- [ ] Medical records filtered properly
- [ ] Record details retrieved correctly
- [ ] Record updated with notes/summary
- [ ] File uploads working (if implemented)

---

This completes the medical records management system for admins!
