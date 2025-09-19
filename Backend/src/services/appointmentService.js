/**
 * Appointment Service
 * Business logic for appointment management operations
 */

const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const logger = require('../utils/logger');
const { TIME_SLOTS, APPOINTMENT_STATUS } = require('../utils/constants');

/**
 * Get comprehensive appointment analytics
 */
const getAppointmentAnalytics = async (filters = {}) => {
    try {
        const matchStage = {};

        if (filters.doctorId) matchStage.doctor = filters.doctorId;
        if (filters.patientId) matchStage.patient = filters.patientId;
        if (filters.startDate && filters.endDate) {
            matchStage.appointmentDate = {
                $gte: new Date(filters.startDate),
                $lte: new Date(filters.endDate)
            };
        }

        const analytics = await Appointment.aggregate([
            { $match: matchStage },
            {
                $facet: {
                    // Overall metrics
                    overallMetrics: [
                        {
                            $group: {
                                _id: null,
                                totalAppointments: { $sum: 1 },
                                completedAppointments: {
                                    $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                                },
                                cancelledAppointments: {
                                    $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
                                },
                                noShowAppointments: {
                                    $sum: { $cond: [{ $eq: ['$status', 'no-show'] }, 1, 0] }
                                },
                                emergencyAppointments: {
                                    $sum: { $cond: ['$isEmergency', 1, 0] }
                                },
                                averagePatientRating: { $avg: '$feedback.patientRating' },
                                averageServiceRating: { $avg: '$feedback.serviceRating' },
                                totalRevenue: { $sum: '$billing.consultationFee' }
                            }
                        }
                    ],

                    // Monthly trends
                    monthlyTrends: [
                        {
                            $group: {
                                _id: {
                                    year: { $year: '$appointmentDate' },
                                    month: { $month: '$appointmentDate' }
                                },
                                appointmentCount: { $sum: 1 },
                                completedCount: {
                                    $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                                },
                                revenue: { $sum: '$billing.consultationFee' }
                            }
                        },
                        { $sort: { '_id.year': 1, '_id.month': 1 } }
                    ],

                    // Popular time slots
                    timeSlotAnalysis: [
                        {
                            $group: {
                                _id: '$timeSlot',
                                count: { $sum: 1 },
                                completionRate: {
                                    $avg: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                                }
                            }
                        },
                        { $sort: { count: -1 } }
                    ],

                    // Day of week patterns
                    weekdayPatterns: [
                        {
                            $addFields: {
                                dayOfWeek: { $dayOfWeek: '$appointmentDate' }
                            }
                        },
                        {
                            $group: {
                                _id: '$dayOfWeek',
                                count: { $sum: 1 },
                                avgRating: { $avg: '$feedback.patientRating' }
                            }
                        },
                        { $sort: { _id: 1 } }
                    ],

                    // Appointment type distribution
                    typeDistribution: [
                        {
                            $group: {
                                _id: '$appointmentType',
                                count: { $sum: 1 },
                                avgDuration: { $avg: '$duration' }
                            }
                        },
                        { $sort: { count: -1 } }
                    ],

                    // Mode preferences
                    modePreferences: [
                        {
                            $group: {
                                _id: '$mode',
                                count: { $sum: 1 },
                                satisfactionRate: {
                                    $avg: { $cond: [{ $gte: ['$feedback.patientRating', 4] }, 1, 0] }
                                }
                            }
                        }
                    ]
                }
            }
        ]);

        return analytics[0];
    } catch (error) {
        logger.error('Error getting appointment analytics:', error);
        throw error;
    }
};

/**
 * Check for appointment conflicts
 */
const checkAppointmentConflicts = async (doctorId, appointmentDate, timeSlot, excludeAppointmentId = null) => {
    try {
        const query = {
            doctor: doctorId,
            appointmentDate: new Date(appointmentDate),
            timeSlot,
            status: { $in: ['requested', 'confirmed'] }
        };

        if (excludeAppointmentId) {
            query._id = { $ne: excludeAppointmentId };
        }

        const existingAppointment = await Appointment.findOne(query);
        return !!existingAppointment;
    } catch (error) {
        logger.error('Error checking appointment conflicts:', error);
        throw error;
    }
};

/**
 * Get doctor's optimal time slots based on historical data
 */
const getOptimalTimeSlots = async (doctorId, date) => {
    try {
        const dayOfWeek = new Date(date).getDay(); // 0 = Sunday, 1 = Monday, etc.

        // Get historical data for this day of week
        const historicalData = await Appointment.aggregate([
            {
                $match: {
                    doctor: doctorId,
                    status: 'completed',
                    $expr: { $eq: [{ $dayOfWeek: '$appointmentDate' }, dayOfWeek] }
                }
            },
            {
                $group: {
                    _id: '$timeSlot',
                    appointmentCount: { $sum: 1 },
                    averageRating: { $avg: '$feedback.patientRating' },
                    noShowRate: {
                        $avg: { $cond: [{ $eq: ['$status', 'no-show'] }, 1, 0] }
                    }
                }
            },
            {
                $addFields: {
                    score: {
                        $multiply: [
                            '$appointmentCount',
                            { $ifNull: ['$averageRating', 3] },
                            { $subtract: [1, { $ifNull: ['$noShowRate', 0] }] }
                        ]
                    }
                }
            },
            { $sort: { score: -1 } }
        ]);

        return historicalData;
    } catch (error) {
        logger.error('Error getting optimal time slots:', error);
        throw error;
    }
};

/**
 * Calculate appointment metrics for a specific period
 */
const calculateAppointmentMetrics = async (startDate, endDate, doctorId = null) => {
    try {
        const matchQuery = {
            appointmentDate: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        };

        if (doctorId) {
            matchQuery.doctor = doctorId;
        }

        const metrics = await Appointment.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: null,
                    totalAppointments: { $sum: 1 },
                    completedAppointments: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    },
                    cancelledAppointments: {
                        $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
                    },
                    noShowAppointments: {
                        $sum: { $cond: [{ $eq: ['$status', 'no-show'] }, 1, 0] }
                    },
                    totalDuration: { $sum: '$duration' },
                    totalRevenue: { $sum: '$billing.consultationFee' },
                    averageRating: { $avg: '$feedback.patientRating' },
                    emergencyCount: { $sum: { $cond: ['$isEmergency', 1, 0] } },
                    // Mode distribution
                    inPersonCount: {
                        $sum: { $cond: [{ $eq: ['$mode', 'in-person'] }, 1, 0] }
                    },
                    telemedicineCount: {
                        $sum: { $cond: [{ $eq: ['$mode', 'telemedicine'] }, 1, 0] }
                    },
                    videoCallCount: {
                        $sum: { $cond: [{ $eq: ['$mode', 'video-call'] }, 1, 0] }
                    },
                    phoneCallCount: {
                        $sum: { $cond: [{ $eq: ['$mode', 'phone-call'] }, 1, 0] }
                    }
                }
            }
        ]);

        const result = metrics[0] || {};

        // Calculate derived metrics
        const totalAppointments = result.totalAppointments || 0;
        const completionRate = totalAppointments > 0 ?
            ((result.completedAppointments || 0) / totalAppointments * 100).toFixed(2) : 0;
        const cancellationRate = totalAppointments > 0 ?
            ((result.cancelledAppointments || 0) / totalAppointments * 100).toFixed(2) : 0;
        const noShowRate = totalAppointments > 0 ?
            ((result.noShowAppointments || 0) / totalAppointments * 100).toFixed(2) : 0;

        return {
            ...result,
            completionRate: `${completionRate}%`,
            cancellationRate: `${cancellationRate}%`,
            noShowRate: `${noShowRate}%`,
            averageDuration: totalAppointments > 0 ?
                Math.round((result.totalDuration || 0) / totalAppointments) : 0,
            averageRating: result.averageRating ? result.averageRating.toFixed(2) : null
        };
    } catch (error) {
        logger.error('Error calculating appointment metrics:', error);
        throw error;
    }
};

/**
 * Get upcoming appointments with smart prioritization
 */
const getUpcomingAppointmentsPrioritized = async (doctorId) => {
    try {
        const now = new Date();
        const appointments = await Appointment.find({
            doctor: doctorId,
            appointmentDate: { $gte: now },
            status: { $in: ['requested', 'confirmed'] }
        })
            .populate('patient', 'fullName phone email age bloodGroup medicalHistory')
            .sort({ appointmentDate: 1, timeSlot: 1 });

        // Add priority scoring
        const prioritizedAppointments = appointments.map(appointment => {
            let priorityScore = 0;

            // Emergency appointments get highest priority
            if (appointment.isEmergency) priorityScore += 100;

            // Priority level scoring
            const priorityScores = { 'urgent': 50, 'high': 30, 'medium': 10, 'low': 5 };
            priorityScore += priorityScores[appointment.priority] || 0;

            // First-time patients get higher priority
            const isFirstTime = !appointment.patient.medicalHistory ||
                appointment.patient.medicalHistory.chronicConditions.length === 0;
            if (isFirstTime) priorityScore += 20;

            // Time proximity scoring (sooner appointments get higher priority)
            const timeDiff = appointment.appointmentDate - now;
            const hoursUntil = timeDiff / (1000 * 60 * 60);
            if (hoursUntil <= 24) priorityScore += 25;
            else if (hoursUntil <= 48) priorityScore += 15;
            else if (hoursUntil <= 168) priorityScore += 10; // Within a week

            return {
                ...appointment.toObject(),
                priorityScore,
                hoursUntilAppointment: Math.round(hoursUntil)
            };
        });

        // Sort by priority score
        prioritizedAppointments.sort((a, b) => b.priorityScore - a.priorityScore);

        return prioritizedAppointments;
    } catch (error) {
        logger.error('Error getting prioritized upcoming appointments:', error);
        throw error;
    }
};

/**
 * Generate appointment recommendations for patients
 */
const generateAppointmentRecommendations = async (patientId) => {
    try {
        const patient = await Patient.findById(patientId).populate('appointments');

        if (!patient) {
            throw new Error('Patient not found');
        }

        const recommendations = {
            suggestedSpecialists: [],
            optimalTimeSlots: [],
            followUpReminders: [],
            healthCheckups: []
        };

        // Analyze patient's medical history for specialist recommendations
        if (patient.medicalHistory && patient.medicalHistory.chronicConditions.length > 0) {
            const conditions = patient.medicalHistory.chronicConditions;

            // Map conditions to specialist recommendations
            const specialistMapping = {
                'diabetes': ['Endocrinology'],
                'hypertension': ['Cardiology'],
                'asthma': ['Pulmonology'],
                'arthritis': ['Orthopedics'],
                'depression': ['Psychiatry'],
                'migraine': ['Neurology']
            };

            conditions.forEach(condition => {
                const conditionLower = condition.condition.toLowerCase();
                Object.keys(specialistMapping).forEach(key => {
                    if (conditionLower.includes(key)) {
                        recommendations.suggestedSpecialists.push(...specialistMapping[key]);
                    }
                });
            });
        }

        // Analyze past appointment patterns for optimal time preferences
        const pastAppointments = await Appointment.find({
            patient: patientId,
            status: 'completed'
        }).sort({ appointmentDate: -1 });

        if (pastAppointments.length > 0) {
            const timeSlotFrequency = {};
            pastAppointments.forEach(appointment => {
                timeSlotFrequency[appointment.timeSlot] =
                    (timeSlotFrequency[appointment.timeSlot] || 0) + 1;
            });

            // Get most preferred time slots
            const sortedSlots = Object.entries(timeSlotFrequency)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([slot]) => slot);

            recommendations.optimalTimeSlots = sortedSlots;
        }

        // Check for required follow-ups
        const recentAppointments = await Appointment.find({
            patient: patientId,
            status: 'completed',
            appointmentDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
            'followUp.isRequired': true
        });

        recommendations.followUpReminders = recentAppointments.filter(appointment =>
            !appointment.followUp.followUpAppointment
        ).map(appointment => ({
            originalAppointment: appointment.appointmentId,
            recommendedDate: appointment.followUp.recommendedDate,
            notes: appointment.followUp.followUpNotes
        }));

        // Suggest routine health checkups based on age and conditions
        const age = patient.age;
        if (age >= 40 && age < 65) {
            recommendations.healthCheckups.push('Annual Physical Examination');
            if (age >= 50) {
                recommendations.healthCheckups.push('Preventive Screening (Cancer, Heart Disease)');
            }
        } else if (age >= 65) {
            recommendations.healthCheckups.push('Geriatric Health Assessment');
            recommendations.healthCheckups.push('Comprehensive Wellness Check');
        }

        return recommendations;
    } catch (error) {
        logger.error('Error generating appointment recommendations:', error);
        throw error;
    }
};

/**
 * Optimize doctor's schedule based on patterns and preferences
 */
const optimizeDoctorSchedule = async (doctorId, targetDate) => {
    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            throw new Error('Doctor not found');
        }

        const dayOfWeek = new Date(targetDate).toLocaleDateString('en-US', { weekday: 'long' });
        const doctorAvailability = doctor.availability?.find(avail => avail.day === dayOfWeek);

        if (!doctorAvailability) {
            return { availableSlots: [], optimizationSuggestions: [] };
        }

        // Get existing appointments for the date
        const existingAppointments = await Appointment.find({
            doctor: doctorId,
            appointmentDate: new Date(targetDate),
            status: { $in: ['requested', 'confirmed'] }
        });

        const bookedSlots = existingAppointments.map(apt => apt.timeSlot);
        const availableSlots = doctorAvailability.slots.filter(slot => !bookedSlots.includes(slot));

        // Analyze historical performance for optimization suggestions
        const historicalData = await Appointment.aggregate([
            {
                $match: {
                    doctor: doctorId,
                    status: 'completed',
                    $expr: {
                        $eq: [
                            { $dayOfWeek: '$appointmentDate' },
                            new Date(targetDate).getDay() + 1 // MongoDB's dayOfWeek is 1-based
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: '$timeSlot',
                    averageRating: { $avg: '$feedback.patientRating' },
                    completionRate: { $avg: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                    averageDuration: { $avg: '$duration' },
                    patientSatisfaction: { $avg: '$feedback.serviceRating' }
                }
            }
        ]);

        const optimizationSuggestions = [];

        // Suggest optimal slots based on historical data
        const highPerformanceSlots = historicalData
            .filter(slot => slot.averageRating >= 4.0 && slot.completionRate >= 0.9)
            .map(slot => slot._id);

        if (highPerformanceSlots.length > 0) {
            optimizationSuggestions.push({
                type: 'high_performance_slots',
                message: 'Consider prioritizing these historically high-performing time slots',
                slots: highPerformanceSlots.filter(slot => availableSlots.includes(slot))
            });
        }

        // Buffer time recommendations
        if (existingAppointments.length > 0) {
            optimizationSuggestions.push({
                type: 'buffer_time',
                message: 'Consider leaving buffer time between appointments for better patient care',
                suggestion: 'Schedule 15-minute breaks between complex appointments'
            });
        }

        return {
            availableSlots,
            bookedSlots,
            optimizationSuggestions,
            scheduleUtilization: doctorAvailability.slots.length > 0 ?
                ((bookedSlots.length / doctorAvailability.slots.length) * 100).toFixed(2) + '%' : '0%'
        };
    } catch (error) {
        logger.error('Error optimizing doctor schedule:', error);
        throw error;
    }
};

module.exports = {
    getAppointmentAnalytics,
    checkAppointmentConflicts,
    getOptimalTimeSlots,
    calculateAppointmentMetrics,
    getUpcomingAppointmentsPrioritized,
    generateAppointmentRecommendations,
    optimizeDoctorSchedule
};
