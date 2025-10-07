// Main application logic
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    loadProjects();
    loadSkills();
    handleContactForm();
    smoothScroll();
});

function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

function loadProjects() {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;
    
    const projects = window.portfolioData?.projects || [];
    
    projects.forEach(project => {
        const card = createProjectCard(project);
        projectsContainer.appendChild(card);
    });
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    card.innerHTML = `
        ${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.title}" class="project-image">` : ''}
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tags">
                ${project.technologies.map(tech => `<span class="project-tag">${tech}</span>`).join('')}
            </div>
            <div class="project-links">
                ${project.githubUrl ? `<a href="${project.githubUrl}" class="project-link" target="_blank">GitHub</a>` : ''}
                ${project.liveUrl ? `<a href="${project.liveUrl}" class="project-link" target="_blank">Live Demo</a>` : ''}
            </div>
        </div>
    `;
    
    return card;
}

function loadSkills() {
    const skillsContainer = document.getElementById('skills-container');
    if (!skillsContainer) return;
    
    const skills = window.portfolioData?.skills || [];
    
    skillsContainer.innerHTML = skills.map(skill => `
        <div class="skill-badge">${skill}</div>
    `).join('');
}

function handleContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        alert('Thank you for your message! I will get back to you soon.');
        form.reset();
    });
}

function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}
