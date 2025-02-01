const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const executarSQL = require("../config/db_sequelize");
const User = require("../models/User");

router.use(adminAuth);

router.get("/admin-dashboard", (req, res) => {
  res.send(adminAuth.name);
});

router.get("/admin-dashboard", async (req, res) => {
  try {
    const query = "SELECT * FROM users";
    const result = await executarSQL(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    res.status(500).send("Erro ao buscar alunos");
  }
});

router.post("/admin-dashboard", async (req, res) => {
  try {
    console.log("Request body:", req.body); // Adicione este log para verificar o corpo da requisição

    const { tf_nome, tf_email, tf_senha } = req.body;
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
