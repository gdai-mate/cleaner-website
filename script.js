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

    // Form handling for quote requests
    const quoteButtons = document.querySelectorAll('.btn-primary, .cta-button, .package-btn, .service-cta .btn');
    
    quoteButtons.forEach(button => {
        // Skip buttons that should navigate normally (like services-link)
        if (button.classList.contains('services-link')) {
            return;
        }
        
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
            'deep-clean': 'One-off Deep Clean',
            'recurring-basic': 'Recurring Domestic Clean - Basic',
            'recurring-premium': 'Recurring Domestic Clean - Premium',
            'post-construction': 'Post Construction Clean',
            'ndis-funded': 'NDIS & Externally Funded Services',
            'deep': 'One-off Deep Clean', // legacy support
            'recurring': 'Recurring Domestic Clean', // legacy support
            'construction': 'Post Construction Clean', // legacy support
            'funded': 'NDIS & Externally Funded Services', // legacy support
            'general': 'General Enquiry'
        };
        
        const selectedServiceName = serviceOptions[selectedService] || 'General Enquiry';
        
        modal.innerHTML = `
            <div class="quote-modal-content">
                <div class="quote-modal-header">
                    <div class="modal-header-content">
                        <img src="assets/DEEP CLEAN Logo.png" alt="DEEP CLEAN Logo" class="modal-logo">
                        <h3>Get Your Free Quote - ${selectedServiceName}</h3>
                    </div>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="quote-modal-info">
                    <p>Provide details about areas to clean and upload photos for an accurate estimate. A walk-through is required before final pricing.</p>
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
                                <option value="deep-clean" ${selectedService === 'deep-clean' || selectedService === 'deep' ? 'selected' : ''}>One-off Deep Clean</option>
                                <option value="recurring-basic" ${selectedService === 'recurring-basic' ? 'selected' : ''}>Recurring Domestic Clean - Basic</option>
                                <option value="recurring-premium" ${selectedService === 'recurring-premium' || selectedService === 'recurring' ? 'selected' : ''}>Recurring Domestic Clean - Premium</option>
                                <option value="post-construction" ${selectedService === 'post-construction' || selectedService === 'construction' ? 'selected' : ''}>Post Construction Clean</option>
                                <option value="ndis-funded" ${selectedService === 'ndis-funded' || selectedService === 'funded' ? 'selected' : ''}>NDIS & Externally Funded Services</option>
                                <option value="other">Other</option>
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
                        <input type="text" id="address" name="address" placeholder="e.g. West End, QLD 4101">
                    </div>
                    <div class="form-group">
                        <label for="message">Additional Details</label>
                        <textarea id="message" name="message" rows="3" placeholder="Describe the areas to clean, any special requirements, and property details. Photos help us provide better estimates."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="photos">📷 Upload Photos (Optional)</label>
                        <input type="file" id="photos" name="photos" multiple accept="image/*" class="photo-upload">
                        <div class="photo-upload-info">
                            <small>Upload photos of areas that need cleaning to help us provide a more accurate quote. Max 5 photos, 5MB each.</small>
                        </div>
                        <div id="photo-previews" class="photo-previews"></div>
                        <div id="upload-progress" class="upload-progress"></div>
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

        // Photo upload functionality
        const photoInput = modal.querySelector('#photos');
        const previewContainer = modal.querySelector('#photo-previews');
        const progressContainer = modal.querySelector('#upload-progress');
        let uploadedImages = []; // Store uploaded image URLs

        photoInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            
            // Limit to 5 photos
            if (files.length > 5) {
                alert('Please select maximum 5 photos.');
                return;
            }
            
            // Clear previous previews
            previewContainer.innerHTML = '';
            progressContainer.innerHTML = '';
            uploadedImages = [];
            
            files.forEach((file, index) => {
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    showUploadStatus(file.name, 'File too large (max 5MB)', 'error');
                    return;
                }
                
                // Create preview
                createPhotoPreview(file, index);
                
                // Upload to ImgBB (free image hosting)
                uploadImageToHost(file, index);
            });
        });

        function createPhotoPreview(file, index) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.createElement('div');
                preview.className = 'photo-preview';
                preview.innerHTML = `
                    <img src="${e.target.result}" alt="Preview ${index + 1}">
                    <button type="button" class="remove-photo" onclick="removePhoto(${index})">&times;</button>
                `;
                previewContainer.appendChild(preview);
            };
            reader.readAsDataURL(file);
        }

        function uploadImageToHost(file, index) {
            showUploadStatus(file.name, 'Uploading...', 'uploading');
            
            const formData = new FormData();
            formData.append('image', file);
            
            // Using ImgBB free API (you can get a free API key at imgbb.com)
            // For demo purposes, I'll simulate the upload and use a placeholder
            // In production, you'd need to get a free API key from imgbb.com
            
            // Simulated upload - replace with actual ImgBB API call
            setTimeout(() => {
                // Simulate successful upload
                const imageUrl = `https://via.placeholder.com/400x300/1E7CA8/ffffff?text=Photo+${index + 1}+Uploaded`;
                uploadedImages[index] = {
                    url: imageUrl,
                    filename: file.name
                };
                showUploadStatus(file.name, 'Uploaded ✓', 'success');
            }, 1000 + Math.random() * 2000); // Random delay to simulate upload time
            
            /* Actual ImgBB API call - uncomment and add your API key:
            fetch('https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    uploadedImages[index] = {
                        url: data.data.url,
                        filename: file.name
                    };
                    showUploadStatus(file.name, 'Uploaded ✓', 'success');
                } else {
                    showUploadStatus(file.name, 'Upload failed', 'error');
                }
            })
            .catch(error => {
                console.error('Upload error:', error);
                showUploadStatus(file.name, 'Upload failed', 'error');
            });
            */
        }

        function showUploadStatus(filename, status, type) {
            const existing = progressContainer.querySelector(`[data-file="${filename}"]`);
            if (existing) {
                existing.className = `upload-item ${type}`;
                existing.querySelector('.status').textContent = status;
            } else {
                const item = document.createElement('div');
                item.className = `upload-item ${type}`;
                item.setAttribute('data-file', filename);
                item.innerHTML = `
                    <span>${filename}</span>
                    <span class="status">${status}</span>
                `;
                progressContainer.appendChild(item);
            }
        }

        // Make removePhoto globally accessible
        window.removePhoto = function(index) {
            // Remove from uploaded images array
            uploadedImages.splice(index, 1);
            
            // Remove preview
            const previews = previewContainer.querySelectorAll('.photo-preview');
            if (previews[index]) {
                previews[index].remove();
            }
            
            // Remove from progress
            const progressItems = progressContainer.querySelectorAll('.upload-item');
            if (progressItems[index]) {
                progressItems[index].remove();
            }
        };

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
                'deep-clean': 'One-off Deep Clean Request',
                'recurring-basic': 'Recurring Domestic Clean - Basic Request',
                'recurring-premium': 'Recurring Domestic Clean - Premium Request',
                'post-construction': 'Post Construction Clean Request',
                'ndis-funded': 'NDIS & Externally Funded Services Request',
                'deep': 'One-off Deep Clean Request', // legacy support
                'recurring': 'Recurring Domestic Clean Request', // legacy support
                'construction': 'Post Construction Clean Request', // legacy support
                'renovation': 'Post Renovation Clean Request', // legacy support
                'funded': 'NDIS & Externally Funded Services Request', // legacy support
                'other': 'Other Cleaning Service Request',
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
            
            // Include uploaded photos
            if (uploadedImages && uploadedImages.length > 0) {
                emailBody += `\n📷 PHOTOS OF AREAS TO CLEAN:\n`;
                uploadedImages.forEach((image, index) => {
                    if (image && image.url) {
                        emailBody += `Photo ${index + 1}: ${image.url}\n`;
                    }
                });
                emailBody += `\nPlease view the photos above to see the areas that need cleaning. This will help you provide a more accurate quote.\n`;
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

// Contact Form Photo Upload Functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactPhotoInput = document.querySelector('#contactPhotos');
    const contactPreviewContainer = document.querySelector('#contact-photo-previews');
    const contactProgressContainer = document.querySelector('#contact-upload-progress');
    let contactUploadedImages = []; // Store uploaded image URLs for contact form

    if (contactPhotoInput) {
        contactPhotoInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            
            // Limit to 5 photos
            if (files.length > 5) {
                alert('Please select maximum 5 photos.');
                return;
            }
            
            // Clear previous previews
            contactPreviewContainer.innerHTML = '';
            contactProgressContainer.innerHTML = '';
            contactUploadedImages = [];
            
            files.forEach((file, index) => {
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    showContactUploadStatus(file.name, 'File too large (max 5MB)', 'error');
                    return;
                }
                
                // Create preview
                createContactPhotoPreview(file, index);
                
                // Upload to image hosting service
                uploadContactImageToHost(file, index);
            });
        });
    }

    function createContactPhotoPreview(file, index) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.createElement('div');
            preview.className = 'contact-photo-preview';
            preview.innerHTML = `
                <img src="${e.target.result}" alt="Preview ${index + 1}">
                <button type="button" class="remove-photo" onclick="removeContactPhoto(${index})">&times;</button>
            `;
            contactPreviewContainer.appendChild(preview);
        };
        reader.readAsDataURL(file);
    }

    function uploadContactImageToHost(file, index) {
        showContactUploadStatus(file.name, 'Uploading...', 'uploading');
        
        // Simulated upload - replace with actual ImgBB API call in production
        setTimeout(() => {
            const imageUrl = `https://via.placeholder.com/400x300/1E7CA8/ffffff?text=Photo+${index + 1}+Uploaded`;
            contactUploadedImages[index] = {
                url: imageUrl,
                filename: file.name
            };
            showContactUploadStatus(file.name, 'Uploaded ✓', 'success');
        }, 1000 + Math.random() * 2000);
    }

    function showContactUploadStatus(filename, status, type) {
        const existing = contactProgressContainer.querySelector(`[data-file="${filename}"]`);
        if (existing) {
            existing.className = `contact-upload-item ${type}`;
            existing.querySelector('.status').textContent = status;
        } else {
            const item = document.createElement('div');
            item.className = `contact-upload-item ${type}`;
            item.setAttribute('data-file', filename);
            item.innerHTML = `
                <span>${filename}</span>
                <span class="status">${status}</span>
            `;
            contactProgressContainer.appendChild(item);
        }
    }

    // Make removeContactPhoto globally accessible
    window.removeContactPhoto = function(index) {
        // Remove from uploaded images array
        contactUploadedImages.splice(index, 1);
        
        // Remove preview
        const previews = contactPreviewContainer.querySelectorAll('.contact-photo-preview');
        if (previews[index]) {
            previews[index].remove();
        }
        
        // Remove from progress
        const progressItems = contactProgressContainer.querySelectorAll('.contact-upload-item');
        if (progressItems[index]) {
            progressItems[index].remove();
        }
    };

    // Handle contact form submission with photos
    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Collect selected services
            const selectedServices = [];
            const serviceCheckboxes = contactForm.querySelectorAll('input[name="serviceType"]:checked');
            serviceCheckboxes.forEach(checkbox => {
                const labels = {
                    'one-off-deep-clean': 'One-off Deep Clean',
                    'recurring-domestic-clean': 'Recurring Domestic Clean',
                    'post-construction-clean': 'Post Construction Clean',
                    'post-renovation-clean': 'Post Renovation Clean',
                    'niisq-ndis-funded': 'NIISQ, NDIS or other externally funded Clean',
                    'other-service': 'Other Service'
                };
                selectedServices.push(labels[checkbox.value] || checkbox.value);
            });

            // Simple validation
            if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.address) {
                alert('Please fill in all required fields.');
                return;
            }

            if (selectedServices.length === 0) {
                alert('Please select at least one service type.');
                return;
            }
            
            // Create email content
            const subject = `Quote Request: ${selectedServices.join(', ')}`;
            
            // Build email body
            let emailBody = `Hello DEEP CLEAN,\n\n`;
            emailBody += `I would like to request a quote for cleaning services.\n\n`;
            emailBody += `CONTACT DETAILS:\n`;
            emailBody += `Name: ${data.firstName} ${data.lastName}\n`;
            emailBody += `Email: ${data.email}\n`;
            emailBody += `Phone: ${data.phone}\n\n`;
            emailBody += `PROPERTY DETAILS:\n`;
            emailBody += `Address: ${data.address}\n`;
            emailBody += `Property Type: ${data.propertyType || 'Not specified'}\n`;
            emailBody += `Property Size: ${data.propertySize || 'Not specified'}\n\n`;
            emailBody += `SERVICES REQUESTED:\n`;
            selectedServices.forEach(service => {
                emailBody += `• ${service}\n`;
            });
            emailBody += `\n`;
            
            if (data.urgency && data.urgency !== 'flexible') {
                emailBody += `TIMING: ${data.urgency.charAt(0).toUpperCase() + data.urgency.slice(1).replace('-', ' ')}\n\n`;
            }
            
            if (data.message) {
                emailBody += `ADDITIONAL DETAILS:\n${data.message}\n\n`;
            }
            
            // Include uploaded photos
            if (contactUploadedImages && contactUploadedImages.length > 0) {
                emailBody += `📷 PHOTOS OF AREAS TO CLEAN:\n`;
                contactUploadedImages.forEach((image, index) => {
                    if (image && image.url) {
                        emailBody += `Photo ${index + 1}: ${image.url}\n`;
                    }
                });
                emailBody += `\nPlease view the photos above to see the areas that need cleaning. This will help you provide a more accurate quote.\n\n`;
            }
            
            if (data.hearAbout) {
                emailBody += `How they heard about us: ${data.hearAbout}\n\n`;
            }
            
            emailBody += `Please contact me at your earliest convenience to discuss pricing and availability.\n\n`;
            emailBody += `Thank you,\n${data.firstName} ${data.lastName}`;
            
            // Create mailto link
            const mailtoLink = `mailto:deepclean.go2@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            console.log('Contact form submitted:', data);
            console.log('Uploaded images:', contactUploadedImages);
            
            // Show success message
            alert('Email client opened! Your quote request with photos is ready to send.');
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
        
        // Expand on header click
        header.addEventListener('click', function() {
            // Store current scroll position and card position
            const currentScrollY = window.pageYOffset;
            const cardRect = card.getBoundingClientRect();
            const cardTopBeforeExpansion = cardRect.top + currentScrollY;
            
            // Close all other cards first (without animation to prevent jumping)
            serviceCards.forEach(otherCard => {
                if (otherCard !== card && otherCard.classList.contains('expanded')) {
                    const otherDetails = otherCard.querySelector('.service-details');
                    otherCard.classList.remove('expanded');
                    otherDetails.style.transition = 'none'; // Disable transition temporarily
                    otherDetails.style.maxHeight = '0';
                    // Re-enable transition after a brief moment
                    setTimeout(() => {
                        otherDetails.style.transition = 'max-height 0.4s ease';
                    }, 50);
                }
            });
            
            // Brief delay to let the DOM settle, then expand current card
            setTimeout(() => {
                card.classList.add('expanded');
                const scrollHeight = details.scrollHeight;
                details.style.maxHeight = scrollHeight + 'px';
                
                // After expansion starts, lock to this service
                setTimeout(() => {
                    lockToService(card);
                }, 50);
            }, 100);
        });
        
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

    // Gallery Modal Functionality
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const close = document.getElementsByClassName('close')[0];
    
    if (modal && modalImg && modalCaption && close) {
        // Add click event to all gallery items
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', function() {
                const img = this.querySelector('.gallery-image img');
                const overlay = this.querySelector('.overlay-content');
                
                if (img && overlay) {
                    modal.style.display = 'block';
                    modalImg.src = img.src;
                    modalImg.alt = img.alt;
                    
                    const title = overlay.querySelector('h3')?.textContent || '';
                    const description = overlay.querySelector('p')?.textContent || '';
                    modalCaption.innerHTML = `<strong>${title}</strong><br>${description}`;
                }
            });
        });
        
        // Close modal when clicking X
        close.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside the image
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
});