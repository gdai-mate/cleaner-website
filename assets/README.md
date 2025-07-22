# DEEP CLEAN Website Assets Management

## Quick Start Guide

### 📁 Folder Structure
```
assets/
├── images/           # Your uploaded images go here
│   ├── gallery/      # Gallery photos (before/after, construction, etc.)
│   └── team-photo.jpg, service-in-action.jpg, etc.
├── config.json      # Image configuration (what you'll mainly edit)
└── DEEP CLEAN Logo.png
```

### 🖼️ How to Change Hero Images

1. **Upload your images** to `/assets/images/` folder
2. **Edit `/assets/config.json`** - update the `heroImages` section:
   ```json
   "image1": {
     "src": "assets/images/your-new-image.jpg",  ← Change this path
     "alt": "Your image description"             ← Update description
   }
   ```
3. Images will automatically appear on the homepage

### 📸 Hero Image Recommendations
- **Image 1 (Main)**: Professional cleaner working, cleaning in action
- **Image 2 (Secondary)**: Before/after transformation, bathroom/kitchen clean
- **Image 3 (Background)**: Final result, sparkling clean home

**Image Specs:**
- Format: JPG or PNG
- Size: 800x600px or larger (will auto-resize)
- Style: Professional, bright, clean aesthetic

### 🎨 Gallery Management

1. **Upload gallery photos** to `/assets/images/gallery/`
2. **Edit config.json** - add to appropriate category:
   - `beforeAfter` - Transformation photos
   - `construction` - Post-construction cleanup
   - `residential` - High-end home cleaning

### 👥 Team Photos

1. Upload team photo as `/assets/images/team-photo.jpg`
2. Upload service photos as needed
3. Update paths in config.json `aboutImages` section

### 🔧 Currently Using Placeholder Images
The website currently uses stock photos from Unsplash. Replace with your real photos by following the steps above.

### ⚠️ Important Notes
- Keep image file names simple (no spaces, use hyphens)
- Always update both the file path AND alt text description
- Images auto-optimize for mobile devices
- Hero images display in overlapping layout for visual impact

### 🎯 Priority Images Needed
1. **Hero Image 1**: Amy or Kath cleaning (action shot)
2. **Hero Image 2**: Before/after bathroom transformation  
3. **Hero Image 3**: Sparkling clean living space
4. **Team Photo**: Professional photo of Amy & Kath
5. **Gallery Photos**: 6-9 best before/after examples

### 💡 Pro Tips
- Use bright, well-lit photos
- Show the transformation (dirty → clean)
- Include your team when possible
- Brisbane locations add local credibility