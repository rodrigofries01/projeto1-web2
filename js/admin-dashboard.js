import { apiCall, showNotification, formDataToJson } from "./utils.js";
import Auth from "./auth.js";

class AdminDashboard {
  constructor() {
    this.init();
  }

  async init() {
    Auth.checkAuth();
    await this.loadStudents();
    await this.loadKeywords();
    await this.loadSkills();
    this.initializeEventListeners();
  }

  // Students Management
  async loadStudents() {
    try {
      const students = await apiCall("/admin/students");
      const tbody = document.getElementById("students-table");
      tbody.innerHTML = students
        .map(
          (student) => `
                <tr>
                    <td>${student.tf_name}</td>
                    <td>${student.tf_email}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary edit-student" data-id="${student.id}">Editar</button>
                        <button class="btn btn-sm btn-outline-danger delete-student" data-id="${student.id}">Excluir</button>
                    </td>
                </tr>
            `
        )
        .join("");
    } catch (error) {
      showNotification("Erro ao carregar alunos", "error");
    }
  }

  async handleNewStudent(formData) {
    try {
      await apiCall("/addaluno", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      showNotification("Aluno criado com sucesso!");
      await this.loadStudents();
    } catch (error) {
      showNotification("Erro ao criar aluno", "error");
    }
  }

  async deleteStudent(studentId) {
    if (confirm("Tem certeza que deseja excluir este aluno?")) {
      try {
        await apiCall(`/admin/students/${studentId}`, {
          method: "DELETE",
        });
        showNotification("Aluno excluído com sucesso!");
        await this.loadStudents();
      } catch (error) {
        showNotification("Erro ao excluir aluno", "error");
      }
    }
  }

  // Keywords Management
  async loadKeywords() {
    try {
      const keywords = await apiCall("/admin/keywords");
      const tbody = document.getElementById("keywords-table");
      tbody.innerHTML = keywords
        .map(
          (keyword) => `
                <tr>
                    <td>${keyword.name}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary edit-keyword" data-id="${keyword.id}">Editar</button>
                        <button class="btn btn-sm btn-outline-danger delete-keyword" data-id="${keyword.id}">Excluir</button>
                    </td>
                </tr>
            `
        )
        .join("");
    } catch (error) {
      showNotification("Erro ao carregar palavras-chave", "error");
    }
  }

  async handleNewKeyword(formData) {
    try {
      await apiCall("/admin/keywords", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      showNotification("Palavra-chave criada com sucesso!");
      await this.loadKeywords();
    } catch (error) {
      showNotification("Erro ao criar palavra-chave", "error");
    }
  }

  async deleteKeyword(keywordId) {
    if (confirm("Tem certeza que deseja excluir esta palavra-chave?")) {
      try {
        await apiCall(`/admin/keywords/${keywordId}`, {
          method: "DELETE",
        });
        showNotification("Palavra-chave excluída com sucesso!");
        await this.loadKeywords();
      } catch (error) {
        showNotification("Erro ao excluir palavra-chave", "error");
      }
    }
  }

  // Skills Management
  async loadSkills() {
    try {
      const skills = await apiCall("/admin/skills");
      const tbody = document.getElementById("skills-table");
      tbody.innerHTML = skills
        .map(
          (skill) => `
                <tr>
                    <td>${skill.name}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary edit-skill" data-id="${skill.id}">Editar</button>
                        <button class="btn btn-sm btn-outline-danger delete-skill" data-id="${skill.id}">Excluir</button>
                    </td>
                </tr>
            `
        )
        .join("");
    } catch (error) {
      showNotification("Erro ao carregar conhecimentos", "error");
    }
  }

  async handleNewSkill(formData) {
    try {
      await apiCall("/admin/skills", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      showNotification("Conhecimento criado com sucesso!");
      await this.loadSkills();
    } catch (error) {
      showNotification("Erro ao criar conhecimento", "error");
    }
  }

  async deleteSkill(skillId) {
    if (confirm("Tem certeza que deseja excluir este conhecimento?")) {
      try {
        await apiCall(`/admin/skills/${skillId}`, {
          method: "DELETE",
        });
        showNotification("Conhecimento excluído com sucesso!");
        await this.loadSkills();
      } catch (error) {
        showNotification("Erro ao excluir conhecimento", "error");
      }
    }
  }

  initializeEventListeners() {
    // New Student Form
    const newStudentForm = document.getElementById("newStudentForm");
    newStudentForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = formDataToJson(e.target);
      await this.handleNewStudent(formData);
      bootstrap.Modal.getInstance(
        document.getElementById("newStudentModal")
      ).hide();
    });

    // New Keyword Form
    const newKeywordForm = document.getElementById("newKeywordForm");
    newKeywordForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = formDataToJson(e.target);
      await this.handleNewKeyword(formData);
      bootstrap.Modal.getInstance(
        document.getElementById("newKeywordModal")
      ).hide();
    });

    // New Skill Form
    const newSkillForm = document.getElementById("newSkillForm");
    newSkillForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = formDataToJson(e.target);
      await this.handleNewSkill(formData);
      bootstrap.Modal.getInstance(
        document.getElementById("newSkillModal")
      ).hide();
    });

    // Delete Buttons Event Delegation
    document.addEventListener("click", async (e) => {
      if (e.target.classList.contains("delete-student")) {
        const studentId = e.target.dataset.id;
        await this.deleteStudent(studentId);
      } else if (e.target.classList.contains("delete-keyword")) {
        const keywordId = e.target.dataset.id;
        await this.deleteKeyword(keywordId);
      } else if (e.target.classList.contains("delete-skill")) {
        const skillId = e.target.dataset.id;
        await this.deleteSkill(skillId);
      }
    });
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new AdminDashboard();
});
