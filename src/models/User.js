const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING, // se estiver usando login com senha
      allowNull: false,
    },
  },
  {
    tableName: "Users",
  }
);

module.exports = User;
