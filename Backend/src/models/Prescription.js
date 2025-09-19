/**
 * Prescription Model
 * Manages medical prescriptions and treatment plans
 */

const mongoose = require('mongoose');
const { generatePrescriptionId } = require('../utils/generateId');

const prescriptionSchema = new mongoose.Schema(
    {
        // Unique Prescription Identifier
        prescriptionId: {
            type: String,
            unique: true,
            match: /^PRSC-\d{6}$/, // Format: PRSC-123456
        },

        // Linked Entities
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient',
            required: [true, 'Patient is required'],
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor',
            required: [true, 'Doctor is required'],
        },
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment',
            required: false, // Some prescriptions might not be linked to appointments
        },
        medicalInstitute: {
            type: String,
            required: false, // Doctor's institute/hospital name
        },

        // Prescription Details
        medicines: [
            {
                name: {
                    type: String,
                    required: [true, 'Medicine name is required'],
                    trim: true
                },
                genericName: {
                    type: String,
                    trim: true
                },
                dosage: {
                    type: String,
                    required: [true, 'Dosage is required'],
                    trim: true
                }, // e.g., "500mg", "5ml"
                frequency: {
                    type: String,
                    required: [true, 'Frequency is required'],
                    trim: true
                }, // e.g., "2 times a day", "Once daily"
                duration: {
                    type: String,
                    required: [true, 'Duration is required'],
                    trim: true
                }, // e.g., "7 days", "2 weeks"
                instructions: {
                    type: String,
                    trim: true
                }, // e.g., "Take after meals", "On empty stomach"
                notes: {
                    type: String,
                    trim: true
                }, // Additional instructions
                quantity: {
                    type: Number,
                    min: [1, 'Quantity must be at least 1']
                }, // Total tablets/bottles to be dispensed
                refills: {
                    type: Number,
                    default: 0,
                    min: [0, 'Refills cannot be negative']
                }, // Number of refills allowed
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    default: () => new mongoose.Types.ObjectId(),
                }
            },
        ],

        // Medical Tests & Laboratory Orders
        medicalTests: [
            {
                name: {
                    type: String,
                    required: [true, 'Test name is required'],
                    trim: true
                },
                testCode: {
                    type: String,
                    trim: true
                }, // Laboratory test code
                description: {
                    type: String,
                    trim: true
                },
                urgency: {
                    type: String,
                    enum: {
                        values: ['immediate', 'within-24-hours', 'within-week', 'routine'],
                        message: 'Urgency must be: immediate, within-24-hours, within-week, or routine'
                    },
                    default: 'routine'
                },
                scheduledFor: {
                    type: Date
                },
                instructions: {
                    type: String,
                    trim: true
                },
                fastingRequired: {
                    type: Boolean,
                    default: false
                },
                preparationInstructions: {
                    type: String,
                    trim: true
                },
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    default: () => new mongoose.Types.ObjectId(),
                }
            },
        ],

        // Clinical Information
        diagnosis: {
            primary: {
                type: String,
                required: [true, 'Primary diagnosis is required'],
                trim: true
            },
            secondary: [{
                type: String,
                trim: true
            }],
            icdCodes: [{
                code: { type: String, trim: true },
                description: { type: String, trim: true }
            }]
        },

        // Vital Signs & Clinical Data
        vitalSigns: {
            bloodPressure: {
                systolic: { type: Number, min: 0, max: 300 },
                diastolic: { type: Number, min: 0, max: 200 }
            },
            heartRate: { type: Number, min: 0, max: 300 },
            temperature: { type: Number, min: 95, max: 110 }, // Fahrenheit
            weight: { type: Number, min: 0, max: 1000 }, // kg
            height: { type: Number, min: 0, max: 300 }, // cm
            respiratoryRate: { type: Number, min: 0, max: 100 }
        },

        // Prescription Timing
        prescribedAt: {
            type: Date,
            default: Date.now,
        },
        validUntil: {
            type: Date,
            default: function () {
                // Default validity: 3 months from prescription date
                const validityDate = new Date();
                validityDate.setMonth(validityDate.getMonth() + 3);
                return validityDate;
            }
        },

        // Follow-up Information
        followUp: {
            required: {
                type: Boolean,
                default: false
            },
            date: {
                type: Date
            },
            reason: {
                type: String,
                trim: true
            },
            notes: {
                type: String,
                trim: true
            },
            urgency: {
                type: String,
                enum: ['routine', 'urgent', 'emergency'],
                default: 'routine'
            }
        },

        // Additional Clinical Notes
        clinicalNotes: {
            patientHistory: {
                type: String,
                trim: true
            },
            physicalExamination: {
                type: String,
                trim: true
            },
            treatmentPlan: {
                type: String,
                trim: true
            },
            patientEducation: {
                type: String,
                trim: true
            },
            warningsAndPrecautions: {
                type: String,
                trim: true
            }
        },

        // Prescription Status & Tracking
        status: {
            type: String,
            enum: {
                values: ['active', 'completed', 'cancelled', 'expired'],
                message: 'Status must be: active, completed, cancelled, or expired'
            },
            default: 'active'
        },

        // Digital Signature & Authentication
        digitalSignature: {
            signed: {
                type: Boolean,
                default: false
            },
            signedAt: {
                type: Date
            },
            signatureHash: {
                type: String
            }
        },

        // Prescription Dispensing Information
        dispensing: {
            pharmacy: {
                name: { type: String, trim: true },
                contact: { type: String, trim: true },
                license: { type: String, trim: true }
            },
            dispensedAt: {
                type: Date
            },
            dispensedBy: {
                type: String,
                trim: true
            },
            partialDispensing: [{
                date: { type: Date, default: Date.now },
                items: [{
                    medicineId: { type: mongoose.Schema.Types.ObjectId },
                    quantityDispensed: { type: Number },
                    remainingQuantity: { type: Number }
                }]
            }]
        },

        // System Metadata
        isEmergency: {
            type: Boolean,
            default: false
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'emergency'],
            default: 'medium'
        },
        tags: [{
            type: String,
            trim: true
        }],

        // Audit Trail
        lastModifiedBy: {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            userType: {
                type: String,
                enum: ['Doctor', 'Admin'],
                required: true
            },
            action: {
                type: String,
                enum: ['created', 'updated', 'cancelled', 'signed'],
                default: 'created'
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Indexes for better query performance
prescriptionSchema.index({ prescriptionId: 1 });
prescriptionSchema.index({ patient: 1, createdAt: -1 });
prescriptionSchema.index({ doctor: 1, createdAt: -1 });
prescriptionSchema.index({ appointment: 1 });
prescriptionSchema.index({ 'diagnosis.primary': 'text' });
prescriptionSchema.index({ status: 1, createdAt: -1 });

// Virtual for prescription age
prescriptionSchema.virtual('ageInDays').get(function () {
    return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for validity status
prescriptionSchema.virtual('isValid').get(function () {
    return this.validUntil > new Date() && this.status === 'active';
});

// Pre-save middleware to generate prescription ID
prescriptionSchema.pre('save', async function (next) {
    if (!this.prescriptionId) {
        this.prescriptionId = await generatePrescriptionId();
    }

    // Update lastModifiedBy timestamp
    if (this.lastModifiedBy) {
        this.lastModifiedBy.timestamp = new Date();
    }

    next();
});

// Pre-save middleware to set medical institute from doctor
prescriptionSchema.pre('save', async function (next) {
    if (this.isNew && !this.medicalInstitute && this.doctor) {
        try {
            const Doctor = mongoose.model('Doctor');
            const doctor = await Doctor.findById(this.doctor).select('hospitalAffiliations');
            if (doctor && doctor.hospitalAffiliations && doctor.hospitalAffiliations.length > 0) {
                this.medicalInstitute = doctor.hospitalAffiliations[0].name;
            }
        } catch (error) {
            // Continue without setting institute name if error
        }
    }
    next();
});

// Instance method to add medicine
prescriptionSchema.methods.addMedicine = function (medicineData) {
    this.medicines.push(medicineData);
    return this.save();
};

// Instance method to remove medicine
prescriptionSchema.methods.removeMedicine = function (medicineId) {
    this.medicines.id(medicineId).remove();
    return this.save();
};

// Instance method to add medical test
prescriptionSchema.methods.addMedicalTest = function (testData) {
    this.medicalTests.push(testData);
    return this.save();
};

// Instance method to cancel prescription
prescriptionSchema.methods.cancelPrescription = function (reason) {
    this.status = 'cancelled';
    this.clinicalNotes.warningsAndPrecautions = `Cancelled: ${reason}`;
    return this.save();
};

// Instance method to mark as dispensed
prescriptionSchema.methods.markDispensed = function (pharmacyInfo, dispensedBy) {
    this.dispensing.pharmacy = pharmacyInfo;
    this.dispensing.dispensedAt = new Date();
    this.dispensing.dispensedBy = dispensedBy;
    if (this.status === 'active') {
        this.status = 'completed';
    }
    return this.save();
};

// Static method to get active prescriptions for patient
prescriptionSchema.statics.getActiveForPatient = function (patientId) {
    return this.find({
        patient: patientId,
        status: 'active',
        validUntil: { $gte: new Date() }
    }).populate('doctor', 'fullName specialization').sort({ createdAt: -1 });
};

// Static method to get doctor's recent prescriptions
prescriptionSchema.statics.getDoctorRecent = function (doctorId, limit = 10) {
    return this.find({
        doctor: doctorId
    }).populate('patient', 'fullName age phone')
        .sort({ createdAt: -1 })
        .limit(limit);
};

module.exports = mongoose.model('Prescription', prescriptionSchema);
