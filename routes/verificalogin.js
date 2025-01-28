const express = require("express");
const router = express.Router();
const { User } = require("../models"); // Certifique-se de que o caminho está correto

// Função para executar a consulta no banco de dados usando Sequelize
async function retornaLinha(email, senha) {
  return await User.findOne({ where: { email, senha } });
}

router.post("/login", async (req, res) => {
  try {
    console.log("Request body:", req.body); // Adicione este log para verificar o corpo da requisição
    const { tf_email, tf_senha } = req.body;

    const usuario = await retornaLinha(tf_email, tf_senha);

    if (usuario) {
      if (usuario.is_admin) {
        res.redirect("/admin-dashboard.html");
      } else {
        res.redirect("/index-logado.html");
      }
    } else {
      res
        .status(401)
        .send(
          '<script>alert("Credenciais inválidas. Tente novamente."); window.history.back();</script>'
        );
    }
  } catch (error) {
    console.error("Erro durante a validação de login:", error);
    res
      .status(500)
      .send(
        '<script>alert("Erro interno do servidor. Tente novamente mais tarde."); window.history.back();</script>'
      );
  }
});

module.exports = router;
