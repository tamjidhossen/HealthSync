/**
 * Authentication Controller
 * Handles authentication-related HTTP requests
 */

const { catchAsync, AppError } = require('../middleware/errorHandler');
const authService = require('../services/authService');
const { getCookieOptions } = require('../config/jwt');
const logger = require('../utils/logger');
const generateId = require('../utils/generateId');

/**
 * Register a new doctor
 */
const registerDoctor = catchAsync(async (req, res, next) => {
  const { 
    fullName, 
    email, 
    phone, 
    password, 
    specialization, 
    licenseNumber,
    qualifications,
    hospitalAffiliations,
    experienceYears
  } = req.body;

  // Validate required fields
  if (!fullName || !email || !phone || !password || !specialization || !licenseNumber) {
    return next(new AppError('Please provide all required fields', 400));
  }
  doctorId = await generateId.generateUniqueId("DOC");
  console.log(doctorId);
  // Register doctor
  const result = await authService.registerDoctor({
    doctorId,
    fullName,
    email,
    phone,
    password,
    specialization,
    licenseNumber,
    qualifications,
    hospitalAffiliations,
    experienceYears
  });

  // Log the registration
  logger.info(`Doctor registration attempt: ${email}`);

  res.status(201).json({
    status: 'success',
    message: result.message,
    data: result.data
  });
});

/**
 * Register a new patient
 */
const registerPatient = catchAsync(async (req, res, next) => {
  const { 
    fullName, 
    email, 
    phone, 
    password, 
    dateOfBirth, 
    gender,
    bloodGroup,
    emergencyContact
  } = req.body;

  // Validate required fields
  if (!fullName || !phone || !password || !dateOfBirth || !gender) {
    return next(new AppError('Please provide all required fields', 400));
  }

  // Register patient
  const result = await authService.registerPatient({
    fullName,
    email,
    phone,
    password,
    dateOfBirth,
    gender,
    bloodGroup,
    emergencyContact
  });

  // Log the registration
  logger.info(`Patient registration attempt: ${phone}`);

  res.status(201).json({
    status: 'success',
    message: result.message,
    data: result.data
  });
});

/**
 * Login user (doctor, patient, or admin)
 */
const login = catchAsync(async (req, res, next) => {
  const { email, password, userType } = req.body;

  // Validate input
  if (!email || !password || !userType) {
    return next(new AppError('Please provide email, password, and user type', 400));
  }

  if (!['doctor', 'patient', 'admin'].includes(userType)) {
    return next(new AppError('Invalid user type. Must be: doctor, patient, or admin', 400));
  }

  // Login user
  const result = await authService.login(email, password, userType);

  // Set JWT cookie
  const cookieOptions = getCookieOptions();
  res.cookie('jwt', result.data.tokens.accessToken, cookieOptions);

  // Log successful login
  logger.info(`${userType} login successful: ${email} from IP: ${req.ip}`);

  res.status(200).json({
    status: 'success',
    message: result.message,
    data: {
      user: result.data.user,
      tokens: result.data.tokens
    }
  });
});

/**
 * Logout user
 */
const logout = catchAsync(async (req, res, next) => {
  // Clear JWT cookie
  res.cookie('jwt', '', {
    expires: new Date(Date.now() + 1 * 1000), // Expire in 1 second
    httpOnly: true
  });

  // Log logout
  if (req.user) {
    logger.info(`User logout: ${req.user.email}`);
  }

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

/**
 * Verify email address
 */
const verifyEmail = catchAsync(async (req, res, next) => {
  const { email, code, userType } = req.body;

  // Validate input
  if (!email || !code || !userType) {
    return next(new AppError('Please provide email, verification code, and user type', 400));
  }

  if (!['doctor', 'patient', 'admin'].includes(userType)) {
    return next(new AppError('Invalid user type', 400));
  }

  // Verify email
  const result = await authService.verifyEmail(email, code, userType);

  // Log email verification
  logger.info(`Email verification successful: ${email} (${userType})`);

  res.status(200).json({
    status: 'success',
    message: result.message
  });
});

/**
 * Resend email verification code
 */
const resendVerificationCode = catchAsync(async (req, res, next) => {
  const { email, userType } = req.body;

  // Validate input
  if (!email || !userType) {
    return next(new AppError('Please provide email and user type', 400));
  }

  if (!['doctor', 'patient', 'admin'].includes(userType)) {
    return next(new AppError('Invalid user type', 400));
  }

  // Resend verification code
  const result = await authService.resendVerificationCode(email, userType);

  res.status(200).json({
    status: 'success',
    message: result.message
  });
});

/**
 * Request password reset
 */
const forgotPassword = catchAsync(async (req, res, next) => {
  const { email, userType } = req.body;

  // Validate input
  if (!email || !userType) {
    return next(new AppError('Please provide email and user type', 400));
  }

  if (!['doctor', 'patient', 'admin'].includes(userType)) {
    return next(new AppError('Invalid user type', 400));
  }

  // Request password reset
  const result = await authService.requestPasswordReset(email, userType);

  res.status(200).json({
    status: 'success',
    message: result.message
  });
});

/**
 * Reset password with token
 */
const resetPassword = catchAsync(async (req, res, next) => {
  const { token, newPassword, userType } = req.body;

  // Validate input
  if (!token || !newPassword || !userType) {
    return next(new AppError('Please provide reset token, new password, and user type', 400));
  }

  if (newPassword.length < 8) {
    return next(new AppError('Password must be at least 8 characters long', 400));
  }

  if (!['doctor', 'patient', 'admin'].includes(userType)) {
    return next(new AppError('Invalid user type', 400));
  }

  // Reset password
  const result = await authService.resetPassword(token, newPassword, userType);

  // Log password reset
  logger.info(`Password reset successful for ${userType} with token: ${token.substring(0, 10)}...`);

  res.status(200).json({
    status: 'success',
    message: result.message
  });
});

/**
 * Get current user profile
 */
const getMe = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('User not found. Please log in again.', 401));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
      role: req.userRole
    }
  });
});

/**
 * Update current user password
 */
const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // Validate input
  if (!currentPassword || !newPassword) {
    return next(new AppError('Please provide current password and new password', 400));
  }

  if (newPassword.length < 8) {
    return next(new AppError('New password must be at least 8 characters long', 400));
  }

  // Get user with password
  const user = req.user;
  
  // Check current password
  if (!(await user.checkPassword(currentPassword))) {
    return next(new AppError('Current password is incorrect', 401));
  }

  // Update password
  user.passwordHash = newPassword;
  await user.save();

  // Log password update
  logger.info(`Password updated for ${req.userRole}: ${user.email}`);

  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully'
  });
});

/**
 * Check authentication status
 */
const checkAuth = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    authenticated: !!req.user,
    user: req.user ? {
      id: req.user._id,
      email: req.user.email,
      fullName: req.user.fullName,
      role: req.userRole,
      isEmailVerified: req.user.isEmailVerified,
      status: req.user.status || 'active'
    } : null
  });
});

module.exports = {
  registerDoctor,
  registerPatient,
  login,
  logout,
  verifyEmail,
  resendVerificationCode,
  forgotPassword,
  resetPassword,
  getMe,
  updatePassword,
  checkAuth
};
