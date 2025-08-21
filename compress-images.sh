#!/bin/bash

# Image compression script for DEEP CLEAN website
# This script requires ImageMagick to be installed
# Install with: brew install imagemagick (on Mac)

echo "Starting image optimization..."

# Create backup directory
mkdir -p assets/images/backup

# Function to compress images
compress_image() {
    local input="$1"
    local output="$2"
    local quality="$3"
    
    # Skip if already optimized (has -optimized in name)
    if [[ "$input" == *"-optimized"* ]]; then
        return
    fi
    
    # Compress and resize if needed
    convert "$input" \
        -quality "$quality" \
        -resize '1920x1920>' \
        -strip \
        -interlace Plane \
        -gaussian-blur 0.05 \
        -colorspace sRGB \
        "$output"
    
    echo "Optimized: $input"
}

# Optimize gallery images (medium quality for faster loading)
echo "Optimizing gallery images..."
find "assets/images/gallery/Website photos" -type f \( -name "*.jpg" -o -name "*.JPG" \) | while read img; do
    # Create backup
    cp "$img" "assets/images/backup/$(basename "$img")"
    
    # Compress in place
    compress_image "$img" "$img" 75
done

# Optimize hero/homepage images (higher quality)
echo "Optimizing hero images..."
find "assets/images/hero" -type f \( -name "*.jpg" -o -name "*.JPG" \) | while read img; do
    # Create backup
    cp "$img" "assets/images/backup/$(basename "$img")"
    
    # Compress in place
    compress_image "$img" "$img" 85
done

echo "Image optimization complete!"
echo "Backups saved in assets/images/backup/"
echo ""
echo "To install ImageMagick (if not installed):"
echo "  Mac: brew install imagemagick"
echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
echo "  Windows: Download from https://imagemagick.org"