/**
 * Seed Admin Script
 * Creates initial admin user for HealthSync system
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../src/models/Admin');
const { generateUniqueId } = require('../src/utils/generateId');

// Database connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/healthsync');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

// Seed admin data
const seedAdminData = {
    email: 'admin@healthsync.com',
    password: 'Admin123!',
    fullName: 'System Administrator',
    role: 'super-admin',
    isSuperAdmin: true,
    isEmailVerified: true,
    isActive: true,
    permissions: [
        {
            resource: 'doctors',
            actions: ['create', 'read', 'update', 'delete', 'approve', 'reject']
        },
        {
            resource: 'patients',
            actions: ['create', 'read', 'update', 'delete']
        },
        {
            resource: 'appointments',
            actions: ['read', 'update']
        },
        {
            resource: 'prescriptions',
            actions: ['read']
        },
        {
            resource: 'medical-records',
            actions: ['read']
        },
        {
            resource: 'system',
            actions: ['read', 'update']
        },
        {
            resource: 'reports',
            actions: ['create', 'read']
        }
    ]
};

// Create admin user
const createSeedAdmin = async () => {
    try {
        console.log('🌱 Starting admin seeding process...\n');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: seedAdminData.email });

        if (existingAdmin) {
            console.log('❌ Admin user already exists with email:', seedAdminData.email);
            console.log('📧 Email:', existingAdmin.email);
            console.log('🆔 Admin ID:', existingAdmin.adminId);
            console.log('👤 Role:', existingAdmin.role);
            console.log('\n✅ You can use this admin to login and create more admins.\n');
            return existingAdmin;
        }

        // Generate admin ID
        const adminId = await generateUniqueId('ADM', 4);

        // Create admin user
        const adminData = {
            ...seedAdminData,
            adminId,
            passwordHash: seedAdminData.password // Will be hashed by pre-save middleware
        };

        delete adminData.password; // Remove plain password

        const admin = await Admin.create(adminData);

        console.log('✅ Seed admin created successfully!\n');
        console.log('📧 Email:', admin.email);
        console.log('🔑 Password:', seedAdminData.password);
        console.log('🆔 Admin ID:', admin.adminId);
        console.log('👤 Role:', admin.role);
        console.log('🔐 Super Admin:', admin.isSuperAdmin);
        console.log('📅 Created At:', admin.createdAt);

        console.log('\n🚀 You can now login with these credentials:');
        console.log('POST /api/v1/auth/login');
        console.log(`{
  "email": "${admin.email}",
  "password": "${seedAdminData.password}"
}`);

        console.log('\n📚 Use this admin to:');
        console.log('- Access admin dashboard');
        console.log('- Create more admin users');
        console.log('- Manage doctors and patients');
        console.log('- System administration\n');

        return admin;

    } catch (error) {
        console.error('❌ Error creating seed admin:', error.message);
        throw error;
    }
};

// Main seeding function
const seedAdmin = async () => {
    try {
        await connectDB();
        await createSeedAdmin();

        console.log('🎉 Admin seeding completed successfully!');

    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('📪 Database connection closed.');
        process.exit(0);
    }
};

// Alternative admin data for different environments
const createDevAdmin = async () => {
    const devAdminData = {
        ...seedAdminData,
        email: 'dev@healthsync.com',
        password: 'Dev123!',
        fullName: 'Development Admin',
        role: 'admin'
    };

    try {
        const existingAdmin = await Admin.findOne({ email: devAdminData.email });
        if (existingAdmin) {
            console.log('🔧 Dev admin already exists:', devAdminData.email);
            return existingAdmin;
        }

        const adminId = await generateUniqueId('ADM', 4);
        const admin = await Admin.create({
            ...devAdminData,
            adminId,
            passwordHash: devAdminData.password
        });

        console.log('🔧 Dev admin created:', admin.email);
        return admin;

    } catch (error) {
        console.error('❌ Error creating dev admin:', error.message);
        throw error;
    }
};

// Command line arguments handling
const args = process.argv.slice(2);
const command = args[0];

const showHelp = () => {
    console.log(`
🌱 HealthSync Admin Seeder

Usage:
  npm run seed:admin              # Create main admin
  npm run seed:admin dev          # Create dev admin
  npm run seed:admin help         # Show this help

Default Admin:
  📧 Email: admin@healthsync.com
  🔑 Password: Admin123!
  👤 Role: super-admin

Dev Admin:
  📧 Email: dev@healthsync.com  
  🔑 Password: Dev123!
  👤 Role: admin
`);
};

// Execute based on command
if (command === 'help' || command === '--help' || command === '-h') {
    showHelp();
    process.exit(0);
} else if (command === 'dev') {
    console.log('🔧 Creating development admin...\n');
    connectDB().then(createDevAdmin).then(() => {
        console.log('🎉 Dev admin seeding completed!');
        mongoose.connection.close();
        process.exit(0);
    }).catch(error => {
        console.error('❌ Dev seeding failed:', error.message);
        process.exit(1);
    });
} else {
    // Default: create main admin
    seedAdmin();
}

module.exports = {
    seedAdmin,
    createSeedAdmin,
    createDevAdmin,
    seedAdminData
};
