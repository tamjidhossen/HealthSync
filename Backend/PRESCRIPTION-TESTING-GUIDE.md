# HealthSync Prescription System - Testing Guide

## 🚀 Quick Start Testing

### Step 1: Setup Test Users

#### Register Doctor
```bash
POST http://localhost:5000/api/v1/auth/register/doctor
Content-Type: application/json

{
  "fullName": "Dr. Sarah Johnson",
  "email": "sarah.johnson@healthsync.com",
  "password": "Doctor123!",
  "phone": "+8801712345678",
  "specialization": "Cardiology",
  "medicalLicense": "MD-12345-BD"
}
```

#### Register Patient  
```bash
POST http://localhost:5000/api/v1/auth/register/patient
Content-Type: application/json

{
  "fullName": "John Smith",
  "email": "john.smith@email.com", 
  "password": "Patient123!",
  "phone": "+8801912345678",
  "age": 35,
  "bloodGroup": "A+",
  "gender": "male"
}
```

### Step 2: Login and Get Tokens

#### Doctor Login
```bash
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "sarah.johnson@healthsync.com",
  "password": "Doctor123!"
}
```
**Save the token as `{{doctorToken}}`**

#### Patient Login
```bash
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "john.smith@email.com",
  "password": "Patient123!"
}
```
**Save the token as `{{patientToken}}`**

---

## 🧪 Prescription Testing Scenarios

### Test 1: Create Basic Prescription

```bash
POST http://localhost:5000/api/v1/prescriptions
Authorization: Bearer {{doctorToken}}
Content-Type: application/json

{
  "patientId": "REPLACE_WITH_ACTUAL_PATIENT_ID",
  "diagnosis": {
    "primary": "Hypertension with mild anxiety",
    "secondary": ["Pre-diabetes"]
  },
  "medicines": [
    {
      "name": "Amlodipine",
      "dosage": "5mg",
      "frequency": "Once daily",
      "duration": "30 days",
      "instructions": "Take in the morning",
      "quantity": 30,
      "refills": 2
    },
    {
      "name": "Metformin", 
      "dosage": "500mg",
      "frequency": "Twice daily",
      "duration": "30 days",
      "instructions": "Take with meals",
      "quantity": 60,
      "refills": 5
    }
  ],
  "medicalTests": [
    {
      "name": "Lipid Profile",
      "urgency": "within-week",
      "instructions": "Fast for 12 hours",
      "fastingRequired": true
    }
  ],
  "vitalSigns": {
    "bloodPressure": {
      "systolic": 150,
      "diastolic": 95
    },
    "heartRate": 78,
    "weight": 75.5,
    "height": 170
  },
  "followUp": {
    "required": true,
    "date": "2025-10-20T14:00:00.000Z",
    "reason": "Blood pressure monitoring"
  },
  "priority": "medium"
}
```

### Test 2: Create Emergency Prescription

```bash
POST http://localhost:5000/api/v1/prescriptions
Authorization: Bearer {{doctorToken}}
Content-Type: application/json

{
  "patientId": "REPLACE_WITH_ACTUAL_PATIENT_ID",
  "diagnosis": {
    "primary": "Acute bacterial pneumonia"
  },
  "medicines": [
    {
      "name": "Amoxicillin-Clavulanate",
      "dosage": "875mg/125mg", 
      "frequency": "Twice daily",
      "duration": "10 days",
      "instructions": "Take with food",
      "quantity": 20,
      "refills": 0
    },
    {
      "name": "Albuterol Inhaler",
      "dosage": "2 puffs",
      "frequency": "Every 4-6 hours as needed",
      "duration": "30 days",
      "instructions": "For breathing difficulty",
      "quantity": 1,
      "refills": 2
    }
  ],
  "medicalTests": [
    {
      "name": "Chest X-ray",
      "urgency": "immediate",
      "instructions": "Report to radiology immediately"
    }
  ],
  "vitalSigns": {
    "temperature": 101.2,
    "heartRate": 95,
    "respiratoryRate": 22
  },
  "followUp": {
    "required": true,
    "date": "2025-09-22T10:00:00.000Z",
    "reason": "Check antibiotic response",
    "urgency": "urgent"
  },
  "priority": "high",
  "isEmergency": true
}
```

### Test 3: Patient Views Prescriptions

```bash
GET http://localhost:5000/api/v1/prescriptions/my-prescriptions?status=active&page=1&limit=10
Authorization: Bearer {{patientToken}}
```

### Test 4: Doctor Views Prescriptions

```bash
GET http://localhost:5000/api/v1/prescriptions/doctor-prescriptions?page=1&limit=10
Authorization: Bearer {{doctorToken}}
```

### Test 5: Get Prescription Details

```bash
GET http://localhost:5000/api/v1/prescriptions/PRSC-123456
Authorization: Bearer {{patientToken}}
```
*Replace PRSC-123456 with actual prescription ID*

### Test 5b: Doctor Views Any Patient's Prescription

```bash
GET http://localhost:5000/api/v1/prescriptions/doctor-view/PRSC-123456
Authorization: Bearer {{doctorToken}}
```
*Replace PRSC-123456 with actual prescription ID. This allows doctors to view any prescription by ID*

### Test 5c: Doctor Gets Patient's Prescription History

```bash
GET http://localhost:5000/api/v1/prescriptions/patient/PATIENT_ID_OR_MONGODB_OBJECTID?status=active&page=1&limit=10
Authorization: Bearer {{doctorToken}}
```
*Replace PATIENT_ID_OR_MONGODB_OBJECTID with actual patient ID or MongoDB ObjectId. This gets all prescriptions for a specific patient for consultation purposes*

### Test 6: Add Medicine to Prescription

```bash
POST http://localhost:5000/api/v1/prescriptions/PRSC-123456/medicines
Authorization: Bearer {{doctorToken}}
Content-Type: application/json

{
  "name": "Vitamin D3",
  "dosage": "1000 IU",
  "frequency": "Once daily", 
  "duration": "90 days",
  "instructions": "Take with largest meal",
  "quantity": 90,
  "refills": 3
}
```

### Test 7: Add Medical Test

```bash
POST http://localhost:5000/api/v1/prescriptions/PRSC-123456/tests
Authorization: Bearer {{doctorToken}}
Content-Type: application/json

{
  "name": "Complete Blood Count",
  "testCode": "CBC-001",
  "description": "Check for infection markers",
  "urgency": "within-24-hours",
  "fastingRequired": false
}
```

### Test 8: Update Prescription

```bash
PUT http://localhost:5000/api/v1/prescriptions/PRSC-123456
Authorization: Bearer {{doctorToken}}
Content-Type: application/json

{
  "medicines": [
    {
      "name": "Amlodipine",
      "dosage": "10mg",
      "frequency": "Once daily", 
      "duration": "30 days",
      "instructions": "Increased dose for better BP control",
      "quantity": 30,
      "refills": 2
    }
  ],
  "priority": "high"
}
```

### Test 9: Get Prescription Statistics

```bash
GET http://localhost:5000/api/v1/prescriptions/stats?startDate=2025-09-01&endDate=2025-09-30
Authorization: Bearer {{doctorToken}}
```

### Test 10: Cancel Prescription

```bash
DELETE http://localhost:5000/api/v1/prescriptions/PRSC-123456
Authorization: Bearer {{doctorToken}}
Content-Type: application/json

{
  "reason": "Patient reported allergic reaction"
}
```

---

## 🔍 Advanced Search Tests

### Get Patient's Complete Prescription History
```bash
GET http://localhost:5000/api/v1/prescriptions/patient/66e8f123456789abcdef1234?status=all&page=1&limit=20&sortBy=prescribedAt&sortOrder=desc
Authorization: Bearer {{doctorToken}}
```

### Filter Patient Prescriptions by Status
```bash
GET http://localhost:5000/api/v1/prescriptions/patient/66e8f123456789abcdef1234?status=active&sortBy=createdAt&sortOrder=desc
Authorization: Bearer {{doctorToken}}
```

### Search by Patient Name
```bash
GET http://localhost:5000/api/v1/prescriptions/doctor-prescriptions?patientName=John&page=1&limit=5
Authorization: Bearer {{doctorToken}}
```

### Filter by Status
```bash
GET http://localhost:5000/api/v1/prescriptions/my-prescriptions?status=active&sortBy=createdAt&sortOrder=desc
Authorization: Bearer {{patientToken}}
```

### Paginated Results
```bash
GET http://localhost:5000/api/v1/prescriptions/doctor-prescriptions?page=2&limit=5&sortBy=prescribedAt&sortOrder=asc
Authorization: Bearer {{doctorToken}}
```

---

## 📊 Expected Results

### Successful Prescription Creation
```json
{
  "status": "success",
  "message": "Prescription created successfully", 
  "data": {
    "prescription": {
      "prescriptionId": "PRSC-123456",
      "status": "active",
      "patient": {
        "fullName": "John Smith",
        "phone": "+8801912345678"
      },
      "doctor": {
        "fullName": "Dr. Sarah Johnson",
        "specialization": "Cardiology"
      },
      "diagnosis": {
        "primary": "Hypertension with mild anxiety"
      },
      "medicines": [...],
      "medicalTests": [...],
      "createdAt": "2025-09-19T10:30:00.000Z"
    }
  }
}
```

### Patient Prescription List
```json
{
  "status": "success",
  "data": {
    "prescriptions": [
      {
        "prescriptionId": "PRSC-123456",
        "status": "active",
        "diagnosis": {
          "primary": "Hypertension with mild anxiety"
        },
        "doctor": {
          "fullName": "Dr. Sarah Johnson",
          "specialization": "Cardiology"
        },
        "prescribedAt": "2025-09-19T10:30:00.000Z",
        "medicineCount": 2,
        "testCount": 1
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalPrescriptions": 1
    }
  }
}
```

### Patient's Complete Prescription History (Doctor View)
```json
{
  "status": "success",
  "data": {
    "patient": {
      "_id": "66e8f123456789abcdef1234",
      "fullName": "John Smith",
      "phone": "+8801912345678",
      "email": "john.smith@email.com",
      "age": 35,
      "bloodGroup": "A+"
    },
    "prescriptions": [
      {
        "prescriptionId": "PRSC-123456",
        "status": "active",
        "diagnosis": {
          "primary": "Hypertension with mild anxiety",
          "secondary": ["Pre-diabetes"]
        },
        "doctor": {
          "fullName": "Dr. Sarah Johnson",
          "specialization": "Cardiology"
        },
        "medicineCount": 2,
        "testCount": 1,
        "isEmergency": false,
        "priority": "medium",
        "prescribedAt": "2025-09-19T10:30:00.000Z",
        "validUntil": "2025-10-19T10:30:00.000Z"
      },
      {
        "prescriptionId": "PRSC-789012",
        "status": "completed",
        "diagnosis": {
          "primary": "Common cold"
        },
        "doctor": {
          "fullName": "Dr. Michael Brown",
          "specialization": "General Medicine"
        },
        "medicineCount": 3,
        "testCount": 0,
        "isEmergency": false,
        "priority": "low",
        "prescribedAt": "2025-09-10T14:15:00.000Z",
        "validUntil": "2025-09-17T14:15:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalPrescriptions": 2
    }
  }
}
```

---

## 🛠️ Testing Tips

1. **Get Patient ID**: After patient registration, use the login response or patient profile endpoint to get the MongoDB ObjectId
2. **Replace Placeholders**: Always replace `REPLACE_WITH_ACTUAL_PATIENT_ID` and `PRSC-123456` with real values
3. **Token Management**: Tokens expire, so re-login if you get 401 errors
4. **Date Formats**: Use ISO 8601 format for all dates (`YYYY-MM-DDTHH:mm:ss.sssZ`)
5. **Error Handling**: Check for validation errors and fix request data accordingly

## 🚨 Common Issues

- **401 Unauthorized**: Token expired or missing - re-login
- **403 Forbidden**: Wrong user role or not authorized for this prescription
- **404 Not Found**: Prescription ID doesn't exist
- **400 Bad Request**: Validation errors in request body

## ✅ Test Completion Checklist

- [ ] Doctor and patient registered successfully
- [ ] Both users can login and get tokens
- [ ] Basic prescription created successfully
- [ ] Emergency prescription created successfully
- [ ] Patient can view their prescriptions
- [ ] Doctor can view their prescriptions
- [ ] Doctor can view any patient's prescription by ID
- [ ] Doctor can get patient's complete prescription history by patient ID
- [ ] Medicine added to existing prescription
- [ ] Medical test added to existing prescription
- [ ] Prescription updated successfully
- [ ] Prescription statistics retrieved
- [ ] Prescription cancelled successfully
- [ ] Search and filter queries work

This completes the comprehensive testing of the prescription management system!
