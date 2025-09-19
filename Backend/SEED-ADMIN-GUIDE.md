# HealthSync Admin Seeding Guide

## 🌱 Quick Start - Create Initial Admin

To get started with HealthSync, you need to create an initial admin user. Use the seeding script to bootstrap your system.

### 1. Run the Seed Script

```bash
# Create main admin user
npm run seed:admin

# Or create development admin
npm run seed:admin dev

# Show help
npm run seed:admin help
```

### 2. Default Admin Credentials

**Main Admin (Super Admin):**
```
📧 Email: admin@healthsync.com
🔑 Password: Admin123!
👤 Role: super-admin
🔐 Super Admin: Yes
```

**Development Admin:**
```
📧 Email: dev@healthsync.com  
🔑 Password: Dev123!
👤 Role: admin
🔐 Super Admin: No
```

## 🚀 After Seeding

### 1. Login as Admin

```bash
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@healthsync.com",
  "password": "Admin123!"
}
```

### 2. Use Admin Token

Save the token from login response and use it for admin operations:

```bash
Authorization: Bearer YOUR_ADMIN_TOKEN
```

### 3. Create More Admins

```bash
POST http://localhost:5000/api/v1/admin/create-admin
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "email": "newadmin@healthsync.com",
  "password": "NewAdmin123!"
}
```

## 🛡️ Security Features

- **Password Hashing**: Automatic bcrypt hashing
- **Email Verification**: Auto-verified for seeded accounts
- **Role-Based Access**: Super admin has full permissions
- **Activity Logging**: All admin actions are logged
- **Session Management**: JWT-based authentication

## 📋 Admin Capabilities

The seeded admin can:
- ✅ Access admin dashboard
- ✅ Create/manage other admins
- ✅ Verify/reject doctors
- ✅ Manage patients
- ✅ View system statistics
- ✅ Export system data
- ✅ Monitor system health

## 🔧 Environment Setup

Make sure your `.env` file contains:

```env
MONGO_URI=mongodb://localhost:27017/healthsync
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE=30d
BCRYPT_SALT_ROUNDS=12
```

## 🚨 Production Notes

**Before going to production:**

1. **Change Default Credentials**: Always change the default admin password
2. **Use Strong Passwords**: Implement strong password policies
3. **Enable 2FA**: Consider implementing two-factor authentication
4. **Audit Logs**: Monitor admin activity logs regularly
5. **Environment Variables**: Use secure environment variables

## 📞 Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Check MongoDB is running
   - Verify MONGO_URI in .env

2. **Admin Already Exists**
   - Script will skip creation if admin exists
   - Use existing credentials or clear database

3. **Permission Errors**
   - Check file permissions on scripts folder
   - Ensure Node.js has write access

### Reset Admin:

If you need to reset the admin:

```bash
# Connect to MongoDB
mongo healthsync

# Remove admin
db.admins.deleteOne({email: "admin@healthsync.com"})

# Run seed script again
npm run seed:admin
```

## ✅ Quick Checklist

- [ ] MongoDB running
- [ ] Environment variables set
- [ ] Run `npm run seed:admin`
- [ ] Test admin login
- [ ] Create additional admins as needed
- [ ] Change default passwords for production

---

🎉 **Your HealthSync system is now ready for administration!**
