// All forms send through deepclean-site.js (window.dcSubmitEnquiry), the one Web3Forms path.
// The careers and application code below still calls sendToWeb3Forms, so keep this shim.
const WEB3FORMS_CONFIG = { ACCESS_KEY: (window.DC_CONFIG || {}).WEB3FORMS_KEY || '' };

function sendToWeb3Forms(formData, formType = 'contact') {
    return window.dcSubmitEnquiry(formData, formType, formType + '_form');
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing DEEP CLEAN website functionality...');
    
    // Initialize Testimonial Slider
    setTimeout(() => {
        initTestimonialSlider();
    }, 100);
    
    // Mobile navigation. The hamburger's inline onclick does the toggle (works even before this
    // file loads). Here we only close the menu after a link tap. The old block here cloned the
    // button, tinted it red, popped a debug alert, toggled a second time (so the menu never
    // opened) and then crashed on an out-of-scope navLinks, killing the rest of this file.
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu && hamburger) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // Close mobile menu when clicking outside - with delay to prevent conflicts
    document.addEventListener('click', function(e) {
        if (hamburger && navMenu) {
            // Check if click is on hamburger or its children
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                setTimeout(function() {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }, 10);
            }
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove shadow based on scroll position
        if (scrollTop > 10) {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'none';
        }

        lastScrollTop = scrollTop;
    });

    // Patent Leather Texture Scroll Movement
    let ticking = false;
    
    function updatePatentLeatherPosition() {
        const scrolled = window.pageYOffset;
        
        // Gentle, organic scroll movement with easing curve
        const moveY = Math.sin(scrolled * 0.001) * 8 + scrolled * 0.018; // More organic with sine wave + linear
        const rotation = scrolled * 0.0003; // Even more subtle rotation
        const scale = 1 + Math.sin(scrolled * 0.0005) * 0.002; // Tiny breathing effect
        
        // Apply to main hero
        const mainHero = document.querySelector('.hero');
        if (mainHero) {
            const heroStyle = `translateY(${moveY}px) rotate(${rotation}deg) scale(${scale})`;
            mainHero.style.setProperty('--hero-transform', heroStyle);
        }
        
        // Apply to page heroes with slight variation
        const pageHeroes = document.querySelectorAll('.page-hero');
        pageHeroes.forEach(hero => {
            const heroStyle = `translateY(${moveY * 0.75}px) rotate(${rotation * 0.7}deg) scale(${scale})`;
            hero.style.setProperty('--page-hero-transform', heroStyle);
        });
        
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updatePatentLeatherPosition);
            ticking = true;
        }
    }

    // Smooth scroll-based movement
    window.addEventListener('scroll', requestTick);

    // Form handling for quote requests - Using event delegation for better handling
    document.addEventListener('click', function(e) {
        // Skip if clicking on hamburger menu
        if (e.target.closest('.hamburger')) return;
        
        // Check if clicked element is a quote button
        const button = e.target.closest('.btn-primary, .cta-button, .package-btn, .service-cta .btn, .quote-trigger');
        
        if (!button) return;
        
        // Skip buttons that should navigate normally or have special purposes
        if (button.classList.contains('services-link') || 
            button.classList.contains('careers-enquiry-btn') ||
            button.closest('form') || // Skip buttons inside forms
            button.hasAttribute('type') && button.getAttribute('type') === 'submit' || // Skip submit buttons
            button.closest('.careers-modal') || // Skip buttons in careers modal
            button.closest('.quote-modal')) { // Skip buttons in quote modal
            return;
        }
        
        // Check if it's a quote-related button
        const buttonText = button.textContent.toLowerCase();
        const hasQuoteText = buttonText.includes('quote') || buttonText.includes('pricing');
        const hasServiceAttr = button.hasAttribute('data-service');
        const isQuoteTrigger = button.classList.contains('quote-trigger');
        
        if (hasQuoteText || hasServiceAttr || isQuoteTrigger) {
            e.preventDefault();
            e.stopPropagation();
            const selectedService = button.getAttribute('data-service') || 'general';
            const inline = document.querySelector('#quote form[data-dc-quote]');
            if (inline) {
                document.getElementById('quote').scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(function() { const n = inline.querySelector('input[name="name"]'); if (n) n.focus({ preventScroll: true }); }, 450);
                return;
            }
            try {
                showQuoteModal(selectedService);
            } catch (error) {
                console.error('Error showing quote modal:', error);
                // Fallback to contact page
                window.location.href = 'contact.html';
            }
        }
    });

    // Enhanced quote modal with frequency selection and better layout
    function showQuoteModal(selectedService = 'general') {
        const modal = document.createElement('div');
        modal.className = 'quote-modal';
        
        const serviceOptions = {
            'deep-clean': 'One-off Deep Clean',
            'recurring-basic': 'Recurring Domestic Clean - Basic',
            'recurring-premium': 'Recurring Domestic Clean - Premium',
            'post-construction': 'Post Construction Clean',
            'ndis-funded': 'NIISQ NDIS & Externally Funded Services Externally Funded Services',
            'deep': 'One-off Deep Clean', // legacy support
            'recurring': 'Recurring Domestic Clean', // legacy support
            'construction': 'Post Construction Clean', // legacy support
            'funded': 'NIISQ NDIS & Externally Funded Services Externally Funded Services', // legacy support
            'general': 'General Enquiry'
        };
        
        const selectedServiceName = serviceOptions[selectedService] || 'General Enquiry';
        
        const pick = {
            'deep-clean': 'One-off Deep Clean', 'deep': 'One-off Deep Clean',
            'recurring-basic': 'Recurring Domestic Clean', 'recurring-premium': 'Recurring Domestic Clean', 'recurring': 'Recurring Domestic Clean',
            'post-construction': 'Post Construction Clean', 'construction': 'Post Construction Clean',
            'ndis-funded': 'NIISQ & Funded Cleaning', 'funded': 'NIISQ & Funded Cleaning'
        }[selectedService] || '';
        const opts = ['One-off Deep Clean', 'Recurring Domestic Clean', 'Post Construction Clean', 'NIISQ & Funded Cleaning', 'Something else']
            .map(o => `<option${o === pick ? ' selected' : ''}>${o.replace('&', '&amp;')}</option>`).join('');

        modal.innerHTML = `
            <div class="quote-modal-content">
                <div class="quote-modal-header">
                    <div class="modal-header-content">
                        <img src="assets/DEEP CLEAN Logo.png" alt="Deep Clean logo" class="modal-logo">
                        <h3>Get a free quote</h3>
                    </div>
                    <button class="close-modal" aria-label="Close">&times;</button>
                </div>
                <div class="quote-modal-info">
                    <p>Five quick details and Amie will get back to you within 24 hours. Rather talk? Call <a href="tel:0433147018">0433 147 018</a>.</p>
                </div>
                <form class="quote-form dc-quote-form" id="modalQuoteForm" data-dc-quote novalidate>
                    <div class="dc-field"><label for="mq-name">Name</label><input id="mq-name" name="name" autocomplete="name" required></div>
                    <div class="dc-field"><label for="mq-phone">Phone</label><input id="mq-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required></div>
                    <div class="dc-field"><label for="mq-suburb">Suburb</label><input id="mq-suburb" name="suburb" autocomplete="address-level2" required></div>
                    <div class="dc-field"><label for="mq-service">Service</label><select id="mq-service" name="service"><option value="">Not sure yet</option>${opts}</select></div>
                    <div class="dc-field dc-wide"><label for="mq-message">Anything we should know? <span>(optional)</span></label><textarea id="mq-message" name="message" rows="3" placeholder="Size of the home, how often, any problem areas"></textarea></div>
                    <input type="checkbox" name="botcheck" class="dc-hp" tabindex="-1" autocomplete="off" aria-hidden="true">
                    <button type="submit" class="btn btn-primary dc-wide">Send my quote request</button>
                    <p class="dc-form-status dc-wide" aria-live="polite"></p>
                </form>
            </div>
        `;

        // Add modal styles
        const modalStyles = `
            <style>
                .quote-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 2000;
                    animation: fadeIn 0.3s ease;
                }
                
                .quote-modal-content {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    width: 95%;
                    max-width: 650px;
                    max-height: 90vh;
                    overflow-y: auto;
                    animation: slideUp 0.3s ease;
                }
                
                .form-row-modal {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }
                
                @media (max-width: 768px) {
                    .form-row-modal {
                        grid-template-columns: 1fr;
                        gap: 0.8rem;
                    }
                    .quote-modal-content {
                        width: 95%;
                        max-width: 420px;
                        padding: 1.5rem;
                        margin: 10px;
                        max-height: 85vh;
                    }
                    
                    .quote-modal-header h3 {
                        font-size: 1.3rem;
                        line-height: 1.3;
                    }
                    
                    .quote-modal-info {
                        padding: 0.8rem;
                        margin-bottom: 1rem;
                    }
                    
                    .quote-modal-info p {
                        font-size: 0.85rem;
                        line-height: 1.4;
                    }
                    
                    .form-group label {
                        font-size: 0.9rem;
                        margin-bottom: 0.4rem;
                    }
                    
                    .form-group input,
                    .form-group select,
                    .form-group textarea {
                        padding: 14px;
                        font-size: 16px; /* Prevents zoom on iOS */
                        border-radius: 8px;
                    }
                    
                    .form-group textarea {
                        rows: "2";
                        min-height: 80px;
                    }
                    
                    .modal-header-content {
                        gap: 0.5rem;
                    }
                    
                    .modal-logo {
                        height: 32px;
                    }
                }
                
                .quote-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid #eee;
                }
                
                .modal-header-content {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                .modal-logo {
                    height: 40px;
                    width: auto;
                }
                
                .quote-modal-header h3 {
                    margin: 0;
                    color: var(--dark-blue);
                }
                
                .quote-modal-info {
                    background: #f8f9fa;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                }
                
                .quote-modal-info p {
                    margin: 0;
                    color: var(--dark-blue);
                    font-size: 0.9rem;
                    line-height: 1.5;
                }
                
                .close-modal {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #999;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .close-modal:hover {
                    color: #333;
                }
                
                .form-group {
                    margin-bottom: 1rem;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                    color: var(--dark-blue);
                }
                
                .form-group input,
                .form-group select,
                .form-group textarea {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-family: inherit;
                    font-size: 1rem;
                }
                
                .form-group input:focus,
                .form-group select:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: var(--dark-blue);
                    box-shadow: 0 0 0 3px rgba(30, 90, 122, 0.2);
                }
                
                .photo-upload {
                    border: 2px dashed #ddd;
                    border-radius: 8px;
                    padding: 20px;
                    text-align: center;
                    cursor: pointer;
                    transition: border-color 0.3s ease;
                }
                
                .photo-upload:hover {
                    border-color: var(--primary-blue);
                }
                
                .photo-upload-info {
                    margin-top: 0.5rem;
                    color: #666;
                }
                
                .photo-previews {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                    gap: 10px;
                    margin-top: 15px;
                }
                
                .photo-preview {
                    position: relative;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 2px solid #eee;
                }
                
                .photo-preview img {
                    width: 100%;
                    height: 120px;
                    object-fit: cover;
                }
                
                .photo-preview .remove-photo {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    background: rgba(255, 0, 0, 0.8);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    cursor: pointer;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .upload-progress {
                    margin-top: 10px;
                }
                
                .upload-item {
                    display: flex;
                    align-items: center;
                    padding: 8px;
                    margin: 5px 0;
                    background: #f8f9fa;
                    border-radius: 4px;
                    font-size: 0.9rem;
                }
                
                .upload-item.success {
                    background: #d4edda;
                    color: #155724;
                }
                
                .upload-item.error {
                    background: #f8d7da;
                    color: #721c24;
                }
                
                .upload-item .status {
                    margin-left: auto;
                    font-weight: bold;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', modalStyles);
        document.body.appendChild(modal);

        window.dcWireQuoteForm(modal.querySelector('form[data-dc-quote]'));
        setTimeout(() => { const n = modal.querySelector('input[name="name"]'); if (n) n.focus(); }, 50);

        // Close modal functionality
        const closeModal = modal.querySelector('.close-modal');
        closeModal.addEventListener('click', function() {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

    }

    // Enhanced scroll animations for elements coming into view
    // More responsive settings for mobile
    const isMobile = window.innerWidth <= 768;
    const observerOptions = {
        threshold: isMobile ? 0.05 : 0.1,
        rootMargin: isMobile ? '0px 0px 20px 0px' : '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.feature-card, .service-card, .testimonial-card, .services-cta-content, .team-intro-content, .about-content, .values-grid .value-card, .package-card');
    animatedElements.forEach((el, index) => {
        // Add different animation classes based on element type and position
        if (el.classList.contains('feature-card') || el.classList.contains('value-card')) {
            el.classList.add('fade-in-on-scroll');
        } else if (index % 2 === 0) {
            el.classList.add('slide-in-left');
        } else {
            el.classList.add('slide-in-right');
        }
        
        // Reduce delay for team-intro-content on mobile for faster response
        let delay = index * 0.1;
        if (isMobile && el.classList.contains('team-intro-content')) {
            delay = 0.05; // Much faster on mobile
        }
        
        el.style.transitionDelay = `${delay}s`;
        observer.observe(el);
    });

    // Add animation classes to sections
    const sections = document.querySelectorAll('.services-cta, .team-intro, .about-story, .values-section');
    sections.forEach((section, index) => {
        const content = section.querySelector('.services-cta-content, .team-intro-content, .about-content, .values-grid');
        if (content) {
            content.classList.add('fade-in-on-scroll');
            observer.observe(content);
        }
    });

    // Add loading state to buttons
    function addLoadingState(button) {
        const originalText = button.textContent;
        button.textContent = 'Loading...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 2000);
    }

    // Contact form validation
    const contactForms = document.querySelectorAll('form');
    contactForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                addLoadingState(submitButton);
            }
        });
    });
});

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization - lazy load images when they're added
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Contact page quote form. Sends through the shared Web3Forms path (deepclean-site.js).
// Photo upload used to be faked (placeholder links), so customers now text photos instead.
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(contactForm));
            if (data.botcheck) return;

            const labels = {
                'one-off-deep-clean': 'One-off Deep Clean',
                'recurring-domestic-clean': 'Recurring Domestic Clean',
                'post-construction-clean': 'Post Construction Clean',
                'post-renovation-clean': 'Post Renovation Clean',
                'niisq-ndis-funded': 'NIISQ or other externally funded Clean',
                'other-service': 'Other Service'
            };
            const selectedServices = Array.from(contactForm.querySelectorAll('input[name="serviceType"]:checked'))
                .map(cb => labels[cb.value] || cb.value);
            const status = contactForm.querySelector('.dc-form-status');
            const say = (msg) => { if (status) { status.className = 'dc-form-status dc-error'; status.innerHTML = msg; } else { alert(msg.replace(/<[^>]+>/g, '')); } };

            if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.address) {
                say('Please fill in all the fields marked *.');
                return;
            }
            if (selectedServices.length === 0) {
                say('Please tick at least one service.');
                return;
            }

            const fields = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                address: data.address,
                propertyType: data.propertyType || 'Not specified',
                propertySize: data.propertySize || 'Not specified',
                serviceType: selectedServices.join(', '),
                urgency: data.urgency || 'flexible',
                hearAbout: data.hearAbout || '',
                message: data.message || ''
            };

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            if (status) { status.className = 'dc-form-status'; status.textContent = ''; }

            window.dcSubmitEnquiry(fields, 'contact', 'contact_form')
                .then(function() {
                    contactForm.innerHTML = '<div class="dc-form-done" role="status"><h3>Thanks ' +
                        String(data.firstName).replace(/[&<>"']/g, '') + ', your quote request is with Amie.</h3>' +
                        '<p>We\'ll get back to you within 24 hours. Got photos of the areas to clean? Text them to ' +
                        '<a href="tel:0433147018">0433 147 018</a> and we can quote more accurately.</p></div>';
                })
                .catch(function() {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    say('Sorry, that didn\'t send. Please call or text <a href="tel:0433147018">0433 147 018</a>, or email <a href="mailto:deepclean.go2@gmail.com">deepclean.go2@gmail.com</a>.');
                });
        });
    }

    // Expandable Service Cards Functionality
    const serviceCards = document.querySelectorAll('.service-card');
    
    function lockToService(targetCard) {
        // Get the current position of the target card
        const cardRect = targetCard.getBoundingClientRect();
        const cardTop = cardRect.top + window.pageYOffset;
        const headerHeight = 80;
        const targetScrollTop = cardTop - headerHeight;
        
        // Smoothly scroll to keep the clicked service in view
        window.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
        });
    }
    
    serviceCards.forEach(card => {
        const header = card.querySelector('.service-header');
        const details = card.querySelector('.service-details');
        const closeBtn = card.querySelector('.service-close-btn');
        
        // Initialize details as collapsed
        if (details) {
            details.style.maxHeight = '0';
            details.style.transition = 'max-height 0.4s ease';
        }
        
        // Expand on header click
        if (header && details) {
            header.addEventListener('click', function() {
                const isExpanded = card.classList.contains('expanded');
                
                // Close all other cards first
                serviceCards.forEach(otherCard => {
                    if (otherCard !== card && otherCard.classList.contains('expanded')) {
                        const otherDetails = otherCard.querySelector('.service-details');
                        otherCard.classList.remove('expanded');
                        if (otherDetails) {
                            otherDetails.style.maxHeight = '0';
                        }
                    }
                });
                
                // Toggle current card
                if (isExpanded) {
                    // Collapse
                    card.classList.remove('expanded');
                    details.style.maxHeight = '0';
                } else {
                    // Expand
                    card.classList.add('expanded');
                    const scrollHeight = details.scrollHeight;
                    details.style.maxHeight = scrollHeight + 'px';
                    
                    // After expansion starts, lock to this service
                    setTimeout(() => {
                        lockToService(card);
                    }, 100);
                }
            });
        }
        
        // Close on close button click
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent header click from triggering
                
                // Store position before closing
                const currentScrollY = window.pageYOffset;
                const cardRect = card.getBoundingClientRect();
                const cardTopBeforeCollapse = cardRect.top + currentScrollY;
                
                // Collapse the card
                card.classList.remove('expanded');
                details.style.maxHeight = '0';
                
                // After collapse animation, ensure we stay focused on this card
                setTimeout(() => {
                    lockToService(card);
                }, 200);
            });
        }
    });

    // Handle window resize for service cards
    let resizeTimeout;
    window.addEventListener('resize', function() {
        // Debounce resize events to prevent excessive calculations
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            serviceCards.forEach(card => {
                if (card.classList.contains('expanded')) {
                    const details = card.querySelector('.service-details');
                    // Temporarily disable transition during resize
                    details.style.transition = 'none';
                    details.style.maxHeight = 'auto';
                    const scrollHeight = details.scrollHeight;
                    details.style.maxHeight = scrollHeight + 'px';
                    // Re-enable transition
                    setTimeout(() => {
                        details.style.transition = 'max-height 0.4s ease';
                    }, 50);
                }
            });
        }, 150);
    });

    // Enhanced Gallery Modal Functionality with Navigation
    // Simplified and robust implementation
    console.log('Initializing gallery functionality...');
    
    let galleryImages = [];
    let currentImageIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    
    // Check if we're on the gallery page
    const galleryItems = document.querySelectorAll('.gallery-item');
    console.log('Gallery items found:', galleryItems.length);
    
    // Only initialize if we have gallery items
    if (galleryItems.length > 0) {
        console.log('Gallery page detected, setting up lightbox...');
        
        // First, check if modal exists, if not create it
        let modal = document.getElementById('imageModal');
        if (!modal) {
            console.log('Creating gallery modal...');
            const modalHTML = `
                <div id="imageModal" class="modal">
                    <div class="modal-content">
                        <span class="close">&times;</span>
                        <button class="modal-nav prev" id="prevBtn">&#10094;</button>
                        <button class="modal-nav next" id="nextBtn">&#10095;</button>
                        <img id="modalImage" src="" alt="">
                        <div id="modalCaption"></div>
                        <div class="modal-counter">
                            <span id="currentIndex">1</span> / <span id="totalImages">1</span>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            modal = document.getElementById('imageModal');
        }
        
        // Get all modal elements
        const modalImg = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');
        const close = modal.querySelector('.close');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const currentIndexSpan = document.getElementById('currentIndex');
        const totalImagesSpan = document.getElementById('totalImages');
        
        console.log('Modal elements:', { modal, modalImg, modalCaption, close });
        // Collect all gallery images
        function initializeGallery() {
            galleryImages = [];
            document.querySelectorAll('.gallery-item').forEach((item, index) => {
                const img = item.querySelector('.gallery-image img');
                const overlay = item.querySelector('.overlay-content');
                
                if (img && overlay) {
                    const title = overlay.querySelector('h3')?.textContent || '';
                    const description = overlay.querySelector('p')?.textContent || '';
                    
                    galleryImages.push({
                        src: img.src,
                        alt: img.alt,
                        title: title,
                        description: description,
                        element: item
                    });
                }
            });
            
            if (totalImagesSpan) {
                totalImagesSpan.textContent = galleryImages.length;
            }
        }
        
        // Show image at specific index
        function showImage(index) {
            if (index < 0 || index >= galleryImages.length) return;
            
            const imageData = galleryImages[index];
            currentImageIndex = index;
            
            modalImg.src = imageData.src;
            modalImg.alt = imageData.alt;
            modalCaption.innerHTML = `<strong>${imageData.title}</strong><br>${imageData.description}`;
            
            if (currentIndexSpan) {
                currentIndexSpan.textContent = index + 1;
            }
            
            // Update navigation button visibility
            if (prevBtn) prevBtn.style.display = index === 0 ? 'none' : 'flex';
            if (nextBtn) nextBtn.style.display = index === galleryImages.length - 1 ? 'none' : 'flex';
        }
        
        // Navigate to previous image
        function showPrevImage() {
            if (currentImageIndex > 0) {
                showImage(currentImageIndex - 1);
            }
        }
        
        // Navigate to next image
        function showNextImage() {
            if (currentImageIndex < galleryImages.length - 1) {
                showImage(currentImageIndex + 1);
            }
        }
        
        // Initialize gallery
        initializeGallery();
        
        // Add click event to all gallery items - simplified approach
        galleryItems.forEach((item, index) => {
            console.log(`Setting up gallery item ${index}`);
            item.style.cursor = 'pointer';
            
            // Use a simple onclick handler for maximum compatibility
            item.onclick = function(e) {
                console.log(`Gallery item ${index} clicked!`);
                e.preventDefault();
                e.stopPropagation();
                
                // Show the modal
                modal.style.display = 'block';
                modal.style.zIndex = '9999';
                document.body.style.overflow = 'hidden';
                
                // Show the clicked image
                showImage(index);
                
                return false;
            };
        });
        
        // Navigation button events
        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                showPrevImage();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                showNextImage();
            });
        }
        
        // Close modal when clicking X
        if (close) {
            close.addEventListener('click', function() {
                modal.style.display = 'none';
                document.body.style.overflow = ''; // Restore scrolling
            });
        }
        
        // Close modal when clicking outside the content
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = ''; // Restore scrolling
                }
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (modal.style.display === 'block') {
                switch(e.key) {
                    case 'Escape':
                        modal.style.display = 'none';
                        document.body.style.overflow = ''; // Restore scrolling
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        showPrevImage();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        showNextImage();
                        break;
                }
            }
        });
        
        // Touch/swipe support for mobile
        if (modalImg) {
            modalImg.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
                touchStartY = e.changedTouches[0].screenY;
            }, { passive: true });
            
            modalImg.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                touchEndY = e.changedTouches[0].screenY;
                handleSwipe();
            }, { passive: true });
        }
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const swipeDistanceX = touchEndX - touchStartX;
            const swipeDistanceY = touchEndY - touchStartY;
            
            // Check if it's primarily a vertical or horizontal swipe
            if (Math.abs(swipeDistanceY) > Math.abs(swipeDistanceX)) {
                // Vertical swipe - close modal if swipe distance is sufficient
                if (Math.abs(swipeDistanceY) > swipeThreshold) {
                    modal.style.display = 'none';
                    document.body.style.overflow = ''; // Restore scrolling
                }
            } else {
                // Horizontal swipe - navigate images
                if (Math.abs(swipeDistanceX) > swipeThreshold) {
                    if (swipeDistanceX > 0) {
                        // Swipe right - show previous
                        showPrevImage();
                    } else {
                        // Swipe left - show next
                        showNextImage();
                    }
                }
            }
        }
        
        // Reinitialize gallery when images are dynamically added/removed
        window.reinitializeGallery = function() {
            initializeGallery();
        };
        
        console.log('Gallery initialization complete!');
    } // End of gallery initialization
    
    // Careers Enquiry Modal
    function showCareersModal() {
        const modal = document.createElement('div');
        modal.className = 'careers-modal';
        
        modal.innerHTML = `
            <div class="careers-modal-content">
                <div class="careers-modal-header">
                    <h3>Let's Start a Conversation</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="careers-modal-intro">
                    <p>Tell us a bit about yourself and we'll get back to you within 48 hours.</p>
                </div>
                <form class="careers-enquiry-form" id="careersEnquiryForm" novalidate>
                    <!-- Contact Details -->
                    <div class="form-section">
                        <h4>Contact Details</h4>
                        <div class="form-group">
                            <label for="fullName">Full Name *</label>
                            <input type="text" id="fullName" name="fullName" required>
                        </div>
                        <div class="form-group">
                            <label for="address">Address *</label>
                            <input type="text" id="address" name="address" placeholder="Street address, suburb, postcode" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email Address *</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="phone">Phone Number *</label>
                            <input type="tel" id="phone" name="phone" required>
                        </div>
                    </div>
                    
                    <!-- Work History -->
                    <div class="form-section">
                        <h4>Previous Work History</h4>
                        <p class="section-note">Please list your last 3 jobs (if any)</p>
                        
                        <div class="job-entry">
                            <div class="form-group">
                                <label for="job1">Job 1 - Most Recent</label>
                                <input type="text" id="job1" name="job1" placeholder="Company, position, and dates">
                            </div>
                        </div>
                        <div class="job-entry">
                            <div class="form-group">
                                <label for="job2">Job 2</label>
                                <input type="text" id="job2" name="job2" placeholder="Company, position, and dates">
                            </div>
                        </div>
                        <div class="job-entry">
                            <div class="form-group">
                                <label for="job3">Job 3</label>
                                <input type="text" id="job3" name="job3" placeholder="Company, position, and dates">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Availability -->
                    <div class="form-section">
                        <h4>Availability</h4>
                        <div class="form-group">
                            <label for="availability">When are you available to work? *</label>
                            <textarea id="availability" name="availability" rows="3" required placeholder="Please let us know your available days and hours"></textarea>
                        </div>
                    </div>
                    
                    <!-- Personal Information -->
                    <div class="form-section">
                        <h4>About You</h4>
                        <div class="form-group">
                            <label for="interests">Interests & Hobbies</label>
                            <textarea id="interests" name="interests" rows="3" placeholder="Tell us about your interests and hobbies"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="goals">What do you hope to achieve working with us? *</label>
                            <textarea id="goals" name="goals" rows="3" required placeholder="Share your goals and aspirations"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="helpingOthers">Do you enjoy helping others? *</label>
                            <textarea id="helpingOthers" name="helpingOthers" rows="3" required placeholder="Tell us about your experience helping others"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="howHeard">How did you hear about us? *</label>
                            <select id="howHeard" name="howHeard" required>
                                <option value="">Please select</option>
                                <option value="Indeed">Indeed</option>
                                <option value="Seek">Seek</option>
                                <option value="Website">Website</option>
                                <option value="Social Media">Social Media</option>
                                <option value="Word of Mouth">Word of Mouth</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Submit Application</button>
                    </div>
                </form>
            </div>
        `;
        
        // Add modal styles
        const modalStyles = `
            <style>
                .careers-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    animation: fadeIn 0.3s ease;
                }
                
                .careers-modal-content {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 600px;
                    max-height: 90vh;
                    overflow-y: auto;
                    animation: slideUp 0.3s ease;
                    position: relative;
                    margin: 20px auto;
                }
                
                .careers-enquiry-form {
                    display: block;
                }
                
                .careers-modal-content::-webkit-scrollbar {
                    width: 8px;
                }
                
                .careers-modal-content::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 4px;
                }
                
                .careers-modal-content::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 4px;
                }
                
                .careers-modal-content::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
                
                .careers-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid #e5e7eb;
                    flex-shrink: 0;
                }
                
                .careers-modal-header h3 {
                    margin: 0;
                    color: var(--dark-blue);
                }
                
                .careers-modal-intro {
                    margin-bottom: 1rem;
                    flex-shrink: 0;
                }
                
                .careers-modal-intro p {
                    color: var(--gray);
                    margin: 0;
                    font-size: 0.95rem;
                }
                
                .careers-enquiry-form .form-group {
                    margin-bottom: 1rem;
                }
                
                .careers-enquiry-form label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: var(--dark-blue);
                    font-weight: var(--font-weight-medium);
                }
                
                .careers-enquiry-form input,
                .careers-enquiry-form select,
                .careers-enquiry-form textarea {
                    width: 100%;
                    padding: 0.75rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: border-color 0.3s ease;
                }
                
                .careers-enquiry-form input:focus,
                .careers-enquiry-form select:focus,
                .careers-enquiry-form textarea:focus {
                    outline: none;
                    border-color: var(--primary-turquoise);
                }
                
                .careers-enquiry-form .form-section {
                    margin-bottom: 2rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid #e5e7eb;
                    display: block !important;
                }
                
                .careers-enquiry-form .form-section:last-of-type {
                    border-bottom: none;
                    margin-bottom: 1rem;
                }
                
                .form-section h4 {
                    color: var(--dark-blue);
                    font-weight: var(--font-weight-semibold);
                    margin-bottom: 1rem;
                    font-size: 1.2rem;
                }
                
                .section-note {
                    color: var(--gray);
                    font-size: 0.9rem;
                    margin-bottom: 1rem;
                }
                
                .job-entry {
                    margin-bottom: 0.5rem;
                }
                
                .close-modal {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    transition: background-color 0.2s;
                }
                
                .close-modal:hover {
                    background-color: #f0f0f0;
                }
                
                .form-actions {
                    margin-top: 2rem;
                    padding-top: 1rem;
                    border-top: 1px solid #e5e7eb;
                }
                
                @media (max-width: 768px) {
                    .careers-modal-content {
                        width: 95%;
                        padding: 1.5rem;
                        max-height: 90vh;
                        margin: 10px auto;
                    }
                    
                    .form-section h4 {
                        font-size: 1.1rem;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', modalStyles);
        document.body.appendChild(modal);
        
        // Force a reflow to ensure the modal is rendered
        modal.offsetHeight;
        
        // Close modal functionality
        const closeModal = modal.querySelector('.close-modal');
        closeModal.addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // Form submission
        const form = modal.querySelector('#careersEnquiryForm');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Manual validation for required fields
            const requiredFields = ['fullName', 'address', 'email', 'phone', 'availability', 'goals', 'helpingOthers', 'howHeard'];
            let isValid = true;
            
            for (const fieldName of requiredFields) {
                const field = form[fieldName];
                if (!field.value.trim()) {
                    field.style.borderColor = '#ef4444';
                    isValid = false;
                } else {
                    field.style.borderColor = '#e5e7eb';
                }
            }
            
            if (!isValid) {
                alert('Please fill in all required fields.');
                return;
            }
            
            const formData = {
                fullName: form.fullName.value,
                address: form.address.value,
                email: form.email.value,
                phone: form.phone.value,
                job1: form.job1.value,
                job2: form.job2.value,
                job3: form.job3.value,
                availability: form.availability.value,
                interests: form.interests.value,
                goals: form.goals.value,
                helpingOthers: form.helpingOthers.value,
                howHeard: form.howHeard.value
            };
            
            // Create email body
            let emailBody = `CAREERS ENQUIRY FROM DEEP CLEAN WEBSITE\n`;
            emailBody += `=====================================\n\n`;
            
            emailBody += `CONTACT DETAILS\n`;
            emailBody += `---------------\n`;
            emailBody += `Name: ${formData.fullName}\n`;
            emailBody += `Address: ${formData.address}\n`;
            emailBody += `Email: ${formData.email}\n`;
            emailBody += `Phone: ${formData.phone}\n\n`;
            
            emailBody += `PREVIOUS WORK HISTORY\n`;
            emailBody += `--------------------\n`;
            emailBody += `Job 1 (Most Recent): ${formData.job1 || 'Not provided'}\n`;
            emailBody += `Job 2: ${formData.job2 || 'Not provided'}\n`;
            emailBody += `Job 3: ${formData.job3 || 'Not provided'}\n\n`;
            
            emailBody += `AVAILABILITY\n`;
            emailBody += `------------\n`;
            emailBody += `${formData.availability}\n\n`;
            
            emailBody += `ABOUT THE APPLICANT\n`;
            emailBody += `------------------\n`;
            emailBody += `Interests & Hobbies:\n${formData.interests || 'Not provided'}\n\n`;
            emailBody += `What they hope to achieve:\n${formData.goals}\n\n`;
            emailBody += `Experience helping others:\n${formData.helpingOthers}\n\n`;
            emailBody += `How they heard about us: ${formData.howHeard}\n\n`;
            
            emailBody += `Submitted: ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Brisbane' })}`;
            
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Prepare data for Web3Forms (split fullName for compatibility)
            const nameParts = formData.fullName.split(' ');
            const web3Data = {
                firstName: nameParts[0] || formData.fullName,
                lastName: nameParts.slice(1).join(' ') || '',
                email: formData.email,
                phone: formData.phone,
                message: emailBody,
                formType: 'careers'
            };

            // Check if Web3Forms is configured
            if (WEB3FORMS_CONFIG.ACCESS_KEY !== 'YOUR_ACCESS_KEY_HERE') {
                // Send via Web3Forms
                sendToWeb3Forms(web3Data, 'application')
                    .then(function(response) {
                        console.log('Careers enquiry sent successfully!', response);
                        showCareersSuccess();
                        submitButton.textContent = originalText;
                        submitButton.disabled = false;
                    })
                    .catch(function(error) {
                        console.error('Failed to send careers enquiry:', error);
                        submitButton.textContent = originalText;
                        submitButton.disabled = false;
                        // Fallback to mailto
                        fallbackToMailto();
                    });
            } else {
                // Fallback to mailto if Web3Forms not configured
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                fallbackToMailto();
            }

            function fallbackToMailto() {
                const subject = encodeURIComponent('Careers Enquiry - ' + formData.fullName);
                const body = encodeURIComponent(emailBody);
                const mailtoLink = `mailto:deepclean.go2@gmail.com?subject=${subject}&body=${body}`;
                window.location.href = mailtoLink;
                showCareersSuccess();
            }
            
            function showCareersSuccess() {
                // Update modal content to show success
            modal.querySelector('.careers-modal-content').innerHTML = `
                <div class="success-content" style="text-align: center; padding: 2rem;">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--primary-turquoise)" stroke-width="2" style="margin-bottom: 1rem;">
                        <path d="M9 12l2 2 4-4"/>
                        <circle cx="12" cy="12" r="9"/>
                    </svg>
                    <h3 style="color: var(--dark-blue); margin-bottom: 1rem;">Enquiry Sent!</h3>
                    <p style="color: var(--gray); margin-bottom: 1rem;">Thank you for your interest in joining our team!</p>
                    <p style="color: var(--gray); font-size: 0.9rem; margin-bottom: 2rem;">We'll review your enquiry and get back to you soon.</p>
                    <button type="button" class="btn btn-primary" onclick="this.closest('.careers-modal').remove()">Close</button>
                </div>
            `;
            }
        });
    }
    
    // Attach careers modal to buttons
    function attachCareersButtons() {
        document.querySelectorAll('.careers-enquiry-btn').forEach(btn => {
            // Remove any existing listeners to avoid duplicates
            btn.removeEventListener('click', showCareersModal);
            btn.addEventListener('click', showCareersModal);
        });
    }
    
    // Initial attachment
    attachCareersButtons();
    
    // Also attach using event delegation for reliability
    document.body.addEventListener('click', function(e) {
        const careersBtn = e.target.closest('.careers-enquiry-btn');
        if (careersBtn) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Careers button clicked');
            showCareersModal();
        }
    });
    
    // Initialize service dropdowns after DOM is ready
    if (document.querySelector('.expandable-services')) {
        initializeServiceDropdowns();
    }
    
    // Also add direct handlers for any quote buttons
    setTimeout(() => {
        const allQuoteButtons = document.querySelectorAll('button');
        allQuoteButtons.forEach(btn => {
            if (btn.textContent.toLowerCase().includes('quote') && 
                !btn.closest('form') && 
                !btn.closest('.quote-modal')) {
                btn.style.cursor = 'pointer';
                if (!btn.hasAttribute('data-service')) {
                    btn.setAttribute('data-service', 'general');
                }
            }
        });
    }, 200);
});

// Service dropdowns functionality - Simplified implementation
function initializeServiceDropdowns() {
    console.log('Initializing service dropdowns...');
    
    // Use event delegation for better reliability
    document.addEventListener('click', function(e) {
        // Check if clicked element is part of a service header
        const header = e.target.closest('.expandable-services .service-header');
        if (!header) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const card = header.closest('.service-card');
        const details = card.querySelector('.service-details');
        
        if (!details) {
            console.error('No service details found for card');
            return;
        }
        
        const isExpanded = card.classList.contains('expanded');
        const allCards = document.querySelectorAll('.expandable-services .service-card');
        
        // Close all cards
        allCards.forEach(c => {
            c.classList.remove('expanded');
            const d = c.querySelector('.service-details');
            if (d) d.style.maxHeight = '0';
        });
        
        // If this card wasn't expanded, expand it
        if (!isExpanded) {
            card.classList.add('expanded');
            // Calculate height
            details.style.maxHeight = 'auto';
            const height = details.scrollHeight;
            details.style.maxHeight = '0';
            // Force reflow
            details.offsetHeight;
            // Animate to calculated height
            details.style.maxHeight = height + 'px';
            
            // Scroll into view after animation
            setTimeout(() => {
                header.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        }
    });
    
    // Handle close buttons
    document.addEventListener('click', function(e) {
        const closeBtn = e.target.closest('.service-close-btn');
        if (!closeBtn) return;
        
        e.stopPropagation();
        const card = closeBtn.closest('.service-card');
        if (card) {
            card.classList.remove('expanded');
            const details = card.querySelector('.service-details');
            if (details) details.style.maxHeight = '0';
        }
    });
    
    // Initialize all service details to be collapsed
    const allDetails = document.querySelectorAll('.expandable-services .service-details');
    allDetails.forEach(details => {
        details.style.maxHeight = '0';
        details.style.overflow = 'hidden';
        details.style.transition = 'max-height 0.4s ease';
    });
    
    console.log('Service dropdowns initialized');
}

// Additional initialization for any dynamic content
document.addEventListener('DOMContentLoaded', function() {
    
    // Animation Intersection Observer
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Also trigger child animations
                const fadeUps = entry.target.querySelectorAll('.fade-up');
                const slideInLefts = entry.target.querySelectorAll('.slide-in-left');
                const slideInRights = entry.target.querySelectorAll('.slide-in-right');
                const scaleIns = entry.target.querySelectorAll('.scale-in');
                const supportCards = entry.target.querySelectorAll('.support-card');
                const benefitItems = entry.target.querySelectorAll('.benefit-item');
                
                fadeUps.forEach(el => el.classList.add('visible'));
                slideInLefts.forEach(el => el.classList.add('visible'));
                slideInRights.forEach(el => el.classList.add('visible'));
                scaleIns.forEach(el => el.classList.add('visible'));
                supportCards.forEach(el => el.classList.add('visible'));
                benefitItems.forEach(el => el.classList.add('visible'));
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all animated sections
    document.querySelectorAll('.animated-section').forEach(section => {
        animationObserver.observe(section);
    });
    
    // Multi-step Application Form
    const applicationForm = document.getElementById('fullApplicationForm');
    if (applicationForm) {
        const formSections = applicationForm.querySelectorAll('.form-section');
        const progressFill = document.getElementById('progressFill');
        const currentSectionSpan = document.getElementById('currentSection');
        let currentSection = 1;
        const totalSections = formSections.length;
        
        // Update progress bar
        function updateProgress() {
            const progress = (currentSection / totalSections) * 100;
            progressFill.style.width = progress + '%';
            currentSectionSpan.textContent = currentSection;
        }
        
        // Show specific section
        function showSection(sectionNumber) {
            formSections.forEach(section => {
                section.classList.remove('active');
                if (parseInt(section.dataset.section) === sectionNumber) {
                    section.classList.add('active');
                }
            });
            currentSection = sectionNumber;
            updateProgress();
            
            // Scroll to top of form
            applicationForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Validate current section
        function validateSection(sectionElement) {
            const requiredFields = sectionElement.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (field.type === 'radio') {
                    const radioGroup = sectionElement.querySelectorAll(`input[name="${field.name}"]`);
                    const isChecked = Array.from(radioGroup).some(radio => radio.checked);
                    if (!isChecked) {
                        isValid = false;
                        field.closest('.radio-group').style.border = '2px solid #ef4444';
                        setTimeout(() => {
                            field.closest('.radio-group').style.border = '';
                        }, 3000);
                    }
                } else if (field.type === 'checkbox' && field.hasAttribute('required')) {
                    if (!field.checked) {
                        isValid = false;
                        field.style.outline = '2px solid #ef4444';
                        setTimeout(() => {
                            field.style.outline = '';
                        }, 3000);
                    }
                } else if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ef4444';
                    setTimeout(() => {
                        field.style.borderColor = '';
                    }, 3000);
                }
            });
            
            return isValid;
        }
        
        // Next button handlers
        applicationForm.querySelectorAll('.next-section').forEach(btn => {
            btn.addEventListener('click', function() {
                const currentSectionElement = formSections[currentSection - 1];
                if (validateSection(currentSectionElement)) {
                    if (currentSection < totalSections) {
                        showSection(currentSection + 1);
                    }
                }
            });
        });
        
        // Previous button handlers
        applicationForm.querySelectorAll('.prev-section').forEach(btn => {
            btn.addEventListener('click', function() {
                if (currentSection > 1) {
                    showSection(currentSection - 1);
                }
            });
        });
        
        // Form submission
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(applicationForm);
            let emailBody = `JOB APPLICATION FROM DEEP CLEAN WEBSITE\n`;
            emailBody += `=====================================\n\n`;
            
            // Personal Information
            emailBody += `PERSONAL INFORMATION\n`;
            emailBody += `-------------------\n`;
            emailBody += `Name: ${formData.get('firstName')} ${formData.get('lastName')}\n`;
            emailBody += `Email: ${formData.get('email')}\n`;
            emailBody += `Phone: ${formData.get('phone')}\n`;
            emailBody += `Location: ${formData.get('location') || 'Not specified'}\n\n`;
            
            // Availability
            emailBody += `AVAILABILITY & PREFERENCES\n`;
            emailBody += `-------------------------\n`;
            emailBody += `Work Type: ${formData.get('workType')}\n`;
            
            const availableDays = formData.getAll('availability');
            emailBody += `Available Days: ${availableDays.length ? availableDays.join(', ') : 'Not specified'}\n`;
            emailBody += `Start Date: ${formData.get('startDate') || 'Not specified'}\n\n`;
            
            // About
            emailBody += `ABOUT THE APPLICANT\n`;
            emailBody += `------------------\n`;
            emailBody += `Why Join: ${formData.get('whyJoin')}\n\n`;
            emailBody += `Strengths: ${formData.get('strengths') || 'Not specified'}\n\n`;
            emailBody += `Experience: ${formData.get('experience') || 'No experience specified'}\n\n`;
            
            // References
            emailBody += `REFERENCES\n`;
            emailBody += `----------\n`;
            emailBody += `Reference 1:\n`;
            emailBody += `  Name: ${formData.get('ref1Name')}\n`;
            emailBody += `  Relationship: ${formData.get('ref1Relationship')}\n`;
            emailBody += `  Phone: ${formData.get('ref1Phone')}\n`;
            emailBody += `  Email: ${formData.get('ref1Email') || 'Not provided'}\n\n`;
            
            emailBody += `Reference 2:\n`;
            emailBody += `  Name: ${formData.get('ref2Name')}\n`;
            emailBody += `  Relationship: ${formData.get('ref2Relationship')}\n`;
            emailBody += `  Phone: ${formData.get('ref2Phone')}\n`;
            emailBody += `  Email: ${formData.get('ref2Email') || 'Not provided'}\n\n`;
            
            // Additional Info
            emailBody += `ADDITIONAL INFORMATION\n`;
            emailBody += `---------------------\n`;
            emailBody += `Transportation: ${formData.get('transport') || 'Not specified'}\n`;
            emailBody += `Additional Notes: ${formData.get('additionalInfo') || 'None'}\n\n`;
            
            emailBody += `Submitted: ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Brisbane' })}`;
            
            // Prepare data for SendGrid
            const applicationData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                dob: formData.get('dob'),
                address: formData.get('address'),
                residency: formData.get('residency'),
                driversLicense: formData.get('driversLicense'),
                availability: formData.getAll('availability').join(', '),
                hasExperience: formData.get('hasExperience'),
                experienceDetails: formData.get('experienceDetails'),
                job1Company: formData.get('job1Company'),
                job1Position: formData.get('job1Position'),
                job1Duration: formData.get('job1Duration'),
                job2Company: formData.get('job2Company'),
                job2Position: formData.get('job2Position'),
                job2Duration: formData.get('job2Duration'),
                job3Company: formData.get('job3Company'),
                job3Position: formData.get('job3Position'),
                job3Duration: formData.get('job3Duration'),
                whyJoin: formData.get('whyJoin'),
                strengths: formData.get('strengths'),
                ref1Name: formData.get('ref1Name'),
                ref1Relationship: formData.get('ref1Relationship'),
                ref1Phone: formData.get('ref1Phone'),
                ref1Email: formData.get('ref1Email'),
                ref2Name: formData.get('ref2Name'),
                ref2Relationship: formData.get('ref2Relationship'),
                ref2Phone: formData.get('ref2Phone'),
                ref2Email: formData.get('ref2Email'),
                hasTransport: formData.get('hasTransport'),
                startDate: formData.get('startDate'),
                additionalComments: formData.get('additionalComments')
            };

            // Show loading state
            const submitButton = e.target.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Check if Web3Forms is configured
            if (WEB3FORMS_CONFIG.ACCESS_KEY !== 'YOUR_ACCESS_KEY_HERE') {
                // Send via Web3Forms
                sendToWeb3Forms(applicationData, 'application')
                    .then(function(response) {
                        console.log('Application sent successfully!', response);
                        showApplicationSuccess();
                    })
                    .catch(function(error) {
                        console.error('Failed to send application:', error);
                        submitButton.textContent = originalText;
                        submitButton.disabled = false;
                        // Fallback to mailto
                        fallbackToMailto();
                    });
            } else {
                // Fallback to mailto if Web3Forms not configured
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                fallbackToMailto();
            }

            function fallbackToMailto() {
                const subject = encodeURIComponent(`Job Application - ${formData.get('firstName')} ${formData.get('lastName')}`);
                const body = encodeURIComponent(emailBody);
                const mailtoLink = `mailto:deepclean.go2@gmail.com?subject=${subject}&body=${body}`;
                window.location.href = mailtoLink;
                showApplicationSuccess();
            }

            function showApplicationSuccess() {
                applicationForm.innerHTML = `
                <div class="success-content" style="text-align: center; padding: 3rem;">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--primary-turquoise)" stroke-width="2" style="margin-bottom: 2rem;">
                        <path d="M9 12l2 2 4-4"/>
                        <circle cx="12" cy="12" r="9"/>
                    </svg>
                    <h2 style="color: var(--dark-blue); margin-bottom: 1rem;">Application Submitted!</h2>
                    <p style="color: var(--gray); margin-bottom: 1rem; font-size: 1.1rem;">Thank you for applying to join the DEEP CLEAN team!</p>
                    <p style="color: var(--gray); margin-bottom: 2rem;">We've received your application and will review it carefully.</p>
                    <p style="color: var(--primary-turquoise); font-weight: var(--font-weight-medium); margin-bottom: 2rem;">We're excited to hear from you and will be in touch soon!</p>
                    <a href="careers.html" class="btn btn-primary">Back to Careers</a>
                </div>
            `;

                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
});

// Testimonial Slider Function
let sliderInitialized = false;
function initTestimonialSlider() {
    if (sliderInitialized) {
        console.log('Slider already initialized');
        return;
    }
    
    console.log('Initializing testimonial slider...');
    const slider = document.querySelector('.testimonial-slider');
    if (!slider) {
        console.log('No slider found');
        return;
    }
    
    const slides = document.querySelector('.testimonial-slides');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevArea = document.querySelector('.testimonial-click-prev');
    const nextArea = document.querySelector('.testimonial-click-next');
    const dotsContainer = document.querySelector('.testimonial-dots');
    
    console.log('Found elements:', {
        slides: !!slides,
        cards: cards.length,
        prevArea: !!prevArea,
        nextArea: !!nextArea,
        dotsContainer: !!dotsContainer
    });
    
    if (!slides || cards.length === 0) {
        console.log('Missing slides or cards');
        return;
    }
    
    // Prevent re-initialization
    if (dotsContainer.children.length > 0) {
        console.log('Dots already created, skipping initialization');
        return;
    }
    
    let currentSlide = 0;
    const totalSlides = cards.length;
    let autoplayInterval;
    
    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.classList.add('testimonial-dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
        dot.addEventListener('click', () => {
            goToSlide(i);
            resetAutoplay();
        });
        dotsContainer.appendChild(dot);
    }
    
    const dots = document.querySelectorAll('.testimonial-dot');
    
    function updateSlider() {
        // Move slides
        slides.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateSlider();
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    }
    
    // Click areas for navigation
    if (prevArea) {
        prevArea.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            prevSlide();
            resetAutoplay();
            console.log('Previous clicked');
        });
    }
    
    if (nextArea) {
        nextArea.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            nextSlide();
            resetAutoplay();
            console.log('Next clicked');
        });
    }
    
    // Auto-play every 10 seconds
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 10000); // Change slide every 10 seconds
    }
    
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            nextSlide(); // Swipe left
            resetAutoplay();
        }
        if (touchEndX > touchStartX + 50) {
            prevSlide(); // Swipe right
            resetAutoplay();
        }
    }
    
    // Initialize
    updateSlider();
    startAutoplay();
    
    sliderInitialized = true;
    console.log('Testimonial slider initialized successfully');
}

// Also try to initialize on window load as fallback
window.addEventListener('load', function() {
    if (!sliderInitialized) {
        console.log('Initializing slider on window load...');
        initTestimonialSlider();
    }
});