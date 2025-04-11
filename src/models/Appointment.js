const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Appointment = sequelize.define(
  "Appointment",
  {
    date: { type: DataTypes.DATEONLY, allowNull: false },
    hour: { type: DataTypes.TIME, allowNull: false },
    clientName: { type: DataTypes.STRING, allowNull: false },
  },
  {
    indexes: [{ unique: true, fields: ["date", "hour"] }], // Prevent duplicate bookings
  }
);

module.exports = Appointment;
