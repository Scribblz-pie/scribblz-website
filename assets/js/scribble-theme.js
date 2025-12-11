/* Scribblz Theme Animation Logic - MAXIMALIST EDITION */

document.addEventListener('DOMContentLoaded', () => {
    initScribbleBackground();
    initScrollAnimations();
    initArticleAnimations();
    initInteractiveScribbles();
});

function initArticleAnimations() {
    const articles = document.querySelectorAll('.posts article');
    if (articles.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Optional: Stop observing once shown
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    articles.forEach(article => observer.observe(article));
}

function initScribbleBackground() {
    const container = document.getElementById('scribble-bg-container');
    if (!container) return;

    if (typeof rough === 'undefined') {
        console.warn('RoughJS not loaded');
        return;
    }

    const rc = rough.svg(container);
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Expo Marker Palette - Brighter, bolder
    const colors = [
        '#FF3F34', // Vivid Red
        '#0FB9B1', // Turquoise
        '#F7B731', // Sunny Yellow
        '#A55EEA', // Bright Purple
        '#45AAF2', // Sky Blue
        '#2d3436'  // Marker Black
    ];

    const shapes = ['circle', 'rectangle', 'cross', 'zigzag', 'ellipse', 'hachure', 'spiral'];

    // Increase density to 60 shapes for more "scribbly" feel
    for (let i = 0; i < 60; i++) {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 120 + 40; // Larger shapes

        let node;
        // Expo marker style: Thicker stroke, slightly smoother than pencil
        const options = {
            stroke: color,
            strokeWidth: Math.random() * 3 + 3, // 3px to 6px width
            roughness: 1.5, // Less rough = more marker-like
            bowing: 1,
            fill: Math.random() > 0.85 ? color : undefined,
            fillStyle: 'hachure',
            fillWeight: 4, // Thick fill lines
            hachureGap: 6
        };

        if (shape === 'circle') {
            node = rc.circle(x, y, size, options);
        } else if (shape === 'rectangle') {
            node = rc.rectangle(x, y, size, size * 0.8, options);
        } else if (shape === 'cross') {
            const s2 = size / 2;
            node = rc.path(`M${x - s2} ${y - s2} L${x + s2} ${y + s2} M${x + s2} ${y - s2} L${x - s2} ${y + s2}`, options);
        } else if (shape === 'zigzag') {
            node = rc.path(`M${x} ${y} L${x + size / 3} ${y + size / 2} L${x + 2 * size / 3} ${y - size / 4} L${x + size} ${y + size / 2}`, options);
        } else if (shape === 'ellipse') {
            node = rc.ellipse(x, y, size, size * 0.6, options);
        } else if (shape === 'hachure') {
            node = rc.path(`M${x} ${y} Q${x + size / 2} ${y + size} ${x + size} ${y}`, options);
        } else if (shape === 'spiral') {
            // Simple spiral path
            const loops = 3;
            let path = `M${x} ${y}`;
            for (let j = 0; j <= loops * Math.PI * 2; j += 0.5) {
                const r = size * (j / (loops * Math.PI * 2));
                const dx = r * Math.cos(j);
                const dy = r * Math.sin(j);
                path += ` L${x + dx} ${y + dy}`;
            }
            node = rc.path(path, options);
        }

        if (node) {
            node.classList.add('scribble-shape');

            // Handle fill color via CSS variable for transition matching
            if (options.fill) {
                node.classList.add('filled');
                node.style.setProperty('--fill-color', color);
            }

            // Randomize position and rotation
            node.style.transform = `rotate(${Math.random() * 360}deg)`;

            // Add Float Animation (infinite)
            node.style.animation = `float ${Math.random() * 5 + 5}s ease-in-out infinite`;
            node.style.animationDelay = `-${Math.random() * 5}s`;

            // Append FIRST to ensure getTotalLength works
            container.appendChild(node);

            // Setup Drawing Animation on child paths
            const paths = node.querySelectorAll('path');
            const startDelay = Math.random() * 1.5; // Stagger start times up to 1.5s

            paths.forEach(path => {
                // Calculate length for the drawing trick
                const length = path.getTotalLength();
                path.style.strokeDasharray = length;
                path.style.strokeDashoffset = length; // Hide initially

                const duration = Math.random() * 1.5 + 1; // 1s to 2.5s draw time

                // We use forwards to keep it visible after drawing
                path.style.animation = `draw ${duration}s ease-out forwards ${startDelay}s`;
            });

            // Optional: Add "grow" effect to some shapes (Scale up)
            if (Math.random() > 0.7) {
                // To combine with float, we might need a wrapper. 
                // But let's just use the stroke drawing as the main "growth".
                // It looks like growing ink.
            }
        }
    }
}

function initScrollAnimations() {
    if (typeof RoughNotation === 'undefined') return;

    const { annotate } = RoughNotation;
    const elements = document.querySelectorAll('[data-scribble]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const type = el.dataset.scribbleType || 'highlight';
                // Use our new bright colors
                const colors = [
                    '#FF3F34', '#0FB9B1', '#F7B731', '#A55EEA', '#45AAF2'
                ];
                const color = colors[Math.floor(Math.random() * colors.length)];

                const annotation = annotate(el, {
                    type: type,
                    color: color,
                    animationDuration: 800, // Slower for emphasis
                    padding: 8,
                    strokeWidth: 3,
                    iterations: 3,
                    multiline: true
                });
                annotation.show();
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.2 });

    elements.forEach(el => observer.observe(el));
}

function initInteractiveScribbles() {
    document.addEventListener('click', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        const burst = document.createElement('div');
        burst.style.position = 'fixed';
        burst.style.left = x + 'px';
        burst.style.top = y + 'px';
        burst.style.pointerEvents = 'none';
        burst.style.zIndex = '9999';
        document.body.appendChild(burst);

        if (typeof rough !== 'undefined') {
            const rc = rough.svg(burst);
            const colors = ['#FF3F34', '#0FB9B1', '#F7B731', '#A55EEA'];

            for (let i = 0; i < 5; i++) {
                const size = Math.random() * 40 + 10;
                const offset = Math.random() * 50 - 25;
                const color = colors[Math.floor(Math.random() * colors.length)];

                const shape = rc.circle(offset, offset, size, {
                    fill: color,
                    stroke: color,
                    fillStyle: 'solid',
                    strokeWidth: 2,
                    roughness: 2
                });
                burst.appendChild(shape);
            }

            const animation = burst.animate([
                { transform: 'scale(0) rotate(0deg)', opacity: 1 },
                { transform: 'scale(2) rotate(180deg)', opacity: 0 }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            });

            animation.onfinish = () => burst.remove();
        }
    });
}
