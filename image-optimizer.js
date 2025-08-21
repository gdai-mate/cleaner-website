// Progressive Image Loading with Blur-up Effect
document.addEventListener('DOMContentLoaded', function() {
    // Add loading placeholders for all images
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
        // Skip if already processed
        if (img.dataset.processed) return;
        
        // Create wrapper if not exists
        if (!img.parentElement.classList.contains('progressive-image')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'progressive-image';
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);
        }
        
        // Add loading class
        img.classList.add('loading');
        
        // Create low-quality placeholder
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        img.parentElement.insertBefore(placeholder, img);
        
        // Use Intersection Observer for lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Load the image
                    const tempImg = new Image();
                    tempImg.onload = function() {
                        img.classList.remove('loading');
                        img.classList.add('loaded');
                        
                        // Remove placeholder after transition
                        setTimeout(() => {
                            const placeholder = img.previousElementSibling;
                            if (placeholder && placeholder.classList.contains('image-placeholder')) {
                                placeholder.remove();
                            }
                        }, 400);
                    };
                    
                    // Set the source to trigger load
                    tempImg.src = img.src;
                    
                    // Stop observing this image
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        imageObserver.observe(img);
        img.dataset.processed = 'true';
    });
    
    // Optimize homepage hero images
    const heroImages = document.querySelectorAll('.hero img, .hero-image img');
    heroImages.forEach(img => {
        // Preload hero images
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = img.src;
        document.head.appendChild(link);
    });
});

// Add responsive image loading based on viewport
function optimizeImageSrc(img, viewport) {
    const src = img.dataset.src || img.src;
    
    // Skip optimization for logos and icons
    if (src.includes('logo') || src.includes('icon') || img.width < 100) {
        return;
    }
    
    // For gallery images, use smaller sizes on mobile
    if (viewport.width < 768 && src.includes('gallery')) {
        // Mobile: request smaller image if available
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
    }
}

// Monitor viewport changes
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        document.querySelectorAll('img').forEach(img => {
            optimizeImageSrc(img, viewport);
        });
    }, 250);
});