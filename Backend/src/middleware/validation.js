/**
 * Input Validation Middleware
 * Validates request data for authentication endpoints
 */

const { body, validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return next(new AppError(`Validation Error: ${errorMessages.join(', ')}`, 400));
  }

  next();
};

/**
 * Validation rules for doctor registration
 */
const validateDoctorRegistration = [
  body('fullName')
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s.'-]+$/)
    .withMessage('Full name can only contain letters, spaces, dots, hyphens, and apostrophes'),

  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^(\+88)?01[3-9]\d{8}$/)
    .withMessage('Please provide a valid Bangladesh phone number'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

  body('licenseNumber')
    .notEmpty()
    .withMessage('Medical license number is required')
    .isLength({ min: 5, max: 50 })
    .withMessage('License number must be between 5 and 50 characters'),

  body('experienceYears')
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage('Experience years must be a valid number between 0 and 50'),

  body('qualifications')
    .optional()
    .isArray()
    .withMessage('Qualifications must be an array'),

  body('hospitalAffiliations')
    .optional()
    .isArray()
    .withMessage('Hospital affiliations must be an array'),

  handleValidationErrors
];

/**
 * Validation rules for patient registration
 */
const validatePatientRegistration = [
  body('fullName')
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s.'-]+$/)
    .withMessage('Full name can only contain letters, spaces, dots, hyphens, and apostrophes'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^(\+88)?01[3-9]\d{8}$/)
    .withMessage('Please provide a valid Bangladesh phone number'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

  body('dateOfBirth')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isISO8601()
    .withMessage('Please provide a valid date of birth (YYYY-MM-DD)')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age > 120 || birthDate > today) {
        throw new Error('Please provide a valid date of birth');
      }

      return true;
    }),

  body('gender')
    .notEmpty()
    .withMessage('Gender is required')
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),

  body('bloodGroup')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'])
    .withMessage('Please select a valid blood group'),

  body('emergencyContact.name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Emergency contact name must be between 2 and 100 characters'),

  body('emergencyContact.phone')
    .optional()
    .matches(/^(\+88)?01[3-9]\d{8}$/)
    .withMessage('Please provide a valid emergency contact phone number'),

  body('emergencyContact.relationship')
    .optional()
    .isIn(['spouse', 'parent', 'sibling', 'child', 'friend', 'relative', 'other'])
    .withMessage('Please select a valid relationship'),

  handleValidationErrors
];

/**
 * Validation rules for user login
 */
const validateLogin = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  body('userType')
    .notEmpty()
    .withMessage('User type is required')
    .isIn(['doctor', 'patient', 'admin'])
    .withMessage('User type must be doctor, patient, or admin'),

  handleValidationErrors
];

/**
 * Validation rules for email verification
 */
const validateEmailVerification = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('code')
    .notEmpty()
    .withMessage('Verification code is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('Verification code must be 6 characters')
    .isNumeric()
    .withMessage('Verification code must contain only numbers'),

  body('userType')
    .notEmpty()
    .withMessage('User type is required')
    .isIn(['doctor', 'patient', 'admin'])
    .withMessage('User type must be doctor, patient, or admin'),

  handleValidationErrors
];

/**
 * Validation rules for forgot password
 */
const validateForgotPassword = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('userType')
    .notEmpty()
    .withMessage('User type is required')
    .isIn(['doctor', 'patient', 'admin'])
    .withMessage('User type must be doctor, patient, or admin'),

  handleValidationErrors
];

/**
 * Validation rules for password reset
 */
const validatePasswordReset = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required')
    .isLength({ min: 10 })
    .withMessage('Invalid reset token'),

  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

  body('userType')
    .notEmpty()
    .withMessage('User type is required')
    .isIn(['doctor', 'patient', 'admin'])
    .withMessage('User type must be doctor, patient, or admin'),

  handleValidationErrors
];

/**
 * Validation rules for password update
 */
const validatePasswordUpdate = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

  handleValidationErrors
];

/**
 * Validation rules for resend verification code
 */
const validateResendVerificationCode = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('userType')
    .notEmpty()
    .withMessage('User type is required')
    .isIn(['doctor', 'patient', 'admin'])
    .withMessage('User type must be doctor, patient, or admin'),

  handleValidationErrors
];

module.exports = {
  validateDoctorRegistration,
  validatePatientRegistration,
  validateLogin,
  validateEmailVerification,
  validateForgotPassword,
  validatePasswordReset,
  validatePasswordUpdate,
  validateResendVerificationCode
};
