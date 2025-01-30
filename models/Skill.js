module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define("skill", {
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
