# HealthSync Prescription Endpoints - Postman Demo Data

## Base URL: `http://localhost:5000/api/v1`

## Authentication Required
First login to get JWT token, then add to headers:
```
Authorization: Bearer <your-jwt-token>
```

---

## 1. 💊 POST /prescriptions
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{doctorToken}}
```

**Body (Basic Prescription):**
```json
{
  "patientId": "66f123456789abcdef123456",
  "appointmentId": "66f123456789abcdef789012",
  "diagnosis": {
    "primary": "Hypertension with mild anxiety symptoms",
    "secondary": ["Pre-diabetes", "Vitamin D deficiency"],
    "icdCodes": [
      {
        "code": "I10",
        "description": "Essential hypertension"
      }
    ]
  },
  "medicines": [
    {
      "name": "Amlodipine",
      "genericName": "Amlodipine besylate",
      "dosage": "5mg",
      "frequency": "Once daily",
      "duration": "30 days",
      "instructions": "Take in the morning with or without food",
      "notes": "Monitor blood pressure weekly",
      "quantity": 30,
      "refills": 2
    },
    {
      "name": "Metformin",
      "genericName": "Metformin hydrochloride",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "duration": "30 days",
      "instructions": "Take with meals to reduce stomach upset",
      "quantity": 60,
      "refills": 5
    }
  ],
  "medicalTests": [
    {
      "name": "Lipid Profile",
      "testCode": "LIPID-001",
      "description": "Complete cholesterol and triglyceride levels",
      "urgency": "within-week",
      "scheduledFor": "2025-09-27T09:00:00.000Z",
      "instructions": "Fast for 12 hours before test",
      "fastingRequired": true,
      "preparationInstructions": "No food or drink except water for 12 hours"
    },
    {
      "name": "HbA1c",
      "testCode": "HBA1C-001",
      "description": "3-month average blood sugar test",
      "urgency": "routine",
      "instructions": "No special preparation needed",
      "fastingRequired": false
    }
  ],
  "vitalSigns": {
    "bloodPressure": {
      "systolic": 150,
      "diastolic": 95
    },
    "heartRate": 78,
    "temperature": 98.6,
    "weight": 75.5,
    "height": 170
  },
  "followUp": {
    "required": true,
    "date": "2025-10-20T14:00:00.000Z",
    "reason": "Blood pressure monitoring and medication adjustment",
    "urgency": "routine"
  },
  "clinicalNotes": {
    "patientHistory": "Patient has family history of diabetes and hypertension",
    "physicalExamination": "BP elevated, otherwise normal examination",
    "treatmentPlan": "Start antihypertensive therapy, lifestyle modifications",
    "patientEducation": "Importance of medication compliance and regular monitoring",
    "warningsAndPrecautions": "Monitor for ankle swelling or dizziness"
  },
  "priority": "medium",
  "isEmergency": false
}
```

**Body (Emergency Prescription):**
```json
{
  "patientId": "66f123456789abcdef123456",
  "diagnosis": {
    "primary": "Acute bacterial pneumonia",
    "secondary": ["Dehydration"]
  },
  "medicines": [
    {
      "name": "Amoxicillin-Clavulanate",
      "dosage": "875mg/125mg",
      "frequency": "Twice daily",
      "duration": "10 days",
      "instructions": "Take with food to prevent stomach upset",
      "notes": "Complete full course even if feeling better",
      "quantity": 20,
      "refills": 0
    },
    {
      "name": "Albuterol Inhaler",
      "dosage": "2 puffs",
      "frequency": "Every 4-6 hours as needed",
      "duration": "30 days",
      "instructions": "Use for breathing difficulty",
      "quantity": 1,
      "refills": 2
    }
  ],
  "medicalTests": [
    {
      "name": "Chest X-ray",
      "urgency": "immediate",
      "description": "Rule out complications",
      "instructions": "Report to radiology immediately"
    }
  ],
  "vitalSigns": {
    "temperature": 101.2,
    "heartRate": 95,
    "bloodPressure": {
      "systolic": 130,
      "diastolic": 80
    }
  },
  "followUp": {
    "required": true,
    "date": "2025-09-22T10:00:00.000Z",
    "reason": "Check response to antibiotics",
    "urgency": "urgent"
  },
  "priority": "high",
  "isEmergency": true
}
```

---

## 2. 📋 GET /prescriptions/my-prescriptions
**URL:** `/prescriptions/my-prescriptions?status=active&page=1&limit=10&sortBy=createdAt&sortOrder=desc`

**Headers:**
```
Authorization: Bearer {{patientToken}}
```

**Query Parameters:**
- `status`: active, completed, cancelled, expired
- `page`: 1
- `limit`: 10
- `sortBy`: createdAt, prescribedAt, validUntil
- `sortOrder`: desc, asc

---

## 3. 👨‍⚕️ GET /prescriptions/doctor-prescriptions
**URL:** `/prescriptions/doctor-prescriptions?status=active&patientName=John&page=1&limit=10`

**Headers:**
```
Authorization: Bearer {{doctorToken}}
```

**Query Parameters:**
- `status`: active, completed, cancelled, expired
- `patientName`: Search by patient name
- `page`: 1
- `limit`: 10
- `sortBy`: createdAt
- `sortOrder`: desc

---

## 4. 📄 GET /prescriptions/:prescriptionId
**URL:** `/prescriptions/PRSC-123456`

**Headers:**
```
Authorization: Bearer {{patientToken}} or {{doctorToken}}
```

---

## 5. ✏️ PUT /prescriptions/:prescriptionId
**URL:** `/prescriptions/PRSC-123456`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{doctorToken}}
```

**Body:**
```json
{
  "medicines": [
    {
      "name": "Amlodipine",
      "dosage": "10mg",
      "frequency": "Once daily",
      "duration": "30 days",
      "instructions": "Increased dosage due to inadequate BP control",
      "quantity": 30,
      "refills": 2
    }
  ],
  "followUp": {
    "required": true,
    "date": "2025-10-15T14:00:00.000Z",
    "reason": "Blood pressure recheck after dose adjustment",
    "urgency": "routine"
  },
  "priority": "high"
}
```

---

## 6. 💊 POST /prescriptions/:prescriptionId/medicines
**URL:** `/prescriptions/PRSC-123456/medicines`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{doctorToken}}
```

**Body:**
```json
{
  "name": "Vitamin D3",
  "genericName": "Cholecalciferol",
  "dosage": "1000 IU",
  "frequency": "Once daily",
  "duration": "90 days",
  "instructions": "Take with largest meal of the day",
  "notes": "For vitamin D deficiency",
  "quantity": 90,
  "refills": 3
}
```

---

## 7. 🧪 POST /prescriptions/:prescriptionId/tests
**URL:** `/prescriptions/PRSC-123456/tests`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{doctorToken}}
```

**Body:**
```json
{
  "name": "Complete Blood Count",
  "testCode": "CBC-001",
  "description": "Check for infection or blood disorders",
  "urgency": "within-24-hours",
  "scheduledFor": "2025-09-21T08:00:00.000Z",
  "instructions": "No special preparation required",
  "fastingRequired": false,
  "preparationInstructions": "Well hydrated, normal diet"
}
```

---

## 8. 🗑️ DELETE /prescriptions/:prescriptionId/medicines/:medicineId
**URL:** `/prescriptions/PRSC-123456/medicines/66f789012345abcdef456789`

**Headers:**
```
Authorization: Bearer {{doctorToken}}
```

---

## 9. ❌ DELETE /prescriptions/:prescriptionId
**URL:** `/prescriptions/PRSC-123456`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{doctorToken}}
```

**Body:**
```json
{
  "reason": "Patient allergic reaction to prescribed medication"
}
```

---

## 10. 📊 GET /prescriptions/stats
**URL:** `/prescriptions/stats?startDate=2025-09-01&endDate=2025-09-30`

**Headers:**
```
Authorization: Bearer {{doctorToken}}
```

**Query Parameters:**
- `startDate`: 2025-09-01
- `endDate`: 2025-09-30

---

## Sample Response Examples:

### Create Prescription Response:
```json
{
  "status": "success",
  "message": "Prescription created successfully",
  "data": {
    "prescription": {
      "prescriptionId": "PRSC-123456",
      "status": "active",
      "patient": {
        "fullName": "John Doe",
        "age": 35
      },
      "doctor": {
        "fullName": "Dr. Smith",
        "specialization": "Cardiology"
      },
      "medicines": [...],
      "medicalTests": [...],
      "createdAt": "2025-09-19T10:30:00.000Z"
    }
  }
}
```

### Get Prescriptions Response:
```json
{
  "status": "success",
  "data": {
    "prescriptions": [
      {
        "prescriptionId": "PRSC-123456",
        "status": "active",
        "diagnosis": {
          "primary": "Hypertension"
        },
        "prescribedAt": "2025-09-19T10:30:00.000Z",
        "validUntil": "2025-12-19T10:30:00.000Z",
        "medicineCount": 2,
        "testCount": 1
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalPrescriptions": 25
    }
  }
}
```

---

## Quick Test Sequence:

1. **Register/Login** as doctor and patient
2. **Create prescription** for patient (endpoint #1)
3. **View patient prescriptions** (endpoint #2)
4. **View doctor prescriptions** (endpoint #3)
5. **Get prescription details** (endpoint #4)
6. **Add medicine** to prescription (endpoint #6)
7. **Add medical test** (endpoint #7)
8. **Update prescription** (endpoint #5)
9. **Get prescription statistics** (endpoint #10)

## Common Medicine Examples:
- **Antibiotics**: Amoxicillin, Azithromycin, Ciprofloxacin
- **Blood Pressure**: Amlodipine, Lisinopril, Metoprolol
- **Diabetes**: Metformin, Glipizide, Insulin
- **Pain Relief**: Ibuprofen, Acetaminophen, Naproxen
- **Vitamins**: Vitamin D3, Vitamin B12, Multivitamin

## Common Medical Tests:
- **Blood Tests**: CBC, Lipid Profile, HbA1c, Liver Function
- **Imaging**: Chest X-ray, Ultrasound, CT Scan, MRI
- **Cardiac**: EKG, Echocardiogram, Stress Test
- **Urine Tests**: Urinalysis, Urine Culture, Microalbumin
