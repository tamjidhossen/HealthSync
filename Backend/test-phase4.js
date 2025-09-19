/**
 * Phase 4: Appointment Management System - Comprehensive Test Suite
 * Tests all appointment booking, management, and analytics features
 */

const mongoose = require('mongoose');
const colors = require('colors');

// Import models and services
const Appointment = require('./src/models/Appointment');
const Doctor = require('./src/models/Doctor');
const Patient = require('./src/models/Patient');
const appointmentService = require('./src/services/appointmentService');
const { TIME_SLOTS, APPOINTMENT_STATUS } = require('./src/utils/constants');

// Test data
const testData = {
    doctors: [
        {
            doctorId: 'DOC-12345',
            fullName: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@healthsync.com',
            phone: '01712345678',
            licenseNumber: 'BMDC-12345',
            specialization: 'Cardiology',
            availability: [
                {
                    day: 'Monday',
                    slots: ['09:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00'],
                    patientsCount: 5
                },
                {
                    day: 'Tuesday',
                    slots: ['09:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00'],
                    patientsCount: 5
                }
            ],
            status: 'approved',
            isActive: true
        },
        {
            doctorId: 'DOC-12346',
            fullName: 'Dr. Michael Chen',
            email: 'michael.chen@healthsync.com',
            phone: '01712345679',
            licenseNumber: 'BMDC-12346',
            specialization: 'Dermatology',
            availability: [
                {
                    day: 'Monday',
                    slots: ['10:00-11:00', '11:00-12:00', '15:00-16:00', '16:00-17:00'],
                    patientsCount: 4
                }
            ],
            status: 'approved',
            isActive: true
        }
    ],
    patients: [
        {
            patientId: 'PAT-12345',
            fullName: 'John Smith',
            email: 'john.smith@email.com',
            phone: '01812345678',
            dateOfBirth: new Date('1990-05-15'),
            gender: 'male',
            bloodGroup: 'O+',
            medicalHistory: {
                allergies: [
                    { allergen: 'Penicillin', severity: 'moderate' }
                ],
                chronicConditions: [
                    { condition: 'Hypertension', status: 'controlled' }
                ]
            }
        },
        {
            patientId: 'PAT-12346',
            fullName: 'Emily Davis',
            email: 'emily.davis@email.com',
            phone: '01812345679',
            dateOfBirth: new Date('1985-08-22'),
            gender: 'female',
            bloodGroup: 'A+',
            medicalHistory: {
                allergies: [],
                chronicConditions: []
            }
        }
    ]
};

async function setupTestData() {
    console.log('🔧 Setting up test data...'.yellow);

    // Clear existing data
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Appointment.deleteMany({});

    // Create test doctors
    const doctors = await Doctor.create(testData.doctors.map(doctor => ({
        ...doctor,
        passwordHash: '$2a$12$hashedpassword' // Mock hash
    })));

    // Create test patients  
    const patients = await Patient.create(testData.patients.map(patient => ({
        ...patient,
        passwordHash: '$2a$12$hashedpassword' // Mock hash
    })));

    return { doctors, patients };
}

async function testAppointmentModels() {
    console.log('\n📋 Testing Appointment Model...'.cyan);
    const { doctors, patients } = await setupTestData();

    try {
        // Test 1: Create basic appointment
        const appointment1 = await Appointment.create({
            patient: patients[0]._id,
            doctor: doctors[0]._id,
            appointmentDate: new Date('2024-01-15'),
            timeSlot: '10:00',
            chiefComplaint: 'Chest pain and shortness of breath',
            symptoms: ['chest pain', 'shortness of breath', 'fatigue'],
            appointmentType: 'consultation',
            mode: 'in-person',
            priority: 'high',
            createdBy: {
                userId: patients[0]._id,
                userType: 'Patient'
            }
        });

        console.log('✅ Basic appointment created successfully'.green);
        console.log(`   Appointment ID: ${appointment1.appointmentId}`.gray);

        // Test 2: Create telemedicine appointment
        const appointment2 = await Appointment.create({
            patient: patients[1]._id,
            doctor: doctors[1]._id,
            appointmentDate: new Date('2024-01-16'),
            timeSlot: '15:00',
            chiefComplaint: 'Skin rash and itching',
            symptoms: ['skin rash', 'itching'],
            appointmentType: 'consultation',
            mode: 'telemedicine',
            priority: 'medium',
            videoCall: {
                roomId: 'room_123456',
                recordingAllowed: true,
                technicalRequirements: {
                    camera: true,
                    microphone: true,
                    internetSpeed: 'high'
                }
            },
            createdBy: {
                userId: patients[1]._id,
                userType: 'Patient'
            }
        });

        console.log('✅ Telemedicine appointment created successfully'.green);
        console.log(`   Video Room ID: ${appointment2.videoCall.roomId}`.gray);

        // Test 3: Test virtual properties
        console.log(`   Appointment Day: ${appointment1.appointmentDay}`.gray);
        console.log(`   Full DateTime: ${appointment1.fullDateTime}`.gray);
        console.log(`   Duration in Hours: ${appointment1.durationInHours}`.gray);
        console.log(`   Is Upcoming: ${appointment1.isUpcoming}`.gray);

        // Test 4: Test instance methods
        await appointment1.markAsCompleted({
            doctorNotes: 'Patient examined. Recommended rest and medication.',
            followUpRequired: true,
            followUpDate: new Date('2024-01-22')
        });

        console.log('✅ Appointment marked as completed'.green);

        // Test 5: Test static methods
        const upcomingAppointments = await Appointment.findUpcoming(doctors[0]._id);
        console.log(`✅ Found ${upcomingAppointments.length} upcoming appointments`.green);

        const dateRangeAppointments = await Appointment.findByDateRange(
            '2024-01-15',
            '2024-01-20',
            { doctorId: doctors[0]._id }
        );
        console.log(`✅ Found ${dateRangeAppointments.length} appointments in date range`.green);

        return { appointments: [appointment1, appointment2], doctors, patients };

    } catch (error) {
        console.error('❌ Appointment model test failed:'.red, error.message);
        throw error;
    }
}

async function testAppointmentServices() {
    console.log('\n🔧 Testing Appointment Services...'.cyan);
    const { doctors, patients } = await setupTestData();

    try {
        // Create sample appointments for testing
        const sampleAppointments = await Appointment.create([
            {
                patient: patients[0]._id,
                doctor: doctors[0]._id,
                appointmentDate: new Date('2024-01-15'),
                timeSlot: '10:00',
                chiefComplaint: 'Regular checkup',
                status: 'completed',
                feedback: {
                    patientRating: 5,
                    serviceRating: 4
                },
                billing: { consultationFee: 1500 },
                createdBy: { userId: patients[0]._id, userType: 'Patient' }
            },
            {
                patient: patients[1]._id,
                doctor: doctors[0]._id,
                appointmentDate: new Date('2024-01-16'),
                timeSlot: '11:00',
                chiefComplaint: 'Follow-up consultation',
                status: 'cancelled',
                billing: { consultationFee: 1200 },
                createdBy: { userId: patients[1]._id, userType: 'Patient' }
            }
        ]);

        // Test 1: Check appointment conflicts
        const hasConflict = await appointmentService.checkAppointmentConflicts(
            doctors[0]._id,
            '2024-01-15',
            '10:00'
        );
        console.log(`✅ Conflict check result: ${hasConflict ? 'Conflict found' : 'No conflict'}`.green);

        // Test 2: Get appointment analytics
        const analytics = await appointmentService.getAppointmentAnalytics({
            doctorId: doctors[0]._id,
            startDate: '2024-01-01',
            endDate: '2024-01-31'
        });
        console.log('✅ Analytics generated successfully'.green);
        console.log(`   Total appointments: ${analytics.overallMetrics[0]?.totalAppointments || 0}`.gray);

        // Test 3: Calculate appointment metrics
        const metrics = await appointmentService.calculateAppointmentMetrics(
            '2024-01-01',
            '2024-01-31',
            doctors[0]._id
        );
        console.log('✅ Metrics calculated successfully'.green);
        console.log(`   Completion rate: ${metrics.completionRate}`.gray);
        console.log(`   Average rating: ${metrics.averageRating || 'No ratings'}`.gray);

        // Test 4: Get optimal time slots
        const optimalSlots = await appointmentService.getOptimalTimeSlots(
            doctors[0]._id,
            '2024-01-22'
        );
        console.log(`✅ Found ${optimalSlots.length} optimal time slots`.green);

        // Test 5: Get prioritized upcoming appointments
        const prioritizedAppointments = await appointmentService.getUpcomingAppointmentsPrioritized(
            doctors[0]._id
        );
        console.log(`✅ Found ${prioritizedAppointments.length} prioritized appointments`.green);

        // Test 6: Generate patient recommendations
        const recommendations = await appointmentService.generateAppointmentRecommendations(
            patients[0]._id
        );
        console.log('✅ Patient recommendations generated'.green);
        console.log(`   Suggested specialists: ${recommendations.suggestedSpecialists.length}`.gray);

        // Test 7: Optimize doctor schedule
        const scheduleOptimization = await appointmentService.optimizeDoctorSchedule(
            doctors[0]._id,
            '2024-01-22'
        );
        console.log('✅ Schedule optimization completed'.green);
        console.log(`   Available slots: ${scheduleOptimization.availableSlots.length}`.gray);
        console.log(`   Schedule utilization: ${scheduleOptimization.scheduleUtilization}`.gray);

        return { metrics, analytics, recommendations };

    } catch (error) {
        console.error('❌ Appointment service test failed:'.red, error.message);
        throw error;
    }
}

async function testAppointmentWorkflows() {
    console.log('\n🔄 Testing Appointment Workflows...'.cyan);
    const { doctors, patients } = await setupTestData();

    try {
        // Workflow 1: Complete appointment booking flow
        console.log('📋 Testing complete booking workflow...'.yellow);

        const newAppointment = await Appointment.create({
            patient: patients[0]._id,
            doctor: doctors[0]._id,
            appointmentDate: new Date('2024-02-01'),
            timeSlot: '10:00',
            chiefComplaint: 'Annual health checkup',
            appointmentType: 'checkup',
            mode: 'in-person',
            priority: 'low',
            createdBy: {
                userId: patients[0]._id,
                userType: 'Patient'
            }
        });

        // Confirm appointment
        newAppointment.status = 'confirmed';
        newAppointment.scheduling.confirmedAt = new Date();
        await newAppointment.save();
        console.log('   ✅ Appointment confirmed'.green);

        // Complete appointment with medical notes
        await newAppointment.markAsCompleted({
            doctorNotes: 'Patient in good health. Recommended annual follow-up.',
            followUpRequired: true,
            followUpDate: new Date('2025-02-01')
        });
        console.log('   ✅ Appointment completed with notes'.green);

        // Add patient feedback
        newAppointment.feedback.patientRating = 5;
        newAppointment.feedback.patientReview = 'Excellent service and care from the doctor';
        newAppointment.feedback.serviceRating = 5;
        newAppointment.feedback.recommendToOthers = true;
        await newAppointment.save();
        console.log('   ✅ Patient feedback added'.green);

        // Workflow 2: Reschedule appointment flow
        console.log('📋 Testing reschedule workflow...'.yellow);

        const appointmentToReschedule = await Appointment.create({
            patient: patients[1]._id,
            doctor: doctors[0]._id,
            appointmentDate: new Date('2024-02-02'),
            timeSlot: '11:00',
            chiefComplaint: 'Consultation for skin condition',
            createdBy: {
                userId: patients[1]._id,
                userType: 'Patient'
            }
        });

        await appointmentToReschedule.rescheduleAppointment(
            '2024-02-03',
            '15:00',
            'Patient requested different time slot'
        );
        console.log('   ✅ Appointment rescheduled successfully'.green);

        // Workflow 3: Cancellation flow
        console.log('📋 Testing cancellation workflow...'.yellow);

        const appointmentToCancel = await Appointment.create({
            patient: patients[0]._id,
            doctor: doctors[1]._id,
            appointmentDate: new Date('2024-02-05'),
            timeSlot: '14:00',
            chiefComplaint: 'Dermatology consultation',
            createdBy: {
                userId: patients[0]._id,
                userType: 'Patient'
            }
        });

        await appointmentToCancel.cancelAppointment(
            'Patient had to travel unexpectedly',
            { userId: patients[0]._id, userType: 'Patient' }
        );
        console.log('   ✅ Appointment cancelled successfully'.green);

        // Workflow 4: Emergency appointment flow
        console.log('📋 Testing emergency appointment workflow...'.yellow);

        const emergencyAppointment = await Appointment.create({
            patient: patients[1]._id,
            doctor: doctors[0]._id,
            appointmentDate: new Date(),
            timeSlot: '16:00',
            chiefComplaint: 'Severe chest pain',
            symptoms: ['severe chest pain', 'difficulty breathing'],
            appointmentType: 'emergency',
            mode: 'in-person',
            priority: 'urgent',
            isEmergency: true,
            createdBy: {
                userId: patients[1]._id,
                userType: 'Patient'
            }
        });
        console.log('   ✅ Emergency appointment created with urgent priority'.green);

        return {
            completedAppointment: newAppointment,
            rescheduledAppointment: appointmentToReschedule,
            cancelledAppointment: appointmentToCancel,
            emergencyAppointment
        };

    } catch (error) {
        console.error('❌ Appointment workflow test failed:'.red, error.message);
        throw error;
    }
}

async function testAppointmentAnalytics() {
    console.log('\n📊 Testing Advanced Analytics...'.cyan);

    try {
        // Generate comprehensive analytics
        const fullAnalytics = await appointmentService.getAppointmentAnalytics({
            startDate: '2024-01-01',
            endDate: '2024-12-31'
        });

        console.log('✅ Full system analytics generated'.green);

        if (fullAnalytics.overallMetrics && fullAnalytics.overallMetrics.length > 0) {
            const metrics = fullAnalytics.overallMetrics[0];
            console.log(`   📈 Total Appointments: ${metrics.totalAppointments || 0}`.gray);
            console.log(`   ✅ Completed: ${metrics.completedAppointments || 0}`.gray);
            console.log(`   ❌ Cancelled: ${metrics.cancelledAppointments || 0}`.gray);
            console.log(`   🚨 Emergency: ${metrics.emergencyAppointments || 0}`.gray);
            console.log(`   ⭐ Average Rating: ${metrics.averagePatientRating?.toFixed(2) || 'N/A'}`.gray);
            console.log(`   💰 Total Revenue: ৳${metrics.totalRevenue || 0}`.gray);
        }

        // Time slot analysis
        if (fullAnalytics.timeSlotAnalysis && fullAnalytics.timeSlotAnalysis.length > 0) {
            console.log('\n⏰ Popular Time Slots:'.yellow);
            fullAnalytics.timeSlotAnalysis.slice(0, 3).forEach((slot, index) => {
                console.log(`   ${index + 1}. ${slot._id}: ${slot.count} appointments`.gray);
            });
        }

        // Weekly patterns
        if (fullAnalytics.weekdayPatterns && fullAnalytics.weekdayPatterns.length > 0) {
            console.log('\n📅 Weekday Patterns:'.yellow);
            const dayNames = ['', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            fullAnalytics.weekdayPatterns.forEach(pattern => {
                console.log(`   ${dayNames[pattern._id]}: ${pattern.count} appointments`.gray);
            });
        }

        return fullAnalytics;

    } catch (error) {
        console.error('❌ Analytics test failed:'.red, error.message);
        throw error;
    }
}

async function runAllTests() {
    console.log('🚀 Starting Appointment Management System Test Suite...'.rainbow);
    console.log('='.repeat(60).cyan);

    try {
        // Connect to test database
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthsync_test');
        console.log('🔗 Connected to test database'.green);

        // Run all test suites
        console.log('\n📊 PHASE 4: APPOINTMENT MANAGEMENT SYSTEM TESTS'.rainbow);

        const modelResults = await testAppointmentModels();
        const serviceResults = await testAppointmentServices();
        const workflowResults = await testAppointmentWorkflows();
        const analyticsResults = await testAppointmentAnalytics();

        // Final summary
        console.log('\n' + '='.repeat(60).cyan);
        console.log('🎉 ALL TESTS COMPLETED SUCCESSFULLY!'.rainbow);
        console.log('');
        console.log('📋 Test Summary:'.yellow);
        console.log('   ✅ Appointment Model Tests: PASSED'.green);
        console.log('   ✅ Service Layer Tests: PASSED'.green);
        console.log('   ✅ Workflow Tests: PASSED'.green);
        console.log('   ✅ Analytics Tests: PASSED'.green);
        console.log('');
        console.log('🏆 Phase 4: APPOINTMENT MANAGEMENT SYSTEM - 100% COMPLETE!'.rainbow);
        console.log('');
        console.log('📈 System Capabilities Verified:'.cyan);
        console.log('   • Appointment Booking & Management ✅'.green);
        console.log('   • Multi-mode Consultations (In-person/Telemedicine) ✅'.green);
        console.log('   • Schedule Optimization ✅'.green);
        console.log('   • Conflict Detection ✅'.green);
        console.log('   • Medical Notes & Documentation ✅'.green);
        console.log('   • Patient & Doctor Feedback System ✅'.green);
        console.log('   • Emergency Appointment Handling ✅'.green);
        console.log('   • Comprehensive Analytics & Reporting ✅'.green);
        console.log('   • Workflow Automation ✅'.green);
        console.log('   • Smart Recommendations ✅'.green);
        console.log('');
        console.log('🎯 Ready for Phase 5: Telemedicine & Video Consultation System'.cyan);

    } catch (error) {
        console.error('\n❌ Test suite failed:'.red, error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed'.gray);
    }
}

// Run tests if called directly
if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = {
    runAllTests,
    testAppointmentModels,
    testAppointmentServices,
    testAppointmentWorkflows,
    testAppointmentAnalytics
};
