// Robot Animation System
// Handles all robot drawing animations across sections

document.addEventListener('DOMContentLoaded', () => {
    const ROBOT_SPEED = 0.1; // pixels per millisecond

    class RobotSequence {
        constructor(robotId, containerId, pathFn, align = 'center', onComplete = null) {
            this.robot = document.getElementById(robotId);
            this.container = document.getElementById(containerId);
            if (this.robot) {
                document.body.appendChild(this.robot);
            }
            this.pathFn = pathFn;
            this.align = align;
            this.onComplete = onComplete;
            this.isRunning = false;
            this.pathElement = null;
            this.shouldCleanup = true;
        }

        getDistance(p1, p2) {
            return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        }

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
            let cx = rect.width / 2;
            let cy = rect.height / 2;

            const viewportWidth = window.innerWidth;

            if (this.align === 'left') {
                const targetX = viewportWidth * 0.15;
                cx = targetX - rect.left;
            } else if (this.align === 'right') {
                const targetX = viewportWidth * 0.85;
                cx = targetX - rect.left;
            } else if (typeof this.align === 'number') {
                const targetX = viewportWidth * this.align;
                cx = targetX - rect.left;
            }

            const pathPoints = [];
            const steps = 150;
            for (let i = 0; i <= steps; i++) {
                pathPoints.push(this.pathFn(i / steps));
            }

            const pathTotalLength = this.calculatePathLength(pathPoints);
            const duration = pathTotalLength / ROBOT_SPEED;

            const { path, length } = this.createDrawingPath(pathPoints, cx, cy);
            const startTime = Date.now();

            const frame = () => {
                if (!this.isRunning) return;
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const revealedLength = length * progress;
                const point = path.getPointAtLength(revealedLength);

                this.robot.style.left = point.x + 'px';
                this.robot.style.top = point.y + 'px';
                path.style.strokeDashoffset = length - revealedLength;

                if (progress < 1) {
                    requestAnimationFrame(frame);
                } else {
                    if (this.onComplete) {
                        this.onComplete();
                    }
                    if (this.shouldCleanup) {
                        this.cleanup();
                    } else {
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

    // Path Functions
    const heartPath = (progress) => {
        const scale = 8;
        if (progress < 0.02) {
            const entryProgress = progress / 0.02;
            const t = Math.PI;
            const heartBottomX = 16 * Math.pow(Math.sin(t), 3) * scale;
            const heartBottomY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale;
            const x = -300 + (entryProgress * (300 + heartBottomX));
            const y = heartBottomY;
            return { x, y };
        }
        if (progress < 0.98) {
            const drawProgress = (progress - 0.02) / 0.96;
            const t = Math.PI + (drawProgress * 2 * Math.PI);
            const x = 16 * Math.pow(Math.sin(t), 3) * scale;
            const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale;
            return { x, y };
        }
        const exitProgress = (progress - 0.98) / 0.02;
        const t = Math.PI;
        const heartBottomX = 16 * Math.pow(Math.sin(t), 3) * scale;
        const heartBottomY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale;
        const x = heartBottomX - (exitProgress * (300 + heartBottomX));
        const y = heartBottomY;
        return { x, y };
    };

    const flowerPath = (progress) => {
        const t = progress * 2 * Math.PI;
        const k = 4;
        const scale = 100;
        const r = scale * Math.cos(k * t);
        const x = r * Math.cos(t);
        const y = r * Math.sin(t);
        return { x, y };
    };

    const sunPath = (progress) => {
        const t = progress * 4 * Math.PI;
        const scale = 100;
        const r = scale + 30 * Math.sin(10 * t);
        const x = r * Math.cos(t);
        const y = r * Math.sin(t);
        return { x, y };
    };

    const spiralPath = (progress) => {
        const t = progress * 6 * Math.PI;
        const scale = progress * 150;
        const x = scale * Math.cos(t);
        const y = scale * Math.sin(t);
        return { x, y };
    };

    const starPath = (progress) => {
        const t = progress * 2 * Math.PI - (Math.PI / 2);
        const angle = t;
        const radius = 120 * (1 - 0.4 * Math.sin(angle * 5));
        return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
    };

    const starShapePath = (progress) => {
        const scale = 100;
        if (progress < 0.02) {
            const entryProgress = progress / 0.02;
            const t = -Math.PI / 2;
            const points = 5;
            const innerRadius = 0.4;
            const angle = t * points;
            const radius = scale * (1 - innerRadius * 0.5 * (1 + Math.cos(angle)));
            const startX = radius * Math.cos(t);
            const startY = radius * Math.sin(t);
            const x = 300 - (entryProgress * (300 - startX));
            const y = startY;
            return { x, y };
        }
        if (progress < 0.98) {
            const drawProgress = (progress - 0.02) / 0.96;
            const t = -Math.PI / 2 + (drawProgress * 2 * Math.PI);
            const points = 5;
            const innerRadius = 0.4;
            const angle = t * points;
            const radius = scale * (1 - innerRadius * 0.5 * (1 + Math.cos(angle)));
            const x = radius * Math.cos(t);
            const y = radius * Math.sin(t);
            return { x, y };
        }
        const exitProgress = (progress - 0.98) / 0.02;
        const t = -Math.PI / 2;
        const points = 5;
        const innerRadius = 0.4;
        const angle = t * points;
        const radius = scale * (1 - innerRadius * 0.5 * (1 + Math.cos(angle)));
        const endX = radius * Math.cos(t);
        const endY = radius * Math.sin(t);
        const x = endX + (exitProgress * (300 - endX));
        const y = endY;
        return { x, y };
    };

    // Create robot sequences
    let heartRobot, starRobot;
    let sequenceTimeout = null;

    const startSequence = () => {
        if (heartRobot && !heartRobot.isRunning) {
            heartRobot.shouldCleanup = true;
            heartRobot.animate();
        }
    };

    starRobot = new RobotSequence('robot-intro-star', 'intro', starShapePath, 'right', () => {
        if (heartRobot && heartRobot.pathElement) {
            heartRobot.cleanup();
        }
        sequenceTimeout = setTimeout(startSequence, 3000);
    });

    heartRobot = new RobotSequence('robot-intro', 'intro', heartPath, 'left', () => {
        heartRobot.shouldCleanup = false;
        if (starRobot && !starRobot.isRunning) {
            starRobot.animate();
        }
    });

    const otherRobots = [
        new RobotSequence('robot-design', 'design', flowerPath, 'right'),
        new RobotSequence('robot-features', 'features', sunPath, 0.08), // Position user requested
        new RobotSequence('robot-system', 'system', spiralPath, 'right')
    ].filter(seq => seq.container && seq.robot);

    const robotSequences = [heartRobot, starRobot, ...otherRobots].filter(seq => seq && seq.container && seq.robot);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.target.id === 'intro') {
                // Intro Sequence
                // Only start if not already running (heart or star) and no timeout pending
                const isRunning = (heartRobot && heartRobot.isRunning) ||
                    (starRobot && starRobot.isRunning) ||
                    sequenceTimeout;

                if (entry.isIntersecting && !isRunning) {
                    startSequence();
                }
                // Removed stop logic to allow continuous play
            } else {
                // Other Robots
                const sequence = otherRobots.find(s => s.container === entry.target);
                if (sequence) {
                    if (entry.isIntersecting) {
                        // Only set up interval if not already existing
                        if (!sequence.animationInterval) {
                            if (!sequence.isRunning) {
                                sequence.animate();
                            }
                            sequence.animationInterval = setInterval(() => {
                                sequence.animate();
                            }, 8000);
                        }
                    }
                    // Removed stop logic to allow continuous play
                }
            }
        });
    }, { threshold: 0.2 });

    robotSequences.forEach(sequence => {
        if (sequence && sequence.container) {
            observer.observe(sequence.container);
        }
    });
});
