import { apiCall, showNotification } from './utils.js';

class ProjectDetails {
    constructor() {
        this.projectId = new URLSearchParams(window.location.search).get('id');
        if (!this.projectId) {
            window.location.href = 'student-dashboard.html';
            return;
        }
        this.init();
    }

    async init() {
        try {
            const project = await this.loadProject();
            this.renderProject(project);
            this.loadAuthorProjects(project.author.id);
        } catch (error) {
            showNotification('Erro ao carregar projeto', 'error');
        }
    }

    async loadProject() {
        return await apiCall(`/projects/${this.projectId}`);
    }

    async loadAuthorProjects(authorId) {
        const projects = await apiCall(`/projects/author/${authorId}`);
        this.renderAuthorProjects(projects.filter(p => p.id !== this.projectId));
    }

    renderProject(project) {
        // Update page title
        document.title = `${project.name} - Portfolio`;
        
        // Update project header
        document.getElementById('projectTitle').textContent = project.name;
        document.getElementById('projectDate').textContent = new Date(project.createdAt).toLocaleDateString();
        document.getElementById('projectViews').textContent = `${project.views || 0} visualizações`;

        // Update keywords
        document.getElementById('projectKeywords').innerHTML = project.keywords
            .map(keyword => `<span class="keyword-badge">${keyword.name}</span>`)
            .join('');

        // Update project content
        document.getElementById('projectSummary').textContent = project.summary;
        document.getElementById('projectDescription').innerHTML = project.description;

        // Update knowledge section
        document.getElementById('projectKnowledge').innerHTML = project.knowledge
            .map(k => `
                <div class="knowledge-item">
                    <span>${k.name}</span>
                    <div class="knowledge-level ms-auto">
                        <div class="knowledge-level-fill" style="width: ${k.level * 10}%"></div>
                    </div>
                </div>
            `).join('');

        // Update project links
        document.getElementById('projectLinks').innerHTML = `
            <a href="${project.link}" class="list-group-item list-group-item-action" target="_blank">
                <i class="bi bi-link-45deg me-2"></i>Link do Projeto
            </a>
            ${project.github ? `
                <a href="${project.github}" class="list-group-item list-group-item-action" target="_blank">
                    <i class="bi bi-github me-2"></i>Repositório GitHub
                </a>
            ` : ''}
        `;

        // Update author information
        document.getElementById('authorAvatar').src = project.author.avatar || 'https://via.placeholder.com/80';
        document.getElementById('authorName').textContent = project.author.name;
        document.getElementById('authorTitle').textContent = project.author.title || 'Estudante';
        document.getElementById('authorProfile').href = `student-dashboard.html?id=${project.author.id}`;
        document.getElementById('authorContact').href = `mailto:${project.author.email}`;
    }

    renderAuthorProjects(projects) {
        const container = document.getElementById('authorProjects');
        
        if (projects.length === 0) {
            container.innerHTML = '<p class="text-muted mb-0">Nenhum outro projeto encontrado</p>';
            return;
        }

        container.innerHTML = projects
            .slice(0, 5)
            .map(project => `
                <a href="project-details.html?id=${project.id}" class="list-group-item list-group-item-action">
                    <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">${project.name}</h6>
                        <small class="text-muted">${new Date(project.createdAt).toLocaleDateString()}</small>
                    </div>
                    <small class="text-muted">${project.summary.substring(0, 100)}...</small>
                </a>
            `).join('');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectDetails();
});
