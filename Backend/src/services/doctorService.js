/**
 * Doctor Service
 * Business logic for doctor profile management
 */

const Doctor = require('../models/Doctor');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const { SPECIALIZATIONS, DAYS_OF_WEEK, ACCOUNT_STATUS } = require('../utils/constants');

class DoctorService {
    /**
     * Get doctor profile with additional computed data
     * @param {string} doctorId - Doctor's MongoDB ObjectId
     * @returns {Promise<object>} - Enhanced doctor profile
     */
    static async getEnhancedProfile(doctorId) {
        try {
            const doctor = await Doctor.findById(doctorId);

            if (!doctor) {
                throw new AppError('Doctor not found', 404);
            }

            // Calculate additional metrics
            const enhancedProfile = {
                ...doctor.toObject(),
                computed: {
                    profileCompleteness: this.calculateProfileCompleteness(doctor),
                    availabilityStatus: this.getAvailabilityStatus(doctor),
                    nextAvailableSlot: this.getNextAvailableSlot(doctor),
                    professionalSummary: this.generateProfessionalSummary(doctor),
                    verificationStatus: this.getVerificationStatus(doctor)
                }
            };

            return enhancedProfile;
        } catch (error) {
            logger.error('Error fetching enhanced profile:', error);
            throw error;
        }
    }

    /**
     * Calculate profile completeness percentage
     * @param {object} doctor - Doctor document
     * @returns {number} - Completeness percentage
     */
    static calculateProfileCompleteness(doctor) {
        const requiredFields = [
            'fullName',
            'email',
            'phone',
            'specialization',
            'licenseNumber',
            'qualifications',
            'experienceYears'
        ];

        const optionalFields = [
            'hospitalAffiliations',
            'availability',
            'notificationPreferences'
        ];

        let completedRequired = 0;
        let completedOptional = 0;

        // Check required fields
        requiredFields.forEach(field => {
            if (field === 'qualifications') {
                if (doctor.qualifications && doctor.qualifications.length > 0) {
                    completedRequired++;
                }
            } else if (doctor[field] && doctor[field] !== 'N/A') {
                completedRequired++;
            }
        });

        // Check optional fields
        optionalFields.forEach(field => {
            if (field === 'hospitalAffiliations' || field === 'availability') {
                if (doctor[field] && doctor[field].length > 0) {
                    completedOptional++;
                }
            } else if (doctor[field]) {
                completedOptional++;
            }
        });

        const requiredScore = (completedRequired / requiredFields.length) * 70; // 70% for required
        const optionalScore = (completedOptional / optionalFields.length) * 30; // 30% for optional

        return Math.round(requiredScore + optionalScore);
    }

    /**
     * Get availability status summary
     * @param {object} doctor - Doctor document
     * @returns {object} - Availability status
     */
    static getAvailabilityStatus(doctor) {
        if (!doctor.availability || doctor.availability.length === 0) {
            return {
                status: 'not_set',
                message: 'Availability schedule not set',
                availableDays: 0,
                totalSlots: 0
            };
        }

        const totalSlots = doctor.availability.reduce((total, day) => {
            return total + (day.slots ? day.slots.length : 0);
        }, 0);

        if (totalSlots === 0) {
            return {
                status: 'no_slots',
                message: 'No time slots configured',
                availableDays: doctor.availability.length,
                totalSlots: 0
            };
        }

        return {
            status: 'active',
            message: 'Availability schedule is active',
            availableDays: doctor.availability.length,
            totalSlots
        };
    }

    /**
     * Get next available appointment slot
     * @param {object} doctor - Doctor document
     * @returns {object|null} - Next available slot or null
     */
    static getNextAvailableSlot(doctor) {
        if (!doctor.availability || doctor.availability.length === 0) {
            return null;
        }

        const today = new Date();
        const currentDay = DAYS_OF_WEEK[today.getDay() === 0 ? 6 : today.getDay() - 1]; // Adjust for Sunday = 0

        // Find today's availability first
        let nextSlot = null;
        let daysAhead = 0;

        for (let i = 0; i < 14; i++) { // Check next 2 weeks
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() + i);
            const checkDay = DAYS_OF_WEEK[checkDate.getDay() === 0 ? 6 : checkDate.getDay() - 1];

            const dayAvailability = doctor.availability.find(avail => avail.day === checkDay);

            if (dayAvailability && dayAvailability.slots && dayAvailability.slots.length > 0) {
                const firstSlot = dayAvailability.slots[0];

                nextSlot = {
                    day: checkDay,
                    date: checkDate.toISOString().split('T')[0],
                    slot: firstSlot,
                    patientsCount: dayAvailability.patientsCount || 10,
                    daysAhead: i
                };
                break;
            }
        }

        return nextSlot;
    }

    /**
     * Generate professional summary
     * @param {object} doctor - Doctor document
     * @returns {string} - Professional summary
     */
    static generateProfessionalSummary(doctor) {
        const experience = doctor.calculatedExperience || doctor.experienceYears || 0;
        const qualificationCount = doctor.qualifications ? doctor.qualifications.length : 0;
        const affiliationCount = doctor.hospitalAffiliations ? doctor.hospitalAffiliations.length : 0;

        let summary = `Dr. ${doctor.fullName} is a ${doctor.specialization || 'healthcare'} specialist`;

        if (experience > 0) {
            summary += ` with ${experience} years of experience`;
        }

        if (qualificationCount > 0) {
            summary += `, holding ${qualificationCount} professional qualification${qualificationCount > 1 ? 's' : ''}`;
        }

        if (affiliationCount > 0) {
            summary += ` and affiliated with ${affiliationCount} healthcare institution${affiliationCount > 1 ? 's' : ''}`;
        }

        if (doctor.curedPatientsCount > 0) {
            summary += `. Has successfully treated ${doctor.curedPatientsCount} patients`;
        }

        if (doctor.averageRating > 0) {
            summary += ` with an average rating of ${doctor.averageRating}/5.0`;
        }

        summary += '.';

        return summary;
    }

    /**
     * Get verification status details
     * @param {object} doctor - Doctor document
     * @returns {object} - Verification status
     */
    static getVerificationStatus(doctor) {
        const status = {
            emailVerified: doctor.isEmailVerified,
            accountVerified: doctor.isVerified,
            accountStatus: doctor.status,
            canPractice: doctor.status === ACCOUNT_STATUS.APPROVED && doctor.isEmailVerified && doctor.isVerified,
            verificationSteps: []
        };

        // Add verification steps
        if (!doctor.isEmailVerified) {
            status.verificationSteps.push({
                step: 'email_verification',
                status: 'pending',
                message: 'Please verify your email address'
            });
        } else {
            status.verificationSteps.push({
                step: 'email_verification',
                status: 'completed',
                message: 'Email verified'
            });
        }

        if (doctor.status === ACCOUNT_STATUS.PENDING) {
            status.verificationSteps.push({
                step: 'admin_verification',
                status: 'pending',
                message: 'Waiting for admin verification'
            });
        } else if (doctor.status === ACCOUNT_STATUS.APPROVED) {
            status.verificationSteps.push({
                step: 'admin_verification',
                status: 'completed',
                message: 'Admin verified',
                verifiedBy: doctor.verifiedBy,
                verifiedAt: doctor.verifiedAt
            });
        } else if (doctor.status === ACCOUNT_STATUS.REJECTED) {
            status.verificationSteps.push({
                step: 'admin_verification',
                status: 'rejected',
                message: 'Application rejected by admin'
            });
        }

        return status;
    }

    /**
     * Validate time slot format and conflicts
     * @param {Array} slots - Array of time slots
     * @returns {object} - Validation result
     */
    static validateTimeSlots(slots) {
        if (!Array.isArray(slots)) {
            return { valid: false, error: 'Slots must be an array' };
        }

        const timeSlotRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        const parsedSlots = [];

        for (const slot of slots) {
            if (!timeSlotRegex.test(slot)) {
                return { valid: false, error: `Invalid time slot format: ${slot}` };
            }

            const [startTime, endTime] = slot.split('-');
            const [startHour, startMin] = startTime.split(':').map(Number);
            const [endHour, endMin] = endTime.split(':').map(Number);

            const startMinutes = startHour * 60 + startMin;
            const endMinutes = endHour * 60 + endMin;

            if (startMinutes >= endMinutes) {
                return { valid: false, error: `Invalid time slot: ${slot}. Start time must be before end time` };
            }

            parsedSlots.push({ slot, startMinutes, endMinutes });
        }

        // Check for overlapping slots
        parsedSlots.sort((a, b) => a.startMinutes - b.startMinutes);

        for (let i = 0; i < parsedSlots.length - 1; i++) {
            const current = parsedSlots[i];
            const next = parsedSlots[i + 1];

            if (current.endMinutes > next.startMinutes) {
                return {
                    valid: false,
                    error: `Overlapping time slots: ${current.slot} and ${next.slot}`
                };
            }
        }

        return { valid: true };
    }

    /**
     * Generate availability summary for display
     * @param {Array} availability - Doctor's availability array
     * @returns {string} - Human-readable availability summary
     */
    static generateAvailabilitySummary(availability) {
        if (!availability || availability.length === 0) {
            return 'No availability set';
        }

        const daySlotCounts = availability.map(day => {
            const slotCount = day.slots ? day.slots.length : 0;
            return `${day.day}: ${slotCount} slot${slotCount !== 1 ? 's' : ''}`;
        });

        const totalSlots = availability.reduce((total, day) => total + (day.slots ? day.slots.length : 0), 0);

        return `Available on ${availability.length} days with ${totalSlots} total time slots. ${daySlotCounts.join(', ')}`;
    }

    /**
     * Get doctor statistics for dashboard
     * @param {string} doctorId - Doctor's MongoDB ObjectId
     * @returns {Promise<object>} - Detailed statistics
     */
    static async getDoctorDashboardStats(doctorId) {
        try {
            const doctor = await Doctor.findById(doctorId);

            if (!doctor) {
                throw new AppError('Doctor not found', 404);
            }

            return {
                profile: {
                    completeness: this.calculateProfileCompleteness(doctor),
                    status: doctor.status,
                    isVerified: doctor.isVerified,
                    joinedDate: doctor.createdAt,
                    lastUpdated: doctor.updatedAt
                },
                professional: {
                    specialization: doctor.specialization,
                    experience: doctor.calculatedExperience || doctor.experienceYears,
                    qualifications: doctor.qualifications ? doctor.qualifications.length : 0,
                    affiliations: doctor.hospitalAffiliations ? doctor.hospitalAffiliations.length : 0,
                    licenseNumber: doctor.licenseNumber
                },
                performance: {
                    patientsCount: doctor.curedPatientsCount,
                    averageRating: doctor.averageRating,
                    totalReviews: doctor.totalReviews,
                    curedDiseases: doctor.curedDiseases ? doctor.curedDiseases.length : 0
                },
                availability: this.getAvailabilityStatus(doctor),
                nextSlot: this.getNextAvailableSlot(doctor),
                account: {
                    isActive: doctor.isActive,
                    emailVerified: doctor.isEmailVerified,
                    lastLogin: doctor.lastLoginAt,
                    notifications: doctor.notificationPreferences
                }
            };
        } catch (error) {
            logger.error('Error fetching dashboard stats:', error);
            throw error;
        }
    }
}

module.exports = DoctorService;
