const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../models");

router.post("/login", async (req, res) => {
  console.log("Request body:", req.body);
  const { tf_email, tf_senha } = req.body;

  try {
    // Encontre o usuário pelo email e senha
    const user = await User.findOne({
      where: { email: tf_email, senha: tf_senha },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Credenciais inválidas. Tente novamente." });
    }

    // Gere o token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.is_admin ? "ADMIN" : "USER" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      userType: user.is_admin ? "ADMIN" : "USER",
    });
  } catch (error) {
    console.error("Erro durante a validação de login:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

module.exports = router;
