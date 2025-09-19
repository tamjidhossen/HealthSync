/**
 * Appointment Routes
 * All appointment-related endpoints with authentication and validation
 */

const express = require('express');
const router = express.Router();

const appointmentController = require('../controllers/appointmentController');
const { authenticate, authorize } = require('../middleware/auth');
const {
    validateAppointmentBooking,
    validateAppointmentStatus,
    validateAppointmentReschedule,
    validateMedicalNotes,
    validateAppointmentFeedback,
    validateAppointmentQuery
} = require('../middleware/validation');

// Apply authentication to all routes
router.use(authenticate);

/**
 * @route   POST /api/v1/appointments/book
 * @desc    Book a new appointment
 * @access  Private (Patient only)
 */
router.post(
    '/book',
    authorize('patient'),
    // validateAppointmentBooking,
    appointmentController.bookAppointment
);

/**
 * @route   GET /api/v1/appointments/my-appointments
 * @desc    Get patient's appointments with filtering and pagination
 * @access  Private (Patient only)
 */
router.get(
    '/my-appointments',
    authorize(['patient']),
    validateAppointmentQuery,
    appointmentController.getMyAppointments
);

/**
 * @route   GET /api/v1/appointments/doctor-appointments
 * @desc    Get doctor's appointments with filtering and pagination
 * @access  Private (Doctor only)
 */
router.get(
    '/doctor-appointments',
    authorize(['doctor']),
    validateAppointmentQuery,
    appointmentController.getDoctorAppointments
);

/**
 * @route   GET /api/v1/appointments/available-slots/:doctorId/:date
 * @desc    Get available time slots for a doctor on a specific date
 * @access  Private (Patient, Doctor, Admin)
 */
router.get(
    '/available-slots/:doctorId/:date',
    authorize(['patient', 'doctor', 'admin']),
    appointmentController.getAvailableSlots
);

/**
 * @route   GET /api/v1/appointments/stats
 * @desc    Get appointment statistics
 * @access  Private (Doctor, Admin)
 */
router.get(
    '/stats',
    authorize(['doctor', 'admin']),
    appointmentController.getAppointmentStats
);

/**
 * @route   GET /api/v1/appointments/:appointmentId
 * @desc    Get appointment details
 * @access  Private (Patient/Doctor involved in appointment, Admin)
 */
router.get(
    '/:appointmentId',
    authorize(['patient', 'doctor', 'admin']),
    appointmentController.getAppointmentDetails
);

/**
 * @route   PATCH /api/v1/appointments/:appointmentId/status
 * @desc    Update appointment status (confirm, complete, cancel, etc.)
 * @access  Private (Doctor/Admin)
 */
router.patch(
    '/:appointmentId/status',
    authorize(['doctor', 'admin']),
    validateAppointmentStatus,
    appointmentController.updateAppointmentStatus
);

/**
 * @route   PUT /api/v1/appointments/:appointmentId/reschedule
 * @desc    Reschedule an appointment
 * @access  Private (Patient/Doctor involved in appointment)
 */
router.put(
    '/:appointmentId/reschedule',
    authorize(['patient', 'doctor']),
    validateAppointmentReschedule,
    appointmentController.rescheduleAppointment
);

/**
 * @route   DELETE /api/v1/appointments/:appointmentId
 * @desc    Cancel an appointment
 * @access  Private (Patient/Doctor involved in appointment)
 */
router.delete(
    '/:appointmentId',
    authorize(['patient', 'doctor']),
    appointmentController.cancelAppointment
);

/**
 * @route   PUT /api/v1/appointments/:appointmentId/notes
 * @desc    Add or update medical notes for an appointment
 * @access  Private (Doctor for doctor notes, Patient for patient notes)
 */
router.put(
    '/:appointmentId/notes',
    authorize(['patient', 'doctor']),
    validateMedicalNotes,
    appointmentController.addMedicalNotes
);

/**
 * @route   POST /api/v1/appointments/:appointmentId/feedback
 * @desc    Add feedback and rating for a completed appointment
 * @access  Private (Patient/Doctor involved in appointment)
 */
router.post(
    '/:appointmentId/feedback',
    authorize(['patient', 'doctor']),
    validateAppointmentFeedback,
    appointmentController.addAppointmentFeedback
);

/**
 * Service status endpoint
 */
router.get('/status', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Appointment Management Service is running',
        version: '1.0.0',
        features: [
            'Appointment Booking',
            'Schedule Management',
            'Status Updates',
            'Rescheduling',
            'Cancellations',
            'Medical Notes',
            'Feedback System',
            'Time Slot Management',
            'Statistics Dashboard',
            'Multi-mode Appointments (In-person, Telemedicine)'
        ],
        endpoints: [
            'POST /book - Book new appointment',
            'GET /my-appointments - Get patient appointments',
            'GET /doctor-appointments - Get doctor appointments',
            'GET /available-slots/:doctorId/:date - Get available slots',
            'GET /stats - Get appointment statistics',
            'GET /:appointmentId - Get appointment details',
            'PATCH /:appointmentId/status - Update appointment status',
            'PUT /:appointmentId/reschedule - Reschedule appointment',
            'DELETE /:appointmentId - Cancel appointment',
            'PUT /:appointmentId/notes - Add medical notes',
            'POST /:appointmentId/feedback - Add feedback'
        ]
    });
});

module.exports = router;
