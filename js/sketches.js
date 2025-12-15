// Random background sketches system
const sketchContainer = document.getElementById('sketchContainer');
const colors = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff'];

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
