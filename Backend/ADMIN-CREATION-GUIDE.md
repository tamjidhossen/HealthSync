# HealthSync Admin Creation - Simple Guide

## 🚀 Quick Admin Creation

### Step 1: Login as Admin

First, you need to be logged in as an existing admin to create new admins.

```bash
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@healthsync.com",
  "password": "your_admin_password"
}
```

**Save the token as `{{adminToken}}`**

---

## 🔧 Create New Admin

### Simple Admin Creation (Email & Password Only)

```bash
POST http://localhost:5000/api/v1/admin/create-admin
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "email": "newadmin@healthsync.com",
  "password": "NewAdmin123!"
}
```

### Create Admin with Full Name

```bash
POST http://localhost:5000/api/v1/admin/create-admin
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "email": "sarah.admin@healthsync.com",
  "password": "Admin123!",
  "fullName": "Sarah Anderson"
}
```

### Create Super Admin

```bash
POST http://localhost:5000/api/v1/admin/create-admin
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "email": "super@healthsync.com",
  "password": "SuperAdmin123!",
  "fullName": "Super Administrator",
  "role": "super-admin"
}
```

---

## 📋 Field Requirements

### Required Fields:
- **email**: Valid email address (must be unique)
- **password**: At least 6 characters with uppercase, lowercase, and number

### Optional Fields:
- **fullName**: Display name (default: "Admin User")
- **role**: admin | super-admin | moderator (default: "admin")

---

## 📊 Expected Response

### Successful Admin Creation
```json
{
  "status": "success",
  "message": "Admin created successfully",
  "data": {
    "admin": {
      "_id": "66e8f123456789abcdef1234",
      "adminId": "ADM-1234",
      "email": "newadmin@healthsync.com",
      "fullName": "Admin User",
      "role": "admin",
      "isActive": true,
      "createdAt": "2025-09-19T10:30:00.000Z"
    }
  }
}
```

---

## 🚨 Common Errors

- **400 Bad Request - Email exists**: Admin with this email already exists
- **400 Bad Request - Validation Error**: Password doesn't meet requirements
- **401 Unauthorized**: Admin token expired or invalid
- **403 Forbidden**: User doesn't have admin permissions

---

## ✅ Default Permissions

New admins automatically get these permissions:
- **Doctors**: Read, Approve, Reject
- **Patients**: Read
- **System**: Read

---

## 🔐 Security Notes

1. **Password Requirements**: Minimum 6 characters with mixed case and numbers
2. **Email Verification**: Auto-verified for admin-created accounts
3. **Activity Logging**: All admin creation actions are logged
4. **Role-Based Access**: Only existing admins can create new admins

---

This simplified process allows quick admin account creation with minimal required information!
