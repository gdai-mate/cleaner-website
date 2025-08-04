// Simple service dropdown functionality
(function() {
    'use strict';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initServiceDropdowns);
    } else {
        initServiceDropdowns();
    }
    
    function initServiceDropdowns() {
        console.log('Initializing service dropdowns...');
        
        // Check if we're on the services page
        const serviceContainer = document.querySelector('.expandable-services');
        if (!serviceContainer) {
            console.log('Not on services page, skipping initialization');
            return;
        }
        
        // Get all service cards
        const serviceCards = serviceContainer.querySelectorAll('.service-card');
        console.log('Found', serviceCards.length, 'service cards');
        
        serviceCards.forEach((card, index) => {
            const header = card.querySelector('.service-header');
            const details = card.querySelector('.service-details');
            
            if (!header || !details) {
                console.error('Card', index, 'missing header or details');
                return;
            }
            
            // Set initial state
            details.style.maxHeight = '0';
            details.style.overflow = 'hidden';
            details.style.transition = 'max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Add click handler to header
            header.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Service card', index, 'clicked');
                
                const isExpanded = card.classList.contains('expanded');
                
                // Close all cards
                serviceCards.forEach(c => {
                    c.classList.remove('expanded');
                    const d = c.querySelector('.service-details');
                    if (d) d.style.maxHeight = '0';
                });
                
                // If not expanded, expand this card
                if (!isExpanded) {
                    card.classList.add('expanded');
                    details.style.maxHeight = details.scrollHeight + 'px';
                    
                    // Wait for expansion animation to start before scrolling
                    setTimeout(() => {
                        const rect = card.getBoundingClientRect();
                        const viewportHeight = window.innerHeight;
                        const headerHeight = 80;
                        
                        // Calculate if we need to scroll
                        const cardTop = rect.top + window.pageYOffset;
                        const cardBottom = cardTop + card.offsetHeight;
                        const viewportTop = window.pageYOffset;
                        const viewportBottom = viewportTop + viewportHeight;
                        
                        // Scroll if card extends below viewport or header is too close to top
                        if (cardBottom > viewportBottom - 100 || rect.top < headerHeight + 40) {
                            const scrollPosition = cardTop - headerHeight - 40;
                            
                            window.scrollTo({
                                top: Math.max(0, scrollPosition),
                                behavior: 'smooth'
                            });
                        }
                    }, 200); // Slightly longer delay for smoother experience
                }
            });
            
            // Add click handler to close button
            const closeBtn = details.querySelector('.service-close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    card.classList.remove('expanded');
                    details.style.maxHeight = '0';
                });
            }
        });
        
        console.log('Service dropdowns initialized successfully');
    }
})();