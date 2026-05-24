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
    duplicateSku: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    brand: {
      type: DataTypes.STRING
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    enhancedTitle: {
      type: DataTypes.STRING
    },
    extractedAttributes: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    suggestedKeywords: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    enhancementReason: {
      type: DataTypes.TEXT
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
    mrp: {
      type: DataTypes.DECIMAL(10, 2)
    },
    inventory: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    availability: {
      type: DataTypes.STRING,
      defaultValue: "in_stock"
    },
    color: {
      type: DataTypes.STRING
    },
    size: {
      type: DataTypes.STRING
    },
    material: {
      type: DataTypes.STRING
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
