/**
 * Admin Service
 * Business logic for admin-related operations
 */

const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

/**
 * Calculate comprehensive system statistics
 * @param {string} adminId - Admin ID requesting stats
 * @returns {Object} System statistics
 */
const calculateSystemStatistics = async (adminId) => {
    try {
        const [
            totalUsers,
            activeUsers,
            pendingVerifications,
            monthlyGrowth,
            systemHealth
        ] = await Promise.all([
            getTotalUserStats(),
            getActiveUserStats(),
            getPendingVerifications(),
            getMonthlyGrowthStats(),
            getSystemHealthMetrics()
        ]);

        return {
            users: totalUsers,
            activity: activeUsers,
            pending: pendingVerifications,
            growth: monthlyGrowth,
            health: systemHealth,
            generatedAt: new Date(),
            generatedBy: adminId
        };
    } catch (error) {
        logger.error('Error calculating system statistics:', error);
        throw new AppError('Failed to calculate system statistics', 500);
    }
};

/**
 * Get total user statistics
 */
const getTotalUserStats = async () => {
    const [doctors, patients, admins] = await Promise.all([
        Doctor.countDocuments(),
        Patient.countDocuments(),
        Admin.countDocuments({ isActive: true })
    ]);

    return {
        doctors: {
            total: doctors,
            verified: await Doctor.countDocuments({ 'verification.status': 'verified' }),
            pending: await Doctor.countDocuments({ 'verification.status': 'pending' }),
            rejected: await Doctor.countDocuments({ 'verification.status': 'rejected' })
        },
        patients: {
            total: patients,
            active: await Patient.countDocuments({ isActive: true }),
            verified: await Patient.countDocuments({ isEmailVerified: true })
        },
        admins: {
            total: admins,
            superAdmins: await Admin.countDocuments({ isSuperAdmin: true, isActive: true })
        },
        totalSystemUsers: doctors + patients + admins
    };
};

/**
 * Get active user statistics
 */
const getActiveUserStats = async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [activeDoctors, activePatients, activeAdmins] = await Promise.all([
        Doctor.countDocuments({
            isActive: true,
            lastLoginAt: { $gte: thirtyDaysAgo }
        }),
        Patient.countDocuments({
            isActive: true,
            lastLoginAt: { $gte: thirtyDaysAgo }
        }),
        Admin.countDocuments({
            isActive: true,
            lastLoginAt: { $gte: thirtyDaysAgo }
        })
    ]);

    return {
        activeDoctors,
        activePatients,
        activeAdmins,
        totalActiveUsers: activeDoctors + activePatients + activeAdmins,
        period: '30 days'
    };
};

/**
 * Get pending verification statistics
 */
const getPendingVerifications = async () => {
    const [pendingDoctors, recentApplications] = await Promise.all([
        Doctor.find({ 'verification.status': 'pending' })
            .sort({ createdAt: -1 })
            .select('fullName email specialization createdAt')
            .limit(10),
        Doctor.find({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } })
            .countDocuments()
    ]);

    return {
        count: pendingDoctors.length,
        recent: pendingDoctors,
        weeklyNewApplications: recentApplications
    };
};

/**
 * Get monthly growth statistics
 */
const getMonthlyGrowthStats = async () => {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const lastMonth = new Date(currentMonth);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const [currentDoctors, currentPatients, lastDoctors, lastPatients] = await Promise.all([
        Doctor.countDocuments({ createdAt: { $gte: currentMonth } }),
        Patient.countDocuments({ createdAt: { $gte: currentMonth } }),
        Doctor.countDocuments({
            createdAt: {
                $gte: lastMonth,
                $lt: currentMonth
            }
        }),
        Patient.countDocuments({
            createdAt: {
                $gte: lastMonth,
                $lt: currentMonth
            }
        })
    ]);

    const calculateGrowthRate = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous * 100).toFixed(1);
    };

    return {
        currentMonth: {
            doctors: currentDoctors,
            patients: currentPatients,
            total: currentDoctors + currentPatients
        },
        lastMonth: {
            doctors: lastDoctors,
            patients: lastPatients,
            total: lastDoctors + lastPatients
        },
        growthRates: {
            doctors: calculateGrowthRate(currentDoctors, lastDoctors),
            patients: calculateGrowthRate(currentPatients, lastPatients),
            total: calculateGrowthRate(
                currentDoctors + currentPatients,
                lastDoctors + lastPatients
            )
        }
    };
};

/**
 * Get system health metrics
 */
const getSystemHealthMetrics = async () => {
    const mongoose = require('mongoose');

    return {
        database: {
            connected: mongoose.connection.readyState === 1,
            status: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
            host: mongoose.connection.host,
            name: mongoose.connection.name
        },
        server: {
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            nodeVersion: process.version,
            platform: process.platform
        },
        timestamp: new Date()
    };
};

/**
 * Generate verification performance report
 * @param {string} adminId - Admin ID
 * @param {Object} filters - Date filters
 * @returns {Object} Verification performance data
 */
const generateVerificationReport = async (adminId, filters = {}) => {
    try {
        const { startDate, endDate } = filters;
        const dateFilter = {};

        if (startDate) dateFilter.createdAt = { $gte: new Date(startDate) };
        if (endDate) dateFilter.createdAt = { ...dateFilter.createdAt, $lte: new Date(endDate) };

        const admin = await Admin.findByAdminId(adminId).select('verifiedDoctors verifiedPatients statistics');

        if (!admin) {
            throw new AppError('Admin not found', 404);
        }

        const verificationStats = {
            admin: {
                adminId: admin.adminId,
                totalVerifications: admin.statistics.totalDoctorsVerified + admin.statistics.totalPatientsVerified,
                doctorVerifications: admin.statistics.totalDoctorsVerified,
                patientVerifications: admin.statistics.totalPatientsVerified,
                lastVerificationDate: admin.statistics.lastVerificationDate
            },
            recentActivity: {
                doctorActions: admin.verifiedDoctors.slice(-10),
                patientActions: admin.verifiedPatients.slice(-10)
            },
            performance: {
                averageVerificationTime: await calculateAverageVerificationTime(dateFilter),
                verificationAccuracy: await calculateVerificationAccuracy(adminId),
                approvalRate: await calculateApprovalRate(adminId)
            }
        };

        return verificationStats;
    } catch (error) {
        logger.error('Error generating verification report:', error);
        throw new AppError('Failed to generate verification report', 500);
    }
};

/**
 * Calculate average verification time
 */
const calculateAverageVerificationTime = async (dateFilter) => {
    const doctors = await Doctor.find({
        'verification.status': { $in: ['verified', 'rejected'] },
        'verification.verifiedAt': { $exists: true },
        ...dateFilter
    }).select('createdAt verification.verifiedAt');

    if (doctors.length === 0) return 0;

    const totalTime = doctors.reduce((sum, doctor) => {
        const created = new Date(doctor.createdAt);
        const verified = new Date(doctor.verification.verifiedAt);
        return sum + (verified - created);
    }, 0);

    const averageMs = totalTime / doctors.length;
    return Math.round(averageMs / (1000 * 60 * 60)); // Convert to hours
};

/**
 * Calculate verification accuracy (quality score)
 */
const calculateVerificationAccuracy = async (adminId) => {
    // This would typically involve checking if verified users later had issues
    // For now, return a mock score based on approval patterns
    const admin = await Admin.findByAdminId(adminId);
    const total = admin.verifiedDoctors.length;
    const approved = admin.verifiedDoctors.filter(v => v.action === 'approved').length;

    if (total === 0) return 100;
    return ((approved / total) * 100).toFixed(1);
};

/**
 * Calculate approval rate
 */
const calculateApprovalRate = async (adminId) => {
    const admin = await Admin.findByAdminId(adminId);
    const totalVerifications = admin.verifiedDoctors.length;
    const approvals = admin.verifiedDoctors.filter(v => v.action === 'approved').length;

    if (totalVerifications === 0) return 0;
    return ((approvals / totalVerifications) * 100).toFixed(1);
};

/**
 * Validate admin permissions for specific actions
 * @param {Object} admin - Admin object
 * @param {string} resource - Resource name
 * @param {string} action - Action name
 * @returns {boolean} Permission granted
 */
const validateAdminPermission = (admin, resource, action) => {
    // Super admin has all permissions
    if (admin.isSuperAdmin) return true;

    // Check if admin has specific permission
    const permission = admin.permissions.find(p => p.resource === resource);
    return permission && permission.actions.includes(action);
};

/**
 * Log administrative action
 * @param {string} adminId - Admin performing action
 * @param {string} action - Action performed
 * @param {Object} target - Target of action
 * @param {string} description - Action description
 * @param {Object} metadata - Additional data
 */
const logAdminAction = async (adminId, action, target, description, metadata = {}) => {
    try {
        const admin = await Admin.findById(adminId);
        if (admin) {
            admin.logSystemAction(action, target, description, metadata);
            await admin.save();

            logger.info(`Admin action logged: ${action} by ${admin.adminId}`);
        }
    } catch (error) {
        logger.error('Error logging admin action:', error);
    }
};

/**
 * Get admin performance metrics
 * @param {string} adminId - Admin ID
 * @returns {Object} Performance metrics
 */
const getAdminPerformanceMetrics = async (adminId) => {
    try {
        const admin = await Admin.findByAdminId(adminId);
        if (!admin) {
            throw new AppError('Admin not found', 404);
        }

        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const recentActions = admin.systemActions.filter(
            action => action.timestamp >= thirtyDaysAgo
        );

        const actionsByType = recentActions.reduce((acc, action) => {
            acc[action.action] = (acc[action.action] || 0) + 1;
            return acc;
        }, {});

        return {
            adminId: admin.adminId,
            period: '30 days',
            totalActions: recentActions.length,
            actionBreakdown: actionsByType,
            verificationsPerformed: admin.verifiedDoctors.filter(
                v => v.timestamp >= thirtyDaysAgo
            ).length,
            averageActionsPerDay: (recentActions.length / 30).toFixed(1),
            mostActiveDay: getMostActiveDay(recentActions),
            performanceScore: calculatePerformanceScore(admin, recentActions)
        };
    } catch (error) {
        logger.error('Error getting admin performance metrics:', error);
        throw new AppError('Failed to get performance metrics', 500);
    }
};

/**
 * Get most active day from recent actions
 */
const getMostActiveDay = (actions) => {
    const dayCount = actions.reduce((acc, action) => {
        const day = new Date(action.timestamp).toDateString();
        acc[day] = (acc[day] || 0) + 1;
        return acc;
    }, {});

    const mostActiveDay = Object.keys(dayCount).reduce((a, b) =>
        dayCount[a] > dayCount[b] ? a : b, ''
    );

    return {
        date: mostActiveDay,
        actionCount: dayCount[mostActiveDay] || 0
    };
};

/**
 * Calculate performance score
 */
const calculatePerformanceScore = (admin, recentActions) => {
    let score = 0;

    // Base score for activity
    score += Math.min(recentActions.length * 2, 50);

    // Bonus for verification activities
    const verifications = recentActions.filter(a => a.action === 'user-verification');
    score += verifications.length * 5;

    // Bonus for system maintenance
    const maintenance = recentActions.filter(a => a.action === 'system-maintenance');
    score += maintenance.length * 3;

    return Math.min(score, 100);
};

module.exports = {
    calculateSystemStatistics,
    getTotalUserStats,
    getActiveUserStats,
    getPendingVerifications,
    generateVerificationReport,
    validateAdminPermission,
    logAdminAction,
    getAdminPerformanceMetrics
};
