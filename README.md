# DEEP CLEAN Website

A professional, minimalist website for DEEP CLEAN - Brisbane's boutique cleaning service owned by Amy Eckhardt and Kath Duell Boardman.

## 🌟 Website Overview

**Business:** DEEP CLEAN - Premium cleaning services  
**Owners:** Amy Eckhardt & Kath Duell Boardman  
**Tagline:** "The difference is in the detail"  
**Location:** Brisbane Bayside, Queensland  
**Specialties:** High-end residential & post-construction cleaning  

## 📁 Project Structure

```
cleaner-website/
├── index.html          # Homepage with hero section
├── services.html       # Detailed service offerings  
├── about.html          # Amy & Kath's story
├── gallery.html        # Before/after photos
├── contact.html        # Quote request form
├── styles.css          # All styling (1600+ lines)
├── script.js           # Interactive functionality
└── assets/
    ├── DEEP CLEAN Logo.png    # Business logo
    ├── config.json            # Image management config
    ├── README.md              # Asset management guide
    └── images/                # Upload your photos here
```

## 🎨 Design Features

**Style:** Clean, minimalist, professional  
**Colors:** Logo-inspired blues, teals, with white/light grays  
**Typography:** Inter font family for modern, professional look  
**Layout:** Fully responsive (mobile-first design)  
**Images:** Currently using Unsplash placeholders (easy to replace)  

## 📱 Pages Overview

### Homepage (`index.html`)
- **Hero section** with large overlapping images and compelling text
- **Services preview** with business-specific content
- **Customer testimonials** 
- **Call-to-action** sections

### Services (`services.html`)
- **Detailed service packages** with pricing
- **High-end residential** cleaning options
- **Post-construction** cleanup services
- **Add-on services** and satisfaction guarantee

### About (`about.html`)
- **Amy & Kath's story** using real business context
- **Team profiles** and experience
- **Why choose DEEP CLEAN** value propositions
- **Service areas** across Brisbane Bayside

### Gallery (`gallery.html`)  
- **Before/after** photo showcases
- **Filterable portfolio** by service type
- **Client testimonials** with photos
- **Call-to-action** with statistics

### Contact (`contact.html`)
- **Comprehensive quote form** with all necessary fields
- **Contact information** with real phone/email
- **Service area** details
- **Why choose us** reasons

## 🖼️ Image Management

**Current Status:** Using high-quality Unsplash placeholder images  

**To Add Your Real Photos:**
1. Upload images to `/assets/images/` folder
2. Edit `/assets/config.json` to update image paths
3. Follow the guide in `/assets/README.md`

**Priority Images Needed:**
- Hero section: 3 overlapping cleaning photos
- Gallery: Before/after transformations
- About: Team photo of Amy & Kath
- Service examples throughout

## 🚀 Key Features

- **Mobile responsive** - Works perfectly on phones, tablets, desktops
- **Interactive forms** - Quote requests with validation
- **Professional animations** - Subtle hover effects and transitions
- **SEO optimized** - Meta tags, structured content
- **Fast loading** - Optimized images and efficient code
- **Accessible** - Screen reader friendly, keyboard navigation

## 📞 Contact Information (Live Data)

- **Phone:** 0433 147 018
- **Email:** deepclean.go2@gmail.com  
- **ABN:** 57 805 931 28
- **Service Area:** Brisbane Bayside, Redland Bay, Southeast Brisbane

## 🛠️ Technical Details

**Frontend:** Vanilla HTML5, CSS3, JavaScript (no frameworks)  
**Fonts:** Google Fonts (Inter)  
**Images:** Responsive with lazy loading  
**Forms:** Client-side validation, ready for backend integration  
**Browser Support:** All modern browsers (Chrome, Firefox, Safari, Edge)  

## 📋 Next Steps

1. **Replace placeholder images** with real photos
2. **Test contact forms** and add backend processing
3. **Domain setup** and hosting
4. **Google Analytics** integration
5. **Local SEO** optimization

## 💡 Customization Tips

**Colors:** Edit CSS variables in `:root` for easy theme changes  
**Content:** All text can be easily updated in HTML files  
**Images:** Use the config.json system for organized image management  
**Forms:** Contact form ready for integration with email services  

## 🎯 Business Positioning

The website perfectly reflects DEEP CLEAN's positioning as:
- **Boutique service** (not corporate chain)
- **High-end specialist** (premium residential + construction)  
- **Local experts** (Brisbane Bayside focus)
- **Experienced professionals** (30+ years combined)
- **Detail-oriented** ("The difference is in the detail")

## 📧 Email Integration (SendGrid)

**Status:** ✅ Fully configured with SendGrid for automated emails

### Quick Setup:
1. **Install dependencies:** `npm install`
2. **Get SendGrid API key:** Sign up at sendgrid.com (free)
3. **Add key to .env:** `SENDGRID_API_KEY=your_key_here`
4. **Start server:** `npm start`
5. **Deploy server:** Use Render.com, Heroku, or any Node.js host

### Email Features:
- **Contact form** sends quotes to Amie's inbox
- **Job applications** automatically forwarded
- **Professional HTML emails** with DEEP CLEAN branding
- **Auto-confirmations** sent to customers
- **Fallback to mailto** if server is down

### Email Configuration:
- **Receives at:** deepclean.go2@gmail.com (Amie's Gmail)
- **Sends from:** amie@deepclean.au (professional domain)
- **Reply-to:** Customer's email address

## 🔧 Deployment Ready

The website is complete with email automation and ready for deployment. 

### To Deploy:
1. **Website:** Upload to any web host (GitHub Pages, Netlify, etc.)
2. **Email Server:** Deploy to Render.com (free) or Heroku
3. **Domain:** Point deepclean.au to your hosting
4. **SendGrid:** Verify domain for better deliverability

---

**Built for:** DEEP CLEAN Brisbane  
**Owner:** Amie - 0433 147 018  
**Website:** deepclean.au  
**Status:** ✅ Complete with Email Automation