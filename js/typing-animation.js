// Enhanced typing animation for the hero section
class TypingAnimation {
    constructor() {
        this.initTypewriter();
        this.initTerminalAnimation();
        this.initCodeEditorAnimation();
    }

    initTypewriter() {
        const typewriterElement = document.querySelector('.typewriter');
        if (!typewriterElement) return;

        const texts = [
            'A passionate +2 student exploring web development',
            'Building the future with code, one line at a time',
            'Learning HTML, CSS, JavaScript and beyond',
            'Turning ideas into interactive digital experiences'
        ];

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;

        const typeSpeed = 100;
        const deleteSpeed = 50;
        const pauseTime = 2000;

        function type() {
            const currentText = texts[textIndex];
            
            if (!isDeleting && charIndex < currentText.length) {
                // Typing
                typewriterElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                setTimeout(type, typeSpeed);
            } else if (isDeleting && charIndex > 0) {
                // Deleting
                typewriterElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                setTimeout(type, deleteSpeed);
            } else if (!isDeleting && charIndex === currentText.length) {
                // Pause before deleting
                isPaused = true;
                setTimeout(() => {
                    isPaused = false;
                    isDeleting = true;
                    type();
                }, pauseTime);
            } else if (isDeleting && charIndex === 0) {
                // Move to next text
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, typeSpeed);
            }
        }

        // Start typing animation
        setTimeout(type, 1000);
    }

    initTerminalAnimation() {
        const terminalLines = document.querySelectorAll('.terminal-line');
        
        terminalLines.forEach((line, index) => {
            const text = line.textContent;
            line.textContent = '';
            
            setTimeout(() => {
                this.typeText(line, text, 50);
            }, (index + 1) * 1000);
        });
    }

    initCodeEditorAnimation() {
        const codeLines = document.querySelectorAll('.code-line');
        
        codeLines.forEach((line, index) => {
            const text = line.innerHTML;
            line.innerHTML = '';
            
            setTimeout(() => {
                this.typeHTML(line, text, 80);
            }, (index + 2) * 1000);
        });
    }

    typeText(element, text, speed) {
        let i = 0;
        const timer = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            if (i >= text.length) {
                clearInterval(timer);
            }
        }, speed);
    }

    typeHTML(element, html, speed) {
        let i = 0;
        const timer = setInterval(() => {
            element.innerHTML = html.substring(0, i);
            i++;
            if (i > html.length) {
                clearInterval(timer);
            }
        }, speed);
    }
}

// Initialize typing animations
document.addEventListener('DOMContentLoaded', () => {
    new TypingAnimation();
});