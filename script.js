document.addEventListener('DOMContentLoaded', function() {
    
    // --- CANVAS WAVE ANIMATION ---
    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    // Configuration
    const spacing = 35; // Distance between dots
    const waveHeight = 100; // Deep wave height
    const speed = 0.005; // Slow, relaxing speed
    
    function initCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        createParticles();
    }
    
    function createParticles() {
        particles = [];
        // Create grid covering bottom 65% of screen
        const cols = Math.floor(width / spacing) + 5;
        const rows = Math.floor((height * 0.65) / spacing) + 5; 
        
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                particles.push({
                    x: i * spacing - 50, 
                    // Generate from bottom up
                    y: height - (j * spacing * 0.6) + 100, 
                    baseY: height - (j * spacing * 0.6) + 100,
                    
                    // --- DIAGONAL OFFSET LOGIC ---
                    // By adding 'i' (x-axis) and 'j' (y-axis) together, we create a diagonal gradient.
                    // When the wave moves, it will follow this gradient from Bottom-Left to Top-Right.
                    offset: i * 0.25 + j * 0.35, 
                    
                    row: j,
                    col: i
                });
            }
        }
    }
    
    let time = 0;
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        time += speed;
        
        // Loop through all particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            // --- DIRECTION CHANGE ---
            // Using (p.offset - time) instead of (time + p.offset)
            // This makes the wave travel in the direction of increasing offset (Top-Right)
            
            // Primary Wave
            const wave1 = Math.sin(p.offset - time) * waveHeight;
            
            // Secondary Wave (Faster & Irregular)
            const wave2 = Math.sin(p.offset * 2.0 - time * 1.5) * (waveHeight * 0.4);
            
            // Combine them
            const waveY = wave1 + wave2;
            
            // Apply new position
            const currentY = p.baseY + waveY;
            
            // Drawing the Dot
            ctx.beginPath();
            
            // --- DEEP OCEAN BUBBLE STYLE ---
            // Opacity fades as particles go higher up the screen
            const alpha = Math.max(0, 0.4 - (p.row * 0.02)); 
            // Size is slightly larger to resemble floating bubbles
            const size = Math.max(0.5, 3.0 - (p.row * 0.1)); 
            
            // Glowing Electric Cyan color
            ctx.fillStyle = `rgba(200, 240, 255, ${alpha})`; 
            ctx.arc(p.x, currentY, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        requestAnimationFrame(animate);
    }
    
    // Initial Setup
    initCanvas();
    animate();
    
    // Resize Handler
    window.addEventListener('resize', () => {
        initCanvas();
    });

    // --- SCROLL SPY & FADE IN LOGIC ---
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach(section => {
        observer.observe(section);
    });

    const navLinks = document.querySelectorAll('nav .nav-links ul li a');
    const allSections = document.querySelectorAll('header, section');

    window.addEventListener('scroll', () => {
        let current = '';
        allSections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 90) {
                current = section.getAttribute('id');
            }
        });
        
        // Handle "About" subsection edge case
        const aboutSection = document.getElementById('about');
        if(aboutSection && aboutSection.classList.contains('is-visible') && pageYOffset < document.getElementById('contact').offsetTop - 90) {
             const projectsSection = document.getElementById('projects');
             if(pageYOffset > projectsSection.offsetTop) {
                 current = 'about';
             }
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
});