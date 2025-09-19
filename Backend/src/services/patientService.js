/**
 * Patient Service
 * Business logic layer for patient profile management
 */

const Patient = require('../models/Patient');
const { AppError } = require('../middleware/errorHandler');

/**
 * Calculate patient profile completeness
 * @param {Object} patient - Patient document
 * @returns {Object} Profile completeness data
 */
const calculateProfileCompleteness = (patient) => {
    const sections = {
        basicInfo: 0,
        contactInfo: 0,
        medicalInfo: 0,
        emergencyInfo: 0,
        insuranceInfo: 0,
        healthMetrics: 0
    };

    let totalFields = 0;
    let completedFields = 0;

    // Basic Information (weight: 25%)
    const basicFields = ['fullName', 'dateOfBirth', 'gender', 'bloodGroup', 'phone'];
    basicFields.forEach(field => {
        totalFields++;
        if (patient[field]) {
            completedFields++;
            sections.basicInfo++;
        }
    });

    // Contact Information (weight: 15%)
    const contactFields = ['email'];
    const addressFields = ['street', 'city', 'state', 'zipCode', 'country'];

    contactFields.forEach(field => {
        totalFields++;
        if (patient[field]) {
            completedFields++;
            sections.contactInfo++;
        }
    });

    addressFields.forEach(field => {
        totalFields++;
        if (patient.address && patient.address[field]) {
            completedFields++;
            sections.contactInfo++;
        }
    });

    // Medical Information (weight: 25%)
    totalFields += 3;
    if (patient.medicalHistory.allergies && patient.medicalHistory.allergies.length > 0) {
        completedFields++;
        sections.medicalInfo++;
    }
    if (patient.medicalHistory.chronicConditions && patient.medicalHistory.chronicConditions.length > 0) {
        completedFields++;
        sections.medicalInfo++;
    }
    if (patient.medicalHistory.currentMedications && patient.medicalHistory.currentMedications.length > 0) {
        completedFields++;
        sections.medicalInfo++;
    }

    // Emergency Contact (weight: 15%)
    const emergencyFields = ['name', 'phone', 'relation'];
    emergencyFields.forEach(field => {
        totalFields++;
        if (patient.emergencyContact && patient.emergencyContact[field]) {
            completedFields++;
            sections.emergencyInfo++;
        }
    });

    // Insurance Information (weight: 10%)
    const insuranceFields = ['provider', 'policyNumber'];
    insuranceFields.forEach(field => {
        totalFields++;
        if (patient.insurance && patient.insurance[field]) {
            completedFields++;
            sections.insuranceInfo++;
        }
    });

    // Health Metrics (weight: 10%)
    totalFields += 2;
    if (patient.healthMetrics && patient.healthMetrics.height && patient.healthMetrics.height.value) {
        completedFields++;
        sections.healthMetrics++;
    }
    if (patient.healthMetrics && patient.healthMetrics.weight && patient.healthMetrics.weight.value) {
        completedFields++;
        sections.healthMetrics++;
    }

    const completionPercentage = Math.round((completedFields / totalFields) * 100);

    return {
        overall: completionPercentage,
        totalFields,
        completedFields,
        sections: {
            basicInfo: {
                completed: sections.basicInfo,
                total: basicFields.length,
                percentage: Math.round((sections.basicInfo / basicFields.length) * 100)
            },
            contactInfo: {
                completed: sections.contactInfo,
                total: contactFields.length + addressFields.length,
                percentage: Math.round((sections.contactInfo / (contactFields.length + addressFields.length)) * 100)
            },
            medicalInfo: {
                completed: sections.medicalInfo,
                total: 3,
                percentage: Math.round((sections.medicalInfo / 3) * 100)
            },
            emergencyInfo: {
                completed: sections.emergencyInfo,
                total: emergencyFields.length,
                percentage: Math.round((sections.emergencyInfo / emergencyFields.length) * 100)
            },
            insuranceInfo: {
                completed: sections.insuranceInfo,
                total: insuranceFields.length,
                percentage: Math.round((sections.insuranceInfo / insuranceFields.length) * 100)
            },
            healthMetrics: {
                completed: sections.healthMetrics,
                total: 2,
                percentage: Math.round((sections.healthMetrics / 2) * 100)
            }
        }
    };
};

/**
 * Get health risk assessment based on patient data
 * @param {Object} patient - Patient document
 * @returns {Object} Health risk assessment
 */
const getHealthRiskAssessment = (patient) => {
    const risks = [];
    let riskLevel = 'low';

    // Age-based risk
    const age = patient.age;
    if (age >= 65) {
        risks.push('Advanced age increases risk of various health conditions');
        riskLevel = 'moderate';
    }

    // BMI-based risk
    const bmi = patient.bmi;
    if (bmi) {
        if (bmi < 18.5) {
            risks.push('Underweight - may indicate nutritional deficiencies');
            riskLevel = 'moderate';
        } else if (bmi >= 30) {
            risks.push('Obesity increases risk of cardiovascular disease, diabetes, and other conditions');
            riskLevel = 'high';
        } else if (bmi >= 25) {
            risks.push('Overweight - consider lifestyle modifications');
            riskLevel = riskLevel === 'low' ? 'moderate' : riskLevel;
        }
    }

    // Chronic conditions risk
    const activeConditions = patient.medicalHistory.chronicConditions?.filter(c => c.status === 'active') || [];
    if (activeConditions.length >= 3) {
        risks.push('Multiple active chronic conditions require careful management');
        riskLevel = 'high';
    } else if (activeConditions.length >= 1) {
        risks.push('Chronic conditions present - regular monitoring recommended');
        riskLevel = riskLevel === 'low' ? 'moderate' : riskLevel;
    }

    // Allergy risk
    const severeAllergies = patient.medicalHistory.allergies?.filter(a => a.severity === 'severe') || [];
    if (severeAllergies.length > 0) {
        risks.push('Severe allergies present - emergency action plan recommended');
        riskLevel = 'high';
    }

    // Medication risk
    const currentMedications = patient.medicalHistory.currentMedications || [];
    if (currentMedications.length >= 5) {
        risks.push('Multiple medications - drug interaction monitoring needed');
        riskLevel = riskLevel === 'low' ? 'moderate' : riskLevel;
    }

    return {
        level: riskLevel,
        factors: risks,
        recommendations: getHealthRecommendations(patient, riskLevel)
    };
};

/**
 * Get personalized health recommendations
 * @param {Object} patient - Patient document
 * @param {string} riskLevel - Health risk level
 * @returns {Array} Health recommendations
 */
const getHealthRecommendations = (patient, riskLevel) => {
    const recommendations = [];

    // Profile completeness recommendations
    const completeness = calculateProfileCompleteness(patient);
    if (completeness.overall < 80) {
        recommendations.push('Complete your medical profile for better personalized care');
    }

    // Health metrics recommendations
    if (!patient.healthMetrics || !patient.healthMetrics.height?.value || !patient.healthMetrics.weight?.value) {
        recommendations.push('Update your height and weight for BMI calculation and health tracking');
    }

    // Emergency contact recommendations
    if (!patient.emergencyContact || !patient.emergencyContact.name) {
        recommendations.push('Add an emergency contact for safety purposes');
    }

    // Insurance recommendations
    if (!patient.insurance || !patient.insurance.provider) {
        recommendations.push('Add insurance information to streamline healthcare processes');
    }

    // Risk-based recommendations
    if (riskLevel === 'high') {
        recommendations.push('Schedule regular check-ups due to identified health risk factors');
        recommendations.push('Consider consulting with specialists for chronic condition management');
    } else if (riskLevel === 'moderate') {
        recommendations.push('Maintain regular preventive care appointments');
        recommendations.push('Consider lifestyle modifications to reduce health risks');
    }

    // Age-based recommendations
    const age = patient.age;
    if (age >= 50) {
        recommendations.push('Consider age-appropriate screening tests (colonoscopy, mammography, etc.)');
    }
    if (age >= 65) {
        recommendations.push('Annual comprehensive geriatric assessment recommended');
    }

    // BMI-based recommendations
    const bmi = patient.bmi;
    if (bmi && bmi >= 25) {
        recommendations.push('Consider consulting with a nutritionist for weight management');
    }

    return recommendations;
};

/**
 * Generate patient health summary
 * @param {Object} patient - Patient document
 * @returns {Object} Health summary
 */
const generateHealthSummary = (patient) => {
    const summary = {
        demographics: {
            age: patient.age,
            gender: patient.gender,
            bloodGroup: patient.bloodGroup
        },
        healthMetrics: {
            bmi: patient.bmi,
            bmiCategory: getBMICategory(patient.bmi),
            lastUpdated: patient.healthMetrics?.lastUpdated
        },
        medicalOverview: {
            allergies: patient.medicalHistory.allergies?.length || 0,
            chronicConditions: patient.medicalHistory.chronicConditions?.length || 0,
            currentMedications: patient.medicalHistory.currentMedications?.length || 0,
            surgicalHistory: patient.medicalHistory.surgicalHistory?.length || 0
        },
        riskAssessment: getHealthRiskAssessment(patient),
        profileCompleteness: calculateProfileCompleteness(patient)
    };

    return summary;
};

/**
 * Validate allergy data
 * @param {Object} allergyData - Allergy data to validate
 * @returns {Object} Validation result
 */
const validateAllergyData = (allergyData) => {
    const errors = [];

    if (!allergyData.allergen || allergyData.allergen.trim().length === 0) {
        errors.push('Allergen name is required');
    }

    if (!allergyData.severity) {
        errors.push('Allergy severity is required');
    } else if (!['mild', 'moderate', 'severe'].includes(allergyData.severity)) {
        errors.push('Allergy severity must be mild, moderate, or severe');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Validate chronic condition data
 * @param {Object} conditionData - Condition data to validate
 * @returns {Object} Validation result
 */
const validateConditionData = (conditionData) => {
    const errors = [];

    if (!conditionData.condition || conditionData.condition.trim().length === 0) {
        errors.push('Condition name is required');
    }

    if (!conditionData.diagnosedDate) {
        errors.push('Diagnosed date is required');
    } else if (new Date(conditionData.diagnosedDate) > new Date()) {
        errors.push('Diagnosed date cannot be in the future');
    }

    if (conditionData.status && !['active', 'controlled', 'resolved'].includes(conditionData.status)) {
        errors.push('Condition status must be active, controlled, or resolved');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Helper function to get BMI category
 * @param {number} bmi - BMI value
 * @returns {string} BMI category
 */
function getBMICategory(bmi) {
    if (!bmi) return null;

    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
}

/**
 * Get patients with similar conditions (for future community features)
 * @param {string} patientId - Patient ID
 * @param {Array} conditions - List of conditions
 * @returns {Promise<Array>} Similar patients (anonymized)
 */
const findSimilarPatients = async (patientId, conditions) => {
    if (!conditions || conditions.length === 0) {
        return [];
    }

    const conditionNames = conditions.map(c => c.condition.toLowerCase());

    const similarPatients = await Patient.find({
        _id: { $ne: patientId },
        'medicalHistory.chronicConditions.condition': {
            $in: conditionNames.map(name => new RegExp(name, 'i'))
        },
        isActive: true
    })
        .select('age gender medicalHistory.chronicConditions')
        .limit(5);

    // Return anonymized data
    return similarPatients.map(patient => ({
        age: patient.age,
        gender: patient.gender,
        commonConditions: patient.medicalHistory.chronicConditions
            .filter(c => conditionNames.some(name =>
                c.condition.toLowerCase().includes(name)
            ))
            .map(c => ({ condition: c.condition, status: c.status }))
    }));
};

module.exports = {
    calculateProfileCompleteness,
    getHealthRiskAssessment,
    getHealthRecommendations,
    generateHealthSummary,
    validateAllergyData,
    validateConditionData,
    findSimilarPatients
};
