import { generateCompetitorPrices } from "../utils/mock-competitor-prices.js";
import { replaceCompetitorPrices } from "../repositories/competitor.repository.js";
import { findProductById } from "../repositories/product.repository.js";
import { validateProduct } from "./validation.service.js";
import { updateProduct } from "../repositories/product.repository.js";
import { syncAlertsForProduct } from "./alert.service.js";

export async function refreshCompetitorPrices(product) {
  const prices = generateCompetitorPrices(product);
  const savedPrices = await replaceCompetitorPrices(product.id, prices);
  const validation = validateProduct(product, savedPrices);

  await updateProduct(product.id, {
    validationStatus: validation.status,
    validationErrors: validation.messages
  });

  const updatedProduct = await findProductById(product.id);
  await syncAlertsForProduct(updatedProduct, savedPrices);
  return findProductById(product.id);
}
