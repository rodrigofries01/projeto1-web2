module.exports = (sequelize, DataTypes) => {
  const UserSkill = sequelize.define(
    "UserSkill",
    {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users", // Nome da tabela de usuários
          key: "id",
        },
        allowNull: false,
      },
      skillId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Skills", // Nome da tabela de habilidades
          key: "id",
        },
        allowNull: false,
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 10,
        },
      },
    },
    {
      timestamps: true, // Adiciona colunas createdAt e updatedAt
      tableName: "user_skills", // Nome da tabela no banco de dados
    }
  );
  return UserSkill;
};

module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define("Skill", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    proficiency: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Skill;
};
