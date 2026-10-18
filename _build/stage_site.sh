#!/usr/bin/env bash
# Copy ONLY public site files into _site/ for GitHub Pages.
# Anything not listed here (docs, server code, test pages, notes) never gets published.
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf _site && mkdir -p _site/assets
EXCLUDE_HTML="contact-old.html photo_upload_test.html test_email.html favicon.html"
for f in *.html; do
  case " $EXCLUDE_HTML " in *" $f "*) continue ;; esac
  cp "$f" _site/
done
cp styles.css seo-pages.css testimonial-styles.css _site/
cp script.js testimonial-script.js gallery-lightbox.js image-optimizer.js careers-modal-fix.js service-dropdown-fix.js _site/
cp sitemap.xml robots.txt CNAME _site/
cp -R assets/images _site/assets/images
cp "assets/DEEP CLEAN Logo.png" "assets/White and aqua architectural shapes .jpg" _site/assets/
touch _site/.nojekyll
echo "staged $(find _site -type f | wc -l | tr -d ' ') files, $(du -sh _site | cut -f1)"
