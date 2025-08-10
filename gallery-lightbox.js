// Simple, reliable gallery lightbox implementation
console.log('Gallery Lightbox Script Loading...');

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGalleryLightbox);
} else {
    // DOM is already ready
    initGalleryLightbox();
}

function initGalleryLightbox() {
    console.log('Initializing Gallery Lightbox...');
    
    // Get or create modal elements
    let modal = document.getElementById('imageModal');
    let modalImg = document.getElementById('modalImage');
    let modalCaption = document.getElementById('modalCaption');
    let closeBtn = document.querySelector('#imageModal .close');
    let prevBtn = document.getElementById('prevBtn');
    let nextBtn = document.getElementById('nextBtn');
    let currentIndexSpan = document.getElementById('currentIndex');
    let totalImagesSpan = document.getElementById('totalImages');
    
    // Get all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    console.log(`Found ${galleryItems.length} gallery items`);
    
    if (galleryItems.length === 0) {
        console.log('No gallery items found on this page');
        return;
    }
    
    // Store image data
    let images = [];
    let currentIndex = 0;
    
    // Collect all images
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const overlayContent = item.querySelector('.overlay-content');
        
        if (img) {
            images.push({
                src: img.src,
                alt: img.alt,
                title: overlayContent?.querySelector('h3')?.textContent || '',
                description: overlayContent?.querySelector('p')?.textContent || ''
            });
            
            // Make item clickable
            item.style.cursor = 'pointer';
            
            // Add click handler
            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Gallery item ${index} clicked`);
                openModal(index);
            });
        }
    });
    
    // Update total images count
    if (totalImagesSpan) {
        totalImagesSpan.textContent = images.length;
    }
    
    // Function to open modal
    function openModal(index) {
        console.log(`Opening modal for image ${index}`);
        
        if (!modal || !modalImg) {
            console.error('Modal elements not found!');
            return;
        }
        
        currentIndex = index;
        const image = images[index];
        
        // Set image
        modalImg.src = image.src;
        modalImg.alt = image.alt;
        
        // Set caption
        if (modalCaption) {
            modalCaption.innerHTML = `
                <strong>${image.title}</strong>
                ${image.description ? '<br>' + image.description : ''}
            `;
        }
        
        // Update counter
        if (currentIndexSpan) {
            currentIndexSpan.textContent = index + 1;
        }
        
        // Update navigation buttons
        if (prevBtn) {
            prevBtn.style.display = index === 0 ? 'none' : 'block';
        }
        if (nextBtn) {
            nextBtn.style.display = index === images.length - 1 ? 'none' : 'block';
        }
        
        // Show modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Add active class for animation
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
    
    // Function to close modal
    function closeModal() {
        console.log('Closing modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    }
    
    // Function to show previous image
    function showPrevious() {
        if (currentIndex > 0) {
            openModal(currentIndex - 1);
        }
    }
    
    // Function to show next image
    function showNext() {
        if (currentIndex < images.length - 1) {
            openModal(currentIndex + 1);
        }
    }
    
    // Event listeners
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showPrevious();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showNext();
        });
    }
    
    // Close on background click
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal && modal.style.display === 'block') {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                showPrevious();
            } else if (e.key === 'ArrowRight') {
                showNext();
            }
        }
    });
    
    // Touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (modalImg) {
        modalImg.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        modalImg.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchEndX - touchStartX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                showPrevious();
            } else {
                showNext();
            }
        }
    }
    
    console.log('Gallery Lightbox initialized successfully!');
}