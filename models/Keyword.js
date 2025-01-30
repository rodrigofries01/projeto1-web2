// converta esse codigo, para que troque o mongoose pelo sequelize
module.exports = (sequelize, DataTypes) => {
  const Keyword = sequelize.define(
    "keyword",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      timestamps: true,
    }
  );
  return Keyword;
};
