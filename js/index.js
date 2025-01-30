import {
  apiCall,
  showNotification,
  isAuthenticated,
  checkLoginStatus,
  logout,
} from "./utils.js";
import {
  fetchKeywords,
  fetchSkills,
  fetchStats,
  fetchProjects,
} from "./api.js";

class PublicPortfolio {
  constructor() {
    this.init();
    this.currentFilters = {
      name: "",
      keyword: "",
      skill: "",
      sort: "all",
    };
  }

  async init() {
    await Promise.all([
      this.loadKeywords(),
      this.loadSkills(),
      this.loadProjects(),
    ]);
    this.initializeEventListeners();
    this.setupKnowledgeReport();
    this.checkAuthStatus();
    this.updateNavigation();
    this.loadFilters();
    this.loadStats();
  }

  checkAuthStatus() {
    const isLoggedIn = isAuthenticated();
    const authButtons = document.getElementById("authButtons");
    const addProjectButton = document.getElementById("addProjectButton");
    const dashboardButton = document.getElementById("dashboardButton");

    if (isLoggedIn) {
      authButtons.innerHTML = `
                <a href="student-dashboard.html" class="btn btn-light animated-button me-2">Área do Aluno</a>
                <button class="btn btn-outline-light animated-button" onclick="logout()">Sair</button>
            `;
      addProjectButton.classList.remove("d-none");
      dashboardButton.classList.remove("d-none");
    } else {
      addProjectButton.classList.add("d-none");
      dashboardButton.classList.add("d-none");
    }
  }

  async loadKeywords() {
    try {
      const keywords = await apiCall("/keywords");
      const select = document.getElementById("keyword-filter");
      select.innerHTML = `
                <option value="">Filtrar por palavra-chave</option>
                ${keywords
                  .map(
                    (keyword) =>
                      `<option value="${keyword.id}">${keyword.name}</option>`
                  )
                  .join("")}
            `;
    } catch (error) {
      showNotification("Erro ao carregar palavras-chave", "error");
    }
  }

  async loadSkills() {
    try {
      const skills = await apiCall("/skills");
      const select = document.getElementById("skill-filter");
      select.innerHTML = `
                <option value="">Filtrar por conhecimento</option>
                ${skills
                  .map(
                    (skill) =>
                      `<option value="${skill.id}">${skill.name}</option>`
                  )
                  .join("")}
            `;
    } catch (error) {
      showNotification("Erro ao carregar conhecimentos", "error");
    }
  }

  async loadProjects() {
    try {
      let endpoint = "/projects";
      const params = new URLSearchParams();

      if (this.currentFilters.name) {
        params.append("name", this.currentFilters.name);
      }
      if (this.currentFilters.keyword) {
        params.append("keyword", this.currentFilters.keyword);
      }
      if (this.currentFilters.skill) {
        params.append("skill", this.currentFilters.skill);
      }
      if (this.currentFilters.sort !== "all") {
        params.append("sort", this.currentFilters.sort);
      }

      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }

      const projects = await apiCall(endpoint);
      this.renderProjects(projects);
    } catch (error) {
      showNotification("Erro ao carregar projetos", "error");
    }
  }

  renderProjects(projects) {
    const container = document.getElementById("projects-container");

    if (projects.length === 0) {
      container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info text-center">
                        Nenhum projeto encontrado com os filtros selecionados.
                    </div>
                </div>
            `;
      return;
    }

    container.innerHTML = projects
      .map(
        (project) => `
            <div class="col animate__animated animate__fadeIn">
                <div class="card h-100 project-card">
                    <div class="card-body">
                        <h5 class="card-title">${project.name}</h5>
                        <p class="card-text">${project.summary}</p>
                        <div class="mb-2">
                            ${project.keywords
                              .map(
                                (keyword) =>
                                  `<span class="tag">${keyword.name}</span>`
                              )
                              .join("")}
                        </div>
                        <div class="mb-2">
                            <small class="text-muted">Desenvolvido por: ${project.developers
                              .map((dev) => dev.name)
                              .join(", ")}</small>
                        </div>
                        <a href="${
                          project.link
                        }" class="btn btn-primary animated-button" target="_blank">
                            Ver Projeto
                        </a>
                    </div>
                </div>
            </div>
        `
      )
      .join("");
  }

  async loadKnowledgeReport() {
    try {
      const data = await apiCall("/knowledge/report");
      const ctx = document.getElementById("knowledge-chart").getContext("2d");

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: data.map((item) => item.skill),
          datasets: [
            {
              label: "Média de Proficiência dos Alunos",
              data: data.map((item) => item.averageLevel),
              backgroundColor: "rgba(74, 144, 226, 0.2)",
              borderColor: "rgba(74, 144, 226, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 10,
            },
          },
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Nível Médio de Conhecimento por Habilidade",
            },
          },
        },
      });
    } catch (error) {
      showNotification("Erro ao carregar relatório de conhecimentos", "error");
    }
  }

  initializeEventListeners() {
    // Search input handlers
    const projectNameInput = document.getElementById("projectName");
    projectNameInput?.addEventListener(
      "input",
      debounce(() => {
        this.currentFilters.name = projectNameInput.value;
        this.loadProjects();
      }, 300)
    );

    // Keyword filter
    const keywordFilter = document.getElementById("keyword-filter");
    keywordFilter?.addEventListener("change", () => {
      this.currentFilters.keyword = keywordFilter.value;
      this.loadProjects();
    });

    // Skill filter
    const skillFilter = document.getElementById("skill-filter");
    skillFilter?.addEventListener("change", () => {
      this.currentFilters.skill = skillFilter.value;
      this.loadProjects();
    });

    // Filter buttons
    document.querySelectorAll(".filter-button").forEach((button) => {
      button.addEventListener("click", () => {
        document
          .querySelectorAll(".filter-button")
          .forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        this.currentFilters.sort = button.dataset.filter;
        this.loadProjects();
      });
    });

    // Add project button
    const addProjectButton = document.getElementById("addProjectButton");
    addProjectButton?.addEventListener("click", (e) => {
      e.preventDefault();
      if (isAuthenticated()) {
        window.location.href = "student-dashboard.html#projects";
      } else {
        showNotification("Faça login para adicionar projetos", "error");
        window.location.href = "login.html";
      }
    });

    // Knowledge report modal
    const knowledgeModal = document.getElementById("knowledgeModal");
    if (knowledgeModal) {
      knowledgeModal.addEventListener("show.bs.modal", () => {
        this.loadKnowledgeReport();
      });
    }
  }

  setupKnowledgeReport() {
    const modal = document.getElementById("knowledgeModal");
    if (modal) {
      const modalInstance = new bootstrap.Modal(modal);
      modal.addEventListener("show.bs.modal", () => {
        this.loadKnowledgeReport();
      });
    }
  }

  updateNavigation() {
    const authButton = document.getElementById("authButton");
    const isLoggedIn = checkLoginStatus();

    if (isLoggedIn) {
      authButton.innerHTML = `
                <a href="student-dashboard.html" class="btn btn-custom">
                    <i class="bi bi-person-circle"></i> Meu Perfil
                </a>`;
    } else {
      authButton.innerHTML = `
                <a href="login.html" class="btn btn-custom">
                    <i class="bi bi-box-arrow-in-right"></i> Login
                </a>`;
    }
  }

  async loadFilters() {
    try {
      const keywords = await fetchKeywords();
      const skills = await fetchSkills();

      const keywordSelect = document.getElementById("keyword-filter");
      const skillSelect = document.getElementById("skill-filter");

      keywords.forEach((keyword) => {
        const option = document.createElement("option");
        option.value = keyword.id;
        option.textContent = keyword.name;
        keywordSelect.appendChild(option);
      });

      skills.forEach((skill) => {
        const option = document.createElement("option");
        option.value = skill.id;
        option.textContent = skill.name;
        skillSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error loading filters:", error);
    }
  }

  async loadStats() {
    try {
      const stats = await fetchStats();

      document.getElementById("totalProjects").textContent = stats.projects;
      document.getElementById("totalUsers").textContent = stats.users;
      document.getElementById("totalSkills").textContent = stats.skills;
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  }

  async searchProjects() {
    const projectName = document.getElementById("projectName").value;
    const keyword = document.getElementById("keyword-filter").value;
    const skill = document.getElementById("skill-filter").value;

    try {
      const projects = await fetchProjects({ projectName, keyword, skill });
      this.displayProjects(projects);
    } catch (error) {
      console.error("Error searching projects:", error);
    }
  }
}

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Create digital rain effect
function createDigitalRain() {
  const heroSection = document.querySelector(".hero-section");
  const rainContainer = document.createElement("div");
  rainContainer.className = "digital-rain";
  heroSection.appendChild(rainContainer);

  const characters = "01";
  const columnCount = Math.floor(window.innerWidth / 20);

  for (let i = 0; i < columnCount; i++) {
    const column = document.createElement("div");
    column.className = "rain-column";
    column.style.left = `${i * 20}px`;

    // Random speed and delay for each column
    const speed = 3 + Math.random() * 2;
    const delay = Math.random() * 2;
    column.style.animation = `rain ${speed}s linear ${delay}s infinite`;

    // Create random string of 1s and 0s
    let rainString = "";
    for (let j = 0; j < 20; j++) {
      rainString += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    column.textContent = rainString;

    rainContainer.appendChild(column);
  }
}

// Initialize digital rain effect
document.addEventListener("DOMContentLoaded", () => {
  new PublicPortfolio();
  createDigitalRain();

  // Recreate rain effect on window resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const oldRain = document.querySelector(".digital-rain");
      if (oldRain) {
        oldRain.remove();
      }
      createDigitalRain();
    }, 250);
  });
});

// Make logout function available globally
window.logout = logout;
