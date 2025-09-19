/**
 * Authentication Debug Test - Quick Step-by-Step Guide
 * Tests the authentication flow to identify token issues
 */

console.log('🔍 HealthSync Authentication Debug Guide\n');
console.log('📋 STEP-BY-STEP AUTHENTICATION TEST:');
console.log('');

console.log('1️⃣ FIRST: Test if server is running');
console.log('   Open browser or use curl: http://localhost:5000/health');
console.log('   Expected: {"status":"success","message":"HealthSync API is running successfully!"}');
console.log('');

console.log('2️⃣ THEN: Test doctor service status');
console.log('   GET: http://localhost:5000/api/v1/doctors/status');
console.log('   Expected: Service status information');
console.log('');

console.log('3️⃣ TEST: Protected route WITHOUT token (should fail)');
console.log('   GET: http://localhost:5000/api/v1/doctors/me');
console.log('   Expected: 401 Unauthorized - "You are not logged in! Please log in to get access."');
console.log('');

console.log('4️⃣ REGISTER: Create a doctor account');
console.log('   POST: http://localhost:5000/api/v1/auth/register/doctor');
console.log('   Headers: Content-Type: application/json');
console.log('   Body:');
console.log(JSON.stringify({
    fullName: "Dr. John Smith",
    email: "john.smith@example.com",
    password: "SecurePass123!",
    phone: "+1234567890",
    licenseNumber: "LIC123456",
    specialization: "Cardiology",
    experienceYears: 5
}, null, 4));
console.log('   Expected: Success response with doctor data');
console.log('');

console.log('5️⃣ LOGIN: Get authentication token');
console.log('   POST: http://localhost:5000/api/v1/auth/login');
console.log('   Headers: Content-Type: application/json');
console.log('   Body:');
console.log(JSON.stringify({
    email: "john.smith@example.com",
    password: "SecurePass123!"
}, null, 4));
console.log('   Expected: Response with "accessToken" - COPY THIS TOKEN!');
console.log('');

console.log('6️⃣ TEST: Protected route WITH token (should work)');
console.log('   GET: http://localhost:5000/api/v1/doctors/me');
console.log('   Headers: Authorization: Bearer YOUR_ACCESS_TOKEN_HERE');
console.log('   Expected: Doctor profile data');
console.log('');

console.log('7️⃣ TEST: Update basic info WITH token');
console.log('   PUT: http://localhost:5000/api/v1/doctors/me/basic');
console.log('   Headers: ');
console.log('   - Content-Type: application/json');
console.log('   - Authorization: Bearer YOUR_ACCESS_TOKEN_HERE');
console.log('   Body:');
console.log(JSON.stringify({
    fullName: "Dr. John Smith Updated",
    phone: "+1234567891"
}, null, 4));
console.log('   Expected: Success response with updated doctor data');
console.log('');

console.log('🚨 COMMON AUTHENTICATION ISSUES:');
console.log('');
console.log('❌ Missing Authorization Header:');
console.log('   Make sure to include: Authorization: Bearer YOUR_TOKEN');
console.log('');
console.log('❌ Wrong Authorization Format:');
console.log('   Correct: "Bearer eyJhbGciOiJIUzI1NiIs..."');
console.log('   Wrong: "eyJhbGciOiJIUzI1NiIs..." (missing Bearer)');
console.log('   Wrong: "bearer eyJhbGciOiJIUzI1NiIs..." (lowercase bearer)');
console.log('');
console.log('❌ Expired Token:');
console.log('   Tokens expire after 15 minutes by default');
console.log('   Solution: Login again to get a fresh token');
console.log('');
console.log('❌ Wrong Role:');
console.log('   Doctor routes require doctor role in token');
console.log('   Make sure you logged in as a doctor, not patient/admin');
console.log('');
console.log('❌ Email Not Verified:');
console.log('   Doctor accounts need email verification');
console.log('   Check if isEmailVerified is true in your profile');
console.log('');

console.log('💡 QUICK CURL COMMANDS FOR TESTING:');
console.log('');
console.log('# Test server health');
console.log('curl http://localhost:5000/health');
console.log('');
console.log('# Register doctor');
console.log('curl -X POST http://localhost:5000/api/v1/auth/register/doctor \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"fullName":"Dr. Test","email":"test@example.com","password":"Test123!","phone":"+1234567890","licenseNumber":"LIC123","specialization":"Cardiology","experienceYears":5}\'');
console.log('');
console.log('# Login');
console.log('curl -X POST http://localhost:5000/api/v1/auth/login \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"email":"test@example.com","password":"Test123!"}\'');
console.log('');
console.log('# Test protected route (replace YOUR_TOKEN with actual token)');
console.log('curl -X GET http://localhost:5000/api/v1/doctors/me \\');
console.log('  -H "Authorization: Bearer YOUR_TOKEN"');
console.log('');
console.log('# Update basic info (replace YOUR_TOKEN with actual token)');
console.log('curl -X PUT http://localhost:5000/api/v1/doctors/me/basic \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -H "Authorization: Bearer YOUR_TOKEN" \\');
console.log('  -d \'{"fullName":"Dr. Updated Name","phone":"+9876543210"}\'');
console.log('');

console.log('🔧 If you\'re still having issues, check these:');
console.log('1. Server logs for detailed error messages');
console.log('2. JWT_SECRET is set in your .env file');
console.log('3. MongoDB connection is working');
console.log('4. Token format in Postman/curl is correct');
console.log('5. Doctor account status (isActive, isEmailVerified, status)');
console.log('');
