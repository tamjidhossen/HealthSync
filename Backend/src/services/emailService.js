/**
 * Email Service
 * Email functionality for HealthSync using Nodemailer
 */

const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
    constructor() {
        this.transporter = null;
        this.initializeTransporter();
    }

    /**
     * Initialize email transporter
     */
    async initializeTransporter() {
        try {
            // Create transporter based on environment
            if (process.env.NODE_ENV === 'development') {
                // For development, create a test account
                this.transporter = nodemailer.createTransport({
                    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                    port: parseInt(process.env.EMAIL_PORT) || 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: process.env.EMAIL_USERNAME,
                        pass: process.env.EMAIL_PASSWORD,
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });

                logger.info('Email transporter initialized for development (Ethereal)');
            } else {
                // For production, use actual email service
                this.transporter = nodemailer.createTransport({
                    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                    port: parseInt(process.env.EMAIL_PORT) || 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: process.env.EMAIL_USERNAME,
                        pass: process.env.EMAIL_PASSWORD,
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });

                logger.info('Email transporter initialized for production');
            }

            logger.info('Email transporter configured successfully');

        } catch (error) {
            logger.error('Failed to initialize email transporter:', error);

            // Fallback to a simple transporter
            this.transporter = {
                sendMail: async (options) => {
                    logger.info('Email would be sent:', options);
                    return { messageId: 'test-message-id' };
                }
            };
        }
    }

    /**
     * Send email
     * @param {object} options - Email options
     */
    async sendEmail(options) {
        try {
            if (!this.transporter) {
                await this.initializeTransporter();
            }

            const mailOptions = {
                from: `"HealthSync" <${process.env.EMAIL_FROM || process.env.EMAIL_USERNAME}>`,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
            };

            const info = await this.transporter.sendMail(mailOptions);

            logger.info(`Email sent successfully to ${options.to}:`, info.messageId);

            if (process.env.NODE_ENV === 'development') {
                logger.info('Preview URL:', nodemailer.getTestMessageUrl(info));
            }

            return info;

        } catch (error) {
            logger.error('Failed to send email:', error);
            throw error;
        }
    }

    /**
     * Send email verification
     * @param {string} email - Recipient email
     * @param {string} name - Recipient name
     * @param {string} verificationCode - 6-digit verification code
     */
    async sendEmailVerification(email, name, verificationCode) {
        const subject = 'Verify Your HealthSync Account';

        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification - HealthSync</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2c5aa0; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background-color: #f9f9f9; }
            .verification-code { 
              font-size: 32px; 
              font-weight: bold; 
              color: #2c5aa0; 
              text-align: center; 
              padding: 20px; 
              background-color: white; 
              border: 2px dashed #2c5aa0; 
              margin: 20px 0; 
              letter-spacing: 5px;
            }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏥 HealthSync</h1>
              <h2>Email Verification</h2>
            </div>
            
            <div class="content">
              <h3>Hello ${name},</h3>
              
              <p>Thank you for registering with HealthSync! To complete your account setup, please verify your email address by using the verification code below:</p>
              
              <div class="verification-code">${verificationCode}</div>
              
              <p>Enter this code on the verification page to activate your account.</p>
              
              <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul>
                  <li>This code will expire in 10 minutes</li>
                  <li>If you didn't create a HealthSync account, please ignore this email</li>
                  <li>Never share this code with anyone</li>
                </ul>
              </div>
              
              <p>If you need help, please contact our support team.</p>
              
              <p>Best regards,<br>The HealthSync Team</p>
            </div>
            
            <div class="footer">
              <p>© 2025 HealthSync. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

        const text = `
      Hello ${name},
      
      Thank you for registering with HealthSync!
      
      Your email verification code is: ${verificationCode}
      
      This code will expire in 10 minutes.
      
      If you didn't create a HealthSync account, please ignore this email.
      
      Best regards,
      The HealthSync Team
    `;

        return this.sendEmail({ to: email, subject, html, text });
    }

    /**
     * Send welcome email
     * @param {string} email - Recipient email
     * @param {string} name - Recipient name
     * @param {string} userType - User type (doctor, patient, admin)
     */
    async sendWelcome(email, name, userType) {
        console.log("email is sending");
        const subject = `Welcome to HealthSync - Your ${userType} account is ready!`;

        const userTypeMessages = {
            doctor: {
                title: 'Welcome, Dr. ' + name.split(' ').pop(),
                message: 'Your doctor account has been created successfully. Please wait for admin verification before you can start seeing patients.',
                nextSteps: [
                    'Wait for admin verification of your account',
                    'Complete your profile with more details',
                    'Set your availability schedule',
                    'Start helping patients once verified'
                ]
            },
            patient: {
                title: 'Welcome to HealthSync, ' + name.split(' ')[0],
                message: 'Your patient account is ready! You can now book appointments, consult with our AI assistant, and access your medical records.',
                nextSteps: [
                    'Complete your medical profile',
                    'Book your first appointment',
                    'Try our AI health assistant',
                    'Set your notification preferences'
                ]
            },
            admin: {
                title: 'Welcome Admin ' + name.split(' ')[0],
                message: 'Your admin account has been activated. You now have access to the HealthSync admin panel.',
                nextSteps: [
                    'Access the admin dashboard',
                    'Review pending doctor verifications',
                    'Monitor system statistics',
                    'Configure your preferences'
                ]
            }
        };

        const userMsg = userTypeMessages[userType] || userTypeMessages.patient;

        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to HealthSync</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #27ae60; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background-color: #f9f9f9; }
            .next-steps { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .next-steps ul { margin: 0; padding-left: 20px; }
            .next-steps li { margin: 8px 0; }
            .cta-button { 
              display: inline-block; 
              padding: 15px 30px; 
              background-color: #2c5aa0; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0; 
              text-align: center;
            }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏥 HealthSync</h1>
              <h2>${userMsg.title}!</h2>
            </div>
            
            <div class="content">
              <h3>🎉 Welcome to HealthSync!</h3>
              
              <p>${userMsg.message}</p>
              
              <div class="next-steps">
                <h4>🚀 Next Steps:</h4>
                <ul>
                  ${userMsg.nextSteps.map(step => `<li>${step}</li>`).join('')}
                </ul>
              </div>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" 
                    class="cta-button" 
                    style="color: #ffffff; text-decoration: none;">
                    Access Your Account
                </a>
              </div>
              
              <p>If you have any questions or need assistance, our support team is here to help.</p>
              
              <p>Best regards,<br>The HealthSync Team</p>
            </div>
            
            <div class="footer">
              <p>© 2025 HealthSync. All rights reserved.</p>
              <p>Building the future of digital healthcare 🏥✨</p>
            </div>
          </div>
        </body>
      </html>
    `;

        const text = `
      ${userMsg.title}!
      
      Welcome to HealthSync!
      
      ${userMsg.message}
      
      Next Steps:
      ${userMsg.nextSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}
      
      Access your account at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}
      
      Best regards,
      The HealthSync Team
    `;

        return this.sendEmail({ to: email, subject, html, text });
    }

    /**
     * Send password reset email
     * @param {string} email - Recipient email
     * @param {string} name - Recipient name
     * @param {string} resetToken - Password reset token
     */
    async sendPasswordReset(email, name, resetToken) {
        const subject = 'Reset Your HealthSync Password';
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - HealthSync</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #e74c3c; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background-color: #f9f9f9; }
            .reset-button { 
              display: inline-block; 
              padding: 15px 30px; 
              background-color: #e74c3c; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0; 
              text-align: center;
            }
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏥 HealthSync</h1>
              <h2>Password Reset Request</h2>
            </div>
            
            <div class="content">
              <h3>Hello ${name},</h3>
              
              <p>We received a request to reset your HealthSync account password. If you made this request, click the button below to reset your password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="reset-button">Reset My Password</a>
              </div>
              
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; color: #2c5aa0;">${resetUrl}</p>
              
              <div class="warning">
                <strong>⚠️ Important Security Information:</strong>
                <ul>
                  <li>This link will expire in 10 minutes</li>
                  <li>If you didn't request this password reset, please ignore this email</li>
                  <li>Your account is secure and no changes have been made</li>
                  <li>Never share this reset link with anyone</li>
                </ul>
              </div>
              
              <p>If you continue to have problems, please contact our support team.</p>
              
              <p>Best regards,<br>The HealthSync Team</p>
            </div>
            
            <div class="footer">
              <p>© 2025 HealthSync. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

        const text = `
      Hello ${name},
      
      We received a request to reset your HealthSync account password.
      
      To reset your password, visit: ${resetUrl}
      
      This link will expire in 10 minutes.
      
      If you didn't request this password reset, please ignore this email.
      
      Best regards,
      The HealthSync Team
    `;

        return this.sendEmail({ to: email, subject, html, text });
    }

    /**
     * Send appointment confirmation email
     * @param {string} email - Recipient email
     * @param {object} appointmentData - Appointment details
     */
    async sendAppointmentConfirmation(email, appointmentData) {
        const { patientName, doctorName, appointmentDate, appointmentId, mode } = appointmentData;
        const subject = `Appointment Confirmed - ${appointmentId}`;

        const formattedDate = new Date(appointmentDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Appointment Confirmation - HealthSync</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2c5aa0; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background-color: #f9f9f9; }
            .appointment-details { 
              background-color: white; 
              padding: 20px; 
              margin: 20px 0; 
              border-radius: 5px; 
              border-left: 4px solid #2c5aa0;
            }
            .detail-row { margin: 10px 0; }
            .label { font-weight: bold; color: #2c5aa0; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏥 HealthSync</h1>
              <h2>Appointment Confirmed</h2>
            </div>
            
            <div class="content">
              <h3>Hello ${patientName},</h3>
              
              <p>Your appointment has been confirmed! Here are the details:</p>
              
              <div class="appointment-details">
                <div class="detail-row">
                  <span class="label">Appointment ID:</span> ${appointmentId}
                </div>
                <div class="detail-row">
                  <span class="label">Doctor:</span> ${doctorName}
                </div>
                <div class="detail-row">
                  <span class="label">Date & Time:</span> ${formattedDate}
                </div>
                <div class="detail-row">
                  <span class="label">Mode:</span> ${mode}
                </div>
              </div>
              
              <p>Please make sure to arrive on time for your appointment. If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
              
              <p>Best regards,<br>The HealthSync Team</p>
            </div>
            
            <div class="footer">
              <p>© 2025 HealthSync. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

        const text = `
      Appointment Confirmed - ${appointmentId}
      
      Hello ${patientName},
      
      Your appointment has been confirmed!
      
      Details:
      - Appointment ID: ${appointmentId}
      - Doctor: ${doctorName}
      - Date & Time: ${formattedDate}
      - Mode: ${mode}
      
      Please arrive on time for your appointment.
      
      Best regards,
      The HealthSync Team
    `;

        return this.sendEmail({ to: email, subject, html, text });
    }
}

// Create and export a single instance
const emailService = new EmailService();

module.exports = emailService;
