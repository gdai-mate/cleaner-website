// Simple Testimonial Slider
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing clean testimonial slider...');
    
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.nav-prev');
    const nextBtn = document.querySelector('.nav-next');
    const dotsContainer = document.querySelector('.dots');
    
    if (!slides.length) {
        console.log('No testimonial slides found');
        return;
    }
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoplayTimer;
    
    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
        dot.addEventListener('click', () => {
            goToSlide(i);
            resetAutoplay();
        });
        dotsContainer.appendChild(dot);
    }
    
    const dots = document.querySelectorAll('.dot');
    
    // Show a specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Update dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentSlide = index;
        showSlide(currentSlide);
    }
    
    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }
    
    // Previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }
    
    // Autoplay
    function startAutoplay() {
        autoplayTimer = setInterval(nextSlide, 10000); // Change every 10 seconds
    }
    
    function resetAutoplay() {
        clearInterval(autoplayTimer);
        startAutoplay();
    }
    
    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            prevSlide();
            resetAutoplay();
            console.log('Previous clicked');
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            nextSlide();
            resetAutoplay();
            console.log('Next clicked');
        });
    }
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    const wrapper = document.querySelector('.testimonial-wrapper');
    if (wrapper) {
        wrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        wrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            nextSlide();
            resetAutoplay();
        }
        if (touchEndX > touchStartX + 50) {
            prevSlide();
            resetAutoplay();
        }
    }
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoplay();
        }
    });
    
    // Initialize
    showSlide(0);
    startAutoplay();
    
    console.log('Testimonial slider initialized successfully!');
});