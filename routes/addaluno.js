const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const executarSQL = require("../config/db_sequelize");

router.use(adminAuth);

router.get("/", (req, res) => {
  res.send(adminAuth.name);
});

router.get("/admin-logado", async (req, res) => {
  try {
    const query = "SELECT * FROM users";
    const result = await executarSQL(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    res.status(500).send("Erro ao buscar alunos");
  }
});

router.post("/addaluno", async (req, res) => {
  const { tf_nome, tf_email, tf_senha } = req.body;
  try {
    const newUser = await User.create({
      tf_nome,
      tf_email,
      tf_senha,
      is_admin: false, // Certifique-se de que o aluno não é um administrador
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);
    res.status(500).send("Erro ao cadastrar aluno");
  }
});

module.exports = router;
