const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
const projectController = require("../controllers/projectController");
const skillController = require("../controllers/skillController");
const keywordController = require("../controllers/keywordController");
const adminController = require("../controllers/adminController");
const knowledgeController = require("../controllers/knowledgeController");
const addAlunoController = require("../controllers/addAlunoController");

// Rotas de autenticação
router.get("/auth/login", loginController.getLogin);
router.post("/auth/login", loginController.postLogin);
router.get("/auth/logout", loginController.getLogout);

// Rotas de projetos
router.get("/projects", projectController.getProjects);
router.post("/projects", projectController.createProject);
router.put("/projects/:id", projectController.updateProject);
router.delete("/projects/:id", projectController.deleteProject);

// Rotas de habilidades
router.get("/skills", skillController.getSkills);
router.post("/skills", skillController.createSkill);
router.put("/skills/:id", skillController.updateSkill);
router.delete("/skills/:id", skillController.deleteSkill);

// Rotas de palavras-chave
router.get("/keywords", keywordController.getKeywords);
router.post("/keywords", keywordController.createKeyword);
router.put("/keywords/:id", keywordController.updateKeyword);
router.delete("/keywords/:id", keywordController.deleteKeyword);

// Rotas de administração
router.get("/admin", adminController.getAdmin);
router.post("/admin", adminController.createAdmin);
router.put("/admin/:id", adminController.updateAdmin);
router.delete("/admin/:id", adminController.deleteAdmin);

// Rotas de conhecimento
router.get("/knowledge", knowledgeController.getKnowledge);
router.post("/knowledge", knowledgeController.createKnowledge);
router.put("/knowledge/:id", knowledgeController.updateKnowledge);
router.delete("/knowledge/:id", knowledgeController.deleteKnowledge);

// Rotas de adicionar aluno
router.post("/api/addaluno", addAlunoController.addAluno);

module.exports = router;
