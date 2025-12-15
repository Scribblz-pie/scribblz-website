// Navigation and scroll handling
document.addEventListener('DOMContentLoaded', () => {
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
});
