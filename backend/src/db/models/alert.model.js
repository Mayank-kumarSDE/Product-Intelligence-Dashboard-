import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.config.js";

export const Alert = sequelize.define(
  "Alert",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    severity: {
      type: DataTypes.ENUM("info", "warning", "critical"),
      defaultValue: "info"
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    tableName: "alerts",
    underscored: true
  }
);
