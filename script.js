// Hover Expand Navbar functionality
const hoverNavbar = document.getElementById('hoverNavbar');
const expandedNav = document.getElementById('expandedNav');

// Keyboard navigation support
hoverNavbar.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Trigger hover effect programmatically
        this.dispatchEvent(new Event('mouseenter'));
        // Focus first navigation item
        const firstNavItem = expandedNav.querySelector('.nav-item-expanded');
        if (firstNavItem) {
            firstNavItem.focus();
        }
    }
});

// Focus management for expanded nav
hoverNavbar.addEventListener('mouseleave', function() {
    // Return focus to navbar when mouse leaves
    this.focus();
});

// Smooth scrolling for navigation items
document.querySelectorAll('.nav-item-expanded').forEach(item => {
    item.addEventListener('click', function() {
        const targetText = this.textContent.trim();

        if (targetText === 'Work') {
            // Check if we're on the main page or Haven page
            if (window.location.pathname.includes('haven-case-study.html')) {
                // On Haven page, go back to main page and scroll to work
                window.location.href = 'index.html#work';
            } else {
                // On main page, scroll to the first card instead of the heading
                const firstCard = document.querySelector('.card-container');
                if (firstCard) {
                    firstCard.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        } else if (targetText === 'Contact') {
            // Check if we're on the main page or Haven page
            if (window.location.pathname.includes('haven-case-study.html')) {
                // On Haven page, go back to main page and scroll to contact
                window.location.href = 'index.html#contact';
            } else {
                // On main page, scroll to get in touch section
                const contactSection = document.querySelector('.get-in-touch-section');
                if (contactSection) {
                    contactSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        }
    });
    
    // Add keyboard support for navigation items
    item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});

// Custom cursor removed - using default cursor

// Prevent text from scrolling behind navbar and add progress stroke
window.addEventListener('scroll', () => {
    const heroSection = document.querySelector('.hero-section');
    const progressPath = document.querySelector('#progressPath');
    const navbar = document.querySelector('.hover-expand-navbar');
    const navHeight = 120; // Height of navbar + margin
    
    // Only apply hero section transform on main page
    if (heroSection && window.scrollY > 0) {
        const translateY = Math.min(window.scrollY * 0.15, 15); // Much more subtle movement
        heroSection.style.transform = `translateY(${translateY}px)`;
    } else if (heroSection) {
        heroSection.style.transform = 'translateY(0)';
    }
    
    // Calculate scroll progress (0 to 1)
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollProgress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    
    // Update SVG progress stroke - works on both pages
    if (progressPath && navbar) {
        updateProgressPath(navbar, progressPath, scrollProgress);
        // Ensure stroke stays correct color after update
        if (window.location.pathname.includes('haven-case-study.html')) {
            progressPath.style.stroke = '#000000';
            progressPath.setAttribute('stroke', '#000000');
        } else {
            progressPath.style.stroke = '#ffffff';
            progressPath.setAttribute('stroke', '#ffffff');
        }
    }
});

// Function to update the progress path based on navbar width
function updateProgressPath(navbar, path, scrollProgress) {
    const navbarRect = navbar.getBoundingClientRect();
    const navbarWidth = navbarRect.width;
    const navbarHeight = 48;
    const radius = 20; // 40px border radius / 2
    const strokeWidth = 1.5; // Half of 3px stroke width to center it on border
    const svgPadding = 5; // Extra padding for SVG
    
    // Calculate the path to sit exactly on the navbar border with SVG padding
    const leftX = strokeWidth + svgPadding; // Start at the border + padding
    const rightX = navbarWidth - strokeWidth + svgPadding; // End at the border + padding
    const topY = strokeWidth + svgPadding; // Start at the border + padding
    const bottomY = navbarHeight - strokeWidth + svgPadding; // End at the border + padding
    const centerY = navbarHeight / 2 + svgPadding;
    
    // Create the path that starts at top center and goes clockwise
    const centerX = (leftX + rightX) / 2;
    const pathData = `M ${centerX} ${topY} L ${rightX - radius} ${topY} A ${radius} ${radius} 0 0 1 ${rightX} ${centerY} A ${radius} ${radius} 0 0 1 ${rightX - radius} ${bottomY} L ${leftX + radius} ${bottomY} A ${radius} ${radius} 0 0 1 ${leftX} ${centerY} A ${radius} ${radius} 0 0 1 ${leftX + radius} ${topY} L ${centerX} ${topY}`;
    
    // Update the path
    path.setAttribute('d', pathData);
    
    // Ensure stroke color is correct for the page
    if (window.location.pathname.includes('haven-case-study.html')) {
        path.style.stroke = '#000000';
        path.setAttribute('stroke', '#000000');
    } else {
        path.style.stroke = '#ffffff';
        path.setAttribute('stroke', '#ffffff');
    }
    
    // Get the actual path length using getTotalLength()
    const pathLength = path.getTotalLength();
    
    // Set up the stroke dash array and offset for proper growing effect
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;
    
    // Calculate how much of the path to draw based on scroll progress
    const drawLength = pathLength * scrollProgress;
    path.style.strokeDashoffset = pathLength - drawLength;
    
    // Debug: Log the values to ensure proper completion
    console.log('Scroll Progress:', scrollProgress, 'Draw Length:', drawLength, 'Path Length:', pathLength);
}

// Skills Showcase Animations
document.addEventListener('DOMContentLoaded', () => {
    // Animate progress bars
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.setProperty('--width', width + '%');
    });
    
    // Set up resize observer for navbar width changes
    const navbar = document.querySelector('.hover-expand-navbar');
    const progressPath = document.querySelector('#progressPath');
    
    if (navbar && progressPath) {
        // Initialize the progress path with scroll at 0
        updateProgressPath(navbar, progressPath, 0);
        
        // Ensure stroke color is correct on page load
        if (window.location.pathname.includes('haven-case-study.html')) {
            progressPath.style.stroke = '#000000';
            progressPath.setAttribute('stroke', '#000000');
        } else {
            progressPath.style.stroke = '#ffffff';
            progressPath.setAttribute('stroke', '#ffffff');
        }
        
        const resizeObserver = new ResizeObserver(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollProgress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
            updateProgressPath(navbar, progressPath, scrollProgress);
        });
        
        resizeObserver.observe(navbar);
    }
    
// Enhanced skill card animations
const skillCards = document.querySelectorAll('.skill-card');

skillCards.forEach((card, index) => {
    // Add floating animation after entrance completes
    const entranceDelay = (index + 1) * 200; // 200ms per card
    const entranceDuration = 800; // 800ms entrance duration

    setTimeout(() => {
        card.classList.add('entered');
    }, entranceDelay + entranceDuration);

    // Enhanced hover effects
    card.addEventListener('mouseenter', () => {
        card.style.animationPlayState = 'paused';
        card.style.transform = 'translateY(-12px) scale(1.03)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.animationPlayState = 'running';
        card.style.transform = '';
    });
});

// Initialize progress indicator on page load
document.addEventListener('DOMContentLoaded', () => {
    const progressPath = document.querySelector('#progressPath');
    const navbar = document.querySelector('.hover-expand-navbar');
    
    if (progressPath && navbar) {
        updateProgressPath(navbar, progressPath, 0);
        // Ensure stroke is white on page load
        progressPath.style.stroke = '#ffffff';
        progressPath.setAttribute('stroke', '#ffffff');
    }
    
    // Handle page load with fragments (e.g., #work, #contact)
    if (window.location.hash) {
        // Small delay to ensure page is fully loaded before scrolling
        setTimeout(() => {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }
    
    // Trigger hero text animations with staggered timing
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero-fade-in');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 200); // 200ms delay between each element
        });
    }, 300); // Start after 300ms
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Add scroll-based animation trigger as backup
    initScrollBasedAnimations();
});

// Scroll-triggered animations
function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback: make all elements visible immediately
        const animatedElements = document.querySelectorAll('.fade-in-up, .slide-in-bottom, .scale-in, .text-reveal, .section-reveal');
        animatedElements.forEach(el => {
            el.classList.add('visible');
        });
        return;
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.fade-in-up, .slide-in-bottom, .scale-in, .text-reveal, .section-reveal');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Debug: Log elements found
    console.log('Found animated elements:', animatedElements.length);
    
    // Fallback: if no elements are found, try again after a short delay
    if (animatedElements.length === 0) {
        setTimeout(() => {
            const retryElements = document.querySelectorAll('.fade-in-up, .slide-in-bottom, .scale-in, .text-reveal, .section-reveal');
            retryElements.forEach(el => {
                observer.observe(el);
            });
            console.log('Retry found elements:', retryElements.length);
        }, 500);
    }
}

// Scroll-based animation trigger (backup method)
function initScrollBasedAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in-up, .slide-in-bottom, .scale-in, .text-reveal, .section-reveal');
    
    function checkElements() {
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        animatedElements.forEach(el => {
            if (el.classList.contains('visible')) return; // Skip if already visible
            
            const elementTop = el.getBoundingClientRect().top + scrollTop;
            const elementBottom = elementTop + el.offsetHeight;
            
            // Check if element is in viewport
            if (elementTop < scrollTop + windowHeight && elementBottom > scrollTop) {
                el.classList.add('visible');
            }
        });
    }
    
    // Check on scroll
    window.addEventListener('scroll', checkElements);
    
    // Check immediately
    checkElements();
    
    // Check after a delay to catch any missed elements
    setTimeout(checkElements, 1000);
}
    
    // Add click effects to tool items
    const toolItems = document.querySelectorAll('.tool-item');
    toolItems.forEach(item => {
        item.addEventListener('click', () => {
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.width = '100px';
            ripple.style.height = '100px';
            ripple.style.marginLeft = '-50px';
            ripple.style.marginTop = '-50px';
            ripple.style.pointerEvents = 'none';
            
            item.style.position = 'relative';
            item.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add floating animation to shapes
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        shape.style.animationDelay = `${index * 2}s`;
    });
    
    // Quote section parallax effect removed
    
    // Add ripple effect to CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = this.querySelector('.button-ripple');
            if (ripple) {
                // Reset animation
                ripple.style.width = '0px';
                ripple.style.height = '0px';
                
                // Trigger reflow
                ripple.offsetHeight;
                
                // Start animation
                ripple.style.width = '300px';
                ripple.style.height = '300px';
            }
        });
    });
    
    // Contact form functionality
    const contactFormToggle = document.getElementById('contact-form-toggle');
    const contactFormContainer = document.getElementById('contact-form-container');
    const contactForm = document.getElementById('contact-form');
    const formCancel = document.getElementById('form-cancel');
    
    if (contactFormToggle && contactFormContainer) {
        // Toggle form visibility
        contactFormToggle.addEventListener('click', function() {
            contactFormContainer.style.display = contactFormContainer.style.display === 'none' ? 'block' : 'none';
            
            if (contactFormContainer.style.display === 'block') {
                // Focus first input when form opens
                const firstInput = contactForm.querySelector('input');
                if (firstInput) {
                    setTimeout(() => firstInput.focus(), 100);
                }
            }
        });
        
        // Cancel form
        if (formCancel) {
            formCancel.addEventListener('click', function() {
                contactFormContainer.style.display = 'none';
                contactForm.reset();
                clearFormErrors();
            });
        }
        
        // Form submission
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (validateForm()) {
                    // Simulate form submission (replace with actual email service)
                    submitForm();
                }
            });
        }
    }
    
    // Form validation
    function validateForm() {
        let isValid = true;
        clearFormErrors();
        
        const name = document.getElementById('contact-name');
        const email = document.getElementById('contact-email');
        const message = document.getElementById('contact-message');
        
        // Validate name
        if (!name.value.trim()) {
            showError('name-error', 'Name is required');
            isValid = false;
        }
        
        // Validate email
        if (!email.value.trim()) {
            showError('email-error', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError('email-error', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate message
        if (!message.value.trim()) {
            showError('message-error', 'Message is required');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showError(errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
    
    function clearFormErrors() {
        const errorElements = document.querySelectorAll('.form-error');
        errorElements.forEach(element => {
            element.textContent = '';
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function submitForm() {
        const submitBtn = contactForm.querySelector('.form-submit-btn');
        const originalText = submitBtn.textContent;
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject') || 'Portfolio Contact';
        const message = formData.get('message');
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Create mailto link
        const mailtoLink = `mailto:josh.arena@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success state
        submitBtn.textContent = 'Email Client Opened!';
        submitBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
        
        // Reset form
        contactForm.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)';
            contactFormContainer.style.display = 'none';
        }, 3000);
    }
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
