const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_PASSWORD,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST, // Certifique-se de que o host está correto
    port: process.env.DB_PORT, // Porta padrão do PostgreSQL
    dialect: "postgres", // Certifique-se de que o dialeto é "postgres"
  }
);

const db = {};
// Associar sequelize e DataTypes ao db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Importar modelos
db.User = require("../models/User")(sequelize, DataTypes);
db.Skill = require("../models/Skill")(sequelize, DataTypes);
db.Keyword = require("../models/Keyword")(sequelize, DataTypes);
db.Project = require("../models/Project")(sequelize, DataTypes);
db.UserSkill = require("../models/UserSkill")(sequelize, DataTypes);

module.exports = db;
