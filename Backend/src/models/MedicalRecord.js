/**
 * Medical Record Model
 * Stores test results and reports for prescriptions
 */

const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema(
    {
        recordId: {
            type: String,
            required: true,
            unique: true,
            match: /^MR-\d{6}$/, // Format: MR-123456
        },

        // Linked Entities
        prescription: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Prescription',
            required: true,
        },
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient',
            required: true,
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor',
            required: true,
        },

        // Test Details
        tests: [
            {
                testName: {
                    type: String,
                    required: true
                }, // e.g., CBC, X-Ray, MRI
                testResult: {
                    type: String,
                    default: ''
                }, // Result text, observations
                testFileUrl: {
                    type: String,
                    default: null
                }, // Optional scanned report
                status: {
                    type: String,
                    enum: ['Pending', 'Completed', 'Cancelled'],
                    default: 'Pending'
                },
                requestedAt: {
                    type: Date,
                    default: Date.now
                },
                completedAt: {
                    type: Date,
                    default: null
                },
                uploadedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Admin',
                    default: null
                }
            }
        ],

        // AI Generated Summary (demo field - not implemented)
        aiSummary: {
            type: String,
            default: 'AI summary will be generated automatically based on test results and patient history.'
        },

        // Doctor Notes
        doctorNotes: {
            type: String,
            default: ''
        },

        // Admin who uploaded/managed this record
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            required: true
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Indexes for better query performance
medicalRecordSchema.index({ recordId: 1 });
medicalRecordSchema.index({ prescription: 1 });
medicalRecordSchema.index({ patient: 1 });
medicalRecordSchema.index({ createdAt: -1 });

// Virtual for record URL
medicalRecordSchema.virtual('recordUrl').get(function () {
    return `/api/v1/admin/medical-records/${this._id}`;
});

// Pre-save middleware to generate recordId
medicalRecordSchema.pre('save', async function (next) {
    if (this.isNew && !this.recordId) {
        try {
            const { generateMedicalRecordId } = require('../utils/generateId');
            this.recordId = await generateMedicalRecordId();
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

// Static method to find by recordId
medicalRecordSchema.statics.findByRecordId = function (recordId) {
    return this.findOne({ recordId });
};

// Static method to find by patient
medicalRecordSchema.statics.findByPatient = function (patientId) {
    return this.find({ patient: patientId })
        .populate('prescription', 'prescriptionId diagnosis')
        .populate('doctor', 'fullName specialization')
        .sort({ createdAt: -1 });
};

// Static method to find by prescription
medicalRecordSchema.statics.findByPrescription = function (prescriptionId) {
    return this.find({ prescription: prescriptionId })
        .populate('patient', 'fullName patientId')
        .populate('doctor', 'fullName specialization')
        .sort({ createdAt: -1 });
};

// Instance method to add test result
medicalRecordSchema.methods.addTestResult = function (testName, testResult, fileUrl, adminId) {
    const existingTest = this.tests.find(test => test.testName === testName);

    if (existingTest) {
        existingTest.testResult = testResult;
        existingTest.status = 'Completed';
        existingTest.completedAt = new Date();
        existingTest.uploadedBy = adminId;
        if (fileUrl) existingTest.testFileUrl = fileUrl;
    } else {
        this.tests.push({
            testName,
            testResult,
            testFileUrl: fileUrl,
            status: 'Completed',
            completedAt: new Date(),
            uploadedBy: adminId
        });
    }

    return this.save();
};

// Instance method to update test status
medicalRecordSchema.methods.updateTestStatus = function (testName, status) {
    const test = this.tests.find(test => test.testName === testName);
    if (test) {
        test.status = status;
        if (status === 'Completed') {
            test.completedAt = new Date();
        }
    }
    return this.save();
};

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
