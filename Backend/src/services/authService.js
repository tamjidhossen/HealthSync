/**
 * Authentication Service
 * Business logic for user authentication in HealthSync
 */

const crypto = require('crypto');
const { AppError } = require('../middleware/errorHandler');
const { generateTokenPair, generateEmailVerificationToken, generatePasswordResetToken } = require('../config/jwt');
const emailService = require('./emailService');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Admin = require('../models/Admin');
const logger = require('../utils/logger');
const { SUCCESS_MESSAGES, ERROR_MESSAGES, ACCOUNT_STATUS } = require('../utils/constants');

/**
 * Register a new doctor
 * @param {object} doctorData - Doctor registration data
 * @returns {Promise<object>} - Registration result
 */
const registerDoctor = async (doctorData) => {
    const { doctorId, fullName, email, phone, password, specialization, licenseNumber, qualifications, hospitalAffiliations } = doctorData;

    try {
        // Check if doctor already exists
        const existingDoctor = await Doctor.findOne({
            $or: [
                { email: email.toLowerCase() },
                { phone },
                { licenseNumber }
            ]
        });

        if (existingDoctor) {
            if (existingDoctor.email === email.toLowerCase()) {
                throw new AppError('A doctor with this email already exists', 400);
            }
            if (existingDoctor.phone === phone) {
                throw new AppError('A doctor with this phone number already exists', 400);
            }
            if (existingDoctor.licenseNumber === licenseNumber) {
                throw new AppError('A doctor with this license number already exists', 400);
            }
        }

        // Create new doctor
        const doctor = new Doctor({
            doctorId,
            fullName,
            email: email.toLowerCase(),
            phone,
            passwordHash: password, // Will be hashed by pre-save middleware
            specialization,
            licenseNumber,
            qualifications: qualifications || [],
            hospitalAffiliations: hospitalAffiliations || [],
            status: ACCOUNT_STATUS.PENDING,
        });

        // Generate email verification code
        const verificationCode = doctor.createEmailVerificationCode();

        await doctor.save();

        // Send verification email
        try {
            await emailService.sendEmailVerification(doctor.email, doctor.fullName, verificationCode);
        } catch (emailError) {
            logger.error('Failed to send verification email:', emailError);
            // Don't fail registration if email fails
        }

        logger.info(`New doctor registered: ${doctor.doctorId} (${doctor.email})`);

        return {
            success: true,
            message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
            data: {
                doctorId: doctor.doctorId,
                fullName: doctor.fullName,
                email: doctor.email,
                specialization: doctor.specialization,
                status: doctor.status,
            },
        };

    } catch (error) {
        if (error.statusCode) {
            throw error;
        }
        logger.error('Doctor registration failed:', error);
        throw new AppError('Registration failed. Please try again.', 500);
    }
};

/**
 * Register a new patient
 * @param {object} patientData - Patient registration data
 * @returns {Promise<object>} - Registration result
 */
const registerPatient = async (patientData) => {
    const { fullName, email, phone, password, dateOfBirth, gender, bloodGroup } = patientData;

    try {
        // Check if patient already exists
        const existingPatient = await Patient.findOne({
            $or: [
                { phone },
                ...(email ? [{ email: email.toLowerCase() }] : [])
            ]
        });

        if (existingPatient) {
            if (existingPatient.phone === phone) {
                throw new AppError('A patient with this phone number already exists', 400);
            }
            if (email && existingPatient.email === email.toLowerCase()) {
                throw new AppError('A patient with this email already exists', 400);
            }
        }

        // Create new patient
        const patient = new Patient({
            fullName,
            email: email ? email.toLowerCase() : undefined,
            phone,
            passwordHash: password, // Will be hashed by pre-save middleware
            dateOfBirth: new Date(dateOfBirth),
            gender,
            bloodGroup,
            status: ACCOUNT_STATUS.APPROVED, // Patients are auto-approved
        });

        // Generate email verification code if email is provided
        let verificationCode;
        if (email) {
            verificationCode = patient.createEmailVerificationCode();
        }

        await patient.save();

        // Send verification email if email is provided
        if (email && verificationCode) {
            try {
                await emailService.sendEmailVerification(patient.email, patient.fullName, verificationCode);
            } catch (emailError) {
                logger.error('Failed to send verification email:', emailError);
                // Don't fail registration if email fails
            }
        }

        logger.info(`New patient registered: ${patient.patientId} (${patient.phone})`);

        return {
            success: true,
            message: email ? SUCCESS_MESSAGES.REGISTRATION_SUCCESS : 'Registration successful!',
            data: {
                patientId: patient.patientId,
                fullName: patient.fullName,
                email: patient.email,
                phone: patient.phone,
                age: patient.age,
            },
        };

    } catch (error) {
        if (error.statusCode) {
            throw error;
        }
        logger.error('Patient registration failed:', error);
        throw new AppError('Registration failed. Please try again.', 500);
    }
};

/**
 * Login user (doctor, patient, or admin)
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} userType - User type ('doctor', 'patient', 'admin')
 * @returns {Promise<object>} - Login result with tokens
 */
const login = async (email, password, userType) => {
    try {
        // Validate input
        if (!email || !password) {
            throw new AppError('Please provide email and password', 400);
        }

        if (!['doctor', 'patient', 'admin'].includes(userType)) {
            throw new AppError('Invalid user type', 400);
        }

        let User;
        switch (userType) {
            case 'doctor':
                User = Doctor;
                break;
            case 'patient':
                User = Patient;
                break;
            case 'admin':
                User = Admin;
                break;
        }

        // Find user and include password
        const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');

        if (!user || !(await user.checkPassword(password))) {
            throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
        }

        // Check if user is active
        if (!user.isActive) {
            throw new AppError('Your account has been deactivated. Please contact support.', 401);
        }

        // Additional checks based on user type
        if (userType === 'patient') {
            if (!user.isEmailVerified) {
                throw new AppError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED, 401);
            }
        }
        if (userType === 'doctor') {
            if (!user.isEmailVerified) {
                throw new AppError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED, 401);
            }
            if (user.status === 'pending') {
                throw new AppError(ERROR_MESSAGES.ACCOUNT_PENDING, 401);
            }
            if (user.status === 'rejected') {
                throw new AppError('Your account has been rejected. Please contact admin.', 401);
            }
            if (user.status === 'suspended') {
                throw new AppError(ERROR_MESSAGES.ACCOUNT_SUSPENDED, 401);
            }
        }

        if (userType === 'admin') {
            if (user.isAccountLocked) {
                throw new AppError('Your account is temporarily locked. Please try again later.', 401);
            }

            // Reset failed login attempts on successful login
            if (user.failedLoginAttempts > 0) {
                user.failedLoginAttempts = 0;
                user.accountLockedUntil = undefined;
            }
        }

        // Update last login
        user.lastLoginAt = new Date();
        if (userType === 'admin') {
            user.lastLoginIP = ''; // Will be set by controller
        }

        await user.save({ validateBeforeSave: false });

        // Generate tokens
        const tokens = generateTokenPair(user);

        // Remove password from response
        user.passwordHash = undefined;

        logger.info(`${userType} login successful: ${user.email}`);

        return {
            success: true,
            message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
            data: {
                user: user,
                tokens: tokens,
            },
        };

    } catch (error) {
        if (error.statusCode) {
            throw error;
        }
        logger.error('Login failed:', error);
        throw new AppError('Login failed. Please try again.', 500);
    }
};

/**
 * Verify email with verification code
 * @param {string} email - User email
 * @param {string} code - Verification code
 * @param {string} userType - User type
 * @returns {Promise<object>} - Verification result
 */
const verifyEmail = async (email, code, userType) => {
    try {
        let User;
        switch (userType) {
            case 'doctor':
                User = Doctor;
                break;
            case 'patient':
                User = Patient;
                break;
            case 'admin':
                User = Admin;
                break;
            default:
                throw new AppError('Invalid user type', 400);
        }

        const user = await User.findOne({
            email: email.toLowerCase(),
            emailVerificationCode: code,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            throw new AppError('Invalid or expired verification code', 400);
        }

        // Update user
        user.isEmailVerified = true;
        user.emailVerificationCode = undefined;
        user.emailVerificationExpires = undefined;

        await user.save({ validateBeforeSave: false });

        // Send welcome email
        try {
            await emailService.sendWelcome(user.email, user.fullName, userType);
        } catch (emailError) {
            logger.error('Failed to send welcome email:', emailError);
        }

        logger.info(`Email verified for ${userType}: ${user.email}`);

        return {
            success: true,
            message: SUCCESS_MESSAGES.EMAIL_VERIFIED,
        };

    } catch (error) {
        if (error.statusCode) {
            throw error;
        }
        logger.error('Email verification failed:', error);
        throw new AppError('Email verification failed. Please try again.', 500);
    }
};

/**
 * Resend email verification code
 * @param {string} email - User email
 * @param {string} userType - User type
 * @returns {Promise<object>} - Result
 */
const resendVerificationCode = async (email, userType) => {
    try {
        let User;
        switch (userType) {
            case 'doctor':
                User = Doctor;
                break;
            case 'patient':
                User = Patient;
                break;
            case 'admin':
                User = Admin;
                break;
            default:
                throw new AppError('Invalid user type', 400);
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        if (user.isEmailVerified) {
            throw new AppError('Email is already verified', 400);
        }

        // Generate new verification code
        const verificationCode = user.createEmailVerificationCode();
        await user.save({ validateBeforeSave: false });

        // Send verification email
        await emailService.sendEmailVerification(user.email, user.fullName, verificationCode);

        return {
            success: true,
            message: SUCCESS_MESSAGES.VERIFICATION_EMAIL_SENT,
        };

    } catch (error) {
        if (error.statusCode) {
            throw error;
        }
        logger.error('Resend verification failed:', error);
        throw new AppError('Failed to resend verification code. Please try again.', 500);
    }
};

/**
 * Request password reset
 * @param {string} email - User email
 * @param {string} userType - User type
 * @returns {Promise<object>} - Result
 */
const requestPasswordReset = async (email, userType) => {
    try {
        let User;
        switch (userType) {
            case 'doctor':
                User = Doctor;
                break;
            case 'patient':
                User = Patient;
                break;
            case 'admin':
                User = Admin;
                break;
            default:
                throw new AppError('Invalid user type', 400);
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // Don't reveal if user exists or not
            return {
                success: true,
                message: 'If an account with this email exists, you will receive a password reset link.',
            };
        }

        // Generate password reset token
        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        // Send password reset email
        try {
            await emailService.sendPasswordReset(user.email, user.fullName, resetToken);
        } catch (emailError) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });

            logger.error('Failed to send password reset email:', emailError);
            throw new AppError('Failed to send password reset email. Please try again.', 500);
        }

        return {
            success: true,
            message: 'Password reset link sent to your email.',
        };

    } catch (error) {
        if (error.statusCode) {
            throw error;
        }
        logger.error('Password reset request failed:', error);
        throw new AppError('Password reset request failed. Please try again.', 500);
    }
};

/**
 * Reset password with token
 * @param {string} token - Password reset token
 * @param {string} newPassword - New password
 * @param {string} userType - User type
 * @returns {Promise<object>} - Result
 */
const resetPassword = async (token, newPassword, userType) => {
    try {
        // Hash the token
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        let User;
        switch (userType) {
            case 'doctor':
                User = Doctor;
                break;
            case 'patient':
                User = Patient;
                break;
            case 'admin':
                User = Admin;
                break;
            default:
                throw new AppError('Invalid user type', 400);
        }

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            throw new AppError('Token is invalid or has expired', 400);
        }

        // Update password
        user.passwordHash = newPassword; // Will be hashed by pre-save middleware
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        logger.info(`Password reset successful for ${userType}: ${user.email}`);

        return {
            success: true,
            message: SUCCESS_MESSAGES.PASSWORD_RESET,
        };

    } catch (error) {
        if (error.statusCode) {
            throw error;
        }
        logger.error('Password reset failed:', error);
        throw new AppError('Password reset failed. Please try again.', 500);
    }
};

module.exports = {
    registerDoctor,
    registerPatient,
    login,
    verifyEmail,
    resendVerificationCode,
    requestPasswordReset,
    resetPassword,
};
