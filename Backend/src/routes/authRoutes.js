/**
 * Authentication Routes
 * Defines all authentication-related endpoints
 */

const express = require('express');
const router = express.Router();

// Import controllers and middleware
const authController = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth');
const {
  validateDoctorRegistration,
  validatePatientRegistration,
  validateLogin,
  validateEmailVerification,
  validateForgotPassword,
  validatePasswordReset,
  validatePasswordUpdate,
  validateResendVerificationCode
} = require('../middleware/validation');

// Rate limiting for authentication routes
const rateLimit = require('express-rate-limit');

// Stricter rate limiting for sensitive endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many authentication attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Even stricter rate limiting for password reset
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    status: 'error',
    message: 'Too many password reset attempts. Please try again after an hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Verification code limiter
const verificationLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 verification attempts per 10 minutes
  message: {
    status: 'error',
    message: 'Too many verification attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @route   POST /api/v1/auth/register/doctor
 * @desc    Register a new doctor
 * @access  Public
 */
router.post('/register/doctor', 
  authLimiter,
  validateDoctorRegistration,
  authController.registerDoctor
);

/**
 * @route   POST /api/v1/auth/register/patient
 * @desc    Register a new patient
 * @access  Public
 */
router.post('/register/patient', 
  authLimiter,
  validatePatientRegistration,
  authController.registerPatient
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user (doctor, patient, or admin)
 * @access  Public
 */
router.post('/login', 
  authLimiter,
  validateLogin,
  authController.login
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout current user
 * @access  Protected
 */
router.post('/logout', 
  authenticate,
  authController.logout
);

/**
 * @route   POST /api/v1/auth/verify-email
 * @desc    Verify user email address
 * @access  Public
 */
router.post('/verify-email', 
  verificationLimiter,
  validateEmailVerification,
  authController.verifyEmail
);

/**
 * @route   POST /api/v1/auth/resend-verification
 * @desc    Resend email verification code
 * @access  Public
 */
router.post('/resend-verification', 
  verificationLimiter,
  validateResendVerificationCode,
  authController.resendVerificationCode
);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password', 
  passwordResetLimiter,
  validateForgotPassword,
  authController.forgotPassword
);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', 
  passwordResetLimiter,
  validatePasswordReset,
  authController.resetPassword
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Protected
 */
router.get('/me', 
  authenticate,
  authController.getMe
);

/**
 * @route   PUT /api/v1/auth/update-password
 * @desc    Update current user password
 * @access  Protected
 */
router.put('/update-password', 
  authenticate,
  authLimiter,
  validatePasswordUpdate,
  authController.updatePassword
);

/**
 * @route   GET /api/v1/auth/check
 * @desc    Check authentication status
 * @access  Public
 */
router.get('/check', 
  authenticate,
  authController.checkAuth
);

/**
 * @route   GET /api/v1/auth/status
 * @desc    Get authentication service status
 * @access  Public
 */
router.get('/status', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Authentication service is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      registration: [
        'POST /auth/register/doctor - Register new doctor',
        'POST /auth/register/patient - Register new patient'
      ],
      authentication: [
        'POST /auth/login - User login',
        'POST /auth/logout - User logout',
        'GET /auth/check - Check auth status'
      ],
      verification: [
        'POST /auth/verify-email - Verify email',
        'POST /auth/resend-verification - Resend verification code'
      ],
      password: [
        'POST /auth/forgot-password - Request password reset',
        'POST /auth/reset-password - Reset password',
        'PUT /auth/update-password - Update current password'
      ],
      profile: [
        'GET /auth/me - Get current user profile'
      ]
    },
    rateLimits: {
      authentication: '10 requests per 15 minutes',
      passwordReset: '3 requests per hour',
      verification: '5 requests per 10 minutes'
    }
  });
});

module.exports = router;
