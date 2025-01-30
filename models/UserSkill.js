module.exports = (sequelize, DataTypes) => {
  const UserSkill = sequelize.define(
    "userSkill",
    {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users", // Nome da tabela de usuários
          key: "id",
        },
        allowNull: false,
      },
      skillId: {
        type: DataTypes.INTEGER,
        references: {
          model: "skills", // Nome da tabela de habilidades
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
