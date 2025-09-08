// Testimonial Carousel Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing testimonial carousels...');
    
    // Homepage testimonial carousel
    const homeCarouselTrack = document.getElementById('homeTestimonialCarousel');
    const homePrevBtn = document.getElementById('homePrevBtn');
    const homeNextBtn = document.getElementById('homeNextBtn');
    
    if (homeCarouselTrack) {
        initializeSmoothCarousel(homeCarouselTrack, homePrevBtn, homeNextBtn, 'home');
    }
    
    // Gallery page testimonial carousel
    const galleryCarouselTrack = document.getElementById('testimonialCarousel');
    const galleryPrevBtn = document.getElementById('prevBtn');
    const galleryNextBtn = document.getElementById('nextBtn');
    
    if (galleryCarouselTrack) {
        initializeSmoothCarousel(galleryCarouselTrack, galleryPrevBtn, galleryNextBtn, 'gallery');
    }
    
    // Old homepage slider (fallback)
    const slides = document.querySelectorAll('.testimonial-slide');
    if (slides.length && !homeCarouselTrack) {
        initializeOldSlider(slides);
    }
});

// Smooth carousel with continuous scrolling
function initializeSmoothCarousel(track, prevBtn, nextBtn, page) {
    // Testimonials data
    const testimonials = page === 'home' ? [
        {
            quote: "I have been using Amie and her team for a couple of years now and can honestly say they are far superior to any other cleaning services I've used in the past.",
            name: "Sarah",
            title: "Homeowner - Birkdale",
            stars: "★★★★★"
        },
        {
            quote: "Very professional and trustworthy. Would recommend her work as very detailed.",
            name: "Karina",
            title: "NIISQ Client - Wellington Point",
            stars: "★★★★★"
        },
        {
            quote: "Deep Clean's service is thorough, thoughtful, and meticulous. Absolutely worth every dollar spent.",
            name: "Julie",
            title: "Homeowner - Birkdale",
            stars: "★★★★★"
        },
        {
            quote: "She is meticulous and her attention to detail is second to none. I would recommend her 1000%.",
            name: "Helen",
            title: "Homeowner",
            stars: "★★★★★"
        },
        {
            quote: "Her dedication and attention to detail goes way above the rest. I just don't know what I'd do without her.",
            name: "Elise",
            title: "Homeowner - Birkdale",
            stars: "★★★★★"
        },
        {
            quote: "Deep Clean is amazing! Having a super clean house is essential & a top priority as I have no immune system. The staff at Deep Cleans achieve this every clean. They are extremely thorough, professional, very reliable & my house is always left spotlessly clean & smelling fresh every clean.",
            name: "Rachael",
            title: "Homeowner",
            stars: "★★★★★"
        },
        {
            quote: "We have worked with Amie from Deep Clean for our construction handover cleans for over two years now. Her end result is the best I've seen and is a huge help for us knowing that we can hand over a spotless job. The team are super friendly and diligent and are a pleasure to work with.",
            name: "Dan",
            title: "In-House Projects",
            stars: "★★★★★"
        }
    ] : [
        {
            quote: "Amie has been cleaning my house for over three years now and I wouldn't have anyone else. She is meticulous and her attention to detail is second to none.",
            name: "Helen",
            title: "Homeowner",
            stars: "★★★★★"
        },
        {
            quote: "Amie from Deep Clean is very professional, pays attention to every detail and doesn't just surface clean. I have received many wonderful compliments!",
            name: "Sarah",
            title: "Homeowner - Birkdale",
            stars: "★★★★★"
        },
        {
            quote: "We have been very happy with the consistent quality of the service. We are able to trust Amie and that gives us peace of mind.",
            name: "Julie",
            title: "Homeowner - Birkdale",
            stars: "★★★★★"
        },
        {
            quote: "She's thorough, reliable and trustworthy. I couldn't recommend her highly enough.",
            name: "Elise",
            title: "Homeowner - Birkdale",
            stars: "★★★★★"
        },
        {
            quote: "She goes above and beyond if you have any other extras that need doing. I would recommend her 1000%.",
            name: "Helen",
            title: "Homeowner",
            stars: "★★★★★"
        },
        {
            quote: "The place smells and looks amazing! So delightful to come home to. Thanks Amie!",
            name: "Client",
            title: "Brisbane",
            stars: "★★★★★"
        },
        {
            quote: "Deep Clean is amazing! Having a super clean house is essential & a top priority as I have no immune system. The staff at Deep Cleans achieve this every clean. They are extremely thorough, professional, very reliable & my house is always left spotlessly clean & smelling fresh every clean.",
            name: "Rachael",
            title: "Homeowner",
            stars: "★★★★★"
        },
        {
            quote: "We have worked with Amie from Deep Clean for our construction handover cleans for over two years now. Her end result is the best I've seen and is a huge help for us knowing that we can hand over a spotless job. The team are super friendly and diligent and are a pleasure to work with.",
            name: "Dan",
            title: "In-House Projects",
            stars: "★★★★★"
        }
    ];
    
    let scrollPosition = 0;
    let isPaused = false;
    let animationId;
    const scrollSpeed = 0.5; // Pixels per frame
    
    // Create testimonial cards twice for infinite scroll
    function createCards() {
        // Clear existing content
        track.innerHTML = '';
        
        // Create two sets of cards for seamless loop
        for (let set = 0; set < 2; set++) {
            testimonials.forEach((testimonial) => {
                const card = document.createElement('div');
                card.className = 'testimonial-card';
                card.innerHTML = `
                    <div class="testimonial-card-inner">
                        <div class="testimonial-quote">${testimonial.quote}</div>
                        <div class="testimonial-author">
                            <div class="testimonial-author-name">${testimonial.name}</div>
                            <div class="testimonial-author-title">${testimonial.title}</div>
                            <div class="testimonial-stars">${testimonial.stars}</div>
                        </div>
                    </div>
                `;
                track.appendChild(card);
            });
        }
    }
    
    // Smooth scroll animation
    function animate() {
        if (!isPaused) {
            scrollPosition += scrollSpeed;
            
            // Get the width of all testimonials (first set)
            const cards = track.querySelectorAll('.testimonial-card');
            if (cards.length > 0) {
                const cardWidth = cards[0].offsetWidth;
                const totalWidth = cardWidth * testimonials.length;
                
                // Reset position when first set is completely scrolled
                if (scrollPosition >= totalWidth) {
                    scrollPosition = 0;
                }
                
                track.style.transform = `translateX(-${scrollPosition}px)`;
            }
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Pause on hover
    track.addEventListener('mouseenter', () => {
        isPaused = true;
    });
    
    track.addEventListener('mouseleave', () => {
        isPaused = false;
    });
    
    // Touch support for mobile - pause on touch
    let touchTimeout;
    track.addEventListener('touchstart', () => {
        isPaused = true;
        clearTimeout(touchTimeout);
    });
    
    track.addEventListener('touchend', () => {
        clearTimeout(touchTimeout);
        touchTimeout = setTimeout(() => {
            isPaused = false;
        }, 3000); // Resume after 3 seconds
    });
    
    // Manual navigation
    function scrollToNext() {
        const cards = track.querySelectorAll('.testimonial-card');
        if (cards.length > 0) {
            const cardWidth = cards[0].offsetWidth;
            scrollPosition += cardWidth;
            const totalWidth = cardWidth * testimonials.length;
            
            if (scrollPosition >= totalWidth) {
                scrollPosition = 0;
            }
            
            track.style.transition = 'transform 0.5s ease';
            track.style.transform = `translateX(-${scrollPosition}px)`;
            
            setTimeout(() => {
                track.style.transition = 'none';
            }, 500);
        }
    }
    
    function scrollToPrev() {
        const cards = track.querySelectorAll('.testimonial-card');
        if (cards.length > 0) {
            const cardWidth = cards[0].offsetWidth;
            scrollPosition -= cardWidth;
            
            if (scrollPosition < 0) {
                scrollPosition = cardWidth * (testimonials.length - 1);
            }
            
            track.style.transition = 'transform 0.5s ease';
            track.style.transform = `translateX(-${scrollPosition}px)`;
            
            setTimeout(() => {
                track.style.transition = 'none';
            }, 500);
        }
    }
    
    // Button controls
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            isPaused = true;
            scrollToPrev();
            setTimeout(() => {
                isPaused = false;
            }, 2000);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            isPaused = true;
            scrollToNext();
            setTimeout(() => {
                isPaused = false;
            }, 2000);
        });
    }
    
    // Initialize
    createCards();
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        createCards();
    });
    
    console.log(`${page} testimonial carousel initialized!`);
}

// Old slider for fallback
function initializeOldSlider(slides) {
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoplayTimer;
    
    const prevBtn = document.querySelector('.nav-prev');
    const nextBtn = document.querySelector('.nav-next');
    const dotsContainer = document.querySelector('.dots');
    
    if (!dotsContainer) return;
    
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
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }
    
    function goToSlide(index) {
        currentSlide = index;
        showSlide(currentSlide);
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }
    
    function startAutoplay() {
        autoplayTimer = setInterval(nextSlide, 10000);
    }
    
    function resetAutoplay() {
        clearInterval(autoplayTimer);
        startAutoplay();
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            prevSlide();
            resetAutoplay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            nextSlide();
            resetAutoplay();
        });
    }
    
    showSlide(0);
    startAutoplay();
}