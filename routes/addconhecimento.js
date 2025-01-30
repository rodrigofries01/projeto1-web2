const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const executarSQL = require("../config/db_sequelize");

router.use(adminAuth);

router.get("/", (req, res) => {
  res.send("Add Conhecimento Route");
});

router.post("/addconhecimento", async (req, res) => {
  const { nome } = req.body;
  try {
    const query = "INSERT INTO conhecimentos (nome) VALUES ($1) RETURNING *";
    const values = [nome];
    const result = await executarSQL(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao cadastrar conhecimento:", error);
    res.status(500).send("Erro ao cadastrar conhecimento");
  }
});

module.exports = router;
