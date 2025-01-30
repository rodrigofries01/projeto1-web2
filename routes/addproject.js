const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const executarSQL = require("../config/db_sequelize");

router.use(adminAuth);

router.get("/", (req, res) => {
  res.send("Add Project Route");
});

router.post("/addproject", async (req, res) => {
  const { nome, resumo, link } = req.body;
  try {
    const query =
      "INSERT INTO projetos (nome, resumo, link) VALUES ($1, $2, $3) RETURNING *";
    const values = [nome, resumo, link];
    const result = await executarSQL(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao cadastrar projeto:", error);
    res.status(500).send("Erro ao cadastrar projeto");
  }
});

module.exports = router;
