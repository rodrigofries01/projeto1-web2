const jwt = require("jsonwebtoken");
const db = require("../config/db_mongoose");

const UserSchema = db.UserSchema;

exports.getLogin = (req, res) => {
  res.render("login"); // Renderize a página de login
};

exports.postLogin = async (req, res) => {
  console.log("Request body:", req.body);
  const { tf_email, tf_senha } = req.body;

  try {
    // Encontre o usuário pelo email e senha
    const user = await UserSchema.findOne({
      email: tf_email,
      senha: tf_senha,
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Credenciais inválidas. Tente novamente." });
    }

    // TODO - verificar token JWT,
    // arrumar controllers - todos os controllers
    // arrumar rotas - todas as rotas
    // tentar fazer login e logout
    // tentar fazer cadastro de projeto, palavras-chave, habilidades
    // //

    // Gere o token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.is_admin ? "ADMIN" : "USER" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Redirecione com base no tipo de usuário
    if (user.is_admin) {
      res.redirect("/public/admin-dashboard.html");
    } else {
      res.redirect("/public/student-dashboard.html");
    }
  } catch (error) {
    console.error("Erro durante a validação de login:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

exports.getLogout = (req, res) => {
  // Lógica de logout
  res.json({ message: "Logout realizado com sucesso" });
};
