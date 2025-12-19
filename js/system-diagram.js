// System Diagram Logic - Vanilla JS

const diagramData = {
    components: {
        impeller: {
            name: 'Impeller',
            color: 'yellow',
            position: { x: 10, y: 30 },
            info: 'Backward curved centrifugal impeller that generates powerful suction to adhere the robot to the window surface. The backward curved blade design maximizes airflow and creates strong negative pressure, ensuring the robot maintains secure contact with the wall with as much force as possible. Connected directly to the brushless motor for reliable suction control.',
            partLink: '',
            image: 'system_diagram_images/impeller.png',
            icon: '🌪️'
        },
        buckConverter: {
            name: 'Buck Converter',
            color: 'red',
            position: { x: 180, y: 580 },
            info: 'DC-DC step-down converter added as a safeguard to ensure no excess voltage reaches sensitive components. Regulates voltage down to safe levels for the motor driver and other parts, preventing damage from voltage spikes or fluctuations. Uses switching regulation to provide stable, reliable power output.',
            partLink: '',
            image: 'system_diagram_images/buck_converter.png',
            icon: '⚡'
        },
        imu: {
            name: 'IMU',
            color: 'blue',
            position: { x: 240, y: 30 },
            info: 'Inertial Measurement Unit containing a 6-axis accelerometer and gyroscope. Provides real-time orientation data that, when paired with LiDAR imaging, allows us to detect where we are on the window and navigate to draw specific shapes.',
            partLink: '',
            image: 'system_diagram_images/IMU.png',
            icon: '🧭'
        },
        servo: {
            name: 'Servo',
            color: 'blue',
            position: { x: 440, y: 30 },
            info: 'Small 9g servo motor with built-in position feedback for accurate angles. Receives PWM control signals from the Nano to actuate the marker mechanism and allow it to go up and down on command to draw.',
            partLink: '',
            image: 'system_diagram_images/Servo.png',
            icon: '🦾'
        },
        marker: {
            name: 'Marker',
            color: 'yellow',
            position: { x: 640, y: 30 },
            info: 'Dry erase marker actuated by the servo motor. Used for drawing on the window surface. The servo raises and lowers the marker to make contact with the glass for drawing.',
            partLink: '',
            image: 'system_diagram_images/marker.png',
            icon: '🖍️'
        },
        wheels: {
            name: 'Wheels',
            color: 'yellow',
            position: { x: 980, y: 30 },
            info: 'Omni wheels configured in a kiwi drive arrangement for omnidirectional movement. Three wheels positioned at 120-degree angles allow the robot to move in any direction and rotate while navigating around the window surface.',
            partLink: '',
            image: 'system_diagram_images/Wheels.png',
            icon: '🛞'
        },
        motor: {
            name: 'Brushless Motor',
            color: 'blue',
            position: { x: 10, y: 200 },
            info: 'Primary brushless motor for the impeller. Provides mechanical power to the impeller for suction. Controlled by the ESC which regulates speed and direction based on PWM input signals.',
            partLink: '',
            image: 'system_diagram_images/motor.png',
            icon: '⚙️'
        },
        esc: {
            name: 'ESC',
            color: 'blue',
            position: { x: 185, y: 200 },
            info: 'Electronic Speed Controller that converts digital commands into precise motor control. Uses PWM signals to regulate motor speed and direction by modulating power delivery. Operates at ~12V from the main power supply.',
            partLink: '',
            image: 'system_diagram_images/ESC.png',
            icon: '🎛️'
        },
        nano: {
            name: 'Nano',
            color: 'green',
            position: { x: 380, y: 200 },
            info: 'Arduino Nano microcontroller serving as the central low-level control unit for the robot. Processes real-time sensor data from the IMU and executes control algorithms for motor coordination. Sends PWM commands to the ESC, servo, and motor driver while receiving instructions from the RaspPi.',
            partLink: '',
            image: 'system_diagram_images/Nano.png',
            icon: '📟'
        },
        motorDriver: {
            name: 'Motor Driver',
            color: 'blue',
            position: { x: 700, y: 200 },
            info: 'H-Bridge motor driver IC for bidirectional control of secondary motors. Receives digital commands from Nano and PWM signals for speed control. Powered by 12V from buck converter, capable of handling high current loads for motor operation.',
            partLink: '',
            image: 'system_diagram_images/Motor_driver.png',
            icon: '🔌'
        },
        motors: {
            name: 'DC Motors',
            color: 'blue',
            position: { x: 980, y: 200 },
            info: 'Small 12V DC motors that drive the omni wheels in the kiwi drive configuration. Each motor is controlled via PWM signals from the motor driver, allowing speed and direction control. By varying the PWM duty cycle, the motors can be independently controlled to achieve omnidirectional movement, enabling the robot to navigate smoothly across the window surface in any direction.',
            partLink: '',
            image: 'system_diagram_images/motors.png',
            icon: '🔋'
        },
        power: {
            name: 'Power Module',
            color: 'red',
            position: { x: 180, y: 360 },
            info: 'Central power distribution module that provides 12V to the entire system. Manages battery voltage output and ensures adequate current is supplied to all components.',
            partLink: '',
            image: 'system_diagram_images/power_module.png',
            icon: '🔋'
        },
        raspi: {
            name: 'RaspPi',
            color: 'green',
            position: { x: 380, y: 360 },
            info: 'Raspberry Pi single-board computer running Linux. Handles high-level processing including path planning and decision making. Processes LiDAR data for 2D mapping and IMU data for orientation tracking. Sends sensor data to the external computer and receives teleoperation commands, then relays mission instructions to the Nano for execution.',
            partLink: '',
            image: 'system_diagram_images/Raspi.png',
            icon: '🥧'
        },
        computer: {
            name: 'Computer',
            color: 'red',
            position: { x: 580, y: 360 },
            info: 'External computer for remote monitoring, teleoperation, and control interface. Receives real-time IMU and LiDAR sensor data from the RaspPi over the network. Sends teleoperation commands back to the RaspPi to control the robot remotely. Used for mission planning, debugging, and manual control of drawing operations.',
            partLink: '',
            image: 'system_diagram_images/computer.png',
            icon: '💻'
        },
        lidar: {
            name: 'LiDAR',
            color: 'blue',
            position: { x: 380, y: 580 },
            info: 'Light Detection and Ranging sensor positioned in the docking station. Provides 2D vision to track where the robot is physically located on the wall. Uses laser pulses to create a 2D map of the robot\'s position, enabling precise navigation and localization for drawing operations.',
            partLink: '',
            image: 'system_diagram_images/Lidar.png',
            icon: '📡'
        }
    },

    connections: [
        // Mechanical connections
        { id: 'motor-impeller', coords: { x1: 70, y1: 200, x2: 70, y2: 130 }, label: 'Kinetic', color: '#FFA500', type: 'mechanical', desc: 'Mechanical rotational energy transferred from motor to impeller blades' },
        { id: 'motors-wheels', coords: { x1: 1040, y1: 200, x2: 1040, y2: 130 }, label: 'Kinetic', color: '#FFA500', type: 'mechanical', desc: 'Mechanical energy drives wheels for locomotion' },
        { id: 'servo-marker', coords: { x1: 560, y1: 100, x2: 640, y2: 100 }, label: 'Kinetic', color: '#FFA500', type: 'mechanical', desc: 'Mechanical actuation energy to operate marking mechanism' },

        // Power connections (black)
        { id: 'power-buck', coords: { x1: 240, y1: 460, x2: 240, y2: 580 }, label: '12V/20A', color: '#000000', type: 'electrical', desc: 'Raw battery voltage fed to buck converter for regulation' },
        { id: 'power-esc', coords: { x1: 250, y1: 360, x2: 250, y2: 300 }, label: '12V/20A', color: '#000000', type: 'electrical', desc: 'High-current 12V 20A power supply for motor ESC' },
        { id: 'power-raspi', coords: { x1: 300, y1: 400, x2: 380, y2: 400 }, label: '5V/3A', color: '#000000', type: 'electrical', desc: 'Regulated power supply for Raspberry Pi operation' },
        { id: 'buck-driver', path: 'M 240 680 L 240 720 L 760 720 L 760 300', label: '12V/3A', color: '#000000', type: 'electrical', desc: 'Stepped-down DC voltage to power motor driver circuitry' },
        { id: 'raspi-lidar-power', coords: { x1: 430, y1: 460, x2: 430, y2: 580 }, label: '5V/100mA', color: '#000000', type: 'electrical', desc: '5V/~100mA power supply to LiDAR sensor' },
        { id: 'driver-nano-power', coords: { x1: 700, y1: 250, x2: 500, y2: 250 }, label: '12V/50mA', color: '#000000', type: 'electrical', desc: '12V/50mA power from motor driver to Nano' },
        { id: 'nano-imu-power', coords: { x1: 460, y1: 240, x2: 315, y2: 130 }, label: '5V/3.9mA', color: '#000000', type: 'electrical', desc: '5V/3.9mA power supply to IMU sensor' },

        // Data connections - Commands TO devices (blue)
        { id: 'nano-servo', coords: { x1: 450, y1: 200, x2: 500, y2: 130 }, label: 'Commands', color: '#0000FF', type: 'digital', desc: 'PWM control signals for servo positioning' },
        { id: 'nano-esc', coords: { x1: 380, y1: 235, x2: 305, y2: 235 }, label: 'Commands', color: '#0000FF', type: 'digital', desc: 'Digital control signals from Nano to ESC' },
        { id: 'nano-driver', coords: { x1: 500, y1: 235, x2: 700, y2: 235 }, label: 'Commands', color: '#0000FF', type: 'digital', desc: 'Digital commands for motor control' },
        { id: 'raspi-nano', coords: { x1: 430, y1: 360, x2: 430, y2: 300 }, label: 'Commands', color: '#0000FF', type: 'digital', desc: 'High-level control instructions via serial' },
        { id: 'raspi-computer', coords: { x1: 500, y1: 395, x2: 580, y2: 395 }, label: 'IMU & LiDAR Data', color: '#0000FF', type: 'digital', desc: 'Sensor data from IMU and LiDAR sent to computer' },

        // Data connections - Sensor data FROM devices (blue, return arrows)
        { id: 'imu-nano-data', coords: { x1: 300, y1: 135, x2: 390, y2: 205 }, label: 'Sensor Data', color: '#0000FF', type: 'digital', desc: 'IMU orientation and acceleration data to Nano' },
        { id: 'nano-raspi-imu', coords: { x1: 445, y1: 300, x2: 445, y2: 360 }, label: 'IMU Data', color: '#0000FF', type: 'digital', desc: 'IMU sensor data forwarded from Nano to RaspPi for transmission to computer' },
        { id: 'lidar-raspi-data', coords: { x1: 450, y1: 580, x2: 450, y2: 460 }, label: 'Sensor Data', color: '#0000FF', type: 'digital', desc: 'LiDAR distance measurements to RaspPi' },
        { id: 'computer-raspi', coords: { x1: 580, y1: 415, x2: 500, y2: 415 }, label: 'TeleOp (Network)', color: '#0000FF', type: 'digital', desc: 'Teleoperation inputs sent through network to RaspPi' },

        // Analog/PWM connections (purple)
        { id: 'esc-motor', coords: { x1: 185, y1: 245, x2: 130, y2: 245 }, label: 'PWM', color: '#800080', type: 'analog', desc: 'PWM signal from ESC to motor' },
        { id: 'driver-motors', coords: { x1: 820, y1: 235, x2: 980, y2: 235 }, label: 'PWM', color: '#0000FF', type: 'digital', desc: 'PWM signals drive motors with variable speed' },
        { id: 'driver-motors-power', coords: { x1: 820, y1: 245, x2: 980, y2: 245 }, label: '12V/0.8A', color: '#000000', type: 'electrical', desc: '12V/~0.8A power supply to DC motors' },
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
                    <img src="${comp.image}" alt="${comp.name}" class="sys-comp-img">
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
            <h4 style="margin-bottom:0.5rem; color:${this.getColorHex(comp.color)}; font-size:1.2rem;">${comp.name}</h4>
            <p class="tooltip-desc">${comp.info}</p>
        `;

        this.tooltip.classList.add('visible');

        // Position relative to component
        const rect = targetEl.getBoundingClientRect();
        const wrapperRect = this.wrapper.getBoundingClientRect();

        const tooltipHeight = this.tooltip.offsetHeight;
        let top = rect.top - wrapperRect.top - tooltipHeight - 10;

        // If not enough space above, place below
        if (top < 10) {
            top = rect.bottom - wrapperRect.top + 10;
        }
        let left = rect.left - wrapperRect.left + (rect.width / 2) - 150; // Center 300px tooltip

        // Boundary checks
        if (left < 10) left = 10;
        if (left + 300 > 1040) left = 1040 - 300;

        this.tooltip.style.top = `${top}px`;
        this.tooltip.style.left = `${left}px`;
    }

    showConnectionTooltip(conn, event) {
        const titleColor = conn.type === 'digital' ? 'white' : (conn.type === 'electrical' ? '#999999' : conn.color);
        this.tooltip.innerHTML = `
            <h4 style="margin-bottom:0.5rem; color:${titleColor}; font-size:1.2rem;">${conn.label}</h4>
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
