/**
 * Patient Model
 * MongoDB schema for patient users in HealthSync
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { GENDER, BLOOD_GROUPS, ACCOUNT_STATUS } = require('../utils/constants');

const patientSchema = new mongoose.Schema(
    {
        patientId: {
            type: String,
            unique: true,
            match: /^PAT-\d{5}$/,
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
            unique: true,
            lowercase: true,
            sparse: true, // Allows multiple null values
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email address',
            ],
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            unique: true,
            match: [/^[0-9]{10,15}$/, 'Please provide a valid phone number'],
        },
        passwordHash: {
            type: String,
            required: [true, 'Password is required'],
            minLength: [8, 'Password must be at least 8 characters'],
            select: false, // Don't include password in queries by default
        },
        dateOfBirth: {
            type: Date,
            required: [true, 'Date of birth is required'],
            validate: {
                validator: function (dob) {
                    const today = new Date();
                    const age = today.getFullYear() - dob.getFullYear();
                    return age >= 0 && age <= 120;
                },
                message: 'Please provide a valid date of birth',
            },
        },
        gender: {
            type: String,
            required: [true, 'Gender is required'],
            enum: {
                values: Object.values(GENDER),
                message: 'Please select a valid gender',
            },
        },
        bloodGroup: {
            type: String,
            enum: {
                values: BLOOD_GROUPS,
                message: 'Please select a valid blood group',
            },
        },

        // Address Information
        address: {
            street: {
                type: String,
                trim: true,
            },
            city: {
                type: String,
                trim: true,
            },
            state: {
                type: String,
                trim: true,
            },
            zipCode: {
                type: String,
                match: [/^\d{5,10}$/, 'Please provide a valid zip code'],
            },
            country: {
                type: String,
                trim: true,
                default: 'Bangladesh',
            },
        },

        // Medical Information
        medicalHistory: {
            allergies: [{
                allergen: String,
                severity: {
                    type: String,
                    enum: ['mild', 'moderate', 'severe'],
                },
                notes: String,
            }],
            chronicConditions: [{
                condition: String,
                diagnosedDate: Date,
                status: {
                    type: String,
                    enum: ['active', 'controlled', 'resolved'],
                    default: 'active',
                },
                notes: String,
            }],
            surgicalHistory: [{
                procedure: String,
                date: Date,
                hospital: String,
                notes: String,
            }],
            familyHistory: [{
                relation: String,
                condition: String,
                notes: String,
            }],
            currentMedications: [{
                name: String,
                dosage: String,
                frequency: String,
                startDate: Date,
                prescribedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Doctor',
                },
                notes: String,
            }],
        },

        // Appointments
        appointments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment',
        }],

        // Emergency Contact
        emergencyContact: {
            name: {
                type: String,
                trim: true,
            },
            phone: {
                type: String,
                match: [/^[0-9]{10,15}$/, 'Please provide a valid phone number'],
            },
            relation: {
                type: String,
                trim: true,
            },
        },

        // Insurance Information
        insurance: {
            provider: String,
            policyNumber: String,
            groupNumber: String,
            validUntil: Date,
        },

        // Account Verification
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

        // Password Reset
        passwordResetToken: {
            type: String,
            select: false,
        },
        passwordResetExpires: {
            type: Date,
            select: false,
        },

        // System Settings
        preferences: {
            notifications: {
                email: {
                    type: Boolean,
                    default: true,
                },
                sms: {
                    type: Boolean,
                    default: true,
                },
                push: {
                    type: Boolean,
                    default: true,
                },
                appointments: {
                    type: Boolean,
                    default: true,
                },
                prescriptions: {
                    type: Boolean,
                    default: true,
                },
                labResults: {
                    type: Boolean,
                    default: true,
                },
            },
            language: {
                type: String,
                default: 'en',
            },
            timezone: {
                type: String,
                default: 'Asia/Dhaka',
            },
        },

        // AI Interaction History
        aiInteractions: [{
            query: String,
            response: String,
            timestamp: {
                type: Date,
                default: Date.now,
            },
            rating: {
                type: Number,
                min: 1,
                max: 5,
            },
        }],

        // Health Metrics (optional tracking)
        healthMetrics: {
            height: {
                value: Number, // in cm
                unit: {
                    type: String,
                    default: 'cm',
                },
            },
            weight: {
                value: Number, // in kg
                unit: {
                    type: String,
                    default: 'kg',
                },
            },
            lastUpdated: Date,
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
patientSchema.index({ patientId: 1 });
patientSchema.index({ email: 1 });
patientSchema.index({ phone: 1 });
patientSchema.index({ status: 1 });
patientSchema.index({ dateOfBirth: 1 });

// Virtual for age calculation
patientSchema.virtual('age').get(function () {
    if (!this.dateOfBirth) return null;

    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
});

// Virtual for BMI calculation
patientSchema.virtual('bmi').get(function () {
    if (!this.healthMetrics || !this.healthMetrics.height?.value || !this.healthMetrics.weight?.value) {
        return null;
    }

    const heightInM = this.healthMetrics.height.value / 100; // Convert cm to meters
    const weight = this.healthMetrics.weight.value;
    const bmi = weight / (heightInM * heightInM);

    return Math.round(bmi * 10) / 10; // Round to 1 decimal place
});

// Virtual for profile URL
patientSchema.virtual('profileUrl').get(function () {
    return `/api/v1/patients/${this._id}`;
});

// Pre-save middleware to hash password
patientSchema.pre('save', async function (next) {
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

// Pre-save middleware to generate patientId if not provided
patientSchema.pre('save', async function (next) {
    if (this.isNew && !this.patientId) {
        try {
            const generateId = require('../utils/generateId');
            this.patientId = await generateId('PAT');
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

// Instance method to check password
patientSchema.methods.checkPassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.passwordHash);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

// Instance method to check if password was changed after JWT was issued
patientSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

// Instance method to create password reset token
patientSchema.methods.createPasswordResetToken = function () {
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
patientSchema.methods.createEmailVerificationCode = function () {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    this.emailVerificationCode = code;
    this.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return code;
};

// Static method to find by patientId
patientSchema.statics.findByPatientId = function (patientId) {
    return this.findOne({ patientId });
};

// Static method to find verified patients
patientSchema.statics.findVerified = function () {
    return this.find({ isEmailVerified: true, status: ACCOUNT_STATUS.APPROVED });
};

module.exports = mongoose.model('Patient', patientSchema);
