/**
 * Prescription Routes
 * Handles all prescription-related API endpoints
 */

const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const { authenticate, authorize } = require('../middleware/auth');
const { validatePrescriptionCreate, validatePrescriptionUpdate, validateMedicine, validateMedicalTest } = require('../middleware/validation');

// Apply authentication to all prescription routes
router.use(authenticate);

/**
 * @route   GET /api/v1/prescriptions/my-prescriptions
 * @desc    Get all prescriptions for authenticated patient
 * @access  Private (Patient)
 * @query   status, page, limit, sortBy, sortOrder
 */
router.get('/my-prescriptions',
    authorize('patient'),
    prescriptionController.getMyPrescriptions
);

/**
 * @route   GET /api/v1/prescriptions/doctor-prescriptions
 * @desc    Get all prescriptions created by authenticated doctor
 * @access  Private (Doctor)
 * @query   status, patientName, page, limit, sortBy, sortOrder
 */
router.get('/doctor-prescriptions',
    authorize('doctor'),
    prescriptionController.getDoctorPrescriptions
);

/**
 * @route   GET /api/v1/prescriptions/patient/:patientId
 * @desc    Get all prescriptions for a specific patient (Doctor consultation access)
 * @access  Private (Doctor only - can view any patient's prescription history)
 * @params  patientId - Patient ID or MongoDB ObjectId
 * @query   status, page, limit, sortBy, sortOrder
 */
router.get('/patient/:patientId',
    authorize('doctor'),
    prescriptionController.getPatientPrescriptionHistory
);

/**
 * @route   GET /api/v1/prescriptions/doctor-view/:prescriptionId
 * @desc    Get any prescription details (Doctor access to any prescription)
 * @access  Private (Doctor only - can view any prescription)
 * @params  prescriptionId - Prescription ID or MongoDB ObjectId
 */
router.get('/doctor-view/:prescriptionId',
    authorize('doctor'),
    prescriptionController.getDoctorPrescriptionView
);

/**
 * @route   GET /api/v1/prescriptions/stats
 * @desc    Get prescription statistics for authenticated doctor
 * @access  Private (Doctor)
 * @query   startDate, endDate
 */
router.get('/stats',
    authorize('doctor'),
    prescriptionController.getPrescriptionStats
);

/**
 * @route   POST /api/v1/prescriptions
 * @desc    Create a new prescription
 * @access  Private (Doctor)
 * @body    patientId, appointmentId, medicines, medicalTests, diagnosis, vitalSigns, followUp, clinicalNotes, isEmergency, priority, validUntil
 */
router.post('/',
    authorize('doctor'),
    validatePrescriptionCreate,
    prescriptionController.createPrescription
);

/**
 * @route   GET /api/v1/prescriptions/:prescriptionId
 * @desc    Get prescription details
 * @access  Private (Patient/Doctor involved in prescription)
 * @params  prescriptionId - Prescription ID or MongoDB ObjectId
 */
router.get('/:prescriptionId',
    prescriptionController.getPrescriptionDetails
);

/**
 * @route   PUT /api/v1/prescriptions/:prescriptionId
 * @desc    Update prescription
 * @access  Private (Doctor who created the prescription)
 * @params  prescriptionId - Prescription ID or MongoDB ObjectId
 * @body    medicines, medicalTests, diagnosis, vitalSigns, followUp, clinicalNotes, priority, validUntil
 */
router.put('/:prescriptionId',
    authorize('doctor'),
    validatePrescriptionUpdate,
    prescriptionController.updatePrescription
);

/**
 * @route   DELETE /api/v1/prescriptions/:prescriptionId
 * @desc    Cancel prescription
 * @access  Private (Doctor who created the prescription)
 * @params  prescriptionId - Prescription ID or MongoDB ObjectId
 * @body    reason - Cancellation reason
 */
router.delete('/:prescriptionId',
    authorize('doctor'),
    prescriptionController.cancelPrescription
);

/**
 * @route   POST /api/v1/prescriptions/:prescriptionId/medicines
 * @desc    Add medicine to prescription
 * @access  Private (Doctor who created the prescription)
 * @params  prescriptionId - Prescription ID or MongoDB ObjectId
 * @body    name, genericName, dosage, frequency, duration, instructions, notes, quantity, refills
 */
router.post('/:prescriptionId/medicines',
    authorize('doctor'),
    validateMedicine,
    prescriptionController.addMedicine
);

/**
 * @route   DELETE /api/v1/prescriptions/:prescriptionId/medicines/:medicineId
 * @desc    Remove medicine from prescription
 * @access  Private (Doctor who created the prescription)
 * @params  prescriptionId - Prescription ID or MongoDB ObjectId
 * @params  medicineId - Medicine ID within the prescription
 */
router.delete('/:prescriptionId/medicines/:medicineId',
    authorize('doctor'),
    prescriptionController.removeMedicine
);

/**
 * @route   POST /api/v1/prescriptions/:prescriptionId/tests
 * @desc    Add medical test to prescription
 * @access  Private (Doctor who created the prescription)
 * @params  prescriptionId - Prescription ID or MongoDB ObjectId
 * @body    name, testCode, description, urgency, scheduledFor, instructions, fastingRequired, preparationInstructions
 */
router.post('/:prescriptionId/tests',
    authorize('doctor'),
    validateMedicalTest,
    prescriptionController.addMedicalTest
);

// Status endpoint for prescription service health check
router.get('/service/status', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Prescription service is active',
        timestamp: new Date().toISOString(),
        service: 'prescriptions',
        version: '1.0.0'
    });
});

module.exports = router;
