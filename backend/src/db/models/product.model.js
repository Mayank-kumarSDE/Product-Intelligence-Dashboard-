import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.config.js";

export const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    enhancedTitle: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
    },
    category: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    inventory: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    imageUrl: {
      type: DataTypes.TEXT
    },
    validationStatus: {
      type: DataTypes.ENUM("valid", "warning", "invalid"),
      defaultValue: "valid"
    },
    validationErrors: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    rawData: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  },
  {
    tableName: "products",
    underscored: true
  }
);
