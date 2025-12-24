// Navigation and scroll handling
document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinksMenu = document.getElementById('navLinks');

    if (hamburger && navLinksMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navLinksMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const menuLinks = navLinksMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinksMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinksMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinksMenu.classList.remove('active');
            }
        });
    }

    // Highlight current page link
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentPath = window.location.pathname;
    // Get the filename (e.g., 'index.html') or default to 'index.html' for root
    const currentFilename = currentPath.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');

        // precise match logic
        if (linkHref === currentFilename) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Explore button smooth scroll
    const exploreButton = document.getElementById('explore-button');
    if (exploreButton) {
        exploreButton.addEventListener('click', () => {
            // Try to scroll to the next major section
            const nextSection = document.getElementById('final-system-section') || document.getElementById('design');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Remove preload class
    document.body.classList.remove('is-preload');

    // Video autoplay on scroll
    const mainVideo = document.getElementById('mainVideo');
    if (mainVideo) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    mainVideo.play().catch(err => {
                        console.log('Autoplay prevented:', err);
                    });
                } else {
                    mainVideo.pause();
                }
            });
        }, {
            threshold: 0.5 // Video plays when 50% visible
        });
        
        videoObserver.observe(mainVideo);
    }
});
