# DEEP CLEAN Website Backup & Recovery Guide

## 🚨 IMPORTANT: Current Website Backup Created!

Your current perfect website has been saved to: `backups/website-backup-20250722-092237/`

## 📋 How to Backup Before Making Changes

**ALWAYS run this command before uploading images or making changes:**

```bash
# Create a new timestamped backup
BACKUP_DIR="backups/website-backup-$(date +%Y%m%d-%H%M%S)" && mkdir -p "$BACKUP_DIR" && cp -r *.html *.css *.js assets/ "$BACKUP_DIR/" && echo "Website backed up to: $BACKUP_DIR"
```

## 🔄 How to Restore from Backup

If something goes wrong, restore like this:

```bash
# Replace YYYYMMDD-HHMMSS with your backup timestamp
cp -r backups/website-backup-YYYYMMDD-HHMMSS/* ./
```

## 📸 Safe Image Upload Strategy

### Method 1: Test First (Recommended)
1. **Backup current site** (use command above)
2. **Upload ONE test image** to `assets/images/`
3. **Update config.json** with new image path
4. **Test the site** - if it breaks, restore from backup
5. **If successful**, continue with more images

### Method 2: Staging Approach
1. **Create a copy** of the entire website folder
2. **Work on the copy** until perfect
3. **Replace original** only when satisfied

## 🛡️ Protection Tips

- **Never edit files directly** without backing up first
- **Test image uploads one at a time** initially
- **Keep multiple backups** from different dates
- **Document what changes you make** so you can reverse them

## 📁 Your Backup Contains

✅ All HTML files (index.html, about.html, etc.)  
✅ Complete CSS styling (styles.css)  
✅ JavaScript functionality (script.js)  
✅ Assets folder with config and logo  
✅ Current perfect layout and functionality  

## 🆘 Emergency Recovery

If the website breaks completely:

```bash
# Go to website directory
cd /workspaces/cleaner-website

# Copy backup over current files (replace TIMESTAMP)
cp -r backups/website-backup-TIMESTAMP/* ./

# Verify files are restored
ls -la
```

## 💾 Current Backup Location

Your current perfect website is saved at:
`/workspaces/cleaner-website/backups/website-backup-20250722-092237/`

**This backup contains:**
- Perfect homepage with service cards and testimonials
- Updated About page with Amie & Kath's correct info
- Working quote form with email functionality
- All responsive design and styling
- Complete asset management system

---
**Remember: BACKUP BEFORE EVERY CHANGE!** 🔄