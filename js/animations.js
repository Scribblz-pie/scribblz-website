// Animation keyframes and utilities
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
