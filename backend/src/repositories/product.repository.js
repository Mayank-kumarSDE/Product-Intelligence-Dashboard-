import { Product, CompetitorPrice, Alert } from "../db/models/index.js";

export function createProduct(values) {
  return Product.create(values);
}

export function findProducts() {
  return Product.findAll({
    include: [
      { model: CompetitorPrice, as: "competitorPrices" },
      { model: Alert, as: "alerts" }
    ],
    order: [["createdAt", "DESC"]]
  });
}

export function findProductById(id) {
  return Product.findByPk(id, {
    include: [
      { model: CompetitorPrice, as: "competitorPrices" },
      { model: Alert, as: "alerts" }
    ]
  });
}

export function updateProduct(id, values) {
  return Product.update(values, { where: { id } });
}

export function findProductBySku(sku) {
  return Product.findOne({ where: { sku } });
}
