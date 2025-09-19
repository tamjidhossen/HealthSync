/**
 * Main Routes Configuration
 * Central routing hub for all API endpoints
 */

const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
const doctorRoutes = require('./doctorRoutes');
const patientRoutes = require('./patientRoutes');
const adminRoutes = require('./adminRoutes'); // Phase 3C
const appointmentRoutes = require('./appointmentRoutes'); // Phase 4

// API Documentation route
router.get('/docs', (req, res) => {
  res.status(200).json({
    message: 'HealthSync API Documentation',
    version: '1.0.0',
    baseUrl: '/api/v1',
    endpoints: {
      auth: {
        base: '/auth',
        routes: [
          'POST /auth/register/doctor - Register a new doctor',
          'POST /auth/register/patient - Register a new patient',
          'POST /auth/login - User login',
          'POST /auth/verify-email - Verify email address',
          'POST /auth/forgot-password - Request password reset',
          'POST /auth/reset-password - Reset password',
        ],
      },
      doctors: {
        base: '/doctors',
        routes: [
          'GET /doctors/me - Get doctor profile',
          'PUT /doctors/me/basic - Update basic information',
          'PUT /doctors/me/professional - Update professional info',
          'PUT /doctors/me/availability - Update availability schedule',
          'GET /doctors/me/stats - Get performance statistics',
          'POST /doctors/me/qualifications - Add qualification',
          'POST /doctors/me/affiliations - Add hospital affiliation',
        ],
      },
      patients: {
        base: '/patients',
        routes: [
          'GET /patients/me - Get patient profile',
          'PUT /patients/me/basic - Update basic information',
          'PUT /patients/me/address - Update address information',
          'PUT /patients/me/emergency-contact - Update emergency contact',
          'PUT /patients/me/insurance - Update insurance information',
          'PUT /patients/me/health-metrics - Update height/weight',
          'POST /patients/me/allergies - Add allergy',
          'POST /patients/me/conditions - Add chronic condition',
          'GET /patients/me/stats - Get health statistics',
        ],
      },
      appointments: {
        base: '/appointments',
        routes: [
          'POST /appointments/book - Book new appointment',
          'GET /appointments/my-appointments - Get patient appointments',
          'GET /appointments/doctor-appointments - Get doctor appointments',
          'GET /appointments/available-slots/:doctorId/:date - Check availability',
          'GET /appointments/stats - Get appointment statistics',
          'GET /appointments/:id - Get appointment details',
          'PATCH /appointments/:id/status - Update appointment status',
          'PUT /appointments/:id/reschedule - Reschedule appointment',
          'DELETE /appointments/:id - Cancel appointment',
          'PUT /appointments/:id/notes - Add medical notes',
          'POST /appointments/:id/feedback - Submit feedback',
        ],
      },
      admin: {
        base: '/admin',
        routes: [
          'GET /admin/doctors/pending - Get pending doctor verifications',
          'PUT /admin/doctors/:id/verify - Verify doctor account',
          'GET /admin/statistics - Get system statistics',
        ],
      },
    },
    features: [
      'JWT Authentication',
      'Role-based Authorization',
      'AI Medical Assistant',
      'Real-time Telemedicine',
      'Email Verification',
      'File Upload Support',
      'Rate Limiting',
      'Error Handling',
      'Appointment Management',
      'Schedule Optimization',
      'Medical Notes & Feedback',
      'Multi-mode Consultations',
    ],
  });
});

// Health check for API routes
router.get('/status', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'HealthSync API Routes are active',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Route mounting - Phase 2 Complete + Phase 3A (Doctor) + Phase 3B (Patient) + Phase 3C (Admin) + Phase 4 (Appointments)
router.use('/auth', authRoutes);
router.use('/doctors', doctorRoutes);
router.use('/patients', patientRoutes);
router.use('/admin', adminRoutes); // Phase 3C
router.use('/appointments', appointmentRoutes); // Phase 4

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to HealthSync API v1.0.0',
    status: '✅ Phase 4 Complete - Appointment Management System Ready!',
    nextPhase: 'Phase 5: Telemedicine & Video Consultation System',
    availableRoutes: [
      'GET /api/v1/ - This welcome message',
      'GET /api/v1/docs - API documentation',
      'GET /api/v1/status - API status check',
      '🔐 GET /api/v1/auth/status - Authentication service status',
      '🔐 POST /api/v1/auth/register/doctor - Register new doctor',
      '🔐 POST /api/v1/auth/register/patient - Register new patient',
      '🔐 POST /api/v1/auth/login - User login',
      '🔐 POST /api/v1/auth/logout - User logout',
      '🔐 POST /api/v1/auth/verify-email - Verify email',
      '🔐 GET /api/v1/auth/me - Get current user profile',
      '👨‍⚕️ GET /api/v1/doctors/me - Get doctor profile',
      '👨‍⚕️ PUT /api/v1/doctors/me/basic - Update basic info',
      '👨‍⚕️ PUT /api/v1/doctors/me/professional - Update professional info',
      '👨‍⚕️ PUT /api/v1/doctors/me/availability - Update availability',
      '👨‍⚕️ GET /api/v1/doctors/me/stats - Get doctor statistics',
      '👨‍⚕️ GET /api/v1/doctors/status - Doctor service status',
      '🧑‍🦰 GET /api/v1/patients/me - Get patient profile',
      '🧑‍🦰 PUT /api/v1/patients/me/basic - Update basic information',
      '🧑‍🦰 PUT /api/v1/patients/me/health-metrics - Update health metrics',
      '🧑‍🦰 POST /api/v1/patients/me/allergies - Add allergy',
      '🧑‍🦰 POST /api/v1/patients/me/conditions - Add chronic condition',
      '🧑‍🦰 GET /api/v1/patients/me/stats - Get health statistics',
      '🧑‍🦰 GET /api/v1/patients/status - Patient service status',
      '📅 POST /api/v1/appointments/book - Book new appointment',
      '📅 GET /api/v1/appointments/my-appointments - Get patient appointments',
      '📅 GET /api/v1/appointments/doctor-appointments - Get doctor appointments',
      '📅 GET /api/v1/appointments/available-slots/:doctorId/:date - Check availability',
      '📅 GET /api/v1/appointments/:id - Get appointment details',
      '📅 PATCH /api/v1/appointments/:id/status - Update appointment status',
      '📅 PUT /api/v1/appointments/:id/reschedule - Reschedule appointment',
      '📅 DELETE /api/v1/appointments/:id - Cancel appointment',
      '📅 PUT /api/v1/appointments/:id/notes - Add medical notes',
      '📅 POST /api/v1/appointments/:id/feedback - Submit feedback',
      '📅 GET /api/v1/appointments/stats - Appointment analytics'
    ],
  });
});

module.exports = router;
