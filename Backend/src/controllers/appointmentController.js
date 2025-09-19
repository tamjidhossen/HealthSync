/**
 * Appointment Controller
 * Handles all appointment management operations
 */

const mongoose = require('mongoose');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const logger = require('../utils/logger');
const { APPOINTMENT_STATUS, APPOINTMENT_MODE, TIME_SLOTS } = require('../utils/constants');

/**
 * Book a new appointment
 * @route POST /api/v1/appointments/book
 * @access Private (Patient only)
 */
const bookAppointment = catchAsync(async (req, res, next) => {
    const {
        doctorId,
        appointmentDate,
        timeSlot
    } = req.body;

    // Verify doctor exists and is active
    const doctor = await Doctor.findOne({ doctorId: doctorId });
    if (!doctor || !doctor.isActive || doctor.status !== 'approved') {
        return next(new AppError('Doctor not found or not available', 404));
    }

    const appointmentCount = await Appointment.countDocuments({
        doctor: doctor._id,
        appointmentDate: new Date(appointmentDate),
        timeSlot: timeSlot,
    });


    const dayOfWeek = new Date(appointmentDate).toLocaleString("en-US", { weekday: "long" });
    // e.g., "Monday"

    const availabilityForDay = doctor.availability.find(a => a.day === dayOfWeek);

    if (!availabilityForDay) {
        throw new Error(`Doctor is not available on ${dayOfWeek}`);
    }

    // Default patients allowed per slot
    const slotCapacity = availabilityForDay.patientsCount;
    if (appointmentCount < slotCapacity) {
        // ✅ Can book appointment
        const newAppointment = await Appointment.create({
            doctor: doctor._id,
            appointmentDate: new Date(appointmentDate),
            timeSlot,
            patient: req.user._id,
        });
        console.log("Appointment booked:", newAppointment);
    } else {
        res.status(400).json({
            status: 'false',
            message: 'Slot is full.',
        });

    }
    // Check if appointment date is in the future
    const appointmentDateTime = new Date(`${appointmentDate} ${timeSlot}`);
    if (appointmentDateTime <= new Date()) {
        return next(new AppError('Appointment date and time must be in the future', 400));
    }

    // Create the appointment
    const appointment = await Appointment.create({
        patient: req.user._id,
        doctor: doctor._id,
        appointmentDate: new Date(appointmentDate),
        timeSlot
    });

    await appointment.populate([
        { path: 'doctor', select: 'fullName specialization phone email' },
        { path: 'patient', select: 'fullName phone email' }
    ]);

    logger.info(`Appointment booked: ${appointment.appointmentId} for patient ${req.user.patientId}`);

    res.status(201).json({
        status: 'success',
        message: 'Appointment booked successfully',
        data: {
            appointment
        }
    });
});

/**
 * Get patient's appointments
 * @route GET /api/v1/appointments/my-appointments
 * @access Private (Patient only)
 */
const getMyAppointments = catchAsync(async (req, res, next) => {
    const { status, upcoming, page = 1, limit = 10 } = req.query;

    const query = { patient: req.user._id };

    if (status) {
        query.status = status;
    }

    if (upcoming === 'true') {
        query.appointmentDate = { $gte: new Date() };
        query.status = { $in: ['requested', 'confirmed'] };
    }

    const skip = (page - 1) * limit;

    const appointments = await Appointment.find(query)
        .populate('doctor', 'fullName specialization phone email')
        .sort({ appointmentDate: -1, timeSlot: 1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.status(200).json({
        status: 'success',
        data: {
            appointments,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalAppointments: total,
                hasNextPage: page * limit < total,
                hasPreviousPage: page > 1
            }
        }
    });
});

/**
 * Get doctor's appointments
 * @route GET /api/v1/appointments/doctor-appointments
 * @access Private (Doctor only)
 */
const getDoctorAppointments = catchAsync(async (req, res, next) => {
    const { status, date, upcoming, page = 1, limit = 10 } = req.query;

    const query = { doctor: req.user._id };

    if (status) {
        query.status = status;
    }

    if (date) {
        const targetDate = new Date(date);
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);
        query.appointmentDate = { $gte: targetDate, $lt: nextDay };
    }

    if (upcoming === 'true') {
        query.appointmentDate = { $gte: new Date() };
        query.status = { $in: ['requested', 'confirmed'] };
    }

    const skip = (page - 1) * limit;

    const appointments = await Appointment.find(query)
        .populate('patient', 'fullName phone email age bloodGroup')
        .sort({ appointmentDate: 1, timeSlot: 1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.status(200).json({
        status: 'success',
        data: {
            appointments,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalAppointments: total,
                hasNextPage: page * limit < total,
                hasPreviousPage: page > 1
            }
        }
    });
});

/**
 * Get appointment details
 * @route GET /api/v1/appointments/:appointmentId
 * @access Private (Patient/Doctor involved in appointment)
 */
const getAppointmentDetails = catchAsync(async (req, res, next) => {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findOne({
        $or: [
            { appointmentId },
            { _id: mongoose.isValidObjectId(appointmentId) ? appointmentId : null }
        ]
    }).populate([
        { path: 'doctor', select: 'fullName specialization phone email experienceYears' },
        { path: 'patient', select: 'fullName phone email age bloodGroup medicalHistory' }
    ]);

    if (!appointment) {
        return next(new AppError('Appointment not found', 404));
    }

    // Check if user is authorized to view this appointment
    const userRole = req.user.role;
    if (userRole === 'patient' && appointment.patient._id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to view this appointment', 403));
    }

    if (userRole === 'doctor' && appointment.doctor._id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to view this appointment', 403));
    }

    res.status(200).json({
        status: 'success',
        data: {
            appointment
        }
    });
});

/**
 * Update appointment status (Doctor/Admin only)
 * @route PATCH /api/v1/appointments/:appointmentId/status
 * @access Private (Doctor/Admin)
 */
const updateAppointmentStatus = catchAsync(async (req, res, next) => {
    const { appointmentId } = req.params;
    const { status, reason, doctorNotes } = req.body;

    const appointment = await Appointment.findOne({
        $or: [
            { appointmentId },
            { _id: mongoose.isValidObjectId(appointmentId) ? appointmentId : null }
        ]
    });

    if (!appointment) {
        return next(new AppError('Appointment not found', 404));
    }

    // Check authorization for doctors
    if (req.user.role === 'doctor' && appointment.doctor.toString() !== req.user._id.toString()) {
        return next(new AppError('You can only update your own appointments', 403));
    }

    // Status transition validation
    const validTransitions = {
        'requested': ['confirmed', 'cancelled'],
        'confirmed': ['completed', 'cancelled', 'no-show'],
        'completed': ['completed'], // Allow updates to completed appointments
        'cancelled': [], // Cannot change cancelled appointments
        'no-show': [], // Cannot change no-show appointments
        'rescheduled': ['requested']
    };

    if (!validTransitions[appointment.status].includes(status)) {
        return next(new AppError(`Cannot change status from ${appointment.status} to ${status}`, 400));
    }

    // Update appointment based on status
    appointment.status = status;
    appointment.lastModifiedBy = {
        userId: req.user._id,
        userType: req.user.role === 'doctor' ? 'Doctor' : 'Admin'
    };

    switch (status) {
        case 'confirmed':
            appointment.scheduling.confirmedAt = new Date();
            break;
        case 'completed':
            appointment.scheduling.completedAt = new Date();
            if (doctorNotes) {
                appointment.medicalNotes.doctorNotes = doctorNotes;
            }
            break;
        case 'cancelled':
            appointment.scheduling.cancelledAt = new Date();
            if (reason) {
                appointment.scheduling.cancellationReason = reason;
            }
            break;
        case 'no-show':
            if (reason) {
                appointment.scheduling.noShowReason = reason;
            }
            break;
    }

    await appointment.save();

    await appointment.populate([
        { path: 'doctor', select: 'fullName specialization' },
        { path: 'patient', select: 'fullName phone email' }
    ]);

    logger.info(`Appointment status updated: ${appointment.appointmentId} to ${status} by ${req.user.role}`);

    res.status(200).json({
        status: 'success',
        message: `Appointment ${status} successfully`,
        data: {
            appointment
        }
    });
});

/**
 * Cancel appointment
 * @route DELETE /api/v1/appointments/:appointmentId
 * @access Private (Patient/Doctor involved)
 */
const cancelAppointment = catchAsync(async (req, res, next) => {
    const { appointmentId } = req.params;
    const { reason } = req.body;

    const appointment = await Appointment.findOne({
        $or: [
            { appointmentId },
            { _id: mongoose.isValidObjectId(appointmentId) ? appointmentId : null }
        ]
    });

    if (!appointment) {
        return next(new AppError('Appointment not found', 404));
    }

    // Check authorization
    const userRole = req.user.role;
    if (userRole === 'patient' && appointment.patient.toString() !== req.user._id.toString()) {
        return next(new AppError('You can only cancel your own appointments', 403));
    }

    if (userRole === 'doctor' && appointment.doctor.toString() !== req.user._id.toString()) {
        return next(new AppError('You can only cancel your own appointments', 403));
    }

    // Check if appointment can be cancelled
    if (!['requested', 'confirmed'].includes(appointment.status)) {
        return next(new AppError('Only requested or confirmed appointments can be cancelled', 400));
    }

    // Cancel the appointment
    await appointment.cancelAppointment(reason, {
        userId: req.user._id,
        userType: req.user.role === 'doctor' ? 'Doctor' : 'Patient'
    });

    logger.info(`Appointment cancelled: ${appointment.appointmentId} by ${userRole}`);

    res.status(200).json({
        status: 'success',
        message: 'Appointment cancelled successfully',
        data: {
            appointmentId: appointment.appointmentId,
            status: 'cancelled',
            cancelledAt: appointment.scheduling.cancelledAt
        }
    });
});

/**
 * Reschedule appointment
 * @route PUT /api/v1/appointments/:appointmentId/reschedule
 * @access Private (Patient/Doctor involved)
 */
const rescheduleAppointment = catchAsync(async (req, res, next) => {
    const { appointmentId } = req.params;
    const { appointmentDate, timeSlot, reason } = req.body;

    const appointment = await Appointment.findOne({
        $or: [
            { appointmentId },
            { _id: mongoose.isValidObjectId(appointmentId) ? appointmentId : null }
        ]
    });

    if (!appointment) {
        return next(new AppError('Appointment not found', 404));
    }

    // Check authorization
    const userRole = req.user.role;
    if (userRole === 'patient' && appointment.patient.toString() !== req.user._id.toString()) {
        return next(new AppError('You can only reschedule your own appointments', 403));
    }

    if (userRole === 'doctor' && appointment.doctor.toString() !== req.user._id.toString()) {
        return next(new AppError('You can only reschedule your own appointments', 403));
    }

    // Check if appointment can be rescheduled
    if (!['requested', 'confirmed'].includes(appointment.status)) {
        return next(new AppError('Only requested or confirmed appointments can be rescheduled', 400));
    }

    // Check if new slot is available
    const existingAppointment = await Appointment.findOne({
        doctor: appointment.doctor,
        appointmentDate: new Date(appointmentDate),
        timeSlot,
        status: { $in: ['requested', 'confirmed'] },
        _id: { $ne: appointment._id }
    });

    if (existingAppointment) {
        return next(new AppError('The new time slot is already booked', 409));
    }

    // Check if new appointment time is in the future
    const newAppointmentDateTime = new Date(`${appointmentDate} ${timeSlot}`);
    if (newAppointmentDateTime <= new Date()) {
        return next(new AppError('New appointment date and time must be in the future', 400));
    }

    // Reschedule the appointment
    await appointment.rescheduleAppointment(appointmentDate, timeSlot, reason);

    await appointment.populate([
        { path: 'doctor', select: 'fullName specialization' },
        { path: 'patient', select: 'fullName phone email' }
    ]);

    logger.info(`Appointment rescheduled: ${appointment.appointmentId} by ${userRole}`);

    res.status(200).json({
        status: 'success',
        message: 'Appointment rescheduled successfully',
        data: {
            appointment
        }
    });
});

/**
 * Get available time slots for a doctor on a specific date
 * @route GET /api/v1/appointments/available-slots/:doctorId/:date
 * @access Private
 */
const getAvailableSlots = catchAsync(async (req, res, next) => {
    const { doctorId, date } = req.params;

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
        return next(new AppError('Doctor not found', 404));
    }

    // Get booked slots for the date
    const bookedAppointments = await Appointment.find({
        doctor: doctorId,
        appointmentDate: new Date(date),
        status: { $in: ['requested', 'confirmed'] }
    }).select('timeSlot');

    const bookedSlots = bookedAppointments.map(app => app.timeSlot);

    // Get doctor's availability for the day
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const doctorAvailability = doctor.availability?.find(avail => avail.day === dayOfWeek);

    let availableSlots = TIME_SLOTS;

    // Filter slots based on doctor's availability
    if (doctorAvailability && doctorAvailability.slots && doctorAvailability.slots.length > 0) {
        availableSlots = doctorAvailability.slots;
    }

    // Remove booked slots
    availableSlots = availableSlots.filter(slot => !bookedSlots.includes(slot));

    res.status(200).json({
        status: 'success',
        data: {
            doctorId,
            date,
            availableSlots,
            totalSlots: availableSlots.length,
            doctorAvailability: doctorAvailability || null
        }
    });
});

/**
 * Add medical notes to appointment
 * @route PUT /api/v1/appointments/:appointmentId/notes
 * @access Private (Doctor only for doctor notes, Patient only for patient notes)
 */
const addMedicalNotes = catchAsync(async (req, res, next) => {
    const { appointmentId } = req.params;
    const { doctorNotes, patientNotes, treatmentPlan, followUpInstructions } = req.body;

    const appointment = await Appointment.findOne({
        $or: [
            { appointmentId },
            { _id: mongoose.isValidObjectId(appointmentId) ? appointmentId : null }
        ]
    });

    if (!appointment) {
        return next(new AppError('Appointment not found', 404));
    }

    const userRole = req.user.role;

    // Check authorization and update appropriate notes
    if (userRole === 'doctor') {
        if (appointment.doctor.toString() !== req.user._id.toString()) {
            return next(new AppError('You can only add notes to your own appointments', 403));
        }

        if (doctorNotes) appointment.medicalNotes.doctorNotes = doctorNotes;
        if (treatmentPlan) appointment.medicalNotes.treatmentPlan = treatmentPlan;
        if (followUpInstructions) appointment.medicalNotes.followUpInstructions = followUpInstructions;

    } else if (userRole === 'patient') {
        if (appointment.patient.toString() !== req.user._id.toString()) {
            return next(new AppError('You can only add notes to your own appointments', 403));
        }

        if (patientNotes) appointment.medicalNotes.patientNotes = patientNotes;

    } else {
        return next(new AppError('Unauthorized to add notes', 403));
    }

    appointment.lastModifiedBy = {
        userId: req.user._id,
        userType: userRole === 'doctor' ? 'Doctor' : 'Patient'
    };

    await appointment.save();

    logger.info(`Medical notes added to appointment: ${appointment.appointmentId} by ${userRole}`);

    res.status(200).json({
        status: 'success',
        message: 'Medical notes updated successfully',
        data: {
            medicalNotes: appointment.medicalNotes
        }
    });
});

/**
 * Add feedback and rating for appointment
 * @route POST /api/v1/appointments/:appointmentId/feedback
 * @access Private (Patient/Doctor)
 */
const addAppointmentFeedback = catchAsync(async (req, res, next) => {
    const { appointmentId } = req.params;
    const { rating, review, serviceRating, recommendToOthers } = req.body;

    const appointment = await Appointment.findOne({
        $or: [
            { appointmentId },
            { _id: mongoose.isValidObjectId(appointmentId) ? appointmentId : null }
        ]
    });

    if (!appointment) {
        return next(new AppError('Appointment not found', 404));
    }

    // Check if appointment is completed
    if (appointment.status !== 'completed') {
        return next(new AppError('Feedback can only be added to completed appointments', 400));
    }

    const userRole = req.user.role;

    // Update appropriate feedback based on user role
    if (userRole === 'patient') {
        if (appointment.patient.toString() !== req.user._id.toString()) {
            return next(new AppError('You can only provide feedback for your own appointments', 403));
        }

        appointment.feedback.patientRating = rating;
        appointment.feedback.patientReview = review;
        if (serviceRating !== undefined) appointment.feedback.serviceRating = serviceRating;
        if (recommendToOthers !== undefined) appointment.feedback.recommendToOthers = recommendToOthers;

    } else if (userRole === 'doctor') {
        if (appointment.doctor.toString() !== req.user._id.toString()) {
            return next(new AppError('You can only provide feedback for your own appointments', 403));
        }

        appointment.feedback.doctorRating = rating;
        appointment.feedback.doctorReview = review;

    } else {
        return next(new AppError('Unauthorized to add feedback', 403));
    }

    await appointment.save();

    logger.info(`Feedback added to appointment: ${appointment.appointmentId} by ${userRole}`);

    res.status(200).json({
        status: 'success',
        message: 'Feedback submitted successfully',
        data: {
            feedback: appointment.feedback
        }
    });
});

/**
 * Get appointment statistics
 * @route GET /api/v1/appointments/stats
 * @access Private (Doctor/Admin)
 */
const getAppointmentStats = catchAsync(async (req, res, next) => {
    const { startDate, endDate } = req.query;
    const userRole = req.user.role;

    let matchQuery = {};

    // For doctors, only show their own appointments
    if (userRole === 'doctor') {
        matchQuery.doctor = req.user._id;
    }

    // Date range filter
    if (startDate && endDate) {
        matchQuery.appointmentDate = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    } else {
        // Default to current month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        matchQuery.appointmentDate = { $gte: startOfMonth, $lte: endOfMonth };
    }

    const stats = await Appointment.aggregate([
        { $match: matchQuery },
        {
            $facet: {
                statusBreakdown: [
                    {
                        $group: {
                            _id: '$status',
                            count: { $sum: 1 }
                        }
                    }
                ],
                modeBreakdown: [
                    {
                        $group: {
                            _id: '$mode',
                            count: { $sum: 1 }
                        }
                    }
                ],
                typeBreakdown: [
                    {
                        $group: {
                            _id: '$appointmentType',
                            count: { $sum: 1 }
                        }
                    }
                ],
                priorityBreakdown: [
                    {
                        $group: {
                            _id: '$priority',
                            count: { $sum: 1 }
                        }
                    }
                ],
                dailyStats: [
                    {
                        $group: {
                            _id: {
                                date: { $dateToString: { format: "%Y-%m-%d", date: "$appointmentDate" } }
                            },
                            count: { $sum: 1 },
                            completed: {
                                $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
                            },
                            cancelled: {
                                $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] }
                            }
                        }
                    },
                    { $sort: { "_id.date": 1 } }
                ],
                totalStats: [
                    {
                        $group: {
                            _id: null,
                            totalAppointments: { $sum: 1 },
                            completedAppointments: {
                                $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
                            },
                            cancelledAppointments: {
                                $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] }
                            },
                            averageRating: { $avg: "$feedback.patientRating" },
                            emergencyAppointments: {
                                $sum: { $cond: ["$isEmergency", 1, 0] }
                            }
                        }
                    }
                ]
            }
        }
    ]);

    const result = stats[0];
    const totalStats = result.totalStats[0] || {};

    res.status(200).json({
        status: 'success',
        data: {
            summary: {
                totalAppointments: totalStats.totalAppointments || 0,
                completedAppointments: totalStats.completedAppointments || 0,
                cancelledAppointments: totalStats.cancelledAppointments || 0,
                completionRate: totalStats.totalAppointments ?
                    ((totalStats.completedAppointments / totalStats.totalAppointments) * 100).toFixed(2) + '%' : '0%',
                averageRating: totalStats.averageRating ? totalStats.averageRating.toFixed(2) : 'No ratings yet',
                emergencyAppointments: totalStats.emergencyAppointments || 0
            },
            breakdown: {
                byStatus: result.statusBreakdown,
                byMode: result.modeBreakdown,
                byType: result.typeBreakdown,
                byPriority: result.priorityBreakdown
            },
            dailyStats: result.dailyStats,
            period: {
                startDate: startDate || 'Current month start',
                endDate: endDate || 'Current month end'
            }
        }
    });
});

module.exports = {
    bookAppointment,
    getMyAppointments,
    getDoctorAppointments,
    getAppointmentDetails,
    updateAppointmentStatus,
    cancelAppointment,
    rescheduleAppointment,
    getAvailableSlots,
    addMedicalNotes,
    addAppointmentFeedback,
    getAppointmentStats
};
