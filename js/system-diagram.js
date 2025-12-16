// System Diagram Logic - Vanilla JS

const diagramData = {
    components: {
        impeller: {
            name: 'Impeller',
            color: 'yellow',
            position: { x: 10, y: 50 },
            info: 'Propulsion system component that generates thrust for movement. The impeller uses rotating blades to create water flow, providing forward and reverse thrust capabilities. Connected directly to the main motor for primary propulsion control.',
            partLink: '',
            icon: '🌪️'
        },
        buckConverter: {
            name: 'Buck Converter',
            color: 'red',
            position: { x: 180, y: 540 },
            info: 'DC-DC step-down converter that efficiently reduces voltage from 14.4V battery level to 12V required by the motor driver. Uses switching regulation to minimize power loss and heat generation while providing stable voltage output.',
            partLink: '',
            icon: '⚡'
        },
        imu: {
            name: 'IMU',
            color: 'blue',
            position: { x: 220, y: 50 },
            info: 'Inertial Measurement Unit containing 3-axis accelerometer and gyroscope. Provides real-time orientation, angular velocity, and acceleration data to the Nano for stability control and navigation. Communicates via I2C or SPI protocol.',
            partLink: '',
            icon: '🧭'
        },
        servo: {
            name: 'Servo',
            color: 'blue',
            position: { x: 400, y: 50 },
            info: 'Precision servo motor with built-in position feedback for accurate angular control. Receives PWM control signals from the Nano to actuate the marker mechanism. Typically operates at 5V with adjustable positioning from 0-180 degrees.',
            partLink: '',
            icon: '🦾'
        },
        marker: {
            name: 'Marker',
            color: 'yellow',
            position: { x: 580, y: 50 },
            info: 'Marking mechanism actuated by the servo motor. Used for identification, tracking, or dropping markers at specific locations. The servo provides the mechanical force needed to deploy or activate the marking system.',
            partLink: '',
            icon: '🖍️'
        },
        wheels: {
            name: 'Wheels',
            color: 'yellow',
            position: { x: 880, y: 50 },
            info: 'Wheel assembly for ground-based locomotion and mobility. Mechanically coupled to the secondary motors for omnidirectional or differential drive movement. Provides traction and steering capabilities on solid surfaces.',
            partLink: '',
            icon: '🛞'
        },
        motor: {
            name: 'Motor',
            color: 'blue',
            position: { x: 10, y: 200 },
            info: 'Primary brushless DC motor for main propulsion. Provides mechanical power to the impeller for thrust generation. Controlled by the ESC which regulates speed and direction based on PWM input signals.',
            partLink: '',
            icon: '⚙️'
        },
        esc: {
            name: 'ESC',
            color: 'blue',
            position: { x: 185, y: 200 },
            info: 'Electronic Speed Controller that converts digital commands into precise motor control. Uses PWM signals to regulate motor speed and direction by modulating power delivery. Operates at ~14V from the main power supply.',
            partLink: '',
            icon: '🎛️'
        },
        nano: {
            name: 'Nano',
            color: 'green',
            position: { x: 380, y: 200 },
            info: 'Arduino Nano microcontroller serving as the central control unit. Processes sensor data from the IMU, executes control algorithms, and manages communication with the RaspPi. Sends commands to ESC, servo, and motor driver for coordinated system operation.',
            partLink: '',
            icon: '📟'
        },
        motorDriver: {
            name: 'Motor Driver',
            color: 'blue',
            position: { x: 700, y: 200 },
            info: 'H-Bridge motor driver IC for bidirectional control of secondary motors. Receives digital commands from Nano and PWM signals for speed control. Powered by 12V from buck converter, capable of handling high current loads for motor operation.',
            partLink: '',
            icon: '🔌'
        },
        motors: {
            name: 'Motors',
            color: 'blue',
            position: { x: 880, y: 200 },
            info: 'Secondary motor array for auxiliary mechanical systems and wheel drive. Receives PWM control signals from the motor driver at 12V. Used for ground locomotion, steering, or other motorized functions independent of the main propulsion system.',
            partLink: '',
            icon: '🔋'
        },
        power: {
            name: 'Power Module',
            color: 'red',
            position: { x: 180, y: 360 },
            info: 'Central power distribution module managing battery voltage output. Provides regulated 5V for Raspberry Pi and Arduino Nano, and raw 14.4V for ESC and buck converter. Includes protection circuits for overcurrent and reverse polarity.',
            partLink: '',
            icon: '🔋'
        },
        raspi: {
            name: 'RaspPi',
            color: 'green',
            position: { x: 380, y: 360 },
            info: 'Raspberry Pi single-board computer running Linux. Handles high-level processing including computer vision, path planning, and decision making. Processes LiDAR data for mapping, streams video to external computer, and sends mission commands to Nano.',
            partLink: '',
            icon: '🥧'
        },
        computer: {
            name: 'Computer',
            color: 'red',
            position: { x: 580, y: 360 },
            info: 'External computer for remote monitoring, development, and control interface. Receives real-time video stream and telemetry data from RaspPi. Used for mission planning, debugging, and manual override capabilities via network connection.',
            partLink: '',
            icon: '💻'
        },
        lidar: {
            name: 'LiDAR',
            color: 'blue',
            position: { x: 380, y: 540 },
            info: 'Light Detection and Ranging sensor using laser pulses to measure distances. Creates 2D or 3D maps of the environment for obstacle detection and navigation. Communicates with RaspPi via serial interface, providing real-time distance measurements up to several meters.',
            partLink: '',
            icon: '📡'
        }
    },

    connections: [
        { id: 'motor-impeller', from: 'impeller', to: 'impeller-top', coords: { x1: 70, y1: 200, x2: 70, y2: 150 }, label: 'Kinetic', color: '#FFA500', type: 'mechanical', desc: 'Mechanical rotational energy transferred from motor to impeller blades' },
        { id: 'motors-wheels', coords: { x1: 940, y1: 200, x2: 940, y2: 150 }, label: 'Kinetic', color: '#FFA500', type: 'mechanical', desc: 'Mechanical energy drives wheels for locomotion' },
        { id: 'buck-driver', path: 'M 240 640 L 240 680 L 760 680 L 760 300', label: '12V', color: '#000000', type: 'electrical', desc: 'Stepped-down DC voltage to power motor driver circuitry' },
        { id: 'power-buck', coords: { x1: 240, y1: 460, x2: 240, y2: 540 }, label: '14.4V', color: '#000000', type: 'electrical', desc: 'Raw battery voltage fed to buck converter for regulation' },
        { id: 'imu-nano', coords: { x1: 280, y1: 150, x2: 380, y2: 200 }, label: 'Sensor data (1.3V)', color: '#0000FF', type: 'digital', startArrow: true, desc: 'Bidirectional I2C/SPI communication for orientation and acceleration data' },
        { id: 'servo-nano', coords: { x1: 440, y1: 150, x2: 440, y2: 200 }, label: 'Commands (5V)', color: '#0000FF', type: 'digital', desc: 'PWM control signals for servo positioning' },
        { id: 'servo-marker', coords: { x1: 520, y1: 100, x2: 580, y2: 100 }, label: 'Kinetic', color: '#FFA500', type: 'mechanical', desc: 'Mechanical actuation energy to operate marking mechanism' },
        { id: 'motor-esc', coords: { x1: 130, y1: 240, x2: 185, y2: 240 }, label: 'PWM (~14V)', color: '#800080', type: 'analog', desc: 'Pulse-width modulated analog signal controls motor speed and direction' },
        { id: 'esc-nano', coords: { x1: 305, y1: 240, x2: 380, y2: 240 }, label: 'Commands', color: '#0000FF', type: 'digital', desc: 'Digital control signals for ESC operation' },
        { id: 'nano-driver', coords: { x1: 500, y1: 240, x2: 700, y2: 240 }, label: 'Commands (5V)', color: '#0000FF', type: 'digital', startArrow: true, desc: 'Bidirectional digital communication for motor control and feedback' },
        { id: 'driver-motors', coords: { x1: 820, y1: 240, x2: 880, y2: 240 }, label: 'PWM (12V)', color: '#800080', type: 'analog', desc: 'High-current PWM signals drive motors with variable speed control' },
        { id: 'power-raspi', coords: { x1: 300, y1: 400, x2: 380, y2: 400 }, label: '5V', color: '#000000', type: 'electrical', desc: 'Regulated power supply for Raspberry Pi operation' },
        { id: 'raspi-nano', coords: { x1: 440, y1: 360, x2: 440, y2: 300 }, label: 'Commands', color: '#0000FF', type: 'digital', desc: 'Serial/UART communication for high-level control instructions' },
        { id: 'raspi-computer', coords: { x1: 500, y1: 400, x2: 580, y2: 400 }, label: 'Image', color: '#0000FF', type: 'digital', desc: 'Video stream and telemetry data over network connection' },
        { id: 'lidar-raspi', coords: { x1: 440, y1: 540, x2: 440, y2: 460 }, label: 'Sensor data (5V)', color: '#0000FF', type: 'digital', startArrow: true, desc: 'Bidirectional serial communication for distance measurements and mapping' },
        { id: 'power-esc', coords: { x1: 240, y1: 360, x2: 240, y2: 300 }, label: '14.4V', color: '#000000', type: 'electrical', desc: 'High-current power supply for motor ESC' },
    ]
};

class SystemDiagram {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.init();
    }

    init() {
        // Create inner wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.id = 'diagram-inner';
        this.container.appendChild(this.wrapper);

        // SVG Layer
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.classList.add('diagram-svg-layer');
        // Define Arrowhead
        this.svg.innerHTML = `
            <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#666" />
                </marker>
                <marker id="arrowhead-reverse" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto">
                    <polygon points="8 0, 0 3, 8 6" fill="#666" />
                </marker>
            </defs>
        `;
        this.wrapper.appendChild(this.svg);

        // Container for Components
        this.compContainer = document.createElement('div');
        this.compContainer.style.position = 'absolute';
        this.compContainer.style.top = '0';
        this.compContainer.style.left = '0';
        this.compContainer.style.width = '100%';
        this.compContainer.style.height = '100%';
        this.compContainer.style.zIndex = '10';
        this.compContainer.style.pointerEvents = 'none'; // Allow clicks to pass through to SVG
        this.wrapper.appendChild(this.compContainer);

        // Tooltip Container
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'diagram-tooltip';
        this.wrapper.appendChild(this.tooltip);

        this.renderComponents();
        this.renderConnections();
        this.renderLegend();
    }

    renderComponents() {
        Object.entries(diagramData.components).forEach(([key, comp]) => {
            const el = document.createElement('div');
            el.className = `sys-component color-${comp.color}`;
            el.style.left = `${comp.position.x}px`;
            el.style.top = `${comp.position.y}px`;

            el.innerHTML = `
                <div class="sys-comp-box">
                    <div class="sys-comp-icon">${comp.icon || '📦'}</div>
                    <div class="sys-comp-label">${comp.name}</div>
                </div>
            `;

            // Hover Events
            el.addEventListener('mouseenter', () => this.showTooltip(comp, el));
            el.addEventListener('mouseleave', () => this.hideTooltip());

            this.compContainer.appendChild(el);
        });
    }

    renderConnections() {
        diagramData.connections.forEach(conn => {
            // Create invisible wide hit area
            let hitArea;
            if (conn.path) {
                hitArea = document.createElementNS("http://www.w3.org/2000/svg", "path");
                hitArea.setAttribute('d', conn.path);
                hitArea.setAttribute('fill', 'none');
            } else {
                hitArea = document.createElementNS("http://www.w3.org/2000/svg", "line");
                hitArea.setAttribute('x1', conn.coords.x1);
                hitArea.setAttribute('y1', conn.coords.y1);
                hitArea.setAttribute('x2', conn.coords.x2);
                hitArea.setAttribute('y2', conn.coords.y2);
            }
            hitArea.setAttribute('stroke', 'transparent');
            hitArea.classList.add('connection-line');

            // Create visible narrow line
            let visibleLine;
            if (conn.path) {
                visibleLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
                visibleLine.setAttribute('d', conn.path);
                visibleLine.setAttribute('fill', 'none');
            } else {
                visibleLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
                visibleLine.setAttribute('x1', conn.coords.x1);
                visibleLine.setAttribute('y1', conn.coords.y1);
                visibleLine.setAttribute('x2', conn.coords.x2);
                visibleLine.setAttribute('y2', conn.coords.y2);
            }
            visibleLine.setAttribute('stroke', conn.color);
            visibleLine.setAttribute('marker-end', 'url(#arrowhead)');
            if (conn.startArrow) {
                visibleLine.setAttribute('marker-start', 'url(#arrowhead-reverse)');
            }
            visibleLine.classList.add('connection-visible');

            // Hover events on hit area only
            hitArea.addEventListener('mouseenter', (e) => {
                this.showConnectionTooltip(conn, e);
                visibleLine.style.filter = 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.3))';
            });
            hitArea.addEventListener('mousemove', (e) => this.moveConnectionTooltip(e));
            hitArea.addEventListener('mouseleave', () => {
                this.hideTooltip();
                visibleLine.style.filter = '';
            });

            this.svg.appendChild(hitArea);
            this.svg.appendChild(visibleLine);
        });
    }

    renderLegend() {
        const legend = document.createElement('div');
        legend.className = 'diagram-legend';
        legend.innerHTML = `
            <div class="legend-item"><div class="legend-color" style="background:#000"></div> Electrical</div>
            <div class="legend-item"><div class="legend-color" style="background:#FFA500"></div> Mechanical</div>
            <div class="legend-item"><div class="legend-color" style="background:#0000FF"></div> Digital Data</div>
            <div class="legend-item"><div class="legend-color" style="background:#800080"></div> Analog Data</div>
        `;
        this.wrapper.appendChild(legend);
    }

    showTooltip(comp, targetEl) {
        this.tooltip.innerHTML = `
            <h4 style="margin-bottom:0.5rem; color:${this.getColorHex(comp.color)}; font-family:'Permanent Marker'">${comp.name}</h4>
            <p class="tooltip-desc">${comp.info}</p>
            <input type="text" class="tooltip-input" placeholder="Part link..." value="${comp.partLink}" onclick="event.stopPropagation()">
        `;

        this.tooltip.classList.add('visible');

        // Position relative to component
        const rect = targetEl.getBoundingClientRect();
        const wrapperRect = this.wrapper.getBoundingClientRect();

        let top = rect.bottom - wrapperRect.top + 10;
        let left = rect.left - wrapperRect.left + (rect.width / 2) - 150; // Center 300px tooltip

        // Boundary checks
        if (left < 10) left = 10;
        if (left + 300 > 1040) left = 1040 - 300;

        this.tooltip.style.top = `${top}px`;
        this.tooltip.style.left = `${left}px`;
    }

    showConnectionTooltip(conn, event) {
        this.tooltip.innerHTML = `
            <h4 style="margin-bottom:0.5rem; color:${conn.color}; font-family:'Permanent Marker'">${conn.label}</h4>
            <p class="tooltip-desc">${conn.desc}</p>
        `;
        this.tooltip.classList.add('visible');
        this.moveConnectionTooltip(event);
    }

    moveConnectionTooltip(event) {
        const wrapperRect = this.wrapper.getBoundingClientRect();
        const top = event.clientY - wrapperRect.top - 100; // Above mouse
        const left = event.clientX - wrapperRect.left - 150; // Center

        this.tooltip.style.top = `${top}px`;
        this.tooltip.style.left = `${left}px`;
    }

    hideTooltip() {
        this.tooltip.classList.remove('visible');
    }

    getColorHex(colorName) {
        const colors = {
            'yellow': '#fab005',
            'red': '#fa5252',
            'blue': '#4dabf7',
            'green': '#40c057',
            'purple': '#be4bdb'
        };
        return colors[colorName] || 'white';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SystemDiagram('system-diagram-container');
});
