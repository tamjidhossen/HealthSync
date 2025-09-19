/**
 * Doctor Controller
 * Handles all doctor profile management operations
 */

const { catchAsync, AppError } = require('../middleware/errorHandler');
const Doctor = require('../models/Doctor');
const logger = require('../utils/logger');
const { SPECIALIZATIONS, DAYS_OF_WEEK } = require('../utils/constants');

/**
 * Get current doctor's profile
 * @route GET /api/v1/doctors/me
 * @access Private (Doctor only)
 */
const getMyProfile = catchAsync(async (req, res, next) => {
    const doctor = await Doctor.findById(req.user._id);

    if (!doctor) {
        return next(new AppError('Doctor profile not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            doctor
        }
    });
});

/**
 * Update doctor's basic information
 * @route PUT /api/v1/doctors/me/basic
 * @access Private (Doctor only)
 */
const updateBasicInfo = catchAsync(async (req, res, next) => {
    const { fullName, phone, notificationPreferences } = req.body;

    // Fields that cannot be updated through this endpoint
    const restrictedFields = ['email', 'doctorId', 'passwordHash', 'licenseNumber', 'status', 'isVerified'];

    // Check if any restricted fields are being updated
    const attemptedRestrictedUpdate = restrictedFields.some(field => req.body[field] !== undefined);
    if (attemptedRestrictedUpdate) {
        return next(new AppError('You cannot update restricted fields through this endpoint', 400));
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (phone) updateData.phone = phone;
    if (notificationPreferences) updateData.notificationPreferences = notificationPreferences;

    const doctor = await Doctor.findByIdAndUpdate(
        req.user._id,
        updateData,
        {
            new: true,
            runValidators: true
        }
    );

    if (!doctor) {
        return next(new AppError('Doctor not found', 404));
    }

    logger.info(`Doctor basic info updated: ${doctor.doctorId}`);

    res.status(200).json({
        status: 'success',
        message: 'Basic information updated successfully',
        data: {
            doctor
        }
    });
});

/**
 * Update doctor's professional information
 * @route PUT /api/v1/doctors/me/professional
 * @access Private (Doctor only)
 */
const updateProfessionalInfo = catchAsync(async (req, res, next) => {
    const {
        specialization,
        qualifications,
        experienceYears,
        hospitalAffiliations,
        curedDiseases
    } = req.body;

    const updateData = {};

    if (specialization) {
        if (!SPECIALIZATIONS.includes(specialization)) {
            return next(new AppError('Invalid specialization', 400));
        }
        updateData.specialization = specialization;
    }

    if (qualifications) {
        // Validate qualifications array
        if (!Array.isArray(qualifications)) {
            return next(new AppError('Qualifications must be an array', 400));
        }

        for (const qualification of qualifications) {
            if (!qualification.degree || !qualification.institute || !qualification.year) {
                return next(new AppError('Each qualification must have degree, institute, and year', 400));
            }

            const currentYear = new Date().getFullYear();
            if (qualification.year < 1950 || qualification.year > currentYear) {
                return next(new AppError(`Qualification year must be between 1950 and ${currentYear}`, 400));
            }
        }

        updateData.qualifications = qualifications;
    }

    if (experienceYears !== undefined) {
        if (experienceYears < 0 || experienceYears > 60) {
            return next(new AppError('Experience years must be between 0 and 60', 400));
        }
        updateData.experienceYears = experienceYears;
    }

    if (hospitalAffiliations) {
        if (!Array.isArray(hospitalAffiliations)) {
            return next(new AppError('Hospital affiliations must be an array', 400));
        }

        for (const affiliation of hospitalAffiliations) {
            if (!affiliation.name || !affiliation.department || !affiliation.startDate) {
                return next(new AppError('Each hospital affiliation must have name, department, and startDate', 400));
            }

            if (affiliation.endDate && new Date(affiliation.endDate) <= new Date(affiliation.startDate)) {
                return next(new AppError('End date must be after start date for hospital affiliations', 400));
            }
        }

        updateData.hospitalAffiliations = hospitalAffiliations;
    }

    if (curedDiseases) {
        if (!Array.isArray(curedDiseases)) {
            return next(new AppError('Cured diseases must be an array', 400));
        }

        for (const disease of curedDiseases) {
            if (!disease.name || disease.count < 0) {
                return next(new AppError('Each cured disease must have a name and non-negative count', 400));
            }
        }

        updateData.curedDiseases = curedDiseases;
    }

    const doctor = await Doctor.findByIdAndUpdate(
        req.user._id,
        updateData,
        {
            new: true,
            runValidators: true
        }
    );

    if (!doctor) {
        return next(new AppError('Doctor not found', 404));
    }

    logger.info(`Doctor professional info updated: ${doctor.doctorId}`);

    res.status(200).json({
        status: 'success',
        message: 'Professional information updated successfully',
        data: {
            doctor
        }
    });
});

/**
 * Update doctor's availability schedule
 * @route PUT /api/v1/doctors/me/availability
 * @access Private (Doctor only)
 */
const updateAvailability = catchAsync(async (req, res, next) => {
    const { availability } = req.body;

    if (!availability || !Array.isArray(availability)) {
        return next(new AppError('Availability must be an array', 400));
    }

    // Validate availability data
    for (const dayAvailability of availability) {
        if (!dayAvailability.day || !DAYS_OF_WEEK.includes(dayAvailability.day)) {
            return next(new AppError('Invalid day in availability. Must be one of: ' + DAYS_OF_WEEK.join(', '), 400));
        }

        if (dayAvailability.slots) {
            if (!Array.isArray(dayAvailability.slots)) {
                return next(new AppError('Slots must be an array', 400));
            }

            // Validate time slot format (HH:MM-HH:MM)
            const timeSlotRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
            for (const slot of dayAvailability.slots) {
                if (!timeSlotRegex.test(slot)) {
                    return next(new AppError(`Invalid time slot format: ${slot}. Use HH:MM-HH:MM format`, 400));
                }

                // Validate that start time is before end time
                const [startTime, endTime] = slot.split('-');
                const [startHour, startMin] = startTime.split(':').map(Number);
                const [endHour, endMin] = endTime.split(':').map(Number);

                const startMinutes = startHour * 60 + startMin;
                const endMinutes = endHour * 60 + endMin;

                if (startMinutes >= endMinutes) {
                    return next(new AppError(`Invalid time slot: ${slot}. Start time must be before end time`, 400));
                }
            }
        }

        if (dayAvailability.patientsCount !== undefined) {
            if (dayAvailability.patientsCount < 1 || dayAvailability.patientsCount > 50) {
                return next(new AppError('Patients count per slot must be between 1 and 50', 400));
            }
        }
    }

    const doctor = await Doctor.findByIdAndUpdate(
        req.user._id,
        { availability },
        {
            new: true,
            runValidators: true
        }
    );

    if (!doctor) {
        return next(new AppError('Doctor not found', 404));
    }

    logger.info(`Doctor availability updated: ${doctor.doctorId}`);

    res.status(200).json({
        status: 'success',
        message: 'Availability updated successfully',
        data: {
            availability: doctor.availability
        }
    });
});

/**
 * Add a new qualification
 * @route POST /api/v1/doctors/me/qualifications
 * @access Private (Doctor only)
 */
const addQualification = catchAsync(async (req, res, next) => {
    const { degree, institute, year } = req.body;

    if (!degree || !institute || !year) {
        return next(new AppError('Degree, institute, and year are required', 400));
    }

    const currentYear = new Date().getFullYear();
    if (year < 1950 || year > currentYear) {
        return next(new AppError(`Year must be between 1950 and ${currentYear}`, 400));
    }

    const doctor = await Doctor.findById(req.user._id);
    if (!doctor) {
        return next(new AppError('Doctor not found', 404));
    }

    // Check if qualification already exists
    const existingQualification = doctor.qualifications.find(
        q => q.degree === degree && q.institute === institute && q.year === year
    );

    if (existingQualification) {
        return next(new AppError('This qualification already exists', 400));
    }

    doctor.qualifications.push({ degree, institute, year });
    await doctor.save();

    logger.info(`Qualification added for doctor: ${doctor.doctorId}`);

    res.status(201).json({
        status: 'success',
        message: 'Qualification added successfully',
        data: {
            qualifications: doctor.qualifications
        }
    });
});

/**
 * Remove a qualification
 * @route DELETE /api/v1/doctors/me/qualifications/:qualificationId
 * @access Private (Doctor only)
 */
const removeQualification = catchAsync(async (req, res, next) => {
    const { qualificationId } = req.params;

    const doctor = await Doctor.findById(req.user._id);
    if (!doctor) {
        return next(new AppError('Doctor not found', 404));
    }

    const qualificationIndex = doctor.qualifications.findIndex(
        q => q._id.toString() === qualificationId
    );

    if (qualificationIndex === -1) {
        return next(new AppError('Qualification not found', 404));
    }

    doctor.qualifications.splice(qualificationIndex, 1);
    await doctor.save();

    logger.info(`Qualification removed for doctor: ${doctor.doctorId}`);

    res.status(200).json({
        status: 'success',
        message: 'Qualification removed successfully',
        data: {
            qualifications: doctor.qualifications
        }
    });
});

/**
 * Add hospital affiliation
 * @route POST /api/v1/doctors/me/affiliations
 * @access Private (Doctor only)
 */
const addHospitalAffiliation = catchAsync(async (req, res, next) => {
    const { name, department, startDate, endDate, isActive } = req.body;

    if (!name || !department || !startDate) {
        return next(new AppError('Hospital name, department, and start date are required', 400));
    }

    if (endDate && new Date(endDate) <= new Date(startDate)) {
        return next(new AppError('End date must be after start date', 400));
    }

    const doctor = await Doctor.findById(req.user._id);
    if (!doctor) {
        return next(new AppError('Doctor not found', 404));
    }

    const newAffiliation = {
        name,
        department,
        startDate: new Date(startDate),
        ...(endDate && { endDate: new Date(endDate) }),
        isActive: isActive !== undefined ? isActive : true
    };

    doctor.hospitalAffiliations.push(newAffiliation);
    await doctor.save();

    logger.info(`Hospital affiliation added for doctor: ${doctor.doctorId}`);

    res.status(201).json({
        status: 'success',
        message: 'Hospital affiliation added successfully',
        data: {
            hospitalAffiliations: doctor.hospitalAffiliations
        }
    });
});

/**
 * Update hospital affiliation
 * @route PUT /api/v1/doctors/me/affiliations/:affiliationId
 * @access Private (Doctor only)
 */
const updateHospitalAffiliation = catchAsync(async (req, res, next) => {
    const { affiliationId } = req.params;
    const { name, department, startDate, endDate, isActive } = req.body;

    const doctor = await Doctor.findById(req.user._id);
    if (!doctor) {
        return next(new AppError('Doctor not found', 404));
    }

    const affiliation = doctor.hospitalAffiliations.id(affiliationId);
    if (!affiliation) {
        return next(new AppError('Hospital affiliation not found', 404));
    }

    if (endDate && startDate && new Date(endDate) <= new Date(startDate)) {
        return next(new AppError('End date must be after start date', 400));
    }

    // Update fields if provided
    if (name) affiliation.name = name;
    if (department) affiliation.department = department;
    if (startDate) affiliation.startDate = new Date(startDate);
    if (endDate !== undefined) affiliation.endDate = endDate ? new Date(endDate) : null;
    if (isActive !== undefined) affiliation.isActive = isActive;

    await doctor.save();

    logger.info(`Hospital affiliation updated for doctor: ${doctor.doctorId}`);

    res.status(200).json({
        status: 'success',
        message: 'Hospital affiliation updated successfully',
        data: {
            hospitalAffiliations: doctor.hospitalAffiliations
        }
    });
});

/**
 * Remove hospital affiliation
 * @route DELETE /api/v1/doctors/me/affiliations/:affiliationId
 * @access Private (Doctor only)
 */
const removeHospitalAffiliation = catchAsync(async (req, res, next) => {
    const { affiliationId } = req.params;

    const doctor = await Doctor.findById(req.user._id);
    if (!doctor) {
        return next(new AppError('Doctor not found', 404));
    }

    const affiliationIndex = doctor.hospitalAffiliations.findIndex(
        a => a._id.toString() === affiliationId
    );

    if (affiliationIndex === -1) {
        return next(new AppError('Hospital affiliation not found', 404));
    }

    doctor.hospitalAffiliations.splice(affiliationIndex, 1);
    await doctor.save();

    logger.info(`Hospital affiliation removed for doctor: ${doctor.doctorId}`);

    res.status(200).json({
        status: 'success',
        message: 'Hospital affiliation removed successfully',
        data: {
            hospitalAffiliations: doctor.hospitalAffiliations
        }
    });
});

/**
 * Get doctor's statistics and performance metrics
 * @route GET /api/v1/doctors/me/stats
 * @access Private (Doctor only)
 */
const getDoctorStats = catchAsync(async (req, res, next) => {
    const doctor = await Doctor.findById(req.user._id);
    if (!doctor) {
        return next(new AppError('Doctor not found', 404));
    }

    const stats = {
        basic: {
            doctorId: doctor.doctorId,
            fullName: doctor.fullName,
            specialization: doctor.specialization,
            experienceYears: doctor.experienceYears,
            calculatedExperience: doctor.calculatedExperience,
            status: doctor.status,
            isVerified: doctor.isVerified,
            createdAt: doctor.createdAt
        },
        performance: {
            curedPatientsCount: doctor.curedPatientsCount,
            averageRating: doctor.averageRating,
            totalReviews: doctor.totalReviews,
            curedDiseases: doctor.curedDiseases
        },
        professional: {
            qualificationsCount: doctor.qualifications.length,
            hospitalAffiliationsCount: doctor.hospitalAffiliations.length,
            activeAffiliationsCount: doctor.hospitalAffiliations.filter(a => a.isActive).length
        },
        availability: {
            totalAvailableDays: doctor.availability.length,
            totalTimeSlots: doctor.availability.reduce((total, day) => total + (day.slots ? day.slots.length : 0), 0)
        },
        account: {
            isEmailVerified: doctor.isEmailVerified,
            isActive: doctor.isActive,
            lastLoginAt: doctor.lastLoginAt,
            verifiedAt: doctor.verifiedAt,
            verifiedBy: doctor.verifiedBy
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
 * Get available time slots for a specific day
 * @route GET /api/v1/doctors/me/availability/:day
 * @access Private (Doctor only)
 */
const getAvailabilityByDay = catchAsync(async (req, res, next) => {
    const { day } = req.params;

    if (!DAYS_OF_WEEK.includes(day)) {
        return next(new AppError('Invalid day. Must be one of: ' + DAYS_OF_WEEK.join(', '), 400));
    }

    const doctor = await Doctor.findById(req.user._id);
    if (!doctor) {
        return next(new AppError('Doctor not found', 404));
    }

    const dayAvailability = doctor.availability.find(avail => avail.day === day);

    res.status(200).json({
        status: 'success',
        data: {
            day,
            availability: dayAvailability || { day, slots: [], patientsCount: 0 }
        }
    });
});

/**
 * Toggle doctor's active status (temporarily disable/enable)
 * @route PATCH /api/v1/doctors/me/toggle-status
 * @access Private (Doctor only)
 */
const toggleActiveStatus = catchAsync(async (req, res, next) => {
    const doctor = await Doctor.findById(req.user._id);
    if (!doctor) {
        return next(new AppError('Doctor not found', 404));
    }

    doctor.isActive = !doctor.isActive;
    await doctor.save();

    logger.info(`Doctor status toggled: ${doctor.doctorId} - Active: ${doctor.isActive}`);

    res.status(200).json({
        status: 'success',
        message: `Account ${doctor.isActive ? 'activated' : 'deactivated'} successfully`,
        data: {
            isActive: doctor.isActive
        }
    });
});

/**
 * Update notification preferences
 * @route PUT /api/v1/doctors/me/notifications
 * @access Private (Doctor only)
 */
const updateNotificationPreferences = catchAsync(async (req, res, next) => {
    const { email, sms, push } = req.body;

    const updateData = {};
    if (email !== undefined) updateData['notificationPreferences.email'] = email;
    if (sms !== undefined) updateData['notificationPreferences.sms'] = sms;
    if (push !== undefined) updateData['notificationPreferences.push'] = push;

    const doctor = await Doctor.findByIdAndUpdate(
        req.user._id,
        { $set: updateData },
        {
            new: true,
            runValidators: true
        }
    );

    if (!doctor) {
        return next(new AppError('Doctor not found', 404));
    }

    logger.info(`Notification preferences updated: ${doctor.doctorId}`);

    res.status(200).json({
        status: 'success',
        message: 'Notification preferences updated successfully',
        data: {
            notificationPreferences: doctor.notificationPreferences
        }
    });
});

module.exports = {
    getMyProfile,
    updateBasicInfo,
    updateProfessionalInfo,
    updateAvailability,
    addQualification,
    removeQualification,
    addHospitalAffiliation,
    updateHospitalAffiliation,
    removeHospitalAffiliation,
    getDoctorStats,
    getAvailabilityByDay,
    toggleActiveStatus,
    updateNotificationPreferences
};
