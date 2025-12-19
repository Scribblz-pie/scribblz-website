// Mechanical Page Specific JavaScript
// This file contains page-specific functionality for the mechanical page

document.addEventListener('DOMContentLoaded', function () {
    // Remove preload class after page loads
    document.body.classList.remove('is-preload');

    console.log('Mechanical page loaded');

    // Initialize all features
    initScrollAnimations();
    initNavPillHighlight();
    initModelPlaceholders();
    initSmoothScroll();
    
    // Initialize interactive demos
    initImpellerDemo();
    initKiwiDriveDemo();
    initVacuumSealDemo();
    initSlipRingDemo();
    initSpoolDemo();
    initFBDDemo();
    initComplianceDemo();
});

// ============================================
// SCROLL-BASED FADE IN ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in-up').forEach(el => {
        el.classList.remove('visible');
        observer.observe(el);
    });

    // Also observe cards and other elements
    document.querySelectorAll('.subsystem-card, .approach-card, .refinement-card, .function-card').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `all 0.5s ease ${index * 0.1}s`;
        
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        cardObserver.observe(el);
    });
}

// ============================================
// NAVIGATION PILL HIGHLIGHT ON SCROLL
// ============================================
function initNavPillHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navPills = document.querySelectorAll('.nav-pill');

    if (sections.length === 0 || navPills.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navPills.forEach(pill => {
                    pill.classList.remove('active');
                    if (pill.getAttribute('href') === `#${id}`) {
                        pill.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Add active style
    const style = document.createElement('style');
    style.textContent = `
        .nav-pill.active {
            background: #ffadad;
            color: white;
            transform: translateY(-2px);
            box-shadow: 5px 5px 0px #2C3E50;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// MODEL PLACEHOLDER INTERACTIONS
// ============================================
function initModelPlaceholders() {
    const placeholders = document.querySelectorAll('.model-placeholder, .image-placeholder');
    
    placeholders.forEach(placeholder => {
        // Add hover effect
        placeholder.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.placeholder-icon');
            if (icon) {
                icon.style.animation = 'none';
                icon.offsetHeight; // Trigger reflow
                icon.style.animation = 'bounce 0.5s ease';
            }
        });

        // Add click handler for future 3D viewer integration
        placeholder.addEventListener('click', function() {
            const modelType = this.dataset.model || this.dataset.image;
            console.log(`Placeholder clicked: ${modelType}`);
            
            // Show a visual feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            // Future: Open 3D viewer modal or load STL
            // openModelViewer(modelType);
        });
    });

    // Model control buttons
    const modelBtns = document.querySelectorAll('.model-btn');
    modelBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;
            const container = this.closest('.model-viewer-container');
            const placeholder = container?.querySelector('.model-placeholder');
            
            // Remove active state from siblings
            this.parentElement.querySelectorAll('.model-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');

            console.log(`View changed to: ${view}`);
            
            // Future: Change 3D model view
            // updateModelView(placeholder, view);
            
            // Visual feedback
            if (placeholder) {
                placeholder.style.transition = 'all 0.3s ease';
                placeholder.style.opacity = '0.7';
                setTimeout(() => {
                    placeholder.style.opacity = '1';
                }, 300);
            }
        });
    });

    // Add bounce keyframe
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
        }
        .model-btn.active {
            background: #5A7C9E;
            color: white;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// SMOOTH SCROLL FOR NAV PILLS
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('.nav-pill').forEach(pill => {
        pill.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// IMPELLER FLUID DYNAMICS DEMO
// ============================================
function initImpellerDemo() {
    const slider = document.getElementById('speedSlider');
    const impellerBlades = document.getElementById('impellerBlades');
    const pressureGauge = document.getElementById('pressureGauge');
    const pressureValue = document.getElementById('pressureValue');
    const rpmValue = document.getElementById('rpmValue');
    const particlesGroup = document.getElementById('airParticles');
    const toggleParticles = document.getElementById('toggleParticles');
    
    if (!slider || !impellerBlades) return;
    
    let rotation = 0;
    let animationId = null;
    let particles = [];
    let showParticles = true;
    const maxParticles = 30;
    
    // Create initial particles
    function createParticle() {
        if (particles.length >= maxParticles) return;
        
        const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        particle.setAttribute('r', '4');
        particle.setAttribute('class', 'air-particle');
        
        // Start at center (inlet)
        const angle = Math.random() * Math.PI * 2;
        const startR = 30 + Math.random() * 20;
        particle.setAttribute('cx', 150 + Math.cos(angle) * startR);
        particle.setAttribute('cy', 150 + Math.sin(angle) * startR);
        
        particle.dataset.angle = angle;
        particle.dataset.radius = startR;
        particle.dataset.speed = 0.5 + Math.random() * 1;
        
        particlesGroup.appendChild(particle);
        particles.push(particle);
    }
    
    function updateParticles(speed) {
        if (!showParticles || speed === 0) {
            particles.forEach(p => p.style.opacity = '0');
            return;
        }
        
        particles.forEach((particle, index) => {
            particle.style.opacity = '0.8';
            let r = parseFloat(particle.dataset.radius);
            let angle = parseFloat(particle.dataset.angle);
            const particleSpeed = parseFloat(particle.dataset.speed);
            
            // Move outward and spiral
            r += speed * particleSpeed * 0.5;
            angle += speed * 0.05;
            
            if (r > 130) {
                // Reset to center
                r = 30 + Math.random() * 20;
                angle = Math.random() * Math.PI * 2;
            }
            
            particle.dataset.radius = r;
            particle.dataset.angle = angle;
            
            const x = 150 + Math.cos(angle) * r;
            const y = 150 + Math.sin(angle) * r;
            
            particle.setAttribute('cx', x);
            particle.setAttribute('cy', y);
            
            // Color based on position (pressure)
            const pressure = r / 130;
            if (pressure < 0.5) {
                particle.style.fill = '#42a5f5'; // inlet - blue
            } else if (pressure < 0.8) {
                particle.style.fill = '#66bb6a'; // middle - green
            } else {
                particle.style.fill = '#ef5350'; // outlet - red (high pressure)
            }
        });
    }
    
    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
        createParticle();
    }
    
    function animate() {
        const speed = parseInt(slider.value);
        
        if (speed > 0) {
            rotation += speed * 0.3;
            impellerBlades.style.transform = `rotate(${rotation}deg)`;
        }
        
        updateParticles(speed / 100);
        animationId = requestAnimationFrame(animate);
    }
    
    slider.addEventListener('input', function() {
        const speed = parseInt(this.value);
        const rpm = Math.round(speed * 220); // 0-22000 RPM
        const pressure = Math.round(speed * 140); // 0-14000 Pa
        
        rpmValue.textContent = rpm.toLocaleString();
        pressureGauge.style.width = `${speed}%`;
        pressureValue.textContent = `${pressure.toLocaleString()} Pa`;
    });
    
    if (toggleParticles) {
        toggleParticles.addEventListener('click', function() {
            showParticles = !showParticles;
            this.textContent = showParticles ? 'Hide Particle Trails' : 'Show Particle Trails';
        });
    }
    
    // Start animation
    animate();
}

// ============================================
// KIWI DRIVE SIMULATOR
// ============================================
function initKiwiDriveDemo() {
    const robot = document.getElementById('kiwiRobot');
    const arena = document.querySelector('.kiwi-arena');
    const joystickKnob = document.getElementById('joystickKnob');
    const joystickBase = document.querySelector('.joystick-base');
    const rotateCW = document.getElementById('rotateCW');
    const rotateCCW = document.getElementById('rotateCCW');
    const clearTrail = document.getElementById('clearTrail');
    const trailCanvas = document.getElementById('trailCanvas');
    const wheel1Speed = document.getElementById('wheel1Speed');
    const wheel2Speed = document.getElementById('wheel2Speed');
    const wheel3Speed = document.getElementById('wheel3Speed');
    
    if (!robot || !arena) return;
    
    let robotX = arena.clientWidth / 2;
    let robotY = arena.clientHeight / 2;
    let robotAngle = 0;
    let joystickX = 0;
    let joystickY = 0;
    let isRotatingCW = false;
    let isRotatingCCW = false;
    
    // Setup canvas
    if (trailCanvas) {
        trailCanvas.width = arena.clientWidth;
        trailCanvas.height = arena.clientHeight;
    }
    const ctx = trailCanvas?.getContext('2d');
    
    // Joystick control
    let isDraggingJoystick = false;
    
    if (joystickKnob && joystickBase) {
        const joystickRect = () => joystickBase.getBoundingClientRect();
        const maxDist = 35;
        
        joystickKnob.addEventListener('mousedown', startJoystickDrag);
        joystickKnob.addEventListener('touchstart', startJoystickDrag);
        
        function startJoystickDrag(e) {
            e.preventDefault();
            isDraggingJoystick = true;
        }
        
        document.addEventListener('mousemove', moveJoystick);
        document.addEventListener('touchmove', moveJoystick);
        
        function moveJoystick(e) {
            if (!isDraggingJoystick) return;
            
            const rect = joystickRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            
            let dx = clientX - centerX;
            let dy = clientY - centerY;
            
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > maxDist) {
                dx = (dx / dist) * maxDist;
                dy = (dy / dist) * maxDist;
            }
            
            joystickKnob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
            joystickX = dx / maxDist;
            joystickY = dy / maxDist;
        }
        
        document.addEventListener('mouseup', endJoystickDrag);
        document.addEventListener('touchend', endJoystickDrag);
        
        function endJoystickDrag() {
            if (!isDraggingJoystick) return;
            isDraggingJoystick = false;
            joystickKnob.style.transform = 'translate(-50%, -50%)';
            joystickX = 0;
            joystickY = 0;
        }
    }
    
    // Rotation buttons
    if (rotateCW) {
        rotateCW.addEventListener('mousedown', () => isRotatingCW = true);
        rotateCW.addEventListener('mouseup', () => isRotatingCW = false);
        rotateCW.addEventListener('mouseleave', () => isRotatingCW = false);
    }
    
    if (rotateCCW) {
        rotateCCW.addEventListener('mousedown', () => isRotatingCCW = true);
        rotateCCW.addEventListener('mouseup', () => isRotatingCCW = false);
        rotateCCW.addEventListener('mouseleave', () => isRotatingCCW = false);
    }
    
    // Keyboard control
    const keys = {};
    document.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'q', 'e'].includes(e.key)) {
            keys[e.key] = true;
        }
    });
    document.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });
    
    // Clear trail
    if (clearTrail && ctx) {
        clearTrail.addEventListener('click', () => {
            ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
        });
    }
    
    // Calculate wheel speeds for Kiwi drive
    function calculateWheelSpeeds(vx, vy, omega) {
        // Kiwi drive wheel angles: 0°, 120°, 240°
        const angles = [0, 2 * Math.PI / 3, 4 * Math.PI / 3];
        const speeds = angles.map(angle => {
            return -vx * Math.sin(angle) + vy * Math.cos(angle) + omega;
        });
        return speeds;
    }
    
    // Animation loop
    let lastX = robotX;
    let lastY = robotY;
    
    function animate() {
        // Get input
        let vx = joystickX;
        let vy = joystickY;
        let omega = 0;
        
        if (keys['ArrowUp']) vy = -1;
        if (keys['ArrowDown']) vy = 1;
        if (keys['ArrowLeft']) vx = -1;
        if (keys['ArrowRight']) vx = 1;
        if (keys['q'] || isRotatingCCW) omega = -1;
        if (keys['e'] || isRotatingCW) omega = 1;
        
        // Update position
        const speed = 2;
        robotX += vx * speed;
        robotY += vy * speed;
        robotAngle += omega * 2;
        
        // Bounds
        const padding = 40;
        robotX = Math.max(padding, Math.min(arena.clientWidth - padding, robotX));
        robotY = Math.max(padding, Math.min(arena.clientHeight - padding, robotY));
        
        // Update robot position
        robot.style.left = `${robotX}px`;
        robot.style.top = `${robotY}px`;
        robot.style.transform = `translate(-50%, -50%) rotate(${robotAngle}deg)`;
        
        // Draw trail
        if (ctx && (vx !== 0 || vy !== 0)) {
            ctx.strokeStyle = '#ffadad';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(robotX, robotY);
            ctx.stroke();
        }
        
        lastX = robotX;
        lastY = robotY;
        
        // Update wheel speed displays
        const wheelSpeeds = calculateWheelSpeeds(vx, vy, omega);
        if (wheel1Speed) wheel1Speed.style.width = `${50 + wheelSpeeds[0] * 50}%`;
        if (wheel2Speed) wheel2Speed.style.width = `${50 + wheelSpeeds[1] * 50}%`;
        if (wheel3Speed) wheel3Speed.style.width = `${50 + wheelSpeeds[2] * 50}%`;
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ============================================
// VACUUM SEAL DEMO
// ============================================
function initVacuumSealDemo() {
    const svg = document.getElementById('vacuumSvg');
    const glassSurface = document.getElementById('glassSurface');
    const leftSkirt = document.getElementById('leftSkirt');
    const rightSkirt = document.getElementById('rightSkirt');
    const vacuumReading = document.getElementById('vacuumReading');
    const dialNeedle = document.getElementById('dialNeedle');
    const sealStatus = document.getElementById('sealStatus');
    const airLeaks = document.getElementById('airLeaks');
    const addBump = document.getElementById('addBump');
    const resetSurface = document.getElementById('resetSurface');
    const skirtBtns = document.querySelectorAll('.skirt-btn');
    const vacuumImpellerBlades = document.getElementById('vacuumImpellerBlades');
    
    if (!svg || !glassSurface) return;
    
    let bumps = [];
    let currentSkirt = 'straw';
    
    // Spin the vacuum impeller
    let vRotation = 0;
    function spinVacuumImpeller() {
        vRotation += 5;
        if (vacuumImpellerBlades) {
            vacuumImpellerBlades.style.transform = `rotate(${vRotation}deg)`;
            vacuumImpellerBlades.style.transformOrigin = '0 0';
        }
        requestAnimationFrame(spinVacuumImpeller);
    }
    spinVacuumImpeller();
    
    // Skirt type selection
    skirtBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            skirtBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentSkirt = this.dataset.type;
            updateVisualization();
        });
    });
    
    // Add bump on click
    svg.addEventListener('click', function(e) {
        const rect = svg.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 400;
        const y = ((e.clientY - rect.top) / rect.height) * 250;
        
        if (y > 180 && y < 220) {
            addBumpAt(x);
        }
    });
    
    if (addBump) {
        addBump.addEventListener('click', function() {
            const x = 80 + Math.random() * 240;
            addBumpAt(x);
        });
    }
    
    if (resetSurface) {
        resetSurface.addEventListener('click', function() {
            bumps = [];
            updateVisualization();
        });
    }
    
    function addBumpAt(x) {
        if (bumps.length > 8) bumps.shift();
        bumps.push({
            x: x,
            height: 5 + Math.random() * 15,
            width: 20 + Math.random() * 30
        });
        updateVisualization();
    }
    
    function updateVisualization() {
        // Draw glass surface with bumps
        let pathD = 'M 0 200';
        bumps.forEach(bump => {
            pathD += ` L ${bump.x - bump.width/2} 200`;
            pathD += ` Q ${bump.x} ${200 - bump.height} ${bump.x + bump.width/2} 200`;
        });
        pathD += ' L 400 200';
        glassSurface.setAttribute('d', pathD);
        
        // Calculate seal quality based on skirt type and bumps
        let sealQuality = 1;
        let leakPositions = [];
        
        const skirtConfigs = {
            'straw': { compliance: 0.9, friction: 0.2 },
            'hard': { compliance: 0.2, friction: 0.3 },
            'foam': { compliance: 0.7, friction: 0.8 },
            'none': { compliance: 0, friction: 0 }
        };
        
        const config = skirtConfigs[currentSkirt];
        
        bumps.forEach(bump => {
            const leakAmount = (bump.height / 15) * (1 - config.compliance);
            sealQuality -= leakAmount * 0.15;
            if (leakAmount > 0.3) {
                leakPositions.push(bump.x);
            }
        });
        
        if (currentSkirt === 'none') {
            sealQuality = 0.1;
            leakPositions = [100, 200, 300];
        }
        
        sealQuality = Math.max(0.1, Math.min(1, sealQuality));
        
        // Update skirt appearance
        const skirtY = currentSkirt === 'straw' ? 195 : (currentSkirt === 'foam' ? 190 : 200);
        const leftSkirtPath = `M 50 140 Q 50 ${140 + (skirtY - 140)/2} 50 ${skirtY}`;
        const rightSkirtPath = `M 350 140 Q 350 ${140 + (skirtY - 140)/2} 350 ${skirtY}`;
        
        if (currentSkirt === 'none') {
            leftSkirt.setAttribute('d', 'M 50 140 L 50 140');
            rightSkirt.setAttribute('d', 'M 350 140 L 350 140');
        } else {
            leftSkirt.setAttribute('d', leftSkirtPath);
            rightSkirt.setAttribute('d', rightSkirtPath);
        }
        
        // Skirt color based on type
        const skirtColors = {
            'straw': '#66bb6a',
            'hard': '#90a4ae',
            'foam': '#ffb74d',
            'none': 'transparent'
        };
        leftSkirt.style.stroke = skirtColors[currentSkirt];
        rightSkirt.style.stroke = skirtColors[currentSkirt];
        
        // Update leak indicators
        airLeaks.innerHTML = '';
        leakPositions.forEach(x => {
            const leak = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            leak.setAttribute('d', `M ${x} 200 Q ${x} 180 ${x + 10} 160`);
            leak.setAttribute('class', 'air-leak');
            airLeaks.appendChild(leak);
        });
        
        // Update pressure display
        const pressure = Math.round(sealQuality * 14000);
        if (vacuumReading) vacuumReading.textContent = pressure.toLocaleString();
        
        // Update dial
        if (dialNeedle) {
            const angle = -90 + (sealQuality * 180);
            dialNeedle.style.transform = `rotate(${angle}deg)`;
        }
        
        // Update status
        if (sealStatus) {
            const indicator = sealStatus.querySelector('.status-indicator');
            if (sealQuality > 0.7) {
                indicator.className = 'status-indicator good';
                sealStatus.querySelector('span:last-child').textContent = 'Seal: Good';
            } else if (sealQuality > 0.4) {
                indicator.className = 'status-indicator warning';
                sealStatus.querySelector('span:last-child').textContent = 'Seal: Partial';
            } else {
                indicator.className = 'status-indicator bad';
                sealStatus.querySelector('span:last-child').textContent = 'Seal: Poor';
            }
        }
    }
    
    // Initial state
    updateVisualization();
}

// ============================================
// SLIP RING DEMO
// ============================================
function initSlipRingDemo() {
    const svg = document.getElementById('slipRingSvg');
    const rotor = document.getElementById('slipRingRotor');
    const rotationCount = document.getElementById('rotationCount');
    const autoRotateBtn = document.getElementById('autoRotateSlipRing');
    const toggleCurrentBtn = document.getElementById('toggleCurrentFlow');
    const electricalFlow = document.getElementById('electricalFlow');
    const currentFlowDisplay = document.getElementById('currentFlow');
    
    if (!svg || !rotor) return;
    
    let rotation = 0;
    let totalRotation = 0;
    let isDragging = false;
    let startAngle = 0;
    let autoRotating = false;
    let showCurrentFlow = false;
    let currentParticles = [];
    
    // Create electrical flow particles
    function createCurrentParticle(isPositive) {
        const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        particle.setAttribute('r', '4');
        particle.setAttribute('class', isPositive ? 'current-particle positive' : 'current-particle negative');
        
        // Start position based on polarity
        const startX = 50;
        const startY = isPositive ? 85 : 135;
        particle.setAttribute('cx', startX);
        particle.setAttribute('cy', startY);
        
        particle.dataset.progress = 0;
        particle.dataset.isPositive = isPositive;
        
        electricalFlow.appendChild(particle);
        currentParticles.push(particle);
    }
    
    // Animate current particles along the circuit
    function animateCurrentParticles() {
        if (!showCurrentFlow) {
            currentParticles.forEach(p => p.style.opacity = '0');
            return;
        }
        
        currentParticles.forEach((particle) => {
            particle.style.opacity = '1';
            let progress = parseFloat(particle.dataset.progress);
            const isPositive = particle.dataset.isPositive === 'true';
            
            progress += 0.02;
            if (progress > 1) progress = 0;
            
            particle.dataset.progress = progress;
            
            // Define the path: power source -> brush -> ring -> rotor wire -> motor
            let x, y;
            
            if (isPositive) {
                // Positive path
                if (progress < 0.2) {
                    // Wire to brush
                    x = 50 + progress * 5 * 50; // 50 to 100
                    y = 85 + progress * 5 * 15;  // 85 to 100
                } else if (progress < 0.4) {
                    // Brush to ring contact
                    const p = (progress - 0.2) * 5;
                    x = 100 + p * 15; // 100 to 115
                    y = 100 + p * 15; // 100 to 115
                } else if (progress < 0.6) {
                    // Through slip ring (adjusts with rotation)
                    const p = (progress - 0.4) * 5;
                    x = 115 + p * 85; // 115 to 200
                    y = 115;
                } else if (progress < 0.8) {
                    // Rotor wire to motor
                    const p = (progress - 0.6) * 5;
                    x = 200 + p * 145; // 200 to 345
                    y = 115 - p * 25; // 115 to 90
                } else {
                    // At motor
                    const p = (progress - 0.8) * 5;
                    x = 345;
                    y = 90 + p * 20; // 90 to 110
                }
            } else {
                // Negative path (return)
                if (progress < 0.2) {
                    x = 50 + progress * 5 * 50;
                    y = 135 + progress * 5 * 22;
                } else if (progress < 0.4) {
                    const p = (progress - 0.2) * 5;
                    x = 100 + p * 15;
                    y = 157 + p * 8;
                } else if (progress < 0.6) {
                    const p = (progress - 0.4) * 5;
                    x = 115 + p * 85;
                    y = 165;
                } else if (progress < 0.8) {
                    const p = (progress - 0.6) * 5;
                    x = 200 + p * 145;
                    y = 165 + p * 35;
                } else {
                    const p = (progress - 0.8) * 5;
                    x = 345;
                    y = 200 - p * 30;
                }
            }
            
            particle.setAttribute('cx', x);
            particle.setAttribute('cy', y);
        });
        
        requestAnimationFrame(animateCurrentParticles);
    }
    
    // Initialize particles
    for (let i = 0; i < 8; i++) {
        createCurrentParticle(i % 2 === 0);
        currentParticles[i].dataset.progress = i * 0.125;
    }
    
    function getAngle(e) {
        const rect = svg.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height * 0.47;
        
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    }
    
    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('touchstart', startDrag);
    
    function startDrag(e) {
        if (autoRotating) return;
        isDragging = true;
        startAngle = getAngle(e) - rotation;
    }
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    
    function drag(e) {
        if (!isDragging) return;
        const newRotation = getAngle(e) - startAngle;
        const delta = newRotation - rotation;
        rotation = newRotation;
        totalRotation += delta;
        updateRotor();
    }
    
    document.addEventListener('mouseup', () => isDragging = false);
    document.addEventListener('touchend', () => isDragging = false);
    
    function updateRotor() {
        // Only rotate the rotor side slightly for visual effect
        rotor.style.transform = `translateX(${Math.sin(rotation * Math.PI / 180) * 5}px)`;
        
        if (rotationCount) {
            const displayAngle = Math.abs(Math.round(totalRotation));
            const turns = Math.floor(displayAngle / 360);
            const remainder = displayAngle % 360;
            if (turns > 0) {
                rotationCount.textContent = `${turns} turn${turns > 1 ? 's' : ''} + ${remainder}°`;
            } else {
                rotationCount.textContent = `${remainder}°`;
            }
        }
        
        if (currentFlowDisplay && showCurrentFlow) {
            currentFlowDisplay.textContent = '2.5 A';
        }
    }
    
    if (autoRotateBtn) {
        autoRotateBtn.addEventListener('click', function() {
            if (autoRotating) {
                autoRotating = false;
                this.textContent = '▶ Auto Rotate';
                return;
            }
            
            autoRotating = true;
            this.textContent = '⏹ Stop';
            
            function autoAnimate() {
                if (!autoRotating) return;
                rotation += 2;
                totalRotation += 2;
                updateRotor();
                requestAnimationFrame(autoAnimate);
            }
            autoAnimate();
        });
    }
    
    if (toggleCurrentBtn) {
        toggleCurrentBtn.addEventListener('click', function() {
            showCurrentFlow = !showCurrentFlow;
            this.textContent = showCurrentFlow ? 'Hide Current Flow' : 'Show Current Flow';
            if (showCurrentFlow) {
                animateCurrentParticles();
                if (currentFlowDisplay) currentFlowDisplay.textContent = '2.5 A';
            } else {
                if (currentFlowDisplay) currentFlowDisplay.textContent = '0.0 A';
            }
        });
    }
}

// ============================================
// SPOOL DEMO
// ============================================
function initSpoolDemo() {
    const svg = document.getElementById('spoolSvg');
    const robot = document.getElementById('spoolRobot');
    const tetherPath = document.getElementById('tetherPath');
    const spoolWheel = document.getElementById('spoolWheel');
    const tetherLength = document.getElementById('tetherLength');
    const spoolDirection = document.getElementById('spoolDirection');
    const demoPathBtn = document.getElementById('demoPath');
    const returnToDockBtn = document.getElementById('returnToDock');
    
    if (!svg || !robot) return;
    
    let robotX = 250;
    let robotY = 150;
    let isDragging = false;
    let spoolRotation = 0;
    let previousLength = 200;
    
    // Docking station tether exit point
    const dockX = 70;
    const dockY = 25;
    
    robot.style.cursor = 'grab';
    
    robot.addEventListener('mousedown', startDrag);
    robot.addEventListener('touchstart', startDrag);
    
    function startDrag(e) {
        e.preventDefault();
        isDragging = true;
        robot.style.cursor = 'grabbing';
    }
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    
    function drag(e) {
        if (!isDragging) return;
        
        const rect = svg.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        robotX = ((clientX - rect.left) / rect.width) * 500;
        robotY = ((clientY - rect.top) / rect.height) * 300;
        
        // Bounds - stay on the glass (below frame)
        robotX = Math.max(80, Math.min(470, robotX));
        robotY = Math.max(80, Math.min(260, robotY));
        
        updateVisualization();
    }
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
        robot.style.cursor = 'grab';
    });
    document.addEventListener('touchend', () => {
        isDragging = false;
        robot.style.cursor = 'grab';
    });
    
    function updateVisualization() {
        // Update robot position
        robot.setAttribute('transform', `translate(${robotX}, ${robotY})`);
        
        // Calculate tether path (slight curve, exits above frame)
        const midX = (dockX + robotX) / 2;
        const midY = Math.min(dockY, robotY - 30) + 10;
        tetherPath.setAttribute('d', `M ${dockX} ${dockY} Q ${midX} ${midY} ${robotX} ${robotY - 30}`);
        
        // Calculate length
        const dx = robotX - dockX;
        const dy = robotY - dockY;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        // Update spool rotation
        const lengthDiff = length - previousLength;
        spoolRotation += lengthDiff * 2;
        if (spoolWheel) {
            spoolWheel.style.transform = `rotate(${spoolRotation}deg)`;
            spoolWheel.style.transformOrigin = 'center';
        }
        
        // Update displays
        if (tetherLength) {
            tetherLength.textContent = `${Math.round(length * 2)}mm`;
        }
        
        if (spoolDirection) {
            if (Math.abs(lengthDiff) < 0.5) {
                spoolDirection.textContent = '— Idle';
            } else if (lengthDiff > 0) {
                spoolDirection.textContent = '↗ Releasing';
            } else {
                spoolDirection.textContent = '↙ Winding';
            }
        }
        
        previousLength = length;
    }
    
    // Demo path button
    if (demoPathBtn) {
        demoPathBtn.addEventListener('click', function() {
            const path = [
                { x: 150, y: 120 },
                { x: 380, y: 120 },
                { x: 380, y: 220 },
                { x: 150, y: 220 },
                { x: 150, y: 120 }
            ];
            
            let step = 0;
            this.disabled = true;
            
            function animateToPoint() {
                if (step >= path.length) {
                    demoPathBtn.disabled = false;
                    return;
                }
                
                const targetX = path[step].x;
                const targetY = path[step].y;
                const startX = robotX;
                const startY = robotY;
                let progress = 0;
                
                function animate() {
                    progress += 0.03;
                    if (progress >= 1) {
                        robotX = targetX;
                        robotY = targetY;
                        updateVisualization();
                        step++;
                        setTimeout(animateToPoint, 200);
                        return;
                    }
                    
                    robotX = startX + (targetX - startX) * progress;
                    robotY = startY + (targetY - startY) * progress;
                    updateVisualization();
                    requestAnimationFrame(animate);
                }
                animate();
            }
            
            animateToPoint();
        });
    }
    
    // Return to dock button
    if (returnToDockBtn) {
        returnToDockBtn.addEventListener('click', function() {
            const startX = robotX;
            const startY = robotY;
            const endX = 120;
            const endY = 100;
            
            let progress = 0;
            const animate = () => {
                progress += 0.03;
                if (progress > 1) progress = 1;
                
                robotX = startX + (endX - startX) * progress;
                robotY = startY + (endY - startY) * progress;
                updateVisualization();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            animate();
        });
    }
    
    // Initial visualization
    updateVisualization();
}

// ============================================
// FUTURE: 3D MODEL VIEWER INTEGRATION
// ============================================
// Placeholder functions for future STL viewer integration
// using three.js or model-viewer

function openModelViewer(modelType) {
    // TODO: Implement 3D model viewer modal
    // Could use:
    // - three.js for STL files
    // - <model-viewer> web component for GLB/GLTF
    console.log(`Opening model viewer for: ${modelType}`);
}

function updateModelView(placeholder, viewType) {
    // TODO: Implement view changes (assembled, exploded, rotate)
    console.log(`Updating view to: ${viewType}`);
}

// ============================================
// FREE BODY DIAGRAM DEMO
// ============================================
function initFBDDemo() {
    const vacuumSlider = document.getElementById('fbdVacuumSlider');
    const skirtFrictionSlider = document.getElementById('fbdSkirtFriction');
    const vacuumValue = document.getElementById('fbdVacuumValue');
    const skirtValue = document.getElementById('fbdSkirtValue');
    const driveForceResult = document.getElementById('driveForceResult');
    const lostForceResult = document.getElementById('lostForceResult');
    const netForceResult = document.getElementById('netForceResult');
    const driveForceBar = document.getElementById('driveForceBar');
    const lostForceBar = document.getElementById('lostForceBar');
    const vacuumForce = document.getElementById('vacuumForce');
    const wheelNormal1 = document.getElementById('wheelNormal1');
    const wheelNormal2 = document.getElementById('wheelNormal2');
    const wheelFriction1 = document.getElementById('wheelFriction1');
    const wheelFriction2 = document.getElementById('wheelFriction2');
    const skirtFriction1 = document.getElementById('skirtFriction1');
    const skirtFriction2 = document.getElementById('skirtFriction2');
    const presetBtns = document.querySelectorAll('.preset-btn');
    
    if (!vacuumSlider || !skirtFrictionSlider) return;
    
    function updateFBD() {
        const vacuum = parseInt(vacuumSlider.value);
        const skirtMu = parseInt(skirtFrictionSlider.value);
        
        // Update display values
        if (vacuumValue) vacuumValue.textContent = `${vacuum}%`;
        
        // Skirt friction label
        if (skirtValue) {
            if (skirtMu < 30) skirtValue.textContent = 'Low (Straws)';
            else if (skirtMu < 60) skirtValue.textContent = 'Medium';
            else skirtValue.textContent = 'High (Foam)';
        }
        
        // Calculate forces
        const totalVacuumForce = vacuum * 0.14; // Max ~14N at full vacuum
        const wheelMu = 0.4; // Omni-wheel friction coefficient
        const skirtMuValue = skirtMu * 0.01; // 0 to 1
        
        // Force distribution: some goes to wheels, some to skirt
        const skirtContactRatio = 0.3; // Skirt takes 30% of contact area
        const forceToWheels = totalVacuumForce * (1 - skirtContactRatio * skirtMuValue);
        const forceToSkirt = totalVacuumForce * skirtContactRatio * skirtMuValue;
        
        const driveForce = forceToWheels * wheelMu;
        const skirtDrag = forceToSkirt * skirtMuValue;
        const netForce = Math.max(0, driveForce - skirtDrag);
        
        // Update results
        if (driveForceResult) driveForceResult.textContent = `${driveForce.toFixed(1)} N`;
        if (lostForceResult) lostForceResult.textContent = `${skirtDrag.toFixed(1)} N`;
        if (netForceResult) netForceResult.textContent = `${netForce.toFixed(1)} N`;
        
        // Update bars
        if (driveForceBar) driveForceBar.style.width = `${Math.min(100, driveForce * 10)}%`;
        if (lostForceBar) lostForceBar.style.width = `${Math.min(100, skirtDrag * 20)}%`;
        
        // Update arrow lengths based on forces
        const vacuumArrowLength = 30 + vacuum * 0.7;
        if (vacuumForce) {
            vacuumForce.setAttribute('y2', 30 + vacuumArrowLength);
        }
        
        const wheelNormalLength = 20 + forceToWheels * 3;
        if (wheelNormal1) wheelNormal1.setAttribute('y2', 280 - wheelNormalLength);
        if (wheelNormal2) wheelNormal2.setAttribute('y2', 280 - wheelNormalLength);
        
        const wheelFrictionLength = 20 + driveForce * 5;
        if (wheelFriction1) wheelFriction1.setAttribute('x2', 155 - wheelFrictionLength);
        if (wheelFriction2) wheelFriction2.setAttribute('x2', 295 - wheelFrictionLength);
        
        const skirtFrictionLength = 10 + skirtDrag * 15;
        if (skirtFriction1) {
            skirtFriction1.setAttribute('x2', 125 + skirtFrictionLength);
            skirtFriction1.style.opacity = skirtMu > 10 ? '1' : '0.3';
        }
        if (skirtFriction2) {
            skirtFriction2.setAttribute('x2', 325 + skirtFrictionLength);
            skirtFriction2.style.opacity = skirtMu > 10 ? '1' : '0.3';
        }
    }
    
    vacuumSlider.addEventListener('input', updateFBD);
    skirtFrictionSlider.addEventListener('input', updateFBD);
    
    // Preset buttons
    presetBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const vacuum = this.dataset.vacuum;
            const friction = this.dataset.friction;
            
            vacuumSlider.value = vacuum;
            skirtFrictionSlider.value = friction;
            updateFBD();
        });
    });
    
    // Initial update
    updateFBD();
}

// ============================================
// COMPLIANCE DEMO
// ============================================
function initComplianceDemo() {
    const svg = document.getElementById('complianceSvg');
    const robot = document.getElementById('complianceRobot');
    const skirt = document.getElementById('complianceSkirt');
    const materialCards = document.querySelectorAll('.material-card');
    const sealQualityBar = document.getElementById('sealQualityBar');
    const mobilityBar = document.getElementById('mobilityBar');
    const sealQualityValue = document.getElementById('sealQualityValue');
    const mobilityValue = document.getElementById('mobilityValue');
    const overallScore = document.getElementById('overallScore');
    const appliedForceArrow = document.getElementById('appliedForceArrow');
    const frictionArrow = document.getElementById('frictionArrow');
    
    if (!svg || !robot) return;
    
    let robotX = 250;
    let isDragging = false;
    let lastX = robotX;
    let currentMaterial = 'straw';
    
    const materialProperties = {
        'straw': { compliance: 0.95, friction: 0.15, seal: 95, mobility: 90 },
        'foam': { compliance: 0.85, friction: 0.7, seal: 85, mobility: 40 },
        'hard': { compliance: 0.3, friction: 0.4, seal: 35, mobility: 65 },
        'none': { compliance: 0, friction: 0, seal: 5, mobility: 100 }
    };
    
    // Material selection
    materialCards.forEach(card => {
        card.addEventListener('click', function() {
            materialCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            currentMaterial = this.dataset.material;
            updateVisualization();
        });
    });
    
    // Dragging
    robot.style.cursor = 'grab';
    
    robot.addEventListener('mousedown', startDrag);
    robot.addEventListener('touchstart', startDrag);
    
    function startDrag(e) {
        e.preventDefault();
        isDragging = true;
        robot.style.cursor = 'grabbing';
        
        // Show force arrows
        if (appliedForceArrow) appliedForceArrow.style.opacity = '1';
        if (frictionArrow) frictionArrow.style.opacity = '1';
    }
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    
    function drag(e) {
        if (!isDragging) return;
        
        const rect = svg.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        
        const newX = ((clientX - rect.left) / rect.width) * 500;
        
        // Apply friction resistance based on material
        const props = materialProperties[currentMaterial];
        const resistance = props.friction;
        const delta = (newX - lastX) * (1 - resistance * 0.5);
        
        robotX += delta;
        robotX = Math.max(80, Math.min(420, robotX));
        lastX = newX;
        
        updateVisualization();
    }
    
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
    
    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        robot.style.cursor = 'grab';
        
        // Hide force arrows after a delay
        setTimeout(() => {
            if (appliedForceArrow) appliedForceArrow.style.opacity = '0';
            if (frictionArrow) frictionArrow.style.opacity = '0';
        }, 500);
    }
    
    function updateVisualization() {
        const props = materialProperties[currentMaterial];
        
        // Update robot position
        robot.setAttribute('transform', `translate(${robotX}, 180)`);
        
        // Update skirt appearance based on material
        const leftSkirt = skirt?.querySelector('.left');
        const rightSkirt = skirt?.querySelector('.right');
        
        if (leftSkirt && rightSkirt) {
            // Skirt deformation based on compliance
            const deform = props.compliance * 8;
            leftSkirt.setAttribute('d', `M -50 -5 Q ${-50 - deform} 20 -50 ${45 + deform}`);
            rightSkirt.setAttribute('d', `M 50 -5 Q ${50 + deform} 20 50 ${45 + deform}`);
            
            // Skirt color based on type
            const colors = {
                'straw': '#66bb6a',
                'foam': '#ffb74d',
                'hard': '#90a4ae',
                'none': 'transparent'
            };
            leftSkirt.style.stroke = colors[currentMaterial];
            rightSkirt.style.stroke = colors[currentMaterial];
            leftSkirt.style.strokeWidth = currentMaterial === 'none' ? '0' : '8';
            rightSkirt.style.strokeWidth = currentMaterial === 'none' ? '0' : '8';
        }
        
        // Update status bars
        if (sealQualityBar) sealQualityBar.style.width = `${props.seal}%`;
        if (mobilityBar) mobilityBar.style.width = `${props.mobility}%`;
        if (sealQualityValue) sealQualityValue.textContent = `${props.seal}%`;
        if (mobilityValue) mobilityValue.textContent = `${props.mobility}%`;
        
        // Overall score (geometric mean)
        const overall = Math.round(Math.sqrt(props.seal * props.mobility));
        if (overallScore) overallScore.textContent = `${overall}%`;
        
        // Color the bars
        if (sealQualityBar) {
            sealQualityBar.style.background = props.seal > 70 ? '#66bb6a' : props.seal > 40 ? '#ffb74d' : '#ef5350';
        }
        if (mobilityBar) {
            mobilityBar.style.background = props.mobility > 70 ? '#66bb6a' : props.mobility > 40 ? '#ffb74d' : '#ef5350';
        }
    }
    
    // Initial update
    updateVisualization();
}

// ============================================
// PARALLAX EFFECT FOR SECTION BACKGROUNDS
// ============================================
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const sections = document.querySelectorAll('.wave-section');
    
    sections.forEach(section => {
        const rate = scrolled * 0.02;
        // Subtle parallax effect
        // section.style.backgroundPositionY = `${rate}px`;
    });
});
