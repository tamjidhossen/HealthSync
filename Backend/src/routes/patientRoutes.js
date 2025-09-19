/**
 * Patient Routes
 * Defines all patient profile management endpoints
 */

const express = require('express');
const router = express.Router();

// Import controllers and middleware
const patientController = require('../controllers/patientController');
const { authenticate, authorize } = require('../middleware/auth');
const {
    validatePatientBasicUpdate,
    validatePatientAddress,
    validateEmergencyContact,
    validateInsuranceInfo,
    validateHealthMetrics,
    validateAllergyInfo,
    validateChronicCondition,
    validatePatientPreferences
} = require('../middleware/validation');

// Rate limiting for patient operations
const rateLimit = require('express-rate-limit');

// Rate limiter for profile updates
const profileUpdateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 25, // Limit each IP to 25 profile updates per 15 minutes
    message: {
        status: 'error',
        message: 'Too many profile update attempts. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply authentication and authorization to all patient routes
router.use(authenticate);
router.use(authorize('patient'));

/**
 * @route   GET /api/v1/patients/me
 * @desc    Get current patient's complete profile
 * @access  Private (Patient only)
 */
router.get('/me', patientController.getMyProfile);

/**
 * @route   PUT /api/v1/patients/me/basic
 * @desc    Update patient's basic information (name, phone, blood group, preferences)
 * @access  Private (Patient only)
 */
router.put('/me/basic',
    profileUpdateLimiter,
    validatePatientBasicUpdate,
    patientController.updateBasicInfo
);

/**
 * @route   PUT /api/v1/patients/me/address
 * @desc    Update patient's address information
 * @access  Private (Patient only)
 */
router.put('/me/address',
    profileUpdateLimiter,
    validatePatientAddress,
    patientController.updateAddress
);

/**
 * @route   PUT /api/v1/patients/me/emergency-contact
 * @desc    Update emergency contact information
 * @access  Private (Patient only)
 */
router.put('/me/emergency-contact',
    profileUpdateLimiter,
    validateEmergencyContact,
    patientController.updateEmergencyContact
);

/**
 * @route   PUT /api/v1/patients/me/insurance
 * @desc    Update insurance information
 * @access  Private (Patient only)
 */
router.put('/me/insurance',
    profileUpdateLimiter,
    validateInsuranceInfo,
    patientController.updateInsurance
);

/**
 * @route   PUT /api/v1/patients/me/health-metrics
 * @desc    Update health metrics (height, weight)
 * @access  Private (Patient only)
 */
router.put('/me/health-metrics',
    profileUpdateLimiter,
    validateHealthMetrics,
    patientController.updateHealthMetrics
);

/**
 * @route   POST /api/v1/patients/me/allergies
 * @desc    Add a new allergy
 * @access  Private (Patient only)
 */
router.post('/me/allergies',
    profileUpdateLimiter,
    validateAllergyInfo,
    patientController.addAllergy
);

/**
 * @route   PUT /api/v1/patients/me/allergies/:allergyId
 * @desc    Update an existing allergy
 * @access  Private (Patient only)
 */
router.put('/me/allergies/:allergyId',
    profileUpdateLimiter,
    validateAllergyInfo,
    patientController.updateAllergy
);

/**
 * @route   DELETE /api/v1/patients/me/allergies/:allergyId
 * @desc    Remove an allergy
 * @access  Private (Patient only)
 */
router.delete('/me/allergies/:allergyId',
    profileUpdateLimiter,
    patientController.removeAllergy
);

/**
 * @route   POST /api/v1/patients/me/conditions
 * @desc    Add a new chronic condition
 * @access  Private (Patient only)
 */
router.post('/me/conditions',
    profileUpdateLimiter,
    validateChronicCondition,
    patientController.addChronicCondition
);

/**
 * @route   PUT /api/v1/patients/me/conditions/:conditionId
 * @desc    Update chronic condition status
 * @access  Private (Patient only)
 */
router.put('/me/conditions/:conditionId',
    profileUpdateLimiter,
    validateChronicCondition,
    patientController.updateChronicCondition
);

/**
 * @route   PUT /api/v1/patients/me/preferences
 * @desc    Update notification and system preferences
 * @access  Private (Patient only)
 */
router.put('/me/preferences',
    profileUpdateLimiter,
    validatePatientPreferences,
    patientController.updatePreferences
);

/**
 * @route   GET /api/v1/patients/me/stats
 * @desc    Get patient's health statistics and profile summary
 * @access  Private (Patient only)
 */
router.get('/me/stats', patientController.getPatientStats);

/**
 * @route   PATCH /api/v1/patients/me/toggle-status
 * @desc    Toggle patient's active status (temporarily disable/enable)
 * @access  Private (Patient only)
 */
router.patch('/me/toggle-status',
    profileUpdateLimiter,
    patientController.toggleActiveStatus
);

/**
 * @route   GET /api/v1/patients/status
 * @desc    Get patient routes service status
 * @access  Public
 */
router.get('/status', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Patient Profile Management service is running',
        timestamp: new Date().toISOString(),
        endpoints: {
            profile: [
                'GET /patients/me - Get complete profile',
                'PUT /patients/me/basic - Update basic information',
                'PUT /patients/me/address - Update address information',
                'GET /patients/me/stats - Get health statistics'
            ],
            medical: [
                'POST /patients/me/allergies - Add allergy',
                'PUT /patients/me/allergies/:id - Update allergy',
                'DELETE /patients/me/allergies/:id - Remove allergy',
                'POST /patients/me/conditions - Add chronic condition',
                'PUT /patients/me/conditions/:id - Update condition status'
            ],
            health: [
                'PUT /patients/me/health-metrics - Update height/weight',
                'PUT /patients/me/emergency-contact - Update emergency contact',
                'PUT /patients/me/insurance - Update insurance information'
            ],
            settings: [
                'PUT /patients/me/preferences - Update notification preferences',
                'PATCH /patients/me/toggle-status - Toggle active status'
            ]
        },
        features: [
            'Complete medical history management',
            'Allergy tracking with severity levels',
            'Chronic condition monitoring',
            'Health metrics (BMI calculation)',
            'Emergency contact management',
            'Insurance information tracking',
            'Comprehensive health statistics',
            'Notification preferences control'
        ],
        rateLimits: {
            profileUpdates: '25 requests per 15 minutes',
            general: '100 requests per 15 minutes'
        }
    });
});

module.exports = router;
