const express = require("express");
const router = express.Router();
const { User } = require("../models");
const adminAuth = require("../middleware/adminAuth");
const executarSQL = require("../config/db_sequelize");

// Obter todos os alunos
router.get("/", adminAuth, async (req, res) => {
  try {
    const query = "SELECT tf_nome, tf_email FROM users WHERE is_admin = false";
    const result = await executarSQL(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Error fetching students" });
  }
});

// Criar um novo aluno
router.post("/", adminAuth, async (req, res) => {
  const { tf_nome, tf_email, tf_senha } = req.body;

  try {
    const newUser = await User.create({
      tf_nome,
      tf_email,
      tf_senha,
      is_admin: false, // Certifique-se de que o aluno não é um administrador
    });
    const query =
      "INSERT INTO users (tf_nome, tf_email, tf_senha) VALUES ($1, $2, $3) RETURNING *";
    const values = [newUser];
    const result = await executarSQL(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Email already exists" });
    }
    console.error("Error creating student:", error);
    res.status(500).json({ message: "Error creating student" });
  }
});

// Atualizar um aluno
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    Object.assign(user, req.body);
    await user.save();
    res.json({ ...user.toJSON(), senha: undefined });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Error updating student" });
  }
});

// Deletar um aluno
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    await user.destroy();
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Error deleting student" });
  }
});

module.exports = router;
