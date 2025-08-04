# EmailJS Credentials for DEEP CLEAN Website

## What You Need to Collect from EmailJS:

1. **Public Key**: Found in Account → API Keys
   - Example format: `AbCdEfGhIjKlMnOpQrSt`

2. **Service ID**: Found in Email Services (after creating service)
   - Example format: `service_abc123`

3. **Contact Template ID**: Found in Email Templates (after creating Contact Form Template)
   - Example format: `template_xyz789`

4. **Careers Template ID**: Found in Email Templates (after creating Careers Form Template)
   - Example format: `template_uvw456`

## Where to Update These in Your Code:

### 1. In `script.js` (lines 2-6):
```javascript
const EMAILJS_CONFIG = {
    SERVICE_ID: 'YOUR_SERVICE_ID_HERE',
    CONTACT_TEMPLATE_ID: 'YOUR_CONTACT_TEMPLATE_ID_HERE',
    CAREERS_TEMPLATE_ID: 'YOUR_CAREERS_TEMPLATE_ID_HERE',
};
```

### 2. In these HTML files (search for `emailjs.init`):
- `index.html` (line ~354)
- `contact.html` (line ~391)
- `careers.html` (line ~224)

Replace:
```javascript
emailjs.init('YOUR_PUBLIC_KEY');
```

With:
```javascript
emailjs.init('YOUR_ACTUAL_PUBLIC_KEY_HERE');
```

## Testing Your Setup:

1. Open your website in a browser
2. Open the browser's Developer Console (F12)
3. Try submitting a form
4. Check for any errors in the console
5. Check your email for the test submission

## Troubleshooting:

- **"Unauthorized" error**: Check your public key
- **"Service not found"**: Check your service ID
- **"Template not found"**: Check your template IDs
- **No email received**: Check spam folder, verify email service is connected