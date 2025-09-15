// Interactive effects and animations
class InteractiveEffects {
    constructor() {
        this.initScrollAnimations();
        this.initHoverEffects();
        this.initParallaxEffect();
        this.initSmoothScrolling();
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all sections and cards
        document.querySelectorAll('section, .project-card, .skill-item').forEach(el => {
            observer.observe(el);
        });
    }

    initHoverEffects() {
        // Project cards hover effect
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) rotateX(5deg)';
                card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) rotateX(0)';
                card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            });
        });

        // Skill items hover effect
        document.querySelectorAll('.skill-item').forEach(skill => {
            skill.addEventListener('mouseenter', () => {
                skill.style.transform = 'translateY(-5px) scale(1.05)';
            });

            skill.addEventListener('mouseleave', () => {
                skill.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Button hover effects
        document.querySelectorAll('.cta-button, .project-link, .submit-button').forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px) scale(1.02)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    initParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.floating-shapes .shape');
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
            });
        });
    }

    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Form handling
class FormHandler {
    constructor() {
        this.initContactForm();
    }

    initContactForm() {
        const form = document.querySelector('.contact-form form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitButton = form.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            
            // Simulate form submission
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                submitButton.textContent = 'Message Sent! ✓';
                submitButton.style.background = 'linear-gradient(135deg, #10B981, #059669)';
                
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.style.background = '';
                    form.reset();
                }, 2000);
            }, 1500);
        });

        // Input focus effects
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }
}

// Initialize all interactive effects
document.addEventListener('DOMContentLoaded', () => {
    new InteractiveEffects();
    new FormHandler();
});