document.addEventListener('DOMContentLoaded', () => {
    // Add staggered animation to team cards
    const cards = document.querySelectorAll('.member-card');

    // Initial setup: hide them
    cards.forEach(card => {
        card.classList.add('reveal-init');
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Get index for staggered delay
                // We find the index from the spread array of cards
                const index = Array.from(cards).indexOf(entry.target);

                setTimeout(() => {
                    entry.target.classList.remove('reveal-init');
                    entry.target.classList.add('reveal-active');
                }, index * 150);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        observer.observe(card);
    });
});
