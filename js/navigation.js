// Navigation and scroll handling
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id], #intro');

    // Function to update active nav link based on scroll position
    function updateActiveNavLink() {
        let currentSection = '';
        const scrollPosition = window.scrollY + 200; // Offset for better UX

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        // Update active class on nav links
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            const linkSection = linkHref.substring(1); // Remove the '#'

            if (linkSection === currentSection) {
                link.parentElement.classList.add('active');
            } else {
                link.parentElement.classList.remove('active');
            }
        });
    }

    // Update on scroll
    window.addEventListener('scroll', updateActiveNavLink);

    // Update on page load
    updateActiveNavLink();

    // Smooth scroll when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Explore button smooth scroll
    const exploreButton = document.getElementById('explore-button');
    if (exploreButton) {
        exploreButton.addEventListener('click', () => {
            document.getElementById('main').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Remove preload class
    document.body.classList.remove('is-preload');
});
