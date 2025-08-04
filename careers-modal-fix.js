// Careers modal fix - standalone implementation
(function() {
    'use strict';
    
    console.log('Careers modal fix loaded');
    
    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        console.log('Initializing careers modal...');
        
        // Find all careers buttons
        const careersButtons = document.querySelectorAll('.careers-enquiry-btn');
        console.log('Found', careersButtons.length, 'careers buttons');
        
        // Add click handler to each button
        careersButtons.forEach((btn, index) => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Careers button', index, 'clicked');
                openCareersModal();
            });
        });
    }
    
    function openCareersModal() {
        console.log('Opening careers modal...');
        
        // Check if showCareersModal exists
        if (typeof showCareersModal === 'function') {
            console.log('Using existing showCareersModal function');
            showCareersModal();
            return;
        }
        
        // Otherwise create our own modal
        console.log('Creating careers modal...');
        
        const modal = document.createElement('div');
        modal.className = 'careers-modal';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;';
        
        modal.innerHTML = `
            <div class="careers-modal-content" style="background: white; padding: 40px; border-radius: 12px; max-width: 600px; width: 100%; max-height: 80vh; overflow-y: auto; position: relative;">
                <button class="close-modal" style="position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 30px; cursor: pointer;">&times;</button>
                <h2 style="margin-bottom: 20px;">Let's Start a Conversation</h2>
                <p style="margin-bottom: 30px;">Tell us a bit about yourself and we'll be in touch soon!</p>
                
                <form id="careersQuickForm" style="display: flex; flex-direction: column; gap: 20px;">
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Your Name *</label>
                        <input type="text" name="name" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Email Address *</label>
                        <input type="email" name="email" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Phone Number *</label>
                        <input type="tel" name="phone" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Tell us a bit about yourself</label>
                        <textarea name="about" rows="4" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; resize: vertical;"></textarea>
                    </div>
                    
                    <button type="submit" style="background: #00bcd4; color: white; padding: 12px 30px; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer;">Submit Enquiry</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal handlers
        modal.querySelector('.close-modal').addEventListener('click', function() {
            modal.remove();
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Form submission
        modal.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            console.log('Form submitted:', data);
            
            // Create mailto link
            const subject = 'Careers Enquiry from ' + data.name;
            const body = `
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}

About:
${data.about || 'Not provided'}
            `;
            
            window.location.href = `mailto:deepclean.go2@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // Close modal
            modal.remove();
        });
    }
})();