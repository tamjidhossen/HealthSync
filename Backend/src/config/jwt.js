/**
 * JWT Configuration
 * JWT token handling utilities for HealthSync
 */

const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { AppError } = require('../middleware/errorHandler');

/**
 * Generate JWT token
 * @param {string|object} payload - Token payload (usually user ID)
 * @param {string} secret - JWT secret (optional, uses env variable if not provided)
 * @param {object} options - JWT options (optional)
 * @returns {string} - Generated JWT token
 */
const generateToken = (payload, secret = null, options = {}) => {
  const jwtSecret = secret || process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  const defaultOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    issuer: 'healthsync-api',
    audience: 'healthsync-users',
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  return jwt.sign(payload, jwtSecret, mergedOptions);
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @param {string} secret - JWT secret (optional, uses env variable if not provided)
 * @returns {Promise<object>} - Decoded token payload
 */
const verifyToken = async (token, secret = null) => {
  const jwtSecret = secret || process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  try {
    const decoded = await promisify(jwt.verify)(token, jwtSecret);
    return decoded;
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token. Please log in again!', 401);
    } else if (error.name === 'TokenExpiredError') {
      throw new AppError('Your token has expired! Please log in again.', 401);
    } else {
      throw new AppError('Token verification failed', 401);
    }
  }
};

/**
 * Decode JWT token without verification
 * @param {string} token - JWT token to decode
 * @returns {object|null} - Decoded token payload or null if invalid
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

/**
 * Generate access and refresh tokens
 * @param {object} user - User object
 * @returns {object} - Object containing access and refresh tokens
 */
const generateTokenPair = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.constructor.modelName.toLowerCase(), // 'doctor', 'patient', 'admin'
  };
  
  const accessToken = generateToken(payload, null, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  });
  
  const refreshToken = generateToken({ id: user._id }, null, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
  
  return {
    accessToken,
    refreshToken,
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  };
};

/**
 * Extract token from request headers
 * @param {object} req - Express request object
 * @returns {string|null} - Extracted token or null if not found
 */
const extractTokenFromRequest = (req) => {
  let token = null;
  
  // Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  // Check cookies as fallback
  if (!token && req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  
  // Check query parameter as fallback (not recommended for production)
  if (!token && req.query && req.query.token) {
    token = req.query.token;
  }
  
  return token;
};

/**
 * Generate email verification token
 * @param {string} email - User email
 * @param {string} userId - User ID
 * @returns {string} - Email verification token
 */
const generateEmailVerificationToken = (email, userId) => {
  const payload = {
    email,
    userId,
    type: 'email-verification',
  };
  
  return generateToken(payload, null, {
    expiresIn: '1h', // Email verification expires in 1 hour
  });
};

/**
 * Generate password reset token
 * @param {string} email - User email
 * @param {string} userId - User ID
 * @returns {string} - Password reset token
 */
const generatePasswordResetToken = (email, userId) => {
  const payload = {
    email,
    userId,
    type: 'password-reset',
  };
  
  return generateToken(payload, null, {
    expiresIn: '10m', // Password reset expires in 10 minutes
  });
};

/**
 * Verify special tokens (email verification, password reset)
 * @param {string} token - Token to verify
 * @param {string} expectedType - Expected token type
 * @returns {Promise<object>} - Decoded token payload
 */
const verifySpecialToken = async (token, expectedType) => {
  try {
    const decoded = await verifyToken(token);
    
    if (decoded.type !== expectedType) {
      throw new AppError('Invalid token type', 400);
    }
    
    return decoded;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    throw new AppError('Invalid or expired token', 400);
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if token is expired
 */
const isTokenExpired = (token) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} - Expiration date or null if invalid
 */
const getTokenExpiration = (token) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return null;
    
    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
};

/**
 * Generate API key for external integrations
 * @param {string} userId - User ID
 * @param {string} purpose - API key purpose
 * @returns {string} - API key
 */
const generateApiKey = (userId, purpose = 'api-access') => {
  const crypto = require('crypto');
  const timestamp = Date.now();
  const randomPart = crypto.randomBytes(16).toString('hex');
  
  return `hsk_${Buffer.from(`${userId}:${purpose}:${timestamp}`).toString('base64')}_${randomPart}`;
};

/**
 * Validate API key format
 * @param {string} apiKey - API key to validate
 * @returns {boolean} - True if format is valid
 */
const validateApiKeyFormat = (apiKey) => {
  if (!apiKey || typeof apiKey !== 'string') return false;
  
  const pattern = /^hsk_[A-Za-z0-9+/]+=*_[a-f0-9]{32}$/;
  return pattern.test(apiKey);
};

/**
 * Cookie options for JWT
 */
const getCookieOptions = () => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '7') * 24 * 60 * 60 * 1000, // Convert days to milliseconds
  };
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
  generateTokenPair,
  extractTokenFromRequest,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  verifySpecialToken,
  isTokenExpired,
  getTokenExpiration,
  generateApiKey,
  validateApiKeyFormat,
  getCookieOptions,
};
