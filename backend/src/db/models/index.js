import { sequelize } from "../../config/db.config.js";
import { Job } from "./job.model.js";
import { Product } from "./product.model.js";
import { CompetitorPrice } from "./competitor-price.model.js";
import { Alert } from "./alert.model.js";
import { User } from "./user.model.js";

Job.hasMany(Product, { foreignKey: { name: "jobId", allowNull: false }, as: "products" });
Product.belongsTo(Job, { foreignKey: { name: "jobId", allowNull: false }, as: "job" });

Product.hasMany(CompetitorPrice, {
  foreignKey: { name: "productId", allowNull: false },
  as: "competitorPrices",
  onDelete: "CASCADE"
});
CompetitorPrice.belongsTo(Product, {
  foreignKey: { name: "productId", allowNull: false },
  as: "product"
});

Product.hasMany(Alert, {
  foreignKey: { name: "productId", allowNull: false },
  as: "alerts",
  onDelete: "CASCADE"
});
Alert.belongsTo(Product, { foreignKey: { name: "productId", allowNull: false }, as: "product" });

export { sequelize, Job, Product, CompetitorPrice, Alert, User };
