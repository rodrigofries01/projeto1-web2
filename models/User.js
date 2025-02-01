module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    tf_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tf_email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tf_senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  return User;
};
