/**
 * Admin Controller
 * Handles all administrative operations for HealthSync system
 */

const mongoose = require('mongoose');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const logger = require('../utils/logger');
const { ADMIN_ROLES, ADMIN_PERMISSIONS } = require('../utils/constants');

/**
 * Get current admin's profile
 * @route GET /api/v1/admin/me
 * @access Private (Admin only)
 */
const getMyProfile = catchAsync(async (req, res, next) => {
    const admin = await Admin.findById(req.user._id)
        .select('+statistics')
        .populate('systemActions.target.targetId', 'fullName email');

    if (!admin) {
        return next(new AppError('Admin profile not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            admin
        }
    });
});

/**
 * Update admin's basic profile information
 * @route PUT /api/v1/admin/me/profile
 * @access Private (Admin only)
 */
const updateMyProfile = catchAsync(async (req, res, next) => {
    const { fullName, phone, department, responsibilities, preferences } = req.body;

    // Fields that cannot be updated through this endpoint
    const restrictedFields = ['email', 'adminId', 'passwordHash', 'role', 'permissions', 'isSuperAdmin'];

    // Check if any restricted fields are being updated
    const attemptedRestrictedUpdate = restrictedFields.some(field => req.body[field] !== undefined);
    if (attemptedRestrictedUpdate) {
        return next(new AppError('You cannot update restricted fields through this endpoint', 400));
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (phone) updateData.phone = phone;
    if (department) updateData.department = department;
    if (responsibilities) updateData.responsibilities = responsibilities;
    if (preferences) updateData.preferences = preferences;

    const admin = await Admin.findByIdAndUpdate(
        req.user._id,
        updateData,
        {
            new: true,
            runValidators: true
        }
    );

    if (!admin) {
        return next(new AppError('Admin not found', 404));
    }

    // Log system action
    admin.logSystemAction(
        'settings-updated',
        { targetType: 'system', targetId: admin._id },
        'Admin profile updated',
        { updatedFields: Object.keys(updateData) }
    );
    await admin.save();

    logger.info(`Admin profile updated: ${admin.adminId}`);

    res.status(200).json({
        status: 'success',
        message: 'Profile updated successfully',
        data: {
            admin
        }
    });
});

/**
 * Get system dashboard statistics
 * @route GET /api/v1/admin/dashboard
 * @access Private (Admin only)
 */
const getDashboardStats = catchAsync(async (req, res, next) => {
    const [
        totalDoctors,
        totalPatients,
        pendingDoctors,
        verifiedDoctors,
        rejectedDoctors,
        activeDoctors,
        inactivePatients,
        recentSignups
    ] = await Promise.all([
        Doctor.countDocuments(),
        Patient.countDocuments(),
        Doctor.countDocuments({ 'verification.status': 'pending' }),
        Doctor.countDocuments({ 'verification.status': 'verified' }),
        Doctor.countDocuments({ 'verification.status': 'rejected' }),
        Doctor.countDocuments({ isActive: true }),
        Patient.countDocuments({ isActive: false }),
        Doctor.find().sort({ createdAt: -1 }).limit(5).select('fullName createdAt verification.status')
    ]);

    const stats = {
        overview: {
            totalDoctors,
            totalPatients,
            totalAdmins: await Admin.countDocuments({ isActive: true }),
            systemUptime: process.uptime()
        },
        doctors: {
            total: totalDoctors,
            pending: pendingDoctors,
            verified: verifiedDoctors,
            rejected: rejectedDoctors,
            active: activeDoctors,
            pendingPercentage: totalDoctors > 0 ? ((pendingDoctors / totalDoctors) * 100).toFixed(1) : 0
        },
        patients: {
            total: totalPatients,
            active: totalPatients - inactivePatients,
            inactive: inactivePatients,
            activePercentage: totalPatients > 0 ? (((totalPatients - inactivePatients) / totalPatients) * 100).toFixed(1) : 0
        },
        recentActivity: {
            newSignups: recentSignups,
            pendingVerifications: await Doctor.find({ 'verification.status': 'pending' })
                .sort({ createdAt: -1 })
                .limit(10)
                .select('fullName email createdAt specialization'),
        }
    };

    res.status(200).json({
        status: 'success',
        data: {
            dashboard: stats
        }
    });
});

/**
 * Get all doctors with filtering and pagination
 * @route GET /api/v1/admin/doctors
 * @access Private (Admin only)
 */
const getAllDoctors = catchAsync(async (req, res, next) => {
    const {
        page = 1,
        limit = 10,
        status,
        verification,
        specialization,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = req.query;

    const query = {};

    // Filter by status
    if (status) query.isActive = status === 'active';

    // Filter by verification status
    if (verification) query['verification.status'] = verification;

    // Filter by specialization
    if (specialization) query.specialization = { $regex: specialization, $options: 'i' };

    // Search functionality
    if (search) {
        query.$or = [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { doctorId: { $regex: search, $options: 'i' } },
            { licenseNumber: { $regex: search, $options: 'i' } }
        ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const doctors = await Doctor.find(query)
        .sort(sortOptions)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-passwordHash')
        .populate('verification.verifiedBy', 'fullName adminId');

    const total = await Doctor.countDocuments(query);

    res.status(200).json({
        status: 'success',
        results: doctors.length,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
        },
        data: {
            doctors
        }
    });
});

/**
 * Get all patients with filtering and pagination
 * @route GET /api/v1/admin/patients
 * @access Private (Admin only)
 */
const getAllPatients = catchAsync(async (req, res, next) => {
    const {
        page = 1,
        limit = 10,
        status,
        search,
        bloodGroup,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = req.query;

    const query = {};

    // Filter by status
    if (status) query.isActive = status === 'active';

    // Filter by blood group
    if (bloodGroup) query.bloodGroup = bloodGroup;

    // Search functionality
    if (search) {
        query.$or = [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { patientId: { $regex: search, $options: 'i' } }
        ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const patients = await Patient.find(query)
        .sort(sortOptions)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-passwordHash');

    const total = await Patient.countDocuments(query);

    res.status(200).json({
        status: 'success',
        results: patients.length,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
        },
        data: {
            patients
        }
    });
});

/**
 * Verify doctor account
 * @route PUT /api/v1/admin/doctors/:doctorId/verify
 * @access Private (Admin only)
 */
const verifyDoctor = catchAsync(async (req, res, next) => {
    const { doctorId } = req.params;
    const { action, reason, notes } = req.body;

    if (!['approve', 'reject'].includes(action)) {
        return next(new AppError('Action must be either approve or reject', 400));
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
        return next(new AppError('Doctor not found', 404));
    }

    if (doctor.verification.status !== 'pending') {
        return next(new AppError('Doctor verification is not in pending status', 400));
    }

    // Check admin permissions
    if (!req.user.hasPermission('doctors', action === 'approve' ? 'approve' : 'reject')) {
        return next(new AppError('You do not have permission to perform this action', 403));
    }

    const verificationStatus = action === 'approve' ? 'verified' : 'rejected';
    const verificationData = {
        'verification.status': verificationStatus,
        'verification.verifiedBy': req.user._id,
        'verification.verifiedAt': new Date(),
        'verification.verificationNotes': notes || ''
    };

    if (action === 'reject' && reason) {
        verificationData['verification.rejectionReason'] = reason;
    }

    await Doctor.findByIdAndUpdate(doctorId, verificationData);

    // Update admin verification history
    const admin = await Admin.findById(req.user._id);
    admin.verifiedDoctors.push({
        doctor: doctorId,
        action: action === 'approve' ? 'approved' : 'rejected',
        reason: reason || '',
        notes: notes || ''
    });

    admin.logSystemAction(
        'user-verification',
        { targetType: 'doctor', targetId: doctorId },
        `Doctor ${action}d - ${doctor.fullName}`,
        { action, reason, notes }
    );

    await admin.save();

    logger.info(`Doctor ${action}d: ${doctor.doctorId} by admin: ${admin.adminId}`);

    res.status(200).json({
        status: 'success',
        message: `Doctor ${action}d successfully`,
        data: {
            doctor: await Doctor.findById(doctorId).populate('verification.verifiedBy', 'fullName adminId')
        }
    });
});

/**
 * Suspend/unsuspend user account
 * @route PATCH /api/v1/admin/users/:userId/suspend
 * @access Private (Admin only)
 */
const toggleUserSuspension = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const { userType, action, reason } = req.body;

    if (!['doctor', 'patient'].includes(userType)) {
        return next(new AppError('User type must be doctor or patient', 400));
    }

    if (!['suspend', 'unsuspend'].includes(action)) {
        return next(new AppError('Action must be suspend or unsuspend', 400));
    }

    // Check admin permissions
    const resource = userType === 'doctor' ? 'doctors' : 'patients';
    if (!req.user.hasPermission(resource, 'update')) {
        return next(new AppError('You do not have permission to perform this action', 403));
    }

    const Model = userType === 'doctor' ? Doctor : Patient;
    const user = await Model.findById(userId);

    if (!user) {
        return next(new AppError(`${userType.charAt(0).toUpperCase() + userType.slice(1)} not found`, 404));
    }

    const isSuspended = action === 'suspend';
    await Model.findByIdAndUpdate(userId, {
        isActive: !isSuspended,
        ...(isSuspended && { suspendedAt: new Date() })
    });

    // Update admin action history
    const admin = await Admin.findById(req.user._id);
    const targetArray = userType === 'doctor' ? 'verifiedDoctors' : 'verifiedPatients';
    admin[targetArray].push({
        [userType]: userId,
        action: isSuspended ? 'suspended' : 'reactivated',
        reason: reason || '',
        notes: `Account ${action}ed by admin`
    });

    admin.logSystemAction(
        'account-suspension',
        { targetType: userType, targetId: userId },
        `${userType.charAt(0).toUpperCase() + userType.slice(1)} account ${action}ed - ${user.fullName}`,
        { action, reason }
    );

    await admin.save();

    logger.info(`${userType} ${action}ed: ${user[`${userType}Id`]} by admin: ${admin.adminId}`);

    res.status(200).json({
        status: 'success',
        message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} ${action}ed successfully`,
        data: {
            user: await Model.findById(userId)
        }
    });
});

/**
 * Get system activity logs
 * @route GET /api/v1/admin/activity-logs
 * @access Private (Admin only)
 */
const getActivityLogs = catchAsync(async (req, res, next) => {
    const { page = 1, limit = 20, adminId, action, targetType, startDate, endDate } = req.query;

    const matchQuery = {};

    if (adminId) {
        matchQuery._id = new mongoose.Types.ObjectId(adminId);
    }

    const pipeline = [
        ...(Object.keys(matchQuery).length ? [{ $match: matchQuery }] : []),
        { $unwind: '$systemActions' },
        {
            $match: {
                ...(action && { 'systemActions.action': action }),
                ...(targetType && { 'systemActions.target.targetType': targetType }),
                ...(startDate && {
                    'systemActions.timestamp': {
                        $gte: new Date(startDate),
                        ...(endDate && { $lte: new Date(endDate) })
                    }
                })
            }
        },
        { $sort: { 'systemActions.timestamp': -1 } },
        { $skip: (page - 1) * limit },
        { $limit: parseInt(limit) },
        {
            $project: {
                adminId: 1,
                fullName: 1,
                email: 1,
                action: '$systemActions.action',
                target: '$systemActions.target',
                description: '$systemActions.description',
                metadata: '$systemActions.metadata',
                timestamp: '$systemActions.timestamp'
            }
        }
    ];

    const logs = await Admin.aggregate(pipeline);

    const totalLogs = await Admin.aggregate([
        ...(Object.keys(matchQuery).length ? [{ $match: matchQuery }] : []),
        { $unwind: '$systemActions' },
        {
            $match: {
                ...(action && { 'systemActions.action': action }),
                ...(targetType && { 'systemActions.target.targetType': targetType })
            }
        },
        { $count: 'total' }
    ]);

    const total = totalLogs[0]?.total || 0;

    res.status(200).json({
        status: 'success',
        results: logs.length,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
        },
        data: {
            logs
        }
    });
});

/**
 * Get admin team management
 * @route GET /api/v1/admin/team
 * @access Private (Super Admin only)
 */
const getAdminTeam = catchAsync(async (req, res, next) => {
    if (!req.user.isSuperAdmin) {
        return next(new AppError('Super admin access required', 403));
    }

    const { page = 1, limit = 10, role, status, search } = req.query;

    const query = {};
    if (role) query.role = role;
    if (status) query.isActive = status === 'active';

    if (search) {
        query.$or = [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { adminId: { $regex: search, $options: 'i' } }
        ];
    }

    const admins = await Admin.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-passwordHash -twoFactorSecret');

    const total = await Admin.countDocuments(query);

    res.status(200).json({
        status: 'success',
        results: admins.length,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
        },
        data: {
            admins
        }
    });
});

/**
 * Update admin permissions
 * @route PUT /api/v1/admin/team/:adminId/permissions
 * @access Private (Super Admin only)
 */
const updateAdminPermissions = catchAsync(async (req, res, next) => {
    if (!req.user.isSuperAdmin) {
        return next(new AppError('Super admin access required', 403));
    }

    const { adminId } = req.params;
    const { role, permissions } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) {
        return next(new AppError('Admin not found', 404));
    }

    if (admin.isSuperAdmin && admin._id.toString() !== req.user._id.toString()) {
        return next(new AppError('Cannot modify another super admin', 403));
    }

    const updateData = {};
    if (role && ADMIN_ROLES.includes(role)) {
        updateData.role = role;
    }

    if (permissions && Array.isArray(permissions)) {
        updateData.permissions = permissions;
    }

    await Admin.findByIdAndUpdate(adminId, updateData);

    // Log action
    const currentAdmin = await Admin.findById(req.user._id);
    currentAdmin.logSystemAction(
        'settings-updated',
        { targetType: 'admin', targetId: adminId },
        `Admin permissions updated for ${admin.fullName}`,
        { role, permissions }
    );
    await currentAdmin.save();

    logger.info(`Admin permissions updated: ${admin.adminId} by ${currentAdmin.adminId}`);

    res.status(200).json({
        status: 'success',
        message: 'Admin permissions updated successfully',
        data: {
            admin: await Admin.findById(adminId).select('-passwordHash')
        }
    });
});

/**
 * Get system health and performance metrics
 * @route GET /api/v1/admin/system-health
 * @access Private (Admin only)
 */
const getSystemHealth = catchAsync(async (req, res, next) => {
    const healthMetrics = {
        server: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            cpuUsage: process.cpuUsage(),
            platform: process.platform,
            nodeVersion: process.version
        },
        database: {
            connected: require('mongoose').connection.readyState === 1,
            status: require('mongoose').connection.readyState
        },
        system: {
            timestamp: new Date(),
            environment: process.env.NODE_ENV || 'development'
        }
    };

    res.status(200).json({
        status: 'success',
        data: {
            health: healthMetrics
        }
    });
});

/**
 * Export system data
 * @route POST /api/v1/admin/export
 * @access Private (Super Admin only)
 */
const exportSystemData = catchAsync(async (req, res, next) => {
    if (!req.user.isSuperAdmin) {
        return next(new AppError('Super admin access required', 403));
    }

    const { dataType, format = 'json', startDate, endDate } = req.body;

    const validDataTypes = ['doctors', 'patients', 'admins', 'activity-logs'];
    if (!validDataTypes.includes(dataType)) {
        return next(new AppError('Invalid data type', 400));
    }

    let data;
    const dateFilter = {};
    if (startDate) dateFilter.createdAt = { $gte: new Date(startDate) };
    if (endDate) dateFilter.createdAt = { ...dateFilter.createdAt, $lte: new Date(endDate) };

    switch (dataType) {
        case 'doctors':
            data = await Doctor.find(dateFilter).select('-passwordHash');
            break;
        case 'patients':
            data = await Patient.find(dateFilter).select('-passwordHash');
            break;
        case 'admins':
            data = await Admin.find(dateFilter).select('-passwordHash -twoFactorSecret');
            break;
        case 'activity-logs':
            data = await Admin.aggregate([
                { $unwind: '$systemActions' },
                { $match: dateFilter ? { 'systemActions.timestamp': dateFilter.createdAt } : {} },
                { $project: { systemActions: 1, adminId: 1, fullName: 1 } }
            ]);
            break;
    }

    // Log export action
    const admin = await Admin.findById(req.user._id);
    admin.logSystemAction(
        'data-export',
        { targetType: 'system', targetId: 'export' },
        `System data exported - ${dataType}`,
        { dataType, format, recordCount: data.length }
    );
    await admin.save();

    logger.info(`Data export performed: ${dataType} by admin: ${admin.adminId}`);

    res.status(200).json({
        status: 'success',
        message: 'Data exported successfully',
        exportInfo: {
            dataType,
            format,
            recordCount: data.length,
            exportedAt: new Date(),
            exportedBy: admin.adminId
        },
        data
    });
});

module.exports = {
    getMyProfile,
    updateMyProfile,
    getDashboardStats,
    getAllDoctors,
    getAllPatients,
    verifyDoctor,
    toggleUserSuspension,
    getActivityLogs,
    getAdminTeam,
    updateAdminPermissions,
    getSystemHealth,
    exportSystemData
};
