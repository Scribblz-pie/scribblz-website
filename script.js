const sketchContainer = document.getElementById('sketchContainer');
const spotItContainer = document.getElementById('spotItContainer');
const robotTrailContainer = document.getElementById('robotTrailContainer');
const colors = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff'];

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes drawLine {
        to {
            stroke-dashoffset: 0;
        }
    }
    @keyframes expandCircle {
        to {
            r: 30;
            opacity: 0;
        }
    }
    @keyframes fadeOut {
        from {
            opacity: 0.85;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Predefined doodle shapes
const doodleShapes = [
    function (x, y, size) {
        const points = 5;
        let path = `M ${x} ${y - size}`;
        for (let i = 1; i <= points * 2; i++) {
            const radius = i % 2 === 0 ? size : size / 2;
            const angle = (Math.PI * i) / points;
            path += ` L ${x + radius * Math.sin(angle)} ${y - radius * Math.cos(angle)}`;
        }
        path += ' Z';
        return path;
    },
    function (x, y, size) {
        let path = `M ${x} ${y}`;
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 4;
            const radius = (i / 20) * size;
            path += ` L ${x + radius * Math.cos(angle)} ${y + radius * Math.sin(angle)}`;
        }
        return path;
    },
    function (x, y, size) {
        const s = size / 20;
        return `M ${x} ${y}
                C ${x} ${y - s * 3}, ${x - s * 10} ${y - s * 8}, ${x - s * 10} ${y - s * 3}
                C ${x - s * 10} ${y + s * 2}, ${x} ${y + s * 8}, ${x} ${y + s * 12}
                C ${x} ${y + s * 8}, ${x + s * 10} ${y + s * 2}, ${x + s * 10} ${y - s * 3}
                C ${x + s * 10} ${y - s * 8}, ${x} ${y - s * 3}, ${x} ${y}`;
    },
    function (x, y, size) {
        let path = `M ${x} ${y}`;
        for (let i = 0; i < 8; i++) {
            const zigX = x + (i * size / 4);
            const zigY = y + (i % 2 === 0 ? size / 3 : -size / 3);
            path += ` L ${zigX} ${zigY}`;
        }
        return path;
    },
    function (x, y, size) {
        return `M ${x - size / 2} ${y - size / 2}
                L ${x + size / 2} ${y - size / 2}
                L ${x + size / 2} ${y + size / 2}
                L ${x - size / 2} ${y + size / 2}
                Z`;
    },
    function (x, y, size) {
        return `M ${x} ${y - size}
                L ${x + size} ${y + size / 2}
                L ${x - size} ${y + size / 2}
                Z`;
    },
    function (x, y, size) {
        return `M ${x - size} ${y}
                L ${x + size / 2} ${y}
                M ${x + size / 2 - size / 3} ${y - size / 3}
                L ${x + size / 2} ${y}
                L ${x + size / 2 - size / 3} ${y + size / 3}`;
    },
    function (x, y, size) {
        let path = `M ${x} ${y}`;
        for (let i = 0; i < 8; i++) {
            const waveX = x + (i * size);
            const waveY = y + Math.sin(i * 0.8) * size * 1.5;
            const cpX = waveX - size / 2;
            const cpY = y + Math.sin((i - 0.5) * 0.8) * size * 1.5;
            path += ` Q ${cpX} ${cpY}, ${waveX} ${waveY}`;
        }
        return path;
    },
    function (x, y, size) {
        let path = `M ${x} ${y}`;
        for (let i = 0; i < 10; i++) {
            const squigX = x + (i * size / 2);
            const squigY = y + (Math.random() - 0.5) * size * 2;
            const cp1X = squigX - size / 4 + (Math.random() - 0.5) * size / 2;
            const cp1Y = squigY + (Math.random() - 0.5) * size;
            const cp2X = squigX - size / 8 + (Math.random() - 0.5) * size / 2;
            const cp2Y = squigY + (Math.random() - 0.5) * size;
            path += ` C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${squigX} ${squigY}`;
        }
        return path;
    }
];

// Create random doodle shape
function createRandomDoodle() {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const size = 30 + Math.random() * 70;

    const shapeFunc = doodleShapes[Math.floor(Math.random() * doodleShapes.length)];
    const pathData = shapeFunc(x, y, size);

    path.setAttribute('d', pathData);
    path.setAttribute('class', 'sketch-line');
    path.setAttribute('stroke', colors[Math.floor(Math.random() * colors.length)]);
    path.setAttribute('fill', 'none');

    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    path.style.animation = `drawLine ${4 + Math.random() * 2}s ease-out forwards`;
    path.style.animationDelay = Math.random() * 1 + 's';

    return path;
}

// Create flowing curved path
function createRandomPath() {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;

    const horizontalBias = Math.random() > 0.5;

    let pathData = `M ${startX} ${startY}`;
    let x = startX;
    let y = startY;

    for (let i = 0; i < 12; i++) {
        let dx, dy;
        if (horizontalBias) {
            dx = 60 + Math.random() * 100;
            dy = (Math.random() - 0.5) * 150;
        } else {
            dx = (Math.random() - 0.5) * 150;
            dy = 60 + Math.random() * 100;
        }

        const cx1 = x + dx * 0.25 + (Math.random() - 0.5) * 120;
        const cy1 = y + dy * 0.25 + (Math.random() - 0.5) * 120;
        const cx2 = x + dx * 0.75 + (Math.random() - 0.5) * 120;
        const cy2 = y + dy * 0.75 + (Math.random() - 0.5) * 120;
        x += dx;
        y += dy;
        pathData += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x} ${y}`;
    }

    path.setAttribute('d', pathData);
    path.setAttribute('class', 'sketch-line');
    path.setAttribute('stroke', colors[Math.floor(Math.random() * colors.length)]);

    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    path.style.animation = `drawLine ${5 + Math.random() * 3}s ease-out forwards`;
    path.style.animationDelay = Math.random() * 2 + 's';

    return path;
}

// Create initial sketch lines and shapes on page load
for (let i = 0; i < 15; i++) {
    setTimeout(() => {
        if (Math.random() > 0.4) {
            sketchContainer.appendChild(createRandomPath());
        } else {
            sketchContainer.appendChild(createRandomDoodle());
        }
    }, i * 150);
}

// Add more sketches periodically
setInterval(() => {
    if (sketchContainer.children.length > 30) {
        sketchContainer.removeChild(sketchContainer.firstChild);
    }
    if (Math.random() > 0.4) {
        sketchContainer.appendChild(createRandomPath());
    } else {
        sketchContainer.appendChild(createRandomDoodle());
    }
}, 2500);

// Spot It Style Characters
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
    // Ensure height is reasonable or fallback
    const introHeight = introSection ? introSection.offsetHeight : window.innerHeight;
    const totalHeight = document.body.scrollHeight;
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
                y = introHeight + size + 80 + (Math.random() * (totalHeight - introHeight - 200));

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

// Call immediately on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createSpotItDoodles);
} else {
    createSpotItDoodles();
}

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


    // New Robot Animation Logic
    const ROBOT_SPEED = 0.05; // pixels per millisecond - reduced for slower movement

    class RobotSequence {
        constructor(robotId, containerId, pathFn, align = 'center', onComplete = null) {
            this.robot = document.getElementById(robotId);
            this.container = document.getElementById(containerId);
            // Move robot to body to ensure absolute positioning works consistently
            if (this.robot) {
                document.body.appendChild(this.robot);
            }
            this.pathFn = pathFn;
            this.align = align; // 'center', 'left', 'right'
            this.onComplete = onComplete; // Callback when animation completes
            this.isRunning = false;
            this.pathElement = null;
            this.shouldCleanup = true; // Control whether to cleanup automatically
        }

        // Helper to calculate distance between points
        getDistance(p1, p2) {
            return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        }

        // Calculate total length of parametric path
        calculatePathLength(pathPoints) {
            let len = 0;
            for (let i = 1; i < pathPoints.length; i++) {
                len += this.getDistance(pathPoints[i - 1], pathPoints[i]);
            }
            return len;
        }

        createDrawingPath(pathPoints, cx, cy) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const rect = this.container.getBoundingClientRect();

            let pathData = `M ${rect.left + window.scrollX + cx + pathPoints[0].x} ${rect.top + window.scrollY + cy + pathPoints[0].y}`;
            for (let i = 1; i < pathPoints.length; i++) {
                const px = rect.left + window.scrollX + cx + pathPoints[i].x;
                const py = rect.top + window.scrollY + cy + pathPoints[i].y;
                pathData += ` L ${px} ${py}`;
            }

            path.setAttribute('d', pathData);
            path.setAttribute('class', 'robot-trail');
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;

            robotTrailContainer.appendChild(path);
            this.pathElement = path;
            return { path, length };
        }

        animate() {
            if (this.isRunning || !this.container || !this.robot) return;
            this.isRunning = true;
            this.robot.style.display = 'block';



            const rect = this.container.getBoundingClientRect();

            // Determine center based on alignment
            let cx = rect.width / 2;
            let cy = rect.height / 2;

            // Calculate offsets based on Viewport Width to hit the gutters
            const viewportWidth = window.innerWidth;

            if (this.align === 'left') {
                // Target: 15% of viewport width (35% from center)
                const targetX = viewportWidth * 0.15;
                // cx is relative to container left. 
                // Container Left + cx = TargetX => cx = TargetX - Container Left
                cx = targetX - rect.left;
            } else if (this.align === 'right') {
                // Target: 85% of viewport width (35% from center, mirroring left)
                const targetX = viewportWidth * 0.85;
                cx = targetX - rect.left;
            }

            const pathPoints = [];
            // Increase resolution for accurate length
            const steps = 150;
            for (let i = 0; i <= steps; i++) {
                pathPoints.push(this.pathFn(i / steps));
            }

            // Calculate duration based on length
            const pathTotalLength = this.calculatePathLength(pathPoints);
            const duration = pathTotalLength / ROBOT_SPEED; // ms

            const { path, length } = this.createDrawingPath(pathPoints, cx, cy);

            const startTime = Date.now();

            const frame = () => {
                if (!this.isRunning) return;
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Calculate how much of the stroke is revealed
                const revealedLength = length * progress;

                // Get the point at the tip of the revealed line
                // This is where the robot should be - at the drawing tip!
                const point = path.getPointAtLength(revealedLength);

                // Set robot position to the tip of the line
                // CSS transform: translate(-50%, -50%) centers the robot on this point
                this.robot.style.left = point.x + 'px';
                this.robot.style.top = point.y + 'px';

                // Sync stroke animation - reveal the line up to this point
                path.style.strokeDashoffset = length - revealedLength;

                if (progress < 1) {
                    requestAnimationFrame(frame);
                } else {
                    // Animation complete
                    if (this.onComplete) {
                        this.onComplete(); // Trigger callback
                    }
                    if (this.shouldCleanup) {
                        this.cleanup();
                    } else {
                        // Just hide robot but keep the drawing
                        if (this.robot) {
                            this.robot.style.display = 'none';
                        }
                        this.isRunning = false;
                    }
                }
            };
            requestAnimationFrame(frame);
        }

        cleanup() {
            if (this.pathElement) {
                this.pathElement.style.animation = 'fadeOut 1s ease-out forwards';
                setTimeout(() => {
                    if (this.pathElement) {
                        this.pathElement.remove();
                        this.pathElement = null;
                    }
                }, 1000);
            }
            if (this.robot) {
                this.robot.style.display = 'none';
            }
            this.isRunning = false;
        }
    }

    // Path Functions (Centered at 0,0)

    // Heart with smooth entry and exit - starts from bottom tip
    const heartPath = (progress) => {
        const scale = 8; // Reduced from 10 for smaller heart

        // Entry phase: 0 to 0.02 (FAST entry - only 2%)
        if (progress < 0.02) {
            const entryProgress = progress / 0.02;
            // Actual bottom tip of heart is at t = π
            const t = Math.PI;
            const heartBottomX = 16 * Math.pow(Math.sin(t), 3) * scale;
            const heartBottomY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale;

            const x = -300 + (entryProgress * (300 + heartBottomX));
            const y = heartBottomY;
            return { x, y };
        }

        // Drawing phase: 0.02 to 0.98 (draw the heart)
        if (progress < 0.98) {
            const drawProgress = (progress - 0.02) / 0.96;
            // Start at t=π (bottom tip) and go full circle
            const t = Math.PI + (drawProgress * 2 * Math.PI);
            const x = 16 * Math.pow(Math.sin(t), 3) * scale;
            const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale;
            return { x, y };
        }

        // Exit phase: 0.98 to 1.0 (FAST exit)
        const exitProgress = (progress - 0.98) / 0.02;
        const t = Math.PI;
        const heartBottomX = 16 * Math.pow(Math.sin(t), 3) * scale;
        const heartBottomY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale;

        const x = heartBottomX - (exitProgress * (300 + heartBottomX));
        const y = heartBottomY;
        return { x, y };
    };

    // Flower (Rose)
    const flowerPath = (progress) => {
        const t = progress * 2 * Math.PI;
        const k = 4; // 4 petals
        const scale = 150;
        const r = scale * Math.cos(k * t);
        const x = r * Math.cos(t);
        const y = r * Math.sin(t);
        return { x, y };
    };

    // Sun (Star-burst spiral)
    const sunPath = (progress) => {
        const t = progress * 4 * Math.PI;
        const scale = 100;
        const r = scale + 30 * Math.sin(10 * t);
        const x = r * Math.cos(t);
        const y = r * Math.sin(t);
        return { x, y };
    };

    // Spiral
    const spiralPath = (progress) => {
        const t = progress * 6 * Math.PI;
        const scale = progress * 150;
        const x = scale * Math.cos(t);
        const y = scale * Math.sin(t);
        return { x, y };
    };

    // Star (5 points)
    const starPath = (progress) => {
        const t = progress * 2 * Math.PI - (Math.PI / 2); // Start at top
        const x = 150 * Math.cos(t); // This is circle.. need star
        // Parametric star? Hard.
        // Let's use a Hypotrochoid or just interpolate points?
        // Let's stick to a continuous loop that looks like a star-ish thing or just a nice spirograph.
        // Let's use a Hypotrochoid (Spirograph)
        const R = 100;
        const r = 20; // R/r = 5
        const d = 50;
        const theta = progress * 2 * Math.PI * 1;
        // We need 5 lobes?
        // x(θ) = (R-r)*cos(θ) + d*cos((R-r)/r*θ)
        // y(θ) = (R-r)*sin(θ) - d*sin((R-r)/r*θ)
        // If R=100, r=20. (R-r)=80. (R-r)/r = 4.
        // This gives 4 lobes?
        // Let's try r=50? (R-r)=50. ratio=1. Ellipse.
        // Let's try r=30. ratio=70/30 = 2.33.

        // Let's just use the previous "starPath" logic but fixed? 
        // Previous starPath was circle with varying radius.
        const angle = t;
        const radius = 120 * (1 - 0.4 * Math.sin(angle * 5)); // 5 points
        return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
    };

    // 5-Pointed Star with entry and exit
    const starShapePath = (progress) => {
        const scale = 100;

        // Entry phase: 0 to 0.02 (FAST entry)
        if (progress < 0.02) {
            const entryProgress = progress / 0.02;
            // Calculate the starting point of the star (at t = -π/2, top)
            const t = -Math.PI / 2;
            const points = 5;
            const innerRadius = 0.4;
            const angle = t * points;
            const radius = scale * (1 - innerRadius * 0.5 * (1 + Math.cos(angle)));
            const startX = radius * Math.cos(t);
            const startY = radius * Math.sin(t);

            const x = 300 - (entryProgress * (300 - startX)); // Enter from right to start point
            const y = startY;
            return { x, y };
        }

        // Drawing phase: 0.02 to 0.98 (draw the star)
        if (progress < 0.98) {
            const drawProgress = (progress - 0.02) / 0.96;
            // Draw exactly one full circle (2π) to close the star perfectly
            const t = -Math.PI / 2 + (drawProgress * 2 * Math.PI);
            // 5-pointed star using varying radius
            const points = 5;
            const innerRadius = 0.4; // Inner points are 40% of outer
            const angle = t * points; // Multiply by points for star effect
            const radius = scale * (1 - innerRadius * 0.5 * (1 + Math.cos(angle)));
            const x = radius * Math.cos(t);
            const y = radius * Math.sin(t);
            return { x, y };
        }

        // Exit phase: 0.98 to 1.0 (FAST exit)
        // Exit from the same point we started (top of star)
        const exitProgress = (progress - 0.98) / 0.02;
        const t = -Math.PI / 2; // Same as start
        const points = 5;
        const innerRadius = 0.4;
        const angle = t * points;
        const radius = scale * (1 - innerRadius * 0.5 * (1 + Math.cos(angle)));
        const endX = radius * Math.cos(t);
        const endY = radius * Math.sin(t);

        const x = endX + (exitProgress * (300 - endX)); // Exit to right from end point
        const y = endY;
        return { x, y };
    };

    // Create robot sequences with proper callbacks
    let heartRobot, starRobot;
    let sequenceTimeout = null;

    // Function to start the full sequence
    const startSequence = () => {
        if (heartRobot && !heartRobot.isRunning) {
            heartRobot.shouldCleanup = true; // Reset for new sequence
            heartRobot.animate();
        }
    };

    // Create star robot (will be triggered by heart)
    starRobot = new RobotSequence('robot-intro-star', 'intro', starShapePath, 'right', () => {
        // When star completes, cleanup both drawings and restart sequence after delay
        if (heartRobot && heartRobot.pathElement) {
            heartRobot.cleanup();
        }
        // Restart the whole sequence after 3 seconds
        sequenceTimeout = setTimeout(startSequence, 3000);
    });

    // Create heart robot with callback to start star
    heartRobot = new RobotSequence('robot-intro', 'intro', heartPath, 'left', () => {
        // When heart completes, start star and keep heart drawing visible
        heartRobot.shouldCleanup = false; // Don't cleanup heart yet
        if (starRobot && !starRobot.isRunning) {
            starRobot.animate();
        }
    });

    // Create other robots normally
    const otherRobots = [
        new RobotSequence('robot-design', 'design', flowerPath, 'right'),
        new RobotSequence('robot-features', 'features', sunPath, 'left'),
        new RobotSequence('robot-system', 'system', spiralPath, 'right'),
        new RobotSequence('robot-gallery', 'gallery', starPath, 'left')
    ].filter(seq => seq.container && seq.robot);

    const robotSequences = [heartRobot, starRobot, ...otherRobots].filter(seq => seq && seq.container && seq.robot);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.target.id === 'intro') {
                // Special handling for intro section
                if (entry.isIntersecting && heartRobot && !heartRobot.isRunning) {
                    startSequence(); // Start the sequence once
                } else if (!entry.isIntersecting) {
                    // Clean up when section leaves view
                    if (sequenceTimeout) {
                        clearTimeout(sequenceTimeout);
                        sequenceTimeout = null;
                    }
                    if (heartRobot) {
                        heartRobot.cleanup();
                    }
                    if (starRobot) {
                        starRobot.cleanup();
                    }
                }
            } else {
                // Normal handling for other sections
                const sequence = otherRobots.find(s => s.container === entry.target);
                if (sequence) {
                    if (entry.isIntersecting && !sequence.isRunning) {
                        sequence.animate();
                        sequence.animationInterval = setInterval(() => {
                            sequence.animate();
                        }, 8000);
                    } else if (!entry.isIntersecting && sequence.animationInterval) {
                        clearInterval(sequence.animationInterval);
                        sequence.animationInterval = null;
                        sequence.cleanup();
                    }
                }
            }
        });
    }, { threshold: 0.2 });

    robotSequences.forEach(sequence => {
        if (sequence && sequence.container) {
            observer.observe(sequence.container);
        }
    });

    const exploreButton = document.getElementById('explore-button');
    if (exploreButton) {
        exploreButton.addEventListener('click', () => {
            document.getElementById('main').scrollIntoView({ behavior: 'smooth' });
        });
    }

    document.body.classList.remove('is-preload');
});
