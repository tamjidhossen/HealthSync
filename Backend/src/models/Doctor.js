/**
 * Doctor Model
 * MongoDB schema for doctor users in HealthSync
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ACCOUNT_STATUS, SPECIALIZATIONS, DAYS_OF_WEEK } = require('../utils/constants');

const doctorSchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
      required: true,
      unique: true,
      match: /^DOC-\d{5}$/, // Format: DOC-12345
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

    // Professional Information
    specialization: {
      type: String,
      default: "N/A",
      required: [true, 'Specialization is required'],
      enum: {
        values: SPECIALIZATIONS,
        message: 'Please select a valid specialization',
      },
    },
    qualifications: [
      {
        degree: {
          type: String,
          required: true,
          trim: true,
        },
        institute: {
          type: String,
          required: true,
          trim: true,
        },
        year: {
          type: Number,
          required: true,
          min: [1950, 'Year must be after 1950'],
          max: [new Date().getFullYear(), 'Year cannot be in the future'],
        },
      },
    ],
    experienceYears: {
      type: Number,
      default: 0,
      min: [0, 'Experience cannot be negative'],
      max: [60, 'Experience cannot exceed 60 years'],
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
      trim: true,
    },
    hospitalAffiliations: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        department: {
          type: String,
          required: true,
          trim: true,
        },
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
          validate: {
            validator: function (endDate) {
              return !endDate || endDate > this.startDate;
            },
            message: 'End date must be after start date',
          },
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],

    // Availability & Appointments
    availability: [
      {
        day: {
          type: String,
          required: true,
          enum: DAYS_OF_WEEK,
        },
        slots: [{
          type: String,
          match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time slot format (HH:MM-HH:MM)'],
        }],
        patientsCount: {
          type: Number,
          default: 10,
          min: [1, 'Must allow at least 1 patient per slot'],
          max: [50, 'Cannot exceed 50 patients per slot'],
        },
      },
    ],

    // Performance Metrics
    curedPatientsCount: {
      type: Number,
      default: 0,
      min: [0, 'Cured patients count cannot be negative'],
    },
    curedDiseases: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        count: {
          type: Number,
          default: 0,
          min: [0, 'Count cannot be negative'],
        },
      },
    ],

    // Reviews and Ratings
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: [0, 'Review count cannot be negative'],
    },

    // Admin Verification
    status: {
      type: String,
      enum: {
        values: Object.values(ACCOUNT_STATUS),
        message: 'Please select a valid account status',
      },
      default: ACCOUNT_STATUS.PENDING,
    },
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
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
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

    // System Preferences
    notificationPreferences: {
      email: {
        type: Boolean,
        default: true,
      },
      sms: {
        type: Boolean,
        default: false,
      },
      push: {
        type: Boolean,
        default: true,
      },
    },

    // Last Login
    lastLoginAt: {
      type: Date,
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
doctorSchema.index({ doctorId: 1 });
doctorSchema.index({ email: 1 });
doctorSchema.index({ licenseNumber: 1 });
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ status: 1 });
doctorSchema.index({ 'hospitalAffiliations.name': 1 });

// Virtual for full profile URL
doctorSchema.virtual('profileUrl').get(function () {
  return `/api/v1/doctors/${this._id}`;
});

// Virtual for years of experience based on qualification
doctorSchema.virtual('calculatedExperience').get(function () {
  if (this.qualifications && this.qualifications.length > 0) {
    const earliestYear = Math.min(...this.qualifications.map(q => q.year));
    return new Date().getFullYear() - earliestYear;
  }
  return this.experienceYears;
});

// Pre-save middleware to hash password
doctorSchema.pre('save', async function (next) {
  // Only hash password if it's been modified
  if (!this.isModified('passwordHash')) return next();

  try {
    // Hash password with cost of 12
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    this.passwordHash = await bcrypt.hash(this.passwordHash, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to generate doctorId if not provided
doctorSchema.pre('save', async function (next) {
  if (this.isNew && !this.doctorId) {
    try {
      const generateId = require('../utils/generateId');
      this.doctorId = await generateId('DOC');
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Instance method to check password
doctorSchema.methods.checkPassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.passwordHash);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Instance method to check if password was changed after JWT was issued
doctorSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Instance method to create password reset token
doctorSchema.methods.createPasswordResetToken = function () {
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
doctorSchema.methods.createEmailVerificationCode = function () {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  this.emailVerificationCode = code;
  this.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return code;
};

// Static method to find by doctorId
doctorSchema.statics.findByDoctorId = function (doctorId) {
  return this.findOne({ doctorId });
};

// Static method to find verified doctors
doctorSchema.statics.findVerified = function () {
  return this.find({ isVerified: true, status: ACCOUNT_STATUS.APPROVED });
};

module.exports = mongoose.model('Doctor', doctorSchema);
