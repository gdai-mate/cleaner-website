// SendGrid Email Client
// This file handles sending emails via our SendGrid backend

const SENDGRID_CONFIG = {
    // API server hosted on Vercel (while website is on GitHub Pages)
    API_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:3001' 
        : 'https://cleaner-website-1.vercel.app', // Vercel API endpoint
    
    // Endpoints
    CONTACT_ENDPOINT: '/api/contact',
    APPLICATION_ENDPOINT: '/api/apply'
};

// Helper function to send email via SendGrid
async function sendEmail(endpoint, data) {
    try {
        const response = await fetch(`${SENDGRID_CONFIG.API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Failed to send email');
        }
        
        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

// Send contact form email
async function sendContactEmail(formData) {
    return sendEmail(SENDGRID_CONFIG.CONTACT_ENDPOINT, formData);
}

// Send application form email
async function sendApplicationEmail(formData) {
    return sendEmail(SENDGRID_CONFIG.APPLICATION_ENDPOINT, formData);
}

// Export functions for use in other scripts
window.SendGridClient = {
    sendContactEmail,
    sendApplicationEmail
};