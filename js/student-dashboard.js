import { apiCall, showNotification, getUser } from './utils.js';

class StudentDashboard {
    constructor() {
        this.init();
    }

    async init() {
        await Promise.all([
            this.loadUserProfile(),
            this.loadKeywords(),
            this.loadSkills(),
            this.loadProjects()
        ]);
        this.initializeEventListeners();
    }

    async loadUserProfile() {
        try {
            const user = getUser();
            if (user) {
                document.getElementById('userName').textContent = user.name;
                document.getElementById('userEmail').textContent = user.email;
                // You can add more profile data here
            }
        } catch (error) {
            showNotification('Erro ao carregar perfil', 'error');
        }
    }

    async loadKeywords() {
        try {
            const keywords = await apiCall('/keywords');
            const select = document.getElementById('projectKeywords');
            select.innerHTML = keywords.map(keyword => 
                `<option value="${keyword.id}">${keyword.name}</option>`
            ).join('');
        } catch (error) {
            showNotification('Erro ao carregar palavras-chave', 'error');
        }
    }

    async loadSkills() {
        try {
            const [availableSkills, userSkills] = await Promise.all([
                apiCall('/skills'),
                apiCall('/skills/student')
            ]);

            // Update skill count
            document.getElementById('skillCount').textContent = 
                `${userSkills.length} conhecimento${userSkills.length !== 1 ? 's' : ''}`;

            // Populate skill select
            const select = document.getElementById('skillSelect');
            select.innerHTML = availableSkills
                .filter(skill => !userSkills.some(us => us.skill.id === skill.id))
                .map(skill => `<option value="${skill.id}">${skill.name}</option>`)
                .join('');

            // Render user skills
            this.renderSkills(userSkills);
        } catch (error) {
            showNotification('Erro ao carregar conhecimentos', 'error');
        }
    }

    async loadProjects() {
        try {
            const projects = await apiCall('/projects/student');
            
            // Update project count
            document.getElementById('projectCount').textContent = 
                `${projects.length} projeto${projects.length !== 1 ? 's' : ''}`;

            this.renderProjects(projects);
        } catch (error) {
            showNotification('Erro ao carregar projetos', 'error');
        }
    }

    renderProjects(projects) {
        const container = document.getElementById('projects-container');
        
        if (projects.length === 0) {
            container.innerHTML = `
                <div class="text-center text-muted my-5">
                    <i class="bi bi-folder2-open" style="font-size: 48px;"></i>
                    <p class="mt-3">Você ainda não tem projetos cadastrados</p>
                </div>
            `;
            return;
        }

        container.innerHTML = projects.map(project => `
            <div class="project-card">
                <div class="project-header">
                    <div class="me-auto">
                        <h3>
                            <a href="project-details.html?id=${project.id}">
                                ${project.name}
                            </a>
                        </h3>
                    </div>
                    <div class="dropdown">
                        <button class="btn btn-sm btn-link" data-bs-toggle="dropdown">
                            <i class="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item" href="#" onclick="editProject('${project.id}')">
                                <i class="bi bi-pencil me-2"></i>Editar
                            </a></li>
                            <li><a class="dropdown-item text-danger" href="#" onclick="deleteProject('${project.id}')">
                                <i class="bi bi-trash me-2"></i>Excluir
                            </a></li>
                        </ul>
                    </div>
                </div>
                <p class="text-gray mb-3">${project.summary}</p>
                <div class="mb-2">
                    ${project.keywords.map(keyword => 
                        `<span class="tag">${keyword.name}</span>`
                    ).join('')}
                </div>
                <div class="mt-3">
                    <small class="text-gray">
                        <i class="bi bi-link-45deg"></i>
                        <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="text-gray">
                            ${new URL(project.link).hostname}
                        </a>
                    </small>
                </div>
            </div>
        `).join('');
    }

    renderSkills(skills) {
        const container = document.getElementById('skills-container');
        
        if (skills.length === 0) {
            container.innerHTML = `
                <div class="text-center text-muted my-5">
                    <i class="bi bi-stars" style="font-size: 48px;"></i>
                    <p class="mt-3">Você ainda não cadastrou nenhum conhecimento</p>
                </div>
            `;
            return;
        }

        container.innerHTML = skills.map(skill => `
            <div class="skill-card">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h5 class="mb-0">${skill.skill.name}</h5>
                    <div class="dropdown">
                        <button class="btn btn-sm btn-link" data-bs-toggle="dropdown">
                            <i class="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item" href="#" onclick="editSkill('${skill.id}')">
                                <i class="bi bi-pencil me-2"></i>Editar
                            </a></li>
                            <li><a class="dropdown-item text-danger" href="#" onclick="deleteSkill('${skill.id}')">
                                <i class="bi bi-trash me-2"></i>Excluir
                            </a></li>
                        </ul>
                    </div>
                </div>
                <div class="progress skill-progress">
                    <div class="progress-bar bg-primary" role="progressbar" 
                         style="width: ${(skill.level * 10)}%" 
                         aria-valuenow="${skill.level}" 
                         aria-valuemin="0" 
                         aria-valuemax="10">
                    </div>
                </div>
                <small class="text-gray mt-2 d-block">
                    Nível ${skill.level}/10
                </small>
            </div>
        `).join('');
    }

    initializeEventListeners() {
        // Project form submission
        const addProjectForm = document.getElementById('addProjectForm');
        addProjectForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.addProject();
        });

        // Skill form submission
        const addSkillForm = document.getElementById('addSkillForm');
        addSkillForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.addSkill();
        });

        // Skill level range input
        const skillLevel = document.getElementById('skillLevel');
        skillLevel?.addEventListener('input', (e) => {
            const level = e.target.value;
            const labels = document.querySelectorAll('#addSkillForm .form-range + div small');
            labels.forEach(label => label.style.fontWeight = 'normal');
            
            if (level <= 3) labels[0].style.fontWeight = 'bold';
            else if (level <= 7) labels[1].style.fontWeight = 'bold';
            else labels[2].style.fontWeight = 'bold';
        });
    }

    async addProject() {
        try {
            const formData = {
                name: document.getElementById('projectName').value,
                summary: document.getElementById('projectSummary').value,
                link: document.getElementById('projectLink').value,
                keywords: Array.from(document.getElementById('projectKeywords').selectedOptions).map(opt => opt.value)
            };

            await apiCall('/projects', {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            showNotification('Projeto adicionado com sucesso!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('addProjectModal')).hide();
            this.loadProjects();
        } catch (error) {
            showNotification('Erro ao adicionar projeto', 'error');
        }
    }

    async addSkill() {
        try {
            const formData = {
                skillId: document.getElementById('skillSelect').value,
                level: parseInt(document.getElementById('skillLevel').value)
            };

            await apiCall('/skills', {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            showNotification('Conhecimento adicionado com sucesso!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('addSkillModal')).hide();
            this.loadSkills();
        } catch (error) {
            showNotification('Erro ao adicionar conhecimento', 'error');
        }
    }

    async deleteProject(projectId) {
        if (confirm('Tem certeza que deseja excluir este projeto?')) {
            try {
                await apiCall(`/projects/${projectId}`, { method: 'DELETE' });
                showNotification('Projeto excluído com sucesso!', 'success');
                this.loadProjects();
            } catch (error) {
                showNotification('Erro ao excluir projeto', 'error');
            }
        }
    }

    async deleteSkill(skillId) {
        if (confirm('Tem certeza que deseja excluir este conhecimento?')) {
            try {
                await apiCall(`/skills/${skillId}`, { method: 'DELETE' });
                showNotification('Conhecimento excluído com sucesso!', 'success');
                this.loadSkills();
            } catch (error) {
                showNotification('Erro ao excluir conhecimento', 'error');
            }
        }
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StudentDashboard();
});
