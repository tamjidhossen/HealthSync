/**
 * Patient Controller
 * Handles all patient profile management operations
 */

const { catchAsync, AppError } = require('../middleware/errorHandler');
const Patient = require('../models/Patient');
const logger = require('../utils/logger');
const { GENDER, BLOOD_GROUPS } = require('../utils/constants');

/**
 * Get current patient's profile
 * @route GET /api/v1/patients/me
 * @access Private (Patient only)
 */
const getMyProfile = catchAsync(async (req, res, next) => {
    const patient = await Patient.findById(req.user._id);

    if (!patient) {
        return next(new AppError('Patient profile not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            patient
        }
    });
});

/**
 * Update patient's basic information
 * @route PUT /api/v1/patients/me/basic
 * @access Private (Patient only)
 */
const updateBasicInfo = catchAsync(async (req, res, next) => {
    const { fullName, phone, bloodGroup, preferences } = req.body;

    // Fields that cannot be updated through this endpoint
    const restrictedFields = ['email', 'patientId', 'passwordHash', 'dateOfBirth', 'gender', 'status'];

    // Check if any restricted fields are being updated
    const attemptedRestrictedUpdate = restrictedFields.some(field => req.body[field] !== undefined);
    if (attemptedRestrictedUpdate) {
        return next(new AppError('You cannot update restricted fields through this endpoint', 400));
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (phone) updateData.phone = phone;
    if (bloodGroup) {
        if (!BLOOD_GROUPS.includes(bloodGroup)) {
            return next(new AppError('Invalid blood group', 400));
        }
        updateData.bloodGroup = bloodGroup;
    }
    if (preferences) updateData.preferences = preferences;

    const patient = await Patient.findByIdAndUpdate(
        req.user._id,
        updateData,
        {
            new: true,
            runValidators: true
        }
    );

    if (!patient) {
        return next(new AppError('Patient not found', 404));
    }

    logger.info(`Patient basic info updated: ${patient.patientId}`);

    res.status(200).json({
        status: 'success',
        message: 'Basic information updated successfully',
        data: {
            patient
        }
    });
});

/**
 * Update patient's address information
 * @route PUT /api/v1/patients/me/address
 * @access Private (Patient only)
 */
const updateAddress = catchAsync(async (req, res, next) => {
    const { street, city, state, zipCode, country } = req.body;

    const updateData = { address: {} };
    if (street) updateData.address.street = street;
    if (city) updateData.address.city = city;
    if (state) updateData.address.state = state;
    if (zipCode) {
        if (!/^\d{5,10}$/.test(zipCode)) {
            return next(new AppError('Invalid zip code format', 400));
        }
        updateData.address.zipCode = zipCode;
    }
    if (country) updateData.address.country = country;

    const patient = await Patient.findByIdAndUpdate(
        req.user._id,
        updateData,
        {
            new: true,
            runValidators: true
        }
    );

    if (!patient) {
        return next(new AppError('Patient not found', 404));
    }

    logger.info(`Patient address updated: ${patient.patientId}`);

    res.status(200).json({
        status: 'success',
        message: 'Address updated successfully',
        data: {
            address: patient.address
        }
    });
});

/**
 * Update emergency contact information
 * @route PUT /api/v1/patients/me/emergency-contact
 * @access Private (Patient only)
 */
const updateEmergencyContact = catchAsync(async (req, res, next) => {
    const { name, phone, relation } = req.body;

    if (!name || !phone || !relation) {
        return next(new AppError('Emergency contact name, phone, and relation are required', 400));
    }

    if (!/^[0-9]{10,15}$/.test(phone)) {
        return next(new AppError('Invalid phone number format', 400));
    }

    const updateData = {
        emergencyContact: { name, phone, relation }
    };

    const patient = await Patient.findByIdAndUpdate(
        req.user._id,
        updateData,
        {
            new: true,
            runValidators: true
        }
    );

    if (!patient) {
        return next(new AppError('Patient not found', 404));
    }

    logger.info(`Patient emergency contact updated: ${patient.patientId}`);

    res.status(200).json({
        status: 'success',
        message: 'Emergency contact updated successfully',
        data: {
            emergencyContact: patient.emergencyContact
        }
    });
});

/**
 * Update insurance information
 * @route PUT /api/v1/patients/me/insurance
 * @access Private (Patient only)
 */
const updateInsurance = catchAsync(async (req, res, next) => {
    const { provider, policyNumber, groupNumber, validUntil } = req.body;

    const updateData = { insurance: {} };
    if (provider) updateData.insurance.provider = provider;
    if (policyNumber) updateData.insurance.policyNumber = policyNumber;
    if (groupNumber) updateData.insurance.groupNumber = groupNumber;
    if (validUntil) {
        const validDate = new Date(validUntil);
        if (validDate <= new Date()) {
            return next(new AppError('Insurance valid until date must be in the future', 400));
        }
        updateData.insurance.validUntil = validDate;
    }

    const patient = await Patient.findByIdAndUpdate(
        req.user._id,
        updateData,
        {
            new: true,
            runValidators: true
        }
    );

    if (!patient) {
        return next(new AppError('Patient not found', 404));
    }

    logger.info(`Patient insurance updated: ${patient.patientId}`);

    res.status(200).json({
        status: 'success',
        message: 'Insurance information updated successfully',
        data: {
            insurance: patient.insurance
        }
    });
});

/**
 * Update health metrics (height, weight)
 * @route PUT /api/v1/patients/me/health-metrics
 * @access Private (Patient only)
 */
const updateHealthMetrics = catchAsync(async (req, res, next) => {
    const { height, weight } = req.body;

    const updateData = { healthMetrics: {} };

    if (height !== undefined) {
        if (height < 30 || height > 300) {
            return next(new AppError('Height must be between 30 and 300 cm', 400));
        }
        updateData.healthMetrics.height = {
            value: height,
            unit: 'cm'
        };
    }

    if (weight !== undefined) {
        if (weight < 1 || weight > 500) {
            return next(new AppError('Weight must be between 1 and 500 kg', 400));
        }
        updateData.healthMetrics.weight = {
            value: weight,
            unit: 'kg'
        };
    }

    updateData.healthMetrics.lastUpdated = new Date();

    const patient = await Patient.findByIdAndUpdate(
        req.user._id,
        updateData,
        {
            new: true,
            runValidators: true
        }
    );

    if (!patient) {
        return next(new AppError('Patient not found', 404));
    }

    logger.info(`Patient health metrics updated: ${patient.patientId}`);

    // Calculate BMI if both height and weight are available
    const bmi = patient.bmi;

    res.status(200).json({
        status: 'success',
        message: 'Health metrics updated successfully',
        data: {
            healthMetrics: patient.healthMetrics,
            calculatedBMI: bmi,
            bmiCategory: getBMICategory(bmi)
        }
    });
});

/**
 * Add new allergy
 * @route POST /api/v1/patients/me/allergies
 * @access Private (Patient only)
 */
const addAllergy = catchAsync(async (req, res, next) => {
    const { allergen, severity, notes } = req.body;

    if (!allergen || !severity) {
        return next(new AppError('Allergen and severity are required', 400));
    }

    if (!['mild', 'moderate', 'severe'].includes(severity)) {
        return next(new AppError('Severity must be mild, moderate, or severe', 400));
    }

    const patient = await Patient.findById(req.user._id);
    if (!patient) {
        return next(new AppError('Patient not found', 404));
    }

    // Check if allergy already exists
    const existingAllergy = patient.medicalHistory.allergies.find(
        allergy => allergy.allergen.toLowerCase() === allergen.toLowerCase()
    );

    if (existingAllergy) {
        return next(new AppError('This allergy already exists', 400));
    }

    patient.medicalHistory.allergies.push({
        allergen,
        severity,
        notes: notes || ''
    });

    await patient.save();

    logger.info(`Allergy added for patient: ${patient.patientId}`);

    res.status(201).json({
        status: 'success',
        message: 'Allergy added successfully',
        data: {
            allergies: patient.medicalHistory.allergies
        }
    });
});

/**
 * Update allergy
 * @route PUT /api/v1/patients/me/allergies/:allergyId
 * @access Private (Patient only)
 */
const updateAllergy = catchAsync(async (req, res, next) => {
    const { allergyId } = req.params;
    const { allergen, severity, notes } = req.body;

    const patient = await Patient.findById(req.user._id);
    if (!patient) {
        return next(new AppError('Patient not found', 404));
    }

    const allergy = patient.medicalHistory.allergies.id(allergyId);
    if (!allergy) {
        return next(new AppError('Allergy not found', 404));
    }

    if (severity && !['mild', 'moderate', 'severe'].includes(severity)) {
        return next(new AppError('Severity must be mild, moderate, or severe', 400));
    }

    if (allergen) allergy.allergen = allergen;
    if (severity) allergy.severity = severity;
    if (notes !== undefined) allergy.notes = notes;

    await patient.save();

    logger.info(`Allergy updated for patient: ${patient.patientId}`);

    res.status(200).json({
        status: 'success',
        message: 'Allergy updated successfully',
        data: {
            allergies: patient.medicalHistory.allergies
        }
    });
});

/**
 * Remove allergy
 * @route DELETE /api/v1/patients/me/allergies/:allergyId
 * @access Private (Patient only)
 */
const removeAllergy = catchAsync(async (req, res, next) => {
    const { allergyId } = req.params;

    const patient = await Patient.findById(req.user._id);
    if (!patient) {
        return next(new AppError('Patient not found', 404));
    }

    const allergyIndex = patient.medicalHistory.allergies.findIndex(
        allergy => allergy._id.toString() === allergyId
    );

    if (allergyIndex === -1) {
        return next(new AppError('Allergy not found', 404));
    }

    patient.medicalHistory.allergies.splice(allergyIndex, 1);
    await patient.save();

    logger.info(`Allergy removed for patient: ${patient.patientId}`);

    res.status(200).json({
        status: 'success',
        message: 'Allergy removed successfully',
        data: {
            allergies: patient.medicalHistory.allergies
        }
    });
});

/**
 * Add chronic condition
 * @route POST /api/v1/patients/me/conditions
 * @access Private (Patient only)
 */
const addChronicCondition = catchAsync(async (req, res, next) => {
    const { condition, diagnosedDate, status, notes } = req.body;

    if (!condition || !diagnosedDate) {
        return next(new AppError('Condition and diagnosed date are required', 400));
    }

    if (status && !['active', 'controlled', 'resolved'].includes(status)) {
        return next(new AppError('Status must be active, controlled, or resolved', 400));
    }

    const patient = await Patient.findById(req.user._id);
    if (!patient) {
        return next(new AppError('Patient not found', 404));
    }

    patient.medicalHistory.chronicConditions.push({
        condition,
        diagnosedDate: new Date(diagnosedDate),
        status: status || 'active',
        notes: notes || ''
    });

    await patient.save();

    logger.info(`Chronic condition added for patient: ${patient.patientId}`);

    res.status(201).json({
        status: 'success',
        message: 'Chronic condition added successfully',
        data: {
            chronicConditions: patient.medicalHistory.chronicConditions
        }
    });
});

/**
 * Update chronic condition
 * @route PUT /api/v1/patients/me/conditions/:conditionId
 * @access Private (Patient only)
 */
const updateChronicCondition = catchAsync(async (req, res, next) => {
    const { conditionId } = req.params;
    const { condition, diagnosedDate, status, notes } = req.body;

    const patient = await Patient.findById(req.user._id);
    if (!patient) {
        return next(new AppError('Patient not found', 404));
    }

    const chronicCondition = patient.medicalHistory.chronicConditions.id(conditionId);
    if (!chronicCondition) {
        return next(new AppError('Chronic condition not found', 404));
    }

    if (status && !['active', 'controlled', 'resolved'].includes(status)) {
        return next(new AppError('Status must be active, controlled, or resolved', 400));
    }

    if (condition) chronicCondition.condition = condition;
    if (diagnosedDate) chronicCondition.diagnosedDate = new Date(diagnosedDate);
    if (status) chronicCondition.status = status;
    if (notes !== undefined) chronicCondition.notes = notes;

    await patient.save();

    logger.info(`Chronic condition updated for patient: ${patient.patientId}`);

    res.status(200).json({
        status: 'success',
        message: 'Chronic condition updated successfully',
        data: {
            chronicConditions: patient.medicalHistory.chronicConditions
        }
    });
});

/**
 * Get patient's statistics and health summary
 * @route GET /api/v1/patients/me/stats
 * @access Private (Patient only)
 */
const getPatientStats = catchAsync(async (req, res, next) => {
    const patient = await Patient.findById(req.user._id);
    if (!patient) {
        return next(new AppError('Patient not found', 404));
    }

    const stats = {
        basic: {
            patientId: patient.patientId,
            fullName: patient.fullName,
            age: patient.age,
            gender: patient.gender,
            bloodGroup: patient.bloodGroup,
            status: patient.status,
            isEmailVerified: patient.isEmailVerified,
            createdAt: patient.createdAt
        },
        health: {
            bmi: patient.bmi,
            bmiCategory: getBMICategory(patient.bmi),
            allergiesCount: patient.medicalHistory.allergies.length,
            chronicConditionsCount: patient.medicalHistory.chronicConditions.length,
            currentMedicationsCount: patient.medicalHistory.currentMedications.length,
            lastHealthMetricsUpdate: patient.healthMetrics?.lastUpdated
        },
        medical: {
            surgicalHistoryCount: patient.medicalHistory.surgicalHistory.length,
            familyHistoryCount: patient.medicalHistory.familyHistory.length,
            activeConditions: patient.medicalHistory.chronicConditions.filter(c => c.status === 'active').length,
            controlledConditions: patient.medicalHistory.chronicConditions.filter(c => c.status === 'controlled').length
        },
        account: {
            isActive: patient.isActive,
            lastLoginAt: patient.lastLoginAt,
            appointmentsCount: patient.appointments.length,
            aiInteractionsCount: patient.aiInteractions.length
        },
        emergency: {
            hasEmergencyContact: !!(patient.emergencyContact?.name && patient.emergencyContact?.phone),
            hasInsurance: !!(patient.insurance?.provider && patient.insurance?.policyNumber)
        }
    };

    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
});

/**
 * Update notification preferences
 * @route PUT /api/v1/patients/me/preferences
 * @access Private (Patient only)
 */
const updatePreferences = catchAsync(async (req, res, next) => {
    const { notifications, language, timezone } = req.body;

    const updateData = {};
    if (notifications) updateData['preferences.notifications'] = notifications;
    if (language) updateData['preferences.language'] = language;
    if (timezone) updateData['preferences.timezone'] = timezone;

    const patient = await Patient.findByIdAndUpdate(
        req.user._id,
        { $set: updateData },
        {
            new: true,
            runValidators: true
        }
    );

    if (!patient) {
        return next(new AppError('Patient not found', 404));
    }

    logger.info(`Patient preferences updated: ${patient.patientId}`);

    res.status(200).json({
        status: 'success',
        message: 'Preferences updated successfully',
        data: {
            preferences: patient.preferences
        }
    });
});

/**
 * Toggle patient's active status
 * @route PATCH /api/v1/patients/me/toggle-status
 * @access Private (Patient only)
 */
const toggleActiveStatus = catchAsync(async (req, res, next) => {
    const patient = await Patient.findById(req.user._id);
    if (!patient) {
        return next(new AppError('Patient not found', 404));
    }

    patient.isActive = !patient.isActive;
    await patient.save();

    logger.info(`Patient status toggled: ${patient.patientId} - Active: ${patient.isActive}`);

    res.status(200).json({
        status: 'success',
        message: `Account ${patient.isActive ? 'activated' : 'deactivated'} successfully`,
        data: {
            isActive: patient.isActive
        }
    });
});

/**
 * Helper function to categorize BMI
 */
function getBMICategory(bmi) {
    if (!bmi) return null;

    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
}

module.exports = {
    getMyProfile,
    updateBasicInfo,
    updateAddress,
    updateEmergencyContact,
    updateInsurance,
    updateHealthMetrics,
    addAllergy,
    updateAllergy,
    removeAllergy,
    addChronicCondition,
    updateChronicCondition,
    getPatientStats,
    updatePreferences,
    toggleActiveStatus
};
