const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = express();

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Middleware
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'https://deepclean.au', 'https://www.deepclean.au'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10 // limit each IP to 10 requests per windowMs
});

app.use('/api/', limiter);

// Helper function to format contact email
function formatContactEmail(data) {
    const serviceTypes = Array.isArray(data.serviceType) ? data.serviceType : [data.serviceType];
    
    return {
        to: process.env.TO_EMAIL || 'deepclean.go2@gmail.com', // Amie's actual email
        from: {
            email: process.env.FROM_EMAIL || 'amie@deepclean.au',
            name: process.env.FROM_NAME || 'Amie - DEEP CLEAN'
        }, // Professional sender address
        subject: `New Quote Request from ${data.firstName} ${data.lastName}`,
        text: `
New Quote Request from DEEP CLEAN Website

CUSTOMER INFORMATION:
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
Property Address: ${data.address}

PROPERTY DETAILS:
Property Type: ${data.propertyType}
Property Size: ${data.propertySize || 'Not specified'}

SERVICES REQUESTED:
${serviceTypes.join('\n')}

TIMING:
${data.urgency || 'Flexible'}

ADDITIONAL DETAILS:
${data.message || 'No additional message'}

PHOTOS ATTACHED: ${data.photos ? 'Yes' : 'No'}

---
This email was sent from your website's contact form.
        `,
        html: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0;">
    <!-- Header with Logo -->
    <div style="background: white; padding: 20px; text-align: center; border-bottom: 3px solid #1e7ca8;">
        <img src="https://deepclean.au/assets/DEEP CLEAN Logo.png" alt="DEEP CLEAN" style="max-width: 120px; height: auto;">
        <h2 style="color: #1e7ca8; margin: 15px 0 5px 0;">New Quote Request</h2>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px; background: white;">
        <div style="margin-bottom: 25px;">
            <h3 style="color: #1e7ca8; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px; margin-bottom: 15px;">Contact Details</h3>
            <p style="margin: 8px 0;"><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #1e7ca8;">${data.email}</a></p>
            <p style="margin: 8px 0;"><strong>Phone:</strong> <a href="tel:${data.phone}" style="color: #1e7ca8;">${data.phone}</a></p>
            <p style="margin: 8px 0;"><strong>Address:</strong> ${data.address}</p>
        </div>
        
        <div style="margin-bottom: 25px;">
            <h3 style="color: #1e7ca8; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px; margin-bottom: 15px;">Service Details</h3>
            <p style="margin: 8px 0;"><strong>Property Type:</strong> ${data.propertyType}</p>
            <p style="margin: 8px 0;"><strong>Size:</strong> ${data.propertySize || 'Not specified'}</p>
            <p style="margin: 8px 0;"><strong>Services Needed:</strong></p>
            <ul style="margin: 8px 0; padding-left: 25px;">
                ${serviceTypes.map(service => `<li style="margin: 5px 0;">${service}</li>`).join('')}
            </ul>
            <p style="margin: 8px 0;"><strong>Timing:</strong> ${data.urgency || 'Flexible'}</p>
        </div>
        
        ${data.message ? `
        <div style="margin-bottom: 25px;">
            <h3 style="color: #1e7ca8; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px; margin-bottom: 15px;">Additional Notes</h3>
            <p style="margin: 8px 0;">${data.message}</p>
        </div>
        ` : ''}
        
        ${data.photos ? '<p style="background: #f0f8ff; padding: 10px; border-radius: 5px; margin-top: 20px;">📷 Customer has attached photos for reference</p>' : ''}
    </div>
    
    <!-- Professional Footer -->
    <div style="background: #f8f9fa; padding: 25px; text-align: center; border-top: 1px solid #e0e0e0;">
        <img src="https://deepclean.au/assets/DEEP CLEAN Logo.png" alt="DEEP CLEAN" style="max-width: 80px; height: auto; margin-bottom: 15px;">
        <p style="margin: 5px 0; color: #666; font-size: 14px;"><strong>DEEP CLEAN</strong></p>
        <p style="margin: 5px 0; color: #666; font-size: 13px;">Premium Cleaning Services</p>
        <p style="margin: 10px 0 5px 0; color: #666; font-size: 13px;">
            📞 <a href="tel:0433147018" style="color: #1e7ca8; text-decoration: none;">0433 147 018</a> | 
            ✉️ <a href="mailto:deepclean.go2@gmail.com" style="color: #1e7ca8; text-decoration: none;">deepclean.go2@gmail.com</a>
        </p>
        <p style="margin: 5px 0; color: #999; font-size: 12px;">Brisbane Bayside & Southeast</p>
        <p style="margin: 15px 0 0 0; color: #999; font-size: 11px;">ABN: 57 805 931 28</p>
    </div>
</div>
        `,
        replyTo: data.email
    };
}

// Helper function to format application email
function formatApplicationEmail(data) {
    return {
        to: process.env.TO_EMAIL || 'deepclean.go2@gmail.com', // Amie's actual email
        from: {
            email: process.env.FROM_EMAIL || 'amie@deepclean.au',
            name: process.env.FROM_NAME || 'Amie - DEEP CLEAN'
        },
        subject: `New Job Application from ${data.firstName} ${data.lastName}`,
        text: `
New Job Application for DEEP CLEAN

PERSONAL INFORMATION:
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
Date of Birth: ${data.dob}
Address: ${data.address}

ELIGIBILITY:
Australian Resident/Citizen: ${data.residency}
Valid Driver's License: ${data.driversLicense}

AVAILABILITY:
${data.availability || 'Not specified'}

EXPERIENCE:
Any cleaning experience? ${data.hasExperience}
${data.experienceDetails ? `Details: ${data.experienceDetails}` : ''}

EMPLOYMENT HISTORY:
${data.job1Company ? `
Most Recent Job:
Company: ${data.job1Company}
Position: ${data.job1Position}
Duration: ${data.job1Duration}
` : 'No employment history provided'}

${data.job2Company ? `
Previous Job:
Company: ${data.job2Company}
Position: ${data.job2Position}
Duration: ${data.job2Duration}
` : ''}

${data.job3Company ? `
Third Job:
Company: ${data.job3Company}
Position: ${data.job3Position}
Duration: ${data.job3Duration}
` : ''}

ABOUT THE APPLICANT:
Why they want to join: ${data.whyJoin}
Personal qualities: ${data.strengths || 'Not specified'}

REFERENCES:
Reference 1:
Name: ${data.ref1Name}
Relationship: ${data.ref1Relationship}
Phone: ${data.ref1Phone}
Email: ${data.ref1Email || 'Not provided'}

Reference 2:
Name: ${data.ref2Name}
Relationship: ${data.ref2Relationship}
Phone: ${data.ref2Phone}
Email: ${data.ref2Email || 'Not provided'}

ADDITIONAL INFORMATION:
Transport: ${data.hasTransport}
Start Date: ${data.startDate}
Additional Comments: ${data.additionalComments || 'None'}

---
This application was submitted through your website's careers page.
        `,
        html: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0;">
    <!-- Header with Logo -->
    <div style="background: white; padding: 20px; text-align: center; border-bottom: 3px solid #1e7ca8;">
        <img src="https://deepclean.au/assets/DEEP CLEAN Logo.png" alt="DEEP CLEAN" style="max-width: 120px; height: auto;">
        <h2 style="color: #1e7ca8; margin: 15px 0 5px 0;">New Job Application</h2>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px; background: white;">
        <div style="margin-bottom: 25px;">
            <h3 style="color: #1e7ca8; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px; margin-bottom: 15px;">Applicant Details</h3>
            <p style="margin: 8px 0;"><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #1e7ca8;">${data.email}</a></p>
            <p style="margin: 8px 0;"><strong>Phone:</strong> <a href="tel:${data.phone}" style="color: #1e7ca8;">${data.phone}</a></p>
            <p style="margin: 8px 0;"><strong>Location:</strong> ${data.address}</p>
        </div>
        
        <div style="margin-bottom: 25px;">
            <h3 style="color: #1e7ca8; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px; margin-bottom: 15px;">Why They Want to Join</h3>
            <p style="margin: 8px 0; line-height: 1.6;">${data.whyJoin}</p>
        </div>
        
        ${data.strengths ? `
        <div style="margin-bottom: 25px;">
            <h3 style="color: #1e7ca8; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px; margin-bottom: 15px;">Personal Qualities</h3>
            <p style="margin: 8px 0; line-height: 1.6;">${data.strengths}</p>
        </div>
        ` : ''}
        
        <div style="margin-bottom: 25px;">
            <h3 style="color: #1e7ca8; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px; margin-bottom: 15px;">References</h3>
            <p style="margin: 8px 0;"><strong>Reference 1:</strong> ${data.ref1Name} (${data.ref1Relationship}) - ${data.ref1Phone}</p>
            <p style="margin: 8px 0;"><strong>Reference 2:</strong> ${data.ref2Name} (${data.ref2Relationship}) - ${data.ref2Phone}</p>
        </div>
        
        <div style="margin-bottom: 25px;">
            <h3 style="color: #1e7ca8; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px; margin-bottom: 15px;">Quick Info</h3>
            <p style="margin: 8px 0;"><strong>Has Transport:</strong> ${data.hasTransport}</p>
            <p style="margin: 8px 0;"><strong>Can Start:</strong> ${data.startDate || 'Immediately'}</p>
            <p style="margin: 8px 0;"><strong>Availability:</strong> ${data.availability || 'Flexible'}</p>
        </div>
        
        <div style="background: #f0f8ff; padding: 15px; border-radius: 5px; margin-top: 25px;">
            <p style="margin: 0; color: #1e7ca8; font-weight: 500;">✓ Application received at ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Brisbane' })}</p>
        </div>
    </div>
    
    <!-- Professional Footer -->
    <div style="background: #f8f9fa; padding: 25px; text-align: center; border-top: 1px solid #e0e0e0;">
        <img src="https://deepclean.au/assets/DEEP CLEAN Logo.png" alt="DEEP CLEAN" style="max-width: 80px; height: auto; margin-bottom: 15px;">
        <p style="margin: 5px 0; color: #666; font-size: 14px;"><strong>DEEP CLEAN</strong></p>
        <p style="margin: 5px 0; color: #666; font-size: 13px;">Premium Cleaning Services</p>
        <p style="margin: 10px 0 5px 0; color: #666; font-size: 13px;">
            📞 <a href="tel:0433147018" style="color: #1e7ca8; text-decoration: none;">0433 147 018</a> | 
            ✉️ <a href="mailto:deepclean.go2@gmail.com" style="color: #1e7ca8; text-decoration: none;">deepclean.go2@gmail.com</a>
        </p>
        <p style="margin: 5px 0; color: #999; font-size: 12px;">Brisbane Bayside & Southeast</p>
        <p style="margin: 15px 0 0 0; color: #999; font-size: 11px;">ABN: 57 805 931 28</p>
    </div>
</div>
        `,
        replyTo: data.email
    };
}

// Validation middleware
function validateContactForm(req, res, next) {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address'];
    const missing = required.filter(field => !req.body[field]);
    
    if (missing.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Missing required fields: ${missing.join(', ')}`
        });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email address format'
        });
    }
    
    next();
}

function validateApplicationForm(req, res, next) {
    const required = ['firstName', 'lastName', 'email', 'phone', 'whyJoin', 
                     'ref1Name', 'ref1Phone', 'ref2Name', 'ref2Phone'];
    const missing = required.filter(field => !req.body[field]);
    
    if (missing.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Missing required fields: ${missing.join(', ')}`
        });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email address format'
        });
    }
    
    next();
}

// Contact form endpoint
app.post('/api/contact', validateContactForm, async (req, res) => {
    try {
        console.log('Received contact form submission:', req.body);
        
        const emailData = formatContactEmail(req.body);
        
        // Send email to business owner
        await sgMail.send(emailData);
        
        // Send confirmation email to customer
        const confirmationEmail = {
            to: req.body.email,
            from: {
                email: process.env.FROM_EMAIL || 'amie@deepclean.au',
                name: process.env.FROM_NAME || 'Amie - DEEP CLEAN'
            },
            subject: 'Thank you for contacting DEEP CLEAN',
            text: `
Dear ${req.body.firstName},

Thank you for reaching out to DEEP CLEAN! We've received your quote request and will get back to you within 24 hours.

If you need immediate assistance, please call us at 0433 147 018.

Best regards,
The DEEP CLEAN Team
            `,
            html: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0;">
    <!-- Header with Logo -->
    <div style="background: white; padding: 20px; text-align: center; border-bottom: 3px solid #1e7ca8;">
        <img src="https://deepclean.au/assets/DEEP CLEAN Logo.png" alt="DEEP CLEAN" style="max-width: 120px; height: auto;">
    </div>
    
    <!-- Content -->
    <div style="padding: 30px; background: white;">
        <h2 style="color: #1e7ca8; margin-top: 0;">Thank You for Your Enquiry!</h2>
        
        <p style="color: #333; line-height: 1.6;">Dear ${req.body.firstName},</p>
        
        <p style="color: #333; line-height: 1.6;">Thank you for contacting DEEP CLEAN. We've received your quote request and appreciate your interest in our services.</p>
        
        <p style="color: #333; line-height: 1.6;">We'll review your requirements and get back to you within 24 hours with a detailed quote.</p>
        
        <p style="color: #333; line-height: 1.6;">If you need immediate assistance, please don't hesitate to call us at <strong style="color: #1e7ca8;">0433 147 018</strong>.</p>
        
        <p style="color: #333; line-height: 1.6; margin-top: 25px;">Warm regards,<br>
        <strong>Amie</strong><br>
        DEEP CLEAN</p>
    </div>
    
    <!-- Professional Footer -->
    <div style="background: #f8f9fa; padding: 25px; text-align: center; border-top: 1px solid #e0e0e0;">
        <img src="https://deepclean.au/assets/DEEP CLEAN Logo.png" alt="DEEP CLEAN" style="max-width: 80px; height: auto; margin-bottom: 15px;">
        <p style="margin: 5px 0; color: #666; font-size: 14px;"><strong>DEEP CLEAN</strong></p>
        <p style="margin: 5px 0; color: #666; font-size: 13px;">Premium Cleaning Services</p>
        <p style="margin: 10px 0 5px 0; color: #666; font-size: 13px;">
            📞 <a href="tel:0433147018" style="color: #1e7ca8; text-decoration: none;">0433 147 018</a> | 
            ✉️ <a href="mailto:deepclean.go2@gmail.com" style="color: #1e7ca8; text-decoration: none;">deepclean.go2@gmail.com</a>
        </p>
        <p style="margin: 5px 0; color: #999; font-size: 12px;">Brisbane Bayside & Southeast</p>
        <p style="margin: 15px 0 0 0; color: #999; font-size: 11px;">ABN: 57 805 931 28</p>
    </div>
</div>
            `
        };
        
        await sgMail.send(confirmationEmail);
        
        res.json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send email. Please try again or contact us directly.',
            error: error.message 
        });
    }
});

// Application form endpoint
app.post('/api/apply', validateApplicationForm, async (req, res) => {
    try {
        console.log('Received job application:', req.body);
        
        const emailData = formatApplicationEmail(req.body);
        
        // Send email to business owner
        await sgMail.send(emailData);
        
        // Send confirmation email to applicant
        const confirmationEmail = {
            to: req.body.email,
            from: {
                email: process.env.FROM_EMAIL || 'amie@deepclean.au',
                name: process.env.FROM_NAME || 'Amie - DEEP CLEAN'
            },
            subject: 'Application Received - DEEP CLEAN',
            text: `
Dear ${req.body.firstName},

Thank you for applying to join the DEEP CLEAN team! We've received your application and will review it carefully.

We'll be in touch within the next few days to discuss the next steps.

Best regards,
The DEEP CLEAN Team
            `,
            html: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0;">
    <!-- Header with Logo -->
    <div style="background: white; padding: 20px; text-align: center; border-bottom: 3px solid #1e7ca8;">
        <img src="https://deepclean.au/assets/DEEP CLEAN Logo.png" alt="DEEP CLEAN" style="max-width: 120px; height: auto;">
    </div>
    
    <!-- Content -->
    <div style="padding: 30px; background: white;">
        <h2 style="color: #1e7ca8; margin-top: 0;">Thank You for Your Application!</h2>
        
        <p style="color: #333; line-height: 1.6;">Dear ${req.body.firstName},</p>
        
        <p style="color: #333; line-height: 1.6;">Thank you for your interest in joining the DEEP CLEAN team! We've received your application and are excited to learn more about you.</p>
        
        <p style="color: #333; line-height: 1.6;">We'll carefully review your application and will be in touch within the next few days to discuss potential next steps.</p>
        
        <p style="color: #333; line-height: 1.6;">If you have any questions in the meantime, feel free to call us at <strong style="color: #1e7ca8;">0433 147 018</strong>.</p>
        
        <p style="color: #333; line-height: 1.6; margin-top: 25px;">Warm regards,<br>
        <strong>Amie</strong><br>
        DEEP CLEAN</p>
    </div>
    
    <!-- Professional Footer -->
    <div style="background: #f8f9fa; padding: 25px; text-align: center; border-top: 1px solid #e0e0e0;">
        <img src="https://deepclean.au/assets/DEEP CLEAN Logo.png" alt="DEEP CLEAN" style="max-width: 80px; height: auto; margin-bottom: 15px;">
        <p style="margin: 5px 0; color: #666; font-size: 14px;"><strong>DEEP CLEAN</strong></p>
        <p style="margin: 5px 0; color: #666; font-size: 13px;">Premium Cleaning Services</p>
        <p style="margin: 10px 0 5px 0; color: #666; font-size: 13px;">
            📞 <a href="tel:0433147018" style="color: #1e7ca8; text-decoration: none;">0433 147 018</a> | 
            ✉️ <a href="mailto:deepclean.go2@gmail.com" style="color: #1e7ca8; text-decoration: none;">deepclean.go2@gmail.com</a>
        </p>
        <p style="margin: 5px 0; color: #999; font-size: 12px;">Brisbane Bayside & Southeast</p>
        <p style="margin: 15px 0 0 0; color: #999; font-size: 11px;">ABN: 57 805 931 28</p>
    </div>
</div>
            `
        };
        
        await sgMail.send(confirmationEmail);
        
        res.json({ success: true, message: 'Application submitted successfully!' });
    } catch (error) {
        console.error('Error sending application email:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to submit application. Please try again or contact us directly.',
            error: error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'DEEP CLEAN Email Server', 
        status: 'Running',
        endpoints: {
            contact: 'POST /api/contact',
            apply: 'POST /api/apply',
            health: 'GET /api/health'
        }
    });
});

// Export for Vercel
module.exports = app;