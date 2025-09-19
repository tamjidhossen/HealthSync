# HealthSync Appointment Endpoints - Postman Demo Data

## Base URL: `http://localhost:5000/api/v1`

## Authentication Required
First login to get JWT token, then add to headers:
```
Authorization: Bearer <your-jwt-token>
```

---

## 1. 📅 POST /appointments/book
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{patientToken}}
```

**Body (Basic Appointment):**
```json
{
  "doctorId": "DOC-123456",
  "appointmentDate": "2025-09-25",
  "timeSlot": "10:00",
  "appointmentType": "consultation",
  "consultationMode": "in-person",
  "reason": "Regular check-up and consultation",
  "symptoms": ["fatigue", "headache"],
  "priority": "medium",
  "duration": 30,
  "notes": "First time consultation"
}
```

**Body (Telemedicine Appointment):**
```json
{
  "doctorId": "DOC-123456",
  "appointmentDate": "2025-09-26",
  "timeSlot": "14:30",
  "appointmentType": "follow-up",
  "consultationMode": "telemedicine",
  "reason": "Follow-up for test results",
  "symptoms": ["chest pain"],
  "priority": "high",
  "duration": 45,
  "telemedicine": {
    "platform": "zoom",
    "meetingUrl": "https://zoom.us/j/1234567890"
  }
}
```

---

## 2. 📋 GET /appointments/my-appointments
**URL:** `/appointments/my-appointments?status=confirmed&limit=10&page=1`

**Headers:**
```
Authorization: Bearer {{patientToken}}
```

---

## 3. 👨‍⚕️ GET /appointments/doctor-appointments  
**URL:** `/appointments/doctor-appointments?date=2025-09-25&status=confirmed`

**Headers:**
```
Authorization: Bearer {{doctorToken}}
```

---

## 4. 🕐 GET /appointments/available-slots/:doctorId/:date
**URL:** `/appointments/available-slots/DOC-123456/2025-09-25`

**Headers:**
```
Authorization: Bearer {{patientToken}}
```

---

## 5. 📄 GET /appointments/:id
**URL:** `/appointments/APPT-123456`

**Headers:**
```
Authorization: Bearer {{patientToken}}
```

---

## 6. ✅ PATCH /appointments/:id/status
**URL:** `/appointments/APPT-123456/status`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{doctorToken}}
```

**Body:**
```json
{
  "status": "confirmed",
  "notes": "Appointment confirmed, please arrive 15 minutes early"
}
```

**Status Options:** `pending`, `confirmed`, `in-progress`, `completed`, `cancelled`, `no-show`

---

## 7. 🔄 PUT /appointments/:id/reschedule
**URL:** `/appointments/APPT-123456/reschedule`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{patientToken}}
```

**Body:**
```json
{
  "newDate": "2025-09-27",
  "newTimeSlot": "11:00",
  "reason": "Schedule conflict"
}
```

---

## 8. ❌ DELETE /appointments/:id
**URL:** `/appointments/APPT-123456`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{patientToken}}
```

**Body:**
```json
{
  "reason": "Personal emergency",
  "cancelledBy": "patient"
}
```

---

## 9. 📝 PUT /appointments/:id/notes
**URL:** `/appointments/APPT-123456/notes`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{doctorToken}}
```

**Body:**
```json
{
  "medicalNotes": {
    "chiefComplaint": "Patient complains of persistent fatigue",
    "diagnosis": "Stress-related fatigue",
    "treatmentPlan": "Rest and stress management",
    "prescriptions": [
      {
        "medication": "Ibuprofen 400mg",
        "dosage": "Twice daily after meals",
        "duration": "5 days"
      }
    ],
    "recommendations": [
      "Adequate sleep (7-8 hours)",
      "Regular exercise"
    ],
    "followUpRequired": true,
    "followUpDate": "2025-10-02"
  }
}
```

---

## 10. 💬 POST /appointments/:id/feedback
**URL:** `/appointments/APPT-123456/feedback`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{patientToken}}
```

**Body:**
```json
{
  "feedback": {
    "rating": 5,
    "category": "overall-experience",
    "comments": "Excellent consultation, very thorough",
    "doctorRating": 5,
    "facilityRating": 4,
    "waitTimeRating": 4,
    "communicationRating": 5,
    "recommendDoctor": true,
    "suggestions": "Maybe reduce waiting time"
  }
}
```

**Rating Scale:** 1-5 (1=Poor, 2=Fair, 3=Good, 4=Very Good, 5=Excellent)

---

## 11. 📊 GET /appointments/stats
**URL:** `/appointments/stats?period=monthly&year=2025&month=9`

**Headers:**
```
Authorization: Bearer {{doctorToken}}
```

**Query Parameters:**
- `period`: daily, weekly, monthly, yearly
- `year`: 2025
- `month`: 9
- `doctorId`: DOC-123456 (optional)

---

## Quick Test Sequence:

1. **Register/Login** to get JWT tokens for patient and doctor
2. **Book appointment** as patient (endpoint #1)
3. **Check availability** (endpoint #4)
4. **View appointments** as patient (endpoint #2) and doctor (endpoint #3)
5. **Update status** as doctor (endpoint #6)
6. **Add medical notes** as doctor (endpoint #9)
7. **Submit feedback** as patient (endpoint #10)

## Sample Doctor IDs for Testing:
- `DOC-123456`
- `DOC-789012`
- `DOC-345678`

## Sample Appointment Types:
- `consultation`
- `follow-up`
- `emergency`
- `routine-checkup`
- `specialist-referral`

## Sample Consultation Modes:
- `in-person`
- `telemedicine`
- `video-call`
- `phone-call`
