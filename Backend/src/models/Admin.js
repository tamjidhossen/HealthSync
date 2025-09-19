/**
 * Admin Model
 * MongoDB schema for admin users in HealthSync
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      required: true,
      unique: true,
      match: /^ADM-\d{4}$/, // Format: ADM-1001
    },

    // Basic Information
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxLength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[0-9]{10,15}$/, 'Please provide a valid phone number'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't include password in queries by default
    },

    // Admin Role and Permissions
    role: {
      type: String,
      enum: {
        values: ['super-admin', 'admin', 'moderator'],
        message: 'Please select a valid admin role',
      },
      default: 'admin',
    },
    permissions: [{
      resource: {
        type: String,
        required: true,
        enum: ['doctors', 'patients', 'appointments', 'prescriptions', 'medical-records', 'system', 'reports'],
      },
      actions: [{
        type: String,
        enum: ['create', 'read', 'update', 'delete', 'approve', 'reject'],
      }],
    }],

    // Department and Responsibilities
    department: {
      type: String,
      trim: true,
      default: 'Healthcare Administration',
    },
    responsibilities: [String],

    // Verification & Activity Logs
    verifiedDoctors: [
      {
        doctor: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Doctor',
          required: true,
        },
        action: { 
          type: String, 
          enum: ['approved', 'rejected', 'suspended', 'reactivated'],
          required: true,
        },
        reason: {
          type: String,
          trim: true,
        },
        notes: {
          type: String,
          trim: true,
        },
        timestamp: { 
          type: Date, 
          default: Date.now,
        },
      },
    ],

    verifiedPatients: [
      {
        patient: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Patient',
          required: true,
        },
        action: { 
          type: String, 
          enum: ['approved', 'rejected', 'suspended', 'reactivated'],
          required: true,
        },
        reason: {
          type: String,
          trim: true,
        },
        notes: {
          type: String,
          trim: true,
        },
        timestamp: { 
          type: Date, 
          default: Date.now,
        },
      },
    ],

    // System Actions Log
    systemActions: [
      {
        action: {
          type: String,
          required: true,
          enum: [
            'user-verification',
            'account-suspension',
            'data-export',
            'system-maintenance',
            'security-alert',
            'backup-created',
            'settings-updated',
          ],
        },
        target: {
          targetType: {
            type: String,
            enum: ['doctor', 'patient', 'system', 'report'],
          },
          targetId: mongoose.Schema.Types.Mixed,
        },
        description: {
          type: String,
          required: true,
        },
        metadata: mongoose.Schema.Types.Mixed, // Store additional data
        ipAddress: String,
        userAgent: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Performance Metrics
    statistics: {
      totalDoctorsVerified: {
        type: Number,
        default: 0,
        min: [0, 'Count cannot be negative'],
      },
      totalPatientsVerified: {
        type: Number,
        default: 0,
        min: [0, 'Count cannot be negative'],
      },
      totalActionsPerformed: {
        type: Number,
        default: 0,
        min: [0, 'Count cannot be negative'],
      },
      lastVerificationDate: Date,
    },

    // Account Security
    emailVerificationCode: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      select: false,
    },
    
    // Password Reset
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    passwordChangedAt: Date,

    // Session Management
    activeSessions: [{
      sessionId: String,
      ipAddress: String,
      userAgent: String,
      loginAt: Date,
      lastActivity: Date,
      isActive: {
        type: Boolean,
        default: true,
      },
    }],

    // Login Security
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    accountLockedUntil: Date,
    lastLoginAt: Date,
    lastLoginIP: String,

    // System Preferences
    preferences: {
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        browser: {
          type: Boolean,
          default: true,
        },
        security: {
          type: Boolean,
          default: true,
        },
      },
      dashboard: {
        defaultView: {
          type: String,
          enum: ['overview', 'pending-verifications', 'statistics', 'recent-activity'],
          default: 'overview',
        },
        refreshInterval: {
          type: Number,
          default: 30, // seconds
        },
      },
      timezone: {
        type: String,
        default: 'Asia/Dhaka',
      },
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { 
    timestamps: true,
    toJSON: { 
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.passwordHash;
        delete ret.passwordResetToken;
        delete ret.emailVerificationCode;
        delete ret.twoFactorSecret;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
adminSchema.index({ adminId: 1 });
adminSchema.index({ email: 1 });
adminSchema.index({ role: 1 });
adminSchema.index({ isActive: 1 });
adminSchema.index({ 'systemActions.timestamp': -1 });

// Virtual for profile URL
adminSchema.virtual('profileUrl').get(function() {
  return `/api/v1/admin/${this._id}`;
});

// Virtual for account locked status
adminSchema.virtual('isAccountLocked').get(function() {
  return !!(this.accountLockedUntil && this.accountLockedUntil > Date.now());
});

// Pre-save middleware to hash password
adminSchema.pre('save', async function(next) {
  // Only hash password if it's been modified
  if (!this.isModified('passwordHash')) return next();
  
  try {
    // Hash password with cost of 12
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    this.passwordHash = await bcrypt.hash(this.passwordHash, saltRounds);
    
    // Set password changed timestamp
    if (!this.isNew) {
      this.passwordChangedAt = Date.now() - 1000; // 1 second before now
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to generate adminId if not provided
adminSchema.pre('save', async function(next) {
  if (this.isNew && !this.adminId) {
    try {
      const generateId = require('../utils/generateId');
      this.adminId = await generateId('ADM', 4);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Update statistics when verification arrays are modified
adminSchema.pre('save', function(next) {
  if (this.isModified('verifiedDoctors')) {
    this.statistics.totalDoctorsVerified = this.verifiedDoctors.length;
    this.statistics.lastVerificationDate = Date.now();
  }
  
  if (this.isModified('verifiedPatients')) {
    this.statistics.totalPatientsVerified = this.verifiedPatients.length;
    this.statistics.lastVerificationDate = Date.now();
  }
  
  if (this.isModified('systemActions')) {
    this.statistics.totalActionsPerformed = this.systemActions.length;
  }
  
  next();
});

// Instance method to check password
adminSchema.methods.checkPassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.passwordHash);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Instance method to check if password was changed after JWT was issued
adminSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Instance method to create password reset token
adminSchema.methods.createPasswordResetToken = function() {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// Instance method to create email verification code
adminSchema.methods.createEmailVerificationCode = function() {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  this.emailVerificationCode = code;
  this.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return code;
};

// Instance method to log system action
adminSchema.methods.logSystemAction = function(action, target, description, metadata = {}) {
  this.systemActions.push({
    action,
    target,
    description,
    metadata,
    timestamp: new Date(),
  });
  
  // Keep only last 1000 actions to prevent unlimited growth
  if (this.systemActions.length > 1000) {
    this.systemActions = this.systemActions.slice(-1000);
  }
};

// Instance method to check permissions
adminSchema.methods.hasPermission = function(resource, action) {
  // Super admin has all permissions
  if (this.isSuperAdmin) return true;
  
  const permission = this.permissions.find(p => p.resource === resource);
  return permission && permission.actions.includes(action);
};

// Static method to find by adminId
adminSchema.statics.findByAdminId = function(adminId) {
  return this.findOne({ adminId });
};

// Static method to find active admins
adminSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

// Static method to get system statistics
adminSchema.statics.getSystemStats = async function() {
  const totalAdmins = await this.countDocuments({ isActive: true });
  const superAdmins = await this.countDocuments({ isSuperAdmin: true, isActive: true });
  const recentActions = await this.aggregate([
    { $unwind: '$systemActions' },
    { $sort: { 'systemActions.timestamp': -1 } },
    { $limit: 10 },
    { $replaceRoot: { newRoot: '$systemActions' } },
  ]);
  
  return {
    totalAdmins,
    superAdmins,
    recentActions,
  };
};

module.exports = mongoose.model('Admin', adminSchema);
