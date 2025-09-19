/**
 * Application Constants
 * Centralized constants for the HealthSync application
 */

// User Roles
const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
};

// Account Status
const ACCOUNT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
  ACTIVE: 'active',
};

// Appointment Status
const APPOINTMENT_STATUS = {
  REQUESTED: 'requested',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no-show',
  RESCHEDULED: 'rescheduled',
};

// Appointment Mode
const APPOINTMENT_MODE = {
  IN_PERSON: 'in-person',
  TELEMEDICINE: 'telemedicine',
  VIDEO_CALL: 'video-call',
  PHONE_CALL: 'phone-call',
};

// Medical Test Status
const TEST_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
};

// Test Urgency Levels
const TEST_URGENCY = {
  IMMEDIATE: 'immediate',
  WITHIN_24_HOURS: 'within-24-hours',
  WITHIN_A_WEEK: 'within-a-week',
  ROUTINE: 'routine',
};

// Gender Options
const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
  PREFER_NOT_TO_SAY: 'prefer-not-to-say',
};

// Blood Groups
const BLOOD_GROUPS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

// Medical Specializations
const SPECIALIZATIONS = [
  'General Medicine',
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Neurology',
  'Oncology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Surgery',
  'Urology',
  'Gynecology',
  'Ophthalmology',
  'ENT',
  'Anesthesiology',
  'Emergency Medicine',
  'Family Medicine',
  'N/A'
];

// Days of Week
const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

// File Types
const ALLOWED_FILE_TYPES = {
  IMAGES: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  DOCUMENTS: ['pdf', 'doc', 'docx', 'txt'],
  MEDICAL_REPORTS: ['pdf', 'jpg', 'jpeg', 'png', 'dcm'],
};

// Error Messages
const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You are not authorized to access this resource',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  EMAIL_NOT_VERIFIED: 'Please verify your email address',
  ACCOUNT_SUSPENDED: 'Your account has been suspended',
  ACCOUNT_PENDING: 'Your account is pending verification',
  INVALID_TOKEN: 'Invalid or expired token',
  PERMISSION_DENIED: 'You do not have permission to perform this action',
  RESOURCE_NOT_FOUND: 'Requested resource not found',
  VALIDATION_ERROR: 'Please provide valid input data',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit',
  INVALID_FILE_TYPE: 'Invalid file type',
  DUPLICATE_ENTRY: 'This entry already exists',
  SERVER_ERROR: 'Internal server error. Please try again later',
};

// Success Messages
const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: 'Registration successful. Please verify your email',
  LOGIN_SUCCESS: 'Login successful',
  EMAIL_VERIFIED: 'Email verified successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  APPOINTMENT_BOOKED: 'Appointment booked successfully',
  APPOINTMENT_CANCELLED: 'Appointment cancelled successfully',
  PRESCRIPTION_CREATED: 'Prescription created successfully',
  PASSWORD_RESET: 'Password reset successfully',
  VERIFICATION_EMAIL_SENT: 'Verification email sent successfully',
};

// Pagination
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Rate Limiting
const RATE_LIMITS = {
  GENERAL: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // requests per window
  },
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // login attempts per window
  },
  FILE_UPLOAD: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // uploads per hour
  },
};

// Email Templates
const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  EMAIL_VERIFICATION: 'email-verification',
  PASSWORD_RESET: 'password-reset',
  APPOINTMENT_CONFIRMATION: 'appointment-confirmation',
  APPOINTMENT_REMINDER: 'appointment-reminder',
  ACCOUNT_VERIFIED: 'account-verified',
  PRESCRIPTION_READY: 'prescription-ready',
};

// AI Assistant
const AI_CONSTANTS = {
  MAX_CONTEXT_LENGTH: 4000,
  DEFAULT_TEMPERATURE: 0.7,
  MAX_TOKENS: 500,
  MEDICAL_DISCLAIMER: 'This is an AI assistant and should not replace professional medical advice.',
};

// Time Slots (for appointments)
const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
];

// ID Prefixes
const ID_PREFIXES = {
  DOCTOR: 'DOC',
  PATIENT: 'PAT',
  ADMIN: 'ADM',
  APPOINTMENT: 'APPT',
  PRESCRIPTION: 'PRES',
  MEDICAL_RECORD: 'MR',
  CHAT_SESSION: 'CHAT',
};

module.exports = {
  USER_ROLES,
  ACCOUNT_STATUS,
  APPOINTMENT_STATUS,
  APPOINTMENT_MODE,
  TEST_STATUS,
  TEST_URGENCY,
  GENDER,
  BLOOD_GROUPS,
  SPECIALIZATIONS,
  DAYS_OF_WEEK,
  ALLOWED_FILE_TYPES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PAGINATION,
  RATE_LIMITS,
  EMAIL_TEMPLATES,
  AI_CONSTANTS,
  TIME_SLOTS,
  ID_PREFIXES,
};
