/**
 * Admin Routes
 * All administrative endpoints for HealthSync system management
 */

const express = require('express');
const rateLimit = require('express-rate-limit');

const adminController = require('../controllers/adminController');
const { authenticate, authorize, requireAdminPermission } = require('../middleware/auth');
const {
    validateAdminProfileUpdate,
    validateDoctorVerification,
    validateUserSuspension,
    validatePermissionUpdate,
    validateDataExport
} = require('../middleware/validation');

const router = express.Router();

// Rate limiting for admin operations - more restrictive
const adminRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 50 requests per windowMs
    message: {
        status: 'error',
        message: 'Too many admin requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Apply rate limiting to all admin routes
router.use(adminRateLimit);

// Apply authentication to all admin routes
router.use(authenticate);
router.use(authorize(['admin']));

// Admin Profile Management Routes
/**
 * @route GET /api/v1/admin/me
 * @desc Get current admin's profile
 * @access Private (Admin only)
 */
router.get('/me', adminController.getMyProfile);

/**
 * @route PUT /api/v1/admin/me/profile
 * @desc Update admin's profile information
 * @access Private (Admin only)
 */
router.put('/me/profile', validateAdminProfileUpdate, adminController.updateMyProfile);

// Dashboard and System Overview Routes
/**
 * @route GET /api/v1/admin/dashboard
 * @desc Get system dashboard statistics
 * @access Private (Admin only)
 */
router.get('/dashboard', adminController.getDashboardStats);

/**
 * @route GET /api/v1/admin/system-health
 * @desc Get system health and performance metrics
 * @access Private (Admin only)
 */
router.get('/system-health', adminController.getSystemHealth);

// Doctor Management Routes
/**
 * @route GET /api/v1/admin/doctors
 * @desc Get all doctors with filtering and pagination
 * @access Private (Admin only)
 */
router.get('/doctors',
    requireAdminPermission('doctors', 'read'),
    adminController.getAllDoctors
);

/**
 * @route PUT /api/v1/admin/doctors/:doctorId/verify
 * @desc Verify/reject doctor account
 * @access Private (Admin with doctor approval permission)
 */
router.put('/doctors/:doctorId/verify',
    validateDoctorVerification,
    requireAdminPermission('doctors', 'approve'),
    adminController.verifyDoctor
);

// Patient Management Routes
/**
 * @route GET /api/v1/admin/patients
 * @desc Get all patients with filtering and pagination
 * @access Private (Admin only)
 */
router.get('/patients',
    requireAdminPermission('patients', 'read'),
    adminController.getAllPatients
);

// User Suspension Management
/**
 * @route PATCH /api/v1/admin/users/:userId/suspend
 * @desc Suspend/unsuspend user account
 * @access Private (Admin with user management permission)
 */
router.patch('/users/:userId/suspend',
    validateUserSuspension,
    adminController.toggleUserSuspension
);

// System Activity and Monitoring Routes
/**
 * @route GET /api/v1/admin/activity-logs
 * @desc Get system activity logs with filtering
 * @access Private (Admin only)
 */
router.get('/activity-logs',
    requireAdminPermission('system', 'read'),
    adminController.getActivityLogs
);

// Admin Team Management Routes (Super Admin Only)
/**
 * @route GET /api/v1/admin/team
 * @desc Get admin team members
 * @access Private (Super Admin only)
 */
router.get('/team', adminController.getAdminTeam);

/**
 * @route PUT /api/v1/admin/team/:adminId/permissions
 * @desc Update admin permissions and role
 * @access Private (Super Admin only)
 */
router.put('/team/:adminId/permissions',
    validatePermissionUpdate,
    adminController.updateAdminPermissions
);

// Data Export Routes (Super Admin Only)
/**
 * @route POST /api/v1/admin/export
 * @desc Export system data
 * @access Private (Super Admin only)
 */
router.post('/export',
    validateDataExport,
    adminController.exportSystemData
);

// Route documentation
router.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Admin API Routes - Phase 3C Implementation',
        version: '1.0.0',
        documentation: {
            profile: {
                'GET /admin/me': 'Get admin profile',
                'PUT /admin/me/profile': 'Update admin profile'
            },
            dashboard: {
                'GET /admin/dashboard': 'System dashboard statistics',
                'GET /admin/system-health': 'System health metrics'
            },
            userManagement: {
                'GET /admin/doctors': 'List all doctors with filters',
                'PUT /admin/doctors/:id/verify': 'Verify/reject doctor',
                'GET /admin/patients': 'List all patients with filters',
                'PATCH /admin/users/:id/suspend': 'Suspend/unsuspend user'
            },
            monitoring: {
                'GET /admin/activity-logs': 'System activity logs'
            },
            teamManagement: {
                'GET /admin/team': 'Admin team management (Super Admin)',
                'PUT /admin/team/:id/permissions': 'Update admin permissions'
            },
            dataManagement: {
                'POST /admin/export': 'Export system data (Super Admin)'
            }
        },
        permissions: {
            admin: 'Basic admin access to dashboard and read operations',
            'super-admin': 'Full system access including team and data management',
            permissions: [
                'doctors: create, read, update, delete, approve, reject',
                'patients: create, read, update, delete',
                'appointments: read, update',
                'medical-records: read',
                'system: read, update',
                'reports: create, read'
            ]
        }
    });
});

module.exports = router;
