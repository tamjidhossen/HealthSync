/**
 * Authentication Middleware
 * JWT authentication and authorization middleware for HealthSync
 */

const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { AppError, catchAsync } = require('./errorHandler');
const { extractTokenFromRequest, verifyToken } = require('../config/jwt');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Admin = require('../models/Admin');
const logger = require('../utils/logger');

/**
 * Protect routes - Verify JWT token and authenticate user
 */
const authenticate = catchAsync(async (req, res, next) => {
  // 1) Get token from request
  const token = extractTokenFromRequest(req);

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2) Verify token
  let decoded;
  try {
    decoded = await verifyToken(token);
  } catch (error) {
    return next(error);
  }

  // 3) Check if user still exists based on role
  let currentUser;
  const { role, id } = decoded;

  try {
    switch (role) {
      case 'doctor':
        currentUser = await Doctor.findById(id).select('+passwordHash');
        break;
      case 'patient':
        currentUser = await Patient.findById(id).select('+passwordHash');
        break;
      case 'admin':
        currentUser = await Admin.findById(id).select('+passwordHash');
        break;
      default:
        return next(new AppError('Invalid user role in token', 401));
    }

    if (!currentUser) {
      return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }
  } catch (error) {
    logger.error('User lookup failed during authentication:', error);
    return next(new AppError('Authentication failed. Please try again.', 401));
  }

  // 4) Check if user is active
  if (!currentUser.isActive) {
    return next(new AppError('Your account has been deactivated. Please contact support.', 401));
  }

  // 5) Check if password changed after the token was issued
  if (currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Please log in again.', 401));
  }

  // 6) Additional checks based on user type
  if (role === 'doctor') {
    if (!currentUser.isEmailVerified) {
      return next(new AppError('Please verify your email address first.', 401));
    }
    if (currentUser.status === 'suspended') {
      return next(new AppError('Your account has been suspended. Please contact admin.', 401));
    }
  }

  if (role === 'patient') {
    if (!currentUser.isEmailVerified && currentUser.email) {
      return next(new AppError('Please verify your email address first.', 401));
    }
  }

  if (role === 'admin' && currentUser.isAccountLocked) {
    return next(new AppError('Your account is temporarily locked. Please try again later.', 401));
  }

  // 7) Grant access to protected route
  req.user = currentUser;
  req.userRole = role;
  req.token = token;

  // 8) Update last login time
  if (currentUser.lastLoginAt) {
    const timeSinceLastUpdate = Date.now() - new Date(currentUser.lastLoginAt).getTime();
    // Only update if it's been more than 5 minutes since last update
    if (timeSinceLastUpdate > 5 * 60 * 1000) {
      currentUser.lastLoginAt = new Date();
      await currentUser.save({ validateBeforeSave: false });
    }
  }

  next();
});

/**
 * Authorization middleware - Check if user has required roles
 * @param {...string} roles - Required roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.userRole) {
      return next(new AppError('You must be authenticated to access this resource.', 401));
    }
    console.log();
    console.log(req.userRole);
    console.log(roles.includes(req.userRole));
    if (!roles.includes(req.userRole)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }

    next();
  };
};

/**
 * Optional authentication - Don't require authentication but set user if token is present
 */
const optionalAuth = catchAsync(async (req, res, next) => {
  const token = extractTokenFromRequest(req);

  if (!token) {
    return next();
  }

  try {
    const decoded = await verifyToken(token);
    const { role, id } = decoded;

    let currentUser;
    switch (role) {
      case 'doctor':
        currentUser = await Doctor.findById(id);
        break;
      case 'patient':
        currentUser = await Patient.findById(id);
        break;
      case 'admin':
        currentUser = await Admin.findById(id);
        break;
    }

    if (currentUser && currentUser.isActive) {
      req.user = currentUser;
      req.userRole = role;
      req.token = token;
    }
  } catch (error) {
    // If token is invalid, continue without authentication
    logger.warn('Invalid token in optional auth:', error.message);
  }

  next();
});

/**
 * Check if user is verified (for doctors and patients)
 */
const requireVerification = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('You must be authenticated first.', 401));
  }

  if (req.userRole === 'doctor') {
    if (!req.user.isVerified || req.user.status !== 'approved') {
      return next(new AppError('Your account must be verified by an admin to access this resource.', 403));
    }
  }

  if (req.userRole === 'patient') {
    if (!req.user.isEmailVerified && req.user.email) {
      return next(new AppError('Please verify your email address first.', 403));
    }
  }

  next();
};

/**
 * Check admin permissions for specific resources
 * @param {string} resource - Resource name
 * @param {string} action - Action name
 */
const requireAdminPermission = (resource, action) => {
  return (req, res, next) => {
    if (!req.user || req.userRole !== 'admin') {
      return next(new AppError('Admin access required.', 403));
    }

    if (!req.user.hasPermission(resource, action)) {
      return next(new AppError(`You don't have permission to ${action} ${resource}.`, 403));
    }

    next();
  };
};

/**
 * Rate limiting per user
 * @param {number} maxRequests - Maximum requests per window
 * @param {number} windowMs - Time window in milliseconds
 */
const perUserRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const userRequestCounts = new Map();

  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user._id.toString();
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old entries
    for (const [key, data] of userRequestCounts.entries()) {
      if (data.requests.every(time => time < windowStart)) {
        userRequestCounts.delete(key);
      }
    }

    // Get user's request data
    let userData = userRequestCounts.get(userId);
    if (!userData) {
      userData = { requests: [] };
      userRequestCounts.set(userId, userData);
    }

    // Remove old requests
    userData.requests = userData.requests.filter(time => time >= windowStart);

    // Check rate limit
    if (userData.requests.length >= maxRequests) {
      return next(new AppError('Too many requests. Please try again later.', 429));
    }

    // Add current request
    userData.requests.push(now);

    next();
  };
};

/**
 * Middleware to log user activities
 */
const logActivity = (action, resource) => {
  return (req, res, next) => {
    // Store activity info for later logging
    req.activityLog = {
      action,
      resource,
      userId: req.user?._id,
      userRole: req.userRole,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date(),
    };

    next();
  };
};

/**
 * Middleware to check if user can access specific patient/doctor data
 */
const checkOwnership = (paramName = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    const resourceId = req.params[paramName];
    const userId = req.user._id.toString();

    // Admin can access all resources
    if (req.userRole === 'admin') {
      return next();
    }

    // Users can only access their own data
    if (resourceId !== userId) {
      // For doctors and patients, check custom ID fields too
      if (req.userRole === 'doctor' && resourceId === req.user.doctorId) {
        return next();
      }
      if (req.userRole === 'patient' && resourceId === req.user.patientId) {
        return next();
      }

      return next(new AppError('You can only access your own data.', 403));
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
  requireVerification,
  requireAdminPermission,
  perUserRateLimit,
  logActivity,
  checkOwnership,
};
