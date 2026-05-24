import { createProduct, findProductById, findProducts, updateProduct, findProductBySku } from "../repositories/product.repository.js";
import { refreshCompetitorPrices } from "./competitor.service.js";
import { enhanceTitle } from "./title-ai.service.js";

export async function createValidatedProduct(jobId, productInput, options = {}) {
  const existingProduct = await findProductBySku(productInput.sku);
  
  const product = await createProduct({
    ...productInput,
    jobId,
    duplicateSku: Boolean(existingProduct),
    validationStatus: "valid",
    validationErrors: []
  });

  const pricedProduct = await refreshCompetitorPrices(product);

  if (options.enhanceTitle) {
    const aiResult = await enhanceTitle(pricedProduct);
    await updateProduct(pricedProduct.id, {
      enhancedTitle: aiResult.enhancedTitle,
      extractedAttributes: aiResult.extractedAttributes,
      suggestedKeywords: aiResult.suggestedKeywords,
      enhancementReason: aiResult.enhancementReason
    });
    return findProductById(pricedProduct.id);
  }

  return pricedProduct;
}

export function listProducts() {
  return findProducts();
}

export function getProduct(id) {
  return findProductById(id);
}

export async function enhanceProductTitle(id) {
  const product = await findProductById(id);
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const aiResult = await enhanceTitle(product);
  await updateProduct(id, {
    enhancedTitle: aiResult.enhancedTitle,
    extractedAttributes: aiResult.extractedAttributes,
    suggestedKeywords: aiResult.suggestedKeywords,
    enhancementReason: aiResult.enhancementReason
  });
  return findProductById(id);
}

export async function refreshProductPrices(id) {
  const product = await findProductById(id);
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return refreshCompetitorPrices(product);
}

export async function editProduct(id, input) {
  const product = await findProductById(id);
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const values = {
    title: input.title,
    description: input.description,
    category: input.category,
    price: Number(input.price),
    inventory: Number(input.inventory),
    imageUrl: input.imageUrl
  };

  await updateProduct(id, values);
  const updatedProduct = await findProductById(id);
  return refreshCompetitorPrices(updatedProduct);
}
