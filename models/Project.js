module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    "Project",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      // Outras opções do modelo (opcional)
      tableName: "projects", // Nome da tabela no banco de dados
      timestamps: true, // Cria colunas createdAt e updatedAt automaticamente
    }
  );

  return Project;
};
