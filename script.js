// EmailJS Configuration
const EMAILJS_CONFIG = {
    SERVICE_ID: 'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
    CONTACT_TEMPLATE_ID: 'YOUR_CONTACT_TEMPLATE_ID', // Replace with your contact form template ID
    CAREERS_TEMPLATE_ID: 'YOUR_CAREERS_TEMPLATE_ID', // Replace with your careers form template ID
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing DEEP CLEAN website functionality...');
    
    // Mobile navigation toggle
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

    // Form handling for quote requests - Using event delegation for better handling
    document.addEventListener('click', function(e) {
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
            console.log('Quote button clicked, service:', selectedService); // Debug log
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
            
            // Check if EmailJS is available and configured
            if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID') {
                // Use EmailJS to send email
                const templateParams = {
                    to_email: 'deepclean.go2@gmail.com',
                    from_name: `${data.firstName} ${data.lastName}`,
                    from_email: data.email,
                    phone: data.phone,
                    subject: subject,
                    message: emailBody,
                    services: selectedServices.join(', '),
                    address: data.address,
                    property_type: data.propertyType || 'Not specified',
                    property_size: data.propertySize || 'Not specified',
                    urgency: data.urgency || 'Flexible',
                    additional_details: data.message || 'None provided',
                    photos: contactUploadedImages.length > 0 ? 
                        contactUploadedImages.map((img, i) => `Photo ${i+1}: ${img.url}`).join('\n') : 
                        'No photos provided'
                };
                
                emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.CONTACT_TEMPLATE_ID, templateParams)
                    .then(function(response) {
                        console.log('Email sent successfully!', response.status, response.text);
                        showSuccessMessage();
                    }, function(error) {
                        console.error('Failed to send email:', error);
                        // Fallback to mailto
                        fallbackToMailto();
                    });
            } else {
                // Fallback to mailto if EmailJS not configured
                fallbackToMailto();
            }
            
            function fallbackToMailto() {
                const mailtoLink = `mailto:deepclean.go2@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
                window.location.href = mailtoLink;
                showSuccessMessage();
            }
            
            function showSuccessMessage() {
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
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const close = modal ? modal.querySelector('.close') : null;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentIndexSpan = document.getElementById('currentIndex');
    const totalImagesSpan = document.getElementById('totalImages');
    
    let galleryImages = [];
    let currentImageIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    
    // Check if we're on the gallery page
    const galleryItems = document.querySelectorAll('.gallery-item');
    console.log('Gallery items found:', galleryItems.length);
    console.log('Modal elements:', { modal, modalImg, modalCaption, close });
    
    // Initialize gallery if modal elements exist
    if (modal && modalImg && modalCaption) {
        console.log('Initializing gallery modal...');
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
        
        // Add click event to all gallery items
        document.querySelectorAll('.gallery-item').forEach((item, index) => {
            console.log(`Adding click listener to gallery item ${index}`);
            item.addEventListener('click', function(e) {
                console.log(`Gallery item ${index} clicked!`);
                e.preventDefault();
                modal.style.display = 'block';
                showImage(index);
            });
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
            });
        }
        
        // Close modal when clicking outside the content
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (modal.style.display === 'block') {
                switch(e.key) {
                    case 'Escape':
                        modal.style.display = 'none';
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
        modalImg.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        modalImg.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const swipeDistanceX = touchEndX - touchStartX;
            const swipeDistanceY = touchEndY - touchStartY;
            
            // Check if it's primarily a vertical or horizontal swipe
            if (Math.abs(swipeDistanceY) > Math.abs(swipeDistanceX)) {
                // Vertical swipe - close modal if swipe distance is sufficient
                if (Math.abs(swipeDistanceY) > swipeThreshold) {
                    modal.style.display = 'none';
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
    }
    
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
            
            // Check if EmailJS is available and configured
            if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID') {
                // Use EmailJS to send email
                const templateParams = {
                    to_email: 'deepclean.go2@gmail.com',
                    subject: 'Careers Enquiry - ' + formData.fullName,
                    from_name: formData.fullName,
                    from_email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    job1: formData.job1 || 'Not provided',
                    job2: formData.job2 || 'Not provided', 
                    job3: formData.job3 || 'Not provided',
                    availability: formData.availability,
                    interests: formData.interests || 'Not provided',
                    goals: formData.goals,
                    helping_others: formData.helpingOthers,
                    how_heard: formData.howHeard,
                    full_message: emailBody
                };
                
                emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.CAREERS_TEMPLATE_ID, templateParams)
                    .then(function(response) {
                        console.log('Careers email sent successfully!', response.status, response.text);
                        showCareersSuccess();
                    }, function(error) {
                        console.error('Failed to send careers email:', error);
                        // Fallback to mailto
                        fallbackToMailto();
                    });
            } else {
                // Fallback to mailto if EmailJS not configured
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
                    <h3 style="color: var(--dark-blue); margin-bottom: 1rem;">Email Ready!</h3>
                    <p style="color: var(--gray); margin-bottom: 1rem;">Your email client should have opened with your enquiry.</p>
                    <p style="color: var(--gray); font-size: 0.9rem; margin-bottom: 2rem;">If it didn't open automatically, please email: <strong>deepclean.go2@gmail.com</strong></p>
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
            
            // Create mailto link
            const subject = encodeURIComponent(`Job Application - ${formData.get('firstName')} ${formData.get('lastName')}`);
            const body = encodeURIComponent(emailBody);
            const mailtoLink = `mailto:deepclean.go2@gmail.com?subject=${subject}&body=${body}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            applicationForm.innerHTML = `
                <div class="success-content" style="text-align: center; padding: 3rem;">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--primary-turquoise)" stroke-width="2" style="margin-bottom: 2rem;">
                        <path d="M9 12l2 2 4-4"/>
                        <circle cx="12" cy="12" r="9"/>
                    </svg>
                    <h2 style="color: var(--dark-blue); margin-bottom: 1rem;">Application Ready!</h2>
                    <p style="color: var(--gray); margin-bottom: 1rem; font-size: 1.1rem;">Your email client should have opened with your application.</p>
                    <p style="color: var(--gray); margin-bottom: 2rem;">If it didn't open automatically, please email your application to: <strong>deepclean.go2@gmail.com</strong></p>
                    <p style="color: var(--primary-turquoise); font-weight: var(--font-weight-medium); margin-bottom: 2rem;">We're excited to hear from you and will be in touch soon!</p>
                    <a href="careers.html" class="btn btn-primary">Back to Careers</a>
                </div>
            `;
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});