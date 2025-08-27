# SendGrid Email Setup Guide

This guide will help you set up SendGrid for automated email handling on the DEEP CLEAN website.

## Prerequisites

- Node.js installed (version 14 or higher)
- SendGrid account (free tier works fine)
- Access to deploy the server (Heroku, Vercel, DigitalOcean, etc.)

## Step 1: SendGrid Account Setup

1. **Create a SendGrid account**: 
   - Go to https://sendgrid.com and sign up for a free account
   - Free tier includes 100 emails/day

2. **Get your API key**:
   - In SendGrid dashboard, go to Settings → API Keys
   - Click "Create API Key"
   - Give it a name (e.g., "DEEP CLEAN Website")
   - Choose "Full Access" permissions
   - Copy the API key immediately (you won't see it again!)

3. **Verify sender email**:
   - Go to Settings → Sender Authentication
   - Add and verify `amie@deepclean.au` as the sender
   - Or better: Authenticate the entire `deepclean.au` domain (see Domain Authentication below)
   - Note: All emails will be delivered to `deepclean.go2@gmail.com`

## Step 2: Local Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create .env file**:
   ```bash
   cp .env.example .env
   ```

3. **Configure .env file**:
   ```
   SENDGRID_API_KEY=your_actual_sendgrid_api_key
   TO_EMAIL=deepclean.go2@gmail.com
   FROM_EMAIL=amie@deepclean.au
   FROM_NAME=Amie - DEEP CLEAN
   PORT=3001
   ```

4. **Start the server**:
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Test locally**:
   - Open your website at `http://localhost:5500` (or wherever it's hosted)
   - The forms should now send emails through SendGrid

## Step 3: Production Deployment

### Option A: Deploy to Heroku (Recommended for beginners)

1. **Install Heroku CLI**: https://devcenter.heroku.com/articles/heroku-cli

2. **Create Heroku app**:
   ```bash
   heroku create deepclean-email-server
   ```

3. **Set environment variables**:
   ```bash
   heroku config:set SENDGRID_API_KEY=your_api_key
   heroku config:set TO_EMAIL=deepclean.go2@gmail.com
   heroku config:set FROM_EMAIL=your_verified_email
   ```

4. **Deploy**:
   ```bash
   git add .
   git commit -m "Add SendGrid server"
   git push heroku main
   ```

5. **Update frontend**:
   - Edit `sendgrid-client.js`
   - Change `API_URL` to your Heroku app URL:
   ```javascript
   API_URL: 'https://deepclean-email-server.herokuapp.com'
   ```

### Option B: Deploy to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set environment variables** in Vercel dashboard

### Option C: Deploy to DigitalOcean/VPS

1. **SSH into your server**
2. **Clone the repository**
3. **Install Node.js and npm**
4. **Set up PM2** for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js
   pm2 save
   pm2 startup
   ```

## Step 4: Update Website Configuration

1. **Update sendgrid-client.js**:
   - Change the `API_URL` to your deployed server URL
   
2. **Update CORS settings in server.js**:
   - Add your website domain to the `origin` array

## Testing

### Test Contact Form
1. Go to the Contact page
2. Fill out the form with test data
3. Submit the form
4. Check that you receive:
   - Admin notification email at `deepclean.go2@gmail.com`
   - Customer confirmation email at the provided email address

### Test Job Application Form
1. Go to the Careers page
2. Click "Apply Now"
3. Fill out the application
4. Submit the form
5. Check for both admin and applicant emails

## Troubleshooting

### Emails not sending?
- Check SendGrid API key is correct
- Verify sender email is authenticated in SendGrid
- Check server logs: `heroku logs --tail` (if using Heroku)
- Ensure CORS is configured correctly

### CORS errors?
- Add your domain to the `cors` configuration in `server.js`
- Ensure the API_URL in `sendgrid-client.js` is correct

### Rate limiting issues?
- The server limits to 10 requests per 15 minutes per IP
- Adjust in `server.js` if needed

## Security Notes

1. **Never commit .env file** - It's in .gitignore for a reason
2. **Keep API keys secret** - Don't share them publicly
3. **Use environment variables** in production, not hardcoded values
4. **Enable domain authentication** in SendGrid for better deliverability

## Support

For SendGrid issues:
- SendGrid docs: https://docs.sendgrid.com
- SendGrid support: https://support.sendgrid.com

For website issues:
- Contact the developer
- Check server logs for error messages