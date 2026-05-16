
function initGreeter() {
    // Create floating particles
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        let elem = document.getElementById('particles');
        if (elem) {
            elem.appendChild(particle);

            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 25000);
        }
    }

    // Create particles periodically
    setInterval(createParticle, 800);

    // Initial particles
    for (let i = 0; i < 10; i++) {
        setTimeout(createParticle, i * 100);
    }

    // Add mouse interaction
    const title = document.querySelector('.title');
    if (title) {
        document.addEventListener('mousemove', (e) => {
            const rect = title.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateX = y / rect.height * 10;
            const rotateY = -x / rect.width * 10;

            title.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        // Reset title rotation when mouse leaves
        document.addEventListener('mouseleave', () => {
            const title = document.querySelector('.title');
            title.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    }
}
