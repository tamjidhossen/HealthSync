/**
 * ID Generator Utility
 * Generates unique IDs for different entities in HealthSync
 */

const mongoose = require('mongoose');

/**
 * Generate unique ID with prefix
 * @param {string} prefix - The prefix for the ID (DOC, PAT, ADM, etc.)
 * @param {number} length - Length of the numeric part (default: 5)
 * @returns {Promise<string>} - Generated unique ID
 */
const generateUniqueId = async (prefix, length = 5) => {
  const Doctor = require('../models/Doctor');
  const Patient = require('../models/Patient');
  const Admin = require('../models/Admin');

  // Determine which model to check based on prefix
  let Model;
  let field;

  switch (prefix) {
    case 'DOC':
      Model = Doctor;
      field = 'doctorId';
      break;
    case 'PAT':
      Model = Patient;
      field = 'patientId';
      break;
    case 'ADM':
      Model = Admin;
      field = 'adminId';
      break;
    default:
      throw new Error(`Unsupported ID prefix: ${prefix}`);
  }

  let attempts = 0;
  const maxAttempts = 100; // Prevent infinite loops

  while (attempts < maxAttempts) {
    attempts++;

    // Generate random number with specified length
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    // Create the full ID
    const generatedId = `${prefix}-${randomNumber}`;

    try {
      // Check if this ID already exists
      const query = {};
      query[field] = generatedId;
      const existing = await Model.findOne(query);

      if (!existing) {
        return generatedId;
      }
    } catch (error) {
      // If there's a database error, continue trying
      if (attempts >= maxAttempts) {
        throw new Error(`Failed to generate unique ID after ${maxAttempts} attempts: ${error.message}`);
      }
    }
  }

  throw new Error(`Failed to generate unique ID after ${maxAttempts} attempts`);
};

/**
 * Generate Appointment ID
 * @returns {Promise<string>} - Generated appointment ID
 */
const generateAppointmentId = async () => {
  // We'll import Appointment model when it's created
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    attempts++;

    const randomNumber = Math.floor(Math.random() * 99999) + 10000; // 5-digit number
    const generatedId = `APPT-${randomNumber}`;

    try {
      // Try to import Appointment model
      try {
        const Appointment = require('../models/Appointment');
        const existing = await Appointment.findOne({ appointmentId: generatedId });

        if (!existing) {
          return generatedId;
        }
      } catch (importError) {
        // If Appointment model doesn't exist yet, return the generated ID
        return generatedId;
      }
    } catch (error) {
      if (attempts >= maxAttempts) {
        throw new Error(`Failed to generate appointment ID: ${error.message}`);
      }
    }
  }

  throw new Error(`Failed to generate appointment ID after ${maxAttempts} attempts`);
};

/**
 * Generate Prescription ID
 * @returns {Promise<string>} - Generated prescription ID
 */
const generatePrescriptionId = async () => {
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    attempts++;

    const randomNumber = Math.floor(Math.random() * 900000) + 100000; // 6-digit number
    const generatedId = `PRSC-${randomNumber}`;

    try {
      // Try to import Prescription model
      try {
        const Prescription = require('../models/Prescription');
        const existing = await Prescription.findOne({ prescriptionId: generatedId });

        if (!existing) {
          return generatedId;
        }
      } catch (importError) {
        // If Prescription model doesn't exist yet, return the generated ID
        return generatedId;
      }
    } catch (error) {
      if (attempts >= maxAttempts) {
        throw new Error(`Failed to generate prescription ID: ${error.message}`);
      }
    }
  }

  throw new Error(`Failed to generate prescription ID after ${maxAttempts} attempts`);
};

/**
 * Generate Medical Record ID
 * @returns {Promise<string>} - Generated medical record ID
 */
const generateMedicalRecordId = async () => {
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    attempts++;

    const randomNumber = Math.floor(Math.random() * 900000) + 100000; // 6-digit number
    const generatedId = `MR-${randomNumber}`;

    try {
      // Try to import MedicalRecord model
      try {
        const MedicalRecord = require('../models/MedicalRecord');
        const existing = await MedicalRecord.findOne({ recordId: generatedId });

        if (!existing) {
          return generatedId;
        }
      } catch (importError) {
        // If MedicalRecord model doesn't exist yet, return the generated ID
        return generatedId;
      }
    } catch (error) {
      if (attempts >= maxAttempts) {
        throw new Error(`Failed to generate medical record ID: ${error.message}`);
      }
    }
  }

  throw new Error(`Failed to generate medical record ID after ${maxAttempts} attempts`);
};

/**
 * Generate Chat Session ID
 * @returns {string} - Generated chat session ID
 */
const generateChatSessionId = () => {
  const timestamp = Date.now();
  const randomPart = Math.floor(Math.random() * 9999) + 1000; // 4-digit number
  return `CHAT-${timestamp}-${randomPart}`;
};

/**
 * Generate OTP (One Time Password)
 * @param {number} length - Length of OTP (default: 6)
 * @returns {string} - Generated OTP
 */
const generateOTP = (length = 6) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min + '';
};

/**
 * Generate random token for various purposes
 * @param {number} length - Length of token (default: 32)
 * @returns {string} - Generated token
 */
const generateRandomToken = (length = 32) => {
  const crypto = require('crypto');
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate file upload ID
 * @param {string} prefix - File type prefix (IMG, DOC, RPT, etc.)
 * @returns {string} - Generated file ID
 */
const generateFileId = (prefix = 'FILE') => {
  const timestamp = Date.now();
  const randomPart = Math.floor(Math.random() * 9999) + 1000;
  return `${prefix}-${timestamp}-${randomPart}`;
};

/**
 * Validate ID format
 * @param {string} id - ID to validate
 * @param {string} expectedPrefix - Expected prefix
 * @returns {boolean} - Whether ID is valid
 */
const validateIdFormat = (id, expectedPrefix) => {
  if (!id || typeof id !== 'string') return false;

  const regex = new RegExp(`^${expectedPrefix}-\\d+$`);
  return regex.test(id);
};

/**
 * Extract number from ID
 * @param {string} id - ID to extract number from
 * @returns {number|null} - Extracted number or null if invalid
 */
const extractNumberFromId = (id) => {
  if (!id || typeof id !== 'string') return null;

  const parts = id.split('-');
  if (parts.length !== 2) return null;

  const number = parseInt(parts[1], 10);
  return isNaN(number) ? null : number;
};

module.exports = generateUniqueId;

// Export individual functions as well
module.exports.generateUniqueId = generateUniqueId;
module.exports.generateAppointmentId = generateAppointmentId;
module.exports.generatePrescriptionId = generatePrescriptionId;
module.exports.generateMedicalRecordId = generateMedicalRecordId;
module.exports.generateChatSessionId = generateChatSessionId;
module.exports.generateOTP = generateOTP;
module.exports.generateRandomToken = generateRandomToken;
module.exports.generateFileId = generateFileId;
module.exports.validateIdFormat = validateIdFormat;
module.exports.extractNumberFromId = extractNumberFromId;
