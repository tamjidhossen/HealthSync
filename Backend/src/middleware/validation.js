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

/**
 * Validation rules for doctor basic info update
 */
const validateDoctorBasicUpdate = [
  body('fullName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s.'-]+$/)
    .withMessage('Full name can only contain letters, spaces, dots, hyphens, and apostrophes'),

  body('phone')
    .optional()
    .matches(/^(\+88)?01[3-9]\d{8}$/)
    .withMessage('Please provide a valid Bangladesh phone number'),

  body('notificationPreferences.email')
    .optional()
    .isBoolean()
    .withMessage('Email notification preference must be boolean'),

  body('notificationPreferences.sms')
    .optional()
    .isBoolean()
    .withMessage('SMS notification preference must be boolean'),

  body('notificationPreferences.push')
    .optional()
    .isBoolean()
    .withMessage('Push notification preference must be boolean'),

  handleValidationErrors
];

/**
 * Validation rules for doctor professional info update
 */
const validateDoctorProfessionalUpdate = [
  body('specialization')
    .optional()
    .isIn([
      'General Medicine', 'Cardiology', 'Dermatology', 'Endocrinology',
      'Gastroenterology', 'Neurology', 'Oncology', 'Orthopedics',
      'Pediatrics', 'Psychiatry', 'Pulmonology', 'Radiology',
      'Surgery', 'Urology', 'Gynecology', 'Ophthalmology', 'ENT',
      'Anesthesiology', 'Emergency Medicine', 'Family Medicine', 'N/A'
    ])
    .withMessage('Please select a valid specialization'),

  body('experienceYears')
    .optional()
    .isInt({ min: 0, max: 60 })
    .withMessage('Experience years must be between 0 and 60'),

  body('qualifications')
    .optional()
    .isArray()
    .withMessage('Qualifications must be an array'),

  body('qualifications.*.degree')
    .optional()
    .notEmpty()
    .withMessage('Qualification degree is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Degree must be between 2 and 100 characters'),

  body('qualifications.*.institute')
    .optional()
    .notEmpty()
    .withMessage('Qualification institute is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Institute name must be between 2 and 200 characters'),

  body('qualifications.*.year')
    .optional()
    .isInt({ min: 1950, max: new Date().getFullYear() })
    .withMessage(`Qualification year must be between 1950 and ${new Date().getFullYear()}`),

  body('hospitalAffiliations')
    .optional()
    .isArray()
    .withMessage('Hospital affiliations must be an array'),

  body('hospitalAffiliations.*.name')
    .optional()
    .notEmpty()
    .withMessage('Hospital name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Hospital name must be between 2 and 200 characters'),

  body('hospitalAffiliations.*.department')
    .optional()
    .notEmpty()
    .withMessage('Department is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Department must be between 2 and 100 characters'),

  body('hospitalAffiliations.*.startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),

  body('hospitalAffiliations.*.endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),

  body('hospitalAffiliations.*.isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be boolean'),

  body('curedDiseases')
    .optional()
    .isArray()
    .withMessage('Cured diseases must be an array'),

  body('curedDiseases.*.name')
    .optional()
    .notEmpty()
    .withMessage('Disease name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Disease name must be between 2 and 100 characters'),

  body('curedDiseases.*.count')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Disease count must be non-negative'),

  handleValidationErrors
];

/**
 * Validation rules for doctor availability update
 */
const validateDoctorAvailability = [
  body('availability')
    .isArray()
    .withMessage('Availability must be an array'),

  body('availability.*.day')
    .notEmpty()
    .withMessage('Day is required')
    .isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
    .withMessage('Invalid day of week'),

  body('availability.*.slots')
    .optional()
    .isArray()
    .withMessage('Slots must be an array'),

  body('availability.*.slots.*')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid time slot format. Use HH:MM-HH:MM format'),

  body('availability.*.patientsCount')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Patients count must be between 1 and 50'),

  handleValidationErrors
];

/**
 * Validation rules for adding qualification
 */
const validateQualification = [
  body('degree')
    .notEmpty()
    .withMessage('Degree is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Degree must be between 2 and 100 characters'),

  body('institute')
    .notEmpty()
    .withMessage('Institute is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Institute name must be between 2 and 200 characters'),

  body('year')
    .isInt({ min: 1950, max: new Date().getFullYear() })
    .withMessage(`Year must be between 1950 and ${new Date().getFullYear()}`),

  handleValidationErrors
];

/**
 * Validation rules for hospital affiliation
 */
const validateHospitalAffiliation = [
  body('name')
    .notEmpty()
    .withMessage('Hospital name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Hospital name must be between 2 and 200 characters'),

  body('department')
    .notEmpty()
    .withMessage('Department is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Department must be between 2 and 100 characters'),

  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),

  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be boolean'),

  handleValidationErrors
];

/**
 * Validation rules for notification preferences
 */
const validateNotificationPreferences = [
  body('email')
    .optional()
    .isBoolean()
    .withMessage('Email notification preference must be boolean'),

  body('sms')
    .optional()
    .isBoolean()
    .withMessage('SMS notification preference must be boolean'),

  body('push')
    .optional()
    .isBoolean()
    .withMessage('Push notification preference must be boolean'),

  handleValidationErrors
];

/**
 * Validation rules for patient basic information update
 */
const validatePatientBasicUpdate = [
  body('fullName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s.'-]+$/)
    .withMessage('Full name can only contain letters, spaces, dots, hyphens, and apostrophes'),

  body('phone')
    .optional()
    .matches(/^(\+88)?01[3-9]\d{8}$/)
    .withMessage('Please provide a valid Bangladesh phone number'),

  body('bloodGroup')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Please provide a valid blood group'),

  body('preferences.notifications.email')
    .optional()
    .isBoolean()
    .withMessage('Email notification preference must be true or false'),

  body('preferences.notifications.sms')
    .optional()
    .isBoolean()
    .withMessage('SMS notification preference must be true or false'),

  body('preferences.language')
    .optional()
    .isLength({ min: 2, max: 5 })
    .withMessage('Language code must be 2-5 characters'),

  handleValidationErrors
];

/**
 * Validation rules for patient address update
 */
const validatePatientAddress = [
  body('street')
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('Street address must be between 1 and 200 characters'),

  body('city')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('City name must be between 1 and 100 characters'),

  body('state')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('State name must be between 1 and 100 characters'),

  body('zipCode')
    .optional()
    .matches(/^\d{5,10}$/)
    .withMessage('Zip code must be 5-10 digits'),

  body('country')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Country name must be between 2 and 100 characters'),

  handleValidationErrors
];

/**
 * Validation rules for emergency contact
 */
const validateEmergencyContact = [
  body('name')
    .notEmpty()
    .withMessage('Emergency contact name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('phone')
    .notEmpty()
    .withMessage('Emergency contact phone is required')
    .matches(/^[0-9]{10,15}$/)
    .withMessage('Phone number must be 10-15 digits'),

  body('relation')
    .notEmpty()
    .withMessage('Relationship to patient is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Relation must be between 1 and 50 characters'),

  handleValidationErrors
];

/**
 * Validation rules for insurance information
 */
const validateInsuranceInfo = [
  body('provider')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Insurance provider name must be between 2 and 100 characters'),

  body('policyNumber')
    .optional()
    .isLength({ min: 5, max: 50 })
    .withMessage('Policy number must be between 5 and 50 characters'),

  body('groupNumber')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Group number must be between 1 and 50 characters'),

  body('validUntil')
    .optional()
    .isISO8601()
    .withMessage('Valid until date must be a valid date'),

  handleValidationErrors
];

/**
 * Validation rules for health metrics
 */
const validateHealthMetrics = [
  body('height')
    .optional()
    .isFloat({ min: 30, max: 300 })
    .withMessage('Height must be between 30 and 300 cm'),

  body('weight')
    .optional()
    .isFloat({ min: 1, max: 500 })
    .withMessage('Weight must be between 1 and 500 kg'),

  handleValidationErrors
];

/**
 * Validation rules for allergy information
 */
const validateAllergyInfo = [
  body('allergen')
    .notEmpty()
    .withMessage('Allergen name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Allergen name must be between 1 and 100 characters'),

  body('severity')
    .notEmpty()
    .withMessage('Allergy severity is required')
    .isIn(['mild', 'moderate', 'severe'])
    .withMessage('Severity must be mild, moderate, or severe'),

  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),

  handleValidationErrors
];

/**
 * Validation rules for chronic condition
 */
const validateChronicCondition = [
  body('condition')
    .notEmpty()
    .withMessage('Condition name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Condition name must be between 2 and 100 characters'),

  body('diagnosedDate')
    .notEmpty()
    .withMessage('Diagnosed date is required')
    .isISO8601()
    .withMessage('Please provide a valid diagnosed date')
    .custom(value => {
      if (new Date(value) > new Date()) {
        throw new Error('Diagnosed date cannot be in the future');
      }
      return true;
    }),

  body('status')
    .optional()
    .isIn(['active', 'controlled', 'resolved'])
    .withMessage('Status must be active, controlled, or resolved'),

  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),

  handleValidationErrors
];

/**
 * Validation rules for patient preferences
 */
const validatePatientPreferences = [
  body('notifications.email')
    .optional()
    .isBoolean()
    .withMessage('Email notification preference must be true or false'),

  body('notifications.sms')
    .optional()
    .isBoolean()
    .withMessage('SMS notification preference must be true or false'),

  body('notifications.push')
    .optional()
    .isBoolean()
    .withMessage('Push notification preference must be true or false'),

  body('notifications.appointments')
    .optional()
    .isBoolean()
    .withMessage('Appointment notification preference must be true or false'),

  body('notifications.prescriptions')
    .optional()
    .isBoolean()
    .withMessage('Prescription notification preference must be true or false'),

  body('notifications.labResults')
    .optional()
    .isBoolean()
    .withMessage('Lab results notification preference must be true or false'),

  body('language')
    .optional()
    .isLength({ min: 2, max: 5 })
    .withMessage('Language code must be 2-5 characters'),

  body('timezone')
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage('Timezone must be between 3 and 50 characters'),

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
  validateResendVerificationCode,
  // New doctor profile management validations
  validateDoctorBasicUpdate,
  validateDoctorProfessionalUpdate,
  validateDoctorAvailability,
  validateQualification,
  validateHospitalAffiliation,
  validateNotificationPreferences,

  // Patient Profile Validations
  validatePatientBasicUpdate,
  validatePatientAddress,
  validateEmergencyContact,
  validateInsuranceInfo,
  validateHealthMetrics,
  validateAllergyInfo,
  validateChronicCondition,
  validatePatientPreferences
};
