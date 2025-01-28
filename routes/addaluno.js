//lista os alunos
const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const executarSQL = require("../config/db_sequelize").executarSQL;

// Rota para buscar estudantes
router.get("/addalunos", adminAuth, async (req, res) => {
  try {
    // Consulta para obter todos os estudantes
    const query = "SELECT * FROM students WHERE role = $1";
    const students = await executarSQL(query, ["student"]); // Usando 'student' como parâmetro

    // Retorna os estudantes em formato JSON
    res.json(students);
  } catch (error) {
    console.error("Erro ao buscar estudantes:", error);
    res.status(500).send("Erro ao buscar estudantes");
  }
});

// Crie um novo usuário
router.post("/addalunos", adminAuth, async (req, res) => {
  try {
    const novoUsuario = await User.create({
      username,
      email,
      senha,
      is_admin: is_admin || false,
    });

    return res
      .status(201)
      .json({ message: "Usuário criado com sucesso !", user: novoUsuario });
  } catch (error) {
    console.error("Erro ao buscar estudantes:", error);
    res.status(500).send("Erro ao buscar estudantes");
  }
});
