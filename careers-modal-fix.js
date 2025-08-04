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
            <div class="careers-modal-content" style="background: white; padding: 40px; border-radius: 12px; max-width: 700px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative;">
                <button class="close-modal" style="position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 30px; cursor: pointer;">&times;</button>
                <h2 style="margin-bottom: 20px;">Careers Application Form</h2>
                <p style="margin-bottom: 30px;">Please fill out all the information below and we'll be in touch soon!</p>
                
                <form id="careersQuickForm" style="display: flex; flex-direction: column; gap: 20px;">
                    <h3 style="margin-bottom: 10px; color: #1E5A7A;">Contact Details</h3>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Full Name *</label>
                        <input type="text" name="name" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Full Address *</label>
                        <input type="text" name="address" required placeholder="Street address, suburb, postcode" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Email Address *</label>
                        <input type="email" name="email" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Phone Number *</label>
                        <input type="tel" name="phone" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
                    </div>
                    
                    <h3 style="margin-top: 20px; margin-bottom: 10px; color: #1E5A7A;">Previous Work History</h3>
                    <p style="margin-bottom: 10px; font-size: 14px; color: #666;">Please list your last 3 jobs (if any)</p>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Job 1 (Most Recent)</label>
                        <input type="text" name="job1" placeholder="Company, position, duration" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Job 2</label>
                        <input type="text" name="job2" placeholder="Company, position, duration" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Job 3</label>
                        <input type="text" name="job3" placeholder="Company, position, duration" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
                    </div>
                    
                    <h3 style="margin-top: 20px; margin-bottom: 10px; color: #1E5A7A;">About You</h3>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Availability *</label>
                        <textarea name="availability" required rows="2" placeholder="When can you work? (e.g., Monday-Friday, mornings, full-time, etc.)" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; resize: vertical;"></textarea>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Interests & Hobbies</label>
                        <textarea name="interests" rows="2" placeholder="Tell us about your interests and hobbies" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; resize: vertical;"></textarea>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">What do you hope to achieve working with us? *</label>
                        <textarea name="goals" required rows="3" placeholder="Tell us about your goals and aspirations" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; resize: vertical;"></textarea>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Do you enjoy helping others? Please explain *</label>
                        <textarea name="helping_others" required rows="3" placeholder="Tell us about your experience helping others" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; resize: vertical;"></textarea>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">How did you hear about us? *</label>
                        <select name="how_heard" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
                            <option value="">Please select</option>
                            <option value="Google">Google Search</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Friend/Family">Friend or Family Referral</option>
                            <option value="Seek">Seek</option>
                            <option value="Indeed">Indeed</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    
                    <button type="submit" style="background: #00bcd4; color: white; padding: 15px 30px; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 20px;">Submit Application</button>
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
            const subject = 'Careers Application from ' + data.name;
            const body = `
CONTACT DETAILS:
Name: ${data.name}
Address: ${data.address}
Email: ${data.email}
Phone: ${data.phone}

PREVIOUS WORK HISTORY:
Job 1: ${data.job1 || 'Not provided'}
Job 2: ${data.job2 || 'Not provided'}
Job 3: ${data.job3 || 'Not provided'}

AVAILABILITY:
${data.availability}

INTERESTS & HOBBIES:
${data.interests || 'Not provided'}

WHAT THEY HOPE TO ACHIEVE:
${data.goals}

DO THEY ENJOY HELPING OTHERS:
${data.helping_others}

HOW THEY HEARD ABOUT US: ${data.how_heard}
            `;
            
            window.location.href = `mailto:deepclean.go2@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // Close modal
            modal.remove();
        });
    }
})();