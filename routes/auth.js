const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../models"); // Certifique-se de que o caminho está correto

router.post("/login", async (req, res) => {
  try {
    console.log("Request body:", req.body); // Adicione este log para verificar o corpo da requisição
    const { tf_email, tf_senha } = req.body;

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
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.is_admin ? "ADMIN" : "USER",
      },
    });
  } catch (error) {
    console.error("Erro durante a validação de login:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
