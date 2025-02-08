document.addEventListener("DOMContentLoaded", function () {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = this.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 50,
                    behavior: "smooth"
                });
            }
        });
    });

    // Particle animation
    const particleContainer = document.querySelector('.particles-bg');
    const maxParticles = 30;
    let particleCount = 0;

    function createParticle() {
        if (particleCount >= maxParticles) return;
        
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDuration = (Math.random() * 2 + 2) + 's';
        particleContainer.appendChild(particle);
        particleCount++;
        
        particle.addEventListener('animationend', () => {
            particle.remove();
            particleCount--;
        });
    }
    
    // Create particles at intervals
    setInterval(createParticle, 300);

    // Fade-in effect for sections
    const sections = document.querySelectorAll('section');
    const options = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, options);

    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Navigation scroll behavior
    let lastScrollTop = 0;
    const nav = document.querySelector('.main-nav');
    const scrollThreshold = 100; // Amount of scroll before hiding nav
    
    function handleNavigation() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show nav when at the top
        if (currentScroll <= 0) {
            nav.style.transform = 'translate(-50%, 0)';
            nav.style.opacity = '1';
            return;
        }
        
        // Only handle scroll events beyond threshold
        if (Math.abs(lastScrollTop - currentScroll) <= scrollThreshold) return;
        
        // Scrolling down & past threshold
        if (currentScroll > lastScrollTop && currentScroll > scrollThreshold) {
            nav.style.transform = 'translate(-50%, -100%)';
            nav.style.opacity = '0';
        }
        // Scrolling up
        else {
            nav.style.transform = 'translate(-50%, 0)';
            nav.style.opacity = '1';
        }
        
        lastScrollTop = currentScroll;
    }
    
    // Add smooth transitions to the nav
    nav.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    
    // Throttle scroll events for better performance
    let ticking = false;
    document.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleNavigation();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            // Toggle icon between bars and times
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.mobile-nav')) {
                mobileMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
});
