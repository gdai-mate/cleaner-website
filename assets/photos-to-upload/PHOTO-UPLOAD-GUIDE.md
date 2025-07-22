# 📸 DEEP CLEAN Photo Upload Guide

## 🚨 IMPORTANT: Always Backup Before Uploading!
Run this command before uploading any photos:
```bash
BACKUP_DIR="backups/website-backup-$(date +%Y%m%d-%H%M%S)" && mkdir -p "$BACKUP_DIR" && cp -r *.html *.css *.js assets/ "$BACKUP_DIR/" && echo "Website backed up to: $BACKUP_DIR"
```

## 📁 Photo Upload Folders

### 🏠 HERO SECTION (Homepage)
**Folder:** `hero-section/cleaning-action-shots/`

**Upload 3 photos showing:**
- Professional cleaning in action
- Team members working
- Clean, sparkling results

**Requirements:**
- **Size:** 400x300px (landscape)
- **Quality:** High resolution
- **Style:** Professional, bright, inviting
- **Shows:** People cleaning, equipment, or results

**Current Usage:** These appear as overlapping images on homepage hero section

---

### 🖼️ GALLERY PAGE
**Folder:** `gallery-page/`

#### Before/After Photos
**Subfolder:** `before-after/`
- Upload matched pairs: one "before" and one "after" of same space
- **Size:** 400x300px each
- **Name files:** `kitchen-before.jpg` & `kitchen-after.jpg`

#### Residential Cleaning
**Subfolder:** `residential/`
- Living rooms, kitchens, bathrooms, bedrooms
- **Size:** 400x300px
- **Style:** Clean, bright spaces showcasing your work

#### Commercial Cleaning  
**Subfolder:** `commercial/`
- Offices, retail spaces, construction cleanup
- **Size:** 400x300px
- **Shows:** Professional commercial cleaning results

#### Deep Cleaning Results
**Subfolder:** `deep-cleaning/`
- Detailed cleaning work (inside ovens, cabinets, etc.)
- **Size:** 400x300px
- **Shows:** Attention to detail, thorough cleaning

---

### 👥 ABOUT PAGE
**Folder:** `about-page/team-photos/`

**Upload photos of:**
- Amie Eckhardt (Founder & Cleaning Supervisor)
- Kath Duell Boardman (Cleaning Specialist)
- Team working together (optional)

**Requirements:**
- **Size:** 500x600px (portrait orientation)
- **Style:** Professional but friendly
- **Background:** Clean, uncluttered
- **Lighting:** Bright, natural lighting preferred

---

### 🌟 TESTIMONIAL PHOTOS (Optional)
**Folder:** `testimonial-photos/client-spaces/`

**Upload photos of:**
- Spaces you've cleaned for satisfied clients
- Can be used alongside testimonials

**Requirements:**
- **Size:** 300x200px
- **Style:** Clean, beautiful results
- **Privacy:** Ensure client consent for usage

---

## 📏 Image Size Guidelines

### Critical Sizes:
- **Hero Section:** 400x300px (landscape)
- **Gallery:** 400x300px (landscape) 
- **About Team:** 500x600px (portrait)
- **Testimonials:** 300x200px (landscape)

### File Formats:
- **Preferred:** JPG (smaller file size)
- **Acceptable:** PNG (larger but higher quality)
- **Avoid:** WEBP, GIF, BMP

### File Naming:
- Use descriptive names: `kitchen-after-cleaning.jpg`
- No spaces: use hyphens `-` instead
- Lowercase letters preferred

---

## 🔄 Upload Process

1. **BACKUP FIRST** (use command above)
2. **Place photos in appropriate folders**
3. **Tell Claude which folder you've uploaded to**
4. **Claude will update the config.json and test**
5. **If something breaks, restore from backup**

---

## 📋 Priority Upload Order

### Phase 1 (Most Important):
1. **Hero Section** - 3 cleaning action shots
2. **About Page** - Photos of Amie and Kath

### Phase 2:
3. **Gallery Before/After** - Your best transformations
4. **Gallery Residential** - Beautiful clean homes

### Phase 3:
5. **Gallery Commercial** - Office/retail work
6. **Gallery Deep Cleaning** - Detail shots

---

## ⚠️ Safety Tips

- **Start with 1-2 photos** to test the process
- **Check website after each upload**
- **Keep original photos as backups**
- **Test on different devices** (phone, tablet, desktop)

---

## 📞 Need Help?

If anything goes wrong:
1. **Don't panic!** 
2. **Restore from backup** using guide in WEBSITE-BACKUP-GUIDE.md
3. **Tell Claude what happened**
4. **Try again with fewer photos**

---

**Remember: Your perfect website is safely backed up! We can always restore it if needed.** ✅