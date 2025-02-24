const mongoose = require("mongoose");
require("dotenv").config();

const db = {};

// Conectar ao MongoDB
mongoose
  .connect(
    "mongodb+srv://griffin:1234@web2.0ae2j.mongodb.net/?retryWrites=true&w=majority&appName=web2",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Conectado ao MongoDB com sucesso");
  })
  .catch((err) => {
    console.error("Erro ao conectar ao MongoDB", err);
  });

// Importar modelos
db.UserSchema = require("../models/User");
db.Skill = require("../models/Skill");
db.Keyword = require("../models/Keyword");
db.Project = require("../models/Project");
db.UserSkill = require("../models/UserSkill");

module.exports = db;
