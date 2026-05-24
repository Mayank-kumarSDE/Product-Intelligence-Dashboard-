import { generateCompetitorPrices } from "../utils/mock-competitor-prices.js";
import { replaceCompetitorPrices } from "../repositories/competitor.repository.js";
import { findProductById } from "../repositories/product.repository.js";
import { validateProduct } from "./validation.service.js";
import { updateProduct } from "../repositories/product.repository.js";
import { syncAlertsForProduct } from "./alert.service.js";
import { CompetitorPrice } from "../db/models/index.js";

export async function refreshCompetitorPrices(product) {
  const previousPrices = await CompetitorPrice.findAll({
    where: { productId: product.id },
    raw: true
  });

  const prices = generateCompetitorPrices(product);
  const savedPrices = await replaceCompetitorPrices(product.id, prices);
  const validation = validateProduct(product, savedPrices);

  await updateProduct(product.id, {
    validationStatus: validation.status,
    validationErrors: validation.issues
  });

  const updatedProduct = await findProductById(product.id);
  await syncAlertsForProduct(updatedProduct, savedPrices, previousPrices);
  return findProductById(product.id);
}

export async function saveUploadedCompetitorPrices(productId, prices) {
  const product = await findProductById(productId);
  if (!product) return null;

  const previousPrices = await CompetitorPrice.findAll({
    where: { productId },
    raw: true
  });

  const savedPrices = await replaceCompetitorPrices(productId, prices);
  const validation = validateProduct(product, savedPrices);

  await updateProduct(productId, {
    validationStatus: validation.status,
    validationErrors: validation.issues
  });

  const updatedProduct = await findProductById(productId);
  await syncAlertsForProduct(updatedProduct, savedPrices, previousPrices);
  return updatedProduct;
}
