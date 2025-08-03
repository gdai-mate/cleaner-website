# EmailJS Setup Guide for DEEP CLEAN Website

## Overview
The website is now configured to use EmailJS for automatic email delivery. This replaces the `mailto:` links with actual email sending functionality.

## Setup Steps

### 1. Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (200 emails/month free)

### 2. Add Email Service
1. In EmailJS dashboard, click "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the authentication steps
5. Note down your **Service ID**

### 3. Create Email Templates

#### Contact Form Template
1. Click "Email Templates" → "Create New Template"
2. Name it "Contact Form Template"
3. Set up the template:

**Subject:** {{subject}}

**Content:**
```
New Contact Form Submission from DEEP CLEAN Website

FROM: {{from_name}}
EMAIL: {{from_email}}
PHONE: {{phone}}

PROPERTY DETAILS:
Address: {{address}}
Property Type: {{property_type}}
Property Size: {{property_size}}

SERVICES REQUESTED:
{{services}}

URGENCY: {{urgency}}

ADDITIONAL DETAILS:
{{additional_details}}

PHOTOS:
{{photos}}

---
Full Message:
{{message}}
```

4. Note down your **Template ID**

#### Careers Form Template
1. Create another template named "Careers Form Template"
2. Set up the template:

**Subject:** {{subject}}

**Content:**
```
New Careers Enquiry from DEEP CLEAN Website

APPLICANT: {{from_name}}
EMAIL: {{from_email}}
PHONE: {{phone}}
ADDRESS: {{address}}

PREVIOUS WORK HISTORY:
Job 1: {{job1}}
Job 2: {{job2}}
Job 3: {{job3}}

AVAILABILITY:
{{availability}}

INTERESTS & HOBBIES:
{{interests}}

GOALS:
{{goals}}

EXPERIENCE HELPING OTHERS:
{{helping_others}}

HOW THEY HEARD ABOUT US: {{how_heard}}

---
Full Application:
{{full_message}}
```

3. Note down your **Template ID**

### 4. Get Your Public Key
1. Go to "Account" → "API Keys"
2. Copy your **Public Key**

### 5. Update the Website

1. Open each HTML file (index.html, contact.html, careers.html) and replace:
   ```javascript
   emailjs.init('YOUR_PUBLIC_KEY');
   ```
   with your actual public key:
   ```javascript
   emailjs.init('your_actual_public_key_here');
   ```

2. Open script.js and update the configuration at the top:
   ```javascript
   const EMAILJS_CONFIG = {
       SERVICE_ID: 'your_service_id_here',
       CONTACT_TEMPLATE_ID: 'your_contact_template_id_here',
       CAREERS_TEMPLATE_ID: 'your_careers_template_id_here',
   };
   ```

### 6. Test
1. Test the contact form on the Contact page
2. Test the careers enquiry form on the Careers page
3. Check your EmailJS dashboard for sent emails

## Features
- Automatic email delivery without opening email client
- Fallback to mailto: if EmailJS fails
- All form data properly formatted
- Photo URLs included in contact form emails
- Success/error handling

## Troubleshooting
- If emails aren't sending, check the browser console for errors
- Verify all IDs are correct
- Check your EmailJS dashboard for quota limits
- Ensure the receiving email (deepclean.go2@gmail.com) is not blocking emails

## Free Tier Limits
- 200 emails per month
- 2 email templates
- 1 email service

For more emails, upgrade to a paid plan on EmailJS.