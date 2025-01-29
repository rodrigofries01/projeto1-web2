const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const executarSQL = require("../config/db_sequelize");

// Define your routes here
router.use(adminAuth);

router.get("/", (req, res) => {
  res.send("Add Aluno Route");
});

router.get("/alunos", adminAuth, async (req, res) => {
  try {
    const query = "SELECT * FROM students";
    const result = await executarSQL(query);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    res.status(500).send("Erro ao buscar alunos");
  }
});

router.post("/addaluno", adminAuth, async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const query =
      "INSERT INTO students (nome, email, senha) VALUES ($1, $2, $3) RETURNING *";
    const values = [nome, email, senha];
    const result = await executarSQL(query, values);

    res.status(201).json({
      message: "Aluno cadastrado com sucesso!",
      aluno: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);
    res.status(500).send("Erro ao cadastrar aluno");
  }
});

module.exports = router;
