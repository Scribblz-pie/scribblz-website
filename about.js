// About Page Logic

document.addEventListener('DOMContentLoaded', () => {

    // Flip Card Logic
    const cards = document.querySelectorAll('.member-card');

    cards.forEach(card => {
        const triggers = card.querySelectorAll('.flip-toggle, .flip-toggle-back');

        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent bubbling if necessary
                card.classList.toggle('flipped');
            });
        });
    });

    // Flip All Logic
    const flipAllBtn = document.getElementById('flipAllBtn');
    let allFlipped = true;

    if (flipAllBtn) {
        flipAllBtn.addEventListener('click', () => {
            allFlipped = !allFlipped;
            cards.forEach(card => {
                if (allFlipped) {
                    card.classList.add('flipped');
                } else {
                    card.classList.remove('flipped');
                }
            });
        });
    }

    console.log('About page loaded');
});
