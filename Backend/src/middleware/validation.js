/**
 * Input Validation Middleware
 * Validates request data for authentication endpoints
 */

const { body, query, validationResult } = require('express-validator');
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

/**
 * Validation rules for admin profile update
 */
const validateAdminProfileUpdate = [
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

  body('department')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Department must be between 2 and 100 characters'),

  body('responsibilities')
    .optional()
    .isArray()
    .withMessage('Responsibilities must be an array'),

  body('preferences.notifications.email')
    .optional()
    .isBoolean()
    .withMessage('Email notification preference must be true or false'),

  body('preferences.notifications.browser')
    .optional()
    .isBoolean()
    .withMessage('Browser notification preference must be true or false'),

  body('preferences.dashboard.defaultView')
    .optional()
    .isIn(['overview', 'pending-verifications', 'statistics', 'recent-activity'])
    .withMessage('Default view must be one of: overview, pending-verifications, statistics, recent-activity'),

  body('preferences.timezone')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Timezone must be a valid timezone string'),

  handleValidationErrors
];

/**
 * Validation rules for doctor verification
 */
const validateDoctorVerification = [
  body('action')
    .notEmpty()
    .withMessage('Action is required')
    .isIn(['approve', 'reject'])
    .withMessage('Action must be either approve or reject'),

  body('reason')
    .optional()
    .isLength({ min: 5, max: 500 })
    .withMessage('Reason must be between 5 and 500 characters'),

  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),

  handleValidationErrors
];

/**
 * Validation rules for user suspension
 */
const validateUserSuspension = [
  body('userType')
    .notEmpty()
    .withMessage('User type is required')
    .isIn(['doctor', 'patient'])
    .withMessage('User type must be either doctor or patient'),

  body('action')
    .notEmpty()
    .withMessage('Action is required')
    .isIn(['suspend', 'unsuspend'])
    .withMessage('Action must be either suspend or unsuspend'),

  body('reason')
    .optional()
    .isLength({ min: 5, max: 500 })
    .withMessage('Reason must be between 5 and 500 characters'),

  handleValidationErrors
];

/**
 * Validation rules for admin permission updates
 */
const validatePermissionUpdate = [
  body('role')
    .optional()
    .isIn(['super-admin', 'admin', 'moderator'])
    .withMessage('Role must be one of: super-admin, admin, moderator'),

  body('permissions')
    .optional()
    .isArray()
    .withMessage('Permissions must be an array'),

  body('permissions.*.resource')
    .optional()
    .isIn(['doctors', 'patients', 'appointments', 'prescriptions', 'medical-records', 'system', 'reports'])
    .withMessage('Invalid permission resource'),

  body('permissions.*.actions')
    .optional()
    .isArray()
    .withMessage('Permission actions must be an array'),

  body('permissions.*.actions.*')
    .optional()
    .isIn(['create', 'read', 'update', 'delete', 'approve', 'reject'])
    .withMessage('Invalid permission action'),

  handleValidationErrors
];

/**
 * Validation rules for data export requests
 */
const validateDataExport = [
  body('dataType')
    .notEmpty()
    .withMessage('Data type is required')
    .isIn(['doctors', 'patients', 'admins', 'activity-logs'])
    .withMessage('Data type must be one of: doctors, patients, admins, activity-logs'),

  body('format')
    .optional()
    .isIn(['json', 'csv', 'xlsx'])
    .withMessage('Format must be one of: json, csv, xlsx'),

  body('startDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Start date must be a valid ISO 8601 date'),

  body('endDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('End date must be a valid ISO 8601 date')
    .custom((endDate, { req }) => {
      if (req.body.startDate && endDate < req.body.startDate) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),

  handleValidationErrors
];

/**
 * Validation rules for admin search queries
 */
const validateAdminSearch = [
  body('query')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),

  body('filters.role')
    .optional()
    .isIn(['super-admin', 'admin', 'moderator'])
    .withMessage('Role filter must be valid'),

  body('filters.status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status filter must be active or inactive'),

  body('filters.department')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Department filter must be valid'),

  handleValidationErrors
];

/**
 * Validation rules for system maintenance actions
 */
const validateSystemMaintenance = [
  body('maintenanceType')
    .isIn(['scheduled', 'emergency', 'upgrade'])
    .withMessage('Maintenance type must be scheduled, emergency, or upgrade'),

  body('description')
    .notEmpty()
    .withMessage('Maintenance description is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),

  body('scheduledAt')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid scheduled date'),

  body('estimatedDuration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Estimated duration must be a positive number (in minutes)'),

  handleValidationErrors,
];

/**
 * Validate admin creation request (simplified)
 */
const validateAdminCreation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),

  body('role')
    .optional()
    .isIn(['admin', 'super-admin', 'moderator'])
    .withMessage('Role must be admin, super-admin, or moderator'),

  handleValidationErrors,
];

/**
 * Validation rules for appointment booking
 */
const validateAppointmentBooking = [
  body('doctorId')
    .notEmpty()
    .withMessage('Doctor ID is required')
    .isMongoId()
    .withMessage('Invalid doctor ID format'),

  body('appointmentDate')
    .notEmpty()
    .withMessage('Appointment date is required')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const appointmentDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (appointmentDate < today) {
        throw new Error('Appointment date cannot be in the past');
      }

      // Check if appointment is not more than 3 months in the future
      const maxFutureDate = new Date();
      maxFutureDate.setMonth(maxFutureDate.getMonth() + 3);

      if (appointmentDate > maxFutureDate) {
        throw new Error('Appointments can only be booked up to 3 months in advance');
      }

      return true;
    }),

  body('timeSlot')
    .notEmpty()
    .withMessage('Time slot is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid time format. Use HH:MM format'),

  body('chiefComplaint')
    .notEmpty()
    .withMessage('Chief complaint is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Chief complaint must be between 10 and 500 characters'),

  body('symptoms')
    .optional()
    .isArray()
    .withMessage('Symptoms must be an array'),

  body('symptoms.*')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Each symptom must be between 2 and 100 characters'),

  body('appointmentType')
    .optional()
    .isIn(['consultation', 'follow-up', 'checkup', 'emergency', 'procedure'])
    .withMessage('Invalid appointment type'),

  body('mode')
    .optional()
    .isIn(['in-person', 'telemedicine', 'video-call', 'phone-call'])
    .withMessage('Invalid appointment mode'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority level'),

  body('isEmergency')
    .optional()
    .isBoolean()
    .withMessage('isEmergency must be a boolean value'),

  handleValidationErrors
];

/**
 * Validation rules for appointment status updates
 */
const validateAppointmentStatus = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['requested', 'confirmed', 'completed', 'cancelled', 'no-show', 'rescheduled'])
    .withMessage('Invalid appointment status'),

  body('reason')
    .optional()
    .isLength({ min: 5, max: 500 })
    .withMessage('Reason must be between 5 and 500 characters'),

  body('doctorNotes')
    .optional()
    .isLength({ min: 5, max: 2000 })
    .withMessage('Doctor notes must be between 5 and 2000 characters'),

  handleValidationErrors
];

/**
 * Validation rules for appointment rescheduling
 */
const validateAppointmentReschedule = [
  body('appointmentDate')
    .notEmpty()
    .withMessage('New appointment date is required')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const newDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (newDate < today) {
        throw new Error('New appointment date cannot be in the past');
      }

      return true;
    }),

  body('timeSlot')
    .notEmpty()
    .withMessage('New time slot is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid time format. Use HH:MM format'),

  body('reason')
    .optional()
    .isLength({ min: 5, max: 500 })
    .withMessage('Reason must be between 5 and 500 characters'),

  handleValidationErrors
];

/**
 * Validation rules for medical notes
 */
const validateMedicalNotes = [
  body('doctorNotes')
    .optional()
    .isLength({ min: 5, max: 2000 })
    .withMessage('Doctor notes must be between 5 and 2000 characters'),

  body('patientNotes')
    .optional()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Patient notes must be between 5 and 1000 characters'),

  body('treatmentPlan')
    .optional()
    .isLength({ min: 10, max: 1500 })
    .withMessage('Treatment plan must be between 10 and 1500 characters'),

  body('followUpInstructions')
    .optional()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Follow-up instructions must be between 5 and 1000 characters'),

  handleValidationErrors
];

/**
 * Validation rules for appointment feedback
 */
const validateAppointmentFeedback = [
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),

  body('review')
    .optional()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Review must be between 10 and 1000 characters'),

  body('serviceRating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Service rating must be between 1 and 5'),

  body('recommendToOthers')
    .optional()
    .isBoolean()
    .withMessage('Recommend to others must be a boolean value'),

  handleValidationErrors
];

/**
 * Validation rules for appointment query parameters
 */
const validateAppointmentQuery = [
  query('status')
    .optional()
    .isIn(['requested', 'confirmed', 'completed', 'cancelled', 'no-show', 'rescheduled'])
    .withMessage('Invalid status filter'),

  query('upcoming')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('Upcoming must be true or false'),

  query('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  handleValidationErrors
];

/**
 * Validation rules for prescription creation
 */
const validatePrescriptionCreate = [
  body('patientId')
    .notEmpty()
    .withMessage('Patient ID is required')
    .isMongoId()
    .withMessage('Patient ID must be a valid MongoDB ObjectId'),

  body('appointmentId')
    .optional()
    .isMongoId()
    .withMessage('Appointment ID must be a valid MongoDB ObjectId'),

  body('diagnosis.primary')
    .notEmpty()
    .withMessage('Primary diagnosis is required')
    .isLength({ min: 3, max: 500 })
    .withMessage('Primary diagnosis must be between 3 and 500 characters'),

  body('diagnosis.secondary')
    .optional()
    .isArray()
    .withMessage('Secondary diagnosis must be an array'),

  body('medicines')
    .optional()
    .isArray()
    .withMessage('Medicines must be an array'),

  body('medicines.*.name')
    .if(body('medicines').exists())
    .notEmpty()
    .withMessage('Medicine name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Medicine name must be between 2 and 200 characters'),

  body('medicines.*.dosage')
    .if(body('medicines').exists())
    .notEmpty()
    .withMessage('Medicine dosage is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Medicine dosage must be between 2 and 50 characters'),

  body('medicines.*.frequency')
    .if(body('medicines').exists())
    .notEmpty()
    .withMessage('Medicine frequency is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Medicine frequency must be between 2 and 100 characters'),

  body('medicines.*.duration')
    .if(body('medicines').exists())
    .notEmpty()
    .withMessage('Medicine duration is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Medicine duration must be between 2 and 50 characters'),

  body('medicines.*.quantity')
    .if(body('medicines').exists())
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Medicine quantity must be between 1 and 1000'),

  body('medicines.*.refills')
    .if(body('medicines').exists())
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Medicine refills must be between 0 and 10'),

  body('medicalTests')
    .optional()
    .isArray()
    .withMessage('Medical tests must be an array'),

  body('medicalTests.*.name')
    .if(body('medicalTests').exists())
    .notEmpty()
    .withMessage('Test name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Test name must be between 2 and 200 characters'),

  body('medicalTests.*.urgency')
    .if(body('medicalTests').exists())
    .optional()
    .isIn(['immediate', 'within-24-hours', 'within-week', 'routine'])
    .withMessage('Test urgency must be: immediate, within-24-hours, within-week, or routine'),

  body('medicalTests.*.scheduledFor')
    .if(body('medicalTests').exists())
    .optional()
    .isISO8601()
    .withMessage('Scheduled date must be a valid ISO 8601 date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Scheduled date must be in the future');
      }
      return true;
    }),

  body('vitalSigns.bloodPressure.systolic')
    .optional()
    .isInt({ min: 70, max: 250 })
    .withMessage('Systolic blood pressure must be between 70 and 250'),

  body('vitalSigns.bloodPressure.diastolic')
    .optional()
    .isInt({ min: 40, max: 150 })
    .withMessage('Diastolic blood pressure must be between 40 and 150'),

  body('vitalSigns.heartRate')
    .optional()
    .isInt({ min: 40, max: 200 })
    .withMessage('Heart rate must be between 40 and 200 BPM'),

  body('vitalSigns.temperature')
    .optional()
    .isFloat({ min: 95, max: 110 })
    .withMessage('Temperature must be between 95°F and 110°F'),

  body('vitalSigns.weight')
    .optional()
    .isFloat({ min: 1, max: 500 })
    .withMessage('Weight must be between 1 and 500 kg'),

  body('vitalSigns.height')
    .optional()
    .isFloat({ min: 30, max: 250 })
    .withMessage('Height must be between 30 and 250 cm'),

  body('followUp.required')
    .optional()
    .isBoolean()
    .withMessage('Follow-up required must be a boolean'),

  body('followUp.date')
    .if(body('followUp.required').equals(true))
    .notEmpty()
    .withMessage('Follow-up date is required when follow-up is marked as required')
    .isISO8601()
    .withMessage('Follow-up date must be a valid ISO 8601 date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Follow-up date must be in the future');
      }
      return true;
    }),

  body('followUp.urgency')
    .optional()
    .isIn(['routine', 'urgent', 'emergency'])
    .withMessage('Follow-up urgency must be: routine, urgent, or emergency'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'emergency'])
    .withMessage('Priority must be: low, medium, high, or emergency'),

  body('validUntil')
    .optional()
    .isISO8601()
    .withMessage('Valid until date must be a valid ISO 8601 date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Valid until date must be in the future');
      }
      return true;
    }),

  body('isEmergency')
    .optional()
    .isBoolean()
    .withMessage('Is emergency must be a boolean'),

  handleValidationErrors,
];

/**
 * Validation rules for prescription update
 */
const validatePrescriptionUpdate = [
  body('diagnosis.primary')
    .optional()
    .isLength({ min: 3, max: 500 })
    .withMessage('Primary diagnosis must be between 3 and 500 characters'),

  body('diagnosis.secondary')
    .optional()
    .isArray()
    .withMessage('Secondary diagnosis must be an array'),

  body('medicines')
    .optional()
    .isArray()
    .withMessage('Medicines must be an array'),

  body('medicines.*.name')
    .if(body('medicines').exists())
    .notEmpty()
    .withMessage('Medicine name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Medicine name must be between 2 and 200 characters'),

  body('medicines.*.dosage')
    .if(body('medicines').exists())
    .notEmpty()
    .withMessage('Medicine dosage is required'),

  body('medicines.*.frequency')
    .if(body('medicines').exists())
    .notEmpty()
    .withMessage('Medicine frequency is required'),

  body('medicines.*.duration')
    .if(body('medicines').exists())
    .notEmpty()
    .withMessage('Medicine duration is required'),

  body('medicalTests')
    .optional()
    .isArray()
    .withMessage('Medical tests must be an array'),

  body('medicalTests.*.name')
    .if(body('medicalTests').exists())
    .notEmpty()
    .withMessage('Test name is required'),

  body('medicalTests.*.urgency')
    .if(body('medicalTests').exists())
    .optional()
    .isIn(['immediate', 'within-24-hours', 'within-week', 'routine'])
    .withMessage('Test urgency must be valid'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'emergency'])
    .withMessage('Priority must be: low, medium, high, or emergency'),

  body('validUntil')
    .optional()
    .isISO8601()
    .withMessage('Valid until date must be a valid ISO 8601 date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Valid until date must be in the future');
      }
      return true;
    }),

  handleValidationErrors,
];

/**
 * Validation rules for adding medicine to prescription
 */
const validateMedicine = [
  body('name')
    .notEmpty()
    .withMessage('Medicine name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Medicine name must be between 2 and 200 characters'),

  body('genericName')
    .optional()
    .isLength({ min: 2, max: 200 })
    .withMessage('Generic name must be between 2 and 200 characters'),

  body('dosage')
    .notEmpty()
    .withMessage('Dosage is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Dosage must be between 1 and 50 characters'),

  body('frequency')
    .notEmpty()
    .withMessage('Frequency is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Frequency must be between 2 and 100 characters'),

  body('duration')
    .notEmpty()
    .withMessage('Duration is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Duration must be between 2 and 50 characters'),

  body('instructions')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Instructions must not exceed 500 characters'),

  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes must not exceed 1000 characters'),

  body('quantity')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Quantity must be between 1 and 1000'),

  body('refills')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Refills must be between 0 and 10'),

  handleValidationErrors,
];

/**
 * Validation rules for adding medical test to prescription
 */
const validateMedicalTest = [
  body('name')
    .notEmpty()
    .withMessage('Test name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Test name must be between 2 and 200 characters'),

  body('testCode')
    .optional()
    .isLength({ min: 2, max: 20 })
    .withMessage('Test code must be between 2 and 20 characters'),

  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),

  body('urgency')
    .optional()
    .isIn(['immediate', 'within-24-hours', 'within-week', 'routine'])
    .withMessage('Urgency must be: immediate, within-24-hours, within-week, or routine'),

  body('scheduledFor')
    .optional()
    .isISO8601()
    .withMessage('Scheduled date must be a valid ISO 8601 date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Scheduled date must be in the future');
      }
      return true;
    }),

  body('instructions')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Instructions must not exceed 1000 characters'),

  body('fastingRequired')
    .optional()
    .isBoolean()
    .withMessage('Fasting required must be a boolean'),

  body('preparationInstructions')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Preparation instructions must not exceed 1000 characters'),

  handleValidationErrors,
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
  validatePatientPreferences,

  // Admin validations
  validateAdminProfileUpdate,
  validateDoctorVerification,
  validateUserSuspension,
  validatePermissionUpdate,
  validateDataExport,
  validateAdminSearch,
  validateSystemMaintenance,
  validateAdminCreation, // New validation

  // Appointment validations
  validateAppointmentBooking,
  validateAppointmentStatus,
  validateAppointmentReschedule,
  validateMedicalNotes,
  validateAppointmentFeedback,
  validateAppointmentQuery,

  // Prescription validations
  validatePrescriptionCreate,
  validatePrescriptionUpdate,
  validateMedicine,
  validateMedicalTest
};
