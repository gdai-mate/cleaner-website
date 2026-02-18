# Web3Forms Setup Guide for DEEP CLEAN Website

## Quick Setup (2 minutes)

### Step 1: Get Your Access Key
1. Go to https://web3forms.com
2. Enter the email where you want to receive form submissions: `deepclean.go2@gmail.com`
3. Click "Create Access Key"
4. Check your email and copy the access key (looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### Step 2: Add Your Access Key
Open `script.js` and find this section at the top (lines 3-6):

```javascript
const WEB3FORMS_CONFIG = {
    ACCESS_KEY: 'YOUR_ACCESS_KEY_HERE', // Replace with your Web3Forms access key
    API_URL: 'https://api.web3forms.com/submit',
    TO_EMAIL: 'deepclean.go2@gmail.com'
};
```

Replace `YOUR_ACCESS_KEY_HERE` with your actual access key.

### Step 3: Deploy
Push changes to GitHub - the site will automatically update via GitHub Pages.

---

## Features

- **Free forever**: 250 submissions/month (plenty for a small business)
- **No backend needed**: Works directly from the HTML/JS
- **Auto-reply**: Sends confirmation to the person who submitted
- **File attachments**: Photos upload to ImgBB and URLs are included in the email
- **Spam protection**: Built-in honeypot and reCAPTCHA options

## Forms Configured

1. **Contact Form** (contact.html) - Quote requests
2. **Careers Modal** (careers.html) - Quick enquiries
3. **Full Application** (apply.html) - Detailed job applications

## Troubleshooting

**Forms falling back to mailto?**
- Check that your access key is correctly entered in script.js
- Verify you're not using the placeholder `YOUR_ACCESS_KEY_HERE`

**Not receiving emails?**
- Check spam/junk folder
- Verify the email address used when creating the access key

**Need more than 250 submissions/month?**
- Web3Forms has affordable paid plans, or you can create multiple access keys

## Previous Setup (Deprecated)

The previous SendGrid setup (`sendgrid-client.js`, `api/index.js`) is no longer used.
You can delete these files:
- `sendgrid-client.js`
- `api/index.js`
- `server.js`
- `SENDGRID_SETUP.md`
- `EMAILJS_SETUP.md`
- `EMAILJS_CREDENTIALS.md`
