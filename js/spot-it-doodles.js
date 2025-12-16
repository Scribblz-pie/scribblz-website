// Spot It Style Doodles - Cute background decorations
const spotItContainer = document.getElementById('spotItContainer');

// Spot It Style Characters - Cute Doodle Set
const spotItShapes = [
    // Sparkle (Four-point star)
    function (x, y, size) {
        return `M ${x} ${y - size} Q ${x} ${y} ${x + size} ${y} Q ${x} ${y} ${x} ${y + size} Q ${x} ${y} ${x - size} ${y} Q ${x} ${y} ${x} ${y - size} Z`;
    },
    // Swirl/Loop
    function (x, y, size) {
        return `M ${x - size} ${y} C ${x - size} ${y - size}, ${x} ${y - size}, ${x} ${y} C ${x} ${y + size}, ${x + size} ${y + size}, ${x + size} ${y}`;
    },
    // Flower (Daisy)
    function (x, y, size) {
        let path = `M ${x} ${y} `;
        for (let i = 0; i < 6; i++) {
            const angle = (i * 60) * Math.PI / 180;
            const nx = x + Math.cos(angle) * size;
            const ny = y + Math.sin(angle) * size;
            path += `Q ${x + Math.cos(angle + 0.5) * size * 1.5} ${y + Math.sin(angle + 0.5) * size * 1.5} ${nx} ${ny} L ${x} ${y} `;
        }
        return path + `M ${x + size / 3} ${y} A ${size / 3} ${size / 3} 0 1 0 ${x - size / 3} ${y} Z`;
    },
    // Tulip
    function (x, y, size) {
        return `M ${x} ${y + size} L ${x} ${y} 
                M ${x} ${y} Q ${x - size} ${y - size}, ${x - size / 2} ${y - size * 1.5} Q ${x} ${y - size}, ${x + size / 2} ${y - size * 1.5} Q ${x + size} ${y - size}, ${x} ${y}`;
    },
    // Crown
    function (x, y, size) {
        return `M ${x - size} ${y} L ${x - size} ${y - size * 0.8} L ${x - size / 3} ${y - size * 0.4} L ${x} ${y - size} L ${x + size / 3} ${y - size * 0.4} L ${x + size} ${y - size * 0.8} L ${x + size} ${y} Z`;
    },
    // Paper Plane
    function (x, y, size) {
        return `M ${x - size} ${y + size / 2} L ${x + size} ${y - size / 2} L ${x - size} ${y - size} L ${x - size / 2} ${y} Z`;
    },
    // Sun
    function (x, y, size) {
        let path = `M ${x + size / 2} ${y} A ${size / 2} ${size / 2} 0 1 0 ${x - size / 2} ${y} A ${size / 2} ${size / 2} 0 1 0 ${x + size / 2} ${y} `;
        for (let i = 0; i < 8; i++) {
            const angle = (i * 45) * Math.PI / 180;
            const sx = x + Math.cos(angle) * (size / 2 + 5);
            const sy = y + Math.sin(angle) * (size / 2 + 5);
            const ex = x + Math.cos(angle) * (size + 5);
            const ey = y + Math.sin(angle) * (size + 5);
            path += `M ${sx} ${sy} L ${ex} ${ey} `;
        }
        return path;
    },
    // Lightbulb
    function (x, y, size) {
        return `M ${x - size / 2} ${y - size / 2} A ${size / 2} ${size / 2} 0 1 1 ${x + size / 2} ${y - size / 2} 
                Q ${x + size / 2} ${y} ${x + size / 4} ${y + size / 2} 
                L ${x - size / 4} ${y + size / 2} 
                Q ${x - size / 2} ${y} ${x - size / 2} ${y - size / 2} 
                M ${x - size / 4} ${y + size / 2} L ${x - size / 4} ${y + size / 1.5} L ${x + size / 4} ${y + size / 1.5} L ${x + size / 4} ${y + size / 2}`;
    },
    // Coffee Cup
    function (x, y, size) {
        return `M ${x - size / 2} ${y - size / 4} L ${x - size / 2} ${y + size / 2} A ${size / 4} ${size / 4} 0 0 0 ${x + size / 2} ${y + size / 2} L ${x + size / 2} ${y - size / 4} Z 
                M ${x + size / 2} ${y} Q ${x + size} ${y} ${x + size / 2} ${y + size / 3}
                M ${x - size / 2} ${y - size / 3} Q ${x} ${y - size} ${x + size / 2} ${y - size / 3}`;
    },
    // Cloud (Simple)
    function (x, y, size) {
        return `M ${x - size} ${y} A ${size / 3} ${size / 3} 0 0 1 ${x - size / 3} ${y - size / 2} A ${size / 2} ${size / 2} 0 0 1 ${x + size / 3} ${y - size / 2} A ${size / 3} ${size / 3} 0 0 1 ${x + size} ${y}`;
    },
    // Heart
    function (x, y, size) {
        return `M ${x} ${y + size / 2} C ${x - size} ${y - size / 2}, ${x - size} ${y - size}, ${x} ${y - size / 2} C ${x + size} ${y - size}, ${x + size} ${y - size / 2}, ${x} ${y + size / 2}`;
    },
    // Music Note
    function (x, y, size) {
        return `M ${x - size / 2} ${y + size / 2} A ${size / 4} ${size / 4} 0 1 1 ${x} ${y + size / 2} L ${x} ${y - size} L ${x + size / 2} ${y - size / 1.2} L ${x + size / 2} ${y - size / 2}`;
    },
    // Lightning
    function (x, y, size) {
        return `M ${x} ${y - size} L ${x - size / 2} ${y} L ${x} ${y} L ${x - size / 4} ${y + size} L ${x + size / 2} ${y - size / 2} L ${x} ${y - size / 2} Z`;
    }
];

function createSpotItDoodles() {
    const introSection = document.getElementById('intro');
    const introHeight = introSection ? introSection.offsetHeight : window.innerHeight;
    const systemSection = document.getElementById('system');
    const limitHeight = systemSection ? systemSection.offsetTop : document.body.scrollHeight;
    const width = window.innerWidth;
    const placedDoodles = [];

    // Function to add doodles to a specific side
    const addSideDoodles = (isLeft) => {
        // Generate 80 doodles per side (160 total)
        for (let i = 0; i < 80; i++) {
            let x, y, size;
            let valid = false;
            let attempts = 0;

            // Try to find a valid position without overlap
            while (!valid && attempts < 50) {
                // Position strictly in left or right gutter
                if (isLeft) {
                    x = Math.random() * (width * 0.15); // Left side 0-15%
                } else {
                    x = width * 0.85 + (Math.random() * (width * 0.15)); // Right side 85-100%
                }

                size = 20 + Math.random() * 40;
                // Random Y below intro with buffer
                y = introHeight + size + 80 + (Math.random() * (limitHeight - introHeight - 200));

                // Check overlap
                let overlap = false;
                for (const p of placedDoodles) {
                    const dx = x - p.x;
                    const dy = y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < (size + p.size) * 1.5) {
                        overlap = true;
                        break;
                    }
                }

                if (!overlap) {
                    valid = true;
                }
                attempts++;
            }

            if (valid) {
                placedDoodles.push({ x, y, size });

                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const shapeFunc = spotItShapes[Math.floor(Math.random() * spotItShapes.length)];
                const pathData = shapeFunc(x, y, size);

                path.setAttribute('d', pathData);
                path.setAttribute('class', 'sketch-line spot-it-doodle');
                path.setAttribute('stroke', '#ffffff');
                path.setAttribute('stroke-width', '2');
                path.setAttribute('fill', 'none');

                path.style.transformOrigin = `${x}px ${y}px`;
                path.style.transform = `rotate(${Math.random() * 360}deg)`;
                path.style.opacity = '0.5';
                path.style.strokeDasharray = 'none';
                path.style.strokeDashoffset = '0';

                spotItContainer.appendChild(path);
            }
        }
    };

    // Add doodles to both sides equally
    addSideDoodles(true);  // Left
    addSideDoodles(false); // Right
}

function createSectionDoodles() {
    const containers = document.querySelectorAll('.section-doodles-container');

    containers.forEach(container => {
        // Clear existing
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        const width = container.clientWidth || container.parentElement.clientWidth;
        const height = container.clientHeight || container.parentElement.clientHeight;
        const placedDoodles = [];

        // Function to add doodles to a specific side of the section
        const addSectionSideDoodles = (isLeft) => {
            // Density: approx 1 doodle per 3000px^2 of gutter area? 
            // Calculated for approx 20-30 doodles per side per section
            const count = Math.floor(height / 30);

            for (let i = 0; i < count; i++) {
                let x, y, size;
                let valid = false;
                let attempts = 0;

                while (!valid && attempts < 20) {
                    if (isLeft) {
                        x = Math.random() * 300; // Left side 0-300px from edge (Came in more)
                    } else {
                        x = width - 300 + (Math.random() * 300); // Right side
                    }

                    size = 15 + Math.random() * 25;
                    y = Math.random() * height;

                    // Check overlap
                    let overlap = false;
                    for (const p of placedDoodles) {
                        const dx = x - p.x;
                        const dy = y - p.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < (size + p.size) * 1.2) {
                            overlap = true;
                            break;
                        }
                    }

                    if (!overlap) {
                        valid = true;
                    }
                    attempts++;
                }

                if (valid) {
                    placedDoodles.push({ x, y, size });

                    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    const shapeFunc = spotItShapes[Math.floor(Math.random() * spotItShapes.length)];
                    const pathData = shapeFunc(x, y, size);

                    path.setAttribute('d', pathData);
                    path.setAttribute('class', 'spot-it-doodle');
                    // Use dark color for visibility on light backgrounds
                    path.setAttribute('stroke', '#2C3E50');
                    path.setAttribute('stroke-width', '1.5');
                    path.setAttribute('fill', 'none');

                    path.style.transformOrigin = `${x}px ${y}px`;
                    path.style.transform = `rotate(${Math.random() * 360}deg)`;
                    path.style.opacity = '0.15'; // Subtle

                    container.appendChild(path);
                }
            }
        };

        addSectionSideDoodles(true);
        addSectionSideDoodles(false);
    });
}

// Call immediately on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        createSpotItDoodles();
        createSectionDoodles();
    });
} else {
    createSpotItDoodles();
    createSectionDoodles();
}

// Handle resize for sections
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        createSectionDoodles();
    }, 250);
});
