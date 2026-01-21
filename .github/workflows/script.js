document.addEventListener('DOMContentLoaded', function() {
    initializeHamburger();
    initializeScrollToTop();
    initializeScrollSpy();
    saveFormDataLocally();
    handleFormValidationInRealTime();
    addHoverEffectsToCards();
    console.log('Website Loaded Successfully!');
});

function initializeHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    document.addEventListener('click', function(event) {
        const navbar = document.querySelector('.navbar');
        if (navbar && !event.target.closest('.navbar')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

function initializeScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (!scrollToTopBtn) return;

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initializeScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length === 0 || navLinks.length === 0) return;

    window.addEventListener('scroll', function() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const nameInput = form.querySelector('#name');
    const companyInput = form.querySelector('#company');
    const emailInput = form.querySelector('#email');
    const phoneInput = form.querySelector('#Mobile');
    const messageInput = form.querySelector('#message');

    if (!nameInput || !companyInput || !emailInput || !messageInput) {
        showNotification('Form fields not found!', 'error');
        return;
    }

    const name = nameInput.value.trim();
    const company = companyInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const message = messageInput.value.trim();

    if (!validateForm(name, company, email, message)) {
        return;
    }

    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const formData = {
        name: name,
        company: company,
        email: email,
        phone: phone,
        message: message,
        timestamp: new Date().toLocaleString(),
        userAgent: navigator.userAgent
    };

    setTimeout(() => {
        try {
            console.log('=== FORM DATA SUBMITTED ===');
            console.log('Name:', formData.name);
            console.log('Company:', formData.company);
            console.log('Email:', formData.email);
            console.log('Phone:', formData.phone);
            console.log('Message:', formData.message);
            console.log('Submitted at:', formData.timestamp);
            console.log('==========================');
            
            showNotification('Thank you for your inquiry! We will respond within 24-48 hours.', 'success');
            
            form.reset();
            localStorage.removeItem('name');
            localStorage.removeItem('company');
            localStorage.removeItem('email');
            localStorage.removeItem('Mobile');
            localStorage.removeItem('message');
            localStorage.setItem('lastSubmission', JSON.stringify(formData));
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        } catch (error) {
            console.error('Error during submission:', error);
            showNotification('An error occurred. Please try again.', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }, 1500);
}

function validateForm(name, company, email, message) {
    if (!name || !company || !email || !message) {
        showNotification('Please fill in all required fields', 'error');
        return false;
    }

    if (name.length < 2) {
        showNotification('Name must be at least 2 characters long', 'error');
        return false;
    }

    if (company.length < 2) {
        showNotification('Company name must be at least 2 characters long', 'error');
        return false;
    }

    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }

    if (message.length < 10) {
        showNotification('Message must be at least 10 characters long', 'error');
        return false;
    }

    return true;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        font-weight: 500;
        font-size: 14px;
        font-family: Arial, sans-serif;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    console.log(type.toUpperCase() + ':', message);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 4000);
}

function saveFormDataLocally() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        const savedValue = localStorage.getItem(input.id);
        if (savedValue) {
            input.value = savedValue;
        }

        input.addEventListener('input', function() {
            localStorage.setItem(this.id, this.value);
        });
    });

    form.addEventListener('submit', function() {
        inputs.forEach(input => {
            localStorage.removeItem(input.id);
        });
    });
}

function handleFormValidationInRealTime() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const companyInput = document.getElementById('company');

    const validateField = (input, minLength = 2) => {
        input.addEventListener('blur', function() {
            if (this.value.trim().length > 0 && this.value.trim().length < minLength) {
                this.style.borderColor = '#e74c3c';
            } else {
                this.style.borderColor = 'rgba(102, 126, 234, 0.3)';
            }
        });

        input.addEventListener('input', function() {
            if (this.value.trim().length >= minLength || this.value.trim().length === 0) {
                this.style.borderColor = 'rgba(102, 126, 234, 0.3)';
            }
        });
    };

    if (nameInput) validateField(nameInput, 2);
    if (companyInput) validateField(companyInput, 2);
    if (messageInput) validateField(messageInput, 10);

    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value.trim().length > 0 && !validateEmail(this.value)) {
                this.style.borderColor = '#e74c3c';
            } else {
                this.style.borderColor = 'rgba(102, 126, 234, 0.3)';
            }
        });

        emailInput.addEventListener('input', function() {
            if (this.value.trim().length === 0 || validateEmail(this.value)) {
                this.style.borderColor = 'rgba(102, 126, 234, 0.3)';
            }
        });
    }
}

function addHoverEffectsToCards() {
    const cards = document.querySelectorAll('.service-card, .portfolio-item');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();

        const targetElement = document.querySelector(href);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

window.addEventListener('load', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });

        if (img.complete) {
            img.style.opacity = '1';
        }
    });

    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.style.display = 'block';
    });
});

function createStylesForNotifications() {
    if (document.getElementById('notification-styles')) return;

    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideInNotification {
            from {
                opacity: 0;
                transform: translateX(400px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes slideOutNotification {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(400px);
            }
        }

        @media (max-width: 768px) {
            .notification {
                right: 10px !important;
                left: 10px !important;
                max-width: none !important;
            }
        }
    `;
    document.head.appendChild(style);
}

createStylesForNotifications();

window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

console.log('Entire Fashion Website - JavaScript v2.0 Loaded Successfully!');
