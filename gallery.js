// Gallery Page Specific JavaScript
// Modern Infinite Continuous Scrolling Gallery

const galleryData = [
    {
        title: "Wall Scaling",
        desc: "Testing the vertical adhesion on smooth drywall surfaces.",
        badge: "Test #1",
        emoji: "🧗",
        color: "#ffadad"
    },
    {
        title: "First Lines",
        desc: "The very first automated doodle drawn by Scribblz.",
        badge: "Milestone",
        emoji: "✏️",
        color: "#ffd6a5"
    },
    {
        title: "Impeller ",
        desc: "High-RPM suction system visualized.",
        badge: "Hardware",
        emoji: "🌪️",
        color: "#fdffb6"
    },
    {
        title: "System Core",
        desc: "The custom PCB and Raspberry Pi brain assembly.",
        badge: "Electronics",
        emoji: "🧠",
        color: "#caffbf"
    },
    {
        title: "Wireless Comms",
        desc: "Sending drawing data from phone to robot.",
        badge: "Software",
        emoji: "📡",
        color: "#9bf6ff"
    },
    {
        title: "Final Polish",
        desc: "The complete system ready for presentation.",
        badge: "Showcase",
        emoji: "✨",
        color: "#a0c4ff"
    },
    {
        title: "Star Pattern",
        desc: "Complex geometric shapes drawn with precision.",
        badge: "Art",
        emoji: "⭐",
        color: "#bdb2ff"
    },
    {
        title: "Debug Mode",
        desc: "Late night calibration sessions.",
        badge: "BTS",
        emoji: "🐞",
        color: "#ffc6ff"
    }
];

class ContinuousGallery {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.items = [];
        this.isDragging = false;
        this.startX = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.animationID = 0;

        // Settings
        this.baseSpeed = 0.5; // Pixels per frame
        this.dragSpeedMultiplier = 1.5;
        this.currentSpeed = this.baseSpeed;
        this.idleTimer = null;
        this.totalWidth = 0;

        this.init();
    }

    init() {
        // Create enough duplicates to fill screen + buffer
        // For a smooth loops, we generally need at least 3 sets
        this.populate(galleryData);
        this.populate(galleryData);
        this.populate(galleryData);

        // Wait for render to calculate width
        requestAnimationFrame(() => {
            this.calculateDimensions();
            this.startAnimationLoop();
        });

        // Event Listeners
        this.container.addEventListener('mousedown', this.touchStart.bind(this));
        this.container.addEventListener('touchstart', this.touchStart.bind(this));

        this.container.addEventListener('mouseup', this.touchEnd.bind(this));
        this.container.addEventListener('mouseleave', this.touchEnd.bind(this));
        this.container.addEventListener('touchend', this.touchEnd.bind(this));

        this.container.addEventListener('mousemove', this.touchMove.bind(this));
        this.container.addEventListener('touchmove', this.touchMove.bind(this));

        window.addEventListener('resize', () => {
            this.calculateDimensions();
        });

        // Button Controls
        // Note: The `slide` method is not provided in the original code,
        // but the event listeners are added as per the instruction.
        document.getElementById('prevBtn').addEventListener('click', () => this.slide(-1));
        document.getElementById('nextBtn').addEventListener('click', () => this.slide(1));

        // Lightbox Init
        this.initLightbox();
    }

    initLightbox() {
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImg = document.getElementById('lightbox-img');
        this.closeBtn = document.getElementById('lightbox-close');

        this.closeBtn.addEventListener('click', () => this.closeLightbox());
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) this.closeLightbox();
        });
    }

    openLightbox(item) {
        // Since we are using placeholders + one real image source for now, 
        // we'll just show the placeholder content or the general image.
        // ideally 'item' would have a high-res image URL.

        // For this demo, let's use the content image:
        this.lightboxImg.src = "images/content.png";

        this.lightbox.classList.add('visible');
        this.currentSpeed = 0; // Pause animation
        this.isDragging = true; // Effectively pause auto-resume logic temporarily
    }

    closeLightbox() {
        this.lightbox.classList.remove('visible');
        this.isDragging = false;
        // Resume speed after short delay
        setTimeout(() => { this.currentSpeed = this.baseSpeed; }, 500);
    }

    populate(data) {
        data.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'gallery-card';
            card.onclick = () => {
                if (!this.wasDragging) {
                    this.openLightbox(item);
                }
            };

            card.innerHTML = `
                <div class="card-badge">${item.badge}</div>
                <div class="card-inner">
                    <div class="card-image-wrapper" style="background-color: ${item.color}33;">
                         <div class="gallery-placeholder" style="font-size: 6rem;">
                            ${item.emoji}
                         </div>
                         <img src="images/content.png" style="opacity: 0.1; position: absolute; width: 100%; height: 100%; object-fit: cover; mix-blend-mode: overlay;">
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">${item.title}</h3>
                        <p class="card-description">${item.desc}</p>
                    </div>
                </div>
            `;
            this.container.appendChild(card);
            this.items.push(card);
        });
    }

    calculateDimensions() {
        if (this.items.length === 0) return;

        // Calculate the width of one single set of data
        const singleSetCount = galleryData.length;
        let singleSetWidth = 0;

        // Measure first set
        for (let i = 0; i < singleSetCount; i++) {
            const style = window.getComputedStyle(this.items[i]);
            const gap = parseFloat(window.getComputedStyle(this.container).gap) || 0;
            singleSetWidth += this.items[i].offsetWidth + gap;
        }

        this.singleSetWidth = singleSetWidth;
    }

    startAnimationLoop() {
        this.animate();
    }

    animate() {
        if (!this.isDragging) {
            // Auto scroll
            this.currentTranslate -= this.currentSpeed;
        }

        // Loop Logic
        // If we have scrolled past the first set, jump back to 0 (seamless)
        // Since we are moving left, currentTranslate is negative
        if (Math.abs(this.currentTranslate) >= this.singleSetWidth) {
            this.currentTranslate += this.singleSetWidth;
            this.prevTranslate = this.currentTranslate; // Sync for drag
        }

        // Also handle dragging to the right (positive translate)
        if (this.currentTranslate > 0) {
            this.currentTranslate -= this.singleSetWidth;
            this.prevTranslate = this.currentTranslate;
        }

        this.setSliderPosition();
        this.animationID = requestAnimationFrame(this.animate.bind(this));
    }

    setSliderPosition() {
        this.container.style.transform = `translateX(${this.currentTranslate}px)`;
    }

    touchStart(event) {
        this.isDragging = true;
        this.wasDragging = false; // Reset drag check
        this.startX = this.getPositionX(event);
        this.currentSpeed = 0; // Stop auto scroll
        this.container.style.cursor = 'grabbing';
        this.prevTranslate = this.currentTranslate;

        // Cancel any idle timer
        if (this.idleTimer) clearTimeout(this.idleTimer);
    }

    touchEnd() {
        this.isDragging = false;
        this.container.style.cursor = 'grab';

        // Reset idle timer to resume speed
        this.idleTimer = setTimeout(() => {
            this.currentSpeed = this.baseSpeed;
        }, 2000); // Resume interaction after 2 seconds
    }

    touchMove(event) {
        if (this.isDragging) {
            const currentPosition = this.getPositionX(event);
            const diff = currentPosition - this.startX;

            // If moved significantly, track it as a drag (to prevent click firing)
            if (Math.abs(diff) > 5) {
                this.wasDragging = true;
            }

            this.currentTranslate = this.prevTranslate + diff;
        }
    }

    getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Remove preload class after page loads
    document.body.classList.remove('is-preload');

    // Initialize Gallery
    const gallery = new ContinuousGallery('galleryContainer');
});
