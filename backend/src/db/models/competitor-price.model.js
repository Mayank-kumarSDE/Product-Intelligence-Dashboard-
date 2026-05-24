import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.config.js";

export const CompetitorPrice = sequelize.define(
  "CompetitorPrice",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    competitorName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    competitorPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    url: {
      type: DataTypes.TEXT
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: "INR"
    },
    capturedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "competitor_prices",
    underscored: true
  }
);
