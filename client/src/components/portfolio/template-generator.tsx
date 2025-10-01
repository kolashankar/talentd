
import { useState } from "react";
import { PortfolioTemplate } from "./template-selector";

interface TemplateGeneratorProps {
  template: PortfolioTemplate;
  portfolioData: any;
  onGenerated: (code: { html: string; css: string; js: string }) => void;
}

const generateGlassMorphismTemplate = (data: any) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} - Portfolio</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            overflow-x: hidden;
        }

        .glass {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
        }

        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            position: relative;
        }

        .hero-content {
            text-align: center;
            color: white;
            z-index: 2;
        }

        .profile-img {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            object-fit: cover;
            margin: 0 auto 2rem;
            border: 4px solid rgba(255, 255, 255, 0.3);
            animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }

        .name {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .title {
            font-size: 1.5rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }

        .bio {
            font-size: 1.1rem;
            max-width: 600px;
            margin: 0 auto 3rem;
            line-height: 1.6;
            opacity: 0.8;
        }

        .skills-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1rem;
            margin: 3rem 0;
        }

        .skill {
            padding: 0.5rem 1.5rem;
            border-radius: 25px;
            font-size: 0.9rem;
            font-weight: 500;
            transition: all 0.3s ease;
            transform: translateY(0);
        }

        .skill:hover {
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        .projects {
            padding: 5rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }

        .section-title {
            text-align: center;
            font-size: 2.5rem;
            color: white;
            margin-bottom: 3rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
        }

        .project-card {
            padding: 2rem;
            transition: all 0.3s ease;
            transform: translateY(0);
        }

        .project-card:hover {
            transform: translateY(-10px) rotateY(5deg);
        }

        .project-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: white;
            margin-bottom: 1rem;
        }

        .project-desc {
            color: rgba(255,255,255,0.8);
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }

        .project-tech {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
        }

        .tech-tag {
            padding: 0.3rem 0.8rem;
            background: rgba(255,255,255,0.2);
            border-radius: 15px;
            font-size: 0.8rem;
            color: white;
        }

        .project-links {
            display: flex;
            gap: 1rem;
        }

        .btn {
            padding: 0.7rem 1.5rem;
            border: none;
            border-radius: 25px;
            background: rgba(255,255,255,0.2);
            color: white;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .btn:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }

        .floating-elements {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }

        .floating-shape {
            position: absolute;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            animation: floatRandom 15s infinite linear;
        }

        @keyframes floatRandom {
            0% { transform: translateY(100vh) rotate(0deg); }
            100% { transform: translateY(-100px) rotate(360deg); }
        }

        .contact {
            padding: 5rem 2rem;
            text-align: center;
        }

        .contact-info {
            max-width: 600px;
            margin: 0 auto;
            padding: 3rem;
            color: white;
        }

        .social-links {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 2rem;
        }

        .social-link {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .social-link:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-5px) scale(1.1);
        }

        @media (max-width: 768px) {
            .name { font-size: 2rem; }
            .title { font-size: 1.2rem; }
            .projects-grid { grid-template-columns: 1fr; }
            .social-links { gap: 1rem; }
        }
    </style>
</head>
<body>
    <div class="floating-elements" id="floatingElements"></div>
    
    <section class="hero">
        <div class="hero-content">
            ${data.profileImage ? `<img src="${data.profileImage}" alt="${data.name}" class="profile-img">` : ''}
            <h1 class="name">${data.name}</h1>
            <p class="title">${data.title}</p>
            <p class="bio">${data.bio}</p>
            
            ${data.skills && data.skills.length > 0 ? `
            <div class="skills-container">
                ${data.skills.map((skill: string) => 
                    `<span class="skill glass">${skill}</span>`
                ).join('')}
            </div>
            ` : ''}
        </div>
    </section>

    ${data.projects && data.projects.length > 0 ? `
    <section class="projects">
        <h2 class="section-title">Featured Projects</h2>
        <div class="projects-grid">
            ${data.projects.map((project: any) => `
                <div class="project-card glass">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-desc">${project.description}</p>
                    ${project.technologies && project.technologies.length > 0 ? `
                    <div class="project-tech">
                        ${project.technologies.map((tech: string) => 
                            `<span class="tech-tag">${tech}</span>`
                        ).join('')}
                    </div>
                    ` : ''}
                    <div class="project-links">
                        ${project.demoUrl ? `<a href="${project.demoUrl}" class="btn" target="_blank">View Demo</a>` : ''}
                        ${project.githubUrl ? `<a href="${project.githubUrl}" class="btn" target="_blank">View Code</a>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    </section>
    ` : ''}

    <section class="contact">
        <div class="contact-info glass">
            <h2 class="section-title">Get In Touch</h2>
            <p>Feel free to reach out for collaborations or just a friendly hello!</p>
            <div class="social-links">
                ${data.email ? `<a href="mailto:${data.email}" class="social-link">📧</a>` : ''}
                ${data.linkedin ? `<a href="${data.linkedin}" class="social-link" target="_blank">💼</a>` : ''}
                ${data.github ? `<a href="${data.github}" class="social-link" target="_blank">💻</a>` : ''}
                ${data.website ? `<a href="${data.website}" class="social-link" target="_blank">🌐</a>` : ''}
            </div>
        </div>
    </section>

    <script>
        // Create floating elements
        function createFloatingElements() {
            const container = document.getElementById('floatingElements');
            for (let i = 0; i < 20; i++) {
                const element = document.createElement('div');
                element.className = 'floating-shape';
                element.style.left = Math.random() * 100 + '%';
                element.style.width = (Math.random() * 60 + 20) + 'px';
                element.style.height = element.style.width;
                element.style.animationDelay = Math.random() * 15 + 's';
                element.style.animationDuration = (Math.random() * 10 + 10) + 's';
                container.appendChild(element);
            }
        }

        // Initialize
        createFloatingElements();

        // Add scroll animations
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.hero-content');
            if (parallax) {
                parallax.style.transform = \`translateY(\${scrolled * 0.5}px)\`;
            }
        });

        // Add hover effects to project cards
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) rotateY(5deg) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) rotateY(0deg) scale(1)';
            });
        });
    </script>
</body>
</html>`;

    return { html, css: '', js: '' };
  };

  const generateCyberNeonTemplate = (data: any) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} - Cyber Portfolio</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Orbitron', monospace;
            background: #0a0a0a;
            color: #00ff41;
            overflow-x: hidden;
            position: relative;
        }

        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 80%, #00ff4119 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, #ff00d419 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, #00d4ff19 0%, transparent 50%);
            pointer-events: none;
            z-index: -1;
        }

        .matrix-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -2;
        }

        .neon-text {
            text-shadow: 
                0 0 5px currentColor,
                0 0 10px currentColor,
                0 0 15px currentColor,
                0 0 20px currentColor;
        }

        .cyber-border {
            border: 2px solid #00ff41;
            border-image: linear-gradient(45deg, #00ff41, #ff00d4, #00d4ff, #00ff41) 1;
            position: relative;
            background: rgba(0, 255, 65, 0.05);
        }

        .cyber-border::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, #00ff41, #ff00d4, #00d4ff, #00ff41);
            border-radius: inherit;
            z-index: -1;
            animation: borderGlow 2s linear infinite;
        }

        @keyframes borderGlow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            position: relative;
        }

        .hero-content {
            text-align: center;
            z-index: 2;
        }

        .profile-container {
            position: relative;
            margin: 0 auto 3rem;
            width: 200px;
            height: 200px;
        }

        .profile-img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #00ff41;
            animation: profileSpin 10s linear infinite;
        }

        @keyframes profileSpin {
            0% { transform: rotate(0deg); filter: hue-rotate(0deg); }
            100% { transform: rotate(360deg); filter: hue-rotate(360deg); }
        }

        .name {
            font-size: 4rem;
            font-weight: 900;
            margin-bottom: 1rem;
            background: linear-gradient(45deg, #00ff41, #ff00d4, #00d4ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: textGlow 2s ease-in-out infinite alternate;
        }

        @keyframes textGlow {
            from { text-shadow: 0 0 20px #00ff41; }
            to { text-shadow: 0 0 30px #ff00d4, 0 0 40px #00d4ff; }
        }

        .title {
            font-size: 1.5rem;
            margin-bottom: 2rem;
            color: #ff00d4;
            text-transform: uppercase;
            letter-spacing: 3px;
        }

        .bio {
            font-size: 1.1rem;
            max-width: 600px;
            margin: 0 auto 3rem;
            line-height: 1.8;
            color: #00d4ff;
        }

        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin: 3rem 0;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
        }

        .skill-card {
            padding: 1rem;
            text-align: center;
            border-radius: 10px;
            background: rgba(0, 255, 65, 0.1);
            border: 1px solid #00ff41;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .skill-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .skill-card:hover::before {
            left: 100%;
        }

        .skill-card:hover {
            transform: translateY(-10px) scale(1.05);
            box-shadow: 0 10px 30px rgba(0, 255, 65, 0.3);
            border-color: #ff00d4;
        }

        .projects {
            padding: 5rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }

        .section-title {
            text-align: center;
            font-size: 3rem;
            font-weight: 900;
            margin-bottom: 3rem;
            color: #00ff41;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 3rem;
        }

        .project-card {
            padding: 2rem;
            border-radius: 15px;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #00ff41;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .project-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, #00ff4110, #ff00d410, #00d4ff10);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .project-card:hover::before {
            opacity: 1;
        }

        .project-card:hover {
            transform: translateY(-15px) rotateX(5deg);
            border-color: #ff00d4;
            box-shadow: 0 20px 40px rgba(255, 0, 212, 0.3);
        }

        .project-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #00ff41;
            margin-bottom: 1rem;
            text-transform: uppercase;
        }

        .project-desc {
            color: #00d4ff;
            line-height: 1.6;
            margin-bottom: 2rem;
        }

        .tech-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 2rem;
        }

        .tech-tag {
            padding: 0.3rem 0.8rem;
            background: rgba(255, 0, 212, 0.2);
            border: 1px solid #ff00d4;
            border-radius: 20px;
            font-size: 0.8rem;
            color: #ff00d4;
            text-transform: uppercase;
            font-weight: 600;
        }

        .project-links {
            display: flex;
            gap: 1rem;
        }

        .cyber-btn {
            padding: 0.8rem 2rem;
            background: transparent;
            border: 2px solid #00ff41;
            color: #00ff41;
            text-decoration: none;
            text-transform: uppercase;
            font-family: 'Orbitron', monospace;
            font-weight: 600;
            letter-spacing: 1px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .cyber-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: #00ff41;
            transition: left 0.3s ease;
            z-index: -1;
        }

        .cyber-btn:hover::before {
            left: 0;
        }

        .cyber-btn:hover {
            color: #000;
            box-shadow: 0 0 30px #00ff41;
        }

        .contact {
            padding: 5rem 2rem;
            text-align: center;
            background: rgba(0, 0, 0, 0.9);
        }

        .contact-grid {
            max-width: 600px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
        }

        .contact-item {
            padding: 2rem;
            background: rgba(0, 255, 65, 0.1);
            border: 1px solid #00ff41;
            border-radius: 10px;
            transition: all 0.3s ease;
        }

        .contact-item:hover {
            background: rgba(255, 0, 212, 0.1);
            border-color: #ff00d4;
            transform: scale(1.05);
        }

        .contact-icon {
            font-size: 2rem;
            margin-bottom: 1rem;
            display: block;
        }

        .glitch {
            animation: glitch 2s infinite;
        }

        @keyframes glitch {
            0%, 90%, 100% { transform: translate(0); }
            10% { transform: translate(-2px, 2px); }
            20% { transform: translate(2px, -2px); }
            30% { transform: translate(-2px, -2px); }
            40% { transform: translate(2px, 2px); }
            50% { transform: translate(-2px, 2px); }
            60% { transform: translate(2px, -2px); }
            70% { transform: translate(-2px, -2px); }
            80% { transform: translate(2px, 2px); }
        }

        @media (max-width: 768px) {
            .name { font-size: 2.5rem; }
            .projects-grid { grid-template-columns: 1fr; }
            .skills-grid { grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); }
        }
    </style>
</head>
<body>
    <canvas class="matrix-bg" id="matrix"></canvas>
    
    <section class="hero">
        <div class="hero-content">
            ${data.profileImage ? `
            <div class="profile-container">
                <img src="${data.profileImage}" alt="${data.name}" class="profile-img">
            </div>
            ` : ''}
            <h1 class="name neon-text glitch">${data.name}</h1>
            <p class="title neon-text">${data.title}</p>
            <p class="bio">${data.bio}</p>
            
            ${data.skills && data.skills.length > 0 ? `
            <div class="skills-grid">
                ${data.skills.map((skill: string) => 
                    `<div class="skill-card neon-text">${skill}</div>`
                ).join('')}
            </div>
            ` : ''}
        </div>
    </section>

    ${data.projects && data.projects.length > 0 ? `
    <section class="projects">
        <h2 class="section-title neon-text">Projects</h2>
        <div class="projects-grid">
            ${data.projects.map((project: any) => `
                <div class="project-card">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-desc">${project.description}</p>
                    ${project.technologies && project.technologies.length > 0 ? `
                    <div class="tech-grid">
                        ${project.technologies.map((tech: string) => 
                            `<span class="tech-tag">${tech}</span>`
                        ).join('')}
                    </div>
                    ` : ''}
                    <div class="project-links">
                        ${project.demoUrl ? `<a href="${project.demoUrl}" class="cyber-btn" target="_blank">Demo</a>` : ''}
                        ${project.githubUrl ? `<a href="${project.githubUrl}" class="cyber-btn" target="_blank">Code</a>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    </section>
    ` : ''}

    <section class="contact">
        <h2 class="section-title neon-text">Contact</h2>
        <div class="contact-grid">
            ${data.email ? `
            <div class="contact-item">
                <span class="contact-icon">📧</span>
                <p>Email</p>
                <a href="mailto:${data.email}" style="color: #00ff41;">${data.email}</a>
            </div>
            ` : ''}
            ${data.linkedin ? `
            <div class="contact-item">
                <span class="contact-icon">💼</span>
                <p>LinkedIn</p>
                <a href="${data.linkedin}" target="_blank" style="color: #00ff41;">Connect</a>
            </div>
            ` : ''}
            ${data.github ? `
            <div class="contact-item">
                <span class="contact-icon">💻</span>
                <p>GitHub</p>
                <a href="${data.github}" target="_blank" style="color: #00ff41;">Follow</a>
            </div>
            ` : ''}
        </div>
    </section>

    <script>
        // Matrix rain effect
        const canvas = document.getElementById('matrix');
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const letters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00ff41';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = letters[Math.floor(Math.random() * letters.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(drawMatrix, 35);

        // Resize canvas on window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        // Add random glitch effect to text elements
        setInterval(() => {
            const glitchElements = document.querySelectorAll('.glitch');
            glitchElements.forEach(el => {
                if (Math.random() > 0.95) {
                    el.style.animation = 'none';
                    setTimeout(() => {
                        el.style.animation = 'glitch 2s infinite';
                    }, 100);
                }
            });
        }, 3000);
    </script>
</body>
</html>`;

    return { html, css: '', js: '' };
  };

  // Additional template generators would be implemented here
  const generateFloatingElementsTemplate = (data: any) => {
    // Implementation for floating elements template
    return { html: "<!-- Floating Elements Template -->", css: '', js: '' };
  };

  const generateParticleGalaxyTemplate = (data: any) => {
    // Implementation for particle galaxy template
    return { html: "<!-- Particle Galaxy Template -->", css: '', js: '' };
  };

  const generateMinimalSwissTemplate = (data: any) => {
    // Implementation for minimal swiss template
    return { html: "<!-- Minimal Swiss Template -->", css: '', js: '' };
  };

  const generateCreativeStudioTemplate = (data: any) => {
    // Implementation for creative studio template
    return { html: "<!-- Creative Studio Template -->", css: '', js: '' };
  };

  const generateHolographicTemplate = (data: any) => {
    // Implementation for holographic template
    return { html: "<!-- Holographic Template -->", css: '', js: '' };
  };

  const generateMorphingShapesTemplate = (data: any) => {
    // Implementation for morphing shapes template
    return { html: "<!-- Morphing Shapes Template -->", css: '', js: '' };
  };

  const generateTerminalHackerTemplate = (data: any) => {
    // Implementation for terminal hacker template
    return { html: "<!-- Terminal Hacker Template -->", css: '', js: '' };
  };

  const generateLiquidMotionTemplate = (data: any) => {
    // Implementation for liquid motion template
    return { html: "<!-- Liquid Motion Template -->", css: '', js: '' };
  };

  const generateRetroSynthwaveTemplate = (data: any) => {
    // Implementation for retro synthwave template
    return { html: "<!-- Retro Synthwave Template -->", css: '', js: '' };
  };

  const generatePaperOrigamiTemplate = (data: any) => {
    // Implementation for paper origami template
    return { html: "<!-- Paper Origami Template -->", css: '', js: '' };
  };

  const generateNeuralNetworkTemplate = (data: any) => {
    // Implementation for neural network template
    return { html: "<!-- Neural Network Template -->", css: '', js: '' };
  };

  const generateMagneticHoverTemplate = (data: any) => {
    // Implementation for magnetic hover template
    return { html: "<!-- Magnetic Hover Template -->", css: '', js: '' };
  };

  const generateIsometricWorldTemplate = (data: any) => {
    // Implementation for isometric world template
    return { html: "<!-- Isometric World Template -->", css: '', js: '' };
  };

// Export utility function for generating template code
export const generateTemplateCode = async (templateId: string, data: any) => {
  const templates = {
    "modern-glass": generateGlassMorphismTemplate,
    "cyber-neon": generateCyberNeonTemplate,
    "floating-elements": generateFloatingElementsTemplate,
    "particle-galaxy": generateParticleGalaxyTemplate,
    "minimal-swiss": generateMinimalSwissTemplate,
    "creative-portfolio": generateCreativeStudioTemplate,
    "holographic-3d": generateHolographicTemplate,
    "morphing-shapes": generateMorphingShapesTemplate,
    "terminal-hacker": generateTerminalHackerTemplate,
    "liquid-motion": generateLiquidMotionTemplate,
    "retro-synthwave": generateRetroSynthwaveTemplate,
    "paper-origami": generatePaperOrigamiTemplate,
    "neural-network": generateNeuralNetworkTemplate,
    "magnetic-hover": generateMagneticHoverTemplate,
    "isometric-world": generateIsometricWorldTemplate,
  };

  const generator = templates[templateId as keyof typeof templates];
  if (!generator) {
    throw new Error(`Template ${templateId} not found`);
  }

  return generator(data);
};

export function TemplateGenerator({ template, portfolioData, onGenerated }: TemplateGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const code = await generateTemplateCode(template.id, portfolioData);
      onGenerated(code);
    } catch (error) {
      console.error('Template generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="template-generator">
      {/* This component handles the template generation logic */}
      {/* The actual UI would be handled by the parent component */}
    </div>
  );
}
