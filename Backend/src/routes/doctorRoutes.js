/**
 * Doctor Routes
 * Defines all doctor profile management endpoints
 */

const express = require('express');
const router = express.Router();

// Import controllers and middleware
const doctorController = require('../controllers/doctorController');
const { authenticate, authorize } = require('../middleware/auth');
const {
    validateDoctorBasicUpdate,
    validateDoctorProfessionalUpdate,
    validateDoctorAvailability,
    validateQualification,
    validateHospitalAffiliation,
    validateNotificationPreferences
} = require('../middleware/validation');

// Rate limiting for doctor operations
const rateLimit = require('express-rate-limit');

// Rate limiter for profile updates
const profileUpdateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 profile updates per 15 minutes
    message: {
        status: 'error',
        message: 'Too many profile update attempts. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply authentication and authorization to all doctor routes
router.use(authenticate);
router.use(authorize('doctor'));

/**
 * @route   GET /api/v1/doctors/me
 * @desc    Get current doctor's complete profile
 * @access  Private (Doctor only)
 */
router.get('/me', doctorController.getMyProfile);

/**
 * @route   PUT /api/v1/doctors/me/basic
 * @desc    Update doctor's basic information (name, phone, notifications)
 * @access  Private (Doctor only)
 */
router.put('/me/basic',
    profileUpdateLimiter,
    validateDoctorBasicUpdate,
    doctorController.updateBasicInfo
);

/**
 * @route   PUT /api/v1/doctors/me/professional
 * @desc    Update doctor's professional information
 * @access  Private (Doctor only)
 */
router.put('/me/professional',
    profileUpdateLimiter,
    validateDoctorProfessionalUpdate,
    doctorController.updateProfessionalInfo
);

/**
 * @route   PUT /api/v1/doctors/me/availability
 * @desc    Update doctor's availability schedule
 * @access  Private (Doctor only)
 */
router.put('/me/availability',
    profileUpdateLimiter,
    validateDoctorAvailability,
    doctorController.updateAvailability
);

/**
 * @route   GET /api/v1/doctors/me/availability/:day
 * @desc    Get availability for a specific day
 * @access  Private (Doctor only)
 */
router.get('/me/availability/:day', doctorController.getAvailabilityByDay);

/**
 * @route   POST /api/v1/doctors/me/qualifications
 * @desc    Add a new qualification
 * @access  Private (Doctor only)
 */
router.post('/me/qualifications',
    profileUpdateLimiter,
    validateQualification,
    doctorController.addQualification
);

/**
 * @route   DELETE /api/v1/doctors/me/qualifications/:qualificationId
 * @desc    Remove a qualification
 * @access  Private (Doctor only)
 */
router.delete('/me/qualifications/:qualificationId',
    profileUpdateLimiter,
    doctorController.removeQualification
);

/**
 * @route   POST /api/v1/doctors/me/affiliations
 * @desc    Add hospital affiliation
 * @access  Private (Doctor only)
 */
router.post('/me/affiliations',
    profileUpdateLimiter,
    validateHospitalAffiliation,
    doctorController.addHospitalAffiliation
);

/**
 * @route   PUT /api/v1/doctors/me/affiliations/:affiliationId
 * @desc    Update hospital affiliation
 * @access  Private (Doctor only)
 */
router.put('/me/affiliations/:affiliationId',
    profileUpdateLimiter,
    validateHospitalAffiliation,
    doctorController.updateHospitalAffiliation
);

/**
 * @route   DELETE /api/v1/doctors/me/affiliations/:affiliationId
 * @desc    Remove hospital affiliation
 * @access  Private (Doctor only)
 */
router.delete('/me/affiliations/:affiliationId',
    profileUpdateLimiter,
    doctorController.removeHospitalAffiliation
);

/**
 * @route   PUT /api/v1/doctors/me/notifications
 * @desc    Update notification preferences
 * @access  Private (Doctor only)
 */
router.put('/me/notifications',
    profileUpdateLimiter,
    validateNotificationPreferences,
    doctorController.updateNotificationPreferences
);

/**
 * @route   GET /api/v1/doctors/me/stats
 * @desc    Get doctor's statistics and performance metrics
 * @access  Private (Doctor only)
 */
router.get('/me/stats', doctorController.getDoctorStats);

/**
 * @route   PATCH /api/v1/doctors/me/toggle-status
 * @desc    Toggle doctor's active status (temporarily disable/enable)
 * @access  Private (Doctor only)
 */
router.patch('/me/toggle-status',
    profileUpdateLimiter,
    doctorController.toggleActiveStatus
);

/**
 * @route   GET /api/v1/doctors/status
 * @desc    Get doctor routes service status
 * @access  Public
 */
router.get('/status', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Doctor Profile Management service is running',
        timestamp: new Date().toISOString(),
        endpoints: {
            profile: [
                'GET /doctors/me - Get complete profile',
                'PUT /doctors/me/basic - Update basic information',
                'PUT /doctors/me/professional - Update professional info',
                'GET /doctors/me/stats - Get performance statistics'
            ],
            availability: [
                'PUT /doctors/me/availability - Update availability schedule',
                'GET /doctors/me/availability/:day - Get day-specific availability'
            ],
            qualifications: [
                'POST /doctors/me/qualifications - Add qualification',
                'DELETE /doctors/me/qualifications/:id - Remove qualification'
            ],
            affiliations: [
                'POST /doctors/me/affiliations - Add hospital affiliation',
                'PUT /doctors/me/affiliations/:id - Update affiliation',
                'DELETE /doctors/me/affiliations/:id - Remove affiliation'
            ],
            settings: [
                'PUT /doctors/me/notifications - Update notification preferences',
                'PATCH /doctors/me/toggle-status - Toggle active status'
            ]
        },
        features: [
            'Complete profile management',
            'Availability scheduling',
            'Qualification management',
            'Hospital affiliation tracking',
            'Performance metrics',
            'Notification preferences',
            'Account status control'
        ],
        rateLimits: {
            profileUpdates: '20 requests per 15 minutes',
            general: '100 requests per 15 minutes'
        }
    });
});

module.exports = router;
