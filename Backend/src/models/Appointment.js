/**
 * Appointment Model
 * MongoDB schema for appointments in HealthSync
 */

const mongoose = require('mongoose');
const { APPOINTMENT_STATUS, APPOINTMENT_MODE, TIME_SLOTS } = require('../utils/constants');

const appointmentSchema = new mongoose.Schema(
    {
        appointmentId: {
            type: String,
            unique: true,
            match: /^APPT-\d{6}$/, // Format: APPT-123456
        },

        // Core appointment details
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient',
            required: [true, 'Patient is required'],
            index: true,
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor',
            required: [true, 'Doctor is required'],
            index: true,
        },

        // Appointment scheduling
        appointmentDate: {
            type: Date,
            required: [true, 'Appointment date is required'],
            index: true,
        },
        timeSlot: {
            type: String,
            required: [true, 'Time slot is required'],
            enum: TIME_SLOTS,
        }

        // Appointment type and mode
        //     appointmentType: {
        //         type: String,
        //         enum: ['consultation', 'follow-up', 'checkup', 'emergency', 'procedure'],
        //         default: 'consultation',
        //         required: true,
        //     },
        //     mode: {
        //         type: String,
        //         enum: Object.values(APPOINTMENT_MODE),
        //         default: 'in-person',
        //         required: true,
        //     },

        //     // Appointment status
        //     status: {
        //         type: String,
        //         enum: Object.values(APPOINTMENT_STATUS),
        //         default: 'requested',
        //         required: true,
        //         index: true,
        //     },

        //     // Chief complaint and symptoms
        //     chiefComplaint: {
        //         type: String,
        //         required: [true, 'Chief complaint is required'],
        //         maxLength: [500, 'Chief complaint cannot exceed 500 characters'],
        //     },
        //     symptoms: [{
        //         type: String,
        //         maxLength: 100,
        //     }],

        //     // Priority and urgency
        //     priority: {
        //         type: String,
        //         enum: ['low', 'medium', 'high', 'urgent'],
        //         default: 'medium',
        //     },
        //     isEmergency: {
        //         type: Boolean,
        //         default: false,
        //     },

        //     // Telemedicine specific fields
        //     videoCall: {
        //         roomId: String,
        //         meetingLink: String,
        //         recordingAllowed: {
        //             type: Boolean,
        //             default: false,
        //         },
        //         technicalRequirements: {
        //             camera: {
        //                 type: Boolean,
        //                 default: true,
        //             },
        //             microphone: {
        //                 type: Boolean,
        //                 default: true,
        //             },
        //             internetSpeed: {
        //                 type: String,
        //                 default: 'stable',
        //             },
        //         },
        //     },

        //     // Medical documentation
        //     medicalNotes: {
        //         doctorNotes: String,
        //         patientNotes: String,
        //         treatmentPlan: String,
        //         followUpInstructions: String,
        //     },

        //     // Prescription and lab orders
        //     prescriptions: [{
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: 'Prescription',
        //     }],
        //     labOrders: [{
        //         testName: String,
        //         urgency: {
        //             type: String,
        //             enum: ['routine', 'urgent', 'stat'],
        //             default: 'routine',
        //         },
        //         instructions: String,
        //         ordered: {
        //             type: Boolean,
        //             default: false,
        //         },
        //     }],

        //     // Files and attachments
        //     attachments: [{
        //         fileName: String,
        //         filePath: String,
        //         fileType: String,
        //         uploadedBy: {
        //             type: String,
        //             enum: ['patient', 'doctor', 'admin'],
        //             required: true,
        //         },
        //         uploadedAt: {
        //             type: Date,
        //             default: Date.now,
        //         },
        //     }],

        //     // Payment and billing
        //     billing: {
        //         consultationFee: {
        //             type: Number,
        //             min: 0,
        //             default: 0,
        //         },
        //         currency: {
        //             type: String,
        //             default: 'BDT',
        //         },
        //         paymentStatus: {
        //             type: String,
        //             enum: ['pending', 'paid', 'partially_paid', 'refunded'],
        //             default: 'pending',
        //         },
        //         paymentMethod: {
        //             type: String,
        //             enum: ['cash', 'card', 'mobile_payment', 'insurance'],
        //         },
        //         insuranceCovered: {
        //             type: Boolean,
        //             default: false,
        //         },
        //     },

        //     // Scheduling management
        //     scheduling: {
        //         requestedAt: {
        //             type: Date,
        //             default: Date.now,
        //         },
        //         confirmedAt: Date,
        //         completedAt: Date,
        //         cancelledAt: Date,
        //         rescheduledFrom: {
        //             date: Date,
        //             timeSlot: String,
        //             reason: String,
        //         },
        //         cancellationReason: String,
        //         noShowReason: String,
        //     },

        //     // Ratings and feedback
        //     feedback: {
        //         patientRating: {
        //             type: Number,
        //             min: 1,
        //             max: 5,
        //         },
        //         patientReview: {
        //             type: String,
        //             maxLength: 1000,
        //         },
        //         doctorRating: {
        //             type: Number,
        //             min: 1,
        //             max: 5,
        //         },
        //         doctorReview: {
        //             type: String,
        //             maxLength: 1000,
        //         },
        //         serviceRating: {
        //             type: Number,
        //             min: 1,
        //             max: 5,
        //         },
        //         recommendToOthers: {
        //             type: Boolean,
        //             default: true,
        //         },
        //     },

        //     // Reminders and notifications
        //     reminders: {
        //         patientReminders: [{
        //             type: {
        //                 type: String,
        //                 enum: ['email', 'sms', 'push'],
        //             },
        //             sentAt: Date,
        //             delivered: {
        //                 type: Boolean,
        //                 default: false,
        //             },
        //         }],
        //         doctorReminders: [{
        //             type: {
        //                 type: String,
        //                 enum: ['email', 'sms', 'push'],
        //             },
        //             sentAt: Date,
        //             delivered: {
        //                 type: Boolean,
        //                 default: false,
        //             },
        //         }],
        //         nextReminderAt: Date,
        //     },

        //     // Quality metrics
        //     metrics: {
        //         waitingTime: Number, // minutes
        //         consultationDuration: Number, // minutes
        //         patientSatisfactionScore: Number,
        //         onTimeArrival: Boolean,
        //         technicalIssues: [{
        //             issue: String,
        //             resolved: Boolean,
        //             resolvedAt: Date,
        //         }],
        //     },

        //     // Follow-up appointments
        //     followUp: {
        //         isRequired: {
        //             type: Boolean,
        //             default: false,
        //         },
        //         recommendedDate: Date,
        //         followUpAppointment: {
        //             type: mongoose.Schema.Types.ObjectId,
        //             ref: 'Appointment',
        //         },
        //         followUpNotes: String,
        //     },

        //     // Metadata
        //     createdBy: {
        //         userId: {
        //             type: mongoose.Schema.Types.ObjectId,
        //             required: true,
        //             refPath: 'createdBy.userType',
        //         },
        //         userType: {
        //             type: String,
        //             required: true,
        //             enum: ['Patient', 'Doctor', 'Admin'],
        //         },
        //     },
        //     lastModifiedBy: {
        //         userId: {
        //             type: mongoose.Schema.Types.ObjectId,
        //             refPath: 'lastModifiedBy.userType',
        //         },
        //         userType: {
        //             type: String,
        //             enum: ['Patient', 'Doctor', 'Admin'],
        //         },
        //     },

        //     // System fields
        //     isActive: {
        //         type: Boolean,
        //         default: true,
        //     },
        //     isDeleted: {
        //         type: Boolean,
        //         default: false,
        //     },
        //     version: {
        //         type: Number,
        //         default: 1,
        //     },
        // },
        // {
        //     timestamps: true,
        //     versionKey: false,
    }
);

// Indexes for better query performance
appointmentSchema.index({ patient: 1, appointmentDate: 1 });
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1, appointmentDate: 1 });
appointmentSchema.index({ 'scheduling.requestedAt': -1 });
appointmentSchema.index({ priority: 1, isEmergency: 1 });
appointmentSchema.index({ mode: 1, status: 1 });

// Virtual for appointment day
appointmentSchema.virtual('appointmentDay').get(function () {
    return this.appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });
});

// Virtual for full appointment datetime
appointmentSchema.virtual('fullDateTime').get(function () {
    return `${this.appointmentDate.toLocaleDateString()} ${this.timeSlot}`;
});

// Virtual for duration in hours
appointmentSchema.virtual('durationInHours').get(function () {
    return this.duration / 60;
});

// Check if appointment is upcoming
appointmentSchema.virtual('isUpcoming').get(function () {
    const now = new Date();
    const appointmentDateTime = new Date(`${this.appointmentDate.toDateString()} ${this.timeSlot}`);
    return appointmentDateTime > now && this.status !== 'cancelled';
});

// Check if appointment is overdue
appointmentSchema.virtual('isOverdue').get(function () {
    const now = new Date();
    const appointmentDateTime = new Date(`${this.appointmentDate.toDateString()} ${this.timeSlot}`);
    return appointmentDateTime < now && !['completed', 'cancelled'].includes(this.status);
});

// Pre-save middleware
appointmentSchema.pre('save', async function (next) {
    if (this.isNew && !this.appointmentId) {
        // Generate appointment ID
        const count = await this.constructor.countDocuments();
        this.appointmentId = `APPT-${String(count + 1).padStart(6, '0')}`;
    }

    // Update version on modification
    if (!this.isNew) {
        this.version += 1;
        this.lastModifiedBy = this.lastModifiedBy || this.createdBy;
    }

    next();
});

// Pre-find middleware to exclude deleted appointments
appointmentSchema.pre(/^find/, function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

// Static methods
appointmentSchema.statics.findUpcoming = function (doctorId, patientId) {
    const query = {
        appointmentDate: { $gte: new Date() },
        status: { $in: ['requested', 'confirmed'] }
    };

    if (doctorId) query.doctor = doctorId;
    if (patientId) query.patient = patientId;

    return this.find(query).sort({ appointmentDate: 1, timeSlot: 1 });
};

appointmentSchema.statics.findByDateRange = function (startDate, endDate, options = {}) {
    const query = {
        appointmentDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        }
    };

    if (options.doctorId) query.doctor = options.doctorId;
    if (options.patientId) query.patient = options.patientId;
    if (options.status) query.status = options.status;
    if (options.mode) query.mode = options.mode;

    return this.find(query).sort({ appointmentDate: 1, timeSlot: 1 });
};

// Instance methods
appointmentSchema.methods.markAsCompleted = function (completionData = {}) {
    this.status = 'completed';
    this.scheduling.completedAt = new Date();
    if (completionData.doctorNotes) {
        this.medicalNotes.doctorNotes = completionData.doctorNotes;
    }
    if (completionData.followUpRequired) {
        this.followUp.isRequired = true;
        this.followUp.recommendedDate = completionData.followUpDate;
    }
    return this.save();
};

appointmentSchema.methods.cancelAppointment = function (reason, cancelledBy) {
    this.status = 'cancelled';
    this.scheduling.cancelledAt = new Date();
    this.scheduling.cancellationReason = reason;
    this.lastModifiedBy = cancelledBy;
    return this.save();
};

appointmentSchema.methods.rescheduleAppointment = function (newDate, newTimeSlot, reason) {
    this.scheduling.rescheduledFrom = {
        date: this.appointmentDate,
        timeSlot: this.timeSlot,
        reason: reason || 'Rescheduled by request'
    };
    this.appointmentDate = new Date(newDate);
    this.timeSlot = newTimeSlot;
    this.status = 'requested'; // Reset to requested status
    return this.save();
};

module.exports = mongoose.model('Appointment', appointmentSchema);
