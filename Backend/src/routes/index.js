/**
 * Main Routes Configuration
 * Central routing hub for all API endpoints
 */

const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
// const doctorRoutes = require('./doctorRoutes'); // Phase 3
// const patientRoutes = require('./patientRoutes'); // Phase 3
// const adminRoutes = require('./adminRoutes'); // Phase 3

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
          'PUT /doctors/me - Update doctor profile',
          'GET /doctors/appointments - Get doctor appointments',
          'POST /doctors/prescriptions - Create prescription',
          'GET /doctors/patients/:id - Get patient details',
        ],
      },
      patients: {
        base: '/patients',
        routes: [
          'GET /patients/me - Get patient profile',
          'PUT /patients/me - Update patient profile',
          'GET /patients/appointments - Get patient appointments',
          'POST /patients/appointments - Book appointment',
          'GET /patients/prescriptions - Get patient prescriptions',
          'POST /patients/chat - Chat with AI assistant',
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

// Route mounting - Phase 2 Complete
router.use('/auth', authRoutes);
// router.use('/doctors', doctorRoutes); // Phase 3
// router.use('/patients', patientRoutes); // Phase 3
// router.use('/admin', adminRoutes); // Phase 3

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to HealthSync API v1.0.0',
    status: '✅ Phase 2 Complete - Authentication System Ready!',
    nextPhase: 'Phase 3: Core APIs (Doctor/Patient/Admin)',
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
      '🔐 GET /api/v1/auth/me - Get current user profile'
    ],
  });
});

module.exports = router;
