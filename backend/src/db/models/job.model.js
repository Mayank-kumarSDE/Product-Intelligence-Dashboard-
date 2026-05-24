import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.config.js";

export const Job = sequelize.define(
  "Job",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    type: {
      type: DataTypes.ENUM("video", "csv"),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("queued", "processing", "completed", "failed"),
      defaultValue: "queued"
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalProducts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    errorMessage: {
      type: DataTypes.TEXT
    },
    failedRows: {
      type: DataTypes.JSONB,
      defaultValue: []
    }
  },
  {
    tableName: "jobs",
    underscored: true
  }
);
