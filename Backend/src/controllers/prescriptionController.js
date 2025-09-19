/**
 * Prescription Controller
 * Handles all prescription management operations
 */

const mongoose = require('mongoose');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const Prescription = require('../models/Prescription');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const logger = require('../utils/logger');

/**
 * Create a new prescription
 * @route POST /api/v1/prescriptions
 * @access Private (Doctor only)
 */
const createPrescription = catchAsync(async (req, res, next) => {
    const {
        patientId,
        appointmentId,
        medicines,
        medicalTests,
        diagnosis,
        vitalSigns,
        followUp,
        clinicalNotes,
        isEmergency,
        priority,
        validUntil
    } = req.body;

    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
        return next(new AppError('Patient not found', 404));
    }

    // Verify appointment if provided
    let appointment = null;
    if (appointmentId) {
        appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return next(new AppError('Appointment not found', 404));
        }

        // Check if doctor is authorized for this appointment
        if (appointment.doctor.toString() !== req.user._id.toString()) {
            return next(new AppError('You can only create prescriptions for your own appointments', 403));
        }
    }

    // Create prescription
    const prescription = await Prescription.create({
        patient: patientId,
        doctor: req.user._id,
        appointment: appointmentId,
        medicines: medicines || [],
        medicalTests: medicalTests || [],
        diagnosis,
        vitalSigns,
        followUp,
        clinicalNotes,
        isEmergency: isEmergency || false,
        priority: priority || 'medium',
        validUntil,
        lastModifiedBy: {
            userId: req.user._id,
            userType: 'Doctor',
            action: 'created'
        }
    });

    await prescription.populate([
        { path: 'patient', select: 'fullName phone email age bloodGroup' },
        { path: 'doctor', select: 'fullName specialization phone email' },
        { path: 'appointment', select: 'appointmentId appointmentDate timeSlot' }
    ]);

    logger.info(`Prescription created: ${prescription.prescriptionId} by doctor ${req.user.doctorId}`);

    res.status(201).json({
        status: 'success',
        message: 'Prescription created successfully',
        data: {
            prescription
        }
    });
});

/**
 * Get all prescriptions for the authenticated patient
 * @route GET /api/v1/prescriptions/my-prescriptions
 * @access Private (Patient only)
 */
const getMyPrescriptions = catchAsync(async (req, res, next) => {
    const { status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query = { patient: req.user._id };

    // Filter by status if provided
    if (status) {
        query.status = status;
    }

    const skip = (page - 1) * limit;
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const prescriptions = await Prescription.find(query)
        .populate('doctor', 'fullName specialization phone email')
        .populate('appointment', 'appointmentId appointmentDate timeSlot')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Prescription.countDocuments(query);

    res.status(200).json({
        status: 'success',
        data: {
            prescriptions,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalPrescriptions: total,
                hasNextPage: page * limit < total,
                hasPreviousPage: page > 1
            }
        }
    });
});

/**
 * Get all prescriptions for the authenticated doctor
 * @route GET /api/v1/prescriptions/doctor-prescriptions
 * @access Private (Doctor only)
 */
const getDoctorPrescriptions = catchAsync(async (req, res, next) => {
    const { status, patientName, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    let query = { doctor: req.user._id };

    // Filter by status if provided
    if (status) {
        query.status = status;
    }

    const skip = (page - 1) * limit;
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    let prescriptions;

    // If searching by patient name, we need to populate and filter
    if (patientName) {
        prescriptions = await Prescription.find(query)
            .populate({
                path: 'patient',
                match: { fullName: { $regex: patientName, $options: 'i' } },
                select: 'fullName phone email age bloodGroup'
            })
            .populate('appointment', 'appointmentId appointmentDate timeSlot')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        // Filter out prescriptions where patient didn't match
        prescriptions = prescriptions.filter(prescription => prescription.patient !== null);
    } else {
        prescriptions = await Prescription.find(query)
            .populate('patient', 'fullName phone email age bloodGroup')
            .populate('appointment', 'appointmentId appointmentDate timeSlot')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));
    }

    const total = await Prescription.countDocuments(query);

    res.status(200).json({
        status: 'success',
        data: {
            prescriptions,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalPrescriptions: total,
                hasNextPage: page * limit < total,
                hasPreviousPage: page > 1
            }
        }
    });
});

/**
 * Get prescription details
 * @route GET /api/v1/prescriptions/:prescriptionId
 * @access Private (Patient/Doctor involved in prescription)
 */
const getPrescriptionDetails = catchAsync(async (req, res, next) => {
    const { prescriptionId } = req.params;

    const prescription = await Prescription.findOne({
        $or: [
            { prescriptionId },
            { _id: mongoose.isValidObjectId(prescriptionId) ? prescriptionId : null }
        ]
    }).populate([
        { path: 'patient', select: 'fullName phone email age bloodGroup medicalHistory' },
        { path: 'doctor', select: 'fullName specialization phone email medicalLicense' },
        { path: 'appointment', select: 'appointmentId appointmentDate timeSlot reason' }
    ]);

    if (!prescription) {
        return next(new AppError('Prescription not found', 404));
    }

    // Check authorization
    const userRole = req.user.role;
    if (userRole === 'patient' && prescription.patient._id.toString() !== req.user._id.toString()) {
        return next(new AppError('You can only view your own prescriptions', 403));
    }

    if (userRole === 'doctor' && prescription.doctor._id.toString() !== req.user._id.toString()) {
        return next(new AppError('You can only view your own prescriptions', 403));
    }

    res.status(200).json({
        status: 'success',
        data: {
            prescription
        }
    });
});

/**
 * Update prescription
 * @route PUT /api/v1/prescriptions/:prescriptionId
 * @access Private (Doctor who created the prescription)
 */
const updatePrescription = catchAsync(async (req, res, next) => {
    const { prescriptionId } = req.params;
    const {
        medicines,
        medicalTests,
        diagnosis,
        vitalSigns,
        followUp,
        clinicalNotes,
        priority,
        validUntil
    } = req.body;

    const prescription = await Prescription.findOne({
        $or: [
            { prescriptionId },
            { _id: mongoose.isValidObjectId(prescriptionId) ? prescriptionId : null }
        ]
    });

    if (!prescription) {
        return next(new AppError('Prescription not found', 404));
    }

    // Check authorization
    if (prescription.doctor.toString() !== req.user._id.toString()) {
        return next(new AppError('You can only update your own prescriptions', 403));
    }

    // Check if prescription can be updated
    if (prescription.status === 'completed' || prescription.status === 'cancelled') {
        return next(new AppError(`Cannot update ${prescription.status} prescription`, 400));
    }

    // Update prescription fields
    if (medicines) prescription.medicines = medicines;
    if (medicalTests) prescription.medicalTests = medicalTests;
    if (diagnosis) prescription.diagnosis = diagnosis;
    if (vitalSigns) prescription.vitalSigns = vitalSigns;
    if (followUp) prescription.followUp = followUp;
    if (clinicalNotes) prescription.clinicalNotes = clinicalNotes;
    if (priority) prescription.priority = priority;
    if (validUntil) prescription.validUntil = new Date(validUntil);

    prescription.lastModifiedBy = {
        userId: req.user._id,
        userType: 'Doctor',
        action: 'updated'
    };

    await prescription.save();

    await prescription.populate([
        { path: 'patient', select: 'fullName phone email age' },
        { path: 'doctor', select: 'fullName specialization' },
        { path: 'appointment', select: 'appointmentId appointmentDate timeSlot' }
    ]);

    logger.info(`Prescription updated: ${prescription.prescriptionId} by doctor ${req.user.doctorId}`);

    res.status(200).json({
        status: 'success',
        message: 'Prescription updated successfully',
        data: {
            prescription
        }
    });
});

/**
 * Add medicine to prescription
 * @route POST /api/v1/prescriptions/:prescriptionId/medicines
 * @access Private (Doctor who created the prescription)
 */
const addMedicine = catchAsync(async (req, res, next) => {
    const { prescriptionId } = req.params;
    const medicineData = req.body;

    const prescription = await Prescription.findOne({
        $or: [
            { prescriptionId },
            { _id: mongoose.isValidObjectId(prescriptionId) ? prescriptionId : null }
        ]
    });

    if (!prescription) {
        return next(new AppError('Prescription not found', 404));
    }

    // Check authorization
    if (prescription.doctor.toString() !== req.user._id.toString()) {
        return next(new AppError('You can only modify your own prescriptions', 403));
    }

    // Check if prescription can be modified
    if (prescription.status !== 'active') {
        return next(new AppError(`Cannot modify ${prescription.status} prescription`, 400));
    }

    await prescription.addMedicine(medicineData);

    prescription.lastModifiedBy = {
        userId: req.user._id,
        userType: 'Doctor',
        action: 'updated'
    };

    await prescription.save();

    logger.info(`Medicine added to prescription: ${prescription.prescriptionId}`);

    res.status(200).json({
        status: 'success',
        message: 'Medicine added to prescription successfully',
        data: {
            medicine: prescription.medicines[prescription.medicines.length - 1]
        }
    });
});

/**
 * Remove medicine from prescription
 * @route DELETE /api/v1/prescriptions/:prescriptionId/medicines/:medicineId
 * @access Private (Doctor who created the prescription)
 */
const removeMedicine = catchAsync(async (req, res, next) => {
    const { prescriptionId, medicineId } = req.params;

    const prescription = await Prescription.findOne({
        $or: [
            { prescriptionId },
            { _id: mongoose.isValidObjectId(prescriptionId) ? prescriptionId : null }
        ]
    });

    if (!prescription) {
        return next(new AppError('Prescription not found', 404));
    }

    // Check authorization
    if (prescription.doctor.toString() !== req.user._id.toString()) {
        return next(new AppError('You can only modify your own prescriptions', 403));
    }

    // Check if prescription can be modified
    if (prescription.status !== 'active') {
        return next(new AppError(`Cannot modify ${prescription.status} prescription`, 400));
    }

    const medicine = prescription.medicines.id(medicineId);
    if (!medicine) {
        return next(new AppError('Medicine not found in this prescription', 404));
    }

    await prescription.removeMedicine(medicineId);

    prescription.lastModifiedBy = {
        userId: req.user._id,
        userType: 'Doctor',
        action: 'updated'
    };

    await prescription.save();

    logger.info(`Medicine removed from prescription: ${prescription.prescriptionId}`);

    res.status(200).json({
        status: 'success',
        message: 'Medicine removed from prescription successfully'
    });
});

/**
 * Add medical test to prescription
 * @route POST /api/v1/prescriptions/:prescriptionId/tests
 * @access Private (Doctor who created the prescription)
 */
const addMedicalTest = catchAsync(async (req, res, next) => {
    const { prescriptionId } = req.params;
    const testData = req.body;

    const prescription = await Prescription.findOne({
        $or: [
            { prescriptionId },
            { _id: mongoose.isValidObjectId(prescriptionId) ? prescriptionId : null }
        ]
    });

    if (!prescription) {
        return next(new AppError('Prescription not found', 404));
    }

    // Check authorization
    if (prescription.doctor.toString() !== req.user._id.toString()) {
        return next(new AppError('You can only modify your own prescriptions', 403));
    }

    // Check if prescription can be modified
    if (prescription.status !== 'active') {
        return next(new AppError(`Cannot modify ${prescription.status} prescription`, 400));
    }

    await prescription.addMedicalTest(testData);

    prescription.lastModifiedBy = {
        userId: req.user._id,
        userType: 'Doctor',
        action: 'updated'
    };

    await prescription.save();

    logger.info(`Medical test added to prescription: ${prescription.prescriptionId}`);

    res.status(200).json({
        status: 'success',
        message: 'Medical test added to prescription successfully',
        data: {
            test: prescription.medicalTests[prescription.medicalTests.length - 1]
        }
    });
});

/**
 * Cancel prescription
 * @route DELETE /api/v1/prescriptions/:prescriptionId
 * @access Private (Doctor who created the prescription)
 */
const cancelPrescription = catchAsync(async (req, res, next) => {
    const { prescriptionId } = req.params;
    const { reason } = req.body;

    const prescription = await Prescription.findOne({
        $or: [
            { prescriptionId },
            { _id: mongoose.isValidObjectId(prescriptionId) ? prescriptionId : null }
        ]
    });

    if (!prescription) {
        return next(new AppError('Prescription not found', 404));
    }

    // Check authorization
    if (prescription.doctor.toString() !== req.user._id.toString()) {
        return next(new AppError('You can only cancel your own prescriptions', 403));
    }

    // Check if prescription can be cancelled
    if (prescription.status === 'cancelled' || prescription.status === 'completed') {
        return next(new AppError(`Cannot cancel ${prescription.status} prescription`, 400));
    }

    await prescription.cancelPrescription(reason || 'Cancelled by doctor');

    prescription.lastModifiedBy = {
        userId: req.user._id,
        userType: 'Doctor',
        action: 'cancelled'
    };

    await prescription.save();

    logger.info(`Prescription cancelled: ${prescription.prescriptionId} by doctor ${req.user.doctorId}`);

    res.status(200).json({
        status: 'success',
        message: 'Prescription cancelled successfully',
        data: {
            prescriptionId: prescription.prescriptionId,
            status: 'cancelled',
            reason: prescription.clinicalNotes.warningsAndPrecautions
        }
    });
});

/**
 * Get prescription statistics
 * @route GET /api/v1/prescriptions/stats
 * @access Private (Doctor only)
 */
const getPrescriptionStats = catchAsync(async (req, res, next) => {
    const { startDate, endDate } = req.query;

    let matchQuery = { doctor: req.user._id };

    // Date range filter
    if (startDate && endDate) {
        matchQuery.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    } else {
        // Default to current month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        matchQuery.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
    }

    const stats = await Prescription.aggregate([
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
                                date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
                            },
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { "_id.date": 1 } }
                ],
                totalStats: [
                    {
                        $group: {
                            _id: null,
                            totalPrescriptions: { $sum: 1 },
                            activePrescriptions: {
                                $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] }
                            },
                            completedPrescriptions: {
                                $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
                            },
                            emergencyPrescriptions: {
                                $sum: { $cond: ["$isEmergency", 1, 0] }
                            },
                            averageMedicinesPerPrescription: { $avg: { $size: "$medicines" } }
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
                totalPrescriptions: totalStats.totalPrescriptions || 0,
                activePrescriptions: totalStats.activePrescriptions || 0,
                completedPrescriptions: totalStats.completedPrescriptions || 0,
                completionRate: totalStats.totalPrescriptions ?
                    ((totalStats.completedPrescriptions / totalStats.totalPrescriptions) * 100).toFixed(2) + '%' : '0%',
                emergencyPrescriptions: totalStats.emergencyPrescriptions || 0,
                averageMedicinesPerPrescription: totalStats.averageMedicinesPerPrescription ?
                    totalStats.averageMedicinesPerPrescription.toFixed(1) : '0'
            },
            breakdown: {
                byStatus: result.statusBreakdown,
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

/**
 * Get any prescription details by ID (Doctor access to any prescription)
 * @route GET /api/v1/prescriptions/doctor-view/:prescriptionId
 * @access Private (Doctor only - can view any prescription)
 */
const getDoctorPrescriptionView = catchAsync(async (req, res, next) => {
    const { prescriptionId } = req.params;

    const prescription = await Prescription.findOne({
        $or: [
            { prescriptionId },
            { _id: mongoose.isValidObjectId(prescriptionId) ? prescriptionId : null }
        ]
    }).populate([
        { path: 'patient', select: 'fullName phone email age bloodGroup medicalHistory allergies emergencyContact' },
        { path: 'doctor', select: 'fullName specialization phone email medicalLicense' },
        { path: 'appointment', select: 'appointmentId appointmentDate timeSlot reason' }
    ]);

    if (!prescription) {
        return next(new AppError('Prescription not found', 404));
    }

    // Doctors can view any prescription for medical purposes
    // This enables cross-doctor consultation, emergency access, etc.

    res.status(200).json({
        status: 'success',
        data: {
            prescription: {
                prescriptionId: prescription.prescriptionId,
                status: prescription.status,
                patient: prescription.patient,
                doctor: prescription.doctor,
                appointment: prescription.appointment,
                diagnosis: prescription.diagnosis,
                medicines: prescription.medicines,
                medicalTests: prescription.medicalTests,
                vitalSigns: prescription.vitalSigns,
                followUp: prescription.followUp,
                clinicalNotes: prescription.clinicalNotes,
                isEmergency: prescription.isEmergency,
                priority: prescription.priority,
                digitalSignature: prescription.digitalSignature,
                dispensing: prescription.dispensing,
                validUntil: prescription.validUntil,
                prescribedAt: prescription.prescribedAt,
                createdAt: prescription.createdAt,
                updatedAt: prescription.updatedAt,
                lastModifiedBy: prescription.lastModifiedBy
            }
        }
    });
});

/**
 * Get all prescriptions for a specific patient (Doctor consultation access)
 * @route GET /api/v1/prescriptions/patient/:patientId
 * @access Private (Doctor only - can view any patient's prescription history)
 */
const getPatientPrescriptionHistory = catchAsync(async (req, res, next) => {
    const { patientId } = req.params;
    const { status, page = 1, limit = 10, sortBy = 'prescribedAt', sortOrder = 'desc' } = req.query;

    // Build query for patient lookup
    const patientQuery = mongoose.isValidObjectId(patientId)
        ? { _id: patientId }
        : { patientId: patientId };

    // First, verify the patient exists
    const Patient = require('../models/Patient');
    const patient = await Patient.findOne(patientQuery).select('fullName phone email age bloodGroup');

    if (!patient) {
        return next(new AppError('Patient not found', 404));
    }

    // Build prescription query
    const query = { patient: patient._id };

    if (status && status !== 'all') {
        query.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get prescriptions with populated data
    const prescriptions = await Prescription.find(query)
        .populate([
            { path: 'doctor', select: 'fullName specialization phone email' },
            { path: 'appointment', select: 'appointmentId appointmentDate timeSlot' }
        ])
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

    // Get total count for pagination
    const total = await Prescription.countDocuments(query);

    // Format response data
    const formattedPrescriptions = prescriptions.map(prescription => ({
        prescriptionId: prescription.prescriptionId,
        status: prescription.status,
        diagnosis: prescription.diagnosis,
        doctor: prescription.doctor,
        appointment: prescription.appointment,
        medicineCount: prescription.medicines ? prescription.medicines.length : 0,
        testCount: prescription.medicalTests ? prescription.medicalTests.length : 0,
        isEmergency: prescription.isEmergency,
        priority: prescription.priority,
        prescribedAt: prescription.prescribedAt,
        createdAt: prescription.createdAt,
        validUntil: prescription.validUntil
    }));

    res.status(200).json({
        status: 'success',
        data: {
            patient: {
                _id: patient._id,
                fullName: patient.fullName,
                phone: patient.phone,
                email: patient.email,
                age: patient.age,
                bloodGroup: patient.bloodGroup
            },
            prescriptions: formattedPrescriptions,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalPrescriptions: total,
                hasNextPage: page * limit < total,
                hasPreviousPage: page > 1
            }
        }
    });
});

module.exports = {
    createPrescription,
    getMyPrescriptions,
    getDoctorPrescriptions,
    getPrescriptionDetails,
    getDoctorPrescriptionView,
    getPatientPrescriptionHistory,
    updatePrescription,
    addMedicine,
    removeMedicine,
    addMedicalTest,
    cancelPrescription,
    getPrescriptionStats
};
