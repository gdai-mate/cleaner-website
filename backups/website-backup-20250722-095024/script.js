// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
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

    // Form handling for quote requests
    const quoteButtons = document.querySelectorAll('.btn-primary, .cta-button, .package-btn');
    
    quoteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const selectedService = this.getAttribute('data-service') || 'general';
            showQuoteModal(selectedService);
        });
    });

    // Enhanced quote modal with frequency selection and better layout
    function showQuoteModal(selectedService = 'general') {
        const modal = document.createElement('div');
        modal.className = 'quote-modal';
        
        const serviceOptions = {
            'regular': 'Regular Cleaning',
            'deep': 'Deep Cleaning',
            'move': 'Move In/Out Cleaning',
            'construction': 'Post-Construction Cleanup',
            'general': 'General Enquiry'
        };
        
        const selectedServiceName = serviceOptions[selectedService] || 'General Enquiry';
        
        modal.innerHTML = `
            <div class="quote-modal-content">
                <div class="quote-modal-header">
                    <h3>Get Your Free Quote - ${selectedServiceName}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <form class="quote-form" id="quoteForm">
                    <div class="form-row-modal">
                        <div class="form-group">
                            <label for="name">Full Name *</label>
                            <input type="text" id="name" name="name" required>
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
                    <div class="form-row-modal">
                        <div class="form-group">
                            <label for="service">Service Type *</label>
                            <select id="service" name="service" required>
                                <option value="">Select a service</option>
                                <option value="regular" ${selectedService === 'regular' ? 'selected' : ''}>Regular Cleaning</option>
                                <option value="deep" ${selectedService === 'deep' ? 'selected' : ''}>Deep Cleaning</option>
                                <option value="move" ${selectedService === 'move' ? 'selected' : ''}>Move In/Out Cleaning</option>
                                <option value="construction">Post-Construction Cleanup</option>
                                <option value="commercial">Commercial Cleaning</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="frequency">Frequency</label>
                            <select id="frequency" name="frequency">
                                <option value="">Select frequency</option>
                                <option value="weekly">Weekly</option>
                                <option value="fortnightly">Fortnightly</option>
                                <option value="monthly">Monthly</option>
                                <option value="one-off">One-off service</option>
                                <option value="as-needed">As needed</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="property-size">Property Size</label>
                            <select id="property-size" name="property-size">
                                <option value="">Select size</option>
                                <option value="1-2bed">1-2 Bedrooms</option>
                                <option value="3-4bed">3-4 Bedrooms</option>
                                <option value="5+bed">5+ Bedrooms</option>
                                <option value="small-office">Small Office</option>
                                <option value="large-commercial">Large Commercial</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="address">Property Address (Suburb, Postcode)</label>
                        <input type="text" id="address" name="address" placeholder="e.g. Victoria Point, QLD 4165">
                    </div>
                    <div class="form-group">
                        <label for="message">Additional Details</label>
                        <textarea id="message" name="message" rows="3" placeholder="Tell us about your specific cleaning needs, special requirements, or any areas that need extra attention..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Get My Free Quote</button>
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
                        gap: 0.5rem;
                    }
                    .quote-modal-content {
                        width: 95%;
                        max-width: 400px;
                        padding: 1.5rem;
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
                
                .quote-modal-header h3 {
                    margin: 0;
                    color: var(--primary-blue);
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
                    color: var(--dark-gray);
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
                    border-color: var(--primary-blue);
                    box-shadow: 0 0 0 3px rgba(30, 124, 168, 0.1);
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
        const form = modal.querySelector('#quoteForm');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!data.name || !data.email || !data.phone) {
                alert('Please fill in all required fields (Name, Email, Phone).');
                return;
            }
            
            // Create email content
            const serviceTypes = {
                'regular': 'Regular Cleaning Service Request',
                'deep': 'Deep Cleaning Service Request',
                'move': 'Move In/Out Cleaning Request',
                'construction': 'Post-Construction Cleanup Request',
                'commercial': 'Commercial Cleaning Request',
                'general': 'General Cleaning Inquiry'
            };
            
            const subject = serviceTypes[data.service] || 'Cleaning Service Inquiry';
            
            // Build email body
            let emailBody = `Hello DEEP CLEAN,\n\n`;
            emailBody += `I would like to request a quote for ${serviceTypes[data.service] || 'cleaning services'}.\n\n`;
            emailBody += `CONTACT DETAILS:\n`;
            emailBody += `Name: ${data.name}\n`;
            emailBody += `Email: ${data.email}\n`;
            emailBody += `Phone: ${data.phone}\n\n`;
            
            if (data.service && data.service !== 'general') {
                emailBody += `SERVICE REQUESTED: ${serviceTypes[data.service]}\n`;
            }
            
            if (data.frequency) {
                emailBody += `Frequency: ${data.frequency.charAt(0).toUpperCase() + data.frequency.slice(1)}\n`;
            }
            
            if (data['property-size']) {
                emailBody += `Property Size: ${data['property-size']}\n`;
            }
            
            if (data.address) {
                emailBody += `\nPROPERTY ADDRESS:\n${data.address}\n`;
            }
            
            if (data.message) {
                emailBody += `\nADDITIONAL DETAILS:\n${data.message}\n`;
            }
            
            emailBody += `\nPlease contact me at your earliest convenience to discuss pricing and availability.\n\n`;
            emailBody += `Thank you,\n${data.name}`;
            
            // Create mailto link
            const mailtoLink = `mailto:deepclean.go2@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            console.log('Quote request submitted:', data);
            
            // Show success message
            form.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div style="color: var(--primary-blue); font-size: 3rem; margin-bottom: 1rem;">✉️</div>
                    <h3 style="color: var(--primary-blue); margin-bottom: 1rem;">Email Ready!</h3>
                    <p style="color: var(--gray); margin-bottom: 1rem;">Your email client should have opened with a pre-filled message to DEEP CLEAN.</p>
                    <p style="color: var(--gray); font-size: 0.9rem; margin-bottom: 2rem;">If it didn't open automatically, you can email directly to: <strong>deepclean.go2@gmail.com</strong></p>
                    <button type="button" class="btn btn-primary" onclick="this.closest('.quote-modal').remove()">Close</button>
                </div>
            `;
        });
    }

    // Scroll animations for elements coming into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.feature-card, .service-card, .testimonial-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
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